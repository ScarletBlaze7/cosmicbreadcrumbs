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
        }, 500);
      } else {
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

    const email = signUpEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!signUpPassword || signUpPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter to confirm.');
      return;
    }

    const accounts = getRegisteredAccounts();
    if (accounts[email]) {
      setErrorMessage('An account with this email already exists. Please Sign In.');
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
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative my-6 w-full max-w-lg overflow-hidden rounded-3xl border-2 border-purple-800/80 bg-slate-900 shadow-2xl shadow-purple-950/90">
        
        {/* Glow Header */}
        <div className="relative border-b border-purple-800/50 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-5 sm:p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:bg-purple-900/40 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center space-y-2">
            <CosmicLogo size="md" showUploadTrigger={false} />
            <h3 className="font-serif text-xl font-bold text-slate-100">
              Cosmic Breadcrumbs
            </h3>
            <p className="text-xs text-purple-300/80">
              Your Daily Personalized Cosmic Sanctuary & Hub
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
                className={`rounded-xl py-2 text-xs font-bold font-sans tracking-wide transition-all cursor-pointer ${
                  activeTab === 'signin'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                Sign In (Existing User)
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setSignUpStep(1);
                  setErrorMessage(null);
                }}
                className={`rounded-xl py-2 text-xs font-bold font-sans tracking-wide transition-all cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                Create Account (New Seeker)
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[74vh] overflow-y-auto">
          
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
          {/* 1. SIGN IN TAB (Skips straight to Cosmic Hub) */}
          {/* ========================================================================= */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="rounded-2xl border border-purple-900/50 bg-purple-950/30 p-3 text-xs text-purple-200 flex items-center space-x-2">
                <Crown className="h-4 w-4 text-amber-300 shrink-0" />
                <span>Sign in below to immediately access your customized <strong>Cosmic Hub</strong>.</span>
              </div>

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
                    className="text-[11px] text-amber-300 hover:text-amber-200 underline underline-offset-2 cursor-pointer"
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
                    className="absolute right-3 top-2.5 text-purple-400 hover:text-purple-200 cursor-pointer"
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
                className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>Sign In & Open Cosmic Hub</span>
                  </>
                )}
              </button>

              {/* Switch to Register link */}
              <div className="text-center pt-2 space-y-1.5">
                <p className="text-xs text-purple-300">
                  New to Cosmic Breadcrumbs?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setSignUpStep(1);
                      setErrorMessage(null);
                    }}
                    className="text-amber-300 font-bold hover:underline cursor-pointer"
                  >
                    Create a Free Account
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
                      className="rounded-2xl border border-purple-800 bg-slate-950 px-4 py-3 text-xs font-semibold text-purple-200 hover:bg-purple-900/40 transition-colors flex items-center space-x-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 transition-all active:scale-95 cursor-pointer"
                    >
                      {isLoading ? (
                        <span>Calibrating...</span>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>Complete & Enter Cosmic Hub</span>
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
