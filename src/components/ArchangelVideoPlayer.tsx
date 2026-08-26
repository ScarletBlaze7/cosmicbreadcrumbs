import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles } from 'lucide-react';

interface ArchangelVideoPlayerProps {
  archangel?: string;
  name?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  showControls?: boolean;
  fallbackArtwork?: React.ReactNode;
}

const ARCHANGEL_VIDEO_MAP: Record<string, string[]> = {
  michael: ['/assets/angels/videos/michael.mp4', '/assets/videos/michael.mp4', '/assets/angels/videos/michaelvid.mp4'],
  gabriel: ['/assets/angels/videos/gabriel.mp4', '/assets/videos/gabriel.mp4', '/assets/angels/videos/gabrielvid.mp4'],
  raphael: [
    '/assets/angels/videos/raphaelvid2.mp4',
    '/assets/videos/raphaelvid2.mp4',
    '/assets/angels/videos/raphaelvid1.mp4',
    '/assets/videos/raphaelvid1.mp4',
    '/assets/angels/videos/raphaelvid.mp4',
    '/assets/videos/raphaelvid.mp4',
    '/assets/angels/videos/raphael.mp4',
    '/assets/videos/raphael.mp4',
  ],
  uriel: ['/assets/angels/videos/uriel.mp4', '/assets/videos/uriel.mp4', '/assets/angels/videos/urielvid.mp4'],
  chamuel: ['/assets/angels/videos/chamuel.mp4', '/assets/videos/chamuel.mp4', '/assets/angels/videos/chamuelvid.mp4'],
  jophiel: ['/assets/angels/videos/jophiel.mp4', '/assets/videos/jophiel.mp4', '/assets/angels/videos/jophielvid.mp4'],
  zadkiel: ['/assets/angels/videos/zadkiel.mp4', '/assets/videos/zadkiel.mp4', '/assets/angels/videos/zadkielvid.mp4'],
  metatron: ['/assets/angels/videos/metatron.mp4', '/assets/videos/metatron.mp4', '/assets/angels/videos/metatronvid.mp4'],
  sandalphon: ['/assets/angels/videos/sandalphon.mp4', '/assets/videos/sandalphon.mp4', '/assets/angels/videos/sandalphonvid.mp4'],
  raziel: ['/assets/angels/videos/raziel.mp4', '/assets/videos/raziel.mp4', '/assets/angels/videos/razielvid.mp4'],
  ariel: ['/assets/angels/videos/ariel.mp4', '/assets/videos/ariel.mp4', '/assets/angels/videos/arielvid.mp4'],
  haniel: ['/assets/angels/videos/haniel.mp4', '/assets/videos/haniel.mp4', '/assets/angels/videos/hanielvid.mp4'],
  jeremiel: ['/assets/angels/videos/jeremiel.mp4', '/assets/videos/jeremiel.mp4', '/assets/angels/videos/jeremielvid.mp4'],
  raguel: ['/assets/angels/videos/raguel.mp4', '/assets/videos/raguel.mp4', '/assets/angels/videos/raguelvid.mp4'],
  azrael: ['/assets/angels/videos/azrael.mp4', '/assets/videos/azrael.mp4', '/assets/angels/videos/azraelvid.mp4'],
  azriel: ['/assets/angels/videos/azrael.mp4', '/assets/videos/azrael.mp4', '/assets/angels/videos/azraelvid.mp4'],
  orion: ['/assets/angels/videos/orion.mp4', '/assets/videos/orion.mp4', '/assets/angels/videos/orionvid.mp4'],
  nathaniel: ['/assets/angels/videos/nathaniel.mp4', '/assets/videos/nathaniel.mp4', '/assets/angels/videos/nathanielvid.mp4'],
  muriel: ['/assets/angels/videos/muriel.mp4', '/assets/videos/muriel.mp4', '/assets/angels/videos/murielvid.mp4'],
};

export const ArchangelVideoPlayer: React.FC<ArchangelVideoPlayerProps> = ({
  archangel = '',
  name = '',
  className = 'w-full h-full',
  autoPlay = true,
  loop = true,
  showControls = true,
  fallbackArtwork,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);

  const targetName = archangel || name;
  const normalizedKey = targetName.toLowerCase().replace(/[^a-z]/g, '').replace('archangel', '');
  const candidateVideos = ARCHANGEL_VIDEO_MAP[normalizedKey] || [
    `/assets/angels/videos/${normalizedKey}.mp4`,
    `/assets/videos/${normalizedKey}.mp4`,
  ];

  const currentSrc = candidateVideos[videoIndex] || candidateVideos[0];

  const handleVideoError = () => {
    if (videoIndex < candidateVideos.length - 1) {
      setVideoIndex((prev) => prev + 1);
    } else {
      setVideoError(true);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullScreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  if (videoError && fallbackArtwork) {
    return <>{fallbackArtwork}</>;
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-black border border-amber-500/30 shadow-2xl group ${className}`}>
      <video
        ref={videoRef}
        src={currentSrc}
        autoPlay={autoPlay}
        loop={loop}
        muted={isMuted}
        playsInline
        onError={handleVideoError}
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Radiant Glowing Border Overlay */}
      <div className="absolute inset-0 pointer-events-none border border-amber-400/20 rounded-2xl shadow-[inset_0_0_20px_rgba(251,191,36,0.15)]" />

      {/* Floating Sacred Badge */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-400/40 text-[10px] text-amber-300 font-medium z-10 shadow-lg">
        <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
        <span>Celestial Vision</span>
      </div>

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-purple-500/30 z-10 opacity-90 transition-opacity">
          <button
            type="button"
            onClick={togglePlay}
            className="p-1.5 rounded-lg text-amber-300 hover:bg-white/10 hover:text-amber-200 transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 rounded-lg text-purple-300 hover:bg-white/10 hover:text-purple-200 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={toggleFullScreen}
            className="p-1.5 rounded-lg text-cyan-300 hover:bg-white/10 hover:text-cyan-200 transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
