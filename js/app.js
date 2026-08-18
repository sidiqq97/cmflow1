/**
 * CMFlow — App JS (Onboarding, Dashboard, Clients)
 * Architecture : localStorage store + auth guard + routing simple
 */

'use strict';

/* ==========================================================================
   STORE — GESTION DES DONNÉES (localStorage)
   ========================================================================== */
const CMFlowStore = {
  // ---- User ----
  getUser() {
    try { return JSON.parse(localStorage.getItem('cmflow_user')); } catch { return null; }
  },
  setUser(user) {
    localStorage.setItem('cmflow_user', JSON.stringify(user));
  },

  // ---- Workspace ----
  getWorkspace() {
    try { return JSON.parse(localStorage.getItem('cmflow_workspace')); } catch { return null; }
  },
  setWorkspace(ws) {
    localStorage.setItem('cmflow_workspace', JSON.stringify(ws));
  },

  // ---- Clients ----
  getClients() {
    try { return JSON.parse(localStorage.getItem('cmflow_clients')) || []; } catch { return []; }
  },
  setClients(clients) {
    localStorage.setItem('cmflow_clients', JSON.stringify(clients));
  },
  addClient(client) {
    const clients = this.getClients();
    clients.push(client);
    this.setClients(clients);
  },
  deleteClient(id) {
    const clients = this.getClients().filter(c => c.id !== id);
    this.setClients(clients);
  },

  // ---- UserPreferences ----
  getPrefs() {
    try { return JSON.parse(localStorage.getItem('cmflow_prefs')); } catch { return null; }
  },
  setPrefs(prefs) {
    localStorage.setItem('cmflow_prefs', JSON.stringify(prefs));
  },

  // ---- Clear all ----
  logout() {
    localStorage.removeItem('cmflow_user');
    localStorage.removeItem('cmflow_workspace');
    localStorage.removeItem('cmflow_clients');
    localStorage.removeItem('cmflow_prefs');
  },

  // ---- Helpers ----
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  },
  formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-SN', { day: 'numeric', month: 'short', year: 'numeric' });
  },
  getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
};

/* ==========================================================================
   AUTH GUARD — Protection des routes
   ========================================================================== */
function authGuard() {
  const user = CMFlowStore.getUser();
  if (!user) {
    window.location.href = 'index.html';
    return false;
  }

  // Vérifier si l'onboarding est terminé
  const prefs = CMFlowStore.getPrefs();
  const currentPage = window.location.pathname.split('/').pop();

  if (!prefs?.onboardingComplete && currentPage === 'dashboard.html') {
    window.location.href = 'onboarding.html';
    return false;
  }

  if (!prefs?.onboardingComplete && currentPage === 'clients.html') {
    window.location.href = 'onboarding.html';
    return false;
  }

  if (prefs?.onboardingComplete && currentPage === 'onboarding.html') {
    window.location.href = 'dashboard.html';
    return false;
  }

  return true;
}

/* ==========================================================================
   TOAST NOTIFICATION (partagé entre pages)
   ========================================================================== */
function showAppToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
  }

  const icons = { success: '✓', error: '✕', info: 'ℹ' };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, 3800);
}

/* ==========================================================================
   SIDEBAR — Logique commune (sidebar mobile toggle + dropdown utilisateur)
   ========================================================================== */
