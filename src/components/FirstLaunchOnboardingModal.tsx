import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  ArrowLeft,
  Check, 
  ShieldCheck, 
  Star, 
  Gift, 
  Moon, 
  User, 
  Clock, 
  MapPin,
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  HelpCircle,
  Search,
  Send,
  Zap,
  LogIn,
  UserPlus
} from 'lucide-react';
import { CosmicLogo } from './CosmicLogo';
import { ZodiacSymbolIcon } from './ZodiacSymbolIcon';
import { getSunSignFromDate } from '../utils/astrologyCalc';
import { calculateLifePath, calculateDestinyNumber } from '../utils/numerologyCalc';
import { 
  registerAccount, 
  loginAccount, 
  requestPasswordResetLink, 
  resetPasswordWithToken,
  lookupAccountByDetails,
  getSavedDeviceAccounts,
  getLastUsedEmail
} from '../utils/authManager';
import { UserProfile } from '../types';

interface FirstLaunchOnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: UserProfile) => void;
}

const MONTHS = [
  { value: '01', name: 'January' },
  { value: '02', name: 'February' },
  { value: '03', name: 'March' },
  { value: '04', name: 'April' },
  { value: '05', name: 'May' },
  { value: '06', name: 'June' },
  { value: '07', name: 'July' },
  { value: '08', name: 'August' },
  { value: '09', name: 'September' },
  { value: '10', name: 'October' },
  { value: '11', name: 'November' },
  { value: '12', name: 'December' },
];

