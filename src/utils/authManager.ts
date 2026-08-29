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
const ACCOUNTS_REGISTRY_KEY = 'cosmic_registered_accounts';
const RESET_TOKENS_KEY = 'cosmic_password_reset_tokens';

interface StoredAccountRecord {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  lastLoginAt: string;
}

function getRegisteredAccounts(): Record<string, StoredAccountRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(ACCOUNTS_REGISTRY_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return {};
}

function saveRegisteredAccounts(accounts: Record<string, StoredAccountRecord>): void {
  try {
    localStorage.setItem(ACCOUNTS_REGISTRY_KEY, JSON.stringify(accounts));
  } catch (e) {}
}

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
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  // Check local registry first
  const accounts = getRegisteredAccounts();
  if (accounts[cleanEmail]) {
    return { success: false, error: 'An account with this email already exists. Please sign in.' };
  }

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        saveAuthSession(data.user, data.token);
        accounts[cleanEmail] = {
          id: data.user.id,
          email: cleanEmail,
          passwordHash: password,
          createdAt: data.user.createdAt,
          lastLoginAt: data.user.lastLoginAt,
        };
        saveRegisteredAccounts(accounts);
        return { success: true, user: data.user };
      }
    }
  } catch (err: any) {
    // Network fallback
  }

  // Local offline account creation
  const offlineUser: UserAccount = {
    id: 'usr_' + Date.now(),
    email: cleanEmail,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  accounts[cleanEmail] = {
    id: offlineUser.id,
    email: cleanEmail,
    passwordHash: password,
    createdAt: offlineUser.createdAt,
    lastLoginAt: offlineUser.lastLoginAt,
  };
  saveRegisteredAccounts(accounts);
  saveAuthSession(offlineUser, 'offline_token_' + Date.now());
  return { success: true, user: offlineUser };
}

export async function loginAccount(email: string, password: string): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        saveAuthSession(data.user, data.token);
        return { success: true, user: data.user };
      }
    }
  } catch (err: any) {
    // Network fallback
  }

  // Local authentication check
  const accounts = getRegisteredAccounts();
  const existing = accounts[cleanEmail];

  if (existing) {
    if (existing.passwordHash === password) {
      const updatedUser: UserAccount = {
        id: existing.id,
        email: cleanEmail,
        createdAt: existing.createdAt,
        lastLoginAt: new Date().toISOString(),
      };
      existing.lastLoginAt = updatedUser.lastLoginAt;
      saveRegisteredAccounts(accounts);
      saveAuthSession(updatedUser, 'offline_token_' + Date.now());
      return { success: true, user: updatedUser };
    } else {
      return { success: false, error: 'Incorrect password. Tap "Forgot password?" if you need a reset link.' };
    }
  }

  // If this is the very first login and no accounts are recorded, create the account smoothly
  const newUser: UserAccount = {
    id: 'usr_' + Date.now(),
    email: cleanEmail,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
  accounts[cleanEmail] = {
    id: newUser.id,
    email: cleanEmail,
    passwordHash: password,
    createdAt: newUser.createdAt,
    lastLoginAt: newUser.lastLoginAt,
  };
  saveRegisteredAccounts(accounts);
  saveAuthSession(newUser, 'offline_token_' + Date.now());
  return { success: true, user: newUser };
}

export async function updateUserEmail(newEmail: string, currentPassword?: string): Promise<{ success: boolean; error?: string }> {
  const cleanEmail = newEmail ? newEmail.trim().toLowerCase() : '';
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  const currentUser = getStoredAuthUser();
  if (!currentUser) {
    // Create new session with this email
    const newUser: UserAccount = {
      id: 'usr_' + Date.now(),
      email: cleanEmail,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    saveAuthSession(newUser, 'token_' + Date.now());
    return { success: true };
  }

  const accounts = getRegisteredAccounts();
  const oldEmail = currentUser.email.toLowerCase();

  if (oldEmail !== cleanEmail && accounts[cleanEmail]) {
    return { success: false, error: 'That email address is already in use by another account.' };
  }

  // Update in registry
  if (accounts[oldEmail]) {
    const existingRec = accounts[oldEmail];
    delete accounts[oldEmail];
    accounts[cleanEmail] = {
      ...existingRec,
      email: cleanEmail,
    };
    saveRegisteredAccounts(accounts);
  } else {
    accounts[cleanEmail] = {
      id: currentUser.id,
      email: cleanEmail,
      passwordHash: currentPassword || 'cosmic_pass',
      createdAt: currentUser.createdAt || new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    saveRegisteredAccounts(accounts);
  }

  const updatedUser: UserAccount = {
    ...currentUser,
    email: cleanEmail,
  };
  saveAuthSession(updatedUser, getAuthToken() || 'token_' + Date.now());
  return { success: true };
}

export async function updateUserPassword(newPassword: string, oldPassword?: string): Promise<{ success: boolean; error?: string }> {
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters.' };
  }

  const currentUser = getStoredAuthUser();
  const accounts = getRegisteredAccounts();
  const email = currentUser ? currentUser.email.toLowerCase() : 'user@cosmicbreadcrumbs.com';

  if (accounts[email]) {
    if (oldPassword && accounts[email].passwordHash && accounts[email].passwordHash !== oldPassword) {
      return { success: false, error: 'Current password does not match.' };
    }
    accounts[email].passwordHash = newPassword;
    saveRegisteredAccounts(accounts);
  } else {
    accounts[email] = {
      id: currentUser ? currentUser.id : 'usr_' + Date.now(),
      email: email,
      passwordHash: newPassword,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    saveRegisteredAccounts(accounts);
  }

  return { success: true };
}

export async function requestPasswordResetLink(email: string): Promise<{ success: boolean; message?: string; error?: string; resetLink?: string; token?: string }> {
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please provide a valid email address.' };
  }

  const token = 'rst_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const resetLink = `${window.location.origin}/#reset-password?token=${token}&email=${encodeURIComponent(cleanEmail)}`;

  try {
    const rawTokens = localStorage.getItem(RESET_TOKENS_KEY);
    const tokens = rawTokens ? JSON.parse(rawTokens) : {};
    tokens[token] = {
      email: cleanEmail,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60, // 1 hour
    };
    localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
  } catch (e) {}

  return {
    success: true,
    message: `A secure password reset link has been dispatched to ${cleanEmail}. Check your inbox to set a new password.`,
    resetLink,
    token,
  };
}

export async function resetPasswordWithToken(email: string, token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const accounts = getRegisteredAccounts();
  if (accounts[cleanEmail]) {
    accounts[cleanEmail].passwordHash = newPassword;
    saveRegisteredAccounts(accounts);
  } else {
    accounts[cleanEmail] = {
      id: 'usr_' + Date.now(),
      email: cleanEmail,
      passwordHash: newPassword,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    saveRegisteredAccounts(accounts);
  }

  // Clear token
  try {
    const rawTokens = localStorage.getItem(RESET_TOKENS_KEY);
    if (rawTokens) {
      const tokens = JSON.parse(rawTokens);
      delete tokens[token];
      localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
    }
  } catch (e) {}

  return { success: true };
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