function initSidebar() {
  const sidebar = document.getElementById('app-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const hamburger = document.getElementById('app-hamburger');
  const userMenuBtn = document.getElementById('user-menu-btn');
  const userDropdown = document.getElementById('user-dropdown');
  const logoutBtn = document.getElementById('logout-btn');

  if (!sidebar) return;

  // Remplir les informations utilisateur dans la sidebar
  const user = CMFlowStore.getUser();
  if (user) {
    const initials = CMFlowStore.getInitials(`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || user.email);
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'Utilisateur';
    const ws = CMFlowStore.getWorkspace();

    document.querySelectorAll('[data-user-initials]').forEach(el => el.textContent = initials);
    document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = fullName);
    document.querySelectorAll('[data-workspace-name]').forEach(el => el.textContent = ws?.name || 'Mon espace');
  }

  // Mobile sidebar open/close
  const openSidebar = () => {
    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeSidebar = () => {
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (hamburger) hamburger.addEventListener('click', openSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  // Fermer avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) closeSidebar();
  });

  // Fermer en cliquant sur un nav item (mobile)
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth < 1024) closeSidebar();
    });
  });

  // User dropdown toggle
  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!userDropdown.contains(e.target) && e.target !== userMenuBtn) {
        userDropdown.classList.remove('open');
      }
    });
  }

  // Déconnexion
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      CMFlowStore.logout();
      window.location.href = 'index.html';
    });
  }

  // "Bientôt disponible" pour les items désactivés
  document.querySelectorAll('[data-coming-soon]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      showAppToast('Cette fonctionnalité sera bientôt disponible.', 'info');
    });
  });
}

/* ==========================================================================
   MODAL AJOUTER UN CLIENT
   ========================================================================== */
function initAddClientModal() {
  const modalBackdrop = document.getElementById('add-client-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const form = document.getElementById('form-add-client');
  const openBtns = document.querySelectorAll('[data-open-add-client]');

  if (!modalBackdrop) return;

  const open = () => {
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Focus sur le premier champ
    setTimeout(() => {
      const firstInput = form?.querySelector('input');
      if (firstInput) firstInput.focus();
    }, 200);
  };

  const close = () => {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    if (form) form.reset();
  };

  openBtns.forEach(btn => btn.addEventListener('click', open));
  if (modalClose) modalClose.addEventListener('click', close);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) close();
  });

  // Soumission du formulaire
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('client-name');
      const industryInput = document.getElementById('client-industry');
      const descInput = document.getElementById('client-description');

      const name = nameInput?.value.trim();
      if (!name) {
        if (nameInput) {
          nameInput.style.borderColor = 'var(--color-danger)';
          nameInput.focus();
        }
        return;
      }

      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Création...';
      }

      setTimeout(() => {
        const user = CMFlowStore.getUser();
        const ws = CMFlowStore.getWorkspace();

        const newClient = {
          id: CMFlowStore.generateId(),
          workspaceId: ws?.id || 'ws1',
          name,
          industry: industryInput?.value || 'Autre',
          description: descInput?.value.trim() || '',
          createdAt: new Date().toISOString(),
        };

        CMFlowStore.addClient(newClient);

        close();
        showAppToast(`Client "${name}" ajouté avec succès 🎉`, 'success');

        // Rafraîchir la page courante
        setTimeout(() => {
          if (typeof renderDashboard === 'function') renderDashboard();
          if (typeof renderClients === 'function') renderClients();
        }, 100);

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Créer le client';
        }
      }, 600);
    });

    // Reset border error on focus
    const nameInput = document.getElementById('client-name');
    if (nameInput) {
      nameInput.addEventListener('focus', () => {
        nameInput.style.borderColor = '';
      });
    }
  }
}

/* ==========================================================================
   ONBOARDING — Logique des étapes
   ========================================================================== */
function initOnboarding() {
  if (!document.getElementById('onboarding-step-1')) return;

  const steps = [
    document.getElementById('onboarding-step-1'),
    document.getElementById('onboarding-step-2'),
    document.getElementById('onboarding-step-3'),
  ];
  const welcomeScreen = document.getElementById('welcome-screen');
  const progressFill = document.getElementById('progress-fill');
  const stepCurrentEl = document.getElementById('step-current');
  const stepLabelEl = document.getElementById('onboarding-step-label');
  const onboardingCard = document.getElementById('onboarding-card');

  // Pré-remplir avec les données utilisateur
  const user = CMFlowStore.getUser();
  if (user) {
    const firstName = user.firstName || (user.name ? user.name.split(' ')[0] : '');
    const lastName = user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : '');
    const firstNameInput = document.getElementById('onb-firstname');
    const lastNameInput = document.getElementById('onb-lastname');
    const activityInput = document.getElementById('onb-activity');

    if (firstNameInput && firstName) firstNameInput.value = firstName;
    if (lastNameInput && lastName) lastNameInput.value = lastName;
    if (activityInput && user.activityName) activityInput.value = user.activityName;
  }

  let currentStep = 0;
  const totalSteps = 3;

  const stepData = {
    selectedNetworks: [],
    selectedGoals: [],
    clientCount: null,
  };

  // ---- Mise à jour de la barre de progression ----
  function updateProgress(step) {
    const pct = ((step + 1) / totalSteps) * 100;
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (stepCurrentEl) stepCurrentEl.textContent = step + 1;
    if (stepLabelEl) stepLabelEl.textContent = `Étape ${step + 1} sur ${totalSteps}`;
  }

  // ---- Affichage d'une étape ----
  function goToStep(index) {
    steps.forEach((s, i) => {
      s?.classList.toggle('active', i === index);
    });
    currentStep = index;
    updateProgress(index);
  }

  // ---- Étape 1 — Nombre de clients (sélection radio) ----
  document.querySelectorAll('.count-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.count-option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      stepData.clientCount = option.dataset.value;
    });
  });

  // ---- Bouton Continuer Étape 1 ----
  const step1NextBtn = document.getElementById('step1-next');
  if (step1NextBtn) {
    step1NextBtn.addEventListener('click', () => {
      const firstName = document.getElementById('onb-firstname')?.value.trim();
      const lastName = document.getElementById('onb-lastname')?.value.trim();
      const activity = document.getElementById('onb-activity')?.value.trim();

      if (!firstName) {
        const el = document.getElementById('onb-firstname');
        if (el) { el.style.borderColor = 'var(--color-danger)'; el.focus(); }
        showAppToast('Veuillez entrer votre prénom.', 'error');
        return;
      }

      // Sauvegarder les données dans le user
      const user = CMFlowStore.getUser();
      if (user) {
        user.firstName = firstName;
        user.lastName = lastName;
        user.activityName = activity;
        CMFlowStore.setUser(user);

        // Créer le workspace
        const ws = CMFlowStore.getWorkspace() || {
          id: CMFlowStore.generateId(),
          ownerId: user.id,
          name: activity || `Espace de ${firstName}`,
          createdAt: new Date().toISOString(),
        };
        if (activity) ws.name = activity;
        CMFlowStore.setWorkspace(ws);
      }

      goToStep(1);
    });
  }

  // Reset border on focus (step 1)
  ['onb-firstname', 'onb-lastname', 'onb-activity'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('focus', () => { el.style.borderColor = ''; });
  });

  // ---- Étape 2 — Réseaux sociaux ----
  document.querySelectorAll('.network-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      const network = card.dataset.network;
      if (card.classList.contains('selected')) {
        if (!stepData.selectedNetworks.includes(network)) stepData.selectedNetworks.push(network);
      } else {
        stepData.selectedNetworks = stepData.selectedNetworks.filter(n => n !== network);
      }
    });
  });

  const step2BackBtn = document.getElementById('step2-back');
  const step2NextBtn = document.getElementById('step2-next');
  if (step2BackBtn) step2BackBtn.addEventListener('click', () => goToStep(0));
  if (step2NextBtn) step2NextBtn.addEventListener('click', () => goToStep(2));

  // ---- Étape 3 — Objectifs ----
  document.querySelectorAll('.goal-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      const goal = card.dataset.goal;
      if (card.classList.contains('selected')) {
        if (!stepData.selectedGoals.includes(goal)) stepData.selectedGoals.push(goal);
      } else {
        stepData.selectedGoals = stepData.selectedGoals.filter(g => g !== goal);
      }
    });
  });

  const step3BackBtn = document.getElementById('step3-back');
  const step3FinishBtn = document.getElementById('step3-finish');

  if (step3BackBtn) step3BackBtn.addEventListener('click', () => goToStep(1));

  if (step3FinishBtn) {
    step3FinishBtn.addEventListener('click', () => {
      step3FinishBtn.disabled = true;
      step3FinishBtn.textContent = 'Finalisation...';

      setTimeout(() => {
        // Sauvegarder les préférences
        const user = CMFlowStore.getUser();
        const prefs = {
          userId: user?.id || 'u1',
          selectedPlatforms: stepData.selectedNetworks,
          numberOfClients: stepData.clientCount || '1 à 3',
          goals: stepData.selectedGoals,
          onboardingComplete: true,
        };
        CMFlowStore.setPrefs(prefs);

        // S'assurer que le workspace existe
        if (!CMFlowStore.getWorkspace()) {
          const ws = {
            id: CMFlowStore.generateId(),
            ownerId: user?.id || 'u1',
            name: user?.activityName || `Espace de ${user?.firstName || 'CM'}`,
            createdAt: new Date().toISOString(),
          };
          CMFlowStore.setWorkspace(ws);
        }

        // Afficher l'écran de bienvenue
        steps.forEach(s => s?.classList.remove('active'));
        if (onboardingCard) onboardingCard.style.padding = '0';
        if (welcomeScreen) welcomeScreen.classList.add('active');

        // Mettre à jour le texte de bienvenue
        const firstName = user?.firstName || user?.name?.split(' ')[0] || 'Ami';
        const welcomeName = document.getElementById('welcome-firstname');
        if (welcomeName) welcomeName.textContent = firstName;

        // Masquer la barre de progression
        const progressWrap = document.getElementById('progress-wrap');
        if (progressWrap) progressWrap.style.display = 'none';
      }, 800);
    });
  }

  // ---- Boutons de la page de bienvenue ----
  const btnAddFirst = document.getElementById('btn-add-first-client');
  const btnGoDashboard = document.getElementById('btn-go-dashboard');

  if (btnAddFirst) {
    btnAddFirst.addEventListener('click', () => {
      window.location.href = 'dashboard.html?action=add-client';
    });
  }

  if (btnGoDashboard) {
    btnGoDashboard.addEventListener('click', () => {
      window.location.href = 'dashboard.html';
    });
  }

  // Init
  goToStep(0);
}

/* ==========================================================================
   DASHBOARD — Rendu principal
   ========================================================================== */
function renderDashboard() {
  const user = CMFlowStore.getUser();
  const clients = CMFlowStore.getClients();

  // Greeting
  const greetingName = document.getElementById('greeting-name');
  if (greetingName && user) {
    greetingName.textContent = user.firstName || user.name?.split(' ')[0] || 'Ami';
  }

  // KPIs
  updateStat('stat-clients', clients.length);
  updateStat('stat-accounts', 0);
  updateStat('stat-posts', 0);
  updateStat('stat-engagement', 0);

  // Afficher empty state ou la liste des clients
  const emptyState = document.getElementById('dashboard-empty');
  const clientsSection = document.getElementById('dashboard-clients');

  if (clients.length === 0) {
    if (emptyState) emptyState.style.display = 'flex';
    if (clientsSection) clientsSection.style.display = 'none';
  } else {
    if (emptyState) emptyState.style.display = 'none';
    if (clientsSection) clientsSection.style.display = 'block';
    renderRecentClients(clients.slice(-4).reverse()); // 4 derniers
  }
}

function updateStat(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderRecentClients(clients) {
  const grid = document.getElementById('recent-clients-grid');
  if (!grid) return;

  grid.innerHTML = '';
  clients.forEach(client => {
    grid.insertAdjacentHTML('beforeend', buildClientCard(client));
  });
}

/* ==========================================================================
   CLIENTS PAGE — Rendu
   ========================================================================== */
function renderClients() {
  const clients = CMFlowStore.getClients();
  const grid = document.getElementById('all-clients-grid');
  const emptyState = document.getElementById('clients-empty');
  const countEl = document.getElementById('clients-count');

  if (countEl) countEl.textContent = clients.length;

  if (!grid) return;

  grid.innerHTML = '';

  if (clients.length === 0) {
    if (emptyState) emptyState.style.display = 'flex';
    grid.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  grid.style.display = 'grid';

  clients.slice().reverse().forEach(client => {
    grid.insertAdjacentHTML('beforeend', buildClientCard(client));
  });
}

// ---- Recherche clients ----
function initClientsSearch() {
  const searchInput = document.getElementById('clients-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    const allCards = document.querySelectorAll('.client-card-item');
    allCards.forEach(card => {
      const name = card.dataset.clientName?.toLowerCase() || '';
      const industry = card.dataset.clientIndustry?.toLowerCase() || '';
      const visible = name.includes(query) || industry.includes(query);
      card.style.display = visible ? '' : 'none';
    });
  });
}

/* ==========================================================================
   BUILD CLIENT CARD HTML
   ========================================================================== */
function buildClientCard(client) {
  const initials = CMFlowStore.getInitials(client.name);
  const date = CMFlowStore.formatDate(client.createdAt);
  const industry = client.industry || 'Autre';

  return `
    <div class="client-card client-card-item" data-client-name="${client.name.toLowerCase()}" data-client-industry="${industry.toLowerCase()}">
      <div class="client-card-head">
        <div class="client-avatar">${initials}</div>
        <div class="client-info">
          <h3 class="client-name">${escapeHtml(client.name)}</h3>
          <p class="client-industry">${escapeHtml(industry)}</p>
          <p class="client-date">Ajouté le ${date}</p>
        </div>
      </div>
      <div class="client-social-row">
        <span class="social-tag">Instagram</span>
        <span class="social-tag">Facebook</span>
      </div>
      <div class="client-status-badge">
        <span class="status-dot-inactive"></span>
        <span>Aucun compte connecté</span>
      </div>
      <div class="client-card-actions">
        <button type="button" class="btn-card-action primary" onclick="showComingSoon()">Gérer le client</button>
        <button type="button" class="btn-card-action" onclick="confirmDeleteClient('${client.id}')">
          <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
        </button>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str || ''));
  return div.innerHTML;
}

function showComingSoon() {
  showAppToast('Cette fonctionnalité sera bientôt disponible.', 'info');
}

function confirmDeleteClient(id) {
  if (!confirm('Supprimer ce client ?')) return;
  CMFlowStore.deleteClient(id);
  showAppToast('Client supprimé.', 'success');
  if (typeof renderDashboard === 'function') renderDashboard();
  if (typeof renderClients === 'function') renderClients();
}

/* ==========================================================================
   INITIALISATION GLOBALE
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  // Pages protégées
  const protectedPages = ['dashboard.html', 'clients.html', 'onboarding.html'];
  if (protectedPages.includes(page)) {
    if (!authGuard()) return;
  }

  // Init sidebar (dashboard + clients)
  initSidebar();

  // Init modal ajout client
  initAddClientModal();

  // Routing par page
  if (page === 'onboarding.html') {
    initOnboarding();
  }

  if (page === 'dashboard.html') {
    renderDashboard();

    // Si on arrive avec action=add-client (depuis la page de bienvenue)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'add-client') {
      setTimeout(() => {
        const addClientModal = document.getElementById('add-client-modal');
        if (addClientModal) addClientModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Nettoyer l'URL
        window.history.replaceState({}, '', 'dashboard.html');
      }, 400);
    }
  }

  if (page === 'clients.html') {
    renderClients();
    initClientsSearch();
  }
});
