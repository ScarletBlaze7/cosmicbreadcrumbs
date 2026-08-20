import React, { useState, useEffect, useRef } from 'react';
import { Lock, Sparkles, Crown, ShieldCheck, Upload, Eye, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { MembershipTier } from '../types';

interface SanctuaryEmblemProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  isUnlocked?: boolean; // Only true for paid members ('weekly' | 'monthly' | 'lifetime'), NOT for free or trial
  tier?: MembershipTier;
  showDetailsTooltip?: boolean;
  interactive?: boolean;
  onUpgradeClick?: () => void;
  customImageUrl?: string;
}

export const SanctuaryEmblem: React.FC<SanctuaryEmblemProps> = ({
  size = 'md',
  className = '',
  isUnlocked = false,
  tier,
  showDetailsTooltip = false,
  interactive = false,
  onUpgradeClick,
  customImageUrl,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [savedEmblemPhoto, setSavedEmblemPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cosmic_sanctuary_emblem_photo');
      if (stored) {
        setSavedEmblemPhoto(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setSavedEmblemPhoto(result);
        try {
          localStorage.setItem('cosmic_sanctuary_emblem_photo', result);
        } catch {
          // ignore
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetPhoto = () => {
    setSavedEmblemPhoto(null);
    try {
      localStorage.removeItem('cosmic_sanctuary_emblem_photo');
    } catch {
      // ignore
    }
  };

  const activeImageUrl = customImageUrl || savedEmblemPhoto;

  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-20 w-20',
    xl: 'h-32 w-32',
    hero: 'h-56 w-56 sm:h-72 sm:w-72',
  };

  const isPaidMember = tier === 'weekly' || tier === 'monthly' || tier === 'lifetime';
  const unlocked = isUnlocked || isPaidMember;

  return (
    <>
      <div
        className={`relative inline-flex items-center justify-center select-none group ${className}`}
        onClick={() => {
          if (interactive) setShowModal(true);
        }}
      >
        {/* Emblem Container */}
        <div
          className={`relative ${sizeClasses[size]} rounded-full transition-transform duration-300 ${
            interactive ? 'cursor-pointer group-hover:scale-105' : ''
          }`}
        >
          {activeImageUrl ? (
            <img
              src={activeImageUrl}
              alt="Sanctuary Emblem"
              className="h-full w-full object-cover rounded-full shadow-2xl border border-amber-400/40"
              referrerPolicy="no-referrer"
            />
          ) : (
            /* High-fidelity Vector Render of the Exact Sanctuary Emblem Photo */
            <svg
              viewBox="0 0 500 500"
              className="h-full w-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)] overflow-hidden rounded-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Cosmic Background Nebulae */}
                <radialGradient id="nebulaSpace" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#1e0f38" />
                  <stop offset="35%" stopColor="#120924" />
                  <stop offset="70%" stopColor="#080410" />
                  <stop offset="100%" stopColor="#030106" />
                </radialGradient>

                <linearGradient id="purpleNebulaGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="goldNebulaGlow" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
                  <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                </linearGradient>

                {/* Antique Gold Metallic Gradients */}
                <linearGradient id="antiqueGoldRing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fae596" />
                  <stop offset="20%" stopColor="#c59846" />
                  <stop offset="40%" stopColor="#fff2ba" />
                  <stop offset="60%" stopColor="#8c6426" />
                  <stop offset="80%" stopColor="#e5ba64" />
                  <stop offset="100%" stopColor="#684713" />
                </linearGradient>

                <linearGradient id="goldHourglass" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b6528" />
                  <stop offset="25%" stopColor="#fdf0ab" />
                  <stop offset="50%" stopColor="#ca9943" />
                  <stop offset="75%" stopColor="#fff8cf" />
                  <stop offset="100%" stopColor="#784f18" />
                </linearGradient>

                <linearGradient id="starGoldBevel" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff5c0" />
                  <stop offset="50%" stopColor="#b3822f" />
                  <stop offset="100%" stopColor="#573708" />
                </linearGradient>

                {/* Multi-color Swirling Stardust Nebula */}
                <linearGradient id="cosmicSandVortex" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="20%" stopColor="#a855f7" />
                  <stop offset="40%" stopColor="#ec4899" />
                  <stop offset="60%" stopColor="#f59e0b" />
                  <stop offset="80%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>

                {/* Lower Glass Flame */}
                <radialGradient id="spiritualFlame" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="30%" stopColor="#fef08a" />
                  <stop offset="60%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#db2777" />
                </radialGradient>

                {/* Gemstone Facet Gradients */}
                <radialGradient id="facetedRuby" cx="30%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#ffe4e6" />
                  <stop offset="25%" stopColor="#f43f5e" />
                  <stop offset="60%" stopColor="#be123c" />
                  <stop offset="100%" stopColor="#4c0519" />
                </radialGradient>

                <radialGradient id="facetedEmerald" cx="30%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#d1fae5" />
                  <stop offset="25%" stopColor="#10b981" />
                  <stop offset="60%" stopColor="#047857" />
                  <stop offset="100%" stopColor="#022c22" />
                </radialGradient>

                <radialGradient id="facetedSapphire" cx="30%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#dbeafe" />
                  <stop offset="25%" stopColor="#3b82f6" />
                  <stop offset="60%" stopColor="#1d4ed8" />
                  <stop offset="100%" stopColor="#0f172a" />
                </radialGradient>

                {/* Glowing All-Seeing Third Eye */}
                <radialGradient id="allSeeingEye" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="25%" stopColor="#60a5fa" />
                  <stop offset="60%" stopColor="#2563eb" />
                  <stop offset="90%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#030712" />
                </radialGradient>

                {/* Drop shadow filter */}
                <filter id="glowShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.8" />
                </filter>
              </defs>

              {/* 1. Deep Space Nebula Background */}
              <rect x="0" y="0" width="500" height="500" fill="url(#nebulaSpace)" />
              <circle cx="120" cy="150" r="160" fill="url(#purpleNebulaGlow)" filter="blur(30px)" />
              <circle cx="380" cy="320" r="160" fill="url(#goldNebulaGlow)" filter="blur(30px)" />
              <circle cx="420" cy="120" r="120" fill="url(#goldNebulaGlow)" filter="blur(25px)" />
              <circle cx="100" cy="380" r="130" fill="url(#purpleNebulaGlow)" filter="blur(25px)" />

              {/* Distant Stars & Sparkles */}
              {Array.from({ length: 45 }).map((_, i) => {
                const cx = (i * 73 + 23) % 480 + 10;
                const cy = (i * 97 + 17) % 480 + 10;
                const r = (i % 3 === 0 ? 1.5 : i % 2 === 0 ? 1.2 : 0.8);
                const opacity = (i % 4 === 0 ? 0.9 : 0.6);
                return <circle key={i} cx={cx} cy={cy} r={r} fill="#ffffff" opacity={opacity} />;
              })}

              {/* 2. Outer Astrolabe Dial Ring */}
              {/* Outer Bronze/Gold Rim */}
              <circle cx="250" cy="250" r="236" fill="#140a1c" stroke="url(#antiqueGoldRing)" strokeWidth="14" filter="url(#glowShadow)" />
              <circle cx="250" cy="250" r="226" fill="none" stroke="#ffe58f" strokeWidth="2" opacity="0.8" />
              
              {/* Diamond-encrusted circular track */}
              <circle cx="250" cy="250" r="218" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3 5" opacity="0.85" />
              
              {/* Dark Stepped Inner Bezel */}
              <circle cx="250" cy="250" r="208" fill="#1a0f28" stroke="url(#antiqueGoldRing)" strokeWidth="5" />
              
              {/* Degree Hash Marks (360 degrees) */}
              {Array.from({ length: 72 }).map((_, i) => {
                const angle = (i * 5 * Math.PI) / 180;
                const isMajor = i % 6 === 0;
                const x1 = 250 + Math.cos(angle) * 206;
                const y1 = 250 + Math.sin(angle) * 206;
                const x2 = 250 + Math.cos(angle) * (isMajor ? 194 : 199);
                const y2 = 250 + Math.sin(angle) * (isMajor ? 194 : 199);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#fde047"
                    strokeWidth={isMajor ? 2 : 1}
                    opacity={isMajor ? 0.9 : 0.5}
                  />
                );
              })}

              {/* 3. Eight Ornate Faceted Gemstones */}
              {/* Top Pair: Red Rubies */}
              <g transform="translate(170, 52)">
                <circle cx="0" cy="0" r="11" fill="url(#antiqueGoldRing)" />
                <circle cx="0" cy="0" r="9" fill="url(#facetedRuby)" stroke="#fef08a" strokeWidth="1" />
                <polygon points="-4,-4 4,-4 6,0 4,4 -4,4 -6,0" fill="none" stroke="#ffe4e6" strokeWidth="0.7" opacity="0.7" />
              </g>
              <g transform="translate(330, 52)">
                <circle cx="0" cy="0" r="11" fill="url(#antiqueGoldRing)" />
                <circle cx="0" cy="0" r="9" fill="url(#facetedRuby)" stroke="#fef08a" strokeWidth="1" />
                <polygon points="-4,-4 4,-4 6,0 4,4 -4,4 -6,0" fill="none" stroke="#ffe4e6" strokeWidth="0.7" opacity="0.7" />
              </g>

              {/* Upper Sides: Emerald (Left) & Sapphire (Right) */}
              <g transform="translate(82, 142)">
                <circle cx="0" cy="0" r="11" fill="url(#antiqueGoldRing)" />
                <circle cx="0" cy="0" r="9" fill="url(#facetedEmerald)" stroke="#fef08a" strokeWidth="1" />
              </g>
              <g transform="translate(418, 142)">
                <circle cx="0" cy="0" r="11" fill="url(#antiqueGoldRing)" />
                <circle cx="0" cy="0" r="9" fill="url(#facetedSapphire)" stroke="#fef08a" strokeWidth="1" />
              </g>

              {/* Lower Sides: Ruby (Left) & Emerald/Sapphire (Right) */}
              <g transform="translate(82, 358)">
                <circle cx="0" cy="0" r="11" fill="url(#antiqueGoldRing)" />
                <circle cx="0" cy="0" r="9" fill="url(#facetedRuby)" stroke="#fef08a" strokeWidth="1" />
              </g>
              <g transform="translate(418, 358)">
                <circle cx="0" cy="0" r="11" fill="url(#antiqueGoldRing)" />
                <circle cx="0" cy="0" r="9" fill="url(#facetedEmerald)" stroke="#fef08a" strokeWidth="1" />
              </g>

              {/* Bottom Pair: Ruby (Left) & Sapphire (Right) */}
              <g transform="translate(170, 448)">
                <circle cx="0" cy="0" r="11" fill="url(#antiqueGoldRing)" />
                <circle cx="0" cy="0" r="9" fill="url(#facetedRuby)" stroke="#fef08a" strokeWidth="1" />
              </g>
              <g transform="translate(330, 448)">
                <circle cx="0" cy="0" r="11" fill="url(#antiqueGoldRing)" />
                <circle cx="0" cy="0" r="9" fill="url(#facetedSapphire)" stroke="#fef08a" strokeWidth="1" />
              </g>

              {/* 4. Four Cardinal Creature Medallions */}
              {/* NORTH: OWL MEDALLION & "N" */}
              <g transform="translate(250, 42)">
                <circle cx="0" cy="0" r="24" fill="#180e08" stroke="url(#antiqueGoldRing)" strokeWidth="3" filter="url(#glowShadow)" />
                {/* Owl Head & Feathers */}
                <path d="M-10,-6 C-10,-12 -4,-15 0,-15 C4,-15 10,-12 10,-6 C10,6 6,12 0,14 C-6,12 -10,6 -10,-6 Z" fill="none" stroke="#fae596" strokeWidth="1.8" />
                <circle cx="-4" cy="-5" r="3" fill="#fde047" stroke="#854d0e" strokeWidth="0.8" />
                <circle cx="4" cy="-5" r="3" fill="#fde047" stroke="#854d0e" strokeWidth="0.8" />
                <circle cx="-4" cy="-5" r="1.2" fill="#000000" />
                <circle cx="4" cy="-5" r="1.2" fill="#000000" />
                <polygon points="0,-1 -2,3 2,3" fill="#ea580c" />
                {/* N letter */}
                <text x="0" y="44" textAnchor="middle" fill="#fae596" fontSize="18" fontFamily="serif" fontWeight="bold" letterSpacing="1">N</text>
              </g>

              {/* EAST: WINGED LION / GRIFFIN MEDALLION & "E" */}
              <g transform="translate(458, 250)">
                <circle cx="0" cy="0" r="24" fill="#180e08" stroke="url(#antiqueGoldRing)" strokeWidth="3" filter="url(#glowShadow)" />
                {/* Mythical Griffin/Lion Profile */}
                <path d="M-12,8 Q-6,-8 2,-8 Q12,-6 10,2 Q6,10 -4,10 Z" fill="none" stroke="#fae596" strokeWidth="1.8" />
                <path d="M-6,-2 Q4,-14 12,-4" fill="none" stroke="#fef08a" strokeWidth="1.5" />
                <text x="-44" y="6" textAnchor="middle" fill="#fae596" fontSize="18" fontFamily="serif" fontWeight="bold">E</text>
              </g>

              {/* SOUTH: CELESTIAL DRAGON / OUROBOROS & "S" */}
              <g transform="translate(250, 458)">
                <circle cx="0" cy="0" r="24" fill="#180e08" stroke="url(#antiqueGoldRing)" strokeWidth="3" filter="url(#glowShadow)" />
                {/* Coiled Dragon / Serpent */}
                <path d="M-8,-6 C-12,2 -4,12 4,8 C12,4 8,-8 0,-8 C-4,-8 -6,-4 -4,-2 C-2,0 2,0 2,-2" fill="none" stroke="#fae596" strokeWidth="2" strokeLinecap="round" />
                <text x="0" y="-30" textAnchor="middle" fill="#fae596" fontSize="18" fontFamily="serif" fontWeight="bold">S</text>
              </g>

              {/* WEST: RISING PHOENIX & "W" */}
              <g transform="translate(42, 250)">
                <circle cx="0" cy="0" r="24" fill="#180e08" stroke="url(#antiqueGoldRing)" strokeWidth="3" filter="url(#glowShadow)" />
                {/* Phoenix spreading wings */}
                <path d="M-10,4 Q0,-12 10,4 Q4,2 0,10 Q-4,2 -10,4 Z" fill="url(#starGoldBevel)" stroke="#fae596" strokeWidth="1.5" />
                <circle cx="0" cy="-6" r="2" fill="#ef4444" />
              </g>

              {/* 5. Inner Dial Background */}
              <circle cx="250" cy="250" r="168" fill="#0b0616" stroke="url(#antiqueGoldRing)" strokeWidth="4" />

              {/* 6. THE ORNATE SACRED HOURGLASS */}
              {/* Top & Bottom Arch Pedestals */}
              <path d="M175,108 L325,108 L310,132 L190,132 Z" fill="url(#goldHourglass)" stroke="#573708" strokeWidth="1.5" filter="url(#glowShadow)" />
              <path d="M175,392 L325,392 L310,368 L190,368 Z" fill="url(#goldHourglass)" stroke="#573708" strokeWidth="1.5" filter="url(#glowShadow)" />
              
              {/* Hourglass Ornate Top Filigree Crown */}
              <path d="M210,108 Q250,85 290,108" fill="none" stroke="#fae596" strokeWidth="2.5" />
              <path d="M210,392 Q250,415 290,392" fill="none" stroke="#fae596" strokeWidth="2.5" />

              {/* Left & Right Brass Fluted Columns */}
              <rect x="178" y="132" width="10" height="236" rx="5" fill="url(#starGoldBevel)" stroke="#452705" strokeWidth="1" />
              <rect x="312" y="132" width="10" height="236" rx="5" fill="url(#starGoldBevel)" stroke="#452705" strokeWidth="1" />

              {/* Hourglass Glass Contours */}
              <path
                d="M198,132 C198,205 235,232 246,248 L254,248 C265,232 302,205 302,132 Z"
                fill="none"
                stroke="url(#antiqueGoldRing)"
                strokeWidth="3.5"
              />
              <path
                d="M198,368 C198,295 235,268 246,252 L254,252 C265,268 302,295 302,368 Z"
                fill="none"
                stroke="url(#antiqueGoldRing)"
                strokeWidth="3.5"
              />

              {/* Upper Glass: Multi-Color Rainbow Swirling Nebula Sand */}
              <path
                d="M206,144 C206,192 234,222 249,242 C252,242 268,222 294,192 C294,144 206,144 206,144 Z"
                fill="url(#cosmicSandVortex)"
                opacity="0.9"
              />
              {/* Spiral Nebula Lines in Top Bulb */}
              <path d="M230,165 Q265,175 250,205 Q235,220 250,235" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
              <circle cx="255" cy="180" r="3" fill="#ffffff" filter="blur(0.5px)" />
              <circle cx="238" cy="210" r="2" fill="#fef08a" />

              {/* Lower Glass: Cosmic Nebula Base */}
              <path
                d="M206,356 C206,308 234,278 249,258 C252,258 268,278 294,308 C294,356 206,356 206,356 Z"
                fill="url(#cosmicSandVortex)"
                opacity="0.65"
              />

              {/* Lower Glass Left: Mystical Keyhole in Diamond Setting */}
              <g transform="translate(226, 305)">
                <path d="M12,0 C6,0 1,5 1,11 C1,15 4,18 7,20 L5,32 L19,32 L17,20 C20,18 23,15 23,11 C23,5 18,0 12,0 Z" fill="#080312" stroke="url(#antiqueGoldRing)" strokeWidth="2" />
                <circle cx="12" cy="10" r="3.5" fill="#fde047" />
                <polygon points="10,12 14,12 15,24 9,24" fill="#fde047" />
                {/* Tiny diamonds surrounding keyhole */}
                <circle cx="12" cy="-3" r="1.5" fill="#ffffff" />
                <circle cx="3" cy="11" r="1.5" fill="#ffffff" />
                <circle cx="21" cy="11" r="1.5" fill="#ffffff" />
              </g>

              {/* Lower Glass Right: Sacred Spiritual Flame */}
              <path
                d="M272,342 C265,325 285,310 276,290 C290,305 292,328 280,342 Z"
                fill="url(#spiritualFlame)"
                filter="url(#glowShadow)"
              />

              {/* 7. THE 8-POINTED COMPASS STAR OVERLAY */}
              {/* Vertical Beveled Star Rays */}
              <polygon points="250,150 258,238 250,244 242,238" fill="url(#starGoldBevel)" stroke="#ffe699" strokeWidth="0.8" />
              <polygon points="250,350 258,262 250,256 242,262" fill="url(#starGoldBevel)" stroke="#ffe699" strokeWidth="0.8" />
              {/* Horizontal Beveled Star Rays */}
              <polygon points="135,250 235,242 242,250 235,258" fill="url(#starGoldBevel)" stroke="#ffe699" strokeWidth="0.8" />
              <polygon points="365,250 265,242 258,250 265,258" fill="url(#starGoldBevel)" stroke="#ffe699" strokeWidth="0.8" />
              {/* Diagonal 4 Star Rays */}
              <polygon points="175,175 240,240 242,238" fill="url(#antiqueGoldRing)" />
              <polygon points="325,175 260,240 258,238" fill="url(#antiqueGoldRing)" />
              <polygon points="175,325 240,260 242,262" fill="url(#antiqueGoldRing)" />
              <polygon points="325,325 260,260 258,262" fill="url(#antiqueGoldRing)" />

              {/* Diamond Track along the 8-pointed star rays */}
              <circle cx="250" cy="180" r="2" fill="#ffffff" />
              <circle cx="250" cy="205" r="2" fill="#ffffff" />
              <circle cx="250" cy="295" r="2" fill="#ffffff" />
              <circle cx="250" cy="320" r="2" fill="#ffffff" />

              {/* 8. CENTER ALL-SEEING EYE (THIRD EYE) */}
              <g transform="translate(250, 250)">
                <ellipse cx="0" cy="0" rx="22" ry="14" fill="#020617" stroke="url(#antiqueGoldRing)" strokeWidth="3" filter="url(#glowShadow)" />
                <ellipse cx="0" cy="0" rx="14" ry="10" fill="url(#allSeeingEye)" />
                <circle cx="0" cy="0" r="5.5" fill="#000000" />
                <circle cx="-2" cy="-2" r="2" fill="#ffffff" opacity="0.9" />
              </g>

              {/* 9. MAJESTIC 3D GOLD TEXT "SANCTUARY" */}
              {/* Left Segment: "San" */}
              <text
                x="175"
                y="260"
                textAnchor="middle"
                fill="url(#antiqueGoldRing)"
                stroke="#120601"
                strokeWidth="1.2"
                fontSize="34"
                fontFamily="'Cinzel', 'Playfair Display', serif"
                fontWeight="900"
                letterSpacing="1"
                filter="url(#glowShadow)"
              >
                San
              </text>

              {/* Right Segment: "ctuary" */}
              <text
                x="325"
                y="260"
                textAnchor="middle"
                fill="url(#antiqueGoldRing)"
                stroke="#120601"
                strokeWidth="1.2"
                fontSize="32"
                fontFamily="'Cinzel', 'Playfair Display', serif"
                fontWeight="900"
                letterSpacing="1"
                filter="url(#glowShadow)"
              >
                ctuary
              </text>

              {/* Diamond Shimmer Highlights on Star Tips */}
              <circle cx="250" cy="152" r="3.5" fill="#ffffff" opacity="0.95" />
              <circle cx="137" cy="250" r="3.5" fill="#ffffff" opacity="0.95" />
              <circle cx="363" cy="250" r="3.5" fill="#ffffff" opacity="0.95" />
              <circle cx="250" cy="348" r="3.5" fill="#ffffff" opacity="0.95" />
            </svg>
          )}

          {/* Locked Badge / Overlay for Free or Free Trial Users */}
          {!unlocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-slate-950/75 backdrop-blur-[2px] border border-purple-950/80">
              <div className="flex h-1/2 w-1/2 items-center justify-center rounded-full bg-slate-900/90 border border-slate-700 shadow-md">
                <Lock className="h-1/2 w-1/2 text-slate-400" />
              </div>
            </div>
          )}

          {/* Unlocked Radiant Sparkle for Paid Members */}
          {unlocked && size !== 'xs' && (
            <div className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-md border border-amber-300">
              <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </div>
          )}
        </div>

        {/* Tooltip on hover if requested */}
        {showDetailsTooltip && (
          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-30 w-56 rounded-xl border border-purple-900/90 bg-[#0b0c16] p-2.5 text-center shadow-xl">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center space-x-1">
              <Crown className="h-3 w-3 text-amber-400" />
              <span>Sanctuary Emblem</span>
            </span>
            <span className="text-[10px] text-slate-300 mt-1 leading-tight">
              {unlocked
                ? 'Active Member Insignia • Unlocked with Sanctuary Club'
                : '🔒 Exclusive to Paid Sanctuary Club Members (Weekly, Monthly, Lifetime). Not available on Free or Free Trial.'}
            </span>
          </div>
        )}
      </div>

      {/* Interactive Modal View when clicked */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-purple-900/80 bg-[#0b0c16] p-6 text-center shadow-2xl shadow-purple-950/60 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-purple-950 pb-3">
              <div className="flex items-center space-x-2">
                <Crown className="h-4 w-4 text-amber-400" />
                <h3 className="font-mono text-xs uppercase tracking-widest text-white font-bold">
                  Sacred Sanctuary Emblem
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Big Emblem Presentation */}
            <div className="flex justify-center py-2">
              <div className="relative h-56 w-56 sm:h-72 sm:w-72">
                <SanctuaryEmblem size="hero" isUnlocked={unlocked} tier={tier} customImageUrl={activeImageUrl} />
              </div>
            </div>

            {/* Upload & Photo Options */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-1.5 rounded-2xl bg-purple-900 border border-purple-500/80 px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase text-white hover:bg-purple-800 transition-all shadow-md"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Custom Emblem Photo</span>
              </button>

              {savedEmblemPhoto && (
                <button
                  type="button"
                  onClick={handleResetPhoto}
                  className="flex items-center space-x-1.5 rounded-2xl border border-slate-700 bg-[#120f26] px-3.5 py-2 text-xs font-mono font-bold tracking-wider uppercase text-slate-300 hover:text-white transition-all"
                  title="Reset to sacred master vector"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Use Master Replica</span>
                </button>
              )}
            </div>

            <div className="space-y-1.5 text-left bg-[#120f26] rounded-2xl p-4 border border-purple-900/60">
              <div className="inline-flex items-center space-x-1.5 rounded-full px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-[#1a1338] border border-purple-800 text-amber-300">
                {unlocked ? (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Unlocked & Active Member Seal</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Paid Sanctuary Club Membership Only</span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {unlocked
                  ? 'As an active paid member of The Sanctuary Club, this sacred celestial emblem is yours. It embodies ancient cosmic alignment, the eternal hourglass of wisdom, gemstone harmony, and the awakening of your intuitive sight.'
                  : 'This sacred Sanctuary Emblem is awarded exclusively to paid members of The Sanctuary Club (Weekly $3, Monthly $11, or Lifetime $33). Free accounts and the 3-Day Free Trial do not include the emblem.'}
              </p>
            </div>

            {!unlocked && onUpgradeClick && (
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  onUpgradeClick();
                }}
                className="w-full rounded-2xl bg-purple-900 border border-purple-500 hover:bg-purple-800 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-lg transition-all"
              >
                Unlock Sanctuary Emblem with Membership
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

