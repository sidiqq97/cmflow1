/**
 * CMFlow — Backend & Cloud Sync Engine (Firebase Firestore + Auth + Local Fallback)
 * Gère :
 *   - L'authentification Firebase (inscription / connexion / réinitialisation)
 *   - La synchronisation Firestore en temps-réel
 *   - La migration automatique localStorage → Firestore
 *   - Le BroadcastChannel comme backup local inter-onglets
 */

'use strict';

const CMFlowBackend = {
  isInitialized: false,
  useFirebase: false,
  broadcastChannel: null,

  // ========================================================================
  // INITIALISATION
  // ========================================================================
  init() {
    // Initialiser le canal de synchronisation temps-réel inter-onglets (backup local)
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel('cmflow_realtime_sync');
        this.broadcastChannel.onmessage = (event) => {
          if (event.data?.type === 'POST_UPDATED') {
            window.dispatchEvent(new CustomEvent('cmflow:post_updated', { detail: event.data.payload }));
          }
          if (event.data?.type === 'DATA_SYNCED') {
            window.dispatchEvent(new CustomEvent('cmflow:data_synced', { detail: event.data.payload }));
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel non supporté:', e);
      }
    }

    // Si Firebase est prêt, configurer les listeners d'authentification
    if (cmfireReady && cmfireAuth) {
      this.useFirebase = true;
      this._setupAuthStateListener();
      console.log('✅ CMFlowBackend initialisé avec Firebase');
    } else {
      console.log('ℹ️ CMFlowBackend initialisé en mode localStorage (Firebase non configuré)');
    }

    this.isInitialized = true;
  },

  // ========================================================================
  // FIREBASE AUTH — Listener de changement d'état d'authentification
  // ========================================================================
  _setupAuthStateListener() {
    if (!cmfireAuth) return;

    cmfireAuth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('🔑 Utilisateur Firebase connecté:', user.email);
        
        // Migrer les données existantes localStorage → Firestore (si premier login)
        try {
          await CMFlowStore.migrateToFirestore();
        } catch (err) {
          console.warn('⚠️ Erreur lors de la migration:', err);
        }

        // Activer les listeners temps-réel Firestore
        CMFlowStore.initFirestoreListeners();
        
        // Notifier les pages que l'utilisateur est connecté via Firebase
        window.dispatchEvent(new CustomEvent('cmflow:firebase_auth', { 
          detail: { 
            uid: user.uid, 
            email: user.email,
            displayName: user.displayName 
          } 
        }));
      } else {
        console.log('🔒 Utilisateur Firebase déconnecté');
      }
    });
  },

  // ========================================================================
  // INSCRIPTION — Créer un compte Firebase Auth
  // ========================================================================
  async register(email, password, displayName) {
    if (!cmfireReady || !cmfireAuth) {
      return { success: false, error: 'Firebase non configuré. Mode localStorage actif.' };
    }

    try {
      const credential = await cmfireAuth.createUserWithEmailAndPassword(email, password);
      
      // Mettre à jour le displayName
      if (displayName && credential.user) {
        await credential.user.updateProfile({ displayName: displayName });
      }

      console.log('✅ Compte Firebase créé pour:', email);
      return { success: true, user: credential.user };
    } catch (err) {
      console.error('❌ Erreur inscription Firebase:', err);
      let errorMsg = 'Erreur lors de la création du compte.';
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMsg = 'Cet email est déjà utilisé. Connectez-vous ou utilisez un autre email.';
          break;
        case 'auth/weak-password':
          errorMsg = 'Le mot de passe doit contenir au moins 6 caractères.';
          break;
        case 'auth/invalid-email':
          errorMsg = 'Adresse email invalide.';
          break;
      }
      return { success: false, error: errorMsg };
    }
  },

  // ========================================================================
  // CONNEXION — Se connecter avec Firebase Auth
  // ========================================================================
  async login(email, password) {
    if (!cmfireReady || !cmfireAuth) {
      return { success: false, error: 'Firebase non configuré. Mode localStorage actif.' };
    }

    try {
      const credential = await cmfireAuth.signInWithEmailAndPassword(email, password);
      console.log('✅ Connexion Firebase réussie pour:', email);
      return { success: true, user: credential.user };
    } catch (err) {
      console.error('❌ Erreur connexion Firebase:', err);
      let errorMsg = 'Erreur lors de la connexion.';
      switch (err.code) {
        case 'auth/user-not-found':
          errorMsg = 'Aucun compte trouvé avec cet email.';
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMsg = 'Mot de passe incorrect.';
          break;
        case 'auth/invalid-email':
          errorMsg = 'Adresse email invalide.';
          break;
        case 'auth/too-many-requests':
          errorMsg = 'Trop de tentatives. Réessayez plus tard.';
          break;
      }
      return { success: false, error: errorMsg };
    }
  },

  // ========================================================================
  // RÉINITIALISATION MOT DE PASSE
  // ========================================================================
  async resetPassword(email) {
    if (!cmfireReady || !cmfireAuth) {
      return { success: false, error: 'Firebase non configuré.' };
    }

    try {
      await cmfireAuth.sendPasswordResetEmail(email);
      console.log('✅ Email de réinitialisation envoyé à:', email);
      return { success: true };
    } catch (err) {
      console.error('❌ Erreur réinitialisation:', err);
      let errorMsg = 'Erreur lors de l\'envoi du lien de réinitialisation.';
      if (err.code === 'auth/user-not-found') {
        errorMsg = 'Aucun compte trouvé avec cet email.';
      }
      return { success: false, error: errorMsg };
    }
  },

  // ========================================================================
  // NOTIFICATIONS TEMPS-RÉEL (BroadcastChannel + Firestore)
  // ========================================================================

  // Notifier d'un changement de statut en temps réel
  notifyPostUpdate(postId, status, feedback = '') {
    const payload = { postId, status, feedback, updatedAt: new Date().toISOString() };

    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'POST_UPDATED', payload });
    }

    // Émettre l'événement local
    window.dispatchEvent(new CustomEvent('cmflow:post_updated', { detail: payload }));
  },

  // Valider une publication côté client
  approvePost(postId) {
    CMFlowStore.updatePost(postId, {
      status: 'scheduled',
      clientApproved: true,
      clientApprovedAt: new Date().toISOString(),
      clientFeedback: ''
    });

    this.notifyPostUpdate(postId, 'scheduled');
    return true;
  },

  // Demander une retouche côté client avec commentaire
  requestRevision(postId, feedbackText) {
    CMFlowStore.updatePost(postId, {
      status: 'pending',
      clientApproved: false,
      clientFeedback: feedbackText,
      clientFeedbackAt: new Date().toISOString()
    });

    this.notifyPostUpdate(postId, 'pending', feedbackText);
    return true;
  },

  // Obtenir le lien de partage client
  generateClientPortalUrl(clientId) {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const basePath = pathname.substring(0, pathname.lastIndexOf('/'));
    return `${origin}${basePath}/validation.html?client=${encodeURIComponent(clientId)}`;
  },

  // ========================================================================
  // HELPERS
  // ========================================================================

  /** Vérifier si Firebase est actif et l'utilisateur connecté */
  isFirebaseActive() {
    return this.useFirebase && cmfireIsOnline();
  },

  /** Obtenir l'email de l'utilisateur Firebase connecté */
  getFirebaseEmail() {
    if (!cmfireAuth || !cmfireAuth.currentUser) return null;
    return cmfireAuth.currentUser.email;
  },

  /** Obtenir l'UID Firebase */
  getFirebaseUid() {
    return cmfireGetUid();
  }
};

// Initialisation automatique au chargement
document.addEventListener('DOMContentLoaded', () => {
  CMFlowBackend.init();
});
