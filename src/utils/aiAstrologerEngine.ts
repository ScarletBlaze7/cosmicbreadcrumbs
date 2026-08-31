import { ZodiacSignInfo } from '../types';
import { AstrologerProfile, AstrologerShift, getCurrentAstrologerShift, ASTROLOGER_ROSTER } from '../data/astrologerRoster';
import { getMoonPhaseInfo } from './astrologyCalc';
import { getRealtimeAstrologicalMatrix, PlanetaryPosition } from './nasaEphemeris';

export interface GeneratedHoroscopeScript {
  part1Text: string;
  part1Formatted: string;
  part2Text: string;
  part2Formatted: string;
  fullDuetText: string;
  moonCycleSummary: {
    phase: string;
    illumination: number;
    moonSign: string;
    meaning: string;
  };
  planetaryPositionsSummary: Array<{
    planet: string;
    symbol: string;
    position: string;
    meaning: string;
  }>;
}

/**
 * Planet Core Meanings Matrix in Astrology
 */
const PLANET_MEANINGS: Record<string, { role: string; meaning: string }> = {
  Sun: {
    role: 'Conscious Vitality & Life Force',
    meaning: 'Illuminates your core willpower, identity, and the main stage of your creative self-expression today.',
  },
  Moon: {
    role: 'Emotional Realm & Intuitive Instincts',
    meaning: 'Directs your emotional weather, inner security, and how your intuition senses subtle surroundings.',
  },
  Mercury: {
    role: 'Mind, Intellect & Communication',
    meaning: 'Governs your conversational flow, mental speed, contracts, and how easily ideas click into place.',
  },
  Venus: {
    role: 'Love, Values & Creative Harmony',
    meaning: 'Shapes romantic attractions, artistic inspiration, personal self-worth, and financial flow.',
  },
  Mars: {
    role: 'Passion, Courage & Driving Ambition',
    meaning: 'Fuels your motivation, physical stamina, leadership initiative, and readiness to take bold action.',
  },
  Jupiter: {
    role: 'Expansion, Fortune & Wisdom',
    meaning: 'Opens doors of opportunity, magnifies optimism, and brings blessings to your spiritual growth.',
  },
  Saturn: {
    role: 'Discipline, Karma & Long-Term Mastery',
    meaning: 'Demands accountability, builds solid boundaries, and rewards patient, steadfast perseverance.',
  },
  Uranus: {
    role: 'Awakening, Innovation & Breakthroughs',
    meaning: 'Sparks electrifying original epiphanies, sudden cosmic pivots, and liberating authenticity.',
  },
  Neptune: {
    role: 'Dreams, Mysticism & Divine Transcendence',
    meaning: 'Heightens psychic telepathy, artistic reverie, spiritual compassion, and soulful dreaming.',
  },
  Pluto: {
    role: 'Rebirth, Transformation & Soul Empowerment',
    meaning: 'Dissolves what no longer serves you to unleash profound inner rebirth and personal sovereignty.',
  },
};

/**
 * Generate a complete, spoken broadcast script tailored to the sign and current planetary coordinates
 */
