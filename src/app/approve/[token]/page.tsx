'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  Sparkles,
  Calendar,
  Clock,
  Instagram,
  Facebook,
  Linkedin,
  Video,
  Layers,
  ChevronRight,
  ThumbsUp,
  X,
  Share2,
  Check,
  ShieldCheck,
  ArrowRight,
  PartyPopper
} from 'lucide-react';

// Types
export type SocialNetwork = 'instagram' | 'facebook' | 'tiktok' | 'linkedin';
export type ApprovalStatus = 'pending' | 'approved' | 'needs_revision';

export interface ValidationPost {
  id: string;
  network: SocialNetwork;
  scheduledDate: string;
  scheduledTime: string;
  caption: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'carousel';
  carouselCount?: number;
  status: ApprovalStatus;
  feedback?: string;
}

export interface ClientWorkspace {
  name: string;
  avatar: string;
  agencyName: string;
  agencyWhatsapp: string;
  period: string;
}

// Données Mockées du Client & des Publications en attente
const MOCK_WORKSPACE: ClientWorkspace = {
  name: 'Teranga Gourmet',
  avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=160&auto=format&fit=crop&q=80',
  agencyName: 'Awa Diop · Dakar Digital CM',
  agencyWhatsapp: '+221778421902',
  period: 'Planning du 24 au 30 Août 2026',
};

const INITIAL_PENDING_POSTS: ValidationPost[] = [
  {
    id: 'post-1',
    network: 'instagram',
    scheduledDate: 'Lundi 24 Août 2026',
    scheduledTime: '18:30',
    caption: 'Ce soir, découvrez notre nouveau Thiéboudienne revisité aux fruits de mer frais de Soumbédioune 🐟✨ Réservez votre table en terrasse pour ce week-end !\n\n📍 Almadies, Dakar\n#DakarFood #SenegalGourmet #Teranga',
    mediaUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    mediaType: 'carousel',
    carouselCount: 3,
    status: 'pending',
  },
  {
    id: 'post-2',
    network: 'tiktok',
    scheduledDate: 'Mardi 25 Août 2026',
    scheduledTime: '12:15',
    caption: 'Dans les coulisses avec notre Chef Moussa qui prépare les fameux pastels croustillants 🔥 Vous êtes plutôt sauce pimentée ou douce ? Dites-le nous en commentaire ! 👇\n\n#DakarFood #Foodie #CuisineAfricaine #Pastels',
    mediaUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80',
    mediaType: 'video',
    status: 'pending',
  },
  {
    id: 'post-3',
    network: 'facebook',
    scheduledDate: 'Mercredi 26 Août 2026',
    scheduledTime: '09:00',
    caption: 'Offre spéciale déjeuner d\'entreprise : Bénéficiez de -15% sur toutes vos commandes de groupe du mercredi au vendredi 💼🍽️ Livraison express et soignée au Plateau et aux Almadies.\n\nCommandes au 33 800 00 00.',
    mediaUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    status: 'pending',
  },
  {
    id: 'post-4',
    network: 'linkedin',
    scheduledDate: 'Vendredi 28 Août 2026',
    scheduledTime: '10:30',
    caption: 'Fier d\'accueillir les délégations du Sommet Tech Afrique de l\'Ouest pour leurs déjeuners et dîners officiels d\'affaires. L\'excellence du service et la gastronomie sénégalaise au cœur de notre engagement.\n\n#BusinessDakar #Networking #AfriqueTech',
    mediaUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    status: 'pending',
  },
];

