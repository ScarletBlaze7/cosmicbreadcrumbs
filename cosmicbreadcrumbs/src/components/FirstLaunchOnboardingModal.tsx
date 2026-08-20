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
  MapPin 
} from 'lucide-react';
import { CosmicLogo } from './CosmicLogo';
import { ZodiacSymbolIcon } from './ZodiacSymbolIcon';
import { getSunSignFromDate } from '../utils/astrologyCalc';
import { calculateLifePath, calculateDestinyNumber } from '../utils/numerologyCalc';
import { triggerFireworks } from '../utils/fireworks';
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
  const [name, setName] = useState('Universal Seeker');
  const [selectedMonth, setSelectedMonth] = useState('07');
  const [selectedDay, setSelectedDay] = useState('22');
  const [birthYear, setBirthYear] = useState('1996');
  const [birthTime, setBirthTime] = useState('11:11');
  const [birthPlace, setBirthPlace] = useState('Sedona, Arizona');
  const [isCalculated, setIsCalculated] = useState(false);

  if (!isOpen) return null;

  const paddedDay = selectedDay.padStart(2, '0');
  const birthDateStr = `${birthYear || '1996'}-${selectedMonth}-${paddedDay}`;
  const calculatedSign = getSunSignFromDate(birthDateStr);
  const calculatedLifePath = calculateLifePath(birthDateStr);
  const calculatedDestiny = calculateDestinyNumber(name || 'Universal Seeker');

  const handleDiscoverSign = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculated(true);
  };

  const handleConfirmAndEnter = () => {
    const newProfile: UserProfile = {
      name: name.trim() || 'Universal Seeker',
      birthDate: birthDateStr,
      birthTime: birthTime || '11:11',
      birthPlace: birthPlace || '',
      sunSign: calculatedSign.name,
      lifePathNumber: calculatedLifePath,
      destinyNumber: calculatedDestiny,
      numerologySystem: 'chaldean',
      birthDateChangeCount: 0, // Freshly created on first download
      hasCompletedOnboarding: true,
    };

    onComplete(newProfile);
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
            Find Your Zodiac Sign
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/90 max-w-md mx-auto leading-relaxed">
            Enter your birthday below to instantly discover your exact Sun Sign, Chaldean root frequency, and cosmic blueprint.
          </p>
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[72vh] overflow-y-auto">
          {!isCalculated ? (
            <form onSubmit={handleDiscoverSign} className="space-y-4">
              {/* Seeker Name */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1 flex items-center space-x-1.5">
                  <User className="h-3.5 w-3.5 text-amber-400" />
                  <span>Your Spiritual Name</span>
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

              {/* Month & Day (The Core Find Your Zodiac Sign Controls) */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1 flex items-center space-x-1.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-400" />
                  <span>Your Birth Date (Month & Day)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Month */}
                  <div className="relative">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full appearance-none rounded-2xl border border-purple-800/70 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-100 focus:border-amber-400 focus:outline-none"
                    >
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value} className="bg-slate-900 text-slate-100">
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 text-xs">
                      ▼
                    </div>
                  </div>

                  {/* Day */}
                  <div>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      required
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}
                      placeholder="Day (1-31)"
                      className="w-full rounded-2xl border border-purple-800/70 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-100 placeholder-purple-400/40 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Year & Time for Full Matrix Accuracy */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-purple-300 mb-1">
                    Birth Year (Optional)
                  </label>
                  <input
                    type="number"
                    min="1920"
                    max="2030"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    placeholder="1996"
                    className="w-full rounded-2xl border border-purple-900/70 bg-slate-900/80 px-3.5 py-2.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-purple-300 mb-1">
                    Birth City (Optional)
                  </label>
                  <input
                    type="text"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    placeholder="e.g. Sedona, AZ"
                    className="w-full rounded-2xl border border-purple-900/70 bg-slate-900/80 px-3.5 py-2.5 text-xs text-slate-100 placeholder-purple-400/40 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Notice regarding change limitations */}
              <div className="rounded-2xl border border-purple-800/40 bg-purple-950/30 p-3.5 text-xs text-purple-300/90 leading-relaxed flex items-start space-x-2.5">
                <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Cosmic Matrix Security:</strong> You will be allowed to update your birthdate up to <strong>2 times</strong> directly in your account if entered incorrectly.
                </span>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 py-3.5 px-6 font-serif text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 transition-all active:scale-[0.99]"
              >
                <Compass className="h-4 w-4" />
                <span>Find My Zodiac Sign Now</span>
              </button>
            </form>
          ) : (
            /* Reveal Step: Calculated Sign & Initiation Card */
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

                <p className="text-xs text-purple-100/90 leading-relaxed italic border-t border-purple-900/40 pt-3">
                  "{calculatedSign.traits.strengths.slice(0, 3).join(', ')} — your soul carries celestial radiance and deep intuitive awareness."
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleConfirmAndEnter}
                  className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 py-3.5 px-6 font-serif text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 transition-all active:scale-[0.99]"
                >
                  <Check className="h-4 w-4" />
                  <span>Confirm & Enter Cosmic Sanctuary</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCalculated(false)}
                  className="w-full text-center text-xs text-purple-400 hover:text-purple-200 transition-colors py-1.5"
                >
                  ← Edit Date or Name
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