export function generateDailyBroadcastScript(
  sign: ZodiacSignInfo,
  shift: AstrologerShift,
  leadHost: AstrologerProfile,
  coHost: AstrologerProfile,
  loveStatus?: string,
  aiReading?: any
): GeneratedHoroscopeScript {
  const moon = getMoonPhaseInfo();
  const matrix = getRealtimeAstrologicalMatrix();

  const planetSummaries = (matrix?.planets || []).slice(0, 10).map((p) => {
    const meta = PLANET_MEANINGS[p.name] || {
      role: 'Cosmic Indicator',
      meaning: `Emphasizes ${p.zodiacSign || 'cosmic'} energy in your chart today.`,
    };
    return {
      planet: p.name || 'Planet',
      symbol: p.symbol || '✦',
      position: `${p.degrees ?? 0}° ${p.minutes ?? 0}' ${p.zodiacSign || ''} ${p.isRetrograde ? '(Retrograde)' : ''}`.trim(),
      meaning: `${p.name} in ${p.zodiacSign || 'the heavens'} (${p.degrees ?? 0}°): ${meta.meaning}`,
    };
  });

  const timeGreeting = shift?.id === 'morning' 
    ? 'Good morning' 
    : shift?.id === 'afternoon' 
    ? 'Good afternoon' 
    : 'Good evening and welcome to tonight’s cosmic sanctuary';

  const signName = sign?.name || 'Cosmic Seeker';
  const signGlyph = sign?.glyph || 'Star Born';
  const signElement = sign?.element || 'Cosmic Fire';
  const signRuler = sign?.rulingPlanet || 'the Sun';
  const signDescription = sign?.traits?.description || 'Your celestial energy is aligned with universal wisdom.';
  const signMotto = sign?.traits?.motto || 'I awaken the universe within.';
  const luckyNums = sign?.dailyTraits?.luckyNumbers?.join(', ') || '3, 7, 9, 33';
  const luckyColor = sign?.dailyTraits?.luckyColor || 'Golden Starlight';
  const powerHour = sign?.dailyTraits?.luckyTime || '11:11 AM';

  // --- PART 1: LEAD ANCHOR (Daily Horoscope Overview) ---
  const part1Text = 
    `${timeGreeting}, traveler. I am ${leadHost?.name || 'Your AI Guide'}, on duty for the ${shift?.name || 'Sanctuary Broadcast'}. ` +
    `Here is your official daily celestial forecast for ${signName}, ${signGlyph}. ` +
    `Today, as a ${signElement} sign ruled by ${signRuler}, the universe invites you to step into your highest power. ` +
    (aiReading?.overview 
      ? `${aiReading.overview} ` 
      : `${signDescription} Your celestial motto for today is: "${signMotto}". `) +
    `Stay anchored in your truth as the cosmic tides unfold. Next, my co-host ${coHost?.name || 'our Co-Anchor'} will walk you through today’s live Moon cycle and exact planetary positions.`;

  const part1Formatted = 
    `🌟 **${leadHost?.name || 'Lead Anchor'} (${leadHost?.title || 'Astrologer'})**: "${part1Text}"`;

  // --- PART 2: CO-ANCHOR (Remaining Horoscope: Moon Cycles, Planetary Positions & Deep Daily Readings) ---
  const planetHighlightSpeech = planetSummaries
    .slice(0, 5)
    .map((p) => `${p.planet} sits in ${p.position}. ${p.meaning}`)
    .join(' ');

  const part2Text = 
    `Thank you, ${leadHost?.name || 'Lead Anchor'}. I am ${coHost?.name || 'Co-Anchor'}, and I have your remaining cosmic coordinates for today. ` +
    `First, let's examine the cycles of the Moon. Right now, we are under the ${moon?.phaseName || 'Waxing Moon'} at ${moon?.illumination ?? 50} percent illumination, traveling through ${moon?.moonSign || 'Cancer'}. ` +
    `${moon?.ritualAdvice || 'Center your spirit in gratitude.'} This lunar phase brings a sacred focus on ${moon?.intention || 'Divine Alignment'}. ` +
    `Now looking at our live planetary positions: ${planetHighlightSpeech || 'Planetary aspects are supporting steady growth.'} ` +
    `In relationships and love: ${aiReading?.aspects?.love || 'Venus and the Moon encourage open-hearted communication, harmony, and mutual understanding.'} ` +
    `In career and prosperity: ${aiReading?.aspects?.career || 'Focus your intention with steady dedication; practical steps taken today yield long-term celestial rewards.'} ` +
    `Your lucky numbers today are ${luckyNums}, cosmic color is ${luckyColor}, and harmonic power hour is ${powerHour}. ` +
    `Remember: the universe is always leaving breadcrumbs for you—walk your path with courage and peace.`;

  const part2Formatted = 
    `🌙 **${coHost?.name || 'Co-Anchor'} (${coHost?.title || 'Astrologer'})**: "${part2Text}"`;

  const fullDuetText = `${part1Text} ... ${part2Text}`;

  return {
    part1Text,
    part1Formatted,
    part2Text,
    part2Formatted,
    fullDuetText,
    moonCycleSummary: {
      phase: moon?.phaseName || 'Moon Phase',
      illumination: moon?.illumination ?? 50,
      moonSign: moon?.moonSign || 'Zodiac Sign',
      meaning: `${moon?.ritualAdvice || 'Embrace peace.'} (Intention: ${moon?.intention || 'Alignment'})`,
    },
    planetaryPositionsSummary: planetSummaries,
  };
}

/**
 * Generate Audio-only scripts for Tomorrow, Weekly, and Monthly horoscopes (No animated face)
 */
