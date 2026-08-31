import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Check, 
  X, 
  Shield, 
  ArrowRight, 
  ArrowLeft, 
  KeyRound, 
  Send, 
  Search, 
  HelpCircle, 
  Calendar, 
  CheckCircle2,
  Zap,
  LogIn,
  UserPlus
} from 'lucide-react';
import { 
  registerAccount, 
  loginAccount, 
  loginAsGuest,
  getStoredAuthUser, 
  clearAuthSession, 
  requestPasswordResetLink, 
  resetPasswordWithToken,
  lookupAccountByDetails,
  getSavedDeviceAccounts,
  getLastUsedEmail,
  UserAccount 
} from '../utils/authManager';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: UserAccount) => void;
  initialTab?: 'signup' | 'signin' | 'forgot' | 'reset' | 'recover-email';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialTab = 'signin',
}) => {
  const [tab, setTab] = useState<'signup' | 'signin' | 'forgot' | 'reset' | 'recover-email'>(initialTab);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSwitchSuggestion, setShowSwitchSuggestion] = useState<'to-signin' | 'to-signup' | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [generatedResetLink, setGeneratedResetLink] = useState<string | null>(null);

  // Recovery States
  const [searchName, setSearchName] = useState('');
  const [searchBirthDate, setSearchBirthDate] = useState('');
  const [lookupResults, setLookupResults] = useState<Array<{ email: string; maskedEmail: string; name?: string; sunSign?: string }>>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [deviceAccounts, setDeviceAccounts] = useState<Array<{ email: string; maskedEmail: string; name?: string }>>([]);

  const currentUser = getStoredAuthUser();

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setError(null);
      setSuccessMsg(null);
      setShowSwitchSuggestion(null);

      const saved = getSavedDeviceAccounts();
      setDeviceAccounts(saved);

      const lastEmail = getLastUsedEmail();
      if (lastEmail && !emailOrUsername) {
        setEmailOrUsername(lastEmail);
      }
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setShowSwitchSuggestion(null);

    const trimmedInput = emailOrUsername.trim();

    if (tab === 'signup') {
      if (!trimmedInput || !trimmedInput.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    } else if (tab === 'signin') {
      if (!trimmedInput) {
        setError('Please enter your email or username.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    } else if (tab === 'forgot') {
      if (!trimmedInput) {
        setError('Please enter your registered email or username.');
        return;
      }
    } else if (tab === 'reset') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      if (tab === 'signup') {
        const res = await registerAccount(trimmedInput, password);
        if (res.success && res.user) {
          setSuccessMsg('✨ Account created! Your celestial sanctuary is now active.');
          if (onAuthSuccess) onAuthSuccess(res.user);
          setTimeout(onClose, 1000);
        } else {
          setError(res.error || 'Failed to create account.');
          if (res.isExistingAccount || res.error?.includes('already exists')) {
            setShowSwitchSuggestion('to-signin');
          }
        }
      } else if (tab === 'signin') {
        const res = await loginAccount(trimmedInput, password);
        if (res.success && res.user) {
          setSuccessMsg('✨ Welcome back! Your sanctuary insights have been restored.');
          if (onAuthSuccess) onAuthSuccess(res.user);
          setTimeout(onClose, 1000);
        } else {
          setError(res.error || 'Invalid credentials.');
          if (res.error?.includes('No account found')) {
            setShowSwitchSuggestion('to-signup');
          }
        }
      } else if (tab === 'forgot') {
        const res = await requestPasswordResetLink(trimmedInput);
        if (res.success) {
          setSuccessMsg(`✨ A secure password reset link has been prepared for ${res.email || trimmedInput}!`);
          setGeneratedResetLink(res.resetLink || null);
          setResetToken(res.token || null);
          if (res.email) setEmailOrUsername(res.email);
        } else {
          setError(res.error || 'Could not process password reset.');
        }
      } else if (tab === 'reset') {
        const res = await resetPasswordWithToken(trimmedInput, resetToken || 'manual', password);
        if (res.success) {
          setSuccessMsg('✨ Password updated! Logging you in...');
          const loginRes = await loginAccount(trimmedInput, password);
          if (loginRes.success && loginRes.user && onAuthSuccess) {
            onAuthSuccess(loginRes.user);
          }
          setTimeout(onClose, 1000);
        } else {
          setError(res.error || 'Failed to reset password.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setLoading(true);
    try {
      const res = await loginAsGuest();
      if (res.success && res.user) {
        setSuccessMsg('✨ Entering Sanctuary as Instant Guest Traveler...');
        if (onAuthSuccess) onAuthSuccess(res.user);
        setTimeout(onClose, 800);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelectAccount = (accountEmail: string) => {
    setEmailOrUsername(accountEmail);
    setTab('signin');
    setError(null);
    setShowSwitchSuggestion(null);
  };

  const handleLookupAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    if (!searchName.trim() && !searchBirthDate.trim()) {
      setError('Please enter your Name or Birthdate to search for your account.');
      return;
    }

    setLoading(true);
    try {
      const res = await lookupAccountByDetails({
        name: searchName.trim(),
        birthDate: searchBirthDate.trim() || undefined,
        emailPrefix: searchName.trim(),
      });

      setHasSearched(true);
      setLookupResults(res.matches || []);
      if (res.matches && res.matches.length > 0) {
        setSuccessMsg(`Found ${res.matches.length} matching cosmic account${res.matches.length > 1 ? 's' : ''}!`);
      } else {
        setError('No account found matching those details. Please check your spelling or create a new account.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    clearAuthSession();
    setSuccessMsg('Logged out successfully.');
    setTimeout(onClose, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#12101f] border border-purple-500/40 rounded-3xl p-6 shadow-2xl shadow-purple-950/80 overflow-hidden max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-purple-950/80 text-purple-300 hover:text-white border border-purple-500/30 transition-all hover:scale-105 cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Logged in state view */}
        {currentUser ? (
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-950/80 border border-purple-500/50 flex items-center justify-center shadow-lg shadow-purple-900/40">
              <User className="h-8 w-8 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-serif">Your Cosmic Account</h3>
              <p className="text-sm text-purple-300 font-mono mt-1">{currentUser.email}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-[11px] text-purple-200 mt-2">
                <Sparkles size={12} className="text-amber-300" />
                <span>Cloud Sync Active Across Devices</span>
              </div>
            </div>

            <div className="pt-4 border-t border-purple-950 space-y-2">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Continue As {currentUser.email.split('@')[0]}
              </button>
              <button
                onClick={handleSignOut}
                className="w-full py-2 text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
              >
                Sign Out / Switch Account
              </button>
            </div>
          </div>
        ) : (
          /* Sign Up / Sign In / Recovery Views */
          <div>
            {/* Header Tabs (Signup vs Signin) */}
            {tab !== 'forgot' && tab !== 'reset' && tab !== 'recover-email' && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => { setTab('signin'); setError(null); setSuccessMsg(null); setShowSwitchSuggestion(null); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    tab === 'signin'
                      ? 'bg-purple-900/80 border-purple-400 text-white shadow-lg shadow-purple-950/60'
                      : 'bg-[#18142b] border-[#241f3d] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <LogIn size={13} />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setTab('signup'); setError(null); setSuccessMsg(null); setShowSwitchSuggestion(null); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    tab === 'signup'
                      ? 'bg-purple-900/80 border-purple-400 text-white shadow-lg shadow-purple-950/60'
                      : 'bg-[#18142b] border-[#241f3d] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <UserPlus size={13} />
                  <span>Create Account</span>
                </button>
              </div>
            )}

            {/* Back to Sign In Header for Recovery Views */}
            {(tab === 'forgot' || tab === 'reset' || tab === 'recover-email') && (
              <div className="flex items-center justify-between mb-4 border-b border-purple-900/40 pb-3">
                <button
                  type="button"
                  onClick={() => { setTab('signin'); setError(null); setSuccessMsg(null); setShowSwitchSuggestion(null); }}
                  className="flex items-center space-x-1.5 text-xs text-purple-300 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Sign In</span>
                </button>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  {tab === 'recover-email' ? <HelpCircle size={12} /> : <KeyRound size={12} />}
                  <span>{tab === 'recover-email' ? 'Find Account' : 'Password Recovery'}</span>
                </span>
              </div>
            )}

            {/* 1-Tap Quick Account Chips for Known Device Accounts */}
            {(tab === 'signin' || tab === 'signup') && deviceAccounts.length > 0 && (
              <div className="mb-4 p-2.5 rounded-2xl bg-purple-950/40 border border-purple-800/40 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-300/90 uppercase tracking-wider block">
                  ✨ Quick 1-Tap Sign In:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {deviceAccounts.map((acc, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleQuickSelectAccount(acc.email)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                        emailOrUsername.toLowerCase() === acc.email.toLowerCase()
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

            <div className="text-center mb-3">
              <h3 className="text-base font-bold text-white font-serif">
                {tab === 'signup'
                  ? 'Create Your Cosmic Account'
                  : tab === 'signin'
                  ? 'Welcome Back, Traveler'
                  : tab === 'forgot'
                  ? 'Reset Your Password'
                  : tab === 'recover-email'
                  ? 'Recover Username or Email'
                  : 'Set a New Password'}
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                {tab === 'signup'
                  ? 'Sign up in seconds to sync your birth matrix, readings, and journal.'
                  : tab === 'signin'
                  ? 'Enter your credentials to access your saved sanctuary data.'
                  : tab === 'forgot'
                  ? 'Enter your email or username to prepare a secure password reset.'
                  : tab === 'recover-email'
                  ? 'Enter your profile name or birthdate to locate your registered account.'
                  : 'Enter your new password below to regain full access.'}
              </p>
            </div>

            {error && (
              <div className="mb-3 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 text-center font-medium space-y-2">
                <p>{error}</p>
                {showSwitchSuggestion === 'to-signin' && (
                  <button
                    type="button"
                    onClick={() => { setTab('signin'); setError(null); setShowSwitchSuggestion(null); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow"
                  >
                    <LogIn size={12} />
                    <span>Switch to Sign In & Enter Password →</span>
                  </button>
                )}
                {showSwitchSuggestion === 'to-signup' && (
                  <button
                    type="button"
                    onClick={() => { setTab('signup'); setError(null); setShowSwitchSuggestion(null); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow"
                  >
                    <UserPlus size={12} />
                    <span>Create Account with this Email →</span>
                  </button>
                )}
              </div>
            )}

            {successMsg && (
              <div className="mb-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 text-center font-medium space-y-2">
                <p>{successMsg}</p>
                {tab === 'forgot' && generatedResetLink && (
                  <div className="pt-1 border-t border-emerald-800/40">
                    <button
                      type="button"
                      onClick={() => { setTab('reset'); setSuccessMsg(null); }}
                      className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                    >
                      Set New Password Now →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB: RECOVER USERNAME / EMAIL VIEW */}
            {tab === 'recover-email' ? (
              <div className="space-y-4">
                <form onSubmit={handleLookupAccount} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Your Profile Name or Nickname
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-3 text-purple-400" />
                      <input
                        type="text"
                        value={searchName}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setSearchName(e.target.value)}
                        placeholder="e.g. Alex or Cosmic Traveler"
                        className="w-full bg-[#18142b] border border-[#2e2552] rounded-xl py-2.5 pl-9 pr-3 text-sm text-white focus:border-purple-500 outline-none placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Birthdate (Optional)
                    </label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-3 text-purple-400" />
                      <input
                        type="date"
                        value={searchBirthDate}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setSearchBirthDate(e.target.value)}
                        className="w-full bg-[#18142b] border border-[#2e2552] rounded-xl py-2.5 pl-9 pr-3 text-sm text-white focus:border-purple-500 outline-none placeholder:text-gray-500 [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Search size={14} />
                    <span>{loading ? 'Searching...' : 'Find My Account Email'}</span>
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
                        className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-white font-mono">{item.maskedEmail}</p>
                          {item.name && <p className="text-[10px] text-purple-300">Name: {item.name} {item.sunSign ? `• ${item.sunSign}` : ''}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQuickSelectAccount(item.email)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-all cursor-pointer"
                        >
                          Use Account
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* TAB: SIGNUP / SIGNIN / FORGOT / RESET FORM */
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Email / Username Field */}
                {(tab === 'signup' || tab === 'signin' || tab === 'forgot') && (
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {tab === 'signup' ? 'Email Address' : 'Email Address or Username'}
                    </label>
                    <div className="relative">
                      {tab === 'signup' ? (
                        <Mail size={16} className="absolute left-3 top-3 text-purple-400" />
                      ) : (
                        <User size={16} className="absolute left-3 top-3 text-purple-400" />
                      )}
                      <input
                        type={tab === 'signup' ? 'email' : 'text'}
                        required
                        autoFocus
                        value={emailOrUsername}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        placeholder={tab === 'signup' ? 'you@example.com' : 'you@example.com or username'}
                        className="w-full bg-[#18142b] border border-[#2e2552] rounded-xl py-2.5 pl-9 pr-3 text-sm text-white focus:border-purple-500 outline-none placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                )}

                {/* Password Field (Single streamlined field for signup & signin) */}
                {(tab === 'signup' || tab === 'signin' || tab === 'reset') && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        {tab === 'reset' ? 'New Password' : 'Password'}
                      </label>
                      <span className="text-[10px] text-purple-300 font-medium">At least 6 characters</span>
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
                        className="w-full bg-[#18142b] border border-[#2e2552] rounded-xl py-2.5 pl-9 pr-10 text-sm text-white focus:border-purple-500 outline-none placeholder:text-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-white cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Recovery Options in Sign In Mode */}
                    {tab === 'signin' && (
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-purple-950/60 text-[11px]">
                        <button
                          type="button"
                          onClick={() => { setTab('recover-email'); setError(null); setSuccessMsg(null); }}
                          className="text-purple-300 hover:text-white underline underline-offset-2 transition-colors font-medium cursor-pointer"
                        >
                          Forgot Email / Username?
                        </button>
                        <button
                          type="button"
                          onClick={() => { setTab('forgot'); setError(null); setSuccessMsg(null); }}
                          className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors font-medium cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Confirm Password (only on reset for safety) */}
                {tab === 'reset' && (
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-3 text-purple-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={confirmPassword}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#18142b] border border-[#2e2552] rounded-xl py-2.5 pl-9 pr-3 text-sm text-white focus:border-purple-500 outline-none placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold tracking-wider uppercase shadow-lg shadow-purple-950/60 transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {tab === 'forgot' ? (
                    <>
                      <Send size={14} />
                      <span>{loading ? 'Sending Link...' : 'Send Password Reset Link'}</span>
                    </>
                  ) : tab === 'reset' ? (
                    <>
                      <KeyRound size={14} />
                      <span>{loading ? 'Saving New Password...' : 'Save New Password & Sign In'}</span>
                    </>
                  ) : tab === 'signup' ? (
                    <>
                      <Sparkles size={14} className="text-amber-300" />
                      <span>{loading ? 'Creating Account...' : 'Create Cosmic Account ➔'}</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={14} className="text-amber-300" />
                      <span>{loading ? 'Signing In...' : 'Sign In & Enter Sanctuary ➔'}</span>
                    </>
                  )}
                </button>

                {/* 1-Tap Instant Guest Option */}
                {(tab === 'signin' || tab === 'signup') && (
                  <div className="pt-3 border-t border-purple-950/80 space-y-2">
                    <button
                      type="button"
                      onClick={handleGuestSignIn}
                      disabled={loading}
                      className="w-full py-2.5 rounded-xl bg-purple-950/70 hover:bg-purple-900/80 border border-purple-700/40 text-purple-200 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Zap size={14} className="text-amber-400" />
                      <span>Instant Guest Access (No Password Needed)</span>
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
