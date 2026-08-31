import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Globe2, 
  Clock, 
  Radio, 
  Users, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck,
  CheckCircle2,
  FastForward,
  Zap,
  Flame,
  Star
} from 'lucide-react';
import { ZodiacSignInfo } from '../types';
import { ZODIAC_SIGNS } from '../data/zodiacData';
import { 
  AstrologerProfile, 
  AstrologerShift, 
  getCurrentAstrologerShift, 
  ASTROLOGER_ROSTER,
  getAllNewscasters
} from '../data/astrologerRoster';
import { 
  generateDailyBroadcastScript, 
  GeneratedHoroscopeScript, 
  astrologerSpeaker 
} from '../utils/aiAstrologerEngine';
import { 
  getNewscasterPhoto, 
  saveNewscasterPhoto, 
  removeNewscasterPhoto 
} from '../utils/newscasterPhotoManager';
import { 
  getNewscasterVideoUrl, 
  saveNewscasterVideo, 
  removeNewscasterVideo 
} from '../utils/newscasterVideoManager';
import { ProfessionalAITalkingAvatar } from './ProfessionalAITalkingAvatar';

interface AnimatedAIAstrologerProps {
  sign: ZodiacSignInfo;
  loveStatus?: string;
  aiReading?: any;
  className?: string;
}

