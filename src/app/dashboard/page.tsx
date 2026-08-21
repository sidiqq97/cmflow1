'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Users,
  Image as ImageIcon,
  MessageSquare,
  Globe,
  BarChart3,
  ShieldCheck,
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
  Search,
  UploadCloud,
  Check,
  ArrowRight,
  Smartphone,
  TrendingUp,
  Link2,
  Layers,
  Smile,
  Hash
} from 'lucide-react';

// Types
export type SocialNetwork = 'instagram' | 'facebook' | 'tiktok' | 'linkedin';
export type PostStatus = 'draft' | 'pending_validation' | 'validated' | 'scheduled';
export type ViewMode = 'week' | 'month' | 'list';

export interface Client {
  id: string;
  name: string;
  country: string;
  flag: string;
  category: string;
  avatar: string;
  color: string;
  whatsapp: string;
  connectedAccounts: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
  };
  approvalRate: number;
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
}

// Données Mockées Initiales (Clients & Publications)
const INITIAL_CLIENTS: Client[] = [
  {
    id: 'teranga-gourmet',
    name: 'Teranga Gourmet',
    country: 'Sénégal',
    flag: '🇸🇳',
    category: 'Restaurant & Traiteur',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=160&auto=format&fit=crop&q=80',
    color: '#F94F06',
    whatsapp: '+221 77 842 19 02',
    connectedAccounts: {
      instagram: '@teranga_gourmet_dakar',
      facebook: 'Teranga Gourmet Officiel',
      tiktok: '@terangagourmet',
    },
    approvalRate: 96,
  },
  {
    id: 'sira-cosmetiques',
    name: 'Sira Cosmétiques Bio',
    country: 'Côte d\'Ivoire',
    flag: '🇨🇮',
    category: 'Beauté & Skincare Africain',
    avatar: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=160&auto=format&fit=crop&q=80',
    color: '#0066FF',
    whatsapp: '+225 07 48 92 10 33',
    connectedAccounts: {
      instagram: '@siracosmetiques_abj',
      facebook: 'Sira Cosmétiques',
      linkedin: 'Sira Group CI',
    },
    approvalRate: 92,
  },
  {
    id: 'baobab-tech',
    name: 'Baobab Tech Hub',
    country: 'Sénégal',
    flag: '🇸🇳',
    category: 'SaaS & Incubateur Tech',
    avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=160&auto=format&fit=crop&q=80',
    color: '#10B981',
    whatsapp: '+221 78 112 45 88',
    connectedAccounts: {
      linkedin: 'Baobab Tech Dakar',
      facebook: 'Baobab Tech Hub',
    },
    approvalRate: 98,
  },
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    clientId: 'teranga-gourmet',
    network: 'instagram',
    status: 'validated',
    scheduledDate: '2026-08-24', // Lundi
    scheduledTime: '18:30',
    caption: 'Ce soir, découvrez notre nouveau Thiéboudienne revisité aux fruits de mer frais de Soumbédioune 🐟✨ Réservez votre table pour le week-end ! #DakarFood #SenegalGourmet',
    mediaUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    mediaType: 'carousel',
  },
  {
    id: 'post-2',
    clientId: 'teranga-gourmet',
    network: 'tiktok',
    status: 'pending_validation',
    scheduledDate: '2026-08-25', // Mardi
    scheduledTime: '12:15',
    caption: 'Dans les coulisses avec notre Chef Moussa qui prépare les fameux pastels croustillants 🔥 Vous êtes plutôt sauce pimentée ou douce ? #DakarFood #Foodie #CuisineAfricaine',
    mediaUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80',
    mediaType: 'video',
  },
  {
    id: 'post-3',
    clientId: 'teranga-gourmet',
    network: 'facebook',
    status: 'scheduled',
    scheduledDate: '2026-08-26', // Mercredi
    scheduledTime: '09:00',
    caption: 'Offre spéciale déjeuner d\'entreprise : -15% sur toutes vos commandes de groupe du mercredi au vendredi 💼🍽️ Livraison express au Plateau et aux Almadies.',
    mediaUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
  },
  {
    id: 'post-4',
    clientId: 'teranga-gourmet',
    network: 'instagram',
    status: 'draft',
    scheduledDate: '2026-08-27', // Jeudi
    scheduledTime: '19:45',
    caption: 'Ambiance feutrée et musique acoustique en terrasse ce week-end. Qui vous accompagne ? Mentionnez-les en commentaire ! 🥂🎷 #DakarNight #TerangaGourmet',
    mediaUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
  },
  {
    id: 'post-5',
    clientId: 'teranga-gourmet',
    network: 'linkedin',
    status: 'validated',
    scheduledDate: '2026-08-28', // Vendredi
    scheduledTime: '10:30',
    caption: 'Fier d\'accueillir les délégations du Sommet Tech Afrique de l\'Ouest pour leurs déjeuners et dîners officiels d\'affaires. L\'excellence du service au cœur de notre engagement.',
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

export default function DashboardCockpit() {
  // Gestion des États
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [selectedClient, setSelectedClient] = useState<Client>(INITIAL_CLIENTS[0]);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

  // Filtres et Vues
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [filterNetwork, setFilterNetwork] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showOnboardingBanner, setShowOnboardingBanner] = useState(true);

  // Modales
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Formulaire Création Post
  const [newCaption, setNewCaption] = useState('');
  const [newNetwork, setNewNetwork] = useState<SocialNetwork>('instagram');
  const [newDate, setNewDate] = useState('2026-08-24');
  const [newTime, setNewTime] = useState('18:00');
  const [newStatus, setNewStatus] = useState<PostStatus>('pending_validation');
  const [newMediaUrl, setNewMediaUrl] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80');

  // Formulaire Ajout Client
  const [newClientName, setNewClientName] = useState('');
  const [newClientCategory, setNewClientCategory] = useState('');
  const [newClientCountry, setNewClientCountry] = useState('Sénégal 🇸🇳');
  const [newClientWhatsapp, setNewClientWhatsapp] = useState('');

  // Toast Notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Publications filtrées pour le client actif
  const clientPosts = useMemo(() => {
    return posts.filter((p) => p.clientId === selectedClient.id);
  }, [posts, selectedClient.id]);

  const filteredPosts = useMemo(() => {
    return clientPosts.filter((post) => {
      if (filterNetwork !== 'all' && post.network !== filterNetwork) return false;
      if (filterStatus !== 'all' && post.status !== filterStatus) return false;
      return true;
    });
  }, [clientPosts, filterNetwork, filterStatus]);

  // Comptes connectés du client
  const connectedPlatformsCount = Object.keys(selectedClient.connectedAccounts || {}).length;

  // Création d'un post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaption.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      clientId: selectedClient.id,
      network: newNetwork,
      status: newStatus,
      scheduledDate: newDate,
      scheduledTime: newTime,
      caption: newCaption,
      mediaUrl: newMediaUrl,
      mediaType: 'image',
    };

    setPosts([newPost, ...posts]);
    setIsCreatePostModalOpen(false);
    setNewCaption('');
    triggerToast('✨ Publication programmée avec succès dans le calendrier !');
  };

  // Ajout d'un nouveau client
  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const flag = newClientCountry.includes('Côte') ? '🇨🇮' : '🇸🇳';
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: newClientName,
      country: newClientCountry,
      flag: flag,
      category: newClientCategory || 'Commerce & Services',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=160&auto=format&fit=crop&q=80',
      color: '#F94F06',
      whatsapp: newClientWhatsapp || '+221 77 000 00 00',
      connectedAccounts: {
        instagram: `@${newClientName.toLowerCase().replace(/\s+/g, '')}`,
        facebook: newClientName,
      },
      approvalRate: 100,
    };

    setClients([...clients, newClient]);
    setSelectedClient(newClient);
    setIsAddClientModalOpen(false);
    setNewClientName('');
    setNewClientWhatsapp('');
    triggerToast(`🎉 Client « ${newClient.name} » ajouté et activé !`);
  };

  // Suppression d'un post
  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
    triggerToast('🗑️ Publication supprimée.');
  };

  // Lien magique généré pour le client
  const magicValidationUrl = `https://cmflow.sn/v/${selectedClient.id}-a8f9`;
  const whatsappPreFilledText = `Bonjour ! Votre planning de la semaine pour ${selectedClient.name} est prêt pour validation : ${magicValidationUrl} 🚀`;

  // Icône Réseau Social
  const renderNetworkIcon = (network: SocialNetwork, className = 'w-4 h-4') => {
    switch (network) {
      case 'instagram':
        return <Instagram className={`${className} text-[#E1306C]`} />;
      case 'facebook':
        return <Facebook className={`${className} text-[#1877F2]`} />;
      case 'linkedin':
        return <Linkedin className={`${className} text-[#0A66C2]`} />;
      case 'tiktok':
        return (
          <span className={`${className} font-black text-black inline-flex items-center justify-center text-[10px] leading-none bg-slate-100 rounded px-1`}>
            TT
          </span>
        );
    }
  };

  // Badge de Statut
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
            Validé client
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Send className="w-2.5 h-2.5 text-[#0066FF]" />
            Programmé / Publié
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-[#0F172A]">
      
      {/* Toast Notification Flottante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#F94F06]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =======================================================================
          A. BARRE LATÉRALE (Sidebar Gauche - #0F172A)
          ======================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0F172A] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800 lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto">
          {/* En-tête : Logo & Badge Pro */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <Link href="/dashboard" className="inline-flex items-center gap-2 transition-opacity hover:opacity-90">
              <Image
                src="/images/logo-white.svg"
                alt="CMFlow Logo"
                width={115}
                height={28}
                className="h-6 w-auto object-contain"
                priority
              />
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#F94F06]/20 text-[#F94F06] border border-[#F94F06]/30">
                PRO
              </span>
            </Link>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sélecteur de Marque / Client (Dropdown interactif) */}
          <div className="p-3.5 relative">
            <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
              Client Actif
            </label>

            <button
              type="button"
              onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 transition-all text-left group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={selectedClient.avatar}
                  alt={selectedClient.name}
                  className="w-7 h-7 rounded-lg object-cover ring-2 ring-[#0066FF]/40 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                    <span>{selectedClient.name}</span>
                    <span className="text-xs">{selectedClient.flag}</span>
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
              <div className="absolute top-full left-3.5 right-3.5 mt-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 max-h-60 overflow-y-auto">
                <div className="text-[9px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                  Changer de marque
                </div>
                {clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => {
                      setSelectedClient(client);
                      setIsClientDropdownOpen(false);
                      triggerToast(`Espace commuté sur « ${client.name} »`);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-800 transition-colors ${
                      selectedClient.id === client.id ? 'bg-slate-800/80 font-bold text-[#F94F06]' : 'text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img src={client.avatar} alt={client.name} className="w-5 h-5 rounded-md object-cover" />
                      <span className="truncate text-xs">{client.name}</span>
                    </div>
                    <span className="text-xs">{client.flag}</span>
                  </button>
                ))}
                
                <div className="border-t border-slate-800 my-1 pt-1">
                  <button
                    onClick={() => {
                      setIsClientDropdownOpen(false);
                      setIsAddClientModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#0066FF] hover:bg-slate-800/80 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Ajouter une marque</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Principale (9 Modules) */}
          <nav className="px-2.5 space-y-0.5">
            
            {/* 1. Calendrier */}
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold bg-[#F94F06] text-white shadow-md shadow-[#F94F06]/20"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>1. Calendrier & Queue</span>
            </Link>

            {/* 2. Espaces Clients */}
            <Link
              href="/clients"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span>2. Espaces Clients</span>
            </Link>

            {/* 3. Médiathèque */}
            <Link
              href="/media"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-slate-400" />
              <span>3. Médiathèque & Assets</span>
            </Link>

            {/* 4. Messagerie Unifiée */}
            <Link
              href="/inbox"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>4. Inbox Unifiée</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            </Link>

            {/* 5. Start Page */}
            <Link
              href="/startpage"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Globe className="w-4 h-4 text-slate-400" />
              <span>5. Start Page (Bio)</span>
            </Link>

            {/* 6. Analytics & Rapports */}
            <Link
              href="/analytics"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-slate-400" />
              <span>6. Analytics & Rapports</span>
            </Link>

            {/* 7. Portail Validation */}
            <button
              onClick={() => setIsValidationModalOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors text-left"
            >
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>7. Portail Validation</span>
            </button>

            {/* 8. Facturation & Forfaits */}
            <Link
              href="/billing"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span>8. Forfait & Paiements</span>
              </div>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Wave
              </span>
            </Link>

            {/* 9. Paramètres */}
            <Link
              href="/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>9. Paramètres Agence</span>
            </Link>

          </nav>
        </div>

        {/* Pied de Sidebar : Profil CM & Déconnexion */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/60">
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
                <div className="text-[10px] text-slate-400 truncate">Lead CM · Dakar 🇸🇳</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (confirm('Voulez-vous vous déconnecter de CMFlow ?')) {
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

      {/* Fond sombre pour mobile */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* =======================================================================
          ZONE CENTRALE DU DASHBOARD (HEADER + KPIS + CALENDRIER)
          ======================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        
        {/* =====================================================================
            B. EN-TÊTE SUPÉRIEUR (TOP BAR)
            ===================================================================== */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
          
          {/* Titre & Bouton Hamburger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
                <span>Planning de publication</span>
                <span className="text-slate-300 font-normal">/</span>
                <span className="text-[#0066FF] flex items-center gap-1.5">
                  {selectedClient.name} {selectedClient.flag}
                </span>
              </h1>
              <p className="text-[11px] text-slate-500">
                {clientPosts.length} publication{clientPosts.length > 1 ? 's' : ''} planifiée{clientPosts.length > 1 ? 's' : ''} ce mois-ci
              </p>
            </div>
          </div>

          {/* Sélecteur de vue & Boutons d'Action Rapide */}
          <div className="flex items-center flex-wrap gap-2">
            
            {/* Boutons Pilules de Vue */}
            <div className="bg-slate-100 p-0.5 rounded-xl flex items-center border border-slate-200 text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'week' ? 'bg-white text-[#0F172A] shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Semaine
              </button>
              <button
                type="button"
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'month' ? 'bg-white text-[#0F172A] shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Mois
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
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
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#10B981]/10 text-[#059669] border border-[#10B981]/30 hover:bg-[#10B981]/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Envoyer pour validation</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>

            {/* Bouton Principal Orange (+ Créer un post) */}
            <button
              type="button"
              onClick={() => setIsCreatePostModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-[#F94F06] hover:bg-[#e04605] text-white shadow-md shadow-[#F94F06]/25 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Créer un post</span>
            </button>

          </div>
        </header>

        {/* =====================================================================
            BANNIÈRE ONBOARDING (DISMISSIBLE)
            ===================================================================== */}
        {showOnboardingBanner && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 sm:px-8 py-3 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3 overflow-x-auto">
              <span className="font-extrabold text-white flex items-center gap-1 shrink-0">
                👋 Bienvenue sur CMFlow !
              </span>
              <span className="text-blue-100 hidden md:inline">Lancez votre campagne en 3 étapes :</span>
              <div className="flex items-center gap-2 font-medium shrink-0">
                <button
                  onClick={() => setIsAddClientModalOpen(true)}
                  className="px-2 py-0.5 bg-white/15 hover:bg-white/25 rounded-md border border-white/20"
                >
                  1. Ajouter une marque
                </button>
                <span>➔</span>
                <button
                  onClick={() => setIsCreatePostModalOpen(true)}
                  className="px-2 py-0.5 bg-white/15 hover:bg-white/25 rounded-md border border-white/20"
                >
                  2. Créer un post
                </button>
                <span>➔</span>
                <button
                  onClick={() => setIsValidationModalOpen(true)}
                  className="px-2 py-0.5 bg-white/15 hover:bg-white/25 rounded-md border border-white/20 font-bold text-amber-300"
                >
                  3. Tester validation WhatsApp
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowOnboardingBanner(false)}
              className="text-blue-200 hover:text-white p-1 shrink-0"
              title="Fermer la bannière"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* ===================================================================
              C. CARTES DE MÉTRIQUES CLÉS (4 KPIS CONTEXTUALISÉES)
              =================================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* KPI 1 : Espace Client */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Marque Active
                </span>
                <div className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
                  <span className="truncate">{selectedClient.name}</span>
                  <span>{selectedClient.flag}</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Espace synchronisé
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F94F06]">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 2 : Comptes connectés */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Comptes Liés
                </span>
                <div className="text-lg font-extrabold text-slate-900 mt-1">
                  {connectedPlatformsCount} Réseaux
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  {selectedClient.connectedAccounts.instagram && <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />}
                  {selectedClient.connectedAccounts.facebook && <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />}
                  {selectedClient.connectedAccounts.tiktok && <span className="text-[9px] font-bold">TT</span>}
                  {selectedClient.connectedAccounts.linkedin && <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF]">
                <Link2 className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 3 : Posts ce mois */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Volume Ce Mois
                </span>
                <div className="text-lg font-extrabold text-slate-900 mt-1">
                  {clientPosts.length} Publications
                </div>
                <span className="text-[10px] text-slate-500 font-medium block mt-1">
                  Tous statuts confondus
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <CalendarIcon className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 4 : Taux d'approbation client */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Taux d'Approbation
                </span>
                <div className="text-lg font-extrabold text-emerald-600 mt-1 flex items-center gap-1">
                  <span>{selectedClient.approvalRate}%</span>
                  <span className="text-[10px] text-slate-400 font-normal">au 1er envoi</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium block mt-1">
                  Validation WhatsApp fluide
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* ===================================================================
              D. BARRE D'OUTILS ET FILTRES DU CALENDRIER
              =================================================================== */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-xs">
            
            {/* Navigation Temporelle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => triggerToast('Semaine précédente chargée')}
                  className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 text-xs font-bold text-slate-800 hover:bg-white rounded-lg transition-colors"
                >
                  Aujourd'hui
                </button>
                <button
                  type="button"
                  onClick={() => triggerToast('Semaine suivante chargée')}
                  className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs sm:text-sm font-extrabold text-[#0F172A]">
                Semaine du 24 au 30 Août 2026
              </div>
            </div>

            {/* Filtres Combinés (Réseaux & Statuts) */}
            <div className="flex items-center flex-wrap gap-2 text-xs">
              
              {/* Filtre Réseau */}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
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
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
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

          {/* ===================================================================
              VUE SEMAINE : GRILLE DU CALENDRIER MULTI-RÉSEAUX
              =================================================================== */}
          {viewMode === 'week' && (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 min-w-full md:min-w-[920px] items-start">
              {DAYS_OF_WEEK.map((day) => {
                const dayPosts = filteredPosts.filter((p) => p.scheduledDate === day.key);
                const isToday = day.dateNum === '24';

                return (
                  <div
                    key={day.key}
                    className={`rounded-2xl border transition-all ${
                      isToday
                        ? 'bg-white border-[#0066FF]/50 shadow-md ring-2 ring-[#0066FF]/10'
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    {/* Header du Jour */}
                    <div
                      className={`p-3 border-b flex items-center justify-between rounded-t-2xl ${
                        isToday ? 'bg-blue-50/70 border-blue-100' : 'bg-slate-50/70 border-slate-100'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
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
                        <span className="text-[9px] font-extrabold bg-[#0066FF] text-white px-2 py-0.5 rounded-full">
                          Aujourd'hui
                        </span>
                      )}
                    </div>

                    {/* Zone de cartes de publication */}
                    <div className="p-2 space-y-2.5 min-h-[300px]">
                      {dayPosts.length === 0 ? (
                        <div className="h-36 flex flex-col items-center justify-center text-center p-3 border border-dashed border-slate-200 rounded-xl text-slate-400">
                          <span className="text-[11px] font-medium">Aucun post</span>
                          <button
                            type="button"
                            onClick={() => {
                              setNewDate(day.key);
                              setIsCreatePostModalOpen(true);
                            }}
                            className="mt-1.5 text-[11px] font-bold text-[#0066FF] hover:underline"
                          >
                            + Planifier
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
                                alt="Aperçu visuel"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />

                              {/* Badge Réseau Social */}
                              <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md rounded-lg p-1.5 shadow-sm border border-slate-200/60">
                                {renderNetworkIcon(post.network)}
                              </div>

                              {/* Badge Type Média */}
                              {post.mediaType === 'video' && (
                                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1">
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
                            <div className="p-2.5 space-y-2">
                              <p className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed font-medium">
                                {post.caption}
                              </p>

                              {/* Badge Statut */}
                              <div className="pt-0.5 flex items-center justify-between">
                                {renderStatusBadge(post.status)}
                              </div>
                            </div>

                            {/* Actions Rapides au Survol */}
                            <div className="absolute inset-0 bg-[#0F172A]/85 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3 text-white">
                              <button
                                type="button"
                                title="Prévisualiser"
                                onClick={() => setPreviewPost(post)}
                                className="p-2 rounded-lg bg-white/20 hover:bg-white text-white hover:text-slate-900 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                title="Modifier"
                                onClick={() => triggerToast('Édition du post ouverte')}
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
              VUE LISTE ALTERNATIVE
              =================================================================== */}
          {(viewMode === 'list' || viewMode === 'month') && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-[11px] uppercase tracking-wider text-slate-500 grid grid-cols-12 gap-4">
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
                    className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50/80 transition-colors text-xs"
                  >
                    <div className="col-span-2 font-bold text-slate-900">
                      {post.scheduledDate} · {post.scheduledTime}
                    </div>

                    <div className="col-span-2 flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-slate-100">
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
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
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
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* =======================================================================
          MODALE 1 : ENVOYER POUR VALIDATION WHATSAPP
          ======================================================================= */}
      {isValidationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 animate-fadeIn">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A]">
                    Lien Magique de Validation
                  </h3>
                  <p className="text-xs text-slate-500">Pour {selectedClient.name} {selectedClient.flag}</p>
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
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-slate-700 truncate font-semibold">
                {magicValidationUrl}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(magicValidationUrl);
                  triggerToast('📋 Lien magique copié dans le presse-papier !');
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-[#0066FF] rounded-lg shrink-0 font-bold text-xs flex items-center gap-1 shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copier</span>
              </button>
            </div>

            {/* Aperçu Message WhatsApp */}
            <div className="mb-4 p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs text-emerald-900 leading-relaxed">
              <span className="font-bold block text-emerald-800 mb-1">Message prêt pour WhatsApp :</span>
              « {whatsappPreFilledText} »
            </div>

            {/* Boutons d'Action */}
            <div className="space-y-2">
              <a
                href={`https://wa.me/${selectedClient.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappPreFilledText)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/25 transition-all"
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
          MODALE 2 : CRÉATION / PROGRAMMATION DE POST
          ======================================================================= */}
      {isCreatePostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 animate-fadeIn max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">
                  Créer une Publication
                </h3>
                <p className="text-xs text-slate-500">Pour {selectedClient.name} {selectedClient.flag}</p>
              </div>
              <button
                onClick={() => setIsCreatePostModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              
              {/* Choix Réseau Social */}
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
                          ? 'border-[#0066FF] bg-blue-50/60 text-[#0066FF] font-bold shadow-xs'
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
                  Visuel ou Vidéo
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-[#0066FF] rounded-xl p-4 text-center bg-slate-50/50 cursor-pointer transition-colors">
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-700">Glissez-déposez votre visuel ici</div>
                  <div className="text-[10px] text-slate-400">PNG, JPG, MP4 jusqu'à 50 Mo</div>
                </div>
              </div>

              {/* Légende & Compteur */}
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
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
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

              {/* Boutons d'Action */}
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
                  className="px-5 py-2 text-xs font-bold bg-[#F94F06] hover:bg-[#e04605] text-white rounded-xl shadow-md shadow-[#F94F06]/20 transition-all"
                >
                  Planifier le post
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =======================================================================
          MODALE 3 : AJOUTER UN NOUVEAU CLIENT
          ======================================================================= */}
      {isAddClientModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-slate-200 animate-fadeIn">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#F94F06] flex items-center justify-center font-bold">
                  +
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A]">
                    Ajouter une Marque
                  </h3>
                  <p className="text-xs text-slate-500">Créer un nouvel espace client</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddClientModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Nom de la Marque / Entreprise
                </label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="ex: Dakar Digital Studio"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Secteur d'activité
                </label>
                <input
                  type="text"
                  value={newClientCategory}
                  onChange={(e) => setNewClientCategory(e.target.value)}
                  placeholder="ex: Mode & Prêt-à-porter"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Pays
                  </label>
                  <select
                    value={newClientCountry}
                    onChange={(e) => setNewClientCountry(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                  >
                    <option value="Sénégal 🇸🇳">Sénégal 🇸🇳</option>
                    <option value="Côte d'Ivoire 🇨🇮">Côte d'Ivoire 🇨🇮</option>
                    <option value="Bénin 🇧🇯">Bénin 🇧🇯</option>
                    <option value="Cameroun 🇨🇲">Cameroun 🇨🇲</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    WhatsApp Client
                  </label>
                  <input
                    type="tel"
                    value={newClientWhatsapp}
                    onChange={(e) => setNewClientWhatsapp(e.target.value)}
                    placeholder="+221 77 123 45 67"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddClientModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#F94F06] hover:bg-[#e04605] text-white rounded-xl shadow-md shadow-[#F94F06]/20 transition-all"
                >
                  Créer l'espace client
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* =======================================================================
          MODALE 4 : APERÇU DÉTAILLÉ D'UNE PUBLICATION
          ======================================================================= */}
      {previewPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 animate-fadeIn">
            
            {/* Header */}
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
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Média */}
            <div className="h-64 w-full bg-slate-100">
              <img
                src={previewPost.mediaUrl}
                alt="Aperçu"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contenu */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">
                  {previewPost.scheduledDate} à {previewPost.scheduledTime}
                </span>
                {renderStatusBadge(previewPost.status)}
              </div>

              <p className="text-xs text-slate-800 leading-relaxed">
                {previewPost.caption}
              </p>

              <button
                onClick={() => setPreviewPost(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
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
