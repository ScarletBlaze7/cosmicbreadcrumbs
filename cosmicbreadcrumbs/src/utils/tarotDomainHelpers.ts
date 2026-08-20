import { TarotCard, DrawnCard } from '../types';

export interface DomainCardGuidance {
  theme: string;
  focusTitle: string;
  message: string;
  action: string;
  affirmation: string;
  reflectionQuestion: string;
}

/**
 * Returns specific domain-focused interpretation (Love, Finance, or Health)
 * for any Rider-Waite tarot card (upright or reversed).
 */
export function getCardDomainGuidance(
  card: TarotCard,
  isReversed: boolean,
  domain: 'love' | 'finance' | 'health'
): DomainCardGuidance {
  const cardName = card.name;
  const isMajor = card.arcana === 'Major';

  if (domain === 'love') {
    return getLoveDomainGuidance(card, isReversed, isMajor);
  } else if (domain === 'finance') {
    return getFinanceDomainGuidance(card, isReversed, isMajor);
  } else {
    return getHealthDomainGuidance(card, isReversed, isMajor);
  }
}

function getLoveDomainGuidance(
  card: TarotCard,
  isReversed: boolean,
  isMajor: boolean
): DomainCardGuidance {
  const name = card.name;
  const suit = card.suit;

  if (isMajor) {
    if (name.includes('Lovers')) {
      return {
        theme: isReversed ? 'Soul Alignment & Value Reconciliation' : 'Twin Flame Union & Heart Choices',
        focusTitle: 'Romantic Resonance',
        message: isReversed
          ? 'An energetic imbalance or fear of vulnerability is causing friction. Reconnect with your core values before making hasty decisions.'
          : 'A sacred soul bond and harmonious attraction. Open your heart completely; pure mutual trust and reciprocal love are blossoming.',
        action: isReversed ? 'Have an honest, compassionate talk to realign shared expectations.' : 'Express your deepest heartfelt affection without reservation today.',
        affirmation: 'I am worthy of profound, authentic, reciprocal love.',
        reflectionQuestion: 'How can I lead with empathy and unconditional respect in my connection?',
      };
    }
    if (name.includes('Empress')) {
      return {
        theme: isReversed ? 'Self-Love Depletion & Boundary Care' : 'Sensual Romance & Divine Nurturance',
        focusTitle: 'Affection & Warmth',
        message: isReversed
          ? 'You may be giving all your love to others while forgetting to nurture your own heart. Replenish your vessel first.'
          : 'Warmth, fertility, and magnetic charm envelop your romantic sphere. A wonderful time to deepen intimacy and pamper your partner.',
        action: 'Indulge in a relaxing date, sensual meal, or loving self-care ritual.',
        affirmation: 'My heart radiates nurturing warmth and magnetic grace.',
        reflectionQuestion: 'Where can I invite more tenderness and beauty into my love life?',
      };
    }
    if (name.includes('Devil')) {
      return {
        theme: isReversed ? 'Liberation from Codependency' : 'Passion vs. Toxic Attachment',
        focusTitle: 'Intense Desires & Boundaries',
        message: isReversed
          ? 'You are breaking free from unhealthy patterns, jealousy, or obsessive dynamics. Emotional freedom is returning.'
          : 'High chemistry mixed with potential codependency or possessiveness. Ensure passion does not compromise your sovereign self-respect.',
        action: 'Distinguish between genuine loving connection and attachment to validation.',
        affirmation: 'I love freely from wholeness, not from fear or limitation.',
        reflectionQuestion: 'Am I choosing this connection from love or from fear of being alone?',
      };
    }
  }

  // Suit based fallback
  if (suit === 'cups') {
    return {
      theme: isReversed ? 'Emotional Clearing & Re-Opening Heart' : 'Emotional Fulfillment & Deep Bonding',
      focusTitle: 'Water of the Heart',
      message: isReversed
        ? `With ${card.name} reversed, past heartbreaks or unexpressed emotions may be blocking intimacy. Practice gentle forgiveness.`
        : `With ${card.name}, emotional tides are flowing gracefully. Tender words, empathetic listening, and shared vulnerability will create magic.`,
      action: isReversed ? 'Journal about past relationship wounds and let them go.' : 'Send a loving note or spend quality screen-free time together.',
      affirmation: 'I communicate feelings with clarity, courage, and unconditional warmth.',
      reflectionQuestion: 'What does my heart need to feel truly cherished right now?',
    };
  }

  if (suit === 'wands') {
    return {
      theme: isReversed ? 'Restoring Passion & Calming Impatience' : 'Fiery Attraction & Playful Chemistry',
      focusTitle: 'Flames of Romance',
      message: isReversed
        ? `${card.name} reversed indicates burnout or mismatched romantic tempos. Reignite fun without forcing outcomes.`
        : `${card.name} sparks exciting chemistry, playful banter, and bold romantic initiatives. Take the lead in planning something adventurous!`,
      action: 'Plan an unexpected spontaneous activity or flirtatious gesture.',
      affirmation: 'My love life is vibrant, passionate, and delightfully inspiring.',
      reflectionQuestion: 'How can we bring more playfulness and adventure into our dynamic?',
    };
  }

  if (suit === 'swords') {
    return {
      theme: isReversed ? 'Releasing Defensive Walls' : 'Clarity, Truth & Honest Communication',
      focusTitle: 'Mind & Heart Dialogue',
      message: isReversed
        ? `Overthinking or assumptions could create misunderstandings. Drop defensiveness and seek to understand rather than win.`
        : `A time for radical honesty, clear agreements, and intellectual alignment. Speak your truth with loving gentleness.`,
      action: 'Clarify any unspoken expectations before small doubts turn into assumptions.',
      affirmation: 'I speak my heart’s truth with calm kindness and compassionate clarity.',
      reflectionQuestion: 'What truth needs to be spoken with loving kindness today?',
    };
  }

  // Pentacles / default
  return {
    theme: isReversed ? 'Rebuilding Trust & Shared Foundations' : 'Devotion, Stability & Lasting Commitment',
    focusTitle: 'Earth of the Heart',
    message: isReversed
      ? `Material worries or practical stress might be distracting from romantic intimacy. Re-center on what truly matters.`
      : `Loyal, grounded, and dependable love. A strong foundation is being built through consistent small acts of service and presence.`,
    action: 'Show your love through practical acts of care, home comforts, or shared future plans.',
    affirmation: 'I build a lasting, secure, and deeply peaceful partnership.',
    reflectionQuestion: 'How can we nurture our security and mutual trust every day?',
  };
}

