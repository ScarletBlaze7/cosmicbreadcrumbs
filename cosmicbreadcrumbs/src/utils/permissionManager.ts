import { UserLocation, AppPermissionsState } from '../types';

const STORAGE_KEY_PERMISSIONS = 'cosmic_permissions_state';
const STORAGE_KEY_LOCATION = 'cosmic_user_location';

/**
 * Checks current notification permission state
 */
export function getNotificationPermissionStatus(): 'granted' | 'denied' | 'prompt' | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return 'prompt';
}

/**
 * Requests Notification permission from the browser/device
 */
export async function requestNotificationPermission(): Promise<'granted' | 'denied' | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  try {
    const result = await Notification.requestPermission();
    savePermissionsState({ notifications: result as 'granted' | 'denied' | 'prompt' });

    if (result === 'granted') {
      sendCelestialNotification(
        '✨ Cosmic Breadcrumbs Sanctuary Activated',
        'Daily midnight Tarot resets and NASA transit alerts are now active for your coordinates.'
      );
    }
    return result as 'granted' | 'denied';
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
}

/**
 * Approximate City/Region lookup from coordinates
 */
async function reverseGeocodeCoords(lat: number, lon: number): Promise<{ city?: string; region?: string; country?: string }> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`, {
      headers: { 'Accept-Language': 'en' },
    });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || '';
      const region = addr.state || addr.province || addr.region || '';
      const country = addr.country || '';
      return { city, region, country };
    }
  } catch (e) {
    // Fallback gracefully
  }

  // Fallback using timezone inference
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  const tzParts = tz.split('/');
  const fallbackCity = tzParts.length > 1 ? tzParts[1].replace(/_/g, ' ') : '';

  return { city: fallbackCity, region: '', country: '' };
}

/**
 * Requests Geolocation permission and captures coordinates
 */
export function requestLocationPermission(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      const fallbackLoc: UserLocation = {
        latitude: 34.8697,
        longitude: -111.7610,
        city: 'Sedona',
        region: 'Arizona',
        country: 'USA',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        detectedAt: new Date().toISOString(),
      };
      savePermissionsState({ location: 'unsupported' });
      resolve(fallbackLoc);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const geoInfo = await reverseGeocodeCoords(latitude, longitude);
        
        const loc: UserLocation = {
          latitude: Number(latitude.toFixed(4)),
          longitude: Number(longitude.toFixed(4)),
          city: geoInfo.city || 'Sedona',
          region: geoInfo.region || 'Arizona',
          country: geoInfo.country || 'USA',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          detectedAt: new Date().toISOString(),
          accuracy: accuracy ? Math.round(accuracy) : undefined,
        };

        saveStoredLocation(loc);
        savePermissionsState({ location: 'granted' });
        resolve(loc);
      },
      (error) => {
        console.warn('Geolocation access denied or error:', error.message);
        savePermissionsState({ location: 'denied' });
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000, // 10 minutes cache
      }
    );
  });
}

/**
 * Sends a native / browser notification with cosmic breadcrumbs branding
 */
export function sendCelestialNotification(title: string, body: string, icon: string = '/assets/logo.png') {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    const notification = new Notification(title, {
      body,
      icon,
      badge: icon,
      tag: 'cosmic-breadcrumbs-alert',
      vibrate: [200, 100, 200] as any,
    } as NotificationOptions);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (err) {
    console.warn('Native notification dispatch failed:', err);
  }
}

/**
 * Saves permission state in localStorage
 */
export function savePermissionsState(partial: Partial<AppPermissionsState>) {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredPermissionsState();
    const updated: AppPermissionsState = {
      ...current,
      ...partial,
      hasRequestedPermissions: true,
      lastPromptedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY_PERMISSIONS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('cosmic-permissions-updated', { detail: updated }));
  } catch (e) {}
}

/**
 * Retrieves permission state from localStorage
 */
export function getStoredPermissionsState(): AppPermissionsState {
  if (typeof window === 'undefined') {
    return {
      notifications: 'unsupported',
      location: 'unsupported',
      hasRequestedPermissions: false,
    };
  }

  const notifStatus = getNotificationPermissionStatus();

  try {
    const saved = localStorage.getItem(STORAGE_KEY_PERMISSIONS);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        notifications: notifStatus,
      };
    }
  } catch (e) {}

  return {
    notifications: notifStatus,
    location: 'prompt',
    hasRequestedPermissions: false,
  };
}

/**
 * Saves detected location
 */
export function saveStoredLocation(location: UserLocation) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify(location));
    window.dispatchEvent(new CustomEvent('cosmic-location-updated', { detail: location }));
  } catch (e) {}
}

/**
 * Retrieves stored location
 */
export function getStoredLocation(): UserLocation | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LOCATION);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  return null;
}

/**
 * Background Service to schedule daily midnight reset & morning alignment reminders
 */
let isServiceRunning = false;
export function initCelestialNotificationService() {
  if (typeof window === 'undefined' || isServiceRunning) return;
  isServiceRunning = true;

  // Check every 60 seconds
  setInterval(() => {
    if (Notification.permission !== 'granted') return;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Midnight Tarot & Astrological Reset alert (00:00 - 00:01)
    const lastMidnightNotif = localStorage.getItem('last_midnight_notif_date');
    const todayStr = now.toISOString().split('T')[0];

    if (hours === 0 && minutes === 0 && lastMidnightNotif !== todayStr) {
      localStorage.setItem('last_midnight_notif_date', todayStr);
      sendCelestialNotification(
        '🃏 Sacred Midnight Reset: Daily Tarot & Oracle Ready',
        'A fresh calendar day has arrived. Draw your daily card of the day and inspect tonight\'s astrological planetary transits.'
      );
    }

    // Morning Guidance Alert at 08:00 AM
    const lastMorningNotif = localStorage.getItem('last_morning_notif_date');
    if (hours === 8 && minutes === 0 && lastMorningNotif !== todayStr) {
      localStorage.setItem('last_morning_notif_date', todayStr);
      sendCelestialNotification(
        '☀️ Morning Cosmic Alignment: Daily Horoscope & Angel Guidance',
        'Your personalized daily horoscope and Archangel frequency are aligned for your day ahead.'
      );
    }
  }, 60000);
}
