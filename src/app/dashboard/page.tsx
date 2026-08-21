'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Users,
  Image as ImageIcon,
  CreditCard,
  Settings,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Send,
  Share2,
  Filter,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  FileText,
  Video,
  Instagram,
  Facebook,
  Linkedin,
  Copy,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  Search
} from 'lucide-react';

// Types
export type SocialNetwork = 'instagram' | 'facebook' | 'tiktok' | 'linkedin';
export type PostStatus = 'draft' | 'pending_validation' | 'validated' | 'scheduled';
export type ViewMode = 'week' | 'month' | 'list';

export interface Client {
  id: string;
  name: string;
  category: string;
  avatar: string;
  color: string;
  whatsapp: string;
}

export interface Post {
  id: string;
  clientId: string;
  network: SocialNetwork;
  status: PostStatus;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  caption: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'carousel';
  likesCount?: number;
}

// Données Mockées Réalistes (Clients & Posts)
const MOCK_CLIENTS: Client[] = [
  {
    id: 'client-1',
    name: 'Teranga Gourmet',
    category: 'Restaurant & Traiteur · Dakar 🇸🇳',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&auto=format&fit=crop&q=80',
    color: '#F94F06',
    whatsapp: '+221 77 842 19 02',
  },
  {
    id: 'client-2',
    name: 'Sira Cosmétiques Bio',
    category: 'Beauté & Skincare · Abidjan 🇨🇮',
    avatar: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=120&auto=format&fit=crop&q=80',
    color: '#0066FF',
    whatsapp: '+225 07 48 92 10 33',
  },
  {
    id: 'client-3',
    name: 'Baobab Tech Hub',
    category: 'SaaS & Innovation · Dakar 🇸🇳',
    avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=120&auto=format&fit=crop&q=80',
    color: '#10B981',
    whatsapp: '+221 78 112 45 88',
  },
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    clientId: 'client-1',
    network: 'instagram',
    status: 'validated',
    scheduledDate: '2026-08-24', // Lundi
    scheduledTime: '18:30',
    caption: 'Ce soir, découvrez notre nouveau Thiéboudienne revisité aux fruits de mer frais de Soumbédioune 🐟✨ Réservez votre table !',
    mediaUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    mediaType: 'carousel',
  },
  {
    id: 'post-2',
    clientId: 'client-1',
    network: 'tiktok',
    status: 'pending_validation',
    scheduledDate: '2026-08-25', // Mardi
    scheduledTime: '12:15',
    caption: 'Dans les coulisses avec notre Chef Moussa qui prépare les fameux pastels croustillants 🔥 #DakarFood #Foodie',
    mediaUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80',
    mediaType: 'video',
  },
  {
    id: 'post-3',
    clientId: 'client-1',
    network: 'facebook',
    status: 'scheduled',
    scheduledDate: '2026-08-26', // Mercredi
    scheduledTime: '09:00',
    caption: 'Offre spéciale déjeuner d\'entreprise : -15% sur toutes vos commandes de groupe du mercredi au vendredi 💼🍽️',
    mediaUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
  },
  {
    id: 'post-4',
    clientId: 'client-1',
    network: 'instagram',
    status: 'draft',
    scheduledDate: '2026-08-27', // Jeudi
    scheduledTime: '19:45',
    caption: 'Ambiance feutrée et musique acoustique en terrasse ce week-end. Qui vous accompagne ? Mentionnez-les en commentaire ! 🥂',
    mediaUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
  },
  {
    id: 'post-5',
    clientId: 'client-1',
    network: 'linkedin',
    status: 'validated',
    scheduledDate: '2026-08-28', // Vendredi
    scheduledTime: '10:30',
    caption: 'Fier d\'accueillir les délégations du Sommet Tech Afrique de l\'Ouest pour leurs dîners officiels d\'affaires.',
    mediaUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
  },
];

// Jours de la semaine
const DAYS_OF_WEEK = [
  { key: '2026-08-24', name: 'Lundi', dateNum: '24' },
  { key: '2026-08-25', name: 'Mardi', dateNum: '25' },
  { key: '2026-08-26', name: 'Mercredi', dateNum: '26' },
  { key: '2026-08-27', name: 'Jeudi', dateNum: '27' },
  { key: '2026-08-28', name: 'Vendredi', dateNum: '28' },
  { key: '2026-08-29', name: 'Samedi', dateNum: '29' },
  { key: '2026-08-30', name: 'Dimanche', dateNum: '30' },
];

