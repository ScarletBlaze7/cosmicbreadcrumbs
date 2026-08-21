import React from 'react';

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
  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-2xl border border-amber-500/30 ${className}`}
      style={{ width, height }}
    >
      <img
        src="/assets/tarotback.jpg"
        alt="Tarot Card Back"
        className="w-full h-full object-cover rounded-xl select-none pointer-events-none"
      />
    </div>
  );
};

export default CosmicTarotCardBack;
