import React, { useState } from 'react';
import { Crown } from 'lucide-react';

interface SanctuaryEmblemProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  tier?: string;
  isUnlocked?: boolean;
  interactive?: boolean;
  onUpgradeClick?: () => void;
  className?: string;
}

const sizeMap: Record<string, string> = {
  xs: 'w-8 h-8',
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48',
};

export const SanctuaryEmblem: React.FC<SanctuaryEmblemProps> = ({
  size = 'md',
  isUnlocked = false,
  interactive = false,
  onUpgradeClick,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const dimensionClass = sizeMap[size] || sizeMap.md;
  const primarySrc = isUnlocked ? '/assets/sanctuaryemb.jpg' : '/assets/freeseeker.jpg';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    if (target.src.includes('sanctuaryemb.jpg')) {
      target.src = './assets/sanctuaryemb.jpg';
    } else if (target.src.includes('freeseeker.jpg')) {
      target.src = './assets/freeseeker.jpg';
    } else if (target.src.includes('sancuaryemb.jpg')) {
      target.src = './assets/sancuaryemb.jpg';
    } else if (target.src.includes('./assets/')) {
      target.src = '/assets/sanc.png';
    } else {
      setImageError(true);
    }
  };

  return (
    <div
      onClick={!isUnlocked && interactive ? onUpgradeClick : undefined}
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden transition-all duration-300 ${dimensionClass} ${
        !isUnlocked ? 'cursor-pointer hover:opacity-90' : 'drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]'
      } ${className}`}
    >
      {!imageError ? (
        <img
          src={primarySrc}
          onError={handleImageError}
          alt={isUnlocked ? "Sacred Sanctuary Membership Emblem" : "Free Seeker Emblem"}
          className="w-full h-full object-contain rounded-full"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-amber-600 via-purple-900 to-indigo-950 border-2 border-amber-400/80 shadow-inner">
          <Crown className="h-[60%] w-[60%] text-amber-300 drop-shadow" />
        </div>
      )}
    </div>
  );
};

export default SanctuaryEmblem;
