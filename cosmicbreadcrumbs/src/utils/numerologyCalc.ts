import { NumerologyAnalysis } from '../types';
import { NUMEROLOGY_PROFILES } from '../data/numerologyData';

// Sacred Chaldean letter values (1-8, no 9 as 9 was sacred in Chaldean)
export const CHALDEAN_MAP: Record<string, number> = {
  a: 1, i: 1, j: 1, q: 1, y: 1,
  b: 2, k: 2, r: 2,
  c: 3, g: 3, l: 3, s: 3,
  d: 4, m: 4, t: 4,
  e: 5, h: 5, n: 5, x: 5,
  u: 6, v: 6, w: 6,
  o: 7, z: 7,
  f: 8, p: 8,
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

export function isMasterNumber(num: number): boolean {
  return num === 11 || num === 22 || num === 33;
}

export function reduceToDigit(num: number, preserveMaster = true): number {
  if (preserveMaster && isMasterNumber(num)) {
    return num;
  }
  while (num > 9) {
    if (preserveMaster && isMasterNumber(num)) {
      return num;
    }
    num = String(num)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  if (preserveMaster && isMasterNumber(num)) {
    return num;
  }
  return num;
}

// Calculate Life Path Number from YYYY-MM-DD honoring Master Numbers 11, 22, 33
export function calculateLifePath(birthDateStr: string): number {
  if (!birthDateStr) return 1;
  const parts = birthDateStr.split('-');
  if (parts.length < 3) return 1;

  const year = parseInt(parts[0], 10) || 1990;
  const month = parseInt(parts[1], 10) || 1;
  const day = parseInt(parts[2], 10) || 1;

  // Traditional Method 1: Period reduction (Month, Day, Year reduced with master numbers preserved)
  const rYear = reduceToDigit(year, true);
  const rMonth = reduceToDigit(month, true);
  const rDay = reduceToDigit(day, true);
  const periodSum = rYear + rMonth + rDay;
  const periodResult = reduceToDigit(periodSum, true);

  // Method 2: Full date digit sum (often detects 11, 22, 33 sum)
  const allDigitsSum = birthDateStr
    .replace(/[^0-9]/g, '')
    .split('')
    .reduce((acc, d) => acc + parseInt(d, 10), 0);
  const aggregateResult = reduceToDigit(allDigitsSum, true);

  // If either traditional method yields Master Number 11, 22, or 33, honor the master vibration
  if (isMasterNumber(periodResult)) return periodResult;
  if (isMasterNumber(aggregateResult)) return aggregateResult;

  return periodResult;
}

// Calculate Destiny / Expression Number using Chaldean Sacred Sound Vibration
export function calculateDestinyNumber(name: string): number {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  if (!cleanName) return 1;

  let total = 0;
  for (const char of cleanName) {
    total += CHALDEAN_MAP[char] || 0;
  }
  return reduceToDigit(total, true);
}

// Calculate Soul Urge / Heart's Desire (Vowels only via Chaldean Vibration)
export function calculateSoulUrgeNumber(name: string): number {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  if (!cleanName) return 1;

  let total = 0;
  for (const char of cleanName) {
    if (VOWELS.has(char)) {
      total += CHALDEAN_MAP[char] || 0;
    }
  }
  return reduceToDigit(total || 1, true);
}

// Calculate Personality Number (Consonants only via Chaldean Vibration)
export function calculatePersonalityNumber(name: string): number {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  if (!cleanName) return 1;

  let total = 0;
  for (const char of cleanName) {
    if (!VOWELS.has(char)) {
      total += CHALDEAN_MAP[char] || 0;
    }
  }
  return reduceToDigit(total || 1, true);
}

// Calculate Birthday Number (Day of birth reduced, keeping 11 and 22 master birth days)
export function calculateBirthdayNumber(birthDateStr: string): number {
  if (!birthDateStr) return 1;
  const parts = birthDateStr.split('-');
  const day = parseInt(parts[2], 10) || 1;
  if (day === 11 || day === 22) return day;
  return reduceToDigit(day, true);
}

// Calculate Personal Year Number for current calendar year
export function calculatePersonalYear(birthDateStr: string, currentYear = new Date().getFullYear()): number {
  if (!birthDateStr) return 1;
  const parts = birthDateStr.split('-');
  const month = parseInt(parts[1], 10) || 1;
  const day = parseInt(parts[2], 10) || 1;

  const rMonth = reduceToDigit(month, false);
  const rDay = reduceToDigit(day, false);
  const rCurrentYear = reduceToDigit(currentYear, false);

  const rawSum = rMonth + rDay + rCurrentYear;
  // Personal years can also be master vibrations 11 or 22
  return reduceToDigit(rawSum, true);
}

// Calculate Personal Month Number
export function calculatePersonalMonth(personalYear: number, month = new Date().getMonth() + 1): number {
  return reduceToDigit(personalYear + month, false);
}

// Calculate Synastry & Compatibility between two seekers
export interface NumerologySynastry {
  person1: { name: string; lifePath: number; destiny: number; soulUrge: number };
  person2: { name: string; lifePath: number; destiny: number; soulUrge: number };
  harmonyScore: number;
  bridgeNumber: number;
  lifePathResonance: string;
  soulUrgeResonance: string;
  destinySynergy: string;
  relationshipAdvice: string;
}

export function calculateNumerologySynastry(
  name1: string,
  dob1: string,
  name2: string,
  dob2: string
): NumerologySynastry {
  const lp1 = calculateLifePath(dob1);
  const dest1 = calculateDestinyNumber(name1);
  const su1 = calculateSoulUrgeNumber(name1);

  const lp2 = calculateLifePath(dob2);
  const dest2 = calculateDestinyNumber(name2);
  const su2 = calculateSoulUrgeNumber(name2);

  const p1Profile = NUMEROLOGY_PROFILES[lp1] || NUMEROLOGY_PROFILES[1];
  const p2Profile = NUMEROLOGY_PROFILES[lp2] || NUMEROLOGY_PROFILES[1];

  const isLpHarmonic = p1Profile.compatibleNumbers.includes(lp2) || p2Profile.compatibleNumbers.includes(lp1) || lp1 === lp2;
  const isSuHarmonic = su1 === su2 || (su1 + su2) % 3 === 0;
  
  // Bridge number is the positive difference between the two Life Paths
  const bridgeNumber = Math.abs(lp1 - lp2) || reduceToDigit(lp1 + lp2, false);

  let harmonyScore = 75;
  if (isLpHarmonic) harmonyScore += 15;
  if (isSuHarmonic) harmonyScore += 8;
  if (isMasterNumber(lp1) || isMasterNumber(lp2)) harmonyScore += 2;
  harmonyScore = Math.min(harmonyScore, 98);

  const lifePathResonance = isLpHarmonic
    ? `Life Path ${lp1} (${p1Profile.archetype}) and Life Path ${lp2} (${p2Profile.archetype}) share an innate harmonic resonance. Your worldviews and spiritual tempos support each other with deep intuitive trust.`
    : `Life Path ${lp1} (${p1Profile.archetype}) and Life Path ${lp2} (${p2Profile.archetype}) create an evolutionary polarity. While your natural approaches differ, this polarity generates profound character refinement and mutual learning.`;

  const soulUrgeResonance = isSuHarmonic
    ? `Soul Urge ${su1} & ${su2} resonate on a heart level. You both seek emotional authenticity and easily empathize with each other's core motivations.`
    : `Soul Urge ${su1} & ${su2} bring distinct emotional needs to the table. Active listening and honoring each other's vulnerability creates a safe emotional container.`;

  const destinySynergy = `Destiny ${dest1} combined with Destiny ${dest2} channels a combined outer expression of ${reduceToDigit(dest1 + dest2, true)}, inviting shared creative undertakings and purposeful collaboration.`;

  const relationshipAdvice = `Work with Bridge Number ${bridgeNumber}: focus on conscious communication, celebrate your mutual gifts, and give each other space to evolve in your individual sacred timing.`;

  return {
    person1: { name: name1 || 'You', lifePath: lp1, destiny: dest1, soulUrge: su1 },
    person2: { name: name2 || 'The Seeker', lifePath: lp2, destiny: dest2, soulUrge: su2 },
    harmonyScore,
    bridgeNumber,
    lifePathResonance,
    soulUrgeResonance,
    destinySynergy,
    relationshipAdvice,
  };
}

// Full Numerology Analysis generator using Sacred Chaldean Vibrations
export function getFullNumerologyAnalysis(
  name: string,
  birthDateStr: string
): NumerologyAnalysis {
  const lifePathNum = calculateLifePath(birthDateStr);
  const destinyNum = calculateDestinyNumber(name);
  const soulUrgeNum = calculateSoulUrgeNumber(name);
  const personalityNum = calculatePersonalityNumber(name);
  const birthdayNum = calculateBirthdayNumber(birthDateStr);
  const personalYearNum = calculatePersonalYear(birthDateStr);

  const lpProfile = NUMEROLOGY_PROFILES[lifePathNum] || NUMEROLOGY_PROFILES[1];
  const destProfile = NUMEROLOGY_PROFILES[destinyNum] || NUMEROLOGY_PROFILES[1];
  const suProfile = NUMEROLOGY_PROFILES[soulUrgeNum] || NUMEROLOGY_PROFILES[1];
  const persProfile = NUMEROLOGY_PROFILES[personalityNum] || NUMEROLOGY_PROFILES[1];
  const pyProfile = NUMEROLOGY_PROFILES[personalYearNum] || NUMEROLOGY_PROFILES[1];

  return {
    lifePath: {
      number: lifePathNum,
      title: lpProfile.title,
      archetype: lpProfile.archetype,
      traits: lpProfile.strengths,
      description: lpProfile.lifePathSummary,
      challenges: lpProfile.challenges,
      masterNumber: lifePathNum === 11 || lifePathNum === 22 || lifePathNum === 33,
    },
    destiny: {
      number: destinyNum,
      title: destProfile.title,
      description: destProfile.destinySummary,
    },
    soulUrge: {
      number: soulUrgeNum,
      title: suProfile.title,
      description: suProfile.soulUrgeSummary,
    },
    personality: {
      number: personalityNum,
      title: persProfile.title,
      description: persProfile.personalitySummary,
    },
    birthdayNumber: {
      number: birthdayNum,
      description: `Born on day ${birthdayNum}, you possess natural ${lpProfile.strengths.slice(0, 2).join(' and ')} to help manifest your divine mission.`,
    },
    personalYear: {
      yearNumber: personalYearNum,
      theme: pyProfile.personalYearTheme,
      description: pyProfile.personalYearDetails,
      monthlyGuidance: `In this Personal Year ${personalYearNum}, focus on aligning your intentions with ${pyProfile.keywords.join(', ')}.`,
    },
  };
}
