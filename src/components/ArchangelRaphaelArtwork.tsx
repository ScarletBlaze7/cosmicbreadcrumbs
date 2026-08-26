import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Maximize2, Feather, X, Upload, RotateCcw, Image as ImageIcon, HeartPulse, Compass, ShieldCheck } from 'lucide-react';

interface ArchangelRaphaelArtworkProps {
  variant?: 'card-banner' | 'temple-featured' | 'compact' | 'hero';
  className?: string;
  allowZoom?: boolean;
  showCaption?: boolean;
}

export const RaphaelSvgArtwork: React.FC = () => (
  <svg
    viewBox="0 0 960 540"
    className="h-full w-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Stained Glass Golden Hall Glow */}
      <radialGradient id="cathedralGlow" cx="50%" cy="35%" r="85%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="25%" stopColor="#d97706" stopOpacity="0.85" />
        <stop offset="50%" stopColor="#065f46" stopOpacity="0.8" />
        <stop offset="80%" stopColor="#064e3b" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#022c22" />
      </radialGradient>

      {/* Rosette Window Emerald Gold Gradient */}
      <radialGradient id="rosetteGlow" cx="50%" cy="30%" r="50%">
        <stop offset="0%" stopColor="#ecfdf5" />
        <stop offset="30%" stopColor="#34d399" stopOpacity="0.8" />
        <stop offset="70%" stopColor="#059669" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#d97706" stopOpacity="0.1" />
      </radialGradient>

      {/* Emerald Robe Gradient */}
      <linearGradient id="emeraldRobe" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="40%" stopColor="#059669" />
        <stop offset="80%" stopColor="#047857" />
        <stop offset="100%" stopColor="#064e3b" />
      </linearGradient>

      {/* Gold Brocade Trim */}
      <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#fde047" />
        <stop offset="65%" stopColor="#eab308" />
        <stop offset="90%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>

      {/* Glowing Healing Emerald Orb */}
      <radialGradient id="emeraldOrb" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="25%" stopColor="#a7f3d0" />
        <stop offset="60%" stopColor="#10b981" />
        <stop offset="85%" stopColor="#047857" />
        <stop offset="100%" stopColor="#064e3b" />
      </radialGradient>

      {/* Healing Elixir Vial Glow */}
      <radialGradient id="elixirGlow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="35%" stopColor="#6ee7b7" stopOpacity="0.9" />
        <stop offset="75%" stopColor="#10b981" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#047857" stopOpacity="0.4" />
      </radialGradient>

      {/* Brown Pilgrim Wood Staff */}
      <linearGradient id="woodStaff" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#78350f" />
        <stop offset="50%" stopColor="#92400e" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>

      {/* Chestnut Wavy Hair */}
      <linearGradient id="chestnutHair" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#b45309" />
        <stop offset="40%" stopColor="#78350f" />
        <stop offset="80%" stopColor="#451a03" />
        <stop offset="100%" stopColor="#291202" />
      </linearGradient>

      {/* Silver Fish of Tobit */}
      <linearGradient id="silverFish" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#cbd5e1" />
        <stop offset="70%" stopColor="#64748b" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>

      {/* Mosaic Floor Gradient */}
      <linearGradient id="mosaicFloor" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#d97706" stopOpacity="0.4" />
        <stop offset="50%" stopColor="#78350f" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#1c1917" />
      </linearGradient>

      <filter id="emeraldGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Cathedral Stained-Glass Background */}
    <rect width="960" height="540" fill="url(#cathedralGlow)" />

    {/* Rosette Window Arches & Gold Filigree */}
    <g opacity="0.45" stroke="#fde047" strokeWidth="2" fill="none">
      <circle cx="480" cy="180" r="240" strokeWidth="4" />
      <circle cx="480" cy="180" r="180" strokeWidth="3" />
      <circle cx="480" cy="180" r="120" strokeWidth="2" />
      <circle cx="480" cy="180" r="60" strokeWidth="2" />
      {/* Arch Petals */}
      <path d="M480 0 L480 360" strokeWidth="2" />
      <path d="M300 180 L660 180" strokeWidth="2" />
      <path d="M350 50 L610 310" strokeWidth="1.5" />
      <path d="M610 50 L350 310" strokeWidth="1.5" />
    </g>

    {/* Background Sun Halo */}
    <circle cx="480" cy="170" r="150" fill="url(#rosetteGlow)" filter="url(#emeraldGlow)" />

    {/* LEFT WING (Large Radiant White/Iridescent Feathers) */}
    <g>
      <path
        d="M440 190 C340 90 190 35 15 60 C-35 65 -5 115 95 145 C5 135 25 185 125 195 C25 190 55 245 155 245 C55 245 95 305 195 295 C105 310 145 365 235 345 C175 370 225 425 305 385 C265 415 325 455 385 405 C415 365 435 275 440 210 Z"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />
      {/* Wing details & soft green highlights */}
      <path d="M430 180 C320 110 170 90 40 75" stroke="#a7f3d0" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M425 195 C320 140 190 140 120 155" stroke="#a7f3d0" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M420 210 C330 180 220 190 150 215" stroke="#a7f3d0" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M410 230 C330 230 240 240 190 270" stroke="#cbd5e1" strokeWidth="1.5" fill="none" opacity="0.5" />
    </g>

    {/* RIGHT WING (Large Radiant White/Iridescent Feathers) */}
    <g>
      <path
        d="M520 190 C620 90 770 35 945 60 C995 65 965 115 865 145 C955 135 935 185 835 195 C935 190 905 245 805 245 C905 245 865 305 765 295 C855 310 815 365 725 345 C785 370 735 425 655 385 C695 415 635 455 575 405 C545 365 525 275 520 210 Z"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />
      {/* Wing details & soft green highlights */}
      <path d="M530 180 C640 110 790 90 920 75" stroke="#a7f3d0" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M535 195 C640 140 770 140 840 155" stroke="#a7f3d0" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M540 210 C630 180 740 190 810 215" stroke="#a7f3d0" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M550 230 C630 230 720 240 770 270" stroke="#cbd5e1" strokeWidth="1.5" fill="none" opacity="0.5" />
    </g>

    {/* MOSAIC TEMPLE FLOOR */}
    <polygon points="0,540 960,540 860,460 100,460" fill="url(#mosaicFloor)" />
    <g stroke="#f59e0b" strokeWidth="1" opacity="0.35">
      <line x1="200" y1="460" x2="100" y2="540" />
      <line x1="350" y1="460" x2="280" y2="540" />
      <line x1="480" y1="460" x2="480" y2="540" />
      <line x1="610" y1="460" x2="680" y2="540" />
      <line x1="760" y1="460" x2="860" y2="540" />
      <line x1="100" y1="490" x2="860" y2="490" />
      <line x1="50" y1="515" x2="910" y2="515" />
    </g>

    {/* CHESTNUT WAVY HAIR (Back Layers) */}
    <path
      d="M440 160 C400 170 340 200 310 260 C300 280 320 290 335 270 C360 230 400 200 440 190 Z"
      fill="url(#chestnutHair)"
    />
    <path
      d="M520 160 C560 170 620 200 650 260 C660 280 640 290 625 270 C600 230 560 200 520 190 Z"
      fill="url(#chestnutHair)"
    />

    {/* EMERALD ROBE & GOLD TRIMMED INNER TUNIC */}
    {/* Inner Turquoise Tunic */}
    <path d="M460 200 L460 235 L500 235 L500 200 Z" fill="#ffedd5" />
    <path d="M445 230 L445 420 L515 420 L515 230 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
    {/* Inner Tunic Gold Filigree */}
    <path d="M470 240 L490 240 L485 410 L475 410 Z" fill="url(#goldTrim)" />

    {/* Main Flowing Emerald Robe */}
    <path
      d="M430 220 C400 260 360 330 340 440 C380 460 440 450 480 430 C520 450 580 460 620 440 C600 330 560 260 530 220 Z"
      fill="url(#emeraldRobe)"
      stroke="#064e3b"
      strokeWidth="2"
    />
    {/* Gold Robe Trimming & Borders */}
    <path d="M435 220 L345 440 L360 445 L445 225 Z" fill="url(#goldTrim)" />
    <path d="M525 220 L615 440 L600 445 L515 225 Z" fill="url(#goldTrim)" />
    <path d="M340 440 C420 460 540 460 620 440 L615 450 C535 470 425 470 345 450 Z" fill="url(#goldTrim)" />

    {/* CADUCEUS HEALING BELT CLASP */}
    <g transform="translate(480, 275)">
      <rect x="-35" y="-6" width="70" height="12" rx="4" fill="url(#goldTrim)" stroke="#78350f" strokeWidth="1" />
      {/* Caduceus Staff & Snakes */}
      <line x1="0" y1="-14" x2="0" y2="14" stroke="#ffffff" strokeWidth="2" />
      <circle cx="0" cy="-14" r="3" fill="#fef08a" />
      <path d="M-6 -8 Q0 -12 6 -8 Q0 -4 -6 0 Q0 4 6 8" stroke="#fef08a" strokeWidth="1.5" fill="none" />
      <path d="M6 -8 Q0 -12 -6 -8 Q0 -4 6 0 Q0 4 -6 8" stroke="#fef08a" strokeWidth="1.5" fill="none" />
    </g>

    {/* SACRED MEDICINAL FISH OF TOBIT (Hanging at Raphael's side) */}
    <g transform="translate(540, 290) rotate(15)">
      <path
        d="M0 0 C15 -10 35 -10 45 5 C55 20 45 45 35 60 C25 75 15 90 10 110 C5 90 -5 75 -15 60 C-25 45 -15 20 -5 5 Z"
        fill="url(#silverFish)"
        stroke="#475569"
        strokeWidth="1.5"
      />
      {/* Fish Tail */}
      <polygon points="10,110 25,130 10,122 -5,130" fill="url(#silverFish)" stroke="#475569" strokeWidth="1" />
      {/* Fish Eye & Scales */}
      <circle cx="15" cy="15" r="3" fill="#ffffff" />
      <circle cx="15" cy="15" r="1.5" fill="#0f172a" />
      <path d="M5 30 Q15 35 25 30" stroke="#94a3b8" strokeWidth="1" fill="none" />
      <path d="M0 45 Q15 50 25 45" stroke="#94a3b8" strokeWidth="1" fill="none" />
      <path d="M-5 60 Q10 65 20 60" stroke="#94a3b8" strokeWidth="1" fill="none" />
    </g>

    {/* SACRED PILGRIM STAFF & GLOWING EMERALD ORB (Held in Right Hand) */}
    <g>
      {/* Wooden Staff Shaft */}
      <path d="M330 160 L345 520 L355 520 L340 160 Z" fill="url(#woodStaff)" stroke="#451a03" strokeWidth="1.5" />
      {/* Staff Wooden Crown Cradle */}
      <path d="M320 170 C310 140 330 110 345 110 C360 110 380 140 370 170 C355 180 335 180 320 170 Z" fill="url(#woodStaff)" stroke="#451a03" strokeWidth="2" />
      {/* GLOWING EMERALD ORB OF HEALING */}
      <circle cx="345" cy="135" r="24" fill="url(#emeraldOrb)" filter="url(#emeraldGlow)" />
      <circle cx="340" cy="130" r="10" fill="#ecfdf5" opacity="0.9" filter="url(#emeraldGlow)" />
    </g>

    {/* RIGHT ARM (Grasping Pilgrim Staff) */}
    <path d="M420 230 C380 245 350 270 345 285 L360 295 C370 280 395 260 425 250 Z" fill="#ffedd5" />
    {/* Emerald Sleeve */}
    <path d="M430 225 L380 270 L395 285 L445 240 Z" fill="url(#emeraldRobe)" stroke="#064e3b" strokeWidth="1.5" />
    {/* Gold Cuff */}
    <path d="M380 270 L370 280 L385 295 L395 285 Z" fill="url(#goldTrim)" />
    {/* Hand Grasping Staff */}
    <circle cx="348" cy="285" r="10" fill="#ffedd5" stroke="#9a3412" strokeWidth="1" />

    {/* LEFT ARM & HEALING ELIXIR VIAL (Held with Care) */}
    <path d="M540 230 C565 245 580 270 560 300 L545 290 C560 270 550 255 530 245 Z" fill="#ffedd5" />
    {/* Emerald Sleeve */}
    <path d="M530 225 L575 270 L560 285 L515 240 Z" fill="url(#emeraldRobe)" stroke="#064e3b" strokeWidth="1.5" />
    {/* Gold Cuff */}
    <path d="M575 270 L585 280 L570 295 L560 285 Z" fill="url(#goldTrim)" />
    {/* Hand Cupping Vial */}
    <circle cx="550" cy="290" r="9" fill="#ffedd5" stroke="#9a3412" strokeWidth="1" />

    {/* Glowing Elixir Flask */}
    <g transform="translate(545, 260)">
      {/* Cork / Stopper */}
      <rect x="-4" y="0" width="8" height="5" rx="1" fill="#78350f" />
      {/* Glass Neck & Flask Body */}
      <path d="M-3 5 L3 5 L6 14 C12 20 12 30 5 36 C-2 40 -8 40 -15 36 C-22 30 -22 20 -16 14 Z" fill="url(#elixirGlow)" stroke="#ffffff" strokeWidth="1.5" filter="url(#emeraldGlow)" />
      {/* Inner Glowing Elixir Liquid */}
      <circle cx="-5" cy="26" r="8" fill="#10b981" filter="url(#emeraldGlow)" />
      <circle cx="-6" cy="24" r="3" fill="#ffffff" />
    </g>

    {/* LEGS & GOLDEN GLADIATOR SANDALS (Walking Forward Stance) */}
    <path d="M450 420 L445 490 L460 490 L465 420 Z" fill="#ffedd5" />
    <path d="M500 420 L505 490 L520 490 L515 420 Z" fill="#ffedd5" />
    {/* Golden Strapped Sandals */}
    <g stroke="url(#goldTrim)" strokeWidth="2">
      <line x1="445" y1="440" x2="463" y2="440" />
      <line x1="445" y1="460" x2="463" y2="460" />
      <line x1="445" y1="480" x2="463" y2="480" />
      <polygon points="440,490 465,490 460,505 435,505" fill="url(#goldTrim)" />

      <line x1="503" y1="440" x2="520" y2="440" />
      <line x1="503" y1="460" x2="520" y2="460" />
      <line x1="503" y1="480" x2="520" y2="480" />
      <polygon points="500,490 525,490 520,505 495,505" fill="url(#goldTrim)" />
    </g>

    {/* RAPHAEL'S NOBLE, COMPASSIONATE FACE & CHESTNUT HAIR */}
    <path
      d="M455 150 C445 170 445 195 460 215 C470 228 490 228 500 215 C515 195 515 170 505 150 Z"
      fill="#ffedd5"
      stroke="#c2410c"
      strokeWidth="1"
    />
    <path d="M465 185 Q475 195 480 205 Q485 195 495 185" stroke="#9a3412" strokeWidth="1.5" fill="none" />
    <ellipse cx="468" cy="178" rx="5" ry="3" fill="#047857" />
    <circle cx="467" cy="177" r="1.5" fill="#ffffff" />
    <ellipse cx="492" cy="178" rx="5" ry="3" fill="#047857" />
    <circle cx="491" cy="177" r="1.5" fill="#ffffff" />
    <path d="M462 173 Q470 170 476 174" stroke="#451a03" strokeWidth="2" fill="none" />
    <path d="M484 174 Q490 170 498 173" stroke="#451a03" strokeWidth="2" fill="none" />
    <path d="M480 178 L478 195 L483 196" stroke="#9a3412" strokeWidth="1.5" fill="none" />
    <path d="M472 206 Q480 212 488 206" stroke="#b91c1c" strokeWidth="1.5" fill="none" />

    {/* CHESTNUT HAIR LOCKS */}
    <path d="M440 145 C420 165 410 195 385 220 C405 215 425 190 440 170 Z" fill="url(#chestnutHair)" />
    <path d="M520 145 C540 165 550 195 575 220 C555 215 535 190 520 170 Z" fill="url(#chestnutHair)" />
    <path d="M450 145 C470 140 490 140 510 145 C495 135 465 135 450 145 Z" fill="url(#chestnutHair)" />
  </svg>
);

