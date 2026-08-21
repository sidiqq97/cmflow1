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
  Copy,
  CheckCircle2,
  Clock,
  Video,
  Layers,
  Instagram,
  Facebook,
  Linkedin,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  Link2,
  UploadCloud,
  Check,
  ArrowUpRight,
  Flame,
  Search,
  MoreHorizontal
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
  monthlyGoal: number;
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
  carouselCount?: number;
  likesEst?: number;
}

// Données Mockées Haut de Gamme
const MOCK_CLIENTS: Client[] = [
  {
    id: 'teranga-gourmet',
    name: 'Teranga Gourmet',
    country: 'Sénégal',
    flag: '🇸🇳',
    category: 'Haute Gastronomie & Traiteur',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
    color: '#F94F06',
    whatsapp: '+221 77 842 19 02',
    connectedAccounts: {
      instagram: '@teranga_gourmet_dakar',
      facebook: 'Teranga Gourmet Dakar',
      tiktok: '@terangafood',
    },
    approvalRate: 98,
    monthlyGoal: 24,
  },
  {
    id: 'sira-cosmetiques',
    name: 'Sira Cosmétiques Bio',
    country: 'Côte d\'Ivoire',
    flag: '🇨🇮',
    category: 'Skincare & Beauté Naturelle',
    avatar: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&auto=format&fit=crop&q=80',
    color: '#0066FF',
    whatsapp: '+225 07 48 92 10 33',
    connectedAccounts: {
      instagram: '@siracosmetiques_abj',
      facebook: 'Sira Cosmétiques',
      linkedin: 'Sira Group CI',
    },
    approvalRate: 94,
    monthlyGoal: 18,
  },
  {
    id: 'baobab-tech',
    name: 'Baobab Tech Hub',
    country: 'Sénégal',
    flag: '🇸🇳',
    category: 'Incubateur & SaaS FinTech',
    avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&auto=format&fit=crop&q=80',
    color: '#10B981',
    whatsapp: '+221 78 112 45 88',
    connectedAccounts: {
      linkedin: 'Baobab Tech Dakar',
      facebook: 'Baobab Tech Hub',
    },
    approvalRate: 100,
    monthlyGoal: 16,
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
    caption: 'Ce soir, découvrez notre nouveau Thiéboudienne royal revisité aux fruits de mer frais de Soumbédioune 🐟✨ Réservez votre table en terrasse ! #DakarFood #SenegalGourmet',
    mediaUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    mediaType: 'carousel',
    carouselCount: 3,
    likesEst: 342,
  },
  {
    id: 'post-2',
    clientId: 'teranga-gourmet',
    network: 'tiktok',
    status: 'pending_validation',
    scheduledDate: '2026-08-25', // Mardi
    scheduledTime: '12:15',
    caption: 'Dans les coulisses avec notre Chef Moussa qui prépare les fameux pastels croustillants 🔥 Vous êtes plutôt sauce pimentée ou douce ? #DakarFood #Foodie',
    mediaUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80',
    mediaType: 'video',
    likesEst: 1250,
  },
  {
    id: 'post-3',
    clientId: 'teranga-gourmet',
    network: 'facebook',
    status: 'scheduled',
    scheduledDate: '2026-08-26', // Mercredi
    scheduledTime: '09:00',
    caption: 'Offre spéciale déjeuner d\'entreprise : -15% sur toutes vos commandes de groupe du mercredi au vendredi 💼🍽️ Livraison express au Plateau et aux Almadies.',
    mediaUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    likesEst: 89,
  },
  {
    id: 'post-4',
    clientId: 'teranga-gourmet',
    network: 'instagram',
    status: 'draft',
    scheduledDate: '2026-08-27', // Jeudi
    scheduledTime: '19:45',
    caption: 'Ambiance feutrée et musique acoustique en terrasse ce week-end. Qui vous accompagne ? Mentionnez-les en commentaire ! 🥂🎷 #DakarNight #TerangaGourmet',
    mediaUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    likesEst: 215,
  },
  {
    id: 'post-5',
    clientId: 'teranga-gourmet',
    network: 'linkedin',
    status: 'validated',
    scheduledDate: '2026-08-28', // Vendredi
    scheduledTime: '10:30',
    caption: 'Fier d\'accueillir les délégations du Sommet Tech Afrique de l\'Ouest pour leurs déjeuners et dîners officiels d\'affaires. L\'excellence du service au cœur de notre engagement.',
    mediaUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    likesEst: 178,
  },
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

export default function UltraDashboard() {
  // États
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [selectedClient, setSelectedClient] = useState<Client>(MOCK_CLIENTS[0]);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

  // Vues et Filtres
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [filterNetwork, setFilterNetwork] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
  const [newMediaUrl, setNewMediaUrl] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80');

  // Formulaire Ajout Client
  const [newClientName, setNewClientName] = useState('');
  const [newClientCategory, setNewClientCategory] = useState('');
  const [newClientCountry, setNewClientCountry] = useState('Sénégal 🇸🇳');
  const [newClientWhatsapp, setNewClientWhatsapp] = useState('');

  // Toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtrage des posts pour le client actif
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

  // Ajouter un post
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
      likesEst: 150,
    };

    setPosts([newPost, ...posts]);
    setIsCreatePostModalOpen(false);
    setNewCaption('');
    triggerToast('✨ Publication ajoutée au calendrier avec succès !');
  };

  // Ajouter un client
  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const flag = newClientCountry.includes('Côte') ? '🇨🇮' : '🇸🇳';
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: newClientName,
      country: newClientCountry,
      flag: flag,
      category: newClientCategory || 'Commerce & Agence',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
      color: '#F94F06',
      whatsapp: newClientWhatsapp || '+221 77 000 00 00',
      connectedAccounts: {
        instagram: `@${newClientName.toLowerCase().replace(/\s+/g, '')}`,
        facebook: newClientName,
      },
      approvalRate: 100,
      monthlyGoal: 20,
    };

    setClients([...clients, newClient]);
    setSelectedClient(newClient);
    setIsAddClientModalOpen(false);
    setNewClientName('');
    setNewClientWhatsapp('');
    triggerToast(`🎉 Marque « ${newClient.name} » créée et activée !`);
  };

  // Supprimer un post
  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
    triggerToast('🗑️ Publication supprimée.');
  };

  // Dupliquer un post
  const handleDuplicatePost = (post: Post) => {
    const duplicated: Post = {
      ...post,
      id: `post-${Date.now()}`,
      caption: `[Copie] ${post.caption}`,
      status: 'draft',
    };
    setPosts([duplicated, ...posts]);
    triggerToast('📋 Publication dupliquée en brouillon.');
  };

  const magicValidationUrl = `https://cmflow.sn/v/${selectedClient.id}-a8f9`;
  const whatsappPreFilledText = `Bonjour ! Votre planning de la semaine pour ${selectedClient.name} est prêt pour validation : ${magicValidationUrl} 🚀`;

  // Rendu de l'icône de réseau
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

  // Badge de Statut Glassmorphism
  const renderStatusPill = (status: PostStatus) => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-600 border border-slate-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Brouillon
          </span>
        );
      case 'pending_validation':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/25 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            En attente WhatsApp
          </span>
        );
      case 'validated':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 shadow-xs">
            <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
            Validé client
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/25 shadow-xs">
            <Send className="w-3 h-3 text-[#0066FF]" />
            Programmé
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased flex selection:bg-[#F94F06]/20 selection:text-[#F94F06]">
      
      {/* Texture de fond & lueurs ambiantes style Vercel / Linear */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/40 via-purple-50/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-orange-100/30 via-amber-50/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Toast Notification Flottante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A]/95 backdrop-blur-xl text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#F94F06]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =======================================================================
          A. SIDEBAR ÉLÉGANTE (#0F172A - Linear Style)
          ======================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0F172A] text-white flex flex-col justify-between transition-transform duration-300 ease-out border-r border-slate-800/80 lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto">
          
          {/* Logo Brand & Header */}
          <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
            <Link href="/dashboard" className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90">
              <Image
                src="/images/logo-white.svg"
                alt="CMFlow Logo"
                width={118}
                height={28}
                className="h-6 w-auto object-contain"
                priority
              />
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#F94F06]/20 text-[#F94F06] border border-[#F94F06]/30 tracking-wider">
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

          {/* Sélecteur de Marque & Workspace (Mini-carte Premium) */}
          <div className="p-3.5 relative">
            <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-1.5 flex items-center justify-between">
              <span>Espace Client</span>
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Actif
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-800/50 hover:from-slate-800 hover:to-slate-800/80 border border-slate-700/70 hover:border-slate-600 transition-all text-left group shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={selectedClient.avatar}
                    alt={selectedClient.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-[#0066FF]/40"
                  />
                  <span className="absolute -bottom-1 -right-1 text-[10px] bg-slate-900 rounded-full px-0.5">
                    {selectedClient.flag}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate group-hover:text-sky-300 transition-colors">
                    {selectedClient.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {selectedClient.category}
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-white shrink-0 ml-1 transition-transform duration-200 ${isClientDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Menu Dropdown Clients */}
            {isClientDropdownOpen && (
              <div className="absolute top-full left-3.5 right-3.5 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl py-2 z-50 max-h-64 overflow-y-auto animate-fadeIn">
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
                    className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-800/80 transition-colors ${
                      selectedClient.id === client.id ? 'bg-slate-800/90 font-bold text-[#F94F06]' : 'text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
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

          {/* Navigation Latérale (9 Modules Raycast/Linear Style) */}
          <nav className="px-3 space-y-1 mt-1">
            
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold bg-[#F94F06] text-white shadow-lg shadow-[#F94F06]/25 transition-all"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>1. Calendrier & Queue</span>
            </Link>

            <Link
              href="/clients"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span>2. Espaces Clients</span>
            </Link>

            <Link
              href="/media"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              <ImageIcon className="w-4 h-4 text-slate-400" />
              <span>3. Médiathèque Assets</span>
            </Link>

            <Link
              href="/inbox"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>4. Inbox Unifiée</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            </Link>

            <Link
              href="/startpage"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              <Globe className="w-4 h-4 text-slate-400" />
              <span>5. Start Page (Bio)</span>
            </Link>

            <Link
              href="/analytics"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              <BarChart3 className="w-4 h-4 text-slate-400" />
              <span>6. Analytics & Bilans</span>
            </Link>

            <button
              onClick={() => setIsValidationModalOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all text-left"
            >
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>7. Portail Validation</span>
            </button>

            <Link
              href="/billing"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span>8. Facturation & Forfaits</span>
              </div>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Wave
              </span>
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>9. Paramètres Agence</span>
            </Link>

          </nav>
        </div>

        {/* Profil CM connecté */}
        <div className="p-3.5 border-t border-slate-800/70 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0066FF] to-sky-400 flex items-center justify-center font-black text-xs text-white shadow-sm">
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
                if (confirm('Se déconnecter de CMFlow ?')) {
                  window.location.href = '/login';
                }
              }}
              title="Déconnexion"
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800/80 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Fond sombre Mobile */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* =======================================================================
          ZONE DE CONTENU PRINCIPALE (Top Bar + KPIs + Calendrier)
          ======================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 z-10">
        
        {/* =====================================================================
            B. TOP BAR AÉRÉE & GLASSMORPHISM (Floating Style)
            ===================================================================== */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-slate-200/60 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-all">
          
          {/* Fil d'Ariane Minimaliste & Hamburger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-[#0F172A] tracking-tight">
                <span className="text-slate-400 font-medium">Planning</span>
                <span className="text-slate-300">/</span>
                <span className="text-[#0F172A] flex items-center gap-1.5">
                  {selectedClient.name} {selectedClient.flag}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {clientPosts.length} publications planifiées pour ce client
              </p>
            </div>
          </div>

          {/* Segmented Control & Actions Rapides */}
          <div className="flex items-center flex-wrap gap-2.5">
            
            {/* Segmented-Control Moderne */}
            <div className="bg-slate-100/80 backdrop-blur-sm p-1 rounded-xl flex items-center border border-slate-200/70 text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  viewMode === 'week' ? 'bg-white text-[#0F172A] shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Semaine
              </button>
              <button
                type="button"
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  viewMode === 'month' ? 'bg-white text-[#0F172A] shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Mois
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
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
              <span className="hidden sm:inline">Validation WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>

            {/* Bouton Principal Orange Électrique (#F94F06) */}
            <button
              type="button"
              onClick={() => setIsCreatePostModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-[#F94F06] hover:bg-[#e04605] text-white shadow-lg shadow-[#F94F06]/25 hover:shadow-[#F94F06]/40 active:scale-[0.98] transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nouveau Post</span>
            </button>

          </div>
        </header>

        {/* =====================================================================
            CORPS DU COCKPIT (KPIS + BARRE FILTRES + GRILLE)
            ===================================================================== */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* ===================================================================
              D. CARTES KPIS COMPACTES AVEC MICRO-SPARKLINES
              =================================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* KPI 1 : Marque Active & Sync */}
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Client Actif
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  En ligne
                </span>
              </div>
              <div className="text-base font-extrabold text-[#0F172A] mt-2 flex items-center gap-1.5">
                <span className="truncate">{selectedClient.name}</span>
                <span>{selectedClient.flag}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>{selectedClient.category}</span>
                <span className="font-semibold text-slate-700">Dakar 🇸🇳</span>
              </div>
            </div>

            {/* KPI 2 : Comptes Connectés */}
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Canaux Liés
                </span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                  API Connectées
                </span>
              </div>
              <div className="text-xl font-extrabold text-[#0F172A] mt-1">
                {Object.keys(selectedClient.connectedAccounts || {}).length} Réseaux
              </div>
              <div className="flex items-center gap-2 mt-2">
                {selectedClient.connectedAccounts.instagram && <Instagram className="w-4 h-4 text-[#E1306C]" />}
                {selectedClient.connectedAccounts.facebook && <Facebook className="w-4 h-4 text-[#1877F2]" />}
                {selectedClient.connectedAccounts.tiktok && <span className="text-[10px] font-black bg-slate-100 rounded px-1">TT</span>}
                {selectedClient.connectedAccounts.linkedin && <Linkedin className="w-4 h-4 text-[#0A66C2]" />}
              </div>
            </div>

            {/* KPI 3 : Posts ce mois */}
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Volume Ce Mois
                </span>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
                  Objectif {selectedClient.monthlyGoal}
                </span>
              </div>
              <div className="text-xl font-extrabold text-[#0F172A] mt-1">
                {clientPosts.length} / {selectedClient.monthlyGoal} Posts
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  style={{ width: `${Math.min(100, Math.round((clientPosts.length / selectedClient.monthlyGoal) * 100))}%` }}
                ></div>
              </div>
            </div>

            {/* KPI 4 : Taux d'approbation client */}
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Approbation 1er Envoi
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#F94F06]" />
                  98% Efficace
                </span>
              </div>
              <div className="text-xl font-extrabold text-emerald-600 mt-1 flex items-baseline gap-1">
                <span>{selectedClient.approvalRate}%</span>
                <span className="text-xs text-slate-400 font-normal">validés sans retouches</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Validation WhatsApp en 1 clic
              </div>
            </div>

          </div>

          {/* ===================================================================
              BARRE D'OUTILS & FILTRES DE CALENDRIER (RAYCAST / LINEAR STYLE)
              =================================================================== */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-3 sm:p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 shadow-xs">
            
            {/* Navigation Date */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-100/80 border border-slate-200/80 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => triggerToast('Semaine précédente chargée')}
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
                  onClick={() => triggerToast('Semaine suivante chargée')}
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

            {/* Filtres par Réseau & Statut */}
            <div className="flex items-center flex-wrap gap-2 text-xs">
              
              {/* Filtre Réseau */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 shadow-xs">
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
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 shadow-xs">
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
              C. GRILLE DU CALENDRIER 7 JOURS (MODERN TIMELINE CARD VIEW)
              =================================================================== */}
          {viewMode === 'week' && (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 min-w-full md:min-w-[940px] items-start">
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
                        isToday ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border-blue-100' : 'bg-slate-50/60 border-slate-100'
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

                    {/* Zone de cartes de posts */}
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
                            {/* Preview Média HD avec Glassmorphism Badge */}
                            <div className="relative h-32 w-full bg-slate-900 overflow-hidden">
                              <img
                                src={post.mediaUrl}
                                alt="Aperçu du visuel"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />

                              {/* Badge Réseau Social en Glassmorphism */}
                              <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-md rounded-lg p-1.5 shadow-sm border border-white/20">
                                {renderNetworkIcon(post.network, 'w-3.5 h-3.5')}
                              </div>

                              {/* Type Média (Carrousel ou Vidéo) */}
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
                            <div className="p-3 space-y-2.5">
                              <p className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed font-medium">
                                {post.caption}
                              </p>

                              {/* Pied de Carte avec Statut */}
                              <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                                {renderStatusPill(post.status)}
                              </div>
                            </div>

                            {/* Overlay d'Actions Rapides au Survol (Raycast Style) */}
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
                                onClick={() => triggerToast('Édition du post ouverte')}
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

          {/* ===================================================================
              VUE LISTE ÉPURÉE (ALTERNATE VIEW)
              =================================================================== */}
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
                      {renderStatusPill(post.status)}
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

        </div>
      </div>

      {/* =======================================================================
          MODALE 1 : ENVOYER POUR VALIDATION WHATSAPP (MAGIQUE)
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
              « {whatsappPreFilledText} »
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <a
                href={`https://wa.me/${selectedClient.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappPreFilledText)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/25 transition-all"
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
          MODALE 2 : CRÉER UN POST (+ NOUVEAU POST)
          ======================================================================= */}
      {isCreatePostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 animate-fadeIn max-h-[90vh] overflow-y-auto">
            
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
          MODALE 3 : AJOUTER UNE MARQUE
          ======================================================================= */}
      {isAddClientModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-slate-200 animate-fadeIn">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#F94F06] flex items-center justify-center font-bold">
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
                  className="px-5 py-2.5 text-xs font-bold bg-[#F94F06] hover:bg-[#e04605] text-white rounded-xl shadow-md shadow-[#F94F06]/20 transition-all"
                >
                  Créer l'espace client
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* =======================================================================
          MODALE 4 : APERÇU HD D'UN POST
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
                <X className="w-4 h-4" />
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
                {renderStatusPill(previewPost.status)}
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
