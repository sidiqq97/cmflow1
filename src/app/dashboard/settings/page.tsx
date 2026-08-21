'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Building,
  Link as LinkIcon,
  MessageSquare,
  Users,
  Shield,
  Save,
  Check,
  Sparkles,
  Upload,
  RefreshCw,
  Plus,
  Trash2,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Globe,
  Key,
  Laptop,
  Copy,
  ExternalLink,
  ChevronRight,
  Sliders,
  Send
} from 'lucide-react';
import { useClient } from '../../../context/ClientContext';

// Types
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin / Owner' | 'Lead CM' | 'Graphiste UI' | 'Client Success';
  avatar: string;
  status: 'active' | 'invited';
}

const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Awa Diop',
    email: 'awa@cmflow.sn',
    role: 'Lead CM',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'active',
  },
  {
    id: 'team-2',
    name: 'Sidiqq Ndiaye',
    email: 'sidiqq@kitsunestudio.sn',
    role: 'Admin / Owner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'active',
  },
  {
    id: 'team-3',
    name: 'Koffi Kouamé',
    email: 'koffi@crea.sn',
    role: 'Graphiste UI',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'active',
  },
];

export default function SettingsPage() {
  const { activeClient } = useClient();

  // Onglet Actif
  const [activeTab, setActiveTab] = useState<'profile' | 'api' | 'whatsapp' | 'team' | 'security'>('profile');

  // Formulaire Profil Agence
  const [agencyName, setAgencyName] = useState('Kitsune Studio · Sidiqq Solutions');
  const [agencyEmail, setAgencyEmail] = useState('contact@kitsunestudio.sn');
  const [agencyPhone, setAgencyPhone] = useState('+221 77 800 12 34');
  const [customDomain, setCustomDomain] = useState('validation.kitsunestudio.sn');
  const [whiteLabelEnabled, setWhiteLabelEnabled] = useState(true);

  // WhatsApp Templates
  const [waSenderPhone, setWaSenderPhone] = useState('+221 77 800 12 34');
  const [template1, setTemplate1] = useState('Bonjour {client_name} ! 🌟 Votre planning hebdomadaire est prêt pour validation sur votre mobile en 1 clic sans mot de passe : {validation_link} (Lien actif 48h)');
  const [template2, setTemplate2] = useState('Rappel amical pour {client_name} ⏰ Votre session de validation expire dans {expiration_time}. Accédez-y ici : {validation_link}');
  const [template3, setTemplate3] = useState('Parfait ! Merci {client_name} 🎉 Toutes vos publications sont validées et programmées sur vos réseaux.');

  // Équipe
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'Lead CM' | 'Graphiste UI'>('Lead CM');

  // Sécurité
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    showToast('💾 Modifications enregistrées avec succès pour l\'agence !');
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail) return;
    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name: newMemberEmail.split('@')[0],
      email: newMemberEmail,
      role: newMemberRole,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      status: 'invited',
    };
    setTeamMembers([...teamMembers, newMember]);
    setNewMemberEmail('');
    showToast(`📩 Invitation envoyée à ${newMember.email} !`);
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
          A. EN-TÊTE DE MODULE & BARRE DE SAUVEGARDE
          ======================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200/70 shadow-xs">
        
        {/* Titre & Sous-titre */}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              Paramètres Généraux de l'Agence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
              Workspace Agence
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Configurez votre identité, vos intégrations réseaux sociaux, l'API WhatsApp et votre équipe.
          </p>
        </div>

        {/* Bouton Sauvegarder Principal */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleSaveSettings()}
            className="px-4 py-2.5 bg-[#F94F06] hover:bg-[#e04605] text-white text-xs font-black rounded-xl shadow-lg shadow-[#F94F06]/25 hover:shadow-[#F94F06]/40 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les modifications</span>
          </button>
        </div>

      </div>

      {/* =======================================================================
          B. NAVIGATION PAR ONGLETS HORIZONTAUX (SEGMENTED TAB BAR)
          ======================================================================= */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 backdrop-blur-md rounded-2xl border border-slate-200/70 overflow-x-auto text-xs font-extrabold scrollbar-none">
        
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'profile'
              ? 'bg-white text-[#0F172A] shadow-xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-[#F94F06]" />
          <span>Profil Agence & Marque Blanche</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('api')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'api'
              ? 'bg-white text-[#0F172A] shadow-xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5 text-[#0066FF]" />
          <span>Connexions API Réseaux</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'whatsapp'
              ? 'bg-white text-[#0F172A] shadow-xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Configuration WhatsApp & Modèles</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('team')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'team'
              ? 'bg-white text-[#0F172A] shadow-xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-purple-600" />
          <span>Équipe & Rôles ({teamMembers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'security'
              ? 'bg-white text-[#0F172A] shadow-xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Sécurité & Accès</span>
        </button>

      </div>

      {/* =======================================================================
          C. CONTENU DES ONGLETS (BENTO CARDS)
          ======================================================================= */}

      {/* ---------------------------------------------------------------------
          ONGLET 1 : PROFIL AGENCE & MARQUE BLANCHE
          --------------------------------------------------------------------- */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          
          <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base sm:text-lg font-black text-[#0F172A]">
                Identité de l'Agence & Logo Officiel
              </h2>
              <p className="text-xs text-slate-500">
                Ce logo et ce nom sont affichés en en-tête des portails de validation mobile de vos clients.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Téléversement Logo */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-center">
                <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                  Logo de l'Agence
                </label>

                <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-tr from-[#0F172A] to-slate-800 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-white">
                  KS
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => showToast('🖼️ Téléversement d\'un nouveau logo PNG...')}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs inline-flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#F94F06]" />
                    <span>Changer le logo</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">Format PNG ou SVG transparent recommandé (Max 2MB)</p>
              </div>

              {/* Champs Nom, Email, Support */}
              <div className="lg:col-span-2 space-y-4 text-xs font-bold">
                <div>
                  <label className="block text-slate-700 uppercase tracking-wider mb-1.5">
                    Nom Commercial de l'Agence
                  </label>
                  <input
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F94F06]/20 focus:border-[#F94F06]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 uppercase tracking-wider mb-1.5">
                      Email de Contact Officiel
                    </label>
                    <input
                      type="email"
                      value={agencyEmail}
                      onChange={(e) => setAgencyEmail(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F94F06]/20 focus:border-[#F94F06]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 uppercase tracking-wider mb-1.5">
                      Numéro de Support Client
                    </label>
                    <input
                      type="tel"
                      value={agencyPhone}
                      onChange={(e) => setAgencyPhone(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F94F06]/20 focus:border-[#F94F06]"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Marque Blanche & Sous-domaine */}
          <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#0F172A] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#0066FF]" />
                  <span>Option Marque Blanche (White-Label)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Masquez la mention CMFlow et utilisez votre propre sous-domaine pour tous vos liens de validation.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={whiteLabelEnabled}
                  onChange={(e) => setWhiteLabelEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981]"></div>
              </label>
            </div>

            {whiteLabelEnabled && (
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
                <div className="text-xs font-bold text-emerald-950">
                  Sous-domaine personnalisé actif :
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="flex-1 p-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-mono text-emerald-900 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => showToast('🔗 DNS vérifié : CNAME pointe correctement vers CMFlow !')}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                  >
                    Tester DNS
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ---------------------------------------------------------------------
          ONGLET 2 : CONNEXIONS API RÉSEAUX SOCIAUX
          --------------------------------------------------------------------- */}
      {activeTab === 'api' && (
        <div className="space-y-4">
          
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-[#0F172A]">
                Comptes & Intégrations Réseaux Sociaux
              </h2>
              <p className="text-xs text-slate-500">
                Connectez les pages professionnelles pour activer la publication automatique après validation client.
              </p>
            </div>

            <div className="space-y-3">
              
              {/* Meta Graph API */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0066FF] to-blue-500 text-white flex items-center justify-center font-black text-base shadow-sm">
                    M
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#0F172A] flex items-center gap-2">
                      <span>Meta Graph API (Instagram Pro & Facebook Pages)</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        ✓ Connecté
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Token officiel valide (Expire dans 58 jours) · 4 pages associées
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => showToast('🔄 Token Meta rafraîchi avec succès !')}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#0066FF]" />
                    <span>Rafraîchir</span>
                  </button>
                </div>
              </div>

              {/* TikTok Business API */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-black text-base shadow-sm">
                    TK
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#0F172A] flex items-center gap-2">
                      <span>TikTok Business API</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        ✓ Connecté
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Publication vidéo directe et statistiques Reels
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => showToast('🔄 Synchronisation TikTok OK.')}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs"
                  >
                    Vérifier
                  </button>
                </div>
              </div>

              {/* LinkedIn API */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 opacity-80">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0077B5] text-white flex items-center justify-center font-black text-base shadow-sm">
                    in
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#0F172A] flex items-center gap-2">
                      <span>LinkedIn Company Pages</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                        Non configuré
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Publiez des articles et carrousels B2B automatiquement
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => showToast('🔗 Connexion OAuth LinkedIn initiée...')}
                    className="px-3 py-1.5 bg-[#0077B5] hover:bg-[#006097] text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Connecter le compte
                  </button>
                </div>
              </div>

              {/* X / Twitter API */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 opacity-80">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-base shadow-sm">
                    𝕏
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#0F172A] flex items-center gap-2">
                      <span>X (Twitter) API v2</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                        Optionnel
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Gestion des threads et micro-publications
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => showToast('🔗 Connexion X / Twitter initiée...')}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Connecter
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ---------------------------------------------------------------------
          ONGLET 3 : CONFIGURATION WHATSAPP & MODÈLES
          --------------------------------------------------------------------- */}
      {activeTab === 'whatsapp' && (
        <div className="space-y-6">
          
          <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#0F172A] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#10B981]" />
                  <span>Passerelle WhatsApp & Modèles de Relance Automatiques</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Personnalisez les messages envoyés à vos clients pour l'envoi de liens magiques et les relances.
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                🟢 API WhatsApp Active
              </span>
            </div>

            {/* Numéro Expéditeur */}
            <div className="max-w-md space-y-1.5 text-xs font-bold">
              <label className="block text-slate-700 uppercase tracking-wider">
                Numéro WhatsApp Expéditeur de l'Agence
              </label>
              <input
                type="tel"
                value={waSenderPhone}
                onChange={(e) => setWaSenderPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 font-bold focus:bg-white focus:outline-none"
              />
            </div>

            {/* Tags Dynamiques Rappel */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-2 flex-wrap text-[11px] font-semibold text-slate-600">
              <span className="text-slate-400 font-bold">Variables disponibles :</span>
              <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-mono text-[#F94F06] font-bold">{'{client_name}'}</span>
              <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-mono text-[#0066FF] font-bold">{'{validation_link}'}</span>
              <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-mono text-emerald-600 font-bold">{'{expiration_time}'}</span>
            </div>

            {/* 3 Modèles */}
            <div className="space-y-4 text-xs font-bold">
              
              {/* Modèle 1 */}
              <div className="space-y-1.5">
                <label className="block text-[#0F172A] flex items-center justify-between">
                  <span>Modèle 1 : Envoi du planning hebdomadaire</span>
                  <span className="text-slate-400 font-normal">Message initial</span>
                </label>
                <textarea
                  rows={2}
                  value={template1}
                  onChange={(e) => setTemplate1(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-none"
                />
              </div>

              {/* Modèle 2 */}
              <div className="space-y-1.5">
                <label className="block text-[#0F172A] flex items-center justify-between">
                  <span>Modèle 2 : Relance avant expiration du lien</span>
                  <span className="text-amber-600 font-normal">Envoyé à J-24h</span>
                </label>
                <textarea
                  rows={2}
                  value={template2}
                  onChange={(e) => setTemplate2(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-none"
                />
              </div>

              {/* Modèle 3 */}
              <div className="space-y-1.5">
                <label className="block text-[#0F172A] flex items-center justify-between">
                  <span>Modèle 3 : Message de remerciement après validation</span>
                  <span className="text-emerald-600 font-normal">Clôture de session</span>
                </label>
                <textarea
                  rows={2}
                  value={template3}
                  onChange={(e) => setTemplate3(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-none"
                />
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ---------------------------------------------------------------------
          ONGLET 4 : MEMBRES DE L'ÉQUIPE & RÔLES
          --------------------------------------------------------------------- */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          
          <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#0F172A]">
                  Collaborateurs de l'Agence
                </h2>
                <p className="text-xs text-slate-500">
                  Gérez les accès de vos Community Managers, graphistes et chefs de projets.
                </p>
              </div>
            </div>

            {/* Formulaire Invitation Rapide */}
            <form onSubmit={handleInviteMember} className="flex flex-col sm:flex-row items-stretch gap-2">
              <input
                type="email"
                placeholder="email.collaborateur@agence.sn"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none"
              />
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value as any)}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none"
              >
                <option value="Lead CM">Lead CM</option>
                <option value="Graphiste UI">Graphiste UI</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#F94F06] hover:bg-[#e04605] text-white text-xs font-black rounded-xl shadow-md shadow-[#F94F06]/20 flex items-center justify-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Inviter</span>
              </button>
            </form>

            {/* Tableau Collaborateurs */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase font-black tracking-wider text-slate-400">
                    <th className="pb-3">Collaborateur</th>
                    <th className="pb-3">Rôle</th>
                    <th className="pb-3">Statut</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 flex items-center gap-3">
                        <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200" />
                        <div>
                          <div className="font-extrabold text-[#0F172A]">{member.name}</div>
                          <div className="text-[11px] text-slate-400 font-normal">{member.email}</div>
                        </div>
                      </td>
                      <td className="py-3.5 font-bold">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] ${
                          member.role.includes('Admin') ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {member.status === 'active' ? '✓ Actif' : 'Invité'}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => showToast(`⚙️ Modification des droits de ${member.name}...`)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 shadow-2xs"
                        >
                          Gérer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* ---------------------------------------------------------------------
          ONGLET 5 : SÉCURITÉ & ACCÈS
          --------------------------------------------------------------------- */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          
          {/* Mot de passe */}
          <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-black text-[#0F172A] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#F94F06]" />
              <span>Changer le Mot de Passe de l'Agence</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold max-w-2xl">
              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1">Mot de passe actuel</label>
                <input type="password" placeholder="••••••••••••" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1">Nouveau mot de passe</label>
                <input type="password" placeholder="••••••••••••" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast('🔒 Mot de passe mis à jour avec succès !')}
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-xl"
            >
              Mettre à jour le mot de passe
            </button>
          </div>

          {/* Double Authentification 2FA */}
          <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#0F172A]">Double Authentification (2FA)</h3>
                <p className="text-xs text-slate-500">Sécurisez les accès aux comptes de vos clients via SMS ou Google Authenticator.</p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981]"></div>
              </label>
            </div>
          </div>

          {/* Sessions Actives */}
          <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-base font-black text-[#0F172A]">Sessions Actives Connectées</h3>
            
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Laptop className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-extrabold text-[#0F172A]">Safari sur Mac · Dakar, Sénégal 🇸🇳</div>
                    <div className="text-[11px] text-slate-400">Cette session (Active maintenant)</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">Actif</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="font-extrabold text-[#0F172A]">Chrome sur iPhone 15 Pro · Abidjan 🇨🇮</div>
                    <div className="text-[11px] text-slate-400">Dernière activité : Il y a 2 jours</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('🔌 Session mobile déconnectée.')}
                  className="text-rose-600 font-bold text-[11px] hover:underline"
                >
                  Déconnecter
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
