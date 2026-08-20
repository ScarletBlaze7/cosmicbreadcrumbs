import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  Camera, 
  Trash2, 
  Check, 
  X, 
  ShieldCheck,
  ZoomIn,
  RefreshCw
} from 'lucide-react';

export const CUSTOM_LOGO_STORAGE_KEY = 'cosmic_breadcrumbs_custom_logo';
export const COSMIC_VIDEO_TITLE_STORAGE_KEY = 'cosmic_breadcrumbs_main_video_title';

interface CosmicLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showUploadTrigger?: boolean;
  className?: string;
}

export const CosmicLogo: React.FC<CosmicLogoProps> = ({
  size = 'md',
  showUploadTrigger = false,
  className = '',
}) => {
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(() => {
    return localStorage.getItem(COSMIC_VIDEO_TITLE_STORAGE_KEY) || localStorage.getItem(CUSTOM_LOGO_STORAGE_KEY);
  });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [tempPreview, setTempPreview] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync if updated in another component
  useEffect(() => {
    const handleStorageChange = () => {
      const vid = localStorage.getItem(COSMIC_VIDEO_TITLE_STORAGE_KEY);
      const img = localStorage.getItem(CUSTOM_LOGO_STORAGE_KEY);
      setCustomLogoUrl(vid || img);
      setIsVideo(Boolean(vid && (vid.startsWith('data:video') || vid.endsWith('.mp4') || vid.endsWith('.webm'))));
    };
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-24 w-24 text-xl',
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video/');
      const isImg = file.type.startsWith('image/');
      if (!isVid && !isImg) {
        return;
      }
      setIsVideo(isVid);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setTempPreview(result);
        setShowModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCustomLogo = () => {
    if (tempPreview) {
      if (isVideo) {
        localStorage.setItem(COSMIC_VIDEO_TITLE_STORAGE_KEY, tempPreview);
      } else {
        localStorage.setItem(CUSTOM_LOGO_STORAGE_KEY, tempPreview);
      }
      setCustomLogoUrl(tempPreview);
      setShowModal(false);
      setTempPreview(null);
    }
  };

  const handleRemoveCustomLogo = () => {
    localStorage.removeItem(CUSTOM_LOGO_STORAGE_KEY);
    localStorage.removeItem(COSMIC_VIDEO_TITLE_STORAGE_KEY);
    setCustomLogoUrl(null);
    setShowModal(false);
    setTempPreview(null);
  };

  return (
    <>
      <div 
        className={`relative group inline-block shrink-0 ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`relative flex items-center justify-center rounded-2xl p-0.5 shadow-lg shadow-purple-950/50 overflow-hidden transition-all duration-300 group-hover:scale-105 ${
          customLogoUrl 
            ? 'bg-gradient-to-tr from-amber-400 via-purple-500 to-indigo-400 ring-1 ring-amber-400/40'
            : 'bg-gradient-to-tr from-purple-600 via-indigo-500 to-amber-400'
        } ${sizeClasses[size]}`}>
          
          {customLogoUrl ? (
            isVideo || customLogoUrl.startsWith('data:video') ? (
              <video
                src={customLogoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover rounded-[14px]"
              />
            ) : (
              /* User's Original Copyrighted Artwork Photo */
              <img
                src={customLogoUrl}
                alt="Cosmic Breadcrumbs Copyrighted Logo"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover rounded-[14px]"
              />
            )
          ) : (
            /* High-Detail Stylized Mystic Cosmic Face Art (Default Archetype) */
            <div className="relative h-full w-full rounded-[14px] bg-slate-950 overflow-hidden flex items-center justify-center">
              {/* Cosmic Space Nebula Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 opacity-90" />
              
              {/* Swirling Galaxy Vortex */}
              <div className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-cyan-500/20 blur-sm animate-pulse" />
              <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-pink-500/20 blur-sm animate-pulse" />
              
              {/* Mystic Face / Third Eye Illustration */}
              <svg viewBox="0 0 100 100" className="relative h-[90%] w-[90%] drop-shadow-md">
                <defs>
                  <radialGradient id="thirdEyeGlow" cx="50%" cy="30%" r="40%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="30%" stopColor="#38bdf8" />
                    <stop offset="70%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                  <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e1b4b" />
                    <stop offset="50%" stopColor="#312e81" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                </defs>

                {/* Orbiting Planets */}
                <circle cx="85" cy="20" r="7" fill="#f43f5e" opacity="0.9" />
                <circle cx="15" cy="75" r="5" fill="#38bdf8" opacity="0.9" />
                <circle cx="85" cy="80" r="4" fill="#fbbf24" opacity="0.9" />

                {/* Cosmic Hair & Head Contour */}
                <path d="M25,85 C20,50 25,25 50,15 C75,25 80,50 75,85 Z" fill="url(#skinGrad)" stroke="#818cf8" strokeWidth="1" />

                {/* Third Eye & Dial */}
                <circle cx="50" cy="32" r="14" fill="url(#thirdEyeGlow)" />
                <circle cx="50" cy="32" r="6" fill="#ffffff" />
                
                {/* Yin-Yang Crown Accent */}
                <circle cx="50" cy="14" r="5" fill="#e0e7ff" stroke="#4338ca" strokeWidth="0.8" />
                <circle cx="50" cy="12" r="1.5" fill="#0f172a" />
                <circle cx="50" cy="16" r="1.5" fill="#e0e7ff" />

                {/* Glowing Feline Golden Eyes */}
                <ellipse cx="40" cy="48" rx="5" ry="2.5" fill="#fbbf24" />
                <ellipse cx="60" cy="48" rx="5" ry="2.5" fill="#fbbf24" />
                <circle cx="40" cy="48" r="1" fill="#451a03" />
                <circle cx="60" cy="48" r="1" fill="#451a03" />

                {/* Mystic Lips */}
                <path d="M44,65 Q50,62 56,65 Q50,70 44,65 Z" fill="#ec4899" opacity="0.9" />
              </svg>

              {/* Sparkle overlay */}
              <Sparkles className="absolute top-1 right-1 h-3 w-3 text-amber-300 animate-pulse" />
            </div>
          )}
        </div>

        {/* Quick upload trigger button on hover (if enabled) */}
        {showUploadTrigger && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-md hover:scale-110 hover:bg-amber-300 transition-all ${
              isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-75'
            }`}
            title="Upload or Change Copyrighted App Logo"
          >
            <Camera className="h-3 w-3" />
          </button>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Upload / Custom Logo Confirmation Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-3xl border border-purple-800/60 bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
                <h3 className="font-serif text-base font-bold text-slate-100">
                  Custom App Logo Photo
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-purple-400 hover:bg-purple-950 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Preview Box */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative h-44 w-44 rounded-3xl border-2 border-amber-400/80 p-1 bg-gradient-to-tr from-purple-900 via-indigo-900 to-amber-900/40 shadow-xl overflow-hidden">
                <img
                  src={tempPreview || customLogoUrl || ''}
                  alt="Custom Logo Preview"
                  className="h-full w-full object-cover rounded-[20px]"
                />
                <div className="absolute top-2 right-2 rounded-full bg-slate-950/80 px-2 py-0.5 text-[9px] font-semibold text-amber-300 border border-amber-500/40">
                  © Copyrighted
                </div>
              </div>

              <p className="text-xs text-purple-200/80 text-center max-w-xs leading-relaxed">
                Set your copyrighted cosmic artwork as the official main logo for <span className="text-amber-300 font-semibold">Cosmic Breadcrumbs</span> across the entire app.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleSaveCustomLogo}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 font-serif text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all"
              >
                <Check className="h-4 w-4" />
                <span>Save as Main App Logo</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center space-x-1.5 rounded-xl border border-purple-800/60 bg-slate-950/60 py-2.5 text-xs text-purple-200 hover:border-amber-400 hover:text-amber-300 transition-colors"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Choose Different Photo</span>
                </button>

                {customLogoUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveCustomLogo}
                    className="flex items-center justify-center space-x-1 rounded-xl border border-rose-900/40 bg-rose-950/20 px-3 py-2.5 text-xs text-rose-300 hover:bg-rose-900/40 transition-colors"
                    title="Reset to default logo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
