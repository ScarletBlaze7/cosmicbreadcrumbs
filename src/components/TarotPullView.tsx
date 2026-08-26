import React, { useState, useEffect } from 'react';
import { 
  Moon, 
  Sparkles, 
  RotateCw, 
  Shuffle, 
  Share2, 
  CheckCircle2, 
  HelpCircle, 
  Flame, 
  Compass,
  ArrowRight,
  RefreshCw,
  Eye,
  Lock,
  Heart,
  Coins,
  Leaf,
  Users,
  User,
  Layers,
  Crown,
  BookOpen,
  X,
  ChevronRight,
  Shield,
  Zap,
  Clock
} from 'lucide-react';
import { UserProfile, TarotSpread, DrawnCard, TarotCard, MembershipStatus } from '../types';
import { TAROT_SPREADS, ALL_TAROT_CARDS, OTHER_PEOPLE_SPREADS } from '../data/tarotData';
import { getCardDomainGuidance, getDualCardSynthesis } from '../utils/tarotDomainHelpers';
import { TarotCardVisual } from './TarotCardVisual';
import { CosmicTarotCardBack } from './CosmicTarotCardBack';
import { TarotCardLookupSection } from './TarotCardLookupSection';
import { 
  getStoredDailyTarot, 
  saveDailyPrimaryCard, 
  saveDailyClarificationCard, 
  getTimeUntilMidnight 
} from '../utils/dailyTarotStorage';

interface TarotPullViewProps {
  userProfile: UserProfile;
  onSaveJournal: (title: string, type: 'tarot' | 'horoscope' | 'angel' | 'numerology', content: string) => void;
  membership?: MembershipStatus;
  onOpenWelcomeModal?: () => void;
}

type TarotTabMode = 'daily' | 'lookup' | 'others' | 'domains' | 'spreads';

