import React, { useState, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Compass, 
  Check, 
  Camera, 
  Crown, 
  Gift, 
  ShieldCheck,
  Upload,
  RotateCcw,
  Image as ImageIcon,
  AlertTriangle,
  Mail,
  HelpCircle,
  Lock,
  MessageSquare
} from 'lucide-react';
import { UserProfile, MembershipStatus } from '../types';
import { getSunSignFromDate } from '../utils/astrologyCalc';
import { calculateLifePath, calculateDestinyNumber } from '../utils/numerologyCalc';
import { CosmicLogo } from './CosmicLogo';
import { ZodiacSymbolIcon } from './ZodiacSymbolIcon';
import { SanctuaryEmblem } from './SanctuaryEmblem';
import { getTrialTimeRemaining } from '../utils/membership';


interface ProfileModalProps {
  onOpenAuth?: () => void;
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  membership?: MembershipStatus;
  onOpenMembership?: () => void;
}

const MAX_BIRTHDATE_CHANGES = 2;

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  membership,
  onOpenMembership,
  onOpenAuth,
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...userProfile });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSentSuccess, setSupportSentSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentChangeCount = userProfile.birthDateChangeCount ?? 0;
  const changesRemaining = Math.max(0, MAX_BIRTHDATE_CHANGES - currentChangeCount);
  const isBirthdateLocked = changesRemaining <= 0;

  const trialTime = getTrialTimeRemaining(membership?.trialExpiryDate);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setFormData((prev) => ({ ...prev, avatarUrl: dataUrl }));
          
          // Auto-save immediately to main pages & localStorage
          const updated: UserProfile = {
            ...userProfile,
            avatarUrl: dataUrl,
          };
          onSaveProfile(updated);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleResetToZodiac = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: undefined }));
    const updated: UserProfile = {
      ...userProfile,
      avatarUrl: undefined,
    };
    onSaveProfile(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if birthdate was changed
    const birthDateChanged = formData.birthDate !== userProfile.birthDate;

    if (birthDateChanged && isBirthdateLocked) {
      alert('You have reached the maximum of 2 birthdate adjustments. Please message Support below to update your birthdate or personal details.');
      return;
    }

    const nextChangeCount = birthDateChanged ? currentChangeCount + 1 : currentChangeCount;
    const sunSign = getSunSignFromDate(formData.birthDate).name;
    const lifePathNumber = calculateLifePath(formData.birthDate);
    const destinyNumber = calculateDestinyNumber(formData.name);

    const updated: UserProfile = {
      ...formData,
      birthDateChangeCount: nextChangeCount,
      sunSign,
      lifePathNumber,
      destinyNumber,
    };

    onSaveProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleSendSupportRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSupportSentSuccess(true);
    setTimeout(() => {
      setSupportSentSuccess(false);
      setShowSupportModal(false);
      setSupportMessage('');
    }, 2200);
  };

  const previewSunSign = getSunSignFromDate(formData.birthDate || '1995-07-15');
  const previewLifePath = calculateLifePath(formData.birthDate || '1995-07-15');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-purple-900/60 bg-slate-900 shadow-2xl shadow-purple-950/50 animate-in fade-in zoom-in-95 duration-200">
        {/* Glow Header */}
        <div className="relative border-b border-purple-800/40 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CosmicLogo size="md" showUploadTrigger={true} />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif text-lg font-bold text-slate-100">
                    Your Cosmic Birth Matrix
                  </h3>
                  {membership && (
                    <SanctuaryEmblem
                      size="sm"
                      tier={membership.tier}
                      isUnlocked={membership.tier === 'weekly' || membership.tier === 'monthly' || membership.tier === 'lifetime'}
                      interactive={true}
                      onUpgradeClick={() => {
                        onClose();
                        onOpenMembership?.();
                      }}
                    />
                  )}
                </div>
                <p className="text-xs text-purple-300/80">
                  Cosmic Breadcrumbs • Personalize your Universal insights
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 hover:bg-purple-900/40 hover:text-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Matrix Banner */}
          <div className="mt-4 flex items-center justify-around rounded-xl border border-purple-800/30 bg-slate-950/60 p-2.5 text-center">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-purple-400">Sun Sign</span>
              <p className="text-sm font-semibold text-amber-300 flex items-center justify-center space-x-1.5 mt-0.5">
                <ZodiacSymbolIcon sign={previewSunSign.name} size="sm" fallbackText={previewSunSign.symbol} />
                <span>{previewSunSign.name}</span>
              </p>
            </div>
            <div className="h-8 w-px bg-purple-900/50" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-purple-400">Life Path</span>
              <p className="text-sm font-semibold text-purple-200">
                Number {previewLifePath}
              </p>
            </div>
            <div className="h-8 w-px bg-purple-900/50" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-purple-400">Element</span>
              <p className="text-sm font-semibold text-cyan-300">
                {previewSunSign.element}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Account Photo & Avatar Selection */}
          <div className="rounded-2xl border border-purple-800/50 bg-slate-950/70 p-4 space-y-3.5 shadow-inner">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-purple-200 flex items-center space-x-1.5">
                <Camera className="h-4 w-4 text-amber-400" />
                <span>My Account Photo & Avatar</span>
              </label>
              {formData.avatarUrl ? (
                <span className="text-[10px] text-amber-300 font-medium bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  Custom Photo Active
                </span>
              ) : (
                <span className="text-[10px] text-purple-300 font-medium bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-full">
                  Default: {previewSunSign.name} Zodiac Sign
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Active Avatar Display */}
              <div className="relative group shrink-0">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-amber-400 bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 shadow-xl shadow-purple-950/50">
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl}
                      alt="Account Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-amber-300">
                      <ZodiacSymbolIcon 
                        sign={previewSunSign.name} 
                        size="md" 
                        fallbackText={previewSunSign.symbol} 
                        className="scale-95 text-amber-300"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload / Change Photo"
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md transition-transform active:scale-95"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Controls & Guidance */}
              <div className="space-y-2 text-center sm:text-left flex-1">
                <p className="text-xs text-purple-200/90 leading-relaxed">
                  {formData.avatarUrl ? (
                    <>Your custom photo is active! You can upload a new photo, or restore your <strong>{previewSunSign.name}</strong> Zodiac sign.</>
                  ) : (
                    <>By default, your account displays your <strong>{previewSunSign.name} ({previewSunSign.symbol})</strong> Zodiac sign as your photo. You can choose or upload your own photo anytime!</>
                  )}
                </p>

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                  {/* File Upload Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="input-file-profile-photo"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center space-x-1.5 rounded-xl border border-amber-400/60 bg-gradient-to-r from-amber-500/20 to-purple-600/20 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:border-amber-300 hover:bg-amber-500/30 transition-all shadow-sm"
                  >
                    <Upload className="h-3.5 w-3.5 text-amber-400" />
                    <span>Upload Custom Photo</span>
                  </button>

                  {formData.avatarUrl && (
                    <button
                      type="button"
                      onClick={handleResetToZodiac}
                      className="inline-flex items-center space-x-1.5 rounded-xl border border-purple-800/60 bg-slate-900/90 px-2.5 py-1.5 text-xs font-medium text-purple-300 hover:bg-purple-900/40 hover:text-white transition-all"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-purple-400" />
                      <span>Use Zodiac Sign</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-purple-200 mb-1.5 flex items-center space-x-1.5">
              <User className="h-3.5 w-3.5 text-purple-400" />
              <span>Full Birth Name (for Destiny & Soul Urge Numbers)</span>
            </label>
            <input
              type="text"
              required
              id="input-profile-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Tiffany Carver"
              className="w-full rounded-xl border border-purple-900/60 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all"
            />
          </div>

          {/* Birth Date with 2-Times Edit Restriction & Support Warning */}
          <div className="space-y-2 rounded-2xl border border-purple-900/50 bg-slate-950/60 p-3.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-purple-200 flex items-center space-x-1.5">
                <Calendar className="h-3.5 w-3.5 text-purple-400" />
                <span>Date of Birth</span>
              </label>

              {/* Counter Badge */}
              <div className="flex items-center space-x-1.5">
                {isBirthdateLocked ? (
                  <span className="inline-flex items-center space-x-1 rounded-full bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                    <Lock className="h-3 w-3 text-rose-400" />
                    <span>Locked (0 of 2 edits left)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 rounded-full bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 text-[10px] font-bold text-amber-300 font-mono">
                    <span>{changesRemaining} of 2 edits remaining</span>
                  </span>
                )}
              </div>
            </div>

            <div className="relative">
              <input
                type="date"
                required
                disabled={isBirthdateLocked}
                id="input-profile-birthdate"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-100 transition-all ${
                  isBirthdateLocked
                    ? 'border-purple-950 bg-slate-900/50 text-slate-400 cursor-not-allowed'
                    : 'border-purple-900/60 bg-slate-950/80 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50'
                }`}
              />
              {isBirthdateLocked && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-rose-400 text-xs flex items-center space-x-1">
                  <Lock className="h-3.5 w-3.5" />
                </div>
              )}
            </div>

            {/* Explanation & Support Contact Box */}
            {isBirthdateLocked ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-3 space-y-2 text-xs">
                <div className="flex items-start space-x-2 text-rose-200">
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    You have used your <strong>2 allowed birthdate changes</strong>. To modify your birthdate or personal details further, please message our Support team below.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSupportModal(true)}
                  className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-rose-600/90 to-purple-700/90 hover:from-rose-500 hover:to-purple-600 py-2 px-3 text-xs font-semibold text-white shadow-md transition-all"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Message Support to Update Information</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[11px] text-purple-300/80 px-0.5">
                <span>Allowed to change 2 times if entered incorrectly.</span>
                <button
                  type="button"
                  onClick={() => setShowSupportModal(true)}
                  className="text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center space-x-1"
                >
                  <HelpCircle className="h-3 w-3" />
                  <span>Need Support?</span>
                </button>
              </div>
            )}
          </div>

          {/* Time & Place Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-purple-200 mb-1.5 flex items-center space-x-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span>Time of Birth</span>
              </label>
              <input
                type="time"
                id="input-profile-birthtime"
                value={formData.birthTime || ''}
                onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                className="w-full rounded-xl border border-purple-900/60 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 focus:border-amber-400 focus:outline-none transition-all"
              />
              <span className="block text-[10px] text-amber-300/90 mt-1 font-medium italic">
                (optional if known for optimal numerology readings)
              </span>
            </div>
            <div>
              <label className="block text-xs font-medium text-purple-200 mb-1.5 flex items-center space-x-1.5">
                <MapPin className="h-3.5 w-3.5 text-amber-400" />
                <span>Place of Birth</span>
              </label>
              <input
                type="text"
                id="input-profile-birthplace"
                value={formData.birthPlace || ''}
                onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                placeholder="e.g. Austin, Texas"
                className="w-full rounded-xl border border-purple-900/60 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-amber-400 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Numerology System */}
          <div>
            <label className="block text-xs font-medium text-purple-200 mb-1.5 flex items-center space-x-1.5">
              <Compass className="h-3.5 w-3.5 text-amber-400" />
              <span>Sacred Numerology System</span>
            </label>
            <div className="rounded-xl border border-amber-400/50 bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-950 p-3.5 flex items-start space-x-3 shadow-inner">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300 font-serif text-sm font-bold border border-amber-400/40">
                ✦
              </div>
              <div className="space-y-0.5">
                <div className="font-semibold text-xs text-amber-300 flex items-center space-x-1.5">
                  <span>Chaldean Sacred Vibration System</span>
                  <span className="rounded-full bg-amber-400/20 text-amber-300 text-[9px] px-1.5 py-0.2 border border-amber-400/30">Active</span>
                </div>
                <p className="text-[11px] text-purple-200/80 leading-relaxed">
                  Ancient Babylonian occult sound vibration system (Digits 1–8 & Sacred Divine 9) with Master Numbers (11, 22, 33).
                </p>
              </div>
            </div>
          </div>

          {/* Membership Tier & Status Section */}
          {membership && (
            <div className="rounded-2xl border border-purple-800/40 bg-slate-950/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {membership.tier === 'trial' ? (
                    <Gift className="h-4 w-4 text-amber-400" />
                  ) : membership.isActive ? (
                    <Crown className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-purple-400" />
                  )}
                  <span className="font-serif text-xs font-bold text-slate-200">
                    The Sanctuary Club
                  </span>
                </div>
                <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  {membership.tier === 'trial' && membership.isActive
                    ? `Sanctuary Club Trial (${trialTime.days}d ${trialTime.hours}h)`
                    : membership.isActive
                    ? (membership.planName || 'Sanctuary Club Member')
                    : 'Free App Tier'}
                </span>
              </div>

              {/* Sanctuary Emblem Spotlight */}
              <div className="rounded-xl border border-purple-900/60 bg-[#080914] p-3 flex items-center space-x-3.5">
                <SanctuaryEmblem
                  size="md"
                  tier={membership.tier}
                  isUnlocked={membership.tier === 'weekly' || membership.tier === 'monthly' || membership.tier === 'lifetime'}
                  interactive={true}
                  onUpgradeClick={() => {
                    onClose();
                    onOpenMembership?.();
                  }}
                />
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                      Sacred Sanctuary Emblem
                    </span>
                    {(membership.tier === 'weekly' || membership.tier === 'monthly' || membership.tier === 'lifetime') ? (
                      <span className="rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] font-mono font-bold px-1.5 py-0.2">
                        UNLOCKED & ACTIVE
                      </span>
                    ) : (
                      <span className="rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[9px] font-mono font-bold px-1.5 py-0.2">
                        PAID MEMBERS ONLY
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-300 leading-tight mt-0.5">
                    {(membership.tier === 'weekly' || membership.tier === 'monthly' || membership.tier === 'lifetime')
                      ? 'Official seal of The Sanctuary Club. Embodying ancient cosmic alignment, wisdom, and inner sight.'
                      : 'Awarded exclusively to paid members who join The Sanctuary Club. (Not available for free users or 3-Day free trial).'}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-purple-300/80 leading-relaxed">
                {membership.isActive 
                  ? 'All features unlocked: Horoscopes, Numerology, Archangel Oracle, Tarot, Dream Sanctuary, AI Oracle, and Lockable Diary.'
                  : 'Free tier includes Daily Horoscope and Daily Tarot Card Pull. Join the Sanctuary Club with a free 3-day trial or membership for full access.'}
              </p>

              {onOpenMembership && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenMembership();
                  }}
                  className="w-full rounded-xl border border-amber-500/40 bg-amber-500/10 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-500/20 transition-all text-center"
                >
                  {membership.isActive ? 'Manage Sanctuary Club Membership / Plans ($3, $11, $33)' : 'Join The Sanctuary Club (3-Day Free Trial / $3, $11, $33)'}
                </button>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-purple-900/60 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-purple-950/40 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-save-profile"
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition-opacity"
            >
              {savedSuccess ? (
                <>
                  <Check className="h-4 w-4 text-white" />
                  <span>Aligned & Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>Save Cosmic Alignment</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Dedicated Support Contact Sub-Modal */}
        {showSupportModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-md rounded-2xl border border-purple-800/80 bg-slate-900 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-slate-100">
                      Contact Cosmic Support
                    </h4>
                    <p className="text-[10px] text-purple-300/80">
                      Personal Information & Birthdate Update Request
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSupportModal(false)}
                  className="rounded-full p-1 text-slate-400 hover:text-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {supportSentSuccess ? (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-center space-y-2 animate-in fade-in">
                  <Check className="h-8 w-8 text-emerald-400 mx-auto" />
                  <h5 className="font-serif text-sm font-bold text-emerald-200">
                    Message Dispatched to Support
                  </h5>
                  <p className="text-xs text-emerald-100/90 leading-relaxed">
                    Thank you! Our celestial support team will review your birthdate and profile change request and assist you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendSupportRequest} className="space-y-3.5">
                  <p className="text-xs text-purple-200/90 leading-relaxed">
                    To maintain the sacred vibration of your birth matrix, birthdates can be adjusted twice in app. Please provide your correct birth information and reason below, and our support team will update it for you:
                  </p>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-purple-300">
                      Correct Birthdate & Personal Info Details
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      placeholder="Please update my birthdate to MM/DD/YYYY. (Entered incorrectly upon setup)..."
                      className="w-full rounded-xl border border-purple-800/60 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-purple-400/40 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="rounded-xl bg-purple-950/40 border border-purple-800/40 p-2.5 text-[10px] text-purple-300 flex items-center space-x-2">
                    <Mail className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>Support Email: <strong className="text-amber-200">support@cosmicbreadcrumbs.com</strong></span>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowSupportModal(false)}
                      className="rounded-xl border border-purple-800/60 px-3.5 py-2 text-xs text-slate-300 hover:bg-purple-950/40"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-md"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Send to Support</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
