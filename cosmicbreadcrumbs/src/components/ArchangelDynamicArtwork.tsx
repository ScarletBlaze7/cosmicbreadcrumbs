import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Maximize2, 
  Upload, 
  RotateCcw, 
  Image as ImageIcon, 
  X, 
  Camera, 
  Link as LinkIcon, 
  Check, 
  Shield, 
  Heart, 
  Flame, 
  Feather, 
  Star, 
  Moon, 
  Sun, 
  Leaf, 
  Compass, 
  Radio, 
  Crown,
  Eye
} from 'lucide-react';
import { 
  getArchangelPhoto, 
  setArchangelPhoto, 
  removeArchangelPhoto, 
  compressImageFile,
  EVENT_ARCHANGEL_PHOTO_UPDATED,
  normalizeArchangelKey
} from '../utils/archangelPhotoManager';
import { MichaelSvgArtwork } from './ArchangelMichaelArtwork';
import { GabrielSvgArtwork } from './ArchangelGabrielArtwork';
import { RaphaelSvgArtwork } from './ArchangelRaphaelArtwork';
import { UrielSvgArtwork } from './ArchangelUrielArtwork';
import { ChamuelSvgArtwork } from './ArchangelChamuelArtwork';

interface ArchangelDynamicArtworkProps {
  archangel: string;
  variant?: 'card-banner' | 'temple-featured' | 'compact' | 'hero' | 'thumbnail';
  className?: string;
  allowZoom?: boolean;
  showCaption?: boolean;
  onPhotoAssigned?: (photoUrl: string) => void;
}

// Sacred Archetype Colors & Geometry generator for Archangels without custom individual SVGs yet
const ARCHANGEL_THEMES: Record<string, {
  bgGradient: [string, string, string];
  rayColor: string;
  symbol: string;
  tagline: string;
}> = {
  metatron: {
    bgGradient: ['#3b0764', '#581c87', '#ea580c'],
    rayColor: 'Violet-Tangerine & White Platinum',
    symbol: 'cube',
    tagline: 'Sacred Geometry & Ascension',
  },
  jophiel: {
    bgGradient: ['#713f12', '#ca8a04', '#fef08a'],
    rayColor: 'Golden Yellow & Sunlight',
    symbol: 'sun',
    tagline: 'Beauty of Thought & Mindset Elevation',
  },
  zadkiel: {
    bgGradient: ['#2e1065', '#6b21a8', '#c084fc'],
    rayColor: 'Deep Amethyst Violet & Silver',
    symbol: 'flame',
    tagline: 'Violet Flame of Forgiveness & Transmutation',
  },
  sandalphon: {
    bgGradient: ['#134e4a', '#0d9488', '#f97316'],
    rayColor: 'Turquoise & Copper Gold',
    symbol: 'music',
    tagline: 'Music of the Spheres & Answered Prayers',
  },
  raziel: {
    bgGradient: ['#1e1b4b', '#4338ca', '#ec4899'],
    rayColor: 'Rainbow Opal & Electric Indigo',
    symbol: 'eye',
    tagline: 'Divine Mysteries & Clairvoyance',
  },
  ariel: {
    bgGradient: ['#14532d', '#15803d', '#facc15'],
    rayColor: 'Pale Pink, Forest Green & Gold',
    symbol: 'leaf',
    tagline: 'Earthly Prosperity, Nature & Manifestation',
  },
  haniel: {
    bgGradient: ['#0f172a', '#334155', '#93c5fd'],
    rayColor: 'Silver Moonbeam & Pearl',
    symbol: 'moon',
    tagline: 'Moonlit Grace & Intuitive Cycles',
  },
  jeremiel: {
    bgGradient: ['#3b0764', '#4c1d95', '#fbbf24'],
    rayColor: 'Royal Purple & Golden Topaz',
    symbol: 'compass',
    tagline: 'Life Review & Compassionate Realignment',
  },
  raguel: {
    bgGradient: ['#083344', '#0891b2', '#67e8f9'],
    rayColor: 'Pale Cyan & Aquamarine Blue',
    symbol: 'heart',
    tagline: 'Harmonizer of Relationships & Divine Order',
  },
  azrael: {
    bgGradient: ['#18181b', '#27272a', '#fef08a'],
    rayColor: 'Creamy Pearl & Soft Vanilla Light',
    symbol: 'feather',
    tagline: 'Angel of Comfort & Peaceful Transitions',
  },
  orion: {
    bgGradient: ['#030712', '#1e1b4b', '#38bdf8'],
    rayColor: 'Midnight Navy & Starlight Diamond',
    symbol: 'star',
    tagline: 'Cosmic Stargate & Multidimensional Wisdom',
  },
  nathaniel: {
    bgGradient: ['#450a0a', '#991b1b', '#f97316'],
    rayColor: 'Blazing Crimson & Orange Flame',
    symbol: 'flame',
    tagline: 'Spiritual Fire & Rapid Acceleration',
  },
  muriel: {
    bgGradient: ['#3b0764', '#701a75', '#fbcfe8'],
    rayColor: 'Pale Lavender & Soft Apricot',
    symbol: 'heart',
    tagline: 'Peaceful Sanctuary & Everyday Kindness',
  },
};

