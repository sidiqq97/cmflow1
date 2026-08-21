'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Smartphone,
  Copy,
  QrCode,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
  GripVertical,
  Share2,
  Check,
  Eye,
  CheckCircle2,
  Palette,
  Layout,
  Link as LinkIcon,
  MessageCircle,
  MapPin,
  FileText,
  Video,
  Upload,
  Globe,
  Instagram,
  Facebook,
  Music2,
  Phone,
  Layers,
  ChevronDown,
  X
} from 'lucide-react';
import { useClient } from '../../../context/ClientContext';

// Types
export interface BioLinkItem {
  id: string;
  title: string;
  url: string;
  iconType: 'whatsapp' | 'menu' | 'map' | 'video' | 'custom';
  active: boolean;
  clicksCount: number;
}

export type ThemeStyle = 'dark' | 'light' | 'orange' | 'glass';
export type ButtonStyle = 'soft-glass' | 'pill' | 'solid' | 'outline';

const INITIAL_LINKS: BioLinkItem[] = [
  {
    id: 'link-1',
    title: '💬 Commander sur WhatsApp (+221 77 800 12 34)',
    url: 'https://wa.me/221778001234?text=Bonjour,%20je%20souhaite%20commander',
    iconType: 'whatsapp',
    active: true,
    clicksCount: 842,
  },
  {
    id: 'link-2',
    title: '📋 Découvrir la Carte & Menu du Soir (PDF)',
    url: 'https://teranga-gourmet.sn/menu-degustation.pdf',
    iconType: 'menu',
    active: true,
    clicksCount: 426,
  },
  {
    id: 'link-3',
    title: '📍 Nous Trouver & Réserver (Almadies, Dakar)',
    url: 'https://maps.google.com/?q=Teranga+Gourmet+Dakar',
    iconType: 'map',
    active: true,
    clicksCount: 215,
  },
  {
    id: 'link-4',
    title: '🎥 Voir nos Coulisses & Recettes sur TikTok',
    url: 'https://tiktok.com/@teranga_gourmet',
    iconType: 'video',
    active: true,
    clicksCount: 358,
  },
];

