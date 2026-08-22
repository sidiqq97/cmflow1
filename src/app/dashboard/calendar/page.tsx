'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  MessageSquare,
  Image as ImageIcon,
  Film,
  Play,
  RotateCcw,
  Heart,
  Bookmark,
  MoreHorizontal,
  CheckCheck,
  FolderOpen,
  Sliders,
  CheckSquare,
  Square,
  Loader2
} from 'lucide-react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { uploadPostMedia } from '../../../lib/uploadMedia';
import { WhatsAppShareModal } from '../../../components/WhatsAppShareModal';

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

export interface BrandAsset {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'video';
  duration?: string;
  category: string;
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

// Bibliothèque d'assets par défaut
const BRAND_ASSETS_LIBRARY: BrandAsset[] = [
  {
    id: 'asset-1',
    title: 'Thiéboudienne Royal & Dorade',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    category: 'Plats Chauds',
  },
  {
    id: 'asset-2',
    title: 'Coulisses Cuisine Chef Moussa (Reel)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-cooking-fresh-pasta-in-a-kitchen-42795-large.mp4',
    type: 'video',
    duration: '0:32',
    category: 'Reels / Vidéos',
  },
  {
    id: 'asset-3',
    title: 'Plateau Pastels Chauds Croustillants',
    url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    category: 'Entrées',
  },
  {
    id: 'asset-4',
    title: 'Terrasse Vue Mer & Ambiance Soir',
    url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    category: 'Ambiance',
  },
  {
    id: 'asset-5',
    title: 'Jus de Bissap Menthe Glacé',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    category: 'Boissons',
  },
  {
    id: 'asset-6',
    title: 'Dressage Salade Mangue & Crevettes',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    category: 'Entrées',
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
  const { activeWorkspace } = useWorkspace();

  // État local des publications
  const [posts, setPosts] = useState<CalendarPost[]>(INITIAL_CALENDAR_POSTS);
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedNetworkFilter, setSelectedNetworkFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Modales
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isAssetLibraryOpen, setIsAssetLibraryOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<CalendarPost | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // État Téléversement & Partage WhatsApp
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [shareModalPost, setShareModalPost] = useState<any>(null);
  const [shareModalToken, setShareModalToken] = useState<string>('v_demo8a1d');
  const [shareModalMagicUrl, setShareModalMagicUrl] = useState<string>('');

  // Formulaire Nouveau Post enrichi
  const [caption, setCaption] = useState('');
  const [targetPlatforms, setTargetPlatforms] = useState<SocialNetwork[]>(['instagram', 'facebook']);
  const [scheduledDate, setScheduledDate] = useState('2026-08-24');
  const [scheduledTime, setScheduledTime] = useState('18:30');
  const [initialStatus, setInitialStatus] = useState<PostStatus>('pending_validation');

  // Gestion des Médias
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO' | 'CAROUSEL'>('IMAGE');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Écouteur en temps réel des décisions clients (Webhooks & Activités)
  useEffect(() => {
    const handleRealtimeActivity = (e: any) => {
      const notif = e.detail;
      if (!notif) return;

      if (notif.postId) {
        setPosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.id === notif.postId || notif.postId.includes(p.id)) {
              const newStatus: PostStatus =
                notif.action === 'APPROVED' ? 'validated' : 'pending_validation';
              return { ...p, status: newStatus };
            }
            return p;
          })
        );
      }
    };

