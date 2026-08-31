import React, { useEffect, useRef, useState } from 'react';
import { AstrologerProfile } from '../data/astrologerRoster';

interface PortraitLipSyncOverlayProps {
  activeHost: AstrologerProfile;
  isPlaying: boolean;
  isPaused: boolean;
  currentSpokenWord: string;
  className?: string;
}

// Calibrated facial mouth coordinates for each of the 6 newscasters (% of portrait width & height)
interface AnchorMouthCoords {
  x: number; // Center X %
  y: number; // Center Y %
  w: number; // Mouth Width %
  h: number; // Mouth Height %
  skinTone: string;
  lipColor: string;
  innerMouthColor: string;
}

const ANCHOR_MOUTH_MAP: Record<string, AnchorMouthCoords> = {
  'dr-samson-oryan': {
    x: 50.0,
    y: 39.2,
    w: 7.8,
    h: 4.2,
    skinTone: '#C9935A',
    lipColor: '#8C4830',
    innerMouthColor: '#4A151B',
  },
  'celeste-blaze': {
    x: 50.0,
    y: 38.6,
    w: 8.2,
    h: 4.4,
    skinTone: '#D4A373',
    lipColor: '#A85D52',
    innerMouthColor: '#52141F',
  },
  'calvin-vance': {
    x: 50.0,
    y: 38.2,
    w: 7.6,
    h: 4.0,
    skinTone: '#D2A27A',
    lipColor: '#965848',
    innerMouthColor: '#4A151B',
  },
  'satori-vance': {
    x: 50.0,
    y: 37.4,
    w: 7.6,
    h: 4.2,
    skinTone: '#E2B89A',
    lipColor: '#B06866',
    innerMouthColor: '#5A1B24',
  },
  'lucas-ray': {
    x: 50.0,
    y: 39.4,
    w: 7.8,
    h: 4.2,
    skinTone: '#7588B8',
    lipColor: '#535E8A',
    innerMouthColor: '#2B2144',
  },
  'luna-nightingale': {
    x: 50.0,
    y: 37.2,
    w: 7.2,
    h: 4.0,
    skinTone: '#6C83B5',
    lipColor: '#4E6088',
    innerMouthColor: '#262040',
  },
};

