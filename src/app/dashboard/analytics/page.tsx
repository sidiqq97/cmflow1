'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  TrendingUp,
  Users,
  Eye,
  MessageCircle,
  Share2,
  Calendar,
  Sparkles,
  Download,
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
  ExternalLink
} from 'lucide-react';
import { useClient } from '../../../context/ClientContext';

// Types
export type PeriodType = '7d' | '30d' | 'prev_month';
export type ChannelFilter = 'all' | 'instagram' | 'facebook' | 'tiktok' | 'linkedin';

export interface TopPostItem {
  id: string;
  rank: number;
  rankBadge: string;
  title: string;
  network: string;
  thumbnail: string;
  date: string;
  views: string;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: string;
}

const TOP_POSTS: TopPostItem[] = [
  {
    id: 'top-1',
    rank: 1,
    rankBadge: '🏆 #1 Meilleur Reach',
    title: 'Reel : La véritable recette du Thiéboudienne Royal Penda Mbaye',
    network: 'Instagram Reel',
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    date: '14 Août 2026',
    views: '48.2k',
    likes: 2420,
    comments: 184,
    shares: 320,
    engagementRate: '8.4%',
  },
  {
    id: 'top-2',
    rank: 2,
    rankBadge: '🥈 #2 Plus Partagé',
    title: 'Carrousel : Formule Brunch Dimanche & Cocktails Bissap Frais',
    network: 'Facebook & IG',
    thumbnail: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&auto=format&fit=crop&q=80',
    date: '18 Août 2026',
    views: '24.1k',
    likes: 1280,
    comments: 96,
    shares: 180,
    engagementRate: '6.9%',
  },
  {
    id: 'top-3',
    rank: 3,
    rankBadge: '🥉 #3 Plus Viral',
    title: 'Vidéo : Coulisses de la préparation des pastels au mérou frais',
    network: 'TikTok Video',
    thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80',
    date: '20 Août 2026',
    views: '62.4k',
    likes: 4850,
    comments: 312,
    shares: 410,
    engagementRate: '7.5%',
  },
];

// Points de données pour le tracé SVG
const CHART_POINTS = [
  { day: '01', reach: 1200, eng: 180 },
  { day: '04', reach: 1800, eng: 260 },
  { day: '08', reach: 2400, eng: 340 },
  { day: '12', reach: 2100, eng: 310 },
  { day: '16', reach: 3800, eng: 590 },
  { day: '20', reach: 3200, eng: 480 },
  { day: '24', reach: 4500, eng: 720 },
  { day: '28', reach: 4100, eng: 680 },
  { day: '30', reach: 4820, eng: 810 },
];

