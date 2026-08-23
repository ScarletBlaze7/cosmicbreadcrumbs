import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  Heart, 
  Briefcase, 
  Shield, 
  Calendar, 
  Clock, 
  Palette, 
  Hash, 
  MessageSquareQuote, 
  Share2, 
  CheckCircle2,
  RefreshCw,
  Zap,
  Info,
  Radio,
  Lock,
  Crown,
  Gift,
  ArrowRight,
  X,
  Globe2,
  Activity,
  Check,
  ShieldCheck
} from 'lucide-react';
import { UserProfile, ZodiacSignInfo, MembershipStatus } from '../types';
import { ZODIAC_SIGNS } from '../data/zodiacData';
import { getSunSignFromDate, getDailyPlanetaryTransits, getMoonPhaseInfo } from '../utils/astrologyCalc';
import { NasaAstrologyRadar } from './NasaAstrologyRadar';
import { ZodiacSymbolIcon } from './ZodiacSymbolIcon';
import { getLoveRelationshipForecast, RelationshipStatus } from '../utils/loveRelationshipForecast';

interface HoroscopeViewProps {
  userProfile: UserProfile;
  onSaveJournal: (title: string, type: 'horoscope' | 'tarot' | 'angel' | 'numerology', content: string) => void;
  membership?: MembershipStatus;
  onOpenWelcomeModal?: (featureName?: string, tab?: 'letter' | 'plans' | 'guide') => void;
}

