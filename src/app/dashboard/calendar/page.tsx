'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Send,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Copy,
  CheckCircle2,
  Clock,
  Video,
  Layers,
  Instagram,
  Facebook,
  Linkedin,
  UploadCloud,
  X,
  Sparkles,
  Flame,
  Check,
  Share2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { useClient } from '../../../context/ClientContext';

// Types
export type SocialNetwork = 'instagram' | 'facebook' | 'tiktok' | 'linkedin';
export type PostStatus = 'draft' | 'pending_validation' | 'validated' | 'scheduled';
export type ViewMode = 'week' | 'month' | 'list';

export interface CalendarPost {
  id: string;
  clientId: string;
  network: SocialNetwork;
  status: PostStatus;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  caption: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'carousel';
  carouselCount?: number;
  likesEst?: number;
}

// Données Mockées Réalistes (Teranga Gourmet & autres)
const INITIAL_CALENDAR_POSTS: CalendarPost[] = [
  {
    id: 'cal-post-1',
    clientId: 'teranga-gourmet',
    network: 'instagram',
    status: 'validated',
    scheduledDate: '2026-08-24', // Lundi
    scheduledTime: '18:30',
    caption: 'Ce soir, découvrez notre nouveau Thiéboudienne royal revisité aux fruits de mer frais de Soumbédioune 🐟✨ Réservez votre table en terrasse ! #DakarFood #SenegalGourmet #TerangaGourmet',
    mediaUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    mediaType: 'carousel',
    carouselCount: 3,
    likesEst: 342,
  },
  {
    id: 'cal-post-2',
    clientId: 'teranga-gourmet',
    network: 'tiktok',
    status: 'pending_validation',
    scheduledDate: '2026-08-25', // Mardi
    scheduledTime: '12:15',
    caption: 'Dans les coulisses avec notre Chef Moussa qui prépare les fameux pastels croustillants 🔥 Vous êtes plutôt sauce pimentée ou douce ? #DakarFood #Foodie #TikTokFood',
    mediaUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80',
    mediaType: 'video',
    likesEst: 1250,
  },
  {
    id: 'cal-post-3',
    clientId: 'teranga-gourmet',
    network: 'facebook',
    status: 'scheduled',
    scheduledDate: '2026-08-26', // Mercredi
    scheduledTime: '09:00',
    caption: 'Offre spéciale déjeuner d\'entreprise : -15% sur toutes vos commandes de groupe du mercredi au vendredi 💼🍽️ Livraison express au Plateau et aux Almadies. #BusinessLunch',
    mediaUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    likesEst: 89,
  },
  {
    id: 'cal-post-4',
    clientId: 'teranga-gourmet',
    network: 'instagram',
    status: 'draft',
    scheduledDate: '2026-08-27', // Jeudi
    scheduledTime: '19:45',
    caption: 'Ambiance feutrée et musique acoustique en terrasse ce week-end. Qui vous accompagne ? Mentionnez-les en commentaire ! 🥂🎷 #DakarNight #TerangaGourmet #AfroJazz',
    mediaUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    likesEst: 215,
  },
  {
    id: 'cal-post-5',
    clientId: 'teranga-gourmet',
    network: 'linkedin',
    status: 'validated',
    scheduledDate: '2026-08-28', // Vendredi
    scheduledTime: '10:30',
    caption: 'Fier d\'accueillir les délégations du Sommet Tech Afrique de l\'Ouest pour leurs déjeuners et dîners officiels d\'affaires. L\'excellence du service au cœur de notre engagement gastronomique.',
    mediaUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    likesEst: 178,
  },
  {
    id: 'cal-post-6',
    clientId: 'teranga-gourmet',
    network: 'instagram',
    status: 'pending_validation',
    scheduledDate: '2026-08-29', // Samedi
    scheduledTime: '11:00',
    caption: 'Brunch du dimanche en préparation : viennoiseries maison, jus de bissap bio et grillades à la braise. Pensez à réserver vos places à l\'avance ! 🥞🍹',
    mediaUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    likesEst: 430,
  }
];

