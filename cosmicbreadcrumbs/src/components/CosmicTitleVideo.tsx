import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Video as VideoIcon, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCcw, 
  Trash2,
  X,
  Sparkles,
  Film
} from 'lucide-react';
import { saveMainVideo, getMainVideoUrl, clearMainVideo } from '../utils/videoStorage';

interface CosmicTitleVideoProps {
  variant?: 'hero' | 'header' | 'compact';
  className?: string;
}

export const CosmicTitleVideo: React.FC<CosmicTitleVideoProps> = ({
  variant = 'hero',
  className = '',
}) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showFullscreen, setShowFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load video from IndexedDB / Storage on mount
  useEffect(() => {
    let isMounted = true;
    const loadVideo = async () => {
      try {
        const url = await getMainVideoUrl();
        if (isMounted) {
          setVideoUrl(url);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) setIsLoading(false);
      }
    };

    loadVideo();

    const handleUpdate = () => {
      loadVideo();
    };

    window.addEventListener('cosmic-video-title-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('cosmic-video-title-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('video/') && !file.type.startsWith('image/')) {
      alert('Please select a valid video file (.mp4, .webm, .mov)');
      return;
    }

    try {
      setIsLoading(true);
      const url = await saveMainVideo(file);
      setVideoUrl(url);
      setIsLoading(false);
    } catch (err) {
      console.error('Error saving video:', err);
      // Fallback object URL
      const fallbackUrl = URL.createObjectURL(file);
      setVideoUrl(fallbackUrl);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClearVideo = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await clearMainVideo();
    setVideoUrl(null);
  };

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleSound = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Header compact video icon
  if (variant === 'header') {
    return (
      <div 
        className={`relative flex items-center space-x-2 cursor-pointer ${className}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="relative h-9 w-14 rounded-xl overflow-hidden border border-purple-500/50 bg-slate-950 shadow-md">
          {videoUrl ? (
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-purple-950/60 text-purple-300 text-[10px] font-bold">
              <Film className="h-4 w-4 text-amber-400" />
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,image/*"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,image/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Main Video Frame */}
      <div className="group relative overflow-hidden rounded-3xl border border-purple-900/50 bg-[#0b0d18] shadow-2xl transition-all duration-300 hover:border-fuchsia-500/60">
        
        {videoUrl ? (
          /* EXACT RAW VIDEO PLAYBACK - NO SYNTHETIC OVERLAYS */
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="h-full w-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Video Controls Bar on Hover */}
            <div className="absolute bottom-3 right-3 z-30 flex items-center space-x-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-slate-950/85 p-1.5 rounded-2xl border border-purple-900/60 backdrop-blur-md">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-950/80 text-purple-200 hover:bg-purple-900 hover:text-white transition-all"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </button>

              {/* Mute/Unmute */}
              <button
                onClick={toggleSound}
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                  !isMuted 
                    ? 'bg-purple-800 text-white shadow-md shadow-purple-900/40 font-bold border border-purple-500' 
                    : 'bg-purple-950/80 text-purple-200 hover:bg-purple-900 hover:text-white'
                }`}
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {!isMuted ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              </button>

              {/* Fullscreen */}
              <button
                onClick={() => setShowFullscreen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-950/80 text-purple-200 hover:bg-purple-900 hover:text-white transition-all"
                title="Fullscreen Video"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>

              {/* Change Video */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-950/80 text-purple-200 hover:bg-purple-800 hover:text-white transition-all"
                title="Change Video File"
              >
                <Upload className="h-3.5 w-3.5" />
              </button>

              {/* Remove Video */}
              <button
                onClick={handleClearVideo}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-950/60 text-rose-300 hover:bg-rose-900 transition-all"
                title="Remove Video"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* SLEEK COSMIC BREADCRUMBS HERO */
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative min-h-[190px] sm:min-h-[220px] w-full flex flex-col items-center justify-center p-6 sm:p-8 text-center cursor-pointer transition-all ${
              isDragging 
                ? 'bg-purple-950/60 border-2 border-dashed border-purple-400' 
                : 'bg-[#0b0c16] hover:bg-[#0e0f1e]'
            }`}
          >
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-950/40 via-indigo-950/20 to-transparent blur-2xl" />

            <div className="relative z-10 flex flex-col items-center space-y-2 max-w-xl mx-auto">
              {/* COSMIC BREADCRUMBS IN FLAVORS FONT */}
              <div className="space-y-1">
                <h1 className="font-flavors text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200 tracking-wider py-1 drop-shadow-md select-none">
                  Cosmic Breadcrumbs
                </h1>
              </div>

              {/* SUBTITLE */}
              <p className="text-xs sm:text-sm font-revalia tracking-wider text-amber-200/95 uppercase max-w-md mx-auto pt-1 leading-relaxed">
                Your Personalized Cosmic Alignment & Daily Reading
              </p>

              {/* GLOWING HORIZON DIVIDER LINE */}
              <div className="pt-2 w-full flex justify-center">
                <div className="h-[2px] w-40 bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
              </div>
            </div>
          </div>
        )}

        {/* Video Status Bar */}
        <div className="flex items-center justify-between border-t border-purple-900/40 bg-[#080912] px-4 py-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="font-mono text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              {videoUrl ? 'CUSTOM VIDEO ACTIVE' : 'COSMIC FREQUENCY ACTIVE'}
            </span>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1 font-mono text-[10px] text-purple-400 hover:text-purple-200 transition-colors"
          >
            <Upload className="h-3 w-3" />
            <span>{videoUrl ? 'Replace Video' : 'Upload Video'}</span>
          </button>
        </div>

      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {showFullscreen && videoUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl animate-in fade-in"
          onClick={() => setShowFullscreen(false)}
        >
          <div 
            className="relative w-full max-w-5xl rounded-3xl overflow-hidden border-2 border-purple-500/60 bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full">
              <video
                ref={fullscreenVideoRef}
                src={videoUrl}
                autoPlay
                loop
                controls
                playsInline
                className="h-full w-full object-contain bg-black"
              />
            </div>

            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/80 text-white border border-purple-500/50 hover:bg-purple-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
