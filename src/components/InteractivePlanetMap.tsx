import React, { useState, useEffect, useMemo } from 'react';
import { 
  Compass, 
  Sparkles, 
  RotateCw, 
  Sun, 
  Moon, 
  Globe2, 
  Eye, 
  Info, 
  ChevronRight, 
  Layers, 
  Play, 
  Pause, 
  Calendar, 
  Clock, 
  Zap, 
  Maximize2,
  Activity
} from 'lucide-react';
import { 
  PlanetaryPosition, 
  CelestialAspect, 
  getRealtimeAstrologicalMatrix,
  RealtimeAstrologicalMatrix
} from '../utils/nasaEphemeris';

interface InteractivePlanetMapProps {
  matrix?: RealtimeAstrologicalMatrix;
  onSelectPlanet?: (planet: PlanetaryPosition) => void;
  className?: string;
}

const ZODIAC_SECTORS = [
  { name: 'Aries', symbol: '♈', startDeg: 0, color: '#f97316', element: 'Fire' },
  { name: 'Taurus', symbol: '♉', startDeg: 30, color: '#10b981', element: 'Earth' },
  { name: 'Gemini', symbol: '♊', startDeg: 60, color: '#06b6d4', element: 'Air' },
  { name: 'Cancer', symbol: '♋', startDeg: 90, color: '#818cf8', element: 'Water' },
  { name: 'Leo', symbol: '♌', startDeg: 120, color: '#fbbf24', element: 'Fire' },
  { name: 'Virgo', symbol: '♍', startDeg: 150, color: '#34d399', element: 'Earth' },
  { name: 'Libra', symbol: '♎', startDeg: 180, color: '#38bdf8', element: 'Air' },
  { name: 'Scorpio', symbol: '♏', startDeg: 210, color: '#a855f7', element: 'Water' },
  { name: 'Sagittarius', symbol: '♐', startDeg: 240, color: '#f59e0b', element: 'Fire' },
  { name: 'Capricorn', symbol: '♑', startDeg: 270, color: '#059669', element: 'Earth' },
  { name: 'Aquarius', symbol: '♒', startDeg: 300, color: '#0ea5e9', element: 'Air' },
  { name: 'Pisces', symbol: '♓', startDeg: 330, color: '#c084fc', element: 'Water' }
];

// Planet Visual Scales (Radius in pixels on the 680x680 SVG canvas)
const PLANET_SCALES: Record<string, number> = {
  sun: 28,
  jupiter: 24,
  saturn: 22,
  moon: 18,
  earth: 18,
  venus: 17,
  mars: 16,
  uranus: 18,
  neptune: 18,
  mercury: 14,
  pluto: 12,
  northnode: 14,
  chiron: 13,
};

const ORBIT_RADII: Record<string, number> = {
  sun: 0,
  mercury: 65,
  venus: 90,
  moon: 120,
  mars: 150,
  jupiter: 185,
  saturn: 220,
  uranus: 255,
  neptune: 285,
  pluto: 310,
  northnode: 325,
  chiron: 340,
};