export const HoroscopeView: React.FC<HoroscopeViewProps> = ({
  userProfile,
  onSaveJournal,
  membership,
  onOpenWelcomeModal,
}) => {
  const isPaidMember = Boolean(membership?.isActive);
  const userSunSign = getSunSignFromDate(userProfile.birthDate);
  const [selectedSign, setSelectedSign] = useState<ZodiacSignInfo>(userSunSign);
  const [period, setPeriod] = useState<'today' | 'tomorrow' | 'weekly' | 'monthly'>('today');
  const [showLockedPeriodModal, setShowLockedPeriodModal] = useState<string | null>(null);
  const [loveCategory, setLoveCategory] = useState<RelationshipStatus>(() => {
    return (localStorage.getItem('cosmic_love_category') as RelationshipStatus) || 'single';
  });
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiReading, setAiReading] = useState<any | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Real-time midnight watcher: automatically updates horoscope data every midnight
  const [currentDateKey, setCurrentDateKey] = useState<string>(() => new Date().toDateString());

  useEffect(() => {
    const checkDateChange = () => {
      const todayStr = new Date().toDateString();
      if (todayStr !== currentDateKey) {
        setCurrentDateKey(todayStr);
        setAiReading(null); // Clear previous day's ephemeral data to refresh for the new day
      }
    };

    // Calculate exact milliseconds until upcoming midnight
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
    const msUntilMidnight = midnight.getTime() - now.getTime();

    const midnightTimeout = setTimeout(() => {
      checkDateChange();
    }, msUntilMidnight);

    // Also check on window focus / visibility change (e.g. phone wakes up next morning)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkDateChange();
      }
    };

    // Periodic safety check every 60 seconds
    const interval = setInterval(checkDateChange, 60000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', checkDateChange);

    return () => {
      clearTimeout(midnightTimeout);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', checkDateChange);
    };
  }, [currentDateKey]);

  const handleSetLoveCategory = (status: RelationshipStatus) => {
    setLoveCategory(status);
    localStorage.setItem('cosmic_love_category', status);
  };

  const handleSelectPeriod = (targetPeriod: 'today' | 'tomorrow' | 'weekly' | 'monthly') => {
    if (targetPeriod === 'today') {
      setPeriod('today');
      setAiReading(null);
      return;
    }

    if (!isPaidMember) {
      // Prompt modal encouraging membership for tomorrow, weekly, monthly
      const periodLabels: Record<string, string> = {
        tomorrow: 'Tomorrow’s Astrological Horizon',
        weekly: '7-Day Weekly Transit Forecast',
        monthly: 'Full Monthly Dimensional Synthesis',
      };
      const featureTitle = periodLabels[targetPeriod] || 'Future Horoscope Insights';
      setShowLockedPeriodModal(featureTitle);
      return;
    }

    setPeriod(targetPeriod);
    setAiReading(null);
  };

  const loveForecast = getLoveRelationshipForecast(selectedSign, loveCategory, period);

  const moonInfo = getMoonPhaseInfo();
  const transits = getDailyPlanetaryTransits();

  // Fetch AI deep astrological reading
  const handleGenerateAIHoroscope = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/gemini/horoscope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sign: selectedSign.name,
          birthDate: userProfile.birthDate,
          birthTime: userProfile.birthTime,
          birthPlace: userProfile.birthPlace,
          period,
          relationshipStatus: loveCategory,
          focusAreas: ['Love (Single, Dating, Married)', 'Career', 'Spiritual Evolution', 'Vitality'],
        }),
      });

      const data = await res.json();
      if (data.data) {
        setAiReading(data.data);
      }
    } catch (err) {
      console.error('AI horoscope request failed:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSaveToJournal = () => {
    const title = `${selectedSign.name} Horoscope (${period.toUpperCase()}) - ${new Date().toLocaleDateString()}`;
    const loveText = aiReading?.loveAspects?.[loveCategory] 
      || aiReading?.aspects?.love 
      || `${loveForecast.title}: ${loveForecast.overview}\nFocus: ${loveForecast.greenFlagOrFocus}\nSacred Action: ${loveForecast.sacredAction}`;

    const content = aiReading 
      ? `Overview: ${aiReading.overview}\n\nLove & Relationship (${loveCategory.toUpperCase()}): ${loveText}\nCareer: ${aiReading.aspects?.career}\nSpirit: ${aiReading.aspects?.spirituality}\nWellness: ${aiReading.aspects?.wellness}\n\nAffirmation: ${aiReading.affirmation}`
      : `${selectedSign.name} (${selectedSign.symbol}) Forecast:\n${selectedSign.traits.description}\n\nLove & Relationship (${loveCategory.toUpperCase()}):\n${loveText}\n\nMotto: ${selectedSign.traits.motto}\nLucky Color: ${selectedSign.dailyTraits.luckyColor}\nLucky Numbers: ${selectedSign.dailyTraits.luckyNumbers.join(', ')}`;
    
    onSaveJournal(title, 'horoscope', content);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="border-b border-purple-900/50 pb-5 space-y-1.5">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
          <span>NASA's Real-time planetary alignments, dimensional forecasts, and AI cosmic synthesis</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100 mt-1">
          Astrological Insights
        </h1>
        <p className="text-xs sm:text-sm text-purple-200 mt-1 leading-relaxed">
          Free Daily horoscope for all users. Sanctuary members may see Daily/Tomorrow/weekly/monthy and AI deep transit synthsis, Love and relationship, Career and wellness etc..
        </p>
      </div>

      {/* PERMANENT FEATURED HOROSCOPE ARTWORK BANNER */}
      <div className="relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden border border-purple-500/40 shadow-2xl bg-slate-950 aspect-[16/9] min-h-[180px]">
        <img
          src="/assets/astrology.png"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = './assets/astrology.png'; }}
          alt="Horoscope Astrological Artwork"
          className="w-full h-full object-cover rounded-3xl select-none"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* NASA REAL-TIME DATA & EPHEMERIS SCIENTIFIC PROVENANCE BANNER */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-cyan-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 p-5 sm:p-6 shadow-xl shadow-cyan-950/20 space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-cyan-900/40 pb-3">
          <div className="flex items-center space-x-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-cyan-300">
                  NASA JPL Real-Time Astronomical Grounding
                </span>
                <span className="rounded-full bg-cyan-950 border border-cyan-700/60 px-2.5 py-0.5 font-sans text-xs text-cyan-300 font-bold">
                  LIVE EPHEMERIS
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
                Our horoscopes are <strong>not generic text</strong>. Every planetary transit, lunar illumination, and aspect angle is computed from <strong>live astronomical coordinates from NASA JPL, NOAA space weather telemetry, and Keplerian orbital algorithms</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <a
              href="#nasa-radar-anchor"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('nasa-radar-anchor');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-2 rounded-xl border border-cyan-500/50 bg-cyan-950/60 px-4 py-2 text-xs sm:text-sm font-bold text-cyan-200 hover:bg-cyan-900/60 hover:text-white transition-all shadow-sm"
            >
              <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
              <span>Inspect Live Telemetry</span>
            </a>
          </div>
        </div>

        {/* Scientific Grounding Telemetry Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="rounded-xl border border-cyan-900/50 bg-slate-950/70 p-3 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-cyan-400 font-medium">
              <Globe2 className="h-3.5 w-3.5" />
              <span>NASA JPL Ephemeris</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-100 flex items-center space-x-1">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>Live J2000 Coordinates</span>
            </div>
          </div>

          <div className="rounded-xl border border-purple-900/50 bg-slate-950/70 p-3 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-purple-300 font-medium">
              <Activity className="h-3.5 w-3.5" />
              <span>NOAA Space Weather</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-100 flex items-center space-x-1">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>Solar Wind & Kp Indices</span>
            </div>
          </div>

          <div className="rounded-xl border border-indigo-900/50 bg-slate-950/70 p-3 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-indigo-300 font-medium">
              <Compass className="h-3.5 w-3.5" />
              <span>Keplerian Mechanics</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-100 flex items-center space-x-1">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>Sub-Arcminute Orbs</span>
            </div>
          </div>

          <div className="rounded-xl border border-amber-900/50 bg-slate-950/70 p-3 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-amber-300 font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Swiss Ephemeris Alg.</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-100 flex items-center space-x-1">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>Exact Planetary Degrees</span>
            </div>
          </div>
        </div>
      </div>

      {/* Encouragement Banner for Free Users to Access Tomorrow, Weekly & Monthly Horoscopes */}
      {!isPaidMember && (
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-purple-950/50 to-indigo-950/40 p-4 sm:p-5 shadow-lg shadow-amber-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Crown className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Deepen Your Cosmic Horizon
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  Daily Forecasts 100% Free
                </span>
              </div>
              <p className="text-xs text-purple-200/90 leading-relaxed max-w-2xl">
                Daily horoscopes are free forever for all seekers! Step into our <strong>Sanctuary Membership</strong> to preview <strong>Tomorrow’s 24-hour planetary shifts</strong>, plan ahead with <strong>7-Day Weekly Transit Maps</strong>, and navigate <strong>Full Monthly Dimensional Syntheses</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
            <button
              onClick={() => onOpenWelcomeModal?.('Tomorrow, Weekly & Monthly Horoscopes', 'letter')}
              className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-900/30 hover:brightness-110 transition-all cursor-pointer"
            >
              <Gift className="h-3.5 w-3.5" />
              <span>Start 3-Day Free Trial</span>
            </button>
            <button
              onClick={() => onOpenWelcomeModal?.('Tomorrow, Weekly & Monthly Horoscopes', 'plans')}
              className="flex items-center space-x-1 rounded-xl border border-purple-700/50 bg-purple-950/60 px-3 py-2 text-xs font-semibold text-purple-200 hover:bg-purple-900/60 transition-all cursor-pointer"
            >
              <span>Explore Plans</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* 12 Zodiac Sign Carousel */}
      <div>
        <div className="flex items-center justify-between text-xs text-purple-300 font-medium mb-3">
          <span>Select Zodiac Constellation:</span>
          {selectedSign.name === userSunSign.name && (
            <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] text-amber-300">
              ✨ Your Birth Sun Sign
            </span>
          )}
        </div>
        <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-3 pt-1">
          {ZODIAC_SIGNS.map((sign) => {
            const isSelected = selectedSign.name === sign.name;
            const isUserSign = userSunSign.name === sign.name;
            return (
              <button
                key={sign.name}
                id={`btn-zodiac-${sign.name.toLowerCase()}`}
                onClick={() => {
                  setSelectedSign(sign);
                  setAiReading(null);
                }}
                className={`flex shrink-0 flex-col items-center justify-center rounded-2xl border p-3.5 min-w-[88px] sm:min-w-[96px] transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-gradient-to-b from-purple-900/90 to-slate-900 text-amber-300 shadow-xl shadow-purple-900/50 scale-105 ring-1 ring-amber-400/40'
                    : 'border-purple-900/50 bg-slate-900/70 text-slate-300 hover:border-purple-700/70 hover:bg-slate-900'
                }`}
              >
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center">
                  <ZodiacSymbolIcon sign={sign.name} size="md" fallbackText={sign.symbol} />
                </div>
                <span className="font-serif text-xs sm:text-sm font-bold mt-1.5">{sign.name}</span>
                <span className="text-[10px] text-purple-300 font-mono mt-0.5">{sign.element}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Sign Profile & Dimensional Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Sign Essence & Lucky Parameters (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-purple-800/40 bg-slate-900/90 p-6 shadow-xl backdrop-blur-sm space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500/15 via-purple-950/90 to-slate-950 border-2 border-amber-400/50 text-amber-300 shadow-2xl overflow-hidden p-1 shrink-0">
                <ZodiacSymbolIcon sign={selectedSign.name} size="lg" fallbackText={selectedSign.symbol} />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-100">
                  {selectedSign.name}
                </h2>
                <p className="text-xs sm:text-sm text-purple-300 font-medium">
                  {selectedSign.glyph} • {selectedSign.dateRange}
                </p>
                <p className="text-xs text-amber-300 font-semibold mt-0.5">
                  Ruling Planet: {selectedSign.rulingPlanet}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-purple-900/50 bg-slate-950/60 p-3 text-xs italic text-purple-200/90 text-center">
              "{selectedSign.traits.motto}"
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-purple-950">
                <span className="text-purple-400">Element & Modality:</span>
                <span className="font-semibold text-slate-200">{selectedSign.element} ({selectedSign.modality})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-950">
                <span className="text-purple-400">Tarot Archetype:</span>
                <span className="font-semibold text-purple-300">{selectedSign.tarotCard}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-950">
                <span className="text-purple-400">Sacred Crystals:</span>
                <span className="font-semibold text-slate-200 truncate max-w-[170px]">{selectedSign.gemstone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-950">
                <span className="text-purple-400">Resonant Chakra:</span>
                <span className="font-semibold text-cyan-300">{selectedSign.chakra}</span>
              </div>
            </div>

            {/* Daily Lucky Tokens */}
            <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-4 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center space-x-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Today's Harmonic Keys</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-slate-950/60 p-2">
                  <div className="flex items-center space-x-1 text-[10px] text-purple-400">
                    <Hash className="h-3 w-3 text-amber-400" />
                    <span>Lucky Numbers</span>
                  </div>
                  <div className="font-bold text-amber-300 mt-0.5">
                    {aiReading?.luckyNumbers ? aiReading.luckyNumbers.join(', ') : selectedSign.dailyTraits.luckyNumbers.join(', ')}
                  </div>
                </div>

                <div className="rounded-lg bg-slate-950/60 p-2">
                  <div className="flex items-center space-x-1 text-[10px] text-purple-400">
                    <Palette className="h-3 w-3 text-rose-400" />
                    <span>Cosmic Color</span>
                  </div>
                  <div className="font-bold text-rose-300 mt-0.5 truncate">
                    {aiReading?.cosmicColor || selectedSign.dailyTraits.luckyColor}
                  </div>
                </div>

                <div className="rounded-lg bg-slate-950/60 p-2">
                  <div className="flex items-center space-x-1 text-[10px] text-purple-400">
                    <Clock className="h-3 w-3 text-cyan-400" />
                    <span>Power Hour</span>
                  </div>
                  <div className="font-bold text-cyan-300 mt-0.5">
                    {aiReading?.powerHour || selectedSign.dailyTraits.luckyTime}
                  </div>
                </div>

                <div className="rounded-lg bg-slate-950/60 p-2">
                  <div className="flex items-center space-x-1 text-[10px] text-purple-400">
                    <Heart className="h-3 w-3 text-pink-400" />
                    <span>Compatibility</span>
                  </div>
                  <div className="font-bold text-pink-300 mt-0.5 truncate">
                    {selectedSign.dailyTraits.compatibility.slice(0, 2).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Deep 4-Dimensional Forecast & AI Synthesis (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Time Period Navigation Bar (Daily, Tomorrow, Weekly, Monthly) - Directly Above Synthesis Reading */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-purple-600/70 bg-gradient-to-r from-slate-900 via-purple-950/60 to-slate-900 p-3 sm:p-3.5 shadow-2xl">
            <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-amber-300 pl-1">
              <Compass className="h-4 w-4 text-amber-400" />
              <span className="uppercase tracking-wider">Forecast Horizon:</span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
              {(
                [
                  { id: 'today', label: 'Daily', isFree: true },
                  { id: 'tomorrow', label: 'Tomorrow', isFree: false },
                  { id: 'weekly', label: 'Weekly', isFree: false },
                  { id: 'monthly', label: 'Monthly', isFree: false },
                ] as const
              ).map((p) => {
                const isSelected = period === p.id;
                const isLocked = !p.isFree && !isPaidMember;

                return (
                  <button
                    key={p.id}
                    id={`btn-period-${p.id}`}
                    onClick={() => handleSelectPeriod(p.id)}
                    className={`flex shrink-0 items-center space-x-2 rounded-xl px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-black tracking-wide transition-all cursor-pointer shadow-sm ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-900/80 border-2 border-amber-400 scale-105'
                        : isLocked
                        ? 'bg-slate-950/80 border border-purple-900/60 text-purple-200 hover:border-amber-400/50 hover:text-amber-300'
                        : 'bg-slate-950/80 border border-purple-900/60 text-slate-100 hover:border-purple-600 hover:text-white'
                    }`}
                  >
                    <span className={isSelected ? 'text-white font-extrabold drop-shadow' : 'text-slate-100 font-bold'}>
                      {p.label}
                    </span>
                    {p.isFree ? (
                      <span className={`rounded-md px-1.5 py-0.5 text-[10px] sm:text-xs font-black uppercase tracking-wider ${
                        isSelected 
                          ? 'bg-emerald-400 text-slate-950 shadow' 
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        Free
                      </span>
                    ) : isLocked ? (
                      <span className="flex items-center space-x-0.5 rounded-md bg-amber-500/20 px-1.5 py-0.5 text-[10px] sm:text-xs font-bold text-amber-300 border border-amber-500/40">
                        <Lock className="h-3 w-3" />
                        <span>PRO</span>
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Astrologer Deep Synthesis Card */}
          <div className="relative overflow-hidden rounded-3xl border border-purple-700/50 bg-gradient-to-br from-purple-950/70 via-slate-900 to-slate-950 p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-800/40 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-100">
                    {period.toUpperCase()} Astrological Synthesis
                  </h3>
                  <p className="text-xs text-purple-300/80">
                    Calculated for {selectedSign.name} based on current planetary transits
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  id="btn-ai-astrology-synthesis"
                  onClick={handleGenerateAIHoroscope}
                  disabled={loadingAI}
                  className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:opacity-90 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingAI ? 'animate-spin' : ''}`} />
                  <span>{loadingAI ? 'Consulting Stars...' : 'AI Deep Transit Synthesis'}</span>
                </button>
              </div>
            </div>

            {/* Synthesis Content */}
            <div className="mt-4 space-y-4">
              <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
                {aiReading?.overview || (
                  `As ${selectedSign.name} moves through this ${period} cycle, the celestial tides are supporting focused clarity and inner expansion. The Sun shines upon your house of purpose, allowing your authentic gifts to emerge effortlessly.`
                )}
              </p>

              {/* Transit Alert Banner */}
              <div className="flex items-start space-x-3 rounded-2xl border border-indigo-800/40 bg-indigo-950/30 p-3.5">
                <Zap className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <div className="font-semibold text-amber-300">
                    Key Planetary Transit: {aiReading?.transitAlert || transits[0]?.aspect || 'Jupiter Harmonic Trine'}
                  </div>
                  <p className="text-purple-200/80 text-[11px] leading-relaxed">
                    {transits[0]?.description}
                  </p>
                </div>
              </div>

              {/* Love & Relationships Dedicated Category Section */}
              <div className="rounded-3xl border border-rose-900/50 bg-gradient-to-br from-rose-950/40 via-slate-950/80 to-purple-950/50 p-4 sm:p-5 shadow-lg space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-900/40 pb-3">
                  <div className="flex items-center space-x-2 text-rose-300 font-semibold text-sm">
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-rose-500/20 text-rose-300">
                      <Heart className="h-4 w-4 fill-rose-400/30 text-rose-400" />
                    </div>
                    <div>
                      <span>Love & Relationships</span>
                      <span className="text-[10px] text-rose-400/80 block font-normal">Cosmic Romantic Resonance</span>
                    </div>
                  </div>

                  {/* Relationship Category Selector Tabs: Single | Dating | Married */}
                  <div className="flex items-center space-x-1 rounded-xl border border-rose-800/40 bg-slate-950/80 p-1 self-start sm:self-auto">
                    {(
                      [
                        { id: 'single', label: 'Single', icon: '✨' },
                        { id: 'dating', label: 'Dating', icon: '🌹' },
                        { id: 'married', label: 'Married', icon: '💍' },
                      ] as const
                    ).map((cat) => {
                      const isActive = loveCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          id={`btn-love-category-${cat.id}`}
                          onClick={() => handleSetLoveCategory(cat.id)}
                          className={`flex items-center space-x-1.5 rounded-lg px-2.5 sm:px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm shadow-rose-900/50 scale-102'
                              : 'text-rose-300/70 hover:bg-rose-950/40 hover:text-rose-100'
                          }`}
                        >
                          <span className="text-[11px]">{cat.icon}</span>
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Love Dynamic Highlight */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2.5 py-0.5 text-[10px] font-semibold text-rose-300">
                        {loveForecast.title}
                      </span>
                      <span className="text-xs font-bold text-slate-100">
                        {loveForecast.headline}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-[11px] text-pink-400 font-medium">
                      <span>Vibe:</span>
                      <span className="text-rose-200 font-semibold">{loveForecast.cosmicVibe}</span>
                    </div>
                  </div>

                  {/* Forecast Text */}
                  <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-rose-950">
                    {aiReading?.loveAspects?.[loveCategory] || aiReading?.aspects?.love || loveForecast.overview}
                  </p>

                  {/* Category Details Sub-Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {/* Guidance / Focus */}
                    <div className="rounded-xl border border-rose-900/30 bg-slate-950/60 p-2.5 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1">
                        <span>✨ Cosmic Focus & Green Flag</span>
                      </span>
                      <p className="text-[11px] text-purple-200/90 leading-snug">
                        {loveForecast.greenFlagOrFocus}
                      </p>
                    </div>

                    {/* Intimacy & Communication Key */}
                    <div className="rounded-xl border border-rose-900/30 bg-slate-950/60 p-2.5 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 flex items-center space-x-1">
                        <span>💖 Intimacy & Connection</span>
                      </span>
                      <p className="text-[11px] text-purple-200/90 leading-snug">
                        {loveForecast.intimacyTip}
                      </p>
                    </div>

                    {/* Romantic Compatibility & Sacred Action */}
                    <div className="rounded-xl border border-rose-900/30 bg-slate-950/60 p-2.5 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1">
                        <span>💫 Harmonic Matches</span>
                      </span>
                      <p className="text-[11px] text-amber-300 font-semibold leading-snug">
                        {loveForecast.bestMatches.join(', ')}
                      </p>
                      <p className="text-[10px] text-purple-300/80 italic line-clamp-1">
                        {loveForecast.sacredAction}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remaining 3 Aspects: Career, Spirituality, Wellness */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                {/* Career */}
                <div className="rounded-2xl border border-amber-900/40 bg-slate-950/70 p-4 space-y-1.5">
                  <div className="flex items-center space-x-2 text-amber-300 font-semibold text-xs">
                    <Briefcase className="h-4 w-4 text-amber-400" />
                    <span>Career & Purpose</span>
                  </div>
                  <p className="text-xs text-purple-200/80 leading-relaxed">
                    {aiReading?.aspects?.career || 'Momentum is on your side. Trust your innovative solutions and take initiative on pending projects.'}
                  </p>
                </div>

                {/* Spirituality */}
                <div className="rounded-2xl border border-purple-900/40 bg-slate-950/70 p-4 space-y-1.5">
                  <div className="flex items-center space-x-2 text-purple-300 font-semibold text-xs">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    <span>Spiritual Awakening</span>
                  </div>
                  <p className="text-xs text-purple-200/80 leading-relaxed">
                    {aiReading?.aspects?.spirituality || 'Dedicate 10 minutes to stillness today. Your third eye is receptive to divine synchronicities.'}
                  </p>
                </div>

                {/* Wellness */}
                <div className="rounded-2xl border border-cyan-900/40 bg-slate-950/70 p-4 space-y-1.5">
                  <div className="flex items-center space-x-2 text-cyan-300 font-semibold text-xs">
                    <Shield className="h-4 w-4 text-cyan-400" />
                    <span>Vitality & Chakras</span>
                  </div>
                  <p className="text-xs text-purple-200/80 leading-relaxed">
                    {aiReading?.aspects?.wellness || 'Hydrate with lemon water and ground your root chakra with gentle breathwork in nature.'}
                  </p>
                </div>
              </div>

              {/* Cosmic Affirmation & Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-purple-800/40 bg-purple-950/40 p-4">
                <div className="text-xs text-amber-200 font-serif italic text-center sm:text-left">
                  "{aiReading?.affirmation || `I walk boldly in harmony with the cosmos, radiating sovereign light and divine peace.`}"
                </div>

                <button
                  onClick={handleSaveToJournal}
                  className={`flex shrink-0 items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    isSaved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800 border border-purple-700/50'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Logged to Journal!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" />
                      <span>Log to Mystic Journal</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Real-time NASA Ephemeris & Astrological Radar */}
          <div id="nasa-radar-anchor" className="pt-2 scroll-mt-24">
            <NasaAstrologyRadar />
          </div>
        </div>
      </div>

      {/* Locked Future Period Modal */}
      {showLockedPeriodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-amber-500/40 bg-gradient-to-b from-slate-900 via-purple-950/90 to-slate-950 p-6 sm:p-7 shadow-2xl shadow-purple-950/60 space-y-5">
            {/* Close button */}
            <button
              onClick={() => setShowLockedPeriodModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-purple-400 hover:text-slate-100 hover:bg-purple-900/40 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    Daily Horoscope: Free Forever
                  </span>
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                    PRO Feature
                  </span>
                </div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-100 mt-1">
                  Unlock {showLockedPeriodModal}
                </h2>
              </div>
            </div>

            {/* Description & Feature Benefits */}
            <div className="space-y-3 bg-purple-950/40 rounded-2xl p-4 border border-purple-800/40 text-xs text-purple-200/90 leading-relaxed">
              <p>
                While your <strong>Daily Horoscope</strong> remains completely free for all seekers, future planetary horizons require a <strong>Sanctuary Membership</strong>:
              </p>
              
              <ul className="space-y-2 pt-1 text-[11px] text-purple-200">
                <li className="flex items-start space-x-2">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Tomorrow’s 24-Hour Shifts</strong>: Anticipate sudden lunar aspects and planetary transits before they manifest.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Calendar className="h-3.5 w-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>7-Day Weekly Transit Maps</strong>: Strategic weekly forecasting for career, romance, and financial opportunities.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Compass className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Full Monthly Dimensional Syntheses</strong>: Deep retrogrades, moon phases, and holistic life direction insights.</span>
                </li>
              </ul>
            </div>

            {/* Trial Offer & Actions */}
            <div className="pt-2 space-y-2.5">
              <button
                onClick={() => {
                  setShowLockedPeriodModal(null);
                  onOpenWelcomeModal?.(showLockedPeriodModal, 'letter');
                }}
                className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-900/30 hover:brightness-110 transition-all cursor-pointer"
              >
                <Gift className="h-4 w-4" />
                <span>Start 3-Day Free Trial ($0 Upfront)</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  setShowLockedPeriodModal(null);
                  onOpenWelcomeModal?.(showLockedPeriodModal, 'plans');
                }}
                className="w-full py-2 text-xs font-semibold text-purple-300 hover:text-purple-100 transition-colors cursor-pointer text-center"
              >
                View Weekly ($3), Monthly ($11), and Lifetime ($33) Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
