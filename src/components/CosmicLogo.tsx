import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showUploadTrigger?: boolean;
}

export const CosmicLogo: React.FC<Props> = ({ className = '', size = 'md' }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);

  const sources = [
    '/assets/appicon.jpg',
    '/assets/appicon.png',
    '/assets/icon.png',
    '/appicon.jpg',
    './assets/appicon.jpg',
    '/icon.png',
  ];

  const sizeClasses = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11 sm:w-13 sm:h-13',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  const handleImageError = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex(srcIndex + 1);
    } else {
      setImageFailed(true);
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden shadow-lg border border-amber-400/60 bg-slate-950 flex-shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {!imageFailed ? (
        <img
          src={sources[srcIndex]}
          onError={handleImageError}
          alt="Cosmic Breadcrumbs App Icon"
          className="w-full h-full object-cover select-none pointer-events-none"
        />
      ) : (
        <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950">
          <Sparkles className="h-6 w-6 text-amber-300 animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default CosmicLogo;
