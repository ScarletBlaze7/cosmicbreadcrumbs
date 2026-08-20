import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Moon, 
  Compass, 
  Hash, 
  Feather, 
  BookOpen, 
  MessageSquareQuote, 
  User, 
  Share2, 
  Sliders, 
  Lock, 
  CloudMoon, 
  BookMarked, 
  Gift, 
  Crown, 
  Camera, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  MoveRight, 
  Hand,
  Type
} from 'lucide-react';
import { CosmicView, UserProfile, MembershipStatus } from '../types';
import { getMoonPhaseInfo, getSunSignFromDate } from '../utils/astrologyCalc';
import { getTrialTimeRemaining, isFeatureUnlocked } from '../utils/membership';
import { getStoredFontSize, applyFontSize, FontSizeSetting } from '../utils/fontSizePreference';
import { CosmicLogo } from './CosmicLogo';
import { ZodiacSymbolIcon } from './ZodiacSymbolIcon';
import { SanctuaryEmblem } from './SanctuaryEmblem';

interface HeaderProps {
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
  const [moonInfo] = useState(() => getMoonPhaseInfo());
  const [copiedShare, setCopiedShare] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [fontSize, setFontSize] = useState<FontSizeSetting>(() => getStoredFontSize());
  const [fontToast, setFontToast] = useState<string | null>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  const trialTime = getTrialTimeRemaining(membership.trialExpiryDate);
  const sunSign = getSunSignFromDate(userProfile.birthDate || '1996-07-22');

  const handleCycleFontSize = () => {
    let next: FontSizeSetting = 'comfortable';
    if (fontSize === 'comfortable') next = 'large';
    else if (fontSize === 'large') next = 'xlarge';
    else next = 'comfortable';

    setFontSize(next);
    applyFontSize(next);

    const labels: Record<FontSizeSetting, string> = {
      comfortable: 'Text Size: Comfortable (20px)',
      large: 'Text Size: Large (22px)',
      xlarge: 'Text Size: Extra Large (24px)',
    };
    setFontToast(labels[next]);
    setTimeout(() => setFontToast(null), 2200);
  };

  const checkScrollState = () => {
    if (mobileNavRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = mobileNavRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollState();
    window.addEventListener('resize', checkScrollState);
    return () => window.removeEventListener('resize', checkScrollState);
  }, []);

  // Auto-scroll the active tab into view on mobile
  useEffect(() => {
    if (mobileNavRef.current) {
      const activeEl = mobileNavRef.current.querySelector(`[data-nav-id="${currentView}"]`) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
      setTimeout(checkScrollState, 350);
    }
  }, [currentView]);

  const handleScrollLeft = () => {
    if (mobileNavRef.current) {
      mobileNavRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      setTimeout(checkScrollState, 350);
    }
  };