function getFinanceDomainGuidance(
  card: TarotCard,
  isReversed: boolean,
  isMajor: boolean
): DomainCardGuidance {
  const name = card.name;
  const suit = card.suit;

  if (isMajor) {
    if (name.includes('Magician')) {
      return {
        theme: isReversed ? 'Resource Re-Evaluation' : 'Active Manifestation & Skill Monetization',
        focusTitle: 'Abundance Creation',
        message: isReversed
          ? 'Beware of quick-money schemes or spreading yourself too thin. Refocus on your genuine core competence.'
          : 'You hold all the elemental tools required to materialize lucrative ventures. Your initiative and communication turn ideas into gold.',
        action: 'Launch that proposal, pitch your services, or organize your income streams.',
        affirmation: 'I have the creativity, power, and wisdom to generate prosperous abundance.',
        reflectionQuestion: 'What unique skill can I leverage into new value this week?',
      };
    }
    if (name.includes('Wheel of Fortune')) {
      return {
        theme: isReversed ? 'Navigating Financial Shifts' : 'Lucky Windfalls & Karmic Prosperity',
        focusTitle: 'Cycles of Wealth',
        message: isReversed
          ? 'A temporary plateau in finances. Do not panic-spend; maintain an emergency buffer and review recurring expenses.'
          : 'The financial wheel is turning upward! Expect unexpected opportunities, profitable contracts, or fortunate synchronicities.',
        action: 'Be ready to seize an unexpected financial window when it appears.',
        affirmation: 'I welcome positive financial cycles and allow abundance to flow freely.',
        reflectionQuestion: 'How can I position myself for the upcoming upswing in prosperity?',
      };
    }
    if (name.includes('Emperor')) {
      return {
        theme: isReversed ? 'Financial Disorganization' : 'Budget Mastery & Strategic Investment',
        focusTitle: 'Sovereign Structure',
        message: isReversed
          ? 'Lack of fiscal discipline or impulsive investments could cause instability. Build a clear, structured budget.'
          : 'Take firm command of your empire. Set disciplined financial structures, track balances, and plan for long-term compound growth.',
        action: 'Audit your monthly cashflow and set concrete savings targets.',
        affirmation: 'I manage my resources with sovereign wisdom, order, and strength.',
        reflectionQuestion: 'What systematic rule will protect and grow my assets?',
      };
    }
  }

  if (suit === 'pentacles') {
    return {
      theme: isReversed ? 'Reviewing Cashflow & Avoiding Waste' : 'Tangible Prosperity & Grounded Earnings',
      focusTitle: 'Golden Pentacle Energy',
      message: isReversed
        ? `${card.name} reversed advises double-checking contract details, avoiding speculative risks, and preserving capital.`
        : `${card.name} brings fertile earth energy to your work, investments, and business deals. Hard work is turning into lasting assets.`,
      action: isReversed ? 'Postpone unnecessary big purchases for 48 hours.' : 'Reinvest in your craft and celebrate your steady material gains.',
      affirmation: 'My relationship with money is healthy, prosperous, and grounded in value.',
      reflectionQuestion: 'Where is my energy generating the highest long-term return?',
    };
  }

  if (suit === 'wands') {
    return {
      theme: isReversed ? 'Overcoming Creative Stall' : 'Career Momentum & Bold Initiatives',
      focusTitle: 'Entrepreneurial Fire',
      message: isReversed
        ? 'Scattered efforts or work burnout may be slowing income. Prioritize the single project with the highest impact.'
        : 'Bold career moves, client expansion, and creative projects are rewarded. Your enthusiasm will attract lucrative opportunities.',
      action: 'Follow through aggressively on your most promising career idea.',
      affirmation: 'My passion generates meaningful value and financial freedom.',
      reflectionQuestion: 'What bold career step have I been putting off that could pay off?',
    };
  }

  if (suit === 'swords') {
    return {
      theme: isReversed ? 'Clearing Financial Anxiety' : 'Strategic Planning & Contract Clarity',
      focusTitle: 'Intellectual Asset',
      message: isReversed
        ? 'Paralysis by financial over-analysis or scarcity mindset. Reframe your thoughts from lack to resourcefulness.'
        : 'Use sharp analysis and clear negotiations. Read fine print carefully; objective decision-making will protect your wealth.',
      action: 'Negotiate rates, review terms, and eliminate unnecessary subscription leaks.',
      affirmation: 'I make sound, rational, and highly profitable decisions.',
      reflectionQuestion: 'What logical step can streamline my financial workflow?',
    };
  }

  // Cups / default
  return {
    theme: isReversed ? 'Emotional Spending Check' : 'Intuitive Prosperity & Meaningful Work',
    focusTitle: 'Fulfilling Abundance',
    message: isReversed
      ? 'Avoid retail therapy or impulse spending driven by emotional stress. Find fulfillment from within.'
      : 'Aligning your earnings with your soul purpose. Work that helps and connects with others will yield both joy and financial reward.',
    action: 'Channel your creative heart into service that directly benefits your community.',
    affirmation: 'I attract wealth by doing what aligns with my highest joy and purpose.',
    reflectionQuestion: 'Does my current work nourish both my bank account and my soul?',
  };
}

