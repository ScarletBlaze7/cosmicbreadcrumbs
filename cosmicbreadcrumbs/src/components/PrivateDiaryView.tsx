import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  Shield,
  ShieldCheck,
  Sunrise,
  Sunset,
  Sparkles,
  Star,
  Calendar,
  Heart,
  Plus,
  Trash2,
  Edit3,
  Check,
  Copy,
  Download,
  Search,
  Eye,
  EyeOff,
  Flame,
  Award,
  Zap,
  BookMarked,
  BookOpen,
  Moon,
  Compass,
  Hash,
  Feather
} from 'lucide-react';
import { DiaryEntry, JournalEntry, UserProfile } from '../types';
import { triggerFireworkBurst } from '../utils/fireworks';
import { PinLockScreen } from './PinLockScreen';
import { PinSecurityModal } from './PinSecurityModal';
import { JournalCalendar, CalendarMarker } from './JournalCalendar';
import { JournalSearchModal } from './JournalSearchModal';

interface PrivateDiaryViewProps {
  userProfile: UserProfile;
  journalEntries?: JournalEntry[];
  onDeleteJournalEntry?: (id: string) => void;
  onToggleJournalFavorite?: (id: string) => void;
  initialTab?: 'diary' | 'keepsakes';
}

const DEFAULT_PIN_STORAGE_KEY = 'cosmic_diary_pin';
const DIARY_ENTRIES_STORAGE_KEY = 'cosmic_diary_entries';

const INSPIRATIONAL_PROMPTS = [
  "What subtle whisper or gut feeling did you notice first upon waking today?",
  "If you closed your eyes and asked your soul what today needs, what is the single word that emerges?",
  "What synchronicity or 'coincidence' today felt divinely orchestrated?",
  "How did today's tarot or astrological reading reflect in the real-world choices you made?",
  "What is one truth you want your future self to remember about this exact chapter?",
  "What emotion or fear are you ready to release into the cosmos tonight?"
];

