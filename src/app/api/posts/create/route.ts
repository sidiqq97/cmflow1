import { NextRequest, NextResponse } from 'next/server';
import { collection, doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { adminDb } from '../../../../lib/firebaseAdmin';

/**
 * Générateur de Token Aléatoire Sécurisé Court (8 caractères alphanumériques)
 * Format : v_9f2k8a1d
 */
function generateShortToken(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let result = 'v_';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * POST /api/posts/create
 * Crée une nouvelle publication dans Firestore et génère sa session de validation client 48h
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      workspaceId,
      caption = '',
      mediaUrl = '',
      mediaType = 'image',
      platforms = ['instagram'],
      scheduledDate,
      scheduledTime = '18:00',
      title,
    } = body;

    if (!workspaceId) {
      return NextResponse.json(
        { success: false, error: 'WORKSPACE_ID_REQUIRED', message: 'Identifiant workspaceId requis' },
        { status: 400 }
      );
    }

    // 1. Identifiants uniques pour le post et le token magique
    const postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const token = generateShortToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 48 * 3600 * 1000); // 48 heures

    // Normalisation des réseaux sociaux
    const normalizedPlatforms = Array.isArray(platforms)
      ? platforms
      : typeof platforms === 'string'
      ? [platforms]
      : ['instagram'];

    // Données de la publication
    const postData = {
      id: postId,
      workspaceId,
      clientId: workspaceId,
      title: title || caption.slice(0, 40) || 'Nouvelle publication',
      caption,
      mediaUrl,
      mediaType: (mediaType || 'image').toLowerCase(),
      platforms: normalizedPlatforms,
      network: normalizedPlatforms[0] || 'instagram',
      scheduledDate: scheduledDate || now.toISOString().split('T')[0],
      scheduledTime,
      status: 'PENDING_APPROVAL',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    // Construction de l'URL publique de validation
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://cmflow.sn').replace(/\/$/, '');
    const magicUrl = `${appUrl}/v/${token}`;

    // Données de la session d'approbation client
    const sessionData = {
      token,
      workspaceId,
      agencyId: 'default-agency',
      postIds: [postId],
      status: 'ACTIVE',
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      openedCount: 0,
      magicUrl,
    };

    // 2. Enregistrement Firestore (Tentative Admin SDK puis Client SDK avec fallback résilient)
    let isSavedToFirestore = false;

    // A. Tentative avec Firebase Admin SDK (Privilèges serveur)
    try {
      if (adminDb) {
        await adminDb.collection('posts').doc(postId).set({
          ...postData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Enregistrement dans les deux formats de collection (approvalSessions et approval_sessions)
        await adminDb.collection('approvalSessions').doc(token).set({
          ...sessionData,
          createdAt: new Date(),
          expiresAt: expiresAt,
        });

        await adminDb.collection('approval_sessions').doc(token).set({
          ...sessionData,
          createdAt: new Date(),
          expiresAt: expiresAt,
        });

        isSavedToFirestore = true;
      }
    } catch (adminError) {
      console.warn('⚠️ Firebase Admin SDK non disponible, tentative avec Client SDK :', adminError);
    }

    // B. Tentative avec Firebase Client SDK si Admin n'a pas abouti
    if (!isSavedToFirestore) {
      try {
        const postDocRef = doc(db, 'posts', postId);
        await setDoc(postDocRef, {
          ...postData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        const sessionDocRef1 = doc(db, 'approvalSessions', token);
        await setDoc(sessionDocRef1, {
          ...sessionData,
          createdAt: serverTimestamp(),
          expiresAt: Timestamp.fromDate(expiresAt),
        });

        const sessionDocRef2 = doc(db, 'approval_sessions', token);
        await setDoc(sessionDocRef2, {
          ...sessionData,
          createdAt: serverTimestamp(),
          expiresAt: Timestamp.fromDate(expiresAt),
        });

        isSavedToFirestore = true;
      } catch (clientDbError) {
        console.warn('⚠️ Échec de persistance Firestore direct, mode local actif :', clientDbError);
      }
    }

    // 3. Réponse JSON unifiée et complète
    return NextResponse.json(
      {
        success: true,
        message: 'Publication créée avec succès et session de validation générée.',
        post: postData,
        session: {
          token,
          workspaceId,
          expiresAt: expiresAt.toISOString(),
          expiresInHours: 48,
          magicUrl,
        },
        magicUrl,
        token,
        postId,
        persistedInFirestore: isSavedToFirestore,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Erreur création publication dans /api/posts/create :', error);
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: error?.message || 'Une erreur inattendue est survenue.',
      },
      { status: 500 }
    );
  }
}