  const handleScrollRight = () => {
    if (mobileNavRef.current) {
      mobileNavRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      setTimeout(checkScrollState, 350);
    }
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cosmic Breadcrumbs - Universal Insights',
          text: `Your daily guide to universal insights—designed to awaken your third eye, expand awareness, and unlock your intuitive power. The universe is always leaving trails of wisdom—follow the breadcrumbs and explore the depths of your true potential.`,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const navItems: { id: CosmicView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Cosmic Hub', icon: Sparkles },
    { id: 'horoscope', label: 'Horoscope', icon: Compass },
    { id: 'tarot', label: 'Daily Tarot', icon: Moon },
    { id: 'numerology', label: 'Numerology', icon: Hash },
    { id: 'angel-oracle', label: 'Archangels', icon: Feather },
    { id: 'dreams', label: 'Dream Sanctuary', icon: CloudMoon },
    { id: 'diary', label: 'Daily Log/Journal', icon: BookMarked },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-950/80 bg-[#060710]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo & Brand */}
        <div 
          onClick={() => onViewChange('dashboard')}
          className="group flex cursor-pointer items-center space-x-2.5 sm:space-x-3"
          id="app-brand-logo"
        >
          <CosmicLogo size="md" showUploadTrigger={true} />
          <div className="flex flex-col text-left">
            <span className="font-flavors text-2xl sm:text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200 tracking-wide drop-shadow-sm leading-none py-0.5">
              Cosmic Breadcrumbs
            </span>
            <span className="text-xs sm:text-sm font-revalia tracking-wider text-amber-200 uppercase hidden sm:block mt-0.5 font-bold">
              YOUR PERSONALIZED COSMIC ALIGNMENT
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-1.5 rounded-2xl border border-purple-950/80 bg-[#090715] p-2 shadow-lg backdrop-blur-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const isUnlocked = isFeatureUnlocked(item.id, membership);

            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 text-sm font-sans font-bold tracking-wide transition-all ${
                  isActive
                    ? 'bg-purple-900 border border-purple-500/90 text-white shadow-lg shadow-purple-950/80'
                    : 'text-purple-100 hover:bg-[#1a1334] hover:text-white border border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-purple-300'}`} />
                <span>{item.label}</span>
                {!isUnlocked && (
                  <Lock className="h-3.5 w-3.5 text-purple-300/80" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Medium Screen Navigation (lg to xl) */}
        <nav className="hidden lg:flex xl:hidden items-center space-x-1 rounded-xl border border-purple-950/80 bg-[#090715] p-1.5 shadow-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const isUnlocked = isFeatureUnlocked(item.id, membership);

            return (
              <button
                key={item.id}
                id={`nav-link-med-${item.id}`}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-xs font-sans font-bold tracking-wide transition-all ${
                  isActive
                    ? 'bg-purple-900 border border-purple-500/80 text-white'
                    : 'text-purple-200 hover:bg-[#1a1334] hover:text-white'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-purple-300'}`} />
                <span>{item.label}</span>
                {!isUnlocked && (
                  <Lock className="h-3 w-3 text-purple-300/70" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Font Size Quick Toggle Button (Accessibility) */}
          <button
            id="btn-toggle-font-size"
            onClick={handleCycleFontSize}
            title={`Font Size: ${fontSize.toUpperCase()} • Tap to enlarge fonts for reading comfort`}
            className="flex items-center space-x-1.5 rounded-2xl border border-purple-800/80 bg-[#120f26] px-3 py-2 text-xs sm:text-sm font-bold text-amber-200 hover:border-amber-400 hover:bg-purple-950 transition-all shadow-sm"
          >
            <Type className="h-4 w-4 text-amber-300" />
            <span className="font-mono text-xs hidden sm:inline">
              {fontSize === 'comfortable' ? 'Text Aa' : fontSize === 'large' ? 'Text Aa+' : 'Text Aa++'}
            </span>
          </button>

          {/* Sanctuary Club / Trial Status Pill Button */}
          <button
            id="btn-header-membership"
            onClick={onOpenMembership}
            className={`flex items-center space-x-2 rounded-2xl px-3.5 py-2 text-xs sm:text-sm font-sans font-bold tracking-wide transition-all shadow-sm ${
              membership.tier === 'trial' && membership.isActive
                ? 'border border-amber-400/80 bg-purple-950/95 text-amber-200 hover:border-amber-300'
                : membership.tier !== 'free' && membership.isActive
                ? 'border border-purple-500/70 bg-purple-900 text-white hover:bg-purple-800'
                : 'border border-purple-500/80 bg-purple-900 text-white hover:bg-purple-800 shadow-md shadow-purple-950/60'
            }`}
            title="The Sanctuary Club - 3-Day Free Trial & Membership Options ($3, $11, $33)"
          >
            {membership.tier === 'trial' && membership.isActive ? (
              <>
                <Gift className="h-4 w-4 text-amber-300" />
                <span>Club Trial ({trialTime.days}d {trialTime.hours}h)</span>
              </>
            ) : membership.tier !== 'free' && membership.isActive ? (
              <>
                <SanctuaryEmblem size="xs" isUnlocked={true} tier={membership.tier} />
                <span>{membership.tier === 'lifetime' ? 'Sanctuary VIP' : 'Club Member'}</span>
              </>
            ) : (
              <>
                <Gift className="h-4 w-4 text-white" />
                <span>Join Club (Free Trial)</span>
              </>
            )}
          </button>

          {/* Ask Oracle Button */}
          <button
            id="btn-ask-oracle"
            onClick={onOpenOracleChat}
            className="flex items-center space-x-1.5 rounded-2xl border border-purple-800/80 bg-[#120f26] px-3.5 py-2 text-xs sm:text-sm font-sans font-bold tracking-wide text-white hover:border-purple-400 hover:bg-purple-950 transition-all shadow-sm"
          >
            <MessageSquareQuote className="h-4 w-4 text-purple-300" />
            <span className="hidden sm:inline">Ask Oracle</span>
            {!membership.isActive && <Lock className="h-3 w-3 text-purple-300/70" />}
          </button>

          {/* Share */}
          <button
            id="btn-share-app"
            onClick={handleShareApp}
            title="Share Sanctuary"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-purple-800/80 bg-[#120f26] text-purple-200 hover:border-purple-400 hover:text-white transition-all"
          >
            <Share2 className="h-4 w-4" />
          </button>

          {/* User Account & Photo */}
          <button
            id="btn-open-profile"
            onClick={onOpenProfile}
            title={`My Account • ${userProfile.name || 'Seeker'} (${sunSign.name}) - Click to customize photo and matrix`}
            className="group relative flex items-center space-x-2.5 rounded-2xl border border-purple-800/80 bg-[#120f26] px-3 py-1.5 text-sm text-white hover:border-purple-400 transition-all"
          >
            {/* User Avatar: Custom Photo or Default Zodiac Sign */}
            <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-purple-900 bg-[#171233]">
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name || 'My Account'}
                  className="h-full w-full object-cover rounded-xl"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-purple-200">
                  <ZodiacSymbolIcon 
                    sign={sunSign.name} 
                    size="sm" 
                    fallbackText={sunSign.symbol} 
                    className="scale-90 text-purple-200"
                  />
                </div>
              )}

              {/* Subtle Camera Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                <Camera className="h-3.5 w-3.5 text-white" />
              </div>
            </div>

            {/* Label: My Account */}
            <div className="text-left hidden sm:block">
              <span className="block font-sans font-bold text-xs sm:text-sm text-white tracking-wide group-hover:text-purple-200 transition-colors leading-tight">
                Account
              </span>
              <span className="block text-xs text-purple-300 font-medium leading-none truncate max-w-[110px]">
                {userProfile.avatarUrl ? (userProfile.name || 'Seeker') : `${sunSign.symbol} ${sunSign.name}`}
              </span>
            </div>

            <span className="sm:hidden font-sans font-bold text-xs text-white">
              Account
            </span>
          </button>
        </div>
      </div>

      {/* Floating Toast Notification on Font Size Change */}
      {fontToast && (
        <div className="fixed top-18 right-6 z-50 rounded-2xl border border-amber-400/80 bg-[#120f26]/95 px-4 py-2 text-sm font-bold text-amber-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          {fontToast}
        </div>
      )}

      {/* Mobile Sub-Navigation Bar with Scroll Chevrons & Swipe Cues */}
      <div className="relative lg:hidden border-t border-purple-950/80 bg-[#080614]">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={handleScrollLeft}
            aria-label="Scroll navigation tabs left"
            className="absolute left-1 top-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-950/95 text-amber-300 border border-purple-800 shadow-md backdrop-blur-xs transition-transform active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            type="button"
            onClick={handleScrollRight}
            aria-label="Scroll navigation tabs right"
            className="absolute right-1 top-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-950/95 text-amber-300 border border-purple-800 shadow-md backdrop-blur-xs transition-transform active:scale-95 animate-pulse"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Scrollable Tabs Row */}
        <div 
          ref={mobileNavRef}
          onScroll={checkScrollState}
          className="flex overflow-x-auto no-scrollbar px-3 py-2.5 space-x-2 shadow-inner scroll-smooth"
        >
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const isUnlocked = isFeatureUnlocked(item.id, membership);
            const isAfterNumerology = index >= 4; // Archangels, Dreams, Diary

            return (
              <button
                key={item.id}
                data-nav-id={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex shrink-0 items-center space-x-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-sans font-bold tracking-wide transition-all ${
                  isActive
                    ? 'bg-purple-900 text-white border border-purple-500/90 shadow-md'
                    : 'bg-[#120f26] text-purple-100 border border-purple-950/80 hover:bg-purple-950 hover:text-white'
                } ${isAfterNumerology ? 'ring-1 ring-amber-400/30' : ''}`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-purple-300'}`} />
                <span>{item.label}</span>
                {!isUnlocked && (
                  <Lock className="h-3 w-3 text-purple-300/80" />
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Swipe Awareness Cue (Prominently alerts user about tabs past Numerology) */}
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-gradient-to-r from-purple-950/50 via-amber-950/40 to-purple-950/50 border-t border-purple-900/40 text-xs text-purple-200">
          <div className="flex items-center space-x-1.5 truncate">
            <span className="inline-block animate-bounce text-amber-300">👉</span>
            <span className="text-amber-200 font-bold truncate">
              Slide or tap arrows for tabs past Numerology:
            </span>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0 ml-1">
            <button
              onClick={() => onViewChange('angel-oracle')}
              className="text-xs px-2 py-0.5 rounded-lg bg-purple-900/80 text-purple-100 hover:text-white hover:bg-purple-800 border border-purple-700/60 font-semibold"
            >
              Archangels
            </button>
            <button
              onClick={() => onViewChange('dreams')}
              className="text-xs px-2 py-0.5 rounded-lg bg-purple-900/80 text-purple-100 hover:text-white hover:bg-purple-800 border border-purple-700/60 font-semibold"
            >
              Dreams
            </button>
            <button
              onClick={() => onViewChange('diary')}
              className="text-xs px-2 py-0.5 rounded-lg bg-purple-900/80 text-purple-100 hover:text-white hover:bg-purple-800 border border-purple-700/60 font-semibold"
            >
              Journal
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

