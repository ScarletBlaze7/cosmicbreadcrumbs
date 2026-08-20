import { JournalEntry, DiaryEntry } from '../types';

const DIARY_ENTRIES_STORAGE_KEY = 'cosmic_diary_entries';

export function saveAffirmationToLogAndJournal({
  affirmationText,
  sourceTitle,
  theme,
  dateStr = new Date().toISOString().slice(0, 10),
  onSaveJournal,
}: {
  affirmationText: string;
  sourceTitle: string;
  theme?: string;
  dateStr?: string;
  onSaveJournal?: (
    title: string,
    type: 'tarot' | 'horoscope' | 'angel' | 'numerology' | 'affirmation',
    content: string
  ) => void;
}): { success: boolean; message: string } {
  try {
    const formattedContent = `✨ Sacred Daily Affirmation:\n"${affirmationText}"\n\n🔮 Source / Resonance: ${sourceTitle}${theme ? `\n🌿 Energetic Theme: ${theme}` : ''}\n📅 Date Anchored: ${dateStr}\n\n🌟 Daily Integration Mantra: Repeat 3 times upon waking and before sleep to embed this frequency in your subconscious blueprint.`;

    // 1. Save to Journal / Keepsakes
    if (onSaveJournal) {
      onSaveJournal(
        `Daily Affirmation: ${sourceTitle} - ${new Date(dateStr).toLocaleDateString()}`,
        'affirmation',
        formattedContent
      );
    } else {
      const savedJournal = localStorage.getItem('auranova_journal');
      const list: JournalEntry[] = savedJournal ? JSON.parse(savedJournal) : [];
      const newJournalEntry: JournalEntry = {
        id: `entry-aff-${Date.now()}`,
        date: new Date().toISOString(),
        title: `Daily Affirmation: ${sourceTitle} - ${new Date(dateStr).toLocaleDateString()}`,
        type: 'affirmation',
        content: formattedContent,
        isFavorite: true,
      };
      localStorage.setItem('auranova_journal', JSON.stringify([newJournalEntry, ...list]));
    }

    // 2. Also append/anchor into today's Private Diary entry in cosmic_diary_entries
    const rawDiary = localStorage.getItem(DIARY_ENTRIES_STORAGE_KEY);
    let diaryList: DiaryEntry[] = rawDiary ? JSON.parse(rawDiary) : [];
    
    const existingIndex = diaryList.findIndex((item) => item.date === dateStr);

    if (existingIndex >= 0) {
      const existing = diaryList[existingIndex];
      const affirmationNote = `\n\n✨ [Sacred Affirmation]: "${affirmationText}" (${sourceTitle})`;
      
      // If daily thoughts doesn't already have it, append it
      if (!existing.dailyThoughts.includes(affirmationText)) {
        existing.dailyThoughts = existing.dailyThoughts ? `${existing.dailyThoughts}${affirmationNote}` : `✨ [Sacred Affirmation]: "${affirmationText}" (${sourceTitle})`;
      }
      if (!existing.tags.includes('Affirmation')) {
        existing.tags.push('Affirmation');
      }
      diaryList[existingIndex] = existing;
    } else {
      const newDiaryEntry: DiaryEntry = {
        id: `diary-${Date.now()}`,
        date: dateStr,
        createdAt: new Date().toISOString(),
        morningIntuition: `Affirmation for today: "${affirmationText}"`,
        eveningReflection: '',
        readingAccuracyRating: 5,
        accuracyNotes: `Anchored sacred affirmation: ${sourceTitle}`,
        dailyThoughts: `✨ [Sacred Affirmation]: "${affirmationText}"\nSource: ${sourceTitle}\n\nToday's intention is to embody this frequency with presence and peace.`,
        mood: 'radiant',
        tags: ['Affirmation', 'Daily Reflection'],
        isFavorite: true,
      };
      diaryList = [newDiaryEntry, ...diaryList];
    }

    localStorage.setItem(DIARY_ENTRIES_STORAGE_KEY, JSON.stringify(diaryList));

    // Dispatch event so active diary views re-sync immediately
    window.dispatchEvent(new Event('diary-entries-updated'));

    return {
      success: true,
      message: 'Daily affirmation successfully saved to your Journal & Private Thought Log!',
    };
  } catch (err) {
    console.error('Error saving affirmation:', err);
    return {
      success: false,
      message: 'Could not save affirmation.',
    };
  }
}
