import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Maximize2, Feather, X, Upload, RotateCcw, Image as ImageIcon, BookOpen, Flame, Star, Eye } from 'lucide-react';

interface ArchangelUrielArtworkProps {
  variant?: 'card-banner' | 'temple-featured' | 'compact' | 'hero';
  className?: string;
  allowZoom?: boolean;
  showCaption?: boolean;
}

export const UrielSvgArtwork: React.FC = () => (
  <svg
    viewBox="0 0 960 540"
    className="h-full w-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Heavenly Sunlit Golden Cloudscape */}
      <radialGradient id="urielSkyGlow" cx="50%" cy="30%" r="85%">
        <stop offset="0%" stopColor="#fffdf0" />
        <stop offset="20%" stopColor="#fef08a" stopOpacity="0.9" />
        <stop offset="45%" stopColor="#fde047" stopOpacity="0.65" />
        <stop offset="70%" stopColor="#ca8a04" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#451a03" stopOpacity="0.9" />
      </radialGradient>

      {/* Sunburst Halo of Divine Revelation */}
      <radialGradient id="urielHalo" cx="50%" cy="20%" r="45%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#fef08a" stopOpacity="0.95" />
        <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
      </radialGradient>

      {/* Radiant Platinum-Silver Hair */}
      <linearGradient id="urielSilverHair" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#f8fafc" />
        <stop offset="60%" stopColor="#cbd5e1" />
        <stop offset="85%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>

      {/* Golden Crown & Scepter Gold */}
      <linearGradient id="urielGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="25%" stopColor="#fef08a" />
        <stop offset="55%" stopColor="#eab308" />
        <stop offset="85%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>

      {/* Celestial Sky-Blue Robe / Toga */}
      <linearGradient id="urielSkyRobe" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0f9ff" />
        <stop offset="25%" stopColor="#bae6fd" />
        <stop offset="55%" stopColor="#7dd3fc" />
        <stop offset="85%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>

      {/* Quartz Crystal Facets Glow */}
      <linearGradient id="crystalFacetA" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="40%" stopColor="#f1f5f9" stopOpacity="0.75" />
        <stop offset="80%" stopColor="#cbd5e1" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.8" />
      </linearGradient>

      <linearGradient id="crystalFacetB" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.85" />
        <stop offset="50%" stopColor="#f8fafc" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#64748b" stopOpacity="0.7" />
      </linearGradient>

      {/* Ancient Leather Grimoire */}
      <linearGradient id="leatherBook" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9a3412" />
        <stop offset="35%" stopColor="#78350f" />
        <stop offset="70%" stopColor="#451a03" />
        <stop offset="100%" stopColor="#291202" />
      </linearGradient>

      {/* Open Parchment Pages */}
      <linearGradient id="parchmentPages" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="50%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>

      {/* Golden Clouds Gradient */}
      <linearGradient id="goldenClouds" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
        <stop offset="30%" stopColor="#fed7aa" stopOpacity="0.7" />
        <stop offset="70%" stopColor="#fb923c" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#451a03" stopOpacity="0.85" />
      </linearGradient>

      {/* Muscular Athletic Skin Tone */}
      <linearGradient id="urielSkin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff1e6" />
        <stop offset="35%" stopColor="#edd0be" />
        <stop offset="70%" stopColor="#cf9e85" />
        <stop offset="100%" stopColor="#9e6650" />
      </linearGradient>

      {/* Glow Filter */}
      <filter id="urielGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      {/* Star Scepter Star Flare */}
      <filter id="starFlare" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* BACKGROUND: GOLDEN HEAVENLY SKY */}
    <rect width="960" height="540" fill="url(#urielSkyGlow)" />

    {/* BACKGROUND SUNBURST AURA */}
    <circle cx="480" cy="160" r="230" fill="url(#urielHalo)" opacity="0.85" />
    <circle cx="480" cy="150" r="140" fill="#ffffff" opacity="0.35" filter="url(#urielGlow)" />

    {/* BILLOWING AMBIENT GOLDEN CLOUDS (BACKGROUND) */}
    <g opacity="0.6">
      <path d="M-50 200 C30 140 140 160 210 220 C280 180 390 190 440 240 C520 180 640 190 710 250 C800 170 920 190 1000 260 L1000 540 L-50 540 Z" fill="url(#goldenClouds)" />
      <path d="M-80 320 C40 260 180 270 270 330 C370 270 500 280 580 340 C670 270 820 280 900 350 C980 280 1040 310 1040 540 L-80 540 Z" fill="#fef3c7" opacity="0.4" />
    </g>

    {/* FLOATING CRYSTAL PRISMS & GEODES IN SKY (LEFT & RIGHT) */}
    {/* Floating Crystal 1 (Top Left) */}
    <g transform="translate(80, 160) rotate(-15)">
      <polygon points="0,-40 12,-15 12,25 0,40 -12,25 -12,-15" fill="url(#crystalFacetA)" stroke="#ffffff" strokeWidth="1" />
      <polygon points="0,-40 12,-15 0,35 -12,-15" fill="url(#crystalFacetB)" opacity="0.7" />
      <circle cx="0" cy="0" r="3" fill="#ffffff" filter="url(#urielGlow)" />
    </g>

    {/* Floating Crystal 2 (Far Left) */}
    <g transform="translate(170, 240) rotate(12)">
      <polygon points="0,-35 10,-12 10,20 0,35 -10,20 -10,-12" fill="url(#crystalFacetA)" stroke="#ffffff" strokeWidth="0.8" />
      <polygon points="0,-35 10,-12 0,30 -10,-12" fill="url(#crystalFacetB)" opacity="0.6" />
    </g>

    {/* Floating 8-Pointed Star 1 (Left) */}
    <g transform="translate(205, 220)">
      <path d="M0 -15 L3 -4 L14 0 L3 4 L0 15 L-3 4 L-14 0 L-3 -4 Z" fill="url(#urielGold)" filter="url(#urielGlow)" />
      <circle cx="0" cy="0" r="2" fill="#ffffff" />
    </g>

    {/* Floating Geode Stone (Right) */}
    <g transform="translate(820, 250)">
      <path d="M-25 -20 C-10 -35 25 -30 35 -10 C45 10 30 35 10 38 C-15 40 -35 20 -35 -5 Z" fill="#78716c" stroke="#57534e" strokeWidth="1.5" />
      <path d="M-18 -12 C-5 -25 18 -20 25 -5 C32 10 20 25 5 28 C-12 30 -25 15 -25 -2 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      {/* Geode sparkling cavity crystals */}
      <polygon points="0,-10 6,-5 2,5 -5,2" fill="#e0e7ff" />
      <polygon points="8,5 15,2 12,12 5,10" fill="#ffffff" />
      <circle cx="2" cy="0" r="1.5" fill="#ffffff" filter="url(#urielGlow)" />
    </g>

    {/* Floating 8-Pointed Star 2 (Right) */}
    <g transform="translate(890, 200)">
      <path d="M0 -20 L4 -5 L19 0 L4 5 L0 20 L-4 5 L-19 0 L-4 -5 Z" fill="url(#urielGold)" filter="url(#urielGlow)" />
      <circle cx="0" cy="0" r="3" fill="#ffffff" />
    </g>

    {/* Floating 8-Pointed Star 3 (Mid Right) */}
    <g transform="translate(765, 235) scale(0.7)">
      <path d="M0 -16 L3 -4 L15 0 L3 4 L0 16 L-3 4 L-15 0 L-3 -4 Z" fill="url(#urielGold)" filter="url(#urielGlow)" />
    </g>

    {/* MASSIVE ARCHANGEL WINGS */}
    {/* LEFT WING */}
    <g>
      <path
        d="M440 180 C340 70 210 25 25 60 C-25 70 -5 120 95 145 C-5 135 20 185 120 195 C20 190 50 245 150 245 C50 245 85 305 185 295 C95 310 135 365 225 345 C165 370 215 425 295 385 C255 415 315 455 375 405 C405 365 425 275 440 190 Z"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="2"
      />
      {/* Wing Layered Feathers Shadow & Texture */}
      <path d="M430 170 C330 95 220 70 80 85" stroke="#94a3b8" strokeWidth="2.5" fill="none" opacity="0.6" />
      <path d="M420 190 C330 130 230 125 150 145" stroke="#94a3b8" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M410 215 C330 170 245 175 185 205" stroke="#cbd5e1" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M400 245 C330 220 260 225 210 265" stroke="#e2e8f0" strokeWidth="1.5" fill="none" />
    </g>

    {/* RIGHT WING */}
    <g>
      <path
        d="M520 180 C620 70 750 25 935 60 C985 70 965 120 865 145 C965 135 940 185 840 195 C940 190 910 245 810 245 C910 245 875 305 775 295 C865 310 825 365 735 345 C795 370 745 425 665 385 C705 415 645 455 585 405 C555 365 535 275 520 190 Z"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="2"
      />
      {/* Right Wing Layered Feathers Shadow & Texture */}
      <path d="M530 170 C630 95 740 70 880 85" stroke="#94a3b8" strokeWidth="2.5" fill="none" opacity="0.6" />
      <path d="M540 190 C630 130 730 125 810 145" stroke="#94a3b8" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M550 215 C630 170 715 175 775 205" stroke="#cbd5e1" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M560 245 C630 220 700 225 750 265" stroke="#e2e8f0" strokeWidth="1.5" fill="none" />
    </g>

    {/* FLOATING CRYSTAL MOUNTAIN THRONE / OUTCLUSTERS (BASE) */}
    <g id="crystalBase">
      {/* Rock Island Platform */}
      <path
        d="M210 380 C260 360 410 350 490 355 C570 340 720 360 760 395 C770 435 730 485 640 520 C540 545 370 540 270 510 C210 470 190 420 210 380 Z"
        fill="#57534e"
        stroke="#44403c"
        strokeWidth="2"
      />

      {/* Massive Giant Quartz Crystals rising from the mountain */}
      {/* Giant Crystal Far Left */}
      <polygon points="50,540 0,420 35,370 85,510" fill="url(#crystalFacetB)" stroke="#ffffff" strokeWidth="1.5" />
      <polygon points="35,370 85,510 140,540 110,410" fill="url(#crystalFacetA)" opacity="0.85" />
      <polygon points="120,540 175,415 220,445 190,540" fill="url(#crystalFacetB)" opacity="0.9" />

      {/* Giant Crystal Far Right */}
      <polygon points="910,540 960,420 925,370 875,510" fill="url(#crystalFacetA)" stroke="#ffffff" strokeWidth="1.5" />
      <polygon points="925,370 875,510 820,540 850,410" fill="url(#crystalFacetB)" opacity="0.85" />
      <polygon points="840,540 785,415 740,445 770,540" fill="url(#crystalFacetA)" opacity="0.9" />

      {/* Crystal Cluster directly beneath throne */}
      <polygon points="340,530 380,440 430,470 410,540" fill="url(#crystalFacetA)" />
      <polygon points="430,470 480,410 520,445 490,540" fill="url(#crystalFacetB)" />
      <polygon points="520,445 560,430 600,480 570,540" fill="url(#crystalFacetA)" />
    </g>

    {/* ROCK MESA / ALTAR ON RIGHT FOR SACRED BOOKS */}
    <g id="bookAltar">
      <polygon points="560,380 730,365 760,400 580,430" fill="#78716c" stroke="#44403c" strokeWidth="2" />
      <polygon points="580,430 760,400 740,470 560,490" fill="#44403c" />
      {/* Small crystal points on mesa */}
      <polygon points="550,385 560,350 575,375" fill="url(#crystalFacetA)" />
      <polygon points="740,370 755,335 770,365" fill="url(#crystalFacetB)" />
    </g>

    {/* SACRED GRIMOIRE OF THE ALL-SEEING EYE (UPRIGHT/LEANING ON RIGHT) */}
    <g id="sacredGrimoire" transform="translate(565, 230) rotate(-6)">
      {/* Book Body */}
      <rect x="0" y="0" width="90" height="120" rx="8" fill="url(#leatherBook)" stroke="#b45309" strokeWidth="2.5" />
      
      {/* Book Spine Ribs */}
      <line x1="0" y1="25" x2="10" y2="25" stroke="#fde047" strokeWidth="2" />
      <line x1="0" y1="60" x2="10" y2="60" stroke="#fde047" strokeWidth="2" />
      <line x1="0" y1="95" x2="10" y2="95" stroke="#fde047" strokeWidth="2" />

      {/* Golden Corner Protectors */}
      <polygon points="0,0 20,0 0,20" fill="url(#urielGold)" />
      <polygon points="90,0 70,0 90,20" fill="url(#urielGold)" />
      <polygon points="0,120 20,120 0,100" fill="url(#urielGold)" />
      <polygon points="90,120 70,120 90,100" fill="url(#urielGold)" />

      {/* Embossed Mystical All-Seeing Eye & Book Sigil on Cover */}
      <g transform="translate(45, 55)" stroke="#fde047" strokeWidth="1.8" fill="none">
        {/* Eye Outline */}
        <path d="M-22 0 Q0 -15 22 0 Q0 15 -22 0 Z" fill="#451a03" stroke="#fde047" />
        {/* Iris & Pupil */}
        <circle cx="0" cy="0" r="7" fill="url(#urielGold)" stroke="#fde047" strokeWidth="1" />
        <circle cx="0" cy="0" r="3" fill="#ffffff" />
        {/* Radiant Eye Beams */}
        <line x1="0" y1="-16" x2="0" y2="-22" />
        <line x1="-12" y1="-12" x2="-18" y2="-17" />
        <line x1="12" y1="-12" x2="18" y2="-17" />
        {/* Open Book sigil below Eye */}
        <path d="M-15 15 Q0 10 0 22 Q0 10 15 15 L12 25 Q0 20 0 28 Q0 20 -12 25 Z" fill="#fde047" />
      </g>
    </g>

    {/* OPEN PARCHMENT TOME OF CELESTIAL GEOMETRY (LYING OPEN ON ALTAR) */}
    <g id="openBook" transform="translate(560, 325)">
      {/* Left Page */}
      <polygon points="0,30 65,15 75,55 5,75" fill="url(#parchmentPages)" stroke="#b45309" strokeWidth="1.5" />
      {/* Right Page */}
      <polygon points="65,15 145,25 135,68 75,55" fill="url(#parchmentPages)" stroke="#b45309" strokeWidth="1.5" />
      
      {/* Celestial Diagrams on Left Page */}
      <circle cx="35" cy="40" r="12" stroke="#78350f" strokeWidth="1" fill="none" opacity="0.75" />
      <polygon points="35,28 45,46 25,46" stroke="#78350f" strokeWidth="0.8" fill="none" opacity="0.75" />
      <line x1="12" y1="58" x2="55" y2="48" stroke="#78350f" strokeWidth="0.8" opacity="0.6" />

      {/* Celestial Diagrams on Right Page */}
      <circle cx="105" cy="42" r="14" stroke="#78350f" strokeWidth="1" fill="none" opacity="0.75" />
      <line x1="91" y1="42" x2="119" y2="42" stroke="#78350f" strokeWidth="0.8" opacity="0.6" />
      <line x1="105" y1="28" x2="105" y2="56" stroke="#78350f" strokeWidth="0.8" opacity="0.6" />
      <line x1="85" y1="60" x2="125" y2="55" stroke="#78350f" strokeWidth="0.8" opacity="0.6" />
    </g>

    {/* ARCHANGEL URIEL SEATED BODY & ROBES */}
    {/* Draped Blue Throne Cloth */}
    <path
      d="M340 370 C360 340 520 340 550 370 C560 410 540 460 520 480 C480 490 380 490 350 470 Z"
      fill="url(#urielSkyRobe)"
      stroke="#0284c7"
      strokeWidth="1.5"
    />

    {/* Sculpted Muscular Legs (Sitting) */}
    {/* Right Leg (Forward) */}
    <path
      d="M380 340 C360 370 350 420 380 470 C395 495 410 520 415 530 C410 535 390 535 385 525 C370 495 340 450 345 400 C350 360 365 340 380 340 Z"
      fill="url(#urielSkin)"
    />
    {/* Left Leg */}
    <path
      d="M480 340 C520 380 540 430 520 480 C505 510 490 530 480 535 C475 530 475 515 485 490 C500 450 490 400 465 360 Z"
      fill="url(#urielSkin)"
    />

    {/* Flowing Sky-Blue Chiton / Toga with Golden Borders */}
    <path
      d="M370 270 C390 280 480 275 510 270 C525 310 515 370 490 390 C450 405 400 405 365 385 C350 340 355 290 370 270 Z"
      fill="url(#urielSkyRobe)"
      stroke="#38bdf8"
      strokeWidth="1"
    />
    {/* Golden Belt / Cinch */}
    <path d="M375 275 C420 290 470 285 505 275" stroke="url(#urielGold)" strokeWidth="4" fill="none" />
    <path d="M365 385 C420 405 470 400 490 390" stroke="url(#urielGold)" strokeWidth="3" fill="none" opacity="0.8" />

    {/* Muscular Torso & Chest */}
    <path
      d="M410 180 C440 185 490 185 520 180 C535 220 530 265 510 280 C475 290 435 290 405 280 C390 250 395 210 410 180 Z"
      fill="url(#urielSkin)"
    />
    {/* Pectoral & Abdominal Definitions */}
    <path d="M430 215 C450 230 470 230 495 215" stroke="#9e6650" strokeWidth="1.5" fill="none" opacity="0.6" />
    <path d="M465 200 L465 260" stroke="#9e6650" strokeWidth="1.5" fill="none" opacity="0.5" />
    <line x1="445" y1="240" x2="485" y2="240" stroke="#9e6650" strokeWidth="1.2" opacity="0.4" />
    <line x1="448" y1="258" x2="482" y2="258" stroke="#9e6650" strokeWidth="1.2" opacity="0.4" />

    {/* Toga Sash draped across right shoulder */}
    <path
      d="M480 180 C510 200 525 240 520 280 C505 280 495 250 470 210 Z"
      fill="url(#urielSkyRobe)"
      stroke="url(#urielGold)"
      strokeWidth="1.5"
    />

    {/* RIGHT ARM: HOLDING STAR SCEPTER */}
    {/* Right Shoulder & Bicep */}
    <path
      d="M410 185 C370 205 340 220 330 255 C345 265 375 250 395 230 Z"
      fill="url(#urielSkin)"
    />
    {/* Right Forearm & Hand gripping Scepter */}
    <path
      d="M330 255 C320 240 315 220 325 205 C340 205 345 225 345 245 Z"
      fill="url(#urielSkin)"
    />

    {/* GOLDEN STAR SCEPTER OF ILLUMINATION (IN RIGHT HAND) */}
    <g id="starScepter">
      {/* Scepter Staff */}
      <line x1="260" y1="80" x2="400" y2="460" stroke="url(#urielGold)" strokeWidth="6" strokeLinecap="round" />
      <line x1="260" y1="80" x2="400" y2="460" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      
      {/* Staff Golden Rings & Mounts */}
      <circle cx="280" cy="135" r="7" fill="url(#urielGold)" />
      <circle cx="310" cy="215" r="6" fill="url(#urielGold)" />
      <circle cx="370" cy="380" r="6" fill="url(#urielGold)" />

      {/* 8-POINTED RADIANT GOLDEN STAR TOPPER */}
      <g transform="translate(260, 80)">
        {/* Outer Radiant Flare */}
        <circle cx="0" cy="0" r="30" fill="url(#urielHalo)" opacity="0.9" filter="url(#starFlare)" />
        {/* Star Points */}
        <path
          d="M0 -35 L7 -10 L35 0 L7 10 L0 35 L-7 10 L-35 0 L-7 -10 Z"
          fill="url(#urielGold)"
          stroke="#ffffff"
          strokeWidth="1.5"
          filter="url(#urielGlow)"
        />
        {/* Secondary Diagonal Star Points */}
        <path
          d="M0 -22 L5 -6 L22 0 L5 6 L0 22 L-5 6 L-22 0 L-5 -6 Z"
          fill="url(#urielGold)"
          transform="rotate(45)"
        />
        {/* Central Brilliant Core Gem */}
        <circle cx="0" cy="0" r="7" fill="#ffffff" filter="url(#urielGlow)" />
        <circle cx="0" cy="0" r="4" fill="#fef08a" />
      </g>
    </g>

    {/* LEFT ARM: INTELLECTUAL CONTEMPLATION POSE (FINGER TO TEMPLE) */}
    {/* Left Shoulder & Bicep resting near book */}
    <path
      d="M515 185 C555 200 585 225 595 260 C580 270 560 250 540 230 Z"
      fill="url(#urielSkin)"
    />
    {/* Left Forearm bent upward toward head */}
    <path
      d="M595 260 C605 240 590 190 565 155 C550 160 565 210 580 250 Z"
      fill="url(#urielSkin)"
    />
    {/* Left Hand with index finger gently touching his temple */}
    <path
      d="M565 155 C560 145 545 135 540 145 C545 155 555 160 565 165 Z"
      fill="url(#urielSkin)"
    />

    {/* HEAD, NOBLE FACE & SILVER HAIR */}
    {/* Neck */}
    <path d="M460 160 L480 160 L485 190 L455 190 Z" fill="url(#urielSkin)" />
    
    {/* Noble Face Profile */}
    <path
      d="M485 110 C510 115 525 130 520 155 C515 175 495 185 475 180 C465 175 460 150 465 130 C470 115 475 110 485 110 Z"
      fill="url(#urielSkin)"
    />

    {/* Facial Features (Thoughtful, Serene, Eyes of Discernment) */}
    <path d="M500 135 C508 132 516 135 518 138" stroke="#451a03" strokeWidth="1.5" fill="none" />
    <path d="M505 142 C510 140 516 142 516 144" stroke="#451a03" strokeWidth="1.5" fill="none" />
    <path d="M516 145 L522 155 L514 158" stroke="#9e6650" strokeWidth="1.2" fill="none" />
    <path d="M508 165 C515 166 520 165 522 163" stroke="#9e6650" strokeWidth="1.5" fill="none" />

    {/* FLOWING PLATINUM-SILVER WAVY HAIR */}
    <path
      d="M470 100 C490 85 530 85 545 105 C555 125 550 155 540 180 C530 170 535 140 525 125 C515 110 495 105 470 105 Z"
      fill="url(#urielSilverHair)"
    />
    <path
      d="M470 100 C450 115 445 150 445 185 C455 195 465 180 465 150 C465 125 460 110 470 100 Z"
      fill="url(#urielSilverHair)"
    />
    <path
      d="M510 95 C535 95 560 115 565 145 C570 175 555 210 545 235 C540 220 548 185 545 160 C540 130 525 105 510 95 Z"
      fill="url(#urielSilverHair)"
    />

    {/* GOLDEN LAUREL / CIRCLET CROWN ON BROW */}
    <path
      d="M475 118 C495 114 520 118 535 128"
      stroke="url(#urielGold)"
      strokeWidth="3.5"
      fill="none"
    />
    {/* Crown Golden Leaves / Jewels */}
    <circle cx="485" cy="116" r="2.5" fill="url(#urielGold)" />
    <circle cx="505" cy="116" r="3" fill="#ffffff" filter="url(#urielGlow)" />
    <circle cx="525" cy="122" r="2.5" fill="url(#urielGold)" />

    {/* FOREGROUND BILLOWING GOLDEN CLOUDS & SPARKS */}
    <g opacity="0.45">
      <path d="M-20 540 C60 480 180 490 260 520 C360 480 480 490 560 530 C660 480 800 490 900 530 C960 500 1000 520 1000 540 Z" fill="#ffffff" />
    </g>
  </svg>
);