export const InteractivePlanetMap: React.FC<InteractivePlanetMapProps> = ({
  matrix: propMatrix,
  onSelectPlanet,
  className = ''
}) => {
  const [targetDate, setTargetDate] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(true);
  const [viewMode, setViewMode] = useState<'zodiac' | 'orbits'>('zodiac');
  const [showAspectLines, setShowAspectLines] = useState(true);
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('sun');
  const [isPlaying, setIsPlaying] = useState(false);

  // Compute live matrix when targetDate changes or use prop
  const currentMatrix = useMemo(() => {
    if (isLive && propMatrix) return propMatrix;
    return getRealtimeAstrologicalMatrix(targetDate);
  }, [isLive, targetDate, propMatrix]);

  const { planets, activeAspects, spaceWeather } = currentMatrix;

  const selectedPlanet = useMemo(() => {
    return planets.find((p) => p.id === selectedPlanetId) || planets[0];
  }, [planets, selectedPlanetId]);

  // Live real-time tick when in live mode
  useEffect(() => {
    if (!isLive) return;
    const timer = setInterval(() => {
      setTargetDate(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, [isLive]);

  // Time simulation playback
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTargetDate((prev) => new Date(prev.getTime() + 1000 * 60 * 60 * 6)); // Step 6 hours per tick
    }, 250);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlanetClick = (planet: PlanetaryPosition) => {
    setSelectedPlanetId(planet.id);
    if (onSelectPlanet) {
      onSelectPlanet(planet);
    }
  };

  const handleJumpDays = (days: number) => {
    setIsLive(false);
    setIsPlaying(false);
    setTargetDate((prev) => new Date(prev.getTime() + days * 86400000));
  };

  const handleResetToLive = () => {
    setIsLive(true);
    setIsPlaying(false);
    setTargetDate(new Date());
  };

  // SVG Chart Geometry
  const size = 700;
  const center = size / 2;
  const outerRadius = center - 20; // 330
  const innerRadius = 240;
  const wheelCenterRadius = 75;

  // Convert longitude (0° Aries at 9 o'clock / 180° SVG) to Cartesian (x, y)
  const getCoordinatesForDegree = (deg: number, radius: number) => {
    const angleRad = ((180 - deg) * Math.PI) / 180;
    const x = center + radius * Math.cos(angleRad);
    const y = center - radius * Math.sin(angleRad);
    return { x, y };
  };

  // Generate deterministic stars for realistic deep-space background
  const backgroundStars = useMemo(() => {
    const stars = [];
    for (let i = 0; i < 90; i++) {
      const angle = (i * 137.5 * Math.PI) / 180;
      const dist = 30 + Math.sqrt(i / 90) * (outerRadius - 10);
      const x = center + dist * Math.cos(angle);
      const y = center + dist * Math.sin(angle);
      const r = (i % 5 === 0 ? 1.8 : i % 2 === 0 ? 1.2 : 0.8);
      const opacity = 0.3 + ((i * 17) % 70) / 100;
      stars.push({ x, y, r, opacity });
    }
    return stars;
  }, [center, outerRadius]);

  return (
    <div className={`space-y-4 rounded-3xl border border-purple-800/60 bg-[#060511]/95 p-4 sm:p-6 shadow-2xl backdrop-blur-xl ${className}`}>
      
      {/* Top Map Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-900/60 pb-4">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLive ? 'bg-cyan-400 opacity-75' : 'bg-amber-400 opacity-75'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-cyan-500' : 'bg-amber-500'}`} />
            </span>
            <span className="font-mono text-[10px] font-bold tracking-widest text-cyan-300 uppercase">
              {isLive ? 'LIVE NASA CELESTIAL RADAR' : 'HISTORICAL / SIMULATED SKY'}
            </span>
            <span className="rounded-full bg-cyan-950/80 border border-cyan-700/60 px-2 py-0.5 font-mono text-[9px] text-cyan-300 font-bold">
              3D REALISTIC
            </span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-100 flex items-center space-x-2">
            <span>Realistic 360° Planetary Sky Radar</span>
          </h3>
          <p className="text-xs text-purple-200/80">
            Click any realistic planet sphere to inspect its live coordinates, orbital speed, distance, and astrological meaning.
          </p>
        </div>

        {/* View Toggle & Energy Line Switch */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex rounded-xl bg-purple-950/80 p-1 border border-purple-800/60">
            <button
              onClick={() => setViewMode('zodiac')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'zodiac'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              🌌 Zodiac Wheel
            </button>
            <button
              onClick={() => setViewMode('orbits')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'orbits'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              🪐 Solar Orbit System
            </button>
          </div>

          <button
            onClick={() => setShowAspectLines(!showAspectLines)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition-all cursor-pointer ${
              showAspectLines 
                ? 'bg-purple-900/80 border-amber-400 text-amber-300 shadow-md' 
                : 'bg-slate-950 border-purple-900/60 text-purple-400'
            }`}
            title="Toggle geometric connection energy lines between planets"
          >
            ✨ Energy Rays: {showAspectLines ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Main Interactive Map & Planet Spotlight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: Realistic SVG Sky Map (8 Cols) */}
        <div className="lg:col-span-8 relative flex flex-col items-center justify-center rounded-3xl border-2 border-purple-800/70 bg-gradient-to-b from-[#0e0a24] via-[#080617] to-[#030209] p-3 sm:p-5 overflow-hidden shadow-2xl">
          
          {/* Deep Space Cosmic Nebulae Ambiance */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl animate-pulse" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-600/20 blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* SVG Map Canvas */}
          <div className="w-full max-w-[620px] aspect-square relative flex items-center justify-center select-none">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full drop-shadow-[0_0_35px_rgba(168,85,247,0.3)]"
            >
              <defs>
                {/* Center Core Glow */}
                <radialGradient id="centerCoreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
                  <stop offset="35%" stopColor="#c084fc" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#04030a" stopOpacity="0" />
                </radialGradient>

                {/* --- 3D REALISTIC PLANETARY SPHERE SHADERS --- */}

                {/* 1. SUN: Blazing Solar Plasma Sphere */}
                <radialGradient id="sunRealistic" cx="38%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#FFFBEB" />
                  <stop offset="25%" stopColor="#FDE047" />
                  <stop offset="60%" stopColor="#F59E0B" />
                  <stop offset="85%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#B45309" />
                </radialGradient>

                {/* 2. MOON: Realistic Cratered Silver Sphere */}
                <radialGradient id="moonRealistic" cx="35%" cy="32%" r="65%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="30%" stopColor="#E2E8F0" />
                  <stop offset="70%" stopColor="#94A3B8" />
                  <stop offset="90%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#1E293B" />
                </radialGradient>

                {/* 3. MERCURY: Metallic Slate Crater Sphere */}
                <radialGradient id="mercuryRealistic" cx="35%" cy="32%" r="65%">
                  <stop offset="0%" stopColor="#CBD5E1" />
                  <stop offset="40%" stopColor="#94A3B8" />
                  <stop offset="80%" stopColor="#64748B" />
                  <stop offset="100%" stopColor="#334155" />
                </radialGradient>

                {/* 4. VENUS: Golden Sulfuric Cloud Sphere */}
                <radialGradient id="venusRealistic" cx="35%" cy="32%" r="65%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="35%" stopColor="#FBBF24" />
                  <stop offset="70%" stopColor="#EA580C" />
                  <stop offset="95%" stopColor="#9A3412" />
                  <stop offset="100%" stopColor="#7C2D12" />
                </radialGradient>

                {/* 5. EARTH: Azure Oceans & Swirling Clouds */}
                <radialGradient id="earthRealistic" cx="35%" cy="32%" r="65%">
                  <stop offset="0%" stopColor="#BAE6FD" />
                  <stop offset="25%" stopColor="#38BDF8" />
                  <stop offset="55%" stopColor="#0284C7" />
                  <stop offset="80%" stopColor="#1E3A8A" />
                  <stop offset="100%" stopColor="#0F172A" />
                </radialGradient>

                {/* 6. MARS: Rusty Red Ochre Canyon Sphere */}
                <radialGradient id="marsRealistic" cx="35%" cy="32%" r="65%">
                  <stop offset="0%" stopColor="#FCA5A5" />
                  <stop offset="30%" stopColor="#EF4444" />
                  <stop offset="70%" stopColor="#B91C1C" />
                  <stop offset="90%" stopColor="#7F1D1D" />
                  <stop offset="100%" stopColor="#450A0A" />
                </radialGradient>

                {/* 7. JUPITER: Giant Gas Bands & Red Spot */}
                <radialGradient id="jupiterRealistic" cx="35%" cy="32%" r="65%">
                  <stop offset="0%" stopColor="#FED7AA" />
                  <stop offset="30%" stopColor="#FB923C" />
                  <stop offset="65%" stopColor="#C2410C" />
                  <stop offset="90%" stopColor="#7C2D12" />
                  <stop offset="100%" stopColor="#431407" />
                </radialGradient>

                {/* 8. SATURN: Golden Gas Sphere */}
                <radialGradient id="saturnRealistic" cx="35%" cy="32%" r="65%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="35%" stopColor="#EAB308" />
                  <stop offset="70%" stopColor="#CA8A04" />
                  <stop offset="90%" stopColor="#854D0E" />
                  <stop offset="100%" stopColor="#422006" />
                </radialGradient>

                {/* 9. URANUS: Aquamarine Ice Giant */}
                <radialGradient id="uranusRealistic" cx="35%" cy="32%" r="65%">
                  <stop offset="0%" stopColor="#A5F3FC" />
                  <stop offset="35%" stopColor="#22D3EE" />
                  <stop offset="70%" stopColor="#0891B2" />
                  <stop offset="90%" stopColor="#164E63" />
                  <stop offset="100%" stopColor="#083344" />
                </radialGradient>

                {/* 10. NEPTUNE: Deep Cobalt Azure */}
                <radialGradient id="neptuneRealistic" cx="35%" cy="32%" r="65%">
                  <stop offset="0%" stopColor="#818CF8" />
                  <stop offset="35%" stopColor="#4F46E5" />
                  <stop offset="70%" stopColor="#3730A3" />
                  <stop offset="90%" stopColor="#1E1B4B" />
                  <stop offset="100%" stopColor="#0F0E26" />
                </radialGradient>

                {/* 11. PLUTO: Charcoal & Frost Ice */}
                <radialGradient id="plutoRealistic" cx="35%" cy="32%" r="65%">
                  <stop offset="0%" stopColor="#E9D5FF" />
                  <stop offset="35%" stopColor="#A855F7" />
                  <stop offset="70%" stopColor="#6B21A8" />
                  <stop offset="90%" stopColor="#3B0764" />
                  <stop offset="100%" stopColor="#1C053A" />
                </radialGradient>

                {/* 12. NORTH NODE & CHIRON: Quantum Beacon */}
                <radialGradient id="nodeRealistic" cx="35%" cy="32%" r="65%">
                  <stop offset="0%" stopColor="#99F6E4" />
                  <stop offset="40%" stopColor="#14B8A6" />
                  <stop offset="80%" stopColor="#0F766E" />
                  <stop offset="100%" stopColor="#134E4A" />
                </radialGradient>

                {/* Aspect Rays Gradients */}
                <linearGradient id="rayTrine" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="raySextile" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="rayOpp" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#E11D48" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="raySquare" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C084FC" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#9333EA" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Deep Space Background Outer Ring */}
              <circle
                cx={center}
                cy={center}
                r={outerRadius}
                fill="#04030B"
                stroke="#4C2889"
                strokeWidth="2.5"
              />

              {/* Twinkling Background Starfield */}
              <g id="starfield">
                {backgroundStars.map((star, idx) => (
                  <circle
                    key={idx}
                    cx={star.x}
                    cy={star.y}
                    r={star.r}
                    fill="#FFFFFF"
                    opacity={star.opacity}
                  />
                ))}
              </g>

              {/* Inner Coordinate Ring */}
              <circle
                cx={center}
                cy={center}
                r={innerRadius}
                fill="none"
                stroke="#3B2569"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Orbit Mode: Planetary Track Rings */}
              {viewMode === 'orbits' && (
                <g id="planetary-orbit-tracks">
                  {Object.entries(ORBIT_RADII).map(([planetKey, r]) => {
                    if (r === 0) return null;
                    return (
                      <circle
                        key={planetKey}
                        cx={center}
                        cy={center}
                        r={r * 0.92}
                        fill="none"
                        stroke="#4C2889"
                        strokeWidth="1.2"
                        strokeDasharray="3 3"
                        opacity={0.8}
                      />
                    );
                  })}
                </g>
              )}

              {/* 12 Zodiac Houses Ring & High-Visibility Symbols (Zodiac Mode) */}
              {viewMode === 'zodiac' && (
                <g id="zodiac-wheel-sectors">
                  {ZODIAC_SECTORS.map((sector) => {
                    const p1 = getCoordinatesForDegree(sector.startDeg, outerRadius);
                    const p1Inner = getCoordinatesForDegree(sector.startDeg, innerRadius);
                    const midDeg = sector.startDeg + 15;
                    const textCoord = getCoordinatesForDegree(midDeg, (outerRadius + innerRadius) / 2);

                    return (
                      <g key={sector.name}>
                        {/* Sector boundary spoke */}
                        <line
                          x1={p1Inner.x}
                          y1={p1Inner.y}
                          x2={p1.x}
                          y2={p1.y}
                          stroke="#4C2889"
                          strokeWidth="1.5"
                        />

                        {/* Zodiac Symbol */}
                        <text
                          x={textCoord.x}
                          y={textCoord.y - 4}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={sector.color}
                          fontSize="17"
                          fontWeight="bold"
                          className="select-none font-serif filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                        >
                          {sector.symbol}
                        </text>

                        {/* Zodiac Constellation Name */}
                        <text
                          x={textCoord.x}
                          y={textCoord.y + 11}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#E2E8F0"
                          fontSize="8.5"
                          fontFamily="sans-serif"
                          fontWeight="bold"
                          className="select-none uppercase tracking-wider"
                        >
                          {sector.name}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Active Aspect Energy Rays */}
              {showAspectLines && (
                <g id="aspect-energy-lines">
                  {activeAspects.map((aspect, idx) => {
                    const p1 = planets.find(p => p.name.toLowerCase() === aspect.planet1.toLowerCase());
                    const p2 = planets.find(p => p.name.toLowerCase() === aspect.planet2.toLowerCase());
                    if (!p1 || !p2) return null;

                    const radius = viewMode === 'zodiac' ? innerRadius - 24 : 170;
                    const c1 = getCoordinatesForDegree(p1.longitude, radius);
                    const c2 = getCoordinatesForDegree(p2.longitude, radius);

                    let strokeColor = '#A855F7';
                    let strokeDash = 'none';

                    if (aspect.aspectName === 'Trine') {
                      strokeColor = 'url(#rayTrine)';
                    } else if (aspect.aspectName === 'Sextile') {
                      strokeColor = 'url(#raySextile)';
                      strokeDash = '4 3';
                    } else if (aspect.aspectName === 'Opposition') {
                      strokeColor = 'url(#rayOpp)';
                    } else if (aspect.aspectName === 'Square') {
                      strokeColor = 'url(#raySquare)';
                      strokeDash = '5 4';
                    }

                    const isHighlight = p1.id === selectedPlanetId || p2.id === selectedPlanetId;

                    return (
                      <line
                        key={idx}
                        x1={c1.x}
                        y1={c1.y}
                        x2={c2.x}
                        y2={c2.y}
                        stroke={strokeColor}
                        strokeWidth={isHighlight ? 3 : 1.4}
                        strokeDasharray={strokeDash}
                        opacity={isHighlight ? 1 : 0.6}
                        className="transition-all duration-300 filter drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                      />
                    );
                  })}
                </g>
              )}

              {/* Center Core: 3D Earth or Sun */}
              <circle
                cx={center}
                cy={center}
                r={wheelCenterRadius}
                fill="url(#centerCoreGlow)"
              />
              <circle
                cx={center}
                cy={center}
                r={26}
                fill={viewMode === 'zodiac' ? 'url(#earthRealistic)' : 'url(#sunRealistic)'}
                stroke="#FDE047"
                strokeWidth="2.5"
                className="filter drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]"
              />
              <text
                x={center}
                y={center + 38}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#FDE047"
                fontSize="9"
                fontWeight="black"
                className="font-mono uppercase tracking-widest select-none filter drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]"
              >
                {viewMode === 'zodiac' ? 'EARTH (0,0)' : 'SOL (CENTER)'}
              </text>

              {/* --- 🌟 PHOTOREALISTIC 3D PLANETS (LARGE & HIGH-VISIBILITY) --- */}
              <g id="interactive-planet-nodes">
                {planets.map((planet) => {
                  const radius = viewMode === 'zodiac' 
                    ? innerRadius - 24 
                    : (ORBIT_RADII[planet.id] || 160) * 0.92;
                  
                  const { x, y } = getCoordinatesForDegree(planet.longitude, radius);
                  const isSelected = planet.id === selectedPlanetId;
                  const pRadius = (PLANET_SCALES[planet.id] || 16) * (isSelected ? 1.25 : 1.0);

                  // Pick Realistic Shader
                  let shaderId = 'mercuryRealistic';
                  if (planet.id === 'sun') shaderId = 'sunRealistic';
                  else if (planet.id === 'moon') shaderId = 'moonRealistic';
                  else if (planet.id === 'venus') shaderId = 'venusRealistic';
                  else if (planet.id === 'mars') shaderId = 'marsRealistic';
                  else if (planet.id === 'jupiter') shaderId = 'jupiterRealistic';
                  else if (planet.id === 'saturn') shaderId = 'saturnRealistic';
                  else if (planet.id === 'uranus') shaderId = 'uranusRealistic';
                  else if (planet.id === 'neptune') shaderId = 'neptuneRealistic';
                  else if (planet.id === 'pluto') shaderId = 'plutoRealistic';
                  else if (planet.id === 'northnode' || planet.id === 'chiron') shaderId = 'nodeRealistic';

                  return (
                    <g
                      key={planet.id}
                      onClick={() => handlePlanetClick(planet)}
                      className="cursor-pointer group focus:outline-none"
                      tabIndex={0}
                    >
                      {/* 1. Luminous Atmospheric Corona Glow */}
                      <circle
                        cx={x}
                        cy={y}
                        r={pRadius * 1.8}
                        fill={planet.id === 'sun' ? '#F59E0B' : planet.id === 'mars' ? '#EF4444' : planet.id === 'venus' ? '#FBBF24' : '#38BDF8'}
                        opacity={isSelected ? 0.45 : 0.18}
                        className="animate-pulse"
                      />

                      {/* 2. Active Selection Pulsing Reticle */}
                      {isSelected && (
                        <circle
                          cx={x}
                          cy={y}
                          r={pRadius + 10}
                          fill="none"
                          stroke="#FDE047"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                          className="animate-spin"
                          style={{ transformOrigin: `${x}px ${y}px`, animationDuration: '6s' }}
                        />
                      )}

                      {/* 3. SATURN'S 3D TILTED RINGS (When Saturn) */}
                      {planet.id === 'saturn' && (
                        <g transform={`rotate(-25 ${x} ${y})`}>
                          <ellipse
                            cx={x}
                            cy={y}
                            rx={pRadius * 2.2}
                            ry={pRadius * 0.65}
                            fill="none"
                            stroke="#CA8A04"
                            strokeWidth="4"
                            opacity={0.85}
                          />
                          <ellipse
                            cx={x}
                            cy={y}
                            rx={pRadius * 1.7}
                            ry={pRadius * 0.45}
                            fill="none"
                            stroke="#FEF08A"
                            strokeWidth="1.5"
                            opacity={0.7}
                          />
                        </g>
                      )}

                      {/* 4. URANUS' ICE RINGS (When Uranus) */}
                      {planet.id === 'uranus' && (
                        <ellipse
                          cx={x}
                          cy={y}
                          rx={pRadius * 0.55}
                          ry={pRadius * 1.8}
                          fill="none"
                          stroke="#A5F3FC"
                          strokeWidth="1.2"
                          opacity={0.7}
                        />
                      )}

                      {/* 5. 3D REALISTIC PLANET SPHERE */}
                      <circle
                        cx={x}
                        cy={y}
                        r={pRadius}
                        fill={`url(#${shaderId})`}
                        stroke={isSelected ? '#FFFFFF' : '#000000'}
                        strokeWidth={isSelected ? 2 : 1}
                        className="group-hover:scale-115 transition-transform filter drop-shadow-[0_0_12px_rgba(0,0,0,0.9)]"
                        style={{ transformOrigin: `${x}px ${y}px` }}
                      />

                      {/* 6. HIGH-CONTRAST GLOWING PLANET NAMEPLATE BADGE */}
                      <g transform={`translate(${x}, ${y + pRadius + 14})`}>
                        <rect
                          x="-32"
                          y="-8"
                          width="64"
                          height="16"
                          rx="5"
                          fill={isSelected ? '#F59E0B' : '#090818'}
                          stroke={isSelected ? '#FFFFFF' : '#4C2889'}
                          strokeWidth={isSelected ? 1.5 : 1}
                          className="filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
                        />
                        <text
                          x="0"
                          y="0.5"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={isSelected ? '#000000' : '#F1F5F9'}
                          fontSize="8.5"
                          fontFamily="sans-serif"
                          fontWeight="900"
                          className="uppercase tracking-wider select-none"
                        >
                          {planet.name.substring(0, 6)} {planet.degrees}°
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Time Scrubber & Quick Simulation Controls */}
          <div className="w-full mt-4 pt-3.5 border-t border-purple-900/60 flex flex-wrap items-center justify-between gap-2 px-2 text-xs">
            <div className="flex items-center space-x-1.5 font-mono text-[11px] text-cyan-300">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              <span>{targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleJumpDays(-1)}
                className="rounded-lg bg-purple-950 hover:bg-purple-900 px-2.5 py-1 text-[11px] font-mono text-purple-200 border border-purple-800 transition-colors cursor-pointer"
                title="View Sky 24 Hours Ago"
              >
                -24h
              </button>
              <button
                onClick={() => handleJumpDays(1)}
                className="rounded-lg bg-purple-950 hover:bg-purple-900 px-2.5 py-1 text-[11px] font-mono text-purple-200 border border-purple-800 transition-colors cursor-pointer"
                title="View Sky 24 Hours Forward"
              >
                +24h
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`rounded-lg px-3 py-1 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isPlaying ? 'bg-rose-600 text-white shadow-md' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                <span>{isPlaying ? 'Pause' : 'Animate'}</span>
              </button>
              {!isLive && (
                <button
                  onClick={handleResetToLive}
                  className="rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3 py-1 text-[11px] font-bold text-white transition-colors cursor-pointer"
                >
                  Return to Live
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: High-Definition Planet Telemetry & Meaning Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active Planet Spotlight Card */}
          {selectedPlanet ? (
            <div className="rounded-3xl border-2 border-amber-400/80 bg-gradient-to-b from-[#130d2e] via-[#0b081e] to-slate-950 p-5 space-y-4 shadow-2xl animate-in fade-in duration-300">
              
              {/* Card Header with Planet Emblem */}
              <div className="flex items-center justify-between border-b border-purple-800/60 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 font-serif text-2xl border border-amber-400/50 shadow-inner">
                    {selectedPlanet.symbol}
                  </div>
                  <div>
                    <h4 className="font-serif text-base sm:text-lg font-bold text-slate-100 flex items-center gap-1.5">
                      <span>{selectedPlanet.name}</span>
                      <span className="text-xs text-amber-300 font-sans">({selectedPlanet.formattedPos})</span>
                    </h4>
                    <p className="text-xs text-purple-300">
                      Sign: <strong className="text-amber-200">{selectedPlanet.zodiacSign}</strong> · Element: <strong className="text-cyan-200">{selectedPlanet.element}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  {selectedPlanet.isRetrograde ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 border border-rose-500/50 px-2.5 py-0.5 text-[10px] font-bold text-rose-300">
                      <span>Rx</span>
                      <span>Retrograde</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                      <span>●</span>
                      <span>Direct</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Exact Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-purple-950/70 border border-purple-800/60 p-2.5">
                  <span className="text-[10px] text-purple-400 font-mono block uppercase">Ecliptic Position</span>
                  <span className="font-bold text-amber-300 text-sm">{selectedPlanet.longitude.toFixed(2)}°</span>
                </div>
                <div className="rounded-xl bg-purple-950/70 border border-purple-800/60 p-2.5">
                  <span className="text-[10px] text-purple-400 font-mono block uppercase">Distance (AU)</span>
                  <span className="font-bold text-slate-100 text-sm">{selectedPlanet.distanceAU.toFixed(2)} AU</span>
                </div>
              </div>

              {/* Astrological Significance */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Astrological Influence Today:</span>
                </span>
                <p className="text-xs text-purple-100 leading-relaxed font-sans bg-slate-950/90 p-3.5 rounded-2xl border border-purple-900/60">
                  {selectedPlanet.significance}
                </p>
              </div>

              {/* Moon Phase Details (When Moon is Selected) */}
              {selectedPlanet.id === 'moon' && selectedPlanet.moonPhaseInfo && (
                <div className="rounded-2xl border border-cyan-500/60 bg-gradient-to-br from-cyan-950/60 via-purple-950/70 to-slate-950 p-4 space-y-2.5 shadow-lg">
                  <div className="flex items-center justify-between border-b border-cyan-900/60 pb-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-3xl">{selectedPlanet.moonPhaseInfo.phaseIcon}</span>
                      <div>
                        <div className="font-serif text-sm font-bold text-cyan-200">
                          {selectedPlanet.moonPhaseInfo.phaseName}
                        </div>
                        <div className="text-[11px] text-cyan-300/80 font-mono">
                          {selectedPlanet.moonPhaseInfo.illumination}% Illumination · {selectedPlanet.moonPhaseInfo.isWaxing ? 'Waxing' : 'Waning'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-cyan-100 leading-relaxed font-sans">
                    {selectedPlanet.moonPhaseInfo.description}
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {/* Quick Planet Selector Bar */}
          <div className="rounded-2xl border border-purple-900/50 bg-slate-950/80 p-3.5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
              Quick Focus Planet:
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {planets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePlanetClick(p)}
                  className={`flex items-center justify-center gap-1 rounded-xl p-1.5 text-xs font-bold transition-all cursor-pointer ${
                    p.id === selectedPlanetId
                      ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                      : 'bg-purple-950/60 text-purple-300 hover:text-white hover:bg-purple-900/70'
                  }`}
                >
                  <span>{p.symbol}</span>
                  <span className="text-[10px]">{p.name.substring(0, 3)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
