import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Crown, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { triggerFireworks } from '../utils/fireworks';
import { SanctuaryEmblem } from './SanctuaryEmblem';

interface SanctuaryWelcomeVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export const SanctuaryWelcomeVideoModal: React.FC<SanctuaryWelcomeVideoModalProps> = ({
  isOpen,
  onClose,
  title = "Welcome to the Sanctuary Club!",
  subtitle = "Your sacred journey has officially begun. Immerse yourself in the celestial frequencies.",
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      triggerFireworks();
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
            // Autoplay with sound might be blocked initially; fallback to muted autoplay if needed
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().catch(console.error);
            }
          });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-4 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="relative my-auto w-full max-w-2xl rounded-3xl border border-amber-400/50 bg-slate-950 shadow-2xl shadow-purple-950/90 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3.5 top-3.5 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 border border-purple-800/60 text-purple-200 hover:text-white hover:bg-black transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Video Container */}
        <div className="relative w-full aspect-video bg-black overflow-hidden group">
          <video
            ref={videoRef}
            src="/assets/sanctuarywelcome.mp4"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src.includes('sanctuarywelcome.mp4')) {
                target.src = './assets/sanctuarywelcome.mp4';
              } else if (target.src.includes('./assets/sanctuarywelcome.mp4')) {
                target.src = '/assets/SanctuaryWelcome.mp4';
              }
            }}
            playsInline
            autoPlay
            controls={false}
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
          />

          {/* Quick Overlay Controls */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="flex items-center space-x-2 pointer-events-auto">
              <button
                onClick={togglePlay}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 border border-purple-500/40 text-amber-300 hover:bg-black/90 transition-all shadow-md"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </button>

              <button
                onClick={toggleMute}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 border border-purple-500/40 text-purple-200 hover:text-white hover:bg-black/90 transition-all shadow-md"
              >
                {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
              </button>
            </div>

            <div className="pointer-events-auto">
              <span className="rounded-full bg-black/70 border border-amber-500/40 px-2.5 py-1 text-[10px] font-bold text-amber-300 uppercase tracking-widest flex items-center space-x-1">
                <Crown className="h-3 w-3" />
                <span>Sanctuary Initiation</span>
              </span>
            </div>
          </div>
        </div>

        {/* Celebration Bottom Card */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-black space-y-4 text-center">
          <div className="flex items-center justify-center space-x-3">
            <SanctuaryEmblem size="sm" isUnlocked={true} />
            <div className="text-left">
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Sacred Access Confirmed</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-rose-200">
                {title}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-purple-200/90 max-w-lg mx-auto leading-relaxed">
            {subtitle}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 px-8 py-3 font-serif text-sm font-bold text-slate-950 shadow-xl shadow-amber-500/20 hover:from-amber-400 hover:to-yellow-400 transition-all cursor-pointer"
            >
              <span>Enter Sanctuary & Explore</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="text-[11px] text-purple-400/70 flex items-center justify-center space-x-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>All 7 Dimensions, Oracle Consultations & Planetary Syntheses Unlocked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SanctuaryWelcomeVideoModal;
