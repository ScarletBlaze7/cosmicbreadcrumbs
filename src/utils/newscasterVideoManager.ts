// Robust IndexedDB storage for Newscaster Animated Video Clips (Dr. Samson, Celeste Blaze, Calvin, Satori, Lucas, Luna)

const DB_NAME = 'CosmicBreadcrumbsNewscasterVideoDB';
const STORE_NAME = 'newscasterVideos';

function openNewscasterVideoDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// In-memory cache of object URLs to prevent memory leaks and provide instant access
const objectUrlCache: Record<string, string> = {};

export async function saveNewscasterVideo(anchorId: string, file: File | Blob): Promise<string> {
  const db = await openNewscasterVideoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const putReq = store.put(file, `video_${anchorId}`);

    putReq.onsuccess = () => {
      // Revoke prior URL if cached
      if (objectUrlCache[anchorId]) {
        try {
          URL.revokeObjectURL(objectUrlCache[anchorId]);
        } catch (e) {}
      }
      const newUrl = URL.createObjectURL(file);
      objectUrlCache[anchorId] = newUrl;

      // Broadcast update event to sync all views
      window.dispatchEvent(
        new CustomEvent('newscaster-video-updated', {
          detail: { anchorId, videoUrl: newUrl },
        })
      );
      resolve(newUrl);
    };

    putReq.onerror = () => reject(putReq.error);
  });
}

export async function getNewscasterVideoUrl(anchorId: string, fallbackUrl?: string): Promise<string | null> {
  if (objectUrlCache[anchorId]) {
    return objectUrlCache[anchorId];
  }

  try {
    const db = await openNewscasterVideoDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(`video_${anchorId}`);

      getReq.onsuccess = () => {
        const result = getReq.result;
        if (result instanceof Blob || result instanceof File) {
          const url = URL.createObjectURL(result);
          objectUrlCache[anchorId] = url;
          resolve(url);
        } else if (typeof result === 'string') {
          resolve(result);
        } else {
          resolve(fallbackUrl || null);
        }
      };

      getReq.onerror = () => {
        resolve(fallbackUrl || null);
      };
    });
  } catch (e) {
    return fallbackUrl || null;
  }
}

export async function removeNewscasterVideo(anchorId: string): Promise<void> {
  try {
    if (objectUrlCache[anchorId]) {
      try {
        URL.revokeObjectURL(objectUrlCache[anchorId]);
      } catch (e) {}
      delete objectUrlCache[anchorId];
    }
    const db = await openNewscasterVideoDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(`video_${anchorId}`);
    window.dispatchEvent(
      new CustomEvent('newscaster-video-updated', {
        detail: { anchorId, videoUrl: null },
      })
    );
  } catch (e) {
    console.error('Failed to remove newscaster video:', e);
  }
}
