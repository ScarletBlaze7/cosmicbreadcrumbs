import React from 'react';

interface ZodiacSymbolIconProps {
  sign?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number | string;
  fallbackText?: string;
}

const sizeMap: Record<string, string> = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

export const ZodiacSymbolIcon: React.FC<ZodiacSymbolIconProps> = ({
  sign = 'aries',
  className = '',
  size = 'md',
  fallbackText,
}) => {
  const normalizedSign = String(sign).toLowerCase().trim();
  const dimensionClass = typeof size === 'string' && sizeMap[size] ? sizeMap[size] : '';
  const inlineStyle = typeof size === 'number' ? { width: size, height: size } : typeof size === 'string' && !sizeMap[size] ? { width: size, height: size } : undefined;

  return (
    <span className={`inline-flex items-center justify-center ${dimensionClass} ${className}`} style={inlineStyle}>
      <img
        src={`/assets/${normalizedSign}.png`}
        alt={`${sign} zodiac symbol`}
        className="w-full h-full object-contain select-none"
        onError={(e) => {
          if (fallbackText) {
            const parent = (e.target as HTMLElement).parentElement;
            if (parent) {
              parent.innerText = fallbackText;
            }
          }
        }}
      />
    </span>
  );
};

export default ZodiacSymbolIcon;
