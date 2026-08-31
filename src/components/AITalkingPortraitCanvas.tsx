import React, { useEffect, useRef, useState } from 'react';
import { AstrologerProfile } from '../data/astrologerRoster';

interface AITalkingPortraitCanvasProps {
  photoUrl: string;
  activeHost: AstrologerProfile;
  isPlaying: boolean;
  isPaused: boolean;
  currentSpokenWord: string;
  className?: string;
}

interface FacialProfile {
  leftEye: { x: number; y: number; r: number };
  rightEye: { x: number; y: number; r: number };
  mouth: { x: number; y: number; w: number; h: number };
  jaw: { y: number; height: number };
  skinTone: string;
  lipColor: string;
  innerMouth: string;
  speciesGlow: string;
}

const FACIAL_PROFILES: Record<string, FacialProfile> = {
  'dr-samson-oryan': {
    leftEye: { x: 0.44, y: 0.28, r: 0.032 },
    rightEye: { x: 0.56, y: 0.28, r: 0.032 },
    mouth: { x: 0.50, y: 0.385, w: 0.09, h: 0.038 },
    jaw: { y: 0.40, height: 0.15 },
    skinTone: '#C9935A',
    lipColor: '#8C4830',
    innerMouth: '#3E1015',
    speciesGlow: 'rgba(245, 158, 11, 0.4)',
  },
  'celeste-blaze': {
    leftEye: { x: 0.435, y: 0.275, r: 0.032 },
    rightEye: { x: 0.565, y: 0.275, r: 0.032 },
    mouth: { x: 0.50, y: 0.380, w: 0.088, h: 0.036 },
    jaw: { y: 0.395, height: 0.14 },
    skinTone: '#D4A373',
    lipColor: '#A85D52',
    innerMouth: '#421018',
    speciesGlow: 'rgba(234, 179, 8, 0.4)',
  },
  'calvin-vance': {
    leftEye: { x: 0.44, y: 0.275, r: 0.03 },
    rightEye: { x: 0.56, y: 0.275, r: 0.03 },
    mouth: { x: 0.50, y: 0.378, w: 0.085, h: 0.034 },
    jaw: { y: 0.392, height: 0.14 },
    skinTone: '#D2A27A',
    lipColor: '#965848',
    innerMouth: '#3A1015',
    speciesGlow: 'rgba(45, 212, 191, 0.45)',
  },
  'satori-vance': {
    leftEye: { x: 0.44, y: 0.270, r: 0.03 },
    rightEye: { x: 0.56, y: 0.270, r: 0.03 },
    mouth: { x: 0.50, y: 0.372, w: 0.085, h: 0.034 },
    jaw: { y: 0.388, height: 0.135 },
    skinTone: '#E2B89A',
    lipColor: '#B06866',
    innerMouth: '#45141D',
    speciesGlow: 'rgba(52, 211, 153, 0.45)',
  },
  'lucas-ray': {
    leftEye: { x: 0.435, y: 0.285, r: 0.032 },
    rightEye: { x: 0.565, y: 0.285, r: 0.032 },
    mouth: { x: 0.50, y: 0.390, w: 0.086, h: 0.035 },
    jaw: { y: 0.405, height: 0.145 },
    skinTone: '#7588B8',
    lipColor: '#535E8A',
    innerMouth: '#231B38',
    speciesGlow: 'rgba(129, 140, 248, 0.5)',
  },
  'luna-nightingale': {
    leftEye: { x: 0.435, y: 0.265, r: 0.03 },
    rightEye: { x: 0.565, y: 0.265, r: 0.03 },
    mouth: { x: 0.50, y: 0.368, w: 0.082, h: 0.032 },
    jaw: { y: 0.382, height: 0.13 },
    skinTone: '#6C83B5',
    lipColor: '#4E6088',
    innerMouth: '#1F1A33',
    speciesGlow: 'rgba(192, 132, 252, 0.5)',
  },
};

