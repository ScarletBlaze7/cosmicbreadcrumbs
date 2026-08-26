import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Maximize2, RotateCw, RefreshCw } from 'lucide-react';
import { TarotCard, DrawnCard } from '../types';
import { getRwsCardImageUrl, getRwsBackupImageUrl } from '../utils/tarotImageHelper';
import { CosmicTarotCardBack } from './CosmicTarotCardBack';

interface TarotCardVisualProps {
  card: TarotCard | DrawnCard;
  isReversed?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  showReversedBanner?: boolean;
  allowZoom?: boolean;
  allowFlipToggle?: boolean;
  initialFlipped?: boolean; // false = starts face down, then flips over
  onCardClick?: () => void;
  priority?: boolean;
}

export const TarotCardVisual: React.FC<TarotCardVisualProps> = ({
  card,
  isReversed = false,
  size = 'md',
  className = '',
  showReversedBanner = true,
  allowZoom = false,
  allowFlipToggle = true,
  initialFlipped = false,
  onCardClick,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [triedBackup, setTriedBackup] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Flip state: isFaceUp = true means showing the front face with the 1909 RWS scan
  const [isFaceUp, setIsFaceUp] = useState(initialFlipped);
  const [isShining, setIsShining] = useState(false);
  const flipTriggeredRef = useRef(false);

  // Check if reversed from prop or from DrawnCard object
  const reversed = isReversed || (('isReversed' in card) && Boolean((card as DrawnCard).isReversed));

  const primaryUrl = getRwsCardImageUrl(card);
  const backupUrl = getRwsBackupImageUrl(card);
  const currentSrc = triedBackup ? backupUrl : primaryUrl;

  const handleImageError = () => {
    if (!triedBackup) {
      setTriedBackup(true);
    } else {
      setHasError(true);
    }
  };

  // Trigger cool 3D flip on mount if not initially flipped
  useEffect(() => {
    if (!initialFlipped && !flipTriggeredRef.current) {
      flipTriggeredRef.current = true;
      const flipTimer = setTimeout(() => {
        setIsFaceUp(true);
        setIsShining(true);
        setTimeout(() => setIsShining(false), 1600);
      }, 280);

      return () => clearTimeout(flipTimer);
    }
  }, [card.id, initialFlipped]);

  // Size dimensions (traditional Tarot aspect ratio approx 1 : 1.72)
  const sizeClasses = {
    xs: 'w-16 h-28 text-[9px]',
    sm: 'w-28 h-48 text-[10px]',
    md: 'w-40 h-68 text-xs',
    lg: 'w-52 h-88 text-sm',
    xl: 'w-60 h-[26rem] text-sm',
    hero: 'w-48 sm:w-64 md:w-72 h-80 sm:h-[26rem] md:h-[29rem] text-sm',
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (allowZoom) {
      setIsZoomed(true);
    } else if (onCardClick) {
      onCardClick();
    } else if (allowFlipToggle) {
      setIsFaceUp((prev) => !prev);
      setIsShining(true);
      setTimeout(() => setIsShining(false), 1400);
    }
  };

  return (
    <>
      <div
        className={`group perspective-1200 relative select-none ${sizeClasses[size]} ${
          allowZoom || onCardClick || allowFlipToggle ? 'cursor-pointer' : ''
        } ${className}`}
        onClick={handleCardClick}
      >
        {/* 3D Flipping Stage Container */}
        <div
          className={`relative h-full w-full preserve-3d transition-transform duration-700 ease-[cubic-bezier(0.2,0.85,0.25,1)] ${
            isFaceUp ? 'rotate-y-0' : '-rotate-y-180'
          } ${
            isFaceUp ? 'hover:scale-[1.03] hover:-translate-y-1.5' : 'hover:scale-[1.02]'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFaceUp ? 'rotateY(0deg)' : 'rotateY(180deg)',
          }}
        >
          {/* ========================================================= */}
          {/* FRONT FACE (The 1909 Rider-Waite-Smith Artwork) */}
          {/* ========================================================= */}
          <div
            className={`absolute inset-0 h-full w-full backface-hidden overflow-hidden rounded-2xl border-2 border-amber-400/50 bg-[#060712] shadow-2xl transition-all duration-500 group-hover:border-amber-300 group-hover:shadow-[0_0_30px_rgba(251,191,36,0.25)] ${
              reversed ? 'ring-1 ring-purple-500/50' : 'ring-1 ring-amber-400/30'
            }`}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            {/* Card Artwork Image Container */}
            <div
              className={`relative h-full w-full transition-transform duration-700 ease-in-out ${
                reversed ? 'rotate-180' : 'rotate-0'
              }`}
            >
              {!hasError ? (
                <>
                  {/* Vintage Card Image */}
                  <img
                    src={currentSrc}
                    alt={`${card.name} - Authentic 1909 Rider-Waite-Smith Tarot Card`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onLoad={() => setImageLoaded(true)}
                    onError={handleImageError}
                    className={`h-full w-full object-cover object-center transition-opacity duration-500 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  {/* Loading Skeleton / Placeholder */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950/80 to-slate-900 p-3 text-center">
                      <Sparkles className="h-6 w-6 text-amber-400 animate-pulse mb-1.5" />
                      <span className="text-xs font-serif font-bold text-slate-100 line-clamp-1">
                        {card.name}
                      </span>
                      <span className="text-[10px] text-amber-300 font-mono mt-0.5">1909 RWS</span>
                    </div>
                  )}
                </>
              ) : (
                /* Fallback Archetype View if Network is Blocked */
                <div className="flex h-full w-full flex-col items-center justify-between bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 p-4 text-center">
                  <div className="w-full flex justify-between items-center text-[10px] text-amber-400 border-b border-purple-800/40 pb-1 font-mono">
                    <span>{card.arcana}</span>
                    <span>{card.suit.toUpperCase()}</span>
                  </div>
                  <div className="my-auto flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-300 shadow-inner">
                      <Sparkles className="h-7 w-7 text-amber-400" />
                    </div>
                    <span className="mt-2 text-sm font-serif font-bold text-slate-100 line-clamp-2 px-1">
                      {card.name}
                    </span>
                  </div>
                  <div className="w-full text-[10px] text-purple-300 border-t border-purple-800/40 pt-1 font-mono">
                    Original 1909 Deck
                  </div>
                </div>
              )}

              {/* Subtle vintage texture overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 mix-blend-multiply" />
            </div>

            {/* Light Sweep Sheen Bar on Card Reveal */}
            {isShining && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl z-20">
                <div className="absolute -inset-full bg-gradient-to-r from-transparent via-amber-200/40 to-transparent animate-card-shine" />
              </div>
            )}

            {/* Authentic 1909 Badge */}
            <div className="absolute top-2 left-2 z-10 pointer-events-none">
              <span className="rounded-md bg-slate-950/85 px-2 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-400/40 backdrop-blur-xs shadow-md">
                1909 RWS
              </span>
            </div>

            {/* Flip / Turn Over Button */}
            {allowFlipToggle && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFaceUp(false);
                }}
                title="Flip to Card Back"
                className="absolute bottom-2 right-2 z-10 rounded-lg bg-slate-950/85 p-1.5 text-purple-300 hover:text-amber-300 border border-purple-800/60 shadow-md backdrop-blur-xs opacity-70 hover:opacity-100 transition-opacity"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
            )}

            {/* Quick Zoom Action Button */}
            {allowZoom && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(true);
                }}
                title="Inspect Original 1909 Artwork"
                className="absolute top-2 right-2 z-10 rounded-lg bg-slate-950/85 p-1.5 text-purple-300 hover:text-amber-300 border border-purple-800/60 shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Maximize2 className="h-3 w-3" />
              </button>
            )}

            {/* Reversed Indicator Banner */}
            {reversed && showReversedBanner && (
              <div className="absolute bottom-2 inset-x-2 z-10 flex items-center justify-center rounded-xl bg-purple-950/95 py-1 text-[10px] font-bold text-purple-200 border border-purple-500/60 shadow-lg backdrop-blur-xs">
                <RotateCw className="h-3 w-3 mr-1.5 text-amber-400 animate-spin-slow" />
                <span className="tracking-wider">REVERSED</span>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* BACK FACE (Exact Cosmic Breadcrumbs Celestial Gold Card Back) */}
          {/* ========================================================= */}
          <div
            className="absolute inset-0 h-full w-full backface-hidden overflow-hidden rounded-2xl border-2 border-amber-400/60 shadow-2xl transition-all duration-500 group-hover:border-amber-300 group-hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <CosmicTarotCardBack />
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Modal for High-Res 1909 Scan */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm w-full overflow-hidden rounded-3xl border border-amber-400/50 bg-[#060712] p-5 shadow-2xl space-y-3"
          >
            <div className="flex items-center justify-between border-b border-purple-900/60 pb-2.5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                  Authentic 1909 Pamela Colman Smith Scan
                </span>
                <h4 className="font-serif text-lg font-bold text-slate-100">{card.name}</h4>
              </div>
              <button
                onClick={() => setIsZoomed(false)}
                className="rounded-full bg-purple-900/40 p-1.5 text-purple-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-black/70 p-2 border border-purple-950">
              <img
                src={currentSrc}
                alt={`${card.name} 1909 original`}
                referrerPolicy="no-referrer"
                className={`max-h-[60vh] w-auto object-contain rounded-lg shadow-2xl transition-transform ${
                  reversed ? 'rotate-180' : ''
                }`}
              />
            </div>

            <div className="space-y-1 rounded-xl bg-purple-950/40 p-3 border border-purple-900/40 text-xs text-purple-200/90 leading-relaxed font-almendra">
              <span className="font-bold text-amber-300 block">Original 1909 First Edition:</span>
              <p className="line-clamp-4 italic text-slate-200">{card.pictorialKeyDescription || card.visualDescription}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
