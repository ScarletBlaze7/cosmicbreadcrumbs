import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  FastForward, 
  Sparkles, 
  Headphones,
  CheckCircle2
} from 'lucide-react';
import { ZodiacSignInfo } from '../types';
import { ZODIAC_SIGNS } from '../data/zodiacData';
import { getCurrentAstrologerShift } from '../data/astrologerRoster';
import { generateExtendedAudioScript, astrologerSpeaker } from '../utils/aiAstrologerEngine';

interface AudioHoroscopePlayerProps {
  period: 'tomorrow' | 'weekly' | 'monthly';
  sign: ZodiacSignInfo;
  aiReading?: any;
  className?: string;
}

export const AudioHoroscopePlayer: React.FC<AudioHoroscopePlayerProps> = ({
  period,
  sign,
  aiReading,
  className = '',
}) => {
  const currentShift = getCurrentAstrologerShift();
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('female');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [spokenWord, setSpokenWord] = useState('');

  const safeSign = sign || ZODIAC_SIGNS[0];
  const activeAnchor = selectedGender === 'male' ? currentShift.maleAnchor : currentShift.femaleAnchor;
  const scriptText = generateExtendedAudioScript(period, safeSign, aiReading);

  const periodTitles: Record<string, string> = {
    tomorrow: 'Tomorrow’s Horizon Audio Forecast',
    weekly: '7-Day Weekly Transit Audio Forecast',
    monthly: 'Monthly Dimensional Audio Forecast',
  };

  useEffect(() => {
    return () => {
      astrologerSpeaker.stop();
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying && !isPaused) {
      astrologerSpeaker.pause();
      setIsPaused(true);
      return;
    }

    if (isPaused) {
      astrologerSpeaker.resume();
      setIsPaused(false);
      return;
    }

    astrologerSpeaker.stop();
    astrologerSpeaker.speak(
      scriptText,
      activeAnchor,
      playbackSpeed,
      (charIndex, word) => {
        setSpokenWord(word);
      },
      () => {
        setIsPlaying(false);
        setIsPaused(false);
        setSpokenWord('');
      },
      (speaking, paused) => {
        setIsPlaying(speaking);
        setIsPaused(paused);
      }
    );
  };

  const handleStop = () => {
    astrologerSpeaker.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setSpokenWord('');
  };

  const handleCycleSpeed = () => {
    const speeds = [0.9, 1.0, 1.15, 1.25];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
  };

  return (
    <div className={`rounded-2xl border border-purple-800/60 bg-gradient-to-r from-slate-950 via-[#100e23] to-slate-950 p-4 sm:p-5 shadow-xl space-y-3.5 ${className}`}>
      
      {/* Header with Narrator & Audio Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-900/40 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-900/60 text-amber-300 border border-purple-700/50">
            <Headphones className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-xs sm:text-sm font-bold text-slate-100">
                {periodTitles[period] || 'Celestial Audio Reading'}
              </span>
              <span className="rounded-full bg-purple-950 border border-purple-700/60 px-2 py-0.2 text-[9px] font-mono font-bold text-purple-300">
                AUDIO ONLY
              </span>
            </div>
            <p className="text-[10.5px] text-purple-300/80">
              Narrated by {activeAnchor.name} ({activeAnchor.title})
            </p>
          </div>
        </div>

        {/* Narrator Gender & Speed Switcher */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-purple-900/50 text-xs">
            <button
              type="button"
              onClick={() => {
                setSelectedGender('female');
                handleStop();
              }}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                selectedGender === 'female'
                  ? 'bg-purple-700 text-white'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              👩 {currentShift.femaleAnchor.name.split(' ')[0]}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedGender('male');
                handleStop();
              }}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                selectedGender === 'male'
                  ? 'bg-purple-700 text-white'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              👨 {currentShift.maleAnchor.name.startsWith('Dr.') ? 'Dr. Samson' : currentShift.maleAnchor.name.split(' ')[0]}
            </button>
          </div>

          <button
            type="button"
            onClick={handleCycleSpeed}
            className="px-2 py-1 rounded-lg bg-slate-900 border border-purple-900/50 text-[10px] font-mono text-purple-200 hover:text-white cursor-pointer"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>

      {/* Audio Playback Toolbar */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/90 rounded-xl p-3 border border-purple-900/50">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 shadow-md shadow-amber-900/30 transition-all cursor-pointer"
          >
            {isPlaying && !isPaused ? (
              <Pause className="h-4 w-4 fill-slate-950 text-slate-950" />
            ) : (
              <Play className="h-4 w-4 fill-slate-950 text-slate-950 ml-0.5" />
            )}
          </button>

          {isPlaying && (
            <button
              type="button"
              onClick={handleStop}
              className="p-2 rounded-lg bg-purple-950 hover:bg-purple-900 border border-purple-800 text-purple-300 hover:text-white cursor-pointer"
              title="Stop audio"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}

          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
              {isPlaying && !isPaused ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-emerald-300">Playing Audio Narration...</span>
                </>
              ) : isPaused ? (
                <span className="text-amber-300">Audio Paused</span>
              ) : (
                <span>Listen with Voice Narration</span>
              )}
            </div>
            <p className="text-[10px] text-purple-300/70 truncate max-w-xs">
              {spokenWord ? `Speaking: "${spokenWord}..."` : 'Tap play to listen to this forecast read aloud.'}
            </p>
          </div>
        </div>

        {/* Dynamic Waveform Bars (Audio visualizer without animated face) */}
        <div className="flex items-center space-x-1 pr-1">
          <span className={`w-1 rounded-full bg-purple-400 transition-all ${isPlaying && !isPaused ? 'h-5 animate-pulse' : 'h-1.5 opacity-40'}`} />
          <span className={`w-1 rounded-full bg-amber-400 transition-all ${isPlaying && !isPaused ? 'h-7 animate-pulse delay-75' : 'h-2.5 opacity-40'}`} />
          <span className={`w-1 rounded-full bg-cyan-400 transition-all ${isPlaying && !isPaused ? 'h-4 animate-pulse delay-150' : 'h-1.5 opacity-40'}`} />
          <span className={`w-1 rounded-full bg-purple-400 transition-all ${isPlaying && !isPaused ? 'h-6 animate-pulse delay-100' : 'h-2 opacity-40'}`} />
          <span className={`w-1 rounded-full bg-amber-300 transition-all ${isPlaying && !isPaused ? 'h-3 animate-pulse delay-200' : 'h-1 opacity-40'}`} />
        </div>
      </div>
    </div>
  );
};
