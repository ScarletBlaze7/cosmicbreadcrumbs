import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Maximize2, Feather, X, Upload, RotateCcw, Image as ImageIcon, Heart, Compass, Star } from 'lucide-react';

interface ArchangelChamuelArtworkProps {
  variant?: 'card-banner' | 'temple-featured' | 'compact' | 'hero';
  className?: string;
  allowZoom?: boolean;
  showCaption?: boolean;
}

export const ChamuelSvgArtwork: React.FC = () => (
  <svg
    viewBox="0 0 960 540"
    className="h-full w-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Heavenly Rose-Gold and Sunset Cloudscape */}
      <radialGradient id="chamuelSkyGlow" cx="60%" cy="35%" r="90%">
        <stop offset="0%" stopColor="#fff1f2" />
        <stop offset="25%" stopColor="#fecdd3" stopOpacity="0.95" />
        <stop offset="55%" stopColor="#fda4af" stopOpacity="0.8" />
        <stop offset="75%" stopColor="#f43f5e" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#881337" stopOpacity="0.95" />
      </radialGradient>

      {/* Radiant Sunset Halo */}
      <radialGradient id="chamuelHalo" cx="55%" cy="25%" r="45%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="35%" stopColor="#ffe4e6" stopOpacity="0.95" />
        <stop offset="65%" stopColor="#fb7185" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#e11d48" stopOpacity="0" />
      </radialGradient>

      {/* Radiant Platinum-Silver Hair */}
      <linearGradient id="chamuelSilverHair" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#fff1f2" />
        <stop offset="65%" stopColor="#e2e8f0" />
        <stop offset="85%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>

      {/* Rose Gold & Imperial Gold for Scepter and Crown */}
      <linearGradient id="roseGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff5f5" />
        <stop offset="25%" stopColor="#fde047" />
        <stop offset="55%" stopColor="#fb7185" />
        <stop offset="85%" stopColor="#e11d48" />
        <stop offset="100%" stopColor="#881337" />
      </linearGradient>

      {/* Pure Radiant Gold */}
      <linearGradient id="chamuelPureGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#fef08a" />
        <stop offset="60%" stopColor="#eab308" />
        <stop offset="85%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>

      {/* Flowing Pastel Rose Toga / Chiton */}
      <linearGradient id="chamuelRoseSilk" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff1f2" />
        <stop offset="25%" stopColor="#ffe4e6" />
        <stop offset="55%" stopColor="#fecdd3" />
        <stop offset="85%" stopColor="#fda4af" />
        <stop offset="100%" stopColor="#f43f5e" />
      </linearGradient>

      {/* Rose Quartz Translucent Crystals */}
      <linearGradient id="roseQuartzFacetA" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="35%" stopColor="#ffe4e6" stopOpacity="0.85" />
        <stop offset="70%" stopColor="#fecdd3" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#fb7185" stopOpacity="0.85" />
      </linearGradient>

      <linearGradient id="roseQuartzFacetB" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fecdd3" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#fda4af" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#e11d48" stopOpacity="0.7" />
      </linearGradient>

      {/* Embossed Rose-Pink Leather Grimoire */}
      <linearGradient id="roseLeatherBook" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fda4af" />
        <stop offset="35%" stopColor="#f43f5e" />
        <stop offset="70%" stopColor="#be123c" />
        <stop offset="100%" stopColor="#881337" />
      </linearGradient>

      {/* Muscular Radiant Skin Tone */}
      <linearGradient id="chamuelSkin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff1e6" />
        <stop offset="35%" stopColor="#f8d7c4" />
        <stop offset="70%" stopColor="#d99f84" />
        <stop offset="100%" stopColor="#9e6650" />
      </linearGradient>

      {/* Coral-Pink Clouds Gradient */}
      <linearGradient id="coralClouds" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffe4e6" stopOpacity="0.95" />
        <stop offset="35%" stopColor="#fda4af" stopOpacity="0.7" />
        <stop offset="70%" stopColor="#e11d48" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#4c0519" stopOpacity="0.85" />
      </linearGradient>

      {/* Glow Filter */}
      <filter id="chamuelGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      {/* Heart Scepter Flare */}
      <filter id="heartFlare" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="7" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* BACKGROUND: ROSE-GOLD HEAVENLY SUNSET SKY */}
    <rect width="960" height="540" fill="url(#chamuelSkyGlow)" />

    {/* BACKGROUND SUNBURST / DIVINE LOVE AURA */}
    <circle cx="580" cy="180" r="240" fill="url(#chamuelHalo)" opacity="0.85" />
    <circle cx="580" cy="170" r="140" fill="#ffffff" opacity="0.35" filter="url(#chamuelGlow)" />

    {/* BILLOWING AMBIENT CORAL-ROSE CLOUDS (BACKGROUND) */}
    <g opacity="0.65">
      <path d="M-50 180 C40 120 160 140 240 200 C320 150 440 160 520 220 C620 150 750 160 830 230 C900 150 990 170 1020 240 L1020 540 L-50 540 Z" fill="url(#coralClouds)" />
      <path d="M-60 300 C60 230 200 250 300 310 C400 240 540 250 630 320 C730 250 860 260 940 330 C1000 270 1050 300 1050 540 L-60 540 Z" fill="#ffe4e6" opacity="0.4" />
    </g>

    {/* FLOATING ROSE QUARTZ CRYSTAL PRISMS (SKY) */}
    {/* Floating Crystal 1 (Far Left Top) */}
    <g transform="translate(78, 340) rotate(-18)">
      <polygon points="0,-40 12,-15 12,25 0,40 -12,25 -12,-15" fill="url(#roseQuartzFacetA)" stroke="#ffffff" strokeWidth="1" />
      <polygon points="0,-40 12,-15 0,35 -12,-15" fill="url(#roseQuartzFacetB)" opacity="0.8" />
      <circle cx="0" cy="0" r="2.5" fill="#ffffff" filter="url(#chamuelGlow)" />
    </g>

    {/* Floating Crystal 2 (Left Mid Sky) */}
    <g transform="translate(172, 455) rotate(15)">
      <polygon points="0,-45 14,-18 14,30 0,45 -14,30 -14,-18" fill="url(#roseQuartzFacetA)" stroke="#ffffff" strokeWidth="1.2" />
      <polygon points="0,-45 14,-18 0,40 -14,-18" fill="url(#roseQuartzFacetB)" opacity="0.85" />
    </g>

    {/* Floating Crystal 3 (Left Small) */}
    <g transform="translate(248, 500) rotate(-8) scale(0.7)">
      <polygon points="0,-35 10,-12 10,20 0,35 -10,20 -10,-12" fill="url(#roseQuartzFacetA)" stroke="#ffffff" strokeWidth="1" />
    </g>

    {/* Floating Crystal 4 (Right Mid) */}
    <g transform="translate(712, 640) rotate(12) scale(0.9)">
      <polygon points="0,-40 12,-15 12,25 0,40 -12,25 -12,-15" fill="url(#roseQuartzFacetA)" stroke="#ffffff" strokeWidth="1" />
    </g>

    {/* Floating Raw Rose Quartz Stone Island (Right) */}
    <g transform="translate(825, 485) scale(0.9)">
      <path d="M-25 -20 C-10 -35 25 -30 35 -10 C45 10 30 35 10 38 C-15 40 -35 20 -35 -5 Z" fill="#fda4af" stroke="#f43f5e" strokeWidth="1.5" />
      <path d="M-18 -12 C-5 -25 18 -20 25 -5 C32 10 20 25 5 28 C-12 30 -25 15 -25 -2 Z" fill="#fff1f2" opacity="0.9" />
      <polygon points="0,-12 8,-5 3,8 -6,4" fill="url(#roseQuartzFacetA)" />
      <circle cx="2" cy="0" r="2" fill="#ffffff" filter="url(#chamuelGlow)" />
    </g>

    {/* FLOATING RADIANT GOLDEN HEART-IN-SUNBURST TALISMANS */}
    {/* Talisman 1 (Far Left) */}
    <g transform="translate(210, 420)">
      {/* 8-Ray Golden Starburst */}
      <path d="M0 -15 L3 -4 L14 0 L3 4 L0 15 L-3 4 L-14 0 L-3 -4 Z" fill="url(#roseGold)" filter="url(#chamuelGlow)" />
      {/* Radiant Pink Gem Heart */}
      <path d="M0 -4 C-2 -7 -6 -7 -7 -4 C-8 -1 -3 3 0 6 C3 3 8 -1 7 -4 C6 -7 2 -7 0 -4 Z" fill="#f43f5e" stroke="#ffffff" strokeWidth="0.8" />
    </g>

    {/* Talisman 2 (Mid Right) */}
    <g transform="translate(768, 445) scale(0.85)">
      <path d="M0 -15 L3 -4 L14 0 L3 4 L0 15 L-3 4 L-14 0 L-3 -4 Z" fill="url(#roseGold)" filter="url(#chamuelGlow)" />
      <path d="M0 -4 C-2 -7 -6 -7 -7 -4 C-8 -1 -3 3 0 6 C3 3 8 -1 7 -4 C6 -7 2 -7 0 -4 Z" fill="#f43f5e" stroke="#ffffff" strokeWidth="0.8" />
    </g>

    {/* Talisman 3 (Far Right) */}
    <g transform="translate(895, 380) scale(1.1)">
      <path d="M0 -18 L4 -5 L18 0 L4 5 L0 18 L-4 5 L-18 0 L-4 -5 Z" fill="url(#roseGold)" filter="url(#chamuelGlow)" />
      <path d="M0 -5 C-3 -9 -8 -9 -9 -5 C-10 -1 -4 4 0 8 C4 4 10 -1 9 -5 C8 -9 3 -9 0 -5 Z" fill="#f43f5e" stroke="#ffffff" strokeWidth="1" />
      <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
    </g>

    {/* TWO CELESTIAL WHITE DOVES OF DIVINE PEACE & LOVE */}
    {/* Top Dove (Flying Upward Right) */}
    <g transform="translate(910, 535) scale(0.95)">
      {/* Dove Body */}
      <path d="M0 0 C15 -5 30 -5 42 2 C32 10 20 12 0 6 C-10 4 -15 2 0 0 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      {/* Left Wing (Spread High) */}
      <path d="M12 -2 C8 -25 -5 -40 -25 -45 C-18 -25 -5 -10 10 2 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
      {/* Right Wing */}
      <path d="M22 2 C28 -15 25 -30 12 -38 C14 -20 18 -8 20 4 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.8" />
      {/* Dove Tail */}
      <path d="M0 6 C-12 12 -20 18 -25 24 C-16 16 -8 10 2 6 Z" fill="#f8fafc" />
      {/* Beak & Eye */}
      <polygon points="42,2 48,3 44,5" fill="#f59e0b" />
      <circle cx="38" cy="1" r="1" fill="#0f172a" />
    </g>

    {/* Lower Dove (Banking Leftwards) */}
    <g transform="translate(790, 625) scale(1.1)">
      {/* Dove Body */}
      <path d="M0 0 C16 -6 32 -6 44 2 C34 10 22 13 0 7 C-10 4 -15 2 0 0 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      {/* Wings */}
      <path d="M14 -2 C10 -28 -4 -44 -26 -48 C-18 -26 -4 -10 12 2 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
      <path d="M24 2 C30 -16 28 -32 15 -40 C17 -22 20 -9 22 4 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.8" />
      <polygon points="44,2 50,3 46,5" fill="#f59e0b" />
      <circle cx="40" cy="1" r="1" fill="#0f172a" />
    </g>

    {/* MASSIVE SWEEPING ARCHANGEL WINGS */}
    {/* LEFT WING (BEHIND HEAD & TORSO) */}
    <g>
      <path
        d="M480 150 C380 40 230 10 95 140 C55 175 65 210 155 215 C75 220 90 265 185 260 C105 270 125 315 215 300 C145 320 185 365 275 335 C225 360 275 400 355 355 C395 325 435 240 480 160 Z"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="2"
      />
      {/* Wing Layered Feathers Shadow & Highlights */}
      <path d="M470 140 C370 70 250 75 140 165" stroke="#fda4af" strokeWidth="2.5" fill="none" opacity="0.6" />
      <path d="M460 165 C370 115 270 125 190 205" stroke="#fda4af" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M450 195 C370 165 295 185 245 255" stroke="#cbd5e1" strokeWidth="1.8" fill="none" opacity="0.7" />
    </g>

    {/* RIGHT WING (SPREAD TOWARD HEAVEN) */}
    <g>
      <path
        d="M520 140 C600 60 700 80 650 160 C700 135 690 190 620 215 C660 200 640 250 580 270 C545 235 530 180 520 140 Z"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="2"
      />
      <path d="M530 135 C590 85 660 105 620 165" stroke="#fda4af" strokeWidth="2" fill="none" opacity="0.5" />
    </g>

    {/* MASSIVE BASE: ROSE QUARTZ SPIRES & FLOATING ROCK OUTCROPS */}
    <g id="roseQuartzBase">
      {/* Giant Rose Quartz Cluster Far Left */}
      <polygon points="0,540 10,430 45,395 85,540" fill="url(#roseQuartzFacetA)" stroke="#ffffff" strokeWidth="1.5" />
      <polygon points="45,395 85,540 140,540 95,445" fill="url(#roseQuartzFacetB)" opacity="0.9" />
      <polygon points="90,540 145,430 195,465 170,540" fill="url(#roseQuartzFacetA)" opacity="0.95" />

      {/* Giant Cluster Mid Left */}
      <polygon points="170,540 210,480 250,510 230,540" fill="url(#roseQuartzFacetB)" />
      <polygon points="250,510 290,460 330,490 310,540" fill="url(#roseQuartzFacetA)" />

      {/* Giant Rose Quartz Spire Peaks Rising in Center/Right Base */}
      <polygon points="380,540 445,420 480,455 450,540" fill="url(#roseQuartzFacetA)" stroke="#ffffff" strokeWidth="1.5" />
      <polygon points="480,455 520,390 565,430 535,540" fill="url(#roseQuartzFacetB)" opacity="0.9" />
      <polygon points="565,430 600,440 645,510 610,540" fill="url(#roseQuartzFacetA)" />

      {/* Giant Rose Quartz Spires Far Right */}
      <polygon points="820,540 865,410 910,445 880,540" fill="url(#roseQuartzFacetB)" opacity="0.9" />
      <polygon points="910,445 940,370 960,400 960,540" fill="url(#roseQuartzFacetA)" stroke="#ffffff" strokeWidth="1.5" />
    </g>

    {/* DYNAMIC LEAPING / SOARING ARCHANGEL CHAMUEL BODY */}
    {/* Muscular Trailing Left Leg (Extended in Flight) */}
    <g id="leftLeg">
      <path
        d="M440 370 C410 410 360 450 310 490 C290 505 275 515 285 520 C295 522 315 505 345 470 C385 425 430 385 455 365 Z"
        fill="url(#chamuelSkin)"
      />
      {/* Muscular Calf & Foot Definition */}
      <path d="M310 490 C295 502 280 512 282 525 C290 535 305 520 325 495" fill="url(#chamuelSkin)" />
    </g>

    {/* Forward Right Leg (Bent in Athletic Flight Leap) */}
    <g id="rightLeg">
      <path
        d="M480 370 C520 405 555 440 545 465 C535 485 500 480 465 470 C430 460 420 435 420 420 C425 405 450 380 480 370 Z"
        fill="url(#chamuelSkin)"
      />
      {/* Lower Right Leg & Foot */}
      <path
        d="M545 465 C540 485 515 510 480 525 C450 535 435 530 430 520 C430 510 445 500 470 485 C495 470 525 465 545 465 Z"
        fill="url(#chamuelSkin)"
      />
    </g>

    {/* FLUTTERING ROSE-PINK DRAPERY & SILK SASH */}
    <g id="roseSilkChiton">
      {/* Billowing Back Fabric Tail */}
      <path
        d="M420 330 C350 315 280 300 240 360 C270 385 340 395 410 360 Z"
        fill="url(#chamuelRoseSilk)"
        stroke="#f43f5e"
        strokeWidth="1.2"
      />
      <path
        d="M380 360 C320 380 260 385 240 420 C290 425 360 410 420 375 Z"
        fill="url(#chamuelRoseSilk)"
        stroke="#fda4af"
        strokeWidth="1.2"
      />
      <path
        d="M420 360 C370 420 330 460 390 470 C440 460 470 410 480 370 Z"
        fill="url(#chamuelRoseSilk)"
        stroke="#f43f5e"
        strokeWidth="1"
      />

      {/* Main Chiton across Waist and Thighs */}
      <path
        d="M460 280 C490 290 550 285 565 330 C550 365 520 390 480 390 C450 390 430 365 440 330 Z"
        fill="url(#chamuelRoseSilk)"
        stroke="#f43f5e"
        strokeWidth="1.5"
      />
      {/* Golden Cinch / Belt of Sacred Union */}
      <path d="M470 290 C510 305 540 295 560 285" stroke="url(#roseGold)" strokeWidth="3.5" fill="none" />
      <circle cx="515" cy="298" r="4" fill="url(#chamuelPureGold)" />
    </g>

    {/* MUSCULAR ATHLETIC TORSO */}
    <g id="torso">
      <path
        d="M470 190 C505 195 560 190 580 230 C585 260 565 295 535 305 C495 315 460 300 445 270 C440 240 450 205 470 190 Z"
        fill="url(#chamuelSkin)"
      />
      {/* Pectorals & Abs Definition */}
      <path d="M490 225 C515 240 540 238 565 220" stroke="#9e6650" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M530 215 L530 280" stroke="#9e6650" strokeWidth="1.5" fill="none" opacity="0.5" />
      <line x1="510" y1="255" x2="550" y2="255" stroke="#9e6650" strokeWidth="1.2" opacity="0.4" />
      <line x1="515" y1="272" x2="545" y2="272" stroke="#9e6650" strokeWidth="1.2" opacity="0.4" />

      {/* Shoulder Sash Draped over left shoulder */}
      <path
        d="M545 195 C570 210 585 245 575 285 C560 285 550 255 530 220 Z"
        fill="url(#chamuelRoseSilk)"
        stroke="url(#roseGold)"
        strokeWidth="1.5"
      />
    </g>

    {/* RIGHT ARM: HOLDING EMBOSSED SACRED ROSE-LEATHER GRIMOIRE */}
    <g id="rightArmAndBook">
      {/* Right Shoulder & Bicep */}
      <path
        d="M470 195 C435 220 415 255 425 290 C445 295 465 275 475 245 Z"
        fill="url(#chamuelSkin)"
      />
      {/* Forearm hugging the book */}
      <path
        d="M425 290 C435 315 465 325 490 315 C485 295 465 280 445 285 Z"
        fill="url(#chamuelSkin)"
      />

      {/* SACRED GRIMOIRE OF SOULMATES & HEART HEALING (TUCKED UNDER ARM) */}
      <g transform="translate(415, 235) rotate(18)">
        {/* Book Body */}
        <rect x="0" y="0" width="80" height="105" rx="7" fill="url(#roseLeatherBook)" stroke="#fb7185" strokeWidth="2" />
        
        {/* Spine Ribs */}
        <line x1="0" y1="22" x2="8" y2="22" stroke="#fde047" strokeWidth="2" />
        <line x1="0" y1="52" x2="8" y2="52" stroke="#fde047" strokeWidth="2" />
        <line x1="0" y1="82" x2="8" y2="82" stroke="#fde047" strokeWidth="2" />

        {/* Golden Corner Guards */}
        <polygon points="0,0 18,0 0,18" fill="url(#roseGold)" />
        <polygon points="80,0 62,0 80,18" fill="url(#roseGold)" />
        <polygon points="0,105 18,105 0,87" fill="url(#roseGold)" />
        <polygon points="80,105 62,105 80,87" fill="url(#roseGold)" />

        {/* Embossed Double Entwined Sacred Hearts on Book Cover */}
        <g transform="translate(40, 50)" stroke="#fde047" strokeWidth="1.5" fill="none">
          {/* Left Heart */}
          <path d="M-6 -4 C-9 -8 -15 -8 -16 -4 C-18 1 -11 6 -6 10 C-1 6 6 1 4 -4 C3 -8 -3 -8 -6 -4 Z" fill="#be123c" stroke="#fef08a" />
          {/* Right Heart (Intertwined) */}
          <path d="M6 -4 C3 -8 -3 -8 -4 -4 C-6 1 1 6 6 10 C11 6 18 1 16 -4 C15 -8 9 -8 6 -4 Z" fill="#f43f5e" stroke="#ffffff" opacity="0.9" />
          {/* Sacred Radiance Rays */}
          <line x1="0" y1="-12" x2="0" y2="-17" />
          <line x1="-10" y1="-10" x2="-14" y2="-14" />
          <line x1="10" y1="-10" x2="14" y2="-14" />
        </g>
      </g>
    </g>

    {/* LEFT ARM: EXTENDED FORWARD WIELDING THE SACRED HEART SCEPTER */}
    <g id="leftArmAndScepter">
      {/* Muscular Left Bicep & Shoulder */}
      <path
        d="M575 200 C625 210 670 215 710 230 C715 245 690 260 655 250 C620 240 580 235 565 220 Z"
        fill="url(#chamuelSkin)"
      />
      {/* Left Forearm & Hand Gripping Staff */}
      <path
        d="M710 230 C735 235 750 245 745 260 C730 270 710 265 695 255 Z"
        fill="url(#chamuelSkin)"
      />

      {/* SACRED HEART CADUCEUS SCEPTER OF UNCONDITIONAL LOVE */}
      <g id="chamuelScepter">
        {/* Golden Staff Rod */}
        <line x1="620" y1="520" x2="790" y2="150" stroke="url(#roseGold)" strokeWidth="6" strokeLinecap="round" />
        <line x1="620" y1="520" x2="790" y2="150" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />

        {/* Staff Golden Mounts & Knots */}
        <circle cx="650" cy="455" r="5" fill="url(#chamuelPureGold)" />
        <circle cx="705" cy="335" r="6" fill="url(#chamuelPureGold)" />
        <circle cx="760" cy="215" r="7" fill="url(#chamuelPureGold)" />

        {/* Entwined Golden Vine / Rose Caduceus Coils on Staff Top */}
        <path d="M745 250 Q770 210 755 180 Q780 150 765 125" stroke="url(#roseGold)" strokeWidth="4" fill="none" />

        {/* TOP EMBLEM: WINGED PINK HEART GEM & SCULPTED ROSES */}
        <g transform="translate(805, 115)">
          {/* Aura of Divine Radiance */}
          <circle cx="0" cy="0" r="35" fill="url(#chamuelHalo)" filter="url(#heartFlare)" />

          {/* Left Feathered Golden Wing */}
          <path d="M-8 0 C-22 -15 -38 -15 -48 5 C-32 5 -20 0 -8 0 Z" fill="url(#roseGold)" stroke="#ffffff" strokeWidth="1" />
          {/* Right Feathered Golden Wing */}
          <path d="M8 0 C22 -15 38 -15 48 5 C32 5 20 0 8 0 Z" fill="url(#roseGold)" stroke="#ffffff" strokeWidth="1" />

          {/* Two Sculpted Blooming Pink Roses Flanking Heart */}
          <g transform="translate(-18, -12) scale(0.65)">
            <circle cx="0" cy="0" r="10" fill="#f43f5e" />
            <path d="M-5 -2 Q0 -8 5 -2 Q8 4 0 7 Q-8 4 -5 -2 Z" fill="#fda4af" stroke="#ffffff" strokeWidth="1" />
          </g>
          <g transform="translate(18, -12) scale(0.65)">
            <circle cx="0" cy="0" r="10" fill="#f43f5e" />
            <path d="M-5 -2 Q0 -8 5 -2 Q8 4 0 7 Q-8 4 -5 -2 Z" fill="#fda4af" stroke="#ffffff" strokeWidth="1" />
          </g>

          {/* Glowing Rose Quartz Sacred Heart Centerpiece */}
          <path
            d="M0 -8 C-6 -16 -16 -16 -18 -8 C-20 2 -8 12 0 20 C8 12 20 2 18 -8 C16 -16 6 -16 0 -8 Z"
            fill="url(#roseQuartzFacetB)"
            stroke="#ffffff"
            strokeWidth="1.8"
            filter="url(#chamuelGlow)"
          />
          <circle cx="-5" cy="-7" r="3" fill="#ffffff" opacity="0.9" />
          <circle cx="0" cy="2" r="2" fill="#ffffff" filter="url(#chamuelGlow)" />
        </g>
      </g>
    </g>

    {/* NOBLE HEAD, PROFILE & FLOWING SILVER HAIR */}
    <g id="head">
      {/* Neck */}
      <path d="M530 170 L555 170 L560 205 L530 205 Z" fill="url(#chamuelSkin)" />

      {/* Noble Head Profile Looking Forward */}
      <path
        d="M555 115 C580 120 595 135 590 160 C585 180 565 190 545 185 C535 180 530 155 535 135 C540 120 545 115 555 115 Z"
        fill="url(#chamuelSkin)"
      />

      {/* Facial Features (Determined, Loving, Compassionate Eyes) */}
      <path d="M570 140 C578 137 586 140 588 143" stroke="#4c0519" strokeWidth="1.5" fill="none" />
      <path d="M575 147 C580 145 586 147 586 149" stroke="#4c0519" strokeWidth="1.5" fill="none" />
      <path d="M586 150 L592 160 L584 163" stroke="#9e6650" strokeWidth="1.2" fill="none" />
      <path d="M578 170 C585 171 590 170 592 168" stroke="#9e6650" strokeWidth="1.5" fill="none" />

      {/* FLOWING WAVY PLATINUM-SILVER HAIR */}
      <path
        d="M540 105 C560 90 600 90 615 110 C625 130 620 160 610 185 C600 175 605 145 595 130 C585 115 565 110 540 110 Z"
        fill="url(#chamuelSilverHair)"
      />
      <path
        d="M540 105 C520 120 515 155 515 190 C525 200 535 185 535 155 C535 130 530 115 540 105 Z"
        fill="url(#chamuelSilverHair)"
      />
      <path
        d="M580 100 C605 100 630 120 635 150 C640 180 625 215 615 240 C610 225 618 190 615 165 C610 135 595 110 580 100 Z"
        fill="url(#chamuelSilverHair)"
      />

      {/* ROYAL JEWELED ROSE-GOLD TIARA CROWN */}
      <path
        d="M545 125 C565 120 590 125 605 135"
        stroke="url(#roseGold)"
        strokeWidth="4"
        fill="none"
      />
      {/* Crown Rose Jewels */}
      <circle cx="555" cy="123" r="3" fill="#f43f5e" stroke="#ffffff" strokeWidth="0.8" />
      <circle cx="575" cy="122" r="3.5" fill="#ffffff" filter="url(#chamuelGlow)" />
      <circle cx="595" cy="128" r="3" fill="#f43f5e" stroke="#ffffff" strokeWidth="0.8" />
    </g>

    {/* FOREGROUND BILLOWING PINK & WHITE CLOUDS */}
    <g opacity="0.45">
      <path d="M-20 540 C80 470 200 480 290 515 C390 475 510 485 590 525 C690 475 830 485 930 525 C980 495 1020 515 1020 540 Z" fill="#fff1f2" />
    </g>
  </svg>
);

const LOCAL_STORAGE_CHAMUEL_KEY = 'archangel_chamuel_custom_photo';
const EVENT_CHAMUEL_PHOTO_CHANGED = 'archangel_chamuel_photo_updated';

export const ArchangelChamuelArtwork: React.FC<ArchangelChamuelArtworkProps> = ({
  variant = 'card-banner',
  className = '',
  allowZoom = true,
  showCaption = true,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [customPhoto, setCustomPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_CHAMUEL_KEY) || null;
    } catch {
      return null;
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_CHAMUEL_KEY);
        setCustomPhoto(stored || null);
      } catch {
        // ignore
      }
    };

    window.addEventListener(EVENT_CHAMUEL_PHOTO_CHANGED, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(EVENT_CHAMUEL_PHOTO_CHANGED, handleUpdate);
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
          localStorage.setItem(LOCAL_STORAGE_CHAMUEL_KEY, result);
          setCustomPhoto(result);
          window.dispatchEvent(new Event(EVENT_CHAMUEL_PHOTO_CHANGED));
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
      localStorage.removeItem(LOCAL_STORAGE_CHAMUEL_KEY);
      setCustomPhoto(null);
      window.dispatchEvent(new Event(EVENT_CHAMUEL_PHOTO_CHANGED));
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
        className={`group relative overflow-hidden rounded-2xl border border-rose-400/50 bg-slate-950 shadow-xl select-none transition-all duration-300 hover:border-rose-300 hover:shadow-rose-500/20 ${
          allowZoom ? 'cursor-pointer' : ''
        } ${containerStyles[variant]} ${className}`}
      >
        {/* Sacred Image or SVG Vector Graphic */}
        <div className="relative h-full w-full overflow-hidden bg-slate-950 flex items-center justify-center">
          {customPhoto ? (
            <img
              src={customPhoto}
              alt="Archangel Chamuel Exact Portrait"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <ChamuelSvgArtwork />
          )}

          {/* Vignette & Ambient Radial Glow Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
        </div>

        {/* Badges & Overlays */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center space-x-1.5 pointer-events-none">
          <span className="rounded-md bg-slate-950/80 px-2 py-0.5 text-[9px] font-bold tracking-wider text-rose-300 border border-rose-400/40 backdrop-blur-xs flex items-center space-x-1 shadow-md">
            <Heart className="h-3 w-3 text-rose-400" />
            <span>ARCHANGEL CHAMUEL</span>
          </span>
          <span className="rounded-md bg-rose-950/80 px-2 py-0.5 text-[9px] font-bold text-rose-200 border border-rose-500/40 backdrop-blur-xs hidden sm:inline-flex items-center space-x-1 shadow-md">
            <Sparkles className="h-3 w-3 text-rose-300" />
            <span>Winged Heart Scepter & Grimoire of Love</span>
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
            title="Upload/Select Exact Image File (1787215201558.jpg photo)"
            className="rounded-lg bg-slate-950/80 p-1.5 text-rose-300 hover:text-white hover:bg-rose-600/60 border border-rose-400/50 opacity-80 group-hover:opacity-100 transition-opacity backdrop-blur-xs shadow-md"
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
              className="rounded-lg bg-slate-950/80 p-1.5 text-purple-300 hover:text-rose-300 border border-purple-800/60 opacity-80 group-hover:opacity-100 transition-opacity backdrop-blur-xs shadow-md"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Bottom Sacred Legend / Caption */}
        {showCaption && (
          <div className="absolute bottom-2 inset-x-2 z-10 flex items-center justify-between rounded-xl bg-slate-950/85 px-3 py-1.5 border border-purple-900/60 backdrop-blur-xs text-[10px] text-purple-200">
            <div className="flex items-center space-x-1.5 font-medium text-rose-200 truncate">
              <Heart className="h-3 w-3 text-rose-400 shrink-0" />
              <span className="truncate">
                {customPhoto ? 'Custom Exact Portrait Active' : 'Unconditional Love, Soul Relationships & Peace'}
              </span>
            </div>
            <span className="text-[9px] text-purple-300/80 shrink-0 pl-2">
              {customPhoto ? 'Click to inspect / change' : 'Click to inspect or upload photo'}
            </span>
          </div>
        )}
      </div>

      {/* Lightbox / Zoom Modal for Archangel Chamuel Sacred Iconography */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full overflow-hidden rounded-3xl border-2 border-rose-400/50 bg-slate-950 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-rose-900/50 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-300 border border-rose-400/40">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-slate-100">
                    Archangel Chamuel • Sacred Portrait & Iconography
                  </h3>
                  <p className="text-[11px] text-rose-300/80">
                    Angel of Unconditional Divine Love, Heart Healing, Twin Harmony & Sacred Peace
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
            <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl border border-rose-400/40 bg-slate-950 flex items-center justify-center">
              {customPhoto ? (
                <img
                  src={customPhoto}
                  alt="Archangel Chamuel Full Sacred Art"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-contain"
                />
              ) : (
                <ChamuelSvgArtwork />
              )}
            </div>

            {/* Custom Photo Management Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl bg-slate-900/80 border border-purple-900/60 p-3 text-xs">
              <div className="flex items-center space-x-2 text-purple-200">
                <ImageIcon className="h-4 w-4 text-rose-300" />
                <span>
                  {customPhoto
                    ? 'Custom Archangel Chamuel portrait loaded in sanctuary memory.'
                    : 'Displaying sacred vector portrait.'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-1.5 rounded-xl bg-rose-500/20 px-3 py-1.5 font-semibold text-rose-200 border border-rose-400/40 hover:bg-rose-500/30 transition-all"
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
              <div className="rounded-2xl border border-rose-900/40 bg-slate-900/60 p-3.5 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-300">
                  <Heart className="h-4 w-4 text-rose-400" />
                  <span>Winged Heart & Blooming Rose Scepter</span>
                </div>
                <p className="text-[11px] text-purple-200/90 leading-relaxed">
                  Chamuel wields the golden caduceus crowned by a glowing rose quartz winged heart and blooming roses to radiate pure unconditional love and soften hardened feelings.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-900/40 bg-slate-900/60 p-3.5 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-300">
                  <Sparkles className="h-4 w-4 text-rose-400" />
                  <span>Embossed Grimoire of Soul Union</span>
                </div>
                <p className="text-[11px] text-purple-200/90 leading-relaxed">
                  Tucked beneath his arm is the sacred rose-leather tome embossed with intertwined hearts, containing soulmate blueprints and divine timing for deep, meaningful connections.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-900/40 bg-slate-900/60 p-3.5 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-300">
                  <Feather className="h-4 w-4 text-rose-400" />
                  <span>White Doves of Divine Peace</span>
                </div>
                <p className="text-[11px] text-purple-200/90 leading-relaxed">
                  Two graceful celestial doves soar beside Chamuel, bringing peaceful reconciliation, mutual forgiveness, and calming emotional storms.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-900/40 bg-slate-900/60 p-3.5 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-300">
                  <Star className="h-4 w-4 text-rose-400" />
                  <span>Rose Quartz Spires & Heart Talismans</span>
                </div>
                <p className="text-[11px] text-purple-200/90 leading-relaxed">
                  Raw rose quartz spires and floating golden heart-starbursts channel heart chakra healing, self-compassion, and attract harmonious synchronicities.
                </p>
              </div>
            </div>

            {/* Sacred Invocation Decree */}
            <div className="rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-500/10 via-purple-950/30 to-rose-500/10 p-3.5 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                Sacred Chamuel Invocation
              </span>
              <p className="font-serif text-xs sm:text-sm italic text-rose-200">
                "Archangel Chamuel, expand my heart with unconditional divine love. Guide me to find inner peace, heal all relationships, and align with my highest soul connections."
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