export default function BioPage() {
  const { activeClient } = useClient();

  // États Édition Profil Bio
  const [displayName, setDisplayName] = useState('Teranga Gourmet Dakar');
  const [bioDescription, setBioDescription] = useState('Le meilleur de la gastronomie sénégalaise 🇸🇳 • Ouvert 7j/7 midi & soir aux Almadies.');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80');
  const [isLive, setIsLive] = useState(true);

  // Réseaux Sociaux Bio
  const [socialInstagram, setSocialInstagram] = useState('@teranga_gourmet');
  const [socialTikTok, setSocialTikTok] = useState('@terangafood');
  const [socialFacebook, setSocialFacebook] = useState('TerangaGourmetDk');
  const [socialWhatsApp, setSocialWhatsApp] = useState('+221778001234');

  // Thème & Style
  const [themeStyle, setThemeStyle] = useState<ThemeStyle>('dark');
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>('pill');

  // Blocs de Liens
  const [links, setLinks] = useState<BioLinkItem[]>(INITIAL_LINKS);
  const [activeTab, setActiveTab] = useState<'profile' | 'links' | 'theme'>('links');

  // Modales & Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  const publicUrl = `cmflow.sn/bio/${activeClient.id || 'teranga-gourmet'}`;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Copier le lien
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${publicUrl}`);
    showToast('🔗 Lien Bio public copié dans le presse-papiers !');
  };

  // Ajouter un nouveau lien
  const handleAddLink = () => {
    const newLink: BioLinkItem = {
      id: `link-${Date.now()}`,
      title: 'Nouveau lien personnalisé',
      url: 'https://',
      iconType: 'custom',
      active: true,
      clicksCount: 0,
    };
    setLinks([...links, newLink]);
    showToast('✨ Nouveau bloc de lien ajouté avec succès !');
  };

  // Supprimer un lien
  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
    showToast('🗑️ Bloc de lien supprimé.');
  };

  // Basculer l'état actif/inactif
  const handleToggleLinkActive = (id: string) => {
    setLinks(
      links.map((l) => (l.id === id ? { ...l, active: !l.active } : l))
    );
  };

  // Mettre à jour un lien
  const handleUpdateLink = (id: string, field: 'title' | 'url', val: string) => {
    setLinks(
      links.map((l) => (l.id === id ? { ...l, [field]: val } : l))
    );
  };

  // Rendu Icône de Lien
  const renderLinkIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return <span className="text-[#10B981] font-bold text-sm">💬</span>;
      case 'menu':
        return <FileText className="w-4 h-4 text-[#F94F06]" />;
      case 'map':
        return <MapPin className="w-4 h-4 text-[#0066FF]" />;
      case 'video':
        return <Video className="w-4 h-4 text-purple-500" />;
      default:
        return <Globe className="w-4 h-4 text-slate-400" />;
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
          A. EN-TÊTE DE MODULE & BARRE D'ACTIONS SUPÉRIEURE
          ======================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200/70 shadow-xs">
        
        {/* Titre & Badge Marque */}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              Start Page • Lien en Bio
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-orange-50 text-[#F94F06] border border-orange-200/80 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F94F06]"></span>
              {activeClient.name} {activeClient.flag}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Créez et personnalisez le microsite de redirection pour vos bios Instagram et TikTok.
          </p>
        </div>

        {/* Actions Supérieures & Statut Public */}
        <div className="flex items-center flex-wrap gap-2.5">
          
          {/* Switch Page en Ligne */}
          <button
            type="button"
            onClick={() => {
              setIsLive(!isLive);
              showToast(isLive ? '⏸️ Page mise hors-ligne temporairement' : '🟢 Page publiée et active en ligne !');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition-all ${
              isLive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <span>{isLive ? 'Page en Ligne' : 'Hors-ligne'}</span>
          </button>

          {/* Badge Lien Public Court */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 flex items-center gap-1.5 transition-all group"
            title="Copier le lien public"
          >
            <span className="text-slate-500 font-mono">{publicUrl}</span>
            <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0F172A]" />
          </button>

          {/* Bouton QR Code */}
          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-all"
            title="Générer QR Code"
          >
            <QrCode className="w-4 h-4 text-[#0066FF]" />
          </button>

          {/* Bouton Publier Orange */}
          <button
            type="button"
            onClick={() => showToast('🚀 Modifications publiées instantanément sur votre Start Page !')}
            className="px-4 py-2 bg-[#F94F06] hover:bg-[#e04605] text-white text-xs font-black rounded-xl shadow-lg shadow-[#F94F06]/25 hover:shadow-[#F94F06]/40 active:scale-[0.98] transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Publier les modifications</span>
          </button>

        </div>
      </div>

      {/* Bouton Aperçu Mobile Flottant (Visible sur Mobile uniquement) */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobilePreviewOpen(true)}
          className="w-full py-2.5 px-4 bg-[#0F172A] text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg"
        >
          <Smartphone className="w-4 h-4 text-[#F94F06]" />
          <span>Voir l'Aperçu Smartphone en Direct</span>
        </button>
      </div>

      {/* =======================================================================
          ARCHITECTURE EN 2 VOLETS (Éditeur à Gauche + Mockup Mobile à Droite)
          ======================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* =====================================================================
            VOLET GAUCHE : PANNEAU D'ÉDITION & BLOCS DE CONTENU
            ===================================================================== */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Navigation par Onglets Éditeur */}
          <div className="flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/70 overflow-x-auto text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab('links')}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === 'links'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5 text-[#F94F06]" />
              <span>1. Blocs de Liens ({links.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === 'profile'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <Layout className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>2. Identité Profil</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === 'theme'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-purple-600" />
              <span>3. Thème & Style</span>
            </button>
          </div>

          {/* ONGLET 1 : GESTIONNAIRE DES BLOCS DE LIENS */}
          {activeTab === 'links' && (
            <div className="bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-black text-[#0F172A]">
                    Liste des Liens & Redirections
                  </h2>
                  <p className="text-xs text-slate-500">
                    Glissez et organisez vos boutons d'action dans l'ordre désiré.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="px-3 py-1.5 bg-[#F94F06]/10 hover:bg-[#F94F06]/20 text-[#F94F06] font-extrabold text-xs rounded-xl border border-[#F94F06]/30 flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Nouveau Lien</span>
                </button>
              </div>

              {/* Pile des Blocs de Liens */}
              <div className="space-y-3">
                {links.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all space-y-2.5 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-500 cursor-grab shrink-0" />
                        <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                          {renderLinkIcon(item.iconType)}
                        </div>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateLink(item.id, 'title', e.target.value)}
                          className="text-xs font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#0066FF] focus:bg-white px-1.5 py-0.5 rounded focus:outline-none w-full"
                        />
                      </div>

                      {/* Switch Actif / Inactif & Supprimer */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono text-slate-400 font-semibold hidden sm:inline">
                          {item.clicksCount} clics
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleLinkActive(item.id)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                            item.active ? 'bg-[#10B981]' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform ${
                              item.active ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          ></div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLink(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* URL Input */}
                    <div className="pl-6">
                      <input
                        type="url"
                        value={item.url}
                        onChange={(e) => handleUpdateLink(item.id, 'url', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bouton d'ajout bordé de pointillés */}
              <button
                type="button"
                onClick={handleAddLink}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#F94F06] hover:bg-orange-50/20 text-slate-600 hover:text-[#F94F06] font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Ajouter un nouveau bloc de lien</span>
              </button>

            </div>
          )}

          {/* ONGLET 2 : IDENTITÉ & EN-TÊTE DU PROFIL */}
          {activeTab === 'profile' && (
            <div className="bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-sm font-black text-[#0F172A] pb-2 border-b border-slate-100">
                En-tête & Profil Public
              </h2>

              {/* Avatar & Photo */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-[#F94F06]"
                  />
                  <button
                    type="button"
                    onClick={() => showToast('📷 Téléversement de photo de profil...')}
                    className="absolute bottom-0 right-0 p-1 rounded-full bg-[#0F172A] text-white shadow-sm"
                  >
                    <Upload className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-xs">
                  <span className="font-extrabold text-slate-800 block">Logo / Photo de profil</span>
                  <span className="text-slate-400">Recommandé : Format carré 500x500 px (PNG/JPG)</span>
                </div>
              </div>

              {/* Nom & Bio */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nom affiché sur la page
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Bio courte & Description
                  </label>
                  <textarea
                    rows={2}
                    value={bioDescription}
                    onChange={(e) => setBioDescription(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
              </div>

              {/* Liens Réseaux Sociaux */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-xs font-extrabold text-slate-800 block">
                  Comptes Sociaux Connectés (Pastilles en haut)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Instagram Handle</label>
                    <input
                      type="text"
                      value={socialInstagram}
                      onChange={(e) => setSocialInstagram(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">WhatsApp Numéro</label>
                    <input
                      type="text"
                      value={socialWhatsApp}
                      onChange={(e) => setSocialWhatsApp(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ONGLET 3 : THÈME & PERSONNALISATION */}
          {activeTab === 'theme' && (
            <div className="bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-sm font-black text-[#0F172A] pb-2 border-b border-slate-100">
                Thème Visuel & Forme des Boutons
              </h2>

              {/* Style de Fond */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Palette & Arrière-plan
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'dark', label: 'Sombre Ardoise', bg: 'bg-[#0F172A]' },
                    { id: 'light', label: 'Clair Épuré', bg: 'bg-[#F8FAFC]' },
                    { id: 'orange', label: 'Orange Électrique', bg: 'bg-[#F94F06]' },
                    { id: 'glass', label: 'Gradient Nuit', bg: 'bg-gradient-to-b from-slate-900 to-indigo-950' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setThemeStyle(t.id as any)}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                        themeStyle === t.id
                          ? 'border-[#F94F06] ring-2 ring-[#F94F06]/30 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl ${t.bg} shadow-2xs border border-white/20`}></div>
                      <span className="text-[10px] font-bold text-slate-700">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Style des Boutons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Forme & Effet des Boutons
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                  {[
                    { id: 'pill', label: 'Pilule Arrondie' },
                    { id: 'soft-glass', label: 'Soft Glass (Flou)' },
                    { id: 'solid', label: 'Solid Minimal' },
                    { id: 'outline', label: 'Contour Fin' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setButtonStyle(b.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        buttonStyle === b.id
                          ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* =====================================================================
            VOLET DROIT : PREVIEW SMARTPHONE RÉALISTE EN DIRECT (MOCKUP)
            ===================================================================== */}
        <div className="hidden lg:flex lg:col-span-5 justify-center sticky top-20">
          
          {/* Chassis iPhone Moderne */}
          <div className="w-[310px] bg-[#0F172A] p-3 rounded-[48px] shadow-2xl border-4 border-slate-700 ring-1 ring-white/10">
            
            {/* Écran iPhone */}
            <div
              className={`rounded-[38px] p-5 text-white flex flex-col justify-between min-h-[580px] shadow-inner transition-colors duration-300 relative overflow-hidden ${
                themeStyle === 'dark'
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950'
                  : themeStyle === 'light'
                  ? 'bg-gradient-to-b from-slate-100 to-white text-[#0F172A]'
                  : themeStyle === 'orange'
                  ? 'bg-gradient-to-b from-[#F94F06] to-[#d93f00]'
                  : 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950'
              }`}
            >
              
              {/* Dynamic Island Notch */}
              <div className="w-20 h-4 bg-black rounded-full mx-auto mb-4 shadow-sm"></div>

              {/* Haut : Profil, Avatar & Bio */}
              <div className="space-y-4 text-center">
                <div className="relative inline-block">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-16 h-16 rounded-full mx-auto object-cover ring-2 ring-[#F94F06] shadow-lg"
                  />
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#10B981] border-2 border-[#0F172A] rounded-full"></span>
                </div>

                <div>
                  <div className="text-sm font-extrabold flex items-center justify-center gap-1">
                    <span>{displayName}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF] inline" />
                  </div>
                  <div className={`text-[10px] mt-1 leading-relaxed px-2 ${themeStyle === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                    {bioDescription}
                  </div>
                </div>

                {/* Pastilles Réseaux Sociaux */}
                <div className="flex items-center justify-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs backdrop-blur-xs shadow-2xs">
                    📸
                  </span>
                  <span className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs backdrop-blur-xs shadow-2xs">
                    🎵
                  </span>
                  <span className="w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center text-xs shadow-2xs">
                    💬
                  </span>
                </div>

                {/* Pile des Boutons de Liens */}
                <div className="space-y-2.5 pt-2">
                  {links
                    .filter((l) => l.active)
                    .map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`w-full py-2.5 px-3.5 flex items-center justify-between text-xs font-bold transition-all shadow-sm group ${
                          buttonStyle === 'pill'
                            ? 'rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-md'
                            : buttonStyle === 'soft-glass'
                            ? 'rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/15'
                            : buttonStyle === 'solid'
                            ? 'rounded-xl bg-white text-[#0F172A] hover:bg-slate-100 shadow-md'
                            : 'rounded-xl border-2 border-white/40 hover:border-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {renderLinkIcon(link.iconType)}
                          <span className="truncate">{link.title}</span>
                        </div>
                        <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 shrink-0 ml-1" />
                      </a>
                    ))}
                </div>

              </div>

              {/* Pied de Page Mockup */}
              <div className="text-center pt-4 text-[9px] opacity-60 font-semibold tracking-wider">
                Propulsé par <span className="font-extrabold text-[#F94F06]">CMFlow ⚡</span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =======================================================================
          MODALE QR CODE
          ======================================================================= */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center border border-slate-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-extrabold text-[#0F172A] uppercase">QR Code Officiel</span>
              <button onClick={() => setIsQrModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Faux QR Code Stylisé */}
            <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl border-2 border-slate-900 shadow-md flex items-center justify-center relative">
              <QrCode className="w-full h-full text-[#0F172A]" />
              <div className="absolute w-8 h-8 rounded-full bg-[#F94F06] text-white flex items-center justify-center font-black text-[10px]">
                CM
              </div>
            </div>

            <div className="text-xs">
              <span className="font-extrabold text-slate-800 block">{displayName}</span>
              <span className="text-slate-400 font-mono text-[11px]">{publicUrl}</span>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsQrModalOpen(false);
                  showToast('📥 QR Code téléchargé au format PNG HD !');
                }}
                className="w-full py-2 bg-[#F94F06] hover:bg-[#e04605] text-white font-extrabold text-xs rounded-xl shadow-md"
              >
                Télécharger PNG HD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          DRAWER MOBILE PREVIEW (Sur téléphone)
          ======================================================================= */}
      {isMobilePreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 lg:hidden">
          <div className="bg-[#0F172A] rounded-3xl max-w-xs w-full p-4 border border-slate-700 text-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400">Aperçu Mobile Direct</span>
              <button onClick={() => setIsMobilePreviewOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center space-y-3 py-2">
              <img src={avatarUrl} alt="Avatar" className="w-14 h-14 rounded-full mx-auto object-cover ring-2 ring-[#F94F06]" />
              <div className="text-xs font-extrabold">{displayName}</div>
              <div className="text-[10px] text-slate-300">{bioDescription}</div>
              <div className="space-y-2 pt-2">
                {links.filter((l) => l.active).map((link) => (
                  <div key={link.id} className="p-2 rounded-xl bg-white/10 text-xs font-bold">
                    {link.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