export const FirstLaunchOnboardingModal: React.FC<FirstLaunchOnboardingModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const [step, setStep] = useState<'account' | 'birthdate' | 'reveal'>('account');
  const [name, setName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('07');
  const [selectedDay, setSelectedDay] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');

  // Account creation inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showSwitchSuggestion, setShowSwitchSuggestion] = useState<'to-signin' | 'to-signup' | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [isSignInMode, setIsSignInMode] = useState(false);

  // Recovery sub-flow states in step 1
  const [recoveryMode, setRecoveryMode] = useState<'none' | 'forgot' | 'recover-email' | 'reset'>('none');
  const [searchName, setSearchName] = useState('');
  const [searchBirthDate, setSearchBirthDate] = useState('');
  const [lookupResults, setLookupResults] = useState<Array<{ email: string; maskedEmail: string; name?: string; sunSign?: string }>>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [deviceAccounts, setDeviceAccounts] = useState<Array<{ email: string; maskedEmail: string; name?: string }>>([]);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      const saved = getSavedDeviceAccounts();
      setDeviceAccounts(saved);
      const lastEmail = getLastUsedEmail();
      if (lastEmail && !email) {
        setEmail(lastEmail);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const effectiveName = name.trim() || 'Universal Seeker';
  const effectiveYear = birthYear.trim() || '1996';
  const effectiveMonth = selectedMonth || '07';
  const effectiveDay = (selectedDay.trim() || '22').padStart(2, '0');
  const birthDateStr = `${effectiveYear}-${effectiveMonth}-${effectiveDay}`;
  const calculatedSign = getSunSignFromDate(birthDateStr);
  const calculatedLifePath = calculateLifePath(birthDateStr);
  const calculatedDestiny = calculateDestinyNumber(effectiveName);

  const handleFillSample = () => {
    setName('Seraphina Starling');
    setSelectedMonth('07');
    setSelectedDay('22');
    setBirthYear('1996');
    setBirthTime('11:11');
    setBirthPlace('Sedona, Arizona');
  };

  const handleDiscoverSign = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('reveal');
  };

  const finishOnboarding = (profileData?: Partial<UserProfile>) => {
    const finalProfile: UserProfile = {
      name: effectiveName,
      birthDate: birthDateStr,
      birthTime: birthTime || '11:11',
      birthPlace: birthPlace || '',
      sunSign: calculatedSign.name,
      lifePathNumber: calculatedLifePath,
      destinyNumber: calculatedDestiny,
      numerologySystem: 'chaldean',
      birthDateChangeCount: 0,
      hasCompletedOnboarding: true,
      ...profileData,
    };
    onComplete(finalProfile);
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);
    setShowSwitchSuggestion(null);

    const trimmedInput = email.trim();

    if (!isSignInMode && (!trimmedInput || !trimmedInput.includes('@'))) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (isSignInMode && !trimmedInput) {
      setAuthError('Please enter your email address or username.');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmittingAuth(true);
    try {
      if (isSignInMode) {
        const res = await loginAccount(trimmedInput, password);
        if (res.success && res.user) {
          if (res.user.profile?.birthDate) {
            // Already has completed profile, finish directly
            finishOnboarding(res.user.profile);
            return;
          }
          if (res.user.profile?.name) {
            setName(res.user.profile.name);
          }
          setStep('birthdate');
        } else {
          setAuthError(res.error || 'Invalid credentials.');
          if (res.error?.includes('No account found')) {
            setShowSwitchSuggestion('to-signup');
          }
        }
      } else {
        const res = await registerAccount(trimmedInput, password);
        if (res.success && res.user) {
          setStep('birthdate');
        } else {
          setAuthError(res.error || 'Failed to create account.');
          if (res.isExistingAccount || res.error?.includes('already exists')) {
            setShowSwitchSuggestion('to-signin');
          }
        }
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);
    if (!email.trim()) {
      setAuthError('Please enter your account email or username.');
      return;
    }

    setIsSubmittingAuth(true);
    try {
      const res = await requestPasswordResetLink(email);
      if (res.success) {
        setAuthSuccessMsg(`✨ Reset link prepared for ${res.email || email}. You can now set your new password.`);
        setResetToken(res.token || null);
        if (res.email) setEmail(res.email);
        setRecoveryMode('reset');
      } else {
        setAuthError(res.error || 'Failed to process password recovery.');
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);

    if (newPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    setIsSubmittingAuth(true);
    try {
      const res = await resetPasswordWithToken(email, resetToken || 'manual', newPassword);
      if (res.success) {
        setAuthSuccessMsg('✨ Password updated successfully! Logging you in...');
        const loginRes = await loginAccount(email, newPassword);
        if (loginRes.success && loginRes.user) {
          if (loginRes.user.profile?.birthDate) {
            finishOnboarding(loginRes.user.profile);
            return;
          }
          if (loginRes.user.profile?.name) {
            setName(loginRes.user.profile.name);
          }
          setStep('birthdate');
        } else {
          setRecoveryMode('none');
          setIsSignInMode(true);
        }
      } else {
        setAuthError(res.error || 'Failed to reset password.');
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleLookupAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);
    if (!searchName.trim() && !searchBirthDate.trim()) {
      setAuthError('Please enter your Name or Birthdate to search.');
      return;
    }

    setIsSubmittingAuth(true);
    try {
      const res = await lookupAccountByDetails({
        name: searchName.trim(),
        birthDate: searchBirthDate.trim() || undefined,
        emailPrefix: searchName.trim(),
      });
      setHasSearched(true);
      setLookupResults(res.matches || []);
      if (res.matches && res.matches.length > 0) {
        setAuthSuccessMsg(`Found ${res.matches.length} matching account${res.matches.length > 1 ? 's' : ''}!`);
      } else {
        setAuthError('No matching cosmic account found. Check spelling or create a new account.');
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleSelectRecoveredAccount = (accountEmail: string) => {
    setEmail(accountEmail);
    setRecoveryMode('none');
    setIsSignInMode(true);
    setAuthError(null);
    setAuthSuccessMsg(`Selected: ${accountEmail}. Enter your password to sign in.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-3 sm:p-4 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative my-6 w-full max-w-xl rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-purple-950/95 via-slate-900 to-slate-950 shadow-2xl shadow-purple-950/80 overflow-hidden">
        {/* Top Celestial Ambient Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-80 rounded-full bg-gradient-to-b from-amber-400/20 via-purple-600/25 to-transparent blur-3xl" />

        {/* Modal Header */}
        <div className="relative border-b border-purple-800/50 bg-slate-950/80 px-6 py-5 text-center space-y-2">
          <div className="flex justify-center">
            <CosmicLogo size="lg" showUploadTrigger={false} />
          </div>
          
          <div className="inline-flex items-center space-x-1.5 rounded-full bg-amber-400/15 border border-amber-400/35 px-3 py-0.5 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider">
            <Sparkles className="h-3 w-3 text-amber-300" />
            <span>Welcome to Cosmic Breadcrumbs</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-100 to-purple-200">
            {step === 'account' 
              ? (recoveryMode === 'forgot'
                  ? 'Reset Your Password'
                  : recoveryMode === 'recover-email'
                  ? 'Find Your Account Email'
                  : recoveryMode === 'reset'
                  ? 'Set New Password'
                  : isSignInMode ? 'Sign In to Your Sanctuary' : 'Create Your Cosmic Account')
              : step === 'birthdate'
              ? 'Find Your Zodiac Sign'
              : 'Your Celestial Matrix Reveal'}
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/90 max-w-md mx-auto leading-relaxed">
            {step === 'account'
              ? (recoveryMode === 'forgot'
                  ? 'Enter your registered email or username below to prepare your password reset.'
                  : recoveryMode === 'recover-email'
                  ? 'Search by your name or birthdate to recover your registered account email.'
                  : recoveryMode === 'reset'
                  ? 'Enter your new password below to regain full access to your sanctuary.'
                  : 'Sign in or create your account to sync your sacred readings, birth matrix, and journal across all devices.')
              : step === 'birthdate'
              ? 'Enter your birth details below to discover your exact Sun Sign, Chaldean root frequency, and cosmic blueprint.'
              : 'Your cosmic blueprint and divine attributes have been calculated from the celestial sphere.'}
          </p>
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[72vh] overflow-y-auto">
          
          {/* STEP 1: SIGN IN / CREATE ACCOUNT / RECOVERY */}
          {step === 'account' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Back to Sign In Header for Recovery Modes */}
              {recoveryMode !== 'none' && (
                <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
                  <button
                    type="button"
                    onClick={() => { setRecoveryMode('none'); setAuthError(null); setAuthSuccessMsg(null); }}
                    className="flex items-center space-x-1.5 text-xs text-purple-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Sign In</span>
                  </button>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    {recoveryMode === 'recover-email' ? <HelpCircle size={12} /> : <KeyRound size={12} />}
                    <span>{recoveryMode === 'recover-email' ? 'Find Account' : 'Password Recovery'}</span>
                  </span>
                </div>
              )}

              {recoveryMode === 'none' && (
                <div className="flex items-center justify-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => { setIsSignInMode(false); setAuthError(null); setAuthSuccessMsg(null); setShowSwitchSuggestion(null); }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      !isSignInMode
                        ? 'bg-purple-900/80 border-purple-400 text-white shadow-md'
                        : 'bg-[#18142b] border-[#241f3d] text-gray-400'
                    }`}
                  >
                    <UserPlus size={13} />
                    <span>Create Account</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsSignInMode(true); setAuthError(null); setAuthSuccessMsg(null); setShowSwitchSuggestion(null); }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSignInMode
                        ? 'bg-purple-900/80 border-purple-400 text-white shadow-md'
                        : 'bg-[#18142b] border-[#241f3d] text-gray-400'
                    }`}
                  >
                    <LogIn size={13} />
                    <span>Sign In</span>
                  </button>
                </div>
              )}

              {/* 1-Tap Quick Account Chips for Known Accounts */}
              {recoveryMode === 'none' && deviceAccounts.length > 0 && (
                <div className="p-2.5 rounded-2xl bg-purple-950/40 border border-purple-800/40 space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-300/90 uppercase tracking-wider block">
                    ✨ Quick 1-Tap Sign In:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {deviceAccounts.map((acc, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setEmail(acc.email);
                          setIsSignInMode(true);
                          setAuthError(null);
                          setShowSwitchSuggestion(null);
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                          email.toLowerCase() === acc.email.toLowerCase()
                            ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                            : 'bg-slate-900/80 text-purple-200 border-purple-800/60 hover:border-amber-400/60'
                        }`}
                      >
                        <User size={12} className="text-amber-400" />
                        <span>{acc.email.split('@')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {authError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 text-center font-medium space-y-2">
                  <p>{authError}</p>
                  {showSwitchSuggestion === 'to-signin' && (
                    <button
                      type="button"
                      onClick={() => { setIsSignInMode(true); setAuthError(null); setShowSwitchSuggestion(null); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow"
                    >
                      <LogIn size={12} />
                      <span>Switch to Sign In & Enter Password →</span>
                    </button>
                  )}
                  {showSwitchSuggestion === 'to-signup' && (
                    <button
                      type="button"
                      onClick={() => { setIsSignInMode(false); setAuthError(null); setShowSwitchSuggestion(null); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow"
                    >
                      <UserPlus size={12} />
                      <span>Create Account with this Email →</span>
                    </button>
                  )}
                </div>
              )}

              {authSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 text-center font-medium">
                  {authSuccessMsg}
                </div>
              )}

              {/* RECOVERY SUB-FLOW: RECOVER EMAIL / USERNAME */}
              {recoveryMode === 'recover-email' && (
                <div className="space-y-4">
                  {deviceAccounts.length > 0 && (
                    <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-800/50 space-y-2">
                      <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                        Saved Accounts on this Device:
                      </span>
                      <div className="space-y-1.5">
                        {deviceAccounts.map((acc, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-purple-900/60"
                          >
                            <div className="flex items-center space-x-2 truncate">
                              <Mail size={13} className="text-purple-400 shrink-0" />
                              <span className="text-xs text-slate-200 font-mono truncate">{acc.maskedEmail}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleSelectRecoveredAccount(acc.email)}
                              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer shrink-0 ml-2"
                            >
                              Sign In
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleLookupAccount} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-purple-200 mb-1">
                        Profile Name or Nickname
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-3 text-purple-400" />
                        <input
                          type="text"
                          value={searchName}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => setSearchName(e.target.value)}
                          placeholder="e.g. Alex or Cosmic Traveler"
                          className="w-full bg-slate-900 border border-purple-800/70 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white focus:border-amber-400 outline-none placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-purple-200 mb-1">
                        Birthdate (Optional)
                      </label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-3 text-purple-400" />
                        <input
                          type="date"
                          value={searchBirthDate}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => setSearchBirthDate(e.target.value)}
                          className="w-full bg-slate-900 border border-purple-800/70 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white focus:border-amber-400 outline-none placeholder:text-gray-500 [color-scheme:dark]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingAuth}
                      className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold uppercase tracking-wider shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Search size={14} />
                      <span>{isSubmittingAuth ? 'Searching...' : 'Find My Account Email'}</span>
                    </button>
                  </form>

                  {hasSearched && lookupResults.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                        Matches Found:
                      </span>
                      {lookupResults.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="p-3 rounded-xl bg-purple-950/70 border border-purple-500/50 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-xs font-bold text-white font-mono">{item.maskedEmail}</p>
                            {item.name && <p className="text-[10px] text-purple-300">Name: {item.name} {item.sunSign ? `• ${item.sunSign}` : ''}</p>}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSelectRecoveredAccount(item.email)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-all cursor-pointer"
                          >
                            Use Account
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* RECOVERY SUB-FLOW: FORGOT PASSWORD REQUEST */}
              {recoveryMode === 'forgot' && (
                <form onSubmit={handleRequestPasswordReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 mb-1">
                      Account Email or Username
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-3 text-purple-400" />
                      <input
                        type="text"
                        required
                        value={email}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com or username"
                        className="w-full bg-slate-900 border border-purple-800/70 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white focus:border-amber-400 outline-none placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingAuth}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-xs font-bold uppercase tracking-wider shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-serif"
                  >
                    <Send size={14} />
                    <span>{isSubmittingAuth ? 'Preparing Reset...' : 'Prepare Password Reset'}</span>
                  </button>
                </form>
              )}

              {/* RECOVERY SUB-FLOW: RESET NEW PASSWORD */}
              {recoveryMode === 'reset' && (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-3 text-purple-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={newPassword}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-purple-800/70 rounded-xl py-2.5 pl-9 pr-10 text-sm text-white focus:border-amber-400 outline-none placeholder:text-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-200 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-3 text-purple-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={confirmNewPassword}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-purple-800/70 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white focus:border-amber-400 outline-none placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingAuth}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-xs font-bold uppercase tracking-wider shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-serif"
                  >
                    <KeyRound size={14} />
                    <span>{isSubmittingAuth ? 'Updating Password...' : 'Save Password & Sign In'}</span>
                  </button>
                </form>
              )}

              {/* NORMAL SIGN IN & SIGN UP FORM */}
              {recoveryMode === 'none' && (
                <form onSubmit={handleAccountSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 mb-1">
                      {isSignInMode ? 'Email Address or Username' : 'Email Address'}
                    </label>
                    <div className="relative">
                      {isSignInMode ? (
                        <User size={16} className="absolute left-3 top-3 text-purple-400" />
                      ) : (
                        <Mail size={16} className="absolute left-3 top-3 text-purple-400" />
                      )}
                      <input
                        type={isSignInMode ? 'text' : 'email'}
                        required
                        value={email}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={isSignInMode ? 'you@example.com or username' : 'seeker@example.com'}
                        className="w-full bg-slate-900 border border-purple-800/70 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white focus:border-amber-400 outline-none placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-purple-200">
                        Password
                      </label>
                      <span className="text-[10px] text-amber-300 font-medium">At least 6 characters</span>
                    </div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-3 text-purple-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={password}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-purple-800/70 rounded-xl py-2.5 pl-9 pr-10 text-sm text-white focus:border-amber-400 outline-none placeholder:text-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Recovery Options on Sign-In */}
                    {isSignInMode && (
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-purple-900/40 text-[11px]">
                        <button
                          type="button"
                          onClick={() => { setRecoveryMode('recover-email'); setAuthError(null); setAuthSuccessMsg(null); }}
                          className="text-purple-300 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
                        >
                          Forgot Email / Username?
                        </button>
                        <button
                          type="button"
                          onClick={() => { setRecoveryMode('forgot'); setAuthError(null); setAuthSuccessMsg(null); }}
                          className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      disabled={isSubmittingAuth}
                      className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 py-3.5 px-6 font-serif text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>{isSubmittingAuth ? 'Verifying...' : isSignInMode ? 'Sign In & Continue ➔' : 'Create Account & Continue ➔'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep('birthdate')}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/40 text-purple-200 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Zap size={13} className="text-amber-400" />
                      <span>Continue as Instant Guest (No Password Needed)</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: FIND YOUR ZODIAC SIGN & BIRTH MATRIX */}
          {step === 'birthdate' && (
            <form onSubmit={handleDiscoverSign} className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  Step 2 of 2: Your Celestial Matrix Details
                </span>
                <button
                  type="button"
                  onClick={handleFillSample}
                  className="text-[11px] font-medium text-purple-300 hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  ⚡ Auto-fill Sample Chart
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1 flex items-center space-x-1.5">
                  <User className="h-3.5 w-3.5 text-amber-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Seraphina Starling"
                  className="w-full rounded-2xl border border-purple-800/60 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder-purple-400/40 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1 flex items-center space-x-1.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-400" />
                  <span>Birthday (Month, Day & Year)</span>
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="relative">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full appearance-none rounded-2xl border border-purple-800/70 bg-slate-900 px-3.5 py-3 text-xs sm:text-sm font-medium text-slate-100 focus:border-amber-400 focus:outline-none cursor-pointer"
                    >
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value} className="bg-slate-900 text-slate-100">
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 text-xs">
                      ▼
                    </div>
                  </div>

                  <div>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      required
                      value={selectedDay}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setSelectedDay(e.target.value)}
                      placeholder="Day (1-31)"
                      className="w-full rounded-2xl border border-purple-800/70 bg-slate-900 px-3.5 py-3 text-xs sm:text-sm font-medium text-slate-100 placeholder-purple-400/40 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <input
                      type="number"
                      min="1920"
                      max="2030"
                      required
                      value={birthYear}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setBirthYear(e.target.value)}
                      placeholder="Year (e.g. 1996)"
                      className="w-full rounded-2xl border border-purple-800/70 bg-slate-900 px-3.5 py-3 text-xs sm:text-sm font-medium text-slate-100 placeholder-purple-400/40 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Place of Birth and Time of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1 flex items-center space-x-1.5">
                    <MapPin className="h-3.5 w-3.5 text-amber-400" />
                    <span>Place of Birth (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={birthPlace}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    placeholder="e.g. Sedona, Arizona"
                    className="w-full rounded-2xl border border-purple-800/70 bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-purple-400/40 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1 flex items-center space-x-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    <span>Time of Birth (Optional)</span>
                  </label>
                  <input
                    type="time"
                    value={birthTime}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full rounded-2xl border border-purple-800/70 bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                  <span className="block text-[10px] text-amber-300/90 mt-1 font-medium italic">
                    (optional if known for optimal numerology readings)
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 py-3.5 px-6 font-serif text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 transition-all active:scale-[0.99] cursor-pointer"
              >
                <Compass className="h-4 w-4" />
                <span>Find My Zodiac Sign Now ➔</span>
              </button>
            </form>
          )}

          {/* STEP 3: SACRED REVEAL & ENTER SANCTUARY */}
          {step === 'reveal' && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="rounded-3xl border-2 border-amber-400/70 bg-gradient-to-b from-purple-950/80 via-slate-900 to-slate-950 p-6 text-center space-y-4 shadow-2xl">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 via-purple-900 to-slate-950 border-2 border-amber-400 shadow-xl shadow-amber-500/20">
                  <ZodiacSymbolIcon 
                    sign={calculatedSign.name} 
                    size="lg" 
                    fallbackText={calculatedSign.symbol}
                    className="scale-125 text-amber-300" 
                  />
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                    YOUR SUN SIGN
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center justify-center space-x-2">
                    <span>{calculatedSign.name}</span>
                    <span className="text-amber-300">({calculatedSign.symbol})</span>
                  </h3>
                  <p className="text-xs text-purple-300 font-medium">
                    {calculatedSign.dateRange} • {calculatedSign.element} Element • {calculatedSign.rulingPlanet} Ruler
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-purple-900/60 pt-3 text-center">
                  <div className="rounded-xl bg-purple-950/60 p-2 border border-purple-800/40">
                    <div className="text-[9px] text-purple-400 uppercase font-bold">Life Path</div>
                    <div className="font-serif text-base font-bold text-amber-200">#{calculatedLifePath}</div>
                  </div>
                  <div className="rounded-xl bg-purple-950/60 p-2 border border-purple-800/40">
                    <div className="text-[9px] text-purple-400 uppercase font-bold">Destiny</div>
                    <div className="font-serif text-base font-bold text-cyan-200">#{calculatedDestiny}</div>
                  </div>
                  <div className="rounded-xl bg-purple-950/60 p-2 border border-purple-800/40">
                    <div className="text-[9px] text-purple-400 uppercase font-bold">Modality</div>
                    <div className="font-serif text-xs font-bold text-purple-200 mt-1">{calculatedSign.modality}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => finishOnboarding()}
                  className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 py-3.5 px-6 font-serif text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Enter the Cosmic Sanctuary ➔</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
