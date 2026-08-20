import { TarotCard } from '../types';
import { MAJOR_ARCANA as RAW_MAJOR } from './tarot/majorArcana';
import { WANDS_CARDS as RAW_WANDS } from './tarot/wands';
import { CUPS_CARDS as RAW_CUPS } from './tarot/cups';
import { SWORDS_CARDS as RAW_SWORDS } from './tarot/swords';
import { PENTACLES_CARDS as RAW_PENTACLES } from './tarot/pentacles';
import { enrichCardWithImage } from '../utils/tarotImageHelper';

export const MAJOR_ARCANA: TarotCard[] = RAW_MAJOR.map(enrichCardWithImage);
export const WANDS_CARDS: TarotCard[] = RAW_WANDS.map(enrichCardWithImage);
export const CUPS_CARDS: TarotCard[] = RAW_CUPS.map(enrichCardWithImage);
export const SWORDS_CARDS: TarotCard[] = RAW_SWORDS.map(enrichCardWithImage);
export const PENTACLES_CARDS: TarotCard[] = RAW_PENTACLES.map(enrichCardWithImage);

export const MINOR_ARCANA: TarotCard[] = [
  ...WANDS_CARDS,
  ...CUPS_CARDS,
  ...SWORDS_CARDS,
  ...PENTACLES_CARDS,
];

export const ALL_TAROT_CARDS: TarotCard[] = [
  ...MAJOR_ARCANA,
  ...MINOR_ARCANA,
];

export const TAROT_SPREADS = [
  {
    id: 'three-time',
    name: 'Past • Present • Future',
    cardCount: 3,
    category: 'General',
    description: 'Classic 3-card temporal layout tracing how past foundations shape current reality and future outcomes.',
    positions: [
      { name: 'The Past', description: 'Underlying foundation and root influences.' },
      { name: 'The Present', description: 'Current energy, mindset, and immediate atmosphere.' },
      { name: 'The Future', description: 'Likely trajectory if current course continues.' },
    ],
  },
  {
    id: 'love-connection',
    name: 'Heart & Harmony Spread',
    cardCount: 3,
    category: 'Love',
    description: 'Designed for romantic insight, partnership dynamics, and healing emotional blockages.',
    positions: [
      { name: 'Your Heart’s State', description: 'Your true emotional needs and inner vibration.' },
      { name: 'The Connection / Dynamic', description: 'The bridge between energies and mutual lessons.' },
      { name: 'Highest Potential Advice', description: 'Sacred counsel to elevate love, trust, and intimacy.' },
    ],
  },
  {
    id: 'celtic-cross',
    name: 'The Sacred Celtic Cross',
    cardCount: 5,
    category: 'Spiritual',
    description: 'An illuminating 5-card condensed Celtic reading revealing heart of the matter, obstacles, unconscious roots, conscious hopes, and outcome.',
    positions: [
      { name: 'The Heart of the Situation', description: 'The primary central energy at play.' },
      { name: 'The Challenge / Crossing', description: 'Obstacles or unexpected catalytic forces.' },
      { name: 'The Root Foundation', description: 'Subconscious or past causes anchoring the situation.' },
      { name: 'Higher Consciousness', description: 'Your best ideals and highest spiritual path.' },
      { name: 'The Divine Outcome', description: 'The synthesized resolution and guidance.' },
    ],
  },
  // Specialized Spreads for Other People (Member Exclusive)
  {
    id: 'other-three-time',
    name: 'Timeline Reading for Someone Else',
    cardCount: 3,
    category: 'OtherPeople',
    description: 'A multi-card temporal spread exploring their past foundations, current state, and emerging future trajectory.',
    positions: [
      { name: 'Their Root Foundation (Past)', description: 'The past events and conditioning shaping their current mindset.' },
      { name: 'Their Present Energy', description: 'What they are navigating in their thoughts and heart right now.' },
      { name: 'Their Emerging Horizon (Future)', description: 'Where their current choices and lessons are leading them.' },
    ],
  },
  {
    id: 'other-soul-mirror',
    name: 'Soul Needs & Connection Mirror',
    cardCount: 3,
    category: 'OtherPeople',
    description: 'Examines their emotional needs, what they may be holding back, and how you can best support or understand them.',
    positions: [
      { name: 'Their Unspoken Need', description: 'What their soul requires most right now (validation, space, guidance).' },
      { name: 'Their Hidden Blockage', description: 'The fear, doubt, or barrier they are working through.' },
      { name: 'How to Best Support Them', description: 'Your highest action or energetic stance toward them.' },
    ],
  },
  {
    id: 'other-five-horizon',
    name: 'Sacred Horizon 5-Card Reading for Someone Else',
    cardCount: 5,
    category: 'OtherPeople',
    description: 'Deep 5-card diagnostic of their emotional core, mental mindset, spiritual lessons, relationship dynamic, and blessing.',
    positions: [
      { name: 'Their Core Vibration', description: 'The primary aura and emotional state surrounding them today.' },
      { name: 'Their Greatest Challenge', description: 'The pressure or confusion testing their resolve.' },
      { name: 'Their Hidden Strength', description: 'The dormant gift or courage within them waiting to emerge.' },
      { name: 'Their Relationship with You', description: 'The karmic or emotional bridge between your spirits.' },
      { name: 'Divine Blessing & Counsel for Them', description: 'The overarching cosmic blessing guiding their path.' },
    ],
  },
];

export const OTHER_PEOPLE_SPREADS = TAROT_SPREADS.filter((s) => s.category === 'OtherPeople');
