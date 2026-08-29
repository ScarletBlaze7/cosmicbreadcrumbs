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
  calculatePlanetaryPositions, 
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

const PLANET_COLORS: Record<string, { fill: string; stroke: string; glow: string }> = {
  sun: { fill: '#fbbf24', stroke: '#f59e0b', glow: 'rgba(251, 191, 36, 0.6)' },
  moon: { fill: '#e2e8f0', stroke: '#94a3b8', glow: 'rgba(226, 232, 240, 0.5)' },
  mercury: { fill: '#38bdf8', stroke: '#0284c7', glow: 'rgba(56, 189, 248, 0.5)' },
  venus: { fill: '#f472b6', stroke: '#db2777', glow: 'rgba(244, 114, 182, 0.5)' },
  mars: { fill: '#ef4444', stroke: '#b91c1c', glow: 'rgba(239, 68, 68, 0.5)' },
  jupiter: { fill: '#f97316', stroke: '#c2410c', glow: 'rgba(249, 115, 22, 0.5)' },
  saturn: { fill: '#eab308', stroke: '#a16207', glow: 'rgba(234, 179, 8, 0.5)' },
  uranus: { fill: '#06b6d4', stroke: '#0891b2', glow: 'rgba(6, 182, 212, 0.5)' },
  neptune: { fill: '#6366f1', stroke: '#4338ca', glow: 'rgba(99, 102, 241, 0.5)' },
  pluto: { fill: '#a855f7', stroke: '#7e22ce', glow: 'rgba(168, 85, 247, 0.5)' },
  northnode: { fill: '#2dd4bf', stroke: '#0f766e', glow: 'rgba(45, 212, 191, 0.5)' },
  chiron: { fill: '#fb7185', stroke: '#e11d48', glow: 'rgba(251, 113, 133, 0.5)' },
};