// Jours de la semaine
const DAYS_OF_WEEK = [
  { key: '2026-08-24', name: 'Lun', fullName: 'Lundi', dateNum: '24' },
  { key: '2026-08-25', name: 'Mar', fullName: 'Mardi', dateNum: '25' },
  { key: '2026-08-26', name: 'Mer', fullName: 'Mercredi', dateNum: '26' },
  { key: '2026-08-27', name: 'Jeu', fullName: 'Jeudi', dateNum: '27' },
  { key: '2026-08-28', name: 'Ven', fullName: 'Vendredi', dateNum: '28' },
  { key: '2026-08-29', name: 'Sam', fullName: 'Samedi', dateNum: '29' },
  { key: '2026-08-30', name: 'Dim', fullName: 'Dimanche', dateNum: '30' },
];

export default function CalendarPage() {
  // Récupération de la marque active via le ClientContext universel
  const { activeClient } = useClient();

  // État local
  const [posts, setPosts] = useState<CalendarPost[]>(INITIAL_CALENDAR_POSTS);
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedNetworkFilter, setSelectedNetworkFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Modales
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<CalendarPost | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Formulaire Nouveau Post
  const [newCaption, setNewCaption] = useState('');
  const [newNetwork, setNewNetwork] = useState<SocialNetwork>('instagram');
  const [newDate, setNewDate] = useState('2026-08-24');
  const [newTime, setNewTime] = useState('18:00');
  const [newStatus, setNewStatus] = useState<PostStatus>('pending_validation');
  const [newMediaUrl, setNewMediaUrl] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtrage des posts pour la marque active
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (post.clientId !== activeClient.id) return false;
      if (selectedNetworkFilter !== 'all' && post.network !== selectedNetworkFilter) return false;
      if (selectedStatusFilter !== 'all' && post.status !== selectedStatusFilter) return false;
      return true;
    });
  }, [posts, activeClient.id, selectedNetworkFilter, selectedStatusFilter]);

  // KPIs
  const totalPostsMonth = 28;
  const pendingPostsCount = useMemo(() => filteredPosts.filter((p) => p.status === 'pending_validation').length, [filteredPosts]);
  const validatedPostsCount = useMemo(() => filteredPosts.filter((p) => p.status === 'validated').length, [filteredPosts]);
  const scheduledPostsCount = useMemo(() => filteredPosts.filter((p) => p.status === 'scheduled').length, [filteredPosts]);

  // Soumission Création Post
  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaption.trim()) return;

    const newPost: CalendarPost = {
      id: `post-${Date.now()}`,
      clientId: activeClient.id,
      network: newNetwork,
      status: newStatus,
      scheduledDate: newDate,
      scheduledTime: newTime,
      caption: newCaption,
      mediaUrl: newMediaUrl,
      mediaType: 'image',
      likesEst: 160,
    };

    setPosts([newPost, ...posts]);
    setIsCreatePostModalOpen(false);
    setNewCaption('');
    triggerToast('✨ Publication ajoutée au calendrier avec succès !');
  };

  // Supprimer un post
  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
    triggerToast('🗑️ Publication supprimée.');
  };

  // Dupliquer un post
  const handleDuplicatePost = (post: CalendarPost) => {
    const copy: CalendarPost = {
      ...post,
      id: `post-${Date.now()}`,
      caption: `[Copie] ${post.caption}`,
      status: 'draft',
    };
    setPosts([copy, ...posts]);
    triggerToast('📋 Publication dupliquée en brouillon.');
  };

  // Lien Magique WhatsApp
  const magicValidationUrl = `https://cmflow.sn/v/${activeClient.id}-a8f9`;
  const whatsappText = `Bonjour ! Votre planning pour ${activeClient.name} est prêt pour validation : ${magicValidationUrl} 🚀`;

  // Rendu de l'icône réseau
  const renderNetworkIcon = (network: SocialNetwork, className = 'w-3.5 h-3.5') => {
    switch (network) {
      case 'instagram':
        return <Instagram className={`${className} text-[#E1306C]`} />;
      case 'facebook':
        return <Facebook className={`${className} text-[#1877F2]`} />;
      case 'linkedin':
        return <Linkedin className={`${className} text-[#0A66C2]`} />;
      case 'tiktok':
        return (
          <span className={`${className} font-black text-slate-900 inline-flex items-center justify-center text-[10px] leading-none`}>
            TT
          </span>
        );
    }
  };

  // Rendu badge de statut
  const renderStatusBadge = (status: PostStatus) => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Brouillon
          </span>
        );
      case 'pending_validation':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            En attente WhatsApp
          </span>
        );
      case 'validated':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/25">
            <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
            Validé client
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/25">
            <Send className="w-3 h-3 text-[#0066FF]" />
            Programmé
          </span>
        );
    }
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
          A. EN-TÊTE DE PAGE & BARRE D'ACTIONS (TOP SECTION)
          ======================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200/70 shadow-xs">
        
        {/* Gauche : Titre & Badge Marque */}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              Planning & File de publication
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-orange-50 text-[#F94F06] border border-orange-200/80 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F94F06]"></span>
              {activeClient.name} {activeClient.flag}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Organisez, prévisualisez et soumettez vos contenus pour validation client WhatsApp.
          </p>
        </div>

        {/* Droite : Segmented Control & Boutons d'Action */}
        <div className="flex items-center flex-wrap gap-2.5">
          
          {/* Segmented-Control Vue */}
          <div className="bg-slate-100/90 backdrop-blur-sm p-1 rounded-2xl flex items-center border border-slate-200/70 text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 ${
                viewMode === 'week' ? 'bg-white text-[#0F172A] shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Semaine
            </button>
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 ${
                viewMode === 'month' ? 'bg-white text-[#0F172A] shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Mois
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 ${
                viewMode === 'list' ? 'bg-white text-[#0F172A] shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Liste
            </button>
          </div>

          {/* Bouton WhatsApp Validation (#10B981) */}
          <button
            type="button"
            onClick={() => setIsValidationModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#059669] border border-[#10B981]/30 transition-all duration-200 active:scale-[0.98]"
          >
            <Send className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="hidden sm:inline">Envoyer pour validation</span>
            <span className="sm:hidden">WhatsApp</span>
          </button>

          {/* Bouton Principal Orange Électrique (#F94F06) */}
          <button
            type="button"
            onClick={() => setIsCreatePostModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-[#F94F06] hover:bg-[#e04605] text-white shadow-lg shadow-[#F94F06]/25 hover:shadow-[#F94F06]/40 active:scale-[0.98] transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nouveau post</span>
          </button>

        </div>
      </div>

      {/* =======================================================================
          B. CARTES KPIS RAPIDES (4 CARTES COMPACTES)
          ======================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 : Posts ce mois */}
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Posts ce mois</span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">+4 vs m-1</span>
          </div>
          <div className="text-xl font-extrabold text-[#0F172A] mt-1">
            {totalPostsMonth} publications
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Rythme régulier maintenu
          </div>
        </div>

        {/* KPI 2 : En attente retour client */}
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">En attente retour</span>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              WhatsApp
            </span>
          </div>
          <div className="text-xl font-extrabold text-amber-600 mt-1">
            {pendingPostsCount} posts
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            En cours d'examen client
          </div>
        </div>

        {/* KPI 3 : Validés par le client */}
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Validés client</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">94% Succès</span>
          </div>
          <div className="text-xl font-extrabold text-emerald-600 mt-1">
            {validatedPostsCount} posts
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Prêts pour diffusion
          </div>
        </div>

        {/* KPI 4 : Prêts à publier */}
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Prêts à publier</span>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">Automatique</span>
          </div>
          <div className="text-xl font-extrabold text-purple-600 mt-1">
            {scheduledPostsCount} posts
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            File d'attente synchronisée
          </div>
        </div>

      </div>

      {/* =======================================================================
          C. BARRE D'OUTILS & FILTRES CALENDRIER
          ======================================================================= */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 shadow-xs">
        
        {/* Navigation Date */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100/80 border border-slate-200/80 rounded-xl p-1">
            <button
              type="button"
              onClick={() => triggerToast('Semaine précédente')}
              className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-all"
              title="Précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="px-2.5 py-1 text-xs font-bold text-slate-800 hover:bg-white rounded-lg transition-all"
            >
              Aujourd'hui
            </button>
            <button
              type="button"
              onClick={() => triggerToast('Semaine suivante')}
              className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-all"
              title="Suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs sm:text-sm font-extrabold text-[#0F172A]">
            Semaine du 24 au 30 Août 2026
          </div>
        </div>

        {/* Filtres Réseaux & Statuts */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          
          {/* Onglets Pilules Réseaux */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70">
            {[
              { key: 'all', label: 'Tous' },
              { key: 'instagram', label: 'Instagram', icon: Instagram },
              { key: 'facebook', label: 'Facebook', icon: Facebook },
              { key: 'tiktok', label: 'TikTok' },
              { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedNetworkFilter(tab.key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  selectedNetworkFilter === tab.key
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.icon && <tab.icon className="w-3 h-3" />}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Filtre Statut Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 shadow-xs">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              <option value="draft">Brouillons</option>
              <option value="pending_validation">En attente WhatsApp</option>
              <option value="validated">Validés client</option>
              <option value="scheduled">Programmés</option>
            </select>
          </div>

        </div>
      </div>

      {/* =======================================================================
          D. LE CALENDRIER 7 JOURS INTERACTIF (LUNDI AU DIMANCHE)
          ======================================================================= */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 min-w-full md:min-w-[940px] items-start overflow-x-auto">
          {DAYS_OF_WEEK.map((day) => {
            const dayPosts = filteredPosts.filter((p) => p.scheduledDate === day.key);
            const isToday = day.dateNum === '24';

            return (
              <div
                key={day.key}
                className={`rounded-3xl border transition-all duration-300 ${
                  isToday
                    ? 'bg-white border-[#0066FF]/40 shadow-md ring-2 ring-[#0066FF]/10'
                    : 'bg-white/80 backdrop-blur-sm border-slate-200/70 hover:border-slate-300'
                }`}
              >
                {/* Header du Jour */}
                <div
                  className={`p-3.5 border-b flex items-center justify-between rounded-t-3xl ${
                    isToday
                      ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border-blue-100'
                      : 'bg-slate-50/60 border-slate-100'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      {day.fullName}
                    </span>
                    <span
                      className={`text-lg font-black tracking-tight ${
                        isToday ? 'text-[#0066FF]' : 'text-slate-900'
                      }`}
                    >
                      {day.dateNum}
                    </span>
                  </div>

                  {isToday && (
                    <span className="text-[9px] font-black uppercase tracking-wider bg-[#0066FF] text-white px-2 py-0.5 rounded-full shadow-xs">
                      Aujourd'hui
                    </span>
                  )}
                </div>

                {/* Zone de cartes journalières */}
                <div className="p-2.5 space-y-3 min-h-[340px]">
                  {dayPosts.length === 0 ? (
                    <div className="h-40 flex flex-col items-center justify-center text-center p-3 border border-dashed border-slate-200 rounded-2xl text-slate-400 group hover:border-[#0066FF]/50 transition-colors">
                      <span className="text-[11px] font-medium text-slate-400">Aucun post</span>
                      <button
                        type="button"
                        onClick={() => {
                          setNewDate(day.key);
                          setIsCreatePostModalOpen(true);
                        }}
                        className="mt-2 text-[11px] font-extrabold text-[#0066FF] hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Planifier</span>
                      </button>
                    </div>
                  ) : (
                    dayPosts.map((post) => (
                      <div
                        key={post.id}
                        className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                      >
                        {/* Vignette Média HD */}
                        <div className="relative h-32 w-full bg-slate-900 overflow-hidden">
                          <img
                            src={post.mediaUrl}
                            alt="Aperçu du visuel"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />

                          {/* Badge Réseau Social Glassmorphism */}
                          <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-md rounded-lg p-1.5 shadow-sm border border-white/20">
                            {renderNetworkIcon(post.network, 'w-3.5 h-3.5')}
                          </div>

                          {/* Badge Type Média */}
                          {post.mediaType === 'carousel' && (
                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[9px] font-extrabold flex items-center gap-1">
                              <Layers className="w-3 h-3 text-amber-300" />
                              <span>1/{post.carouselCount || 3}</span>
                            </div>
                          )}

                          {post.mediaType === 'video' && (
                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[9px] font-extrabold flex items-center gap-1">
                              <Video className="w-3 h-3 text-sky-400" />
                              <span>0:45</span>
                            </div>
                          )}

                          {/* Heure */}
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10">
                            {post.scheduledTime}
                          </div>
                        </div>

                        {/* Contenu & Typographie */}
                        <div className="p-3 space-y-2">
                          <p className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed font-medium">
                            {post.caption}
                          </p>

                          {/* Pied de Carte avec Statut */}
                          <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                            {renderStatusBadge(post.status)}
                          </div>
                        </div>

                        {/* Actions au survol (Hover Actions) */}
                        <div className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 p-3 text-white">
                          <button
                            type="button"
                            title="Prévisualiser"
                            onClick={() => setPreviewPost(post)}
                            className="p-2 rounded-xl bg-white/20 hover:bg-white text-white hover:text-slate-900 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            title="Dupliquer"
                            onClick={() => handleDuplicatePost(post)}
                            className="p-2 rounded-xl bg-white/20 hover:bg-white text-white hover:text-slate-900 transition-all"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            title="Modifier"
                            onClick={() => triggerToast('Édition de la publication')}
                            className="p-2 rounded-xl bg-white/20 hover:bg-white text-white hover:text-slate-900 transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            title="Supprimer"
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 rounded-xl bg-rose-500/40 hover:bg-rose-500 text-rose-200 hover:text-white transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =======================================================================
          VUE LISTE ÉPURÉE (ALTERNATE VIEW)
          ======================================================================= */}
      {(viewMode === 'list' || viewMode === 'month') && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 font-bold text-[11px] uppercase tracking-wider text-slate-500 grid grid-cols-12 gap-4">
            <div className="col-span-2">Date & Heure</div>
            <div className="col-span-2">Canal</div>
            <div className="col-span-5">Visuel & Légende</div>
            <div className="col-span-2">Statut</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50/80 transition-colors text-xs"
              >
                <div className="col-span-2 font-bold text-slate-900">
                  {post.scheduledDate} · {post.scheduledTime}
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-100">
                    {renderNetworkIcon(post.network)}
                  </div>
                  <span className="font-bold capitalize text-slate-700">
                    {post.network}
                  </span>
                </div>

                <div className="col-span-5 flex items-center gap-3">
                  <img
                    src={post.mediaUrl}
                    alt="Thumbnail"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <p className="text-slate-700 truncate font-medium">
                    {post.caption}
                  </p>
                </div>

                <div className="col-span-2">
                  {renderStatusBadge(post.status)}
                </div>

                <div className="col-span-1 flex items-center justify-end gap-1">
                  <button
                    onClick={() => setPreviewPost(post)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                    title="Voir"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =======================================================================
          E. MODALE 1 : VALIDATION WHATSAPP
          ======================================================================= */}
      {isValidationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 animate-fadeIn">
            
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-[#10B981] border border-emerald-500/20 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A]">
                    Lien Magique de Validation
                  </h3>
                  <p className="text-xs text-slate-500">Pour {activeClient.name} {activeClient.flag}</p>
                </div>
              </div>
              <button
                onClick={() => setIsValidationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Votre client n'a <strong>pas besoin de mot de passe</strong>. En ouvrant ce lien sécurisé, il accède à une interface mobile fluide pour valider ou commenter chaque visuel en 1 clic.
            </p>

            {/* Lien Magique */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl mb-4 flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-slate-700 truncate font-semibold">
                {magicValidationUrl}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(magicValidationUrl);
                  triggerToast('📋 Lien magique copié dans le presse-papier !');
                }}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-[#0066FF] rounded-xl shrink-0 font-bold text-xs flex items-center gap-1 shadow-xs transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copier</span>
              </button>
            </div>

            {/* Message Pré-Rempli WhatsApp */}
            <div className="mb-5 p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs text-emerald-900 leading-relaxed">
              <span className="font-bold block text-emerald-800 mb-1">Message prêt à envoyer :</span>
              « {whatsappText} »
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <a
                href={`https://wa.me/${activeClient.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappText)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/25 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Ouvrir sur WhatsApp ({activeClient.whatsapp})</span>
              </a>

              <button
                type="button"
                onClick={() => setIsValidationModalOpen(false)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =======================================================================
          E. MODALE 2 : CRÉATION DE POST
          ======================================================================= */}
      {isCreatePostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 animate-fadeIn max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">
                  Créer une Publication
                </h3>
                <p className="text-xs text-slate-500">Pour {activeClient.name} {activeClient.flag}</p>
              </div>
              <button
                onClick={() => setIsCreatePostModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePostSubmit} className="space-y-4">
              
              {/* Choix Réseau */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Réseau Cible
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['instagram', 'facebook', 'tiktok', 'linkedin'] as SocialNetwork[]).map((net) => (
                    <button
                      key={net}
                      type="button"
                      onClick={() => setNewNetwork(net)}
                      className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                        newNetwork === net
                          ? 'border-[#0066FF] bg-blue-50/70 text-[#0066FF] font-bold shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {renderNetworkIcon(net, 'w-4 h-4')}
                      <span className="text-[10px] capitalize">{net}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Zone Drag & Drop Média */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Visuel ou Vidéo HD
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-[#0066FF] rounded-2xl p-4 text-center bg-slate-50/50 cursor-pointer transition-colors">
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-700">Glissez-déposez votre visuel ici</div>
                  <div className="text-[10px] text-slate-400">PNG, JPG, MP4 jusqu'à 50 Mo</div>
                </div>
              </div>

              {/* Légende */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Légende & Hashtags
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {newCaption.length} caractères
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Rédigez votre texte captivant avec emojis et hashtags..."
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>

              {/* Date & Heure */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Heure
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Statut Initial */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Statut Initial
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as PostStatus)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                >
                  <option value="pending_validation">En attente de validation client (WhatsApp)</option>
                  <option value="draft">Brouillon interne</option>
                  <option value="validated">Validé par le client</option>
                  <option value="scheduled">Prêt pour programmation</option>
                </select>
              </div>

              {/* Boutons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreatePostModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-extrabold bg-[#F94F06] hover:bg-[#e04605] text-white rounded-xl shadow-lg shadow-[#F94F06]/25 transition-all"
                >
                  Planifier le post
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =======================================================================
          E. MODALE 3 : APERÇU HD POST
          ======================================================================= */}
      {previewPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 animate-fadeIn">
            
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {renderNetworkIcon(previewPost.network)}
                <span className="text-xs font-extrabold capitalize text-slate-900">
                  Aperçu {previewPost.network}
                </span>
              </div>
              <button
                onClick={() => setPreviewPost(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-64 w-full bg-slate-900">
              <img
                src={previewPost.mediaUrl}
                alt="Aperçu"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">
                  {previewPost.scheduledDate} à {previewPost.scheduledTime}
                </span>
                {renderStatusBadge(previewPost.status)}
              </div>

              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {previewPost.caption}
              </p>

              <button
                onClick={() => setPreviewPost(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Fermer l'aperçu
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
