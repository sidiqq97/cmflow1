/**
 * CMFlow — Backend & Cloud Sync Engine (Firebase / Firestore + Local Fallback)
 * Gère la synchronisation en ligne et le temps-réel entre le CM et ses clients.
 */

'use strict';

const CMFlowBackend = {
  isInitialized: false,
  useFirebase: false,
  broadcastChannel: null,

  // Initialisation du backend
  init(customConfig = null) {
    // Initialiser le canal de synchronisation temps-réel inter-onglets (pour tester localement)
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel('cmflow_realtime_sync');
        this.broadcastChannel.onmessage = (event) => {
          if (event.data?.type === 'POST_UPDATED') {
            window.dispatchEvent(new CustomEvent('cmflow:post_updated', { detail: event.data.payload }));
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel non supporté:', e);
      }
    }

    // Si une configuration Firebase est fournie et que le SDK est présent
    if (customConfig && typeof firebase !== 'undefined' && !firebase.apps?.length) {
      try {
        firebase.initializeApp(customConfig);
        this.useFirebase = true;
        this.isInitialized = true;
        console.log('✅ Firebase connecté avec succès à CMFlow');
      } catch (err) {
        console.warn('⚠️ Erreur initialisation Firebase, bascule sur le store local:', err);
      }
    }

    this.isInitialized = true;
  },

  // Notifier d'un changement de statut en temps réel
  notifyPostUpdate(postId, status, feedback = '') {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'POST_UPDATED',
        payload: { postId, status, feedback, updatedAt: new Date().toISOString() }
      });
    }

    // Émettre l'événement local
    window.dispatchEvent(new CustomEvent('cmflow:post_updated', {
      detail: { postId, status, feedback, updatedAt: new Date().toISOString() }
    }));
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
  }
};

// Initialisation automatique au chargement
document.addEventListener('DOMContentLoaded', () => {
  CMFlowBackend.init();
});
