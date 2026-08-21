'use client';

import React from 'react';
import Sidebar from '../../components/Sidebar';
import WorkspaceSelector from '../../components/WorkspaceSelector';
import { WorkspaceProvider } from '../../context/WorkspaceContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceProvider>
      <div className="flex min-h-screen bg-[#F8FAFC] font-sans antialiased text-[#0F172A]">
        {/* Barre Latérale Unique Partagée */}
        <Sidebar />

        {/* Conteneur Principal pour Toutes les Pages Dashboard */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/40 to-slate-50 overflow-y-auto relative">
          {/* Ambient Soft Glow Spots */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/30 via-purple-50/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 left-1/3 w-[450px] h-[450px] bg-gradient-to-tr from-orange-100/20 via-amber-50/20 to-transparent rounded-full blur-3xl"></div>
          </div>

          {/* Top Bar Universelle avec WorkspaceSelector */}
          <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/75 border-b border-slate-200/70 px-6 md:px-8 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 hidden sm:inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F94F06]"></span>
                CMFlow SaaS Platform
              </div>
            </div>

            {/* Sélecteur de Workspace dynamique (Dribbble/Raycast style) */}
            <div className="flex items-center gap-3">
              <WorkspaceSelector variant="topbar" />
            </div>
          </header>

          <main className="flex-1 relative z-10">
            {children}
          </main>
        </div>
      </div>
    </WorkspaceProvider>
  );
}
