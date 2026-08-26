import { DrawnCard } from '../types';

export interface DailyTarotRecord {
  date: string; // YYYY-MM-DD
  primaryCard: DrawnCard | null;
  clarificationCard: DrawnCard | null;
  timestamp: string;
}

const STORAGE_KEY = 'cosmic_breadcrumbs_daily_tarot_record';

/**
 * Returns today's date formatted in the user's local timezone as YYYY-MM-DD.
 */
export const getLocalTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Returns the current stored daily tarot record if it matches today's local date.
 * If the record belongs to a previous day, it returns null (automatically reset at midnight).
 */
export const getStoredDailyTarot = (): DailyTarotRecord | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: DailyTarotRecord = JSON.parse(raw);
    const today = getLocalTodayDateString();
    if (parsed.date === today) {
      return parsed;
    }
    // Expired since midnight
    return null;
  } catch (err) {
    console.error('Error reading daily tarot record:', err);
    return null;
  }
};

/**
 * Saves today's primary card of the day.
 */
export const saveDailyPrimaryCard = (card: DrawnCard): DailyTarotRecord => {
  const today = getLocalTodayDateString();
  const existing = getStoredDailyTarot();

  const updated: DailyTarotRecord = {
    date: today,
    primaryCard: card,
    clarificationCard: existing?.clarificationCard || null,
    timestamp: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('daily-tarot-updated'));
  } catch (err) {
    console.error('Error saving daily primary card:', err);
  }

  return updated;
};

/**
 * Saves today's clarification card.
 */
export const saveDailyClarificationCard = (card: DrawnCard): DailyTarotRecord => {
  const today = getLocalTodayDateString();
  const existing = getStoredDailyTarot();

  const updated: DailyTarotRecord = {
    date: today,
    primaryCard: existing?.primaryCard || null,
    clarificationCard: card,
    timestamp: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('daily-tarot-updated'));
  } catch (err) {
    console.error('Error saving daily clarification card:', err);
  }

  return updated;
};

/**
 * Calculates remaining time until next midnight in user's local timezone.
 */
export const getTimeUntilMidnight = (): {
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
} => {
  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0
  );
  const diffMs = Math.max(0, midnight.getTime() - now.getTime());

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formatted = `${hours}h ${String(minutes).padStart(2, '0')}m ${String(
    seconds
  ).padStart(2, '0')}s`;

  return { hours, minutes, seconds, formatted };
};
