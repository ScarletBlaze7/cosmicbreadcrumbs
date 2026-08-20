import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Moon, 
  Compass, 
  Hash, 
  Feather, 
  ArrowRight, 
  Heart, 
  RotateCw, 
  Share2, 
  CheckCircle2,
  Lock,
  CloudMoon,
  Gift,
  Crown,
  Sun,
  Shield,
  BookOpen,
  Calendar,
  Check,
  Radio,
  Activity,
  AlertCircle,
  Globe2
} from 'lucide-react';
import { UserProfile, CosmicView, TarotCard, DrawnCard, MembershipStatus } from '../types';
import { getSunSignFromDate, getMoonPhaseInfo, getDailyPlanetaryTransits } from '../utils/astrologyCalc';
import { calculateLifePath, calculatePersonalYear, calculateDestinyNumber } from '../utils/numerologyCalc';
import { ALL_TAROT_CARDS } from '../data/tarotData';
import { getDailyArchangelCard } from '../data/angelData';
import { getDailyCosmicAffirmation } from '../data/affirmationsData';
import { saveAffirmationToLogAndJournal } from '../utils/affirmationJournalHelper';
import { CosmicLogo } from './CosmicLogo';
import { CosmicTitleVideo } from './CosmicTitleVideo';
import { NasaAstrologyRadar } from './NasaAstrologyRadar';
import { ZodiacSymbolIcon } from './ZodiacSymbolIcon';
import { TarotCardVisual } from './TarotCardVisual';
import { SanctuaryEmblem } from './SanctuaryEmblem';
import { getTrialTimeRemaining, isFeatureUnlocked } from '../utils/membership';
import { getStoredDailyTarot, saveDailyPrimaryCard, getTimeUntilMidnight } from '../utils/dailyTarotStorage';

interface DailyDashboardProps {
  userProfile: UserProfile;
  onNavigate: (view: CosmicView) => void;
  onSaveJournal: (title: string, type: 'tarot' | 'horoscope' | 'angel' | 'numerology' | 'affirmation', content: string) => void;
  membership: MembershipStatus;
  onOpenWelcomeModal: (featureName?: string, tab?: 'letter' | 'plans' | 'guide') => void;
}

