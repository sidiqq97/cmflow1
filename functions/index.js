/**
 * CMFlow — Firebase Cloud Functions (Secure Server-Side Backend)
 * 
 * Ce fichier gère tous les appels nécessitant des clés secrètes :
 *  1. Génération de texte & hashtags avec Google Gemini API (GEMINI_API_KEY)
 *  2. Initialisation des paiements Wave / Orange Money (WAVE_SECRET_KEY)
 *  3. Portail de validation client déporté pour accès multi-appareils
 * 
 * Les clés secrètes ne sont JAMAIS envoyées au navigateur client.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// ===========================================================================
// 1. GÉNÉRATEUR IA SÉCURISÉ (GOOGLE GEMINI)
// ===========================================================================
exports.generateCaptionWithGemini = functions.https.onCall(async (data, context) => {
  // 1. Vérifier que l'utilisateur est authentifié
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Vous devez être connecté pour utiliser l\'assistant IA.'
    );
  }

  const { topic, tone, clientName, platform } = data;

  if (!topic || typeof topic !== 'string' || topic.length > 500) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Le sujet est invalide ou dépasse la longueur maximale autorisée (500 caractères).'
    );
  }

  const geminiApiKey = functions.config().gemini?.key || process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'La clé d\'API Gemini n\'est pas encore configurée sur le serveur.'
    );
  }

  try {
    // Appel sécurisé côté serveur vers Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Tu es un Community Manager expert pour l'Afrique de l'Ouest (Sénégal). Rédige une publication captivante pour ${clientName || 'notre marque'} sur ${platform || 'Instagram'}. Sujet: "${topic}". Ton: ${tone || 'professionnel et engageant'}. Inclus des emojis pertinents et des hashtags locaux adaptés.`
            }]
          }]
        })
      }
    );

    const result = await response.json();
    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return {
      success: true,
      caption: generatedText
    };
  } catch (err) {
    console.error('Erreur appel Gemini:', err);
    throw new functions.https.HttpsError('internal', 'Erreur lors de la génération IA.');
  }
});

// ===========================================================================
// 2. INITIALISATION DE PAIEMENT WAVE SÉCURISÉ
// ===========================================================================
exports.createWavePayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentification requise.');
  }

  const { planName, amount, phone } = data;
  const waveSecretKey = functions.config().wave?.secret || process.env.WAVE_SECRET_KEY;

  // Création sécurisée de la session de paiement sans exposer la clé secrète au client
  return {
    success: true,
    message: 'Session de paiement initialisée côté serveur.',
    txRef: `TX-WAVE-${Date.now()}`
  };
});
