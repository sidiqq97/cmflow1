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

  // ---- Posts (Planning & Publications) ----
  getPosts() {
    try {
      let posts = JSON.parse(localStorage.getItem('cmflow_posts'));
      if (!posts || posts.length === 0) {
        // Posts d'exemples initiaux pour une démonstration immédiate
        const today = new Date();
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = today.getDate();

        const formatDate = (dayOffset) => {
          const date = new Date(today);
          date.setDate(d + dayOffset);
          const dy = date.getFullYear();
          const dm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          return `${dy}-${dm}-${dd}`;
        };

        const clients = this.getClients();
        const client1 = clients[0] ? clients[0].name : 'Teranga Gourmet';
        const clientId1 = clients[0] ? clients[0].id : 'sample1';

        posts = [
          {
            id: 'p1',
            clientId: clientId1,
            clientName: client1,
            platforms: ['instagram', 'facebook'],
            scheduledDate: formatDate(1),
            scheduledTime: '14:30',
            caption: 'Nouveau menu de saison disponible dès ce week-end ! 🍽️✨ Venez déguster nos saveurs locales revisitées. Réservations par DM ou WhatsApp.\n\n#DakarFood #Teranga #Gastronomie #SenegalFood',
            imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
            status: 'scheduled', // draft, pending, scheduled, published
            createdAt: new Date().toISOString(),
          },
          {
            id: 'p2',
            clientId: clientId1,
            clientName: client1,
            platforms: ['instagram', 'tiktok'],
            scheduledDate: formatDate(3),
            scheduledTime: '18:00',
            caption: 'Les coulisses de la préparation de nos plats signatures avec le Chef ! 👨‍🍳🔥 Restez connectés pour le drop de la semaine.\n\n#BehindTheScenes #ChefLife #DakarVibes',
            imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&auto=format&fit=crop&q=80',
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'p3',
            clientId: clientId1,
            clientName: client1,
            platforms: ['linkedin'],
            scheduledDate: formatDate(-2),
            scheduledTime: '09:00',
            caption: 'Fier d\'annoncer notre nouveau partenariat pour valoriser les produits du terroir sénégalais. 🇸🇳💼 Ensemble, développons l\'économie locale.\n\n#BusinessSenegal #Partenariat #Leadership',
            imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
            status: 'published',
            createdAt: new Date().toISOString(),
          }
        ];
        this.setPosts(posts);
      }
      return posts;
    } catch {
      return [];
    }
  },
  setPosts(posts) {
    localStorage.setItem('cmflow_posts', JSON.stringify(posts));
  },
  addPost(post) {
    const posts = this.getPosts();
    posts.push(post);
    this.setPosts(posts);
  },
  updatePost(id, updatedData) {
    const posts = this.getPosts().map(p => p.id === id ? { ...p, ...updatedData } : p);
    this.setPosts(posts);
  },
  deletePost(id) {
    const posts = this.getPosts().filter(p => p.id !== id);
    this.setPosts(posts);
  },
  getPostById(id) {
    return this.getPosts().find(p => p.id === id) || null;
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
    localStorage.removeItem('cmflow_posts');
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

  if (!prefs?.onboardingComplete && ['dashboard.html', 'clients.html', 'planning.html', 'analytics.html', 'settings.html'].includes(currentPage)) {
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
  const posts = CMFlowStore.getPosts();

  // Greeting
  const greetingName = document.getElementById('greeting-name');
  if (greetingName && user) {
    greetingName.textContent = user.firstName || user.name?.split(' ')[0] || 'Ami';
  }

  // KPIs
  updateStat('stat-clients', clients.length);
  updateStat('stat-accounts', clients.length * 2);
  updateStat('stat-posts', posts.length);
  updateStat('stat-engagement', posts.length > 0 ? '4.8' : '0');

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
        <span class="status-dot-inactive" style="background: #10B981;"></span>
        <span style="color: #059669; font-weight: 500;">Comptes prêts</span>
      </div>
      <div class="client-card-actions">
        <button type="button" class="btn-card-action primary" onclick="window.location.href='planning.html'">Planifier</button>
        <a href="validation.html?client=${client.id}" target="_blank" class="btn-card-action" style="text-decoration: none; display: inline-flex; align-items: center; gap: 4px;" title="Portail de validation client">
          <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"/></svg>
          <span>Lien Client</span>
        </a>
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
   PLANNING & CALENDRIER ÉDITORIAL — LOGIQUE
   ========================================================================== */
let planningState = {
  currentDate: new Date(),
  filterClient: 'all',
  filterPlatform: 'all',
  filterStatus: 'all',
  selectedPlatforms: ['instagram'],
  selectedImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
  editingPostId: null,
};

const MONTH_NAMES_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

function initPlanning() {
  const prevBtn = document.getElementById('prev-month-btn');
  const nextBtn = document.getElementById('next-month-btn');
  const todayBtn = document.getElementById('today-btn');
  const filterClient = document.getElementById('filter-client');
  const filterPlatform = document.getElementById('filter-platform');
  const filterStatus = document.getElementById('filter-status');
  const openPostModalBtns = document.querySelectorAll('[data-open-create-post]');

  // Remplir le filtre client
  if (filterClient) {
    const clients = CMFlowStore.getClients();
    filterClient.innerHTML = '<option value="all">Tous les clients</option>';
    clients.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      filterClient.appendChild(opt);
    });

    filterClient.addEventListener('change', (e) => {
      planningState.filterClient = e.target.value;
      renderPlanningCalendar();
    });
  }

  if (filterPlatform) {
    filterPlatform.addEventListener('change', (e) => {
      planningState.filterPlatform = e.target.value;
      renderPlanningCalendar();
    });
  }

  if (filterStatus) {
    filterStatus.addEventListener('change', (e) => {
      planningState.filterStatus = e.target.value;
      renderPlanningCalendar();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      planningState.currentDate.setMonth(planningState.currentDate.getMonth() - 1);
      renderPlanningCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      planningState.currentDate.setMonth(planningState.currentDate.getMonth() + 1);
      renderPlanningCalendar();
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      planningState.currentDate = new Date();
      renderPlanningCalendar();
    });
  }

  openPostModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      openPostModalForDate(todayStr);
    });
  });

  initPostModal();
  renderPlanningCalendar();
}