function getHealthDomainGuidance(
  card: TarotCard,
  isReversed: boolean,
  isMajor: boolean
): DomainCardGuidance {
  const name = card.name;
  const suit = card.suit;

  if (isMajor) {
    if (name.includes('Sun')) {
      return {
        theme: isReversed ? 'Temporary Fatigue & Vitamin D' : 'Radiant Vitality & Peak Energy',
        focusTitle: 'Solar Radiance',
        message: isReversed
          ? 'You may feel slightly burned out or over-extended. Step outside for fresh air and gentle morning sunshine.'
          : 'Superb vitality, cellular regeneration, and radiant mood. Your body is energized and ready for healthy physical movement.',
        action: 'Get 15 minutes of direct morning sunlight and hydrate deeply.',
        affirmation: 'My body is filled with vibrant, radiant, self-healing light.',
        reflectionQuestion: 'What physical activity brings pure childlike joy to my body?',
      };
    }
    if (name.includes('Temperance')) {
      return {
        theme: isReversed ? 'Internal Imbalance & Detox' : 'Alchemical Healing & Equilibrium',
        focusTitle: 'Golden Balance',
        message: isReversed
          ? 'Physical excess or stress is throwing your nervous system off balance. Cleanse with water, clean foods, and sleep.'
          : 'Perfect homeostasis and internal harmony. Healing processes are accelerating as mind, body, and spirit align.',
        action: 'Drink extra electrolyte-rich water and practice 5 minutes of balanced breathwork (inhale 4s, exhale 4s).',
        affirmation: 'Every cell in my body returns to perfect, harmonious balance.',
        reflectionQuestion: 'Where is my daily routine calling for more gentle moderation?',
      };
    }
    if (name.includes('Strength')) {
      return {
        theme: isReversed ? 'Recharging Depleted Reserves' : 'Gentle Resilience & Somatic Peace',
        focusTitle: 'Endurance & Fortitude',
        message: isReversed
          ? 'Do not push your body through exhaustion with brute willpower. Respect fatigue and allow genuine recovery.'
          : 'Gentle, unshakeable stamina and nervous system resilience. Tame tension with kindness rather than harsh discipline.',
        action: 'Engage in grounding stretching, yoga, or a peaceful nature walk.',
        affirmation: 'I honor my body with patient kindness, stamina, and love.',
        reflectionQuestion: 'How can I treat my physical vessel with more gentle reverence today?',
      };
    }
  }

  if (suit === 'pentacles') {
    return {
      theme: isReversed ? 'Body Neglect & Grounding Need' : 'Physical Strength & Rooted Wellness',
      focusTitle: 'Earth Vessel Wellness',
      message: isReversed
        ? 'Your body may be craving more sleep, wholesome meals, or ergonomic care. Listen to physical symptoms early.'
        : 'Solid physical health, strong digestion, and grounded energy. Consistent nutritious meals and movement anchor well-being.',
      action: 'Eat whole, nourishing foods and take time to stretch your spine and legs.',
      affirmation: 'I treat my body as a sacred, thriving temple of health.',
      reflectionQuestion: 'What does my physical body ask of me today?',
    };
  }

  if (suit === 'cups') {
    return {
      theme: isReversed ? 'Releasing Somatic Stress' : 'Emotional Cleansing & Cellular Peace',
      focusTitle: 'Hydration & Emotional Flow',
      message: isReversed
        ? 'Suppressed emotional tension may be settling in your stomach or shoulders. Give yourself permission to cry or vent.'
        : 'Harmonious emotional balance directly supports your immune system. Fluid hydration and lymphatic flow are optimal.',
      action: 'Take a warm Epsom salt bath or drink calming herbal tea (chamomile/peppermint).',
      affirmation: 'I release emotional tension and let healing waters soothe my being.',
      reflectionQuestion: 'What emotion is ready to be released from my physical body?',
    };
  }

  if (suit === 'swords') {
    return {
      theme: isReversed ? 'Calming Mental Overdrive' : 'Nervous System Rest & Sleep Hygiene',
      focusTitle: 'Mental Peace & Rest',
      message: isReversed
        ? 'Mental loopings or screen fatigue are draining your vitality. Unplug and rest your eyes.'
        : 'Prioritize mental calmness and sleep quality. Clear boundaries against stress will immediately boost your immune response.',
      action: 'Put screens away 60 minutes before sleep and practice slow diaphragmatic breathing.',
      affirmation: 'My nervous system is relaxed, tranquil, and deeply restored.',
      reflectionQuestion: 'How can I quiet mental chatter to give my nervous system a break?',
    };
  }

  // Wands / default
  return {
    theme: isReversed ? 'Preventing Adrenal Burnout' : 'Dynamic Vitality & Movement',
    focusTitle: 'Pranic Fire',
    message: isReversed
      ? 'Adrenal fatigue or rushing everywhere is depleting your core fire. Slow down your pace.'
      : 'High metabolic energy, physical motivation, and lively enthusiasm. Channel this fire into cardiovascular movement or sports.',
    action: 'Engage in 20 minutes of energizing exercise or brisk walking.',
    affirmation: 'My vitality is strong, vibrant, and replenished with pure life-force.',
    reflectionQuestion: 'How can I channel my physical energy in a constructive, joyous way?',
  };
}

