export interface PermissionStatus {
  location: 'granted' | 'denied' | 'prompt' | 'unsupported';
  notification: 'granted' | 'denied' | 'prompt' | 'unsupported';
  hasAsked: boolean;
  latitude?: number;
  longitude?: number;
}

const PERMISSION_STORAGE_KEY = 'cosmic_permissions_status';

export function getStoredPermissions(): PermissionStatus {
  if (typeof window === 'undefined') {
    return { location: 'prompt', notification: 'prompt', hasAsked: false };
  }

  try {
    const saved = localStorage.getItem(PERMISSION_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}

  return {
    location: typeof navigator !== 'undefined' && 'geolocation' in navigator ? 'prompt' : 'unsupported',
    notification: typeof window !== 'undefined' && 'Notification' in window ? 'prompt' : 'unsupported',
    hasAsked: false,
  };
}

export function savePermissions(status: PermissionStatus): void {
  try {
    localStorage.setItem(PERMISSION_STORAGE_KEY, JSON.stringify(status));
  } catch (e) {}
}

export async function requestLocationPermission(): Promise<{ granted: boolean; lat?: number; lon?: number }> {
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    return { granted: false };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const current = getStoredPermissions();
        const updated: PermissionStatus = {
          ...current,
          location: 'granted',
          hasAsked: true,
          latitude: lat,
          longitude: lon,
        };
        savePermissions(updated);
        resolve({ granted: true, lat, lon });
      },
      (error) => {
        console.warn('Geolocation permission declined:', error.message);
        const current = getStoredPermissions();
        const updated: PermissionStatus = {
          ...current,
          location: 'denied',
          hasAsked: true,
        };
        savePermissions(updated);
        resolve({ granted: false });
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  try {
    const result = await Notification.requestPermission();
    const current = getStoredPermissions();
    const updated: PermissionStatus = {
      ...current,
      notification: result === 'granted' ? 'granted' : 'denied',
      hasAsked: true,
    };
    savePermissions(updated);

    if (result === 'granted') {
      try {
        new Notification('✨ Cosmic Breadcrumbs Aligned', {
          body: 'Your celestial connection is active. You will receive daily guidance and midnight transit updates.',
          icon: '/assets/logo.png',
        });
      } catch (e) {}
    }

    return result === 'granted';
  } catch (e) {
    console.error('Failed to request notifications:', e);
    return false;
  }
}
