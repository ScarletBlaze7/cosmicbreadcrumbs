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
      <div className="mx-auto max-w-7xl px-3 pt-2 pb-2 sm:px-6">
        {/* Main Title Centered */}
        <div className="flex flex-col items-center justify-center text-center">
          <h1 
            onClick={() => onViewChange('dashboard')}
            className="font-flavors text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200 tracking-wide drop-shadow-md cursor-pointer select-none leading-none py-1 hover:brightness-110 transition-all"
          >
            Cosmic Breadcrumbs
          </h1>
        </div>

        {/* 3 Icons Row */}
        <div className="relative flex items-center justify-between mt-1 px-1 sm:px-4">
          {/* Left: Profile Picture (of their choosing) / Zodiac Sign Button */}
          <button
            type="button"
            id="btn-header-profile-zodiac"
            onClick={onOpenProfile}
            className="relative flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full border-2 border-blue-400/90 bg-[#060a22] shadow-[0_0_14px_rgba(59,130,246,0.65)] hover:shadow-[0_0_22px_rgba(59,130,246,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shrink-0"
            title={`${userProfile.name || 'Seeker'}'s Profile (${sunSign.name}) • Tap to open Profile & Sanctuary Badge`}
          >
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full overflow-hidden border border-blue-400/60 bg-blue-950/70">
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name || 'Seeker Profile'}
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <ZodiacSymbolIcon sign={sunSign.name} className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-[0_0_6px_rgba(147,197,253,0.95)]" />
              )}
            </div>
          </button>

          {/* Center: Glowing Stardust Astrology Wheel - Blends seamlessly into header */}
          <button
            type="button"
            id="btn-header-astrology-wheel"
            onClick={() => onViewChange('dashboard')}
            className="relative flex items-center justify-center cursor-pointer group focus:outline-none bg-transparent"
            title="Cosmic Hub • Alignment Portal"
          >
            <img
              src="/cosmic-wheel-center.png"
              alt="Cosmic Alignment Portal"
              className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 object-contain filter drop-shadow-[0_0_18px_rgba(56,189,248,0.7)] transition-transform duration-300 group-hover:scale-105 active:scale-95 mix-blend-screen select-none pointer-events-auto"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/astrology-wheel.png';
              }}
            />
          </button>

          {/* Right: Glowing / Pulsating Feather Icon */}
          <button
            type="button"
            id="btn-ask-oracle"
            onClick={onOpenOracleChat}
            className="relative flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-2xl p-0.5 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shrink-0"
            title="Cosmic Insights Guidance & Messaging • Tap to Chat"
          >
            <img
              src="/cosmicinsights.png"
              alt="Cosmic Insights Feather"
              className="h-full w-full object-contain animate-cosmic-glow drop-shadow-[0_0_14px_rgba(192,132,252,0.85)]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/cosmicinsights.png';
              }}
            />
          </button>
        </div>

        {/* Sub-header Bar: Quote on Left, [Journal] [Dreams] on Right */}
        <div className="w-full flex items-center justify-between gap-2 pt-2 border-t border-purple-950/60 mt-2 px-1 sm:px-2">
          <span className="italic font-serif text-xs sm:text-sm md:text-base text-amber-200/90 tracking-wide drop-shadow-sm truncate">
            'Awaken the Universe Within"
          </span>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => onViewChange('diary')}
              className="flex items-center space-x-1.5 rounded-xl border border-purple-800/80 bg-[#120f26] px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs sm:text-sm font-sans font-bold text-slate-100 hover:border-amber-400 hover:bg-purple-900 transition-all shadow-md active:scale-95 cursor-pointer"
              title="Open Daily Log & Journal"
            >
              <BookMarked className="h-3.5 w-3.5 text-amber-300" />
              <span>Journal</span>
            </button>

            <button
              type="button"
              onClick={() => onViewChange('dreams')}
              className="flex items-center space-x-1.5 rounded-xl border border-purple-800/80 bg-[#120f26] px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs sm:text-sm font-sans font-bold text-slate-100 hover:border-amber-400 hover:bg-purple-900 transition-all shadow-md active:scale-95 cursor-pointer"
              title="Open Dream Sanctuary"
            >
              <CloudMoon className="h-3.5 w-3.5 text-purple-300" />
              <span>Dreams</span>
            </button>

            {/* Quick Tools for Accessibility & Profile */}
            <div className="hidden md:flex items-center space-x-1.5 pl-2 border-l border-purple-900/60">
              <button
                onClick={handleCycleFontSize}
                title={`Font Size: ${fontSize.toUpperCase()}`}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-purple-800/70 bg-[#120f26] text-amber-200 hover:border-amber-400 text-xs cursor-pointer"
              >
                <Type className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleShareApp}
                title="Share Sanctuary"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-purple-800/70 bg-[#120f26] text-purple-200 hover:text-white text-xs cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={onOpenProfile}
                title={`${userProfile.name || 'Seeker'}'s Profile`}
                className="flex items-center space-x-1.5 rounded-xl border border-purple-700/70 bg-[#120f26] hover:border-purple-400 px-2.5 py-1 text-xs font-bold text-slate-100 cursor-pointer"
              >
                <User className="h-3.5 w-3.5 text-purple-200" />
                <span className="max-w-[70px] truncate">{userProfile.name || 'Account'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification on Font Size Change */}
      {fontToast && (
        <div className="fixed top-18 right-6 z-50 rounded-2xl border border-amber-400/80 bg-[#120f26]/95 px-4 py-2 text-sm font-bold text-amber-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          {fontToast}
        </div>
      )}
    </header>
  );
};

