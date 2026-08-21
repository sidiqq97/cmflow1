import * as admin from 'firebase-admin';

/**
 * CMFlow — Firebase Admin SDK (Server-Side / Next.js Route Handlers)
 * Permet les opérations sécurisées sur Firestore et Auth côté serveur.
 */

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'cmflow-dc0d6';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  if (clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket: `${projectId}.appspot.com`,
    });
  } else {
    // Initialisation standard / Emulateur / Default credentials
    admin.initializeApp({
      projectId,
      storageBucket: `${projectId}.appspot.com`,
    });
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();
export default admin;
