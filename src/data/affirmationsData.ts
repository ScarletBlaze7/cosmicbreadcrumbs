export interface CosmicAffirmation {
  id: string;
  text: string;
  theme: 'Manifestation' | 'Inner Peace' | 'Intuition' | 'Abundance' | 'Healing' | 'Courage' | 'Spiritual Growth' | 'Love';
  category: 'zodiac' | 'lifepath' | 'angel' | 'lunar' | 'universal';
  source: string;
  focusKeywords: string[];
}

export const DAILY_AFFIRMATIONS_BY_SIGN: Record<string, CosmicAffirmation[]> = {
  Aries: [
    {
      id: 'aff-ari-1',
      text: 'I ignite my day with sovereign courage, blazing new trails with clear purpose and unwavering conviction.',
      theme: 'Courage',
      category: 'zodiac',
      source: 'Aries Celestial Fire',
      focusKeywords: ['Courage', 'Initiative', 'Vitality']
    },
    {
      id: 'aff-ari-2',
      text: 'My inner fire burns with divine guidance. I lead my life boldly without fear of failure.',
      theme: 'Manifestation',
      category: 'zodiac',
      source: 'Aries Mars Vibration',
      focusKeywords: ['Leadership', 'Strength', 'Action']
    }
  ],
  Taurus: [
    {
      id: 'aff-tau-1',
      text: 'I am grounded in mother Earth’s sacred abundance. Everything I build with patience blossoms into lasting prosperity.',
      theme: 'Abundance',
      category: 'zodiac',
      source: 'Taurus Venus Resonance',
      focusKeywords: ['Stability', 'Abundance', 'Patience']
    },
    {
      id: 'aff-tau-2',
      text: 'I honor the sacred beauty in every simple moment, moving at the calm, perfect pace of nature.',
      theme: 'Inner Peace',
      category: 'zodiac',
      source: 'Taurus Earth Energy',
      focusKeywords: ['Harmony', 'Presence', 'Gratitude']
    }
  ],
  Gemini: [
    {
      id: 'aff-gem-1',
      text: 'My mind is a brilliant channel of cosmic light and inspiration. I speak truths that uplift and connect souls.',
      theme: 'Spiritual Growth',
      category: 'zodiac',
      source: 'Gemini Mercury Flow',
      focusKeywords: ['Wisdom', 'Connection', 'Expression']
    },
    {
      id: 'aff-gem-2',
      text: 'I welcome fresh perspectives with joyful curiosity, trusting the synchronicities that guide my thoughts.',
      theme: 'Intuition',
      category: 'zodiac',
      source: 'Gemini Air Frequency',
      focusKeywords: ['Curiosity', 'Clarity', 'Synchronicity']
    }
  ],
  Cancer: [
    {
      id: 'aff-can-1',
      text: 'My intuitive heart is a sanctuary of profound love, safety, and luminous emotional wisdom.',
      theme: 'Healing',
      category: 'zodiac',
      source: 'Cancer Lunar Current',
      focusKeywords: ['Intuition', 'Sanctuary', 'Love']
    },
    {
      id: 'aff-can-2',
      text: 'I trust the ebb and flow of life’s tides, knowing my inner home is forever protected and blessed.',
      theme: 'Inner Peace',
      category: 'zodiac',
      source: 'Cancer Water Essence',
      focusKeywords: ['Protection', 'Trust', 'Peace']
    }
  ],
  Leo: [
    {
      id: 'aff-leo-1',
      text: 'I radiate the warm, sovereign light of the Sun. My authentic presence naturally inspires and warms all around me.',
      theme: 'Manifestation',
      category: 'zodiac',
      source: 'Leo Solar Radiance',
      focusKeywords: ['Radiance', 'Generosity', 'Charisma']
    },
    {
      id: 'aff-leo-2',
      text: 'My heart beats with majestic creativity, joy, and boundless divine vitality.',
      theme: 'Courage',
      category: 'zodiac',
      source: 'Leo Fire Portal',
      focusKeywords: ['Heart Power', 'Joy', 'Creation']
    }
  ],
  Virgo: [
    {
      id: 'aff-vir-1',
      text: 'I craft my reality with sacred discernment, mindfulness, and devotion to pure healing excellence.',
      theme: 'Healing',
      category: 'zodiac',
      source: 'Virgo Mercury Aligned',
      focusKeywords: ['Discernment', 'Order', 'Devotion']
    },
    {
      id: 'aff-vir-2',
      text: 'I release perfectionism and celebrate my unfolding wholeness. My daily service is divinely blessed.',
      theme: 'Inner Peace',
      category: 'zodiac',
      source: 'Virgo Earth Temple',
      focusKeywords: ['Self-Compassion', 'Healing', 'Peace']
    }
  ],
  Libra: [
    {
      id: 'aff-lib-1',
      text: 'I am a serene mirror of divine beauty, harmony, and graceful balance in all my connections.',
      theme: 'Love',
      category: 'zodiac',
      source: 'Libra Venus Harmonic',
      focusKeywords: ['Harmony', 'Grace', 'Balance']
    },
    {
      id: 'aff-lib-2',
      text: 'I make sovereign choices with inner poise, trusting that peace begins in the stillness of my own center.',
      theme: 'Spiritual Growth',
      category: 'zodiac',
      source: 'Libra Air Flow',
      focusKeywords: ['Decisiveness', 'Equilibrium', 'Poise']
    }
  ],
  Scorpio: [
    {
      id: 'aff-sco-1',
      text: 'I fearlessly shed old layers like the phoenix, rising into profound spiritual power and emotional truth.',
      theme: 'Spiritual Growth',
      category: 'zodiac',
      source: 'Scorpio Pluto Transformation',
      focusKeywords: ['Rebirth', 'Alchemy', 'Truth']
    },
    {
      id: 'aff-sco-2',
      text: 'My psychic depth is pure and protected. I transmute all shadow into radiant spiritual gold.',
      theme: 'Intuition',
      category: 'zodiac',
      source: 'Scorpio Water Mystic',
      focusKeywords: ['Protection', 'Intuition', 'Transmutation']
    }
  ],
  Sagittarius: [
    {
      id: 'aff-sag-1',
      text: 'My consciousness expands across limitless horizons. The Universe fills my journey with joy, wisdom, and luck.',
      theme: 'Abundance',
      category: 'zodiac',
      source: 'Sagittarius Jupiter Portal',
      focusKeywords: ['Expansion', 'Optimism', 'Wisdom']
    },
    {
      id: 'aff-sag-2',
      text: 'I aim my arrow of intention toward high spiritual truth, rejoicing in every step of the adventure.',
      theme: 'Courage',
      category: 'zodiac',
      source: 'Sagittarius Fire Arrow',
      focusKeywords: ['Purpose', 'Adventure', 'Truth']
    }
  ],
  Capricorn: [
    {
      id: 'aff-cap-1',
      text: 'I stand on the summit of integrity and patient mastery. My work builds lasting legacy and generational abundance.',
      theme: 'Manifestation',
      category: 'zodiac',
      source: 'Capricorn Saturnian Stride',
      focusKeywords: ['Mastery', 'Endurance', 'Abundance']
    },
    {
      id: 'aff-cap-2',
      text: 'I honor my resilience and soften into sacred self-worth, allowing divine support to lift my burdens.',
      theme: 'Inner Peace',
      category: 'zodiac',
      source: 'Capricorn Earth Mountain',
      focusKeywords: ['Resilience', 'Grace', 'Worth']
    }
  ],
  Aquarius: [
    {
      id: 'aff-aqu-1',
      text: 'I channel the higher visionary frequencies of tomorrow, bringing innovative light and liberation to humanity.',
      theme: 'Manifestation',
      category: 'zodiac',
      source: 'Aquarius Uranian Spark',
      focusKeywords: ['Visionary', 'Freedom', 'Innovation']
    },
    {
      id: 'aff-aqu-2',
      text: 'I celebrate my unique celestial individuality, standing as an authentic beacon of cosmic truth.',
      theme: 'Spiritual Growth',
      category: 'zodiac',
      source: 'Aquarius Air Current',
      focusKeywords: ['Authenticity', 'Community', 'Elevation']
    }
  ],
  Pisces: [
    {
      id: 'aff-pis-1',
      text: 'I am intimately one with the infinite cosmic ocean. Divine love and psychic visions flow gently through my soul.',
      theme: 'Intuition',
      category: 'zodiac',
      source: 'Pisces Neptunian Deep',
      focusKeywords: ['Unity', 'Empathy', 'Visions']
    },
    {
      id: 'aff-pis-2',
      text: 'I anchor my dreams into waking reality with serene trust, protected by angelic love and grace.',
      theme: 'Healing',
      category: 'zodiac',
      source: 'Pisces Water Sanctuary',
      focusKeywords: ['Dreams', 'Trust', 'Serenity']
    }
  ]
};

