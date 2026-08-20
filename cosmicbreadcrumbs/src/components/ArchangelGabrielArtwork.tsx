import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Maximize2, Feather, X, Upload, RotateCcw, Image as ImageIcon, BookOpen, Sun, Star } from 'lucide-react';

interface ArchangelGabrielArtworkProps {
  variant?: 'card-banner' | 'temple-featured' | 'compact' | 'hero';
  className?: string;
  allowZoom?: boolean;
  showCaption?: boolean;
}

export const GabrielSvgArtwork: React.FC = () => (
  <svg
    viewBox="0 0 960 540"
    className="h-full w-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Celestial Rainbow Sky Gradient */}
      <radialGradient id="gabrielSkyGlow" cx="50%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="18%" stopColor="#fed7aa" stopOpacity="0.9" />
        <stop offset="38%" stopColor="#60a5fa" stopOpacity="0.75" />
        <stop offset="65%" stopColor="#312e81" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#090514" />
      </radialGradient>

      {/* Sunburst Halo of Revelation */}
      <radialGradient id="gabrielHalo" cx="50%" cy="26%" r="42%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="25%" stopColor="#fef08a" stopOpacity="0.95" />
        <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
      </radialGradient>

      {/* Silver-White Celestial Hair Gradient */}
      <linearGradient id="silverHair" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="35%" stopColor="#f1f5f9" />
        <stop offset="70%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>

      {/* Radiant Gold Scepter & Armor Trim */}
      <linearGradient id="gabrielGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="25%" stopColor="#fef08a" />
        <stop offset="55%" stopColor="#eab308" />
        <stop offset="85%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>

      {/* Royal Sapphire Mantle */}
      <linearGradient id="gabrielBlue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#93c5fd" />
        <stop offset="35%" stopColor="#2563eb" />
        <stop offset="75%" stopColor="#1d4ed8" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>

      {/* Parchment Scroll */}
      <linearGradient id="scrollParchment" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#fef3c7" />
        <stop offset="75%" stopColor="#fde68a" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>

      {/* Crystal Prisms */}
      <linearGradient id="crystalPrism" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="35%" stopColor="#bae6fd" stopOpacity="0.85" />
        <stop offset="70%" stopColor="#e0e7ff" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.6" />
      </linearGradient>

      {/* Soft Cloud Gradient */}
      <linearGradient id="gabrielClouds" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="45%" stopColor="#e0e7ff" stopOpacity="0.65" />
        <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
      </linearGradient>

      <filter id="gabrielGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="7" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Background Sky */}
    <rect width="960" height="540" fill="url(#gabrielSkyGlow)" />

    {/* Radiant Rainbow Solar Rays of Light */}
    <g opacity="0.6" stroke="#fef08a" strokeWidth="2">
      <line x1="480" y1="140" x2="60" y2="10" strokeWidth="3" opacity="0.4" />
      <line x1="480" y1="140" x2="180" y2="-20" strokeWidth="4" opacity="0.6" />
      <line x1="480" y1="140" x2="340" y2="-40" strokeWidth="5" opacity="0.7" />
      <line x1="480" y1="140" x2="480" y2="-50" strokeWidth="6" opacity="0.8" />
      <line x1="480" y1="140" x2="620" y2="-40" strokeWidth="5" opacity="0.7" />
      <line x1="480" y1="140" x2="780" y2="-20" strokeWidth="4" opacity="0.6" />
      <line x1="480" y1="140" x2="900" y2="10" strokeWidth="3" opacity="0.4" />
    </g>

    {/* Halo of Divine Revelation */}
    <circle cx="480" cy="140" r="165" fill="url(#gabrielHalo)" filter="url(#gabrielGlow)" />
    <circle cx="480" cy="140" r="75" fill="#fffbeb" opacity="0.95" filter="url(#gabrielGlow)" />

    {/* LEFT WING WITH HANGING CRYSTAL PRISMS */}
    <g>
      <path
        d="M440 170 C350 70 200 15 20 40 C-30 45 0 95 100 125 C10 115 30 165 130 175 C30 170 60 225 160 225 C60 225 100 285 200 275 C110 290 150 345 240 325 C180 350 230 405 310 365 C270 395 330 435 390 385 C420 345 440 255 440 190 Z"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />
      {/* Wing Feathers Texture */}
      <path d="M430 160 C320 90 170 70 40 55" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M425 175 C320 120 190 120 120 135" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M420 190 C330 160 220 170 150 195" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M410 210 C330 210 240 220 190 250" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" />

      {/* Hanging Crystal Prisms on Left Wing */}
      {/* Prism 1 (Far Left) */}
      <line x1="40" y1="210" x2="40" y2="250" stroke="#fde047" strokeWidth="1.5" opacity="0.8" />
      <polygon points="40,245 48,275 40,310 32,275" fill="url(#crystalPrism)" stroke="#ffffff" strokeWidth="1" filter="url(#gabrielGlow)" />

      {/* Prism 2 */}
      <line x1="100" y1="250" x2="100" y2="290" stroke="#fde047" strokeWidth="1.5" opacity="0.8" />
      <polygon points="100,285 108,315 100,350 92,315" fill="url(#crystalPrism)" stroke="#ffffff" strokeWidth="1" filter="url(#gabrielGlow)" />

      {/* Prism 3 */}
      <line x1="170" y1="280" x2="170" y2="320" stroke="#fde047" strokeWidth="1.5" opacity="0.8" />
      <polygon points="170,315 178,345 170,380 162,345" fill="url(#crystalPrism)" stroke="#ffffff" strokeWidth="1" filter="url(#gabrielGlow)" />

      {/* Prism 4 */}
      <line x1="245" y1="330" x2="245" y2="370" stroke="#fde047" strokeWidth="1.5" opacity="0.8" />
      <polygon points="245,365 253,395 245,430 237,395" fill="url(#crystalPrism)" stroke="#ffffff" strokeWidth="1" filter="url(#gabrielGlow)" />
    </g>

    {/* RIGHT WING WITH HANGING CRYSTAL PRISMS */}
    <g>
      <path
        d="M520 170 C610 70 760 15 940 40 C990 45 960 95 860 125 C950 115 930 165 830 175 C930 170 900 225 800 225 C900 225 860 285 760 275 C850 290 810 345 720 325 C780 350 730 405 650 365 C690 395 630 435 570 385 C540 345 520 255 520 190 Z"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />
      {/* Wing Feathers Texture */}
      <path d="M530 160 C640 90 790 70 920 55" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M535 175 C640 120 770 120 840 135" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M540 190 C630 160 740 170 810 195" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M550 210 C630 210 720 220 770 250" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" />

      {/* Hanging Crystal Prisms on Right Wing */}
      {/* Prism 1 (Far Right) */}
      <line x1="920" y1="210" x2="920" y2="250" stroke="#fde047" strokeWidth="1.5" opacity="0.8" />
      <polygon points="920,245 928,275 920,310 912,275" fill="url(#crystalPrism)" stroke="#ffffff" strokeWidth="1" filter="url(#gabrielGlow)" />

      {/* Prism 2 */}
      <line x1="860" y1="250" x2="860" y2="290" stroke="#fde047" strokeWidth="1.5" opacity="0.8" />
      <polygon points="860,285 868,315 860,350 852,315" fill="url(#crystalPrism)" stroke="#ffffff" strokeWidth="1" filter="url(#gabrielGlow)" />

      {/* Prism 3 */}
      <line x1="790" y1="280" x2="790" y2="320" stroke="#fde047" strokeWidth="1.5" opacity="0.8" />
      <polygon points="790,315 798,345 790,380 782,345" fill="url(#crystalPrism)" stroke="#ffffff" strokeWidth="1" filter="url(#gabrielGlow)" />

      {/* Prism 4 */}
      <line x1="715" y1="330" x2="715" y2="370" stroke="#fde047" strokeWidth="1.5" opacity="0.8" />
      <polygon points="715,365 723,395 715,430 707,395" fill="url(#crystalPrism)" stroke="#ffffff" strokeWidth="1" filter="url(#gabrielGlow)" />
    </g>

    {/* GABRIEL'S FLOWING SILVER HAIR (Back Layers) */}
    <path
      d="M440 140 C400 150 340 180 300 240 C290 260 310 270 325 250 C350 210 400 180 440 170 Z"
      fill="url(#silverHair)"
    />
    <path
      d="M520 140 C560 150 620 180 660 240 C670 260 650 270 635 250 C610 210 560 180 520 170 Z"
      fill="url(#silverHair)"
    />

    {/* TORSO & ROYAL BLUE / GOLD CUIRASS */}
    <path d="M455 170 L455 210 L505 210 L505 170 Z" fill="#ffedd5" />
    <path d="M410 220 C420 190 455 190 470 205 L490 205 C505 190 540 190 550 220 L535 270 L425 270 Z" fill="url(#gabrielBlue)" stroke="#1e3a8a" strokeWidth="2" />
    {/* Gold Collar Gorget */}
    <path d="M450 205 C470 220 490 220 510 205 L525 240 C490 260 470 260 435 240 Z" fill="url(#gabrielGold)" stroke="#78350f" strokeWidth="1.5" />

    {/* GOLDEN STAR SCEPTER / WAND (Held in Right Hand, pointing diagonally) */}
    <g>
      {/* Scepter Shaft */}
      <line x1="330" y1="220" x2="630" y2="340" stroke="url(#gabrielGold)" strokeWidth="6" strokeLinecap="round" filter="url(#gabrielGlow)" />
      {/* Scepter Star Head */}
      <g transform="translate(330, 220)">
        <polygon points="0,-22 6,-6 22,0 6,6 0,22 -6,6 -22,0 -6,-6" fill="#fef08a" stroke="#d97706" strokeWidth="2" filter="url(#gabrielGlow)" />
        <circle cx="0" cy="0" r="7" fill="#ffffff" filter="url(#gabrielGlow)" />
      </g>
    </g>

    {/* WHITE LILY FLOWER (Held gracefully) */}
    <g transform="translate(525, 220)">
      {/* Stem & Leaves */}
      <path d="M-5 25 Q15 65 30 110" stroke="#15803d" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M5 50 Q30 45 45 60 Q30 75 10 58" fill="#16a34a" />
      {/* Lily Petals (Pure White) */}
      <path d="M0 0 C-20 -30 -40 0 -10 15 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" filter="url(#gabrielGlow)" />
      <path d="M0 0 C20 -30 40 0 10 15 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" filter="url(#gabrielGlow)" />
      <path d="M0 0 C0 -40 10 -40 0 -5 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" filter="url(#gabrielGlow)" />
      <path d="M0 0 C-35 -10 -30 20 -5 15 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
      <path d="M0 0 C35 -10 30 20 5 15 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
      {/* Lily Pistil & Stamen */}
      <circle cx="0" cy="0" r="4" fill="#eab308" />
    </g>

    {/* SACRED SCROLL WITH ALL-SEEING EYE (Held in Left Hand) */}
    <g transform="translate(560, 230) rotate(8)">
      {/* Scroll Roll Top */}
      <path d="M0 0 L110 0 C118 0 118 16 110 16 L0 16 C-8 16 -8 0 0 0 Z" fill="url(#gabrielGold)" stroke="#78350f" strokeWidth="2" />
      {/* Unfurled Parchment Body */}
      <path d="M5 16 L105 16 L115 130 C70 145 40 115 0 130 Z" fill="url(#scrollParchment)" stroke="#b45309" strokeWidth="2" filter="url(#gabrielGlow)" />
      {/* All-Seeing Eye Iconography on Scroll */}
      <g transform="translate(55, 65)">
        <path d="M-28 0 Q0 -20 28 0 Q0 20 -28 0 Z" fill="#ffffff" stroke="#451a03" strokeWidth="2" />
        <circle cx="0" cy="0" r="9" fill="#1e3a8a" />
        <circle cx="0" cy="0" r="4" fill="#020617" />
        <circle cx="-2" cy="-2" r="1.5" fill="#ffffff" />
        {/* Eye Radiant Rays */}
        <line x1="0" y1="-22" x2="0" y2="-28" stroke="#b45309" strokeWidth="1.5" />
        <line x1="-16" y1="-16" x2="-22" y2="-22" stroke="#b45309" strokeWidth="1.5" />
        <line x1="16" y1="-16" x2="22" y2="-22" stroke="#b45309" strokeWidth="1.5" />
      </g>
      {/* Celestial Calligraphy inscription */}
      <path d="M20 100 Q40 95 60 100 Q80 95 95 100" stroke="#78350f" strokeWidth="1.5" fill="none" />
      <path d="M25 112 Q50 108 85 112" stroke="#78350f" strokeWidth="1.5" fill="none" />
      {/* Scroll Roll Bottom */}
      <path d="M-5 130 L115 130 C122 130 122 144 115 144 L-5 144 C-12 144 -12 130 -5 130 Z" fill="url(#gabrielGold)" stroke="#78350f" strokeWidth="2" />
    </g>

    {/* RIGHT ARM (Hand raised to forehead / third eye) */}
    <path d="M420 230 C390 220 370 180 430 145 C440 140 445 155 435 160 C395 185 410 215 430 225 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1" />
    {/* Gold Vambrace */}
    <path d="M390 190 L375 165 L395 155 L410 180 Z" fill="url(#gabrielGold)" stroke="#78350f" strokeWidth="1.5" />
    {/* Hand touching temple / third eye */}
    <circle cx="438" cy="148" r="8" fill="#ffedd5" stroke="#9a3412" strokeWidth="1" />

    {/* LEFT ARM (Holding Scroll) */}
    <path d="M540 230 C565 240 590 250 600 240 L590 260 C570 270 545 255 530 245 Z" fill="#ffedd5" />
    <path d="M570 235 L600 245 L590 265 L560 255 Z" fill="url(#gabrielGold)" stroke="#78350f" strokeWidth="1.5" />
    <circle cx="600" cy="245" r="10" fill="#ffedd5" stroke="#9a3412" strokeWidth="1" />

    {/* ROYAL BLUE FLOWING KILT / TUNIC & GOLDEN GREAVES */}
    <path d="M430 270 C400 320 340 370 300 410 C360 425 430 400 470 390 C500 410 580 425 660 400 C620 360 580 320 540 270 Z" fill="url(#gabrielBlue)" stroke="#1e3a8a" strokeWidth="2" />
    {/* Gold stars & filigree */}
    <g fill="#fde047">
      <circle cx="350" cy="405" r="3" />
      <circle cx="390" cy="400" r="3.5" />
      <circle cx="440" cy="390" r="3" />
      <circle cx="480" cy="395" r="3.5" />
      <circle cx="530" cy="405" r="3" />
      <circle cx="580" cy="395" r="3.5" />
    </g>

    {/* LEGS & GOLDEN GREAVES (Floating Hover Stance) */}
    {/* Thighs */}
    <path d="M440 320 C410 360 400 400 415 440 L450 400 Z" fill="#ffedd5" />
    <path d="M520 320 C550 360 560 400 545 440 L510 400 Z" fill="#ffedd5" />
    {/* Golden Greaves */}
    <path d="M405 400 L395 470 C415 480 440 475 450 455 L445 400 Z" fill="url(#gabrielGold)" stroke="#78350f" strokeWidth="2" />
    <path d="M555 400 L565 470 C545 480 520 475 510 455 L515 400 Z" fill="url(#gabrielGold)" stroke="#78350f" strokeWidth="2" />

    {/* GABRIEL'S NOBLE FACE & JEWELED CELESTIAL TIARA */}
    {/* Face Contour */}
    <path d="M455 130 C445 150 445 175 460 195 C470 208 490 208 500 195 C515 175 515 150 505 130 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1" />
    {/* Features */}
    <path d="M465 165 Q475 175 480 185 Q485 175 495 165" stroke="#9a3412" strokeWidth="1.5" fill="none" />
    <ellipse cx="468" cy="158" rx="5" ry="3" fill="#1e3a8a" />
    <circle cx="467" cy="157" r="1.5" fill="#ffffff" />
    <ellipse cx="492" cy="158" rx="5" ry="3" fill="#1e3a8a" />
    <circle cx="491" cy="157" r="1.5" fill="#ffffff" />
    <path d="M462 153 Q470 150 476 154" stroke="#64748b" strokeWidth="2" fill="none" />
    <path d="M484 154 Q490 150 498 153" stroke="#64748b" strokeWidth="2" fill="none" />
    <path d="M480 158 L478 175 L483 176" stroke="#9a3412" strokeWidth="1.5" fill="none" />
    <path d="M472 186 Q480 190 488 186" stroke="#7c2d12" strokeWidth="1.5" fill="none" />

    {/* Jeweled Celestial Circlet / Tiara */}
    <path d="M450 135 C470 130 490 130 510 135 L508 145 C490 140 470 140 452 145 Z" fill="url(#gabrielGold)" stroke="#78350f" strokeWidth="1.5" />
    <polygon points="480,123 485,133 480,140 475,133" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" filter="url(#gabrielGlow)" />

    {/* FLOWING SILVER HAIR (Front locks) */}
    <path d="M440 130 C420 150 405 180 380 205 C400 200 425 175 440 155 Z" fill="url(#silverHair)" />
    <path d="M520 130 C540 150 555 180 580 205 C560 200 535 175 520 155 Z" fill="url(#silverHair)" />

    {/* QUARTZ CRYSTAL CLUSTERS AT FEET */}
    <g transform="translate(420, 420)">
      <polygon points="60,30 80,-30 100,30 80,120" fill="url(#crystalPrism)" stroke="#ffffff" strokeWidth="1.5" filter="url(#gabrielGlow)" />
      <polygon points="20,50 40,-10 60,50 40,120" fill="url(#crystalPrism)" stroke="#ffffff" strokeWidth="1.5" filter="url(#gabrielGlow)" />
      <polygon points="90,60 110,0 130,60 110,120" fill="url(#crystalPrism)" stroke="#ffffff" strokeWidth="1.5" filter="url(#gabrielGlow)" />
      <polygon points="-10,80 10,20 30,80 10,120" fill="url(#crystalPrism)" stroke="#ffffff" strokeWidth="1.5" filter="url(#gabrielGlow)" />
    </g>

    {/* HEAVENLY BILLOWING CLOUDS */}
    <path
      d="M-40 540 C20 460 120 440 190 470 C260 430 360 430 420 480 C480 440 580 440 650 480 C720 430 840 440 920 490 C980 450 1020 500 1020 540 Z"
      fill="url(#gabrielClouds)"
    />
    <path
      d="M0 540 C80 480 180 480 260 510 C340 470 450 480 520 520 C600 480 720 490 800 520 C880 480 960 500 1000 540 Z"
      fill="#ffffff"
      opacity="0.5"
    />
  </svg>
);

const LOCAL_STORAGE_GABRIEL_KEY = 'archangel_gabriel_custom_photo';
const EVENT_GABRIEL_PHOTO_CHANGED = 'archangel_gabriel_photo_updated';

export const ArchangelGabrielArtwork: React.FC<ArchangelGabrielArtworkProps> = ({
  variant = 'card-banner',
  className = '',
  allowZoom = true,
  showCaption = true,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [customPhoto, setCustomPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_GABRIEL_KEY) || null;
    } catch {
      return null;
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_GABRIEL_KEY);
        setCustomPhoto(stored || null);
      } catch {
        // ignore
      }
    };

    window.addEventListener(EVENT_GABRIEL_PHOTO_CHANGED, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(EVENT_GABRIEL_PHOTO_CHANGED, handleUpdate);
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
          localStorage.setItem(LOCAL_STORAGE_GABRIEL_KEY, result);
          setCustomPhoto(result);
          window.dispatchEvent(new Event(EVENT_GABRIEL_PHOTO_CHANGED));
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
      localStorage.removeItem(LOCAL_STORAGE_GABRIEL_KEY);
      setCustomPhoto(null);
      window.dispatchEvent(new Event(EVENT_GABRIEL_PHOTO_CHANGED));
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
        className={`group relative overflow-hidden rounded-2xl border border-amber-300/50 bg-slate-950 shadow-xl select-none transition-all duration-300 hover:border-amber-200 hover:shadow-amber-400/20 ${
          allowZoom ? 'cursor-pointer' : ''
        } ${containerStyles[variant]} ${className}`}
      >
        {/* Sacred Image or SVG Vector Graphic */}
        <div className="relative h-full w-full overflow-hidden bg-slate-950 flex items-center justify-center">
          {customPhoto ? (
            <img
              src={customPhoto}
              alt="Archangel Gabriel Exact Portrait"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <GabrielSvgArtwork />
          )}

          {/* Vignette & Ambient Radial Glow Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
        </div>

        {/* Badges & Overlays */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center space-x-1.5 pointer-events-none">
          <span className="rounded-md bg-slate-950/80 px-2 py-0.5 text-[9px] font-bold tracking-wider text-amber-200 border border-amber-300/40 backdrop-blur-xs flex items-center space-x-1 shadow-md">
            <Sun className="h-3 w-3 text-amber-300" />
            <span>ARCHANGEL GABRIEL</span>
          </span>
          <span className="rounded-md bg-indigo-950/80 px-2 py-0.5 text-[9px] font-bold text-indigo-200 border border-indigo-500/40 backdrop-blur-xs hidden sm:inline-flex items-center space-x-1 shadow-md">
            <BookOpen className="h-3 w-3 text-amber-300" />
            <span>Sacred Scroll & White Lily</span>
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
            className="rounded-lg bg-slate-950/80 p-1.5 text-amber-300 hover:text-white hover:bg-amber-600/60 border border-amber-400/50 opacity-80 group-hover:opacity-100 transition-opacity backdrop-blur-xs shadow-md"
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
              <Sparkles className="h-3 w-3 text-amber-300 shrink-0" />
              <span className="truncate">
                {customPhoto ? 'Custom Exact Portrait Active' : 'Herald of Light & Sacred Divine Revelation'}
              </span>
            </div>
            <span className="text-[9px] text-purple-300/80 shrink-0 pl-2">
              {customPhoto ? 'Click to inspect / change' : 'Click to inspect or upload photo'}
            </span>
          </div>
        )}
      </div>

      {/* Lightbox / Zoom Modal for Archangel Gabriel Sacred Iconography */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full overflow-hidden rounded-3xl border-2 border-amber-300/50 bg-slate-950 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-purple-900/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center space-x-1.5">
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>Sacred Archangel Portrait & Iconography</span>
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-100 mt-0.5">
                  Archangel Gabriel - Angel of Revelation & Divine Voice
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
            <div className="relative overflow-hidden rounded-2xl border border-amber-300/30 bg-black shadow-2xl">
              <div className="h-64 sm:h-80 md:h-96 w-full flex items-center justify-center overflow-hidden">
                {customPhoto ? (
                  <img
                    src={customPhoto}
                    alt="Archangel Gabriel Exact Portrait"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <GabrielSvgArtwork />
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
                    className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md hover:from-amber-300 hover:to-amber-500 transition-all"
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
                You can select your uploaded file (<span className="text-amber-300 font-mono text-[10px]">Picsart_26-08-18_17-35-29-684.png</span>) or any high-res image directly from your device. It is saved locally and applies across every Archangel Gabriel card pull and the Temple tab automatically!
              </p>
            </div>

            {/* Iconography Description & Attributes Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 space-y-1">
                <div className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                  <Star className="h-3.5 w-3.5 text-amber-400" />
                  <span>Star Scepter & Forehead:</span>
                </div>
                <p className="text-[11px] text-amber-100/90 leading-relaxed">
                  Channeling divine foresight, telepathy, and prophetic clarity into your third eye.
                </p>
              </div>

              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 space-y-1">
                <div className="text-xs font-bold text-blue-300 flex items-center space-x-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                  <span>Sacred Scroll & Eye:</span>
                </div>
                <p className="text-[11px] text-blue-100/90 leading-relaxed">
                  Inscribed with cosmic truth, awakening authentic creative and spiritual expression.
                </p>
              </div>

              <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 space-y-1">
                <div className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                  <Feather className="h-3.5 w-3.5 text-purple-400" />
                  <span>Prism Wings & White Lily:</span>
                </div>
                <p className="text-[11px] text-purple-100/90 leading-relaxed">
                  Hanging crystal prisms refracting divine rainbow light of sacred rebirth and purity.
                </p>
              </div>
            </div>

            {/* Sacred Inscription */}
            <div className="rounded-2xl border border-purple-900/50 bg-slate-900/80 p-3.5 text-center text-xs font-serif italic text-amber-200/90">
              "Archangel Gabriel holds the sacred scroll of truth and white lily of rebirth, guiding you to speak, create, and shine with divine certainty."
            </div>
          </div>
        </div>
      )}
    </>
  );
};