export default function DashboardPage() {
  // États de Navigation & Filtres
  const [selectedClient, setSelectedClient] = useState<Client>(MOCK_CLIENTS[0]);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [filterNetwork, setFilterNetwork] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

  // Modales
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Nouveau Post Form
  const [newCaption, setNewCaption] = useState('');
  const [newNetwork, setNewNetwork] = useState<SocialNetwork>('instagram');
  const [newDate, setNewDate] = useState('2026-08-24');
  const [newTime, setNewTime] = useState('18:00');
  const [newStatus, setNewStatus] = useState<PostStatus>('pending_validation');

  // Afficher un Toast temporaire
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtrage des posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (post.clientId !== selectedClient.id) return false;
      if (filterNetwork !== 'all' && post.network !== filterNetwork) return false;
      if (filterStatus !== 'all' && post.status !== filterStatus) return false;
      return true;
    });
  }, [posts, selectedClient.id, filterNetwork, filterStatus]);

  // Ajouter un nouveau post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaption.trim()) return;

    const newPostItem: Post = {
      id: `post-${Date.now()}`,
      clientId: selectedClient.id,
      network: newNetwork,
      status: newStatus,
      scheduledDate: newDate,
      scheduledTime: newTime,
      caption: newCaption,
      mediaUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
      mediaType: 'image',
    };

    setPosts([newPostItem, ...posts]);
    setIsCreatePostModalOpen(false);
    setNewCaption('');
    triggerToast('Publication ajoutée au calendrier avec succès ! 🎉');
  };

  // Supprimer un post
  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
    triggerToast('Publication supprimée.');
  };

  // Rendu de l'icône Réseau Social
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
          <span className={`${className} font-black text-black inline-flex items-center justify-center text-[10px] leading-none`}>
            TT
          </span>
        );
    }
  };

  // Rendu du Badge de Statut
  const renderStatusBadge = (status: PostStatus) => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-2.5 h-2.5" />
            Brouillon
          </span>
        );
      case 'pending_validation':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            En attente WhatsApp
          </span>
        );
      case 'validated':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-2.5 h-2.5 text-[#10B981]" />
            Validé par le client
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Send className="w-2.5 h-2.5 text-[#0066FF]" />
            Programmé
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-[#0F172A]">
      
      {/* Toast Notification Flottante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-sm font-medium flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#F94F06]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =======================================================================
          A. SIDEBAR GAUCHE (Bleu Ardoise Profond #0F172A)
          ======================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0F172A] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800 lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Brand */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <Link href="/dashboard" className="inline-block transition-opacity hover:opacity-90">
              <Image
                src="/images/logo-white.svg"
                alt="CMFlow Logo"
                width={120}
                height={32}
                className="h-7 w-auto object-contain"
                priority
              />
            </Link>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sélecteur de Marque / Client (Dropdown) */}
          <div className="p-4 relative">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
              Espace Client Actif
            </label>

            <button
              type="button"
              onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all text-left group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={selectedClient.avatar}
                  alt={selectedClient.name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-[#0066FF]/30 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate group-hover:text-sky-300 transition-colors">
                    {selectedClient.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {selectedClient.category}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white shrink-0 ml-1" />
            </button>

            {/* Menu Dropdown Clients */}
            {isClientDropdownOpen && (
              <div className="absolute top-full left-4 right-4 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                <div className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                  Changer de marque
                </div>
                {MOCK_CLIENTS.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => {
                      setSelectedClient(client);
                      setIsClientDropdownOpen(false);
                      triggerToast(`Espace commuté sur « ${client.name} »`);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-800 transition-colors ${
                      selectedClient.id === client.id ? 'bg-slate-800/60 font-bold text-[#F94F06]' : 'text-slate-300'
                    }`}
                  >
                    <img src={client.avatar} alt={client.name} className="w-6 h-6 rounded-md object-cover" />
                    <div className="truncate text-xs">{client.name}</div>
                  </button>
                ))}
                <div className="border-t border-slate-800 my-1 pt-1">
                  <button
                    onClick={() => {
                      setIsClientDropdownOpen(false);
                      triggerToast('Formulaire de création de nouveau client bientôt disponible !');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#0066FF] hover:bg-slate-800/80 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Ajouter un client</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Principale */}
          <nav className="px-3 space-y-1 mt-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold bg-[#F94F06] text-white shadow-lg shadow-[#F94F06]/20"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Calendrier de publication</span>
            </Link>

            <Link
              href="/clients"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span>Espaces Clients (Workspaces)</span>
            </Link>

            <Link
              href="/media"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-slate-400" />
              <span>Médiathèque (Assets)</span>
            </Link>

            <Link
              href="/billing"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span>Facturation & Forfait</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Starter Wave
              </span>
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Paramètres de l'Agence</span>
            </Link>
          </nav>
        </div>

        {/* Profil CM & Déconnexion */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[#0066FF] flex items-center justify-center font-bold text-xs text-white">
                  AD
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10B981] border-2 border-[#0F172A] rounded-full"></span>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">Awa Diop</div>
                <div className="text-[10px] text-slate-400 truncate">Lead CM · Dakar</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (confirm('Voulez-vous vous déconnecter ?')) {
                  window.location.href = '/login';
                }
              }}
              title="Déconnexion"
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Fond sombre pour mobile quand la sidebar est ouverte */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* =======================================================================
          CONTENU PRINCIPAL (HEADER + GRILLE CALENDRIER)
          ======================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        
        {/* =====================================================================
            B. EN-TÊTE SUPÉRIEUR (TOP BAR)
            ===================================================================== */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
          
          {/* Titre & Hamburger Mobile */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
                <span>Planning de publication</span>
                <span className="text-slate-300 font-normal">/</span>
                <span className="text-[#0066FF]">{selectedClient.name}</span>
              </h1>
              <p className="text-xs text-slate-500">
                {filteredPosts.length} publication{filteredPosts.length > 1 ? 's' : ''} planifiée{filteredPosts.length > 1 ? 's' : ''} cette semaine
              </p>
            </div>
          </div>

          {/* Bascule de Vue & Actions Rapides */}
          <div className="flex items-center flex-wrap gap-2.5">
            
            {/* Bascule Vue Semaine / Mois / Liste */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'week' ? 'bg-white text-[#0F172A] shadow-sm' : 'hover:text-slate-900'
                }`}
              >
                Semaine
              </button>
              <button
                type="button"
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'month' ? 'bg-white text-[#0F172A] shadow-sm' : 'hover:text-slate-900'
                }`}
              >
                Mois
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-white text-[#0F172A] shadow-sm' : 'hover:text-slate-900'
                }`}
              >
                Liste
              </button>
            </div>

            {/* Bouton WhatsApp Validation */}
            <button
              type="button"
              onClick={() => setIsValidationModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#25D366]/10 text-[#059669] border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Envoyer pour validation</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>

            {/* Bouton Principal Orange Électrique (+ Créer un post) */}
            <button
              type="button"
              onClick={() => setIsCreatePostModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#F94F06] hover:bg-[#e04605] text-white shadow-md shadow-[#F94F06]/20 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Créer un post</span>
            </button>

          </div>
        </header>

        {/* =====================================================================
            BARRE D'OUTILS & FILTRES DE CALENDRIER
            ===================================================================== */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Navigation Date (Précédent / Aujourd'hui / Suivant) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
              <button
                type="button"
                className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors"
                title="Semaine précédente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-white rounded-lg transition-colors"
              >
                Aujourd'hui
              </button>
              <button
                type="button"
                className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors"
                title="Semaine suivante"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-sm font-extrabold text-[#0F172A]">
              Semaine du 24 au 30 Août 2026
            </div>
          </div>

          {/* Filtres par Réseau Social & Statut */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            
            {/* Filtre Réseau */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterNetwork}
                onChange={(e) => setFilterNetwork(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">Tous les réseaux</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>

            {/* Filtre Statut */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">Tous les statuts</option>
                <option value="draft">Brouillon</option>
                <option value="pending_validation">En attente WhatsApp</option>
                <option value="validated">Validé client</option>
                <option value="scheduled">Programmé</option>
              </select>
            </div>

          </div>
        </div>

        {/* =====================================================================
            C. CORPS CENTRAL : GRILLE HEBDOMADAIRE / MENSUELLE DU CALENDRIER
            ===================================================================== */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-auto">
          
          {/* ===================================================================
              VUE SEMAINE (Desktop Grid 7 colonnes, Mobile List)
              =================================================================== */}
          {viewMode === 'week' && (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 min-w-full md:min-w-[900px] items-start">
              {DAYS_OF_WEEK.map((day) => {
                const dayPosts = filteredPosts.filter((p) => p.scheduledDate === day.key);
                const isToday = day.dateNum === '24'; // Exemple : 24 août aujourd'hui

                return (
                  <div
                    key={day.key}
                    className={`rounded-2xl border transition-all ${
                      isToday
                        ? 'bg-white border-[#0066FF]/40 shadow-md ring-1 ring-[#0066FF]/20'
                        : 'bg-white/80 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    {/* Header du Jour */}
                    <div
                      className={`p-3 border-b flex items-center justify-between rounded-t-2xl ${
                        isToday ? 'bg-blue-50/60 border-blue-100' : 'bg-slate-50/60 border-slate-100'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                          {day.name}
                        </span>
                        <span
                          className={`text-base font-extrabold ${
                            isToday ? 'text-[#0066FF]' : 'text-slate-900'
                          }`}
                        >
                          {day.dateNum}
                        </span>
                      </div>

                      {isToday && (
                        <span className="text-[10px] font-extrabold bg-[#0066FF] text-white px-2 py-0.5 rounded-full">
                          Aujourd'hui
                        </span>
                      )}
                    </div>

                    {/* Zone de cartes de publication */}
                    <div className="p-2 space-y-2.5 min-h-[320px]">
                      {dayPosts.length === 0 ? (
                        <div className="h-40 flex flex-col items-center justify-center text-center p-3 border border-dashed border-slate-200 rounded-xl text-slate-400">
                          <span className="text-[11px] font-medium">Aucun post</span>
                          <button
                            type="button"
                            onClick={() => {
                              setNewDate(day.key);
                              setIsCreatePostModalOpen(true);
                            }}
                            className="mt-2 text-[11px] font-bold text-[#0066FF] hover:underline"
                          >
                            + Ajouter
                          </button>
                        </div>
                      ) : (
                        dayPosts.map((post) => (
                          <div
                            key={post.id}
                            className="group relative bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
                          >
                            {/* Vignette Média */}
                            <div className="relative h-28 w-full bg-slate-100 overflow-hidden">
                              <img
                                src={post.mediaUrl}
                                alt="Aperçu du visuel"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />

                              {/* Badge Réseau Social */}
                              <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md rounded-lg p-1.5 shadow-sm border border-slate-200/60">
                                {renderNetworkIcon(post.network)}
                              </div>

                              {/* Type de Média */}
                              {post.mediaType === 'video' && (
                                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                                  <Video className="w-3 h-3" />
                                  <span>Vidéo</span>
                                </div>
                              )}

                              {/* Heure */}
                              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {post.scheduledTime}
                              </div>
                            </div>

                            {/* Contenu & Légende */}
                            <div className="p-3 space-y-2">
                              <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed font-medium">
                                {post.caption}
                              </p>

                              {/* Statut */}
                              <div className="pt-1 flex items-center justify-between">
                                {renderStatusBadge(post.status)}
                              </div>
                            </div>

                            {/* Actions Rapides au Survol */}
                            <div className="absolute inset-0 bg-[#0F172A]/85 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4 text-white">
                              <button
                                type="button"
                                title="Prévisualiser le rendu"
                                onClick={() => triggerToast(`Prévisualisation de la publication #${post.id}`)}
                                className="p-2 rounded-lg bg-white/20 hover:bg-white text-white hover:text-slate-900 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                title="Modifier"
                                onClick={() => triggerToast('Éditeur de post ouvert')}
                                className="p-2 rounded-lg bg-white/20 hover:bg-white text-white hover:text-slate-900 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                title="Supprimer"
                                onClick={() => handleDeletePost(post.id)}
                                className="p-2 rounded-lg bg-rose-500/30 hover:bg-rose-500 text-rose-200 hover:text-white transition-colors"
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

          {/* ===================================================================
              VUE LISTE OU MOIS ALTERNATIVE
              =================================================================== */}
          {(viewMode === 'list' || viewMode === 'month') && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-xs uppercase tracking-wider text-slate-500 grid grid-cols-12 gap-4">
                <div className="col-span-2">Date & Heure</div>
                <div className="col-span-2">Réseau</div>
                <div className="col-span-5">Visuel & Légende</div>
                <div className="col-span-2">Statut</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50/80 transition-colors text-sm"
                  >
                    <div className="col-span-2 font-bold text-slate-900 text-xs">
                      {post.scheduledDate} · {post.scheduledTime}
                    </div>

                    <div className="col-span-2 flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-100">
                        {renderNetworkIcon(post.network)}
                      </div>
                      <span className="text-xs font-bold capitalize text-slate-700">
                        {post.network}
                      </span>
                    </div>

                    <div className="col-span-5 flex items-center gap-3">
                      <img
                        src={post.mediaUrl}
                        alt="Thumbnail"
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <p className="text-xs text-slate-700 truncate font-medium">
                        {post.caption}
                      </p>
                    </div>

                    <div className="col-span-2">
                      {renderStatusBadge(post.status)}
                    </div>

                    <div className="col-span-1 flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* =======================================================================
          MODALE 1 : ENVOYER POUR VALIDATION WHATSAPP
          ======================================================================= */}
      {isValidationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 animate-fadeIn">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A]">
                    Lien Magique de Validation
                  </h3>
                  <p className="text-xs text-slate-500">Pour {selectedClient.name}</p>
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
              Votre client n'a <strong>pas besoin de créer de compte</strong>. En ouvrant ce lien sécurisé, il pourra valider chaque publication ou commenter d'un simple clic depuis son smartphone.
            </p>

            {/* Lien Magique Généré */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-slate-700 truncate">
                https://cmflow.sn/v/{selectedClient.id}-aout26
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`https://cmflow.sn/v/${selectedClient.id}-aout26`);
                  triggerToast('Lien copié dans le presse-papier ! 📋');
                }}
                className="p-1.5 text-[#0066FF] hover:bg-blue-50 rounded-lg shrink-0 font-bold text-xs flex items-center gap-1"
              >
                <Copy className="w-4 h-4" />
                <span>Copier</span>
              </button>
            </div>

            {/* Actions WhatsApp */}
            <div className="space-y-2.5">
              <a
                href={`https://wa.me/${selectedClient.whatsapp.replace(/[^0-9]/g, '')}?text=Bonjour%20${encodeURIComponent(
                  selectedClient.name
                )}%2C%20voici%20votre%20planning%20de%20publications%20%C3%A0%20valider%20sur%20CMFlow%20%3A%20https%3A%2F%2Fcmflow.sn%2Fv%2F${selectedClient.id}-aout26`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/25 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Ouvrir sur WhatsApp ({selectedClient.whatsapp})</span>
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
          MODALE 2 : CRÉER UN NOUVEAU POST (+ CRÉER UN POST)
          ======================================================================= */}
      {isCreatePostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 animate-fadeIn max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">
                  Nouvelle Publication
                </h3>
                <p className="text-xs text-slate-500">Pour {selectedClient.name}</p>
              </div>
              <button
                onClick={() => setIsCreatePostModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              
              {/* Choix du réseau */}
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
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                        newNetwork === net
                          ? 'border-[#0066FF] bg-blue-50/50 text-[#0066FF] font-bold shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {renderNetworkIcon(net, 'w-4 h-4')}
                      <span className="text-[10px] capitalize">{net}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Texte de la légende */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Texte de la publication (Légende & Hashtags)
                </label>
                <textarea
                  rows={4}
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Rédigez votre texte captivant avec emojis et hashtags..."
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>

              {/* Date et Heure */}
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

              {/* Statut initial */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Statut initial
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as PostStatus)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                >
                  <option value="pending_validation">En attente de validation client (WhatsApp)</option>
                  <option value="draft">Brouillon interne CM</option>
                  <option value="validated">Déjà validé par le client</option>
                  <option value="scheduled">Prêt à publier / Programmé</option>
                </select>
              </div>

              {/* Bouton Créer */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreatePostModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-[#F94F06] hover:bg-[#e04605] text-white rounded-xl shadow-md shadow-[#F94F06]/20 transition-all"
                >
                  Enregistrer la publication
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
