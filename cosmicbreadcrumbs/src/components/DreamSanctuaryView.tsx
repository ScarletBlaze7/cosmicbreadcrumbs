import React, { useState } from 'react';
import {
  Moon,
  Sparkles,
  Search,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Star,
  Copy,
  Check,
  Download,
  Flame,
  Feather,
  Zap,
  Tag,
  History,
  Compass,
  Eye,
  BookOpen,
  HelpCircle,
  Hash,
  AlertCircle,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { DreamEntry, DreamType, DreamInterpretationResult, UserProfile } from '../types';
import { POPULAR_STANDOUT_KEYWORDS } from '../data/dreamDictionary';
import { interpretDreamWithAI, calculateDreamVibration } from '../utils/dreamInterpreter';
import { PinLockScreen } from './PinLockScreen';
import { PinSecurityModal } from './PinSecurityModal';
import { triggerFireworks } from '../utils/fireworks';
import { JournalCalendar, CalendarMarker } from './JournalCalendar';
import { DreamSearchModal } from './DreamSearchModal';

interface DreamSanctuaryViewProps {
  userProfile: UserProfile;
}

const DREAM_LOG_STORAGE_KEY = 'cosmic_dream_entries';
const DREAM_PIN_STORAGE_KEY = 'cosmic_dreams_pin';

const INITIAL_DREAM_LOG: DreamEntry[] = [
  {
    id: 'dream-1',
    date: new Date().toISOString().slice(0, 10),
    isPastDream: false,
    title: 'Flight over Crystal Water & Silver Keys',
    dreamNarrative: 'I was standing at the edge of a turquoise ocean when I suddenly realized I could fly. As I soared over the water, I caught sight of a shimmering silver key resting on a golden reef. I dove down and grasped it without losing breath.',
    standoutKeywords: ['Water', 'Flying', 'Key'],
    emotionalTone: 'Empowered & Lucid',
    dreamType: 'lucid',
    interpretation: {
      summary: 'This lucid flight over crystal waters signifies high vibrational sovereignty and emotional mastery. The ocean reflects your deep subconscious peace, while the act of flight reveals your readiness to transcend previous creative ceilings.',
      keywordMeanings: [
        {
          symbol: 'Water',
          meaning: 'Subconscious emotional currents, fluid intuition, and deep spiritual cleansing.',
          archetype: 'The Subconscious Deep',
          element: 'Water',
          numerologyVibe: 2,
        },
        {
          symbol: 'Flying',
          meaning: 'Liberation from material constraints and sovereign spiritual elevation.',
          archetype: 'The Transcendent Self',
          element: 'Air',
          numerologyVibe: 7,
        },
        {
          symbol: 'Key',
          meaning: 'Access to hidden knowledge and unlocking long-held soul opportunities.',
          archetype: 'The Hierophant / Initiator',
          element: 'Aether',
          numerologyVibe: 1,
        },
      ],
      subconsciousMessage: 'Your subconscious is signaling that you already hold the intuitive keys to unlock your next big transition.',
      spiritualSignificance: 'An etheric initiation where your astral body claimed authority over emotional worry.',
      shadowWorkAspect: 'Release any residual fear that your creative ambition is "too lofty"—you are divinely supported.',
      guidanceAction: 'Take one bold, concrete action today toward the project you felt hesitation about.',
      lucidRitual: 'Tonight before sleep, visualize holding the silver key to your heart center and anchor the feeling of limitless flight.',
      dreamNumberVibration: 11,
    },
    isFavorite: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'dream-2',
    date: '2023-10-15',
    isPastDream: true,
    approximateDate: 'Autumn 2023 (Approx. Oct 15)',
    title: 'Past Memory: The Ancient Forest & The White Wolf',
    dreamNarrative: 'An old recurring dream from last year where I walked through a misty ancient forest. A giant white wolf stood peacefully on a stone altar, looked directly into my eyes, and nodded before disappearing into the mist.',
    standoutKeywords: ['Wolf', 'Tree', 'Star'],
    emotionalTone: 'Mystified & Reverent',
    dreamType: 'prophetic',
    interpretation: {
      summary: 'Regarding this lingering past dream: its enduring presence in your memory signifies an active spirit guardian contract. The white wolf and ancient roots anchor ancestral wisdom and instinctual discernment.',
      keywordMeanings: [
        {
          symbol: 'Wolf',
          meaning: 'Fierce loyalty, primal wisdom, and unerring intuitive navigation.',
          archetype: 'The Guardian Spirit',
          element: 'Earth',
          numerologyVibe: 9,
        },
        {
          symbol: 'Tree',
          meaning: 'Ancestral roots, stability, and enduring soul evolution.',
          archetype: 'The Tree of Life',
          element: 'Earth',
          numerologyVibe: 4,
        },
      ],
      subconsciousMessage: 'Your primal instincts are sharper than your analytical mind gives them credit for.',
      spiritualSignificance: 'A visitation from an ancestral guide confirming you are protected in the spiritual wild.',
      shadowWorkAspect: 'Acknowledge where you have doubted your natural gut radar in waking relationships.',
      guidanceAction: 'Spend 10 minutes in nature or grounding barefoot on soil to reconnect with your instinctual power.',
      lucidRitual: 'State: "I honor my primal wisdom and walk alongside my spiritual guardians."',
      dreamNumberVibration: 9,
    },
    isFavorite: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const DreamSanctuaryView: React.FC<DreamSanctuaryViewProps> = ({ userProfile }) => {
  // Dream Logs
  const [dreamLogs, setDreamLogs] = useState<DreamEntry[]>(() => {
    const saved = localStorage.getItem(DREAM_LOG_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_DREAM_LOG;
  });

  // Calculator / Reader Form State
  const [isPastDream, setIsPastDream] = useState(false);
  const [dreamDate, setDreamDate] = useState(new Date().toISOString().slice(0, 10));
  const [approximateDate, setApproximateDate] = useState('');
  const [dreamTitle, setDreamTitle] = useState('');
  const [dreamNarrative, setDreamNarrative] = useState('');
  const [standoutKeywordsInput, setStandoutKeywordsInput] = useState('');
  const [selectedKeywordChips, setSelectedKeywordChips] = useState<string[]>([]);
  const [customKeyword, setCustomKeyword] = useState('');
  const [emotionalTone, setEmotionalTone] = useState('Mystified & Curious');
  const [dreamType, setDreamType] = useState<DreamType>('symbolic');

  // Calculation State
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentInterpretation, setCurrentInterpretation] = useState<DreamInterpretationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'reader' | 'log'>('reader');
  const [selectedLogEntry, setSelectedLogEntry] = useState<DreamEntry | null>(null);

  // 4-Digit PIN Security State
  const [storedPin, setStoredPin] = useState<string | null>(() => {
    return localStorage.getItem(DREAM_PIN_STORAGE_KEY);
  });
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(DREAM_PIN_STORAGE_KEY));
  });
  const [showPinModal, setShowPinModal] = useState<boolean>(false);

  // Search & Filter in Logs & Calendar
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date().toISOString().slice(0, 10));

  // Compute Calendar Markers for Dreams
  const markedDreamDates = React.useMemo(() => {
    const map: Record<string, CalendarMarker> = {};
    dreamLogs.forEach((d) => {
      if (d.date) {
        map[d.date] = {
          count: (map[d.date]?.count || 0) + 1,
          type: d.dreamType,
          isFavorite: d.isFavorite,
          label: `${d.title} (${d.dreamType})`
        };
      }
    });
    return map;
  }, [dreamLogs]);

  // Persist dreams
  const persistDreams = (updated: DreamEntry[]) => {
    setDreamLogs(updated);
    localStorage.setItem(DREAM_LOG_STORAGE_KEY, JSON.stringify(updated));
  };

  // Add keyword chip
  const handleToggleChip = (kw: string) => {
    if (selectedKeywordChips.includes(kw)) {
      setSelectedKeywordChips(selectedKeywordChips.filter((k) => k !== kw));
    } else {
      setSelectedKeywordChips([...selectedKeywordChips, kw]);
    }
  };

  const handleAddCustomKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customKeyword.trim();
    if (clean && !selectedKeywordChips.includes(clean)) {
      setSelectedKeywordChips([...selectedKeywordChips, clean]);
      setCustomKeyword('');
    }
  };

  // Calculate & Interpret Dream
  const handleCalculateDream = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!dreamNarrative.trim()) {
      setErrorMessage('Please describe what you dreamt in the narrative field.');
      return;
    }

    // Must include at least a couple words that stood out
    const allKeywords = [
      ...selectedKeywordChips,
      ...standoutKeywordsInput
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 0),
    ];
    const uniqueKeywords = Array.from(new Set(allKeywords));

    if (uniqueKeywords.length < 2) {
      setErrorMessage('⚠️ You must include at least 2 standout words/symbols that stood out in your dream to calculate its meaning.');
      return;
    }

    setIsCalculating(true);

    try {
      const result = await interpretDreamWithAI(
        dreamNarrative,
        uniqueKeywords,
        dreamType,
        emotionalTone,
        isPastDream,
        approximateDate,
        userProfile
      );

      setCurrentInterpretation(result);

      // Auto create new dream entry
      const newEntry: DreamEntry = {
        id: `dream-${Date.now()}`,
        date: dreamDate,
        isPastDream,
        approximateDate: isPastDream ? (approximateDate || dreamDate) : undefined,
        title: dreamTitle.trim() || `${uniqueKeywords.slice(0, 2).join(' & ')} - ${dreamType.toUpperCase()} Vision`,
        dreamNarrative,
        standoutKeywords: uniqueKeywords,
        emotionalTone,
        dreamType,
        interpretation: result,
        isFavorite: false,
        createdAt: new Date().toISOString(),
      };

      const updated = [newEntry, ...dreamLogs];
      persistDreams(updated);
      setSelectedLogEntry(newEntry);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to interpret dream. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleDeleteDream = (id: string) => {
    if (window.confirm('Delete this dream from your sacred chronicle?')) {
      const updated = dreamLogs.filter((d) => d.id !== id);
      persistDreams(updated);
      if (selectedLogEntry?.id === id) {
        setSelectedLogEntry(null);
      }
    }
  };

  const handleToggleFavorite = (id: string) => {
    const updated = dreamLogs.map((d) =>
      d.id === id ? { ...d, isFavorite: !d.isFavorite } : d
    );
    persistDreams(updated);
    if (selectedLogEntry?.id === id) {
      setSelectedLogEntry({
        ...selectedLogEntry,
        isFavorite: !selectedLogEntry.isFavorite,
      });
    }
  };

  const handleCopyDream = (d: DreamEntry) => {
    const text = `🌙 Cosmic Dream: ${d.title}\n📅 Date: ${d.isPastDream ? `${d.approximateDate || d.date} (Past Dream)` : d.date}\nType: ${d.dreamType.toUpperCase()} | Emotion: ${d.emotionalTone}\nStandout Symbols: ${d.standoutKeywords.join(', ')}\n\n✨ Dream Narrative:\n${d.dreamNarrative}\n\n🔮 Subconscious Interpretation:\n${d.interpretation.summary}\n\n🌟 Spiritual Guidance:\n${d.interpretation.spiritualSignificance}\n\n🕊️ Bedtime Lucid Ritual:\n${d.interpretation.lucidRitual}`;
    navigator.clipboard.writeText(text);
    setCopiedId(d.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportDreamCodex = () => {
    const md = dreamLogs
      .map(
        (d) =>
          `# 🌙 ${d.title}\n` +
          `**Date:** ${d.isPastDream ? `Past Dream (${d.approximateDate || d.date})` : d.date} | **Type:** ${d.dreamType.toUpperCase()}\n` +
          `**Emotional Frequency:** ${d.emotionalTone}\n` +
          `**Standout Keywords:** ${d.standoutKeywords.join(', ')}\n\n` +
          `### 📖 Dream Narrative\n${d.dreamNarrative}\n\n` +
          `### 🔮 Subconscious & Archetypal Interpretation\n${d.interpretation.summary}\n\n` +
          `### 🗝️ Standout Symbols Breakdown\n` +
          d.interpretation.keywordMeanings
            .map((k) => `- **${k.symbol}** (${k.archetype}): ${k.meaning}`)
            .join('\n') +
          `\n\n### 🕊️ Spiritual Guidance & Action\n${d.interpretation.guidanceAction}\n\n` +
          `### 🌌 Bedtime Lucid Ritual\n${d.interpretation.lucidRitual}\n\n---\n`
      )
      .join('\n');

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cosmic_Insights_Dream_Codex_${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = dreamLogs.filter((d) => {
    if (filterType === 'past' && !d.isPastDream) return false;
    if (filterType === 'recent' && d.isPastDream) return false;
    if (filterType === 'favorites' && !d.isFavorite) return false;
    if (filterType !== 'all' && filterType !== 'past' && filterType !== 'recent' && filterType !== 'favorites' && d.dreamType !== filterType) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = `${d.title} ${d.dreamNarrative} ${d.standoutKeywords.join(' ')} ${d.interpretation.summary}`.toLowerCase();
      return match.includes(q);
    }
    return true;
  });

  // If locked, render PIN lock screen
  if (isLocked && storedPin) {
    return (
      <PinLockScreen
        title="Dream Sanctuary Locked"
        subtitle="Enter your 4-digit PIN to access your subconscious dream logs, archetype interpretations, and nocturnal codex."
        badge="Dream Diary Privacy Protection"
        storedPin={storedPin}
        onUnlock={() => setIsLocked(false)}
        onResetPin={() => {
          localStorage.removeItem(DREAM_PIN_STORAGE_KEY);
          setStoredPin(null);
          setIsLocked(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-purple-900/50 pb-5">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <Moon className="h-4 w-4" />
          <span>Subconscious Oracle</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
          Dream Log and Interpretation
        </h1>
        <p className="text-xs text-purple-300/80 mt-1">
          Decode last night's visions or past unresolved dreams using standout symbols, Carl Jung's archetypes, and cosmic vibration frequencies.
        </p>
      </div>

      {/* PERMANENT FEATURED DREAMSCAPE ARTWORK BANNER - Positioned right under the subtitle */}
      <div className="relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden border border-purple-500/40 shadow-2xl bg-slate-950 aspect-[16/9] min-h-[180px]">
        <img
          src="/assets/dream.png"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = './assets/dream.png'; }}
          alt="Dreamscape Nocturnal Portal Artwork"
          className="w-full h-full object-cover rounded-3xl select-none"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Action tabs, PIN Security & Export Bar - Positioned under the photo */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-700/60 bg-slate-900/90 p-2 sm:p-2.5 shadow-xl">
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          {/* Dedicated Search Previous Dreams Button */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center space-x-1.5 rounded-xl border border-cyan-400/50 bg-cyan-500/10 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-sm cursor-pointer"
            title="Search previous dreams and nocturnal codex"
          >
            <Search className="h-3.5 w-3.5 text-cyan-400" />
            <span>Search Previous Dreams</span>
          </button>

          {/* Calendar Toggle Button */}
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className={`flex items-center space-x-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
              showCalendar
                ? 'border-purple-600 bg-purple-950/90 text-purple-200 shadow-sm'
                : 'border-purple-800/60 bg-slate-900/80 text-purple-300 hover:text-white'
            }`}
            title="Toggle Dream Calendar View"
          >
            <Calendar className="h-3.5 w-3.5 text-purple-400" />
            <span>{showCalendar ? 'Hide Calendar' : 'Dream Calendar'}</span>
          </button>

          {/* PIN Lock Security Button */}
          <button
            onClick={() => setShowPinModal(true)}
            className="flex items-center space-x-1.5 rounded-xl border border-purple-800/60 bg-slate-900/80 px-3.5 py-2 text-xs font-medium text-purple-200 hover:border-amber-400 hover:text-amber-300 transition-all cursor-pointer"
            title="Configure 4-Digit PIN Protection"
          >
            <KeyRound className="h-3.5 w-3.5 text-amber-400" />
            <span>{storedPin ? 'PIN Security' : 'Set 4-Digit PIN'}</span>
          </button>

          {/* Lock Now Button if PIN is configured */}
          {storedPin && (
            <button
              onClick={() => {
                setIsLocked(true);
              }}
              className="flex items-center space-x-1.5 rounded-xl bg-purple-900/80 border border-purple-600/50 px-3.5 py-2 text-xs font-semibold text-purple-100 hover:bg-purple-800 transition-all shadow-sm cursor-pointer"
              title="Immediately lock dream diary from view"
            >
              <Lock className="h-3.5 w-3.5 text-amber-300" />
              <span>Lock Now</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <div className="flex rounded-xl border border-purple-700/60 bg-slate-900/90 p-1 shadow-md">
            <button
              onClick={() => setActiveTab('reader')}
              className={`flex items-center space-x-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'reader'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border border-amber-400/50'
                  : 'text-purple-100 hover:text-white hover:bg-purple-950/60'
              }`}
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Dream Calculator</span>
            </button>
            <button
              onClick={() => setActiveTab('log')}
              className={`flex items-center space-x-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'log'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border border-amber-400/50'
                  : 'text-purple-100 hover:text-white hover:bg-purple-950/60'
              }`}
            >
              <BookOpen className="h-4 w-4 text-purple-300" />
              <span>Dream Log ({dreamLogs.length})</span>
            </button>
          </div>

          {dreamLogs.length > 0 && (
            <button
              onClick={handleExportDreamCodex}
              className="flex items-center space-x-1.5 rounded-xl border border-purple-800/60 bg-slate-900/80 px-3.5 py-2 text-xs font-medium text-purple-200 hover:border-amber-400 hover:text-amber-300 transition-all cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export Codex</span>
            </button>
          )}
        </div>
      </div>

      {/* Main View Mode */}
      {activeTab === 'reader' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Dream Input & Standout Keywords Calculator */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl border border-purple-800/60 bg-slate-900/90 p-6 shadow-2xl space-y-6">
              {/* Past Dream Switcher */}
              <div className="flex items-center justify-between rounded-2xl border border-purple-800/40 bg-purple-950/40 p-3.5">
                <div className="flex items-center space-x-2.5">
                  <History className="h-4 w-4 text-amber-400" />
                  <div>
                    <div className="text-xs font-bold text-slate-100">
                      Interpret a Past Dream?
                    </div>
                    <div className="text-[10px] text-purple-300/80">
                      Have a vivid dream from weeks, months, or years ago you want to decipher?
                    </div>
                  </div>
                </div>

                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={isPastDream}
                    onChange={(e) => setIsPastDream(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-950 border border-purple-700 peer-checked:bg-amber-500 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white" />
                </label>
              </div>

              <form onSubmit={handleCalculateDream} className="space-y-5">
                {/* Date Selection */}
                {isPastDream ? (
                  <div className="space-y-2 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300">
                      <Calendar className="h-4 w-4" />
                      <span>Past Dream Date or Timeframe</span>
                    </div>
                    <p className="text-[11px] text-purple-300/80">
                      Enter the exact date if remembered, or specify the approximate timeframe (e.g. "Summer 2022", "Around March 2020", "Childhood").
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-[10px] uppercase font-semibold text-purple-400">
                          Approximate Timeframe
                        </label>
                        <input
                          type="text"
                          value={approximateDate}
                          onChange={(e) => setApproximateDate(e.target.value)}
                          placeholder="e.g. Autumn 2023 or 2 years ago"
                          className="w-full rounded-xl border border-purple-800/60 bg-slate-950 px-3 py-2 text-xs text-amber-300 focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-semibold text-purple-400">
                          Calendar Date
                        </label>
                        <input
                          type="date"
                          value={dreamDate}
                          onChange={(e) => setDreamDate(e.target.value)}
                          className="w-full rounded-xl border border-purple-800/60 bg-slate-950 px-3 py-2 text-xs text-amber-300 focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-purple-300 flex items-center space-x-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-400" />
                      <span>Dream Date</span>
                    </label>
                    <input
                      type="date"
                      value={dreamDate}
                      onChange={(e) => setDreamDate(e.target.value)}
                      className="rounded-xl border border-purple-800/60 bg-slate-950 px-3 py-1 text-xs text-amber-300 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                )}

                {/* Dream Title (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-purple-200">
                    Dream Title / Short Headline (Optional)
                  </label>
                  <input
                    type="text"
                    value={dreamTitle}
                    onChange={(e) => setDreamTitle(e.target.value)}
                    placeholder="e.g., The Silver Key in the Ocean"
                    className="w-full rounded-xl border border-purple-800/60 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Dream Narrative */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-purple-200">
                      What Did You Dream? (Dream Narrative)
                    </label>
                    <span className="text-[10px] text-purple-400">
                      {dreamNarrative.length} characters
                    </span>
                  </div>
                  <textarea
                    value={dreamNarrative}
                    onChange={(e) => setDreamNarrative(e.target.value)}
                    placeholder="Describe everything you can recall: the setting, colors, people, actions, strange sensations, transformations, or messages spoken..."
                    rows={5}
                    className="w-full rounded-2xl border border-purple-800/60 bg-slate-950 p-4 text-xs text-slate-100 leading-relaxed placeholder:text-purple-400/40 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                  />
                </div>

                {/* CRITICAL REQUIREMENT: Standout Words / Symbols to Calculate */}
                <div className="space-y-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-1.5 text-xs font-bold text-amber-300">
                      <Tag className="h-4 w-4 text-amber-400" />
                      <span>Standout Words & Core Symbols (Required: 2+)</span>
                    </label>
                    <span className="text-[10px] font-bold text-amber-400">
                      {selectedKeywordChips.length} selected
                    </span>
                  </div>

                  <p className="text-[11px] text-purple-200/80">
                    The calculator requires at least a couple of standout words or symbols that vividly stuck with you in the dream:
                  </p>

                  {/* Popular Archetypal Chips */}
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                    {POPULAR_STANDOUT_KEYWORDS.map((kw) => {
                      const isSelected = selectedKeywordChips.includes(kw);
                      return (
                        <button
                          type="button"
                          key={kw}
                          onClick={() => handleToggleChip(kw)}
                          className={`rounded-xl px-2.5 py-1 text-[11px] font-medium transition-all ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 font-bold shadow'
                              : 'bg-slate-950 border border-purple-900 text-purple-300 hover:border-purple-600'
                          }`}
                        >
                          {isSelected ? `✓ ${kw}` : `+ ${kw}`}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Keyword Input */}
                  <div className="flex space-x-2 pt-1">
                    <input
                      type="text"
                      value={customKeyword}
                      onChange={(e) => setCustomKeyword(e.target.value)}
                      placeholder="Add custom standout word (e.g. Purple violin, Staircase)..."
                      className="flex-1 rounded-xl border border-purple-800/60 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 placeholder:text-purple-400/40 focus:border-amber-400 focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomKeyword(e);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomKeyword}
                      className="rounded-xl border border-purple-700 bg-purple-900/60 px-3 py-1.5 text-xs font-semibold text-purple-200 hover:bg-purple-800"
                    >
                      Add Symbol
                    </button>
                  </div>
                </div>

                {/* Dream Type & Emotional Tone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-purple-300">
                      Dream State / Type
                    </label>
                    <select
                      value={dreamType}
                      onChange={(e) => setDreamType(e.target.value as DreamType)}
                      className="w-full rounded-xl border border-purple-800/60 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                    >
                      <option value="symbolic">Symbolic / Archetypal</option>
                      <option value="lucid">Lucid (Conscious Awareness)</option>
                      <option value="prophetic">Prophetic / Precognitive</option>
                      <option value="recurring">Recurring Soul Pattern</option>
                      <option value="nightmare">Shadow / Pressure-Valve</option>
                      <option value="astral">Astral Exploration</option>
                      <option value="healing">Restorative / Healing Bath</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-purple-300">
                      Emotional Tone upon Waking
                    </label>
                    <input
                      type="text"
                      value={emotionalTone}
                      onChange={(e) => setEmotionalTone(e.target.value)}
                      placeholder="e.g. Euphoric, Mystified, Anxious..."
                      className="w-full rounded-xl border border-purple-800/60 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="flex items-center space-x-2 rounded-xl border border-rose-800/60 bg-rose-950/40 p-3 text-xs text-rose-300">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Calculate Dream Button */}
                <button
                  type="submit"
                  disabled={isCalculating}
                  className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 py-3.5 font-serif text-sm font-bold text-white shadow-xl shadow-purple-950/80 hover:opacity-95 disabled:opacity-50 transition-all"
                >
                  <Sparkles className={`h-4 w-4 ${isCalculating ? 'animate-spin' : ''}`} />
                  <span>
                    {isCalculating
                      ? 'Decoding Subconscious Matrix...'
                      : isPastDream
                      ? 'Calculate & Log Past Dream Interpretation'
                      : 'Calculate & Interpret Dream'}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Live Dream Interpretation Breakdown */}
          <div className="lg:col-span-6 space-y-6">
            {currentInterpretation ? (
              <div className="rounded-3xl border border-amber-500/40 bg-slate-900/95 p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
                {/* Interpretation Header */}
                <div className="flex items-center justify-between border-b border-purple-900/50 pb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-serif text-lg font-bold text-slate-100">
                        Subconscious Synthesis
                      </h2>
                      <div className="text-[11px] text-amber-400 flex items-center space-x-2">
                        <span>Vibrational Frequency: #{currentInterpretation.dreamNumberVibration}</span>
                        <span>•</span>
                        <span>{dreamType.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('log')}
                    className="rounded-xl border border-purple-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-purple-200 hover:border-amber-400 hover:text-amber-300 transition-all"
                  >
                    View in Dream Log →
                  </button>
                </div>

                {/* Synthesis Narrative */}
                <div className="rounded-2xl border border-purple-800/40 bg-purple-950/30 p-4 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Cosmic Interpretation
                  </div>
                  <p className="text-xs text-purple-100/90 leading-relaxed whitespace-pre-wrap">
                    {currentInterpretation.summary}
                  </p>
                </div>

                {/* Standout Keywords Breakdown */}
                <div className="space-y-3">
                  <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-amber-400">
                    Standout Symbols & Archetype Matrix
                  </h3>
                  <div className="space-y-2.5">
                    {currentInterpretation.keywordMeanings.map((km, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-purple-800/40 bg-slate-950/80 p-3.5 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-xs font-bold text-amber-300">
                            🗝️ {km.symbol}
                          </span>
                          <span className="rounded-md bg-purple-950 px-2 py-0.5 text-[9px] font-semibold text-purple-300">
                            {km.archetype}
                          </span>
                        </div>
                        <p className="text-xs text-purple-200/90 leading-relaxed">
                          {km.meaning}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subconscious & Spiritual Guidance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-indigo-900/50 bg-indigo-950/20 p-3.5 space-y-1">
                    <div className="text-[11px] font-bold text-indigo-300">
                      Subconscious Whisper
                    </div>
                    <p className="text-xs text-purple-200/90">
                      {currentInterpretation.subconsciousMessage}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-rose-900/50 bg-rose-950/20 p-3.5 space-y-1">
                    <div className="text-[11px] font-bold text-rose-300">
                      Shadow Work & Release
                    </div>
                    <p className="text-xs text-purple-200/90">
                      {currentInterpretation.shadowWorkAspect}
                    </p>
                  </div>
                </div>

                {/* Action & Lucid Ritual */}
                <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-purple-950/30 p-4 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300">
                    <Feather className="h-4 w-4 text-amber-400" />
                    <span>Tonight's Bedtime Lucid Ritual</span>
                  </div>
                  <p className="text-xs text-slate-200 italic leading-relaxed">
                    "{currentInterpretation.lucidRitual}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-purple-800/40 bg-slate-900/50 p-10 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-950/60 border border-purple-800/50 text-purple-300">
                  <Moon className="h-8 w-8" />
                </div>
                <div className="space-y-1.5 max-w-sm mx-auto">
                  <h3 className="font-serif text-lg font-bold text-slate-100">
                    Subconscious Sanctuary Awaiting
                  </h3>
                  <p className="text-xs text-purple-300/80 leading-relaxed">
                    Describe your dream on the left and select at least 2 standout symbols to calculate its hidden archetypal meaning, spiritual omen, and lucid dreaming ritual.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Dream Log Chronicles View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Log List & Dream Calendar */}
          <div className="lg:col-span-5 space-y-4">
            {/* Dream Log Calendar Navigation */}
            {showCalendar && (
              <div className="animate-in fade-in zoom-in-95 duration-200">
                <JournalCalendar
                  selectedDate={selectedCalendarDate}
                  onSelectDate={(date) => {
                    setSelectedCalendarDate(date);
                    // Find if any dream exists on this date and select it
                    const match = dreamLogs.find((d) => d.date === date);
                    if (match) {
                      setSelectedLogEntry(match);
                    }
                  }}
                  markedDates={markedDreamDates}
                  variant="dreams"
                  title="Dream Log Calendar"
                />
              </div>
            )}

            <div className="rounded-3xl border border-purple-800/60 bg-slate-900/90 p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-amber-400" />
                  <h3 className="font-serif text-base font-bold text-slate-100">
                    Sacred Dream Chronicles
                  </h3>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setShowSearchModal(true)}
                    className="rounded-lg bg-cyan-500/10 border border-cyan-400/40 px-2 py-1 text-[10px] font-bold text-cyan-300 hover:bg-cyan-500/20 flex items-center space-x-1"
                  >
                    <Search className="h-3 w-3" />
                    <span>Search Dreams</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('reader')}
                    className="flex items-center space-x-1 rounded-xl bg-purple-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-purple-500 transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>New Interpretation</span>
                  </button>
                </div>
              </div>

              {/* Search & Filter */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-purple-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search symbols, titles, narratives..."
                    className="w-full rounded-xl border border-purple-800/50 bg-slate-950 pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-purple-400/40 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-1">
                  {['all', 'favorites', 'recent', 'past', 'lucid', 'prophetic', 'symbolic'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold capitalize shrink-0 transition-all ${
                        filterType === t
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-950 border border-purple-900/50 text-purple-300 hover:border-purple-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* List */}
              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((entry) => (
                    <div
                      key={entry.id}
                      onClick={() => setSelectedLogEntry(entry)}
                      className={`group cursor-pointer rounded-2xl border p-4 shadow-lg space-y-2.5 transition-all ${
                        selectedLogEntry?.id === entry.id
                          ? 'border-amber-400 bg-purple-950/40 shadow-amber-500/10'
                          : 'border-purple-800/40 bg-slate-950/80 hover:border-purple-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-xs font-bold text-slate-100 line-clamp-1">
                          {entry.title}
                        </span>

                        <div className="flex items-center space-x-1">
                          {entry.isPastDream && (
                            <span className="rounded-md bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                              PAST
                            </span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(entry.id);
                            }}
                            className={`p-1 rounded-md ${
                              entry.isFavorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-300'
                            }`}
                          >
                            <Star className={`h-3.5 w-3.5 ${entry.isFavorite ? 'fill-amber-400' : ''}`} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDream(entry.id);
                            }}
                            className="p-1 rounded-md text-slate-600 hover:text-rose-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-purple-200/80 line-clamp-2">
                        {entry.dreamNarrative}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-purple-400 pt-1 border-t border-purple-950">
                        <span>
                          {entry.isPastDream
                            ? entry.approximateDate || entry.date
                            : new Date(entry.date).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-1">
                          {entry.standoutKeywords.map((k, i) => (
                            <span key={i} className="rounded bg-purple-900/50 px-1 py-0.5 text-[8px] text-amber-200">
                              #{k}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-purple-900/40 bg-slate-950/40 p-8 text-center space-y-2">
                    <Moon className="h-6 w-6 text-amber-400 mx-auto" />
                    <p className="text-xs text-purple-300">
                      No dreams found matching this filter.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Selected Dream Full Detail */}
          <div className="lg:col-span-7 space-y-6">
            {selectedLogEntry ? (
              <div className="rounded-3xl border border-purple-800/60 bg-slate-900/90 p-6 shadow-2xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-purple-900/50 pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-serif text-lg font-bold text-slate-100">
                        {selectedLogEntry.title}
                      </span>
                      {selectedLogEntry.isPastDream && (
                        <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                          Past Dream
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-purple-400 mt-1">
                      📅 Date: {selectedLogEntry.isPastDream ? (selectedLogEntry.approximateDate || selectedLogEntry.date) : selectedLogEntry.date} • Type: {selectedLogEntry.dreamType.toUpperCase()} • Tone: {selectedLogEntry.emotionalTone}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyDream(selectedLogEntry)}
                    className="flex items-center space-x-1.5 rounded-xl border border-purple-800 bg-slate-950 px-3 py-1.5 text-xs text-purple-200 hover:border-amber-400 hover:text-amber-300 transition-all"
                  >
                    {copiedId === selectedLogEntry.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Entry</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Dream Narrative */}
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    Dream Narrative Record
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-purple-900/50 whitespace-pre-wrap">
                    {selectedLogEntry.dreamNarrative}
                  </p>
                </div>

                {/* Standout Keywords */}
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Standout Symbols & Meanings
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedLogEntry.interpretation.keywordMeanings.map((km, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-purple-800/40 bg-slate-950 p-3.5 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-xs font-bold text-amber-300">
                            🗝️ {km.symbol}
                          </span>
                          <span className="rounded bg-purple-950 px-1.5 py-0.5 text-[8px] text-purple-300">
                            {km.archetype}
                          </span>
                        </div>
                        <p className="text-[11px] text-purple-200/90 leading-relaxed">
                          {km.meaning}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full Interpretation Summary */}
                <div className="rounded-2xl border border-purple-800/40 bg-purple-950/30 p-4 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Subconscious Interpretation & Soul Meaning
                  </div>
                  <p className="text-xs text-purple-100/90 leading-relaxed whitespace-pre-wrap">
                    {selectedLogEntry.interpretation.summary}
                  </p>
                </div>

                {/* Lucid Ritual */}
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-1.5">
                  <div className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                    <Feather className="h-4 w-4" />
                    <span>Bedtime Lucid Dreaming Ritual</span>
                  </div>
                  <p className="text-xs text-slate-200 italic">
                    "{selectedLogEntry.interpretation.lucidRitual}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-purple-800/40 bg-slate-900/50 p-12 text-center space-y-3">
                <BookOpen className="h-8 w-8 text-purple-400 mx-auto" />
                <h3 className="font-serif text-base font-bold text-slate-100">
                  Select a Dream to Review
                </h3>
                <p className="text-xs text-purple-300/80 max-w-sm mx-auto">
                  Click on any dream entry from your chronicle list on the left to read its complete subconscious interpretation.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4-Digit PIN Security Modal */}
      <PinSecurityModal
        title="Dream Diary"
        storageKey={DREAM_PIN_STORAGE_KEY}
        currentStoredPin={storedPin}
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onPinSaved={(newPin) => {
          setStoredPin(newPin);
        }}
        onPinRemoved={() => {
          setStoredPin(null);
          setIsLocked(false);
        }}
      />

      {/* Search Previous Dreams Modal */}
      <DreamSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        dreams={dreamLogs}
        onSelectDream={(dream) => {
          setSelectedLogEntry(dream);
          setSelectedCalendarDate(dream.date);
          setActiveTab('log');
          setShowSearchModal(false);
        }}
      />
    </div>
  );
};