export const AITalkingPortraitCanvas: React.FC<AITalkingPortraitCanvasProps> = ({
  photoUrl,
  activeHost,
  isPlaying,
  isPaused,
  currentSpokenWord,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Animation State
  const animFrameRef = useRef<number | null>(null);
  const mouthOpenRef = useRef<number>(0);
  const targetMouthOpenRef = useRef<number>(0);
  const blinkRatioRef = useRef<number>(0); // 0 = open, 1 = fully closed
  const headPitchRef = useRef<number>(0);
  const headYawRef = useRef<number>(0);
  const breathOffsetRef = useRef<number>(0);
  const nextBlinkTimeRef = useRef<number>(Date.now() + 3000);
  const blinkStateRef = useRef<'idle' | 'closing' | 'opening'>('idle');

  const profile = FACIAL_PROFILES[activeHost.id] || FACIAL_PROFILES['celeste-blaze'];

  // 1. Preload Photo Image
  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photoUrl;
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
  }, [photoUrl]);

  // 2. Map Current Spoken Word to Mouth Target Openness & Syllable Cadence
  useEffect(() => {
    if (!isPlaying || isPaused || !currentSpokenWord) {
      targetMouthOpenRef.current = 0;
      return;
    }

    const word = currentSpokenWord.toLowerCase().trim();
    if (word.includes('o') || word.includes('or') || word.includes('aw')) {
      targetMouthOpenRef.current = 0.85 + Math.random() * 0.2;
    } else if (word.includes('a') || word.includes('ah') || word.includes('ai')) {
      targetMouthOpenRef.current = 0.95 + Math.random() * 0.15;
    } else if (word.includes('e') || word.includes('ee') || word.includes('i')) {
      targetMouthOpenRef.current = 0.68 + Math.random() * 0.22;
    } else if (word.includes('u') || word.includes('oo')) {
      targetMouthOpenRef.current = 0.55 + Math.random() * 0.2;
    } else if (word.startsWith('m') || word.startsWith('p') || word.startsWith('b')) {
      targetMouthOpenRef.current = 0.05;
    } else {
      targetMouthOpenRef.current = 0.65 + Math.random() * 0.3;
    }
  }, [currentSpokenWord, isPlaying, isPaused]);

  // 3. 60 FPS Real-Time Canvas Rendering Engine
  useEffect(() => {
    let lastTime = performance.now();

    const render = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const img = imageRef.current;

      if (!canvas || !ctx || !img || !img.complete) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const cw = canvas.width;
      const ch = canvas.height;

      // --- A. PHYSICS & ANIMATION CALCULATIONS ---
      // 1. Natural Syllabic Mouth Oscillation
      if (isPlaying && !isPaused) {
        const speechCadence = Math.sin(now * 0.016) * 0.35 + 0.65;
        const target = targetMouthOpenRef.current * speechCadence;
        mouthOpenRef.current += (target - mouthOpenRef.current) * Math.min(1, delta * 22);
      } else {
        mouthOpenRef.current += (0 - mouthOpenRef.current) * Math.min(1, delta * 15);
      }

      // 2. Realistic Eye Blinking State Machine
      if (Date.now() > nextBlinkTimeRef.current && blinkStateRef.current === 'idle') {
        blinkStateRef.current = 'closing';
      }

      if (blinkStateRef.current === 'closing') {
        blinkRatioRef.current += delta * 14;
        if (blinkRatioRef.current >= 1) {
          blinkRatioRef.current = 1;
          blinkStateRef.current = 'opening';
        }
      } else if (blinkStateRef.current === 'opening') {
        blinkRatioRef.current -= delta * 12;
        if (blinkRatioRef.current <= 0) {
          blinkRatioRef.current = 0;
          blinkStateRef.current = 'idle';
          nextBlinkTimeRef.current = Date.now() + 3200 + Math.random() * 3000;
        }
      }

      // 3. Conversational Micro-Head Motion & Torso Breathing
      const breathCycle = Math.sin(now * 0.0018);
      breathOffsetRef.current = breathCycle * 2.5;

      if (isPlaying && !isPaused) {
        // Conversational head pitch / nod on stressed syllables
        const speechNod = Math.sin(now * 0.005) * 1.8;
        const speechSway = Math.cos(now * 0.0035) * 1.2;
        headPitchRef.current += (speechNod - headPitchRef.current) * Math.min(1, delta * 8);
        headYawRef.current += (speechSway - headYawRef.current) * Math.min(1, delta * 8);
      } else {
        headPitchRef.current += (0 - headPitchRef.current) * Math.min(1, delta * 5);
        headYawRef.current += (0 - headYawRef.current) * Math.min(1, delta * 5);
      }

      // --- B. CANVAS DRAWING PASSES ---
      ctx.clearRect(0, 0, cw, ch);
      ctx.save();

      // Apply Organic Breathing & Head Tilt to the Entire Portrait
      ctx.translate(cw / 2, ch);
      ctx.rotate((headYawRef.current * Math.PI) / 180 * 0.4);
      ctx.translate(-cw / 2, -ch);
      ctx.translate(headYawRef.current * 0.8, -breathOffsetRef.current + headPitchRef.current * 0.6);

      // 1. Draw Base Portrait Photo
      ctx.drawImage(img, 0, 0, cw, ch);

      const mouthX = profile.mouth.x * cw;
      const mouthY = profile.mouth.y * ch;
      const mouthW = profile.mouth.w * cw;
      const maxOpen = profile.mouth.h * ch * 1.35;
      const currentOpenPx = mouthOpenRef.current * maxOpen;

      // 2. REALISTIC LOWER JAW DEFORMATION & MORPHING
      if (mouthOpenRef.current > 0.04) {
        const jawY = profile.jaw.y * ch;
        const jawH = profile.jaw.height * ch;
        const jawW = mouthW * 2.6;
        const jawDropAmount = currentOpenPx * 0.45;

        // Draw the shifted lower jaw & chin from the actual photo
        ctx.save();
        ctx.beginPath();
        // Clip lower jaw ellipse
        ctx.ellipse(mouthX, jawY + jawH * 0.4, jawW * 0.55, jawH * 0.6, 0, 0, Math.PI * 2);
        ctx.clip();

        // Shift down the chin and lower beard/neck in sync with speech
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          0,
          jawDropAmount,
          cw,
          ch
        );
        ctx.restore();

        // 3. INNER MOUTH CAVITY & LIP MORPHING
        ctx.save();
        
        // Inner Mouth Cavity
        ctx.beginPath();
        ctx.ellipse(
          mouthX,
          mouthY + currentOpenPx * 0.25,
          mouthW * 0.48,
          Math.max(1, currentOpenPx * 0.55),
          0,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = profile.innerMouth;
        ctx.fill();

        // Upper Teeth Hint
        if (mouthOpenRef.current > 0.3) {
          ctx.beginPath();
          ctx.rect(
            mouthX - mouthW * 0.3,
            mouthY - currentOpenPx * 0.1,
            mouthW * 0.6,
            Math.min(currentOpenPx * 0.35, 4.5)
          );
          ctx.fillStyle = '#FAFAFA';
          ctx.fill();
        }

        // Lower Tongue Highlight
        if (mouthOpenRef.current > 0.5) {
          ctx.beginPath();
          ctx.ellipse(
            mouthX,
            mouthY + currentOpenPx * 0.48,
            mouthW * 0.3,
            currentOpenPx * 0.22,
            0,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = '#C84D5E';
          ctx.fill();
        }

        // Upper Lip Overdraw (Maintains photo contour)
        ctx.beginPath();
        ctx.moveTo(mouthX - mouthW * 0.52, mouthY);
        ctx.quadraticCurveTo(mouthX, mouthY - currentOpenPx * 0.2 - 1, mouthX + mouthW * 0.52, mouthY);
        ctx.quadraticCurveTo(mouthX, mouthY + currentOpenPx * 0.15, mouthX - mouthW * 0.52, mouthY);
        ctx.fillStyle = profile.lipColor;
        ctx.fill();

        // Lower Lip Overdraw (Moves smoothly with jaw)
        ctx.beginPath();
        ctx.moveTo(mouthX - mouthW * 0.5, mouthY + currentOpenPx * 0.35);
        ctx.quadraticCurveTo(
          mouthX,
          mouthY + currentOpenPx * 0.85 + 2,
          mouthX + mouthW * 0.5,
          mouthY + currentOpenPx * 0.35
        );
        ctx.quadraticCurveTo(
          mouthX,
          mouthY + currentOpenPx * 0.5,
          mouthX - mouthW * 0.5,
          mouthY + currentOpenPx * 0.35
        );
        ctx.fillStyle = profile.lipColor;
        ctx.fill();

        ctx.restore();
      }

      // 4. ORGANIC EYE BLINKING PASS
      if (blinkRatioRef.current > 0.05) {
        const drawEyelid = (eye: { x: number; y: number; r: number }) => {
          const ex = eye.x * cw;
          const ey = eye.y * ch;
          const er = eye.r * cw;
          const blinkH = er * blinkRatioRef.current * 1.3;

          ctx.save();
          ctx.beginPath();
          ctx.ellipse(ex, ey, er * 1.15, er * 0.85, 0, 0, Math.PI * 2);
          ctx.clip();

          // Smooth skin-tone eyelid closure
          ctx.fillStyle = profile.skinTone;
          ctx.fillRect(ex - er * 1.3, ey - er, er * 2.6, blinkH * 2);

          // Eyelash Line
          ctx.beginPath();
          ctx.ellipse(ex, ey - er * 0.8 + blinkH * 1.8, er * 1.1, 1.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#222222';
          ctx.fill();

          ctx.restore();
        };

        drawEyelid(profile.leftEye);
        drawEyelid(profile.rightEye);
      }

      // 5. STAR-RACE BIOLUMINESCENT GLOW SHIMMER PASS
      if (isPlaying && !isPaused) {
        const glowPulse = Math.sin(now * 0.006) * 0.2 + 0.35;
        const grad = ctx.createRadialGradient(
          cw * 0.5,
          ch * 0.35,
          cw * 0.1,
          cw * 0.5,
          ch * 0.4,
          cw * 0.65
        );
        grad.addColorStop(0, profile.speciesGlow.replace(/[\d\.]+\)$/, `${glowPulse * 0.5})`));
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cw, ch);
      }

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [imageLoaded, isPlaying, isPaused, profile]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        width={480}
        height={600}
        className="w-full h-full object-cover object-top select-none"
      />
    </div>
  );
};
