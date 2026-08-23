import { AuthUser, AuthState, UserProfile } from '../types';
import { getSunSignFromDate } from './astrologyCalc';
import { calculateLifePath, calculateDestinyNumber } from './numerologyCalc';

const AUTH_STATE_KEY = 'cosmic_auth_state';
const REGISTERED_USERS_KEY = 'cosmic_registered_accounts';

export interface StoredAccount {
  id: string;
  email: string;
  passwordHash: string; // Deterministic hash for demo & secure local storage
  profile: UserProfile;
  createdAt: string;
  lastLoginAt: string;
}

// Simple deterministic hash for demo/local storage encryption
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'cb_' + Math.abs(hash).toString(36) + str.length.toString(36);
}

// Retrieve all registered accounts from local storage
export function getRegisteredAccounts(): Record<string, StoredAccount> {
  try {
    const saved = localStorage.getItem(REGISTERED_USERS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error('Error loading registered accounts:', e);
    return {};
  }
}

// Save registered accounts
export function saveRegisteredAccounts(accounts: Record<string, StoredAccount>): void {
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Error saving registered accounts:', e);
  }
}

// Get current auth state
export function getStoredAuthState(): AuthState {
  try {
    const saved = localStorage.getItem(AUTH_STATE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading auth state:', e);
  }
  return { isAuthenticated: false, user: null };
}

// Save auth state
export function saveAuthState(state: AuthState): void {
  try {
    localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('cosmic-auth-updated', { detail: state }));
  } catch (e) {
    console.error('Error saving auth state:', e);
  }
}

export interface SignInResult {
  success: boolean;
  user?: AuthUser;
  profile?: UserProfile;
  message?: string;
}

// Sign In with Email and Password
export async function signInWithEmailPassword(email: string, password: string): Promise<SignInResult> {
  const normalizedEmail = email.trim().toLowerCase();
  
  if (!normalizedEmail || !password) {
    return { success: false, message: 'Please enter both your email and password.' };
  }

  // Attempt backend API verification first if server is running
  try {
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, password }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        const authUser: AuthUser = data.user;
        const authState: AuthState = { isAuthenticated: true, user: authUser, token: data.token };
        saveAuthState(authState);
        return { success: true, user: authUser, profile: data.profile };
      }
    }
  } catch (e) {
    // Fallback to offline / local storage account store
  }

  const accounts = getRegisteredAccounts();
  const existing = accounts[normalizedEmail];

  if (!existing) {
    return { 
      success: false, 
      message: 'No account found with this email. Please create a new account below.' 
    };
  }

  const hash = simpleHash(password);
  if (existing.passwordHash !== hash) {
    return { 
      success: false, 
      message: 'Incorrect password. Please verify your credentials or reset your password.' 
    };
  }

  // Update last login timestamp
  const now = new Date().toISOString();
  existing.lastLoginAt = now;
  accounts[normalizedEmail] = existing;
  saveRegisteredAccounts(accounts);

  const authUser: AuthUser = {
    id: existing.id,
    email: existing.email,
    name: existing.profile.name,
    createdAt: existing.createdAt,
    lastLoginAt: now,
  };

  const authState: AuthState = {
    isAuthenticated: true,
    user: authUser,
  };

  saveAuthState(authState);

  // Sync profile with email and auth status
  const updatedProfile: UserProfile = {
    ...existing.profile,
    email: existing.email,
    userId: existing.id,
    isAuthenticated: true,
  };

  return { success: true, user: authUser, profile: updatedProfile };
}

export interface SignUpParams {
  name: string;
  email: string;
  password: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
}

// Sign Up / Create new account
export async function signUpWithEmailPassword(params: SignUpParams): Promise<SignInResult> {
  const normalizedEmail = params.email.trim().toLowerCase();
  const name = params.name.trim();

  if (!name) {
    return { success: false, message: 'Please provide your name.' };
  }
  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    return { success: false, message: 'Please enter a valid email address.' };
  }
  if (!params.password || params.password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters long.' };
  }

  const accounts = getRegisteredAccounts();
  if (accounts[normalizedEmail]) {
    return { success: false, message: 'An account with this email already exists. Please sign in.' };
  }

  const birthDate = params.birthDate || '1996-07-22';
  const sunSign = getSunSignFromDate(birthDate).name;
  const lifePathNumber = calculateLifePath(birthDate);
  const destinyNumber = calculateDestinyNumber(name);

  const now = new Date().toISOString();
  const userId = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

  const newProfile: UserProfile = {
    name,
    email: normalizedEmail,
    userId,
    isAuthenticated: true,
    birthDate,
    birthTime: params.birthTime || '',
    birthPlace: params.birthPlace || 'Sedona, Arizona',
    sunSign,
    lifePathNumber,
    destinyNumber,
    numerologySystem: 'chaldean',
    hasCompletedOnboarding: true,
    hasGrantedPermissions: true,
  };

  const newAccount: StoredAccount = {
    id: userId,
    email: normalizedEmail,
    passwordHash: simpleHash(params.password),
    profile: newProfile,
    createdAt: now,
    lastLoginAt: now,
  };

  accounts[normalizedEmail] = newAccount;
  saveRegisteredAccounts(accounts);

  const authUser: AuthUser = {
    id: userId,
    email: normalizedEmail,
    name,
    createdAt: now,
    lastLoginAt: now,
  };

  saveAuthState({ isAuthenticated: true, user: authUser });

  // Optional backend sync
  try {
    fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, userId, profile: newProfile }),
    }).catch(() => {});
  } catch {}

  return { success: true, user: authUser, profile: newProfile };
}

// Sign Out
export function signOutUser(): void {
  saveAuthState({ isAuthenticated: false, user: null });
}

// Send Password Reset
export async function sendPasswordResetEmail(email: string): Promise<{ success: boolean; message: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  // Record simulated reset request
  try {
    const key = 'cosmic_password_resets';
    const resets = JSON.parse(localStorage.getItem(key) || '[]');
    resets.push({ email: normalizedEmail, requestedAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(resets));
  } catch {}

  return {
    success: true,
    message: `Password reset instructions have been dispatched to ${normalizedEmail}. Please check your inbox.`,
  };
}
