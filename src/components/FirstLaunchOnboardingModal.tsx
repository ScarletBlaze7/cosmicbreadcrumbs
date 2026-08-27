import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
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
  EyeOff
} from 'lucide-react';
import { CosmicLogo } from './CosmicLogo';
import { ZodiacSymbolIcon } from './ZodiacSymbolIcon';
import { getSunSignFromDate } from '../utils/astrologyCalc';
import { calculateLifePath, calculateDestinyNumber } from '../utils/numerologyCalc';
import { registerAccount, loginAccount } from '../utils/authManager';
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
  const [name, setName] = useState('Universal Seeker');
  const [selectedMonth, setSelectedMonth] = useState('07');
  const [selectedDay, setSelectedDay] = useState('22');
  const [birthYear, setBirthYear] = useState('1996');
  const [birthTime, setBirthTime] = useState('11:11');
  const [birthPlace, setBirthPlace] = useState('Sedona, Arizona');

  // Account creation inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [isSignInMode, setIsSignInMode] = useState(false);

  if (!isOpen) return null;

  const paddedDay = selectedDay.padStart(2, '0');
  const birthDateStr = `${birthYear || '1996'}-${selectedMonth}-${paddedDay}`;
  const calculatedSign = getSunSignFromDate(birthDateStr);
  const calculatedLifePath = calculateLifePath(birthDateStr);
  const calculatedDestiny = calculateDestinyNumber(name || 'Universal Seeker');

  const handleDiscoverSign = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('reveal');
  };

  const finishOnboarding = (profileData?: Partial<UserProfile>) => {
    const finalProfile: UserProfile = {
      name: name.trim() || 'Universal Seeker',
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

    if (!email.trim() || !email.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmittingAuth(true);
    try {
      if (isSignInMode) {
        const res = await loginAccount(email, password);
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
        }
      } else {
        const res = await registerAccount(email, password);
        if (res.success && res.user) {
          setStep('birthdate');
        } else {
          setAuthError(res.error || 'Failed to create account.');
        }
      }
    } finally {
      setIsSubmittingAuth(false);
    }
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
              ? (isSignInMode ? 'Sign In to Your Sanctuary' : 'Create Your Cosmic Account')
              : step === 'birthdate'
              ? 'Find Your Zodiac Sign'
              : 'Your Celestial Matrix Reveal'}
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/90 max-w-md mx-auto leading-relaxed">
            {step === 'account'
              ? 'Sign in or create your account to sync your sacred readings, birth matrix, and journal across all devices.'
              : step === 'birthdate'
              ? 'Enter your birth details below to discover your exact Sun Sign, Chaldean root frequency, and cosmic blueprint.'
              : 'Your cosmic blueprint and divine attributes have been calculated from the celestial sphere.'}
          </p>
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[72vh] overflow-y-auto">
          
          {/* STEP 1: SIGN IN / CREATE ACCOUNT */}
          {step === 'account' && (
            <form onSubmit={handleAccountSubmit} className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => { setIsSignInMode(false); setAuthError(null); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                    !isSignInMode
                      ? 'bg-purple-900/80 border-purple-400 text-white'
                      : 'bg-[#18142b] border-[#241f3d] text-gray-400'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => { setIsSignInMode(true); setAuthError(null); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                    isSignInMode
                      ? 'bg-purple-900/80 border-purple-400 text-white'
                      : 'bg-[#18142b] border-[#241f3d] text-gray-400'
                  }`}
                >
                  Sign In
                </button>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 text-center font-medium">
                  {authError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-purple-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seeker@example.com"
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
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-purple-800/70 rounded-xl py-2.5 pl-9 pr-10 text-sm text-white focus:border-amber-400 outline-none placeholder:text-gray-500"
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
                  className="w-full text-center text-xs text-purple-300 hover:text-white transition-colors py-2"
                >
                  Skip & Continue as Guest Seeker
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: FIND YOUR ZODIAC SIGN & BIRTH MATRIX */}
          {step === 'birthdate' && (
            <form onSubmit={handleDiscoverSign} className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1 flex items-center space-x-1.5">
                  <User className="h-3.5 w-3.5 text-amber-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
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
                      className="w-full appearance-none rounded-2xl border border-purple-800/70 bg-slate-900 px-3.5 py-3 text-xs sm:text-sm font-medium text-slate-100 focus:border-amber-400 focus:outline-none"
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
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      placeholder="Year (1996)"
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
                    <span>Place of Birth</span>
                  </label>
                  <input
                    type="text"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    placeholder="e.g. Sedona, Arizona"
                    className="w-full rounded-2xl border border-purple-800/70 bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-purple-400/40 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1 flex items-center space-x-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    <span>Time of Birth</span>
                  </label>
                  <input
                    type="time"
                    value={birthTime}
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
