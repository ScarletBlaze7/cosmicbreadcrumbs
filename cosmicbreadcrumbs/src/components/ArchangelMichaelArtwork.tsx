import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Maximize2, Shield, Flame, Feather, X, Upload, RotateCcw, Image as ImageIcon } from 'lucide-react';

interface ArchangelMichaelArtworkProps {
  variant?: 'card-banner' | 'temple-featured' | 'compact' | 'hero';
  className?: string;
  allowZoom?: boolean;
  showCaption?: boolean;
}

export const MichaelSvgArtwork: React.FC = () => (
  <svg
    viewBox="0 0 960 540"
    className="h-full w-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Celestial Sky Gradient */}
      <radialGradient id="skyGlow" cx="50%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#ffea9f" stopOpacity="1" />
        <stop offset="15%" stopColor="#f59e0b" stopOpacity="0.8" />
        <stop offset="35%" stopColor="#3b82f6" stopOpacity="0.7" />
        <stop offset="70%" stopColor="#1e1b4b" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#090514" stopOpacity="1" />
      </radialGradient>

      {/* Sunburst Halo */}
      <radialGradient id="sunHalo" cx="50%" cy="28%" r="40%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
        <stop offset="25%" stopColor="#fef08a" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
      </radialGradient>

      {/* Golden Hair Gradient */}
      <linearGradient id="goldenHair" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="30%" stopColor="#fde047" />
        <stop offset="70%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>

      {/* Divine Shield Gold Gradient */}
      <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="25%" stopColor="#fde047" />
        <stop offset="50%" stopColor="#eab308" />
        <stop offset="85%" stopColor="#a16207" />
        <stop offset="100%" stopColor="#713f12" />
      </linearGradient>

      {/* Cross on Shield Gradient */}
      <linearGradient id="crossGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#fbbf24" />
        <stop offset="80%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>

      {/* Flaming Sword Gradient */}
      <linearGradient id="fireBlade" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="20%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#f97316" />
        <stop offset="85%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </linearGradient>

      {/* Royal Blue Mantle / Tunic */}
      <linearGradient id="blueTunic" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="40%" stopColor="#2563eb" />
        <stop offset="80%" stopColor="#1d4ed8" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>

      {/* Muscular Flesh Tones */}
      <linearGradient id="skinTone" x1="30%" y1="0%" x2="70%" y2="100%">
        <stop offset="0%" stopColor="#ffedd5" />
        <stop offset="40%" stopColor="#fed7aa" />
        <stop offset="75%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#9a3412" />
      </linearGradient>

      {/* Wing Feather Gradients */}
      <linearGradient id="featherLeft" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#f1f5f9" />
        <stop offset="75%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>

      <linearGradient id="featherRight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#f1f5f9" />
        <stop offset="75%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>

      {/* Cloud Gradient */}
      <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
        <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
      </linearGradient>

      <filter id="divineGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      <filter id="flameBlur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Background Sky */}
    <rect width="960" height="540" fill="url(#skyGlow)" />

    {/* Radiant Sunburst Rays */}
    <g opacity="0.65" stroke="#fef08a" strokeWidth="1.5">
      <line x1="480" y1="150" x2="100" y2="20" strokeWidth="3" opacity="0.4" />
      <line x1="480" y1="150" x2="200" y2="0" strokeWidth="4" opacity="0.6" />
      <line x1="480" y1="150" x2="350" y2="-30" strokeWidth="5" opacity="0.7" />
      <line x1="480" y1="150" x2="480" y2="-40" strokeWidth="6" opacity="0.8" />
      <line x1="480" y1="150" x2="610" y2="-30" strokeWidth="5" opacity="0.7" />
      <line x1="480" y1="150" x2="760" y2="0" strokeWidth="4" opacity="0.6" />
      <line x1="480" y1="150" x2="860" y2="20" strokeWidth="3" opacity="0.4" />
      <line x1="480" y1="150" x2="940" y2="120" strokeWidth="2" opacity="0.3" />
      <line x1="480" y1="150" x2="20" y2="120" strokeWidth="2" opacity="0.3" />
    </g>

    {/* Celestial Sun Halo behind head */}
    <circle cx="480" cy="150" r="160" fill="url(#sunHalo)" filter="url(#divineGlow)" />
    <circle cx="480" cy="150" r="70" fill="#fffbeb" opacity="0.9" filter="url(#divineGlow)" />

    {/* LEFT WING (Outstretched Feathers) */}
    <g>
      <path
        d="M440 180 C360 80 220 20 40 45 C-10 50 10 100 110 130 C20 120 40 170 140 180 C40 175 70 230 170 230 C70 230 110 290 210 280 C120 295 160 350 250 330 C190 355 240 410 320 370 C280 400 340 440 400 390 C430 350 450 260 450 200 Z"
        fill="url(#featherLeft)"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />
      <path d="M430 170 C320 100 180 80 60 65" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M425 185 C330 130 200 130 130 140" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M420 200 C340 170 230 180 160 200" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M410 220 C340 220 250 230 200 255" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M400 240 C340 260 270 280 240 310" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" />
    </g>

    {/* RIGHT WING (Outstretched Feathers) */}
    <g>
      <path
        d="M520 180 C600 80 740 20 920 45 C970 50 950 100 850 130 C940 120 920 170 820 180 C920 175 890 230 790 230 C890 230 850 290 750 280 C840 295 800 350 710 330 C770 355 720 410 640 370 C680 400 620 440 560 390 C530 350 510 260 510 200 Z"
        fill="url(#featherRight)"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />
      <path d="M530 170 C640 100 780 80 900 65" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M535 185 C630 130 760 130 830 140" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M540 200 C620 170 730 180 800 200" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M550 220 C620 220 710 230 760 255" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M560 240 C620 260 690 280 720 310" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" />
    </g>

    {/* FLOWING GOLDEN HAIR (Background Layers) */}
    <path
      d="M445 150 C410 160 350 190 320 250 C310 270 330 280 345 260 C370 220 420 190 450 180 Z"
      fill="url(#goldenHair)"
    />
    <path
      d="M455 140 C430 170 380 210 350 280 C360 285 375 270 390 240 C420 190 450 170 470 160 Z"
      fill="url(#goldenHair)"
    />

    {/* WARRIOR BODY: Muscular Torso & Arms */}
    <path d="M460 180 L460 215 L500 215 L500 180 Z" fill="url(#skinTone)" />
    <path d="M400 230 C410 200 450 200 465 215 L495 215 C510 200 550 200 560 230 C565 250 550 270 540 280 L420 280 C410 270 395 250 400 230 Z" fill="url(#skinTone)" />
    <path d="M425 225 C455 220 480 230 480 255 C480 270 460 275 425 270 Z" fill="url(#skinTone)" stroke="#c2410c" strokeWidth="1" />
    <path d="M535 225 C505 220 480 230 480 255 C480 270 500 275 535 270 Z" fill="url(#skinTone)" stroke="#c2410c" strokeWidth="1" />
    <g stroke="#9a3412" strokeWidth="1.5" fill="none" opacity="0.6">
      <line x1="480" y1="250" x2="480" y2="340" />
      <path d="M460 280 Q480 285 500 280" />
      <path d="M455 305 Q480 310 505 305" />
      <path d="M450 330 Q480 335 510 330" />
    </g>

    {/* Right Arm (Wielding Flaming Sword) */}
    <path
      d="M405 235 C380 255 350 290 325 330 C320 340 335 350 345 345 C370 315 395 285 420 260 Z"
      fill="url(#skinTone)"
    />
    <path
      d="M320 325 L300 355 L325 370 L345 340 Z"
      fill="url(#shieldGold)"
      stroke="#713f12"
      strokeWidth="1.5"
    />
    <circle cx="295" cy="365" r="14" fill="url(#skinTone)" stroke="#9a3412" strokeWidth="1" />

    {/* FLAMING SWORD OF TRUTH */}
    <g>
      <path d="M280 350 L310 380 L295 395 L265 365 Z" fill="url(#shieldGold)" stroke="#78350f" strokeWidth="1.5" />
      <circle cx="270" cy="385" r="7" fill="#fbbf24" stroke="#451a03" strokeWidth="1" />
      <path d="M260 340 L320 400 L305 415 L245 355 Z" fill="url(#shieldGold)" stroke="#78350f" strokeWidth="1" />

      {/* Fire Halo / Glow behind Blade */}
      <path
        d="M285 365 L170 480 C150 500 130 520 140 525 C150 525 170 510 200 480 L315 365 Z"
        fill="#f97316"
        opacity="0.75"
        filter="url(#flameBlur)"
      />
      <path
        d="M280 370 L160 490 C145 505 135 515 142 518 C150 518 165 505 190 480 L310 370 Z"
        fill="#fef08a"
        opacity="0.9"
        filter="url(#flameBlur)"
      />

      {/* Main Sword Blade */}
      <path
        d="M285 375 L150 510 C145 515 140 515 145 510 L295 365 Z"
        fill="url(#fireBlade)"
        stroke="#fff"
        strokeWidth="2"
      />

      {/* Blazing Flame Tongue Accents */}
      <path
        d="M290 380 Q250 400 230 450 Q240 430 260 410 Q220 450 200 480 Q215 460 240 435 Q180 490 145 510 Q170 470 210 430 Q250 390 295 370 Z"
        fill="#ffedd5"
        opacity="0.95"
      />
      <circle cx="220" cy="440" r="4" fill="#fef08a" filter="url(#flameBlur)" />
      <circle cx="180" cy="475" r="5" fill="#ffffff" filter="url(#flameBlur)" />
      <circle cx="150" cy="505" r="6" fill="#fef08a" filter="url(#flameBlur)" />
    </g>

    {/* Left Arm & SACRED GOLDEN CROSS SHIELD */}
    <path
      d="M545 235 C570 255 600 290 615 330 C605 340 590 340 575 315 C560 290 540 265 530 250 Z"
      fill="url(#skinTone)"
    />

    <g transform="translate(510, 200) rotate(8)">
      <path
        d="M50 40 L190 70 C200 130 180 230 110 290 C50 230 30 130 50 40 Z"
        fill="url(#shieldGold)"
        stroke="#78350f"
        strokeWidth="4"
        filter="url(#divineGlow)"
      />
      <path
        d="M60 55 L180 80 C188 135 170 218 110 270 C60 218 45 135 60 55 Z"
        fill="#0f172a"
        stroke="#eab308"
        strokeWidth="2"
      />
      <path
        d="M100 70 L120 73 L120 250 L100 245 Z"
        fill="url(#crossGlow)"
        stroke="#fff"
        strokeWidth="1.5"
        filter="url(#divineGlow)"
      />
      <path
        d="M65 125 L175 140 L173 158 L63 143 Z"
        fill="url(#crossGlow)"
        stroke="#fff"
        strokeWidth="1.5"
        filter="url(#divineGlow)"
      />
      <circle cx="110" cy="142" r="10" fill="#fef08a" filter="url(#divineGlow)" opacity="0.9" />
    </g>

    {/* GOLDEN WAIST CUIRASS & ROYAL BLUE TUNIC */}
    <path
      d="M420 330 C450 340 510 340 540 330 L545 365 C510 380 450 380 415 365 Z"
      fill="url(#shieldGold)"
      stroke="#713f12"
      strokeWidth="2"
    />
    <path
      d="M410 360 C380 390 320 440 280 470 C340 480 420 460 460 450 C490 470 560 480 640 455 C610 420 570 380 545 360 Z"
      fill="url(#blueTunic)"
      stroke="#1e3a8a"
      strokeWidth="2"
    />
    <g fill="#fde047" opacity="0.85">
      <circle cx="330" cy="460" r="3" />
      <circle cx="370" cy="465" r="3.5" />
      <circle cx="420" cy="455" r="3" />
      <circle cx="470" cy="455" r="3.5" />
      <circle cx="530" cy="460" r="3" />
      <circle cx="580" cy="450" r="3.5" />
    </g>

    {/* LEGS & GOLDEN GREAVES (Descending Stance) */}
    <path d="M430 380 C400 420 380 460 395 500 C420 510 450 490 460 450 Z" fill="url(#skinTone)" />
    <path
      d="M390 470 L380 525 C400 535 430 530 445 520 L455 465 Z"
      fill="url(#shieldGold)"
      stroke="#78350f"
      strokeWidth="2"
    />

    {/* ARCHANGEL MICHAEL'S HEAD & NOBLE FACE */}
    <path
      d="M455 140 C445 160 445 185 460 205 C470 218 490 218 500 205 C515 185 515 160 505 140 Z"
      fill="url(#skinTone)"
      stroke="#c2410c"
      strokeWidth="1"
    />
    <path d="M465 175 Q475 185 480 195 Q485 185 495 175" stroke="#9a3412" strokeWidth="1.5" fill="none" />
    <ellipse cx="468" cy="168" rx="5" ry="3" fill="#1e3a8a" />
    <circle cx="467" cy="167" r="1.5" fill="#ffffff" />
    <ellipse cx="492" cy="168" rx="5" ry="3" fill="#1e3a8a" />
    <circle cx="491" cy="167" r="1.5" fill="#ffffff" />
    <path d="M462 163 Q470 160 476 164" stroke="#78350f" strokeWidth="2" fill="none" />
    <path d="M484 164 Q490 160 498 163" stroke="#78350f" strokeWidth="2" fill="none" />
    <path d="M480 168 L478 185 L483 186" stroke="#9a3412" strokeWidth="1.5" fill="none" />
    <path d="M472 196 Q480 200 488 196" stroke="#7c2d12" strokeWidth="1.5" fill="none" />

    {/* FLOWING GOLDEN HAIR */}
    <path
      d="M440 135 C420 115 470 95 500 110 C530 120 540 150 515 160 C490 130 460 130 440 135 Z"
      fill="url(#goldenHair)"
    />
    <path
      d="M440 135 C420 150 400 180 370 210 C390 205 420 180 435 160 Z"
      fill="url(#goldenHair)"
    />
    <path
      d="M510 135 C530 150 545 180 570 210 C550 205 530 180 515 160 Z"
      fill="url(#goldenHair)"
    />

    {/* HEAVENLY BILLOWING CLOUDS AT FEET & PERIMETER */}
    <path
      d="M-40 540 C20 460 120 440 190 470 C260 430 360 430 420 480 C480 440 580 440 650 480 C720 430 840 440 920 490 C980 450 1020 500 1020 540 Z"
      fill="url(#cloudGrad)"
    />
    <path
      d="M0 540 C80 480 180 480 260 510 C340 470 450 480 520 520 C600 480 720 490 800 520 C880 480 960 500 1000 540 Z"
      fill="#ffffff"
      opacity="0.4"
    />
  </svg>
);

