// Robust IndexedDB storage for large video files (supports 100MB+ videos without localStorage limits)

const DB_NAME = 'CosmicBreadcrumbsMediaDB';
const STORE_NAME = 'mediaStore';
const VIDEO_KEY = 'main_title_video';

function openDB(): Promise<IDBDatabase> {
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

export async function saveMainVideo(file: File | Blob): Promise<string> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const putReq = store.put(file, VIDEO_KEY);
    putReq.onsuccess = () => {
      const url = URL.createObjectURL(file);
      // Notify other components
      window.dispatchEvent(new Event('cosmic-video-title-updated'));
      resolve(url);
    };
    putReq.onerror = () => reject(putReq.error);
  });
}

export async function getMainVideoUrl(): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(VIDEO_KEY);
      getReq.onsuccess = () => {
        const result = getReq.result;
        if (result instanceof Blob || result instanceof File) {
          const url = URL.createObjectURL(result);
          resolve(url);
        } else if (typeof result === 'string') {
          resolve(result);
        } else {
          // Check fallback localStorage
          const localFallback = localStorage.getItem('cosmic_breadcrumbs_main_video_title');
          resolve(localFallback || null);
        }
      };
      getReq.onerror = () => {
        const localFallback = localStorage.getItem('cosmic_breadcrumbs_main_video_title');
        resolve(localFallback || null);
      };
    });
  } catch (e) {
    const localFallback = localStorage.getItem('cosmic_breadcrumbs_main_video_title');
    return localFallback || null;
  }
}

export async function clearMainVideo(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(VIDEO_KEY);
    localStorage.removeItem('cosmic_breadcrumbs_main_video_title');
    window.dispatchEvent(new Event('cosmic-video-title-updated'));
  } catch (e) {
    localStorage.removeItem('cosmic_breadcrumbs_main_video_title');
    window.dispatchEvent(new Event('cosmic-video-title-updated'));
  }
}
