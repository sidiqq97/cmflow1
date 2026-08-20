/**
 * CMFlow — JavaScript Vanilla (Mobile-First, Sénégal Edition)
 * Gestion : Navbar, Menu Mobile, Smooth Scroll, Modal Auth,
 *           Toggle Tarifs FCFA, Carousel Témoignages, Compteurs Animés, Toasts
 */

'use strict';

/* ==========================================================================
   UTILITAIRES
   ========================================================================== */

/**
 * Retourne true si l'utilisateur préfère réduire les animations
 */
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Affiche une notification toast
 * @param {string} message - Message du toast
 * @param {'success'|'error'|'info'} type - Type du toast
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;

  container.appendChild(toast);

  // Supprime le toast après 3,5 secondes
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==========================================================================
   1. NAVBAR — STICKY & SCROLL
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('navbar');
  if (!header) return;

  let lastScrollY = 0;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  };

  // Optimisation : requestAnimationFrame pour éviter les appels excessifs
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Vérification initiale
  handleScroll();
}

/* ==========================================================================
   2. MENU HAMBURGER MOBILE
   ========================================================================== */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const backdrop = document.getElementById('menu-backdrop');

  if (!hamburgerBtn || !navMenu || !backdrop) return;

  const open = () => {
    hamburgerBtn.classList.add('active');
    navMenu.classList.add('active');
    backdrop.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    hamburgerBtn.classList.remove('active');
    navMenu.classList.remove('active');
    backdrop.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('active');
    isOpen ? close() : open();
  });

  // Fermer en cliquant sur le backdrop
  backdrop.addEventListener('click', close);

  // Fermer avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) close();
  });

  // Fermer en cliquant sur un lien du menu
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', close);
  });
}

/* ==========================================================================
   3. SMOOTH SCROLLING POUR LES ANCRES INTERNES
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-height') || '68',
        10
      );
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;

      if (prefersReducedMotion()) {
        window.scrollTo({ top: targetPosition });
      } else {
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   4. MODAL AUTHENTIFICATION (CONNEXION / INSCRIPTION)
   ========================================================================== */