export const DailyDashboard: React.FC<DailyDashboardProps> = ({
  userProfile,
  onNavigate,
  onSaveJournal,
  membership,
  onOpenWelcomeModal,
}) => {
  const sunSign = getSunSignFromDate(userProfile.birthDate);
  const moonInfo = getMoonPhaseInfo();
  const transits = getDailyPlanetaryTransits();
  const lifePath = calculateLifePath(userProfile.birthDate);
  const personalYear = calculatePersonalYear(userProfile.birthDate);
  const trialTime = getTrialTimeRemaining(membership.trialExpiryDate);

  // Daily Quick Tarot Pull State (1 card per day with midnight reset)
  const [dailyRecord, setDailyRecord] = useState(() => getStoredDailyTarot());
  const dailyCard = dailyRecord?.primaryCard || null;
  const [timeToMidnight, setTimeToMidnight] = useState(() => getTimeUntilMidnight());
  const [isFlipping, setIsFlipping] = useState(false);
  const [isSavedToday, setIsSavedToday] = useState(false);

  // Daily Affirmation State
  const dailyAffirmation = getDailyCosmicAffirmation(sunSign.name, lifePath);
  const [isAffirmationSaved, setIsAffirmationSaved] = useState(false);
  const [affirmationSaveToast, setAffirmationSaveToast] = useState<string | null>(null);

  // NASA Planetary Radar Live View State
  const [showNasaRadar, setShowNasaRadar] = useState(false);

  // Sync daily tarot updates from anywhere in the app & countdown timer
  useEffect(() => {
    const handleUpdate = () => {
      setDailyRecord(getStoredDailyTarot());
    };
    window.addEventListener('daily-tarot-updated', handleUpdate);

    const timer = setInterval(() => {
      const remaining = getTimeUntilMidnight();
      setTimeToMidnight(remaining);
      if (remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds <= 1) {
        setDailyRecord(getStoredDailyTarot());
      }
    }, 1000);

    return () => {
      window.removeEventListener('daily-tarot-updated', handleUpdate);
      clearInterval(timer);
    };
  }, []);

  const dailyArchangel = getDailyArchangelCard();

  const handlePullDailyCard = () => {
    if (isFlipping || dailyCard) return;
    setIsFlipping(true);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * ALL_TAROT_CARDS.length);
      const picked = ALL_TAROT_CARDS[randomIndex];
      const isReversed = Math.random() > 0.75;

      const drawn: DrawnCard = {
        ...picked,
        isReversed,
        positionName: 'Daily Cosmic Breadcrumb',
        positionDescription: 'Universal guidance aligned with your celestial vibration today.',
      };

      const updatedRecord = saveDailyPrimaryCard(drawn);
      setDailyRecord(updatedRecord);
      setIsFlipping(false);
    }, 700);
  };

  const handleSaveAffirmation = () => {
    const res = saveAffirmationToLogAndJournal({
      affirmationText: dailyAffirmation.text,
      sourceTitle: `${sunSign.name} • Life Path #${lifePath} Vibration`,
      theme: dailyAffirmation.theme,
      onSaveJournal,
    });

    if (res.success) {
      setIsAffirmationSaved(true);
      setAffirmationSaveToast('✨ Sacred Affirmation saved to your Log & Journal!');
      setTimeout(() => {
        setIsAffirmationSaved(false);
        setAffirmationSaveToast(null);
      }, 3000);
    }
  };

  const handleSaveToJournal = () => {
    if (!dailyCard) return;
    const content = `☀️ Sun Sign: ${sunSign.name} (${sunSign.symbol})\n🌙 Moon Phase: ${moonInfo.phaseName} (${moonInfo.illumination}%)\n🔢 Life Path: ${lifePath} | Personal Year: ${personalYear}\n🕊️ Archangel: ${dailyArchangel.archangel} (${dailyArchangel.title})\n🃏 Daily Tarot: ${dailyCard.name} (${dailyCard.isReversed ? 'Reversed' : 'Upright'})\nMessage: ${dailyCard.isReversed ? dailyCard.reversedMeaning : dailyCard.uprightMeaning}\nAffirmation: "${dailyCard.affirmation}"`;

    onSaveJournal(`Daily Cosmic Reading - ${new Date().toLocaleDateString()}`, 'tarot', content);
    setIsSavedToday(true);
    setTimeout(() => setIsSavedToday(false), 2500);
  };

  return (
    <div className="mx-auto max-w-xl sm:max-w-2xl px-3 py-4 sm:py-6 space-y-5 animate-in fade-in duration-300 pb-20">

      {/* CENTERPIECE MAIN TITLE: EXACT ANIMATED COSMIC BREADCRUMBS VIDEO TITLE */}
      <div className="space-y-3 pt-1">
        <CosmicTitleVideo variant="hero" />
      </div>

      {/* CARD 1: TODAY'S FORECAST */}
      <div className="rounded-3xl border border-purple-950/80 bg-[#0b0c16] p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-4 text-center">
        {/* Header Eyebrows & NASA Telemetry Badge */}
        <div className="flex items-center justify-between border-b border-purple-950/60 pb-3">
          <div className="text-xs sm:text-sm font-sans font-bold tracking-wider text-fuchsia-300 uppercase">
            TODAY'S FORECAST
          </div>
          <div className="flex items-center space-x-2 text-xs font-sans text-purple-200 uppercase tracking-wide font-medium">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-fuchsia-500"></span>
            </span>
            <span>NASA LIVE EPHEMERIS</span>
          </div>
        </div>

        <h2 className="font-revalia font-bold text-2xl sm:text-3xl md:text-4xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200 drop-shadow-md py-1">
          Cosmic Alignment Active
        </h2>

        <p className="text-base sm:text-lg text-slate-100 leading-relaxed max-w-xl mx-auto font-sans font-normal">
          The stars align to bring clarity to your path. Trust your inner vision and embrace upcoming opportunities today.
        </p>

        {/* Real-time Astronomical Data Provenance Note */}
        <div className="rounded-2xl border border-purple-900/50 bg-[#111222] px-4 py-3 text-left flex items-start space-x-3 text-sm text-purple-100">
          <Globe2 className="h-5 w-5 text-fuchsia-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong className="text-amber-200 font-bold">Real-Time NASA Ephemeris:</strong> Daily horoscopes of Cosmic Breadcrumbs are calculated live using NASA planetary coordinates, NOAA space weather, and Swiss Ephemeris celestial mechanics.
          </span>
        </div>

        {/* Alignment Matrix Pills */}
        <div className="pt-1 flex flex-wrap items-center justify-center gap-2.5">
          <div className="inline-flex items-center space-x-2 rounded-full border border-purple-900/70 bg-[#121426] px-4 py-1.5 text-xs sm:text-sm text-slate-100 font-medium">
            <ZodiacSymbolIcon sign={sunSign.name} size="sm" fallbackText={sunSign.symbol} />
            <span>Sun in {sunSign.name}</span>
          </div>

          <div className="inline-flex items-center space-x-2 rounded-full border border-purple-900/70 bg-[#121426] px-4 py-1.5 text-xs sm:text-sm text-slate-100 font-medium">
            <Moon className="h-4 w-4 text-fuchsia-400" />
            <span>{moonInfo.phaseName} ({moonInfo.illumination}%)</span>
          </div>

          <div className="inline-flex items-center space-x-2 rounded-full border border-purple-900/70 bg-[#121426] px-4 py-1.5 text-xs sm:text-sm text-fuchsia-300 font-bold">
            <Sparkles className="h-4 w-4 text-fuchsia-400" />
            <span>Resonance 94%</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('horoscope')}
            className="w-full sm:w-auto rounded-2xl border border-slate-600 bg-[#121426] px-6 py-3 text-xs sm:text-sm font-sans font-bold tracking-wide uppercase text-white hover:border-fuchsia-400 hover:bg-[#181a30] transition-all"
          >
            Read Full Horoscope →
          </button>

          <button
            onClick={() => setShowNasaRadar(!showNasaRadar)}
            className="w-full sm:w-auto rounded-2xl border border-purple-800 bg-[#120f26] px-6 py-3 text-xs sm:text-sm font-sans font-bold tracking-wide uppercase text-purple-100 hover:border-purple-400 hover:text-white transition-all flex items-center justify-center space-x-2"
          >
            <Radio className="h-4 w-4 text-purple-300 animate-pulse" />
            <span>{showNasaRadar ? 'Hide NASA Telemetry' : 'NASA Planetary Radar (Live)'}</span>
          </button>
        </div>

        {/* Real-time NASA Telemetry Radar Expansion */}
        {showNasaRadar && (
          <div className="mt-4 pt-3 border-t border-purple-950/60 text-left animate-in fade-in zoom-in-95 duration-200">
            <NasaAstrologyRadar />
          </div>
        )}
      </div>

      {/* CARD 2: TODAY'S SACRED AFFIRMATION (LOG & JOURNAL INTEGRATED) */}
      <div className="rounded-3xl border border-purple-950/80 bg-[#0b0c16] p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-4 text-center">
        <div className="flex items-center justify-between border-b border-purple-950/60 pb-3">
          <div className="text-xs sm:text-sm font-sans font-bold tracking-wider text-purple-200 uppercase">
            DAILY SACRED AFFIRMATION
          </div>

          <span className="text-xs font-sans text-purple-200 font-medium">
            {sunSign.name} • Life Path #{lifePath}
          </span>
        </div>

        <div className="space-y-3 py-1">
          <div className="text-xs sm:text-sm font-sans uppercase tracking-widest text-amber-200 font-bold">
            {dailyAffirmation.theme} Vibration
          </div>

          <blockquote className="font-sans text-xl sm:text-2xl font-bold text-white leading-relaxed px-2 sm:px-4">
            "{dailyAffirmation.text}"
          </blockquote>

          {/* Focus Keywords */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            {dailyAffirmation.focusKeywords.map((kw, i) => (
              <span
                key={i}
                className="rounded-full bg-[#120f26] border border-purple-800/80 px-3 py-1 text-xs font-semibold text-purple-100"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>

        {/* Action Controls for Affirmation */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 border-t border-purple-950/60">
          <button
            type="button"
            onClick={handleSaveAffirmation}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-2xl bg-purple-900 border border-purple-500/90 px-6 py-3 font-sans text-xs sm:text-sm font-bold tracking-wide uppercase text-white shadow-lg shadow-purple-950/60 hover:bg-purple-800 active:scale-[0.99] transition-all"
          >
            {isAffirmationSaved ? (
              <>
                <Check className="h-4 w-4 text-white" />
                <span>Saved to Journal & Log!</span>
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4" />
                <span>Save Affirmation to Log</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('diary')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-2xl border border-purple-800/90 bg-[#120f26] px-5 py-3 text-xs sm:text-sm font-sans font-bold tracking-wide uppercase text-white hover:border-purple-400 hover:bg-purple-950 transition-all"
          >
            <span>Write Thoughts on This</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {affirmationSaveToast && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/60 p-2.5 text-xs sm:text-sm font-semibold text-emerald-200 animate-in fade-in">
            {affirmationSaveToast}
          </div>
        )}
      </div>

      {/* CARD 3: FREE 3-DAY TRIAL & SANCTUARY CLUB MEMBERSHIP BANNER */}
      <div className="rounded-3xl border border-purple-950/80 bg-[#0b0c16] p-6 sm:p-7 shadow-2xl space-y-4">
        <div className="flex items-start space-x-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#14162a] border border-purple-800/70 text-purple-200">
            <Crown className="h-6 w-6" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5">
              <span className="font-sans text-sm sm:text-base font-bold text-white uppercase tracking-wide">
                The Sanctuary Club Access & Membership
              </span>
              <span className="rounded-full bg-purple-900/80 border border-purple-500/80 px-2.5 py-0.5 text-xs font-bold text-white uppercase">
                Free 3 Days
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              You <strong className="text-amber-200 font-bold">must have the free trial activated or a Sanctuary Club membership</strong> to access all features. The free app gives access to your <strong className="text-white">daily horoscope</strong>, <strong className="text-white">daily tarot card pull</strong>, and <strong className="text-white">Life Path number calculation</strong>.
            </p>
          </div>
        </div>

        {/* Free Seeker Missing Features Teaser Banner */}
        {!membership.isActive && (
          <div className="rounded-2xl border border-purple-950/80 bg-[#0e1020] p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs sm:text-sm text-purple-200 font-bold">
              <span className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-purple-300" />
                <span>What You're Missing on the Free Tier:</span>
              </span>
              <span className="text-xs text-amber-300 font-semibold">$0 to Unlock All for 3 Days</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center space-x-2 bg-[#14162a] rounded-xl p-2 border border-purple-950/70">
                <span className="text-purple-300 font-bold">🔒</span>
                <span className="truncate">Chaldean Destiny Matrix</span>
              </div>
              <div className="flex items-center space-x-2 bg-[#14162a] rounded-xl p-2 border border-purple-950/70">
                <span className="text-purple-300 font-bold">🔒</span>
                <span className="truncate">Loved Ones Synastry</span>
              </div>
              <div className="flex items-center space-x-2 bg-[#14162a] rounded-xl p-2 border border-purple-950/70">
                <span className="text-purple-300 font-bold">🔒</span>
                <span className="truncate">Archangel Oracle & Temple</span>
              </div>
              <div className="flex items-center space-x-2 bg-[#14162a] rounded-xl p-2 border border-purple-950/70">
                <span className="text-purple-300 font-bold">🔒</span>
                <span className="truncate">Dream Sanctuary Decoder</span>
              </div>
              <div className="flex items-center space-x-2 bg-[#14162a] rounded-xl p-2 border border-purple-950/70">
                <span className="text-purple-300 font-bold">🔒</span>
                <span className="truncate">PIN-Locked Private Diary</span>
              </div>
              <div className="flex items-center space-x-2 bg-[#14162a] rounded-xl p-2 border border-purple-950/70">
                <span className="text-purple-300 font-bold">🔒</span>
                <span className="truncate">AI Cosmic Oracle Guidance</span>
              </div>
            </div>
          </div>
        )}

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-purple-950/60">
          <div className="text-xs sm:text-sm text-slate-200 font-medium">
            $3/week • $11/month • Or Only $33 for Lifetime Sanctuary Club
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            {!membership.isActive ? (
              <button
                type="button"
                onClick={() => onOpenWelcomeModal(undefined, 'letter')}
                className="flex-1 sm:flex-initial rounded-2xl bg-purple-900 border border-purple-500/80 px-5 py-2.5 text-xs sm:text-sm font-sans font-bold tracking-wide uppercase text-white shadow-md hover:bg-purple-800 transition-all"
              >
                Join Club (Free 3-Day Trial)
              </button>
            ) : (
              <span className="text-xs sm:text-sm font-bold text-emerald-300 flex items-center space-x-1.5">
                <Check className="h-4 w-4" />
                <span>Sanctuary Club Unlocked</span>
              </span>
            )}

            <button
              type="button"
              onClick={() => onOpenWelcomeModal(undefined, 'plans')}
              className="rounded-2xl border border-purple-800/90 bg-[#120f26] px-4 py-2.5 text-xs sm:text-sm font-sans font-bold tracking-wide uppercase text-white hover:border-purple-400 hover:bg-purple-950 transition-all"
            >
              Club Plans
            </button>
          </div>
        </div>
      </div>

      {/* CARD 4: DAILY BREADCRUMBS (1-Card Tarot Pull & Quick Modules) */}
      <div className="rounded-3xl border border-purple-950/80 bg-[#0b0c16] p-6 sm:p-7 shadow-2xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-purple-950/60 pb-3">
          <div className="text-xs sm:text-sm font-sans font-bold tracking-wider text-purple-200 uppercase">
            DAILY TAROT CARD PULL (FREE ALWAYS)
          </div>
          <span className="text-xs font-sans text-purple-300/90 font-medium">
            Resets in {timeToMidnight.hours}h {timeToMidnight.minutes}m
          </span>
        </div>

        {dailyCard ? (
          <div className="rounded-2xl border border-purple-950/80 bg-[#111222] p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="shrink-0">
                <TarotCardVisual
                  card={dailyCard}
                  isReversed={dailyCard.isReversed}
                  size="sm"
                  allowZoom={true}
                />
              </div>

              <div className="flex-1 space-y-2.5 text-center sm:text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-sans text-base sm:text-lg font-bold text-white">
                      {dailyCard.name} {dailyCard.isReversed ? '(Reversed)' : '(Upright)'}
                    </h4>
                    <p className="text-xs sm:text-sm text-purple-200">
                      {dailyCard.arcana} Arcana • Element: {dailyCard.element}
                    </p>
                  </div>
                  <span className="rounded-full bg-purple-900/80 border border-purple-500/80 px-2.5 py-1 text-xs text-white font-bold">
                    Today's Guide
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-sans font-normal">
                  {dailyCard.isReversed ? dailyCard.reversedMeaning : dailyCard.uprightMeaning}
                </p>
              </div>
            </div>

            {(dailyCard.pictorialKeyUpright || dailyCard.pictorialKeyReversed) && (
              <div className="rounded-xl border border-purple-900/50 bg-[#0b0c16] p-3 text-xs sm:text-sm text-slate-200 space-y-1">
                <span className="font-bold text-amber-200 text-xs uppercase tracking-wider block">
                  Pictorial Key (1911) Divinatory Insight:
                </span>
                <p className="italic text-slate-200 leading-relaxed">
                  "{dailyCard.isReversed && dailyCard.pictorialKeyReversed ? dailyCard.pictorialKeyReversed : dailyCard.pictorialKeyUpright}"
                </p>
              </div>
            )}

            <div className="rounded-xl bg-[#0b0c16] p-3 border border-purple-950 text-xs sm:text-sm text-amber-100 italic font-medium">
              ✨ Affirmation: "{dailyCard.affirmation}"
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleSaveToJournal}
                className="text-xs sm:text-sm text-purple-200 hover:text-white flex items-center space-x-1.5 font-semibold transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span>{isSavedToday ? 'Saved to Journal!' : 'Save Reading to Journal'}</span>
              </button>

              <button
                onClick={() => onNavigate('tarot')}
                className="text-xs sm:text-sm text-purple-200 hover:text-white underline font-semibold transition-colors"
              >
                Open Tarot Temple →
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-purple-900/60 p-6 sm:p-8 text-center space-y-3 bg-[#0d0f1e]/40">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#14162a] border border-purple-800 text-purple-300 shadow-lg">
              <Moon className="h-8 w-8" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-sans text-base sm:text-lg font-bold text-white uppercase tracking-wide">
                Your Daily Tarot Card Awaits
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 max-w-sm mx-auto">
                Draw 1 sacred Rider-Waite archetype card per day to ground your morning intuition.
              </p>
            </div>
            <button
              onClick={handlePullDailyCard}
              disabled={isFlipping}
              className="rounded-2xl bg-purple-900 border border-purple-500/90 px-7 py-3 font-sans text-xs sm:text-sm font-bold tracking-wider text-white uppercase shadow-lg hover:bg-purple-800 active:scale-95 transition-all"
            >
              {isFlipping ? 'Shuffling the Deck...' : 'PULL DAILY TAROT CARD'}
            </button>
          </div>
        )}

        {/* Card Meaning Directory Quick Lookup Bar */}
        <div className="pt-3 border-t border-purple-950/60 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-purple-200">
            <BookOpen className="h-4 w-4 text-amber-400" />
            <span>Curious about other cards?</span>
          </div>
          <button
            onClick={() => onNavigate('tarot')}
            className="flex items-center space-x-1 text-xs sm:text-sm font-bold text-amber-300 hover:text-amber-200 hover:underline transition-colors"
          >
            <span>Look up any Tarot card & meaning →</span>
          </button>
        </div>
      </div>

      {/* CARD 5: THE SANCTUARY EMBLEM & CLUB STATUS */}
      <div className="rounded-3xl border border-purple-950/80 bg-[#0b0c16] p-6 sm:p-7 shadow-2xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-purple-950/60 pb-3">
          <div className="text-xs sm:text-sm font-sans font-bold tracking-wider text-purple-200 uppercase flex items-center space-x-2">
            <Crown className="h-4 w-4 text-amber-400" />
            <span>THE SANCTUARY EMBLEM</span>
          </div>

          {(membership.tier === 'weekly' || membership.tier === 'monthly' || membership.tier === 'lifetime') ? (
            <span className="text-xs font-sans font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/60 rounded-full px-3 py-1">
              MEMBER SEAL ACTIVE
            </span>
          ) : (
            <span className="text-xs font-sans font-bold text-slate-300 bg-slate-900 border border-slate-700 rounded-full px-3 py-1">
              PAID CLUB EXCLUSIVE
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 py-1">
          <div className="shrink-0">
            <SanctuaryEmblem
              size="lg"
              tier={membership.tier}
              isUnlocked={membership.tier === 'weekly' || membership.tier === 'monthly' || membership.tier === 'lifetime'}
              interactive={true}
              onUpgradeClick={() => onOpenWelcomeModal(undefined, 'plans')}
            />
          </div>

          <div className="text-center sm:text-left space-y-2 flex-1">
            <h4 className="font-sans font-bold text-base sm:text-lg text-white">
              {(membership.tier === 'weekly' || membership.tier === 'monthly' || membership.tier === 'lifetime')
                ? 'Sacred Celestial Member Emblem Unlocked'
                : 'The Sanctuary Club Sacred Insignia'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              {(membership.tier === 'weekly' || membership.tier === 'monthly' || membership.tier === 'lifetime')
                ? 'Your account is sanctified with the sacred emblem of wisdom, intuition, and cosmic harmony. Click to view high-resolution insignia or upload your exact photo.'
                : 'This sacred seal is awarded exclusively to seekers who join The Sanctuary Club on a paid membership ($3/wk, $11/mo, $33 Lifetime). Not included on free accounts or the 3-day trial.'}
            </p>

            {(membership.tier === 'weekly' || membership.tier === 'monthly' || membership.tier === 'lifetime') ? (
              <div className="pt-1 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const emblemElement = document.querySelector('.group .cursor-pointer') as HTMLElement;
                    emblemElement?.click();
                  }}
                  className="rounded-2xl border border-purple-500/80 bg-purple-900/80 hover:bg-purple-800 px-4 py-2 text-xs sm:text-sm font-sans font-bold uppercase tracking-wider text-purple-100 transition-all"
                >
                  View / Upload Photo →
                </button>
              </div>
            ) : (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onOpenWelcomeModal(undefined, 'plans')}
                  className="rounded-2xl border border-amber-500/60 bg-amber-500/15 hover:bg-amber-500/25 px-5 py-2.5 text-xs sm:text-sm font-sans font-bold uppercase tracking-wider text-amber-200 transition-all"
                >
                  Join Sanctuary Club to Unlock Emblem ($3, $11, $33) →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
