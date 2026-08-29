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
  Globe2,
  Download,
  Smartphone
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
  onOpenProfile?: () => void;
}

export const DailyDashboard: React.FC<DailyDashboardProps> = ({
  userProfile,
  onNavigate,
  onSaveJournal,
  membership,
  onOpenWelcomeModal,
  onOpenProfile,
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
    <div className="mx-auto max-w-xl sm:max-w-2xl px-3 py-4 sm:py-6 space-y-6 animate-in fade-in duration-300 pb-24">

      {/* ── CENTERPIECE HERO TITLE & WELCOME ── */}
      <div className="space-y-4 pt-1">
        <CosmicTitleVideo variant="hero" />

        {/* Personalized Seeker Welcome Bar - Clickable to Open Profile */}
        <div 
          onClick={onOpenProfile}
          className="flex items-center justify-between rounded-3xl border border-purple-800/60 bg-gradient-to-r from-purple-950/80 via-[#0e0a22] to-purple-950/80 p-3.5 sm:p-4 shadow-xl backdrop-blur-md hover:border-amber-400/80 hover:bg-purple-950/90 transition-all cursor-pointer group active:scale-[0.99]"
          title="Tap to view or edit your Cosmic Profile"
        >
          <div className="flex items-center space-x-3.5">
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full border-2 border-amber-400 bg-slate-950 overflow-hidden shadow-[0_0_12px_rgba(251,191,36,0.4)] group-hover:scale-105 transition-transform">
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name || 'User Avatar'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-amber-300">
                  <ZodiacSymbolIcon sign={sunSign.name} size="md" fallbackText={sunSign.symbol} />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-serif text-sm sm:text-base font-bold text-white flex items-center space-x-2">
                <span>Welcome, {userProfile.name || 'Universal Seeker'}</span>
                {membership.isActive && (
                  <span className="text-[10px] bg-amber-500/20 border border-amber-400/40 text-amber-300 px-2 py-0.5 rounded-full font-sans font-semibold">
                    Sanctuary
                  </span>
                )}
              </h3>
              <p className="text-xs text-purple-200/90 font-sans flex items-center space-x-1">
                <span>{sunSign.name} ({sunSign.symbol}) • Life Path #{lifePath}</span>
                <span className="text-amber-300/80 font-bold ml-1 group-hover:translate-x-0.5 transition-transform">Edit Profile →</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── DAILY 3-STEP SACRED ROUTINE HEADER ── */}
      <div className="text-center space-y-1">
        <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-amber-300/90">
          ✦ Your Daily Cosmic Ritual ✦
        </span>
        <h2 className="font-revalia text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200">
          Today's Guidance
        </h2>
      </div>

      {/* ── STEP 1: YOUR DAILY BREADCRUMB (TAROT CARD PULL) ── */}
      <div className="rounded-3xl border border-purple-900/70 bg-[#0b0c16]/95 p-5 sm:p-7 shadow-2xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-purple-950/60 pb-3">
          <div className="flex items-center space-x-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold font-sans">
              1
            </span>
            <span className="text-xs sm:text-sm font-sans font-bold tracking-wider text-amber-200 uppercase">
              Daily Breadcrumb (Tarot)
            </span>
          </div>
          <span className="text-xs font-sans text-purple-300/80 font-medium">
            Resets in {timeToMidnight.hours}h {timeToMidnight.minutes}m
          </span>
        </div>

        {dailyCard ? (
          <div className="rounded-2xl border border-purple-950/80 bg-[#111222] p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="shrink-0">
                <TarotCardVisual
                  card={dailyCard}
                  isReversed={dailyCard.isReversed}
                  size="sm"
                  allowZoom={true}
                />
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-sans text-base sm:text-lg font-bold text-white">
                      {dailyCard.name} {dailyCard.isReversed ? '(Reversed)' : '(Upright)'}
                    </h4>
                    <p className="text-xs text-purple-200">
                      {dailyCard.arcana} Arcana • Element: {dailyCard.element}
                    </p>
                  </div>
                  <span className="text-[11px] text-amber-300/80 font-sans font-semibold">
                    ✓ Today's Card
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-sans font-normal">
                  {dailyCard.isReversed ? dailyCard.reversedMeaning : dailyCard.uprightMeaning}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-[#0b0c16] p-3 border border-purple-950 text-xs sm:text-sm text-amber-100 italic font-medium">
              ✨ Affirmation: "{dailyCard.affirmation}"
            </div>

            {/* Clear Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-purple-950/60">
              <button
                type="button"
                onClick={handleSaveToJournal}
                className="w-full sm:w-auto flex items-center justify-center space-x-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 border border-purple-500/80 px-4 py-2 text-xs sm:text-sm text-white font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <BookOpen className="h-4 w-4 text-amber-300" />
                <span>{isSavedToday ? '✓ Saved to Journal!' : 'Save Card to Journal'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('tarot')}
                className="w-full sm:w-auto flex items-center justify-center space-x-1.5 rounded-xl bg-[#14162a] hover:bg-purple-950 border border-amber-400/80 px-4 py-2 text-xs sm:text-sm text-amber-200 font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span>Full Tarot Temple</span>
                <ArrowRight className="h-4 w-4 text-amber-300" />
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-purple-800/60 p-6 sm:p-8 text-center space-y-3 bg-[#0d0f1e]/40">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14162a] border border-purple-800 text-purple-300 shadow-lg">
              <Moon className="h-7 w-7 text-amber-300" />
            </div>
            <div className="space-y-1">
              <h4 className="font-sans text-base sm:text-lg font-bold text-white">
                Draw Your Daily Card
              </h4>
              <p className="text-xs text-slate-200 max-w-sm mx-auto">
                Draw 1 sacred archetype card each day to ground your intuition.
              </p>
            </div>
            <button
              type="button"
              onClick={handlePullDailyCard}
              disabled={isFlipping}
              className="rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 border-2 border-amber-400 px-8 py-3.5 font-sans text-xs sm:text-sm font-bold tracking-wider text-amber-200 uppercase shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isFlipping ? 'Shuffling the Stars...' : '✨ TAP TO PULL DAILY CARD ✨'}
            </button>
          </div>
        )}
      </div>

      {/* ── STEP 2: TODAY'S ZODIAC & COSMIC ENERGY ── */}
      <div className="rounded-3xl border border-purple-900/70 bg-[#0b0c16]/95 p-5 sm:p-7 shadow-2xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-purple-950/60 pb-3">
          <div className="flex items-center space-x-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold font-sans">
              2
            </span>
            <span className="text-xs sm:text-sm font-sans font-bold tracking-wider text-amber-200 uppercase">
              Today's Cosmic Energy
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-purple-300">
            <Moon className="h-3.5 w-3.5 text-fuchsia-400" />
            <span>{moonInfo.phaseName}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-revalia text-lg sm:text-xl text-white">
            {sunSign.name} Cosmic Alignment
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            The stars align to bring clarity to your path today. Trust your inner vision, maintain balance, and embrace subtle opportunities unfolding in your surroundings.
          </p>

          {/* Alignment Badges (Clickable Sun Sign) */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('horoscope')}
              className="inline-flex items-center space-x-1.5 rounded-full border border-purple-600/80 bg-[#14162a] hover:border-amber-400 hover:bg-purple-900/60 px-3.5 py-1 text-xs text-amber-200 font-medium transition-all cursor-pointer active:scale-95"
              title="Click to view Zodiac Horoscope"
            >
              <ZodiacSymbolIcon sign={sunSign.name} size="sm" fallbackText={sunSign.symbol} />
              <span>Sun in {sunSign.name} →</span>
            </button>

            <div className="inline-flex items-center space-x-1.5 rounded-full bg-[#0e0f1e] px-3 py-1 text-xs text-purple-300 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Resonance: 94%</span>
            </div>
          </div>
        </div>

        {/* Clear Action Button */}
        <div className="pt-2 border-t border-purple-950/60">
          <button
            type="button"
            onClick={() => onNavigate('horoscope')}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-950 via-[#14162a] to-purple-950 border border-purple-600 hover:border-amber-400 px-5 py-3 text-xs sm:text-sm font-sans font-bold tracking-wide uppercase text-white hover:text-amber-200 shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.99]"
          >
            <span>♈ Open Full {sunSign.name} Horoscope</span>
            <ArrowRight className="h-4 w-4 text-amber-300" />
          </button>
        </div>
      </div>

      {/* ── STEP 3: DAILY ARCHANGEL & SACRED AFFIRMATION ── */}
      <div className="rounded-3xl border border-purple-900/70 bg-[#0b0c16]/95 p-5 sm:p-7 shadow-2xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-purple-950/60 pb-3">
          <div className="flex items-center space-x-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold font-sans">
              3
            </span>
            <span className="text-xs sm:text-sm font-sans font-bold tracking-wider text-amber-200 uppercase">
              Archangel & Affirmation
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('angel-oracle')}
            className="text-xs font-sans text-amber-300 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>Archangel {dailyArchangel.archangel} →</span>
          </button>
        </div>

        <div className="space-y-3 text-center sm:text-left">
          <div className="text-xs font-sans uppercase tracking-widest text-amber-300 font-bold">
            ✦ {dailyAffirmation.theme} Vibration ✦
          </div>

          <blockquote className="font-serif text-lg sm:text-xl font-bold text-white leading-relaxed italic">
            "{dailyAffirmation.text}"
          </blockquote>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
            {dailyAffirmation.focusKeywords.map((kw, i) => (
              <span
                key={i}
                className="rounded-full bg-[#120f26] px-2.5 py-0.5 text-[11px] font-semibold text-purple-200/90"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>

        {/* Clear Action Buttons */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-purple-950/60">
          <button
            type="button"
            onClick={handleSaveAffirmation}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-purple-900 hover:bg-purple-800 border border-purple-500/90 px-5 py-2.5 font-sans text-xs sm:text-sm font-bold tracking-wide uppercase text-white shadow-md active:scale-95 transition-all cursor-pointer"
          >
            {isAffirmationSaved ? (
              <>
                <Check className="h-4 w-4 text-emerald-300" />
                <span>Saved to Journal!</span>
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4 text-amber-300" />
                <span>Save Affirmation</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('angel-oracle')}
            className="w-full sm:w-auto flex items-center justify-center space-x-1.5 rounded-xl bg-[#14162a] hover:bg-purple-950 border border-purple-700/80 px-4 py-2.5 text-xs sm:text-sm text-amber-200 font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span>🕊️ Archangel Temple</span>
            <ArrowRight className="h-4 w-4 text-amber-300" />
          </button>
        </div>

        {affirmationSaveToast && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/60 p-2.5 text-xs font-semibold text-emerald-200 text-center animate-in fade-in">
            {affirmationSaveToast}
          </div>
        )}
      </div>

      {/* ── COLLAPSIBLE: LIVE PLANETARY MAP & SKY RADAR ── */}
      <div className="rounded-3xl border border-purple-950/80 bg-[#080912] p-4 sm:p-5 shadow-lg space-y-3">
        <button
          type="button"
          onClick={() => setShowNasaRadar(!showNasaRadar)}
          className="w-full flex items-center justify-between text-left cursor-pointer group p-1"
        >
          <div className="flex items-center space-x-2.5">
            <Radio className={`h-4 w-4 text-purple-400 ${showNasaRadar ? 'animate-pulse text-amber-300' : ''}`} />
            <div>
              <h4 className="text-xs sm:text-sm font-sans font-bold text-purple-200 group-hover:text-white uppercase tracking-wider">
                Live Planetary Map (Powered by NASA)
              </h4>
              <p className="text-[11px] text-purple-400/80">
                See exactly where the Sun, Moon, and planets are located in the sky right now
              </p>
            </div>
          </div>
          <span className="text-xs rounded-lg px-2.5 py-1 bg-purple-950/80 border border-purple-800 text-amber-300 font-bold group-hover:border-amber-400 transition-colors">
            {showNasaRadar ? '▲ Hide Sky Map' : '▼ View Sky Map'}
          </span>
        </button>

        {showNasaRadar && (
          <div className="pt-3 border-t border-purple-950/60 animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="rounded-2xl border border-purple-900/50 bg-[#111222] px-4 py-3 text-xs sm:text-sm text-purple-100">
              <strong className="text-amber-200 font-bold">✨ Real NASA Astronomy Data:</strong> Cosmic Breadcrumbs tracks the live positions of the planets and space weather in real-time, grounding your daily readings in true celestial science.
            </div>
            <NasaAstrologyRadar />
          </div>
        )}
      </div>

      {/* ── THE SANCTUARY CLUB & EMBLEM ── */}
      <div className="rounded-3xl border border-purple-950/80 bg-[#0b0c16] p-5 sm:p-6 shadow-2xl space-y-3">
        <div className="flex items-start space-x-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#14162a] border border-purple-800/70 text-amber-300">
            <Crown className="h-6 w-6" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-sans text-sm sm:text-base font-bold text-white uppercase tracking-wide">
                The Sanctuary Club
              </span>
              <span className="rounded-full bg-purple-900/80 border border-purple-500/80 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                Free 3 Days
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unlock Archangel Video Meditations, Synastry Compatibility, PIN-Locked Private Diary, and AI Celestial Oracle.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-purple-950/60">
          <span className="text-xs text-purple-200 font-medium">
            $3/week • $11/month • $33 Lifetime
          </span>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {!membership.isActive ? (
              <button
                type="button"
                onClick={() => onOpenWelcomeModal(undefined, 'letter')}
                className="flex-1 sm:flex-initial rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 border border-amber-300 px-5 py-2 text-xs font-sans font-bold tracking-wide uppercase text-black shadow-md hover:scale-102 transition-all cursor-pointer"
              >
                Join (Free 3-Day Trial)
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
                <Check className="h-4 w-4" />
                <span>Sanctuary Active</span>
              </span>
            )}

            <button
              type="button"
              onClick={() => onOpenWelcomeModal(undefined, 'plans')}
              className="rounded-2xl border border-purple-800/90 bg-[#120f26] px-4 py-2 text-xs font-sans font-bold tracking-wide uppercase text-white hover:border-purple-400 transition-all cursor-pointer"
            >
              Plans
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DailyDashboard;