export const ArchangelDynamicArtwork: React.FC<ArchangelDynamicArtworkProps> = ({
  archangel,
  variant = 'card-banner',
  className = '',
  allowZoom = true,
  showCaption = true,
  onPhotoAssigned,
}) => {
  const [photo, setPhoto] = useState<string | null>(() => getArchangelPhoto(archangel));
  const [isZoomed, setIsZoomed] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const normKey = normalizeArchangelKey(archangel);
  const theme = ARCHANGEL_THEMES[normKey] || {
    bgGradient: ['#1e1b4b', '#312e81', '#a855f7'],
    rayColor: 'Celestial Light',
    symbol: 'star',
    tagline: 'Divine Presence & Angelic Guidance',
  };

  // Sync with photo updates from other components/tabs
  useEffect(() => {
    setPhoto(getArchangelPhoto(archangel));

    const handlePhotoUpdated = (e: Event) => {
      const customEvt = e as CustomEvent;
      if (
        !customEvt.detail ||
        normalizeArchangelKey(customEvt.detail.archangel) === normKey
      ) {
        setPhoto(getArchangelPhoto(archangel));
      }
    };

    window.addEventListener(EVENT_ARCHANGEL_PHOTO_UPDATED, handlePhotoUpdated);
    window.addEventListener('storage', handlePhotoUpdated);
    return () => {
      window.removeEventListener(EVENT_ARCHANGEL_PHOTO_UPDATED, handlePhotoUpdated);
      window.removeEventListener('storage', handlePhotoUpdated);
    };
  }, [archangel, normKey]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      // Compress to ensure it easily fits in localStorage alongside other photos
      const compressedDataUrl = await compressImageFile(file, 1200, 1200, 0.85);
      setArchangelPhoto(archangel, compressedDataUrl);
      setPhoto(compressedDataUrl);
      if (onPhotoAssigned) onPhotoAssigned(compressedDataUrl);
    } catch (err) {
      console.error('Failed to process image file:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyUrl = () => {
    if (!imageUrl.trim()) return;
    setArchangelPhoto(archangel, imageUrl.trim());
    setPhoto(imageUrl.trim());
    if (onPhotoAssigned) onPhotoAssigned(imageUrl.trim());
    setShowUrlInput(false);
    setImageUrl('');
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeArchangelPhoto(archangel);
    setPhoto(null);
  };

  const containerStyles = {
    'card-banner': 'h-48 sm:h-56 w-full',
    'temple-featured': 'h-52 sm:h-64 w-full',
    'compact': 'h-36 w-full',
    'hero': 'h-72 sm:h-96 w-full',
    'thumbnail': 'h-24 w-full',
  };

  // Render bespoke vector artwork if no custom photo is present
  const renderFallbackVector = () => {
    if (normKey === 'michael') return <MichaelSvgArtwork />;
    if (normKey === 'gabriel') return <GabrielSvgArtwork />;
    if (normKey === 'raphael') return <RaphaelSvgArtwork />;
    if (normKey === 'uriel') return <UrielSvgArtwork />;
    if (normKey === 'chamuel') return <ChamuelSvgArtwork />;

    // For other Archangels: render rich sacred aura vector
    return (
      <div 
        className="relative h-full w-full flex flex-col items-center justify-center p-4 text-center overflow-hidden"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${theme.bgGradient[2]} 0%, ${theme.bgGradient[1]} 45%, ${theme.bgGradient[0]} 100%)`,
        }}
      >
        {/* Sacred Geometry Rays Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
        
        {/* Central Luminous Aura Circle */}
        <div className="relative z-10 flex flex-col items-center space-y-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 border border-white/30 backdrop-blur-md shadow-2xl animate-pulse">
            {theme.symbol === 'flame' && <Flame className="h-8 w-8 text-amber-300" />}
            {theme.symbol === 'heart' && <Heart className="h-8 w-8 text-rose-300" />}
            {theme.symbol === 'moon' && <Moon className="h-8 w-8 text-blue-200" />}
            {theme.symbol === 'sun' && <Sun className="h-8 w-8 text-yellow-300" />}
            {theme.symbol === 'leaf' && <Leaf className="h-8 w-8 text-emerald-300" />}
            {theme.symbol === 'eye' && <Eye className="h-8 w-8 text-indigo-300" />}
            {theme.symbol === 'compass' && <Compass className="h-8 w-8 text-purple-300" />}
            {theme.symbol === 'feather' && <Feather className="h-8 w-8 text-amber-100" />}
            {theme.symbol === 'music' && <Sparkles className="h-8 w-8 text-teal-300" />}
            {theme.symbol === 'cube' && <Crown className="h-8 w-8 text-orange-300" />}
            {theme.symbol === 'star' && <Star className="h-8 w-8 text-cyan-200" />}
          </div>

          <div className="space-y-0.5">
            <h4 className="font-serif text-base sm:text-lg font-bold text-white drop-shadow-md">
              {archangel}
            </h4>
            <p className="text-[11px] text-purple-100/90 font-medium max-w-xs px-2">
              {theme.tagline}
            </p>
          </div>

          <span className="inline-flex items-center space-x-1 rounded-full bg-black/40 px-2.5 py-0.5 text-[9px] font-semibold text-amber-300 border border-white/20 backdrop-blur-xs">
            <Sparkles className="h-2.5 w-2.5" />
            <span>{theme.rayColor}</span>
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div
        onClick={() => allowZoom && setIsZoomed(true)}
        className={`group relative overflow-hidden rounded-2xl border ${
          photo ? 'border-amber-400/60 shadow-amber-500/10' : 'border-purple-800/40'
        } bg-slate-950 shadow-xl select-none transition-all duration-300 hover:border-amber-400 hover:shadow-2xl ${
          allowZoom ? 'cursor-pointer' : ''
        } ${containerStyles[variant]} ${className}`}
      >
        {/* Main Artwork or Custom Photo */}
        <div className="relative h-full w-full overflow-hidden bg-slate-950 flex items-center justify-center">
          {photo ? (
            <img
              src={photo}
              alt={`${archangel} Assigned Portrait`}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            renderFallbackVector()
          )}

          {/* Subtle bottom vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
        </div>

        {/* Top-Left Name Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center space-x-1.5 pointer-events-none">
          <span className="rounded-md bg-slate-950/85 px-2 py-0.5 text-[9px] font-bold tracking-wider text-amber-300 border border-amber-400/40 backdrop-blur-xs flex items-center space-x-1 shadow-md">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span className="uppercase">{archangel}</span>
          </span>
          {photo && (
            <span className="rounded-md bg-emerald-950/85 px-2 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/40 backdrop-blur-xs flex items-center space-x-1 shadow-md">
              <Check className="h-3 w-3" />
              <span>Custom Photo</span>
            </span>
          )}
        </div>

        {/* Top-Right Quick Assign & Zoom Controls */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center space-x-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            disabled={isProcessing}
            title={`Assign / Change Photo for ${archangel}`}
            className="flex items-center space-x-1 rounded-lg bg-slate-950/85 px-2 py-1 text-[10px] font-semibold text-amber-300 hover:text-white hover:bg-amber-600/80 border border-amber-400/50 opacity-90 group-hover:opacity-100 transition-all backdrop-blur-xs shadow-md"
          >
            <Camera className="h-3 w-3" />
            <span className="hidden sm:inline">{photo ? 'Change Photo' : 'Assign Photo'}</span>
          </button>

          {allowZoom && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(true);
              }}
              title="Inspect Full Portrait & Manage Photo"
              className="rounded-lg bg-slate-950/85 p-1.5 text-purple-300 hover:text-amber-300 border border-purple-800/60 opacity-80 group-hover:opacity-100 transition-opacity backdrop-blur-xs shadow-md"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Bottom Status Caption */}
        {showCaption && (
          <div className="absolute bottom-2 inset-x-2 z-10 flex items-center justify-between rounded-xl bg-slate-950/85 px-3 py-1.5 border border-purple-900/60 backdrop-blur-xs text-[10px] text-purple-200">
            <div className="flex items-center space-x-1.5 font-medium text-amber-200 truncate">
              <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />
              <span className="truncate">
                {photo ? 'Custom assigned photo active' : theme.tagline}
              </span>
            </div>
            <span className="text-[9px] text-purple-300/80 shrink-0 pl-2">
              {photo ? 'Click to inspect / change' : 'Click to assign photo'}
            </span>
          </div>
        )}
      </div>

      {/* Lightbox / Zoom Modal for Archangel Portrait & Custom Assignment */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full overflow-hidden rounded-3xl border-2 border-amber-400/50 bg-slate-950 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-slate-100">
                    {archangel} • Sacred Portrait Studio
                  </h3>
                  <p className="text-[11px] text-amber-300/80">
                    {photo ? 'Custom Assigned Photo Active' : 'Default Sacred Iconography & Archetype'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="rounded-full bg-slate-900 p-1.5 text-purple-300 hover:text-white border border-purple-800/60 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Visual Frame */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl border border-amber-400/40 bg-slate-950 flex items-center justify-center">
              {photo ? (
                <img
                  src={photo}
                  alt={`${archangel} Full Portrait`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-contain"
                />
              ) : (
                renderFallbackVector()
              )}
            </div>

            {/* Photo Assignment & Upload Controls */}
            <div className="space-y-2 rounded-2xl bg-slate-900/80 border border-purple-900/60 p-3.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2 text-purple-200">
                  <ImageIcon className="h-4 w-4 text-amber-300 shrink-0" />
                  <span className="font-medium">
                    {photo
                      ? `Custom photo assigned to ${archangel}.`
                      : `Assign your preferred photo or portrait for ${archangel}.`}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="flex items-center space-x-1.5 rounded-xl bg-amber-500/20 px-3 py-1.5 font-semibold text-amber-200 border border-amber-400/40 hover:bg-amber-500/30 transition-all"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>{photo ? 'Replace File' : 'Upload Photo'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="flex items-center space-x-1.5 rounded-xl bg-purple-900/40 px-2.5 py-1.5 text-purple-200 border border-purple-700/40 hover:bg-purple-900/60 transition-all"
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                    <span>URL</span>
                  </button>

                  {photo && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex items-center space-x-1 rounded-xl bg-slate-800 px-2.5 py-1.5 text-purple-300 hover:text-rose-300 border border-purple-700/40 transition-all"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Paste Image URL Drawer */}
              {showUrlInput && (
                <div className="flex items-center space-x-2 pt-2 border-t border-purple-900/40 animate-in fade-in">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste image link (e.g. https://...)"
                    className="flex-1 rounded-xl bg-slate-950 border border-purple-800 px-3 py-1.5 text-xs text-white placeholder-purple-400/50 focus:border-amber-400 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    disabled={!imageUrl.trim()}
                    className="rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 disabled:opacity-50 hover:bg-amber-400 transition-all"
                  >
                    Apply URL
                  </button>
                </div>
              )}
            </div>

            {/* Archangel Virtues & Ray Summary */}
            <div className="rounded-2xl border border-purple-900/50 bg-slate-900/60 p-3 text-xs space-y-1">
              <div className="flex items-center justify-between text-amber-300 font-semibold">
                <span>Divine Ray & Domain</span>
                <span>{theme.rayColor}</span>
              </div>
              <p className="text-purple-200/80 text-[11px] leading-relaxed">
                Photos assigned here will automatically appear on all Daily Oracle draws, Clarification cards, and the Archangels Temple sanctuary.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
