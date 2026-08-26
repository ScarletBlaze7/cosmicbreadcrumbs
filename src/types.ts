export type CosmicView = 
  | 'dashboard' 
  | 'horoscope' 
  | 'numerology' 
  | 'angel-oracle' 
  | 'tarot' 
  | 'dreams'
  | 'diary'
  | 'journal' 
  | 'oracle-chat';

export type MembershipTier = 'free' | 'trial' | 'weekly' | 'monthly' | 'lifetime';

export interface MembershipStatus {
  tier: MembershipTier;
  isActive: boolean; // true if active trial or paid membership
  trialStartDate?: string;
  trialExpiryDate?: string;
  activatedAt?: string;
  planName?: string;
  price?: string;
  hasSeenWelcomeLetter: boolean;
}

export interface UserProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:MM
  birthPlace?: string;
  sunSign?: string;
  risingSign?: string;
  lifePathNumber?: number;
  destinyNumber?: number;
  soulUrgeNumber?: number;
  personalYear?: number;
  numerologySystem: 'pythagorean' | 'chaldean';
  ambientSoundEnabled?: boolean;
  avatarUrl?: string; // Custom user photo or data URL
  birthDateChangeCount?: number; // Number of times birthdate was modified (allowed up to 2 times)
  hasCompletedOnboarding?: boolean;
}

export type ZodiacElement = 'Fire' | 'Earth' | 'Air' | 'Water';
export type ZodiacModality = 'Cardinal' | 'Fixed' | 'Mutable';

export interface ZodiacSignInfo {
  name: string;
  symbol: string;
  glyph: string;
  dateRange: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  element: ZodiacElement;
  modality: ZodiacModality;
  rulingPlanet: string;
  tarotCard: string;
  color: string;
  gemstone: string;
  chakra: string;
  traits: {
    strengths: string[];
    weaknesses: string[];
    motto: string;
    description: string;
  };
  dailyTraits: {
    luckyNumbers: number[];
    luckyColor: string;
    luckyTime: string;
    compatibility: string[];
  };
}

export type TarotSuit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

export interface TarotCard {
  id: string;
  name: string;
  suit: TarotSuit;
  number: number;
  arcana: 'Major' | 'Minor';
  element?: string;
  astrology?: string;
  keywords: string[];
  reversedKeywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  advice: string;
  affirmation: string;
  visualDescription: string;
  imageUrl?: string;
  pictorialKeyDescription?: string; // Authentic Rider-Waite-Smith description from The Pictorial Key to the Tarot (A.E. Waite, 1911)
  pictorialKeyUpright?: string;     // Authentic Divinatory Meanings from The Pictorial Key to the Tarot
  pictorialKeyReversed?: string;    // Authentic Reversed Meanings from The Pictorial Key to the Tarot
  iconName: string;
  colorGradient: string;
  numerology?: number;
  loveGuidance?: {
    upright: string;
    reversed: string;
  };
  financeGuidance?: {
    upright: string;
    reversed: string;
  };
  healthGuidance?: {
    upright: string;
    reversed: string;
  };
}

export interface DrawnCard extends TarotCard {
  isReversed: boolean;
  positionName?: string;
  positionDescription?: string;
  recipientName?: string;
  domain?: 'general' | 'love' | 'finance' | 'health';
  isClarification?: boolean;
}

export interface TarotSpread {
  id: string;
  name: string;
  cardCount: number;
  description: string;
  category: string;
  positions: { name: string; description: string }[];
}

export interface NumerologyAnalysis {
  lifePath: {
    number: number;
    title: string;
    archetype: string;
    traits: string[];
    description: string;
    challenges: string[];
    masterNumber?: boolean;
  };
  destiny: {
    number: number;
    title: string;
    description: string;
  };
  soulUrge: {
    number: number;
    title: string;
    description: string;
  };
  personality: {
    number: number;
    title: string;
    description: string;
  };
  birthdayNumber: {
    number: number;
    description: string;
  };
  personalYear: {
    yearNumber: number;
    theme: string;
    description: string;
    monthlyGuidance: string;
  };
}

export interface ArchangelCard {
  id: string;
  archangel: string;
  title: string;
  theme: string;
  colorRay: string;
  crystalResonance: string;
  divineMessage: string;
  guidanceAction: string;
  sacredPrayer: string;
  affirmation: string;
  clarificationMeaning: string;
  wingsOfLight: string;
  iconType?: string;
}

export interface DrawnArchangelCard extends ArchangelCard {
  isClarification?: boolean;
  drawnAt?: string;
}

export interface ArchangelInfo {
  name: string;
  domain: string;
  colorRay: string;
  howToInvoke: string;
  prayer: string;
}

export interface MoonPhaseInfo {
  phaseName: string;
  fraction: number; // 0 to 1
  illumination: number; // 0 to 100%
  age: number; // days into cycle
  moonSign: string;
  ritualAdvice: string;
  intention: string;
  isWaxing: boolean;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  type: 'tarot' | 'horoscope' | 'angel' | 'numerology' | 'affirmation';
  content: string;
  isFavorite?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

// ----------------------------------------------------
// PRIVATE DIARY & INTUITION LOG TYPES
// ----------------------------------------------------

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO
  morningIntuition: string; // Predictions / vibes on how the day will go
  eveningReflection: string; // Evening reflection on actual events
  readingAccuracyRating: number; // 1 to 5 stars on how accurate the reading felt
  accuracyNotes: string; // Specific synchronicities or why reading aligned
  dailyThoughts: string; // Unlimited character private diary entry
  mood: 'radiant' | 'peaceful' | 'seeking' | 'turbulent' | 'empowered' | 'reflective';
  tags: string[];
  isFavorite?: boolean;
}

export interface DiaryLockState {
  isLocked: boolean;
  hasPin: boolean;
}

// ----------------------------------------------------
// DREAM SANCTUARY & INTERPRETER (CALCULATOR) TYPES
// ----------------------------------------------------

export type DreamType = 'lucid' | 'prophetic' | 'symbolic' | 'recurring' | 'nightmare' | 'astral' | 'healing';

export interface KeywordInterpretation {
  symbol: string;
  meaning: string;
  archetype: string;
  element?: string;
  numerologyVibe?: number;
}

export interface DreamInterpretationResult {
  summary: string;
  keywordMeanings: KeywordInterpretation[];
  subconsciousMessage: string;
  spiritualSignificance: string;
  shadowWorkAspect: string;
  guidanceAction: string;
  lucidRitual: string;
  dreamNumberVibration: number;
}

export interface DreamEntry {
  id: string;
  date: string; // YYYY-MM-DD
  isPastDream: boolean;
  approximateDate?: string; // e.g. "Autumn 2021" or "Approx. March 2023"
  title: string;
  dreamNarrative: string;
  standoutKeywords: string[]; // Required words that stood out in the dream
  emotionalTone: string;
  dreamType: DreamType;
  interpretation: DreamInterpretationResult;
  isFavorite?: boolean;
  createdAt: string;
}
