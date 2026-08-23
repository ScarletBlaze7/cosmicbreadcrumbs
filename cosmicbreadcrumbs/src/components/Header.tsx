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
import { SanctuaryProfileBadge } from './SanctuaryProfileBadge';

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

  // Auto-scroll the active tab into view on mobile safely within its container only
  useEffect(() => {
    const navContainer = mobileNavRef.current;
    if (navContainer) {
      const activeEl = navContainer.querySelector(`[data-nav-id="${currentView}"]`) as HTMLElement;
      if (activeEl) {
        const containerRect = navContainer.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();
        const offset =
          activeRect.left -
          containerRect.left +
          navContainer.scrollLeft -
          navContainer.clientWidth / 2 +
          activeRect.width / 2;

        navContainer.scrollTo({
          left: Math.max(0, offset),
          behavior: 'smooth',
        });
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
    { id: 'dreams', label: 'Dreamscape', icon: CloudMoon },
    { id: 'diary', label: 'Daily Log/Journal', icon: BookMarked },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-950/80 bg-[#060710]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-6 sm:py-3 gap-2">
        {/* Logo & Brand */}
        <div 
          onClick={() => onViewChange('dashboard')}
          className="group flex cursor-pointer items-center space-x-1.5 sm:space-x-3 min-w-0 shrink"
          id="app-brand-logo"
        >
          <CosmicLogo size="md" showUploadTrigger={true} />
          <div className="flex flex-col text-left min-w-0">
            <span className="font-flavors text-lg sm:text-2xl md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200 tracking-wide drop-shadow-sm leading-tight py-0.5 truncate max-w-[140px] xs:max-w-[180px] sm:max-w-none">
              Cosmic Breadcrumbs
            </span>
            <span className="text-[9px] sm:text-xs font-revalia tracking-wider text-amber-200 uppercase hidden sm:block font-bold">
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
        <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
          
          {/* Font Size Quick Toggle Button (Accessibility) */}
          <button
            id="btn-toggle-font-size"
            onClick={handleCycleFontSize}
            title={`Font Size: ${fontSize.toUpperCase()} • Tap to enlarge fonts for reading comfort`}
            className="hidden lg:flex items-center space-x-1.5 rounded-2xl border border-purple-800/80 bg-[#120f26] px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-bold text-amber-200 hover:border-amber-400 hover:bg-purple-950 transition-all shadow-sm"
          >
            <Type className="h-4 w-4 text-amber-300" />
            <span className="font-mono text-xs hidden sm:inline">
              {fontSize === 'comfortable' ? 'Text Aa' : fontSize === 'large' ? 'Text Aa+' : 'Text Aa++'}
            </span>
          </button>

          {/* Share */}
          <button
            id="btn-share-app"
            onClick={handleShareApp}
            title="Share Sanctuary"
            className="hidden md:flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl border border-purple-800/80 bg-[#120f26] text-purple-200 hover:border-purple-400 hover:text-white transition-all"
          >
            <Share2 className="h-4 w-4" />
          </button>

          {/* Chat with Cosmic AI for Guidance Button (Next to Badge) */}
          <button
            id="btn-ask-oracle"
            onClick={onOpenOracleChat}
            className="flex items-center space-x-1 sm:space-x-1.5 rounded-2xl border border-purple-600/80 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-sans font-bold tracking-wide text-white hover:border-amber-400 hover:bg-purple-900 transition-all shadow-md active:scale-95 shrink-0"
            title="Chat with Cosmic AI for Guidance"
          >
            <MessageSquareQuote className="h-4 w-4 text-amber-300 shrink-0" />
            <span className="hidden xs:inline">Cosmic AI</span>
            <span className="xs:hidden inline">AI</span>
            {!membership.isActive && <Lock className="h-3 w-3 text-amber-300/80 shrink-0" />}
          </button>

          {/* OFFICIAL MEMBERSHIP BADGE BUTTON (Replaces "Club Trial" button & opens Account Area) */}
          <SanctuaryProfileBadge
            isMember={Boolean(membership.isActive || membership.tier !== 'free')}
            username={userProfile.name}
            size="header"
            countdownText={
              membership.tier === 'trial' && membership.isActive
                ? `${trialTime.days}d ${trialTime.hours}h ${trialTime.minutes}m`
                : membership.isActive
                ? (membership.planName || 'VIP Member')
                : 'Account'
            }
            onClick={onOpenProfile}
            className="shrink-0"
          />
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

          {/* Direct My Account Tab */}
          <button
            type="button"
            onClick={onOpenProfile}
            id="btn-mobile-nav-account"
            className="flex shrink-0 items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-sans font-bold tracking-wide transition-all bg-gradient-to-r from-amber-500/20 via-purple-900 to-indigo-950 text-amber-200 border border-amber-400/60 shadow-md ring-1 ring-amber-400/30"
          >
            <User className="h-4 w-4 text-amber-300" />
            <span>My Account</span>
          </button>
        </div>
      </div>
    </header>
  );
};

