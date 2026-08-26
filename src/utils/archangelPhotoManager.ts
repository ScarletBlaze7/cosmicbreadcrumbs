/**
 * Archangel Custom Photo Manager
 * Handles local persistence, canvas compression, and real-time synchronization
 * for user-assigned Archangel photos across all views and cards.
 */

export const EVENT_ARCHANGEL_PHOTO_UPDATED = 'auranova_archangel_photo_updated';

// Mapping helper to standardize Archangel keys
export function normalizeArchangelKey(name: string): string {
  const clean = (name || '')
    .toLowerCase()
    .replace(/^archangel\s+/i, '')
    .replace(/^arch-angel\s+/i, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
  return clean || 'unknown';
}

// Backward-compatible individual keys
const LEGACY_KEY_MAP: Record<string, string> = {
  michael: 'archangel_michael_custom_photo',
  gabriel: 'archangel_gabriel_custom_photo',
  raphael: 'archangel_raphael_custom_photo',
  uriel: 'archangel_uriel_custom_photo',
  chamuel: 'archangel_chamuel_custom_photo',
};

export function getArchangelStorageKey(name: string): string {
  const norm = normalizeArchangelKey(name);
  if (LEGACY_KEY_MAP[norm]) {
    return LEGACY_KEY_MAP[norm];
  }
  return `archangel_${norm}_custom_photo`;
}

/**
 * Retrieve custom photo for a given Archangel (if set)
 */
export function getArchangelPhoto(name: string): string | null {
  if (!name) return null;
  const norm = normalizeArchangelKey(name);

  // Check legacy key first
  if (LEGACY_KEY_MAP[norm]) {
    try {
      const legacyVal = localStorage.getItem(LEGACY_KEY_MAP[norm]);
      if (legacyVal) return legacyVal;
    } catch {}
  }

  // Check standardized key
  const stdKey = `archangel_${norm}_custom_photo`;
  try {
    const val = localStorage.getItem(stdKey);
    if (val) return val;
  } catch {}

  return null;
}

/**
 * Check if a custom photo has been assigned
 */
export function hasCustomArchangelPhoto(name: string): boolean {
  return getArchangelPhoto(name) !== null;
}

/**
 * Save custom photo for an Archangel
 */
export function setArchangelPhoto(name: string, photoDataUrl: string): boolean {
  if (!name || !photoDataUrl) return false;
  const norm = normalizeArchangelKey(name);
  const key = getArchangelStorageKey(norm);

  try {
    localStorage.setItem(key, photoDataUrl);
    // Also save in legacy key if applicable for double compatibility
    if (LEGACY_KEY_MAP[norm] && key !== LEGACY_KEY_MAP[norm]) {
      localStorage.setItem(LEGACY_KEY_MAP[norm], photoDataUrl);
    }

    // Dispatch global event for immediate reactive updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(EVENT_ARCHANGEL_PHOTO_UPDATED, {
          detail: { archangel: name, key, photoDataUrl },
        })
      );
      window.dispatchEvent(new Event('storage'));
    }
    return true;
  } catch (err) {
    console.error('Failed to save Archangel photo to localStorage:', err);
    return false;
  }
}

/**
 * Remove / reset custom photo for an Archangel
 */
export function removeArchangelPhoto(name: string): void {
  if (!name) return;
  const norm = normalizeArchangelKey(name);
  const key = getArchangelStorageKey(norm);

  try {
    localStorage.removeItem(key);
    if (LEGACY_KEY_MAP[norm]) {
      localStorage.removeItem(LEGACY_KEY_MAP[norm]);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(EVENT_ARCHANGEL_PHOTO_UPDATED, {
          detail: { archangel: name, key, photoDataUrl: null },
        })
      );
      window.dispatchEvent(new Event('storage'));
    }
  } catch (err) {
    console.error('Failed to remove Archangel photo:', err);
  }
}

/**
 * Get map of all assigned Archangel photos
 */
export function getAllArchangelPhotos(rosterNames: string[]): Record<string, string | null> {
  const result: Record<string, string | null> = {};
  for (const name of rosterNames) {
    result[name] = getArchangelPhoto(name);
  }
  return result;
}

/**
 * Compress an image file using an offscreen canvas so that
 * high-resolution camera photos fit comfortably in local storage.
 */
export function compressImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
