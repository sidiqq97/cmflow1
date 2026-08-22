'use client';

import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { PricingCheckoutModal } from './PricingCheckoutModal';

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'scale' | null>(null);

  const handleSelectPlan = (planId: 'starter' | 'pro' | 'scale') => {
    setSelectedPlan(planId);
  };

  return (
    <section id="pricing" className="py-20 bg-[#F8FAFC] relative overflow-hidden">
      {/* Halo décoratif d'arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-orange-400/10 via-blue-400/10 to-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* EN-TÊTE DE SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#F94F06] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tarification Transparente & Sans Frais Cachés</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            Choisissez la formule qui fait décoller votre agence
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Réglez directement en FCFA via <strong>Wave</strong> ou <strong>Orange Money</strong> sans carte bancaire internationale.
          </p>

          {/* SÉLECTEUR CYCLE MENSUEL / ANNUEL */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-[#0F172A]' : 'text-slate-400'}`}>
              Facturation Mensuelle
            </span>

            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-8 bg-slate-900 rounded-full p-1 transition-colors relative cursor-pointer focus:outline-none"
            >
              <div
                className={`w-6 h-6 rounded-full bg-[#F94F06] shadow-md transition-transform flex items-center justify-center text-[10px] text-white font-black ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {billingCycle === 'yearly' ? '12' : '1'}
              </div>
            </button>

            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold ${billingCycle === 'yearly' ? 'text-[#0F172A]' : 'text-slate-400'}`}>
                Facturation Annuelle
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 animate-pulse">
                -17% (2 mois offerts) 🎁
              </span>
            </div>
          </div>
        </div>

        {/* 3 CARTES DE TARIFS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* CARTE 1 : STARTER SOLO */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Starter Solo</span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">Essai 14j</span>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-black text-[#0F172A]">
                  0 <span className="text-sm font-normal text-slate-400">FCFA / 14 jours</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Idéal pour tester CMFlow avec vos 2 premiers clients.</p>
              </div>

              <ul className="space-y-3 text-xs text-slate-700 font-medium pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Jusqu’à <strong>2 Marques / Clients</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Validation WhatsApp en 1 clic</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Calendrier de publication & Médias HD</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <span>✕ Auto-publish automatique</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleSelectPlan('starter')}
              className="w-full py-3 px-4 rounded-2xl text-xs font-black bg-slate-100 hover:bg-slate-200 text-[#0F172A] transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Démarrer l'essai gratuit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CARTE 2 : PRO AGENCY (POPULAIRE) */}
          <div className="bg-white rounded-3xl p-7 border-2 border-[#F94F06] shadow-xl shadow-orange-500/10 flex flex-col justify-between space-y-6 relative transform md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F94F06] text-white px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
              Le Plus Populaire 🔥
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#F94F06]">Pro Agency</span>
                <span className="text-[10px] font-black bg-orange-50 text-[#F94F06] border border-orange-200 px-2.5 py-0.5 rounded-full">Recommandé</span>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-black text-[#0F172A]">
                  {billingCycle === 'monthly' ? '15 000' : '12 500'}
                  <span className="text-sm font-normal text-slate-400"> FCFA / mois</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {billingCycle === 'yearly' ? 'Facturé 150 000 FCFA / an (-2 mois offerts)' : 'L’arme ultime pour gérer jusqu’à 10 marques sereinement.'}
                </p>
              </div>

              <ul className="space-y-3 text-xs text-slate-800 font-semibold pt-2 border-t border-orange-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Jusqu’à <strong>10 Marques & Clients actifs</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Auto-Publish Meta</strong> (Instagram & Facebook)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Notifications WhatsApp & Liens Magiques</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Rapports PDF personnalisés & Start Page</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Support prioritaire WhatsApp 7j/7</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleSelectPlan('pro')}
              className="w-full py-3.5 px-4 rounded-2xl text-xs font-black bg-[#F94F06] hover:bg-[#e04605] text-white shadow-lg shadow-orange-500/25 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Choisir Pro Agency</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* CARTE 3 : SCALE & FRANCHISE */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-purple-600">Scale & Franchise</span>
                <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full">Équipe</span>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-black text-[#0F172A]">
                  {billingCycle === 'monthly' ? '35 000' : '29 160'}
                  <span className="text-sm font-normal text-slate-400"> FCFA / mois</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {billingCycle === 'yearly' ? 'Facturé 350 000 FCFA / an' : 'Pour les agences digitales et équipes de CMs en pleine expansion.'}
                </p>
              </div>

              <ul className="space-y-3 text-xs text-slate-700 font-medium pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Marques & Clients illimités</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Marque Blanche</strong> (White-label complet)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Multi-comptes CM & Rôles d'équipe</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Accès API REST & Webhooks personnalisés</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleSelectPlan('scale')}
              className="w-full py-3 px-4 rounded-2xl text-xs font-black bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Passer à Scale</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* PIED DE SECTION RÉASSURANCE */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 pt-4">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Paiement direct Wave Sénégal & Orange Money</span>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <Zap className="w-4 h-4 text-[#F94F06]" />
            <span>Activation instantanée sans délai</span>
          </div>
        </div>

      </div>

      {/* MODALE DE CHECKOUT INTERACTIVE */}
      <PricingCheckoutModal
        isOpen={selectedPlan !== null}
        onClose={() => setSelectedPlan(null)}
        planId={selectedPlan}
        billingCycle={billingCycle}
      />
    </section>
  );
}

export default PricingSection;
