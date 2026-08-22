'use client';

import React, { useState, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail, Lock, User, Building2, Phone, ArrowRight,
  Loader2, AlertCircle, Eye, EyeOff, Check, CheckCircle2,
  Sparkles, ShieldCheck, Gift, Clock, Star,
} from 'lucide-react';
import {
  PLANS_CONFIG, PLANS_MAP, PlanConfig, formatPrice,
} from '@/constants/plans';
import { WaveLogo } from '@/components/icons/WaveLogo';
import { OrangeMoneyLogo } from '@/components/icons/OrangeMoneyLogo';
import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword, updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// ================================================================
// Types
// ================================================================

type PageMode = 'trial' | 'purchase';
type PayMethod = 'WAVE' | 'ORANGE_MONEY';

// ================================================================
// Composant : Récapitulatif (colonne droite)
// ================================================================

function PlanSummaryCard({
  mode,
  plan,
  isYearly,
  onChangePlan,
  onToggleCycle,
}: {
  mode: PageMode;
  plan: PlanConfig;
  isYearly: boolean;
  onChangePlan: (id: string) => void;
  onToggleCycle: () => void;
}) {
  const price = isYearly ? plan.priceYearly : plan.priceMonthly;

  // ── MODE ESSAI GRATUIT ──────────────────────────────────────
  if (mode === 'trial') {
    return (
      <div className="bg-gradient-to-br from-[#0F172A] via-slate-900 to-[#0F172A] rounded-3xl p-7 h-full flex flex-col gap-6 relative overflow-hidden">
        {/* Halo décoratif */}
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#F94F06]/8 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#F94F06] to-orange-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-orange-500/30">
            CM
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            CM<span className="text-[#F94F06]">Flow</span>
          </span>
        </Link>

        {/* Badge essai */}
        <div className="flex items-center gap-3 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl px-4 py-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-black text-emerald-400 uppercase tracking-wider">Essai Gratuit</div>
            <div className="text-[11px] text-emerald-300/70 font-semibold">Sans carte bancaire requise</div>
          </div>
        </div>

        {/* Prix */}
        <div className="bg-white/8 border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total dû aujourd'hui</span>
            <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              GRATUIT
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">0</span>
            <span className="text-lg font-bold text-slate-400">FCFA</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Accès complet pendant <strong className="text-emerald-400">14 jours</strong> — sans engagement</span>
          </div>
        </div>

        {/* Ce qui est inclus */}
        <div className="space-y-2.5 flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Pendant votre essai :
          </p>
          {[
            '3 Workspaces clients (forfait Solo)',
            'Publications illimitées (Carrousels, Reels, Posts)',
            'Portail de validation WhatsApp interactif',
            'Publication automatique Instagram & Facebook',
            'Rapports PDF mensuels inclus',
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
              </div>
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* Après l'essai */}
        <div className="border-t border-white/10 pt-4 text-[11px] text-slate-500 space-y-1">
          <p className="font-semibold text-slate-400">À l'issue des 14 jours :</p>
          <p>Votre compte reste actif. Choisissez un forfait payant pour continuer, ou passez à vos collègues.</p>
        </div>
      </div>
    );
  }

  // ── MODE ACHAT DIRECT ───────────────────────────────────────
  return (
    <div className="bg-gradient-to-br from-[#0F172A] via-slate-900 to-[#0F172A] rounded-3xl p-7 h-full flex flex-col gap-6 relative overflow-hidden">
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#F94F06]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <Link href="/" className="inline-flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#F94F06] to-orange-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-orange-500/30">
          CM
        </div>
        <span className="text-lg font-black tracking-tight text-white">
          CM<span className="text-[#F94F06]">Flow</span>
        </span>
      </Link>

      {/* Sélecteur rapide des offres */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Votre formule :</p>
        <div className="grid grid-cols-3 gap-2">
          {PLANS_CONFIG.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onChangePlan(p.id)}
              className={`py-2 px-1 rounded-2xl text-center text-[11px] font-bold transition-all cursor-pointer ${
                p.id === plan.id
                  ? 'border-2 border-[#F94F06] bg-orange-500/20 text-orange-200 scale-[1.03]'
                  : 'border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {p.id === 'pro' ? '🔥 Pro' : p.id === 'solo' ? '⚡ Solo' : '👑 Scale'}
            </button>
          ))}
        </div>
      </div>

      {/* Carte forfait actif */}
      <div className="bg-white/10 border border-white/10 rounded-2xl p-5 space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Forfait Choisi</span>
          <span className="text-[10px] font-black bg-[#F94F06] text-white px-2.5 py-0.5 rounded-full">{plan.badge}</span>
        </div>
        <div>
          <h3 className="text-xl font-black text-white">{plan.name}</h3>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{plan.description}</p>
        </div>
        <div className="flex items-end justify-between border-t border-white/10 pt-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{formatPrice(price)}</span>
            <span className="text-xs text-slate-400">{isYearly ? '/ an' : '/ mois'}</span>
          </div>
          <button
            type="button"
            onClick={onToggleCycle}
            className="text-[10px] font-black bg-white/10 hover:bg-white/20 text-slate-300 px-3 py-1.5 rounded-xl border border-white/10 transition-all cursor-pointer"
          >
            {isYearly ? 'Passer mensuel' : 'Annuel (-2 mois)'}
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-2.5 flex-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Inclus :</p>
        {plan.features.map((f, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
            </div>
            <span>{f}</span>
          </div>
        ))}
      </div>

      {/* Réassurance */}
      <div className="border-t border-white/10 pt-4 text-[11px] text-slate-500 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Activation immédiate • Wave 🌊 & Orange Money 🍊</span>
      </div>
    </div>
  );
}

// ================================================================
// Formulaire principal
// ================================================================

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Détection du mode ──────────────────────────────────────
  const trialParam = searchParams.get('trial');
  const planParam  = searchParams.get('plan');
  const cycleParam = searchParams.get('cycle') ?? 'monthly';

  // Mode essai si : ?trial=true OU aucun plan payant spécifié
  const isTrial = trialParam === 'true' || !planParam;
  const mode: PageMode = isTrial ? 'trial' : 'purchase';

  // ── État du plan ───────────────────────────────────────────
  const defaultPlanId = (planParam && PLANS_MAP[planParam]) ? planParam : 'pro';
  const [activePlanId, setActivePlanId] = useState<string>(
    mode === 'trial' ? 'solo' : defaultPlanId
  );
  const [isYearly, setIsYearly] = useState(cycleParam === 'yearly');

  // ── Champs formulaire ──────────────────────────────────────
  const [agencyName, setAgencyName] = useState('');
  const [fullName,   setFullName]   = useState('');
  const [email,      setEmail]      = useState('');
  const [phone,      setPhone]      = useState('');
  const [password,   setPassword]   = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [payMethod, setPayMethod]   = useState<PayMethod>('WAVE');

  // ── États UI ───────────────────────────────────────────────
  const [isLoading, setIsLoading]   = useState(false);
  const [errorMsg,  setErrorMsg]    = useState<string | null>(null);

  const currentPlan: PlanConfig = PLANS_MAP[activePlanId] ?? PLANS_CONFIG[1];
  const currentPrice = isYearly ? currentPlan.priceYearly : currentPlan.priceMonthly;

  const handleChangePlan  = useCallback((id: string) => setActivePlanId(id), []);
  const handleToggleCycle = useCallback(() => setIsYearly((v) => !v), []);

  // ── Soumission ─────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!agencyName.trim() || !fullName.trim() || !email.trim() || !password.trim() || !phone.trim()) {
      setErrorMsg('Merci de renseigner tous les champs obligatoires.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setIsLoading(true);

    try {
      const agencyId = 'agency_' + Date.now();
      let userUid = 'usr_local_' + Date.now();

      // 1. Firebase Auth ──────────────────────────────────────
      if (auth) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
          userUid = cred.user.uid;
          await updateProfile(cred.user, { displayName: fullName.trim() });
        } catch (authErr: any) {
          const msgs: Record<string, string> = {
            'auth/email-already-in-use': 'Cette adresse email est déjà utilisée. Connectez-vous à la place.',
            'auth/invalid-email':        'Adresse email invalide.',
            'auth/weak-password':        'Mot de passe trop faible (6 caractères minimum).',
          };
          throw new Error(msgs[authErr.code] ?? authErr.message);
        }
      }

      // 2. Données communes ──────────────────────────────────
      const now       = serverTimestamp ? serverTimestamp() : new Date().toISOString();
      const trialEnd  = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

      // ────────────────────────────────────────────────────────
      // MODE ESSAI GRATUIT
      // ────────────────────────────────────────────────────────
      if (mode === 'trial') {
        const agencyData = {
          id:            agencyId,
          name:          agencyName.trim(),
          ownerUid:      userUid,
          ownerName:     fullName.trim(),
          ownerEmail:    email.trim(),
          ownerPhone:    phone.trim(),
          // Forfait initial : Solo (3 workspaces)
          planId:        'solo',
          planName:      'Solo / Freelance',
          billingCycle:  'monthly',
          amount:        0,
          workspacesMax: 3,
          workspacesUsed: 0,
          paymentMethod: null,
          paymentStatus: 'TRIAL',         // <── statut essai
          status:        'TRIAL',
          trialEndsAt:   trialEnd,
          createdAt:     now,
        };
        const userData = {
          uid:         userUid,
          email:       email.trim(),
          displayName: fullName.trim(),
          agencyId,
          role:        'owner',
          createdAt:   now,
        };

        if (db) {
          try {
            await setDoc(doc(db, 'agencies', agencyId), agencyData);
            await setDoc(doc(db, 'users',    userUid),   userData);
          } catch (dbErr) {
            console.warn('Firestore write failed (offline?):', dbErr);
          }
        }

        // Sync localStorage
        localStorage.setItem('cmflow_user_profile', JSON.stringify({
          agencyId, agencyName: agencyName.trim(), fullName: fullName.trim(),
          email: email.trim(), phone: phone.trim(),
          plan: 'solo', cycle: 'monthly', amount: 0,
          workspacesMax: 3, workspacesUsed: 0, isTrial: true, trialEndsAt: trialEnd,
        }));
        localStorage.setItem('cmflow_active_plan', 'solo');
        localStorage.setItem('cmflow_agency_id',   agencyId);

        // Redirection immédiate → dashboard (aucun paiement)
        router.push('/dashboard');
        return;
      }

      // ────────────────────────────────────────────────────────
      // MODE ACHAT DIRECT
      // ────────────────────────────────────────────────────────
      const agencyData = {
        id:            agencyId,
        name:          agencyName.trim(),
        ownerUid:      userUid,
        ownerName:     fullName.trim(),
        ownerEmail:    email.trim(),
        ownerPhone:    phone.trim(),
        planId:        currentPlan.id,
        planName:      currentPlan.name,
        billingCycle:  isYearly ? 'yearly' : 'monthly',
        amount:        currentPrice,
        workspacesMax: currentPlan.workspacesMax,
        workspacesUsed: 0,
        paymentMethod: payMethod,
        paymentStatus: 'PENDING_PAYMENT',  // <── en attente de paiement
        status:        'pending',
        trialEndsAt:   trialEnd,
        createdAt:     now,
      };
      const userData = {
        uid:         userUid,
        email:       email.trim(),
        displayName: fullName.trim(),
        agencyId,
        role:        'owner',
        createdAt:   now,
      };

      if (db) {
        try {
          await setDoc(doc(db, 'agencies', agencyId), agencyData);
          await setDoc(doc(db, 'users',    userUid),   userData);
        } catch (dbErr) {
          console.warn('Firestore write failed (offline?):', dbErr);
        }
      }

      // Sync localStorage
      localStorage.setItem('cmflow_user_profile', JSON.stringify({
        agencyId, agencyName: agencyName.trim(), fullName: fullName.trim(),
        email: email.trim(), phone: phone.trim(),
        plan: currentPlan.id, cycle: isYearly ? 'yearly' : 'monthly',
        amount: currentPrice, workspacesMax: currentPlan.workspacesMax,
        workspacesUsed: 0, paymentMethod: payMethod,
      }));
      localStorage.setItem('cmflow_active_plan', currentPlan.id);
      localStorage.setItem('cmflow_agency_id',   agencyId);

      // 3. Initier le paiement Mobile Money ──────────────────
      const returnBase = window.location.origin;
      const payPayload = {
        agencyId,
        agencyName:  agencyName.trim(),
        agencyEmail: email.trim(),
        phone:       phone.trim(),
        planId:      currentPlan.id.toUpperCase(),
        amount:      currentPrice,
        returnUrl:   `${returnBase}/billing.html?status=success&plan=${currentPlan.id}&method=${payMethod === 'WAVE' ? 'wave' : 'om'}`,
        cancelUrl:   `${returnBase}/register?plan=${currentPlan.id}`,
      };

      const endpoint = payMethod === 'WAVE'
        ? '/api/billing/wave/checkout'
        : '/api/billing/om/checkout';

      try {
        const res  = await fetch(endpoint, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payPayload),
        });
        const data = await res.json();
        if (data?.success) {
          const url = data.wave_launch_url || data.payment_url;
          if (url) { window.location.href = url; return; }
        }
      } catch { /* fallback */ }

      // Fallback → page d'instructions de paiement
      const q = new URLSearchParams({
        status: 'pending', plan: currentPlan.id,
        method: payMethod === 'WAVE' ? 'wave' : 'om',
        agency: agencyName.trim(), email: email.trim(),
        amount: String(currentPrice),
      });
      window.location.href = `/billing.html?${q.toString()}`;

    } catch (err: any) {
      setErrorMsg(err.message ?? 'Une erreur inattendue est survenue. Réessayez.');
      setIsLoading(false);
    }
  };

  // ================================================================
  // Rendu
  // ================================================================
  return (
    <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">

      {/* ── Colonne Gauche : Formulaire ───────────────────────── */}
      <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
        <div>
          {/* En-tête contextuel */}
          <div className="pb-5 border-b border-slate-100 flex items-start justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                {mode === 'trial'
                  ? 'Démarrer votre essai gratuit'
                  : 'Créer mon espace agence'}
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {mode === 'trial'
                  ? '14 jours offerts · Aucune carte bancaire · Annulation libre'
                  : 'Opérationnel en 2 minutes · Activation immédiate'}
              </p>
            </div>

            {mode === 'trial' ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                <Gift className="w-3 h-3" /> 14 jours gratuits
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-orange-50 text-[#F94F06] border border-orange-200 shrink-0">
                <Sparkles className="w-3 h-3" /> Achat direct
              </span>
            )}
          </div>

          {/* Erreur */}
          {errorMsg && (
            <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {errorMsg}
            </div>
          )}

          {/* Formulaire */}
          <form id="register-form" onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>

            {/* Agence & Nom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Nom de l'Agence / Studio *", icon: <Building2 className="w-4 h-4" />, placeholder: 'Ex: Kitsune Digital', value: agencyName, setter: setAgencyName },
                { label: 'Votre Nom Complet *',         icon: <User       className="w-4 h-4" />, placeholder: 'Ex: Fatoumata Diallo', value: fullName,   setter: setFullName },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1.5">{f.label}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">{f.icon}</div>
                    <input
                      type="text" required placeholder={f.placeholder}
                      value={f.value} onChange={(e) => f.setter(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F94F06]/20 focus:border-[#F94F06] transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Email Professionnel *', icon: <Mail  className="w-4 h-4" />, placeholder: 'contact@agence.sn', type: 'email', value: email, setter: setEmail },
                { label: 'Numéro WhatsApp *',      icon: <Phone className="w-4 h-4" />, placeholder: '+221 77 800 12 34', type: 'tel',   value: phone, setter: setPhone },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1.5">{f.label}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">{f.icon}</div>
                    <input
                      type={f.type} required placeholder={f.placeholder}
                      value={f.value} onChange={(e) => f.setter(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F94F06]/20 focus:border-[#F94F06] transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                Mot de Passe (6+ caractères) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'} required
                  placeholder="••••••••" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F94F06]/20 focus:border-[#F94F06] transition-all placeholder:text-slate-400"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* ── Sélecteur de paiement (ACHAT DIRECT seulement) ── */}
            {mode === 'purchase' && (
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-2">
                  Passerelle de Paiement Sécurisée :
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Wave */}
                  <button type="button" onClick={() => setPayMethod('WAVE')}
                    className={`p-3.5 rounded-2xl border-2 flex items-center gap-2.5 transition-all cursor-pointer ${
                      payMethod === 'WAVE'
                        ? 'border-[#1DC2EC] bg-cyan-50/60'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <WaveLogo size={28} />
                    <div className="text-left">
                      <div className="text-xs font-black text-slate-800">Wave</div>
                      <div className="text-[10px] text-slate-500">1% frais • 1-clic</div>
                    </div>
                    {payMethod === 'WAVE' && <CheckCircle2 className="w-4 h-4 text-[#1DC2EC] ml-auto shrink-0" />}
                  </button>

                  {/* Orange Money */}
                  <button type="button" onClick={() => setPayMethod('ORANGE_MONEY')}
                    className={`p-3.5 rounded-2xl border-2 flex items-center gap-2.5 transition-all cursor-pointer ${
                      payMethod === 'ORANGE_MONEY'
                        ? 'border-[#FF7900] bg-orange-50/60'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <OrangeMoneyLogo size={28} />
                    <div className="text-left">
                      <div className="text-xs font-black text-slate-800">Orange Money</div>
                      <div className="text-[10px] text-slate-500">UEMOA • Code OTP</div>
                    </div>
                    {payMethod === 'ORANGE_MONEY' && <CheckCircle2 className="w-4 h-4 text-[#FF7900] ml-auto shrink-0" />}
                  </button>
                </div>
              </div>
            )}

            {/* ── Bannière de réassurance pour essai gratuit ── */}
            {mode === 'trial' && (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-800">
                  <p className="font-black mb-0.5">Aucun paiement requis</p>
                  <p className="font-medium text-emerald-700">
                    Votre compte est créé immédiatement. Vous pourrez choisir votre forfait dans 14 jours depuis votre tableau de bord.
                  </p>
                </div>
              </div>
            )}

            {/* ── CTA Principal ── */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-2xl font-black text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 shadow-xl ${
                  mode === 'trial'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25'
                    : 'bg-[#F94F06] hover:bg-[#e04605] text-white shadow-orange-500/25'
                }`}
              >
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Création de votre espace...</>
                ) : mode === 'trial' ? (
                  <><Gift className="w-5 h-5" /> Créer mon compte &amp; Démarrer l&apos;essai <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>Valider &amp; Payer {formatPrice(currentPrice)} via {payMethod === 'WAVE' ? 'Wave 🌊' : 'Orange Money 🍊'} <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>

            {/* Lien vers achat direct si on est en essai, et vice-versa */}
            <p className="text-center text-[11px] text-slate-500 pt-1">
              {mode === 'trial' ? (
                <>
                  Vous voulez démarrer directement avec un plan payant ?{' '}
                  <Link href="/register?plan=pro" className="font-black text-[#F94F06] hover:underline">
                    Voir les forfaits →
                  </Link>
                </>
              ) : (
                <>
                  Pas prêt à payer maintenant ?{' '}
                  <Link href="/register?trial=true" className="font-black text-emerald-600 hover:underline">
                    Démarrer l&apos;essai gratuit 14j →
                  </Link>
                </>
              )}
            </p>
          </form>
        </div>

        {/* Pied de formulaire */}
        <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-5">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="font-black text-[#F94F06] hover:underline">Se connecter →</Link>
        </div>
      </div>

      {/* ── Colonne Droite : Récapitulatif ─────────────────────── */}
      <div className="lg:col-span-5 p-5">
        <PlanSummaryCard
          mode={mode}
          plan={currentPlan}
          isYearly={isYearly}
          onChangePlan={handleChangePlan}
          onToggleCycle={handleToggleCycle}
        />
      </div>
    </div>
  );
}

// ================================================================
// Page (avec Suspense pour useSearchParams)
// ================================================================

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-8 antialiased">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-[#F94F06] animate-spin" />
        </div>
      }>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