export default function PublicValidationPage({ params }: { params?: { token?: string } }) {
  const [posts, setPosts] = useState<ValidationPost[]>(INITIAL_PENDING_POSTS);
  const [feedbackDrawers, setFeedbackDrawers] = useState<{ [postId: string]: boolean }>({});
  const [feedbackTexts, setFeedbackTexts] = useState<{ [postId: string]: string }>({});
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast Notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Calcul du taux de progression
  const validatedCount = useMemo(() => {
    return posts.filter((p) => p.status === 'approved').length;
  }, [posts]);

  const reviewedCount = useMemo(() => {
    return posts.filter((p) => p.status !== 'pending').length;
  }, [posts]);

  const progressPercentage = Math.round((reviewedCount / posts.length) * 100);

  // Valider un post individuel
  const handleApprovePost = (id: string) => {
    const updated = posts.map((p) => {
      if (p.id === id) {
        return { ...p, status: 'approved' as ApprovalStatus };
      }
      return p;
    });
    setPosts(updated);
    
    // Fermer le tiroir de feedback si ouvert
    setFeedbackDrawers((prev) => ({ ...prev, [id]: false }));
    triggerToast('✓ Publication validée !');

    // Vérifier si toutes les publications sont maintenant traitées
    const allDone = updated.every((p) => p.status !== 'pending');
    if (allDone) {
      setTimeout(() => setIsSuccessModalOpen(true), 600);
    }
  };

  // Soumettre une demande de modification
  const handleSubmitFeedback = (id: string) => {
    const text = feedbackTexts[id]?.trim();
    if (!text) return;

    const updated = posts.map((p) => {
      if (p.id === id) {
        return { ...p, status: 'needs_revision' as ApprovalStatus, feedback: text };
      }
      return p;
    });
    setPosts(updated);
    setFeedbackDrawers((prev) => ({ ...prev, [id]: false }));
    triggerToast('✏️ Remarque enregistrée pour votre Community Manager !');

    // Vérifier si tout est traité
    const allDone = updated.every((p) => p.status !== 'pending');
    if (allDone) {
      setTimeout(() => setIsSuccessModalOpen(true), 600);
    }
  };

  // Tout valider en 1 clic
  const handleApproveAll = () => {
    const updated = posts.map((p) => ({
      ...p,
      status: 'approved' as ApprovalStatus,
    }));
    setPosts(updated);
    triggerToast('🎉 Toutes les publications ont été validées !');
    setTimeout(() => setIsSuccessModalOpen(true), 500);
  };

  // Rendu de l'icône de réseau social
  const renderNetworkBadge = (network: SocialNetwork) => {
    switch (network) {
      case 'instagram':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-pink-50 text-[#E1306C] border border-pink-200">
            <Instagram className="w-3.5 h-3.5" />
            <span>Instagram</span>
          </span>
        );
      case 'facebook':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#1877F2] border border-blue-200">
            <Facebook className="w-3.5 h-3.5" />
            <span>Facebook</span>
          </span>
        );
      case 'tiktok':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900 text-white">
            <span className="text-[10px] font-black leading-none">TT</span>
            <span>TikTok</span>
          </span>
        );
      case 'linkedin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-[#0A66C2] border border-sky-200">
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased pb-20">
      
      {/* Toast Notification Flottante */}
      {toastMessage && (
        <div className="fixed top-4 inset-x-4 max-w-sm mx-auto z-50 bg-[#0F172A] text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =======================================================================
          A. EN-TÊTE PUBLIC SÉCURISÉ
          ======================================================================= */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo-full.svg"
              alt="CMFlow Logo"
              width={100}
              height={26}
              className="h-6 w-auto object-contain"
              priority
            />
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-[#10B981]" />
              Validation Sécurisée
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-medium truncate max-w-[140px]">
            {MOCK_WORKSPACE.agencyName}
          </div>

        </div>
      </header>

      {/* =======================================================================
          CARTE CLIENT & BARRE DE PROGRESSION
          ======================================================================= */}
      <div className="max-w-xl mx-auto px-4 pt-4 space-y-4">
        
        {/* Carte Client Header */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3.5 mb-4">
            <img
              src={MOCK_WORKSPACE.avatar}
              alt={MOCK_WORKSPACE.name}
              className="w-14 h-14 rounded-2xl object-cover ring-4 ring-emerald-50 shrink-0 border border-slate-100"
            />
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
                Espace Client
              </span>
              <h1 className="text-xl font-extrabold text-[#0F172A] truncate">
                {MOCK_WORKSPACE.name} 🇸🇳
              </h1>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{MOCK_WORKSPACE.period}</span>
              </p>
            </div>
          </div>

          {/* Jauge de progression */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600">
                Progression de la validation :
              </span>
              <span className="text-emerald-600">
                {reviewedCount} / {posts.length} traités ({progressPercentage}%)
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#10B981] to-emerald-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Bouton Tout Valider en 1 Clic */}
          {reviewedCount < posts.length && (
            <button
              type="button"
              onClick={handleApproveAll}
              className="w-full mt-4 py-3 px-4 rounded-2xl font-extrabold text-sm text-white bg-[#10B981] hover:bg-[#059669] active:scale-[0.99] shadow-lg shadow-[#10B981]/25 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Tout valider en 1 clic ({posts.length} posts)</span>
            </button>
          )}
        </div>

        {/* Message d'aide discret */}
        <div className="px-2 text-center text-xs text-slate-500">
          💡 Cliquez sur <span className="font-bold text-emerald-600">« Valider »</span> pour chaque post ou demandez une retouche directement sous l'image.
        </div>

        {/* =====================================================================
            B. FLUX DÉFILANT DES CARTES DE PUBLICATION
            ===================================================================== */}
        <div className="space-y-6">
          {posts.map((post, idx) => {
            const isApproved = post.status === 'approved';
            const isNeedsRevision = post.status === 'needs_revision';
            const isDrawerOpen = feedbackDrawers[post.id] || false;

            return (
              <div
                key={post.id}
                className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 shadow-sm ${
                  isApproved
                    ? 'border-emerald-300 ring-2 ring-emerald-100'
                    : isNeedsRevision
                    ? 'border-amber-300 ring-2 ring-amber-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* En-tête de Carte */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-extrabold text-[#0F172A]">
                      #{idx + 1}
                    </span>
                    <span>{post.scheduledDate}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500 font-medium">{post.scheduledTime}</span>
                  </div>

                  {renderNetworkBadge(post.network)}
                </div>

                {/* Vignette Média Plein Format */}
                <div className="relative w-full aspect-square bg-slate-900 overflow-hidden">
                  <img
                    src={post.mediaUrl}
                    alt={`Visuel post #${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Badge Carrousel */}
                  {post.mediaType === 'carousel' && (
                    <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                      <Layers className="w-3.5 h-3.5 text-amber-300" />
                      <span>Carrousel (1/{post.carouselCount || 3})</span>
                    </div>
                  )}

                  {/* Badge Vidéo */}
                  {post.mediaType === 'video' && (
                    <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                      <Video className="w-3.5 h-3.5 text-sky-400" />
                      <span>Vidéo 0:45</span>
                    </div>
                  )}

                  {/* Overlay Statut si validé ou en révision */}
                  {isApproved && (
                    <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px] flex items-center justify-center p-4">
                      <div className="bg-white text-emerald-700 px-4 py-2.5 rounded-2xl shadow-xl font-extrabold text-sm flex items-center gap-2 border border-emerald-200 animate-fadeIn">
                        <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                        <span>Validé par vous ✓</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contenu & Légende du post */}
                <div className="p-5 space-y-3">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Texte de la publication :
                  </div>

                  <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                    {post.caption}
                  </p>

                  {/* Message de retour si modification demandée */}
                  {isNeedsRevision && post.feedback && (
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed space-y-1">
                      <div className="font-extrabold flex items-center gap-1.5 text-amber-800">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Votre remarque pour le CM :</span>
                      </div>
                      <p className="italic">« {post.feedback} »</p>
                    </div>
                  )}

                  {/* TIROIR DE MODIFICATION / COMMENTAIRE */}
                  {isDrawerOpen && (
                    <div className="pt-2 space-y-3 animate-fadeIn">
                      <label className="block text-xs font-extrabold text-slate-700">
                        Que souhaitez-vous modifier sur ce post ?
                      </label>
                      <textarea
                        rows={3}
                        value={feedbackTexts[post.id] || ''}
                        onChange={(e) =>
                          setFeedbackTexts({ ...feedbackTexts, [post.id]: e.target.value })
                        }
                        placeholder="ex: Changer le prix par 5 000 FCFA, corriger la date ou remplacer le 2ème visuel..."
                        className="w-full p-3 bg-white border-2 border-amber-300 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        autoFocus
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setFeedbackDrawers((prev) => ({ ...prev, [post.id]: false }))
                          }
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSubmitFeedback(post.id)}
                          className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Envoyer ma remarque</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* =========================================================
                      ZONE DE BOUTONS D'ACTION TACTILES (FACILES AU POUCE)
                      ========================================================= */}
                  <div className="pt-3 grid grid-cols-2 gap-3">
                    
                    {/* Bouton 1 : Valider (Vert #10B981) */}
                    <button
                      type="button"
                      onClick={() => handleApprovePost(post.id)}
                      className={`py-3.5 px-4 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400'
                          : 'bg-[#10B981] hover:bg-[#059669] active:scale-[0.98] text-white shadow-md shadow-[#10B981]/25'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{isApproved ? 'Validé ✓' : 'Valider'}</span>
                    </button>

                    {/* Bouton 2 : Demander une modification (Ambre) */}
                    <button
                      type="button"
                      onClick={() =>
                        setFeedbackDrawers((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                      }
                      className={`py-3.5 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border transition-all duration-200 ${
                        isNeedsRevision
                          ? 'bg-amber-100 text-amber-800 border-amber-400'
                          : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 active:scale-[0.98]'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 text-amber-500" />
                      <span>{isNeedsRevision ? 'Remarque envoyée' : 'Modifier'}</span>
                    </button>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* =======================================================================
          C. MODALE DE CONFIRMATION FINALE (SUCCÈS WHATSAPP)
          ======================================================================= */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center space-y-5 border border-slate-100 transform animate-scaleUp">
            
            {/* Icône de fête */}
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#10B981] flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <PartyPopper className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                🎉 Merci pour vos retours !
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Toutes vos décisions ont été transmises en temps réel à <strong>{MOCK_WORKSPACE.agencyName}</strong>.
              </p>
            </div>

            {/* Récapitulatif des choix */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-around text-xs font-bold">
              <div>
                <div className="text-emerald-600 text-lg font-extrabold">
                  {posts.filter((p) => p.status === 'approved').length}
                </div>
                <div className="text-slate-500">Validés</div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div>
                <div className="text-amber-600 text-lg font-extrabold">
                  {posts.filter((p) => p.status === 'needs_revision').length}
                </div>
                <div className="text-slate-500">À retoucher</div>
              </div>
            </div>

            {/* Bouton d'action WhatsApp pour notifier le CM */}
            <div className="space-y-2.5 pt-2">
              <a
                href={`https://wa.me/${MOCK_WORKSPACE.agencyWhatsapp}?text=${encodeURIComponent(
                  `Bonjour Awa ! J'ai terminé la validation du planning pour ${MOCK_WORKSPACE.name} sur CMFlow (${posts.filter((p) => p.status === 'approved').length}/${posts.length} validés). Merci !`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/25 transition-all active:scale-[0.99]"
              >
                <Send className="w-4 h-4" />
                <span>Notifier le CM sur WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Fermer cette fenêtre
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer Sécurisé */}
      <footer className="mt-12 text-center text-xs text-slate-400 space-y-1">
        <div>🔒 Espace sécurisé par CMFlow · Chiffrement 256-bit SSL</div>
        <div>Propulsé par <span className="font-bold text-slate-600">CMFlow</span> pour les agences d'Afrique</div>
      </footer>

    </div>
  );
}
