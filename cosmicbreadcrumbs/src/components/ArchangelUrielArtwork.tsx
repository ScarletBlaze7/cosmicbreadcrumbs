import React from 'react';

interface Props {
  className?: string;
  variant?: string;
}

export const ArchangelUrielArtwork: React.FC<Props> = ({ className = 'w-full h-full' }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <img
        src="/assets/ArchAngel.Uriel.png.jpg"
        alt="Archangel Uriel"
        className="w-full h-full object-cover select-none pointer-events-none"
      />
    </div>
  );
};

export default ArchangelUrielArtwork;
