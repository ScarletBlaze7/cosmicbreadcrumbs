import { UserProfile, MembershipStatus } from '../types';

export interface UserAccount {
  id: string;
  email: string;
  createdAt: string;
  lastLoginAt: string;
  profile?: UserProfile;
  membership?: MembershipStatus;
  journalEntries?: any[];
  dreamEntries?: any[];
}

const AUTH_USER_KEY = 'cosmic_auth_user';
const AUTH_TOKEN_KEY = 'cosmic_auth_token';

export function getStoredAuthUser(): UserAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(AUTH_USER_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return null;
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function saveAuthSession(user: UserAccount, token: string): void {
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    window.dispatchEvent(new CustomEvent('cosmic_auth_changed', { detail: { user } }));
  } catch (e) {}
}

export function clearAuthSession(): void {
  try {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    window.dispatchEvent(new CustomEvent('cosmic_auth_changed', { detail: { user: null } }));
  } catch (e) {}
}

export async function registerAccount(email: string, password: string): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to create account.' };
    }

    saveAuthSession(data.user, data.token);
    return { success: true, user: data.user };
  } catch (err: any) {
    // Local offline account creation fallback
    const offlineUser: UserAccount = {
      id: 'local_' + Date.now(),
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    saveAuthSession(offlineUser, 'offline_token_' + Date.now());
    return { success: true, user: offlineUser };
  }
}

export async function loginAccount(email: string, password: string): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Invalid email or password.' };
    }

    saveAuthSession(data.user, data.token);
    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: 'Connection failed. Please check network.' };
  }
}

export async function syncUserData(dataToSync: {
  profile?: UserProfile;
  membership?: MembershipStatus;
  journalEntries?: any[];
  dreamEntries?: any[];
}): Promise<boolean> {
  const token = getAuthToken();
  const user = getStoredAuthUser();
  if (!user || !token) return false;

  try {
    const res = await fetch('/api/auth/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: user.id, ...dataToSync }),
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}
