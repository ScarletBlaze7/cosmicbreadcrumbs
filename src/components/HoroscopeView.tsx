import React, { useState, useRef } from 'react';
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
  ShieldCheck,
  HelpCircle,
  Moon,
  Layers,
  Star,
  Flame,
  Feather
} from 'lucide-react';
import { UserProfile, ZodiacSignInfo, MembershipStatus } from '../types';
import { ZODIAC_SIGNS } from '../data/zodiacData';
import { getSunSignFromDate, getDailyPlanetaryTransits, getMoonPhaseInfo } from '../utils/astrologyCalc';
import { NasaAstrologyRadar } from './NasaAstrologyRadar';
import { ZodiacSymbolIcon } from './ZodiacSymbolIcon';
import { getLoveRelationshipForecast, RelationshipStatus } from '../utils/loveRelationshipForecast';
import { AnimatedAIAstrologer } from './AnimatedAIAstrologer';
import { AudioHoroscopePlayer } from './AudioHoroscopePlayer';

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
  const readingRef = useRef<HTMLDivElement>(null);
  const isPaidMember = Boolean(membership?.isActive);
  const userSunSign = getSunSignFromDate(userProfile.birthDate);
  const [selectedSign, setSelectedSign] = useState<ZodiacSignInfo>(userSunSign);
  const [period, setPeriod] = useState<'today' | 'tomorrow' | 'weekly' | 'monthly'>('today');
  const [showLockedPeriodModal, setShowLockedPeriodModal] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'synthesis' | 'love' | 'vectors' | 'profile' | 'radar'>('synthesis');
  
  const [loveCategory, setLoveCategory] = useState<RelationshipStatus>(() => {
    return (localStorage.getItem('cosmic_love_category') as RelationshipStatus) || 'single';
  });
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiReading, setAiReading] = useState<any | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleSetLoveCategory = (status: RelationshipStatus) => {
    setLoveCategory(status);
    localStorage.setItem('cosmic_love_category', status);
  };

  const handleSelectPeriod = (targetPeriod: 'today' | 'tomorrow' | 'weekly' | 'monthly') => {
    if (targetPeriod === 'today') {
      setPeriod('today');
      setAiReading(null);
      setTimeout(() => {
        readingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      return;
    }

    if (!isPaidMember) {
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
    setTimeout(() => {
      readingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
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
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-7 animate-in fade-in duration-200">
      
      {/* 1. COMPACT HERO HEADER & LIVE SKY INDICATOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-900/50 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              NASA Ephemeris Synchronized • Live Sky Planetary Positions
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-slate-100">
            Daily Astrological Broadcast
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80">
            Personalized celestial guidance for <strong>{selectedSign.name}</strong> ({selectedSign.glyph}) calculated from real-time orbital transits.
          </p>
        </div>

        {/* Selected Sign Pill */}
        <div className="flex items-center space-x-3 rounded-2xl bg-purple-950/70 border border-purple-800/60 p-2.5 self-start md:self-auto shrink-0 shadow-lg">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <ZodiacSymbolIcon sign={selectedSign.name} size="sm" fallbackText={selectedSign.symbol} />
          </div>
          <div>
            <div className="font-serif text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <span>{selectedSign.name}</span>
              <span className="text-xs text-amber-300 font-mono">({selectedSign.element})</span>
            </div>
            <span className="text-[11px] text-purple-300 block">{selectedSign.dateRange}</span>
          </div>
        </div>
      </div>

      {/* 2. ZODIAC CONSTELLATION PICKER (Carousel) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-purple-300 font-medium">
          <span>Choose Your Constellation:</span>
          {selectedSign.name === userSunSign.name && (
            <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] text-amber-300 font-bold">
              ✨ Your Birth Sign ({userSunSign.name})
            </span>
          )}
        </div>

        <div className="flex space-x-2.5 overflow-x-auto no-scrollbar pb-2 pt-0.5">
          {ZODIAC_SIGNS.map((sign) => {
            const isSelected = selectedSign.name === sign.name;
            return (
              <button
                key={sign.name}
                id={`btn-zodiac-${sign.name.toLowerCase()}`}
                onClick={() => {
                  setSelectedSign(sign);
                  setAiReading(null);
                }}
                className={`flex shrink-0 flex-col items-center justify-center rounded-2xl border p-2.5 min-w-[78px] sm:min-w-[86px] transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-gradient-to-b from-purple-900 via-indigo-950 to-slate-950 text-amber-300 shadow-lg shadow-purple-950 scale-105 ring-1 ring-amber-400/50 font-bold'
                    : 'border-purple-900/50 bg-slate-900/70 text-slate-300 hover:border-purple-700/70 hover:bg-slate-900'
                }`}
              >
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center">
                  <ZodiacSymbolIcon sign={sign.name} size="sm" fallbackText={sign.symbol} />
                </div>
                <span className="font-serif text-xs font-bold mt-1">{sign.name}</span>
                <span className="text-[9px] text-purple-300 font-mono">{sign.element}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. FORECAST HORIZON SWITCHER (Daily Free | Tomorrow | Weekly | Monthly) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-purple-700/50 bg-slate-950/90 p-2.5 sm:p-3 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 pl-1">
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
                className={`flex shrink-0 items-center space-x-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-sm ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border border-amber-400/80 scale-102 ring-1 ring-amber-400/40'
                    : isLocked
                    ? 'bg-slate-900/80 border border-purple-900/60 text-purple-300 hover:border-amber-400/50'
                    : 'bg-slate-900/80 border border-purple-900/60 text-slate-200 hover:border-purple-600 hover:text-white'
                }`}
              >
                <span>{p.label}</span>
                {p.isFree ? (
                  <span className="rounded bg-emerald-500/20 text-emerald-300 text-[9.5px] px-1.5 py-0.2 font-bold border border-emerald-500/40">
                    Free
                  </span>
                ) : isLocked ? (
                  <span className="flex items-center space-x-0.5 rounded bg-amber-500/20 px-1 py-0.2 text-[9.5px] font-bold text-amber-300 border border-amber-500/40">
                    <Lock className="h-2.5 w-2.5" />
                    <span>PRO</span>
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MAIN STAGE: ANIMATED AI ASTROLOGER BROADCAST */}
      <div ref={readingRef} className="scroll-mt-6">
        {period === 'today' ? (
          <AnimatedAIAstrologer
            sign={selectedSign}
            loveStatus={loveCategory}
            aiReading={aiReading}
          />
        ) : (
          <AudioHoroscopePlayer
            period={period as 'tomorrow' | 'weekly' | 'monthly'}
            sign={selectedSign}
            aiReading={aiReading}
          />
        )}
      </div>

      {/* 5. STRUCTURED DEEP INSIGHTS EXPLORER TABS */}
      <div className="space-y-4 pt-2">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-purple-900/50 pb-3">
          {(
            [
              { id: 'synthesis', label: 'Deep Transit Synthesis', icon: Sparkles },
              { id: 'love', label: 'Love & Relationships', icon: Heart },
              { id: 'vectors', label: 'Career, Spirit & Health', icon: Briefcase },
              { id: 'profile', label: 'Zodiac Keys & Modality', icon: Star },
              { id: 'radar', label: 'NASA Sky Radar', icon: Globe2 },
            ] as const
          ).map((tab) => {
            const isActive = activeDetailTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveDetailTab(tab.id)}
                className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md border border-purple-500 shadow-purple-950/60 scale-102'
                    : 'bg-slate-950/80 border border-purple-900/50 text-purple-300 hover:border-purple-700 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5 text-amber-300" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: DEEP ASTROLOGICAL SYNTHESIS */}
        {activeDetailTab === 'synthesis' && (
          <div className="rounded-3xl border border-purple-700/50 bg-gradient-to-br from-purple-950/70 via-slate-900 to-slate-950 p-5 sm:p-6 shadow-xl space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-800/40 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-serif text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>{period.toUpperCase()} Deep Transit Synthesis</span>
                </h3>
                <p className="text-xs text-purple-300/80">
                  Computed from real-time astronomical ephemeris for {selectedSign.name}
                </p>
              </div>

              <button
                id="btn-ai-astrology-synthesis"
                onClick={handleGenerateAIHoroscope}
                disabled={loadingAI}
                className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:brightness-110 transition-all disabled:opacity-50 self-start sm:self-auto cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingAI ? 'animate-spin' : ''}`} />
                <span>{loadingAI ? 'Consulting Stars...' : 'Generate Deep AI Synthesis'}</span>
              </button>
            </div>

            {/* Overview Text */}
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed bg-slate-950/70 p-4 rounded-2xl border border-purple-900/50">
              {aiReading?.overview || (
                `As ${selectedSign.name} moves through this ${period} cycle, the celestial tides are supporting focused clarity and inner expansion. The Sun shines upon your house of purpose, allowing your authentic gifts to emerge effortlessly.`
              )}
            </p>

            {/* Key Transit Alert */}
            <div className="flex items-start space-x-3 rounded-2xl border border-indigo-800/50 bg-indigo-950/30 p-4">
              <Zap className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Active Major Transit: {aiReading?.transitAlert || transits[0]?.aspect || 'Jupiter Harmonic Trine'}
                </div>
                <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
                  {transits[0]?.description || 'Harmonious alignment across your foundational houses promotes grounded optimism and progressive expansion.'}
                </p>
              </div>
            </div>

            {/* Daily Affirmation & Journal Log */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-purple-800/40 bg-purple-950/50 p-4">
              <div className="text-xs sm:text-sm text-amber-200 font-serif italic text-center sm:text-left">
                "{aiReading?.affirmation || `I walk boldly in harmony with the cosmos, radiating sovereign light and divine peace.`}"
              </div>

              <button
                onClick={handleSaveToJournal}
                className={`flex shrink-0 items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-purple-900 text-purple-200 hover:bg-purple-800 border border-purple-700/60'
                }`}
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Saved to Mystic Journal!</span>
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
        )}

        {/* TAB 2: LOVE & RELATIONSHIPS */}
        {activeDetailTab === 'love' && (
          <div className="rounded-3xl border border-rose-900/50 bg-gradient-to-br from-rose-950/40 via-slate-950/90 to-purple-950/50 p-5 sm:p-6 shadow-xl space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-900/40 pb-3">
              <div className="flex items-center space-x-2 text-rose-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/20 text-rose-300">
                  <Heart className="h-4 w-4 fill-rose-400/30 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-slate-100">
                    Love & Relationship Dynamics
                  </h3>
                  <span className="text-[11px] text-rose-300/80">Tailored romantic guidance for your current stage</span>
                </div>
              </div>

              {/* Status Switcher */}
              <div className="flex items-center space-x-1 rounded-xl border border-rose-800/40 bg-slate-950/80 p-1 self-start sm:self-auto">
                {(
                  [
                    { id: 'single', label: 'Single', icon: '✨' },
                    { id: 'dating', label: 'Dating', icon: '🌹' },
                    { id: 'married', label: 'Married', icon: '💍' },
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSetLoveCategory(cat.id)}
                    className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      loveCategory === cat.id
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm'
                        : 'text-rose-300/70 hover:text-white'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-0.5 text-xs font-bold text-rose-300">
                  {loveForecast.title} • {loveForecast.headline}
                </span>
                <span className="text-xs text-pink-300 font-mono">
                  Vibe: <strong>{loveForecast.cosmicVibe}</strong>
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-100 leading-relaxed bg-slate-950/70 p-4 rounded-2xl border border-rose-950">
                {aiReading?.loveAspects?.[loveCategory] || aiReading?.aspects?.love || loveForecast.overview}
              </p>

              {/* 3 Sub-Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="rounded-2xl border border-rose-900/40 bg-slate-950/70 p-3.5 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block">
                    ✨ Cosmic Focus
                  </span>
                  <p className="text-xs text-purple-200/90 leading-relaxed">
                    {loveForecast.greenFlagOrFocus}
                  </p>
                </div>

                <div className="rounded-2xl border border-pink-900/40 bg-slate-950/70 p-3.5 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-pink-400 block">
                    💖 Intimacy & Connection
                  </span>
                  <p className="text-xs text-purple-200/90 leading-relaxed">
                    {loveForecast.intimacyTip}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-900/40 bg-slate-950/70 p-3.5 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                    💫 Harmonic Matches
                  </span>
                  <p className="text-xs text-amber-300 font-bold">
                    {loveForecast.bestMatches.join(', ')}
                  </p>
                  <p className="text-[11px] text-purple-300/80 italic mt-0.5">
                    {loveForecast.sacredAction}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LIFE VECTORS (Career, Spirit, Health) */}
        {activeDetailTab === 'vectors' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-150">
            {/* Career */}
            <div className="rounded-3xl border border-amber-900/40 bg-gradient-to-b from-amber-950/30 to-slate-950 p-5 space-y-2.5 shadow-lg">
              <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
                <Briefcase className="h-4 w-4 text-amber-400" />
                <span>Career & Purpose</span>
              </div>
              <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
                {aiReading?.aspects?.career || 'Momentum is supporting your long-term vision. Trust your innovative solutions and execute with clear, methodical focus.'}
              </p>
            </div>

            {/* Spirituality */}
            <div className="rounded-3xl border border-purple-900/40 bg-gradient-to-b from-purple-950/30 to-slate-950 p-5 space-y-2.5 shadow-lg">
              <div className="flex items-center space-x-2 text-purple-300 font-bold text-sm">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span>Spiritual Evolution</span>
              </div>
              <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
                {aiReading?.aspects?.spirituality || 'Dedicate stillness to receive subtle intuitive synchronicities. Your inner compass is tuned to high-vibration clarity.'}
              </p>
            </div>

            {/* Wellness */}
            <div className="rounded-3xl border border-cyan-900/40 bg-gradient-to-b from-cyan-950/30 to-slate-950 p-5 space-y-2.5 shadow-lg">
              <div className="flex items-center space-x-2 text-cyan-300 font-bold text-sm">
                <Shield className="h-4 w-4 text-cyan-400" />
                <span>Vitality & Balance</span>
              </div>
              <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
                {aiReading?.aspects?.wellness || 'Ground your nervous system through conscious hydration, restorative breathwork, and connection with natural greenery.'}
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: ZODIAC KEYS & MODALITY GUIDE */}
        {activeDetailTab === 'profile' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Sign Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-purple-900/50 bg-slate-950/80 p-4 space-y-1">
                <span className="text-xs text-purple-400 block">Ruling Planet</span>
                <span className="font-serif text-base font-bold text-slate-100 block">{selectedSign.rulingPlanet}</span>
                <span className="text-[11px] text-amber-300 font-mono">{selectedSign.element} ({selectedSign.modality})</span>
              </div>

              <div className="rounded-2xl border border-purple-900/50 bg-slate-950/80 p-4 space-y-1">
                <span className="text-xs text-purple-400 block">Lucky Numbers</span>
                <span className="font-mono text-base font-bold text-amber-300 block">
                  {aiReading?.luckyNumbers ? aiReading.luckyNumbers.join(', ') : selectedSign.dailyTraits.luckyNumbers.join(', ')}
                </span>
                <span className="text-[11px] text-purple-300">Daily Harmonic Resonance</span>
              </div>

              <div className="rounded-2xl border border-purple-900/50 bg-slate-950/80 p-4 space-y-1">
                <span className="text-xs text-purple-400 block">Cosmic Color</span>
                <span className="font-serif text-base font-bold text-rose-300 block">
                  {aiReading?.cosmicColor || selectedSign.dailyTraits.luckyColor}
                </span>
                <span className="text-[11px] text-purple-300">Aura Alignment</span>
              </div>

              <div className="rounded-2xl border border-purple-900/50 bg-slate-950/80 p-4 space-y-1">
                <span className="text-xs text-purple-400 block">Sacred Gemstone</span>
                <span className="font-serif text-base font-bold text-cyan-300 block truncate">
                  {selectedSign.gemstone}
                </span>
                <span className="text-[11px] text-purple-300">{selectedSign.chakra} Chakra</span>
              </div>
            </div>

            {/* Modality Explanation Guide */}
            <div className="rounded-3xl border border-purple-800/50 bg-slate-950/90 p-5 sm:p-6 space-y-4">
              <h4 className="font-serif text-base sm:text-lg font-bold text-amber-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Understanding Zodiac Modalities (Cardinal, Fixed, Mutable)</span>
              </h4>
              <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
                While your <strong>Element</strong> is the fuel you are made of (Fire, Earth, Air, Water), your <strong>Modality</strong> dictates how you express action and adapt to cycles.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className={`rounded-2xl border p-4 space-y-1.5 ${
                  selectedSign.modality === 'Cardinal' 
                    ? 'border-amber-400 bg-amber-950/30 ring-1 ring-amber-400/40' 
                    : 'border-purple-900/40 bg-slate-900/60'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 uppercase font-mono">🚀 Cardinal</span>
                    {selectedSign.modality === 'Cardinal' && <span className="text-[10px] text-amber-300 font-bold">✨ Your Modality</span>}
                  </div>
                  <span className="font-serif text-xs font-bold text-slate-100 block">The Starters & Initiators</span>
                  <p className="text-xs text-purple-200/80 leading-relaxed">
                    Aries, Cancer, Libra, Capricorn. Ignite fresh seasons, establish new movements, and lead initial vision.
                  </p>
                </div>

                <div className={`rounded-2xl border p-4 space-y-1.5 ${
                  selectedSign.modality === 'Fixed' 
                    ? 'border-amber-400 bg-amber-950/30 ring-1 ring-amber-400/40' 
                    : 'border-purple-900/40 bg-slate-900/60'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300 uppercase font-mono">🧱 Fixed</span>
                    {selectedSign.modality === 'Fixed' && <span className="text-[10px] text-amber-300 font-bold">✨ Your Modality</span>}
                  </div>
                  <span className="font-serif text-xs font-bold text-slate-100 block">The Builders & Anchors</span>
                  <p className="text-xs text-purple-200/80 leading-relaxed">
                    Taurus, Leo, Scorpio, Aquarius. Anchor the height of seasons, offering unwavering endurance, consistency, and focus.
                  </p>
                </div>

                <div className={`rounded-2xl border p-4 space-y-1.5 ${
                  selectedSign.modality === 'Mutable' 
                    ? 'border-amber-400 bg-amber-950/30 ring-1 ring-amber-400/40' 
                    : 'border-purple-900/40 bg-slate-900/60'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 uppercase font-mono">🎨 Mutable</span>
                    {selectedSign.modality === 'Mutable' && <span className="text-[10px] text-amber-300 font-bold">✨ Your Modality</span>}
                  </div>
                  <span className="font-serif text-xs font-bold text-slate-100 block">The Adapters & Chameleons</span>
                  <p className="text-xs text-purple-200/80 leading-relaxed">
                    Gemini, Virgo, Sagittarius, Pisces. Adapt to seasonal transitions, synthesizing lessons and bridging change.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: NASA SKY RADAR */}
        {activeDetailTab === 'radar' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <NasaAstrologyRadar />
          </div>
        )}
      </div>

      {/* 6. LOCKED FUTURE PERIOD MODAL */}
      {showLockedPeriodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-amber-500/40 bg-gradient-to-b from-slate-900 via-purple-950/90 to-slate-950 p-6 sm:p-7 shadow-2xl shadow-purple-950/60 space-y-5">
            <button
              onClick={() => setShowLockedPeriodModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-purple-400 hover:text-slate-100 hover:bg-purple-900/40 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

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
