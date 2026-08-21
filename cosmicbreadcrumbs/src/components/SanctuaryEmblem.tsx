import React from 'react';

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
  const dimensionClass = sizeMap[size] || sizeMap.md;

  return (
    <div
      onClick={!isUnlocked && interactive ? onUpgradeClick : undefined}
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden transition-all duration-300 ${dimensionClass} ${
        !isUnlocked ? 'cursor-pointer grayscale opacity-60 hover:opacity-80' : 'drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]'
      } ${className}`}
    >
      <img
        src="/assets/sanctuary_emblem.png"
        alt="Sacred Sanctuary Emblem"
        className="w-full h-full object-contain rounded-full"
      />
      {!isUnlocked && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <span className="text-amber-300 text-[9px] font-mono font-bold tracking-wider uppercase bg-black/60 px-1 py-0.5 rounded border border-amber-500/40">
            Locked
          </span>
        </div>
      )}
    </div>
  );
};

export default SanctuaryEmblem;