export default function AnalyticsPage() {
  const { activeClient } = useClient();

  // États
  const [period, setPeriod] = useState<PeriodType>('30d');
  const [channel, setChannel] = useState<ChannelFilter>('all');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Flottant */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A]/95 backdrop-blur-xl text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#F94F06]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =======================================================================
          A. EN-TÊTE DE PAGE & CONTRÔLES TEMPORELS
          ======================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200/70 shadow-xs">
        
        {/* Titre & Client Actif */}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              Performances & Impact
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-orange-50 text-[#F94F06] border border-orange-200/80 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F94F06]"></span>
              {activeClient.name} {activeClient.flag}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Suivez la portée, l'engagement et l'efficacité de vos publications multi-canaux.
          </p>
        </div>

        {/* Contrôles Période & Bouton Bilan WhatsApp */}
        <div className="flex items-center flex-wrap gap-2.5">
          
          {/* Sélecteur Période */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/70 text-xs font-bold">
            <button
              type="button"
              onClick={() => setPeriod('7d')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                period === '7d' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              7 jours
            </button>
            <button
              type="button"
              onClick={() => setPeriod('30d')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                period === '30d' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              30 jours
            </button>
            <button
              type="button"
              onClick={() => setPeriod('prev_month')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                period === 'prev_month' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Mois dernier
            </button>
          </div>

          {/* Bouton Principal Orange : Bilan WhatsApp */}
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F94F06] hover:bg-[#e04605] text-white text-xs font-black rounded-2xl shadow-lg shadow-[#F94F06]/25 hover:shadow-[#F94F06]/40 active:scale-[0.98] transition-all"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span>Générer Bilan WhatsApp (1 Clic)</span>
          </button>

        </div>
      </div>

      {/* Barre des Filtres par Réseau Social */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold text-slate-600">
        <button
          type="button"
          onClick={() => setChannel('all')}
          className={`px-3.5 py-1.5 rounded-xl border transition-all ${
            channel === 'all'
              ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Tous les canaux (142k)
        </button>

        <button
          type="button"
          onClick={() => setChannel('instagram')}
          className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
            channel === 'instagram'
              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>📸 Instagram (55%)</span>
        </button>

        <button
          type="button"
          onClick={() => setChannel('facebook')}
          className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
            channel === 'facebook'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>📘 Facebook (28%)</span>
        </button>

        <button
          type="button"
          onClick={() => setChannel('tiktok')}
          className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
            channel === 'tiktok'
              ? 'bg-black text-white border-black shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>🎵 TikTok (12%)</span>
        </button>
      </div>

      {/* =======================================================================
          B. CARTES KPIS CLÉS (4 CARTES HAUT DE GAMME)
          ======================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 : Portée Totale */}
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Portée Totale (Reach)
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              48.2K <span className="text-xs font-normal text-slate-400">personnes</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-extrabold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.2% vs mois précédent</span>
            </div>
          </div>
        </div>

        {/* KPI 2 : Engagement */}
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Engagement Moyen
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F94F06] flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              5.8% <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">+0.8%</span>
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-1">
              Au-dessus de la moyenne de secteur
            </div>
          </div>
        </div>

        {/* KPI 3 : Croissance Communauté */}
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Croissance Communauté
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              +340 <span className="text-xs font-normal text-slate-400">abonnés</span>
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-1">
              Total : 12.4K abonnés cumulés
            </div>
          </div>
        </div>

        {/* KPI 4 : Fluidité de Validation CM */}
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Fluidité Validation CM
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              94% <span className="text-xs font-normal text-slate-400">au 1er envoi</span>
            </div>
            <div className="text-xs text-emerald-600 font-extrabold mt-1">
              Temps moyen réponse : 42 min
            </div>
          </div>
        </div>

      </div>

      {/* =======================================================================
          C. SECTION GRAPHIQUE PRINCIPALE (2 COLONNES)
          ======================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Colonne Gauche (60%) : Évolution Temporelle */}
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-[#0F172A]">
                Évolution de la Portée & des Interactions
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Volume cumulé sur les 30 derniers jours
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1 text-[#F94F06]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F94F06]"></span> Portée
              </span>
              <span className="flex items-center gap-1 text-[#10B981]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span> Interactions
              </span>
            </div>
          </div>

          {/* Graphique SVG Épuré */}
          <div className="h-56 w-full relative pt-4">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F94F06" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#F94F06" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Lignes de repère */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#F1F5F9" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#F1F5F9" strokeDasharray="4 4" />
              <line x1="0" y1="160" x2="500" y2="160" stroke="#F1F5F9" strokeDasharray="4 4" />

              {/* Aire Portée */}
              <path
                d="M 0,160 Q 60,130 120,110 T 250,70 T 380,40 T 500,20 L 500,200 L 0,200 Z"
                fill="url(#reachGrad)"
              />
              <path
                d="M 0,160 Q 60,130 120,110 T 250,70 T 380,40 T 500,20"
                fill="none"
                stroke="#F94F06"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Aire Engagement */}
              <path
                d="M 0,180 Q 60,160 120,140 T 250,110 T 380,80 T 500,60 L 500,200 L 0,200 Z"
                fill="url(#engGrad)"
              />
              <path
                d="M 0,180 Q 60,160 120,140 T 250,110 T 380,80 T 500,60"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Points interactifs */}
              <circle cx="500" cy="20" r="5" fill="#F94F06" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="500" cy="60" r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
            </svg>

            <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100">
              <span>01 Août</span>
              <span>08 Août</span>
              <span>15 Août</span>
              <span>22 Août</span>
              <span>30 Août</span>
            </div>
          </div>
        </div>

        {/* Colonne Droite (40%) : Répartition par Réseau */}
        <div className="lg:col-span-5 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-black text-[#0F172A]">
              Répartition par Canal Social
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Origine de vos 48.2k personnes touchées
            </p>
          </div>

          <div className="space-y-3.5">
            {/* Instagram */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-extrabold">
                <span className="text-purple-600 flex items-center gap-1.5">📸 Instagram (Feed & Reels)</span>
                <span className="text-[#0F172A]">55% · 26.5k</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '55%' }}></div>
              </div>
            </div>

            {/* Facebook */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-extrabold">
                <span className="text-blue-600 flex items-center gap-1.5">📘 Facebook</span>
                <span className="text-[#0F172A]">28% · 13.5k</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>

            {/* TikTok */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-extrabold">
                <span className="text-slate-800 flex items-center gap-1.5">🎵 TikTok</span>
                <span className="text-[#0F172A]">12% · 5.8k</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-900 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>

            {/* LinkedIn */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-extrabold">
                <span className="text-sky-700 flex items-center gap-1.5">💼 LinkedIn B2B</span>
                <span className="text-[#0F172A]">5% · 2.4k</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-sky-700 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-800 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span>Instagram & TikTok génèrent 84% de vos conversions WhatsApp.</span>
          </div>
        </div>

      </div>

      {/* =======================================================================
          D. TOP 3 DES MEILLEURS CONTENUS DU MOIS (BENTO CARDS)
          ======================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-[#0F172A] tracking-tight">
              Top 3 des Publications du Mois
            </h2>
            <p className="text-xs text-slate-500">
              Classées par volume de retours positifs et conversion de prospects.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">Août 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TOP_POSTS.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Media Preview avec Badge Trophée */}
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />

                {/* Badge Trophée */}
                <div className="absolute top-2.5 left-2.5 bg-[#0F172A]/90 backdrop-blur-md text-amber-300 px-3 py-1 rounded-full text-[10px] font-black border border-amber-400/30 shadow-md">
                  {post.rankBadge}
                </div>

                <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  {post.views} vues
                </div>
              </div>

              {/* Contenu de la Carte */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                  <span>{post.network}</span>
                  <span>{post.date}</span>
                </div>

                <h3 className="text-xs font-extrabold text-[#0F172A] leading-snug line-clamp-2">
                  {post.title}
                </h3>

                {/* Métriques */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-[#0066FF]" /> {post.comments}
                  </span>
                  <span className="text-emerald-600 font-black">
                    {post.engagementRate} eng.
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =======================================================================
          E. MODALE BILAN MENSUEL WHATSAPP (STORY FORMAT PREVIEW)
          ======================================================================= */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4 animate-fadeIn">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                <h3 className="text-sm font-black text-[#0F172A]">Bilan Mensuel Client (WhatsApp)</h3>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Carte Visuelle Story Style */}
            <div className="bg-gradient-to-br from-[#0F172A] via-slate-900 to-indigo-950 p-5 rounded-2xl text-white space-y-3.5 shadow-lg border border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={activeClient.avatar} alt="Logo" className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20" />
                  <div>
                    <div className="text-xs font-bold">{activeClient.name} {activeClient.flag}</div>
                    <div className="text-[10px] text-slate-400">Rapport Mensuel Août 2026</div>
                  </div>
                </div>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-[#F94F06] text-white">
                  CMFlow Report
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-center">
                <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                  <div className="text-[10px] text-slate-300">Portée Totale</div>
                  <div className="text-lg font-black text-amber-300">48.2K</div>
                </div>
                <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                  <div className="text-[10px] text-slate-300">Engagement</div>
                  <div className="text-lg font-black text-emerald-400">5.8%</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 leading-relaxed bg-white/5 p-2.5 rounded-xl">
                🚀 <strong>Top Moment :</strong> Le Reel Thiéboudienne a généré +38 réservations de tables directes via WhatsApp ce mois-ci !
              </div>
            </div>

            {/* Actions de Partage */}
            <div className="space-y-2 pt-2">
              <a
                href="https://wa.me/221778001234?text=Bonjour%20!%20Voici%20le%20r%C3%A9capitulatif%20des%20performances%20de%20Teranga%20Gourmet%20pour%20ce%20mois%20de%20Ao%C3%BBt%202026%20%3A%20Port%C3%A9e%2048.2k%2C%20Engagement%205.8%25%20!%20%F0%9F%93%8A%F0%9F%9A%80"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Partager directement sur WhatsApp (+221 77...)</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsReportModalOpen(false);
                  showToast('📥 Téléchargement de la fiche image PNG HD lancé !');
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Télécharger la fiche PNG
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
