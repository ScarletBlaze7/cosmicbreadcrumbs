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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    if (target.src.includes('/assets/tarotback.jpg')) {
      target.src = './assets/tarotback.jpg';
    } else if (target.src.includes('./assets/tarotback.jpg')) {
      target.src = '/assets/tarotback.png';
    } else if (target.src.includes('/assets/tarotback.png')) {
      target.src = '/assets/Tarot.png';
    } else {
      setImageFailed(true);
    }
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-2xl border border-amber-500/40 bg-[#070914] ${className}`}
      style={{ width, height }}
    >
      {!imageFailed ? (
        <img
          src="/assets/tarotback.jpg"
          onError={handleImageError}
          alt="Tarot Card Back"
          className="w-full h-full object-cover rounded-xl select-none pointer-events-none"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center p-3 bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950 border-2 border-amber-400/50">
          <Sparkles className="h-6 w-6 text-amber-400 animate-pulse mb-1" />
          <span className="text-[10px] font-serif text-amber-300 font-bold uppercase tracking-widest text-center">
            Cosmic Tarot
          </span>
        </div>
      )}
    </div>
  );
};

export default CosmicTarotCardBack;
