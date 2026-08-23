import React from 'react';
import { ArchangelDynamicArtwork } from './ArchangelDynamicArtwork';

interface Props {
  className?: string;
  variant?: string;
}

export const ArchangelMichaelArtwork: React.FC<Props> = ({ className = 'w-full h-full' }) => {
  return <ArchangelDynamicArtwork archangel="Archangel Michael" className={className} />;
};

export default ArchangelMichaelArtwork;
