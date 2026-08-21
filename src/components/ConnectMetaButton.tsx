'use client';

import React, { useState } from 'react';
import { Instagram, Facebook, CheckCircle2, AlertCircle, Loader2, ArrowRight, RefreshCw, ShieldCheck, Unlink } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

interface ConnectMetaButtonProps {
  workspaceId?: string;
  variant?: 'card' | 'button' | 'compact';
  onConnect?: () => void;
}

export default function ConnectMetaButton({
  workspaceId,
  variant = 'card',
  onConnect,
}: ConnectMetaButtonProps) {
  const { activeWorkspace } = useWorkspace();
  const [isLoading, setIsLoading] = useState(false);

  const targetWorkspaceId = workspaceId || activeWorkspace?.id || 'teranga-gourmet';
  const isConnected = activeWorkspace?.socialMetrics?.instagram?.connected || activeWorkspace?.socialMetrics?.facebook?.connected;
  const igFollowers = activeWorkspace?.socialMetrics?.instagram?.followers || '34.2K';
  const igEngagement = activeWorkspace?.socialMetrics?.instagram?.engagement || '6.2%';

  const handleConnect = () => {
    setIsLoading(true);
    if (onConnect) onConnect();

    // Redirection vers la route OAuth Next.js
    const loginUrl = `/api/auth/meta/login?workspaceId=${encodeURIComponent(targetWorkspaceId)}`;
    window.location.href = loginUrl;
  };

  // Variante Bouton Simple
  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleConnect}
        disabled={isLoading}
        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#E1306C] via-[#FD1D1D] to-[#1877F2] text-white text-xs font-bold shadow-lg shadow-pink-500/20 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Connexion à Meta...</span>
          </>
        ) : (
          <>
            <div className="flex items-center -space-x-1">
              <Instagram className="w-4 h-4" />
              <Facebook className="w-4 h-4" />
            </div>
            <span>{isConnected ? 'Re-synchroniser Meta' : 'Connecter Instagram Pro & Facebook'}</span>
          </>
        )}
      </button>
    );
  }

  // Variante Carte Dribbble / Linear
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-md transition-all relative overflow-hidden">
      
      {/* Accent Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-500/5 via-blue-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        
        {/* Logos & Informations */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E1306C] via-[#FD1D1D] to-[#1877F2] p-0.5 shadow-md shadow-pink-500/15 shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center gap-1">
              <Instagram className="w-4 h-4 text-[#E1306C]" />
              <Facebook className="w-4 h-4 text-[#1877F2]" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-900">
                Meta Graph API (Instagram Pro & Facebook)
              </h3>
              {isConnected ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Connecté (60 jours)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                  Non configuré
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-lg">
              Permet la publication automatique des Reels, Stories, carrousels et la remontée en temps réel des statistiques d'audience pour <strong className="text-slate-700 font-semibold">{activeWorkspace?.name || 'votre marque'}</strong>.
            </p>

            {isConnected && (
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>@{activeWorkspace?.slug || 'compte_pro'}</span>
                </div>
                <div className="text-slate-400">•</div>
                <div className="text-slate-500">
                  <strong className="text-slate-800 font-bold">{igFollowers}</strong> abonnés
                </div>
                <div className="text-slate-400">•</div>
                <div className="text-slate-500">
                  Engagement : <strong className="text-emerald-600 font-bold">{igEngagement}</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bouton d'action */}
        <div className="shrink-0 sm:self-center">
          <button
            type="button"
            onClick={handleConnect}
            disabled={isLoading}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-[0.98] cursor-pointer ${
              isConnected
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200'
                : 'bg-gradient-to-r from-[#E1306C] via-[#FD1D1D] to-[#1877F2] text-white shadow-pink-500/20 hover:shadow-lg hover:shadow-pink-500/30'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirection Meta...</span>
              </>
            ) : isConnected ? (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-synchroniser</span>
              </>
            ) : (
              <>
                <span>Connecter mes comptes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
