import React, { useEffect, useRef, useState } from 'react';
import { AstrologerProfile } from '../data/astrologerRoster';

interface ProfessionalAITalkingAvatarProps {
  photoUrl: string;
  activeHost: AstrologerProfile;
  isPlaying: boolean;
  isPaused: boolean;
  currentSpokenWord: string;
  className?: string;
}

export const ProfessionalAITalkingAvatar: React.FC<ProfessionalAITalkingAvatarProps> = ({
  photoUrl,
  activeHost,
  isPlaying,
  isPaused,
  currentSpokenWord,
  className = '',
}) => {
  const [pitch, setPitch] = useState(0);
  const [yaw, setYaw] = useState(0);
  const [roll, setRoll] = useState(0);
  const [breath, setBreath] = useState(0);
  const [scale, setScale] = useState(1);

  const animFrameRef = useRef<number | null>(null);
  const targetPitchRef = useRef(0);
  const targetYawRef = useRef(0);

  // Conversational micro-nod on emphasized words
  useEffect(() => {
    if (!isPlaying || isPaused || !currentSpokenWord) {
      return;
    }
    const word = currentSpokenWord.toLowerCase().trim();
    if (word.length > 5 || word.endsWith('.') || word.endsWith(',')) {
      targetPitchRef.current = 1.2 + (Math.random() - 0.5) * 0.8;
      targetYawRef.current = (Math.random() - 0.5) * 1.5;
    }
  }, [currentSpokenWord, isPlaying, isPaused]);

  // Smooth 60fps Organic Breathing & Conversational Tilt Loop
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Natural resting breath
      const breathCycle = Math.sin(now * 0.002);
      setBreath(breathCycle * 1.8);

      if (isPlaying && !isPaused) {
        // Conversational head sway
        const speechNod = Math.sin(now * 0.0035) * 1.0 + targetPitchRef.current;
        const speechTurn = Math.cos(now * 0.0028) * 1.2 + targetYawRef.current;
        const speechTilt = Math.sin(now * 0.002) * 0.6;

        setPitch((prev) => prev + (speechNod - prev) * Math.min(1, delta * 6));
        setYaw((prev) => prev + (speechTurn - prev) * Math.min(1, delta * 6));
        setRoll((prev) => prev + (speechTilt - prev) * Math.min(1, delta * 6));
        setScale(1.02);

        targetPitchRef.current *= 0.94;
        targetYawRef.current *= 0.94;
      } else {
        setPitch((prev) => prev + (0 - prev) * Math.min(1, delta * 4));
        setYaw((prev) => prev + (0 - prev) * Math.min(1, delta * 4));
        setRoll((prev) => prev + (0 - prev) * Math.min(1, delta * 4));
        setScale(1.0);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, isPaused]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-slate-950 select-none ${className}`} style={{ perspective: '1000px' }}>
      {/* Pristine, High-Resolution Studio Portrait with 3D Conversational Perspective */}
      <div
        className="w-full h-full relative will-change-transform transition-all duration-300"
        style={{
          transform: `
            translateY(${-breath}px)
            rotateX(${pitch}deg)
            rotateY(${yaw}deg)
            rotateZ(${roll}deg)
            scale(${scale})
          `,
          transformOrigin: '50% 65%',
          transformStyle: 'preserve-3d',
        }}
      >
        <img
          src={photoUrl}
          alt={activeHost.name}
          className="w-full h-full object-cover object-top filter brightness-105 contrast-102 select-none"
        />

        {/* Soft Studio Rim Lighting Reflection */}
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-soft-light transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at ${50 + yaw * 6}% ${35 + pitch * 4}%, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0) 65%)`,
            opacity: isPlaying && !isPaused ? 0.75 : 0.35,
          }}
        />

        {/* Species-Specific Starlight Bioluminescence Aura */}
        {isPlaying && !isPaused && (
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-screen opacity-20 transition-opacity duration-700"
            style={{
              background: activeHost.species === 'Lyran'
                ? 'radial-gradient(circle at 50% 30%, rgba(245,158,11,0.45) 0%, rgba(0,0,0,0) 70%)'
                : activeHost.species === 'Lemurian'
                ? 'radial-gradient(circle at 50% 30%, rgba(45,212,191,0.45) 0%, rgba(0,0,0,0) 70%)'
                : 'radial-gradient(circle at 50% 30%, rgba(168,85,247,0.45) 0%, rgba(0,0,0,0) 70%)',
            }}
          />
        )}
      </div>

      {/* Cinematic Studio Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-purple-950/10 pointer-events-none" />
    </div>
  );
};
