import { DreamEntry, DreamType, DreamInterpretationResult, KeywordInterpretation, UserProfile } from '../types';
import { DREAM_SYMBOLS_DICTIONARY, DreamSymbolDefinition } from '../data/dreamDictionary';

/**
 * Calculates a numerological resonance number from dream keywords and text
 */
export function calculateDreamVibration(keywords: string[], narrative: string): number {
  const combined = (keywords.join('') + narrative).toLowerCase().replace(/[^a-z]/g, '');
  if (!combined) return 7;

  let sum = 0;
  for (let i = 0; i < combined.length; i++) {
    sum += (combined.charCodeAt(i) - 96) % 9 || 9;
  }

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum
      .toString()
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }

  return sum || 7;
}

/**
 * Finds archetypal symbol matches for standout keywords
 */
export function matchDreamSymbols(standoutKeywords: string[]): KeywordInterpretation[] {
  const results: KeywordInterpretation[] = [];

  for (const rawKw of standoutKeywords) {
    const kw = rawKw.trim().toLowerCase();
    if (!kw) continue;

    // Direct search or synonym search
    const found = DREAM_SYMBOLS_DICTIONARY.find(
      (entry) =>
        entry.symbol.toLowerCase() === kw ||
        entry.synonyms.some((syn) => syn.toLowerCase().includes(kw) || kw.includes(syn.toLowerCase()))
    );

    if (found) {
      results.push({
        symbol: rawKw,
        meaning: found.meaning,
        archetype: found.archetype,
        element: found.element,
        numerologyVibe: found.vibrationNumber,
      });
    } else {
      // Dynamic archetypal interpretation for unindexed keywords
      results.push({
        symbol: rawKw,
        meaning: `A potent personal symbol representing an energetic focal point in your unconscious mind, pointing to unintegrated desires, memories, or creative potential.`,
        archetype: `The Personal Catalyst / Archetypal Anchor`,
        element: 'Aether',
        numerologyVibe: (rawKw.length % 9) + 1,
      });
    }
  }

  return results;
}

/**
 * Generates local algorithmic dream interpretation
 */
export function interpretDreamLocal(
  narrative: string,
  standoutKeywords: string[],
  dreamType: DreamType,
  emotionalTone: string,
  isPastDream: boolean,
  approximateDate?: string
): DreamInterpretationResult {
  const matchedKeywords = matchDreamSymbols(standoutKeywords);
  const dreamVibe = calculateDreamVibration(standoutKeywords, narrative);

  const keywordsList = standoutKeywords.join(', ');
  const dateContext = isPastDream
    ? `Regarding this past dream${approximateDate ? ` from ${approximateDate}` : ''}: its lingering presence in your memory indicates that its spiritual lesson remains an active karmic anchor.`
    : `In this fresh morning imprint: your dream serves as an immediate navigational transmission for your current life chapter.`;

  const typeDesc: Record<DreamType, string> = {
    lucid: 'You achieved conscious awareness within the dream space, indicating high vibrational sovereignty and an ability to reshape waking circumstances with conscious will.',
    prophetic: 'This dream bears the hallmarks of a precognitive transmission, registering subtle astral currents and events gathering form on the threshold of reality.',
    symbolic: 'Your subconscious has woven high archetypal allegory to translate complex emotional equations into vivid metaphorical scenery.',
    recurring: 'A recurring dream represents an urgent knock on the psyche’s door—a persistent soul theme demanding conscious resolution.',
    nightmare: 'This shadow dream functions as a psychological pressure-valve, surfacing unprocessed fear or stagnant energy for immediate transmutation.',
    astral: 'An experience of astral travel or multidimensional exploration where your consciousness transcended the physical density.',
    healing: 'A restorative dream bath clearing subtle etheric exhaustion and infusing your aura with renewed spiritual stamina.',
  };

  const primaryElement = matchedKeywords[0]?.element || 'Aether';

  return {
    summary: `${dateContext} With ${emotionalTone ? `an emotional frequency of "${emotionalTone}"` : 'rich emotional resonance'}, this ${dreamType} journey pivots upon the key symbols of ${keywordsList}. ${typeDesc[dreamType]} The prevailing energetic element is ${primaryElement}, urging you to harmonize your internal landscape with external action.`,
    keywordMeanings: matchedKeywords,
    subconsciousMessage: `Your subconscious is spotlighting "${standoutKeywords[0] || 'the dream core'}": it reflects a readiness to dissolve outdated assumptions and welcome higher clarity. Pay attention to how the feelings you experienced in the dream mirror decisions you are currently weighing.`,
    spiritualSignificance: `This dream acts as an etheric realignment. The vibration of number ${dreamVibe} resonates with soul alchemy. You are being encouraged to release overthinking and allow your natural intuitive radar to guide your next phase.`,
    shadowWorkAspect: `Reflect on what you may have resisted, avoided, or felt uncertain about in the dream. The shadow is not an enemy, but unexpressed gold waiting for compassion.`,
    guidanceAction: `Take 3 mindful minutes today to hold the essence of ${keywordsList} in your mind. Write down one practical truth that this dream made you realize about your waking life.`,
    lucidRitual: `Tonight before sleep, place a glass of water on your nightstand, gaze at your hands, and state: "I remember my dreams with crystal clarity, and I am the conscious master of my inner universe."`,
    dreamNumberVibration: dreamVibe,
  };
}

/**
 * Interprets dream using Gemini API with seamless local fallback
 */
export async function interpretDreamWithAI(
  narrative: string,
  standoutKeywords: string[],
  dreamType: DreamType,
  emotionalTone: string,
  isPastDream: boolean,
  approximateDate?: string,
  userProfile?: UserProfile
): Promise<DreamInterpretationResult> {
  try {
    const response = await fetch('/api/gemini/dream-interpretation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        narrative,
        standoutKeywords,
        dreamType,
        emotionalTone,
        isPastDream,
        approximateDate,
        userProfile,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result && result.data && result.data.summary) {
        return result.data;
      }
    }
  } catch (err) {
    console.warn('Dream AI API unavailable, using high-precision cosmic calculator:', err);
  }

  // Robust fallback
  return interpretDreamLocal(
    narrative,
    standoutKeywords,
    dreamType,
    emotionalTone,
    isPastDream,
    approximateDate
  );
}
