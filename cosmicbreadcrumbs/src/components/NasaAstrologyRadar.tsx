import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Sparkles, 
  RotateCw, 
  Activity, 
  Compass, 
  Zap, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Globe2, 
  Layers, 
  Info,
  Clock,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { 
  getRealtimeAstrologicalMatrix, 
  RealtimeAstrologicalMatrix, 
  PlanetaryPosition, 
  CelestialAspect 
} from '../utils/nasaEphemeris';

interface NasaAstrologyRadarProps {
  onClose?: () => void;
  compact?: boolean;
}

export const NasaAstrologyRadar: React.FC<NasaAstrologyRadarProps> = ({ compact = false }) => {
  const [matrix, setMatrix] = useState<RealtimeAstrologicalMatrix>(() => getRealtimeAstrologicalMatrix());
  const [activeTab, setActiveTab] = useState<'positions' | 'aspects' | 'spaceWeather' | 'telemetryGuide'>('positions');
  const [highlightedMetric, setHighlightedMetric] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetaryPosition | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time ticking clock & auto-refresh of orbital coordinates every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setMatrix(getRealtimeAstrologicalMatrix(now));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);

    setTimeout(() => {
      const now = new Date();
      setCurrentTime(now);
      setMatrix(getRealtimeAstrologicalMatrix(now));
      setIsRefreshing(false);
    }, 600);
  };

  const { spaceWeather, planets, activeAspects, dominantElement, retrogradeSummary } = matrix;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-purple-900/60 bg-slate-950/90 shadow-2xl backdrop-blur-xl">
      {/* Background Orbital Grid Ambiance */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.15),transparent_60%)]" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* HEADER: NASA JPL EPHEMERIS RADAR */}
      <div className="relative z-10 border-b border-purple-900/50 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <span className="font-mono text-[10px] font-bold tracking-widest text-cyan-300 uppercase">
                NASA JPL EPHEMERIS • REAL-TIME RADAR
              </span>
              <span className="rounded-full bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 font-mono text-[9px] text-cyan-400">
                LIVE
              </span>
            </div>
            <h3 className="font-sans text-lg sm:text-xl font-black tracking-wider text-slate-100 flex items-center space-x-2">
              <span>Real-Time Astrological Telemetry</span>
            </h3>
            <p className="text-xs text-purple-200/80 max-w-xl">
              Proprietary synthesis of NASA Keplerian planetary coordinates, active geometric aspects, and live space weather frequencies.
            </p>
          </div>

          {/* Action & Clock */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="text-right hidden sm:block">
              <div className="font-mono text-[10px] text-purple-300">
                {currentTime.toLocaleTimeString()} UTC
              </div>
              <div className="font-mono text-[9px] text-purple-400/70">
                JD {matrix.julianDate}
              </div>
            </div>

            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-1.5 rounded-2xl border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-2 font-mono text-xs font-semibold text-cyan-300 hover:bg-cyan-900/50 active:scale-95 transition-all shadow-md"
              title="Sync latest NASA JPL orbital data"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Telemetry'}</span>
            </button>
          </div>
        </div>

        {/* LIVE SPACE WEATHER & HARMONIC SCORE STRIP (Interactive telemetry metrics) */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Metric 1: Proprietary Resonance Score */}
          <div 
            onClick={() => {
              setActiveTab('telemetryGuide');
              setHighlightedMetric('resonance');
            }}
            className="group cursor-pointer rounded-2xl border border-amber-500/30 bg-amber-500/10 p-2.5 flex items-center space-x-2.5 hover:border-amber-400 hover:bg-amber-500/20 transition-all"
            title="Click to learn what Cosmic Resonance means"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 font-bold font-serif text-sm group-hover:scale-105 transition-transform">
              {spaceWeather.cosmicResonanceScore}%
            </div>
            <div className="min-w-0">
              <div className="text-[9px] font-mono font-bold tracking-wider text-amber-300 uppercase truncate flex items-center space-x-1">
                <span>Cosmic Resonance</span>
                <Info className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100" />
              </div>
              <div className="text-[11px] font-semibold text-amber-100 truncate">
                {spaceWeather.resonanceGrade}
              </div>
            </div>
          </div>

          {/* Metric 2: Solar Wind Speed */}
          <div 
            onClick={() => {
              setActiveTab('telemetryGuide');
              setHighlightedMetric('solarWind');
            }}
            className="group cursor-pointer rounded-2xl border border-purple-800/40 bg-slate-900/80 p-2.5 flex items-center space-x-2.5 hover:border-purple-600 hover:bg-slate-900 transition-all"
            title="Click to learn what Solar Wind telemetry means"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-950 text-purple-300 group-hover:scale-105 transition-transform">
              <Sun className="h-4 w-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] font-mono font-bold tracking-wider text-purple-300 uppercase truncate flex items-center space-x-1">
                <span>Solar Wind</span>
                <Info className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100" />
              </div>
              <div className="text-[11px] font-mono font-bold text-slate-100">
                {spaceWeather.solarWindSpeed} km/s
              </div>
            </div>
          </div>

          {/* Metric 3: Geomagnetic Kp Index */}
          <div 
            onClick={() => {
              setActiveTab('telemetryGuide');
              setHighlightedMetric('kpIndex');
            }}
            className="group cursor-pointer rounded-2xl border border-purple-800/40 bg-slate-900/80 p-2.5 flex items-center space-x-2.5 hover:border-cyan-500/50 hover:bg-slate-900 transition-all"
            title="Click to learn what the Kp Geomagnetic Index means"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-950 text-cyan-300 group-hover:scale-105 transition-transform">
              <Activity className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] font-mono font-bold tracking-wider text-purple-300 uppercase truncate flex items-center space-x-1">
                <span>Geomagnetic Kp</span>
                <Info className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100" />
              </div>
              <div className="text-[11px] font-mono font-bold text-slate-100">
                Kp {spaceWeather.kpIndex} ({spaceWeather.kpStatus})
              </div>
            </div>
          </div>

          {/* Metric 4: Solar Flare Flux */}
          <div 
            onClick={() => {
              setActiveTab('telemetryGuide');
              setHighlightedMetric('solarFlare');
            }}
            className="group cursor-pointer rounded-2xl border border-purple-800/40 bg-slate-900/80 p-2.5 flex items-center space-x-2.5 hover:border-rose-500/50 hover:bg-slate-900 transition-all"
            title="Click to learn what Solar Flare Flux means"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-950 text-rose-300 group-hover:scale-105 transition-transform">
              <Zap className="h-4 w-4 text-rose-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] font-mono font-bold tracking-wider text-purple-300 uppercase truncate flex items-center space-x-1">
                <span>Flare Flux</span>
                <Info className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100" />
              </div>
              <div className="text-[11px] font-mono font-bold text-slate-100">
                Class {spaceWeather.solarFlareFlux}
              </div>
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="mt-4 flex items-center space-x-1.5 border-b border-purple-900/40 pb-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('positions')}
            className={`rounded-xl px-3 py-1.5 font-mono text-xs font-bold uppercase whitespace-nowrap transition-all ${
              activeTab === 'positions'
                ? 'bg-purple-900/60 text-amber-300 border border-purple-700'
                : 'text-purple-300/70 hover:text-purple-200'
            }`}
          >
            NASA Orbital Ephemeris ({planets.length})
          </button>

          <button
            onClick={() => setActiveTab('aspects')}
            className={`rounded-xl px-3 py-1.5 font-mono text-xs font-bold uppercase whitespace-nowrap transition-all ${
              activeTab === 'aspects'
                ? 'bg-purple-900/60 text-amber-300 border border-purple-700'
                : 'text-purple-300/70 hover:text-purple-200'
            }`}
          >
            Geometric Aspects ({activeAspects.length})
          </button>

          <button
            onClick={() => setActiveTab('spaceWeather')}
            className={`rounded-xl px-3 py-1.5 font-mono text-xs font-bold uppercase whitespace-nowrap transition-all ${
              activeTab === 'spaceWeather'
                ? 'bg-purple-900/60 text-amber-300 border border-purple-700'
                : 'text-purple-300/70 hover:text-purple-200'
            }`}
          >
            Algorithm Insights
          </button>

          <button
            onClick={() => {
              setActiveTab('telemetryGuide');
              setHighlightedMetric(null);
            }}
            className={`rounded-xl px-3 py-1.5 font-mono text-xs font-bold uppercase whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeTab === 'telemetryGuide'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-sm'
                : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <Info className="h-3 w-3 text-amber-400" />
            <span>Telemetry Guide & Meanings</span>
          </button>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="relative z-10 p-4 sm:p-5 space-y-4">
        {/* TAB 1: PLANETARY EPHEMERIS TABLE */}
        {activeTab === 'positions' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-purple-300/80 px-1">
              <span>Current Geocentric Ecliptic Longitudes</span>
              <span className="font-mono text-[10px] text-cyan-300">
                Dominant Element: <strong className="text-white uppercase">{dominantElement}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
              {planets.map((planet) => {
                const isSelected = selectedPlanet?.id === planet.id;
                return (
                  <div
                    key={planet.id}
                    onClick={() => setSelectedPlanet(isSelected ? null : planet)}
                    className={`cursor-pointer rounded-2xl border p-3 transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-purple-950/80 shadow-lg shadow-purple-950/50'
                        : 'border-purple-900/50 bg-slate-900/70 hover:border-purple-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-950/80 border border-purple-800 text-base text-amber-300">
                          {planet.symbol}
                        </div>
                        <div>
                          <div className="font-serif text-xs font-bold text-slate-100">
                            {planet.name}
                          </div>
                          <div className="font-mono text-[10px] text-purple-300">
                            {planet.formattedPos}
                          </div>
                        </div>
                      </div>

                      <div className="text-right space-y-0.5">
                        {planet.isRetrograde ? (
                          <span className="inline-flex items-center space-x-1 rounded-full bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[9px] font-mono font-bold text-rose-300">
                            <span>Rx</span>
                            <span>Retrograde</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-300">
                            <span>●</span>
                            <span>Direct ({planet.speed > 0 ? `+${planet.speed}` : planet.speed}°/d)</span>
                          </span>
                        )}
                        <div className="text-[9px] font-mono text-purple-400/80">
                          {planet.distanceAU} AU
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-2.5 pt-2 border-t border-purple-900/50 space-y-1.5 text-xs text-purple-200 animate-in fade-in">
                        <p className="text-[11px] leading-relaxed text-slate-200">
                          {planet.significance}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[9px]">
                          <span className="rounded bg-purple-950 px-1.5 py-0.5 text-amber-300 border border-purple-800">
                            Element: {planet.element}
                          </span>
                          <span className="rounded bg-purple-950 px-1.5 py-0.5 text-cyan-300 border border-purple-800">
                            Dignity: {planet.dignity}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE INTERPLANETARY ASPECTS */}
        {activeTab === 'aspects' && (
          <div className="space-y-3">
            <div className="text-xs text-purple-300/80 px-1">
              Active Interplanetary Geometric Conduits (Exact Angular Orbs):
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {activeAspects.map((aspect, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-purple-900/50 bg-slate-900/70 p-3.5 space-y-2 hover:border-purple-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-serif text-sm font-bold text-slate-100">
                        {aspect.planet1} {aspect.aspectName} {aspect.planet2}
                      </span>
                      <span className="font-mono text-[10px] text-purple-400">
                        ({aspect.angle}° • {aspect.orb}° orb)
                      </span>
                    </div>

                    <span className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase ${
                      aspect.energyType === 'Harmonic'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : aspect.energyType === 'Dynamic'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    }`}>
                      {aspect.energyType}
                    </span>
                  </div>

                  <p className="text-xs text-purple-200/90 leading-relaxed font-sans">
                    {aspect.interpretation}
                  </p>

                  <div className="rounded-xl bg-purple-950/60 p-2 text-[11px] text-amber-200 font-medium border border-purple-900/40">
                    💡 Astrological Guidance: {aspect.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROPRIETARY ALGORITHM SYNTHESIS */}
        {activeTab === 'spaceWeather' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-purple-800/60 bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 p-4 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-300 uppercase">
                <Sparkles className="h-4 w-4" />
                <span>Cosmic Breadcrumbs Proprietary Forecast</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-sans">
                {matrix.proprietaryForecast}
              </p>
            </div>

            {/* Retrograde Summary */}
            <div className="rounded-2xl border border-purple-900/50 bg-slate-900/70 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif text-xs font-bold text-slate-200">
                  Active Retrograde Celestial Stations ({retrogradeSummary.length})
                </span>
                <span className="font-mono text-[9px] text-rose-300 uppercase font-bold">
                  Introspection Windows
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {retrogradeSummary.map((item, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-rose-500/10 border border-rose-500/30 px-3 py-1 font-mono text-[10px] text-rose-200 font-semibold"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-purple-400/80 font-mono text-center">
              Data synchronized via {spaceWeather.nasaDataSource}
            </div>
          </div>
        )}

        {/* TAB 4: TELEMETRY GUIDE & MEANINGS */}
        {activeTab === 'telemetryGuide' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-purple-950/60 via-slate-900 to-amber-950/30 p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-amber-400" />
                <h3 className="font-serif text-sm font-bold text-amber-200 uppercase tracking-wide">
                  Cosmic Telemetry Dictionary & Meanings
                </h3>
              </div>
              <p className="text-xs text-purple-200/90 leading-relaxed font-sans">
                Our Planetary Radar marries <strong>NASA JPL Horizons ephemeris telemetry</strong> with sacred Babylonian, Chaldean, and Hellenistic astrological mechanics. Below is what each live data point represents scientifically and spiritually.
              </p>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {/* Metric 1: Cosmic Resonance Score */}
              <div 
                className={`rounded-2xl border p-4 transition-all ${
                  highlightedMetric === 'resonance' 
                    ? 'border-amber-400 bg-amber-950/40 ring-1 ring-amber-400/50' 
                    : 'border-purple-900/50 bg-slate-900/80 hover:border-purple-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 font-bold font-serif text-sm border border-amber-500/40">
                      {spaceWeather.cosmicResonanceScore}%
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-amber-200">
                        Cosmic Resonance Score & Grade
                      </h4>
                      <span className="font-mono text-[10px] text-amber-400/90">
                        Current: {spaceWeather.resonanceGrade} ({spaceWeather.cosmicResonanceScore}%)
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 font-mono text-[9px] text-amber-300 uppercase font-bold">
                    Proprietary Index
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-xs text-slate-200 font-sans">
                  <div>
                    <span className="font-semibold text-amber-300">What it is: </span>
                    A composite index (0–100%) calculated by synthesizing lunar phases, harmonic planetary aspects (Trines, Sextiles), solar wind velocity, and geomagnetic calm.
                  </div>
                  <div>
                    <span className="font-semibold text-purple-300">What it means: </span>
                    Measures the overall ease and fluidity of cosmic energy today. <strong>80%+ (Sublime/Harmonic)</strong> indicates effortless manifestation, high creativity, and smooth conversations. <strong>Below 50% (Catalytic)</strong> denotes profound transformative tension where conscious patience is advised.
                  </div>
                </div>
              </div>

              {/* Metric 2: Solar Wind Speed */}
              <div 
                className={`rounded-2xl border p-4 transition-all ${
                  highlightedMetric === 'solarWind' 
                    ? 'border-amber-400 bg-amber-950/40 ring-1 ring-amber-400/50' 
                    : 'border-purple-900/50 bg-slate-900/80 hover:border-purple-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-950 text-amber-300 border border-purple-800">
                      <Sun className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-slate-100">
                        Solar Wind Stream (km/s)
                      </h4>
                      <span className="font-mono text-[10px] text-purple-300">
                        Current: {spaceWeather.solarWindSpeed} km/s • {spaceWeather.solarWindStatus}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-purple-950 border border-purple-800 px-2.5 py-0.5 font-mono text-[9px] text-purple-300 uppercase font-bold">
                    Solar Telemetry
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-xs text-slate-200 font-sans">
                  <div>
                    <span className="font-semibold text-amber-300">What it is: </span>
                    The speed at which ionized plasma protons and electrons stream from the Sun’s corona through interplanetary space toward Earth, measured in kilometers per second (km/s).
                  </div>
                  <div>
                    <span className="font-semibold text-purple-300">What it means: </span>
                    Baseline speeds are ~350–450 km/s (Quiet). When high-speed streams exceed 500–700+ km/s, they compress Earth's magnetosphere, activating human nervous system sensitivity, lucid dreaming, sudden spontaneous epiphanies, and rapid downloads of inspiration.
                  </div>
                </div>
              </div>

              {/* Metric 3: Geomagnetic Kp Index */}
              <div 
                className={`rounded-2xl border p-4 transition-all ${
                  highlightedMetric === 'kpIndex' 
                    ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400/50' 
                    : 'border-purple-900/50 bg-slate-900/80 hover:border-purple-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-950 text-cyan-300 border border-purple-800">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-slate-100">
                        Geomagnetic Kp Index (0–9)
                      </h4>
                      <span className="font-mono text-[10px] text-cyan-300">
                        Current: Kp {spaceWeather.kpIndex} ({spaceWeather.kpStatus})
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 font-mono text-[9px] text-cyan-300 uppercase font-bold">
                    Earth Magnetics
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-xs text-slate-200 font-sans">
                  <div>
                    <span className="font-semibold text-amber-300">What it is: </span>
                    The planetary K-index quantifies horizontal disturbances in the Earth's magnetic field on a standard logarithmic 0-to-9 scale.
                  </div>
                  <div>
                    <span className="font-semibold text-purple-300">What it means: </span>
                    <strong>Kp 0–2 (Quiet)</strong> offers deep grounding, mental stability, and restorative sleep. <strong>Kp 3–4 (Unsettled)</strong> brings energetic awakening. <strong>Kp 5+ (Geomagnetic Storm)</strong> triggers intense auroras, emotional clearing, energetic purges, and a call for psychic protection and salt baths.
                  </div>
                </div>
              </div>

              {/* Metric 4: Solar Flare Flux */}
              <div 
                className={`rounded-2xl border p-4 transition-all ${
                  highlightedMetric === 'solarFlare' 
                    ? 'border-rose-400 bg-rose-950/40 ring-1 ring-rose-400/50' 
                    : 'border-purple-900/50 bg-slate-900/80 hover:border-purple-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-950 text-rose-300 border border-purple-800">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-slate-100">
                        Solar Flare Flux & Classification
                      </h4>
                      <span className="font-mono text-[10px] text-rose-300">
                        Current: Class {spaceWeather.solarFlareFlux}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 font-mono text-[9px] text-rose-300 uppercase font-bold">
                    X-Ray Radiation
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-xs text-slate-200 font-sans">
                  <div>
                    <span className="font-semibold text-amber-300">What it is: </span>
                    Peak X-ray energy flux emitted by active sunspot magnetic loops, classified exponentially: A, B, C, M, and X classes.
                  </div>
                  <div>
                    <span className="font-semibold text-purple-300">What it means: </span>
                    Flares release bursts of photonic light. <strong>Classes A, B, & C</strong> maintain steady energetic equilibrium. <strong>M-Class & X-Class</strong> bursts accelerate consciousness evolution, release old mental stagnation, and trigger strong energetic shifts.
                  </div>
                </div>
              </div>

              {/* Metric 5: Orbital Ephemeris & Ecliptic Longitude */}
              <div className="rounded-2xl border border-purple-900/50 bg-slate-900/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-bold text-slate-100">
                    NASA Planetary Ephemeris (Ecliptic Longitude)
                  </h4>
                  <span className="rounded-full bg-purple-950 border border-purple-800 px-2.5 py-0.5 font-mono text-[9px] text-purple-300 uppercase font-bold">
                    Astronomical Coordinates
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-200 font-sans">
                  <div>
                    <span className="font-semibold text-amber-300">What it is: </span>
                    The exact mathematical celestial angle (0.00° to 359.99°) of a planet along the Sun’s apparent annual path (the ecliptic) projected as seen from Earth.
                  </div>
                  <div>
                    <span className="font-semibold text-purple-300">What it means: </span>
                    Divides the sky into the 12 sacred 30-degree zodiac constellations (Aries 0° to Pisces 330°+), revealing the archetype, temperament, and psychological lens through which that planet's energy is expressed today.
                  </div>
                </div>
              </div>

              {/* Metric 6: Retrograde vs Direct Motion */}
              <div className="rounded-2xl border border-purple-900/50 bg-slate-900/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-bold text-slate-100">
                    Planetary Motion: Direct (●) vs. Retrograde (Rx)
                  </h4>
                  <span className="rounded-full bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 font-mono text-[9px] text-rose-200 uppercase font-bold">
                    Orbital Direction
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-200 font-sans">
                  <div>
                    <span className="font-semibold text-amber-300">What it is: </span>
                    Apparent traversal speed along the zodiac. When Earth overtakes another planet on its orbit, the planet appears from our vantage point to slow down and traverse backward through the sky.
                  </div>
                  <div>
                    <span className="font-semibold text-purple-300">What it means: </span>
                    <strong>Direct motion</strong> powers outward progress, new beginnings, contract signings, and momentum. <strong>Retrograde (Rx)</strong> marks an inward cosmic pause for review, reflection, revision, and completing unfinished karma.
                  </div>
                </div>
              </div>

              {/* Metric 7: Astronomical Units (Distance in AU) */}
              <div className="rounded-2xl border border-purple-900/50 bg-slate-900/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-bold text-slate-100">
                    Geocentric Distance (Astronomical Units - AU)
                  </h4>
                  <span className="rounded-full bg-purple-950 border border-purple-800 px-2.5 py-0.5 font-mono text-[9px] text-purple-300 uppercase font-bold">
                    Proximity
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-200 font-sans">
                  <div>
                    <span className="font-semibold text-amber-300">What it is: </span>
                    The instantaneous distance from Earth to that planet, where 1 AU is equal to the mean Earth-Sun distance (~149.6 million km or ~93 million miles).
                  </div>
                  <div>
                    <span className="font-semibold text-purple-300">What it means: </span>
                    Planets at perihelion or perigee (closest AU approach) exert a heightened gravitational, tidal, and archetypal pull on personal consciousness and daily experiences.
                  </div>
                </div>
              </div>

              {/* Metric 8: Geometric Aspects & Orbs */}
              <div className="rounded-2xl border border-purple-900/50 bg-slate-900/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-bold text-slate-100">
                    Interplanetary Geometric Aspects & Orbs
                  </h4>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 font-mono text-[9px] text-emerald-300 uppercase font-bold">
                    Sacred Geometry
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-200 font-sans">
                  <div>
                    <span className="font-semibold text-amber-300">What it is: </span>
                    Angular relationships between planetary coordinate vectors (Conjunction 0°, Sextile 60°, Square 90°, Trine 120°, Opposition 180°). The "Orb" is how many degrees the angle deviates from exact precision (smaller orb = stronger power).
                  </div>
                  <div>
                    <span className="font-semibold text-purple-300">What it means: </span>
                    Aspects create the musical harmony of the spheres. <strong>Trines & Sextiles</strong> produce smooth, supportive flow and gifts; <strong>Squares & Oppositions</strong> present constructive friction, decisive challenges, and breakthroughs.
                  </div>
                </div>
              </div>

              {/* Metric 9: Julian Date (JD) */}
              <div className="rounded-2xl border border-purple-900/50 bg-slate-900/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-bold text-slate-100">
                    Astronomical Julian Date (JD)
                  </h4>
                  <span className="rounded-full bg-purple-950 border border-purple-800 px-2.5 py-0.5 font-mono text-[9px] text-cyan-300 uppercase font-bold">
                    Epoch Time
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-200 font-sans">
                  <div>
                    <span className="font-semibold text-amber-300">What it is: </span>
                    The continuous scientific count of days since Greenwich noon on January 1, 4713 BCE, used by astronomers and NASA JPL Horizons.
                  </div>
                  <div>
                    <span className="font-semibold text-purple-300">What it means: </span>
                    Bypasses calendar irregularities, leap centuries, and timezone anomalies to provide the exact immutable mathematical clock ticking across the cosmos.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