export const PrivateDiaryView: React.FC<PrivateDiaryViewProps> = ({ 
  userProfile,
  journalEntries = [],
  onDeleteJournalEntry,
  onToggleJournalFavorite,
  initialTab = 'diary'
}) => {
  // Active Section Tab
  const [activeTab, setActiveTab] = useState<'diary' | 'keepsakes'>(initialTab);

  // Lock & Security State
  const [storedPin, setStoredPin] = useState<string | null>(() => {
    return localStorage.getItem(DEFAULT_PIN_STORAGE_KEY);
  });
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(DEFAULT_PIN_STORAGE_KEY));
  });
  const [showPinModal, setShowPinModal] = useState(false);

  // Diary Entries
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem(DIARY_ENTRIES_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'diary-demo-1',
        date: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
        morningIntuition: "I sensed this morning would bring an unexpected breakthrough in my creative project, and felt a gentle pull toward reaching out to an old mentor.",
        eveningReflection: "My intuition was right on target! A surprise email arrived at 2 PM with the exact collaboration opportunity I visualized. The day felt calm yet productive.",
        readingAccuracyRating: 5,
        accuracyNotes: "The daily reading predicted 'A serendipitous messenger carrying silver keys'—and the email arrived right during the power hour!",
        dailyThoughts: "Writing this for my future self: Trust the initial spark. Whenever you feel that quiet hum in your heart before the day starts, don't let logical doubt drown it out. You are becoming sharper, calmer, and more aligned with the rhythms of the cosmos.",
        mood: 'radiant',
        tags: ['Intuition', 'Breakthrough', 'Synchronicity'],
        isFavorite: true,
      }
    ];
  });

  // Current Form State
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [morningIntuition, setMorningIntuition] = useState('');
  const [eveningReflection, setEveningReflection] = useState('');
  const [readingAccuracyRating, setReadingAccuracyRating] = useState<number>(5);
  const [accuracyNotes, setAccuracyNotes] = useState('');
  const [dailyThoughts, setDailyThoughts] = useState('');
  const [mood, setMood] = useState<DiaryEntry['mood']>('peaceful');
  const [tagsInput, setTagsInput] = useState('Intuition, Daily Reflection');
  const [isEditingId, setIsEditingId] = useState<string | null>(null);

  // Diary Filter & Search & Calendar Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [randomPromptIndex, setRandomPromptIndex] = useState(0);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);

  // Keepsakes Filter
  const [keepsakeFilter, setKeepsakeFilter] = useState<'all' | 'affirmation' | 'tarot' | 'horoscope' | 'angel' | 'numerology' | 'favorites'>('all');
  const [copiedKeepsakeId, setCopiedKeepsakeId] = useState<string | null>(null);

  // Sync diary entries on external custom event or storage
  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem(DIARY_ENTRIES_STORAGE_KEY);
      if (saved) {
        try {
          setEntries(JSON.parse(saved));
        } catch (e) {}
      }
    };
    window.addEventListener('auranova-diary-updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('auranova-diary-updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Compute Calendar Markers
  const markedDiaryDates = React.useMemo(() => {
    const map: Record<string, CalendarMarker> = {};
    entries.forEach((e) => {
      map[e.date] = {
        count: 1,
        mood: e.mood,
        isFavorite: e.isFavorite,
        label: `${e.date} (${e.mood})`
      };
    });
    return map;
  }, [entries]);

  // Save entries to localStorage
  const persistEntries = (updated: DiaryEntry[]) => {
    setEntries(updated);
    localStorage.setItem(DIARY_ENTRIES_STORAGE_KEY, JSON.stringify(updated));
  };

  // Load entry into editor if exists for selectedDate
  useEffect(() => {
    const existing = entries.find((e) => e.date === selectedDate);
    if (existing && !isEditingId) {
      setMorningIntuition(existing.morningIntuition || '');
      setEveningReflection(existing.eveningReflection || '');
      setReadingAccuracyRating(existing.readingAccuracyRating || 5);
      setAccuracyNotes(existing.accuracyNotes || '');
      setDailyThoughts(existing.dailyThoughts || '');
      setMood(existing.mood || 'peaceful');
      setTagsInput(existing.tags ? existing.tags.join(', ') : '');
    } else if (!isEditingId) {
      setMorningIntuition('');
      setEveningReflection('');
      setReadingAccuracyRating(5);
      setAccuracyNotes('');
      setDailyThoughts('');
      setMood('peaceful');
      setTagsInput('Intuition, Daily Reflection');
    }
  }, [selectedDate, entries, isEditingId]);

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!morningIntuition && !eveningReflection && !dailyThoughts) {
      alert('Please write at least a sentence or two to preserve your sacred daily thoughts!');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const existingIndex = entries.findIndex((item) => item.date === selectedDate || item.id === isEditingId);

    const newEntry: DiaryEntry = {
      id: isEditingId || `diary-${Date.now()}`,
      date: selectedDate,
      createdAt: new Date().toISOString(),
      morningIntuition,
      eveningReflection,
      readingAccuracyRating,
      accuracyNotes,
      dailyThoughts,
      mood,
      tags: tagsArray.length > 0 ? tagsArray : ['Intuition'],
      isFavorite: false,
    };

    let updated: DiaryEntry[];
    if (existingIndex >= 0) {
      updated = [...entries];
      updated[existingIndex] = { ...updated[existingIndex], ...newEntry };
    } else {
      updated = [newEntry, ...entries];
    }

    persistEntries(updated);
    setIsEditingId(null);

    // Fireworks starburst celebration
    triggerFireworkBurst({
      particleCount: 70,
    });
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you wish to delete this sacred diary entry?')) {
      const updated = entries.filter((e) => e.id !== id);
      persistEntries(updated);
    }
  };

  const handleToggleFavorite = (id: string) => {
    const updated = entries.map((e) =>
      e.id === id ? { ...e, isFavorite: !e.isFavorite } : e
    );
    persistEntries(updated);
  };

  const handleCopyEntry = (e: DiaryEntry) => {
    const text = `📖 Cosmic Diary Entry: ${e.date}\nMood: ${e.mood.toUpperCase()} | Reading Accuracy: ${e.readingAccuracyRating}/5 ⭐\n\n🌅 Morning Intuition:\n${e.morningIntuition || 'N/A'}\n\n🌙 Evening Reflection:\n${e.eveningReflection || 'N/A'}\n\n✨ Accuracy Notes:\n${e.accuracyNotes || 'N/A'}\n\n✍️ Sacred Diary:\n${e.dailyThoughts || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopiedId(e.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportDiary = () => {
    const markdown = entries
      .map(
        (e) =>
          `# Sacred Cosmic Diary - ${e.date}\n` +
          `**Mood:** ${e.mood.toUpperCase()} | **Reading Accuracy:** ${e.readingAccuracyRating}/5 Stars\n` +
          `**Tags:** ${e.tags.join(', ')}\n\n` +
          `### 🌅 Morning Intuition & Daily Forecast\n${e.morningIntuition || '*(Not recorded)*'}\n\n` +
          `### 🌙 Evening Reflection\n${e.eveningReflection || '*(Not recorded)*'}\n\n` +
          `### 🔮 Reading Accuracy Notes\n${e.accuracyNotes || '*(Not recorded)*'}\n\n` +
          `### ✍️ Private Thoughts for Future Self\n${e.dailyThoughts || '*(Not recorded)*'}\n\n` +
          `---\n`
      )
      .join('\n');

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cosmic_Private_Diary_${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Keepsakes Actions
  const handleCopyKeepsake = (e: JournalEntry) => {
    const text = `🌟 ${e.title}\n📅 ${new Date(e.date).toLocaleDateString()}\n\n${e.content}`;
    navigator.clipboard.writeText(text);
    setCopiedKeepsakeId(e.id);
    setTimeout(() => setCopiedKeepsakeId(null), 2000);
  };

  const handleExportKeepsakes = () => {
    const allText = journalEntries
      .map(
        (e) =>
          `# ${e.title}\nDate: ${new Date(e.date).toLocaleDateString()}\nCategory: ${e.type.toUpperCase()}\n\n${e.content}\n\n---\n`
      )
      .join('\n');

    const blob = new Blob([allText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cosmic_Mystic_Keepsakes_${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getKeepsakeTypeIcon = (type: string) => {
    switch (type) {
      case 'tarot':
        return <Moon className="h-4 w-4 text-purple-400" />;
      case 'horoscope':
        return <Compass className="h-4 w-4 text-amber-400" />;
      case 'angel':
        return <Feather className="h-4 w-4 text-rose-400" />;
      case 'numerology':
        return <Hash className="h-4 w-4 text-indigo-400" />;
      default:
        return <Sparkles className="h-4 w-4 text-amber-400" />;
    }
  };

  const filteredKeepsakes = journalEntries.filter((e) => {
    if (keepsakeFilter === 'favorites') return e.isFavorite;
    if (keepsakeFilter === 'all') return true;
    return e.type === keepsakeFilter;
  });

  // Stats
  const totalEntries = entries.length;
  const avgAccuracy =
    entries.length > 0
      ? (entries.reduce((acc, curr) => acc + (curr.readingAccuracyRating || 5), 0) / entries.length).toFixed(1)
      : '5.0';

  const filteredEntries = entries.filter((e) => {
    if (filterMood !== 'all' && e.mood !== filterMood) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${e.morningIntuition} ${e.eveningReflection} ${e.dailyThoughts} ${e.accuracyNotes} ${e.tags.join(' ')}`.toLowerCase();
      return matchText.includes(q);
    }
    return true;
  });

  // Locked Screen
  if (isLocked && storedPin) {
    return (
      <PinLockScreen
        title="Daily Log/Journal Locked"
        subtitle="Enter your 4-digit PIN to access your private daily reflections, intuitive forecasts, and saved readings & guidance archive."
        badge="Daily Log & Journal Privacy Protection"
        storedPin={storedPin}
        onUnlock={() => setIsLocked(false)}
        onResetPin={() => {
          localStorage.removeItem(DEFAULT_PIN_STORAGE_KEY);
          setStoredPin(null);
          setIsLocked(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-16">
      <div className="border-b border-purple-900/50 pb-5">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
          <BookMarked className="h-4 w-4" />
          <span>Sacred Intuition Diary & Saved Readings</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
          Daily Log/Journal
        </h1>
        <p className="text-xs text-purple-300/80 mt-1">
          Log unlimited personal reflections, track daily intuitive accuracy, and cherish your saved readings & cosmic guidance.
        </p>
      </div>

      {/* PERMANENT FEATURED JOURNAL ARTWORK BANNER - Directly under the subtitle */}
      <div className="relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden border border-purple-500/40 shadow-2xl bg-slate-950 aspect-[16/9] min-h-[180px]">
        <img
          src="/assets/journal.jpg"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = './assets/journal.jpg'; }}
          alt="Daily Log and Mystic Journal"
          className="w-full h-full object-cover rounded-3xl select-none"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Security & Action buttons - Positioned under the photo */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-700/60 bg-slate-900/90 p-2 sm:p-2.5 shadow-xl">
        {/* Main Sub-Navigation Tabs */}
        <div className="flex rounded-xl border border-purple-700/60 bg-slate-900/90 p-1 shadow-md">
          <button
            id="tab-view-private-diary"
            onClick={() => setActiveTab('diary')}
            className={`flex items-center space-x-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'diary'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border border-amber-400/50'
                : 'text-purple-100 hover:text-white hover:bg-purple-950/60'
            }`}
          >
            <BookMarked className="h-3.5 w-3.5 text-amber-300" />
            <span>Private Diary ({entries.length})</span>
          </button>

          <button
            id="tab-view-mystic-keepsakes"
            onClick={() => setActiveTab('keepsakes')}
            className={`flex items-center space-x-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'keepsakes'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border border-amber-400/50'
                : 'text-purple-100 hover:text-white hover:bg-purple-950/60'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-rose-300" />
            <span>Saved Readings ({journalEntries.length})</span>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          {/* Dedicated Search Previous Thoughts Button */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center space-x-1.5 rounded-xl border border-amber-400/50 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 transition-all shadow-sm cursor-pointer"
            title="Search previous thoughts and journal chronicles"
          >
            <Search className="h-3.5 w-3.5 text-amber-400" />
            <span>Search Thoughts</span>
          </button>

          {/* Calendar Toggle Button */}
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className={`flex items-center space-x-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
              showCalendar
                ? 'border-purple-600 bg-purple-950/90 text-purple-200 shadow-sm'
                : 'border-purple-800/60 bg-slate-900/80 text-purple-300 hover:text-white'
            }`}
            title="Toggle Calendar Navigation View"
          >
            <Calendar className="h-3.5 w-3.5 text-purple-400" />
            <span>{showCalendar ? 'Hide Calendar' : 'Calendar'}</span>
          </button>

          <button
            onClick={() => setShowPinModal(true)}
            className="flex items-center space-x-1.5 rounded-xl border border-purple-800/60 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-purple-200 hover:border-amber-400 hover:text-amber-300 transition-all cursor-pointer"
            title="Configure 4-Digit PIN Protection"
          >
            <KeyRound className="h-3.5 w-3.5 text-amber-400" />
            <span>{storedPin ? 'PIN' : 'Set PIN'}</span>
          </button>

          {storedPin && (
            <button
              onClick={() => {
                setIsLocked(true);
              }}
              className="flex items-center space-x-1.5 rounded-xl bg-purple-900/80 border border-purple-600/50 px-3.5 py-2 text-xs font-bold text-purple-100 hover:bg-purple-800 transition-all shadow-sm cursor-pointer"
              title="Immediately lock sanctuary from view"
            >
              <Lock className="h-3.5 w-3.5 text-amber-300" />
              <span>Lock</span>
            </button>
          )}

          {activeTab === 'diary' && entries.length > 0 && (
            <button
              onClick={handleExportDiary}
              className="flex items-center space-x-1.5 rounded-xl border border-purple-800/60 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-purple-200 hover:border-amber-400 hover:text-amber-300 transition-all cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Export Diary</span>
            </button>
          )}

          {activeTab === 'keepsakes' && journalEntries.length > 0 && (
            <button
              onClick={handleExportKeepsakes}
              className="flex items-center space-x-1.5 rounded-xl border border-purple-800/60 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-purple-200 hover:border-amber-400 hover:text-amber-300 transition-all cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Export Readings</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: PRIVATE DIARY & INTUITION LOG */}
      {activeTab === 'diary' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Intuition & Accuracy Analytics Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-purple-800/40 bg-slate-900/80 p-4 shadow-lg flex items-center space-x-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                  Total Chronicles
                </div>
                <div className="font-serif text-lg font-bold text-slate-100">
                  {totalEntries} Entries Logged
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-purple-800/40 bg-slate-900/80 p-4 shadow-lg flex items-center space-x-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                  Avg Cosmic Accuracy
                </div>
                <div className="font-serif text-lg font-bold text-slate-100 flex items-center space-x-1">
                  <span>{avgAccuracy}</span>
                  <span className="text-xs text-amber-400 font-sans">/ 5.0 ⭐</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-purple-800/40 bg-slate-900/80 p-4 shadow-lg flex items-center space-x-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                <Zap className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                  Intuitive Channel
                </div>
                <div className="font-serif text-sm font-bold text-indigo-200">
                  {totalEntries >= 10 ? 'Master High Priestess / Seer' : totalEntries >= 3 ? 'Active Intuitive Channel' : 'Awakening Seeker'}
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Prompt for Future Self */}
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                  <Sparkles className="h-4 w-4" />
                  <span>Intuitive Spark for Your Future Self</span>
                </div>
                <p className="font-serif text-sm sm:text-base text-slate-200 italic">
                  "{INSPIRATIONAL_PROMPTS[randomPromptIndex]}"
                </p>
                <p className="text-[11px] text-purple-300/70">
                  Even just 1 or 2 sentences written every morning & evening builds an indelible archive of divine syncs for the years ahead.
                </p>
              </div>
              <button
                onClick={() => setRandomPromptIndex((prev) => (prev + 1) % INSPIRATIONAL_PROMPTS.length)}
                className="shrink-0 rounded-xl border border-purple-700/50 bg-slate-950/70 px-2.5 py-1 text-[11px] font-bold text-purple-200 hover:border-amber-400 hover:text-amber-300 transition-colors"
              >
                New Prompt ↻
              </button>
            </div>
          </div>

          {/* Dual Column Layout: Editor on Left, Historical Entries on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Active Diary Editor */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-3xl border border-purple-800/60 bg-slate-900/90 p-6 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-purple-900/50 pb-4">
                  <div className="flex items-center space-x-2">
                    <Edit3 className="h-5 w-5 text-amber-400" />
                    <h2 className="font-serif text-lg font-bold text-slate-100">
                      {isEditingId ? 'Edit Sacred Entry' : 'Today\'s Sanctuary Entry'}
                    </h2>
                  </div>

                  {/* Date Selector */}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-purple-400" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="rounded-xl border border-purple-800/60 bg-slate-950 px-3 py-1 text-xs font-mono font-bold text-amber-300 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <form onSubmit={handleSaveEntry} className="space-y-6">
                  {/* Section 1: Morning Intuition */}
                  <div className="space-y-2 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                        <Sunrise className="h-4 w-4 text-amber-400" />
                        <span>Morning Intuition & Pre-Cognitive Forecast</span>
                      </label>
                      <span className="text-[10px] font-bold text-amber-400/80">Start of Day</span>
                    </div>
                    <p className="text-[11px] text-purple-300/80">
                      Close your eyes for 5 seconds. How do you intuitively feel today will unfold? What energies or encounters do you foresee?
                    </p>
                    <textarea
                      value={morningIntuition}
                      onChange={(e) => setMorningIntuition(e.target.value)}
                      placeholder="e.g., I sense a calm energy around noon, but an important intuitive decision regarding communication in the afternoon..."
                      rows={3}
                      className="w-full rounded-xl border border-purple-900/60 bg-slate-950/90 p-3 text-xs text-slate-100 placeholder:text-purple-400/40 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                    />
                  </div>

                  {/* Section 2: Evening Reflection & Accuracy Review */}
                  <div className="space-y-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 text-xs font-bold text-indigo-300">
                        <Sunset className="h-4 w-4 text-indigo-400" />
                        <span>Evening Reflection & Cosmic Reading Accuracy</span>
                      </label>
                      <span className="text-[10px] font-bold text-indigo-400/80">End of Day</span>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center justify-between bg-slate-950/70 rounded-xl p-3 border border-purple-900/40">
                      <span className="text-xs font-bold text-purple-200">
                        How accurate did your daily reading feel?
                      </span>
                      <div className="flex items-center space-x-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReadingAccuracyRating(star)}
                            className="p-1 transition-transform hover:scale-125"
                          >
                            <Star
                              className={`h-5 w-5 ${
                                star <= readingAccuracyRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-amber-400 ml-1">
                          {readingAccuracyRating}/5
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-purple-300">
                        What synchronicity or accuracy details stood out?
                      </label>
                      <input
                        type="text"
                        value={accuracyNotes}
                        onChange={(e) => setAccuracyNotes(e.target.value)}
                        placeholder="e.g., The tarot card predicted a new contract and the client signed at 3 PM!"
                        className="w-full rounded-xl border border-purple-900/60 bg-slate-950/90 px-3 py-2 text-xs text-slate-100 placeholder:text-purple-400/40 focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-purple-300">
                        Evening Wrap-up & Lessons Learned:
                      </label>
                      <textarea
                        value={eveningReflection}
                        onChange={(e) => setEveningReflection(e.target.value)}
                        placeholder="Reflect on how the day unfolded compared to your morning intuition..."
                        rows={3}
                        className="w-full rounded-xl border border-purple-900/60 bg-slate-950/90 p-3 text-xs text-slate-100 placeholder:text-purple-400/40 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Section 3: Unlimited Character Private Diary */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 text-xs font-bold text-purple-200">
                        <BookMarked className="h-4 w-4 text-purple-400" />
                        <span>Unconstrained Private Diary (Unlimited Characters)</span>
                      </label>
                      <span className="text-[10px] font-mono text-purple-400">
                        {dailyThoughts.length} characters
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-300/70">
                      A sacred, unjudged container for your deepest thoughts, secrets, dreams, prayers, and milestones for your future self.
                    </p>
                    <textarea
                      value={dailyThoughts}
                      onChange={(e) => setDailyThoughts(e.target.value)}
                      placeholder="Write freely as much as your soul desires... no character limits."
                      rows={6}
                      className="w-full rounded-2xl border border-purple-800/60 bg-slate-950 p-4 text-xs text-slate-100 leading-relaxed placeholder:text-purple-400/40 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                    />
                  </div>

                  {/* Mood & Tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-purple-300">
                        Vibrational Mood
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(
                          [
                            { id: 'radiant', label: '☀️ Radiant' },
                            { id: 'peaceful', label: '🌿 Peaceful' },
                            { id: 'seeking', label: '🔮 Seeking' },
                            { id: 'empowered', label: '👑 Empowered' },
                            { id: 'reflective', label: '🌙 Reflective' },
                            { id: 'turbulent', label: '⚡ Turbulent' },
                          ] as const
                        ).map((m) => (
                          <button
                            type="button"
                            key={m.id}
                            onClick={() => setMood(m.id)}
                            className={`rounded-xl py-2 text-[11px] font-bold transition-all ${
                              mood === m.id
                                ? 'bg-amber-500 text-slate-950 shadow'
                                : 'bg-slate-950 border border-purple-900/60 text-purple-200 hover:border-purple-600'
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-purple-300">
                        Tags (Comma Separated)
                      </label>
                      <input
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="e.g. Intuition, Breakthrough, Love"
                        className="w-full rounded-xl border border-purple-800/60 bg-slate-950 px-3 py-2.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 px-6 py-3 font-serif text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all"
                    >
                      <Check className="h-4 w-4" />
                      <span>{isEditingId ? 'Update Sacred Entry' : 'Save Sanctuary Entry'}</span>
                    </button>

                    {isEditingId && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingId(null);
                          setMorningIntuition('');
                          setEveningReflection('');
                          setDailyThoughts('');
                        }}
                        className="rounded-2xl border border-purple-800 bg-slate-950 px-4 py-3 text-xs font-bold text-purple-200 hover:text-white"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Historical Entries Timeline & Interactive Calendar */}
            <div className="lg:col-span-5 space-y-4">
              {/* Journal Calendar Navigation */}
              {showCalendar && (
                <div className="animate-in fade-in zoom-in-95 duration-200">
                  <JournalCalendar
                    selectedDate={selectedDate}
                    onSelectDate={(date) => {
                      setSelectedDate(date);
                      setIsEditingId(null);
                    }}
                    markedDates={markedDiaryDates}
                    variant="diary"
                    title="Journal & Thoughts Calendar"
                  />
                </div>
              )}

              <div className="rounded-3xl border border-purple-800/60 bg-slate-900/90 p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-amber-400" />
                    <h3 className="font-serif text-base font-bold text-slate-100">
                      Chronicle Timeline
                    </h3>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowSearchModal(true)}
                      className="rounded-lg bg-amber-500/10 border border-amber-400/40 px-2 py-1 text-[10px] font-bold text-amber-300 hover:bg-amber-500/20 flex items-center space-x-1"
                    >
                      <Search className="h-3 w-3" />
                      <span>Search Thoughts</span>
                    </button>
                    <span className="text-xs text-purple-300 font-mono font-bold">
                      {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
                    </span>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-purple-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search reflections, tags, words..."
                      className="w-full rounded-xl border border-purple-800/50 bg-slate-950 pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-purple-400/40 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
                    {['all', 'radiant', 'peaceful', 'seeking', 'empowered', 'reflective'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setFilterMood(m)}
                        className={`rounded-lg px-2.5 py-1 text-[10px] font-bold capitalize shrink-0 transition-all ${
                          filterMood === m
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-950 border border-purple-900/50 text-purple-200 hover:border-purple-600'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* List */}
                <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1">
                  {filteredEntries.length > 0 ? (
                    filteredEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="group relative overflow-hidden rounded-2xl border border-purple-800/40 bg-slate-950/80 p-4 shadow-lg space-y-3 transition-all hover:border-amber-500/40"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-purple-900/40 pb-2">
                          <div>
                            <span className="font-serif text-sm font-bold text-amber-200">
                              {new Date(entry.date).toLocaleDateString(undefined, {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                            <div className="flex items-center space-x-2 mt-0.5">
                              <span className="rounded-md bg-purple-950 px-1.5 py-0.5 text-[9px] font-bold uppercase text-purple-300">
                                {entry.mood}
                              </span>
                              <span className="text-[10px] text-amber-400 flex items-center">
                                {Array.from({ length: entry.readingAccuracyRating || 5 }).map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400 inline" />
                                ))}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleToggleFavorite(entry.id)}
                              className={`p-1 rounded-lg transition-colors ${
                                entry.isFavorite ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              <Star className={`h-3.5 w-3.5 ${entry.isFavorite ? 'fill-amber-400' : ''}`} />
                            </button>
                            <button
                              onClick={() => {
                                setIsEditingId(entry.id);
                                setSelectedDate(entry.date);
                                setMorningIntuition(entry.morningIntuition || '');
                                setEveningReflection(entry.eveningReflection || '');
                                setReadingAccuracyRating(entry.readingAccuracyRating || 5);
                                setAccuracyNotes(entry.accuracyNotes || '');
                                setDailyThoughts(entry.dailyThoughts || '');
                                setMood(entry.mood || 'peaceful');
                                setTagsInput(entry.tags ? entry.tags.join(', ') : '');
                              }}
                              className="p-1 rounded-lg text-slate-500 hover:text-amber-300 transition-colors"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Content Previews */}
                        {entry.morningIntuition && (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1 text-[10px] font-bold uppercase text-amber-400">
                              <Sunrise className="h-3 w-3" />
                              <span>Morning Intuition:</span>
                            </div>
                            <p className="text-xs text-purple-200/90 leading-relaxed italic bg-purple-950/30 p-2 rounded-xl">
                              "{entry.morningIntuition}"
                            </p>
                          </div>
                        )}

                        {entry.eveningReflection && (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1 text-[10px] font-bold uppercase text-indigo-400">
                              <Sunset className="h-3 w-3" />
                              <span>Evening Reflection & Syncs:</span>
                            </div>
                            <p className="text-xs text-purple-200/90 leading-relaxed bg-indigo-950/30 p-2 rounded-xl">
                              {entry.eveningReflection}
                            </p>
                          </div>
                        )}

                        {entry.dailyThoughts && (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1 text-[10px] font-bold uppercase text-purple-300">
                              <BookMarked className="h-3 w-3" />
                              <span>Sacred Thoughts:</span>
                            </div>
                            <p className="text-xs text-purple-100/80 leading-relaxed line-clamp-4 whitespace-pre-wrap">
                              {entry.dailyThoughts}
                            </p>
                          </div>
                        )}

                        {/* Bottom Tags and Copy */}
                        <div className="pt-2 border-t border-purple-950/80 flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.map((t, idx) => (
                              <span
                                key={idx}
                                className="rounded-md bg-purple-900/40 border border-purple-800/40 px-1.5 py-0.5 text-[9px] font-bold text-purple-300"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>

                          <button
                            onClick={() => handleCopyEntry(entry)}
                            className="flex items-center space-x-1 text-[10px] font-bold text-purple-300 hover:text-amber-300 transition-colors"
                          >
                            {copiedId === entry.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-purple-900/40 bg-slate-950/50 p-8 text-center space-y-2">
                      <Sparkles className="h-6 w-6 text-amber-400 mx-auto" />
                      <p className="text-xs font-bold text-purple-300">
                        No entries found matching this view. Start your first sacred log today!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SAVED READINGS & GUIDANCE */}
      {activeTab === 'keepsakes' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Saved Readings Explanation Banner */}
          <div className="rounded-3xl border border-purple-800/50 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-rose-300">
                <Sparkles className="h-4 w-4" />
                <span>Saved Readings and Guidance Archive</span>
              </div>
              <p className="text-xs text-purple-200/90 leading-relaxed max-w-2xl">
                Every time you draw a <strong>Daily Tarot Card</strong>, generate an <strong>Astrological Forecast</strong>, pull an <strong>Archangel Message</strong>, or calculate a <strong>Numerology Matrix</strong>, click <em>"Save to Journal"</em> to permanently store it here as sacred guidance.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className="rounded-full bg-purple-950 border border-purple-700 px-3 py-1 text-xs font-bold text-amber-300">
                {journalEntries.length} Saved Readings & Guidance
              </span>
            </div>
          </div>

          {/* Keepsakes Filter Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar rounded-2xl border border-purple-700/60 bg-slate-900/90 p-1.5 shadow-md">
            {(['all', 'favorites', 'affirmation', 'tarot', 'horoscope', 'angel', 'numerology'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setKeepsakeFilter(f)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold capitalize shrink-0 transition-all ${
                  keepsakeFilter === f
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm border border-amber-400/40'
                    : 'text-purple-100 hover:bg-purple-950/60 hover:text-white'
                }`}
              >
                {f === 'affirmation' ? '✨ Affirmations' : f}
              </button>
            ))}
          </div>

          {/* Keepsakes Grid */}
          {filteredKeepsakes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredKeepsakes.map((entry) => (
                <div
                  key={entry.id}
                  className="relative overflow-hidden rounded-3xl border border-purple-800/40 bg-slate-900/90 p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-purple-600/50 transition-all"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-950/80 border border-purple-700/60">
                          {getKeepsakeTypeIcon(entry.type)}
                        </div>
                        <div>
                          <h3 className="font-serif text-sm font-bold text-slate-100 line-clamp-1">
                            {entry.title}
                          </h3>
                          <span className="text-[10px] font-bold text-purple-300">
                            {new Date(entry.date).toLocaleDateString(undefined, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        {onToggleJournalFavorite && (
                          <button
                            onClick={() => onToggleJournalFavorite(entry.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              entry.isFavorite ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <Star className={`h-4 w-4 ${entry.isFavorite ? 'fill-amber-400' : ''}`} />
                          </button>
                        )}
                        {onDeleteJournalEntry && (
                          <button
                            onClick={() => onDeleteJournalEntry(entry.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mt-3 text-xs text-purple-100 leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto pr-1">
                      {entry.content}
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-2 border-t border-purple-950 flex items-center justify-between">
                    <span className="rounded-md bg-purple-950/80 px-2 py-0.5 text-[9px] uppercase font-bold text-purple-300 border border-purple-800/40">
                      {entry.type}
                    </span>

                    <button
                      onClick={() => handleCopyKeepsake(entry)}
                      className="flex items-center space-x-1 text-[11px] font-bold text-purple-200 hover:text-amber-300 transition-colors"
                    >
                      {copiedKeepsakeId === entry.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Reading</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-purple-900/40 bg-slate-900/60 p-12 text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/20 text-purple-300 border border-purple-500/30">
                <Sparkles className="h-6 w-6 text-amber-300" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-100">
                No Saved Readings in this Filter
              </h3>
              <p className="text-xs text-purple-300/80 max-w-sm mx-auto">
                Save your daily tarot card pulls, personalized horoscopes, Archangel guidance readings, or numerology matrices to build your sacred readings archive.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4-Digit Passcode Security Modal */}
      <PinSecurityModal
        title="Private Diary & Saved Readings"
        storageKey={DEFAULT_PIN_STORAGE_KEY}
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

      {/* Search Previous Thoughts Modal */}
      <JournalSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        entries={entries}
        onSelectEntry={(entry) => {
          setSelectedDate(entry.date);
          setIsEditingId(null);
          setShowSearchModal(false);
        }}
      />
    </div>
  );
};
