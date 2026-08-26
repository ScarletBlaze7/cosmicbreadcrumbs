import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Sparkles, Check, X, Shield, ArrowRight, CloudCheck } from 'lucide-react';
import { registerAccount, loginAccount, getStoredAuthUser, clearAuthSession, UserAccount } from '../utils/authManager';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [tab, setTab] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const currentUser = getStoredAuthUser();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (tab === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (tab === 'signup') {
        const res = await registerAccount(email, password);
        if (res.success && res.user) {
          setSuccessMsg('✨ Account created successfully! Your celestial data is now synced.');
          if (onAuthSuccess) onAuthSuccess(res.user);
          setTimeout(onClose, 1200);
        } else {
          setError(res.error || 'Failed to create account.');
        }
      } else {
        const res = await loginAccount(email, password);
        if (res.success && res.user) {
          setSuccessMsg('✨ Welcome back! Your cosmic insights have been restored.');
          if (onAuthSuccess) onAuthSuccess(res.user);
          setTimeout(onClose, 1200);
        } else {
          setError(res.error || 'Invalid credentials.');
        }
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
      <div className="relative w-full max-w-md bg-[#12101f] border border-purple-500/40 rounded-3xl p-6 shadow-2xl shadow-purple-950/80 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-purple-950/80 text-purple-300 hover:text-white border border-purple-500/30 transition-all hover:scale-105"
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
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                Continue As {currentUser.email.split('@')[0]}
              </button>
              <button
                onClick={handleSignOut}
                className="w-full py-2 text-xs text-rose-400 hover:text-rose-300 transition-colors"
              >
                Sign Out / Switch Account
              </button>
            </div>
          </div>
        ) : (
          /* Sign Up / Sign In Form */
          <div>
            {/* Header Tabs */}
            <div className="flex items-center justify-center gap-2 mb-5">
              <button
                type="button"
                onClick={() => { setTab('signup'); setError(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                  tab === 'signup'
                    ? 'bg-purple-900/80 border-purple-400 text-white shadow-lg shadow-purple-950/60'
                    : 'bg-[#18142b] border-[#241f3d] text-gray-400 hover:text-gray-200'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => { setTab('signin'); setError(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                  tab === 'signin'
                    ? 'bg-purple-900/80 border-purple-400 text-white shadow-lg shadow-purple-950/60'
                    : 'bg-[#18142b] border-[#241f3d] text-gray-400 hover:text-gray-200'
                }`}
              >
                Sign In
              </button>
            </div>

            <div className="text-center mb-4">
              <h3 className="text-base font-bold text-white font-serif">
                {tab === 'signup' ? 'Preserve Your Cosmic Journey' : 'Welcome Back, Traveler'}
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                {tab === 'signup'
                  ? 'Create an account so your readings, dreams, and journal are safely saved across all your devices.'
                  : 'Enter your credentials to access your saved readings and profile.'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 text-center font-medium">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 text-center font-medium">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-purple-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-[#18142b] border border-[#2e2552] rounded-xl py-2.5 pl-9 pr-3 text-sm text-white focus:border-purple-500 outline-none placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Password
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
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#18142b] border border-[#2e2552] rounded-xl py-2.5 pl-9 pr-10 text-sm text-white focus:border-purple-500 outline-none placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (only on signup) */}
              {tab === 'signup' && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-3 text-purple-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
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
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold tracking-wider uppercase shadow-lg shadow-purple-950/60 transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                <Sparkles size={14} />
                <span>{loading ? 'Processing...' : tab === 'signup' ? 'Create Cosmic Account' : 'Sign In'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
