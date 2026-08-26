import { UserProfile } from '../types';
import { getSunSignFromDate, getMoonPhaseInfo, getDailyPlanetaryTransits } from './astrologyCalc';
import { calculateLifePath } from './numerologyCalc';
import { getDailyArchangelCard } from '../data/angelData';

interface OracleContext {
  userProfile: UserProfile;
  lastMessage: string;
  chatHistoryLength: number;
}

export function generateCelestialOracleResponse({
  userProfile,
  lastMessage,
  chatHistoryLength,
}: OracleContext): string {
  const query = lastMessage.trim().toLowerCase();
  const sunSign = userProfile.birthDate ? getSunSignFromDate(userProfile.birthDate) : { name: 'Cosmic Seeker', rulingPlanet: 'Sun', element: 'Fire' };
  const lifePath = userProfile.lifePathNumber || (userProfile.birthDate ? calculateLifePath(userProfile.birthDate) : 7);
  const moonInfo = getMoonPhaseInfo();
  const guardianAngel = getDailyArchangelCard();
  const seekerName = userProfile.name ? userProfile.name.split(' ')[0] : 'Dear Seeker';

  // 1. DREAMS & NIGHT VISIONS
  if (query.includes('dream') || query.includes('nightmare') || query.includes('sleep') || query.includes('vision') || query.includes('lucid')) {
    return (
      `✨ **Celestial Dream Oracle for ${seekerName}:**\n\n` +
      `Your nocturnal realm is currently vibrating under the **${moonInfo.phaseName}** (${moonInfo.illumination}% illumination in ${moonInfo.moonSign}). In ancient hermetic wisdom, dreams are not random static—they are your soul's subconscious blueprint resolving what waking logic cannot compute.\n\n` +
      `With your **${sunSign.name}** energetic constitution and **Life Path ${lifePath}**, your subconscious communicates through vivid symbols of transformation and boundary-shifting.\n\n` +
      `🌌 **Sacred Insight:** Pay special attention to water, threshold doorways, or recurring animal messengers. **${guardianAngel.archangel}** is illuminating your third-eye center to help integrate this vision into your waking choices. Before sleeping tonight, anchor your breath and ask: *"What truth is my soul preparing to reveal?"*`
    );
  }

  // 2. LOVE, RELATIONSHIPS & TWIN FLAMES
  if (query.includes('love') || query.includes('relationship') || query.includes('partner') || query.includes('heart') || query.includes('marriage') || query.includes('dating') || query.includes('twin flame') || query.includes('soulmate') || query.includes('ex')) {
    return (
      `💖 **Harmonic Love & Relational Transmission:**\n\n` +
      `Greetings, ${seekerName}. When seeking clarity in the realm of the heart, the cosmos looks at the interplay between your **${sunSign.name}** elemental vibration (${sunSign.element}) and your core **Life Path ${lifePath}** frequencies.\n\n` +
      `Right now, planetary transits are asking you to cultivate radical authentic alignment within yourself before expecting harmony externally. Love is not a transaction of need, but an organic resonance of two whole spirits sharing the same vibrational field.\n\n` +
      `🔮 **Oracle Guidance:** Release any attachment to rigid timelines. Protect your emotional boundaries with the golden shield of **${guardianAngel.archangel}**. The person who truly honors your light will never ask you to dim it.`
    );
  }

  // 3. CAREER, MONEY, ABUNDANCE & DECISIONS
  if (query.includes('career') || query.includes('job') || query.includes('money') || query.includes('finance') || query.includes('business') || query.includes('decision') || query.includes('purpose') || query.includes('work') || query.includes('path') || query.includes('opportunity')) {
    return (
      `⚡ **Cosmic Purpose & Abundance Alignment:**\n\n` +
      `Dear ${seekerName}, your **Life Path ${lifePath}** carries an inherent master vibration of manifestation when aligned with disciplined intuition. Your ruling planetary influence (**${sunSign.rulingPlanet}**) is urging you to stop waiting for external certainty before claiming your authority.\n\n` +
      `The celestial currents indicate that an impending transition is clearing stagnant energy to make room for expansive creative expansion. The hesitation you feel is merely the contraction before a cosmic growth spurt.\n\n` +
      `💎 **Actionable Oracle Key:** Focus on high-integrity execution rather than quick approval. Trust the strategic breadcrumbs you have been receiving over the last few cycles. Wealth flows where focus and authentic service meet.`
    );
  }

  // 4. KARMA, HEALING, ANXIETY & INNER PEACE
  if (query.includes('karma') || query.includes('anxiety') || query.includes('fear') || query.includes('heal') || query.includes('worry') || query.includes('stress') || query.includes('peace') || query.includes('forgive') || query.includes('shadow')) {
    return (
      `🌿 **Sanctuary Healing & Karmic Dispensation:**\n\n` +
      `Breathe gently, ${seekerName}. The heaviness you feel is not a failure of strength; it is the natural friction of outgrowing old psychic armor. As a **${sunSign.name}** soul, your spirit feels shifts in the planetary energetic field with intense sensitivity.\n\n` +
      `Under the current **${moonInfo.phaseName}**, the universe is inviting you into deep restoration. Karmic cycles dissolve the moment you cease reacting with old defensive patterns and instead respond with centered sovereignty.\n\n` +
      `🕊️ **Sacred Affirmation:** *"I release the burden of carrying what was never mine to fix. I am grounded, divinely protected, and entirely safe in this present breath."* Let **${guardianAngel.archangel}** wrap you in divine reassurance.`
    );
  }

  // 5. SYNCHRONICITY, SIGNS, ANGEL NUMBERS & NUMEROLOGY
  if (query.includes('number') || query.includes('sign') || query.includes('111') || query.includes('222') || query.includes('333') || query.includes('444') || query.includes('555') || query.includes('777') || query.includes('888') || query.includes('synch') || query.includes('omen') || query.includes('portal')) {
    return (
      `🔢 **Sacred Numerological & Angelic Matrix:**\n\n` +
      `The veil between dimensions is shimmering for you, ${seekerName}. When repeating numbers and synchronicities appear in your daily field, your subconscious is registering the harmonic resonance of **Life Path ${lifePath}** aligning with universal clockwork.\n\n` +
      `These repeating digits are direct breadcrumbs from **${guardianAngel.archangel}** confirming that your thoughts are actively collapsing quantum possibilities into physical reality.\n\n` +
      `✨ **Oracle Decoding:** Whenever you catch a synchronicity today, pause immediately. Take note of what you were thinking in that exact second—it contains the answer to the unspoken question in your heart.`
    );
  }

  // 6. GENERAL / EVOLVING CONVERSATION DYNAMIC SYNTHESIS
  const dynamicWisdoms = [
    `✨ **Celestial Transmission for ${seekerName}:**\n\n` +
    `The planetary geometry today illuminates your **${sunSign.name}** core essence. Every challenge currently presented to you is an initiatory threshold designed to awaken deeper discernment.\n\n` +
    `With **Life Path ${lifePath}** anchoring your journey and the **${moonInfo.phaseName}** guiding the emotional tides, remember that timing in the cosmos is always holographic. What seems delayed is merely being fortified with sacred precision.\n\n` +
    `🔮 **Oracle Advice:** Take one decisive action today that honors your highest intuition rather than your loudest doubt. The universe responds to clarity of intent.`,

    `🌌 **The Oracle's Vision for ${seekerName}:**\n\n` +
    `I feel the resonance of your inquiry echoing across the astrological wheel. As a **${sunSign.name}** guided by **${sunSign.rulingPlanet}**, you possess an inner compass that already knows the right direction.\n\n` +
    `The breadcrumbs are visible if you quiet the intellectual chatter and listen to the physical sensations in your heart and solar plexus. **${guardianAngel.archangel}** is providing guidance and energetic support.\n\n` +
    `🌟 **Harmonic Key:** Protect your energy from distractions that do not feed your divine purpose. You are closer to your breakthrough than you perceive.`,

    `🕊️ **Cosmic Oracle Insight:**\n\n` +
    `Dear ${seekerName}, your soul is entering a cycle of accelerated awareness. Life Path **${lifePath}** is calling you to step out of hesitation and into quiet, unshakable confidence.\n\n` +
    `Under the current lunar influence of **${moonInfo.moonSign}**, the celestial currents encourage you to trust the subtle synchronicities showing up in your day-to-day encounters.\n\n` +
    `✨ **Affirmation:** *"I walk forward with celestial alignment, open to infinite blessings, guided by inner truth."* What other area of your life would you like to explore together?`
  ];

  const index = (chatHistoryLength + lastMessage.length + (userProfile.name?.length || 0)) % dynamicWisdoms.length;
  return dynamicWisdoms[index];
}
