import React from 'react';
import { ArchangelDynamicArtwork } from './ArchangelDynamicArtwork';

interface Props {
  className?: string;
  variant?: string;
}

export const ArchangelRaphaelArtwork: React.FC<Props> = ({ className = 'w-full h-full' }) => {
  return <ArchangelDynamicArtwork archangel="Archangel Raphael" className={className} />;
};

export default ArchangelRaphaelArtwork;
