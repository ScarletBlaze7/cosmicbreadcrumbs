import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Moon, 
  Sparkles, 
  Star, 
  Calendar, 
  Tag, 
  ArrowRight,
  History,
  KeyRound
} from 'lucide-react';
import { DreamEntry, DreamType } from '../types';

interface DreamSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  dreams: DreamEntry[];
  onSelectDream: (dream: DreamEntry) => void;
}

export const DreamSearchModal: React.FC<DreamSearchModalProps> = ({
  isOpen,
  onClose,
  dreams,
  onSelectDream,
}) => {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Extract all unique standout symbols across all dreams
  const allSymbols = useMemo(() => {
    const set = new Set<string>();
    dreams.forEach((d) => {
      d.standoutKeywords?.forEach((k) => set.add(k));
    });
    return Array.from(set);
  }, [dreams]);

  // Filtered matching dreams
  const results = useMemo(() => {
    return dreams.filter((d) => {
      if (favoritesOnly && !d.isFavorite) return false;
      if (selectedType === 'past' && !d.isPastDream) return false;
      if (selectedType !== 'all' && selectedType !== 'past' && d.dreamType !== selectedType) return false;
      if (selectedSymbol !== 'all' && !d.standoutKeywords?.includes(selectedSymbol)) return false;

      if (query.trim()) {
        const q = query.toLowerCase();
        const haystack = `${d.title} ${d.dreamNarrative} ${d.standoutKeywords.join(' ')} ${d.emotionalTone} ${d.interpretation.summary} ${d.interpretation.subconsciousMessage} ${d.date}`.toLowerCase();
        return haystack.includes(q);
      }

      return true;
    });
  }, [dreams, query, selectedType, selectedSymbol, favoritesOnly]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-purple-800/80 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header & Search Bar */}
        <div className="p-5 border-b border-purple-900/50 bg-slate-950/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
                <Moon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-slate-100">
                  Search Previous Dreams & Nocturnal Codex
                </h3>
                <p className="text-[11px] text-purple-300/80">
                  Search your dream chronicles by keywords, standout symbols, archetypes, and interpretations.
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
              placeholder="Search previous dreams (e.g., 'water', 'wolf', 'flying', 'silver key', 'ancient temple')..."
              className="w-full rounded-2xl border border-cyan-700/60 bg-slate-950 pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder:text-purple-400/50 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
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
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase mr-1">
              Type:
            </span>
            {['all', 'lucid', 'prophetic', 'symbolic', 'past'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedType(t)}
                className={`rounded-lg px-2 py-0.5 text-[10px] font-medium capitalize transition-all ${
                  selectedType === t
                    ? 'bg-cyan-400 text-slate-950 font-bold'
                    : 'bg-purple-950/60 border border-purple-800/50 text-purple-300 hover:border-cyan-600'
                }`}
              >
                {t}
              </button>
            ))}

            {allSymbols.length > 0 && (
              <>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase ml-2 mr-1">
                  Symbol:
                </span>
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="rounded-lg bg-purple-950/60 border border-purple-800/50 px-2 py-0.5 text-[10px] text-purple-200 focus:outline-none"
                >
                  <option value="all">All Symbols</option>
                  {allSymbols.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </>
            )}

            <button
              type="button"
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`ml-auto flex items-center space-x-1 rounded-lg px-2 py-0.5 text-[10px] font-medium transition-all ${
                favoritesOnly
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-purple-950/60 border border-purple-800/50 text-amber-300'
              }`}
            >
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>Favorites</span>
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-purple-300/80 font-mono">
            <span>{results.length} matching {results.length === 1 ? 'dream' : 'dreams'} found</span>
            {(query || selectedType !== 'all' || selectedSymbol !== 'all' || favoritesOnly) && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedType('all');
                  setSelectedSymbol('all');
                  setFavoritesOnly(false);
                }}
                className="text-[10px] text-cyan-400 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          {results.length > 0 ? (
            results.map((dream) => (
              <div
                key={dream.id}
                onClick={() => {
                  onSelectDream(dream);
                  onClose();
                }}
                className="group relative cursor-pointer rounded-2xl border border-purple-800/50 bg-slate-950/80 p-4 transition-all hover:border-cyan-400 hover:bg-slate-950 shadow-md space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="rounded-lg bg-cyan-950 border border-cyan-800/50 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
                      {dream.isPastDream ? (dream.approximateDate || dream.date) : dream.date}
                    </span>
                    <span className="text-[10px] font-semibold uppercase text-purple-300">
                      • {dream.dreamType}
                    </span>
                    {dream.isPastDream && (
                      <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[9px] text-amber-300">
                        Past Dream
                      </span>
                    )}
                  </div>

                  <span className="rounded-md bg-purple-900/60 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                    Vibe: #{dream.interpretation.dreamNumberVibration || 7}
                  </span>
                </div>

                <h4 className="font-serif text-sm font-bold text-amber-200">
                  {dream.title}
                </h4>

                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-sans">
                  {dream.dreamNarrative}
                </p>

                {/* Subconscious excerpt */}
                {dream.interpretation?.summary && (
                  <div className="rounded-xl border border-cyan-900/40 bg-cyan-950/30 p-2 text-[11px] text-cyan-200 line-clamp-2">
                    🔮 {dream.interpretation.summary}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-[10px] text-purple-400">
                  <div className="flex items-center space-x-1 flex-wrap gap-1">
                    {dream.standoutKeywords.map((k, idx) => (
                      <span key={idx} className="bg-purple-950 border border-purple-800/60 px-1.5 py-0.5 rounded text-purple-300">
                        🗝️ {k}
                      </span>
                    ))}
                  </div>

                  <span className="text-cyan-300 group-hover:translate-x-1 transition-transform inline-flex items-center space-x-1">
                    <span>Decode Dream</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-purple-800/60 p-8 text-center space-y-2">
              <Moon className="h-8 w-8 text-cyan-400 mx-auto opacity-60" />
              <div className="font-serif text-sm text-slate-200 font-bold">
                No matching dreams found
              </div>
              <p className="text-xs text-purple-300/70 max-w-xs mx-auto">
                Try searching for other symbols, keywords, or archetypes to unlock previous dream interpretations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