function renderPlanningCalendar() {
  const grid = document.getElementById('planning-calendar-grid');
  const monthTitle = document.getElementById('calendar-month-title');
  if (!grid) return;

  const currentYear = planningState.currentDate.getFullYear();
  const currentMonth = planningState.currentDate.getMonth();

  if (monthTitle) {
    monthTitle.textContent = `${MONTH_NAMES_FR[currentMonth]} ${currentYear}`;
  }

  grid.innerHTML = '';

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  // Lundi = 0, Dimanche = 6
  let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;

  const totalDays = lastDayOfMonth.getDate();
  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const allPosts = CMFlowStore.getPosts();

  // Filtrage des posts
  const filteredPosts = allPosts.filter(post => {
    if (planningState.filterClient !== 'all' && post.clientId !== planningState.filterClient) return false;
    if (planningState.filterPlatform !== 'all' && !post.platforms?.includes(planningState.filterPlatform)) return false;
    if (planningState.filterStatus !== 'all' && post.status !== planningState.filterStatus) return false;
    return true;
  });

  // Jours du mois précédent
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const prevMonthDate = new Date(currentYear, currentMonth - 1, dayNum);
    const dateStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    grid.appendChild(createDayCell(dayNum, dateStr, true, filteredPosts));
  }

  // Jours du mois en cours
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = dateStr === todayStr;
    grid.appendChild(createDayCell(d, dateStr, false, filteredPosts, isToday));
  }

  // Jours du mois suivant
  const totalRendered = startingDayOfWeek + totalDays;
  const remainingCells = (totalRendered > 35 ? 42 : 35) - totalRendered;

  for (let nextD = 1; nextD <= remainingCells; nextD++) {
    const nextMonthDate = new Date(currentYear, currentMonth + 1, nextD);
    const dateStr = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}-${String(nextD).padStart(2, '0')}`;
    grid.appendChild(createDayCell(nextD, dateStr, true, filteredPosts));
  }
}

function createDayCell(dayNumber, dateStr, isOtherMonth, posts, isToday = false) {
  const cell = document.createElement('div');
  cell.className = `calendar-day-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'is-today' : ''}`;
  cell.dataset.date = dateStr;

  const top = document.createElement('div');
  top.className = 'day-cell-top';

  const num = document.createElement('span');
  num.className = 'day-number';
  num.textContent = dayNumber;
  top.appendChild(num);

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'day-cell-add-btn';
  addBtn.title = 'Créer une publication ce jour';
  addBtn.innerHTML = '<svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>';
  addBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openPostModalForDate(dateStr);
  });
  top.appendChild(addBtn);

  cell.appendChild(top);

  const postsList = document.createElement('div');
  postsList.className = 'day-posts-list';

  const dayPosts = posts.filter(p => p.scheduledDate === dateStr);
  dayPosts.forEach(post => {
    postsList.appendChild(buildPostPill(post));
  });

  cell.appendChild(postsList);

  cell.addEventListener('click', () => {
    openPostModalForDate(dateStr);
  });

  return cell;
}

function buildPostPill(post) {
  const pill = document.createElement('div');
  const mainPlatform = post.platforms?.[0] || 'instagram';
  pill.className = `post-pill network-${mainPlatform}`;
  pill.title = `${post.clientName || 'Client'} (${post.scheduledTime || '12:00'}) — ${post.caption || ''}`;

  const time = document.createElement('span');
  time.className = 'post-pill-time';
  time.textContent = post.scheduledTime || '12:00';
  pill.appendChild(time);

  const title = document.createElement('span');
  title.className = 'post-pill-title';
  title.textContent = post.caption ? post.caption.slice(0, 32) : (post.clientName || 'Publication');
  pill.appendChild(title);

  const dot = document.createElement('span');
  dot.className = `post-pill-status-dot dot-${post.status || 'draft'}`;
  pill.appendChild(dot);

  pill.addEventListener('click', (e) => {
    e.stopPropagation();
    openPostModalForEdit(post.id);
  });

  return pill;
}

/* ==========================================================================
   MODAL DE PUBLICATION & LIVE FEED PREVIEW
   ========================================================================== */
function initPostModal() {
  const modalBackdrop = document.getElementById('post-modal-backdrop');
  const modalClose = document.getElementById('post-modal-close-btn');
  const modalCancel = document.getElementById('post-modal-cancel-btn');
  const form = document.getElementById('form-create-post');
  const deleteBtn = document.getElementById('post-delete-btn');

  const clientSelect = document.getElementById('post-client');
  const dateInput = document.getElementById('post-date');
  const timeInput = document.getElementById('post-time');
  const captionInput = document.getElementById('post-caption');
  const statusSelect = document.getElementById('post-status');
  const charCount = document.getElementById('caption-char-count');

  // Preview elements
  const mockupAvatar = document.getElementById('mockup-avatar');
  const mockupUsername = document.getElementById('mockup-username');
  const mockupImage = document.getElementById('mockup-image');
  const mockupCaption = document.getElementById('mockup-caption-text');
  const mockupTime = document.getElementById('mockup-time');

  if (!modalBackdrop) return;

  const close = () => {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    planningState.editingPostId = null;
    if (form) form.reset();
  };

  if (modalClose) modalClose.addEventListener('click', close);
  if (modalCancel) modalCancel.addEventListener('click', close);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) close();
  });

  // Mise à jour de la prévisualisation en direct
  function updateLivePreview() {
    // Client & Avatar
    const selectedClientId = clientSelect?.value;
    const clients = CMFlowStore.getClients();
    const client = clients.find(c => c.id === selectedClientId) || { name: 'Votre Client' };
    const handleName = client.name.toLowerCase().replace(/[^a-z0-9]/g, '_');

    if (mockupAvatar) mockupAvatar.textContent = CMFlowStore.getInitials(client.name);
    if (mockupUsername) mockupUsername.textContent = handleName;

    // Caption & Hashtags highlight
    const rawCaption = captionInput?.value || '';
    if (charCount) charCount.textContent = `${rawCaption.length} / 2 200`;

    if (mockupCaption) {
      if (!rawCaption.trim()) {
        mockupCaption.innerHTML = `<span class="caption-user">${escapeHtml(handleName)}</span> Votre texte et vos hashtags apparaîtront ici en direct...`;
      } else {
        // Mettre en gras les hashtags
        const formatted = escapeHtml(rawCaption).replace(/#([a-zA-Z0-9_À-ÿ]+)/g, '<span class="hashtag-hl">#$1</span>');
        mockupCaption.innerHTML = `<span class="caption-user">${escapeHtml(handleName)}</span> ${formatted.replace(/\n/g, '<br>')}`;
      }
    }

    // Image
    if (mockupImage) {
      mockupImage.src = planningState.selectedImageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80';
    }

    // Date & Time
    if (mockupTime) {
      const d = dateInput?.value || 'Aujourd\'hui';
      const t = timeInput?.value || '12:00';
      mockupTime.textContent = `Programmé pour le ${d} à ${t}`;
    }
  }

  // Écouteurs de frappe et changements
  if (captionInput) captionInput.addEventListener('input', updateLivePreview);
  if (clientSelect) clientSelect.addEventListener('change', updateLivePreview);
  if (dateInput) dateInput.addEventListener('change', updateLivePreview);
  if (timeInput) timeInput.addEventListener('change', updateLivePreview);

  // Hashtag chips clic
  document.querySelectorAll('.hashtag-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const tag = chip.dataset.tag || chip.textContent.trim();
      if (captionInput) {
        captionInput.value = (captionInput.value.trim() + ' ' + tag).trim() + ' ';
        captionInput.focus();
        updateLivePreview();
      }
    });
  });

  // Toggles Réseaux sociaux
  document.querySelectorAll('.network-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const network = btn.dataset.network;
      if (btn.classList.contains('active')) {
        if (!planningState.selectedPlatforms.includes(network)) planningState.selectedPlatforms.push(network);
      } else {
        planningState.selectedPlatforms = planningState.selectedPlatforms.filter(n => n !== network);
        if (planningState.selectedPlatforms.length === 0) {
          // Garder au moins 1 réseau
          btn.classList.add('active');
          planningState.selectedPlatforms.push(network);
        }
      }
    });
  });

  // Presets d'images
  document.querySelectorAll('.image-preset-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.image-preset-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      planningState.selectedImageUrl = item.dataset.img;
      updateLivePreview();
    });
  });

  // Upload image personnalisé
  const customFileInput = document.getElementById('post-image-file');
  if (customFileInput) {
    customFileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          planningState.selectedImageUrl = event.target.result;
          document.querySelectorAll('.image-preset-item').forEach(i => i.classList.remove('active'));
          updateLivePreview();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Soumission Formulaire Post
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const clientId = clientSelect?.value;
      const clients = CMFlowStore.getClients();
      const client = clients.find(c => c.id === clientId);

      const scheduledDate = dateInput?.value || new Date().toISOString().split('T')[0];
      const scheduledTime = timeInput?.value || '12:00';
      const caption = captionInput?.value.trim() || '';
      const status = statusSelect?.value || 'scheduled';

      if (!caption) {
        showAppToast('Veuillez saisir un texte pour votre publication.', 'error');
        if (captionInput) captionInput.focus();
        return;
      }

      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enregistrement...';
      }

      setTimeout(() => {
        if (planningState.editingPostId) {
          // Mise à jour
          CMFlowStore.updatePost(planningState.editingPostId, {
            clientId: clientId || 'sample',
            clientName: client?.name || 'Client',
            platforms: planningState.selectedPlatforms,
            scheduledDate,
            scheduledTime,
            caption,
            imageUrl: planningState.selectedImageUrl,
            status,
          });
          showAppToast('Publication mise à jour ! 🚀', 'success');
        } else {
          // Création
          const newPost = {
            id: CMFlowStore.generateId(),
            clientId: clientId || (clients[0]?.id || 'c1'),
            clientName: client?.name || (clients[0]?.name || 'Mon Client'),
            platforms: [...planningState.selectedPlatforms],
            scheduledDate,
            scheduledTime,
            caption,
            imageUrl: planningState.selectedImageUrl,
            status,
            createdAt: new Date().toISOString(),
          };
          CMFlowStore.addPost(newPost);
          showAppToast('Publication planifiée avec succès ! 📅✨', 'success');
        }

        close();
        renderPlanningCalendar();
        if (typeof renderDashboard === 'function') renderDashboard();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Enregistrer la publication';
        }
      }, 500);
    });
  }

  // Suppression d'un post
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      if (!planningState.editingPostId) return;
      if (!confirm('Voulez-vous supprimer cette publication ?')) return;
      CMFlowStore.deletePost(planningState.editingPostId);
      showAppToast('Publication supprimée.', 'success');
      close();
      renderPlanningCalendar();
      if (typeof renderDashboard === 'function') renderDashboard();
    });
  }
}

function openPostModalForDate(dateStr) {
  const modalBackdrop = document.getElementById('post-modal-backdrop');
  const form = document.getElementById('form-create-post');
  const titleEl = document.getElementById('post-modal-title');
  const deleteBtn = document.getElementById('post-delete-btn');
  const clientSelect = document.getElementById('post-client');
  const dateInput = document.getElementById('post-date');
  const timeInput = document.getElementById('post-time');
  const captionInput = document.getElementById('post-caption');
  const statusSelect = document.getElementById('post-status');

  if (!modalBackdrop) return;

  planningState.editingPostId = null;

  // Peupler la liste des clients
  if (clientSelect) {
    const clients = CMFlowStore.getClients();
    clientSelect.innerHTML = '';
    if (clients.length === 0) {
      clientSelect.innerHTML = '<option value="sample">Client Démo (ex: Teranga)</option>';
    } else {
      clients.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        clientSelect.appendChild(opt);
      });
    }
  }

  if (titleEl) titleEl.textContent = 'Nouvelle publication';
  if (deleteBtn) deleteBtn.style.display = 'none';

  if (dateInput) dateInput.value = dateStr;
  if (timeInput) timeInput.value = '14:00';
  if (captionInput) captionInput.value = '';
  if (statusSelect) statusSelect.value = 'scheduled';

  modalBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Trigger input for preview update
  if (captionInput) captionInput.dispatchEvent(new Event('input'));
}

function openPostModalForEdit(postId) {
  const post = CMFlowStore.getPostById(postId);
  if (!post) return;

  const modalBackdrop = document.getElementById('post-modal-backdrop');
  const titleEl = document.getElementById('post-modal-title');
  const deleteBtn = document.getElementById('post-delete-btn');
  const clientSelect = document.getElementById('post-client');
  const dateInput = document.getElementById('post-date');
  const timeInput = document.getElementById('post-time');
  const captionInput = document.getElementById('post-caption');
  const statusSelect = document.getElementById('post-status');

  if (!modalBackdrop) return;

  planningState.editingPostId = postId;

  if (clientSelect) {
    const clients = CMFlowStore.getClients();
    clientSelect.innerHTML = '';
    clients.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      if (c.id === post.clientId) opt.selected = true;
      clientSelect.appendChild(opt);
    });
  }

  if (titleEl) titleEl.textContent = 'Modifier la publication';
  if (deleteBtn) deleteBtn.style.display = 'inline-flex';

  if (dateInput) dateInput.value = post.scheduledDate || '';
  if (timeInput) timeInput.value = post.scheduledTime || '12:00';
  if (captionInput) captionInput.value = post.caption || '';
  if (statusSelect) statusSelect.value = post.status || 'scheduled';

  if (post.imageUrl) {
    planningState.selectedImageUrl = post.imageUrl;
  }

  if (post.platforms && post.platforms.length > 0) {
    planningState.selectedPlatforms = [...post.platforms];
    document.querySelectorAll('.network-toggle-btn').forEach(btn => {
      btn.classList.toggle('active', planningState.selectedPlatforms.includes(btn.dataset.network));
    });
  }

  modalBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (captionInput) captionInput.dispatchEvent(new Event('input'));
}

/* ==========================================================================
   INITIALISATION GLOBALE
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  // Pages protégées
  const protectedPages = ['dashboard.html', 'clients.html', 'onboarding.html', 'planning.html', 'analytics.html', 'settings.html'];
  if (protectedPages.includes(page)) {
    if (!authGuard()) return;
  }

  // Init sidebar
  initSidebar();

  // Init modal ajout client (dashboard & clients)
  initAddClientModal();

  // Routing par page
  if (page === 'onboarding.html') {
    initOnboarding();
  }

  if (page === 'dashboard.html') {
    renderDashboard();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'add-client') {
      setTimeout(() => {
        const addClientModal = document.getElementById('add-client-modal');
        if (addClientModal) addClientModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        window.history.replaceState({}, '', 'dashboard.html');
      }, 400);
    }
  }

  if (page === 'clients.html') {
    renderClients();
    initClientsSearch();
  }

  if (page === 'planning.html') {
    initPlanning();
  }
});

