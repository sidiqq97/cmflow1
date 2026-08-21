'use client';

import React from 'react';
import Sidebar from '../../components/Sidebar';
import { ClientProvider } from '../../context/ClientContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProvider>
      <div className="flex min-h-screen bg-[#F8FAFC] font-sans antialiased text-[#0F172A]">
        {/* Barre Latérale Unique Partagée */}
        <Sidebar />

        {/* Conteneur Principal pour Toutes les Pages Dashboard */}
        <main className="flex-1 bg-gradient-to-br from-slate-50 via-slate-100/40 to-slate-50 min-h-screen overflow-y-auto relative">
          {/* Ambient Soft Glow Spots */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/30 via-purple-50/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 left-1/3 w-[450px] h-[450px] bg-gradient-to-tr from-orange-100/20 via-amber-50/20 to-transparent rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </ClientProvider>
  );
}
