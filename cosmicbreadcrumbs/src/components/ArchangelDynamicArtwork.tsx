import React, { useState } from 'react';
import { Feather, Sparkles } from 'lucide-react';

interface ArchangelDynamicArtworkProps {
  archangelKey?: string;
  archangel?: string;
  name?: string;
  variant?: string;
  className?: string;
}

const ARCHANGEL_ASSET_MAP: Record<string, string> = {
  michael: '/assets/angels/michael.png',
  gabriel: '/assets/angels/gabriel.jpg',
  raphael: '/assets/angels/raphael.jpg',
  uriel: '/assets/angels/uriel.png',
  chamuel: '/assets/angels/chamuel.png',
  jophiel: '/assets/angels/jophiel.png',
  zadkiel: '/assets/angels/zadkiel.jpg',
  metatron: '/assets/angels/metatron.png',
  sandalphon: '/assets/angels/sandalphon.png',
  raziel: '/assets/angels/raziel.png',
  ariel: '/assets/angels/ariel.png',
  haniel: '/assets/angels/haniel.png',
};

export const ArchangelDynamicArtwork: React.FC<ArchangelDynamicArtworkProps> = ({
  archangelKey = '',
  archangel = '',
  name = '',
  className = 'w-full h-full',
}) => {
  const [imageError, setImageError] = useState(false);
  const targetName = archangel || archangelKey || name;
  const normalizedKey = targetName.toLowerCase().replace(/[^a-z]/g, '').replace('archangel', '');
  const primarySrc = ARCHANGEL_ASSET_MAP[normalizedKey] || `/assets/angels/${normalizedKey}.png`;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    if (target.src.includes('/assets/angels/')) {
      target.src = `./assets/angels/${primarySrc.replace('/assets/angels/', '')}`;
    } else if (target.src.includes('./assets/angels/')) {
      target.src = `/assets/ArchAngel.${normalizedKey}.png.jpg`;
    } else if (target.src.includes('ArchAngel.')) {
      target.src = `/assets/angel.${normalizedKey}.jpg`;
    } else if (target.src.includes('angel.')) {
      target.src = '/assets/tarotback.jpg';
    } else {
      setImageError(true);
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-purple-950/60 to-slate-950 border border-purple-800/40 ${className}`}>
      {!imageError ? (
        <img
          src={primarySrc}
          onError={handleImageError}
          alt={targetName || 'Archangel Oracle Artwork'}
          className="w-full h-full object-cover select-none pointer-events-none transition-opacity duration-300"
        />
      ) : (
        <div className="flex h-48 w-full flex-col items-center justify-center p-6 text-center space-y-2 bg-gradient-to-b from-purple-950 via-slate-900 to-slate-950">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/40 shadow-lg">
            <Feather className="h-6 w-6 animate-pulse" />
          </div>
          <span className="font-serif text-sm font-bold text-amber-200">{targetName}</span>
          <span className="text-[10px] text-purple-300 uppercase tracking-widest">Sacred Celestial Presence</span>
          <Sparkles className="h-4 w-4 text-amber-300" />
        </div>
      )}
    </div>
  );
};

export default ArchangelDynamicArtwork;
