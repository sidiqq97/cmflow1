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
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import { PLANS_CONFIG, PLANS_MAP, PlanConfig } from '@/constants/plans';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const planParam = searchParams.get('plan') || 'solo';
  const cycleParam = searchParams.get('cycle') || 'monthly';

  const [activePlanId, setActivePlanId] = useState<string>(
    PLANS_MAP[planParam] ? planParam : 'solo'
  );
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    cycleParam === 'yearly' ? 'yearly' : 'monthly'
  );

  // États du formulaire
  const [agencyName, setAgencyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'WAVE' | 'ORANGE_MONEY'>('WAVE');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentPlan: PlanConfig = PLANS_MAP[activePlanId] || PLANS_CONFIG[0];
  const isYearly = billingCycle === 'yearly';
  const currentPrice = isYearly ? currentPlan.priceYearly : currentPlan.priceMonthly;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agencyName.trim() || !fullName.trim() || !email.trim() || !password.trim() || !phone.trim()) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setIsLoading(true);

    try {
      let userUid = 'usr_' + Date.now();
      const agencyId = 'agency_' + Date.now();

      // Inscription via Firebase Auth Client
      if (auth) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
          userUid = userCredential.user.uid;
          await updateProfile(userCredential.user, {
            displayName: fullName.trim(),
          });
        } catch (authErr: any) {
          if (authErr.code === 'auth/email-already-in-use') {
            throw new Error('Cette adresse email est déjà associée à un compte. Veuillez vous connecter.');
          } else if (authErr.code === 'auth/invalid-email') {
            throw new Error('L’adresse email saisie est invalide.');
          } else if (authErr.code === 'auth/weak-password') {
            throw new Error('Le mot de passe est trop faible.');
          }
          console.warn('Firebase Auth standard fallback:', authErr.message);
        }
      }

      // Données de l'agence et de l'utilisateur
      const agencyData = {
        id: agencyId,
        name: agencyName.trim(),
        ownerUid: userUid,
        ownerName: fullName.trim(),
        ownerEmail: email.trim(),
        ownerPhone: phone.trim(),
        planId: currentPlan.id,
        planName: currentPlan.name,
        billingCycle: billingCycle,
        amount: currentPrice,
        workspacesLimit: currentPlan.workspaces,
        paymentMethod: paymentMethod,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        createdAt: serverTimestamp ? serverTimestamp() : new Date().toISOString(),
      };

      const userData = {
        uid: userUid,
        email: email.trim(),
        displayName: fullName.trim(),
        agencyId: agencyId,
        role: 'owner',
        createdAt: serverTimestamp ? serverTimestamp() : new Date().toISOString(),
      };

      // Sauvegarde Firestore
      if (db) {
        try {
          await setDoc(doc(db, 'agencies', agencyId), agencyData);
          await setDoc(doc(db, 'users', userUid), userData);
        } catch (dbErr) {
          console.warn('Firestore fallback local storage:', dbErr);
        }
      }

      // Persistance de session locale
      const sessionProfile = {
        agencyId,
        agencyName: agencyName.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        plan: currentPlan.id,
        cycle: billingCycle,
        amount: currentPrice,
        workspacesLimit: currentPlan.workspaces,
        paymentMethod: paymentMethod,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('cmflow_user_profile', JSON.stringify(sessionProfile));
        localStorage.setItem('cmflow_active_plan', currentPlan.id);
        localStorage.setItem('cmflow_agency_id', agencyId);
      }

      // Tentative de déclenchement de la passerelle Wave / Orange Money
      try {
        const endpoint = paymentMethod === 'WAVE' ? '/api/billing/wave/checkout' : '/api/billing/om/checkout';
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agencyId,
            agencyName: agencyName.trim(),
            agencyEmail: email.trim(),
            phone: phone.trim(),
            planId: currentPlan.id.toUpperCase(),
            amount: currentPrice,
            returnUrl: `${window.location.origin}/dashboard?welcome=true&plan=${currentPlan.id}`,
            cancelUrl: `${window.location.origin}/register?plan=${currentPlan.id}`,
          }),
        });

        const data = await res.json();
        if (data && data.success) {
          const redirectUrl = data.wave_launch_url || data.payment_url;
          if (redirectUrl) {
            window.location.href = redirectUrl;
            return;
          }
        }
      } catch (payErr) {
        console.warn('Payment redirect fallback to direct dashboard:', payErr);
      }

      // Redirection Dashboard directe si l'essai gratuit de 14 jours s'active
      router.push('/dashboard?welcome=true&plan=' + currentPlan.id);
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur inattendue est survenue lors de l’inscription.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[720px]">
      
      {/* =========================================================================
          COLONNE GAUCHE : RÉCAPITULATIF DU FORFAIT DYNAMIQUE
          ========================================================================= */}
      <div className="lg:col-span-5 bg-gradient-to-br from-[#0F172A] via-slate-900 to-slate-950 p-6 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
        {/* Halo décoratif orange */}
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Logo Brand */}
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#F94F06] to-orange-400 flex items-center justify-center text-white font-black text-base shadow-md shadow-orange-500/30">
              CM
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              CM<span className="text-[#F94F06]">Flow</span>
            </span>
          </Link>

          {/* Switch Mensuel / Annuel */}
          <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                !isYearly
                  ? 'bg-[#F94F06] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Facturation Mensuelle
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                isYearly
                  ? 'bg-[#F94F06] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annuelle</span>
              <span className="bg-emerald-400/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                -2 mois
              </span>
            </button>
          </div>

          {/* Sélecteur Rapide des 3 Offres */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Sélectionnez votre formule :
            </span>
            <div className="grid grid-cols-3 gap-2">
              {PLANS_CONFIG.map((plan) => {
                const isSelected = plan.id === currentPlan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setActivePlanId(plan.id)}
                    className={`py-2.5 px-2 rounded-2xl text-center text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-2 border-[#F94F06] bg-orange-500/20 text-orange-200 shadow-md scale-[1.02]'
                        : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {plan.id === 'pro' ? 'Pro 🔥' : plan.id === 'solo' ? 'Solo ⚡' : 'Scale'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Carte Forfait Active */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-400">
                Forfait Choisi
              </span>
              <span className="text-[10px] font-black bg-[#F94F06] text-white px-2.5 py-0.5 rounded-full shadow-xs">
                {currentPlan.badge}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">{currentPlan.name}</h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {currentPlan.description}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-baseline gap-1.5">
              <span className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                {currentPrice.toLocaleString('fr-FR')} FCFA
              </span>
              <span className="text-xs font-bold text-slate-400">
                {isYearly ? '/ an' : '/ mois'}
              </span>
            </div>

            <div className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>
                {currentPlan.workspaces >= 999
                  ? 'Workspaces clients illimités'
                  : `${currentPlan.workspaces} Workspaces clients inclus`}
              </span>
            </div>
          </div>

          {/* Liste des Inclusions */}
          <div className="space-y-2.5 pt-1">
            <span className="text-xs font-bold text-white">Inclus dans votre formule :</span>
            <ul className="space-y-2 text-xs text-slate-300">
              {currentPlan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Réassurance */}
        <div className="relative z-10 pt-4 text-[11px] text-slate-400 flex items-center gap-2 border-t border-white/10 mt-6">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Essai 14 jours inclus • Paiement sécurisé Wave 🌊 & Orange Money 🍊</span>
        </div>
      </div>

      {/* =========================================================================
          COLONNE DROITE : FORMULAIRE D'INSCRIPTION & VALIDATION
          ========================================================================= */}
      <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                Créez votre compte agence
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Démarrez votre espace de travail CMFlow en 2 minutes.
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-[#F94F06] border border-orange-200">
              <Sparkles className="w-3.5 h-3.5" />
              14 jours offerts
            </span>
          </div>

          {/* Message d'erreur */}
          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Formulaire Principal */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Nom de l'Agence & Nom Complet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nom de l'Agence / Freelance *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kitsune Studio"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F94F06]/20 focus:border-[#F94F06] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nom Complet du Responsable *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Sidiqq Ndiaye"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F94F06]/20 focus:border-[#F94F06] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Email & Mot de Passe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Professionnel *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="contact@agence.sn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F94F06]/20 focus:border-[#F94F06] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Mot de Passe (6+ car.) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F94F06]/20 focus:border-[#F94F06] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Téléphone WhatsApp */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Numéro WhatsApp pour Notifications Client *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="+221 77 800 12 34"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F94F06]/20 focus:border-[#F94F06] transition-all"
                />
              </div>
            </div>

            {/* Passerelle de Paiement Wave / OM */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Passerelle de Paiement Sécurisée :
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('WAVE')}
                  className={`p-3.5 rounded-2xl border-2 text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    paymentMethod === 'WAVE'
                      ? 'border-[#1E90FF] bg-blue-50/50 text-[#1E90FF] shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🌊</span>
                    <span>Wave Sénégal / CI</span>
                  </div>
                  {paymentMethod === 'WAVE' && <CheckCircle2 className="w-4 h-4 text-[#1E90FF]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('ORANGE_MONEY')}
                  className={`p-3.5 rounded-2xl border-2 text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    paymentMethod === 'ORANGE_MONEY'
                      ? 'border-[#FF7900] bg-orange-50/50 text-[#FF7900] shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🍊</span>
                    <span>Orange Money</span>
                  </div>
                  {paymentMethod === 'ORANGE_MONEY' && <CheckCircle2 className="w-4 h-4 text-[#FF7900]" />}
                </button>
              </div>
            </div>

            {/* Bouton de Soumission */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-2xl font-black text-sm bg-[#F94F06] hover:bg-[#e04605] text-white shadow-xl shadow-orange-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Création du compte en cours...</span>
                  </>
                ) : (
                  <>
                    <span>
                      Démarrer mon Essai 14 Jours ({currentPrice.toLocaleString('fr-FR')} FCFA)
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Pied de page & Connexion */}
        <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-500">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="font-bold text-[#F94F06] hover:underline">
            Se connecter à mon agence
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-8 antialiased text-[#0F172A]">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 text-[#F94F06] animate-spin" />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