const ORBIT_RADII: Record<string, number> = {
  sun: 0,
  mercury: 55,
  venus: 75,
  moon: 100, // mapped around earth radius
  mars: 125,
  jupiter: 155,
  saturn: 185,
  uranus: 215,
  neptune: 245,
  pluto: 275,
  northnode: 295,
  chiron: 310,
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
  const size = 680;
  const center = size / 2;
  const outerRadius = center - 25; // 315
  const innerRadius = 230;
  const wheelCenterRadius = 75;

  // Convert longitude (0° Aries at top/left) to SVG cartesian (x, y)
  // In astrological charts: 0° Aries is typically at 9 o'clock or 12 o'clock. We place 0° Aries at 9 o'clock (180° SVG) going counter-clockwise
  const getCoordinatesForDegree = (deg: number, radius: number) => {
    const angleRad = ((180 - deg) * Math.PI) / 180;
    const x = center + radius * Math.cos(angleRad);
    const y = center - radius * Math.sin(angleRad);
    return { x, y };
  };

  return (
    <div className={`space-y-4 rounded-3xl border border-purple-800/60 bg-[#080714]/95 p-4 sm:p-6 shadow-2xl backdrop-blur-xl ${className}`}>
      {/* Top Map Header & Mode Controls */}
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
            <span className="rounded-full bg-purple-950/80 border border-purple-700/60 px-2 py-0.5 font-mono text-[9px] text-purple-300">
              Interactive 360°
            </span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-100 flex items-center space-x-2">
            <span>Interactive Celestial Map & Planet Positions</span>
          </h3>
          <p className="text-xs text-purple-300/80">
            Touch or click any planet node to inspect its live degree, speed, retrograde status, and daily influence.
          </p>
        </div>

        {/* View Toggle & Quick Reset */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex rounded-xl bg-purple-950/60 p-1 border border-purple-800/60">
            <button
              onClick={() => setViewMode('zodiac')}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'zodiac'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              🌌 Zodiac Wheel
            </button>
            <button
              onClick={() => setViewMode('orbits')}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'orbits'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              🪐 Orbit System
            </button>
          </div>

          <button
            onClick={() => setShowAspectLines(!showAspectLines)}
            className={`rounded-xl px-2.5 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
              showAspectLines 
                ? 'bg-purple-900/60 border-purple-500 text-amber-300' 
                : 'bg-slate-950 border-purple-900/60 text-purple-400'
            }`}
            title="Toggle geometric connection energy lines between planets"
          >
            ✨ Energy Lines: {showAspectLines ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Main Interactive Map & Planet Spotlight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT / CENTER: Interactive SVG Map Container (8 Cols) */}
        <div className="lg:col-span-8 relative flex flex-col items-center justify-center rounded-2xl border border-purple-900/50 bg-gradient-to-b from-[#0e0a24] via-[#090718] to-[#04030a] p-2 sm:p-4 overflow-hidden shadow-inner">
          
          {/* Subtle Ambient Nebulae */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-purple-600/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-cyan-600/10 blur-3xl" />

          {/* SVG Map Canvas */}
          <div className="w-full max-w-[560px] aspect-square relative flex items-center justify-center select-none">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full drop-shadow-[0_0_25px_rgba(168,85,247,0.2)]"
            >
              <defs>
                {/* Center Core Radial Glow */}
                <radialGradient id="centerCoreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
                  <stop offset="40%" stopColor="#a855f7" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#060710" stopOpacity="0" />
                </radialGradient>

                {/* Aspect Line Gradients */}
                <linearGradient id="trineGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="sextileCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="oppRose" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="sqViolet" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#9333ea" stopOpacity="0.85" />
                </linearGradient>
              </defs>

              {/* Background Outer Coordinate Ring */}
              <circle
                cx={center}
                cy={center}
                r={outerRadius}
                fill="#070613"
                stroke="#3b2569"
                strokeWidth="2"
              />

              {/* Inner Concentric Rings */}
              <circle
                cx={center}
                cy={center}
                r={innerRadius}
                fill="none"
                stroke="#2a1b4e"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {viewMode === 'orbits' && (
                <>
                  {Object.entries(ORBIT_RADII).map(([planetKey, r]) => {
                    if (r === 0) return null;
                    return (
                      <circle
                        key={planetKey}
                        cx={center}
                        cy={center}
                        r={r * 0.9}
                        fill="none"
                        stroke="#261b4a"
                        strokeWidth="0.8"
                        strokeDasharray="2 3"
                        opacity={0.7}
                      />
                    );
                  })}
                </>
              )}

              {/* 12 Zodiac Houses Ring & Division Lines (Zodiac Mode) */}
              {viewMode === 'zodiac' && (
                <g id="zodiac-wheel-sectors">
                  {ZODIAC_SECTORS.map((sector, i) => {
                    const nextDeg = sector.startDeg + 30;
                    const p1 = getCoordinatesForDegree(sector.startDeg, outerRadius);
                    const p1Inner = getCoordinatesForDegree(sector.startDeg, innerRadius);
                    const midDeg = sector.startDeg + 15;
                    const textCoord = getCoordinatesForDegree(midDeg, (outerRadius + innerRadius) / 2);

                    return (
                      <g key={sector.name} className="group">
                        {/* Boundary line */}
                        <line
                          x1={p1Inner.x}
                          y1={p1Inner.y}
                          x2={p1.x}
                          y2={p1.y}
                          stroke="#382463"
                          strokeWidth="1.2"
                        />

                        {/* Zodiac Symbol & Name */}
                        <text
                          x={textCoord.x}
                          y={textCoord.y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={sector.color}
                          fontSize="15"
                          fontWeight="bold"
                          className="select-none font-serif"
                        >
                          {sector.symbol}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Aspect Connection Energy Lines */}
              {showAspectLines && (
                <g id="aspect-energy-lines" opacity="0.8">
                  {activeAspects.map((aspect, idx) => {
                    const p1 = planets.find(p => p.name.toLowerCase() === aspect.planet1.toLowerCase());
                    const p2 = planets.find(p => p.name.toLowerCase() === aspect.planet2.toLowerCase());
                    if (!p1 || !p2) return null;

                    const radius = viewMode === 'zodiac' ? innerRadius - 20 : 160;
                    const c1 = getCoordinatesForDegree(p1.longitude, radius);
                    const c2 = getCoordinatesForDegree(p2.longitude, radius);

                    let strokeColor = '#a855f7';
                    let strokeDash = 'none';

                    if (aspect.aspectName === 'Trine') {
                      strokeColor = 'url(#trineGold)';
                    } else if (aspect.aspectName === 'Sextile') {
                      strokeColor = 'url(#sextileCyan)';
                      strokeDash = '3 2';
                    } else if (aspect.aspectName === 'Opposition') {
                      strokeColor = 'url(#oppRose)';
                    } else if (aspect.aspectName === 'Square') {
                      strokeColor = 'url(#sqViolet)';
                      strokeDash = '4 3';
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
                        strokeWidth={isHighlight ? 2.2 : 1}
                        strokeDasharray={strokeDash}
                        opacity={isHighlight ? 0.95 : 0.45}
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </g>
              )}

              {/* Center Core (Sun or Earth Center) */}
              <circle
                cx={center}
                cy={center}
                r={wheelCenterRadius}
                fill="url(#centerCoreGlow)"
              />
              <circle
                cx={center}
                cy={center}
                r={24}
                fill="#120e2e"
                stroke="#4c2889"
                strokeWidth="2"
              />
              <text
                x={center}
                y={center - 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fbbf24"
                fontSize="18"
                className="font-serif select-none"
              >
                {viewMode === 'zodiac' ? '🌍' : '☀️'}
              </text>
              <text
                x={center}
                y={center + 14}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#c084fc"
                fontSize="8"
                fontWeight="bold"
                className="font-mono uppercase tracking-widest select-none"
              >
                {viewMode === 'zodiac' ? 'EARTH' : 'SUN'}
              </text>

              {/* INTERACTIVE PLANETS (Interactive clickable nodes) */}
              <g id="interactive-planet-nodes">
                {planets.map((planet) => {
                  const radius = viewMode === 'zodiac' 
                    ? innerRadius - 20 
                    : (ORBIT_RADII[planet.id] || 150) * 0.9;
                  
                  const { x, y } = getCoordinatesForDegree(planet.longitude, radius);
                  const isSelected = planet.id === selectedPlanetId;
                  const palette = PLANET_COLORS[planet.id] || { fill: '#c084fc', stroke: '#7e22ce', glow: 'rgba(192,132,252,0.5)' };

                  return (
                    <g
                      key={planet.id}
                      onClick={() => handlePlanetClick(planet)}
                      className="cursor-pointer group"
                      tabIndex={0}
                    >
                      {/* Active Selection Glow & Reticle */}
                      {isSelected && (
                        <>
                          <circle
                            cx={x}
                            cy={y}
                            r={24}
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="1.5"
                            strokeDasharray="4 3"
                            className="animate-spin"
                            style={{ transformOrigin: `${x}px ${y}px`, animationDuration: '8s' }}
                          />
                          <circle
                            cx={x}
                            cy={y}
                            r={20}
                            fill={palette.glow}
                            opacity={0.6}
                          />
                        </>
                      )}

                      {/* Hover Target Circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r={16}
                        fill="#0b081e"
                        stroke={isSelected ? '#fbbf24' : palette.stroke}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        className="group-hover:stroke-amber-300 group-hover:scale-110 transition-transform"
                        style={{ transformOrigin: `${x}px ${y}px` }}
                      />

                      {/* Planet Symbol */}
                      <text
                        x={x}
                        y={y + 0.5}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={palette.fill}
                        fontSize={planet.name === 'Sun' || planet.name === 'Moon' ? '14' : '13'}
                        fontWeight="bold"
                        className="select-none font-serif group-hover:scale-110 transition-transform"
                        style={{ transformOrigin: `${x}px ${y}px` }}
                      >
                        {planet.symbol}
                      </text>

                      {/* Degree Badge Pill Near Planet */}
                      <g transform={`translate(${x + 12}, ${y - 12})`}>
                        <rect
                          x="0"
                          y="0"
                          width="36"
                          height="14"
                          rx="4"
                          fill="#060511"
                          stroke={palette.stroke}
                          strokeWidth="0.8"
                          opacity={isSelected ? 1 : 0.8}
                        />
                        <text
                          x="18"
                          y="7.5"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#f1f5f9"
                          fontSize="8"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {planet.degrees}°{planet.zodiacSymbol}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Time Scrubber & Quick Nav Controls */}
          <div className="w-full mt-3 pt-3 border-t border-purple-900/50 flex flex-wrap items-center justify-between gap-2 px-2 text-xs">
            <div className="flex items-center space-x-1.5 font-mono text-[11px] text-purple-300">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              <span>{targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleJumpDays(-1)}
                className="rounded-lg bg-purple-950/80 hover:bg-purple-900 px-2 py-1 text-[11px] font-mono text-purple-200 border border-purple-800 transition-colors"
                title="View Sky 24 Hours Ago"
              >
                -24h
              </button>
              <button
                onClick={() => handleJumpDays(1)}
                className="rounded-lg bg-purple-950/80 hover:bg-purple-900 px-2 py-1 text-[11px] font-mono text-purple-200 border border-purple-800 transition-colors"
                title="View Sky 24 Hours Forward"
              >
                +24h
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold flex items-center gap-1 transition-all ${
                  isPlaying ? 'bg-rose-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                <span>{isPlaying ? 'Pause' : 'Animate'}</span>
              </button>
              {!isLive && (
                <button
                  onClick={handleResetToLive}
                  className="rounded-lg bg-cyan-600 hover:bg-cyan-500 px-2.5 py-1 text-[11px] font-bold text-white transition-colors"
                >
                  Return to Live
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Planet Spotlight & Real-Time Influence Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active Planet Spotlight Card */}
          {selectedPlanet ? (
            <div className="rounded-2xl border-2 border-amber-400/60 bg-gradient-to-b from-purple-950/90 via-slate-900 to-slate-950 p-5 space-y-4 shadow-xl animate-in fade-in duration-300">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-purple-800/60 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 font-serif text-2xl border border-amber-400/40 shadow-inner">
                    {selectedPlanet.symbol}
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-slate-100 flex items-center gap-1.5">
                      <span>{selectedPlanet.name}</span>
                      <span className="text-xs text-amber-300 font-sans">({selectedPlanet.formattedPos})</span>
                    </h4>
                    <p className="text-[11px] text-purple-300">
                      Sign: <strong className="text-amber-200">{selectedPlanet.zodiacSign}</strong> · Element: <strong className="text-cyan-200">{selectedPlanet.element}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  {selectedPlanet.isRetrograde ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[9.5px] font-bold text-rose-300">
                      <span>Rx</span>
                      <span>Retrograde</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[9.5px] font-bold text-emerald-300">
                      <span>●</span>
                      <span>Direct</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Exact Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-purple-950/60 border border-purple-900/60 p-2.5">
                  <span className="text-[10px] text-purple-400 font-mono block">ECLIPTIC DEGREE</span>
                  <span className="font-bold text-amber-300">{selectedPlanet.longitude.toFixed(2)}°</span>
                </div>
                <div className="rounded-xl bg-purple-950/60 border border-purple-900/60 p-2.5">
                  <span className="text-[10px] text-purple-400 font-mono block">DISTANCE / SPEED</span>
                  <span className="font-bold text-slate-200">{selectedPlanet.distanceAU.toFixed(2)} AU ({selectedPlanet.speed > 0 ? '+' : ''}{selectedPlanet.speed.toFixed(2)}°/d)</span>
                </div>
              </div>

              {/* Astrological Significance */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
                  What This Position Means Today:
                </span>
                <p className="text-xs text-purple-100/90 leading-relaxed font-sans bg-slate-950/80 p-3 rounded-xl border border-purple-900/50">
                  {selectedPlanet.significance}
                </p>
              </div>

              {/* Moon Phase & Meaning Spotlight (When Moon is selected) */}
              {selectedPlanet.id === 'moon' && selectedPlanet.moonPhaseInfo && (
                <div className="rounded-xl border border-cyan-500/50 bg-gradient-to-br from-cyan-950/50 via-purple-950/60 to-slate-950 p-3.5 space-y-2.5 shadow-lg animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-cyan-900/50 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{selectedPlanet.moonPhaseInfo.phaseIcon}</span>
                      <div>
                        <div className="font-serif text-xs font-bold text-cyan-200">
                          {selectedPlanet.moonPhaseInfo.phaseName}
                        </div>
                        <div className="text-[10px] text-cyan-300/80 font-mono">
                          {selectedPlanet.moonPhaseInfo.illumination}% Illumination · {selectedPlanet.moonPhaseInfo.isWaxing ? 'Waxing (Growing Light)' : 'Waning (Releasing Light)'}
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-cyan-500/20 border border-cyan-500/40 px-2 py-0.5 text-[9px] font-mono font-bold text-cyan-300">
                      LIVE LUNAR PHASE
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                      🌔 What This Moon Phase Means:
                    </span>
                    <p className="text-[11.5px] leading-relaxed text-purple-100 font-sans">
                      {selectedPlanet.moonPhaseInfo.phaseMeaning}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-purple-900/40 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 block">
                      🕯️ Lunar Intention & Daily Energy:
                    </span>
                    <p className="text-[11px] text-slate-200 leading-snug">
                      <strong>Intention:</strong> {selectedPlanet.moonPhaseInfo.intention} — {selectedPlanet.moonPhaseInfo.ritualAdvice}
                    </p>
                  </div>
                </div>
              )}

              {/* Connected Active Aspects */}
              <div className="space-y-2 pt-1 border-t border-purple-900/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center justify-between">
                  <span>Connected Planetary Aspects:</span>
                  <Sparkles size={12} />
                </span>

                {activeAspects.filter(a => a.planet1.toLowerCase() === selectedPlanet.name.toLowerCase() || a.planet2.toLowerCase() === selectedPlanet.name.toLowerCase()).length > 0 ? (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {activeAspects
                      .filter(a => a.planet1.toLowerCase() === selectedPlanet.name.toLowerCase() || a.planet2.toLowerCase() === selectedPlanet.name.toLowerCase())
                      .map((asp, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-purple-950/40 border border-purple-800/40 text-[11px] space-y-0.5">
                          <div className="font-bold text-amber-200 flex items-center justify-between">
                            <span>{asp.planet1} {asp.aspectName} {asp.planet2}</span>
                            <span className="text-[10px] text-cyan-300 font-mono">orb {asp.orb.toFixed(1)}°</span>
                          </div>
                          <p className="text-purple-200/80 text-[10px]">{asp.interpretation}</p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-purple-400 italic">No tight major aspects active for {selectedPlanet.name} right now.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-purple-900/60 bg-slate-900/60 p-6 text-center text-purple-300">
              Select any planet from the map to inspect its details.
            </div>
          )}

          {/* Quick Planet Pills List */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 px-1">
              Select Planet to Inspect:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {planets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePlanetClick(p)}
                  className={`rounded-xl py-1.5 px-2 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                    p.id === selectedPlanetId
                      ? 'bg-amber-400 text-slate-950 font-bold shadow'
                      : 'bg-purple-950/40 border border-purple-900/60 text-purple-200 hover:border-purple-600'
                  }`}
                >
                  <span className="font-serif text-sm">{p.symbol}</span>
                  <span className="text-[11px] truncate">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
