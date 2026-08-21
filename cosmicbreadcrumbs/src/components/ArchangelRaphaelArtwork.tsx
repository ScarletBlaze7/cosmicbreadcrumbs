import React from 'react';

interface Props {
  className?: string;
  variant?: string;
}

export const ArchangelRaphaelArtwork: React.FC<Props> = ({ className = 'w-full h-full' }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <img
        src="/assets/ArchAngel.Raphael.png.jpg"
        alt="Archangel Raphael"
        className="w-full h-full object-cover select-none pointer-events-none"
      />
    </div>
  );
};

export default ArchangelRaphaelArtwork;
