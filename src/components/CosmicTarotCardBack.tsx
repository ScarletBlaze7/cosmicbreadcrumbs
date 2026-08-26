import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface CosmicTarotCardBackProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const CosmicTarotCardBack: React.FC<CosmicTarotCardBackProps> = ({
  className = '',
  width = '100%',
  height = '100%',
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);

  const sources = [
    '/assets/tarotback.jpg',
    '/assets/Tarot.png',
    '/tarotback.jpg',
    '/Tarot.png',
    './assets/tarotback.jpg',
    '/assets/tarotcards.jpg',
  ];

  const handleImageError = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex(srcIndex + 1);
    } else {
      setImageFailed(true);
    }
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/50 bg-[#070914] ${className}`}
      style={{ width, height }}
    >
      {!imageFailed ? (
        <img
          src={sources[srcIndex]}
          onError={handleImageError}
          alt="Cosmic Tarot Card Back"
          className="w-full h-full object-cover rounded-2xl select-none pointer-events-none transition-opacity duration-200"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center p-3 bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950 border-2 border-amber-400/80">
          <Sparkles className="h-8 w-8 text-amber-400 animate-pulse mb-1.5" />
          <span className="text-xs font-serif text-amber-300 font-bold uppercase tracking-widest text-center">
            Cosmic Tarot
          </span>
          <span className="text-[9px] text-purple-300 tracking-wider uppercase mt-0.5">
            Rider-Waite Deck
          </span>
        </div>
      )}
    </div>
  );
};

export default CosmicTarotCardBack;
