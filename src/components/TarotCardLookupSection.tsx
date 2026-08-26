import React, { useState, useMemo } from 'react';
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  RotateCw, 
  Filter, 
  X, 
  Eye, 
  Flame, 
  Heart, 
  Coins, 
  Wind, 
  Compass, 
  ChevronDown,
  Layers,
  Zap,
  Info
} from 'lucide-react';
import { TarotCard, TarotSuit } from '../types';
import { ALL_TAROT_CARDS, MAJOR_ARCANA, WANDS_CARDS, CUPS_CARDS, SWORDS_CARDS, PENTACLES_CARDS } from '../data/tarotData';
import { TarotCardVisual } from './TarotCardVisual';
import { CosmicTarotCardBack } from './CosmicTarotCardBack';

interface TarotCardLookupSectionProps {
  onSelectCard?: (card: TarotCard) => void;
  className?: string;
}

export const TarotCardLookupSection: React.FC<TarotCardLookupSectionProps> = ({
  onSelectCard,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuit, setSelectedSuit] = useState<TarotSuit | 'all'>('all');
  const [orientationMode, setOrientationMode] = useState<'upright' | 'reversed'>('upright');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [isFlippedToBack, setIsFlippedToBack] = useState(false);

  // Filter cards based on search and suit category
  const filteredCards = useMemo(() => {
    return ALL_TAROT_CARDS.filter((card) => {
      const matchesSuit = selectedSuit === 'all' || card.suit === selectedSuit;
      if (!matchesSuit) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();

      return (
        card.name.toLowerCase().includes(q) ||
        card.keywords.some((k) => k.toLowerCase().includes(q)) ||
        card.reversedKeywords.some((k) => k.toLowerCase().includes(q)) ||
        (card.element && card.element.toLowerCase().includes(q)) ||
        (card.astrology && card.astrology.toLowerCase().includes(q)) ||
        card.uprightMeaning.toLowerCase().includes(q) ||
        card.reversedMeaning.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedSuit]);

  const suitCounts = useMemo(() => ({
    all: ALL_TAROT_CARDS.length,
    major: MAJOR_ARCANA.length,
    wands: WANDS_CARDS.length,
    cups: CUPS_CARDS.length,
    swords: SWORDS_CARDS.length,
    pentacles: PENTACLES_CARDS.length,
  }), []);

  const handleCardClick = (card: TarotCard) => {
    setSelectedCard(card);
    setIsFlippedToBack(false);
    if (onSelectCard) {
      onSelectCard(card);
    }
  };

  return (
    <div className={`rounded-3xl border border-purple-800/40 bg-gradient-to-b from-[#0d0a21]/95 via-[#110e2c]/90 to-[#070514]/95 p-5 sm:p-7 shadow-2xl space-y-6 ${className}`}>
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-900/60 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <BookOpen className="h-4 w-4" />
            <span>Rider-Waite-Smith 78-Card Encyclopedia</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-100 mt-1 flex items-center space-x-2">
            <span>Tarot Card & Meaning Directory</span>
            <span className="text-xs font-normal text-purple-300/70 font-mono bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-800/50">
              {filteredCards.length} / 78 Cards
            </span>
          </h2>
          <p className="text-xs text-purple-300/80 mt-1 max-w-2xl">
            Look up any card to explore upright and reversed meanings, 1911 Pictorial Key interpretations, esoteric symbolism, keywords, and elemental connections.
          </p>
        </div>

        {/* Upright vs Reversed Quick Global View Toggle */}
        <div className="flex items-center space-x-1.5 self-start md:self-auto rounded-2xl border border-purple-800/60 bg-slate-950/80 p-1">
          <button
            type="button"
            onClick={() => setOrientationMode('upright')}
            className={`flex items-center space-x-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              orientationMode === 'upright'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm'
                : 'text-purple-300/70 hover:text-purple-200'
            }`}
          >
            <span>☀️ Upright Meaning</span>
          </button>
          <button
            type="button"
            onClick={() => setOrientationMode('reversed')}
            className={`flex items-center space-x-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              orientationMode === 'reversed'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 shadow-sm'
                : 'text-purple-300/70 hover:text-purple-200'
            }`}
          >
            <RotateCw className="h-3 w-3" />
            <span>↺ Reversed Meaning</span>
          </button>
        </div>
      </div>

      {/* Search Input and Suit Filter Chips */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-purple-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by card name, keyword (e.g. 'Love', 'Victory', 'Change'), zodiac sign, or symbol..."
            className="w-full rounded-2xl border border-purple-900/60 bg-slate-950/90 pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-purple-400/50 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/40 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-purple-400 hover:text-purple-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Suit Category Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setSelectedSuit('all')}
            className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-bold shrink-0 transition-all ${
              selectedSuit === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'bg-slate-900/70 text-purple-300/80 border border-purple-900/40 hover:bg-purple-950/50'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-amber-400" />
            <span>All Cards ({suitCounts.all})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedSuit('major')}
            className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-bold shrink-0 transition-all ${
              selectedSuit === 'major'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'bg-slate-900/70 text-purple-300/80 border border-purple-900/40 hover:bg-purple-950/50'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Major Arcana ({suitCounts.major})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedSuit('wands')}
            className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-bold shrink-0 transition-all ${
              selectedSuit === 'wands'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                : 'bg-slate-900/70 text-amber-300/80 border border-amber-900/40 hover:bg-amber-950/50'
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-orange-400" />
            <span>Wands • Fire ({suitCounts.wands})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedSuit('cups')}
            className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-bold shrink-0 transition-all ${
              selectedSuit === 'cups'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                : 'bg-slate-900/70 text-cyan-300/80 border border-cyan-900/40 hover:bg-cyan-950/50'
            }`}
          >
            <Heart className="h-3.5 w-3.5 text-cyan-400" />
            <span>Cups • Water ({suitCounts.cups})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedSuit('swords')}
            className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-bold shrink-0 transition-all ${
              selectedSuit === 'swords'
                ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md'
                : 'bg-slate-900/70 text-sky-300/80 border border-sky-900/40 hover:bg-sky-950/50'
            }`}
          >
            <Wind className="h-3.5 w-3.5 text-sky-400" />
            <span>Swords • Air ({suitCounts.swords})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedSuit('pentacles')}
            className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-bold shrink-0 transition-all ${
              selectedSuit === 'pentacles'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'bg-slate-900/70 text-emerald-300/80 border border-emerald-900/40 hover:bg-emerald-950/50'
            }`}
          >
            <Coins className="h-3.5 w-3.5 text-emerald-400" />
            <span>Pentacles • Earth ({suitCounts.pentacles})</span>
          </button>
        </div>
      </div>

      {/* Cards Grid Showcase */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 max-h-[560px] overflow-y-auto pr-1 no-scrollbar">
          {filteredCards.map((card) => {
            const keywords = orientationMode === 'reversed' ? card.reversedKeywords : card.keywords;
            const meaning = orientationMode === 'reversed' ? card.reversedMeaning : card.uprightMeaning;

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className="group relative flex flex-col justify-between rounded-2xl border border-purple-900/50 bg-[#120f2c]/80 hover:bg-[#19153c] p-2.5 transition-all hover:scale-[1.02] hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(251,191,36,0.2)] cursor-pointer"
              >
                {/* Visual Thumbnail */}
                <div className="relative mx-auto mb-2 flex justify-center">
                  <div className="w-[100px] h-[155px] rounded-xl overflow-hidden shadow-md border border-purple-800/40">
                    <TarotCardVisual
                      card={card}
                      isReversed={orientationMode === 'reversed'}
                      size="sm"
                      allowZoom={false}
                    />
                  </div>
                </div>

                {/* Card Meta Info */}
                <div className="space-y-1 text-center">
                  <div className="font-serif text-xs font-bold text-slate-100 group-hover:text-amber-300 truncate">
                    {card.name}
                  </div>
                  
                  <div className="flex items-center justify-center space-x-1 text-[10px] text-purple-300/70">
                    <span>{card.arcana}</span>
                    {card.element && (
                      <>
                        <span>•</span>
                        <span className="text-amber-400/90">{card.element}</span>
                      </>
                    )}
                  </div>

                  {/* Primary Keywords */}
                  <div className="pt-1 flex flex-wrap justify-center gap-1">
                    {keywords.slice(0, 2).map((kw, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-purple-950/80 px-1.5 py-0.5 text-[9px] font-medium text-purple-200 border border-purple-800/40 truncate max-w-full"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover Reveal Action */}
                <div className="mt-2 text-center">
                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-400 group-hover:underline">
                    <Eye className="h-3 w-3" />
                    <span>View Meaning</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-purple-900/50 bg-slate-950/60 p-8 text-center space-y-3">
          <Search className="mx-auto h-8 w-8 text-purple-400/60" />
          <h4 className="font-serif text-base font-bold text-slate-200">No Tarot Cards Found</h4>
          <p className="text-xs text-purple-300/80 max-w-xs mx-auto">
            No cards matched "{searchQuery}". Try searching for another card name, suit, or keyword.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSuit('all');
            }}
            className="rounded-xl bg-purple-900/60 px-4 py-2 text-xs font-bold text-purple-200 hover:bg-purple-800 border border-purple-700/50"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DETAILED CARD MEANING MODAL */}
      {/* ========================================================================= */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-[#0f0c29] via-[#1a1440] to-[#0d0a21] p-6 shadow-2xl text-left space-y-6">
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute right-5 top-5 rounded-full bg-purple-950/80 p-2 text-purple-300 hover:bg-purple-900 hover:text-white border border-purple-700/50 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header: Title & Badges */}
            <div className="border-b border-purple-800/60 pb-4 pr-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-amber-400/20 px-3 py-0.5 text-xs font-bold text-amber-300 border border-amber-400/40">
                  {selectedCard.arcana} Arcana
                </span>
                {selectedCard.element && (
                  <span className="rounded-full bg-purple-900/60 px-2.5 py-0.5 text-xs font-medium text-purple-200 border border-purple-700/40">
                    Element: {selectedCard.element}
                  </span>
                )}
                {selectedCard.astrology && (
                  <span className="rounded-full bg-indigo-900/60 px-2.5 py-0.5 text-xs font-medium text-indigo-200 border border-indigo-700/40">
                    Astrology: {selectedCard.astrology}
                  </span>
                )}
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-2">
                {selectedCard.name}
              </h2>
            </div>

            {/* Visual Card + Flip Toggle */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="shrink-0 flex flex-col items-center space-y-2">
                <div 
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setIsFlippedToBack(!isFlippedToBack)}
                >
                  {isFlippedToBack ? (
                    <div className="h-[260px] w-[160px] rounded-2xl shadow-xl border border-amber-400/40">
                      <CosmicTarotCardBack />
                    </div>
                  ) : (
                    <TarotCardVisual
                      card={selectedCard}
                      isReversed={orientationMode === 'reversed'}
                      size="lg"
                      allowZoom={false}
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsFlippedToBack(!isFlippedToBack)}
                  className="flex items-center space-x-1 text-[11px] font-bold text-amber-400 hover:text-amber-300"
                >
                  <RotateCw className="h-3 w-3" />
                  <span>{isFlippedToBack ? 'View Card Face' : 'View Cosmic Card Back'}</span>
                </button>
              </div>

              {/* Comprehensive Meaning Breakdown */}
              <div className="flex-1 space-y-4 text-left">
                {/* Upright Meaning */}
                <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-3.5 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <span>☀️ Upright Meaning</span>
                  </div>
                  <p className="text-xs text-purple-100 leading-relaxed">
                    {selectedCard.uprightMeaning}
                  </p>
                  <div className="pt-1 flex flex-wrap gap-1">
                    {selectedCard.keywords.map((kw, i) => (
                      <span key={i} className="rounded-md bg-amber-900/40 px-2 py-0.5 text-[10px] font-medium text-amber-200 border border-amber-700/40">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reversed Meaning */}
                <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-3.5 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    <span>↺ Reversed Meaning (Shadow / Blockages)</span>
                  </div>
                  <p className="text-xs text-purple-100 leading-relaxed">
                    {selectedCard.reversedMeaning}
                  </p>
                  <div className="pt-1 flex flex-wrap gap-1">
                    {selectedCard.reversedKeywords.map((kw, i) => (
                      <span key={i} className="rounded-md bg-indigo-900/40 px-2 py-0.5 text-[10px] font-medium text-indigo-200 border border-indigo-700/40">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sacred Advice & Affirmation */}
                <div className="rounded-2xl border border-purple-800/60 bg-slate-950/70 p-3.5 space-y-2 text-xs">
                  <div>
                    <strong className="text-amber-300">Universal Advice:</strong>{' '}
                    <span className="text-purple-200">{selectedCard.advice}</span>
                  </div>
                  <div>
                    <strong className="text-amber-300">Mantra & Affirmation:</strong>{' '}
                    <span className="italic text-purple-200">"{selectedCard.affirmation}"</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pictorial Key 1911 Historical Note (A.E. Waite) */}
            {(selectedCard.pictorialKeyUpright || selectedCard.pictorialKeyReversed || selectedCard.pictorialKeyDescription) && (
              <div className="rounded-2xl border border-amber-500/20 bg-slate-950/80 p-4 space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <BookOpen className="h-4 w-4" />
                  <span>The Pictorial Key to the Tarot (A.E. Waite, 1911)</span>
                </div>
                {selectedCard.pictorialKeyUpright && (
                  <p className="text-xs text-purple-200/90 italic">
                    <strong>Divinatory Key:</strong> "{selectedCard.pictorialKeyUpright}"
                  </p>
                )}
                {selectedCard.pictorialKeyReversed && (
                  <p className="text-xs text-purple-200/90 italic">
                    <strong>Reversed Key:</strong> "{selectedCard.pictorialKeyReversed}"
                  </p>
                )}
              </div>
            )}

            {/* Close / Select Action */}
            <div className="flex justify-end pt-2 border-t border-purple-900/60">
              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-95"
              >
                Close Card Meanings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
