'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Building2,
  Phone,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface PlanDetail {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  isFree: boolean;
  features: string[];
}

const PLANS_CONFIG: Record<string, PlanDetail> = {
  solo: {
    id: 'solo',
    name: 'Solo / Freelance',
    badge: 'Essai 14j Inclus 🌱',
    tagline: 'Idéal pour les freelances et CM indépendants gérant leurs premiers clients.',
    priceMonthly: 3500,
    priceYearly: 35000,
    isFree: false,
    features: [
      '2 Workspaces clients',
      'Publications & médias illimités',
      'Portail de validation WhatsApp interactif',
      'Publication automatique Instagram & Facebook',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro Agency',
    badge: 'Recommandé 🔥',
    tagline: 'La solution complète pour les agences et CM avec un portefeuille actif.',
    priceMonthly: 15000,
    priceYearly: 150000,
    isFree: false,
    features: [
      'Jusqu’à 10 Workspaces clients',
      'Publication Reels, Carrousels & Stories',
      'Rapports analytiques PDF automatisés',
      'Support prioritaire WhatsApp 7j/7',
    ],
  },
  scale: {
    id: 'scale',
    name: 'Scale Agence',
    badge: 'Grands Comptes 🚀',
    tagline: 'Pour les agences en forte croissance gérant de multiples marques.',
    priceMonthly: 35000,
    priceYearly: 350000,
    isFree: false,
    features: [
      'Workspaces clients illimités',
      'Gestion d’équipe & rôles CM illimités',
      'Marque blanche totale (votre logo sur le portail client)',
      'Intégration API & Webhooks sur mesure',
    ],
  },
};

// Compatibilité pour anciens liens
PLANS_CONFIG.starter = PLANS_CONFIG.solo;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const planParam = searchParams.get('plan') || 'solo';
  const cycleParam = searchParams.get('cycle') || 'monthly';

  const [activePlanId, setActivePlanId] = useState<string>(
    PLANS_CONFIG[planParam] ? planParam : 'solo'
  );
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    cycleParam === 'yearly' ? 'yearly' : 'monthly'
  );

  // Form State
  const [agencyName, setAgencyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'WAVE' | 'ORANGE_MONEY'>('WAVE');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentPlan = PLANS_CONFIG[activePlanId] || PLANS_CONFIG.starter;
  const currentPrice =
    billingCycle === 'yearly'
      ? currentPlan.priceYearly
      : currentPlan.priceMonthly;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Sauvegarde locale / session pour le profil
      const userProfile = {
        agencyId: 'agency_' + Date.now(),
        agencyName: agencyName || 'Mon Agence',
        fullName: fullName || 'Community Manager',
        email,
        phone,
        plan: activePlanId,
        billingCycle,
        paymentMethod: currentPlan.isFree ? 'FREE_TRIAL' : paymentMethod,
        createdAt: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('cmflow_user_profile', JSON.stringify(userProfile));
        localStorage.setItem('cmflow_active_plan', activePlanId);
      }

      // 2. Si formule gratuite (Starter Découverte) : accès direct au calendrier
      if (currentPlan.isFree || currentPrice === 0) {
        setTimeout(() => {
          router.push('/dashboard/calendar?plan=starter&welcome=true');
        }, 800);
        return;
      }

      // 3. Si formule payante (Pro / Scale) : Déclenchement de la session Wave ou Orange Money
      const endpoint =
        paymentMethod === 'WAVE'
          ? '/api/billing/wave/checkout'
          : '/api/billing/om/checkout';

      const planCode = activePlanId === 'scale' ? 'SCALE' : 'PRO_AGENCY';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agencyId: userProfile.agencyId,
          agencyName: userProfile.agencyName,
          agencyEmail: email,
          phone,
          planId: planCode,
          amount: currentPrice,
          returnUrl: `${window.location.origin}/dashboard/billing?status=success&plan=${planCode}&method=${paymentMethod.toLowerCase()}`,
          cancelUrl: `${window.location.origin}/register?plan=${activePlanId}&cycle=${billingCycle}`,
        }),
      });

      const data = await res.json();

      if (data && data.success) {
        const paymentUrl = data.wave_launch_url || data.payment_url;
        if (paymentUrl) {
          window.location.href = paymentUrl;
          return;
        }
      }

      // Fallback redirection de confirmation
      router.push(
        `/dashboard/billing?status=success&plan=${planCode}&method=${paymentMethod.toLowerCase()}`
      );
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          'Une erreur est survenue lors de l’initialisation de votre compte.'
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* LOGO & TITRE */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F94F06] to-orange-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/25">
              CM
            </div>
            <span className="text-2xl font-black tracking-tight text-[#0F172A]">
              CM<span className="text-[#F94F06]">Flow</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Créez votre compte agence & démarrez sereinement
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Rejoignez plus de 450+ CMs et agences digitales en Afrique de l’Ouest 🇸🇳 🇨🇮
          </p>
        </div>

        {/* GRILLE 2 COLONNES : RÉCAPITULATIF FORFAIT & FORMULAIRE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* =================================================================
              COLONNE 1 : ENCADRÉ RÉCAPITULATIF DYNAMIQUE (STICKY TOP CARD)
              ================================================================= */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-orange-500/30 shadow-xl shadow-orange-500/5 space-y-6 relative overflow-hidden">
              
              {/* Badge Forfait */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#F94F06]">
                  Forfait Sélectionné
                </span>
                <span className="text-[10px] font-black bg-orange-50 text-[#F94F06] border border-orange-200 px-3 py-1 rounded-full">
                  {currentPlan.badge}
                </span>
              </div>

              {/* Titre & Prix */}
              <div className="space-y-1 pb-4 border-b border-slate-100">
                <h3 className="text-2xl font-black text-[#0F172A]">
                  {currentPlan.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {currentPlan.tagline}
                </p>
                <div className="pt-2 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-[#0F172A]">
                    {currentPrice === 0 ? '0' : currentPrice.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {currentPrice === 0
                      ? 'FCFA / 14 jours'
                      : billingCycle === 'yearly'
                      ? 'FCFA / an (-2 mois offerts)'
                      : 'FCFA / mois'}
                  </span>
                </div>
              </div>

              {/* Sélecteur rapide de formule */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Changer de formule :
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(PLANS_CONFIG).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActivePlanId(p.id)}
                      className={`p-2 rounded-xl text-center text-xs font-bold transition-all border ${
                        activePlanId === p.id
                          ? 'border-[#F94F06] bg-orange-50/60 text-[#F94F06] shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {p.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle de Cycle */}
              {!currentPlan.isFree && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    Cycle : {billingCycle === 'yearly' ? 'Annuel (-17%)' : 'Mensuel'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setBillingCycle(
                        billingCycle === 'monthly' ? 'yearly' : 'monthly'
                      )
                    }
                    className="text-[11px] font-black text-[#F94F06] hover:underline"
                  >
                    Basculer en {billingCycle === 'monthly' ? 'Annuel 🎁' : 'Mensuel'}
                  </button>
                </div>
              )}

              {/* Liste des fonctionnalités incluses */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-800">
                  Ce qui est inclus dans votre offre :
                </span>
                <ul className="space-y-2 text-xs text-slate-600 font-medium">
                  {currentPlan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Réassurance */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-800 font-semibold">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Garantie sans engagement • Annulation en 1-clic</span>
              </div>

            </div>
          </div>

          {/* =================================================================
              COLONNE 2 : FORMULAIRE D'INSCRIPTION & CHECKOUT
              ================================================================= */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-[#0F172A]">
                Vos informations professionnelles
              </h2>
              <p className="text-xs text-slate-500">
                Ces informations serviront à personnaliser votre espace et vos liens clients.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs font-semibold text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Nom Agence */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nom de votre Agence ou Studio <span className="text-[#F94F06]">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="Ex: Dakar Media Studio"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F94F06]/20 focus:border-[#F94F06] transition-all"
                  />
                </div>
              </div>

              {/* Nom du CM */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nom complet du Responsable CM <span className="text-[#F94F06]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Awa Diop"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F94F06]/20 focus:border-[#F94F06] transition-all"
                  />
                </div>
              </div>

              {/* Email & Mot de Passe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Professionnel <span className="text-[#F94F06]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="awa@dakarmedia.sn"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F94F06]/20 focus:border-[#F94F06] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mot de passe sécurisé <span className="text-[#F94F06]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F94F06]/20 focus:border-[#F94F06] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Numéro WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Numéro WhatsApp (pour alertes & validations clients) <span className="text-[#F94F06]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+221 77 000 00 00"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F94F06]/20 focus:border-[#F94F06] transition-all"
                  />
                </div>
              </div>

              {/* SÉLECTEUR MOBILE MONEY (SI FORMULE PAYANTE) */}
              {!currentPlan.isFree && currentPrice > 0 && (
                <div className="pt-3 space-y-3">
                  <label className="block text-xs font-bold text-slate-700">
                    Mode de Paiement Sécurisé 🇸🇳 🇨🇮
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Option Wave */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('WAVE')}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        paymentMethod === 'WAVE'
                          ? 'border-[#1E90FF] bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-sm font-black text-[#1E90FF] flex items-center gap-1.5">
                          🌊 Wave
                        </span>
                        <p className="text-[11px] text-slate-500 font-medium">
                          1% frais • Validation 1-clic
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'WAVE'
                            ? 'border-[#1E90FF] bg-[#1E90FF]'
                            : 'border-slate-300'
                        }`}
                      >
                        {paymentMethod === 'WAVE' && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </button>

                    {/* Option Orange Money */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('ORANGE_MONEY')}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        paymentMethod === 'ORANGE_MONEY'
                          ? 'border-[#FF7900] bg-orange-50/50 ring-2 ring-orange-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-sm font-black text-[#FF7900] flex items-center gap-1.5">
                          🍊 Orange Money
                        </span>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Zone UEMOA • Code OTP
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'ORANGE_MONEY'
                            ? 'border-[#FF7900] bg-[#FF7900]'
                            : 'border-slate-300'
                        }`}
                      >
                        {paymentMethod === 'ORANGE_MONEY' && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </button>

                  </div>
                </div>
              )}

              {/* BOUTON DE SOUMISSION */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-2xl text-sm font-black bg-[#F94F06] hover:bg-[#e04605] text-white shadow-xl shadow-orange-500/25 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Configuration de votre espace...</span>
                    </>
                  ) : currentPlan.isFree || currentPrice === 0 ? (
                    <>
                      <span>Créer mon compte & Démarrer l'essai (14j)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>
                        Confirmer et Payer {currentPrice.toLocaleString('fr-FR')} FCFA via{' '}
                        {paymentMethod === 'WAVE' ? 'Wave 🌊' : 'Orange Money 🍊'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Vous avez déjà un compte ?{' '}
                  <Link
                    href="/login"
                    className="font-bold text-[#F94F06] hover:underline"
                  >
                    Connectez-vous ici
                  </Link>
                </p>
              </div>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
          <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-[#F94F06]" />
            <span>Chargement de la page d'inscription...</span>
          </div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