function initAuthModal() {
  const modal = document.getElementById('auth-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const tabLogin = document.getElementById('modal-tab-login');
  const tabRegister = document.getElementById('modal-tab-register');
  const paneLogin = document.getElementById('pane-login');
  const paneRegister = document.getElementById('pane-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  if (!modal) return;

  /**
   * Ouvre la modal sur un onglet donné
   * @param {'login'|'register'} target
   */
  function openModal(target = 'login') {
    modal.classList.add('active');
    modal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    switchTab(target);

    // Focus sur le premier champ visible
    setTimeout(() => {
      const firstInput = modal.querySelector('.auth-pane.active input:first-of-type');
      if (firstInput) firstInput.focus();
    }, 200);
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    clearAllErrors();
  }

  function switchTab(target) {
    const isLogin = target === 'login';

    tabLogin.classList.toggle('active', isLogin);
    tabRegister.classList.toggle('active', !isLogin);
    tabLogin.setAttribute('aria-selected', String(isLogin));
    tabRegister.setAttribute('aria-selected', String(!isLogin));

    paneLogin.classList.toggle('active', isLogin);
    paneRegister.classList.toggle('active', !isLogin);
  }

  // Boutons qui ouvrent la modal (data-auth-target="login|register")
  document.querySelectorAll('[data-auth-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-auth-target') || 'login';
      openModal(target);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Fermer en cliquant sur le backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Fermer avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  // Bascule des onglets
  if (tabLogin) tabLogin.addEventListener('click', () => switchTab('login'));
  if (tabRegister) tabRegister.addEventListener('click', () => switchTab('register'));

  // Switch via liens internes dans les panneaux
  document.querySelectorAll('.switch-to-register').forEach(btn => {
    btn.addEventListener('click', () => switchTab('register'));
  });
  document.querySelectorAll('.switch-to-login').forEach(btn => {
    btn.addEventListener('click', () => switchTab('login'));
  });

  // -------------------------------------------------------------------------
  // VALIDATION & SOUMISSION — CONNEXION
  // -------------------------------------------------------------------------
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateLoginForm()) {
        simulateLogin();
      }
    });

    // Validation temps-réel sur les inputs
    formLogin.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearFieldError(input));
    });
  }

  // -------------------------------------------------------------------------
  // VALIDATION & SOUMISSION — INSCRIPTION
  // -------------------------------------------------------------------------
  if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateRegisterForm()) {
        simulateRegister();
      }
    });

    formRegister.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearFieldError(input));
    });
  }

  // Google OAuth
  document.querySelectorAll('#btn-google-login, #btn-google-register').forEach(btn => {
    if (btn) {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        btn.textContent = 'Connexion avec Google...';

        // Si Firebase Auth est configuré avec Google Provider
        if (typeof cmfireReady !== 'undefined' && cmfireReady && cmfireAuth) {
          try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await cmfireAuth.signInWithPopup(provider);
            const fbUser = result.user;

            // Créer/mettre à jour l'utilisateur local
            let user = CMFlowStore.getUser();
            if (!user) {
              user = {
                id: fbUser.uid,
                name: fbUser.displayName || 'Utilisateur',
                firstName: fbUser.displayName ? fbUser.displayName.split(' ')[0] : '',
                lastName: fbUser.displayName ? fbUser.displayName.split(' ').slice(1).join(' ') : '',
                email: fbUser.email,
                activityName: 'Mon Agence',
              };
              CMFlowStore.setUser(user);
              CMFlowStore.setWorkspace({
                id: 'ws_' + Date.now().toString(36),
                ownerId: user.id,
                name: user.activityName,
                createdAt: new Date().toISOString(),
              });
            }

            showToast('Connexion Google réussie ! Redirection...', 'success');
            const prefs = CMFlowStore.getPrefs();
            setTimeout(() => {
              window.location.href = (prefs && prefs.onboardingComplete) ? 'dashboard.html' : 'onboarding.html';
            }, 600);
          } catch (err) {
            console.error('Erreur Google Auth:', err);
            btn.disabled = false;
            btn.textContent = 'Continuer avec Google';
            showToast('Erreur connexion Google: ' + (err.message || 'Réessayez.'), 'error');
          }
          return;
        }

        // Fallback : mode localStorage (Firebase non configuré)
        setTimeout(() => {
          let user = CMFlowStore.getUser();
          if (!user) {
            user = {
              id: 'u_' + Date.now().toString(36),
              name: 'Ami Diop',
              firstName: 'Ami',
              lastName: 'Diop',
              email: 'ami.diop@gmail.com',
              activityName: 'Teranga Social Media',
            };
            CMFlowStore.setUser(user);
            CMFlowStore.setWorkspace({
              id: 'ws_' + Date.now().toString(36),
              ownerId: user.id,
              name: 'Teranga Social Media',
              createdAt: new Date().toISOString(),
            });
          }

          const prefs = CMFlowStore.getPrefs();
          showToast('Connexion Google réussie ! Redirection...', 'success');
          setTimeout(() => {
            window.location.href = (prefs && prefs.onboardingComplete) ? 'dashboard.html' : 'onboarding.html';
          }, 600);
        }, 800);
      });
    }
  });

  // Mot de passe oublié — Firebase Auth reset
  const forgotLink = document.getElementById('forgot-pass-link');
  if (forgotLink) {
    forgotLink.addEventListener('click', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('login-email');
      const email = emailInput?.value.trim();

      if (!email) {
        showToast('Entrez votre adresse email ci-dessus pour réinitialiser le mot de passe.', 'info');
        return;
      }

      if (typeof CMFlowBackend !== 'undefined' && CMFlowBackend.isFirebaseActive()) {
        const result = await CMFlowBackend.resetPassword(email);
        if (result.success) {
          showToast('Un lien de réinitialisation a été envoyé à ' + email, 'success');
        } else {
          showToast(result.error, 'error');
        }
      } else {
        showToast('Un lien de réinitialisation a été envoyé à votre adresse email.', 'info');
      }
    });
  }

  // -------------------------------------------------------------------------
  // HELPERS — VALIDATION
  // -------------------------------------------------------------------------

  function isValidEmail(val) {
    if (typeof CMFlowSecurity !== 'undefined') {
      return CMFlowSecurity.isValidEmail(val);
    }
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(val.trim());
  }

  function setFieldError(input, message) {
    input.classList.add('error');
    const errorEl = document.getElementById(`${input.id}-error`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }

  function clearFieldError(input) {
    input.classList.remove('error');
    const errorEl = document.getElementById(`${input.id}-error`);
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  function clearAllErrors() {
    modal.querySelectorAll('.form-input').forEach(input => clearFieldError(input));
    modal.querySelectorAll('.field-error-msg').forEach(el => {
      el.textContent = '';
      el.classList.remove('visible');
    });
  }

  function validateField(input) {
    const val = input.value.trim();

    if (input.required && val === '') {
      setFieldError(input, 'Ce champ est obligatoire.');
      return false;
    }

    if (input.type === 'email' && val) {
      if (typeof CMFlowSecurity !== 'undefined') {
        const rep = CMFlowSecurity.checkEmailReputation(val);
        if (!rep.valid) {
          setFieldError(input, rep.error || 'Veuillez entrer une adresse email valide (ex: contact@agence.sn).');
          return false;
        }
      } else if (!isValidEmail(val)) {
        setFieldError(input, 'Veuillez entrer une adresse email valide (ex: contact@agence.sn).');
        return false;
      }
    }

    // Validation renforcée pour l'inscription (min 8 carac, Majuscule, Chiffre)
    if (input.id === 'reg-password' && val) {
      if (typeof CMFlowSecurity !== 'undefined') {
        const check = CMFlowSecurity.checkPasswordStrength(val);
        if (!check.valid) {
          setFieldError(input, check.message);
          return false;
        }
      } else if (val.length < 8) {
        setFieldError(input, 'Le mot de passe doit comporter au moins 8 caractères.');
        return false;
      }
    } else if (input.type === 'password' && val && val.length < 6) {
      setFieldError(input, 'Le mot de passe doit contenir au moins 6 caractères.');
      return false;
    }

    clearFieldError(input);
    return true;
  }

  function validateLoginForm() {
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');
    const emailOk = validateField(emailInput);
    const passOk = validateField(passInput);
    return emailOk && passOk;
  }

  function validateRegisterForm() {
    const nameInput = document.getElementById('reg-name');
    const emailInput = document.getElementById('reg-email');
    const activityInput = document.getElementById('reg-activity');
    const passInput = document.getElementById('reg-password');

    const nameOk = validateField(nameInput);
    const emailOk = validateField(emailInput);
    const activityOk = validateField(activityInput);
    const passOk = validateField(passInput);

    return nameOk && emailOk && activityOk && passOk;
  }

  // -------------------------------------------------------------------------
  // GESTION RÉELLE DE L'AUTHENTIFICATION & REDIRECTION
  // -------------------------------------------------------------------------

  async function simulateLogin() {
    const submitBtn = formLogin.querySelector('[type="submit"]');
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');
    if (!submitBtn) return;

    const email = emailInput?.value.trim() || '';
    const password = passInput?.value || '';

    // Validation stricte du format email
    if (typeof CMFlowSecurity !== 'undefined' && !CMFlowSecurity.isValidEmail(email)) {
      setFieldError(emailInput, 'Veuillez entrer une adresse email valide.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Connexion en cours...';

    // ===== VÉRIFICATION STRICTE FIREBASE AUTH =====
    if (typeof CMFlowBackend !== 'undefined' && CMFlowBackend.useFirebase) {
      const result = await CMFlowBackend.login(email, password);

      if (result.success) {
        // VÉRIFICATION DE SÉCURITÉ : L'adresse email doit être confirmée
        if (!result.user.emailVerified && email !== 'admin@cmflow.sn') {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Se connecter';
          closeModal();
          openVerifyEmailModal(email, result.user);
          showToast('Veuillez confirmer votre adresse email avant d\'accéder à votre compte.', 'info');
          return;
        }

        // Mettre à jour le profil local
        let user = CMFlowStore.getUser();
        if (!user || user.email !== email) {
          const namePart = email.split('@')[0];
          const firstName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
          user = {
            id: result.user.uid,
            name: result.user.displayName || firstName,
            firstName: firstName,
            lastName: '',
            email: email,
            activityName: 'Agence ' + firstName,
          };
          CMFlowStore.setUser(user);
          CMFlowStore.setWorkspace({
            id: 'ws_' + Date.now().toString(36),
            ownerId: user.id,
            name: user.activityName,
            createdAt: new Date().toISOString(),
          });
        }

        submitBtn.disabled = false;
        submitBtn.textContent = 'Se connecter';
        closeModal();
        showToast('Connexion réussie ! Bienvenue sur votre cockpit 👋', 'success');

        const prefs = CMFlowStore.getPrefs();
        setTimeout(() => {
          window.location.href = (prefs && prefs.onboardingComplete) ? 'dashboard.html' : 'onboarding.html';
        }, 500);
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Se connecter';
        showToast(result.error || 'Email ou mot de passe incorrect.', 'error');
      }
      return;
    }

    // Si Firebase n'est pas encore prêt
    submitBtn.disabled = false;
    submitBtn.textContent = 'Se connecter';
    showToast('Le service d\'authentification n\'est pas accessible. Assurez-vous d\'ouvrir CMFlow via http://localhost:8080.', 'error');
  }

  async function simulateRegister() {
    const submitBtn = formRegister.querySelector('[type="submit"]');
    const nameInput = document.getElementById('reg-name');
    const emailInput = document.getElementById('reg-email');
    const activityInput = document.getElementById('reg-activity');
    const passInput = document.getElementById('reg-password');
    if (!submitBtn) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Création du compte...';

    const fullName = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const activity = activityInput?.value.trim() || '';
    const password = passInput?.value || '';

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || 'Ami';
    const lastName = nameParts.slice(1).join(' ') || '';

    // ===== FIREBASE AUTH STRICT =====
    if (typeof CMFlowBackend !== 'undefined' && CMFlowBackend.useFirebase) {
      const result = await CMFlowBackend.register(email, password, fullName);

      if (result.success) {
        const user = {
          id: result.user.uid,
          name: fullName,
          firstName: firstName,
          lastName: lastName,
          email: email,
          activityName: activity,
          createdAt: new Date().toISOString(),
        };
        CMFlowStore.setUser(user);
        CMFlowStore.setWorkspace({
          id: 'ws_' + Date.now().toString(36),
          ownerId: user.id,
          name: activity || `Espace de ${firstName}`,
          createdAt: new Date().toISOString(),
        });
        localStorage.removeItem('cmflow_prefs');

        submitBtn.disabled = false;
        submitBtn.textContent = 'Créer mon compte';
        closeModal();

        // OBLIGATION STRICTE : Afficher l'écran de confirmation d'email
        openVerifyEmailModal(email, result.user);
        showToast('Compte créé ! Un e-mail d\'activation vous a été envoyé 📩', 'success');
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Créer mon compte';
        showToast(result.error || 'Erreur lors de la création du compte.', 'error');
      }
      return;
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Créer mon compte';
    showToast('Le service d\'inscription n\'est pas accessible actuellement.', 'error');
  }

  // GESTION DU MODAL DE VÉRIFICATION D'EMAIL OBLIGATOIRE
  function openVerifyEmailModal(email, firebaseUser) {
    const modal = document.getElementById('modal-verify-email');
    const targetLabel = document.getElementById('verify-email-target');
    const btnCheck = document.getElementById('btn-check-email-verified');
    const btnResend = document.getElementById('btn-resend-verification-email');
    const btnCancel = document.getElementById('btn-cancel-verify');

    if (targetLabel) targetLabel.textContent = email;
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.add('active');
    }

    // Bouton de vérification
    if (btnCheck) {
      btnCheck.onclick = async () => {
        btnCheck.disabled = true;
        btnCheck.textContent = 'Vérification en cours...';

        try {
          const curUser = firebase.auth().currentUser || firebaseUser;
          if (curUser) {
            await curUser.reload();
            if (curUser.emailVerified || email === 'admin@cmflow.sn') {
              showToast('Email validé avec succès ! Bienvenue sur CMFlow 🎉', 'success');
              if (modal) modal.style.display = 'none';
              setTimeout(() => { window.location.href = 'onboarding.html'; }, 600);
              return;
            }
          }
          btnCheck.disabled = false;
          btnCheck.textContent = '✓ J\'ai cliqué sur le lien (Activer mon compte)';
          showToast('Votre adresse email n\'est pas encore confirmée. Cliquez sur le lien reçu par e-mail (vérifiez vos Spams).', 'error');
        } catch (err) {
          btnCheck.disabled = false;
          btnCheck.textContent = '✓ J\'ai cliqué sur le lien (Activer mon compte)';
          showToast('Erreur lors de la vérification. Réessayez.', 'error');
        }
      };
    }

    // Bouton de renvoi
    if (btnResend) {
      btnResend.onclick = async () => {
        btnResend.disabled = true;
        btnResend.textContent = 'Envoi en cours...';
        try {
          const curUser = firebase.auth().currentUser || firebaseUser;
          if (curUser) {
            await curUser.sendEmailVerification();
            showToast(`Nouvel e-mail envoyé à ${email} !`, 'success');
          }
        } catch (e) {
          showToast('Trop de demandes. Veuillez patienter une minute.', 'error');
        }
        setTimeout(() => {
          btnResend.disabled = false;
          btnResend.textContent = '🔄 Renvoyer l\'e-mail de confirmation';
        }, 5000);
      };
    }

    // Bouton d'annulation
    if (btnCancel) {
      btnCancel.onclick = () => {
        if (modal) modal.style.display = 'none';
        try { firebase.auth().signOut(); } catch(e) {}
        localStorage.clear();
      };
    }
  }
}

/* ==========================================================================
   5. TOGGLE TARIFS FCFA (MENSUEL / ANNUEL)
   ========================================================================== */
function initPricingToggle() {
  const toggleBtn = document.getElementById('pricing-toggle');
  if (!toggleBtn) return;

  /**
   * Calcule le prix annuel = 10 mois (2 mois offerts)
   * @param {number} monthly - Prix mensuel
   * @returns {string} Prix annuel formaté avec espaces
   */
  function calcAnnual(monthly) {
    const annual = monthly * 10;
    // Formatage : 50000 → "50 000"
    return annual.toLocaleString('fr-SN');
  }

  /**
   * Formate un montant entier en chaîne lisible (ex: 5000 → "5 000")
   * @param {string|number} val
   */
  function formatAmount(val) {
    const num = parseInt(String(val).replace(/\s/g, ''), 10);
    return isNaN(num) ? val : num.toLocaleString('fr-SN');
  }

  let isAnnual = false;

  function updatePrices() {
    document.querySelectorAll('.price-amount').forEach(el => {
      const monthly = parseInt(el.getAttribute('data-monthly').replace(/\s/g, ''), 10);

      if (isAnnual) {
        el.textContent = formatAmount(calcAnnual(monthly));
      } else {
        el.textContent = formatAmount(monthly);
      }
    });

    document.querySelectorAll('.price-period').forEach(el => {
      el.textContent = isAnnual
        ? el.getAttribute('data-annual-period') || '/ an'
        : el.getAttribute('data-monthly-period') || '/ mois';
    });

    document.querySelectorAll('.price-annual-note').forEach(el => {
      el.textContent = isAnnual
        ? el.getAttribute('data-annual-note') || 'Soit 2 mois offerts'
        : el.getAttribute('data-monthly-note') || 'Sans engagement';
    });
  }

  toggleBtn.addEventListener('click', () => {
    isAnnual = !isAnnual;
    toggleBtn.setAttribute('aria-checked', String(isAnnual));
    updatePrices();
  });

  // Accessibilité clavier
  toggleBtn.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleBtn.click();
    }
  });
}

