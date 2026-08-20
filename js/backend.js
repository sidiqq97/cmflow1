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

    // Validation de sécurité préliminaire
    if (typeof CMFlowSecurity !== 'undefined') {
      if (!CMFlowSecurity.isValidEmail(email)) {
        return { success: false, error: 'Adresse email invalide ou domaine non reconnu.' };
      }
      const passCheck = CMFlowSecurity.checkPasswordStrength(password);
      if (!passCheck.valid) {
        return { success: false, error: passCheck.message };
      }
    }

    try {
      const credential = await cmfireAuth.createUserWithEmailAndPassword(email, password);
      const fbUser = credential.user;

      // Mettre à jour le displayName Firebase Auth
      if (displayName && fbUser) {
        await fbUser.updateProfile({ displayName: displayName });
      }

      // Envoyer un email de vérification / confirmation
      try {
        if (fbUser && typeof fbUser.sendEmailVerification === 'function') {
          await fbUser.sendEmailVerification();
          console.log('📧 Email de vérification envoyé à:', email);
        }
      } catch (emailErr) {
        console.warn('⚠️ Erreur lors de l\'envoi de l\'email de vérification:', emailErr);
      }

      // Créer immédiatement le document utilisateur dans Firestore
      if (cmfireDb && fbUser) {
        const userRef = cmfireDb.collection('users').doc(fbUser.uid);
        const nameParts = (displayName || '').split(' ');
        const firstName = nameParts[0] || 'Ami';
        const lastName = nameParts.slice(1).join(' ') || '';

        await userRef.collection('data').doc('profile').set({
          id: fbUser.uid,
          name: displayName || email.split('@')[0],
          firstName: firstName,
          lastName: lastName,
          email: email,
          activityName: 'Mon Agence',
          plan: 'trial',
          emailVerified: false,
          createdAt: new Date().toISOString()
        }, { merge: true });

        await userRef.collection('data').doc('workspace').set({
          id: 'ws_' + Date.now().toString(36),
          ownerId: fbUser.uid,
          name: 'Mon Agence',
          createdAt: new Date().toISOString()
        }, { merge: true });

        console.log('✅ Profil Firestore initialisé avec succès pour:', email);
      }

      console.log('✅ Compte Firebase créé pour:', email);
      return { success: true, user: fbUser };
    } catch (err) {
      console.error('❌ Erreur inscription Firebase:', err);
      let errorMsg = err.message || 'Erreur lors de la création du compte.';
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMsg = 'Cet email est déjà utilisé. Connectez-vous avec cet email ou utilisez-en un autre.';
          break;
        case 'auth/weak-password':
          errorMsg = 'Le mot de passe doit contenir au moins 6 caractères.';
          break;
        case 'auth/invalid-email':
          errorMsg = 'Adresse email invalide.';
          break;
        case 'auth/operation-not-allowed':
          errorMsg = 'Le fournisseur Email/Mot de passe n\'est pas encore activé dans votre console Firebase.';
          break;
        case 'auth/unauthorized-domain':
          errorMsg = 'Domaine non autorisé. Ajoutez ce domaine dans Authentication > Paramètres > Domaines autorisés.';
          break;
        default:
          errorMsg = `[${err.code || 'Erreur'}] ${err.message}`;
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
          errorMsg = 'Aucun compte n\'existe avec cette adresse email. Veuillez vous inscrire.';
          break;
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
          errorMsg = 'Adresse email introuvable ou mot de passe incorrect.';
          break;
        case 'auth/invalid-email':
          errorMsg = 'Format d\'adresse email invalide.';
          break;
        case 'auth/too-many-requests':
          errorMsg = 'Trop de tentatives infructueuses. Veuillez patienter quelques instants.';
          break;
        default:
          errorMsg = err.message || 'Erreur lors de la connexion.';
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

  // Demander une retouche côté client avec commentaire désinfecté
  requestRevision(postId, feedbackText) {
    const cleanFeedback = typeof CMFlowSecurity !== 'undefined' 
      ? CMFlowSecurity.sanitizeInput(feedbackText) 
      : feedbackText.trim();

    CMFlowStore.updatePost(postId, {
      status: 'pending',
      clientApproved: false,
      clientFeedback: cleanFeedback,
      clientFeedbackAt: new Date().toISOString()
    });

    this.notifyPostUpdate(postId, 'pending', cleanFeedback);
    return true;
  },

  // Obtenir le lien de partage client sécurisé avec token de validation
  generateClientPortalUrl(clientId) {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const basePath = pathname.substring(0, pathname.lastIndexOf('/'));
    const token = typeof CMFlowSecurity !== 'undefined' 
      ? CMFlowSecurity.generateClientToken(clientId) 
      : '';
    const tokenParam = token ? `&token=${encodeURIComponent(token)}` : '';
    return `${origin}${basePath}/validation.html?client=${encodeURIComponent(clientId)}${tokenParam}`;
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
