import React from 'react';
import { 
  Sparkles, 
  BookMarked, 
  CloudMoon
} from 'lucide-react';
import { CosmicView, UserProfile, MembershipStatus } from '../types';
import { getSunSignFromDate } from '../utils/astrologyCalc';
import { ZodiacSymbolIcon } from './ZodiacSymbolIcon';

interface HeaderProps {
  onOpenAuth?: () => void;
  currentView: CosmicView;
  onViewChange: (view: CosmicView) => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenOracleChat: () => void;
  membership: MembershipStatus;
  onOpenMembership: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  userProfile,
  onOpenProfile,
  onOpenOracleChat,
  membership,
  onOpenMembership,
}) => {
  const sunSign = getSunSignFromDate(userProfile.birthDate || '1996-07-22');
  const isMemberOrTrial = Boolean(membership?.isActive);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-950/80 bg-[#060710]/95 backdrop-blur-md px-3 sm:px-5 py-2 pt-[max(env(safe-area-inset-top),8px)]">
      <div className="mx-auto max-w-7xl relative flex items-center justify-between min-h-[54px] sm:min-h-[58px]">
        
        {/* ── LEFT SECTION: Title directly above Tagline ── */}
        <div 
          onClick={() => onViewChange('dashboard')}
          className="flex flex-col items-start z-10 cursor-pointer group shrink-0"
          id="app-brand-logo"
          title="Return to Cosmic Hub"
        >
          {/* Title */}
          <span className="font-flavors text-base sm:text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200 tracking-normal sm:tracking-wide leading-tight drop-shadow-[0_0_8px_rgba(251,191,36,0.45)] group-hover:scale-[1.02] transition-transform whitespace-nowrap">
            Cosmic Breadcrumbs
          </span>
          {/* Tagline directly below Title */}
          <span className="font-sans text-[9.5px] sm:text-xs font-semibold tracking-normal sm:tracking-wide text-amber-200/95 italic drop-shadow-sm -mt-0.5 whitespace-nowrap">
            "Awaken the Universe Within"
          </span>
        </div>

        {/* ── CENTER SECTION: Astrological Compass (Visible on md+ screens to avoid mobile overlap) ── */}
        <div 
          onClick={() => onViewChange('dashboard')}
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center justify-center cursor-pointer group z-20"
          title="Cosmic Hub Navigation"
        >
          <div className="relative flex items-center justify-center pointer-events-none">
            {/* Center Compass Image As Is */}
            <div className="relative h-14 w-14 sm:h-18 sm:w-18 md:h-20 md:w-20 flex items-center justify-center pointer-events-none">
              <img 
                src="/assets/cosmic-breadcrumbs-compass-asis.jpg" 
                alt="Cosmic Breadcrumbs Centerpiece" 
                className="h-full w-full object-contain select-none pointer-events-none rounded-2xl transition-transform duration-300 group-hover:scale-105"
                style={{
                  mixBlendMode: 'screen',
                }}
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement;
                  if (!el.src.includes('cosmic-breadcrumbs-compass.jpg')) {
                    el.src = '/assets/cosmic-breadcrumbs-compass.jpg';
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT SECTION: Clean Single-Row Actions (AI Oracle, Journal, Dreams, Profile) ── */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 z-10 shrink-0">
          
          {/* 1. Cosmic Insights AI Oracle Feather */}
          <button
            id="btn-cosmic-insight-header"
            onClick={onOpenOracleChat}
            className="group relative flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[#120f26] border border-amber-500/40 hover:border-amber-400 hover:bg-purple-950/80 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            title="Cosmic Insights - AI Celestial Oracle"
          >
            <div className="relative flex items-center justify-center">
              <img
                src="/assets/cosmic-insights-quill.png"
                alt="Cosmic Insights"
                className="h-5 w-5 sm:h-6 sm:w-6 object-contain drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse select-none pointer-events-none"
                style={{
                  mixBlendMode: 'screen',
                }}
              />
              <span className="absolute -top-1 -right-1 flex h-2 w-2 pointer-events-none">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
              </span>
            </div>
          </button>

          {/* 2. Journal / Diary Shortcut */}
          <button
            id="nav-daily-journal"
            onClick={() => onViewChange('diary')}
            className={`flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
              currentView === 'diary'
                ? 'bg-purple-900 border-amber-400 text-amber-300 shadow-md'
                : 'bg-[#120f26] border-purple-900/70 text-purple-200 hover:text-white hover:border-purple-500'
            }`}
            title="Private Diary & Sacred Journal"
          >
            <BookMarked className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </button>

          {/* 3. Dream Sanctuary Shortcut */}
          <button
            id="nav-dreamscape"
            onClick={() => onViewChange('dreams')}
            className={`flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
              currentView === 'dreams'
                ? 'bg-purple-900 border-amber-400 text-amber-300 shadow-md'
                : 'bg-[#120f26] border-purple-900/70 text-purple-200 hover:text-white hover:border-purple-500'
            }`}
            title="Dream Sanctuary"
          >
            <CloudMoon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </button>

          {/* 4. Cosmic Birth Matrix Profile Avatar */}
          <button 
            onClick={onOpenProfile}
            id="btn-account-profile-trigger"
            className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-xl p-0.5 border border-amber-400/80 bg-[#0d0d24] shadow-[0_0_10px_rgba(251,191,36,0.35)] hover:border-amber-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Cosmic Birth Matrix & Profile"
          >
            <div className="flex h-full w-full items-center justify-center rounded-lg overflow-hidden bg-slate-950">
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name || 'User Avatar'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ZodiacSymbolIcon 
                  sign={sunSign.name} 
                  size="sm" 
                  fallbackText={sunSign.symbol}
                  className="text-amber-300 scale-90" 
                />
              )}
            </div>
          </button>

        </div>

      </div>
    </header>
  );
};

export default Header;