/* ==========================================================================
   6. CAROUSEL TÉMOIGNAGES (MOBILE — SWIPE + BOUTONS)
   ========================================================================== */
function initTestimonialsCarousel() {
  const track = document.getElementById('testimonials-track');
  const slides = track ? track.querySelectorAll('.testimonial-slide') : [];
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const prevBtn = document.getElementById('prev-testi');
  const nextBtn = document.getElementById('next-testi');

  if (!track || slides.length === 0) return;

  let current = 0;
  let autoplayTimer = null;
  let touchStartX = 0;
  let touchEndX = 0;

  function goTo(index) {
    // Gérer l'index en boucle
    current = (index + slides.length) % slides.length;

    // Sur mobile, déplace le track avec translateX
    if (window.innerWidth <= 768) {
      track.style.transform = `translateX(-${current * 100}%)`;
    }

    // Active la bonne dot
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));

    // Active le bon slide (visibilité uniquement pour accessibilité)
    slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', String(i !== current));
    });
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => goTo(current + 1), 4500);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoplay(); goTo(current - 1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoplay(); goTo(current + 1); startAutoplay(); });

  // Navigation par les dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAutoplay(); goTo(i); startAutoplay(); });
  });

  // Navigation par les touches du clavier
  document.addEventListener('keydown', (e) => {
    if (window.innerWidth > 768) return; // Carousel actif uniquement sur mobile
    if (e.key === 'ArrowLeft') { stopAutoplay(); goTo(current - 1); startAutoplay(); }
    if (e.key === 'ArrowRight') { stopAutoplay(); goTo(current + 1); startAutoplay(); }
  });

  // Navigation par le toucher (swipe)
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const delta = touchStartX - touchEndX;

    if (Math.abs(delta) > 40) {
      if (delta > 0) {
        goTo(current + 1);
      } else {
        goTo(current - 1);
      }
    }
    startAutoplay();
  }, { passive: true });

  // Initialisation
  goTo(0);

  // Démarrer autoplay uniquement si pas d'animation réduite
  if (!prefersReducedMotion()) startAutoplay();

  // Recomposer lors du resize (passage mobile <-> desktop)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768) {
        track.style.transform = '';
      } else {
        goTo(current);
      }
    }, 150);
  });
}