    window.addEventListener('cmflow:activity', handleRealtimeActivity);
    return () => {
      window.removeEventListener('cmflow:activity', handleRealtimeActivity);
    };
  }, []);

  // Traitement d'importation de fichiers (Drag & Drop ou File Dialog)
  const handleFilesSelected = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const newPreviews: string[] = [];
    let detectedType: 'IMAGE' | 'VIDEO' | 'CAROUSEL' = 'IMAGE';

    fileArray.forEach((file) => {
      const url = URL.createObjectURL(file);
      newPreviews.push(url);
      if (file.type.startsWith('video/')) {
        detectedType = 'VIDEO';
      }
    });

    if (newPreviews.length > 1) {
      detectedType = 'CAROUSEL';
    }

    setMediaFiles(fileArray);
    setMediaPreviews(newPreviews);
    setMediaType(detectedType);
    setSelectedAssetId(null);
    setActiveCarouselIndex(0);
    triggerToast(`📁 ${fileArray.length} média(s) chargé(s) avec succès !`);
  };

  // Sélection depuis la Médiathèque
  const handleSelectAsset = (asset: BrandAsset) => {
    setMediaFiles([]);
    setMediaPreviews([asset.url]);
    setMediaType(asset.type === 'video' ? 'VIDEO' : 'IMAGE');
    setSelectedAssetId(asset.id);
    setActiveCarouselIndex(0);
    setIsAssetLibraryOpen(false);
    triggerToast(`🖼️ Visuel « ${asset.title} » sélectionné !`);
  };

  // Suppression du média
  const handleRemoveMedia = () => {
    setMediaFiles([]);
    setMediaPreviews([]);
    setMediaType('IMAGE');
    setSelectedAssetId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    triggerToast('🗑️ Média retiré.');
  };

  // Toggle plateforme cible
  const togglePlatform = (platform: SocialNetwork) => {
    if (targetPlatforms.includes(platform)) {
      if (targetPlatforms.length > 1) {
        setTargetPlatforms(targetPlatforms.filter((p) => p !== platform));
      } else {
        triggerToast('⚠️ Veuillez conserver au moins un réseau cible.');
      }
    } else {
      setTargetPlatforms([...targetPlatforms, platform]);
    }
  };

  // Filtrage des posts pour la marque active
  const currentWorkspaceId = activeWorkspace?.id || 'teranga-gourmet';
  const currentWorkspaceName = activeWorkspace?.name || 'Teranga Gourmet';
  const currentWorkspaceFlag = activeWorkspace?.flag || '🇸🇳';
  const currentWorkspaceWhatsapp = activeWorkspace?.whatsappNumber || '+221 77 800 12 34';

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (post.clientId !== currentWorkspaceId && post.clientId !== 'teranga-gourmet') return false;
      if (selectedNetworkFilter !== 'all' && post.network !== selectedNetworkFilter) return false;
      if (selectedStatusFilter !== 'all' && post.status !== selectedStatusFilter) return false;
      return true;
    });
  }, [posts, currentWorkspaceId, selectedNetworkFilter, selectedStatusFilter]);

  // KPIs
  const pendingPostsCount = useMemo(() => filteredPosts.filter((p) => p.status === 'pending_validation').length, [filteredPosts]);
  const validatedPostsCount = useMemo(() => filteredPosts.filter((p) => p.status === 'validated').length, [filteredPosts]);
  const scheduledPostsCount = useMemo(() => filteredPosts.filter((p) => p.status === 'scheduled').length, [filteredPosts]);

  // Soumission Création Post avec Upload Firebase Storage et Génération Token 48h
  const handleCreatePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() && mediaPreviews.length === 0) {
      triggerToast('⚠️ Veuillez ajouter au moins un média ou une légende.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    try {
      const primaryNetwork = targetPlatforms[0] || 'instagram';
      let mainMedia = mediaPreviews[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';

      // 1. Téléversement Réel sur Firebase Storage si un fichier local a été importé
      if (mediaFiles.length > 0) {
        try {
          const uploadedUrl = await uploadPostMedia(mediaFiles[0], currentWorkspaceId, (p) => {
            setUploadProgress(Math.max(15, Math.min(85, p)));
          });
          if (uploadedUrl) {
            mainMedia = uploadedUrl;
          }
        } catch (uploadErr) {
          console.warn('⚠️ Utilisation du média preview :', uploadErr);
        }
      }

      setUploadProgress(90);

      // 2. Appel Route API /api/posts/create pour Firestore & Session 48h
      let createdToken = `v_${Math.random().toString(36).substring(2, 10)}`;
      let magicUrl = `https://cmflow.sn/v/${createdToken}`;
      let createdPostId = `post-${Date.now()}`;

      try {
        const response = await fetch('/api/posts/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workspaceId: currentWorkspaceId,
            caption,
            mediaUrl: mainMedia,
            mediaType: mediaType === 'VIDEO' ? 'video' : mediaType === 'CAROUSEL' ? 'carousel' : 'image',
            platforms: targetPlatforms,
            scheduledDate,
            scheduledTime,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.token) createdToken = result.token;
          if (result.magicUrl) magicUrl = result.magicUrl;
          if (result.postId) createdPostId = result.postId;
        }
      } catch (apiErr) {
        console.warn('⚠️ Enregistrement local fallback :', apiErr);
      }

      const newPost: CalendarPost = {
        id: createdPostId,
        clientId: currentWorkspaceId,
        network: primaryNetwork,
        status: initialStatus,
        scheduledDate,
        scheduledTime,
        caption,
        mediaUrl: mainMedia,
        mediaType: mediaType === 'VIDEO' ? 'video' : mediaType === 'CAROUSEL' ? 'carousel' : 'image',
        carouselCount: mediaPreviews.length > 1 ? mediaPreviews.length : undefined,
        likesEst: Math.floor(Math.random() * 400) + 50,
      };

      setPosts([newPost, ...posts]);
      setIsCreatePostModalOpen(false);

      // Configuration et ouverture immédiate de la modale de validation WhatsApp
      setShareModalPost(newPost);
      setShareModalToken(createdToken);
      setShareModalMagicUrl(magicUrl);
      setIsWhatsAppModalOpen(true);

      // Reset formulaire
      setCaption('');
      setMediaFiles([]);
      setMediaPreviews([]);
      setMediaType('IMAGE');

      triggerToast('🎉 Publication enregistrée & lien WhatsApp prêt !');
    } catch (err) {
      console.error('Erreur lors de la programmation du post :', err);
      triggerToast('❌ Erreur lors de la création de la publication.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const magicLink = `https://cmflow.sn/v/${currentWorkspaceId}-${Date.now().toString(36).slice(-4)}`;
  const whatsappText = `Bonjour ${currentWorkspaceName} ! 🌟 Votre planning hebdomadaire de publications est prêt pour validation sur votre mobile en 1 clic sans mot de passe : ${magicLink}`;

  const renderNetworkIcon = (network: SocialNetwork, className = 'w-4 h-4') => {
    switch (network) {
      case 'instagram':
        return <Instagram className={`${className} text-[#E1306C]`} />;
      case 'facebook':
        return <Facebook className={`${className} text-[#1877F2]`} />;
      case 'tiktok':
        return <Video className={`${className} text-black`} />;
      case 'linkedin':
        return <Linkedin className={`${className} text-[#0077B5]`} />;
    }
  };

  const renderStatusBadge = (status: PostStatus) => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Brouillon
          </span>
        );
      case 'pending_validation':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            En attente WhatsApp
          </span>
        );
      case 'validated':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCheck className="w-3 h-3 text-emerald-600" />
            Validé client
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            Programmé
          </span>
        );
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Toast Flottant */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A]/95 backdrop-blur-xl text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-[#F94F06]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =======================================================================
          A. EN-TÊTE DE PAGE & ACTIONS RAPIDES
          ======================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1.5">
            <span>CMFlow</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-medium">Planning & File de publication</span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              Planning des Publications
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{currentWorkspaceName} {currentWorkspaceFlag}</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Organisez, prévisualisez et soumettez vos contenus pour validation client WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {/* Bouton Validation WhatsApp */}
          <button
            type="button"
            onClick={() => setIsValidationModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#059669] border border-[#10B981]/30 transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <Send className="w-4 h-4 text-[#10B981]" />
            <span>Envoyer pour validation</span>
          </button>

          {/* Bouton Nouveau Post Principal */}
          <button
            type="button"
            onClick={() => setIsCreatePostModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#F94F06] hover:bg-[#e04605] text-white shadow-md shadow-orange-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nouveau post</span>
          </button>
        </div>
      </div>

      {/* =======================================================================
          B. BARRE DE FILTRES ET KPIS
          ======================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Semaine</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{filteredPosts.length} posts</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
            <CalendarIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">En attente WhatsApp</div>
            <div className="text-xl font-bold text-amber-700 mt-0.5">{pendingPostsCount} posts</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Validés Client</div>
            <div className="text-xl font-bold text-emerald-700 mt-0.5">{validatedPostsCount} posts</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Prêts Publication</div>
            <div className="text-xl font-bold text-blue-700 mt-0.5">{scheduledPostsCount} posts</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Send className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* =======================================================================
          C. GRILLE HEBDOMADAIRE DU PLANNING
          ======================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {DAYS_OF_WEEK.map((day) => {
          const dayPosts = filteredPosts.filter((p) => p.scheduledDate === day.key);
          const isToday = day.dateNum === '24';

          return (
            <div
              key={day.key}
              className={`rounded-3xl border transition-all duration-300 ${
                isToday
                  ? 'bg-white border-[#0066FF]/40 shadow-sm ring-2 ring-[#0066FF]/10'
                  : 'bg-white/90 backdrop-blur-sm border-slate-200/70'
              }`}
            >
              <div
                className={`p-3.5 border-b flex items-center justify-between rounded-t-3xl ${
                  isToday ? 'bg-blue-50/70 border-blue-100' : 'bg-slate-50/60 border-slate-100'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {day.name}
                  </span>
                  <span className={`text-lg font-black tracking-tight ${isToday ? 'text-[#0066FF]' : 'text-slate-900'}`}>
                    {day.dateNum}
                  </span>
                </div>
                {isToday && (
                  <span className="text-[9px] font-bold uppercase bg-[#0066FF] text-white px-2 py-0.5 rounded-full shadow-xs">
                    Aujourd'hui
                  </span>
                )}
              </div>

              <div className="p-2.5 space-y-3 min-h-[340px]">
                {dayPosts.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-center p-3 border border-dashed border-slate-200 rounded-2xl text-slate-400">
                    <span className="text-[11px] font-medium text-slate-400">Aucun post</span>
                    <button
                      type="button"
                      onClick={() => {
                        setScheduledDate(day.key);
                        setIsCreatePostModalOpen(true);
                      }}
                      className="mt-2 text-[11px] font-bold text-[#0066FF] hover:underline cursor-pointer"
                    >
                      + Planifier
                    </button>
                  </div>
                ) : (
                  dayPosts.map((post) => (
                    <div
                      key={post.id}
                      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      <div className="relative h-28 w-full bg-slate-900 overflow-hidden">
                        <img
                          src={post.mediaUrl}
                          alt="Post Media"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md rounded-lg px-2 py-0.5 shadow-sm border border-white/20 text-[10px] font-bold text-white uppercase flex items-center gap-1">
                          {renderNetworkIcon(post.network, 'w-3 h-3')}
                          <span>{post.network}</span>
                        </div>
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          {post.scheduledTime}
                        </div>
                      </div>

                      <div className="p-3 space-y-2">
                        <p className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed font-medium">
                          {post.caption}
                        </p>
                        <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                          {renderStatusBadge(post.status)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* =======================================================================
          D. MODALE 1 : VALIDATION WHATSAPP
          ======================================================================= */}
      {isValidationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-[#10B981] border border-emerald-500/20 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">Lien Magique de Validation</h3>
                  <p className="text-xs text-slate-500">Pour {currentWorkspaceName} {currentWorkspaceFlag}</p>
                </div>
              </div>
              <button
                onClick={() => setIsValidationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Votre client n'a <strong>pas besoin de mot de passe</strong>. En ouvrant ce lien sécurisé, il accède à une interface mobile fluide pour valider ou commenter chaque visuel en 1 clic.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl mb-4 flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-slate-700 truncate font-semibold">
                {magicLink}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(magicLink);
                  triggerToast('📋 Lien magique copié dans le presse-papier !');
                }}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-[#0066FF] rounded-xl shrink-0 font-bold text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copier</span>
              </button>
            </div>

            <div className="mb-5 p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs text-emerald-900 leading-relaxed">
              <span className="font-bold block text-emerald-800 mb-1">Message prêt à envoyer :</span>
              « {whatsappText} »
            </div>

            <div className="space-y-2">
              <a
                href={`https://wa.me/${currentWorkspaceWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappText)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/25 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Ouvrir sur WhatsApp ({currentWorkspaceWhatsapp})</span>
              </a>

              <button
                type="button"
                onClick={() => setIsValidationModalOpen(false)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          E. MODALE 2 : CRÉATION DE POST AVEC ZONE D'UPLOAD ET PREVIEW DIRECTE
          ======================================================================= */}
      {isCreatePostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full border border-slate-200/90 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in">
            
            {/* Header Modale */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F94F06]/10 text-[#F94F06] flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                    Planifier une Publication
                  </h2>
                  <p className="text-xs text-slate-500">
                    Pour <strong>{currentWorkspaceName} {currentWorkspaceFlag}</strong> • Multi-canaux & Validation WhatsApp
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCreatePostModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corps en 2 Colonnes (Formulaire à Gauche / Mockup Feed à Droite) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-y-auto">
              
              {/* COLONNE GAUCHE (60% Formulaire) */}
              <div className="lg:col-span-7 p-5 sm:p-7 space-y-6 border-r border-slate-100 overflow-y-auto">
                
                {/* 1. Sélection des Canaux Sociaux */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Canaux de Publication
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4 text-[#E1306C]" /> },
                      { id: 'facebook', label: 'Facebook', icon: <Facebook className="w-4 h-4 text-[#1877F2]" /> },
                      { id: 'tiktok', label: 'TikTok', icon: <Video className="w-4 h-4 text-black" /> },
                      { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-4 h-4 text-[#0077B5]" /> },
                    ].map((platform) => {
                      const isSelected = targetPlatforms.includes(platform.id as SocialNetwork);
                      return (
                        <button
                          key={platform.id}
                          type="button"
                          onClick={() => togglePlatform(platform.id as SocialNetwork)}
                          className={`p-2.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#F94F06] bg-orange-50/50 text-[#F94F06] shadow-xs'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {platform.icon}
                          <span>{platform.label}</span>
                          {isSelected && <Check className="w-3 h-3 text-[#F94F06] ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Zone d'Upload Média Intelligente ou Preview Card */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Média de la Publication ({mediaType})
                    </label>
                    {mediaPreviews.length > 0 && (
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ✓ Média prêt
                      </span>
                    )}
                  </div>

                  {/* Input file caché */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
                    multiple
                    accept="image/png,image/jpeg,image/webp,video/mp4,video/quicktime"
                    className="hidden"
                  />

                  {mediaPreviews.length === 0 ? (
                    // A. DROPZONE INITIALE
                    <div className="space-y-2">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (e.dataTransfer.files) handleFilesSelected(e.dataTransfer.files);
                        }}
                        className="border-2 border-dashed border-slate-200 hover:border-orange-400 bg-slate-50/50 hover:bg-orange-50/20 rounded-3xl p-6 text-center transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[200px]"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-[#F94F06] mb-3 group-hover:scale-110 transition-transform">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <div className="text-xs font-bold text-slate-800">
                          Glissez votre image ou vidéo ici, ou <span className="text-[#F94F06] underline">Parcourir vos fichiers</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap justify-center">
                          <span className="px-2 py-0.5 bg-slate-200/60 rounded-md text-[10px] font-semibold text-slate-600">JPG, PNG</span>
                          <span className="px-2 py-0.5 bg-slate-200/60 rounded-md text-[10px] font-semibold text-slate-600">MP4, MOV</span>
                          <span className="px-2 py-0.5 bg-slate-200/60 rounded-md text-[10px] font-semibold text-slate-600">Carrousels Multiples</span>
                          <span className="px-2 py-0.5 bg-slate-200/60 rounded-md text-[10px] font-semibold text-slate-600">Max 50 Mo</span>
                        </div>
                      </div>

                      {/* B. BOUTON MÉDIATHÈQUE ASSETS */}
                      <button
                        type="button"
                        onClick={() => setIsAssetLibraryOpen(true)}
                        className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2 mx-auto cursor-pointer"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-[#0066FF]" />
                        <span>Choisir depuis la Médiathèque Assets</span>
                      </button>
                    </div>
                  ) : (
                    // CADRE MÉDIA AVEC APERÇU & SUPPRESSION
                    <div className="rounded-2xl overflow-hidden relative group border border-slate-200 shadow-sm bg-slate-900">
                      {mediaType === 'VIDEO' ? (
                        <div className="relative">
                          <video
                            src={mediaPreviews[0]}
                            controls
                            className="w-full h-56 object-cover"
                          />
                          <span className="absolute top-3 left-3 px-2.5 py-1 bg-purple-600/90 backdrop-blur-md text-white text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-sm">
                            <Film className="w-3 h-3" />
                            Reel / Vidéo HD
                          </span>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={mediaPreviews[activeCarouselIndex] || mediaPreviews[0]}
                            alt="Aperçu upload"
                            className="w-full h-56 object-cover"
                          />
                          {mediaPreviews.length > 1 && (
                            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                              <Layers className="w-3 h-3" />
                              <span>{activeCarouselIndex + 1} / {mediaPreviews.length}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Bouton de Suppression */}
                      <button
                        type="button"
                        onClick={handleRemoveMedia}
                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
                        title="Supprimer le média"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Bouton Remplacer */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Remplacer</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Légende & Hashtags */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Légende & Hashtags
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {caption.length} caractères
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Rédigez votre texte captivant avec émojis et hashtags pour votre marque..."
                    className="w-full p-3.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F94F06]/20 focus:border-[#F94F06] transition-all"
                  />
                  {/* Boutons d'insertion rapide de hashtags */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {['#DakarFood', '#TerangaGourmet', '#Senegal', '#Foodie', '#ReelsDakar'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setCaption((prev) => `${prev} ${tag}`.trim())}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Date, Heure & Statut */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      required
                      className="w-full p-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F94F06]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Heure
                    </label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      required
                      className="w-full p-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F94F06]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Statut
                    </label>
                    <select
                      value={initialStatus}
                      onChange={(e) => setInitialStatus(e.target.value as PostStatus)}
                      className="w-full p-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F94F06]/20"
                    >
                      <option value="pending_validation">Validation WhatsApp</option>
                      <option value="draft">Brouillon</option>
                      <option value="validated">Validé client</option>
                      <option value="scheduled">Programmé</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* COLONNE DROITE (40% Live Feed Preview) */}
              <div className="lg:col-span-5 p-5 sm:p-7 bg-slate-50/70 flex flex-col items-center justify-center space-y-4">
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#F94F06]" />
                    <span>Aperçu Live Mobile Feed</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                    Instagram & Facebook
                  </span>
                </div>

                {/* Smartphone Card Mockup */}
                <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden transition-all">
                  
                  {/* Header Feed */}
                  <div className="p-3 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F94F06] to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        TG
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <span>{currentWorkspaceName}</span>
                          <span className="text-[10px]">{currentWorkspaceFlag}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">Dakar, Sénégal • Sponsorisé</div>
                      </div>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </div>

                  {/* Zone Média du Mockup */}
                  <div className="w-full h-56 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                    {mediaPreviews.length > 0 ? (
                      mediaType === 'VIDEO' ? (
                        <video
                          src={mediaPreviews[0]}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={mediaPreviews[0]}
                          alt="Feed preview"
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <div className="text-center p-4 text-slate-400">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                        <span className="text-xs font-semibold">Aucun média sélectionné</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Sociales */}
                  <div className="p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-slate-700 hover:text-red-500 cursor-pointer transition-colors" />
                        <MessageSquare className="w-5 h-5 text-slate-700" />
                        <Share2 className="w-5 h-5 text-slate-700" />
                      </div>
                      <Bookmark className="w-5 h-5 text-slate-700" />
                    </div>

                    <div className="text-[11px] font-bold text-slate-900">
                      1 428 J'aime
                    </div>

                    {/* Légende */}
                    <div className="text-xs text-slate-800 leading-relaxed font-normal">
                      <strong className="font-bold mr-1.5 text-slate-900">{currentWorkspaceName}</strong>
                      <span>{caption || 'Votre texte de publication s\'affichera ici en direct avec hashtags et émojis...'}</span>
                    </div>

                    <div className="text-[10px] text-slate-400 uppercase tracking-wider pt-1">
                      Programmé pour le {scheduledDate} à {scheduledTime}
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Footer Modale avec Validation */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setIsCreatePostModalOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleCreatePostSubmit}
                disabled={(!caption.trim() && mediaPreviews.length === 0) || isUploading}
                className="px-6 py-2.5 text-xs font-bold bg-[#F94F06] hover:bg-[#e04605] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Téléversement {uploadProgress > 0 ? `${uploadProgress}%` : '...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Programmer & Envoyer en validation WhatsApp</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =======================================================================
          F. MODALE TIROIR : SÉLECTEUR DE LA MÉDIATHÈQUE ASSETS
          ======================================================================= */}
      {isAssetLibraryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 p-6 max-h-[85vh] flex flex-col animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Médiathèque de la Marque ({BRAND_ASSETS_LIBRARY.length} visuels HD)
                </h3>
                <p className="text-xs text-slate-500">
                  Sélectionnez un visuel existant de {currentWorkspaceName} en 1 clic
                </p>
              </div>
              <button
                onClick={() => setIsAssetLibraryOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 my-4 overflow-y-auto p-1">
              {BRAND_ASSETS_LIBRARY.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => handleSelectAsset(asset)}
                  className="group relative rounded-2xl overflow-hidden border border-slate-200 hover:border-[#F94F06] cursor-pointer shadow-xs hover:shadow-md transition-all duration-200"
                >
                  <div className="h-32 w-full bg-slate-900 relative">
                    <img
                      src={asset.url.endsWith('.mp4') ? 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80' : asset.url}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {asset.type === 'video' && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-purple-600/90 text-white text-[9px] font-bold rounded-md flex items-center gap-1">
                        <Film className="w-3 h-3" />
                        {asset.duration}
                      </span>
                    )}
                  </div>
                  <div className="p-2.5 bg-white">
                    <div className="text-[11px] font-bold text-slate-900 truncate">
                      {asset.title}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {asset.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAssetLibraryOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          G. MODALE DE PARTAGE WHATSAPP AVEC LIEN MAGIQUE 48H
          ======================================================================= */}
      <WhatsAppShareModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        post={shareModalPost}
        token={shareModalToken}
        magicUrl={shareModalMagicUrl}
        workspace={{
          id: currentWorkspaceId,
          name: currentWorkspaceName,
          whatsappClient: activeWorkspace?.whatsappNumber || activeWorkspace?.whatsapp || '+221 77 842 19 02',
          flag: currentWorkspaceFlag,
        }}
      />

    </div>
  );
}