export const AnimatedAIAstrologer: React.FC<AnimatedAIAstrologerProps> = ({
  sign,
  loveStatus,
  aiReading,
  className = '',
}) => {
  // 1. Shift & Anchor State
  const [currentShift, setCurrentShift] = useState<AstrologerShift>(() => getCurrentAstrologerShift());
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('female');
  const [broadcastPart, setBroadcastPart] = useState<'part1' | 'part2' | 'duet'>('duet');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showShiftPicker, setShowShiftPicker] = useState(false);
  const [showPlanetsDetail, setShowPlanetsDetail] = useState(false);
  const [showTeleprompter, setShowTeleprompter] = useState(true);

  // 2. Playback & Animation State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeHost, setActiveHost] = useState<AstrologerProfile>(currentShift.femaleAnchor);
  const [spokenWordIndex, setSpokenWordIndex] = useState<number>(0);
  const [currentSpokenWord, setCurrentSpokenWord] = useState<string>('');
  const [isBlinking, setIsBlinking] = useState(false);
  const [mouthOpenAmount, setMouthOpenAmount] = useState<number>(0);

  // 3. Dynamic Video & Photo Asset State
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activePhotoUrl, setActivePhotoUrl] = useState<string | null>(null);
  const [assetUpdateTick, setAssetUpdateTick] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  // 4. Audio & Voice Availability
  const [hasVoiceSupport, setHasVoiceSupport] = useState(true);

  const safeSign = sign || ZODIAC_SIGNS[0];
  const activeAnchor = selectedGender === 'male' ? currentShift.maleAnchor : currentShift.femaleAnchor;
  const coAnchor = selectedGender === 'male' ? currentShift.femaleAnchor : currentShift.maleAnchor;

  // Generate Script dynamically based on current sign, shift, and NASA planetary positions
  const script: GeneratedHoroscopeScript = generateDailyBroadcastScript(
    safeSign,
    currentShift,
    activeAnchor,
    coAnchor,
    loveStatus,
    aiReading
  );

  // Check Web Speech API support
  useEffect(() => {
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setHasVoiceSupport(false);
    }
  }, []);

  // Update active host when gender or shift changes
  useEffect(() => {
    setActiveHost(selectedGender === 'male' ? currentShift.maleAnchor : currentShift.femaleAnchor);
  }, [selectedGender, currentShift]);

  // Load active video / photo for the currently active anchor
  useEffect(() => {
    let isMounted = true;

    async function loadAssets() {
      const vidUrl = await getNewscasterVideoUrl(activeHost.id);
      const photoUrl = getNewscasterPhoto(activeHost.id, activeHost.imageUrl) || null;

      if (isMounted) {
        setActiveVideoUrl(vidUrl);
        setActivePhotoUrl(photoUrl);
      }
    }

    loadAssets();
    return () => {
      isMounted = false;
    };
  }, [activeHost.id, assetUpdateTick]);

  // Synchronize Video Playback with Broadcast Speech
  useEffect(() => {
    if (!videoRef.current) return;

    if (isPlaying && !isPaused) {
      videoRef.current.play().catch(() => {});
    } else if (isPaused) {
      videoRef.current.pause();
    } else {
      videoRef.current.pause();
      try {
        videoRef.current.currentTime = 0;
      } catch (e) {}
    }
  }, [isPlaying, isPaused, activeVideoUrl]);

  // Listen for newscaster asset updates across the app
  useEffect(() => {
    const handleAssetUpdate = () => {
      setAssetUpdateTick((prev) => prev + 1);
    };
    window.addEventListener('newscaster-video-updated', handleAssetUpdate);
    window.addEventListener('newscaster-photo-updated', handleAssetUpdate);
    return () => {
      window.removeEventListener('newscaster-video-updated', handleAssetUpdate);
      window.removeEventListener('newscaster-photo-updated', handleAssetUpdate);
    };
  }, []);

  // Periodic Eye Blink Simulation for avatar/photo mode
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3800 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Mouth Movement / Lip-sync Animation for vector/photo mode
  useEffect(() => {
    let mouthInterval: any;
    if (isPlaying && !isPaused) {
      mouthInterval = setInterval(() => {
        setMouthOpenAmount(Math.random() > 0.3 ? Math.floor(Math.random() * 70 + 30) : 10);
      }, 120);
    } else {
      setMouthOpenAmount(0);
    }

    return () => clearInterval(mouthInterval);
  }, [isPlaying, isPaused]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      astrologerSpeaker.stop();
    };
  }, []);



  // --- PLAYBACK HANDLERS ---
  const handlePlayBroadcast = (partToPlay: 'part1' | 'part2' | 'duet') => {
    if (isPaused) {
      astrologerSpeaker.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    astrologerSpeaker.stop();
    setBroadcastPart(partToPlay);
    setIsPlaying(true);
    setIsPaused(false);

    if (partToPlay === 'part1') {
      setActiveHost(activeAnchor);
      setCurrentSpokenWord(script.part1Text.split(' ')[0] || '');
      astrologerSpeaker.speak(
        script.part1Text,
        activeAnchor,
        playbackSpeed,
        (charIndex, word) => {
          setSpokenWordIndex(charIndex);
          setCurrentSpokenWord(word);
        },
        () => {
          setIsPlaying(false);
          setIsPaused(false);
          setSpokenWordIndex(0);
        },
        (speaking, paused) => {
          setIsPlaying(speaking);
          setIsPaused(paused);
        }
      );
    } else if (partToPlay === 'part2') {
      setActiveHost(coAnchor);
      setCurrentSpokenWord(script.part2Text.split(' ')[0] || '');
      astrologerSpeaker.speak(
        script.part2Text,
        coAnchor,
        playbackSpeed,
        (charIndex, word) => {
          setSpokenWordIndex(charIndex);
          setCurrentSpokenWord(word);
        },
        () => {
          setIsPlaying(false);
          setIsPaused(false);
          setSpokenWordIndex(0);
        },
        (speaking, paused) => {
          setIsPlaying(speaking);
          setIsPaused(paused);
        }
      );
    } else {
      // DUET BROADCAST: Lead anchor speaks Part 1, then seamless handoff to Co-anchor for Part 2!
      setActiveHost(activeAnchor);
      setCurrentSpokenWord(script.part1Text.split(' ')[0] || '');
      astrologerSpeaker.speak(
        script.part1Text,
        activeAnchor,
        playbackSpeed,
        (charIndex, word) => {
          setSpokenWordIndex(charIndex);
          setCurrentSpokenWord(word);
        },
        () => {
          // Seamless Hand-off to Co-Anchor!
          setActiveHost(coAnchor);
          setCurrentSpokenWord(script.part2Text.split(' ')[0] || '');
          setTimeout(() => {
            astrologerSpeaker.speak(
              script.part2Text,
              coAnchor,
              playbackSpeed,
              (charIndex, word) => {
                setSpokenWordIndex(charIndex);
                setCurrentSpokenWord(word);
              },
              () => {
                setIsPlaying(false);
                setIsPaused(false);
                setSpokenWordIndex(0);
              },
              (speaking, paused) => {
                setIsPlaying(speaking);
                setIsPaused(paused);
              }
            );
          }, 200);
        },
        (speaking, paused) => {
          setIsPlaying(speaking);
          setIsPaused(paused);
        }
      );
    }
  };

  const handlePauseBroadcast = () => {
    astrologerSpeaker.pause();
    setIsPaused(true);
  };

  const handleStopBroadcast = () => {
    astrologerSpeaker.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setSpokenWordIndex(0);
    setMouthOpenAmount(0);
  };

  const handleCycleSpeed = () => {
    const speeds = [0.9, 1.0, 1.15, 1.25];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
    if (isPlaying && !isPaused) {
      handlePlayBroadcast(broadcastPart);
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl border-2 border-amber-400/60 bg-gradient-to-b from-slate-900 via-[#0d0c1d] to-slate-950 p-5 sm:p-7 shadow-2xl shadow-purple-950/80 space-y-5 ${className}`}>
      


      {/* Background Studio Cosmic Aura */}
      <div className={`pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-br ${activeHost.avatarConfig.auraGradient} blur-3xl opacity-60 transition-all duration-700`} />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-600/15 blur-3xl" />

      {/* TOP HEADER: LIVE SHIFT NEWSROOM & SCHEDULE */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-900/60 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
              LIVE ON DUTY • {currentShift.name.toUpperCase()}
            </span>
            <span className="rounded-full bg-purple-950/90 border border-purple-700/60 px-2 py-0.5 font-mono text-[9px] text-purple-300 font-bold">
              {currentShift.timeRange}
            </span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>Universal News Animated AI Broadcast</span>
            <span className="text-xs font-sans font-normal text-purple-300">
              ({sign.name} {sign.symbol})
            </span>
          </h3>
          <p className="text-[11px] text-purple-300/80 italic">
            {currentShift.speciesTheme}
          </p>
        </div>

        {/* Action Buttons: Shift Picker */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowShiftPicker(!showShiftPicker)}
            className="flex items-center space-x-1.5 rounded-xl border border-purple-800/70 bg-slate-950/80 px-3.5 py-1.5 text-xs font-semibold text-purple-200 hover:border-amber-400/60 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>Shift Roster</span>
            {showShiftPicker ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* SHIFT ROSTER DRAWER (Explore Morning, Afternoon, Night teams) */}
      {showShiftPicker && (
        <div className="rounded-2xl border border-purple-800/60 bg-slate-950/95 p-4 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs text-purple-300 border-b border-purple-900/50 pb-2">
            <span className="font-bold uppercase tracking-wider text-amber-300">
              Alien Star Race Shift Schedule
            </span>
            <span>Local Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['morning', 'afternoon', 'night'] as const).map((shiftKey) => {
              const shift = ASTROLOGER_ROSTER[shiftKey];
              const isCurrent = currentShift.id === shiftKey;

              return (
                <div
                  key={shiftKey}
                  onClick={() => {
                    setCurrentShift(shift);
                    setActiveHost(selectedGender === 'male' ? shift.maleAnchor : shift.femaleAnchor);
                    handleStopBroadcast();
                  }}
                  className={`rounded-xl border p-3 transition-all cursor-pointer ${
                    isCurrent
                      ? 'border-amber-400 bg-purple-950/50 shadow-md shadow-purple-950'
                      : 'border-purple-900/60 bg-slate-900/50 hover:border-purple-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xs font-bold text-slate-100">{shift.name}</span>
                    {isCurrent && (
                      <span className="rounded bg-amber-500/20 px-1.5 py-0.2 font-mono text-[9px] font-bold text-amber-300 border border-amber-400/40">
                        NOW
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-amber-300/80 font-mono mt-0.5">{shift.speciesTheme.split('•')[0]}</div>
                  <div className="text-[10px] text-purple-300 font-mono mt-0.5">{shift.timeRange}</div>
                  
                  <div className="mt-2 text-[11px] text-slate-300 space-y-0.5">
                    <div>👨 {shift.maleAnchor.name}</div>
                    <div>👩 {shift.femaleAnchor.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MAIN STAGE: READING ON TOP, VIDEO BELOW THE READING */}
      <div className="space-y-6">
        
        {/* 1. DAILY HOROSCOPE FORECAST READING (ON TOP) */}
        <div className="rounded-3xl border-2 border-purple-800/70 bg-gradient-to-b from-[#110c2e] via-slate-950 to-slate-950 p-5 sm:p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between text-xs text-purple-300 border-b border-purple-900/60 pb-3">
            <span className="font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2 text-sm sm:text-base">
              <Radio className="h-5 w-5 text-amber-400" />
              <span>Daily Horoscope Forecast Reading</span>
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-amber-300 font-mono font-bold bg-amber-950/80 px-3 py-1 rounded-xl border border-amber-500/40">
                {sign.name} • {activeHost.species} Broadcast
              </span>
            </div>
          </div>

          {/* Reading Script Paragraphs */}
          <div className="space-y-4 text-base sm:text-lg leading-relaxed text-slate-100 font-sans">
            <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/40 border border-purple-800/60 space-y-2">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase font-mono">
                <span>🎙️ Lead Astrologer:</span>
                <span>{activeAnchor.name} ({activeAnchor.speciesBadge})</span>
              </div>
              <p className="text-slate-100 font-sans leading-relaxed">
                {script.part1Text}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/20 border border-cyan-900/50 space-y-2">
              <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 uppercase font-mono">
                <span>🎙️ Planetary & Lunar Influences:</span>
                <span>{coAnchor.name} ({coAnchor.speciesBadge})</span>
              </div>
              <p className="text-slate-200 font-sans leading-relaxed">
                {script.part2Text}
              </p>
            </div>
          </div>
        </div>

        {/* 2. NEWSCASTER VIDEO PLAYER (BELOW THE READING) */}
        <div className="flex flex-col items-center justify-center space-y-4 pt-2">
          
          {/* Animated Video / Avatar Medallion */}
          <div className="relative group">
            
            {/* Outer Pulsing Species Aura Ring */}
            <div className={`absolute -inset-3 rounded-3xl transition-all duration-700 pointer-events-none ${
              activeHost.species === 'Lyran'
                ? 'aura-lyran-active bg-gradient-to-r from-amber-500/40 via-yellow-400/30 to-amber-600/40'
                : activeHost.species === 'Lemurian'
                ? 'aura-lemurian-active bg-gradient-to-r from-teal-400/40 via-emerald-400/30 to-cyan-500/40'
                : 'aura-arcturian-active bg-gradient-to-r from-indigo-500/40 via-purple-500/30 to-violet-600/40'
            } ${isPlaying && !isPaused ? 'opacity-100 scale-105' : 'opacity-40'}`} />

            {/* Main Stage Frame Box with Direct On-Video Controls */}
            <div 
              className={`relative ${activeVideoUrl || activePhotoUrl ? 'w-56 sm:w-64 md:w-72 aspect-[3/4] rounded-3xl' : 'h-48 w-48 sm:h-56 sm:w-56 rounded-full'} border-4 ${
                activeHost.species === 'Lyran'
                  ? 'border-amber-400/90'
                  : activeHost.species === 'Lemurian'
                  ? 'border-teal-400/90'
                  : 'border-indigo-400/90'
              } bg-gradient-to-b from-slate-900 via-[#100d24] to-slate-950 overflow-hidden shadow-2xl flex items-center justify-center transition-all duration-300 group`}
            >
              
              {activeVideoUrl ? (
                // 🎬 1. HIGH-DEFINITION ANIMATED SPEAKING VIDEO
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    src={activeVideoUrl}
                    loop
                    playsInline
                    muted
                    className="w-full h-full object-cover object-top select-none"
                  />
                </div>
              ) : activePhotoUrl ? (
                // 🌟 2. PROFESSIONAL NEURAL AI TALKING AVATAR (ACTIVE MOVING LIPS & JAW)
                <div className="relative w-full h-full overflow-hidden bg-slate-950">
                  <ProfessionalAITalkingAvatar
                    photoUrl={activePhotoUrl}
                    activeHost={activeHost}
                    isPlaying={isPlaying}
                    isPaused={isPaused}
                    currentSpokenWord={currentSpokenWord}
                  />
                </div>
              ) : (
                // 🎨 3. DYNAMIC VECTOR STAR-RACE HOLOGRAM
                <>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-purple-950/70 to-slate-950" />
                  <div className="absolute top-3 left-4 text-amber-300/40 text-[10px]">✦</div>
                  <div className="absolute top-8 right-6 text-purple-300/30 text-[8px]">✦</div>
                  <div className="absolute bottom-10 left-8 text-cyan-300/40 text-[9px]">✦</div>

                  <svg 
                    viewBox="0 0 200 200" 
                    className="w-full h-full relative z-10 select-none pointer-events-none transition-transform duration-300"
                  >
                    {/* Body & Clothing */}
                    <g className={isPlaying && !isPaused ? 'animate-bounce-subtle' : ''}>
                      <path 
                        d="M30 200 C30 145, 60 135, 100 135 C140 135, 170 145, 170 200 Z" 
                        fill={activeHost.avatarConfig.clothingColor} 
                      />
                      <path 
                        d="M80 135 L100 165 L120 135 Z" 
                        fill="#F59E0B" 
                        opacity="0.9" 
                      />
                    </g>

                    <rect x="88" y="105" width="24" height="35" rx="6" fill={activeHost.avatarConfig.skinTone} />
                    <ellipse cx="100" cy="80" rx="34" ry="40" fill={activeHost.avatarConfig.skinTone} />
                  </svg>
                </>
              )}

              {/* CENTER OVERLAY PLAY BUTTON (When Paused or Idle) */}
              {(!isPlaying || isPaused) && (
                <button
                  type="button"
                  onClick={() => handlePlayBroadcast(broadcastPart || 'part1')}
                  className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/40 hover:bg-slate-950/20 backdrop-blur-[1px] transition-all cursor-pointer group"
                  title="Play Horoscope Broadcast"
                >
                  <div className="flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-2xl shadow-amber-500/50 group-hover:scale-110 transition-transform ring-4 ring-amber-300/60">
                    <Play className="h-8 w-8 fill-slate-950 translate-x-0.5" />
                  </div>
                </button>
              )}

              {/* DIRECT ON-VIDEO BOTTOM CONTROL BAR (Play, Pause, Stop & Equalizer) */}
              <div className="absolute bottom-2 inset-x-2 z-30 flex items-center justify-between rounded-2xl bg-slate-950/90 backdrop-blur-md border border-purple-600/60 px-3 py-1.5 shadow-2xl">
                
                {/* Left: Play/Pause Toggle */}
                {isPlaying && !isPaused ? (
                  <button
                    type="button"
                    onClick={handlePauseBroadcast}
                    className="flex items-center space-x-1 p-1 rounded-lg text-amber-300 hover:text-white transition-colors cursor-pointer"
                    title="Pause Broadcast"
                  >
                    <Pause className="h-4 w-4 fill-amber-300" />
                    <span className="text-[11px] font-bold">Pause</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePlayBroadcast(broadcastPart || 'part1')}
                    className="flex items-center space-x-1 p-1 rounded-lg text-amber-300 hover:text-white transition-colors cursor-pointer"
                    title="Play Broadcast"
                  >
                    <Play className="h-4 w-4 fill-amber-300" />
                    <span className="text-[11px] font-bold">Play</span>
                  </button>
                )}

                {/* Center: Live Equalizer Waveform */}
                {isPlaying && !isPaused ? (
                  <div className="flex items-center space-x-1">
                    <span className="w-1 h-3 rounded-full animate-eq-1 bg-amber-400" />
                    <span className="w-1 h-4 rounded-full animate-eq-2 bg-yellow-300" />
                    <span className="w-1 h-5 rounded-full animate-eq-3 bg-amber-500" />
                    <span className="w-1 h-3.5 rounded-full animate-eq-4 bg-teal-300" />
                    <span className="w-1 h-2.5 rounded-full animate-eq-5 bg-indigo-300" />
                  </div>
                ) : (
                  <span className="text-[10px] font-mono text-purple-300 uppercase font-bold tracking-wider">
                    {isPaused ? 'PAUSED' : 'READY'}
                  </span>
                )}

                {/* Right: Stop Button */}
                <button
                  type="button"
                  onClick={handleStopBroadcast}
                  className={`flex items-center space-x-1 p-1 rounded-lg transition-colors cursor-pointer ${
                    isPlaying 
                      ? 'text-rose-400 hover:text-rose-200 hover:bg-rose-950/50' 
                      : 'text-purple-400 hover:text-purple-200'
                  }`}
                  title="Stop and Reset Broadcast"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="text-[11px] font-bold">Stop</span>
                </button>
              </div>
            </div>
          </div>

          {/* Anchor Name Tag, Star Species Badge & Title */}
          <div className="text-center space-y-1">
            <div className="font-serif text-lg font-bold text-slate-100 flex items-center justify-center gap-2">
              <span>{activeHost.name}</span>
              <span className="rounded-lg bg-amber-500/20 text-amber-300 text-xs font-mono px-2.5 py-0.5 border border-amber-400/40 font-bold">
                {activeHost.speciesBadge}
              </span>
            </div>
            <p className="text-xs text-purple-300/90 font-medium">{activeHost.title}</p>
          </div>

          {/* Co-Host / Anchor Toggle (Male vs. Female On-Duty) */}
          <div className="flex items-center space-x-2 bg-slate-950/90 rounded-2xl p-1.5 border border-purple-800/50">
            <button
              type="button"
              onClick={() => {
                setSelectedGender('male');
                handleStopBroadcast();
              }}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedGender === 'male'
                  ? 'bg-purple-700 text-white shadow-md border border-purple-500'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <span>👨 {currentShift.maleAnchor.name.startsWith('Dr.') ? 'Dr. Samson' : currentShift.maleAnchor.name.split(' ')[0]}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedGender('female');
                handleStopBroadcast();
              }}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedGender === 'female'
                  ? 'bg-purple-700 text-white shadow-md border border-purple-500'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <span>👩 {currentShift.femaleAnchor.name.split(' ')[0]}</span>
            </button>
          </div>

          {/* 📺 LIVE BROADCAST CAPTIONS (Directly Under Video) */}
          <div className="w-full max-w-md rounded-2xl border-2 border-amber-400/60 bg-black/95 p-4 space-y-2 shadow-2xl shadow-purple-950/80">
            <div className="flex items-center justify-between border-b border-purple-900/60 pb-2">
              <div className="flex items-center space-x-2">
                <span className="rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono px-2 py-0.5 font-black border border-amber-400/40">
                  CC
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                  Live Broadcast Captions
                </span>
              </div>
              
              {isPlaying && !isPaused ? (
                <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-mono font-bold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>ON-AIR</span>
                </div>
              ) : (
                <span className="text-xs font-mono text-purple-400 font-bold">
                  STANDBY
                </span>
              )}
            </div>

            {/* Captions Text Area */}
            <div className="min-h-[56px] flex items-center justify-center text-center px-1">
              {isPlaying ? (
                <p className="text-sm font-sans font-medium text-slate-100 leading-snug">
                  <span className="text-amber-300 font-bold mr-1.5">
                    {activeHost.name.split(' ')[0]}:
                  </span>
                  <span>
                    "{currentSpokenWord ? (
                      broadcastPart === 'part1' ? script.part1Text : broadcastPart === 'part2' ? script.part2Text : (activeHost.id === activeAnchor.id ? script.part1Text : script.part2Text)
                    ) : 'Broadcasting...'}"
                  </span>
                </p>
              ) : (
                <p className="text-xs text-purple-300/80 italic">
                  Tap the Play button on the video above to start listening with synchronized captions.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
