import React from 'react';

interface ArchangelDynamicArtworkProps {
  archangelKey?: string;
  archangel?: string;
  name?: string;
  variant?: string;
  className?: string;
}

const ARCHANGEL_ASSET_MAP: Record<string, string> = {
  raziel: '/assets/ArchAngel.Raziel.png.jpg',
  sandalphon: '/assets/ArchAngel.Sandalphon.png.jpg',
  uriel: '/assets/ArchAngel.Uriel.png.jpg',
  zadkiel: '/assets/ArchAngel.Zadkiel.png.jpg',
  ariel: '/assets/Ariel.png.jpg',
  michael: '/assets/ArchAngel.Michael.png.jpg',
  gabriel: '/assets/ArchAngel.Gabriel.png.jpg',
  raphael: '/assets/ArchAngel.Raphael.png.jpg',
  chamuel: '/assets/ArchAngel.Chamuel.png.jpg',
  jophiel: '/assets/ArchAngel.Jophiel.png.jpg',
  metatron: '/assets/ArchAngel.Metatron.png.jpg',
  haniel: '/assets/ArchAngel.Haniel.png.jpg',
};

export const ArchangelDynamicArtwork: React.FC<ArchangelDynamicArtworkProps> = ({
  archangelKey = '',
  archangel = '',
  name = '',
  className = 'w-full h-full',
}) => {
  const targetName = archangel || archangelKey || name;
  const normalizedKey = targetName.toLowerCase().replace(/[^a-z]/g, '');
  const matchedSrc = ARCHANGEL_ASSET_MAP[normalizedKey] || `/assets/${targetName}.png` || '/assets/tarotback.jpg';

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <img
        src={matchedSrc}
        alt={targetName || 'Archangel Oracle Artwork'}
        className="w-full h-full object-cover select-none pointer-events-none"
      />
    </div>
  );
};

export default ArchangelDynamicArtwork;
