// Manages persistent custom photo uploads for all 6 Universal News Astrologer Newscasters

const PHOTO_STORAGE_KEY = 'cosmic_newscaster_custom_photos';

export interface NewscasterPhotoRegistry {
  [characterId: string]: string; // Base64 data URL or asset path
}

export function getAllNewscasterPhotos(): NewscasterPhotoRegistry {
  try {
    const raw = localStorage.getItem(PHOTO_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load newscaster photos:', e);
  }
  return {};
}

export function getNewscasterPhoto(characterId: string, fallbackUrl?: string): string | undefined {
  const photos = getAllNewscasterPhotos();
  if (photos[characterId]) {
    return photos[characterId];
  }
  return fallbackUrl;
}

export function saveNewscasterPhoto(characterId: string, photoDataUrl: string): void {
  try {
    const photos = getAllNewscasterPhotos();
    photos[characterId] = photoDataUrl;
    localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(photos));
    // Trigger custom event so all active newscaster views update instantly
    window.dispatchEvent(new CustomEvent('newscaster-photo-updated', { detail: { characterId, photoDataUrl } }));
  } catch (e) {
    console.error('Failed to save newscaster photo:', e);
  }
}

export function removeNewscasterPhoto(characterId: string): void {
  try {
    const photos = getAllNewscasterPhotos();
    delete photos[characterId];
    localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(photos));
    window.dispatchEvent(new CustomEvent('newscaster-photo-updated', { detail: { characterId, photoDataUrl: null } }));
  } catch (e) {
    console.error('Failed to remove newscaster photo:', e);
  }
}
