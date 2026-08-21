'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
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
  Menu,
  X,
  Search,
  Send,
  Plus,
  Bell,
  Sparkles,
  Command,
  CheckCircle2,
  Copy,
  ExternalLink,
  UploadCloud,
  FileText
} from 'lucide-react';
import { ClientProvider, useClient, Client } from '../../context/ClientContext';

// Navigation Items universels (9 Modules)
interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: '1. Calendrier & Queue', href: '/dashboard', icon: Calendar },
  { name: '2. Espaces Clients', href: '/dashboard/clients', icon: Users },
  { name: '3. Médiathèque Assets', href: '/dashboard/assets', icon: ImageIcon },
  {
    name: '4. Messagerie Unifiée',
    href: '/dashboard/inbox',
    icon: MessageSquare,
    badge: '3 non lus',
    badgeColor: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
  },
  { name: '5. Start Page (Bio)', href: '/dashboard/bio', icon: Globe },
  { name: '6. Analytics & Rapports', href: '/dashboard/analytics', icon: BarChart3 },
  { name: '7. Validation Client', href: '/dashboard/approvals', icon: ShieldCheck },
  {
    name: '8. Facturation & Forfaits',
    href: '/dashboard/billing',
    icon: CreditCard,
    badge: 'Starter Wave',
    badgeColor: 'bg-amber-500/15 text-amber-500 border-amber-500/30'
  },
  { name: '9. Paramètres Agence', href: '/dashboard/settings', icon: Settings },
];

function MasterDashboardInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { clients, activeClient, setActiveClient, addClient } = useClient();

  // États Layout
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [isQuickActionMenuOpen, setIsQuickActionMenuOpen] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Formulaire Nouvel Espace Client
  const [newClientName, setNewClientName] = useState('');
  const [newClientCountry, setNewClientCountry] = useState('Sénégal 🇸🇳');
  const [newClientCategory, setNewClientCategory] = useState('');
  const [newClientWhatsapp, setNewClientWhatsapp] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Raccourci clavier Global Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsValidationModalOpen(false);
        setIsQuickActionMenuOpen(false);
        setIsClientDropdownOpen(false);
        setIsAddClientModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Détermination du nom de la page pour le fil d'Ariane
  const getPageTitle = () => {
    if (!pathname || pathname === '/dashboard') return 'Calendrier & Queue';
    if (pathname.includes('/clients')) return 'Espaces Clients';
    if (pathname.includes('/assets')) return 'Médiathèque & Assets';
    if (pathname.includes('/inbox')) return 'Messagerie Unifiée';
    if (pathname.includes('/bio')) return 'Start Page (Bio)';
    if (pathname.includes('/analytics')) return 'Analytics & Rapports';
    if (pathname.includes('/approvals')) return 'Portail de Validation';
    if (pathname.includes('/billing')) return 'Facturation & Forfaits';
    if (pathname.includes('/settings')) return 'Paramètres Agence';
    return 'Tableau de bord';
  };

  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const flag = newClientCountry.includes('Côte') ? '🇨🇮' : '🇸🇳';
    addClient({
      name: newClientName,
      country: newClientCountry,
      flag,
      category: newClientCategory || 'Agence & Commerce',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
      color: '#F94F06',
      whatsapp: newClientWhatsapp || '+221 77 000 00 00',
    });

    setIsAddClientModalOpen(false);
    setNewClientName('');
    setNewClientWhatsapp('');
    showToast(`🎉 Marque « ${newClientName} » créée et activée !`);
  };

  const magicLink = `https://cmflow.sn/v/${activeClient.id}-a8f9`;
  const whatsappPreFilled = `Bonjour ! Votre planning pour ${activeClient.name} est prêt pour validation : ${magicLink} 🚀`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased flex selection:bg-[#F94F06]/20 selection:text-[#F94F06]">
      
      {/* Texture de lumière d'arrière-plan (Vercel / Linear Glow) */}
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
          A. SIDEBAR ÉLÉGANTE (#0F172A - Master Layout Sidebar)
          ======================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0F172A] text-white flex flex-col justify-between transition-transform duration-300 ease-out border-r border-slate-800/80 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sélecteur de Marque Universel (Mini-carte Premium) */}
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
                    src={activeClient.avatar}
                    alt={activeClient.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-[#0066FF]/40"
                  />
                  <span className="absolute -bottom-1 -right-1 text-[10px] bg-slate-900 rounded-full px-0.5">
                    {activeClient.flag}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate group-hover:text-sky-300 transition-colors">
                    {activeClient.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {activeClient.category}
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-white shrink-0 ml-1 transition-transform duration-200 ${isClientDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Menu Dropdown Clients */}
            {isClientDropdownOpen && (
              <div className="absolute top-full left-3.5 right-3.5 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl py-2 z-50 max-h-64 overflow-y-auto">
                <div className="text-[9px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                  Changer de marque
                </div>
                {clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => {
                      setActiveClient(client);
                      setIsClientDropdownOpen(false);
                      showToast(`Espace commuté sur « ${client.name} »`);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-800/80 transition-colors ${
                      activeClient.id === client.id ? 'bg-slate-800/90 font-bold text-[#F94F06]' : 'text-slate-300'
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

          {/* Navigation Latérale Universelle (9 Modules) */}
          <nav className="px-3 space-y-1 mt-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/dashboard');

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800/90 text-white font-bold shadow-sm border border-slate-700/60'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#F94F06]' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Profil CM connecté (Pied de Sidebar) */}
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
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* =======================================================================
          B. ZONE PRINCIPALE & TOP BAR UNIVERSELLE
          ======================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 z-10">
        
        {/* Top Bar Universelle (Floating Glass Style) */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-slate-200/60 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3 transition-all">
          
          {/* Gauche : Fil d'Ariane dynamique */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#0F172A] tracking-tight">
                <span className="text-slate-400 font-medium">CMFlow</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-700 font-bold">{getPageTitle()}</span>
                <span className="text-slate-300">/</span>
                <span className="text-[#0F172A] bg-slate-100 px-2 py-0.5 rounded-lg text-xs flex items-center gap-1 font-bold">
                  {activeClient.name} {activeClient.flag}
                </span>
              </div>
            </div>
          </div>

          {/* Centre / Droite : Recherche Globale & Actions Rapides */}
          <div className="flex items-center gap-2.5">
            
            {/* Barre de Recherche Globale (⌘K Trigger) */}
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/80 text-xs text-slate-500 font-medium transition-all"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Rechercher...</span>
              <kbd className="text-[10px] font-mono bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => showToast('Vous êtes à jour dans vos notifications.')}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F94F06] rounded-full ring-2 ring-white"></span>
            </button>

            {/* Bouton WhatsApp Validation (#10B981) */}
            <button
              type="button"
              onClick={() => setIsValidationModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#059669] border border-[#10B981]/30 transition-all duration-200 active:scale-[0.98]"
            >
              <Send className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="hidden sm:inline">Envoyer validation</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>

            {/* Bouton Action Rapide Orange (#F94F06) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsQuickActionMenuOpen(!isQuickActionMenuOpen)}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-extrabold bg-[#F94F06] hover:bg-[#e04605] text-white shadow-lg shadow-[#F94F06]/25 hover:shadow-[#F94F06]/40 active:scale-[0.98] transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">+ Action Rapide</span>
                <span className="sm:hidden">+</span>
              </button>

              {/* Menu Déroulant Actions Rapides */}
              {isQuickActionMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fadeIn">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsQuickActionMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-[#F94F06]" />
                    <span>Planifier un post</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsQuickActionMenuOpen(false);
                      setIsAddClientModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors text-left"
                  >
                    <Users className="w-4 h-4 text-[#0066FF]" />
                    <span>Ajouter un client</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsQuickActionMenuOpen(false);
                      showToast('📂 Glissez un asset dans la médiathèque.');
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors text-left"
                  >
                    <UploadCloud className="w-4 h-4 text-emerald-600" />
                    <span>Importer un asset</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* =====================================================================
            C. ZONE DE CONTENU PRINCIPALE (children)
            ===================================================================== */}
        <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </main>
      </div>

      {/* =======================================================================
          COMMAND PALETTE GLOBALE (⌘K Modal - Linear Style)
          ======================================================================= */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-fadeIn">
            
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Rechercher une action, un client, un post..."
                className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none placeholder-slate-400"
              />
              <kbd className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                ESC
              </kbd>
            </div>

            <div className="p-2 space-y-1 max-h-80 overflow-y-auto text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                Navigation Rapide
              </div>

              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsCommandPaletteOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 text-slate-400" />
                    <span>{item.name}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* =======================================================================
          MODALE UNIVERSELLE : VALIDATION WHATSAPP
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
                {magicLink}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(magicLink);
                  showToast('📋 Lien magique copié dans le presse-papier !');
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
              « {whatsappPreFilled} »
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <a
                href={`https://wa.me/${activeClient.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappPreFilled)}`}
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
          MODALE UNIVERSELLE : AJOUTER UN CLIENT
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

            <form onSubmit={handleAddClientSubmit} className="space-y-4">
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
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
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
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

    </div>
  );
}

export default function MasterDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProvider>
      <MasterDashboardInner>{children}</MasterDashboardInner>
    </ClientProvider>
  );
}
