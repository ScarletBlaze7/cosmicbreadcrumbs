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
    <header className="sticky top-0 z-40 w-full border-b border-purple-950/80 bg-[#060710]/95 backdrop-blur-md px-3 sm:px-5 py-2">
      <div className="mx-auto max-w-7xl relative flex items-center justify-between min-h-[58px]">
        
        {/* ── LEFT SECTION: Title directly above Tagline ── */}
        <div 
          onClick={() => onViewChange('dashboard')}
          className="flex flex-col items-start z-10 cursor-pointer group"
          id="app-brand-logo"
          title="Return to Cosmic Hub"
        >
          {/* Title */}
          <span className="font-flavors text-lg sm:text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200 tracking-wide leading-tight drop-shadow-[0_0_8px_rgba(251,191,36,0.45)] group-hover:scale-[1.02] transition-transform">
            Cosmic Breadcrumbs
          </span>
          {/* Tagline directly below Title */}
          <span className="font-sans text-[10px] sm:text-xs font-semibold tracking-wide text-amber-200/95 italic drop-shadow-sm -mt-0.5">
            "Awaken the Universe Within"
          </span>
        </div>

        {/* ── CENTER SECTION: Astrological Compass (As Is) ── */}
        <div 
          onClick={() => onViewChange('dashboard')}
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer group z-20"
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

        {/* ── RIGHT SECTION: Top (Feather + Birth Matrix Avatar) | Bottom (Journal & Dreams Tabs) ── */}
        <div className="flex flex-col items-end space-y-1.5 z-10">
          
          {/* Top Row: Cosmic Insight Feather & Cosmic Birth Matrix Avatar side-by-side */}
          <div className="flex items-center space-x-2">
            
            {/* 1. Cosmic Insight Feather Button */}
            <button
              id="btn-cosmic-insight-header"
              onClick={onOpenOracleChat}
              className="group relative flex items-center justify-center p-0.5 bg-transparent border-0 outline-none hover:scale-110 active:scale-95 transition-transform cursor-pointer"
              title="Cosmic Insights - AI Celestial Oracle Guidance"
            >
              <div className="relative flex items-center justify-center">
                {/* Pulsating Celestial Aura */}
                <div className="absolute inset-0 rounded-full bg-amber-400/35 blur-md animate-pulse pointer-events-none" />
                
                <img
                  src="/assets/cosmic-insights-quill.png"
                  alt="Cosmic Insights"
                  className="relative h-7 w-7 sm:h-8 sm:w-8 object-contain drop-shadow-[0_0_12px_rgba(251,191,36,0.95)] animate-pulse transition-transform group-hover:scale-110 select-none pointer-events-none"
                  style={{
                    mixBlendMode: 'screen',
                    WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
                    maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
                  }}
                />
                
                {/* Star Ping Indicator */}
                <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5 pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-80" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
                </span>
              </div>
            </button>

            {/* 2. Cosmic Birth Matrix Profile / Zodiac Sign (To the Right of Feather) */}
            <div 
              onClick={onOpenProfile}
              id="btn-account-profile-trigger"
              className="flex items-center cursor-pointer rounded-xl p-0.5 border border-amber-400/80 bg-[#0d0d24] shadow-[0_0_10px_rgba(251,191,36,0.5)] hover:border-amber-300 hover:scale-105 transition-all"
              title="Cosmic Birth Matrix & Player Profile"
            >
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg overflow-hidden bg-slate-950">
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
            </div>

          </div>

          {/* Bottom Row: Journal & Dreams Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            {/* Journal */}
            <button
              id="nav-daily-journal"
              onClick={() => onViewChange('diary')}
              className={`flex items-center space-x-1 rounded-lg px-2 py-0.5 text-[10px] sm:text-[11px] font-sans font-bold tracking-wide transition-all cursor-pointer ${
                currentView === 'diary'
                  ? 'bg-purple-900 border border-purple-400 text-amber-300 shadow-sm'
                  : 'text-purple-200 bg-[#14102c]/90 hover:bg-purple-950 hover:text-white border border-purple-900/50'
              }`}
              title="Daily Journal & Log"
            >
              <BookMarked className="h-3 w-3 text-amber-300" />
              <span>Journal</span>
            </button>

            {/* Dreams */}
            <button
              id="nav-dreamscape"
              onClick={() => onViewChange('dreams')}
              className={`flex items-center space-x-1 rounded-lg px-2 py-0.5 text-[10px] sm:text-[11px] font-sans font-bold tracking-wide transition-all cursor-pointer ${
                currentView === 'dreams'
                  ? 'bg-purple-900 border border-purple-400 text-amber-300 shadow-sm'
                  : 'text-purple-200 bg-[#14102c]/90 hover:bg-purple-950 hover:text-white border border-purple-900/50'
              }`}
              title="Dreamscape Subconscious Codex"
            >
              <CloudMoon className="h-3 w-3 text-purple-300" />
              <span>Dreams</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};

export default Header;
