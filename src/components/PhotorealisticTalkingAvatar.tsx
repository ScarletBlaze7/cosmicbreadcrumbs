import React, { useEffect, useRef, useState } from 'react';
import { AstrologerProfile } from '../data/astrologerRoster';

interface PhotorealisticTalkingAvatarProps {
  photoUrl: string;
  activeHost: AstrologerProfile;
  isPlaying: boolean;
  isPaused: boolean;
  currentSpokenWord: string;
  className?: string;
}

export const PhotorealisticTalkingAvatar: React.FC<PhotorealisticTalkingAvatarProps> = ({
  photoUrl,
  activeHost,
  isPlaying,
  isPaused,
  currentSpokenWord,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const filterIdRef = useRef<string>(`warp-${activeHost.id}-${Math.random().toString(36).substr(2, 6)}`);

  // Animation values (smooth interpolation)
  const [pitch, setPitch] = useState(0); // Head nod (degrees)
  const [yaw, setYaw] = useState(0); // Head turn (degrees)
  const [roll, setRoll] = useState(0); // Head tilt (degrees)
  const [breath, setBreath] = useState(0); // Torso breath (px)
  const [scaleWarp, setScaleWarp] = useState(0); // Facial speech displacement
  const [lightIntensity, setLightIntensity] = useState(1);

  const animFrameRef = useRef<number | null>(null);
  const targetPitchRef = useRef(0);
  const targetYawRef = useRef(0);
  const targetRollRef = useRef(0);
  const targetScaleWarpRef = useRef(0);

  // 1. Syllabic Cadence from Active Spoken Word
  useEffect(() => {
    if (!isPlaying || isPaused || !currentSpokenWord) {
      targetScaleWarpRef.current = 0;
      return;
    }

    const word = currentSpokenWord.toLowerCase().trim();
    // Strong emphasis on open vowels and consonants
    if (word.includes('o') || word.includes('a') || word.includes('e') || word.includes('u')) {
      targetScaleWarpRef.current = 3.5 + Math.random() * 2.5;
    } else {
      targetScaleWarpRef.current = 1.5 + Math.random() * 1.5;
    }

    // Conversational micro-nod on emphasized words
    if (word.length > 5 || word.endsWith('.') || word.endsWith(',')) {
      targetPitchRef.current = 1.8 + (Math.random() - 0.5) * 1.2;
      targetYawRef.current = (Math.random() - 0.5) * 2.5;
      targetRollRef.current = (Math.random() - 0.5) * 1.2;
    }
  }, [currentSpokenWord, isPlaying, isPaused]);

  // 2. High-Precision 60fps Smooth Organic Motion Loop
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // A. Natural Breathing Rhythm
      const breathCycle = Math.sin(now * 0.002);
      setBreath(breathCycle * 2.2);

      // B. Speech Animation Physics
      if (isPlaying && !isPaused) {
        // High frequency syllabic undulation
        const speechOscillation = Math.sin(now * 0.018) * 0.4 + 0.6;
        const currentTargetWarp = targetScaleWarpRef.current * speechOscillation;

        // Smooth conversational head float
        const subtleNod = Math.sin(now * 0.0035) * 1.4 + targetPitchRef.current;
        const subtleTurn = Math.cos(now * 0.0028) * 1.8 + targetYawRef.current;
        const subtleTilt = Math.sin(now * 0.0022) * 0.8 + targetRollRef.current;

        setPitch((prev) => prev + (subtleNod - prev) * Math.min(1, delta * 7));
        setYaw((prev) => prev + (subtleTurn - prev) * Math.min(1, delta * 7));
        setRoll((prev) => prev + (subtleTilt - prev) * Math.min(1, delta * 7));
        setScaleWarp((prev) => prev + (currentTargetWarp - prev) * Math.min(1, delta * 18));
        setLightIntensity(1 + Math.sin(now * 0.005) * 0.06);

        // Decay impulse targets
        targetPitchRef.current *= 0.94;
        targetYawRef.current *= 0.94;
        targetRollRef.current *= 0.94;
      } else {
        // Natural resting idle posture at desk
        const idleTurn = Math.cos(now * 0.0015) * 0.8;
        const idleTilt = Math.sin(now * 0.0012) * 0.5;

        setPitch((prev) => prev + (0 - prev) * Math.min(1, delta * 4));
        setYaw((prev) => prev + (idleTurn - prev) * Math.min(1, delta * 4));
        setRoll((prev) => prev + (idleTilt - prev) * Math.min(1, delta * 4));
        setScaleWarp((prev) => prev + (0 - prev) * Math.min(1, delta * 12));
        setLightIntensity(1);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, isPaused]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-slate-950 select-none ${className}`}
      style={{
        perspective: '1200px',
      }}
    >
      {/* SVG Dynamic Organic Displacement Filter for Real-Time Facial Muscle Flexing */}
      <svg className="absolute h-0 w-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id={filterIdRef.current} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04 0.02"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={isPlaying && !isPaused ? scaleWarp : 0}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
          </filter>
        </defs>
      </svg>

      {/* 3D Transform Wrapper: Drives Organic Head Sway, Pitch, Yaw & Breathing */}
      <div
        className="w-full h-full relative will-change-transform transition-all"
        style={{
          transform: `
            translateY(${-breath}px)
            rotateX(${pitch}deg)
            rotateY(${yaw}deg)
            rotateZ(${roll}deg)
            scale(${1 + (isPlaying && !isPaused ? 0.015 : 0)})
          `,
          transformOrigin: '50% 65%',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* The Original Studio Photograph with Real-Time Organic Facial Muscle Flexing */}
        <img
          src={photoUrl}
          alt={activeHost.name}
          className="w-full h-full object-cover object-top filter transition-all duration-300"
          style={{
            filter: isPlaying && !isPaused ? `url(#${filterIdRef.current}) brightness(${lightIntensity}) contrast(1.03)` : 'none',
          }}
        />

        {/* Dynamic Studio Rim Lighting & Specular Reflection */}
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-soft-light transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at ${50 + yaw * 5}% ${35 + pitch * 3}%, rgba(255,255,255,0.22) 0%, rgba(0,0,0,0) 65%)`,
            opacity: isPlaying && !isPaused ? 0.85 : 0.4,
          }}
        />

        {/* Species-Specific Starlight Bioluminescence Aura */}
        {isPlaying && !isPaused && (
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-screen opacity-25 transition-opacity duration-700"
            style={{
              background: activeHost.species === 'Lyran'
                ? 'radial-gradient(circle at 50% 30%, rgba(245,158,11,0.5) 0%, rgba(0,0,0,0) 70%)'
                : activeHost.species === 'Lemurian'
                ? 'radial-gradient(circle at 50% 30%, rgba(45,212,191,0.5) 0%, rgba(0,0,0,0) 70%)'
                : 'radial-gradient(circle at 50% 30%, rgba(168,85,247,0.5) 0%, rgba(0,0,0,0) 70%)',
            }}
          />
        )}
      </div>

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-purple-950/10 pointer-events-none" />
    </div>
  );
};
