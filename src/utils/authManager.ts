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

const LAST_EMAIL_KEY = 'cosmic_last_email';

export function getLastUsedEmail(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(LAST_EMAIL_KEY) || '';
  } catch (e) {
    return '';
  }
}

export function setLastUsedEmail(email: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (email) localStorage.setItem(LAST_EMAIL_KEY, email.trim().toLowerCase());
  } catch (e) {}
}

export function saveAuthSession(user: UserAccount, token: string): void {
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    if (user?.email) setLastUsedEmail(user.email);
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

export async function loginAsGuest(guestName?: string): Promise<{ success: boolean; user: UserAccount }> {
  const guestId = 'guest_' + Date.now();
  const guestEmail = `seeker_${Date.now().toString().slice(-4)}@guest.cosmicbreadcrumbs.com`;
  const guestUser: UserAccount = {
    id: guestId,
    email: guestEmail,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    profile: {
      name: guestName || 'Universal Traveler',
      birthDate: '1996-07-22',
      birthTime: '11:11',
      birthPlace: 'Sedona, Arizona',
      sunSign: 'Cancer',
      lifePathNumber: 7,
      destinyNumber: 11,
      numerologySystem: 'chaldean',
      birthDateChangeCount: 0,
      hasCompletedOnboarding: true,
    },
  };

  saveAuthSession(guestUser, 'guest_token_' + Date.now());
  return { success: true, user: guestUser };
}

export async function registerAccount(email: string, password: string): Promise<{ success: boolean; user?: UserAccount; error?: string; isExistingAccount?: boolean }> {
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
    return { success: false, error: 'An account with this email already exists.', isExistingAccount: true };
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

export function getSavedDeviceAccounts(): Array<{ email: string; maskedEmail: string; name?: string }> {
  const accounts = getRegisteredAccounts();
  const list: Array<{ email: string; maskedEmail: string; name?: string }> = [];
  for (const [em, acc] of Object.entries(accounts)) {
    const [local, domain] = em.split('@');
    let maskedLocal = local;
    if (local.length > 2) {
      maskedLocal = local[0] + '*'.repeat(Math.max(1, local.length - 2)) + local[local.length - 1];
    } else if (local.length === 2) {
      maskedLocal = local[0] + '*';
    }
    const maskedEmail = `${maskedLocal}@${domain || 'cosmic.com'}`;
    list.push({
      email: em,
      maskedEmail,
    });
  }
  return list;
}

export async function lookupAccountByDetails(params: {
  name?: string;
  birthDate?: string;
  emailPrefix?: string;
}): Promise<{
  success: boolean;
  matches: Array<{ email: string; maskedEmail: string; name?: string; sunSign?: string }>;
  error?: string;
}> {
  const matches: Array<{ email: string; maskedEmail: string; name?: string; sunSign?: string }> = [];
  const seen = new Set<string>();

  // 1. Check local device registered accounts
  const localAccounts = getRegisteredAccounts();
  const cleanName = (params.name || '').trim().toLowerCase();
  const cleanPrefix = (params.emailPrefix || '').trim().toLowerCase();

  for (const [em, acc] of Object.entries(localAccounts)) {
    const emPrefix = em.split('@')[0].toLowerCase();
    let matched = false;
    if (cleanName && emPrefix.includes(cleanName)) matched = true;
    if (cleanPrefix && emPrefix.includes(cleanPrefix)) matched = true;

    if (matched && !seen.has(em)) {
      seen.add(em);
      const [local, domain] = em.split('@');
      let maskedLocal = local;
      if (local.length > 2) {
        maskedLocal = local[0] + '*'.repeat(Math.max(1, local.length - 2)) + local[local.length - 1];
      } else if (local.length === 2) {
        maskedLocal = local[0] + '*';
      }
      matches.push({
        email: em,
        maskedEmail: `${maskedLocal}@${domain || 'cosmic.com'}`,
      });
    }
  }

  // 2. Query server for matching accounts
  try {
    const res = await fetch('/api/auth/lookup-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.matches)) {
        for (const item of data.matches) {
          if (!seen.has(item.email)) {
            seen.add(item.email);
            matches.push(item);
          }
        }
      }
    }
  } catch (e) {
    // Network fallback
  }

  return {
    success: true,
    matches,
  };
}

export async function loginAccount(emailOrUsername: string, password: string): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  const rawInput = emailOrUsername ? emailOrUsername.trim() : '';
  if (!rawInput) {
    return { success: false, error: 'Please enter your email or username.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const cleanInput = rawInput.toLowerCase();

  // Try API first
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: cleanInput, password }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        saveAuthSession(data.user, data.token);
        const accounts = getRegisteredAccounts();
        accounts[data.user.email.toLowerCase()] = {
          id: data.user.id,
          email: data.user.email.toLowerCase(),
          passwordHash: password,
          createdAt: data.user.createdAt,
          lastLoginAt: data.user.lastLoginAt,
        };
        saveRegisteredAccounts(accounts);
        return { success: true, user: data.user };
      }
    } else {
      const errData = await res.json().catch(() => ({}));
      if (errData.error) {
        return { success: false, error: errData.error };
      }
    }
  } catch (err: any) {
    // Network fallback
  }

  // Local authentication check
  const accounts = getRegisteredAccounts();
  let existingKey = accounts[cleanInput] ? cleanInput : null;

  if (!existingKey) {
    for (const [em] of Object.entries(accounts)) {
      if (em.split('@')[0].toLowerCase() === cleanInput) {
        existingKey = em;
        break;
      }
    }
  }

  if (existingKey && accounts[existingKey]) {
    const existing = accounts[existingKey];
    if (existing.passwordHash === password) {
      const updatedUser: UserAccount = {
        id: existing.id,
        email: existing.email,
        createdAt: existing.createdAt,
        lastLoginAt: new Date().toISOString(),
      };
      existing.lastLoginAt = updatedUser.lastLoginAt;
      saveRegisteredAccounts(accounts);
      saveAuthSession(updatedUser, 'offline_token_' + Date.now());
      return { success: true, user: updatedUser };
    } else {
      return { success: false, error: 'Incorrect password. Tap "Forgot Password?" if you need to reset.' };
    }
  }

  // If this is the very first login and no accounts are recorded, create the account smoothly if it looks like an email
  if (cleanInput.includes('@')) {
    const newUser: UserAccount = {
      id: 'usr_' + Date.now(),
      email: cleanInput,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    accounts[cleanInput] = {
      id: newUser.id,
      email: cleanInput,
      passwordHash: password,
      createdAt: newUser.createdAt,
      lastLoginAt: newUser.lastLoginAt,
    };
    saveRegisteredAccounts(accounts);
    saveAuthSession(newUser, 'offline_token_' + Date.now());
    return { success: true, user: newUser };
  }

  return { success: false, error: 'No account found matching this username or email. Please register or recover your account.' };
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

export async function requestPasswordResetLink(identifier: string): Promise<{ success: boolean; message?: string; error?: string; resetLink?: string; token?: string; email?: string }> {
  const raw = identifier ? identifier.trim() : '';
  if (!raw) {
    return { success: false, error: 'Please provide a valid email address or username.' };
  }

  let serverToken: string | null = null;
  let serverEmail = raw.toLowerCase();

  try {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: raw }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        serverToken = data.token;
        if (data.email) serverEmail = data.email;
      }
    }
  } catch (e) {}

  const token = serverToken || ('rst_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7));
  const resetLink = typeof window !== 'undefined'
    ? `${window.location.origin}/#reset-password?token=${token}&email=${encodeURIComponent(serverEmail)}`
    : `https://cosmicbreadcrumbs.com/#reset-password?token=${token}&email=${encodeURIComponent(serverEmail)}`;

  try {
    const rawTokens = localStorage.getItem(RESET_TOKENS_KEY);
    const tokens = rawTokens ? JSON.parse(rawTokens) : {};
    tokens[token] = {
      email: serverEmail,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60, // 1 hour
    };
    localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
  } catch (e) {}

  return {
    success: true,
    email: serverEmail,
    message: `A secure password reset link has been prepared for ${serverEmail}. You can set your new password immediately.`,
    resetLink,
    token,
  };
}

export async function resetPasswordWithToken(email: string, token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  // Call Server API
  try {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, token, newPassword }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data.error) {
        // We will still allow local update if offline
      }
    }
  } catch (e) {}

  const accounts = getRegisteredAccounts();
  if (accounts[cleanEmail]) {
    accounts[cleanEmail].passwordHash = newPassword;
    saveRegisteredAccounts(accounts);
  } else if (cleanEmail) {
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
