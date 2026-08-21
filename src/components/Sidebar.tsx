'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  ChevronDown,
  Sparkles,
  Plus
} from 'lucide-react';
import { useClient } from '../context/ClientContext';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: React.ReactNode;
}

export const NAV_ITEMS: NavItem[] = [
  {
    name: 'Calendrier & Queue',
    href: '/dashboard/calendar',
    icon: Calendar,
  },
  {
    name: 'Espaces Clients',
    href: '/dashboard/clients',
    icon: Users,
  },
  {
    name: 'Médiathèque Assets',
    href: '/dashboard/assets',
    icon: ImageIcon,
  },
  {
    name: 'Inbox Unifiée',
    href: '/dashboard/inbox',
    icon: MessageSquare,
    badge: (
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
      </span>
    ),
  },
  {
    name: 'Start Page (Bio)',
    href: '/dashboard/bio',
    icon: Globe,
  },
  {
    name: 'Analytics & Rapports',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    name: 'Portail Validation',
    href: '/dashboard/approvals',
    icon: ShieldCheck,
  },
  {
    name: 'Facturation & Forfaits',
    href: '/dashboard/billing',
    icon: CreditCard,
    badge: (
      <span className="bg-[#1E90FF]/15 text-[#1E90FF] border border-[#1E90FF]/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-tight">
        Wave
      </span>
    ),
  },
  {
    name: 'Paramètres Agence',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { clients, activeClient, setActiveClient } = useClient();
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0F172A] text-white flex flex-col justify-between border-r border-slate-800/80 min-h-screen sticky top-0 h-screen overflow-y-auto select-none z-40">
      
      <div>
        {/* En-tête Logo & Badge Pro */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/dashboard/calendar" className="inline-flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#F94F06] to-amber-500 flex items-center justify-center font-black text-white text-base shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-white flex items-center gap-1.5">
                CMFlow
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#F94F06]/20 text-[#F94F06] border border-[#F94F06]/30">
                  PRO
                </span>
              </span>
            </div>
          </Link>
        </div>

        {/* Sélecteur d'Espace Client Actif */}
        <div className="p-3.5 relative">
          <div className="text-[9px] font-extrabold uppercase text-slate-400 px-2 mb-1.5 flex items-center justify-between tracking-wider">
            <span>Espace Client Actif</span>
            <span className="text-emerald-400 flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-600 transition-all text-left group shadow-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={activeClient?.avatar || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80'}
                alt={activeClient?.name || 'Client'}
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-[#0066FF]/40 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate group-hover:text-sky-300 transition-colors flex items-center gap-1">
                  <span className="truncate">{activeClient?.name || 'Teranga Gourmet'}</span>
                  <span className="text-[10px] shrink-0">{activeClient?.flag || '🇸🇳'}</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {activeClient?.category || 'Haute Gastronomie'}
                </div>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isClientDropdownOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          {/* Menu Déroulant Workspaces */}
          {isClientDropdownOpen && (
            <div className="absolute top-full left-3.5 right-3.5 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn">
              <div className="text-[9px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                Changer de Workspace
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1 px-1">
                {clients.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setActiveClient(c);
                      setIsClientDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-all ${
                      activeClient?.id === c.id
                        ? 'bg-gradient-to-r from-orange-500/20 to-orange-500/5 text-[#F94F06] border border-orange-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img src={c.avatar} alt={c.name} className="w-5 h-5 rounded-md object-cover shrink-0" />
                      <span className="truncate">{c.name}</span>
                      <span className="text-[10px] shrink-0">{c.flag}</span>
                    </div>
                    {activeClient?.id === c.id && <span className="text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 9 Modules de Navigation Strictes */}
        <nav className="px-3 space-y-1.5 mt-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            
            // Détection stricte de l'élément actif
            const isActive =
              pathname === item.href ||
              (item.href === '/dashboard/calendar' && (pathname === '/dashboard' || pathname === '/dashboard/calendar')) ||
              (item.href !== '/dashboard/calendar' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-[#F94F06] text-white font-semibold shadow-[0_8px_20px_-4px_rgba(249,79,6,0.35)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.name}</span>
                </div>

                {item.badge && <div className="shrink-0">{item.badge}</div>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profil Connecté (Bas de Sidebar) */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/60 mt-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0066FF] to-sky-400 flex items-center justify-center font-black text-xs text-white shadow-sm shrink-0">
            AD
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">Awa Diop</div>
            <div className="text-[10px] text-slate-400 truncate">Lead CM · Dakar 🇸🇳</div>
          </div>
        </div>
      </div>

    </aside>
  );
}
