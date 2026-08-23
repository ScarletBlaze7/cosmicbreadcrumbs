import React, { useState } from 'react';

interface ProfileProps {
  isMember: boolean; // true if active trial or paid membership
  username?: string;
  size?: 'sm' | 'md' | 'lg' | 'header';
  countdownText?: string;
  onClick?: () => void;
  className?: string;
}

export const SanctuaryProfileBadge: React.FC<ProfileProps> = ({ 
  isMember, 
  username,
  size = 'md',
  countdownText,
  onClick,
  className = ''
}) => {
  const memberImages = ['/assets/sanctemb.jpg', './assets/sanctemb.jpg', '/assets/sanctuaryemb.jpg', './assets/sanctuaryemb.jpg', '/sanctemb.jpg'];
  const seekerImages = ['/assets/seeker.png', './assets/seeker.png', '/assets/seeker.jpg', './assets/freeseeker.jpg', '/seeker.png'];

  const [imgIndex, setImgIndex] = useState(0);
  const images = isMember ? memberImages : seekerImages;
  const currentSrc = images[imgIndex % images.length];

  const handleImgError = () => {
    if (imgIndex < images.length - 1) {
      setImgIndex(prev => prev + 1);
    }
  };

  if (size === 'header') {
    return (
      <button
        type="button"
        onClick={onClick}
        id="btn-header-sanctuary-badge"
        className={`group flex flex-col items-center justify-center rounded-2xl border p-1 transition-all hover:scale-105 active:scale-95 focus:outline-none shrink-0 ${
          isMember
            ? 'border-amber-400/90 bg-gradient-to-b from-amber-950/60 via-purple-950/80 to-slate-950 shadow-lg shadow-amber-500/20'
            : 'border-purple-600/80 bg-gradient-to-b from-purple-950/60 via-slate-900 to-slate-950 shadow-md shadow-purple-950/40'
        } ${className}`}
        title={isMember ? 'Sanctuary Member / Trial Active • Click to open Account Area' : 'Free Seeker • Click to open Account Area'}
      >
        {/* Badge Icon Image */}
        <div className={`relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl overflow-hidden border shadow-sm ${
          isMember 
            ? 'border-amber-400 drop-shadow-[0_0_10px_rgba(212,175,55,0.6)] bg-slate-950' 
            : 'border-purple-500/80 bg-slate-950'
        }`}>
          <img
            src={currentSrc}
            onError={handleImgError}
            alt={isMember ? 'Sanctuary Member Emblem (sanctemb.jpg)' : 'Free Seeker Badge (seeker.png)'}
            className="h-full w-full object-cover select-none"
          />
        </div>

        {/* Free trial countdown time or status MUCH SMALLER directly under the badge */}
        <span className={`text-[8px] sm:text-[9px] font-mono font-bold tracking-tight block leading-tight mt-0.5 max-w-[70px] sm:max-w-[85px] truncate text-center drop-shadow-sm ${
          isMember ? 'text-amber-300' : 'text-purple-300'
        }`}>
          {countdownText || (isMember ? 'Member' : 'Account')}
        </span>
      </button>
    );
  }

  return (
    <div className={`flex flex-col items-center p-4 ${className}`}>
      {username && (
        <h3 className="text-[#E5C07B] font-serif text-lg mb-3">{username}'s Sanctuary</h3>
      )}
      
      <div className="flex flex-col items-center">
        <div className={`overflow-hidden rounded-2xl border-2 ${
          isMember 
            ? 'border-amber-400 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]' 
            : 'border-purple-800/60 shadow-lg'
        } ${size === 'sm' ? 'w-16 h-16' : size === 'lg' ? 'w-48 h-48' : 'w-32 h-32'}`}>
          <img
            src={currentSrc}
            onError={handleImgError}
            alt={isMember ? 'Sanctuary Member Badge (sanctemb.jpg)' : 'Free Seeker Badge (seeker.png)'}
            className="w-full h-full object-cover select-none"
          />
        </div>
        <span className={`text-xs tracking-widest mt-2 uppercase font-bold ${isMember ? 'text-[#D4AF37]' : 'text-purple-300'}`}>
          {isMember ? 'Sanctuary Member' : 'Free Seeker'}
        </span>
        {countdownText && (
          <span className="text-[10px] font-mono text-amber-300 mt-0.5">
            {countdownText}
          </span>
        )}
      </div>
    </div>
  );
};

export default SanctuaryProfileBadge;