export function generateExtendedAudioScript(
  period: 'tomorrow' | 'weekly' | 'monthly',
  sign: ZodiacSignInfo,
  aiReading?: any
): string {
  const moon = getMoonPhaseInfo();
  const signName = sign?.name || 'Seeker';
  const signRuler = sign?.rulingPlanet || 'the stars';
  
  if (period === 'tomorrow') {
    return (
      `Astrological Horizon Forecast for ${signName} for Tomorrow. ` +
      (aiReading?.overview 
        ? `${aiReading.overview} ` 
        : `Tomorrow’s planetary transits bring a fresh shift in perspective. With ${signRuler} continuing its alignment, expect subtle awakenings in communication and creative flow. `) +
      `The Moon will continue its journey through ${moon?.moonSign || 'the heavens'}, inviting you to plan ahead and stay centered. ` +
      `Love & Relations: ${aiReading?.aspects?.love || 'Favorable moments for honest talks and emotional clarity.'} ` +
      `Career & Ambition: ${aiReading?.aspects?.career || 'A productive window opens for strategic problem solving.'} ` +
      `Affirmation for tomorrow: "I welcome new opportunities with clarity and peace."`
    );
  }

  if (period === 'weekly') {
    return (
      `7-Day Weekly Transit Forecast for ${signName}. ` +
      (aiReading?.overview 
        ? `${aiReading.overview} ` 
        : `This week brings dynamic momentum across your chart. Early in the week, solar currents boost confidence and decisive action. Mid-week lunar aspects highlight relationships, while the weekend offers deep restorative peace. `) +
      `Major Transit Highlight: Harmonious sextiles and trines support creative ventures and financial stability. ` +
      `Weekly Action Step: Trust your intuition when making key commitments. Step forward with faith in universal timing.`
    );
  }

  // Monthly
  return (
    `Full Monthly Dimensional Synthesis for ${signName}. ` +
    (aiReading?.overview 
      ? `${aiReading.overview} ` 
      : `This month marks a significant chapter of growth, realignment, and self-discovery. As planetary retrogrades and direct stations balance your houses, you are guided to release old habits and step into your highest soul frequency. `) +
    `Key Themes: Evolution, abundance, authentic relationships, and spiritual awakening. ` +
    `Universal Blessing: "May your path be illuminated by wisdom, guided by celestial love, and blessed with boundless joy."`
  );
}

/**
 * Web Speech API Text-to-Speech Controller with boundary tracking for lip-sync animation
 */
// Global reference list to prevent Chrome/Edge garbage collection of active SpeechSynthesisUtterance objects
declare global {
  interface Window {
    __cosmicActiveUtterances?: SpeechSynthesisUtterance[];
    __cosmicResumeInterval?: any;
  }
}

export class AIAstrologerSpeaker {
  private synth: SpeechSynthesis | null = null;
  private isSpeaking = false;
  private voices: SpeechSynthesisVoice[] = [];
  private onBoundaryCallback: ((charIndex: number, word: string) => void) | null = null;
  private onStateChangeCallback: ((speaking: boolean, paused: boolean) => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private fallbackInterval: any = null;
  private resumeTimer: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    try {
      this.voices = this.synth.getVoices();
    } catch (e) {}
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voices || [];
  }

  private findBestVoice(astrologer: AstrologerProfile): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.getAvailableVoices();
    if (!voices || voices.length === 0) return null;

    // 1. Try preferred voice names
    for (const pref of (astrologer.voiceSettings?.preferredVoiceNames || [])) {
      const match = voices.find((v) => v.name.toLowerCase().includes(pref.toLowerCase()));
      if (match) return match;
    }

    // 2. Filter English voices
    const englishVoices = voices.filter((v) => v.lang.startsWith('en'));
    const pool = englishVoices.length > 0 ? englishVoices : voices;

    if (astrologer.gender === 'female') {
      const femaleMatch = pool.find((v) => {
        const n = v.name.toLowerCase();
        return n.includes('female') || n.includes('woman') || n.includes('zira') || n.includes('samantha') || n.includes('victoria') || n.includes('karen') || n.includes('susan') || n.includes('serena') || n.includes('jenny');
      });
      if (femaleMatch) return femaleMatch;
    } else {
      const maleMatch = pool.find((v) => {
        const n = v.name.toLowerCase();
        return n.includes('male') || n.includes('man') || n.includes('david') || n.includes('alex') || n.includes('george') || n.includes('mark') || n.includes('daniel') || n.includes('fred');
      });
      if (maleMatch) return maleMatch;
    }