const LOCAL_STORAGE_RAPHAEL_KEY = 'archangel_raphael_custom_photo';
const EVENT_RAPHAEL_PHOTO_CHANGED = 'archangel_raphael_photo_updated';

export const ArchangelRaphaelArtwork: React.FC<ArchangelRaphaelArtworkProps> = ({
  variant = 'card-banner',
  className = '',
  allowZoom = true,
  showCaption = true,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [customPhoto, setCustomPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_RAPHAEL_KEY) || null;
    } catch {
      return null;
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_RAPHAEL_KEY);
        setCustomPhoto(stored || null);
      } catch {
        // ignore
      }
    };

    window.addEventListener(EVENT_RAPHAEL_PHOTO_CHANGED, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(EVENT_RAPHAEL_PHOTO_CHANGED, handleUpdate);
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
          localStorage.setItem(LOCAL_STORAGE_RAPHAEL_KEY, result);
          setCustomPhoto(result);
          window.dispatchEvent(new Event(EVENT_RAPHAEL_PHOTO_CHANGED));
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
      localStorage.removeItem(LOCAL_STORAGE_RAPHAEL_KEY);
      setCustomPhoto(null);
      window.dispatchEvent(new Event(EVENT_RAPHAEL_PHOTO_CHANGED));
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
        className={`group relative overflow-hidden rounded-2xl border border-emerald-400/50 bg-slate-950 shadow-xl select-none transition-all duration-300 hover:border-emerald-300 hover:shadow-emerald-500/20 ${
          allowZoom ? 'cursor-pointer' : ''
        } ${containerStyles[variant]} ${className}`}
      >
        {/* Sacred Image or SVG Vector Graphic */}
        <div className="relative h-full w-full overflow-hidden bg-slate-950 flex items-center justify-center">
          {customPhoto ? (
            <img
              src={customPhoto}
              alt="Archangel Raphael Exact Portrait"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <RaphaelSvgArtwork />
          )}

          {/* Vignette & Ambient Radial Glow Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
        </div>

        {/* Badges & Overlays */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center space-x-1.5 pointer-events-none">
          <span className="rounded-md bg-slate-950/80 px-2 py-0.5 text-[9px] font-bold tracking-wider text-emerald-300 border border-emerald-400/40 backdrop-blur-xs flex items-center space-x-1 shadow-md">
            <HeartPulse className="h-3 w-3 text-emerald-400" />
            <span>ARCHANGEL RAPHAEL</span>
          </span>
          <span className="rounded-md bg-emerald-950/80 px-2 py-0.5 text-[9px] font-bold text-emerald-200 border border-emerald-500/40 backdrop-blur-xs hidden sm:inline-flex items-center space-x-1 shadow-md">
            <Compass className="h-3 w-3 text-emerald-300" />
            <span>Emerald Staff & Healing Elixir</span>
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
            className="rounded-lg bg-slate-950/80 p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-600/60 border border-emerald-400/50 opacity-80 group-hover:opacity-100 transition-opacity backdrop-blur-xs shadow-md"
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
              className="rounded-lg bg-slate-950/80 p-1.5 text-purple-300 hover:text-emerald-300 border border-purple-800/60 opacity-80 group-hover:opacity-100 transition-opacity backdrop-blur-xs shadow-md"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Bottom Sacred Legend / Caption */}
        {showCaption && (
          <div className="absolute bottom-2 inset-x-2 z-10 flex items-center justify-between rounded-xl bg-slate-950/85 px-3 py-1.5 border border-purple-900/60 backdrop-blur-xs text-[10px] text-purple-200">
            <div className="flex items-center space-x-1.5 font-medium text-emerald-200 truncate">
              <Sparkles className="h-3 w-3 text-emerald-400 shrink-0" />
              <span className="truncate">
                {customPhoto ? 'Custom Exact Portrait Active' : 'Divine Physician & Guardian of Safe Journeys'}
              </span>
            </div>
            <span className="text-[9px] text-purple-300/80 shrink-0 pl-2">
              {customPhoto ? 'Click to inspect / change' : 'Click to inspect or upload photo'}
            </span>
          </div>
        )}
      </div>

      {/* Lightbox / Zoom Modal for Archangel Raphael Sacred Iconography */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full overflow-hidden rounded-3xl border-2 border-emerald-400/50 bg-slate-950 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-purple-900/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                  <HeartPulse className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Sacred Archangel Portrait & Iconography</span>
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-100 mt-0.5">
                  Archangel Raphael - Supreme Healer of Body, Heart & Soul
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
            <div className="relative overflow-hidden rounded-2xl border border-emerald-400/30 bg-black shadow-2xl">
              <div className="h-64 sm:h-80 md:h-96 w-full flex items-center justify-center overflow-hidden">
                {customPhoto ? (
                  <img
                    src={customPhoto}
                    alt="Archangel Raphael Exact Portrait"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <RaphaelSvgArtwork />
                )}
              </div>
            </div>

            {/* Image Source Controls & Exact Photo Loader */}
            <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-4 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-300">
                  <ImageIcon className="h-4 w-4 text-emerald-400" />
                  <span>Exact Photo Settings:</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md hover:from-emerald-400 hover:to-teal-500 transition-all"
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
                You can select your uploaded file (<span className="text-emerald-300 font-mono text-[10px]">Picsart_26-08-18_20-04-25-177.jpg</span>) or any high-res image directly from your device. It is saved locally and applies across every Archangel Raphael card pull and the Temple tab automatically!
              </p>
            </div>

            {/* Iconography Description & Attributes Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 space-y-1">
                <div className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
                  <HeartPulse className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Pilgrim Staff & Emerald Orb:</span>
                </div>
                <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                  Channels vital life force and celestial restoration, clearing physical pain and spiritual blocks.
                </p>
              </div>

              <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-3 space-y-1">
                <div className="text-xs font-bold text-teal-300 flex items-center space-x-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
                  <span>Healing Elixir & Caduceus:</span>
                </div>
                <p className="text-[11px] text-teal-100/90 leading-relaxed">
                  Sacred medicinal remedy restoring cellular health, emotional equilibrium, and nervous system peace.
                </p>
              </div>

              <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 space-y-1">
                <div className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                  <Feather className="h-3.5 w-3.5 text-purple-400" />
                  <span>Prismatic Wings & Cathedral:</span>
                </div>
                <p className="text-[11px] text-purple-100/90 leading-relaxed">
                  Sanctuary of peace and safe passage for travelers, healers, and all seeking physical wholeness.
                </p>
              </div>
            </div>

            {/* Sacred Inscription */}
            <div className="rounded-2xl border border-purple-900/50 bg-slate-900/80 p-3.5 text-center text-xs font-serif italic text-emerald-200/90">
              "Archangel Raphael holds the pilgrim staff of life and the glowing elixir of divine healing, wrapping your body and soul in miraculous emerald light."
            </div>
          </div>
        </div>
      )}
    </>
  );
};
