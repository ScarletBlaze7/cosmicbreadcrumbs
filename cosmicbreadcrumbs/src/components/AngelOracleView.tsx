import React, { useState, useEffect } from 'react';
import { 
  Feather, 
  Sparkles, 
  Shield, 
  Heart, 
  Sun, 
  Flame, 
  Share2, 
  CheckCircle2, 
  RefreshCw, 
  RotateCw, 
  Send, 
  PlusCircle, 
  HelpCircle, 
  Compass, 
  Layers, 
  BookOpen, 
  Crown, 
  Eye, 
  Radio, 
  Sliders, 
  Sparkle
} from 'lucide-react';
import { triggerFireworks } from '../utils/fireworks';
import { UserProfile, ArchangelCard, DrawnArchangelCard } from '../types';
import { ARCHANGEL_CARDS, ARCHANGEL_ROSTER, getDailyArchangelCard } from '../data/angelData';
import { ArchangelDynamicArtwork } from './ArchangelDynamicArtwork';

interface AngelOracleViewProps {
  userProfile: UserProfile;
  onSaveJournal: (title: string, type: 'angel' | 'tarot' | 'horoscope' | 'numerology', content: string) => void;
}

export const AngelOracleView: React.FC<AngelOracleViewProps> = ({
  userProfile,
  onSaveJournal,
}) => {
  // Primary Daily Card
  const [primaryCard, setPrimaryCard] = useState<DrawnArchangelCard | null>(() => {
    const saved = localStorage.getItem('auranova_daily_archangel_card');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return getDailyArchangelCard();
  });

  // Extra Clarification Card (Exactly 1 allowed)
  const [clarificationCard, setClarificationCard] = useState<DrawnArchangelCard | null>(() => {
    const saved = localStorage.getItem('auranova_archangel_clarification_card');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  const [isDrawingPrimary, setIsDrawingPrimary] = useState(false);
  const [isDrawingClarification, setIsDrawingClarification] = useState(false);
  const [activeTab, setActiveTab] = useState<'archangel-temple' | 'daily-guidance'>('archangel-temple');

  // AI Channeling State
  const [customQuestion, setCustomQuestion] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiGuidance, setAiGuidance] = useState<any | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Sync to local storage
  useEffect(() => {
    if (primaryCard) {
      localStorage.setItem('auranova_daily_archangel_card', JSON.stringify(primaryCard));
    }
  }, [primaryCard]);

  useEffect(() => {
    if (clarificationCard) {
      localStorage.setItem('auranova_archangel_clarification_card', JSON.stringify(clarificationCard));
    } else {
      localStorage.removeItem('auranova_archangel_clarification_card');
    }
  }, [clarificationCard]);

  // Pull / Shuffle Primary Daily Guidance Card
  const handleDrawPrimaryCard = () => {
    if (isDrawingPrimary) return;
    setIsDrawingPrimary(true);

    setTimeout(() => {
      // Pick random card
      let randomIdx = Math.floor(Math.random() * ARCHANGEL_CARDS.length);
      // Ensure different if possible
      if (primaryCard && ARCHANGEL_CARDS[randomIdx].id === primaryCard.id && ARCHANGEL_CARDS.length > 1) {
        randomIdx = (randomIdx + 1) % ARCHANGEL_CARDS.length;
      }
      const newCard: DrawnArchangelCard = {
        ...ARCHANGEL_CARDS[randomIdx],
        drawnAt: new Date().toISOString(),
      };
      setPrimaryCard(newCard);
      setClarificationCard(null); // Reset clarification card on new primary draw
      setAiGuidance(null);
      setIsDrawingPrimary(false);
    }, 600);
  };

  // Pull Clarification Card (Only 1 extra card)
  const handleDrawClarificationCard = () => {
    if (isDrawingClarification || !primaryCard) return;
    setIsDrawingClarification(true);

    setTimeout(() => {
      // Pick from cards other than primary card
      const pool = ARCHANGEL_CARDS.filter((c) => c.id !== primaryCard.id);
      const randomIdx = Math.floor(Math.random() * pool.length);
      const clarCard: DrawnArchangelCard = {
        ...pool[randomIdx],
        isClarification: true,
        drawnAt: new Date().toISOString(),
      };

      setClarificationCard(clarCard);
      setIsDrawingClarification(false);
    }, 700);
  };

  const handleResetClarification = () => {
    setClarificationCard(null);
    setAiGuidance(null);
  };

  // AI Archangel Transmission Channeling
  const handleAskArchangelsAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryCard) return;
    setLoadingAI(true);

    try {
      const res = await fetch('/api/gemini/angel-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          angelNumber: primaryCard.archangel,
          situation: `Primary Guidance Card: ${primaryCard.title} (${primaryCard.archangel}). ${
            clarificationCard
              ? `Clarification Card: ${clarificationCard.title} (${clarificationCard.archangel} - ${clarificationCard.clarificationMeaning}).`
              : 'No clarification card drawn yet.'
          } User Question / Intent: ${customQuestion || 'General spiritual path, relationships, and higher purpose alignment.'}`,
          userProfile,
        }),
      });

      const data = await res.json();
      if (data.data) {
        setAiGuidance(data.data);
      }
    } catch (err) {
      console.error('AI Archangel Guidance error:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSaveToJournal = () => {
    if (!primaryCard) return;
    const title = clarificationCard
      ? `Archangel Guidance: ${primaryCard.archangel} + ${clarificationCard.archangel} (Clarification)`
      : `Archangel Guidance: ${primaryCard.archangel} - ${primaryCard.title}`;

    let content = `PRIMARY GUIDANCE CARD:\nArchangel: ${primaryCard.archangel}\nTitle: ${primaryCard.title}\nTheme: ${primaryCard.theme}\nRay of Light: ${primaryCard.colorRay}\nCrystal: ${primaryCard.crystalResonance}\n\nDivine Message:\n${primaryCard.divineMessage}\n\nAction Step:\n${primaryCard.guidanceAction}\n\nSacred Prayer:\n${primaryCard.sacredPrayer}\n\nAffirmation:\n"${primaryCard.affirmation}"`;

    if (clarificationCard) {
      content += `\n\n-------------------------\nCLARIFICATION CARD:\nArchangel: ${clarificationCard.archangel}\nTitle: ${clarificationCard.title}\nClarification Wisdom:\n${clarificationCard.clarificationMeaning}\n\nDivine Message:\n${clarificationCard.divineMessage}\n\nAction Step:\n${clarificationCard.guidanceAction}\n\nSacred Prayer:\n${clarificationCard.sacredPrayer}`;
    }

    if (aiGuidance) {
      content += `\n\n-------------------------\nCHANNELED ARCHANGEL TRANSMISSION:\n${aiGuidance.angelicMessage || aiGuidance.channeledMessage}\n\nSacred Action: ${aiGuidance.sacredAction || aiGuidance.actionStep}`;
    }

    onSaveJournal(title, 'angel', content);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-purple-900/50 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-rose-400">
            <Feather className="h-4 w-4" />
            <span>Angelic Guardians & Ascended Oracle</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            Archangel Daily Guidance
          </h1>
          <p className="text-xs text-purple-300/80 mt-1">
            Receive direct transmissions, invocation prayers, and draw an extra clarification card for deeper insight
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-1.5 rounded-2xl border border-purple-700/60 bg-slate-900/90 p-1.5 self-start sm:self-auto shadow-md">
          <button
            id="tab-archangel-temple"
            onClick={() => setActiveTab('archangel-temple')}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'archangel-temple'
                ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-md border border-rose-300/40'
                : 'text-purple-100 hover:bg-purple-950/60 hover:text-white'
            }`}
          >
            <Crown className="h-4 w-4 text-amber-300" />
            <span>Archangel Temple</span>
          </button>
          <button
            id="tab-daily-guidance"
            onClick={() => setActiveTab('daily-guidance')}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'daily-guidance'
                ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-md border border-rose-300/40'
                : 'text-purple-100 hover:bg-purple-950/60 hover:text-white'
            }`}
          >
            <Sparkles className="h-4 w-4 text-rose-300" />
            <span>Daily Guidance Pull</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Daily Guidance Card Pull with Clarification Card */}
      {activeTab === 'daily-guidance' && (
        <div className="space-y-8">
          {/* Top Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-purple-900/40 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Feather className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-serif font-bold text-slate-100">
                  {clarificationCard ? 'Dual Archangel Spread Active' : 'Daily Archangel Transmission'}
                </div>
                <div className="text-[11px] text-purple-300/80">
                  {clarificationCard 
                    ? 'Primary guidance + 1 clarification card drawn for deeper context' 
                    : 'Draw an extra card whenever you seek deeper clarity or confirmation'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-shuffle-archangel-primary"
                onClick={handleDrawPrimaryCard}
                disabled={isDrawingPrimary}
                className="flex items-center space-x-1.5 rounded-xl border border-purple-700 bg-purple-950/60 px-3 py-2 text-xs font-semibold text-purple-200 hover:bg-purple-900/70 transition-all disabled:opacity-50"
              >
                <RotateCw className={`h-3.5 w-3.5 ${isDrawingPrimary ? 'animate-spin' : ''}`} />
                <span>{isDrawingPrimary ? 'Shuffling Deck...' : 'Draw New Daily Card'}</span>
              </button>

              {!clarificationCard ? (
                <button
                  type="button"
                  id="btn-draw-archangel-clarification"
                  onClick={handleDrawClarificationCard}
                  disabled={isDrawingClarification || !primaryCard}
                  className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-amber-500/20 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  <PlusCircle className={`h-3.5 w-3.5 ${isDrawingClarification ? 'animate-spin' : ''}`} />
                  <span>{isDrawingClarification ? 'Drawing Clarification...' : 'Draw Clarification Card (+1)'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-clear-clarification"
                  onClick={handleResetClarification}
                  className="flex items-center space-x-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>Reset Clarification</span>
                </button>
              )}
            </div>
          </div>

          {/* Cards Display Grid: 1 or 2 Cards */}
          <div className={`grid grid-cols-1 ${clarificationCard ? 'lg:grid-cols-2' : 'max-w-3xl mx-auto'} gap-6`}>
            {/* PRIMARY GUIDANCE CARD */}
            {primaryCard && (
              <div className="relative overflow-hidden rounded-3xl border-2 border-rose-500/40 bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-950 p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-300">
                {/* Header Tag */}
                <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                      1
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300">
                      Daily Guidance Card
                    </span>
                  </div>
                  <span className="rounded-full bg-purple-950 border border-purple-700/50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
                    {primaryCard.colorRay}
                  </span>
                </div>

                {/* Archangel Title & Visual Atmosphere */}
                <div className="space-y-1.5">
                  <div className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wide">
                    {primaryCard.archangel}
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-100">
                    {primaryCard.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-purple-300/90">
                    <span className="rounded-md bg-slate-950/60 px-2 py-0.5 border border-purple-900/50">
                      Theme: <strong>{primaryCard.theme}</strong>
                    </span>
                    <span className="rounded-md bg-slate-950/60 px-2 py-0.5 border border-purple-900/50">
                      Crystal: <strong>{primaryCard.crystalResonance}</strong>
                    </span>
                  </div>
                </div>

                {/* Dynamic Archangel Artwork & Custom Photo */}
                <ArchangelDynamicArtwork
                  archangel={primaryCard.archangel}
                  variant="card-banner"
                  className="w-full shadow-2xl"
                />

                {/* Wings of Light Atmosphere */}
                <div className="rounded-2xl border border-rose-900/30 bg-rose-950/30 p-3 text-xs text-rose-200/90 italic flex items-start space-x-2">
                  <Feather className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Atmosphere of Light:</strong> {primaryCard.wingsOfLight}</span>
                </div>

                {/* Divine Message */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                    Divine Transmission
                  </span>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                    {primaryCard.divineMessage}
                  </p>
                </div>

                {/* Guidance Action & Prayer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="rounded-2xl border border-rose-900/40 bg-slate-950/70 p-3.5 space-y-1">
                    <div className="text-xs font-bold text-rose-300 flex items-center space-x-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Action Step:</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {primaryCard.guidanceAction}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-purple-900/40 bg-slate-950/70 p-3.5 space-y-1">
                    <div className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                      <Flame className="h-3.5 w-3.5" />
                      <span>Sacred Prayer:</span>
                    </div>
                    <p className="text-xs text-slate-300 italic leading-relaxed">
                      "{primaryCard.sacredPrayer}"
                    </p>
                  </div>
                </div>

                {/* Affirmation */}
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                    Sacred Decree
                  </span>
                  <p className="text-xs sm:text-sm font-serif italic text-amber-200">
                    "{primaryCard.affirmation}"
                  </p>
                </div>
              </div>
            )}

            {/* CLARIFICATION CARD (CARD 2) */}
            {clarificationCard ? (
              <div className="relative overflow-hidden rounded-3xl border-2 border-amber-400/60 bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-950 p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-300">
                {/* Header Tag */}
                <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-400/40">
                      2
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                      Clarification Card (+1 Extra)
                    </span>
                  </div>
                  <span className="rounded-full bg-amber-500/20 border border-amber-400/50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-200">
                    {clarificationCard.colorRay}
                  </span>
                </div>

                {/* Archangel Title & Visual Atmosphere */}
                <div className="space-y-1.5">
                  <div className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wide">
                    {clarificationCard.archangel}
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-100">
                    {clarificationCard.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-amber-200/80">
                    <span className="rounded-md bg-slate-950/60 px-2 py-0.5 border border-amber-900/50">
                      Theme: <strong>{clarificationCard.theme}</strong>
                    </span>
                    <span className="rounded-md bg-slate-950/60 px-2 py-0.5 border border-amber-900/50">
                      Crystal: <strong>{clarificationCard.crystalResonance}</strong>
                    </span>
                  </div>
                </div>

                {/* Dynamic Archangel Artwork & Custom Photo (Clarification Card) */}
                <ArchangelDynamicArtwork
                  archangel={clarificationCard.archangel}
                  variant="card-banner"
                  className="w-full shadow-2xl"
                />

                {/* Clarification Spotlight Banner */}
                <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 to-purple-950/40 p-4 space-y-1">
                  <div className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                    <HelpCircle className="h-4 w-4" />
                    <span>How This Clarifies Your Primary Card:</span>
                  </div>
                  <p className="text-xs text-slate-100 leading-relaxed font-medium">
                    {clarificationCard.clarificationMeaning}
                  </p>
                </div>

                {/* Divine Message */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Clarification Transmission
                  </span>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                    {clarificationCard.divineMessage}
                  </p>
                </div>

                {/* Guidance Action & Prayer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="rounded-2xl border border-amber-900/40 bg-slate-950/70 p-3.5 space-y-1">
                    <div className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Harmonized Action:</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {clarificationCard.guidanceAction}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-purple-900/40 bg-slate-950/70 p-3.5 space-y-1">
                    <div className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                      <Flame className="h-3.5 w-3.5" />
                      <span>Clarification Prayer:</span>
                    </div>
                    <p className="text-xs text-slate-300 italic leading-relaxed">
                      "{clarificationCard.sacredPrayer}"
                    </p>
                  </div>
                </div>

                {/* Affirmation */}
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                    Clarification Affirmation
                  </span>
                  <p className="text-xs sm:text-sm font-serif italic text-amber-200">
                    "{clarificationCard.affirmation}"
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Dual Synthesis & Journal Log Bar */}
          <div className="rounded-3xl border border-purple-800/40 bg-slate-900/80 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs font-bold text-amber-300">
                <Crown className="h-4 w-4" />
                <span>
                  {clarificationCard
                    ? `Dual Guidance: ${primaryCard?.archangel} & ${clarificationCard.archangel}`
                    : `Daily Guidance: ${primaryCard?.archangel}`}
                </span>
              </div>
              <p className="text-xs text-purple-200/80">
                Save this sacred transmission directly into your permanent Mystic Journal archive.
              </p>
            </div>

            <button
              type="button"
              id="btn-save-archangel-journal"
              onClick={handleSaveToJournal}
              className={`flex items-center space-x-2 rounded-xl px-5 py-2.5 text-xs font-semibold transition-all shrink-0 ${
                isSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white hover:opacity-90 shadow-md shadow-purple-600/30'
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
                  <span>Log Spread to Journal</span>
                </>
              )}
            </button>
          </div>

          {/* AI Archangel Channeling Portal */}
          <div className="rounded-3xl border border-purple-700/50 bg-gradient-to-br from-purple-950/70 via-slate-900 to-slate-950 p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 border-b border-purple-800/40 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-slate-100">
                  Channel Direct Archangel Transmission
                </h3>
                <p className="text-xs text-purple-300/80">
                  Ask a question to {primaryCard?.archangel} {clarificationCard ? `and ${clarificationCard.archangel}` : ''} regarding your reading
                </p>
              </div>
            </div>

            <form onSubmit={handleAskArchangelsAI} className="space-y-3">
              <textarea
                rows={3}
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder={`e.g. How can I apply ${primaryCard?.archangel}'s guidance to my current relationship decision or career crossroads?`}
                className="w-full rounded-2xl border border-purple-900/60 bg-slate-950/80 p-3.5 text-xs sm:text-sm text-slate-100 placeholder-purple-400/50 focus:border-amber-400 focus:outline-none"
              />

              <button
                type="submit"
                disabled={loadingAI || !primaryCard}
                id="btn-channel-archangel-ai"
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 py-3 text-xs font-semibold text-white shadow-md hover:opacity-90 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loadingAI ? 'animate-spin' : ''}`} />
                <span>{loadingAI ? 'Channeling Celestial Realm...' : 'Channel Archangel Answer'}</span>
              </button>
            </form>

            {aiGuidance && (
              <div className="rounded-2xl border border-amber-500/40 bg-slate-950/90 p-5 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-300 border-b border-purple-900/40 pb-2">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-4 w-4" />
                    <span>{aiGuidance.associatedArchangel || primaryCard?.archangel} Presence</span>
                  </div>
                  <span className="text-[10px] text-purple-300">{aiGuidance.archangelRay}</span>
                </div>

                <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed whitespace-pre-line">
                  {aiGuidance.angelicMessage || aiGuidance.channeledMessage}
                </p>

                {aiGuidance.coreMeaning && (
                  <div className="rounded-xl bg-purple-950/60 p-3 text-xs text-amber-200">
                    <strong>Core Essence:</strong> {aiGuidance.coreMeaning}
                  </div>
                )}

                {aiGuidance.sacredAction && (
                  <div className="rounded-xl bg-slate-900 p-3 text-xs text-slate-300 border border-purple-900/50">
                    <span className="font-semibold text-rose-300">Divine Action: </span>
                    {aiGuidance.sacredAction}
                  </div>
                )}

                {aiGuidance.affirmation && (
                  <div className="text-xs italic text-amber-300 font-serif text-center pt-1">
                    "{aiGuidance.affirmation}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Archangels Roster & Invocations Temple */}
      {activeTab === 'archangel-temple' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-purple-950/30 border border-purple-800/40 p-4 text-xs text-purple-200 leading-relaxed">
            <p>
              The Archangels are celestial overseers of divine rays, elements, and spiritual virtues. You may invoke them at any moment—simply speak their name or recite their sacred prayer with pure intention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ARCHANGEL_ROSTER.map((arch) => (
              <div
                key={arch.name}
                className="rounded-3xl border border-purple-800/40 bg-slate-900/90 shadow-xl p-5 space-y-3.5 hover:border-amber-400/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base sm:text-lg font-bold text-slate-100">
                      {arch.name}
                    </span>
                    <span className="rounded-full bg-purple-950 border border-purple-700/50 px-2.5 py-0.5 text-[10px] text-amber-300 font-semibold">
                      {arch.colorRay}
                    </span>
                  </div>

                  {/* Universal Dynamic Archangel Artwork with Photo Assignment */}
                  <ArchangelDynamicArtwork
                    archangel={arch.name}
                    variant="temple-featured"
                    className="w-full shadow-2xl"
                  />

                  <div className="text-xs text-rose-300 font-medium">
                    {arch.domain}
                  </div>

                  <p className="text-xs text-purple-200/80 leading-relaxed">
                    {arch.howToInvoke}
                  </p>
                </div>

                <div className="rounded-xl border border-purple-900/50 bg-slate-950/60 p-3 text-[11px] text-amber-200/90 italic">
                  "{arch.prayer}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