    return pool[0] || null;
  }

  public speak(
    text: string,
    astrologer: AstrologerProfile,
    speed = 1.0,
    onBoundary?: (charIndex: number, word: string) => void,
    onEnd?: () => void,
    onStateChange?: (speaking: boolean, paused: boolean) => void
  ) {
    this.stop();
    this.onBoundaryCallback = onBoundary || null;
    this.onEndCallback = onEnd || null;
    this.onStateChangeCallback = onStateChange || null;

    if (!this.synth || typeof window === 'undefined') {
      this.runVisualFallback(text);
      return;
    }

    try {
      this.synth.cancel();
      this.synth.resume();
    } catch (e) {}

    // Initialize global utterance array to protect from V8 Garbage Collection
    if (!window.__cosmicActiveUtterances) {
      window.__cosmicActiveUtterances = [];
    }

    // Split text into natural sentence chunks for continuous, glitch-free narration
    const rawChunks = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    const sentenceChunks = rawChunks.map((s) => s.trim()).filter(Boolean);

    if (sentenceChunks.length === 0) {
      this.cleanup();
      return;
    }

    this.isSpeaking = true;
    this.onStateChangeCallback?.(true, false);

    // Keep-alive heartbeat interval to prevent Chrome from pausing long utterances
    if (this.resumeTimer) clearInterval(this.resumeTimer);
    this.resumeTimer = setInterval(() => {
      if (this.synth && this.isSpeaking) {
        this.synth.resume();
      }
    }, 4000);

    const selectedVoice = this.findBestVoice(astrologer);
    let cumulativeCharIndex = 0;

    sentenceChunks.forEach((chunkText, index) => {
      const utterance = new SpeechSynthesisUtterance(chunkText);
      const chunkOffset = cumulativeCharIndex;
      cumulativeCharIndex += chunkText.length + 1;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.pitch = astrologer?.voiceSettings?.pitch || 1.0;
      utterance.rate = (astrologer?.voiceSettings?.rate || 1.0) * speed;

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.onStateChangeCallback?.(true, false);
      };

      utterance.onboundary = (e) => {
        if (e.name === 'word' || !e.name) {
          const actualIndex = chunkOffset + (e.charIndex || 0);
          const spokenWord = chunkText.substring(e.charIndex, (e.charIndex || 0) + (e.charLength || 6));
          this.onBoundaryCallback?.(actualIndex, spokenWord);
        }
      };

      // When the final sentence chunk completes
      if (index === sentenceChunks.length - 1) {
        utterance.onend = () => {
          this.cleanup();
        };
      }

      utterance.onerror = (e) => {
        console.warn('Speech synthesis note:', e);
        if (index === sentenceChunks.length - 1) {
          this.cleanup();
        }
      };

      // Store in window array to prevent Chrome garbage collection
      window.__cosmicActiveUtterances?.push(utterance);

      try {
        this.synth?.speak(utterance);
      } catch (err) {
        console.warn('Speak error:', err);
      }
    });

    // Also run visual word-tracking fallback if synthesis is muted or delayed
    let wordIndex = 0;
    const words = text.split(' ');
    const intervalMs = Math.max(180, Math.floor(320 / speed));

    this.fallbackInterval = setInterval(() => {
      if (this.isSpeaking && wordIndex < words.length) {
        this.onBoundaryCallback?.(wordIndex * 5, words[wordIndex]);
        wordIndex++;
      }
    }, intervalMs);
  }

  private runVisualFallback(text: string) {
    this.isSpeaking = true;
    this.onStateChangeCallback?.(true, false);
    const words = text.split(' ');
    let wordIdx = 0;

    this.fallbackInterval = setInterval(() => {
      if (wordIdx < words.length) {
        this.onBoundaryCallback?.(wordIdx * 5, words[wordIdx]);
        wordIdx++;
      } else {
        this.cleanup();
      }
    }, 280);
  }

  private cleanup() {
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }
    if (this.resumeTimer) {
      clearInterval(this.resumeTimer);
      this.resumeTimer = null;
    }
    if (typeof window !== 'undefined' && window.__cosmicActiveUtterances) {
      window.__cosmicActiveUtterances = [];
    }
    this.isSpeaking = false;
    this.onStateChangeCallback?.(false, false);
    this.onEndCallback?.();
  }

  public pause() {
    if (this.synth && this.synth.speaking) {
      try {
        this.synth.pause();
      } catch (e) {}
    }
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }
    this.onStateChangeCallback?.(true, true);
  }

  public resume() {
    if (this.synth) {
      try {
        this.synth.resume();
      } catch (e) {}
    }
    this.onStateChangeCallback?.(true, false);
  }

  public stop() {
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }
    if (this.resumeTimer) {
      clearInterval(this.resumeTimer);
      this.resumeTimer = null;
    }
    if (typeof window !== 'undefined' && window.__cosmicActiveUtterances) {
      window.__cosmicActiveUtterances = [];
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    this.isSpeaking = false;
    this.onStateChangeCallback?.(false, false);
  }

  public isActive(): boolean {
    return Boolean(this.synth?.speaking || this.isSpeaking);
  }

  public isPaused(): boolean {
    return Boolean(this.synth?.paused);
  }
}

export const astrologerSpeaker = new AIAstrologerSpeaker();

