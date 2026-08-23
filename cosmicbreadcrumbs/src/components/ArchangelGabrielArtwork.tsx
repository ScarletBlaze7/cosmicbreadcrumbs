import React from 'react';
import { ArchangelDynamicArtwork } from './ArchangelDynamicArtwork';

interface Props {
  className?: string;
  variant?: string;
}

export const ArchangelGabrielArtwork: React.FC<Props> = ({ className = 'w-full h-full' }) => {
  return <ArchangelDynamicArtwork archangel="Archangel Gabriel" className={className} />;
};

export default ArchangelGabrielArtwork;
