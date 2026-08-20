import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Calendar, 
  Sparkles, 
  Star, 
  Flame, 
  BookMarked, 
  Sunrise, 
  Sunset,
  ArrowRight,
  Filter
} from 'lucide-react';
import { DiaryEntry } from '../types';

interface JournalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: DiaryEntry[];
  onSelectEntry: (entry: DiaryEntry) => void;
}

export const JournalSearchModal: React.FC<JournalSearchModalProps> = ({
  isOpen,
  onClose,
  entries,
  onSelectEntry,
}) => {
  const [query, setQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);

  // Extract all unique tags across entries
  const allTags = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => {
      e.tags?.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [entries]);

  // Filtered matching entries
  const results = useMemo(() => {
    return entries.filter((e) => {
      // Mood filter
      if (selectedMood !== 'all' && e.mood !== selectedMood) return false;
      
      // Tag filter
      if (selectedTag !== 'all' && !e.tags?.includes(selectedTag)) return false;

      // Rating filter
      if (minRating > 0 && (e.readingAccuracyRating || 0) < minRating) return false;

      // Text query
      if (query.trim()) {
        const q = query.toLowerCase();
        const haystack = `${e.morningIntuition} ${e.eveningReflection} ${e.dailyThoughts} ${e.accuracyNotes} ${e.tags.join(' ')} ${e.date}`.toLowerCase();
        return haystack.includes(q);
      }

      return true;
    });
  }, [entries, query, selectedMood, selectedTag, minRating]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-purple-800/80 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header & Search Bar */}
        <div className="p-5 border-b border-purple-900/50 bg-slate-950/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
                <Search className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-slate-100">
                  Search Previous Thoughts & Reflections
                </h3>
                <p className="text-[11px] text-purple-300/80">
                  Search across your entire private diary archive by keywords, affirmations, synchronicities, or tags.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-purple-400 hover:bg-purple-950 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-purple-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search previous thoughts (e.g., 'intuition', 'breakthrough', 'affirmation', 'dream')..."
              className="w-full rounded-2xl border border-purple-700/60 bg-slate-950 pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder:text-purple-400/50 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-2.5 text-purple-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-mono font-bold text-purple-400 uppercase mr-1">
              Mood:
            </span>
            {['all', 'radiant', 'peaceful', 'seeking', 'empowered', 'reflective'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMood(m)}
                className={`rounded-lg px-2 py-0.5 text-[10px] font-medium capitalize transition-all ${
                  selectedMood === m
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-purple-950/60 border border-purple-800/50 text-purple-300 hover:border-purple-600'
                }`}
              >
                {m}
              </button>
            ))}

            {allTags.length > 0 && (
              <>
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase ml-2 mr-1">
                  Tag:
                </span>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="rounded-lg bg-purple-950/60 border border-purple-800/50 px-2 py-0.5 text-[10px] text-purple-200 focus:outline-none"
                >
                  <option value="all">All Tags</option>
                  {allTags.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-purple-300/80 font-mono">
            <span>{results.length} matching {results.length === 1 ? 'thought' : 'thoughts'} found</span>
            {(query || selectedMood !== 'all' || selectedTag !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedMood('all');
                  setSelectedTag('all');
                  setMinRating(0);
                }}
                className="text-[10px] text-amber-400 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          {results.length > 0 ? (
            results.map((entry) => (
              <div
                key={entry.id}
                onClick={() => {
                  onSelectEntry(entry);
                  onClose();
                }}
                className="group relative cursor-pointer rounded-2xl border border-purple-800/50 bg-slate-950/80 p-4 transition-all hover:border-amber-400 hover:bg-slate-950 shadow-md space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="rounded-lg bg-purple-900/60 border border-purple-700/50 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                      {entry.date}
                    </span>
                    <span className="text-[10px] font-semibold uppercase text-purple-300">
                      • {entry.mood}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-amber-400">
                    <Star className="h-3 w-3 fill-amber-400" />
                    <span>{entry.readingAccuracyRating || 5}/5</span>
                  </div>
                </div>

                {/* Excerpts */}
                {entry.dailyThoughts && (
                  <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed">
                    {entry.dailyThoughts}
                  </p>
                )}

                {entry.morningIntuition && (
                  <div className="flex items-start space-x-1.5 text-[11px] text-amber-200/90 bg-amber-500/5 rounded-xl p-2 border border-amber-500/20">
                    <Sunrise className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 italic">"{entry.morningIntuition}"</span>
                  </div>
                )}

                {entry.eveningReflection && (
                  <div className="flex items-start space-x-1.5 text-[11px] text-indigo-200/90 bg-indigo-500/5 rounded-xl p-2 border border-indigo-500/20">
                    <Sunset className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 italic">"{entry.eveningReflection}"</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-[10px] text-purple-400">
                  <div className="flex items-center space-x-1">
                    {entry.tags?.map((t, idx) => (
                      <span key={idx} className="bg-purple-950 px-1.5 py-0.5 rounded text-purple-300">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <span className="text-amber-300 group-hover:translate-x-1 transition-transform inline-flex items-center space-x-1">
                    <span>Jump to Entry</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-purple-800/60 p-8 text-center space-y-2">
              <BookMarked className="h-8 w-8 text-purple-400 mx-auto opacity-60" />
              <div className="font-serif text-sm text-slate-200 font-bold">
                No matching thoughts found
              </div>
              <p className="text-xs text-purple-300/70 max-w-xs mx-auto">
                Try searching for other words or reset your search filters to explore your journal chronicles.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
