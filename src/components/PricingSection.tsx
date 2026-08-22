'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

export const PLANS = [
  {
    id: 'starter',
    name: 'Découverte',
    badge: 'Essai Gratuit',
    priceMonthly: 0,
    priceYearly: 0,
    description: 'Pour tester la validation WhatsApp et vos premiers posts.',
    features: [
      '1 Workspace client inclus',
      'Jusqu’à 10 publications / mois',
      'Validation WhatsApp interactive',
      'Aperçu réaliste Instagram & Facebook'
    ],
    ctaText: 'Commencer gratuitement',
    highlight: false
  },
  {
    id: 'pro',
    name: 'Pro Agency',
    badge: 'Le Plus Populaire 🔥',
    priceMonthly: 15000,
    priceYearly: 150000,
    description: 'La solution complète pour les CM et agences gérant plusieurs comptes.',
    features: [
      'Jusqu’à 10 Workspaces clients',
      'Publications & Médias illimités',
      'Rapports d’analyse PDF automatisés',
      'Publication automatique Meta & TikTok',
      'Support prioritaire sur WhatsApp'
    ],
    ctaText: 'Choisir la Formule Pro',
    highlight: true
  },
  {
    id: 'scale',
    name: 'Scale Agence',
    badge: 'Grands Comptes',
    priceMonthly: 35000,
    priceYearly: 350000,
    description: 'Pour les équipes avec des besoins multi-marques avancés.',
    features: [
      'Workspaces clients illimités',
      'Comptes CM & Rôles illimités',
      'Marque blanche totale (votre logo)',
      'Intégration API & Webhooks dédiés',
      'Accompagnement VIP'
    ],
    ctaText: 'Passer à la vitesse supérieure',
    highlight: false
  }
];

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const cycle = isYearly ? 'yearly' : 'monthly';

  return (
    <section className="py-20 px-4 bg-[#F8FAFC] relative z-10" id="tarifs">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-[#F94F06] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Tarification Simple
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#0F172A]">
            Choisissez votre formule
          </h2>
          
          {/* Switch Mensuel / Annuel */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs md:text-sm font-semibold ${!isYearly ? 'text-[#0F172A]' : 'text-slate-400'}`}>
              Mensuel
            </span>
            <button
              type="button"
              onClick={() => setIsYearly(!isYearly)}
              className="w-14 h-8 bg-slate-200 rounded-full p-1 transition-colors relative cursor-pointer"
            >
              <div
                className={`w-6 h-6 rounded-full bg-[#F94F06] transition-transform shadow-md ${
                  isYearly ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs md:text-sm font-semibold flex items-center gap-1.5 ${isYearly ? 'text-[#0F172A]' : 'text-slate-400'}`}>
              Annuel
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                -2 mois offerts
              </span>
            </span>
          </div>
        </div>

        {/* Grille des Cartes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch relative z-20">
          {PLANS.map((plan) => {
            const price = isYearly ? plan.priceYearly : plan.priceMonthly;
            const targetUrl = `/register?plan=${plan.id}&cycle=${cycle}`;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-200 ${
                  plan.highlight
                    ? 'bg-white border-2 border-[#F94F06] shadow-xl md:-translate-y-2'
                    : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F94F06] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A]">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-[#0F172A] tracking-tight">
                      {price === 0 ? 'Gratuit' : `${price.toLocaleString('fr-FR')} FCFA`}
                    </span>
                    {price > 0 && (
                      <span className="text-xs font-semibold text-slate-400">
                        {isYearly ? '/ an' : '/ mois'}
                      </span>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-6 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                        <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lien Direct Natif Next.js (Infaillible) */}
                <div className="pt-8">
                  <Link
                    href={targetUrl}
                    className={`w-full py-3.5 px-5 rounded-2xl font-bold text-xs tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                      plan.highlight
                        ? 'bg-[#F94F06] hover:bg-[#e04605] text-white shadow-lg shadow-orange-500/25 active:scale-[0.98]'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-[0.98]'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
