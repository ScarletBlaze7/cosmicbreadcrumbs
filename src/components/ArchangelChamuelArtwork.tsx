import React from 'react';
import { ArchangelDynamicArtwork } from './ArchangelDynamicArtwork';

interface Props {
  className?: string;
  variant?: string;
}

export const ArchangelChamuelArtwork: React.FC<Props> = ({ className = 'w-full h-full' }) => {
  return <ArchangelDynamicArtwork archangel="Archangel Chamuel" className={className} />;
};

export default ArchangelChamuelArtwork;
