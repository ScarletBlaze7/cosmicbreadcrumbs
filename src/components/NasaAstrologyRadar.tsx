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
import { InteractivePlanetMap } from './InteractivePlanetMap';

interface NasaAstrologyRadarProps {
  onClose?: () => void;
  compact?: boolean;
}

export const NasaAstrologyRadar: React.FC<NasaAstrologyRadarProps> = ({ compact = false }) => {
  const [matrix, setMatrix] = useState<RealtimeAstrologicalMatrix>(() => getRealtimeAstrologicalMatrix());
  const [activeTab, setActiveTab] = useState<'map' | 'positions' | 'aspects' | 'spaceWeather' | 'telemetryGuide'>('map');
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

      {/* HEADER: LIVE NASA PLANETARY SKY MAP */}
      <div className="relative z-10 border-b border-purple-900/50 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <span className="font-mono text-[10px] font-bold tracking-widest text-cyan-300 uppercase">
                LIVE SKY MAP • POWERED BY NASA
              </span>
              <span className="rounded-full bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 font-mono text-[9px] text-cyan-400">
                LIVE
              </span>
            </div>
            <h3 className="font-sans text-lg sm:text-xl font-black tracking-wider text-slate-100 flex items-center space-x-2">
              <span>Live Planet Positions & Space Energy</span>
            </h3>
            <p className="text-xs text-purple-200/90 max-w-xl">
              See where the planets are located in the sky right now, how their energies connect, and how solar weather influences your day.
            </p>
          </div>

          {/* Action & Clock */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="text-right hidden sm:block">
              <div className="font-mono text-[10px] text-purple-300">
                {currentTime.toLocaleTimeString()} UTC
              </div>
              <div className="font-mono text-[9px] text-purple-400/70">
                Live Sky Alignment
              </div>
            </div>

            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-1.5 rounded-2xl border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-2 font-mono text-xs font-semibold text-cyan-300 hover:bg-cyan-900/50 active:scale-95 transition-all shadow-md cursor-pointer"
              title="Refresh with latest live NASA sky data"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Refresh Sky Map'}</span>
            </button>
          </div>
        </div>

        {/* LIVE SPACE WEATHER & HARMONY METRICS (Plain English) */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Metric 1: Cosmic Harmony */}
          <div 
            onClick={() => {
              setActiveTab('telemetryGuide');
              setHighlightedMetric('resonance');
            }}
            className="group cursor-pointer rounded-2xl border border-amber-500/30 bg-amber-500/10 p-2.5 flex items-center space-x-2.5 hover:border-amber-400 hover:bg-amber-500/20 transition-all"
            title="Click to learn what Cosmic Harmony means"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 font-bold font-serif text-sm group-hover:scale-105 transition-transform">
              {spaceWeather.cosmicResonanceScore}%
            </div>
            <div className="min-w-0">
              <div className="text-[9px] font-sans font-bold tracking-wider text-amber-300 uppercase truncate flex items-center space-x-1">
                <span>Cosmic Harmony</span>
                <Info className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100" />
              </div>
              <div className="text-[11px] font-semibold text-amber-100 truncate">
                {spaceWeather.resonanceGrade}
              </div>
            </div>
          </div>

          {/* Metric 2: Solar Energy */}
          <div 
            onClick={() => {
              setActiveTab('telemetryGuide');
              setHighlightedMetric('solarWind');
            }}
            className="group cursor-pointer rounded-2xl border border-purple-800/40 bg-slate-900/80 p-2.5 flex items-center space-x-2.5 hover:border-purple-600 hover:bg-slate-900 transition-all"
            title="Click to learn what Solar Energy speed means"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-950 text-purple-300 group-hover:scale-105 transition-transform">
              <Sun className="h-4 w-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] font-sans font-bold tracking-wider text-purple-300 uppercase truncate flex items-center space-x-1">
                <span>Solar Stream</span>
                <Info className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100" />
              </div>
              <div className="text-[11px] font-sans font-bold text-slate-100 truncate">
                {spaceWeather.solarWindStatus}
              </div>
            </div>
          </div>

          {/* Metric 3: Earth Field */}
          <div 
            onClick={() => {
              setActiveTab('telemetryGuide');
              setHighlightedMetric('kpIndex');
            }}
            className="group cursor-pointer rounded-2xl border border-purple-800/40 bg-slate-900/80 p-2.5 flex items-center space-x-2.5 hover:border-cyan-500/50 hover:bg-slate-900 transition-all"
            title="Click to learn what Earth's Magnetic Field status means"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-950 text-cyan-300 group-hover:scale-105 transition-transform">
              <Activity className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] font-sans font-bold tracking-wider text-purple-300 uppercase truncate flex items-center space-x-1">
                <span>Earth Field</span>
                <Info className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100" />
              </div>
              <div className="text-[11px] font-sans font-bold text-slate-100 truncate">
                {spaceWeather.kpStatus} (Kp {spaceWeather.kpIndex})
              </div>
            </div>
          </div>

          {/* Metric 4: Sun Activity */}
          <div 
            onClick={() => {
              setActiveTab('telemetryGuide');
              setHighlightedMetric('solarFlare');
            }}
            className="group cursor-pointer rounded-2xl border border-purple-800/40 bg-slate-900/80 p-2.5 flex items-center space-x-2.5 hover:border-rose-500/50 hover:bg-slate-900 transition-all"
            title="Click to learn what Solar Activity means"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-950 text-rose-300 group-hover:scale-105 transition-transform">
              <Zap className="h-4 w-4 text-rose-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] font-sans font-bold tracking-wider text-purple-300 uppercase truncate flex items-center space-x-1">
                <span>Sun Activity</span>
                <Info className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100" />
              </div>
              <div className="text-[11px] font-sans font-bold text-slate-100 truncate">
                Quiet (Class {spaceWeather.solarFlareFlux})
              </div>
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION (Plain English) */}
        <div className="mt-4 flex items-center space-x-1.5 border-b border-purple-900/40 pb-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('map')}
            className={`rounded-xl px-3 py-1.5 font-sans text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'map'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md'
                : 'text-amber-300 hover:text-amber-200 bg-amber-500/10 border border-amber-500/30'
            }`}
          >
            <span>🗺️ Interactive Sky Map</span>
          </button>

          <button
            onClick={() => setActiveTab('positions')}
            className={`rounded-xl px-3 py-1.5 font-sans text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'positions'
                ? 'bg-purple-900/80 text-amber-300 border border-purple-600 shadow-sm'
                : 'text-purple-300/70 hover:text-purple-200'
            }`}
          >
            🪐 Planet Positions ({planets.length})
          </button>

          <button
            onClick={() => setActiveTab('aspects')}
            className={`rounded-xl px-3 py-1.5 font-sans text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'aspects'
                ? 'bg-purple-900/80 text-amber-300 border border-purple-600 shadow-sm'
                : 'text-purple-300/70 hover:text-purple-200'
            }`}
          >
            ✨ Planetary Connections ({activeAspects.length})
          </button>

          <button
            onClick={() => setActiveTab('spaceWeather')}
            className={`rounded-xl px-3 py-1.5 font-sans text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'spaceWeather'
                ? 'bg-purple-900/80 text-amber-300 border border-purple-600 shadow-sm'
                : 'text-purple-300/70 hover:text-purple-200'
            }`}
          >
            🌟 Cosmic Energy Summary
          </button>

          <button
            onClick={() => {
              setActiveTab('telemetryGuide');
              setHighlightedMetric(null);
            }}
            className={`rounded-xl px-3 py-1.5 font-sans text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'telemetryGuide'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-sm'
                : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <Info className="h-3.5 w-3.5 text-amber-400" />
            <span>📖 Simple Guide: What This Means</span>
          </button>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="relative z-10 p-4 sm:p-5 space-y-4">
        {/* TAB 0: INTERACTIVE PLANET MAP */}
        {activeTab === 'map' && (
          <InteractivePlanetMap
            matrix={matrix}
            onSelectPlanet={(p) => {
              setSelectedPlanet(p);
            }}
          />
        )}

        {/* TAB 1: PLANET POSITIONS */}
        {activeTab === 'positions' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-purple-200/90 px-1">
              <span>Live Positions Across the Zodiac Signs</span>
              <span className="text-xs text-amber-300 font-sans">
                Dominant Element: <strong className="text-white uppercase font-bold">{dominantElement}</strong>
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
                          <div className="font-sans text-[11px] text-amber-300 font-semibold">
                            {planet.formattedPos}
                          </div>
                        </div>
                      </div>

                      <div className="text-right space-y-0.5">
                        {planet.isRetrograde ? (
                          <span className="inline-flex items-center space-x-1 rounded-full bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[9px] font-sans font-bold text-rose-300">
                            <span>Rx</span>
                            <span>Retrograde</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-sans font-bold text-emerald-300">
                            <span>●</span>
                            <span>Moving Direct</span>
                          </span>
                        )}
                        <div className="text-[10px] font-sans text-purple-300/80">
                          Tap for meaning ↓
                        </div>
                      </div>
                    </div>

                    {/* Quick Moon Phase Indicator on Moon card */}
                    {planet.id === 'moon' && planet.moonPhaseInfo && (
                      <div className="mt-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 p-2 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1.5 text-cyan-200 font-semibold text-[11px]">
                          <span>{planet.moonPhaseInfo.phaseIcon}</span>
                          <span>Phase: {planet.moonPhaseInfo.phaseName} ({planet.moonPhaseInfo.illumination}%)</span>
                        </div>
                        <span className="text-[10px] text-cyan-400 font-mono">
                          {planet.moonPhaseInfo.isWaxing ? 'Waxing' : 'Waning'}
                        </span>
                      </div>
                    )}

                    {isSelected && (
                      <div className="mt-2.5 pt-2 border-t border-purple-900/50 space-y-2 text-xs text-purple-200 animate-in fade-in">
                        <p className="text-[11px] leading-relaxed text-slate-200">
                          {planet.significance}
                        </p>

                        {/* Dedicated Moon Phase Meaning Box */}
                        {planet.id === 'moon' && planet.moonPhaseInfo && (
                          <div className="rounded-xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/60 via-purple-950/60 to-slate-950 p-3 space-y-2">
                            <div className="flex items-center justify-between border-b border-cyan-900/50 pb-1.5">
                              <div className="flex items-center space-x-1.5 text-xs font-bold text-cyan-200">
                                <span>{planet.moonPhaseInfo.phaseIcon}</span>
                                <span>{planet.moonPhaseInfo.phaseName}</span>
                              </div>
                              <span className="text-[10px] text-cyan-300 font-mono">
                                {planet.moonPhaseInfo.illumination}% Illumination
                              </span>
                            </div>

                            <div className="space-y-1 text-[11px]">
                              <strong className="text-amber-300 block text-[10px] uppercase tracking-wider">
                                ✨ What This Moon Phase Means Today:
                              </strong>
                              <p className="text-purple-100/90 leading-relaxed font-sans">
                                {planet.moonPhaseInfo.phaseMeaning}
                              </p>
                            </div>

                            <div className="pt-1.5 border-t border-purple-900/40 text-[10px] text-slate-300 space-y-0.5">
                              <strong className="text-cyan-300 block uppercase tracking-wider">
                                🕯️ Lunar Intention & Action:
                              </strong>
                              <p>
                                <strong>Intention:</strong> {planet.moonPhaseInfo.intention} — {planet.moonPhaseInfo.ritualAdvice}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px]">
                          <span className="rounded-lg bg-purple-950 px-2 py-0.5 text-amber-300 border border-purple-800 font-medium">
                            Element: {planet.element}
                          </span>
                          <span className="rounded-lg bg-purple-950 px-2 py-0.5 text-cyan-300 border border-purple-800 font-medium">
                            Status: {planet.dignity}
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

        {/* TAB 2: PLANETARY CONNECTIONS (ASPECTS) */}
        {activeTab === 'aspects' && (
          <div className="space-y-3">
            <div className="text-xs text-purple-200/90 px-1">
              How the planets connect and share energy today:
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
                    </div>

                    <span className={`rounded-full px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase ${
                      aspect.energyType === 'Harmonic'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : aspect.energyType === 'Dynamic'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    }`}>
                      {aspect.energyType === 'Harmonic' ? 'Harmonious Flow' : aspect.energyType === 'Dynamic' ? 'Growth & Action' : 'Intense Focus'}
                    </span>
                  </div>

                  <p className="text-xs text-purple-100 leading-relaxed font-sans">
                    {aspect.interpretation}
                  </p>

                  <div className="rounded-xl bg-purple-950/60 p-2 text-[11px] text-amber-200 font-medium border border-purple-900/40">
                    💡 Spiritual Focus: {aspect.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DAILY ENERGY SUMMARY */}
        {activeTab === 'spaceWeather' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-purple-800/60 bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 p-4 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-sans font-bold text-amber-300 uppercase">
                <Sparkles className="h-4 w-4" />
                <span>Today's Cosmic Energy Reading</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-sans">
                {matrix.proprietaryForecast}
              </p>
            </div>

            {/* Retrograde Summary */}
            <div className="rounded-2xl border border-purple-900/50 bg-slate-900/70 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif text-xs font-bold text-slate-200">
                  Planets in Retrograde ({retrogradeSummary.length})
                </span>
                <span className="font-sans text-[10px] text-rose-300 uppercase font-bold">
                  Time for Reflection
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {retrogradeSummary.map((item, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-rose-500/10 border border-rose-500/30 px-3 py-1 font-sans text-[10px] text-rose-200 font-semibold"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-purple-300 font-sans text-center">
              ✨ Grounded in real NASA astronomy data
            </div>
          </div>
        )}

        {/* TAB 4: SIMPLE GUIDE & WHAT THIS MEANS */}
        {activeTab === 'telemetryGuide' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-purple-950/60 via-slate-900 to-amber-950/30 p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-amber-400" />
                <h3 className="font-serif text-sm font-bold text-amber-200 uppercase tracking-wide">
                  Simple Guide: What the Sky Data Means
                </h3>
              </div>
              <p className="text-xs text-purple-200/90 leading-relaxed font-sans">
                We track real live NASA astronomy data to calculate exactly where the planets and moon are in the sky. Here is an easy guide explaining how space weather and planetary positions affect your daily life.
              </p>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {/* Metric 1: Cosmic Harmony Score */}
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
                        Cosmic Harmony Score
                      </h4>
                      <span className="font-sans text-[11px] text-amber-300">
                        Today's Vibe: {spaceWeather.resonanceGrade} ({spaceWeather.cosmicResonanceScore}%)
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 font-sans text-[10px] text-amber-300 font-bold">
                    Daily Overall Vibe
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-xs text-slate-200 font-sans leading-relaxed">
                  <div>
                    <strong className="text-amber-300">What it means: </strong>
                    This score measures how smooth and supportive the universal energy is today, combining the Moon phase, friendly planet connections, and calm space weather.
                  </div>
                  <div>
                    <strong className="text-purple-300">How it affects you: </strong>
                    <strong>High scores (75%+)</strong> mean conversations flow easily, creativity is boosted, and manifestations happen faster. <strong>Lower scores (under 50%)</strong> simply mean the day brings valuable lessons and invites patience and rest.
                  </div>
                </div>
              </div>

              {/* Metric 2: Solar Stream */}
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
                        Solar Stream (Sunlight Energy)
                      </h4>
                      <span className="font-sans text-[11px] text-purple-200">
                        Current: {spaceWeather.solarWindSpeed} km/s • {spaceWeather.solarWindStatus}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-purple-950 border border-purple-800 px-2.5 py-0.5 font-sans text-[10px] text-purple-300 font-bold">
                    Sun Energy
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-xs text-slate-200 font-sans leading-relaxed">
                  <div>
                    <strong className="text-amber-300">What it means: </strong>
                    The steady stream of light and particles flowing from the Sun toward Earth.
                  </div>
                  <div>
                    <strong className="text-purple-300">How it affects you: </strong>
                    A <strong>Calm & Steady stream</strong> brings relaxed focus and peace. When solar activity is <strong>High</strong>, you might feel an extra burst of energetic motivation, vivid dreams, or sudden flashes of inspiration!
                  </div>
                </div>
              </div>

              {/* Metric 3: Earth Field */}
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
                        Earth Magnetic Field
                      </h4>
                      <span className="font-sans text-[11px] text-cyan-300">
                        Status: {spaceWeather.kpStatus} (Kp {spaceWeather.kpIndex})
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 font-sans text-[10px] text-cyan-300 font-bold">
                    Grounding Level
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-xs text-slate-200 font-sans leading-relaxed">
                  <div>
                    <strong className="text-amber-300">What it means: </strong>
                    Measures how still or active Earth's protective magnetic field is right now on a scale of 0 to 9.
                  </div>
                  <div>
                    <strong className="text-purple-300">How it affects you: </strong>
                    <strong>Quiet / Calm (0–2)</strong> provides deep emotional grounding, clear thinking, and restful sleep. <strong>Active (3+)</strong> awakens inner sensitivity and prompts you to stay hydrated and take calming nature walks.
                  </div>
                </div>
              </div>

              {/* Metric 4: Sun Activity & Flares */}
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
                        Solar Flares & Light Bursts
                      </h4>
                      <span className="font-sans text-[11px] text-rose-300">
                        Activity: Class {spaceWeather.solarFlareFlux} (Quiet)
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 font-sans text-[10px] text-rose-300 font-bold">
                    Solar Pulses
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-xs text-slate-200 font-sans leading-relaxed">
                  <div>
                    <strong className="text-amber-300">What it means: </strong>
                    Natural bursts of energy released by the Sun.
                  </div>
                  <div>
                    <strong className="text-purple-300">How it affects you: </strong>
                    Quiet classes (A, B, C) represent normal, stable cosmic weather. Stronger flares help break through old mental habits and inspire fresh new life ideas.
                  </div>
                </div>
              </div>

              {/* Metric 5: Planet Positions in the Zodiac */}
              <div className="rounded-2xl border border-purple-900/50 bg-slate-900/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-bold text-slate-100">
                    Where the Planets are in the Zodiac
                  </h4>
                  <span className="rounded-full bg-purple-950 border border-purple-800 px-2.5 py-0.5 font-sans text-[10px] text-amber-300 font-bold">
                    Zodiac Signs
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-200 font-sans leading-relaxed">
                  <div>
                    <strong className="text-amber-300">What it means: </strong>
                    As the planets orbit through space, they pass in front of the 12 signs of the zodiac (like Aries, Taurus, Cancer, etc.).
                  </div>
                  <div>
                    <strong className="text-purple-300">How it affects you: </strong>
                    Each planet governs a part of life: <strong>Venus</strong> shapes love, <strong>Mercury</strong> shapes communication, and <strong>Mars</strong> drives motivation. The zodiac sign a planet is currently in gives that part of life its special flavor today.
                  </div>
                </div>
              </div>

              {/* Metric 6: Direct vs Retrograde */}
              <div className="rounded-2xl border border-purple-900/50 bg-slate-900/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-bold text-slate-100">
                    Direct Motion (●) vs. Retrograde (Rx)
                  </h4>
                  <span className="rounded-full bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 font-sans text-[10px] text-rose-300 font-bold">
                    Cosmic Rhythm
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-200 font-sans leading-relaxed">
                  <div>
                    <strong className="text-amber-300">What it means: </strong>
                    From our viewpoint on Earth, planets usually move forward across the sky (<strong>Direct</strong>). Occasionally, due to Earth passing them in orbit, they appear to slow down and move backward (<strong>Retrograde</strong>).
                  </div>
                  <div>
                    <strong className="text-purple-300">How it affects you: </strong>
                    <strong>Direct motion</strong> is the green light for new projects and moving ahead. <strong>Retrograde</strong> is not bad — it is simply the universe's reminder to slow down, double-check details, and reflect.
                  </div>
                </div>
              </div>

              {/* Metric 7: Planetary Connections (Aspects) */}
              <div className="rounded-2xl border border-purple-900/50 bg-slate-900/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-bold text-slate-100">
                    Planetary Connections & Angles (Aspects)
                  </h4>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 font-sans text-[10px] text-emerald-300 font-bold">
                    Shared Energy
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-200 font-sans leading-relaxed">
                  <div>
                    <strong className="text-amber-300">What it means: </strong>
                    When two planets align at certain angles in the sky, their energies blend together like two musical notes played in harmony.
                  </div>
                  <div>
                    <strong className="text-purple-300">How it affects you: </strong>
                    <strong>Harmonious angles (Trines & Sextiles)</strong> make things feel effortless and lucky. <strong>Dynamic angles (Squares & Oppositions)</strong> give you the spark and energy to overcome challenges and grow stronger.
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