export const TarotPullView: React.FC<TarotPullViewProps> = ({
  userProfile,
  onSaveJournal,
  membership,
  onOpenWelcomeModal,
}) => {
  const isMember = Boolean(membership?.isActive);
  const [activeTab, setActiveTab] = useState<TarotTabMode>('daily');

  // --- MODE 1: DAILY TAROT & CLARIFICATION CARD (1 of each per calendar day, resets at midnight) ---
  const [dailyRecord, setDailyRecord] = useState(() => getStoredDailyTarot());
  const dailyPrimaryCard = dailyRecord?.primaryCard || null;
  const dailyClarificationCard = dailyRecord?.clarificationCard || null;
  const [timeToMidnight, setTimeToMidnight] = useState(() => getTimeUntilMidnight());
  const [dailyQuestion, setDailyQuestion] = useState('');
  const [isDrawingDaily, setIsDrawingDaily] = useState(false);
  const [isDrawingClarification, setIsDrawingClarification] = useState(false);

  // Sync daily tarot updates and countdown timer matching user's local clock
  useEffect(() => {
    const handleUpdate = () => {
      setDailyRecord(getStoredDailyTarot());
    };
    window.addEventListener('daily-tarot-updated', handleUpdate);

    const timer = setInterval(() => {
      const remaining = getTimeUntilMidnight();
      setTimeToMidnight(remaining);
      // Automatically reset if midnight was crossed
      if (remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds <= 1) {
        setDailyRecord(getStoredDailyTarot());
      }
    }, 1000);

    return () => {
      window.removeEventListener('daily-tarot-updated', handleUpdate);
      clearInterval(timer);
    };
  }, []);

  // --- MODE 2: READING FOR OTHERS (MEMBERS ONLY) ---
  const [otherPersonName, setOtherPersonName] = useState('');
  const [otherRelationship, setOtherRelationship] = useState('Romantic Partner');
  const [otherQuestion, setOtherQuestion] = useState('');
  const [otherSelectedSpread, setOtherSelectedSpread] = useState<TarotSpread>(OTHER_PEOPLE_SPREADS[0] || TAROT_SPREADS[0]);
  const [otherDrawnCards, setOtherDrawnCards] = useState<DrawnCard[]>([]);
  const [isDrawingOther, setIsDrawingOther] = useState(false);

  // --- MODE 3: DAILY DOMAIN TRINITY (LOVE, FINANCE, HEALTH) ---
  const [loveCard, setLoveCard] = useState<DrawnCard | null>(null);
  const [financeCard, setFinanceCard] = useState<DrawnCard | null>(null);
  const [healthCard, setHealthCard] = useState<DrawnCard | null>(null);
  const [isDrawingTrinity, setIsDrawingTrinity] = useState(false);

  // --- MODE 4: CLASSIC SPREADS ---
  const [classicSpread, setClassicSpread] = useState<TarotSpread>(TAROT_SPREADS[0]);
  const [classicQuestion, setClassicQuestion] = useState('');
  const [classicDrawnCards, setClassicDrawnCards] = useState<DrawnCard[]>([]);
  const [isDrawingClassic, setIsDrawingClassic] = useState(false);

  // Shared Card Detail Modal & AI Interpretation
  const [activeCardModal, setActiveCardModal] = useState<DrawnCard | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiInterpretation, setAiInterpretation] = useState<any | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Random card picker from Rider-Waite deck
  const pickRandomCard = (excludeIds: string[] = []): { card: TarotCard; isReversed: boolean } => {
    const available = ALL_TAROT_CARDS.filter((c) => !excludeIds.includes(c.id));
    const card = available[Math.floor(Math.random() * available.length)] || ALL_TAROT_CARDS[0];
    const isReversed = Math.random() > 0.72;
    return { card, isReversed };
  };

  // --- DAILY PRIMARY CARD DRAW (STRICTLY ONCE PER DAY) ---
  const handleDrawDailyPrimary = () => {
    if (isDrawingDaily || dailyPrimaryCard) return;
    setIsDrawingDaily(true);
    setAiInterpretation(null);

    setTimeout(() => {
      const { card, isReversed } = pickRandomCard();
      const drawn: DrawnCard = {
        ...card,
        isReversed,
        positionName: "Today's Primary Alignment",
        positionDescription: 'The core spiritual lesson and cosmic energy guiding your day.',
        domain: 'general',
      };
      
      const updated = saveDailyPrimaryCard(drawn);
      setDailyRecord(updated);
      setIsDrawingDaily(false);
    }, 700);
  };

  // --- DAILY CLARIFICATION CARD DRAW (STRICTLY ONCE PER DAY) ---
  const handleDrawClarification = () => {
    if (!dailyPrimaryCard || isDrawingClarification || dailyClarificationCard) return;
    setIsDrawingClarification(true);

    setTimeout(() => {
      const { card, isReversed } = pickRandomCard([dailyPrimaryCard.id]);
      const drawn: DrawnCard = {
        ...card,
        isReversed,
        positionName: 'Clarification & Catalyst Card',
        positionDescription: 'Illuminates root motivations, nuances, and actionable resolution.',
        isClarification: true,
        domain: 'general',
      };

      const updated = saveDailyClarificationCard(drawn);
      setDailyRecord(updated);
      setIsDrawingClarification(false);
    }, 700);
  };

  // --- READING FOR OTHERS DRAW ---
  const handleDrawForOtherPerson = () => {
    if (!otherPersonName.trim()) return;
    if (isDrawingOther) return;
    setIsDrawingOther(true);
    setOtherDrawnCards([]);
    setAiInterpretation(null);

    setTimeout(() => {
      const count = otherSelectedSpread.cardCount;
      const drawn: DrawnCard[] = [];
      const usedIds: string[] = [];

      for (let i = 0; i < count; i++) {
        const { card, isReversed } = pickRandomCard(usedIds);
        usedIds.push(card.id);
        const basePos = otherSelectedSpread.positions[i] || {
          name: `Position ${i + 1}`,
          description: `Guidance for ${otherPersonName}`,
        };

        drawn.push({
          ...card,
          isReversed,
          recipientName: otherPersonName.trim(),
          positionName: basePos.name.replace(/Their|They/gi, `${otherPersonName}'s`),
          positionDescription: basePos.description.replace(/their|them|they/gi, otherPersonName.trim()),
        });
      }

      setOtherDrawnCards(drawn);
      setIsDrawingOther(false);
    }, 850);
  };

  // --- DAILY DOMAIN TRINITY DRAW ---
  const handleDrawDomainTrinity = (domainToDraw?: 'love' | 'finance' | 'health') => {
    if (isDrawingTrinity) return;
    setIsDrawingTrinity(true);

    setTimeout(() => {
      const usedIds: string[] = [];
      if (domainToDraw !== 'love' && loveCard) usedIds.push(loveCard.id);
      if (domainToDraw !== 'finance' && financeCard) usedIds.push(financeCard.id);
      if (domainToDraw !== 'health' && healthCard) usedIds.push(healthCard.id);

      if (!domainToDraw || domainToDraw === 'love') {
        const { card, isReversed } = pickRandomCard(usedIds);
        usedIds.push(card.id);
        setLoveCard({
          ...card,
          isReversed,
          domain: 'love',
          positionName: 'Daily Love & Heart Energy',
          positionDescription: 'Romance, emotional connection, and soul alignment.',
        });
      }

      if (!domainToDraw || domainToDraw === 'finance') {
        const { card, isReversed } = pickRandomCard(usedIds);
        usedIds.push(card.id);
        setFinanceCard({
          ...card,
          isReversed,
          domain: 'finance',
          positionName: 'Daily Finance & Abundance Energy',
          positionDescription: 'Career, wealth flow, resource management, and manifestation.',
        });
      }

      if (!domainToDraw || domainToDraw === 'health') {
        const { card, isReversed } = pickRandomCard(usedIds);
        usedIds.push(card.id);
        setHealthCard({
          ...card,
          isReversed,
          domain: 'health',
          positionName: 'Daily Health & Vitality Energy',
          positionDescription: 'Physical vitality, somatic harmony, and nervous system peace.',
        });
      }

      setIsDrawingTrinity(false);
    }, 800);
  };

  // --- CLASSIC SPREAD DRAW ---
  const handleDrawClassicSpread = () => {
    if (isDrawingClassic) return;
    setIsDrawingClassic(true);
    setClassicDrawnCards([]);
    setAiInterpretation(null);

    setTimeout(() => {
      const count = classicSpread.cardCount;
      const drawn: DrawnCard[] = [];
      const usedIds: string[] = [];

      for (let i = 0; i < count; i++) {
        const { card, isReversed } = pickRandomCard(usedIds);
        usedIds.push(card.id);
        const position = classicSpread.positions[i] || {
          name: `Position ${i + 1}`,
          description: 'Spiritual guidance for this dimension.',
        };

        drawn.push({
          ...card,
          isReversed,
          positionName: position.name,
          positionDescription: position.description,
        });
      }

      setClassicDrawnCards(drawn);
      setIsDrawingClassic(false);
    }, 850);
  };

  // --- AI DEEP SYNTHESIS TRIGGER ---
  const handleGenerateAITarotReading = async (
    cardsToInterpret: DrawnCard[],
    spreadTitle: string,
    questionText: string,
    recipient?: string,
    relationshipText?: string,
    domainType?: 'general' | 'love' | 'finance' | 'health'
  ) => {
    if (cardsToInterpret.length === 0) return;
    setLoadingAI(true);

    try {
      const res = await fetch('/api/gemini/tarot-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText || 'What does the cosmos wish to illuminate at this juncture?',
          spreadType: spreadTitle,
          cards: cardsToInterpret,
          recipientName: recipient,
          relationship: relationshipText,
          domain: domainType,
          userProfile: {
            sunSign: userProfile.sunSign,
            lifePathNumber: userProfile.lifePathNumber,
          },
        }),
      });

      const data = await res.json();
      if (data.data) {
        setAiInterpretation(data.data);
      }
    } catch (err) {
      console.error('AI Tarot Reading error:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  // --- JOURNAL PERSISTENCE ---
  const handleSaveCurrentReading = (
    title: string,
    cards: DrawnCard[],
    notes: string = ''
  ) => {
    if (cards.length === 0) return;
    const cardsSummary = cards
      .map(
        (c) =>
          `• [${c.positionName}] ${c.name} (${c.isReversed ? 'Reversed' : 'Upright'})\nKeywords: ${
            c.isReversed ? c.reversedKeywords.slice(0, 3).join(', ') : c.keywords.slice(0, 3).join(', ')
          }\nMeaning: ${c.isReversed ? c.reversedMeaning : c.uprightMeaning}\nAdvice: ${c.advice}`
      )
      .join('\n\n');

    const content = aiInterpretation
      ? `${title}\n\nAI Synthesis:\n${aiInterpretation.synthesis}\n\nShadow Work:\n${aiInterpretation.shadowWork}\n\nActionable Advice:\n${aiInterpretation.actionableAdvice}\nMantra:\n${aiInterpretation.mantra}\n\n${notes ? 'Notes: ' + notes + '\n\n' : ''}Cards Drawn from 78-Card Rider-Waite Deck:\n${cardsSummary}`
      : `${title}\n\n${notes ? 'Notes: ' + notes + '\n\n' : ''}Cards Drawn from 78-Card Rider-Waite Deck:\n${cardsSummary}`;

    onSaveJournal(title, 'tarot', content);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="border-b border-purple-900/50 pb-5">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <Moon className="h-4 w-4" />
          <span>Complete set of 78 ~ Rider-Waite Deck</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
          Tarot Readings
        </h1>
        <p className="text-xs text-purple-300/80 mt-1">
          Daily one-card draw (resets at midnight) for all users. Sanctuary members may recieve a clarification pull, specialized domain guidance (Love, Finance, Health), and readings for others.
        </p>
      </div>

      {/* PERMANENT FEATURED TAROT ARTWORK BANNER - Positioned right under the header & subtitle */}
      <div className="relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden border border-purple-500/40 shadow-2xl bg-black/50">
        <img
          src="/assets/tarotcards.jpg"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = './assets/tarotcards.jpg'; }}
          alt="Tarot Readings and Rider-Waite Cards"
          className="w-full h-auto object-cover rounded-3xl select-none"
        />
      </div>

      {/* Enhanced Easy-to-Use Tarot Navigation Bar */}
      <div className="rounded-3xl border border-purple-700/60 bg-gradient-to-b from-[#0e0c24] to-[#080714] p-2.5 sm:p-3 shadow-2xl space-y-2">
        <div className="flex items-center justify-between px-1 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
          <span className="flex items-center space-x-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Select Reading Mode</span>
          </span>
          <span className="text-[10px] text-purple-400/80 lowercase font-mono">
            {activeTab === 'daily' ? '1 draw + 1 clarification daily' : activeTab === 'lookup' ? 'browse all 78 cards' : activeTab === 'others' ? 'partner & friends' : activeTab === 'domains' ? 'love • finance • health' : 'classic spreads'}
          </span>
        </div>

        {/* Responsive Grid Tabs (No Awkward Scrolling) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          
          {/* Tab 1: Card of the Day */}
          <button
            onClick={() => {
              setActiveTab('daily');
              setAiInterpretation(null);
            }}
            id="tab-tarot-daily"
            className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 rounded-2xl p-2.5 sm:p-3 text-center sm:text-left transition-all duration-200 cursor-pointer min-h-[48px] ${
              activeTab === 'daily'
                ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 border-2 border-amber-400 text-white shadow-[0_0_15px_rgba(251,191,36,0.45)] scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-purple-950/70 border border-purple-900/60 text-purple-200 hover:border-purple-600 hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'daily' ? 'bg-amber-400 text-slate-950' : 'bg-amber-400/15 text-amber-300'}`}>
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">Card of the Day</div>
              <div className="text-[9.5px] text-purple-300/80 font-medium">Daily & Clarify</div>
            </div>
          </button>

          {/* Tab 2: Card Meanings Directory */}
          <button
            onClick={() => {
              setActiveTab('lookup');
              setAiInterpretation(null);
            }}
            id="tab-tarot-lookup"
            className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 rounded-2xl p-2.5 sm:p-3 text-center sm:text-left transition-all duration-200 cursor-pointer min-h-[48px] ${
              activeTab === 'lookup'
                ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 border-2 border-amber-400 text-white shadow-[0_0_15px_rgba(251,191,36,0.45)] scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-purple-950/70 border border-purple-900/60 text-purple-200 hover:border-purple-600 hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'lookup' ? 'bg-amber-300 text-slate-950' : 'bg-amber-300/15 text-amber-300'}`}>
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">Card Meanings</div>
              <div className="text-[9.5px] text-purple-300/80 font-medium">78 Card Codex</div>
            </div>
          </button>

          {/* Tab 3: For Other People */}
          <button
            onClick={() => {
              setActiveTab('others');
              setAiInterpretation(null);
            }}
            id="tab-tarot-others"
            className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 rounded-2xl p-2.5 sm:p-3 text-center sm:text-left transition-all duration-200 cursor-pointer min-h-[48px] ${
              activeTab === 'others'
                ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 border-2 border-amber-400 text-white shadow-[0_0_15px_rgba(251,191,36,0.45)] scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-purple-950/70 border border-purple-900/60 text-purple-200 hover:border-purple-600 hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'others' ? 'bg-pink-400 text-slate-950' : 'bg-pink-400/15 text-pink-300'}`}>
              <Users className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1 justify-center sm:justify-start">
                <span className="text-xs font-bold leading-tight">For Others</span>
                {!isMember && (
                  <Crown className="h-3 w-3 text-amber-300 shrink-0" />
                )}
              </div>
              <div className="text-[9.5px] text-purple-300/80 font-medium">Partner & Friends</div>
            </div>
          </button>

          {/* Tab 4: 3 Life Domains */}
          <button
            onClick={() => {
              setActiveTab('domains');
              setAiInterpretation(null);
            }}
            id="tab-tarot-domains"
            className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 rounded-2xl p-2.5 sm:p-3 text-center sm:text-left transition-all duration-200 cursor-pointer min-h-[48px] ${
              activeTab === 'domains'
                ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 border-2 border-amber-400 text-white shadow-[0_0_15px_rgba(251,191,36,0.45)] scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-purple-950/70 border border-purple-900/60 text-purple-200 hover:border-purple-600 hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'domains' ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-400/15 text-emerald-300'}`}>
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1 justify-center sm:justify-start">
                <span className="text-xs font-bold leading-tight">3 Domains</span>
                {!isMember && (
                  <Crown className="h-3 w-3 text-amber-300 shrink-0" />
                )}
              </div>
              <div className="text-[9.5px] text-purple-300/80 font-medium">Love • Finance • Health</div>
            </div>
          </button>

          {/* Tab 5: Spreads & Deep Dives */}
          <button
            onClick={() => {
              setActiveTab('spreads');
              setAiInterpretation(null);
            }}
            id="tab-tarot-spreads"
            className={`col-span-2 sm:col-span-1 flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 rounded-2xl p-2.5 sm:p-3 text-center sm:text-left transition-all duration-200 cursor-pointer min-h-[48px] ${
              activeTab === 'spreads'
                ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 border-2 border-amber-400 text-white shadow-[0_0_15px_rgba(251,191,36,0.45)] scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-purple-950/70 border border-purple-900/60 text-purple-200 hover:border-purple-600 hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'spreads' ? 'bg-sky-400 text-slate-950' : 'bg-sky-400/15 text-sky-300'}`}>
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">Spreads</div>
              <div className="text-[9.5px] text-purple-300/80 font-medium">Multi-Card Dives</div>
            </div>
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DAILY TAROT & CLARIFICATION CARD PULL (1 PULL + 1 CLARIFICATION PER DAY, MIDNIGHT RESET) */}
      {/* ========================================================================= */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          {/* Daily Draw Banner & Live Midnight Clock Info */}
          <div className="rounded-3xl border border-purple-800/40 bg-gradient-to-br from-slate-900/95 via-purple-950/30 to-slate-950 p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-100 flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    <span>Card of the Day (1 Daily Card + 1 Clarification)</span>
                  </h2>
                </div>
                <p className="text-xs text-purple-300/80 mt-0.5">
                  Only one primary card and one clarification card pull allowed each day. Time resets automatically everyday at <strong>midnight</strong> matching your clock.
                </p>
              </div>

              {/* Countdown badge */}
              <div className="flex items-center space-x-2 rounded-2xl bg-purple-950/80 border border-purple-800/60 px-3.5 py-2 text-xs text-purple-200 shrink-0">
                <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
                <span>
                  Midnight Reset in: <strong className="text-amber-300 font-mono">{timeToMidnight.formatted}</strong>
                </span>
              </div>
            </div>

            {/* If primary card not drawn yet, show draw action */}
            {!dailyPrimaryCard && (
              <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-purple-900/50">
                <input
                  type="text"
                  value={dailyQuestion}
                  onChange={(e) => setDailyQuestion(e.target.value)}
                  placeholder="Optional daily intention or question (e.g. What energy will guide my decisions today?)"
                  className="flex-1 rounded-2xl border border-purple-900/60 bg-slate-950/80 px-4 py-2 text-xs text-slate-100 placeholder-purple-400/50 focus:border-amber-400 focus:outline-none"
                />
                <button
                  onClick={handleDrawDailyPrimary}
                  disabled={isDrawingDaily}
                  id="btn-draw-daily-primary"
                  className="flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition-opacity disabled:opacity-50 shrink-0"
                >
                  <Shuffle className={`h-4 w-4 ${isDrawingDaily ? 'animate-spin' : ''}`} />
                  <span>{isDrawingDaily ? 'Drawing Sacred Card...' : "Draw Today's Card of the Day"}</span>
                </button>
              </div>
            )}

            {dailyPrimaryCard && (
              <div className="flex items-center justify-between pt-2 border-t border-purple-900/50 text-[11px] text-purple-300/90">
                <span className="flex items-center space-x-1.5 text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Today's Card of the Day is drawn & active</span>
                </span>
                <span className="text-amber-300/90 font-medium">
                  {dailyClarificationCard 
                    ? 'Both daily cards drawn • Next card unlocks at midnight' 
                    : '1 Clarification card pull available for today'}
                </span>
              </div>
            )}
          </div>

          {/* Cards Display Area */}
          {dailyPrimaryCard ? (
            <div className="space-y-6">
              {/* Dual Cards Grid: Primary Card + Clarification Card */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Card 1: Primary Daily Card */}
                <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-slate-900 via-purple-950/70 to-slate-950 p-6 shadow-2xl flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-purple-800/60 pb-3">
                    <div>
                      <span className="inline-flex items-center space-x-1 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-400/30">
                        <Sparkles className="h-3 w-3" />
                        <span>Card of the Day (1 per Day)</span>
                      </span>
                      <h3 className="font-serif text-lg font-bold text-slate-100 mt-1">
                        {dailyPrimaryCard.name}
                      </h3>
                    </div>
                    <span className="rounded-xl bg-purple-900/50 px-2.5 py-1 text-xs font-semibold text-purple-200 border border-purple-700/50">
                      {dailyPrimaryCard.isReversed ? 'Reversed ↺' : 'Upright ☀️'}
                    </span>
                  </div>

                  <div className="my-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    {/* Authentic 1909 Rider-Waite-Smith Card Scan */}
                    <div className="shrink-0">
                      <TarotCardVisual
                        card={dailyPrimaryCard}
                        isReversed={dailyPrimaryCard.isReversed}
                        size="md"
                        allowZoom={true}
                        onCardClick={() => setActiveCardModal(dailyPrimaryCard)}
                      />
                    </div>

                    <div className="flex-1 space-y-3 text-left">
                      <p className="text-xs text-purple-200/90 leading-relaxed">
                        {dailyPrimaryCard.isReversed
                          ? dailyPrimaryCard.reversedMeaning
                          : dailyPrimaryCard.uprightMeaning}
                      </p>

                      {/* Pictorial Key 1911 Divinatory Keynote */}
                      {(dailyPrimaryCard.pictorialKeyUpright || dailyPrimaryCard.pictorialKeyReversed) && (
                        <div className="w-full rounded-2xl border border-amber-500/20 bg-slate-950/60 p-2.5 text-left text-[11px] text-amber-200/90">
                          <div className="flex items-center space-x-1 font-bold text-amber-400 text-[10px] uppercase tracking-wider mb-0.5">
                            <BookOpen className="h-3 w-3" />
                            <span>Pictorial Key (1911):</span>
                          </div>
                          <p className="line-clamp-2 italic text-purple-200/90">
                            "{dailyPrimaryCard.isReversed && dailyPrimaryCard.pictorialKeyReversed
                              ? dailyPrimaryCard.pictorialKeyReversed
                              : dailyPrimaryCard.pictorialKeyUpright}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-purple-900/60 pt-3">
                    <div className="rounded-xl bg-slate-950/80 p-2.5 text-xs text-amber-300 font-medium">
                      <strong>Sacred Advice:</strong> {dailyPrimaryCard.advice}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-purple-300">
                      <span>Keywords: {dailyPrimaryCard.isReversed ? dailyPrimaryCard.reversedKeywords.slice(0, 3).join(', ') : dailyPrimaryCard.keywords.slice(0, 3).join(', ')}</span>
                      <button
                        onClick={() => setActiveCardModal(dailyPrimaryCard)}
                        className="text-amber-400 hover:underline flex items-center space-x-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Deep Symbolism</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card 2: Clarification Card Slot (Only 1 allowed per day) */}
                {dailyClarificationCard ? (
                  <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-500/40 bg-gradient-to-b from-slate-900 via-indigo-950/60 to-slate-950 p-6 shadow-2xl flex flex-col justify-between animate-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between border-b border-indigo-800/60 pb-3">
                      <div>
                        <span className="inline-flex items-center space-x-1 rounded-full bg-indigo-400/20 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-400/30">
                          <Zap className="h-3 w-3" />
                          <span>Clarification Card (1 per Day)</span>
                        </span>
                        <h3 className="font-serif text-lg font-bold text-slate-100 mt-1">
                          {dailyClarificationCard.name}
                        </h3>
                      </div>
                      <span className="rounded-xl bg-indigo-900/50 px-2.5 py-1 text-xs font-semibold text-indigo-200 border border-indigo-700/50">
                        {dailyClarificationCard.isReversed ? 'Reversed ↺' : 'Upright ☀️'}
                      </span>
                    </div>

                    <div className="my-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                      {/* Authentic 1909 Rider-Waite-Smith Card Scan */}
                      <div className="shrink-0">
                        <TarotCardVisual
                          card={dailyClarificationCard}
                          isReversed={dailyClarificationCard.isReversed}
                          size="md"
                          allowZoom={true}
                          onCardClick={() => setActiveCardModal(dailyClarificationCard)}
                        />
                      </div>

                      <div className="flex-1 space-y-3 text-left">
                        <p className="text-xs text-indigo-200/90 leading-relaxed">
                          {dailyClarificationCard.isReversed
                            ? dailyClarificationCard.reversedMeaning
                            : dailyClarificationCard.uprightMeaning}
                        </p>

                        {/* Pictorial Key 1911 Divinatory Keynote */}
                        {(dailyClarificationCard.pictorialKeyUpright || dailyClarificationCard.pictorialKeyReversed) && (
                          <div className="w-full rounded-2xl border border-indigo-500/20 bg-slate-950/60 p-2.5 text-left text-[11px] text-indigo-200/90">
                            <div className="flex items-center space-x-1 font-bold text-indigo-300 text-[10px] uppercase tracking-wider mb-0.5">
                              <BookOpen className="h-3 w-3" />
                              <span>Pictorial Key (1911):</span>
                            </div>
                            <p className="line-clamp-2 italic text-purple-200/90">
                              "{dailyClarificationCard.isReversed && dailyClarificationCard.pictorialKeyReversed
                                ? dailyClarificationCard.pictorialKeyReversed
                                : dailyClarificationCard.pictorialKeyUpright}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-indigo-900/60 pt-3">
                      <div className="rounded-xl bg-slate-950/80 p-2.5 text-xs text-indigo-300 font-medium">
                        <strong>Clarifying Counsel:</strong> {dailyClarificationCard.advice}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-indigo-300">
                        <span>Keywords: {dailyClarificationCard.isReversed ? dailyClarificationCard.reversedKeywords.slice(0, 3).join(', ') : dailyClarificationCard.keywords.slice(0, 3).join(', ')}</span>
                        <button
                          onClick={() => setActiveCardModal(dailyClarificationCard)}
                          className="text-indigo-400 hover:underline flex items-center space-x-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Deep Symbolism</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Empty State / Clarification Pull Action (1 allowed per day) */
                  <div className="rounded-3xl border-2 border-dashed border-purple-800/60 bg-slate-900/40 p-6 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-900/30 text-purple-300 border border-purple-700/40">
                      <Zap className="h-8 w-8 text-amber-400" />
                    </div>
                    <div className="max-w-xs">
                      <h4 className="font-serif text-base font-bold text-slate-200">
                        Draw Today's Clarification Card
                      </h4>
                      <p className="text-xs text-purple-300/80 mt-1">
                        Draw 1 additional clarification card to illuminate root catalysts, nuances, and actionable resolution for today's card.
                      </p>
                    </div>
                    <button
                      onClick={handleDrawClarification}
                      disabled={isDrawingClarification}
                      id="btn-draw-clarification-card"
                      className="flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-amber-500/20 hover:opacity-95 transition-opacity disabled:opacity-50"
                    >
                      <Shuffle className={`h-4 w-4 ${isDrawingClarification ? 'animate-spin' : ''}`} />
                      <span>{isDrawingClarification ? 'Revealing Clarification Card...' : '+ Draw 1 Clarification Card'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Dual Card Synthesis (If clarification drawn) */}
              {dailyClarificationCard && (
                <div className="rounded-3xl border border-purple-700/50 bg-gradient-to-br from-purple-950/60 via-slate-900 to-slate-950 p-6 shadow-xl space-y-4">
                  {(() => {
                    const dual = getDualCardSynthesis(dailyPrimaryCard, dailyClarificationCard);
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                          <Sparkles className="h-4 w-4" />
                          <span>Dual-Card Interplay Synthesis</span>
                        </div>
                        <h4 className="font-serif text-base font-bold text-slate-100">
                          {dual.coreTheme}
                        </h4>
                        <p className="text-xs text-purple-200/90 leading-relaxed">
                          {dual.dynamicSummary}
                        </p>
                        <div className="rounded-2xl border border-purple-800/60 bg-slate-950/80 p-3.5 text-xs text-amber-200 space-y-1">
                          <div><strong>Integrated Action:</strong> {dual.actionableSynthesis}</div>
                          <div><strong>Daily Mantra:</strong> <em>"{dual.integratedAffirmation}"</em></div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* AI & Journal Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-900/50 bg-slate-900/80 p-4">
                <button
                  onClick={() =>
                    handleGenerateAITarotReading(
                      dailyClarificationCard
                        ? [dailyPrimaryCard, dailyClarificationCard]
                        : [dailyPrimaryCard],
                      dailyClarificationCard ? 'Daily Draw with Clarification' : 'Daily Card of the Day',
                      dailyQuestion
                    )
                  }
                  disabled={loadingAI}
                  id="btn-ai-daily-synthesis"
                  className="flex items-center space-x-2 rounded-xl bg-purple-600/80 hover:bg-purple-600 px-4 py-2 text-xs font-bold text-white transition-colors disabled:opacity-50"
                >
                  <Sparkles className={`h-4 w-4 ${loadingAI ? 'animate-spin' : ''}`} />
                  <span>{loadingAI ? 'Consulting Gemini Tarot Master...' : 'AI Comprehensive Reading'}</span>
                </button>

                <button
                  onClick={() =>
                    handleSaveCurrentReading(
                      `Card of the Day - ${new Date().toLocaleDateString()}`,
                      dailyClarificationCard
                        ? [dailyPrimaryCard, dailyClarificationCard]
                        : [dailyPrimaryCard],
                      dailyQuestion
                    )
                  }
                  id="btn-save-daily-journal"
                  className="flex items-center space-x-2 rounded-xl border border-purple-700/60 bg-purple-950/40 hover:bg-purple-900/50 px-4 py-2 text-xs font-semibold text-purple-200 transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>{isSaved ? 'Saved to Mystic Journal!' : 'Log Daily Pull to Journal'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Empty State with Cosmic Breadcrumbs Deck Visual */
            <div className="rounded-3xl border border-purple-900/40 bg-gradient-to-b from-[#0e0a24]/90 via-[#110e2c]/70 to-[#080614]/90 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
              {/* Tarot Deck Visual showcasing authentic card back */}
              <div 
                onClick={handleDrawDailyPrimary}
                className="group mx-auto relative cursor-pointer flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95 duration-300"
                style={{ width: '150px', height: '232px' }}
              >
                {/* Stack depth cards */}
                <div className="absolute inset-0 rounded-2xl border border-purple-800/40 bg-purple-950/60 translate-x-2 translate-y-2 opacity-50" />
                <div className="absolute inset-0 rounded-2xl border border-purple-700/50 bg-[#120f2e] translate-x-1 translate-y-1 opacity-75" />
                
                {/* Top Card Back */}
                <div className="relative h-full w-full rounded-2xl shadow-[0_0_25px_rgba(251,191,36,0.25)] group-hover:shadow-[0_0_35px_rgba(251,191,36,0.45)] transition-shadow">
                  <CosmicTarotCardBack />
                </div>
                
                <span className="absolute -bottom-7 text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider group-hover:text-amber-200">
                  ✦ Tap to Draw ✦
                </span>
              </div>

              <div className="max-w-md mx-auto pt-4">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-100">
                  Today’s Card of the Day Awaits
                </h3>
                <p className="text-xs text-purple-300/80 mt-1 leading-relaxed">
                  Focus on your breathing, center your intention, and draw today's 1 primary Rider-Waite guidance card. You may also pull 1 clarification card. Resets at midnight.
                </p>
              </div>

              <button
                onClick={handleDrawDailyPrimary}
                id="btn-start-daily-draw"
                className="rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 px-7 py-3 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 hover:shadow-amber-500/20 transition-all active:scale-95"
              >
                Draw Today's Card of the Day
              </button>
            </div>
          )}

          {/* Section Under Daily Tarot: Look up Each Card & Its Meaning */}
          <div className="pt-4 border-t border-purple-900/60">
            <TarotCardLookupSection />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: CARD MEANING DIRECTORY (78-CARD RIDER-WAITE ENCYCLOPEDIA) */}
      {/* ========================================================================= */}
      {activeTab === 'lookup' && (
        <div className="space-y-6">
          <TarotCardLookupSection />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: READING FOR OTHER PEOPLE (MEMBERS ONLY) */}
      {/* ========================================================================= */}
      {activeTab === 'others' && (
        <div className="space-y-6">
          {!isMember ? (
            /* Member Gated Banner */
            <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-purple-950/80 via-slate-900 to-slate-950 p-8 text-center space-y-4 shadow-2xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
                <Crown className="h-8 w-8 text-amber-400" />
              </div>
              <div className="max-w-lg mx-auto">
                <span className="rounded-full bg-amber-400/20 px-3 py-1 text-[11px] font-bold text-amber-300 border border-amber-400/30">
                  Member-Exclusive Feature
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-100 mt-2">
                  Multi-Card Readings for Other People
                </h3>
                <p className="text-xs text-purple-300/90 mt-2 leading-relaxed">
                  Perform sacred multi-card Rider-Waite readings on behalf of loved ones, partners, family, or friends. Enter their name to channel personalized insights and spiritual guidance.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onOpenWelcomeModal}
                  id="btn-unlock-others-trial"
                  className="rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 px-6 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/30 hover:opacity-95 transition-opacity"
                >
                  Start Free 3-Day Trial ($0 Upfront)
                </button>
              </div>
            </div>
          ) : (
            /* Active Member Reading For Others View */
            <div className="space-y-6">
              {/* Form Input for Person */}
              <div className="rounded-3xl border border-purple-800/40 bg-slate-900/90 p-6 shadow-xl space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <Users className="h-4 w-4" />
                  <span>Channeling Guidance for Someone Else</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-purple-200">
                      Whom are you reading for? <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-purple-400" />
                      <input
                        type="text"
                        value={otherPersonName}
                        onChange={(e) => setOtherPersonName(e.target.value)}
                        placeholder="Enter their first name (e.g. Sarah)"
                        id="input-other-person-name"
                        className="w-full rounded-2xl border border-purple-900/60 bg-slate-950/80 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-purple-400/50 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Relationship Selector */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-purple-200">
                      Relationship to You
                    </label>
                    <select
                      value={otherRelationship}
                      onChange={(e) => setOtherRelationship(e.target.value)}
                      className="w-full rounded-2xl border border-purple-900/60 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                    >
                      <option value="Romantic Partner">Romantic Partner / Spouse</option>
                      <option value="Soul Connection">Soul Connection / Twin Flame</option>
                      <option value="Close Friend">Close Friend</option>
                      <option value="Child / Daughter / Son">Child / Offspring</option>
                      <option value="Parent / Mother / Father">Parent</option>
                      <option value="Sibling">Sibling / Family Member</option>
                      <option value="Coworker / Business Associate">Coworker / Business Associate</option>
                      <option value="Acquaintance">Acquaintance / Other</option>
                    </select>
                  </div>

                  {/* Spread Selector */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-purple-200">
                      Select Multi-Card Spread
                    </label>
                    <select
                      value={otherSelectedSpread.id}
                      onChange={(e) => {
                        const found = OTHER_PEOPLE_SPREADS.find((s) => s.id === e.target.value);
                        if (found) setOtherSelectedSpread(found);
                      }}
                      className="w-full rounded-2xl border border-purple-900/60 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                    >
                      {OTHER_PEOPLE_SPREADS.map((sp) => (
                        <option key={sp.id} value={sp.id}>
                          {sp.name} ({sp.cardCount} Cards)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Optional Question */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-purple-200">
                    Specific Question or Focus for {otherPersonName || 'Them'}
                  </label>
                  <input
                    type="text"
                    value={otherQuestion}
                    onChange={(e) => setOtherQuestion(e.target.value)}
                    placeholder={`What guidance or emotional support does ${otherPersonName || 'this person'} need right now?`}
                    className="w-full rounded-2xl border border-purple-900/60 bg-slate-950/80 px-4 py-2 text-xs text-slate-100 placeholder-purple-400/50 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-purple-900/50">
                  <span className="text-[11px] text-purple-300">
                    Spread: <strong className="text-amber-300">{otherSelectedSpread.name}</strong> ({otherSelectedSpread.cardCount} cards)
                  </span>
                  <button
                    onClick={handleDrawForOtherPerson}
                    disabled={!otherPersonName.trim() || isDrawingOther}
                    id="btn-draw-cards-for-other"
                    className="flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition-opacity disabled:opacity-50"
                  >
                    <Shuffle className={`h-4 w-4 ${isDrawingOther ? 'animate-spin' : ''}`} />
                    <span>
                      {isDrawingOther
                        ? `Channeling for ${otherPersonName}...`
                        : `Draw Cards for ${otherPersonName || '...'}`}
                    </span>
                  </button>
                </div>
              </div>

              {/* Cards Rendered for Other Person */}
              {otherDrawnCards.length > 0 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
                    <h3 className="font-serif text-lg font-bold text-slate-100">
                      Reading for <span className="text-pink-300">{otherPersonName}</span> ({otherRelationship})
                    </h3>
                    <span className="text-xs text-purple-300">
                      {otherDrawnCards.length} Rider-Waite Cards Drawn
                    </span>
                  </div>

                  <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${otherSelectedSpread.cardCount === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-3'} gap-4`}>
                    {otherDrawnCards.map((card, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveCardModal(card)}
                        className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-pink-700/40 bg-gradient-to-b from-slate-950 via-purple-950/70 to-slate-950 p-4 shadow-xl hover:border-pink-400 hover:shadow-pink-500/20 transition-all flex flex-col justify-between items-center"
                      >
                        <div className="w-full border-b border-purple-900/60 pb-2 text-center">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-pink-300 truncate">
                            {card.positionName}
                          </div>
                          <div className="text-[9px] text-purple-300/70 truncate">
                            {card.positionDescription}
                          </div>
                        </div>

                        <div className="my-3 flex flex-col items-center justify-center text-center">
                          <TarotCardVisual
                            card={card}
                            isReversed={card.isReversed}
                            size="sm"
                          />
                          <h4 className="font-serif text-sm font-bold text-slate-100 mt-2 leading-tight">
                            {card.name}
                          </h4>
                          <span className="text-[10px] font-medium text-purple-300 mt-0.5">
                            {card.isReversed ? 'Reversed ↺' : 'Upright ☀️'}
                          </span>
                        </div>

                        <div className="w-full rounded-xl border border-purple-900/50 bg-slate-900/80 p-2 text-center text-[10px] text-amber-200 truncate">
                          {card.isReversed ? card.reversedKeywords.slice(0, 2).join(' • ') : card.keywords.slice(0, 2).join(' • ')}
                        </div>

                        <div className="mt-2 text-center text-[10px] text-purple-400 group-hover:text-pink-300 flex items-center justify-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>Tap for Deep Meanings</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions for Other Person Reading */}
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-900/50 bg-slate-900/80 p-4">
                    <button
                      onClick={() =>
                        handleGenerateAITarotReading(
                          otherDrawnCards,
                          `${otherSelectedSpread.name} for ${otherPersonName}`,
                          otherQuestion,
                          otherPersonName,
                          otherRelationship
                        )
                      }
                      disabled={loadingAI}
                      id="btn-ai-other-reading"
                      className="flex items-center space-x-2 rounded-xl bg-pink-600/80 hover:bg-pink-600 px-4 py-2 text-xs font-bold text-white transition-colors disabled:opacity-50"
                    >
                      <Sparkles className={`h-4 w-4 ${loadingAI ? 'animate-spin' : ''}`} />
                      <span>{loadingAI ? `Interpreting for ${otherPersonName}...` : `AI Interpretation for ${otherPersonName}`}</span>
                    </button>

                    <button
                      onClick={() =>
                        handleSaveCurrentReading(
                          `Tarot Reading for ${otherPersonName} (${otherRelationship}) - ${new Date().toLocaleDateString()}`,
                          otherDrawnCards,
                          `Querent Question: ${otherQuestion || 'General Reading'}`
                        )
                      }
                      id="btn-save-other-journal"
                      className="flex items-center space-x-2 rounded-xl border border-purple-700/60 bg-purple-950/40 hover:bg-purple-900/50 px-4 py-2 text-xs font-semibold text-purple-200 transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>{isSaved ? 'Saved to Mystic Journal!' : `Save ${otherPersonName}'s Reading`}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DAILY DOMAIN TRINITY (LOVE, FINANCE, HEALTH) [MEMBERS ONLY] */}
      {/* ========================================================================= */}
      {activeTab === 'domains' && (
        <div className="space-y-6">
          {!isMember ? (
            /* Member Gated Banner */
            <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-purple-950/80 via-slate-900 to-slate-950 p-8 text-center space-y-4 shadow-2xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
                <Crown className="h-8 w-8 text-amber-400" />
              </div>
              <div className="max-w-lg mx-auto">
                <span className="rounded-full bg-amber-400/20 px-3 py-1 text-[11px] font-bold text-amber-300 border border-amber-400/30">
                  Member-Exclusive Feature
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-100 mt-2">
                  Daily Domain Trinity: Love • Finance • Health
                </h3>
                <p className="text-xs text-purple-300/90 mt-2 leading-relaxed">
                  Unlock three specialized daily Rider-Waite pulls every morning: one dedicated card for your romantic heart, one for your financial abundance, and one for your physical vitality.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onOpenWelcomeModal}
                  id="btn-unlock-domains-trial"
                  className="rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 px-6 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/30 hover:opacity-95 transition-opacity"
                >
                  Start Free 3-Day Trial ($0 Upfront)
                </button>
              </div>
            </div>
          ) : (
            /* Active Member Domain Trinity View */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-purple-800/40 bg-slate-900/90 p-6 shadow-xl">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <Crown className="h-4 w-4" />
                    <span>Member Exclusive • Daily Trinity Sanctuary</span>
                  </div>
                  <h2 className="font-serif text-xl font-bold text-slate-100 mt-1">
                    Daily Trinity: Love, Finance & Health
                  </h2>
                  <p className="text-xs text-purple-300/80 mt-0.5">
                    Draw all three sacred domain cards together, or pull individually for focused daily clarity.
                  </p>
                </div>

                <button
                  onClick={() => handleDrawDomainTrinity()}
                  disabled={isDrawingTrinity}
                  id="btn-draw-all-trinity"
                  className="flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 px-6 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:opacity-95 transition-opacity disabled:opacity-50 shrink-0"
                >
                  <Shuffle className={`h-4 w-4 ${isDrawingTrinity ? 'animate-spin' : ''}`} />
                  <span>{loveCard || financeCard || healthCard ? 'Re-Draw All 3 Domain Cards' : 'Draw All 3 Domain Cards'}</span>
                </button>
              </div>

              {/* 3 Domain Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. LOVE DOMAIN CARD */}
                <div className="rounded-3xl border-2 border-rose-500/40 bg-gradient-to-b from-slate-900 via-rose-950/40 to-slate-950 p-5 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-rose-900/50 pb-3">
                      <span className="flex items-center space-x-1 rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                        <Heart className="h-3 w-3" />
                        <span>Daily Love & Heart</span>
                      </span>
                      {loveCard && (
                        <span className="text-[10px] font-semibold text-rose-200">
                          {loveCard.isReversed ? 'Reversed ↺' : 'Upright ☀️'}
                        </span>
                      )}
                    </div>

                    {loveCard ? (
                      <div className="my-4 space-y-3">
                        <div className="flex flex-col items-center justify-center text-center">
                          <TarotCardVisual
                            card={loveCard}
                            isReversed={loveCard.isReversed}
                            size="sm"
                          />
                          <h3 className="font-serif text-base font-bold text-slate-100 mt-2">
                            {loveCard.name}
                          </h3>
                          <span className="text-[10px] text-rose-300">
                            {loveCard.isReversed ? loveCard.reversedKeywords.slice(0, 2).join(' • ') : loveCard.keywords.slice(0, 2).join(' • ')}
                          </span>
                        </div>

                        {(() => {
                          const g = getCardDomainGuidance(loveCard, loveCard.isReversed, 'love');
                          return (
                            <div className="space-y-2 text-xs text-rose-100/90 rounded-2xl bg-slate-950/80 p-3 border border-rose-900/40">
                              <div className="font-semibold text-rose-300 text-[11px]">{g.theme}</div>
                              <p className="text-[11px] leading-relaxed">{g.message}</p>
                              <div className="text-[10px] text-amber-300 pt-1 border-t border-rose-900/30">
                                <strong>Action:</strong> {g.action}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="my-8 text-center space-y-3">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-950/60 border border-rose-800/40 text-rose-300">
                          <Heart className="h-7 w-7 text-rose-400" />
                        </div>
                        <p className="text-xs text-rose-200/80">Awaiting your daily love pull</p>
                        <button
                          onClick={() => handleDrawDomainTrinity('love')}
                          className="rounded-xl bg-rose-600/80 hover:bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors"
                        >
                          Draw Love Card
                        </button>
                      </div>
                    )}
                  </div>

                  {loveCard && (
                    <div className="border-t border-rose-900/40 pt-3 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => handleDrawDomainTrinity('love')}
                        className="text-rose-400 hover:text-rose-300 flex items-center space-x-1"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Re-draw Love</span>
                      </button>
                      <button
                        onClick={() => setActiveCardModal(loveCard)}
                        className="text-amber-400 hover:underline flex items-center space-x-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View Card</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. FINANCE DOMAIN CARD */}
                <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-slate-900 via-amber-950/40 to-slate-950 p-5 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-amber-900/50 pb-3">
                      <span className="flex items-center space-x-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                        <Coins className="h-3 w-3" />
                        <span>Daily Finance & Career</span>
                      </span>
                      {financeCard && (
                        <span className="text-[10px] font-semibold text-amber-200">
                          {financeCard.isReversed ? 'Reversed ↺' : 'Upright ☀️'}
                        </span>
                      )}
                    </div>

                    {financeCard ? (
                      <div className="my-4 space-y-3">
                        <div className="flex flex-col items-center justify-center text-center">
                          <TarotCardVisual
                            card={financeCard}
                            isReversed={financeCard.isReversed}
                            size="sm"
                          />
                          <h3 className="font-serif text-base font-bold text-slate-100 mt-2">
                            {financeCard.name}
                          </h3>
                          <span className="text-[10px] text-amber-300">
                            {financeCard.isReversed ? financeCard.reversedKeywords.slice(0, 2).join(' • ') : financeCard.keywords.slice(0, 2).join(' • ')}
                          </span>
                        </div>

                        {(() => {
                          const g = getCardDomainGuidance(financeCard, financeCard.isReversed, 'finance');
                          return (
                            <div className="space-y-2 text-xs text-amber-100/90 rounded-2xl bg-slate-950/80 p-3 border border-amber-900/40">
                              <div className="font-semibold text-amber-300 text-[11px]">{g.theme}</div>
                              <p className="text-[11px] leading-relaxed">{g.message}</p>
                              <div className="text-[10px] text-emerald-300 pt-1 border-t border-amber-900/30">
                                <strong>Action:</strong> {g.action}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="my-8 text-center space-y-3">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-950/60 border border-amber-800/40 text-amber-300">
                          <Coins className="h-7 w-7 text-amber-400" />
                        </div>
                        <p className="text-xs text-amber-200/80">Awaiting your daily finance pull</p>
                        <button
                          onClick={() => handleDrawDomainTrinity('finance')}
                          className="rounded-xl bg-amber-600/80 hover:bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors"
                        >
                          Draw Finance Card
                        </button>
                      </div>
                    )}
                  </div>

                  {financeCard && (
                    <div className="border-t border-amber-900/40 pt-3 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => handleDrawDomainTrinity('finance')}
                        className="text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Re-draw Finance</span>
                      </button>
                      <button
                        onClick={() => setActiveCardModal(financeCard)}
                        className="text-amber-400 hover:underline flex items-center space-x-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View Card</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. HEALTH DOMAIN CARD */}
                <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-slate-900 via-emerald-950/40 to-slate-950 p-5 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-emerald-900/50 pb-3">
                      <span className="flex items-center space-x-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                        <Leaf className="h-3 w-3" />
                        <span>Daily Health & Vitality</span>
                      </span>
                      {healthCard && (
                        <span className="text-[10px] font-semibold text-emerald-200">
                          {healthCard.isReversed ? 'Reversed ↺' : 'Upright ☀️'}
                        </span>
                      )}
                    </div>

                    {healthCard ? (
                      <div className="my-4 space-y-3">
                        <div className="flex flex-col items-center justify-center text-center">
                          <TarotCardVisual
                            card={healthCard}
                            isReversed={healthCard.isReversed}
                            size="sm"
                          />
                          <h3 className="font-serif text-base font-bold text-slate-100 mt-2">
                            {healthCard.name}
                          </h3>
                          <span className="text-[10px] text-emerald-300">
                            {healthCard.isReversed ? healthCard.reversedKeywords.slice(0, 2).join(' • ') : healthCard.keywords.slice(0, 2).join(' • ')}
                          </span>
                        </div>

                        {(() => {
                          const g = getCardDomainGuidance(healthCard, healthCard.isReversed, 'health');
                          return (
                            <div className="space-y-2 text-xs text-emerald-100/90 rounded-2xl bg-slate-950/80 p-3 border border-emerald-900/40">
                              <div className="font-semibold text-emerald-300 text-[11px]">{g.theme}</div>
                              <p className="text-[11px] leading-relaxed">{g.message}</p>
                              <div className="text-[10px] text-amber-300 pt-1 border-t border-emerald-900/30">
                                <strong>Action:</strong> {g.action}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="my-8 text-center space-y-3">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-300">
                          <Leaf className="h-7 w-7 text-emerald-400" />
                        </div>
                        <p className="text-xs text-emerald-200/80">Awaiting your daily health pull</p>
                        <button
                          onClick={() => handleDrawDomainTrinity('health')}
                          className="rounded-xl bg-emerald-600/80 hover:bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors"
                        >
                          Draw Health Card
                        </button>
                      </div>
                    )}
                  </div>

                  {healthCard && (
                    <div className="border-t border-emerald-900/40 pt-3 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => handleDrawDomainTrinity('health')}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Re-draw Health</span>
                      </button>
                      <button
                        onClick={() => setActiveCardModal(healthCard)}
                        className="text-amber-400 hover:underline flex items-center space-x-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View Card</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Trinity Action Bar */}
              {(loveCard || financeCard || healthCard) && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-900/50 bg-slate-900/80 p-4">
                  <button
                    onClick={() => {
                      const activeCards = [loveCard, financeCard, healthCard].filter(Boolean) as DrawnCard[];
                      handleGenerateAITarotReading(
                        activeCards,
                        'Daily Domain Trinity (Love • Finance • Health)',
                        'How do these three daily energies balance my day?'
                      );
                    }}
                    disabled={loadingAI}
                    id="btn-ai-trinity-synthesis"
                    className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-rose-600 via-amber-600 to-emerald-600 px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-95 disabled:opacity-50"
                  >
                    <Sparkles className={`h-4 w-4 ${loadingAI ? 'animate-spin' : ''}`} />
                    <span>{loadingAI ? 'Synthesizing Daily Trinity...' : 'AI Trinity Holistic Forecast'}</span>
                  </button>

                  <button
                    onClick={() => {
                      const activeCards = [loveCard, financeCard, healthCard].filter(Boolean) as DrawnCard[];
                      handleSaveCurrentReading(
                        `Daily Domain Trinity (Love • Finance • Health) - ${new Date().toLocaleDateString()}`,
                        activeCards
                      );
                    }}
                    id="btn-save-trinity-journal"
                    className="flex items-center space-x-2 rounded-xl border border-purple-700/60 bg-purple-950/40 hover:bg-purple-900/50 px-4 py-2 text-xs font-semibold text-purple-200 transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>{isSaved ? 'Saved to Mystic Journal!' : 'Log Trinity to Journal'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CLASSIC SPREADS & DEEP DIVES */}
      {/* ========================================================================= */}
      {activeTab === 'spreads' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-purple-800/40 bg-slate-900/90 p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-100 flex items-center space-x-2">
                  <Compass className="h-5 w-5 text-sky-400" />
                  <span>Classic Rider-Waite Multi-Card Spreads</span>
                </h2>
                <p className="text-xs text-purple-300/80 mt-0.5">
                  Explore timeless spiritual spreads from the 3-card temporal timeline to the 5-card Sacred Celtic Cross.
                </p>
              </div>

              {/* Spread selector buttons */}
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar rounded-xl border border-purple-900/60 bg-slate-950/80 p-1">
                {TAROT_SPREADS.filter((s) => s.category !== 'OtherPeople').map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() => {
                      setClassicSpread(sp);
                      setClassicDrawnCards([]);
                      setAiInterpretation(null);
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold shrink-0 transition-all ${
                      classicSpread.id === sp.id
                        ? 'bg-purple-600 text-white'
                        : 'text-purple-300/70 hover:bg-purple-900/40'
                    }`}
                  >
                    {sp.name} ({sp.cardCount})
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-purple-900/50">
              <input
                type="text"
                value={classicQuestion}
                onChange={(e) => setClassicQuestion(e.target.value)}
                placeholder="State your question or situation for this spread..."
                className="flex-1 rounded-2xl border border-purple-900/60 bg-slate-950/80 px-4 py-2 text-xs text-slate-100 placeholder-purple-400/50 focus:border-amber-400 focus:outline-none"
              />
              <button
                onClick={handleDrawClassicSpread}
                disabled={isDrawingClassic}
                id="btn-draw-classic-spread"
                className="flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-600/30 hover:opacity-95 transition-opacity disabled:opacity-50 shrink-0"
              >
                <Shuffle className={`h-4 w-4 ${isDrawingClassic ? 'animate-spin' : ''}`} />
                <span>{isDrawingClassic ? 'Shuffling Deck...' : `Draw ${classicSpread.cardCount} Cards`}</span>
              </button>
            </div>
          </div>

          {/* Render Drawn Classic Cards */}
          {classicDrawnCards.length > 0 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${classicSpread.cardCount === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-3'} gap-4`}>
                {classicDrawnCards.map((card, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveCardModal(card)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-purple-700/50 bg-gradient-to-b from-slate-950 via-purple-950/70 to-slate-950 p-4 shadow-xl hover:border-sky-400 hover:shadow-sky-500/20 transition-all flex flex-col justify-between items-center"
                  >
                    <div className="w-full border-b border-purple-900/60 pb-2 text-center">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-sky-300 truncate">
                        {card.positionName}
                      </div>
                      <div className="text-[9px] text-purple-300/70 truncate">
                        {card.positionDescription}
                      </div>
                    </div>

                    <div className="my-3 flex flex-col items-center justify-center text-center">
                      <TarotCardVisual
                        card={card}
                        isReversed={card.isReversed}
                        size="sm"
                      />
                      <h4 className="font-serif text-sm font-bold text-slate-100 mt-2 leading-tight">
                        {card.name}
                      </h4>
                      <span className="text-[10px] font-medium text-purple-300 mt-0.5">
                        {card.isReversed ? 'Reversed ↺' : 'Upright ☀️'}
                      </span>
                    </div>

                    <div className="w-full rounded-xl border border-purple-900/50 bg-slate-900/80 p-2 text-center text-[10px] text-amber-200 truncate">
                      {card.isReversed ? card.reversedKeywords.slice(0, 2).join(' • ') : card.keywords.slice(0, 2).join(' • ')}
                    </div>

                    <div className="mt-2 text-center text-[10px] text-purple-400 group-hover:text-sky-300 flex items-center justify-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>Tap for Deep Meanings</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-900/50 bg-slate-900/80 p-4">
                <button
                  onClick={() =>
                    handleGenerateAITarotReading(
                      classicDrawnCards,
                      classicSpread.name,
                      classicQuestion
                    )
                  }
                  disabled={loadingAI}
                  id="btn-ai-classic-synthesis"
                  className="flex items-center space-x-2 rounded-xl bg-sky-600/80 hover:bg-sky-600 px-4 py-2 text-xs font-bold text-white transition-colors disabled:opacity-50"
                >
                  <Sparkles className={`h-4 w-4 ${loadingAI ? 'animate-spin' : ''}`} />
                  <span>{loadingAI ? 'Consulting Tarot Master...' : 'AI Deep Spread Synthesis'}</span>
                </button>

                <button
                  onClick={() =>
                    handleSaveCurrentReading(
                      `${classicSpread.name} - ${new Date().toLocaleDateString()}`,
                      classicDrawnCards,
                      classicQuestion
                    )
                  }
                  id="btn-save-classic-journal"
                  className="flex items-center space-x-2 rounded-xl border border-purple-700/60 bg-purple-950/40 hover:bg-purple-900/50 px-4 py-2 text-xs font-semibold text-purple-200 transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>{isSaved ? 'Saved to Mystic Journal!' : 'Log Spread to Journal'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* AI INTERPRETATION MODAL / ACCORDION (SHARED) */}
      {/* ========================================================================= */}
      {aiInterpretation && (
        <div className="rounded-3xl border-2 border-purple-600/50 bg-gradient-to-br from-purple-950/80 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-purple-800/50 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="h-5 w-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-100">
                  Universal Tarot Master Synthesis
                </h3>
                <span className="text-[11px] text-purple-300">
                  Grounded in authentic Rider-Waite Hermetic & Jungian archetypes
                </span>
              </div>
            </div>

            <button
              onClick={() => setAiInterpretation(null)}
              className="rounded-full p-1 text-purple-400 hover:bg-purple-900/50 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                Divine Narrative & Synthesis
              </h4>
              <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed whitespace-pre-line">
                {aiInterpretation.synthesis}
              </p>
            </div>

            {aiInterpretation.cardInsights && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {aiInterpretation.cardInsights.map((insight: any, i: number) => (
                  <div key={i} className="rounded-2xl border border-purple-900/60 bg-slate-950/70 p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-xs font-bold text-amber-300">{insight.cardName}</span>
                      <span className="text-[10px] text-purple-400">{insight.position}</span>
                    </div>
                    <p className="text-[11px] text-purple-200/90 leading-relaxed">{insight.deeperMeaning}</p>
                    {insight.symbolicClue && (
                      <div className="text-[10px] text-sky-300 pt-1">
                        <strong>Symbolic Clue:</strong> {insight.symbolicClue}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {aiInterpretation.shadowWork && (
                <div className="rounded-2xl border border-rose-900/50 bg-rose-950/30 p-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 block mb-1">
                    Shadow Work & Caution
                  </span>
                  <p className="text-[11px] text-rose-100/90 leading-relaxed">{aiInterpretation.shadowWork}</p>
                </div>
              )}

              {aiInterpretation.actionableAdvice && (
                <div className="rounded-2xl border border-emerald-900/50 bg-emerald-950/30 p-3.5 sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block mb-1">
                    Actionable Guidance
                  </span>
                  <p className="text-[11px] text-emerald-100/90 leading-relaxed">{aiInterpretation.actionableAdvice}</p>
                </div>
              )}
            </div>

            {aiInterpretation.mantra && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-3 text-center text-xs text-amber-200">
                <strong>Daily Sacred Mantra:</strong> <em>"{aiInterpretation.mantra}"</em>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: FULL CARD DETAIL & RIDER-WAITE SYMBOLISM */}
      {/* ========================================================================= */}
      {activeCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border-2 border-purple-600/60 bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 p-6 sm:p-8 shadow-2xl space-y-5">
            <button
              onClick={() => setActiveCardModal(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-purple-300 hover:bg-purple-900/50 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header & Card Visual */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-purple-800/60 pb-5">
              <div className="shrink-0">
                <TarotCardVisual
                  card={activeCardModal}
                  isReversed={activeCardModal.isReversed}
                  size="md"
                  allowZoom={true}
                />
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  <span>Rider-Waite-Smith Tarot Deck</span>
                  <span>•</span>
                  <span>{activeCardModal.arcana} Arcana</span>
                  {activeCardModal.element && <span>• Element: {activeCardModal.element}</span>}
                </div>
                <h2 className="font-serif text-2xl font-bold text-slate-100">
                  {activeCardModal.name}
                </h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="rounded-full bg-purple-900/60 px-3 py-0.5 text-xs font-semibold text-purple-200 border border-purple-700/40">
                    {activeCardModal.isReversed ? 'Orientation: Reversed ↺' : 'Orientation: Upright ☀️'}
                  </span>
                  {activeCardModal.astrology && (
                    <span className="rounded-full bg-amber-900/40 px-3 py-0.5 text-xs font-medium text-amber-300 border border-amber-700/40">
                      {activeCardModal.astrology}
                    </span>
                  )}
                </div>
                <p className="text-xs text-purple-300/80 pt-1">
                  Authentic 1909 print scan by Pamela Colman Smith under the direction of Arthur Edward Waite.
                </p>
              </div>
            </div>

            {/* Visual Description - Pictorial Key to the Tarot */}
            <div className="rounded-2xl border border-amber-500/30 bg-slate-950/90 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center space-x-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                  <span>The Pictorial Key to the Tarot (A.E. Waite & Pamela Colman Smith, 1911)</span>
                </span>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-semibold text-amber-300 border border-amber-500/20">
                  Authentic 1911 Text
                </span>
              </div>
              <p className="text-xs text-amber-100/90 leading-relaxed font-sans">
                {activeCardModal.pictorialKeyDescription || activeCardModal.visualDescription}
              </p>
            </div>

            {/* A.E. Waite Divinatory Meanings from Pictorial Key */}
            {(activeCardModal.pictorialKeyUpright || activeCardModal.pictorialKeyReversed) && (
              <div className="rounded-2xl border border-purple-800/60 bg-purple-950/40 p-4 space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                  Waite's Original Divinatory Meanings
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {activeCardModal.pictorialKeyUpright && (
                    <div className="space-y-1">
                      <span className="font-semibold text-amber-300">☀️ Upright Key:</span>
                      <p className="text-purple-100/90 leading-relaxed">{activeCardModal.pictorialKeyUpright}</p>
                    </div>
                  )}
                  {activeCardModal.pictorialKeyReversed && (
                    <div className="space-y-1">
                      <span className="font-semibold text-purple-300">↺ Reversed Key:</span>
                      <p className="text-purple-200/90 leading-relaxed">{activeCardModal.pictorialKeyReversed}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modern Synthesis: Upright and Reversed Meanings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-4 space-y-1.5">
                <span className="text-xs font-bold text-amber-300 flex items-center space-x-1">
                  <span>☀️ Modern Synthesis</span>
                </span>
                <p className="text-xs text-amber-100/90 leading-relaxed">
                  {activeCardModal.uprightMeaning}
                </p>
                <div className="text-[10px] text-amber-300/80 pt-1">
                  <strong>Keywords:</strong> {activeCardModal.keywords.join(', ')}
                </div>
              </div>

              <div className="rounded-2xl border border-purple-900/40 bg-purple-950/30 p-4 space-y-1.5">
                <span className="text-xs font-bold text-purple-300 flex items-center space-x-1">
                  <span>↺ Reversed Modern Meaning</span>
                </span>
                <p className="text-xs text-purple-100/90 leading-relaxed">
                  {activeCardModal.reversedMeaning}
                </p>
                <div className="text-[10px] text-purple-300/80 pt-1">
                  <strong>Keywords:</strong> {activeCardModal.reversedKeywords.join(', ')}
                </div>
              </div>
            </div>

            {/* Advice & Affirmation */}
            <div className="space-y-2 border-t border-purple-900/60 pt-4">
              <div className="rounded-2xl bg-slate-950/80 p-3.5 text-xs text-slate-200 border border-purple-900/40">
                <strong className="text-amber-300">Universal Advice:</strong> {activeCardModal.advice}
              </div>
              <div className="rounded-2xl bg-slate-950/80 p-3.5 text-xs text-amber-200 border border-amber-500/30">
                <strong>Sacred Affirmation:</strong> <em>"{activeCardModal.affirmation}"</em>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setActiveCardModal(null)}
                className="w-full rounded-2xl bg-purple-600/80 hover:bg-purple-600 py-2.5 text-xs font-bold text-white transition-colors"
              >
                Close Card Illumination
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
