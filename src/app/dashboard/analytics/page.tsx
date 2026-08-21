'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  TrendingUp,
  Users,
  Eye,
  MessageCircle,
  Share2,
  Calendar,
  Sparkles,
  FileDown,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Award,
  ChevronRight,
  Filter,
  CheckCircle2,
  Heart,
  Bookmark,
  Send,
  X,
  ExternalLink,
  Printer,
  Check,
  Smartphone,
  Layers,
  Flame,
  Globe,
  Loader2,
  PlusCircle,
  Lock
} from 'lucide-react';
import { useWorkspace, Workspace, SocialNetworkMetrics } from '../../../context/WorkspaceContext';

export type PeriodType = '7d' | '30d' | 'prev_month';

interface SocialChannelConfig {
  key: 'instagram' | 'facebook' | 'tiktok' | 'linkedin';
  name: string;
  badgeClass: string;
  iconBg: string;
  shortIcon: string;
}

const CHANNEL_CONFIGS: SocialChannelConfig[] = [
  {
    key: 'instagram',
    name: 'Instagram',
    badgeClass: 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-pink-600 border border-pink-500/20',
    iconBg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600',
    shortIcon: 'IG',
  },
  {
    key: 'facebook',
    name: 'Facebook',
    badgeClass: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
    iconBg: 'bg-[#1877F2]',
    shortIcon: 'FB',
  },
  {
    key: 'tiktok',
    name: 'TikTok',
    badgeClass: 'bg-slate-900/5 text-slate-900 border border-slate-900/15',
    iconBg: 'bg-[#0F172A]',
    shortIcon: 'TT',
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    badgeClass: 'bg-sky-500/10 text-sky-600 border border-sky-500/20',
    iconBg: 'bg-[#0A66C2]',
    shortIcon: 'IN',
  },
];

