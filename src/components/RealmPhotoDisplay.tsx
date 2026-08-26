import React from 'react';
import { RealmPhotoKey, getRealmPhoto } from '../utils/realmPhotoManager';

interface RealmPhotoDisplayProps {
  realm: RealmPhotoKey;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const RealmPhotoDisplay: React.FC<RealmPhotoDisplayProps> = ({ 
  realm, 
  title, 
  subtitle,
  className = '' 
}) => {
  const photoSrc = getRealmPhoto(realm);

  return (
    <div 
      className={`relative w-full rounded-2xl overflow-hidden border border-[#241f3d] bg-[#12101f] shadow-lg shadow-purple-950/20 ${className}`}
    >
      {/* Permanent Banner Image Container */}
      <div className="w-full h-48 sm:h-56 relative overflow-hidden">
        <img 
          src={photoSrc} 
          alt={title || realm} 
          className="w-full h-full object-cover"
        />
        {/* Cosmic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07060f] via-transparent to-black/30 pointer-events-none" />

        {/* Text Overlay at bottom of banner */}
        {(title || subtitle) && (
          <div className="absolute bottom-3 left-4 right-4 pointer-events-none">
            {subtitle && (
              <p className="text-[10px] tracking-[3px] uppercase font-bold text-purple-400 drop-shadow-md">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-lg sm:text-xl font-bold tracking-wide text-white drop-shadow-md">
                {title}
              </h2>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