const LOCAL_STORAGE_KEY = 'archangel_michael_custom_photo';
const EVENT_CUSTOM_PHOTO_CHANGED = 'archangel_michael_photo_updated';

export const ArchangelMichaelArtwork: React.FC<ArchangelMichaelArtworkProps> = ({
  variant = 'card-banner',
  className = '',
  allowZoom = true,
  showCaption = true,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [customPhoto, setCustomPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        setCustomPhoto(stored || null);
      } catch {
        // ignore
      }
    };

    window.addEventListener(EVENT_CUSTOM_PHOTO_CHANGED, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(EVENT_CUSTOM_PHOTO_CHANGED, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, result);
          setCustomPhoto(result);
          window.dispatchEvent(new Event(EVENT_CUSTOM_PHOTO_CHANGED));
        } catch (err) {
          console.warn('Storage quota limit reached for photo, using memory state only', err);
          setCustomPhoto(result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setCustomPhoto(null);
      window.dispatchEvent(new Event(EVENT_CUSTOM_PHOTO_CHANGED));
    } catch {
      setCustomPhoto(null);
    }
  };

  const containerStyles = {
    'card-banner': 'h-48 sm:h-56 w-full',
    'temple-featured': 'h-52 sm:h-64 w-full',
    'compact': 'h-36 w-full',
    'hero': 'h-72 sm:h-96 w-full',
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div
        onClick={() => allowZoom && setIsZoomed(true)}
        className={`group relative overflow-hidden rounded-2xl border border-amber-400/50 bg-slate-950 shadow-xl select-none transition-all duration-300 hover:border-amber-300 hover:shadow-amber-500/20 ${
          allowZoom ? 'cursor-pointer' : ''
        } ${containerStyles[variant]} ${className}`}
      >
        {/* Sacred Image or SVG Vector Graphic */}
        <div className="relative h-full w-full overflow-hidden bg-slate-950 flex items-center justify-center">
          {customPhoto ? (
            <img
              src={customPhoto}
              alt="Archangel Michael Exact Portrait"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <MichaelSvgArtwork />
          )}

          {/* Vignette & Ambient Radial Glow Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
        </div>

        {/* Badges & Overlays */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center space-x-1.5 pointer-events-none">
          <span className="rounded-md bg-slate-950/80 px-2 py-0.5 text-[9px] font-bold tracking-wider text-amber-300 border border-amber-400/40 backdrop-blur-xs flex items-center space-x-1 shadow-md">
            <Shield className="h-3 w-3 text-amber-400" />
            <span>ARCHANGEL MICHAEL</span>
          </span>
          <span className="rounded-md bg-blue-950/80 px-2 py-0.5 text-[9px] font-bold text-blue-300 border border-blue-500/40 backdrop-blur-xs hidden sm:inline-flex items-center space-x-1 shadow-md">
            <Flame className="h-3 w-3 text-amber-400 animate-pulse" />
            <span>Flaming Sword & Shield</span>
          </span>
        </div>

        {/* Top Right Action Icons */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center space-x-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            title="Upload/Select Exact Image File (Picsart photo)"
            className="rounded-lg bg-slate-950/80 p-1.5 text-amber-300 hover:text-white hover:bg-amber-600/60 border border-amber-500/50 opacity-80 group-hover:opacity-100 transition-opacity backdrop-blur-xs shadow-md"
          >
            <Upload className="h-3.5 w-3.5" />
          </button>

          {allowZoom && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(true);
              }}
              title="Inspect Full Sacred Iconography"
              className="rounded-lg bg-slate-950/80 p-1.5 text-purple-300 hover:text-amber-300 border border-purple-800/60 opacity-80 group-hover:opacity-100 transition-opacity backdrop-blur-xs shadow-md"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Bottom Sacred Legend / Caption */}
        {showCaption && (
          <div className="absolute bottom-2 inset-x-2 z-10 flex items-center justify-between rounded-xl bg-slate-950/85 px-3 py-1.5 border border-purple-900/60 backdrop-blur-xs text-[10px] text-purple-200">
            <div className="flex items-center space-x-1.5 font-medium text-amber-200 truncate">
              <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />
              <span className="truncate">
                {customPhoto ? 'Custom Exact Portrait Active' : 'Warrior of Light & Divine Sapphire Shield'}
              </span>
            </div>
            <span className="text-[9px] text-purple-300/80 shrink-0 pl-2">
              {customPhoto ? 'Click to inspect / change' : 'Click to inspect or upload photo'}
            </span>
          </div>
        )}
      </div>

      {/* Lightbox / Zoom Modal for Archangel Michael Sacred Iconography */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full overflow-hidden rounded-3xl border-2 border-amber-400/50 bg-slate-950 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-purple-900/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                  <Shield className="h-3.5 w-3.5 text-amber-400" />
                  <span>Sacred Archangel Portrait & Iconography</span>
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-100 mt-0.5">
                  Archangel Michael - Prince of the Celestial Host
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="rounded-full bg-purple-900/40 p-2 text-purple-300 hover:text-white hover:bg-purple-800/60 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* High-Resolution Visual Stage */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-400/30 bg-black shadow-2xl">
              <div className="h-64 sm:h-80 md:h-96 w-full flex items-center justify-center overflow-hidden">
                {customPhoto ? (
                  <img
                    src={customPhoto}
                    alt="Archangel Michael Exact Portrait"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <MichaelSvgArtwork />
                )}
              </div>
            </div>

            {/* Image Source Controls & Exact Photo Loader */}
            <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-4 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-amber-300">
                  <ImageIcon className="h-4 w-4 text-amber-400" />
                  <span>Exact Photo Settings:</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md hover:from-amber-400 hover:to-amber-500 transition-all"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload / Select Exact Photo</span>
                  </button>
                  {customPhoto && (
                    <button
                      type="button"
                      onClick={handleResetPhoto}
                      className="flex items-center space-x-1 rounded-xl border border-purple-800 bg-purple-950/60 px-2.5 py-1.5 text-xs font-medium text-purple-200 hover:bg-purple-900/60 transition-all"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Reset to Illustration</span>
                    </button>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-purple-200/80 leading-relaxed">
                You can select your uploaded file (<span className="text-amber-300 font-mono text-[10px]">Picsart_26-08-18_16-51-38-909.png</span>) or any high-res image directly from your device. It is saved locally and applies across every Archangel Michael card pull and the Temple tab automatically!
              </p>
            </div>

            {/* Iconography Description & Attributes Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 space-y-1">
                <div className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                  <Flame className="h-3.5 w-3.5 text-amber-400" />
                  <span>Flaming Sword:</span>
                </div>
                <p className="text-[11px] text-amber-100/90 leading-relaxed">
                  Cuts through cords of fear, illusion, and doubt with divine truth.
                </p>
              </div>

              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 space-y-1">
                <div className="text-xs font-bold text-blue-300 flex items-center space-x-1.5">
                  <Shield className="h-3.5 w-3.5 text-blue-400" />
                  <span>Golden Cross Shield:</span>
                </div>
                <p className="text-[11px] text-blue-100/90 leading-relaxed">
                  Impenetrable sapphire & platinum aura deflecting lower vibrations.
                </p>
              </div>

              <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 space-y-1">
                <div className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                  <Feather className="h-3.5 w-3.5 text-purple-400" />
                  <span>Majestic Wings:</span>
                </div>
                <p className="text-[11px] text-purple-100/90 leading-relaxed">
                  Vast celestial feathers radiating supreme courage and sovereign grace.
                </p>
              </div>
            </div>

            {/* Sacred Inscription */}
            <div className="rounded-2xl border border-purple-900/50 bg-slate-900/80 p-3.5 text-center text-xs font-serif italic text-amber-200/90">
              "Archangel Michael stands with his flaming sword of divine fire and golden shield of protection, guarding your path and elevating your courage."
            </div>
          </div>
        </div>
      )}
    </>
  );
};