/**
 * Synthesizes the interplay between the Primary Daily Card and the Clarification Card.
 */
export function getDualCardSynthesis(
  primary: DrawnCard,
  clarification: DrawnCard
): {
  coreTheme: string;
  dynamicSummary: string;
  actionableSynthesis: string;
  integratedAffirmation: string;
} {
  const isPrimaryMajor = primary.arcana === 'Major';
  const isClarificationMajor = clarification.arcana === 'Major';

  let coreTheme = `${primary.name} illuminated by ${clarification.name}`;
  if (isPrimaryMajor && isClarificationMajor) {
    coreTheme = `Major Spiritual Turning Point: ${primary.name} + ${clarification.name}`;
  }

  const dynamicSummary = `Today's overarching energy is anchored by **${primary.name}** (${primary.isReversed ? 'Reversed' : 'Upright'}), representing *${primary.isReversed ? primary.reversedKeywords.slice(0, 2).join(', ') : primary.keywords.slice(0, 2).join(', ')}*. When we draw **${clarification.name}** (${clarification.isReversed ? 'Reversed' : 'Upright'}) as your sacred clarification card, it reveals the hidden catalyst: *${clarification.isReversed ? clarification.reversedKeywords.slice(0, 2).join(', ') : clarification.keywords.slice(0, 2).join(', ')}*. Together, these cards indicate that navigating the primary theme of ${primary.name} will be successfully resolved by applying the specific wisdom of ${clarification.name}.`;

  const actionableSynthesis = `Apply ${clarification.name}'s advice (${clarification.advice}) to master the situation presented by ${primary.name}. Notice how ${clarification.isReversed ? 'releasing resistance' : 'stepping into action'} opens the gateway to clarity.`;

  const integratedAffirmation = `I embrace the lesson of ${primary.name} with the illuminated wisdom of ${clarification.name}, walking in peace and truth.`;

  return {
    coreTheme,
    dynamicSummary,
    actionableSynthesis,
    integratedAffirmation,
  };
}
