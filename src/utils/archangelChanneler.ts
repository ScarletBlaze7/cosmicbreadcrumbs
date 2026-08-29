import { DrawnArchangelCard, UserProfile } from '../types';

export interface ChanneledArchangelGuidance {
  associatedArchangel: string;
  archangelRay: string;
  angelicMessage: string;
  coreMeaning: string;
  sacredAction: string;
  affirmation: string;
  crystalResonance?: string;
}

export function generateChanneledArchangelResponse(
  primaryCard: DrawnArchangelCard,
  clarificationCard: DrawnArchangelCard | null,
  customQuestion: string,
  userProfile?: UserProfile
): ChanneledArchangelGuidance {
  const name = userProfile?.name ? userProfile.name.split(' ')[0] : 'Beloved Seeker';
  const archangel = primaryCard.archangel;
  const ray = primaryCard.colorRay;
  const crystal = primaryCard.crystalResonance;

  let questionContext = customQuestion.trim();
  if (!questionContext) {
    questionContext = 'your life path, soul purpose, and immediate next steps';
  }

  let transmission = '';
  let coreEssence = '';
  let action = '';
  let affirmationText = '';

  switch (archangel.toLowerCase()) {
    case 'archangel michael':
      transmission = `Beloved ${name}, I am Archangel Michael, and my Sapphire Blue Ray of Divine Protection and Unwavering Courage envelopes you now.\n\nRegarding "${questionContext}":\nKnow with certainty that any fear, hesitation, or self-doubt you carry is merely an old energetic remnant ready to be cut away by my sword of truth. You are fully capable of standing in your sovereign power.\n\n${clarificationCard ? `With ${clarificationCard.archangel} standing beside us through the ${clarificationCard.title}, the universe emphasizes ${clarificationCard.clarificationMeaning.toLowerCase()}.\n\n` : ''}Step forward with your head held high. You are shielded from all discord, and your authentic truth is your strongest shield.`;
      coreEssence = `Sovereignty, fearlessness, and energetic shielding in all endeavors.`;
      action = `Hold your ground, speak your truth clearly without apology, and release worries into the sapphire flame.`;
      affirmationText = `I am safe, sovereign, and boldly guided by the light of Archangel Michael.`;
      break;

    case 'archangel raphael':
      transmission = `Beloved ${name}, I am Archangel Raphael, holder of the Emerald Ray of Wholeness, Healing, and Divine Restoration.\n\nI hear your heart's contemplation regarding "${questionContext}".\nBreathe in the emerald green light of renewal. Healing is not something you must force—it is your natural state of being when you release mental burdens. Allow your physical body, emotions, and thoughts to align with peace.\n\n${clarificationCard ? `${clarificationCard.archangel} brings secondary grace through ${clarificationCard.title}: ${clarificationCard.clarificationMeaning}\n\n` : ''}Trust that every cell of your being is restoring to divine harmony right now.`;
      coreEssence = `Holistic restoration, physical vitality, and deep emotional peace.`;
      action = `Drink pure water, step into nature, and take 3 deep belly breaths while visualizing emerald healing light.`;
      affirmationText = `Every breath I take fills my soul with divine health, peace, and restorative light.`;
      break;

    case 'archangel gabriel':
      transmission = `Greetings ${name}, I am Archangel Gabriel, Herald of Divine Clarity, Creative Expression, and Auspicious Beginnings.\n\nRegarding "${questionContext}":\nYour authentic voice and creative vision are needed in this world. Do not wait for perfect circumstances to express what is stirring within your spirit. Clear communication, artistic creation, and gentle honesty will unlock the doors you seek.\n\n${clarificationCard ? `The presence of ${clarificationCard.archangel} (${clarificationCard.title}) reminds you: ${clarificationCard.clarificationMeaning}\n\n` : ''}Speak, write, and create from your highest heart.`;
      coreEssence = `Divine messages, creative expression, and pristine clarity of purpose.`;
      action = `Write down your key ideas on paper today and express yourself honestly without overthinking.`;
      affirmationText = `My words and creative expressions carry divine clarity and radiant light.`;
      break;

    case 'archangel uriel':
      transmission = `Peace be upon you, ${name}. I am Archangel Uriel, the Radiant Sun of God and Illuminator of Wisdom.\n\nConcerning "${questionContext}":\nWhen darkness or confusion seems to cloud the horizon, remember that the spark of divine wisdom already dwells within your mind. Sudden epiphanies and practical solutions are now lighting up your mental field.\n\n${clarificationCard ? `Supported by ${clarificationCard.archangel} (${clarificationCard.title}), ${clarificationCard.clarificationMeaning}\n\n` : ''}Trust the quiet flashes of insight you receive throughout this day—they are direct transmissions from celestial intelligence.`;
      coreEssence = `Sudden illumination, intellectual clarity, and grounded spiritual solutions.`;
      action = `Trust your initial gut instinct when solving problems today, and write down sudden flash ideas immediately.`;
      affirmationText = `Divine wisdom flows through my thoughts with radiant clarity and grounded certainty.`;
      break;

    case 'archangel chamuel':
      transmission = `Dearest ${name}, I am Archangel Chamuel, Angel of Unconditional Love, Pure Relationships, and Peaceful Reconciliation.\n\nRegarding "${questionContext}":\nOpen your heart center to receive the unconditional love that surrounds you. When you seek with love in your heart rather than fear in your mind, what is meant for you will effortlessly find its way to you.\n\n${clarificationCard ? `Combined with ${clarificationCard.archangel}'s energy in ${clarificationCard.title}: ${clarificationCard.clarificationMeaning}\n\n` : ''}Forgive past misunderstandings and let gentle compassion lead your interactions.`;
      coreEssence = `Heart opening, divine relationships, and locating lost peace.`;
      action = `Place your hand over your heart, breathe in pink light, and send silent blessing to anyone on your mind today.`;
      affirmationText = `I am surrounded by divine love, and my heart attracts only peace, kindness, and harmony.`;
      break;

    default:
      transmission = `Beloved ${name}, I am ${archangel}, stepping forward with the ${ray} of celestial grace.\n\nIn response to your inquiry regarding "${questionContext}":\nThe celestial realms are watching over your path with tenderness and boundless support. The card drawn for you—"${primaryCard.title}"—is an unmistakable sign that you are on the right trail of cosmic breadcrumbs.\n\n${clarificationCard ? `Furthermore, ${clarificationCard.archangel} brings confirmation with ${clarificationCard.title}: ${clarificationCard.clarificationMeaning}\n\n` : ''}Honor your intuition, remain steady in your daily practices, and trust that the universe is orchestrating events in your favor.`;
      coreEssence = primaryCard.theme || `Divine alignment, spiritual expansion, and celestial blessings.`;
      action = primaryCard.guidanceAction || `Take one conscious step today aligned with your inner values and peace.`;
      affirmationText = primaryCard.affirmation || `I walk with angels, and my path is blessed with light, love, and divine grace.`;
      break;
  }

  return {
    associatedArchangel: archangel,
    archangelRay: ray,
    angelicMessage: transmission,
    coreMeaning: coreEssence,
    sacredAction: action,
    affirmation: affirmationText,
    crystalResonance: crystal,
  };
}