const LOCAL_STORAGE_URIEL_KEY = 'archangel_uriel_custom_photo';
const EVENT_URIEL_PHOTO_CHANGED = 'archangel_uriel_photo_updated';

export const ArchangelUrielArtwork: React.FC<ArchangelUrielArtworkProps> = ({
  variant = 'card-banner',
  className = '',
  allowZoom = true,
  showCaption = true,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [customPhoto, setCustomPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_URIEL_KEY) || null;
    } catch {
      return null;
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_URIEL_KEY);
        setCustomPhoto(stored || null);
      } catch {
        // ignore
      }
    };

    window.addEventListener(EVENT_URIEL_PHOTO_CHANGED, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(EVENT_URIEL_PHOTO_CHANGED, handleUpdate);
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
          localStorage.setItem(LOCAL_STORAGE_URIEL_KEY, result);
          setCustomPhoto(result);
          window.dispatchEvent(new Event(EVENT_URIEL_PHOTO_CHANGED));
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
      localStorage.removeItem(LOCAL_STORAGE_URIEL_KEY);
      setCustomPhoto(null);
      window.dispatchEvent(new Event(EVENT_URIEL_PHOTO_CHANGED));
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
              alt="Archangel Uriel Exact Portrait"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <UrielSvgArtwork />
          )}

          {/* Vignette & Ambient Radial Glow Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
        </div>

        {/* Badges & Overlays */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center space-x-1.5 pointer-events-none">
          <span className="rounded-md bg-slate-950/80 px-2 py-0.5 text-[9px] font-bold tracking-wider text-amber-300 border border-amber-400/40 backdrop-blur-xs flex items-center space-x-1 shadow-md">
            <Flame className="h-3 w-3 text-amber-400" />
            <span>ARCHANGEL URIEL</span>
          </span>
          <span className="rounded-md bg-amber-950/80 px-2 py-0.5 text-[9px] font-bold text-amber-200 border border-amber-500/40 backdrop-blur-xs hidden sm:inline-flex items-center space-x-1 shadow-md">
            <Star className="h-3 w-3 text-amber-300" />
            <span>Star Scepter & Grimoire of Wisdom</span>
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
            title="Upload/Select Exact Image File (1787215038436.jpg photo)"
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
              <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />
              <span className="truncate">
                {customPhoto ? 'Custom Exact Portrait Active' : 'Flame of Divine Illumination & Higher Wisdom'}
              </span>
            </div>
            <span className="text-[9px] text-purple-300/80 shrink-0 pl-2">
              {customPhoto ? 'Click to inspect / change' : 'Click to inspect or upload photo'}
            </span>
          </div>
        )}
      </div>

      {/* Lightbox / Zoom Modal for Archangel Uriel Sacred Iconography */}
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
            <div className="flex items-center justify-between border-b border-amber-900/50 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-slate-100">
                    Archangel Uriel • Sacred Portrait & Iconography
                  </h3>
                  <p className="text-[11px] text-amber-300/80">
                    Flame of Illumination, Mental Clarity & The Grimoire of Universal Truth
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="rounded-full bg-slate-900 p-1.5 text-purple-300 hover:text-white border border-purple-800/60 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Visual Display */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl border border-amber-400/40 bg-slate-950 flex items-center justify-center">
              {customPhoto ? (
                <img
                  src={customPhoto}
                  alt="Archangel Uriel Full Sacred Art"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-contain"
                />
              ) : (
                <UrielSvgArtwork />
              )}
            </div>

            {/* Custom Photo Management Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl bg-slate-900/80 border border-purple-900/60 p-3 text-xs">
              <div className="flex items-center space-x-2 text-purple-200">
                <ImageIcon className="h-4 w-4 text-amber-300" />
                <span>
                  {customPhoto
                    ? 'Custom Archangel Uriel portrait loaded in sanctuary memory.'
                    : 'Displaying sacred vector portrait.'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-1.5 rounded-xl bg-amber-500/20 px-3 py-1.5 font-semibold text-amber-200 border border-amber-400/40 hover:bg-amber-500/30 transition-all"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload / Replace Photo</span>
                </button>

                {customPhoto && (
                  <button
                    type="button"
                    onClick={handleResetPhoto}
                    className="flex items-center space-x-1 rounded-xl bg-slate-800 px-2.5 py-1.5 text-purple-300 hover:text-rose-300 border border-purple-700/40 transition-all"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Sacred Iconography Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="rounded-2xl border border-amber-900/40 bg-slate-900/60 p-3.5 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300">
                  <Star className="h-4 w-4 text-amber-400" />
                  <span>Star Scepter of Divine Illumination</span>
                </div>
                <p className="text-[11px] text-purple-200/90 leading-relaxed">
                  Held in his right hand, the radiant 8-pointed celestial star staff channels epiphanies, sudden creative breakthroughs, and clears intellectual blockages.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-900/40 bg-slate-900/60 p-3.5 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300">
                  <BookOpen className="h-4 w-4 text-amber-400" />
                  <span>Sacred Grimoire of the All-Seeing Eye</span>
                </div>
                <p className="text-[11px] text-purple-200/90 leading-relaxed">
                  The ancient leather-bound grimoire and open book of celestial geometry hold sacred blueprints, cosmic laws, and divine problem-solving secrets.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-900/40 bg-slate-900/60 p-3.5 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300">
                  <Flame className="h-4 w-4 text-amber-400" />
                  <span>Pose of Mental Clarity & Discernment</span>
                </div>
                <p className="text-[11px] text-purple-200/90 leading-relaxed">
                  Uriel gently touches his temple, awakening higher intellect, serene focus, and transmuting confusion or anxious thoughts into calm divine certainty.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-900/40 bg-slate-900/60 p-3.5 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>Floating Quartz Crystal Mountain</span>
                </div>
                <p className="text-[11px] text-purple-200/90 leading-relaxed">
                  Massive raw clear quartz crystal spires and floating prisms amplify spiritual grounding and anchor celestial light into practical physical reality.
                </p>
              </div>
            </div>

            {/* Sacred Invocation Decree */}
            <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-purple-950/30 to-amber-500/10 p-3.5 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Sacred Uriel Invocation
              </span>
              <p className="font-serif text-xs sm:text-sm italic text-amber-200">
                "Archangel Uriel, ignite the flame of divine wisdom within my consciousness. Shed light on my path and turn all confusion into calm, grounded clarity."
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
