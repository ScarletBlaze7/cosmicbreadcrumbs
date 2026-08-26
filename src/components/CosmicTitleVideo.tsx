import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface CosmicTitleVideoProps {
  variant?: 'hero' | 'header' | 'compact';
  className?: string;
}

export const CosmicTitleVideo: React.FC<CosmicTitleVideoProps> = ({
  variant = 'hero',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [showFullscreen, setShowFullscreen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, []);

  const handleContainerClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFullscreen(true);
  };

  return (
    <div 
      onClick={handleContainerClick}
      className={`relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl bg-black/60 cursor-pointer ${className}`}
    >
      <div className="relative aspect-video w-full flex items-center justify-center bg-black">
        
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src="/assets/SolarKniw.mp4" type="video/mp4" />
          <source src="/SolarKniw.mp4" type="video/mp4" />
          <source src="/assets/gemini_generated_video_71a1SolarKnowlwdge.mp4" type="video/mp4" />
          <source src="/gemini_generated_video_71a1SolarKnowlwdge.mp4" type="video/mp4" />
          <source src="./assets/SolarKniw.mp4" type="video/mp4" />
          <source src="./assets/gemini_generated_video_71a1SolarKnowlwdge.mp4" type="video/mp4" />
        </video>
        
        {/* Play/Pause Overlay Indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
            <div className="p-4 rounded-full bg-purple-600/80 text-white shadow-lg animate-pulse">
              <Play size={28} />
            </div>
          </div>
        )}

        {/* Bottom Bar Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleContainerClick();
            }}
            className="p-2 rounded-full bg-purple-900/70 hover:bg-purple-700 text-white backdrop-blur-sm"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={toggleMute}
              className="p-2 rounded-full bg-purple-900/70 hover:bg-purple-700 text-white backdrop-blur-sm"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button
              type="button"
              onClick={handleFullscreen}
              className="p-2 rounded-full bg-purple-900/70 hover:bg-purple-700 text-white backdrop-blur-sm"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setShowFullscreen(false)}
        >
          <div className="relative w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <video
              ref={fullscreenVideoRef}
              autoPlay
              loop
              controls
              playsInline
              className="w-full h-full object-contain rounded-2xl"
            >
              <source src="./assets/gemini_generated_video_71a1SolarKnowlwdge.mp4" type="video/mp4" />
              <source src="/assets/gemini_generated_video_71a1SolarKnowlwdge.mp4" type="video/mp4" />
              <source src="./assets/gemini_generated_video_71alSolarKnowlwdge.mp4" type="video/mp4" />
              <source src="/assets/gemini_generated_video_71alSolarKnowlwdge.mp4" type="video/mp4" />
              <source src="./assets/SolarKniw.mp4" type="video/mp4" />
              <source src="/assets/SolarKniw.mp4" type="video/mp4" />
              <source src="/master-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default CosmicTitleVideo;
