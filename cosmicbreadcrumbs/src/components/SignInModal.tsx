import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Check, 
  AlertCircle, 
  KeyRound, 
  ArrowRight,
  Compass,
  Radio
} from 'lucide-react';
import { CosmicLogo } from './CosmicLogo';
import { UserProfile, AuthUser } from '../types';
import { 
  signInWithEmailPassword, 
  signUpWithEmailPassword, 
  sendPasswordResetEmail,
  SignInResult 
} from '../utils/authManager';
import { requestLocationPermission } from '../utils/permissionManager';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile, user: AuthUser) => void;
  initialTab?: 'signin' | 'signup';
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialTab = 'signin',
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot'>(initialTab);
  
  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpBirthDate, setSignUpBirthDate] = useState('1996-07-22');
  const [signUpBirthTime, setSignUpBirthTime] = useState('');
  const [signUpBirthPlace, setSignUpBirthPlace] = useState('Sedona, Arizona');
  const [isDetectingLoc, setIsDetectingLoc] = useState(false);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState<string | null>(null);

  // General Status State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDetectGPS = async () => {
    setIsDetectingLoc(true);
    try {
      const loc = await requestLocationPermission();
      if (loc.city || loc.region) {
        const placeStr = [loc.city, loc.region, loc.country].filter(Boolean).join(', ');
        setSignUpBirthPlace(placeStr);
      }
    } catch {
      // Ignored
    } finally {
      setIsDetectingLoc(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result: SignInResult = await signInWithEmailPassword(signInEmail, signInPassword);
      if (result.success && result.profile && result.user) {
        setSuccessMessage('Welcome back to the Sanctuary!');
        setTimeout(() => {
          setIsLoading(false);
          onSuccess(result.profile!, result.user!);
          onClose();
        }, 600);
      } else {
        setIsLoading(false);
        setErrorMessage(result.message || 'Sign in failed. Please check your email and password.');
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result: SignInResult = await signUpWithEmailPassword({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
        birthDate: signUpBirthDate,
        birthTime: signUpBirthTime,
        birthPlace: signUpBirthPlace,
      });

      if (result.success && result.profile && result.user) {
        setSuccessMessage('Sacred account created! Calibrating your matrix...');
        setTimeout(() => {
          setIsLoading(false);
          onSuccess(result.profile!, result.user!);
          onClose();
        }, 700);
      } else {
        setIsLoading(false);
        setErrorMessage(result.message || 'Account creation failed. Please check your information.');
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await sendPasswordResetEmail(forgotEmail);
      setIsLoading(false);
      if (result.success) {
        setForgotSuccessMessage(result.message);
      } else {
        setErrorMessage(result.message);
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('Failed to send reset link. Please verify your email.');
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative my-6 w-full max-w-md overflow-hidden rounded-3xl border-2 border-purple-800/80 bg-slate-900 shadow-2xl shadow-purple-950/90">
        
        {/* Glow Header */}
        <div className="relative border-b border-purple-800/50 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-5 sm:p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:bg-purple-900/40 hover:text-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center space-y-2">
            <CosmicLogo size="md" showUploadTrigger={false} />
            <h3 className="font-serif text-xl font-bold text-slate-100">
              Cosmic Breadcrumbs
            </h3>
            <p className="text-xs text-purple-300/80">
              Your Daily Personalized Cosmic Haven
            </p>
          </div>

          {/* Tab Switcher (Sign In vs Create Account) */}
          {activeTab !== 'forgot' && (
            <div className="mt-5 grid grid-cols-2 rounded-2xl border border-purple-800/50 bg-slate-950/80 p-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setErrorMessage(null);
                }}
                className={`rounded-xl py-2 text-xs font-bold font-sans tracking-wide transition-all ${
                  activeTab === 'signin'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setErrorMessage(null);
                }}
                className={`rounded-xl py-2 text-xs font-bold font-sans tracking-wide transition-all ${
                  activeTab === 'signup'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[72vh] overflow-y-auto">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-3 flex items-start space-x-2 text-xs text-rose-200 animate-in fade-in">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-3 flex items-center space-x-2 text-xs text-emerald-200 animate-in fade-in">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. SIGN IN TAB */}
          {/* ========================================================================= */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-purple-200 flex items-center space-x-1.5">
                  <Mail className="h-3.5 w-3.5 text-amber-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="seeker@cosmicbreadcrumbs.com"
                  className="w-full rounded-2xl border border-purple-900/60 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-purple-400/30 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-purple-200 flex items-center space-x-1.5">
                    <Lock className="h-3.5 w-3.5 text-amber-400" />
                    <span>Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('forgot');
                      setForgotEmail(signInEmail);
                      setErrorMessage(null);
                    }}
                    className="text-[11px] text-amber-300 hover:text-amber-200 underline underline-offset-2"
                  >
                    Forgot Password?
                  </button>
                </div>
                
                <div className="relative">
                  <input
                    type={showSignInPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-purple-900/60 bg-slate-950 px-4 py-2.5 pr-10 text-sm text-slate-100 placeholder-purple-400/30 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-2.5 text-purple-400 hover:text-purple-200"
                  >
                    {showSignInPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="remember-me-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-purple-800 bg-slate-950 text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="remember-me-checkbox" className="text-xs text-purple-200/80 cursor-pointer">
                  Remember my session on this device
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>Sign In to Sanctuary</span>
                  </>
                )}
              </button>

              {/* Switch to Register link */}
              <div className="text-center pt-2">
                <p className="text-xs text-purple-300">
                  New to Cosmic Breadcrumbs?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setErrorMessage(null);
                    }}
                    className="text-amber-300 font-bold hover:underline"
                  >
                    Create a Free Account
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* 2. CREATE ACCOUNT TAB */}
          {/* ========================================================================= */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-purple-200 flex items-center space-x-1.5">
                  <User className="h-3.5 w-3.5 text-amber-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="e.g. Seraphina Starling"
                  className="w-full rounded-2xl border border-purple-900/60 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-purple-400/30 focus:border-amber-400 focus:outline-none transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-purple-200 flex items-center space-x-1.5">
                  <Mail className="h-3.5 w-3.5 text-amber-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="seeker@cosmicbreadcrumbs.com"
                  className="w-full rounded-2xl border border-purple-900/60 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-purple-400/30 focus:border-amber-400 focus:outline-none transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-purple-200 flex items-center space-x-1.5">
                  <Lock className="h-3.5 w-3.5 text-amber-400" />
                  <span>Password (Min. 6 Characters)</span>
                </label>
                <div className="relative">
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-purple-900/60 bg-slate-950 px-4 py-2.5 pr-10 text-sm text-slate-100 placeholder-purple-400/30 focus:border-amber-400 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3 top-2.5 text-purple-400 hover:text-purple-200"
                  >
                    {showSignUpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Date & Time of Birth */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-purple-200 flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5 text-purple-400" />
                    <span>Birth Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={signUpBirthDate}
                    onChange={(e) => setSignUpBirthDate(e.target.value)}
                    className="w-full rounded-2xl border border-purple-900/60 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-purple-200 flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5 text-purple-400" />
                    <span>Birth Time (Opt.)</span>
                  </label>
                  <input
                    type="time"
                    value={signUpBirthTime}
                    onChange={(e) => setSignUpBirthTime(e.target.value)}
                    className="w-full rounded-2xl border border-purple-900/60 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Birth Place */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-purple-200 flex items-center space-x-1.5">
                    <MapPin className="h-3.5 w-3.5 text-purple-400" />
                    <span>Birth City & State</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    disabled={isDetectingLoc}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono"
                  >
                    {isDetectingLoc ? 'Detecting...' : '📍 Detect GPS'}
                  </button>
                </div>
                <input
                  type="text"
                  value={signUpBirthPlace}
                  onChange={(e) => setSignUpBirthPlace(e.target.value)}
                  placeholder="e.g. Sedona, Arizona"
                  className="w-full rounded-2xl border border-purple-900/60 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-purple-400/30 focus:border-amber-400 focus:outline-none transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-95 transition-all cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>Create Sanctuary Account</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <p className="text-xs text-purple-300">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signin');
                      setErrorMessage(null);
                    }}
                    className="text-amber-300 font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* 3. FORGOT PASSWORD TAB */}
          {/* ========================================================================= */}
          {activeTab === 'forgot' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-purple-800/40 pb-2">
                <KeyRound className="h-4 w-4 text-amber-400" />
                <h4 className="font-serif text-sm font-bold text-slate-100">
                  Reset Sanctuary Password
                </h4>
              </div>

              {forgotSuccessMessage ? (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-center space-y-3">
                  <Check className="h-8 w-8 text-emerald-400 mx-auto" />
                  <p className="text-xs text-emerald-200 leading-relaxed">
                    {forgotSuccessMessage}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signin');
                      setForgotSuccessMessage(null);
                    }}
                    className="rounded-xl bg-purple-900 border border-purple-500/60 px-4 py-2 text-xs font-bold text-white hover:bg-purple-800"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-3.5">
                  <p className="text-xs text-purple-200/90 leading-relaxed">
                    Enter the email address registered with your account and we will dispatch a sacred password reset link to you:
                  </p>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-purple-200 flex items-center space-x-1.5">
                      <Mail className="h-3.5 w-3.5 text-amber-400" />
                      <span>Registered Email</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="seeker@cosmicbreadcrumbs.com"
                      className="w-full rounded-2xl border border-purple-900/60 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-purple-400/30 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('signin');
                        setErrorMessage(null);
                      }}
                      className="rounded-xl border border-purple-900/60 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-purple-950/40"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:opacity-95"
                    >
                      {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
