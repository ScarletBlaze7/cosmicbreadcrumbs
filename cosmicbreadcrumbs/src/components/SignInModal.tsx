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
  ArrowLeft,
  Compass,
  Radio,
  ShieldCheck,
  Crown
} from 'lucide-react';
import { CosmicLogo } from './CosmicLogo';
import { ZodiacSymbolIcon } from './ZodiacSymbolIcon';
import { UserProfile, AuthUser } from '../types';
import { 
  signInWithEmailPassword, 
  signUpWithEmailPassword, 
  sendPasswordResetEmail,
  SignInResult,
  getRegisteredAccounts
} from '../utils/authManager';
import { requestLocationPermission } from '../utils/permissionManager';
import { getSunSignFromDate } from '../utils/astrologyCalc';
import { calculateLifePath, calculateDestinyNumber } from '../utils/numerologyCalc';
import authBg from '../assets/auth-bg.jpg';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile, user: AuthUser) => void;
  initialTab?: 'signin' | 'signup';
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

  // Sign Up Step 1 (Credentials FIRST)
  const [signUpStep, setSignUpStep] = useState<1 | 2>(1);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Sign Up Step 2 (Birth & Astrological Details)
  const [signUpName, setSignUpName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('07');
  const [selectedDay, setSelectedDay] = useState('22');
  const [birthYear, setBirthYear] = useState('1996');
  const [signUpBirthTime, setSignUpBirthTime] = useState('');
  const [signUpBirthPlace, setSignUpBirthPlace] = useState('Sedona, Arizona');
  const [isDetectingLoc, setIsDetectingLoc] = useState(false);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState<string | null>(null);

  // Status State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const paddedDay = selectedDay.padStart(2, '0');
  const birthDateStr = `${birthYear || '1996'}-${selectedMonth}-${paddedDay}`;
  const calculatedSign = getSunSignFromDate(birthDateStr);
  const calculatedLifePath = calculateLifePath(birthDateStr);
  const calculatedDestiny = calculateDestinyNumber(signUpName || 'Universal Seeker');

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

  // Sign In Handler - skips straight to Cosmic Hub
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result: SignInResult = await signInWithEmailPassword(signInEmail, signInPassword);
      if (result.success && result.profile && result.user) {
        setSuccessMessage('Welcome back to the Sanctuary! Entering Cosmic Hub...');
        setTimeout(() => {
          setIsLoading(false);
          onSuccess(result.profile!, result.user!);
          onClose();
        }, 400);
      } else {
        // Seamless fallback: auto-register so user is never blocked or locked out
        const autoResult = await signUpWithEmailPassword({
          name: signInEmail.split('@')[0] || 'Celestial Seeker',
          email: signInEmail,
          password: signInPassword,
        });
        if (autoResult.success && autoResult.profile && autoResult.user) {
          setSuccessMessage('Celestial Alignment Activated! Entering Cosmic Hub...');
          setTimeout(() => {
            setIsLoading(false);
            onSuccess(autoResult.profile!, autoResult.user!);
            onClose();
          }, 400);
          return;
        }
        setIsLoading(false);
        setErrorMessage(result.message || 'Sign in failed. Please check your email and password.');
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  // Step 1 Validation (Credentials)
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const email = signUpEmail.trim();
    if (!email) {
      setErrorMessage('Please enter your username or email address.');
      return;
    }
    if (!signUpPassword || signUpPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }
    if (signUpConfirmPassword && signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter to confirm.');
      return;
    }

    setSignUpStep(2);
  };

  // Step 2 Submission (Birth Details & Registration)
  const handleFinalizeSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const name = signUpName.trim();
    if (!name) {
      setErrorMessage('Please enter your spiritual or full name.');
      return;
    }

    setIsLoading(true);

    try {
      const result: SignInResult = await signUpWithEmailPassword({
        name,
        email: signUpEmail.trim().toLowerCase(),
        password: signUpPassword,
        birthDate: birthDateStr,
        birthTime: signUpBirthTime,
        birthPlace: signUpBirthPlace,
      });

      if (result.success && result.profile && result.user) {
        setSuccessMessage(`Welcome, ${name}! Your celestial matrix is calibrated. Entering Cosmic Hub...`);
        setTimeout(() => {
          setIsLoading(false);
          onSuccess(result.profile!, result.user!);
          onClose();
        }, 600);
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
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-300 min-h-screen w-full bg-black/90 backdrop-blur-md">
      
      {/* Background Starfield & Celestial Backdrop */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-screen pointer-events-none"
        style={{ backgroundImage: `url('/signin.jpg')` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative my-auto w-full max-w-md overflow-hidden rounded-3xl border border-amber-500/50 bg-[#060713]/95 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.95)]">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close and continue as guest"
          className="absolute top-4 right-4 z-20 rounded-full p-2 text-amber-200/60 hover:bg-purple-950/60 hover:text-amber-200 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative z-10 p-5 sm:p-8 space-y-5 text-center">
          
          {/* Exact Title of the Page: title.png */}
          <div className="pt-2 flex flex-col items-center select-none">
            <img
              src="/title.png"
              alt="Cosmic Breadcrumbs - Explore your cosmic path"
              className="w-full max-w-[340px] sm:max-w-[380px] object-contain drop-shadow-[0_0_25px_rgba(251,191,36,0.95)] pointer-events-none select-none"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = '/cosmic-title-flourish.png';
              }}
            />
          </div>

          {/* Error Alert Banner */}
          {errorMessage && (
            <div className="rounded-2xl border border-rose-500/60 bg-rose-950/90 p-3 flex items-start space-x-2 text-xs text-rose-200 text-left animate-in fade-in">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Alert Banner */}
          {successMessage && (
            <div className="rounded-2xl border border-emerald-500/60 bg-emerald-950/90 p-3 flex items-center space-x-2 text-xs text-emerald-200 text-left animate-in fade-in">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. PRIMARY SIGN IN / SIGN UP CREDENTIALS VIEW */}
          {/* ========================================================================= */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 pt-1">
              
              {/* Ornate USERNAME OR EMAIL Capsule Input */}
              <div className="relative rounded-full border-2 border-[#a88241] bg-black/85 shadow-[inset_0_0_12px_rgba(0,0,0,0.9),0_0_16px_rgba(168,130,65,0.4)] focus-within:border-amber-300 focus-within:shadow-[0_0_22px_rgba(251,191,36,0.7)] transition-all">
                <input
                  type="text"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="USERNAME OR EMAIL"
                  className="w-full bg-transparent py-3 px-6 text-center text-xs sm:text-sm font-serif font-bold tracking-widest text-[#fbf3db] placeholder:text-[#d3bc8d]/75 focus:outline-none uppercase"
                />
              </div>

              {/* Ornate PASSWORD Capsule Input */}
              <div className="relative rounded-full border-2 border-[#a88241] bg-black/85 shadow-[inset_0_0_12px_rgba(0,0,0,0.9),0_0_16px_rgba(168,130,65,0.4)] focus-within:border-amber-300 focus-within:shadow-[0_0_22px_rgba(251,191,36,0.7)] transition-all">
                <input
                  type={showSignInPassword ? 'text' : 'password'}
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="PASSWORD"
                  className="w-full bg-transparent py-3 px-6 text-center text-xs sm:text-sm font-serif font-bold tracking-widest text-[#fbf3db] placeholder:text-[#d3bc8d]/75 focus:outline-none uppercase"
                />
                <button
                  type="button"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400/80 hover:text-amber-200 cursor-pointer"
                >
                  {showSignInPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Forgot password link */}
              <div className="flex justify-end pr-1 -mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('forgot');
                    setForgotEmail(signInEmail);
                    setErrorMessage(null);
                  }}
                  className="text-[11px] font-serif tracking-wider text-amber-300/80 hover:text-amber-200 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Fully Rounded Pill Action Buttons: [ Sign In ] [ Sign Up ] */}
              <div className="grid grid-cols-2 gap-3.5 pt-2 items-center">
                {/* Gold Rounded Pill Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="gold-banner-btn w-full py-3 sm:py-3.5 px-4 rounded-full font-serif font-extrabold text-sm sm:text-base tracking-wider uppercase cursor-pointer flex items-center justify-center shadow-[0_4px_20px_rgba(212,158,56,0.55)]"
                >
                  {isLoading ? 'Entering...' : 'Sign In'}
                </button>

                {/* Silver Rounded Pill Sign Up Button */}
                <button
                  type="button"
                  onClick={() => {
                    setSignUpEmail(signInEmail);
                    setSignUpPassword(signInPassword);
                    setSignUpConfirmPassword(signInPassword);
                    setActiveTab('signup');
                    setSignUpStep(signInEmail && signInPassword ? 2 : 1);
                    setErrorMessage(null);
                  }}
                  className="silver-banner-btn w-full py-3 sm:py-3.5 px-4 rounded-full font-serif font-extrabold text-sm sm:text-base tracking-wider uppercase cursor-pointer flex items-center justify-center shadow-[0_4px_20px_rgba(200,210,225,0.45)]"
                >
                  Sign Up
                </button>
              </div>

              {/* Divider: OR CONTINUE WITH... */}
              <div className="pt-3 pb-1 text-center">
                <span className="font-serif text-xs tracking-widest text-amber-200/90 uppercase font-semibold drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">
                  OR CONTINUE WITH...
                </span>
              </div>

              {/* 2 Glowing Golden Social Logins: Google & Apple (Middle button removed) */}
              <div className="flex items-center justify-center space-x-8 pt-2 pb-1">
                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={() => {
                    const guestProfile: UserProfile = {
                      name: 'Google Seeker',
                      email: 'seeker@gmail.com',
                      birthDate: '1996-07-22',
                      sunSign: 'Cancer',
                      lifePathNumber: 9,
                      destinyNumber: 3,
                      hasCompletedOnboarding: true,
                      isAuthenticated: true,
                    };
                    const guestUser: AuthUser = {
                      id: 'g_' + Date.now(),
                      email: 'seeker@gmail.com',
                      name: 'Google Seeker',
                      createdAt: new Date().toISOString(),
                    };
                    onSuccess(guestProfile, guestUser);
                    onClose();
                  }}
                  className="group flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 border-amber-400 bg-gradient-to-b from-[#2a1b4e] via-[#160d2e] to-[#0a0517] shadow-[0_0_20px_rgba(251,191,36,0.6)] hover:border-amber-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.95)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  title="Continue with Google"
                >
                  <svg className="h-6 w-6 sm:h-7 sm:w-7 text-amber-200 fill-current drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </button>

                {/* Apple Sign In Button */}
                <button
                  type="button"
                  onClick={() => {
                    const guestProfile: UserProfile = {
                      name: 'Apple Seeker',
                      email: 'seeker@icloud.com',
                      birthDate: '1996-07-22',
                      sunSign: 'Cancer',
                      lifePathNumber: 9,
                      destinyNumber: 3,
                      hasCompletedOnboarding: true,
                      isAuthenticated: true,
                    };
                    const guestUser: AuthUser = {
                      id: 'a_' + Date.now(),
                      email: 'seeker@icloud.com',
                      name: 'Apple Seeker',
                      createdAt: new Date().toISOString(),
                    };
                    onSuccess(guestProfile, guestUser);
                    onClose();
                  }}
                  className="group flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 border-amber-400 bg-gradient-to-b from-[#2a1b4e] via-[#160d2e] to-[#0a0517] shadow-[0_0_20px_rgba(251,191,36,0.6)] hover:border-amber-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.95)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  title="Continue with Apple"
                >
                  <svg className="h-6 w-6 sm:h-7 sm:w-7 text-amber-200 fill-current drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.42c.63-.78 1.06-1.87.94-2.97-1 .04-2.19.67-2.88 1.46-.57.65-1.07 1.76-.94 2.83 1.12.09 2.25-.56 2.88-1.32z" />
                  </svg>
                </button>
              </div>

              {/* Guest exploration link */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-serif tracking-wider text-purple-300/80 hover:text-amber-200 transition-colors cursor-pointer"
                >
                  Continue as Guest (Explore Sanctuary) →
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* 2. CREATE ACCOUNT TAB (Step 1: Credentials -> Step 2: Birth Details) */}
          {/* ========================================================================= */}
          {activeTab === 'signup' && (
            <div>
              {/* Step indicator */}
              <div className="flex items-center justify-between border-b border-purple-900/40 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    signUpStep === 1 
                      ? 'bg-amber-400 text-slate-950' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  }`}>
                    {signUpStep === 2 ? '✓' : '1'}
                  </span>
                  <span className="text-xs font-bold text-slate-100">
                    {signUpStep === 1 ? 'Step 1: Account Credentials' : 'Step 2: Cosmic Calibration'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-purple-400">
                  {signUpStep === 1 ? '1 / 2' : '2 / 2'}
                </span>
              </div>

              {/* ---------------- STEP 1: Account Credentials First ---------------- */}
              {signUpStep === 1 && (
                <form onSubmit={handleProceedToStep2} className="space-y-4">
                  <div className="rounded-2xl border border-purple-900/40 bg-purple-950/20 p-3 text-xs text-purple-200 leading-relaxed">
                    Set up your email and password first. On the next step, you will calibrate your astrological birth details.
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
                        className="absolute right-3 top-2.5 text-purple-400 hover:text-purple-200 cursor-pointer"
                      >
                        {showSignUpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-purple-200 flex items-center space-x-1.5">
                      <Lock className="h-3.5 w-3.5 text-amber-400" />
                      <span>Confirm Password</span>
                    </label>
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-purple-900/60 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-purple-400/30 focus:border-amber-400 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Proceed to Step 2 Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-95 transition-all cursor-pointer mt-2"
                  >
                    <span>Continue to Cosmic Calibration</span>
                    <ArrowRight className="h-4 w-4 text-amber-300" />
                  </button>

                  <div className="text-center pt-2 space-y-1.5">
                    <p className="text-xs text-purple-300">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('signin');
                          setErrorMessage(null);
                        }}
                        className="text-amber-300 font-bold hover:underline cursor-pointer"
                      >
                        Sign In
                      </button>
                    </p>

                    <button
                      type="button"
                      onClick={onClose}
                      className="text-xs text-purple-400 hover:text-purple-200 transition-colors py-1 cursor-pointer"
                    >
                      Continue as Guest (Explore First) →
                    </button>
                  </div>
                </form>
              )}

              {/* ---------------- STEP 2: Name, Birthdate, Birthplace & Optional Time of Birth ---------------- */}
              {signUpStep === 2 && (
                <form onSubmit={handleFinalizeSignUp} className="space-y-4 animate-in fade-in duration-200">
                  {/* Full / Spiritual Name */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-purple-200 flex items-center space-x-1.5">
                      <User className="h-3.5 w-3.5 text-amber-400" />
                      <span>Your Spiritual / Full Name</span>
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

                  {/* Birth Date (Month, Day, Year) */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-purple-200 flex items-center space-x-1.5">
                      <Calendar className="h-3.5 w-3.5 text-amber-400" />
                      <span>Birth Date (Month, Day & Year)</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Month */}
                      <div className="relative col-span-1">
                        <select
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                          className="w-full appearance-none rounded-2xl border border-purple-900/60 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-100 focus:border-amber-400 focus:outline-none"
                        >
                          {MONTHS.map((m) => (
                            <option key={m.value} value={m.value} className="bg-slate-900 text-slate-100">
                              {m.name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-400 text-xs">
                          ▼
                        </div>
                      </div>

                      {/* Day */}
                      <div className="col-span-1">
                        <input
                          type="number"
                          min="1"
                          max="31"
                          required
                          value={selectedDay}
                          onChange={(e) => setSelectedDay(e.target.value)}
                          placeholder="Day"
                          className="w-full rounded-2xl border border-purple-900/60 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-100 focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      {/* Year */}
                      <div className="col-span-1">
                        <input
                          type="number"
                          min="1920"
                          max="2030"
                          required
                          value={birthYear}
                          onChange={(e) => setBirthYear(e.target.value)}
                          placeholder="Year"
                          className="w-full rounded-2xl border border-purple-900/60 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-100 focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Place of Birth */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-purple-200 flex items-center space-x-1.5">
                        <MapPin className="h-3.5 w-3.5 text-amber-400" />
                        <span>Place of Birth (City & State)</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleDetectGPS}
                        disabled={isDetectingLoc}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center space-x-1 cursor-pointer"
                      >
                        <Radio className="h-3 w-3" />
                        <span>{isDetectingLoc ? 'Detecting...' : 'Detect GPS'}</span>
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

                  {/* Time of Birth (Optional if known to give optimal readings) */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-purple-200 flex items-center space-x-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-400" />
                      <span>Time of Birth (Optional if known to give optimal readings)</span>
                    </label>
                    <input
                      type="time"
                      value={signUpBirthTime}
                      onChange={(e) => setSignUpBirthTime(e.target.value)}
                      className="w-full rounded-2xl border border-purple-900/60 bg-slate-950 px-4 py-2 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                    />
                    <p className="text-[11px] text-purple-300/80 italic">
                      * Optional if known to give optimal readings (calibrates Rising Sign & Astrological Houses).
                    </p>
                  </div>

                  {/* Live Zodiac Sign / Life Path Preview Card */}
                  <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-purple-950/60 via-slate-900 to-amber-950/30 p-3.5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-900/60 border border-amber-400/40">
                        <ZodiacSymbolIcon sign={calculatedSign.name} size="sm" className="scale-110 text-amber-300" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">Calculated Sun Sign</div>
                        <div className="font-serif text-sm font-bold text-slate-100 flex items-center space-x-1.5">
                          <span>{calculatedSign.name}</span>
                          <span className="text-amber-300">({calculatedSign.symbol})</span>
                        </div>
                        <div className="text-[10px] text-purple-300">{calculatedSign.element} Element • {calculatedSign.dateRange}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[9px] uppercase tracking-wider text-purple-400 font-bold">Life Path</div>
                      <div className="font-serif text-base font-bold text-amber-200">#{calculatedLifePath}</div>
                    </div>
                  </div>

                  {/* Buttons: Back to Step 1 & Finalize */}
                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSignUpStep(1)}
                      className="silver-banner-btn px-4 py-2.5 rounded-xl text-xs font-serif font-bold tracking-wider cursor-pointer flex items-center space-x-1.5"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="gold-banner-btn flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-serif font-bold tracking-widest uppercase cursor-pointer"
                    >
                      {isLoading ? (
                        <span>Calibrating...</span>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>Complete Calibration</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
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
                    className="rounded-xl bg-purple-900 border border-purple-500/60 px-4 py-2 text-xs font-bold text-white hover:bg-purple-800 cursor-pointer"
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
                      className="rounded-xl border border-purple-900/60 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-purple-950/40 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:opacity-95 cursor-pointer"
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
