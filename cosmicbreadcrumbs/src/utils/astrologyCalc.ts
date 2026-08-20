import { MoonPhaseInfo, ZodiacSignInfo } from '../types';
import { getZodiacByDate, ZODIAC_SIGNS } from '../data/zodiacData';

// Calculate exact Sun sign from birthDate string (YYYY-MM-DD)
export function getSunSignFromDate(birthDateStr: string): ZodiacSignInfo {
  if (!birthDateStr) return ZODIAC_SIGNS[0];
  const parts = birthDateStr.split('-');
  const month = parseInt(parts[1], 10) || 3;
  const day = parseInt(parts[2], 10) || 21;
  return getZodiacByDate(month, day);
}

// Moon phase calculation using astronomical algorithm
export function getMoonPhaseInfo(date = new Date()): MoonPhaseInfo {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Known new moon reference: Jan 6, 2000 18:14 UTC
  const lp = 2551443; // synodic month in seconds
  const now = date.getTime();
  const newMoonRef = new Date(Date.UTC(2000, 0, 6, 18, 14, 0)).getTime();
  const phaseSeconds = ((now - newMoonRef) / 1000) % lp;
  const fraction = phaseSeconds / lp;
  const age = fraction * 29.53058867; // in days

  let phaseName = 'New Moon';
  let isWaxing = true;
  let ritualAdvice = 'Plant new intentions and begin sacred journeys.';
  let intention = 'New Beginnings & Sowing Seeds';

  if (age < 1.84566) {
    phaseName = 'New Moon';
    isWaxing = true;
    ritualAdvice = 'Light a white candle, write intentions in your journal, and meditate on pure potential.';
    intention = 'Manifestation Seed';
  } else if (age < 5.53699) {
    phaseName = 'Waxing Crescent';
    isWaxing = true;
    ritualAdvice = 'Take proactive physical steps to support the intentions you set on the New Moon.';
    intention = 'Momentum & Action';
  } else if (age < 9.22831) {
    phaseName = 'First Quarter';
    isWaxing = true;
    ritualAdvice = 'Overcome roadblocks with courage. Balance reflection with decisive action.';
    intention = 'Overcoming Challenges';
  } else if (age < 12.91963) {
    phaseName = 'Waxing Gibbous';
    isWaxing = true;
    ritualAdvice = 'Fine-tune your craft and stay patient as your desires reach full illumination.';
    intention = 'Refinement & Growth';
  } else if (age < 16.61096) {
    phaseName = 'Full Moon';
    isWaxing = false;
    ritualAdvice = 'Charge your crystals under lunar light, express gratitude, and celebrate peak manifestations.';
    intention = 'Illumination & Gratitude';
  } else if (age < 20.30228) {
    phaseName = 'Waning Gibbous (Disseminating)';
    isWaxing = false;
    ritualAdvice = 'Share wisdom with others and practice deep forgiveness.';
    intention = 'Sharing & Release';
  } else if (age < 23.99361) {
    phaseName = 'Last Quarter';
    isWaxing = false;
    ritualAdvice = 'Release limiting beliefs, cleanse your living space with sage or sound, and surrender burdens.';
    intention = 'Purification & Cleansing';
  } else {
    phaseName = 'Waning Crescent (Balsamic)';
    isWaxing = false;
    ritualAdvice = 'Rest, take soothing salt baths, and recharge your psychic batteries in quiet solitude.';
    intention = 'Restoration & Surrender';
  }

  // Calculate approximate moon sign (Moon spends ~2.5 days per sign)
  const moonSignIndex = Math.floor((age * 12) / 29.53) % 12;
  const moonSign = ZODIAC_SIGNS[moonSignIndex]?.name || 'Cancer';

  // Illumination calculation (0 to 100%)
  const illumination = Math.round((1 - Math.cos(fraction * 2 * Math.PI)) * 50);

  return {
    phaseName,
    fraction,
    illumination,
    age: Math.round(age * 10) / 10,
    moonSign,
    ritualAdvice,
    intention,
    isWaxing,
  };
}

// Generate realistic daily planetary transits
export function getDailyPlanetaryTransits(date = new Date()) {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  );

  const transits = [
    {
      aspect: 'Sun sextile Jupiter',
      energy: 'Expansion & Good Fortune',
      description: 'Generous cosmic currents support career advancements, spiritual breakthroughs, and financial optimism.',
      favorableFor: 'Launching ventures, creative proposals, gratitude rituals',
      intensity: 88,
    },
    {
      aspect: 'Moon in harmony with Neptune',
      energy: 'Heightened Intuition & Dream Telepathy',
      description: 'The veil is thin. Dreams carry prophetic insights and synchronicities appear effortlessly.',
      favorableFor: 'Tarot readings, meditation, sound healing, art',
      intensity: 94,
    },
    {
      aspect: 'Venus trine Mars',
      energy: 'Passionate Synergy & Magnetic Charm',
      description: 'Divine masculine and feminine energies harmonize in balanced attraction, creative spark, and affection.',
      favorableFor: 'Romantic dates, collaborations, artistic expression',
      intensity: 85,
    },
    {
      aspect: 'Mercury conjunct Uranus',
      energy: 'Electrifying Breakthroughs & Epiphanies',
      description: 'Sudden flashes of innovative genius and outside-the-box solutions arrive spontaneously.',
      favorableFor: 'Writing, technological inventions, speaking truth',
      intensity: 90,
    },
  ];

  // Rotate based on day of year for dynamic daily variety
  const index1 = dayOfYear % transits.length;
  const index2 = (dayOfYear + 1) % transits.length;
  return [transits[index1], transits[index2]];
}