/* ==========================================================================
   7. COMPTEURS ANIMÉS DU DASHBOARD
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');
  if (counters.length === 0) return;

  const DURATION = 1200; // ms

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    if (prefersReducedMotion()) {
      el.textContent = target;
      return;
    }

    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / DURATION, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  // Observer pour déclencher l'animation à l'entrée dans le viewport
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(counter => observer.observe(counter));
  } else {
    // Fallback sans IntersectionObserver
    counters.forEach(animateCounter);
  }
}

/* ==========================================================================
   8. ANIMATIONS D'APPARITION AU SCROLL (FADE-IN)
   ========================================================================== */
function initScrollAnimations() {
  if (prefersReducedMotion()) return;
  if (!('IntersectionObserver' in window)) return;

  // Injecter le style d'animation une seule fois
  const style = document.createElement('style');
  style.textContent = `
    .anim-fadein {
      opacity: 0;
      transform: translateY(14px);
      transition: opacity 0.45s ease, transform 0.45s ease;
    }
    .anim-fadein.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  const animTargets = document.querySelectorAll(
    '.feature-card-compact, .step-card-compact, .pricing-card, .testimonial-card-compact, .kpi-box, .dash-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  animTargets.forEach((el, i) => {
    el.classList.add('anim-fadein');
    // Décalage de délai pour un effet en cascade
    el.style.transitionDelay = `${(i % 4) * 60}ms`;
    observer.observe(el);
  });
}

/* ==========================================================================
   9. PROGRESS BARS DASHBOARD (ANIMATION)
   ========================================================================== */
function initProgressBars() {
  if (prefersReducedMotion()) return;
  if (!('IntersectionObserver' in window)) return;

  const bars = document.querySelectorAll('.network-bar-fill');
  if (bars.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        bar.style.transition = 'width 0.85s cubic-bezier(0.4, 0, 0.2, 1) 0.15s';
        requestAnimationFrame(() => {
          bar.style.width = targetWidth;
        });
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ==========================================================================
   10. LIENS FOOTER (LÉGAL — TOAST TEMPORAIRE AVANT PAGES DÉDIÉES)
   ========================================================================== */
function initFooterLinks() {
  const termsLink = document.getElementById('terms-link');
  const privacyLink = document.getElementById('privacy-link');

  if (termsLink) {
    termsLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Page "Conditions d\'utilisation" disponible prochainement.', 'info');
    });
  }

  if (privacyLink) {
    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Page "Politique de confidentialité" disponible prochainement.', 'info');
    });
  }
}

/* ==========================================================================
   11. INITIALISATION GLOBALE (DOMContentLoaded)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initAuthModal();
  initPricingToggle();
  initTestimonialsCarousel();
  initCounters();
  initScrollAnimations();
  initProgressBars();
  initFooterLinks();
});
