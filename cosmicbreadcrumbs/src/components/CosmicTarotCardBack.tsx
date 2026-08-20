import React, { useState, useEffect, useId } from 'react';

interface CosmicTarotCardBackProps {
  className?: string;
}

export const CosmicTarotCardBack: React.FC<CosmicTarotCardBackProps> = ({ className = '' }) => {
  const uid = useId().replace(/:/g, '');
  const [customImage, setCustomImage] = useState<string | null>(() => {
    return localStorage.getItem('cosmic_custom_tarot_back_image');
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setCustomImage(localStorage.getItem('cosmic_custom_tarot_back_image'));
    };
    window.addEventListener('custom-card-back-updated', handleStorageChange);
    return () => window.removeEventListener('custom-card-back-updated', handleStorageChange);
  }, []);

  if (customImage) {
    return (
      <div className={`relative h-full w-full overflow-hidden rounded-2xl bg-[#060714] ${className}`}>
        <img
          src={customImage}
          alt="Cosmic Breadcrumbs Tarot Card Back"
          className="h-full w-full object-cover object-center rounded-2xl"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 rounded-2xl border-2 border-amber-400/60 pointer-events-none shadow-inner" />
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full overflow-hidden rounded-2xl bg-[#060515] select-none ${className}`}>
      {/* SVG Canvas rendering the exact authentic Cosmic Breadcrumbs card back */}
      <svg
        viewBox="0 0 400 620"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full object-cover object-center"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Deep Celestial Cosmic Nebula Gradients */}
          <radialGradient id={`nebulaGlow1-${uid}`} cx="20%" cy="25%" r="55%">
            <stop offset="0%" stopColor="#31104e" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#17123a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#060515" stopOpacity="0" />
          </radialGradient>

          {/* Top-Right Spiral Galaxy Glow */}
          <radialGradient id={`galaxyCore-${uid}`} cx="78%" cy="18%" r="40%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="20%" stopColor="#f97316" stopOpacity="0.75" />
            <stop offset="45%" stopColor="#a855f7" stopOpacity="0.6" />
            <stop offset="75%" stopColor="#3b0764" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#060515" stopOpacity="0" />
          </radialGradient>

          {/* Bottom-Left Nebula Glow */}
          <radialGradient id={`nebulaBottom-${uid}`} cx="22%" cy="82%" r="45%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.6" />
            <stop offset="35%" stopColor="#6b21a8" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#1e1b4b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#060515" stopOpacity="0" />
          </radialGradient>

          {/* Center Medallion Golden Solar Flare Aura */}
          <radialGradient id={`solarHalo-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.25" />
            <stop offset="35%" stopColor="#fde047" stopOpacity="0.4" />
            <stop offset="65%" stopColor="#ca8a04" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Glowing Lens Flare Arcs (Top and Bottom of Center Wheel) */}
          <linearGradient id={`flareArcTop-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ca8a04" stopOpacity="0" />
            <stop offset="25%" stopColor="#fde047" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="75%" stopColor="#fde047" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
          </linearGradient>

          <linearGradient id={`flareArcBottom-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ca8a04" stopOpacity="0" />
            <stop offset="25%" stopColor="#fde047" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="75%" stopColor="#fde047" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
          </linearGradient>

          {/* Premium Metallic Antique Gold Gradients */}
          <linearGradient id={`goldMetallic-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="20%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#fde047" />
            <stop offset="70%" stopColor="#ca8a04" />
            <stop offset="90%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          <linearGradient id={`goldFrame-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#ca8a04" />
            <stop offset="50%" stopColor="#fde047" />
            <stop offset="75%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>

          {/* Gold Shimmer Drop Shadow Filter */}
          <filter id={`goldGlow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id={`solarGlow-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Base Dark Canvas */}
        <rect width="400" height="620" rx="16" fill="#060515" />

        {/* 2. Cosmic Nebula Background Clouds */}
        <rect width="400" height="620" rx="16" fill={`url(#nebulaGlow1-${uid})`} />
        <rect width="400" height="620" rx="16" fill={`url(#galaxyCore-${uid})`} />
        <rect width="400" height="620" rx="16" fill={`url(#nebulaBottom-${uid})`} />

        {/* 3. Top-Right Spiral Galaxy Artwork */}
        <g transform="translate(305, 115) rotate(-25)" opacity="0.85">
          {/* Outer spiral dust arms */}
          <ellipse cx="0" cy="0" rx="55" ry="22" fill="none" stroke="#fde047" strokeWidth="1.5" strokeOpacity="0.4" />
          <ellipse cx="0" cy="0" rx="42" ry="16" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeOpacity="0.35" />
          <ellipse cx="0" cy="0" rx="28" ry="11" fill="none" stroke="#a855f7" strokeWidth="3" strokeOpacity="0.45" />
          {/* Glowing central core */}
          <ellipse cx="0" cy="0" rx="14" ry="7" fill="#fef08a" filter={`url(#solarGlow-${uid})`} opacity="0.9" />
          <ellipse cx="0" cy="0" rx="6" ry="3" fill="#ffffff" />
        </g>

        {/* 4. Deep Starfield (Crisp Multi-Sized Stars) */}
        <g opacity="0.85">
          {[
            [35, 75], [55, 135], [85, 90], [110, 55], [140, 105], [165, 65],
            [235, 80], [265, 50], [315, 60], [355, 75], [375, 135],
            [40, 215], [75, 255], [335, 235], [365, 205],
            [35, 415], [68, 375], [325, 385], [360, 415],
            [35, 515], [75, 475], [105, 545], [135, 495], [165, 555],
            [235, 535], [265, 485], [305, 555], [335, 505], [368, 475],
            [90, 175], [315, 170], [85, 445], [315, 455],
            [50, 310], [350, 310], [150, 30], [250, 30], [150, 590], [250, 590]
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={i % 4 === 0 ? 1.5 : (i % 2 === 0 ? 1 : 0.75)} fill="#ffffff" opacity={0.6 + (i % 5) * 0.08} />
          ))}
        </g>

        {/* 5. Intricate Constellation Line Charts */}
        <g stroke={`url(#goldMetallic-${uid})`} strokeWidth="0.85" opacity="0.75">
          {/* Top Left Quadrant Constellations */}
          <line x1="35" y1="75" x2="85" y2="90" />
          <line x1="85" y1="90" x2="55" y2="135" />
          <line x1="55" y1="135" x2="110" y2="55" />
          <line x1="110" y1="55" x2="140" y2="105" />
          <line x1="85" y1="90" x2="90" y2="175" />
          <line x1="90" y1="175" x2="40" y2="215" />
          <line x1="40" y1="215" x2="75" y2="255" />

          {/* Top Right Quadrant Constellations */}
          <line x1="235" y1="80" x2="265" y2="50" />
          <line x1="265" y1="50" x2="315" y2="60" />
          <line x1="315" y1="60" x2="375" y2="135" />
          <line x1="375" y1="135" x2="355" y2="75" />
          <line x1="375" y1="135" x2="315" y2="170" />
          <line x1="315" y1="170" x2="365" y2="205" />
          <line x1="365" y1="205" x2="335" y2="235" />

          {/* Bottom Left Quadrant Constellations */}
          <line x1="35" y1="415" x2="68" y2="375" />
          <line x1="68" y1="375" x2="85" y2="445" />
          <line x1="85" y1="445" x2="35" y2="515" />
          <line x1="35" y1="515" x2="75" y2="475" />
          <line x1="75" y1="475" x2="105" y2="545" />
          <line x1="105" y1="545" x2="135" y2="495" />
          <line x1="135" y1="495" x2="85" y2="445" />

          {/* Bottom Right Quadrant Constellations */}
          <line x1="325" y1="385" x2="360" y2="415" />
          <line x1="360" y1="415" x2="315" y2="455" />
          <line x1="315" y1="455" x2="368" y2="475" />
          <line x1="368" y1="475" x2="335" y2="505" />
          <line x1="335" y1="505" x2="305" y2="555" />
          <line x1="305" y1="555" x2="265" y2="485" />
          <line x1="265" y1="485" x2="235" y2="535" />
        </g>

        {/* 6. Four-Point Star Flare Nodes on Constellation Vertices */}
        <g fill={`url(#goldMetallic-${uid})`}>
          {[
            [85, 90], [55, 135], [140, 105], [90, 175], [75, 255],
            [265, 50], [375, 135], [315, 170], [335, 235],
            [68, 375], [85, 445], [75, 475], [135, 495],
            [325, 385], [315, 455], [335, 505], [265, 485]
          ].map(([cx, cy], i) => (
            <g key={i} transform={`translate(${cx}, ${cy})`}>
              <circle r="2" fill="#ffffff" filter={`url(#goldGlow-${uid})`} />
              <path d="M0 -8 L1.5 -2.5 L7 0 L1.5 2.5 L0 8 L-1.5 2.5 L-7 0 L-1.5 -2.5 Z" fill={`url(#goldMetallic-${uid})`} opacity="0.95" />
            </g>
          ))}
        </g>

        {/* 7. Flanking Left & Right Crescent Moons with Stars */}
        {/* Left Flanking Crescent */}
        <g transform="translate(60, 310)" fill={`url(#goldMetallic-${uid})`} stroke={`url(#goldMetallic-${uid})`}>
          <path d="M-12 -16 A16 16 0 0 0 -12 16 A12 12 0 0 1 -12 -16 Z" strokeWidth="0.8" />
          <circle cx="8" cy="0" r="2.5" fill="#ffffff" filter={`url(#goldGlow-${uid})`} />
          <path d="M8 -7 L9.5 -2 L14 0 L9.5 2 L8 7 L6.5 2 L2 0 L6.5 -2 Z" strokeWidth="0.5" />
        </g>

        {/* Right Flanking Crescent */}
        <g transform="translate(340, 310)" fill={`url(#goldMetallic-${uid})`} stroke={`url(#goldMetallic-${uid})`}>
          <path d="M12 -16 A16 16 0 0 1 12 16 A12 12 0 0 0 12 -16 Z" strokeWidth="0.8" />
          <circle cx="-8" cy="0" r="2.5" fill="#ffffff" filter={`url(#goldGlow-${uid})`} />
          <path d="M-8 -7 L-6.5 -2 L-2 0 L-6.5 2 L-8 7 L-9.5 2 L-14 0 L-9.5 -2 Z" strokeWidth="0.5" />
        </g>

        {/* 8. Ornate Victorian Gold Filigree Borders */}
        <rect
          x="12"
          y="12"
          width="376"
          height="596"
          rx="14"
          stroke={`url(#goldFrame-${uid})`}
          strokeWidth="2.5"
          fill="none"
        />

        {/* Inset Dotted Line */}
        <rect
          x="20"
          y="20"
          width="360"
          height="580"
          rx="10"
          stroke={`url(#goldFrame-${uid})`}
          strokeWidth="1.2"
          strokeDasharray="4 2.5"
          fill="none"
          opacity="0.85"
        />

        {/* Baroque Corner Scrollwork Inlays */}
        <g stroke={`url(#goldMetallic-${uid})`} strokeWidth="1.4" fill="none" opacity="0.95">
          {/* Top-Left Corner */}
          <path d="M20 48 C32 48, 48 32, 48 20" />
          <path d="M20 60 C38 60, 60 38, 60 20" />
          <path d="M26 26 Q42 42 26 58" />
          <path d="M30 30 C38 22, 52 36, 42 46 C36 52, 22 38, 30 30 Z" fill={`url(#goldMetallic-${uid})`} fillOpacity="0.15" />
          <circle cx="36" cy="36" r="3" fill={`url(#goldMetallic-${uid})`} />

          {/* Top-Right Corner */}
          <path d="M380 48 C368 48, 352 32, 352 20" />
          <path d="M380 60 C362 60, 340 38, 340 20" />
          <path d="M374 26 Q358 42 374 58" />
          <path d="M370 30 C362 22, 348 36, 358 46 C364 52, 378 38, 370 30 Z" fill={`url(#goldMetallic-${uid})`} fillOpacity="0.15" />
          <circle cx="364" cy="36" r="3" fill={`url(#goldMetallic-${uid})`} />

          {/* Bottom-Left Corner */}
          <path d="M20 572 C32 572, 48 588, 48 600" />
          <path d="M20 560 C38 560, 60 582, 60 600" />
          <path d="M26 594 Q42 578 26 562" />
          <path d="M30 590 C38 598, 52 584, 42 574 C36 568, 22 582, 30 590 Z" fill={`url(#goldMetallic-${uid})`} fillOpacity="0.15" />
          <circle cx="36" cy="584" r="3" fill={`url(#goldMetallic-${uid})`} />

          {/* Bottom-Right Corner */}
          <path d="M380 572 C368 572, 352 588, 352 600" />
          <path d="M380 560 C362 560, 340 582, 340 600" />
          <path d="M374 594 Q358 578 374 562" />
          <path d="M370 590 C362 598, 348 584, 358 574 C364 568, 378 582, 370 590 Z" fill={`url(#goldMetallic-${uid})`} fillOpacity="0.15" />
          <circle cx="364" cy="584" r="3" fill={`url(#goldMetallic-${uid})`} />
        </g>

        {/* 9. TOP MOON PHASES HEADER */}
        <g transform="translate(200, 34)" fill={`url(#goldMetallic-${uid})`} stroke={`url(#goldMetallic-${uid})`} strokeWidth="0.8">
          {/* Waning Crescent Left */}
          <path d="M-64 -5 A7 7 0 0 0 -64 5 A5 5 0 0 1 -64 -5" />
          {/* Quarter Left */}
          <path d="M-32 -6 A6 6 0 0 0 -32 6 Z" />
          {/* Radiant Full Moon */}
          <circle cx="0" cy="0" r="7" fill={`url(#goldMetallic-${uid})`} filter={`url(#goldGlow-${uid})`} />
          {/* Quarter Right */}
          <path d="M32 -6 A6 6 0 0 1 32 6 Z" />
          {/* Waxing Crescent Right */}
          <path d="M64 -5 A7 7 0 0 1 64 5 A5 5 0 0 0 64 -5" />

          {/* Outer Framing Filigree Wings */}
          <circle cx="-92" cy="0" r="2" fill={`url(#goldMetallic-${uid})`} />
          <circle cx="92" cy="0" r="2" fill={`url(#goldMetallic-${uid})`} />
          <path d="M-125 0 Q-108 -8 -92 0" fill="none" strokeWidth="1" />
          <path d="M92 0 Q108 -8 125 0" fill="none" strokeWidth="1" />
        </g>

        {/* 10. Crescent Moon Above Top Compass */}
        <g transform="translate(200, 68)" fill={`url(#goldMetallic-${uid})`} stroke={`url(#goldMetallic-${uid})`}>
          <path d="M0 -12 A12 12 0 0 0 0 12 A9 9 0 0 1 0 -12 Z" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
        </g>

        {/* 11. TOP CELESTIAL COMPASS ROSE */}
        <g transform="translate(200, 142)">
          {/* Outer Rings */}
          <circle cx="0" cy="0" r="48" stroke={`url(#goldMetallic-${uid})`} strokeWidth="1.4" fill="none" />
          <circle cx="0" cy="0" r="44" stroke={`url(#goldMetallic-${uid})`} strokeWidth="0.75" strokeDasharray="3 2" fill="none" />
          <circle cx="0" cy="0" r="32" stroke={`url(#goldMetallic-${uid})`} strokeWidth="0.9" fill="none" />

          {/* 8-Point Compass Star */}
          <g fill={`url(#goldMetallic-${uid})`} stroke={`url(#goldMetallic-${uid})`} strokeWidth="0.5">
            {/* North Point */}
            <polygon points="0,-42 3.5,-10 0,0" fill="#fffbeb" />
            <polygon points="0,-42 -3.5,-10 0,0" fill="#ca8a04" />
            {/* South Point */}
            <polygon points="0,42 3.5,10 0,0" fill="#ca8a04" />
            <polygon points="0,42 -3.5,10 0,0" fill="#fffbeb" />
            {/* East Point */}
            <polygon points="42,0 10,3.5 0,0" fill="#fffbeb" />
            <polygon points="42,0 10,-3.5 0,0" fill="#ca8a04" />
            {/* West Point */}
            <polygon points="-42,0 -10,3.5 0,0" fill="#ca8a04" />
            <polygon points="-42,0 -10,-3.5 0,0" fill="#fffbeb" />

            {/* Diagonal Intermediate Points */}
            <polygon points="28,-28 9,-3 0,0" fill="#fde047" opacity="0.9" />
            <polygon points="-28,-28 -9,-3 0,0" fill="#ca8a04" opacity="0.9" />
            <polygon points="28,28 9,3 0,0" fill="#ca8a04" opacity="0.9" />
            <polygon points="-28,28 -9,3 0,0" fill="#fde047" opacity="0.9" />
          </g>

          {/* Directional Letters N, S, E, W */}
          <text x="0" y="-51" fill={`url(#goldMetallic-${uid})`} fontSize="10" fontWeight="bold" fontFamily="Cinzel, 'Playfair Display', serif" textAnchor="middle">N</text>
          <text x="0" y="58" fill={`url(#goldMetallic-${uid})`} fontSize="10" fontWeight="bold" fontFamily="Cinzel, 'Playfair Display', serif" textAnchor="middle">S</text>
          <text x="56" y="3.5" fill={`url(#goldMetallic-${uid})`} fontSize="10" fontWeight="bold" fontFamily="Cinzel, 'Playfair Display', serif" textAnchor="middle">E</text>
          <text x="-56" y="3.5" fill={`url(#goldMetallic-${uid})`} fontSize="10" fontWeight="bold" fontFamily="Cinzel, 'Playfair Display', serif" textAnchor="middle">W</text>

          {/* Compass Center Core */}
          <circle cx="0" cy="0" r="4.5" fill="#ffffff" filter={`url(#goldGlow-${uid})`} />
        </g>

        {/* 12. BOTTOM CELESTIAL COMPASS ROSE */}
        <g transform="translate(200, 478)">
          <circle cx="0" cy="0" r="48" stroke={`url(#goldMetallic-${uid})`} strokeWidth="1.4" fill="none" />
          <circle cx="0" cy="0" r="44" stroke={`url(#goldMetallic-${uid})`} strokeWidth="0.75" strokeDasharray="3 2" fill="none" />
          <circle cx="0" cy="0" r="32" stroke={`url(#goldMetallic-${uid})`} strokeWidth="0.9" fill="none" />

          <g fill={`url(#goldMetallic-${uid})`} stroke={`url(#goldMetallic-${uid})`} strokeWidth="0.5">
            <polygon points="0,-42 3.5,-10 0,0" fill="#fffbeb" />
            <polygon points="0,-42 -3.5,-10 0,0" fill="#ca8a04" />
            <polygon points="0,42 3.5,10 0,0" fill="#ca8a04" />
            <polygon points="0,42 -3.5,10 0,0" fill="#fffbeb" />
            <polygon points="42,0 10,3.5 0,0" fill="#fffbeb" />
            <polygon points="42,0 10,-3.5 0,0" fill="#ca8a04" />
            <polygon points="-42,0 -10,3.5 0,0" fill="#ca8a04" />
            <polygon points="-42,0 -10,-3.5 0,0" fill="#fffbeb" />

            <polygon points="28,-28 9,-3 0,0" fill="#fde047" opacity="0.9" />
            <polygon points="-28,-28 -9,-3 0,0" fill="#ca8a04" opacity="0.9" />
            <polygon points="28,28 9,3 0,0" fill="#ca8a04" opacity="0.9" />
            <polygon points="-28,28 -9,3 0,0" fill="#fde047" opacity="0.9" />
          </g>

          <text x="0" y="-51" fill={`url(#goldMetallic-${uid})`} fontSize="10" fontWeight="bold" fontFamily="Cinzel, 'Playfair Display', serif" textAnchor="middle">N</text>
          <text x="0" y="58" fill={`url(#goldMetallic-${uid})`} fontSize="10" fontWeight="bold" fontFamily="Cinzel, 'Playfair Display', serif" textAnchor="middle">S</text>
          <text x="56" y="3.5" fill={`url(#goldMetallic-${uid})`} fontSize="10" fontWeight="bold" fontFamily="Cinzel, 'Playfair Display', serif" textAnchor="middle">E</text>
          <text x="-56" y="3.5" fill={`url(#goldMetallic-${uid})`} fontSize="10" fontWeight="bold" fontFamily="Cinzel, 'Playfair Display', serif" textAnchor="middle">W</text>

          <circle cx="0" cy="0" r="4.5" fill="#ffffff" filter={`url(#goldGlow-${uid})`} />
        </g>

        {/* 13. BOTTOM MOON PHASES FOOTER */}
        <g transform="translate(200, 586)" fill={`url(#goldMetallic-${uid})`} stroke={`url(#goldMetallic-${uid})`} strokeWidth="0.8">
          <path d="M-64 -5 A7 7 0 0 0 -64 5 A5 5 0 0 1 -64 -5" />
          <path d="M-32 -6 A6 6 0 0 0 -32 6 Z" />
          <circle cx="0" cy="0" r="7" fill={`url(#goldMetallic-${uid})`} filter={`url(#goldGlow-${uid})`} />
          <path d="M32 -6 A6 6 0 0 1 32 6 Z" />
          <path d="M64 -5 A7 7 0 0 1 64 5 A5 5 0 0 0 64 -5" />

          <circle cx="-92" cy="0" r="2" fill={`url(#goldMetallic-${uid})`} />
          <circle cx="92" cy="0" r="2" fill={`url(#goldMetallic-${uid})`} />
          <path d="M-125 0 Q-108 8 -92 0" fill="none" strokeWidth="1" />
          <path d="M92 0 Q108 8 125 0" fill="none" strokeWidth="1" />
        </g>

        {/* 14. CENTER ZODIAC WHEEL & GLOWING SOLAR MEDALLION */}
        <g transform="translate(200, 310)">
          {/* Luminous Solar Aura */}
          <circle cx="0" cy="0" r="115" fill={`url(#solarHalo-${uid})`} />

          {/* Outer Sun Rays & Radiance Ring */}
          <circle cx="0" cy="0" r="102" stroke={`url(#goldMetallic-${uid})`} strokeWidth="1.5" fill="none" opacity="0.75" />
          <circle cx="0" cy="0" r="97" stroke={`url(#goldMetallic-${uid})`} strokeWidth="0.9" strokeDasharray="3 3" fill="none" />
          
          {/* Luminous Core Ring (Dark velvet interior with glowing gold rim) */}
          <circle cx="0" cy="0" r="86" stroke={`url(#goldMetallic-${uid})`} strokeWidth="3" fill="#08071a" fillOpacity="0.9" filter={`url(#solarGlow-${uid})`} />
          <circle cx="0" cy="0" r="86" stroke={`url(#goldMetallic-${uid})`} strokeWidth="1.8" fill="none" />
          <circle cx="0" cy="0" r="80" stroke={`url(#goldMetallic-${uid})`} strokeWidth="0.8" strokeDasharray="2.5 2.5" fill="none" />

          {/* Top & Bottom Glowing Flare Arcs on the Inner Ring */}
          <path d="M-60 -60 A85 85 0 0 1 60 -60" stroke={`url(#flareArcTop-${uid})`} strokeWidth="5" fill="none" filter={`url(#solarGlow-${uid})`} />
          <path d="M-60 60 A85 85 0 0 0 60 60" stroke={`url(#flareArcBottom-${uid})`} strokeWidth="5" fill="none" filter={`url(#solarGlow-${uid})`} />

          {/* 12 Astrological Zodiac Glyphs around the circumference */}
          <g fill={`url(#goldMetallic-${uid})`} fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
            {/* Aries (12 o'clock - Top) */}
            <text transform="translate(0, -92)">♈</text>
            {/* Taurus (1 o'clock) */}
            <text transform="translate(46, -80)">♉</text>
            {/* Gemini (2 o'clock) */}
            <text transform="translate(80, -46)">♊</text>
            {/* Cancer (3 o'clock - East) */}
            <text transform="translate(92, 0)">♋</text>
            {/* Leo (4 o'clock) */}
            <text transform="translate(80, 46)">♌</text>
            {/* Virgo (5 o'clock) */}
            <text transform="translate(46, 80)">♍</text>
            {/* Libra (6 o'clock - South) */}
            <text transform="translate(0, 92)">♎</text>
            {/* Scorpio (7 o'clock) */}
            <text transform="translate(-46, 80)">♏</text>
            {/* Sagittarius (8 o'clock) */}
            <text transform="translate(-80, 46)">♐</text>
            {/* Capricorn (9 o'clock - West) */}
            <text transform="translate(-92, 0)">♑</text>
            {/* Aquarius (10 o'clock) */}
            <text transform="translate(-80, -46)">♒</text>
            {/* Pisces (11 o'clock) */}
            <text transform="translate(-46, -80)">♓</text>
          </g>

          {/* Inner Golden Ring */}
          <circle cx="0" cy="0" r="64" stroke={`url(#goldMetallic-${uid})`} strokeWidth="1.6" fill="none" />

          {/* Star Accents above and below center text */}
          <g fill={`url(#goldMetallic-${uid})`}>
            {/* Top North Star */}
            <g transform="translate(0, -44)">
              <circle r="2" fill="#ffffff" />
              <path d="M0 -10 L2 -3 L8 0 L2 3 L0 10 L-2 3 L-8 0 L-2 -3 Z" filter={`url(#goldGlow-${uid})`} />
            </g>
            {/* Bottom South Star */}
            <g transform="translate(0, 44)">
              <circle r="2" fill="#ffffff" />
              <path d="M0 -10 L2 -3 L8 0 L2 3 L0 10 L-2 3 L-8 0 L-2 -3 Z" filter={`url(#goldGlow-${uid})`} />
            </g>
            
            {/* Left & Right Star Accents flanking text */}
            <circle cx="-52" cy="-8" r="1.5" />
            <circle cx="52" cy="-8" r="1.5" />
          </g>

          {/* Typography: "COSMIC" (Classic Curved Display Serif with Swashes) */}
          <g filter={`url(#goldGlow-${uid})`}>
            <text
              x="0"
              y="-12"
              fill={`url(#goldMetallic-${uid})`}
              fontSize="24"
              fontWeight="900"
              fontFamily="Cinzel, 'Cinzel Decorative', 'Playfair Display', serif"
              letterSpacing="2.5"
              textAnchor="middle"
            >
              ✦ COSMIC ✦
            </text>

            {/* Typography: "BREADCRUMBS" */}
            <text
              x="0"
              y="14"
              fill={`url(#goldMetallic-${uid})`}
              fontSize="16"
              fontWeight="900"
              fontFamily="Cinzel, 'Cinzel Decorative', 'Playfair Display', serif"
              letterSpacing="2"
              textAnchor="middle"
            >
              BREADCRUMBS
            </text>

            {/* Elegant Calligraphic Underline Swash Sweeping Under Breadcrumbs */}
            <path
              d="M-52 23 C-20 33, 0 16, 26 24 S50 21, 56 26"
              stroke={`url(#goldMetallic-${uid})`}
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M-28 24 Q0 35 32 25"
              stroke={`url(#goldMetallic-${uid})`}
              strokeWidth="1"
              fill="none"
              opacity="0.85"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

