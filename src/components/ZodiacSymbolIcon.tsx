import React, { useState } from 'react';

interface ZodiacSymbolIconProps {
  sign?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number | string;
  fallbackText?: string;
}

const ZODIAC_UNICODE_MAP: Record<string, string> = {
  aries: '♈',
  taurus: '♉',
  gemini: '♊',
  cancer: '♋',
  leo: '♌',
  virgo: '♍',
  libra: '♎',
  scorpio: '♏',
  sagittarius: '♐',
  capricorn: '♑',
  aquarius: '♒',
  pisces: '♓',
};

const sizeMap: Record<string, string> = {
  sm: 'w-6 h-6 text-sm',
  md: 'w-10 h-10 text-lg',
  lg: 'w-16 h-16 text-2xl',
  xl: 'w-24 h-24 text-4xl',
};

export const ZodiacSymbolIcon: React.FC<ZodiacSymbolIconProps> = ({
  sign = 'aries',
  className = '',
  size = 'md',
  fallbackText,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);

  const normalizedSign = String(sign).toLowerCase().trim() || 'aries';
  const dimensionClass = typeof size === 'string' && sizeMap[size] ? sizeMap[size] : '';
  const inlineStyle = typeof size === 'number' ? { width: size, height: size } : typeof size === 'string' && !sizeMap[size] ? { width: size, height: size } : undefined;

  const sources = [
    `/assets/zodiac/${normalizedSign}.png`,
    `/assets/${normalizedSign}.png`,
    `/${normalizedSign}.png`,
    `./assets/zodiac/${normalizedSign}.png`,
    `./assets/${normalizedSign}.png`,
  ];

  const handleImageError = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex(srcIndex + 1);
    } else {
      setImageFailed(true);
    }
  };

  const symbolChar = fallbackText || ZODIAC_UNICODE_MAP[normalizedSign] || '✨';

  return (
    <span className={`inline-flex items-center justify-center ${dimensionClass} ${className}`} style={inlineStyle}>
      {!imageFailed ? (
        <img
          src={sources[srcIndex]}
          alt={`${sign} Zodiac Sign`}
          className="w-full h-full object-contain select-none"
          onError={handleImageError}
        />
      ) : (
        <span className="font-serif font-bold text-amber-300 select-none">
          {symbolChar}
        </span>
      )}
    </span>
  );
};

export default ZodiacSymbolIcon;
