import React, { useState } from 'react';
import { Crown } from 'lucide-react';

interface SanctuaryEmblemProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  tier?: string;
  isUnlocked?: boolean;
  interactive?: boolean;
  onUpgradeClick?: () => void;
  className?: string;
  onClick?: () => void;
}

const sizeMap: Record<string, string> = {
  xs: 'w-8 h-8',
  sm: 'w-11 h-11 sm:w-12 sm:h-12',
  md: 'w-20 h-20 sm:w-24 sm:h-24',
  lg: 'w-32 h-32 sm:w-36 sm:h-36',
  xl: 'w-48 h-48 sm:w-56 sm:h-56',
};

export const SanctuaryEmblem: React.FC<SanctuaryEmblemProps> = ({
  size = 'md',
  isUnlocked = false,
  interactive = false,
  onUpgradeClick,
  onClick,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);
  const dimensionClass = sizeMap[size] || sizeMap.md;

  const sources = [
    '/assets/satem.jpg',
    '/assets/sanctuaryemb.jpg',
    '/satem.jpg',
    '/sanctuaryemb.jpg',
    './assets/satem.jpg',
  ];

  const handleImageError = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex(srcIndex + 1);
    } else {
      setImageError(true);
    }
  };

  const handleClick = () => {
    if (onClick) onClick();
    else if (!isUnlocked && interactive && onUpgradeClick) onUpgradeClick();
  };

  return (
    <div
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center rounded-full aspect-square shrink-0 overflow-hidden transition-all duration-300 p-0.5 border-2 ${
        isUnlocked
          ? 'border-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.75)] bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 hover:scale-105'
          : 'border-purple-400/80 shadow-[0_0_12px_rgba(168,85,247,0.5)] bg-gradient-to-tr from-purple-800 via-indigo-900 to-purple-600 hover:scale-105'
      } ${dimensionClass} ${className}`}
      title={isUnlocked ? 'Sacred Sanctuary Member Emblem (Active)' : 'Sanctuary Club Emblem (Tap to view 3-Day Free Trial)'}
    >
      <div className="relative w-full h-full rounded-full aspect-square overflow-hidden bg-slate-950 flex items-center justify-center">
        {!imageError ? (
          <img
            src={sources[srcIndex]}
            onError={handleImageError}
            alt="Sacred Sanctuary Membership Emblem"
            className="w-full h-full aspect-square object-cover object-center rounded-full select-none pointer-events-none"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-amber-600 via-purple-900 to-indigo-950 shadow-inner">
            <Crown className="h-[60%] w-[60%] text-amber-300 drop-shadow" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SanctuaryEmblem;
