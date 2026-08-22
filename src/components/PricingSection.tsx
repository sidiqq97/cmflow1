'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export interface PricingPlan {
  id: 'starter' | 'pro' | 'scale';
  name: string;
  badge?: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  popular?: boolean;
  features: string[];
  cta: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Découverte',
    badge: 'Essai 14j',
    tagline: 'Pour tester la plateforme et débuter avec vos 2 premiers clients.',
    priceMonthly: 0,
    priceYearly: 0,
    popular: false,
    features: [
      'Jusqu’à 2 Marques / Clients',
      'Validation WhatsApp en 1 clic',
      'Calendrier éditorial & Médias HD (50 Mo)',
      'Assistant IA Illimité (Textes & Hashtags)',
    ],
    cta: 'Démarrer l’essai gratuit',
  },
  {
    id: 'pro',
    name: 'Pro Agency',
    badge: 'Le Plus Populaire 🔥',
    tagline: 'L’arme ultime pour gérer jusqu’à 10 marques sereinement.',
    priceMonthly: 15000,
    priceYearly: 150000,
    popular: true,
    features: [
      'Jusqu’à 10 Marques & Clients actifs',
      'Auto-Publish Meta (Instagram Pro & Facebook)',
      'Validation WhatsApp & Liens Magiques',
      'Export Bilans & Rapports PDF personnalisés',
      'Start Page & Bio Links personnalisés',
      'Support prioritaire WhatsApp 7j/7',
    ],
    cta: 'Choisir Pro Agency',
  },
  {
    id: 'scale',
    name: 'Scale Agence',
    badge: 'Grandes Équipes 🚀',
    tagline: 'Pour les agences digitales et équipes de CMs en pleine expansion.',
    priceMonthly: 35000,
    priceYearly: 350000,
    popular: false,
    features: [
      'Marques & Clients illimités',
      'Marque Blanche (White-label complet)',
      'Multi-comptes CM & Rôles d’équipe',
      'Accès API REST & Webhooks personnalisés',
      'Facturation multi-entités & Suivi analytique',
    ],
    cta: 'Passer au Plan Scale',
  },
];

export function PricingSection() {
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);

  const handlePlanSelection = (plan: PricingPlan) => {
    const cycle = isYearly ? 'yearly' : 'monthly';
    router.push(`/register?plan=${plan.id}&cycle=${cycle}`);
  };

  return (
    <section id="pricing" className="py-20 bg-[#F8FAFC] relative overflow-hidden">
      {/* Halo décoratif d'arrière-plan Glassmorphism */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-orange-400/15 via-blue-400/10 to-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

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

          {/* TOGGLE MENSUEL / ANNUEL */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span
              onClick={() => setIsYearly(false)}
              className={`text-xs font-bold cursor-pointer transition-colors ${
                !isYearly ? 'text-[#0F172A]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Facturation Mensuelle
            </span>

            <button
              type="button"
              aria-label="Basculer le cycle de facturation"
              onClick={() => setIsYearly(!isYearly)}
              className="w-14 h-8 bg-slate-900 rounded-full p-1 transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              <div
                className={`w-6 h-6 rounded-full bg-[#F94F06] shadow-md transition-transform duration-200 flex items-center justify-center text-[10px] text-white font-black ${
                  isYearly ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {isYearly ? '12' : '1'}
              </div>
            </button>

            <div className="flex items-center gap-1.5">
              <span
                onClick={() => setIsYearly(true)}
                className={`text-xs font-bold cursor-pointer transition-colors ${
                  isYearly ? 'text-[#0F172A]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Facturation Annuelle
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 animate-pulse">
                -2 mois offerts 🎁
              </span>
            </div>
          </div>
        </div>

        {/* 3 CARTES DE TARIFS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const price = isYearly ? plan.priceYearly : plan.priceMonthly;
            const formattedPrice =
              price === 0 ? '0' : price.toLocaleString('fr-FR');
            const periodText =
              price === 0
                ? 'FCFA / 14 jours'
                : isYearly
                ? 'FCFA / an'
                : 'FCFA / mois';

            if (plan.popular) {
              return (
                /* CARTE PRO AGENCY (MISE EN AVANT) */
                <div
                  key={plan.id}
                  className="bg-white/95 backdrop-blur-xl rounded-3xl p-7 sm:p-8 border-2 border-[#F94F06] shadow-2xl shadow-orange-500/20 flex flex-col justify-between space-y-6 relative transform md:-translate-y-2 transition-all hover:shadow-orange-500/30"
                >
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F94F06] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                    {plan.badge}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-black uppercase tracking-wider text-[#F94F06]">
                        {plan.name}
                      </span>
                      <span className="text-[10px] font-black bg-orange-50 text-[#F94F06] border border-orange-200 px-2.5 py-0.5 rounded-full">
                        Recommandé
                      </span>
                    </div>

                    <div>
                      <div className="text-3xl sm:text-4xl font-black text-[#0F172A]">
                        {formattedPrice}{' '}
                        <span className="text-sm font-normal text-slate-500">
                          {periodText}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {isYearly
                          ? '150 000 FCFA facturés par an (Économisez 30 000 FCFA)'
                          : plan.tagline}
                      </p>
                    </div>

                    <ul className="space-y-3 text-xs text-slate-800 font-semibold pt-3 border-t border-orange-100">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2.5">
                          <div className="w-4 h-4 rounded-full bg-orange-500/10 text-[#F94F06] flex items-center justify-center shrink-0 font-bold">
                            <Check className="w-3 h-3 text-[#F94F06]" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePlanSelection(plan)}
                    className="w-full py-4 px-5 rounded-2xl text-xs font-black bg-[#F94F06] hover:bg-[#e04605] text-white shadow-xl shadow-orange-500/30 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            }

            return (
              /* CARTES STARTER & SCALE */
              <div
                key={plan.id}
                className="bg-white/90 backdrop-blur-md rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-black uppercase tracking-wider ${
                        plan.id === 'scale'
                          ? 'text-purple-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {plan.name}
                    </span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                      {plan.badge}
                    </span>
                  </div>

                  <div>
                    <div className="text-3xl sm:text-4xl font-black text-[#0F172A]">
                      {formattedPrice}{' '}
                      <span className="text-sm font-normal text-slate-400">
                        {periodText}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {isYearly && plan.priceYearly > 0
                        ? `${plan.priceYearly.toLocaleString('fr-FR')} FCFA facturés par an`
                        : plan.tagline}
                    </p>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-700 font-medium pt-3 border-t border-slate-100">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlanSelection(plan)}
                  className={`w-full py-3.5 px-4 rounded-2xl text-xs font-black transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${
                    plan.id === 'scale'
                      ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-[#0F172A]'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
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
    </section>
  );
}

export default PricingSection;