export default function AnalyticsPage() {
  const { activeWorkspace } = useWorkspace();

  // États
  const [period, setPeriod] = useState<PeriodType>('30d');
  const [activePointIndex, setActivePointIndex] = useState<number>(8);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFading, setIsFading] = useState(false);

  // Micro-transition lors du changement de client
  useEffect(() => {
    setIsFading(true);
    const t = setTimeout(() => setIsFading(false), 200);
    return () => clearTimeout(t);
  }, [activeWorkspace.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Copier le Bilan Flash WhatsApp dynamique
  const handleCopyWhatsAppReport = () => {
    const topPost = activeWorkspace.topPosts[0];
    const text = `📊 *BILAN MENSUEL DE PERFORMANCE — ${activeWorkspace.name.toUpperCase()}* ${activeWorkspace.flag}\n` +
      `📅 Période : 30 Derniers Jours (Août 2026)\n\n` +
      `👥 *Audience Cumulée :* ${activeWorkspace.globalMetrics.totalAudience} abonnés (${activeWorkspace.globalMetrics.audienceChange})\n` +
      `👁️ *Impressions Totales :* ${activeWorkspace.globalMetrics.totalImpressions} vues (${activeWorkspace.globalMetrics.impressionsChange} 🚀)\n` +
      `💬 *Taux d'Engagement Moyen :* ${activeWorkspace.globalMetrics.engagementRate} (${activeWorkspace.globalMetrics.engagementStatus})\n` +
      `⚡ *Publications Réalisées :* ${activeWorkspace.globalMetrics.completedPosts} posts validés\n\n` +
      (topPost ? `🏆 *Top Publication :* ${topPost.title} (${topPost.views} vues · ${topPost.likes} likes)\n\n` : '') +
      `_Rapport officiel généré par votre Community Manager via CMFlow._`;

    navigator.clipboard.writeText(text);
    showToast(`💬 Bilan Flash de ${activeWorkspace.name} copié ! Prêt à envoyer sur WhatsApp.`);
  };

  // Télécharger le rapport PDF dynamique
  const handleDownloadPdf = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setIsPdfModalOpen(false);
      showToast(`📄 Rapport_CMFlow_${activeWorkspace.slug}_Aout_2026.pdf généré avec succès !`);
    }, 1800);
  };

  const chartPoints = activeWorkspace.chartData || [];
  const activePoint = chartPoints[activePointIndex] || chartPoints[0] || {
    day: '21 Août',
    impressions: 9800,
    reach: 8100,
    engagement: 890,
  };

  // Calcul du tracé SVG interactif
  const svgWidth = 800;
  const svgHeight = 220;
  const maxImp = Math.max(...chartPoints.map((p) => p.impressions), 10000) * 1.15;

  const pointsImp = chartPoints
    .map((p, i) => {
      const x = (i / Math.max(chartPoints.length - 1, 1)) * (svgWidth - 40) + 20;
      const y = svgHeight - (p.impressions / maxImp) * (svgHeight - 40) - 20;
      return `${x},${y}`;
    })
    .join(' ');

  const pointsReach = chartPoints
    .map((p, i) => {
      const x = (i / Math.max(chartPoints.length - 1, 1)) * (svgWidth - 40) + 20;
      const y = svgHeight - (p.reach / maxImp) * (svgHeight - 40) - 20;
      return `${x},${y}`;
    })
    .join(' ');

  const areaImp = `20,${svgHeight - 20} ${pointsImp} ${svgWidth - 20},${svgHeight - 20}`;
  const areaReach = `20,${svgHeight - 20} ${pointsReach} ${svgWidth - 20},${svgHeight - 20}`;

  return (
    <div className={`p-6 md:p-8 max-w-7xl mx-auto space-y-8 transition-opacity duration-200 ${isFading ? 'opacity-50' : 'opacity-100'}`}>
      
      {/* Toast Flottant */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A]/95 backdrop-blur-xl text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700/80 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#F94F06]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =======================================================================
          A. EN-TÊTE DE SECTION AÉRÉE (HEADER UI)
          ======================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
              Performances & Reporting Client
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              {activeWorkspace.name} {activeWorkspace.flag}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1.5">
            Suivi temps réel de la croissance, du taux d'engagement et génération du bilan mensuel marque blanche pour <strong className="text-slate-800">{activeWorkspace.name}</strong>.
          </p>
        </div>

        {/* Contrôles Période & Boutons d'Action */}
        <div className="flex items-center flex-wrap gap-3">
          
          {/* Sélecteur de période en pilule */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-2xs text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setPeriod('7d')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                period === '7d'
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              7 jours
            </button>
            <button
              type="button"
              onClick={() => setPeriod('30d')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                period === '30d'
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              30 derniers jours
            </button>
            <button
              type="button"
              onClick={() => setPeriod('prev_month')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                period === 'prev_month'
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Mois précédent
            </button>
          </div>

          {/* Bouton Bilan Flash WhatsApp */}
          <button
            type="button"
            onClick={handleCopyWhatsAppReport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 border border-emerald-500/30 shadow-emerald-500/10 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
            title="Copier le résumé exécutif pour WhatsApp"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Bilan Flash WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </button>

          {/* Bouton Télécharger le Rapport PDF */}
          <button
            type="button"
            onClick={() => setIsPdfModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold bg-[#F94F06] hover:bg-[#e04605] text-white shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Télécharger le Rapport PDF</span>
          </button>

        </div>
      </div>

      {/* =======================================================================
          B. CARTES KPIS GLOBALES EN HAUT (4 MINI-BENTO CARDS DYNAMIQUES)
          ======================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1 : Audience */}
        <div className="bg-white border border-slate-200/70 rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_30px_-6px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Audience Cumulée</span>
            <div className="w-9 h-9 rounded-2xl bg-orange-500/10 flex items-center justify-center text-[#F94F06] group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
              {activeWorkspace.globalMetrics.totalAudience}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{activeWorkspace.globalMetrics.audienceChange}</span>
            </div>
          </div>
        </div>

        {/* KPI 2 : Impressions */}
        <div className="bg-white border border-slate-200/70 rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_30px_-6px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Impressions Totales</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-500/10 flex items-center justify-center text-[#0066FF] group-hover:scale-110 transition-transform">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
              {activeWorkspace.globalMetrics.totalImpressions}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{activeWorkspace.globalMetrics.impressionsChange}</span>
            </div>
          </div>
        </div>

        {/* KPI 3 : Engagement */}
        <div className="bg-white border border-slate-200/70 rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_30px_-6px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Taux d'Engagement Global</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
              {activeWorkspace.globalMetrics.engagementRate}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-700 bg-emerald-50 w-fit px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>{activeWorkspace.globalMetrics.engagementStatus}</span>
            </div>
          </div>
        </div>

        {/* KPI 4 : Publications */}
        <div className="bg-white border border-slate-200/70 rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_30px_-6px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Publications Réalisées</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
              {activeWorkspace.globalMetrics.completedPosts} posts
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-purple-700 bg-purple-50 w-fit px-2.5 py-0.5 rounded-full border border-purple-200/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
              <span>{activeWorkspace.globalMetrics.validationRate}</span>
            </div>
          </div>
        </div>

      </div>

      {/* =======================================================================
          C. GRILLE BENTO DES RÉSEAUX SOCIAUX (DYNAMIQUE + ÉTAT DÉCONNECTÉ)
          ======================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#F94F06]" />
            <span>Répartition & Performances par Canal ({activeWorkspace.name})</span>
          </h2>
          <span className="text-xs font-medium text-slate-400">
            {Object.values(activeWorkspace.networks).filter((n) => n.connected).length} comptes connectés
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {CHANNEL_CONFIGS.map((cfg) => {
            const net = activeWorkspace.networks[cfg.key];

            // Si le canal n'est pas connecté pour ce client
            if (!net || !net.connected) {
              return (
                <div
                  key={cfg.key}
                  className="bg-slate-50/70 border border-dashed border-slate-300/80 rounded-3xl p-6 flex flex-col justify-between items-center text-center group hover:bg-white hover:border-slate-400/80 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg ${cfg.iconBg} opacity-50 text-white flex items-center justify-center font-bold text-xs`}>
                        {cfg.shortIcon}
                      </div>
                      <span className="text-xs font-bold text-slate-400">{cfg.name}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">
                      Inactif
                    </span>
                  </div>

                  <div className="my-6 space-y-1.5">
                    <div className="w-10 h-10 rounded-2xl bg-slate-200/80 text-slate-400 flex items-center justify-center mx-auto">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-slate-600">Canal non lié</div>
                    <div className="text-[11px] text-slate-400 max-w-[180px]">
                      Ce réseau n'est pas encore associé à {activeWorkspace.name}.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert(`Connexion du canal ${cfg.name} pour ${activeWorkspace.name}`)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 hover:border-[#F94F06] hover:bg-orange-50/50 hover:text-[#F94F06] text-slate-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Connecter ce canal</span>
                  </button>
                </div>
              );
            }

            // Canal connecté
            return (
              <div
                key={cfg.key}
                className="bg-white border border-slate-200/70 rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_30px_-6px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out flex flex-col justify-between"
              >
                <div>
                  {/* Header Réseau */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl ${cfg.iconBg} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                        {cfg.shortIcon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0F172A]">{cfg.name}</div>
                        <div className="text-[10px] text-slate-400">{net.followersChange}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badgeClass}`}>
                      Connecté
                    </span>
                  </div>

                  {/* Métriques Clés Réseau */}
                  <div className="grid grid-cols-2 gap-3 my-4">
                    <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                      <div className="text-[10px] font-medium text-slate-500">Abonnés</div>
                      <div className="text-base font-bold text-[#0F172A] mt-0.5">{net.followers}</div>
                    </div>
                    <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                      <div className="text-[10px] font-medium text-slate-500">Impressions</div>
                      <div className="text-base font-bold text-[#0F172A] mt-0.5">{net.impressions}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold py-1.5 px-2 bg-emerald-50/60 rounded-xl text-emerald-800 border border-emerald-100">
                    <span>Taux d'Engagement</span>
                    <span className="font-bold">{net.engagement}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 mt-2 px-1">
                    <span>{net.secondaryMetricName}</span>
                    <span className="font-semibold text-slate-700">{net.secondaryMetricValue}</span>
                  </div>
                </div>

                {/* Jauge de répartition de contenu */}
                {net.breakdown && net.breakdown.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-[10px] font-medium text-slate-400 mb-1.5 flex items-center justify-between">
                      <span>Format dominant</span>
                      <span className="text-slate-700 font-semibold">
                        {net.breakdown[0].label} ({net.breakdown[0].percent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                      {net.breakdown.map((b, idx) => (
                        <div
                          key={idx}
                          style={{ width: `${b.percent}%` }}
                          className={`h-full ${b.color} rounded-full`}
                          title={`${b.label}: ${b.percent}%`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =======================================================================
          D. GRAPHIQUE D'ÉVOLUTION DOUBLE COURBE (IMPRESSIONS VS PORTÉE UNIQUE)
          ======================================================================= */}
      <div className="bg-white border border-slate-200/70 rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_30px_-6px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out space-y-6">
        
        {/* En-tête du Graphique */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#F94F06]" />
              <span>Courbes de Portée Globale & Fréquence de Vues ({activeWorkspace.name})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Survolez les points pour analyser le volume d'impressions brutes et la portée unique cumulée.
            </p>
          </div>

          {/* Légende Interactive */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#F94F06] shadow-sm"></span>
              <span className="text-slate-700">Impressions Totales ({activeWorkspace.globalMetrics.totalImpressions})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#0F172A] shadow-sm"></span>
              <span className="text-slate-700">Portée Unique (Reach)</span>
            </div>
          </div>
        </div>

        {/* Détail du Point Actif Survolé */}
        <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl shadow-md border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F94F06]/20 border border-[#F94F06]/40 flex items-center justify-center font-bold text-[#F94F06]">
              📅
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Point sélectionné</div>
              <div className="text-sm sm:text-base font-bold text-white">{activePoint.day} 2026</div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-right sm:text-left">
            <div>
              <div className="text-[10px] text-slate-400">Impressions</div>
              <div className="text-sm sm:text-base font-bold text-[#F94F06]">
                {activePoint.impressions.toLocaleString()} vues
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-[10px] text-slate-400">Portée Unique</div>
              <div className="text-sm sm:text-base font-bold text-sky-400">
                {activePoint.reach.toLocaleString()} personnes
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-[10px] text-slate-400">Interactions</div>
              <div className="text-sm sm:text-base font-bold text-emerald-400">
                +{activePoint.engagement} réactions
              </div>
            </div>
          </div>
        </div>

        {/* Canvas SVG Tracé Double Aire Dégradée */}
        <div className="relative w-full overflow-hidden pt-4 pb-2">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-48 sm:h-64 overflow-visible"
          >
            <defs>
              <linearGradient id="gradientImpDyn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F94F06" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#F94F06" stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id="gradientReachDyn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F172A" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0F172A" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Lignes de repère horizontales */}
            <line x1="20" y1="40" x2={svgWidth - 20} y2="40" stroke="#E2E8F0" strokeDasharray="4 4" />
            <line x1="20" y1="100" x2={svgWidth - 20} y2="100" stroke="#E2E8F0" strokeDasharray="4 4" />
            <line x1="20" y1="160" x2={svgWidth - 20} y2="160" stroke="#E2E8F0" strokeDasharray="4 4" />

            {/* Aires dégradées */}
            <polygon points={areaImp} fill="url(#gradientImpDyn)" />
            <polygon points={areaReach} fill="url(#gradientReachDyn)" />

            {/* Courbe Reach */}
            <polyline
              fill="none"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsReach}
            />

            {/* Courbe Impressions */}
            <polyline
              fill="none"
              stroke="#F94F06"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsImp}
            />

            {/* Points interactifs */}
            {chartPoints.map((p, idx) => {
              const cx = (idx / Math.max(chartPoints.length - 1, 1)) * (svgWidth - 40) + 20;
              const cyImp = svgHeight - (p.impressions / maxImp) * (svgHeight - 40) - 20;
              const isSelected = activePointIndex === idx;

              return (
                <g
                  key={idx}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setActivePointIndex(idx)}
                >
                  {isSelected && (
                    <line
                      x1={cx}
                      y1="20"
                      x2={cx}
                      y2={svgHeight - 20}
                      stroke="#F94F06"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  <circle
                    cx={cx}
                    cy={cyImp}
                    r={isSelected ? 7 : 4}
                    fill={isSelected ? '#F94F06' : '#FFFFFF'}
                    stroke="#F94F06"
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all duration-150"
                  />
                </g>
              );
            })}
          </svg>

          {/* Axe X (Jours) */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 px-2 mt-2">
            <span>01 Août</span>
            <span>09 Août</span>
            <span>14 Août</span>
            <span>21 Août</span>
            <span>30 Août</span>
          </div>
        </div>

      </div>

      {/* =======================================================================
          E. SECTION TOP PUBLICATIONS DU CLIENT ACTIF
          ======================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#F94F06]" />
            <span>Top Publications du Mois ({activeWorkspace.name})</span>
          </h2>
          <span className="text-xs font-medium text-slate-400">Classées par score d'impact</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {activeWorkspace.topPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-slate-200/70 rounded-3xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_30px_-6px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out flex flex-col justify-between group"
            >
              {/* Miniature avec Badge Ranking */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-[#0F172A] shadow-md">
                  {post.rankBadge}
                </div>

                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md ${post.networkBadge}`}>
                  {post.network}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-white/80" />
                    {post.views}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 bg-black/40 px-2 py-0.5 rounded-lg backdrop-blur-xs">
                    <Sparkles className="w-3 h-3" />
                    {post.engagementRate} eng.
                  </span>
                </div>
              </div>

              {/* Corps du post */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Publié le {post.date}
                  </div>
                  <h3 className="text-xs font-bold text-[#0F172A] mt-1.5 line-clamp-2 group-hover:text-[#F94F06] transition-colors">
                    {post.title}
                  </h3>
                </div>

                {/* Compteurs d'interactions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                    {post.comments}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                    {post.shares}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* =======================================================================
          F. MODALE DE PRÉVISUALISATION & MOTEUR D'EXPORT PDF DYNAMIQUE
          ======================================================================= */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
          
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
            
            {/* Header de la Modale */}
            <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-[#F94F06]">
                  <FileDown className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
                    Prévisualisation du Rapport PDF • {activeWorkspace.name} {activeWorkspace.flag}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fichier généré : <code className="text-slate-700 bg-slate-200/70 px-1.5 py-0.5 rounded font-mono text-[11px]">Rapport_{activeWorkspace.slug}_Aout_2026.pdf</code>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPdfModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contenu Défilable du Document A4 */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-100/60 space-y-6">
              
              {/* Feuille de Style A4 Visuelle */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-[#0F172A] font-sans">
                
                {/* En-tête Marque Blanche du Document */}
                <div className="flex items-center justify-between pb-5 border-b-2 border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeWorkspace.avatar}
                      alt={activeWorkspace.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <h2 className="text-lg font-black text-[#0F172A] flex items-center gap-1.5">
                        {activeWorkspace.name} {activeWorkspace.flag}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {activeWorkspace.industry} • Bilan Mensuel Août 2026
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 text-white rounded-xl text-xs font-black tracking-tight">
                      ⚡ CMFlow <span className="text-[#F94F06]">PRO</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Édition Agence Certifiée</div>
                  </div>
                </div>

                {/* Synthèse Exécutive (4 Boîtes Chiffrées) */}
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Synthèse des KPI Globaux (Août 2026)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                      <div className="text-[11px] font-medium text-slate-500">Abonnés Cumulés</div>
                      <div className="text-lg font-extrabold text-[#0F172A] mt-0.5">
                        {activeWorkspace.globalMetrics.totalAudience}
                      </div>
                      <div className="text-[10px] font-semibold text-emerald-600">
                        {activeWorkspace.globalMetrics.audienceChange}
                      </div>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                      <div className="text-[11px] font-medium text-slate-500">Impressions Vues</div>
                      <div className="text-lg font-extrabold text-[#0F172A] mt-0.5">
                        {activeWorkspace.globalMetrics.totalImpressions}
                      </div>
                      <div className="text-[10px] font-semibold text-emerald-600">
                        {activeWorkspace.globalMetrics.impressionsChange}
                      </div>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                      <div className="text-[11px] font-medium text-slate-500">Engagement Moyen</div>
                      <div className="text-lg font-extrabold text-[#0F172A] mt-0.5">
                        {activeWorkspace.globalMetrics.engagementRate}
                      </div>
                      <div className="text-[10px] font-semibold text-emerald-600">
                        ⭐ {activeWorkspace.globalMetrics.engagementStatus}
                      </div>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                      <div className="text-[11px] font-medium text-slate-500">Posts Réalisés</div>
                      <div className="text-lg font-extrabold text-[#0F172A] mt-0.5">
                        {activeWorkspace.globalMetrics.completedPosts} posts
                      </div>
                      <div className="text-[10px] font-semibold text-purple-600">
                        {activeWorkspace.globalMetrics.validationRate}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tableau Détaillé par Canal */}
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Détail des Performances par Réseau Social
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">Canal</th>
                          <th className="p-3">Abonnés</th>
                          <th className="p-3">Impressions</th>
                          <th className="p-3">Taux d'Engagement</th>
                          <th className="p-3">Statut ROI</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {CHANNEL_CONFIGS.map((cfg) => {
                          const net = activeWorkspace.networks[cfg.key];
                          if (!net || !net.connected) {
                            return (
                              <tr key={cfg.key} className="opacity-50">
                                <td className="p-3 font-bold text-slate-400">{cfg.name}</td>
                                <td className="p-3 text-slate-400">—</td>
                                <td className="p-3 text-slate-400">—</td>
                                <td className="p-3 text-slate-400">—</td>
                                <td className="p-3"><span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold">Non Connecté</span></td>
                              </tr>
                            );
                          }
                          return (
                            <tr key={cfg.key}>
                              <td className="p-3 font-bold text-[#0F172A]">{cfg.name}</td>
                              <td className="p-3">{net.followers}</td>
                              <td className="p-3">{net.impressions}</td>
                              <td className="p-3 font-semibold text-emerald-600">{net.engagement}</td>
                              <td className="p-3"><span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold">Optimal</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section Top Publications en vignettes */}
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Contenus Phares du Mois ({activeWorkspace.name})
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {activeWorkspace.topPosts.map((p) => (
                      <div key={p.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex gap-2.5 items-center">
                        <img src={p.thumbnail} alt={p.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-[#0F172A] truncate">{p.title}</div>
                          <div className="text-[10px] text-slate-500">{p.views} vues • {p.engagementRate} eng.</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes & Conclusion du Community Manager */}
                <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200/60">
                  <div className="text-xs font-bold text-[#F94F06] mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Recommandations Stratégiques pour {activeWorkspace.name}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Excellente dynamique ce mois-ci avec une hausse de {activeWorkspace.globalMetrics.impressionsChange} des impressions globales. Le taux d'engagement moyen ({activeWorkspace.globalMetrics.engagementRate}) confirme la pertinence des contenus produits. Recommandation pour le mois prochain : continuer d'exploiter les formats courts et les hashtags de marque ({activeWorkspace.brandKit.hashtags.slice(0, 3).join(', ')}).
                  </p>
                </div>

                {/* Pied de Page Officiel */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <div>
                    Responsable de compte : <strong className="text-slate-700">Awa Diop (Lead CM · Dakar 🇸🇳)</strong>
                  </div>
                  <div>
                    WhatsApp : {activeWorkspace.whatsappNumber} • Généré via CMFlow
                  </div>
                </div>

              </div>

            </div>

            {/* Footer d'Actions de la Modale */}
            <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Format A4 certifié marque blanche pour {activeWorkspace.name}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Fermer
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold bg-[#F94F06] hover:bg-[#e04605] text-white shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all disabled:opacity-75 cursor-pointer"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Génération de Rapport_{activeWorkspace.slug}.pdf...</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4" />
                      <span>Confirmer & Télécharger le fichier PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
