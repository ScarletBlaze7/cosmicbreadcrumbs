import { TarotCard } from '../types';

/**
 * Authentic 1909/1910 Pamela Colman Smith / Arthur Edward Waite Tarot Scans
 * Scans of the original "Pam-A" deck first published by William Rider & Son, London (1909-1910).
 * Sourced from high-resolution public domain archival scans on Wikimedia Commons.
 */

// Major Arcana Wikimedia filename mapping
const MAJOR_ARCANA_IMAGE_MAP: Record<number, string> = {
  0: 'RWS_Tarot_00_Fool.jpg',
  1: 'RWS_Tarot_01_Magician.jpg',
  2: 'RWS_Tarot_02_High_Priestess.jpg',
  3: 'RWS_Tarot_03_Empress.jpg',
  4: 'RWS_Tarot_04_Emperor.jpg',
  5: 'RWS_Tarot_05_Hierophant.jpg',
  6: 'RWS_Tarot_06_Lovers.jpg',
  7: 'RWS_Tarot_07_Chariot.jpg',
  8: 'RWS_Tarot_08_Strength.jpg',
  9: 'RWS_Tarot_09_Hermit.jpg',
  10: 'RWS_Tarot_10_Wheel_of_Fortune.jpg',
  11: 'RWS_Tarot_11_Justice.jpg',
  12: 'RWS_Tarot_12_Hanged_Man.jpg',
  13: 'RWS_Tarot_13_Death.jpg',
  14: 'RWS_Tarot_14_Temperance.jpg',
  15: 'RWS_Tarot_15_Devil.jpg',
  16: 'RWS_Tarot_16_Tower.jpg',
  17: 'RWS_Tarot_17_Star.jpg',
  18: 'RWS_Tarot_18_Moon.jpg',
  19: 'RWS_Tarot_19_Sun.jpg',
  20: 'RWS_Tarot_20_Judgement.jpg',
  21: 'RWS_Tarot_21_World.jpg',
};

// Formats a number with leading zero (e.g. 1 -> "01")
const padNum = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

/**
 * Returns the Wikimedia Commons file name for any card in the 78-card 1909 RWS deck
 */
export function getRwsFileName(card: { id?: string; suit?: string; number: number; arcana?: string }): string {
  const suit = (card.suit || '').toLowerCase();
  
  if (suit === 'major' || card.arcana === 'Major' || (card.id && card.id.startsWith('major-'))) {
    return MAJOR_ARCANA_IMAGE_MAP[card.number] || 'RWS_Tarot_00_Fool.jpg';
  }

  if (suit === 'wands' || (card.id && card.id.startsWith('wands-'))) {
    return `Wands${padNum(card.number)}.jpg`;
  }

  if (suit === 'cups' || (card.id && card.id.startsWith('cups-'))) {
    return `Cups${padNum(card.number)}.jpg`;
  }

  if (suit === 'swords' || (card.id && card.id.startsWith('swords-'))) {
    return `Swords${padNum(card.number)}.jpg`;
  }

  if (suit === 'pentacles' || (card.id && card.id.startsWith('pentacles-'))) {
    return `Pents${padNum(card.number)}.jpg`;
  }

  return 'RWS_Tarot_00_Fool.jpg';
}

/**
 * Returns the primary high-resolution archival URL for the authentic 1909 Pamela Colman Smith scan
 */
export function getRwsCardImageUrl(card: { id?: string; suit?: string; number: number; arcana?: string; imageUrl?: string }): string {
  if (card.imageUrl) {
    return card.imageUrl;
  }
  const filename = getRwsFileName(card);
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}`;
}

/**
 * Returns alternate fallback URL (sacred-texts archive) if needed
 */
export function getRwsBackupImageUrl(card: { id?: string; suit?: string; number: number; arcana?: string }): string {
  const suit = (card.suit || '').toLowerCase();
  
  if (suit === 'major' || card.arcana === 'Major' || (card.id && card.id.startsWith('major-'))) {
    return `https://sacred-texts.com/tarot/pkt/img/ar${padNum(card.number)}.jpg`;
  }
  
  let suitCode = 'wa';
  if (suit === 'cups') suitCode = 'cu';
  else if (suit === 'swords') suitCode = 'sw';
  else if (suit === 'pentacles') suitCode = 'pe';

  let rankCode = padNum(card.number);
  if (card.number === 1) rankCode = 'ac';
  else if (card.number === 11) rankCode = 'pa';
  else if (card.number === 12) rankCode = 'kn';
  else if (card.number === 13) rankCode = 'qu';
  else if (card.number === 14) rankCode = 'ki';

  return `https://sacred-texts.com/tarot/pkt/img/${suitCode}${rankCode}.jpg`;
}

/**
 * Enriches a TarotCard with its authentic 1909 image URL
 */
export function enrichCardWithImage(card: TarotCard): TarotCard {
  return {
    ...card,
    imageUrl: getRwsCardImageUrl(card),
  };
}
