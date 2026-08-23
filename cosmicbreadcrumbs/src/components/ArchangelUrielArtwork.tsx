import React from 'react';
import { ArchangelDynamicArtwork } from './ArchangelDynamicArtwork';

interface Props {
  className?: string;
  variant?: string;
}

export const ArchangelUrielArtwork: React.FC<Props> = ({ className = 'w-full h-full' }) => {
  return <ArchangelDynamicArtwork archangel="Archangel Uriel" className={className} />;
};

export default ArchangelUrielArtwork;