export const UNIVERSAL_DAILY_AFFIRMATIONS: CosmicAffirmation[] = [
  {
    id: 'aff-uni-1',
    text: 'Every breath I take aligns me with universal abundance, radiant health, and unwavering spiritual peace.',
    theme: 'Abundance',
    category: 'universal',
    source: 'Universal Cosmic Matrix',
    focusKeywords: ['Abundance', 'Health', 'Peace']
  },
  {
    id: 'aff-uni-2',
    text: 'I trust the timing of my life. The Universe is orchestrating synchronicities in my highest favor right now.',
    theme: 'Inner Peace',
    category: 'universal',
    source: 'Divine Timing Frequency',
    focusKeywords: ['Trust', 'Synchronicity', 'Alignment']
  },
  {
    id: 'aff-uni-3',
    text: 'My intuition is clear, accurate, and divinely protected. I walk forward with quiet certainty and joy.',
    theme: 'Intuition',
    category: 'universal',
    source: 'Third Eye Awakening',
    focusKeywords: ['Intuition', 'Clarity', 'Protection']
  },
  {
    id: 'aff-uni-4',
    text: 'I release all that no longer serves my highest good, creating sacred space for miracles, love, and light.',
    theme: 'Healing',
    category: 'universal',
    source: 'Lunar Release Portal',
    focusKeywords: ['Release', 'Miracles', 'Renewal']
  }
];

export function getDailyCosmicAffirmation(
  sunSignName: string,
  lifePathNumber: number,
  dateStr?: string
): CosmicAffirmation {
  const date = dateStr ? new Date(dateStr) : new Date();
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  );

  const signAffirmations = DAILY_AFFIRMATIONS_BY_SIGN[sunSignName] || DAILY_AFFIRMATIONS_BY_SIGN['Aries'];
  const pool = [...signAffirmations, ...UNIVERSAL_DAILY_AFFIRMATIONS];
  
  const index = (dayOfYear + lifePathNumber) % pool.length;
  return pool[index];
}
