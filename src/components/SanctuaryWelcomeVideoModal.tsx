import React, { useRef, useEffect, useState } from 'react';
import { X, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface SanctuaryWelcomeVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SanctuaryWelcomeVideoModal: React.FC<SanctuaryWelcomeVideoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#12101f] border border-purple-500/40 rounded-3xl p-5 shadow-2xl shadow-purple-950/70 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-purple-950/80 text-purple-300 hover:text-white border border-purple-500/30 transition-all hover:scale-105"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="text-amber-400 animate-pulse" size={20} />
          <h3 className="text-base font-bold text-white font-serif tracking-wide">
            Welcome to the Cosmic Sanctuary
          </h3>
        </div>

        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-purple-500/20 shadow-inner">
          <video
            ref={videoRef}
            src="/assets/sanctuarywelcome.mp4"
            className="w-full h-full object-contain"
            controls
            playsInline
            muted={isMuted}
            onEnded={onClose}
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.muted = !videoRef.current.muted;
                setIsMuted(videoRef.current.muted);
              }
            }}
            className="flex items-center gap-1.5 text-xs text-purple-300 hover:text-white px-3 py-1.5 rounded-xl bg-purple-950/50 border border-purple-500/20"
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold tracking-wider uppercase shadow-lg shadow-purple-900/50 transition-all"
          >
            Enter Sanctuary ✧
          </button>
        </div>
      </div>
    </div>
  );
};