export const PortraitLipSyncOverlay: React.FC<PortraitLipSyncOverlayProps> = ({
  activeHost,
  isPlaying,
  isPaused,
  currentSpokenWord,
  className = '',
}) => {
  const [mouthOpenRatio, setMouthOpenRatio] = useState<number>(0);
  const [mouthShapeType, setMouthShapeType] = useState<'A' | 'O' | 'E' | 'U' | 'M'>('M');
  const animFrameRef = useRef<number | null>(null);
  const targetOpenRef = useRef<number>(0);
  const currentOpenRef = useRef<number>(0);

  const coords = ANCHOR_MOUTH_MAP[activeHost.id] || {
    x: 50.0,
    y: 38.5,
    w: 8.0,
    h: 4.2,
    skinTone: '#C9935A',
    lipColor: '#965848',
    innerMouthColor: '#4A151B',
  };

  // Determine phoneme & mouth openness from current spoken word
  useEffect(() => {
    if (!isPlaying || isPaused || !currentSpokenWord) {
      targetOpenRef.current = 0;
      setMouthShapeType('M');
      return;
    }

    const word = currentSpokenWord.toLowerCase().trim();
    // Analyze vowels in word to choose phoneme
    if (word.includes('o') || word.includes('aw') || word.includes('or')) {
      setMouthShapeType('O');
      targetOpenRef.current = 0.75 + Math.random() * 0.25;
    } else if (word.includes('a') || word.includes('ah') || word.includes('ai')) {
      setMouthShapeType('A');
      targetOpenRef.current = 0.85 + Math.random() * 0.2;
    } else if (word.includes('e') || word.includes('ee') || word.includes('i')) {
      setMouthShapeType('E');
      targetOpenRef.current = 0.65 + Math.random() * 0.25;
    } else if (word.includes('u') || word.includes('oo')) {
      setMouthShapeType('U');
      targetOpenRef.current = 0.55 + Math.random() * 0.25;
    } else if (word.startsWith('m') || word.startsWith('p') || word.startsWith('b')) {
      setMouthShapeType('M');
      targetOpenRef.current = 0.05;
    } else {
      setMouthShapeType('A');
      targetOpenRef.current = 0.6 + Math.random() * 0.35;
    }
  }, [currentSpokenWord, isPlaying, isPaused]);

  // High-frequency 60fps lip motion loop
  useEffect(() => {
    let lastTime = performance.now();

    const animateMouth = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (isPlaying && !isPaused) {
        // Natural speech syllabic fluctuation
        const syllableOscillation = Math.sin(now * 0.015) * 0.3 + 0.5;
        const target = targetOpenRef.current * Math.max(0.2, syllableOscillation);
        currentOpenRef.current += (target - currentOpenRef.current) * Math.min(1, delta * 18);
      } else {
        // Return to natural closed smile
        currentOpenRef.current += (0 - currentOpenRef.current) * Math.min(1, delta * 12);
      }

      setMouthOpenRatio(currentOpenRef.current);
      animFrameRef.current = requestAnimationFrame(animateMouth);
    };

    animFrameRef.current = requestAnimationFrame(animateMouth);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, isPaused]);

  if (!isPlaying || mouthOpenRatio < 0.08) {
    return null;
  }

  // Calculate pixel-perfect SVG morph parameters based on phoneme and openness
  const openHeight = mouthOpenRatio * 18; // px height of inner mouth opening
  const mouthWidth = mouthShapeType === 'O' || mouthShapeType === 'U' ? 24 : 32;

  return (
    <div 
      className={`absolute inset-0 pointer-events-none z-10 ${className}`}
      style={{
        transformOrigin: `${coords.x}% ${coords.y}%`,
      }}
    >
      {/* Positioned directly over the newscaster's mouth */}
      <div 
        className="absolute"
        style={{
          left: `${coords.x}%`,
          top: `${coords.y}%`,
          width: `${coords.w * 3.2}%`,
          height: `${coords.h * 4.2}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <svg 
          viewBox="0 0 50 30" 
          className="w-full h-full filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
        >
          <defs>
            {/* Soft Edge Mask for Seamless Face Blending */}
            <radialGradient id="mouthSkinBlend" cx="50%" cy="50%" r="50%">
              <stop offset="65%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
            
            <linearGradient id="innerMouthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2A0B10" />
              <stop offset="70%" stopColor="#5E1622" />
              <stop offset="100%" stopColor="#7E2231" />
            </linearGradient>
          </defs>

          {/* 1. Inner Mouth Cavity with Dark Shadow Depth */}
          <ellipse 
            cx="25" 
            cy="15" 
            rx={mouthWidth / 2} 
            ry={Math.max(1, openHeight / 2)} 
            fill="url(#innerMouthGrad)" 
          />

          {/* 2. Subtle Upper Teeth Hint (when mouth is open) */}
          {mouthOpenRatio > 0.35 && (
            <path 
              d={`M ${25 - mouthWidth / 3.2} ${15 - openHeight / 4} Q 25 ${15 - openHeight / 6} ${25 + mouthWidth / 3.2} ${15 - openHeight / 4} L ${25 + mouthWidth / 3.5} ${15} Q 25 ${15 + 1} ${25 - mouthWidth / 3.5} ${15} Z`} 
              fill="#FFFFFF" 
              opacity="0.9" 
            />
          )}

          {/* 3. Subtle Tongue Hint (when mouth is widely open) */}
          {mouthOpenRatio > 0.55 && (
            <ellipse 
              cx="25" 
              cy={15 + openHeight / 4} 
              rx={mouthWidth / 3} 
              ry={openHeight / 4.5} 
              fill="#D95368" 
              opacity="0.9" 
            />
          )}

          {/* 4. Upper Lip Contour */}
          <path 
            d={`M ${25 - mouthWidth / 1.8} 14 Q 25 ${12 - mouthOpenRatio * 2} ${25 + mouthWidth / 1.8} 14 Q 25 ${13 + mouthOpenRatio * 1.5} ${25 - mouthWidth / 1.8} 14 Z`} 
            fill={coords.lipColor} 
            opacity="0.85" 
          />

          {/* 5. Lower Lip Contour */}
          <path 
            d={`M ${25 - mouthWidth / 1.9} ${15 + openHeight / 3} Q 25 ${17 + openHeight / 1.8} ${25 + mouthWidth / 1.9} ${15 + openHeight / 3} Q 25 ${14 + openHeight / 4} ${25 - mouthWidth / 1.9} ${15 + openHeight / 3} Z`} 
            fill={coords.lipColor} 
            opacity="0.85" 
          />
        </svg>
      </div>
    </div>
  );
};
