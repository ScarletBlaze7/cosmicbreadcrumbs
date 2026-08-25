import React, { useState, useRef, useEffect } from 'react';
import { Feather, Sparkles, Play, Pause, Volume2, VolumeX, Video, Image as ImageIcon } from 'lucide-react';
import { APP_ASSETS } from '../data/appAssets';

interface ArchangelDynamicArtworkProps {
  archangelKey?: string;
  archangel?: string;
  name?: string;
  variant?: string;
  className?: string;
  enableVideo?: boolean;
}

const ARCHANGEL_ASSET_MAP: Record<string, string> = {
  michael: '/assets/angels/michael.png',
  gabriel: '/assets/angels/gabriel.jpg',
  raphael: '/assets/angels/raphael.jpg',
  uriel: '/assets/angels/uriel.png',
  chamuel: '/assets/angels/chamuel.png',
  metatron: '/assets/angels/metatron.png',
  jophiel: '/assets/angels/jophiel.png',
  zadkiel: '/assets/angels/zadkiel.jpg',
  sandalphon: '/assets/angels/sandalphon.png',
  raziel: '/assets/angels/raziel.png',
  ariel: '/assets/angels/ariel.png',
  haniel: '/assets/angels/haniel.png',
  jeremiel: '/assets/angels/jeremiel.png',
  raguel: '/assets/angels/raguel.png',
  azrael: '/assets/angels/azrael.jpg',
  azriel: '/assets/angels/azrael.jpg',
  orion: '/assets/angels/orion.png',
  nathaniel: '/assets/angels/nathaniel.png',
  muriel: '/assets/angels/muriel.jpg',
};

const ARCHANGEL_VIDEO_MAP: Record<string, string> = {
  michael: '/assets/angels/videos/michael.mp4',
  gabriel: '/assets/angels/videos/gabriel.mp4',
  raphael: '/assets/angels/videos/raphael.mp4',
  uriel: '/assets/angels/videos/uriel.mp4',
  chamuel: '/assets/angels/videos/chamuel.mp4',
  metatron: '/assets/angels/videos/metatron.mp4',
  jophiel: '/assets/angels/videos/jophiel.mp4',
  zadkiel: '/assets/angels/videos/zadkiel.mp4',
  sandalphon: '/assets/angels/videos/sandalphon.mp4',
  raziel: '/assets/angels/videos/raziel.mp4',
  ariel: '/assets/angels/videos/ariel.mp4',
  haniel: '/assets/angels/videos/haniel.mp4',
  jeremiel: '/assets/angels/videos/jeremiel.mp4',
  raguel: '/assets/angels/videos/raguel.mp4',
  azrael: '/assets/angels/videos/azrael.mp4',
  azriel: '/assets/angels/videos/azrael.mp4',
  orion: '/assets/angels/videos/orion.mp4',
  nathaniel: '/assets/angels/videos/nathaniel.mp4',
  muriel: '/assets/angels/videos/muriel.mp4',
};

export const ArchangelDynamicArtwork: React.FC<ArchangelDynamicArtworkProps> = ({
  archangelKey = '',
  archangel = '',
  name = '',
  variant = 'card-banner',
  className = 'w-full h-full',
  enableVideo = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [viewMode, setViewMode] = useState<'video' | 'image'>('video');
  const videoRef = useRef<HTMLVideoElement>(null);

  const targetName = archangel || archangelKey || name;
  const normalizedKey = targetName.toLowerCase().replace(/[^a-z]/g, '').replace('archangel', '');
  
  const primarySrc = ARCHANGEL_ASSET_MAP[normalizedKey] || `/assets/angels/${normalizedKey}.png`;
  const primaryVideoSrc = ARCHANGEL_VIDEO_MAP[normalizedKey] || `/assets/angels/videos/${normalizedKey}.mp4`;

  const [triedFallback, setTriedFallback] = useState(false);

  useEffect(() => {
    setVideoError(false);
    setImageError(false);
    setTriedFallback(false);
    setIsPlaying(true);
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.play().catch(() => setIsPlaying(false));
    }
  }, [normalizedKey]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!triedFallback) {
      setTriedFallback(true);
      const target = e.currentTarget;
      target.src = `/assets/angels/${normalizedKey}.png`;
    } else {
      setImageError(true);
    }
  };

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const shouldRenderVideo = enableVideo && !videoError && viewMode === 'video';

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-purple-950/60 to-slate-950 border border-purple-800/40 group ${className}`}>
      {shouldRenderVideo ? (
        <div className="relative w-full aspect-video sm:aspect-[16/9] flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            onError={() => setVideoError(true)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-cover select-none"
          >
            <source src={primaryVideoSrc} type="video/mp4" />
            <source src={`/assets/videos/${normalizedKey}.mp4`} type="video/mp4" />
            <source src={`/assets/angels/videos/${normalizedKey}vid.mp4`} type="video/mp4" />
            <source src={`/assets/${normalizedKey}.mp4`} type="video/mp4" />
          </video>

          {/* Bottom Bar Controls for Angel Video */}
          <div className="absolute bottom-2 right-2 flex items-center space-x-1.5 z-20 bg-slate-950/70 backdrop-blur-md rounded-xl p-1 border border-purple-800/40">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-purple-900/60 transition-colors"
              title={isPlaying ? 'Pause Celestial Video' : 'Play Celestial Video'}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={handleToggleMute}
              className="p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-purple-900/60 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('image')}
              className="p-1.5 rounded-lg text-amber-300 hover:bg-purple-900/60 transition-colors text-[10px] font-mono flex items-center space-x-1"
              title="Switch to Static Artwork"
            >
              <ImageIcon className="h-3 w-3" />
              <span>Art</span>
            </button>
          </div>
        </div>
      ) : !imageError ? (
        <div className="relative w-full h-full">
          <img
            src={primarySrc}
            onError={handleImageError}
            alt={targetName || 'Archangel Oracle Artwork'}
            className="w-full h-full object-cover select-none pointer-events-none transition-opacity duration-300 min-h-[220px]"
          />
          {!videoError && enableVideo && (
            <button
              type="button"
              onClick={() => setViewMode('video')}
              className="absolute bottom-2 right-2 z-20 bg-slate-950/80 backdrop-blur-md rounded-xl px-2.5 py-1 text-xs font-semibold text-amber-300 border border-purple-700/60 hover:bg-purple-900/70 transition-all flex items-center space-x-1.5 cursor-pointer shadow-lg"
            >
              <Video className="h-3.5 w-3.5 text-amber-400" />
              <span>Watch Video</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex h-48 w-full flex-col items-center justify-center p-6 text-center space-y-2 bg-gradient-to-b from-purple-950 via-slate-900 to-slate-950">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/40 shadow-lg">
            <Feather className="h-6 w-6 animate-pulse" />
          </div>
          <span className="font-serif text-sm font-bold text-amber-200">{targetName}</span>
          <span className="text-[10px] text-purple-300 uppercase tracking-widest">Sacred Celestial Presence</span>
          <Sparkles className="h-4 w-4 text-amber-300" />
        </div>
      )}
    </div>
  );
};

export default ArchangelDynamicArtwork;
