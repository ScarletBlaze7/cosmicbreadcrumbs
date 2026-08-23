import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showUploadTrigger?: boolean;
}

export const CosmicLogo: React.FC<Props> = ({ className = '', size = 'md' }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const customLogoUrl = typeof window !== 'undefined' ? localStorage.getItem('auranova_custom_logo') : null;

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  const currentSrc = customLogoUrl || '/assets/logo.png';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    if (target.src.includes('/assets/logo.png')) {
      target.src = './assets/logo.png';
    } else if (target.src.includes('./assets/logo.png')) {
      target.src = '/assets/logo.photo.png';
    } else if (target.src.includes('/assets/logo.photo.png')) {
      target.src = '/assets/sanctuary_emblem.png';
    } else {
      setImageFailed(true);
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shadow-lg border border-amber-500/40 bg-slate-950 ${sizeClasses[size]} ${className}`}
    >
      {!imageFailed ? (
        <img
          src={currentSrc}
          onError={handleImageError}
          alt="Cosmic Breadcrumbs Logo"
          className="w-full h-full object-cover select-none pointer-events-none"
        />
      ) : (
        <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950">
          <svg viewBox="0 0 100 100" className="h-[85%] w-[85%] drop-shadow-md">
            <defs>
              <radialGradient id="logoGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="60%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#312e81" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="44" fill="url(#logoGlow)" opacity="0.3" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="28" fill="#1e1b4b" stroke="#c084fc" strokeWidth="1.5" />
            <path d="M50 24 L54 44 L74 48 L56 56 L60 76 L50 62 L40 76 L44 56 L26 48 L46 44 Z" fill="#fbbf24" opacity="0.95" />
            <circle cx="50" cy="50" r="5" fill="#ffffff" />
          </svg>
          <Sparkles className="absolute top-1 right-1 h-3 w-3 text-amber-300 animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default CosmicLogo;
