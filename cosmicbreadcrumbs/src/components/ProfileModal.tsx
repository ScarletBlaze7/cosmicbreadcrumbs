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
  AlertTriangle,
  Mail,
  HelpCircle,
  Lock,
  MessageSquare,
  Bell,
  Radio,
  Play,
  AlertCircle,
  Shield,
  RefreshCw
} from 'lucide-react';
import { UserProfile, MembershipStatus, UserLocation } from '../types';
import { getSunSignFromDate } from '../utils/astrologyCalc';
import { calculateLifePath, calculateDestinyNumber } from '../utils/numerologyCalc';
import { CosmicLogo } from './CosmicLogo';
import { ZodiacSymbolIcon } from './ZodiacSymbolIcon';
import { 
  getTrialTimeRemaining, 
  activateThreeDayTrial, 
  activateSubscription, 
  SUBSCRIPTION_PLANS 
} from '../utils/membership';
import { 
  requestNotificationPermission, 
  requestLocationPermission, 
  sendCelestialNotification, 
  getStoredPermissionsState, 
  getStoredLocation 
} from '../utils/permissionManager';

const CELESTIAL_PRESETS = [
  {
    id: 'solar',
    name: 'Solar Deity',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=256&auto=format&fit=crop&q=80',
  },
  {
    id: 'galaxy',
    name: 'Cosmic Galaxy',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=256&auto=format&fit=crop&q=80',
  },
  {
    id: 'spirit',
    name: 'Astral Spirit',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=256&auto=format&fit=crop&q=80',
  },
  {
    id: 'mystic',
    name: 'Mystic Star',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=256&auto=format&fit=crop&q=80',
  },
];

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  membership?: MembershipStatus;
  onOpenMembership?: () => void;
  onMembershipUpdated?: (newStatus: MembershipStatus) => void;
  onPlayWelcomeVideo?: () => void;
  onOpenSignIn?: () => void;
  onSignOut?: () => void;
}

const MAX_BIRTHDATE_CHANGES = 2;

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  membership = { tier: 'free', isActive: false, hasSeenWelcomeLetter: false },
  onOpenMembership,
  onMembershipUpdated,
  onPlayWelcomeVideo,
  onOpenSignIn,
  onSignOut,
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...userProfile });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSentSuccess, setSupportSentSuccess] = useState(false);
  const [permissionsState, setPermissionsState] = useState(() => getStoredPermissionsState());
  const [storedLoc, setStoredLoc] = useState<UserLocation | null>(() => getStoredLocation());
  const [isDetectingLoc, setIsDetectingLoc] = useState(false);
  const [isRequestingNotif, setIsRequestingNotif] = useState(false);
  const [isActivatingTrial, setIsActivatingTrial] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const isMember = Boolean(membership.isActive || membership.tier !== 'free');
  const trialTime = getTrialTimeRemaining(membership.trialExpiryDate);

  const handleDetectLocation = async () => {
    setIsDetectingLoc(true);
    try {
      const loc = await requestLocationPermission();
      setStoredLoc(loc);
      setPermissionsState(getStoredPermissionsState());
      if (loc.city || loc.region) {
        const placeStr = [loc.city, loc.region, loc.country].filter(Boolean).join(', ');
        setFormData(prev => ({ ...prev, birthPlace: placeStr, location: loc }));
      }
    } catch (e) {
      console.warn('GPS location detection failed');
    } finally {
      setIsDetectingLoc(false);
    }
  };

  const handleToggleNotifications = async () => {
    setIsRequestingNotif(true);
    try {
      await requestNotificationPermission();
      setPermissionsState(getStoredPermissionsState());
    } finally {
      setIsRequestingNotif(false);
    }
  };

  const handleSendTestNotification = () => {
    sendCelestialNotification(
      '✨ Cosmic Calibration Test',
      'Your sacred notification conduit is open and functioning perfectly.'
    );
  };

  const handleClaimTrial = () => {
    setIsActivatingTrial(true);
    setTimeout(() => {
      const updated = activateThreeDayTrial();
      onMembershipUpdated?.(updated);
      setIsActivatingTrial(false);
      if (onPlayWelcomeVideo) {
        onPlayWelcomeVideo();
      }
    }, 400);
  };

  const currentChangeCount = userProfile.birthDateChangeCount ?? 0;
  const changesRemaining = Math.max(0, MAX_BIRTHDATE_CHANGES - currentChangeCount);
  const isBirthdateLocked = changesRemaining <= 0;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 280;
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
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative my-6 w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-purple-800/80 bg-slate-900 shadow-2xl shadow-purple-950/80 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow Header */}
        <div className="relative border-b border-purple-800/50 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CosmicLogo size="md" showUploadTrigger={true} />
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-100">
                  Seeker Account & Sanctuary Club
                </h3>
                <p className="text-xs text-purple-300/80">
                  Cosmic Breadcrumbs • Your Credentials & Sacred Club Access
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-purple-900/40 hover:text-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Matrix Banner */}
          <div className="mt-4 flex items-center justify-around rounded-2xl border border-purple-800/40 bg-slate-950/70 p-3 text-center">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold">Sun Sign</span>
              <p className="text-sm font-semibold text-amber-300 flex items-center justify-center space-x-1.5 mt-0.5">
                <ZodiacSymbolIcon sign={previewSunSign.name} size="sm" fallbackText={previewSunSign.symbol} />
                <span>{previewSunSign.name}</span>
              </p>
            </div>
            <div className="h-8 w-px bg-purple-900/60" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold">Life Path</span>
              <p className="text-sm font-semibold text-purple-200">
                Number #{previewLifePath}
              </p>
            </div>
            <div className="h-8 w-px bg-purple-900/60" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold">Element</span>
              <p className="text-sm font-semibold text-cyan-300">
                {previewSunSign.element}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[74vh] overflow-y-auto">
          
          {/* ========================================================================= */}
          {/* 1. TOP OFFICIAL MEMBERSHIP BADGE & STATUS SHOWCASE */}
          {/* ========================================================================= */}
          {/* ========================================================================= */}
          {/* 1. TOP OFFICIAL MEMBERSHIP BADGE & STATUS SHOWCASE */}
          {/* ========================================================================= */}
          <div className={`rounded-3xl border-2 p-5 flex flex-col sm:flex-row items-center gap-5 transition-all ${
            isMember 
              ? 'border-amber-400/80 bg-gradient-to-br from-amber-950/30 via-purple-950/40 to-slate-950 shadow-xl shadow-amber-500/10' 
              : 'border-purple-700/60 bg-gradient-to-br from-purple-950/40 via-[#100c24] to-[#080614] shadow-lg'
          }`}>
            {/* Badge / Avatar Display */}
            <div className="shrink-0 flex flex-col items-center">
              <div className={`relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-3xl overflow-hidden border-2 shadow-2xl ${
                isMember
                  ? 'border-amber-400 drop-shadow-[0_0_18px_rgba(212,175,55,0.45)] bg-slate-950'
                  : 'border-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.3)] bg-gradient-to-br from-[#1a1138] to-[#090616]'
              }`}>
                {isMember ? (
                  <img
                    src="/assets/sanctemb.jpg"
                    onError={(e) => { 
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = target.src.includes('sanctuaryemb') ? './assets/sanctemb.jpg' : './assets/sanctuaryemb.jpg';
                    }}
                    alt="Sanctuary Member Emblem (sanctemb.jpg)"
                    className="h-full w-full object-cover select-none"
                  />
                ) : (
                  /* Unique Personal Celestial Portal Avatar */
                  <div className="relative h-full w-full flex items-center justify-center p-2 bg-gradient-to-br from-[#0a0f2b] via-[#060a22] to-[#040614]">
                    {previewAvatar ? (
                      <img
                        src={previewAvatar}
                        alt={previewName || 'Seeker Avatar'}
                        className="h-full w-full rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <ZodiacSymbolIcon 
                          sign={previewSunSign.name} 
                          className="h-10 w-10 sm:h-12 sm:w-12 text-white drop-shadow-[0_0_10px_rgba(147,197,253,0.95)]" 
                        />
                        <span className="text-[10px] font-mono font-bold text-blue-200 mt-1">
                          {previewSunSign.symbol} {previewSunSign.name}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Countdown under badge for trial */}
              {membership.tier === 'trial' && membership.isActive && (
                <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 rounded-full px-2.5 py-0.5 mt-2 text-center drop-shadow-sm">
                  ⏳ {trialTime.days}d {trialTime.hours}h {trialTime.minutes}m left
                </span>
              )}
            </div>

            {/* Badge Details & Status */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  {isMember ? 'Official Sanctuary Member Seal' : '✨ Sacred Seeker Sanctuary'}
                </span>
                {isMember ? (
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold px-2.5 py-0.5">
                    {membership.tier === 'trial' ? '3-DAY TRIAL ACTIVE' : 'ACTIVE PAID MEMBER'}
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold px-2.5 py-0.5">
                    FREE ACCESS TIER
                  </span>
                )}
              </div>

              <h4 className="font-flavors text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200">
                {isMember 
                  ? `${userProfile.name}'s Sanctuary Account` 
                  : `Welcome, ${userProfile.name || 'Celestial Seeker'} ✨`}
              </h4>

              <p className="text-xs text-purple-200/90 leading-relaxed">
                {isMember ? (
                  membership.tier === 'trial' ? (
                    <>You are currently experiencing the <strong>3-Day Sanctuary Club Free Trial ($0 upfront)</strong> with all sacred features unlocked!</>
                  ) : (
                    <>You hold an active <strong>{membership.planName || 'Sanctuary Club Membership'}</strong>. All sacred tools and celestial portals are fully unlocked.</>
                  )
                ) : (
                  <>The universe has opened this sanctuary for your exploration. Your free tier includes your <strong>Daily Horoscope</strong>, <strong>Daily Tarot Card Pull</strong>, and <strong>Sacred Life Path Blueprint</strong>. Follow the cosmic breadcrumbs below.</>
                )}
              </p>

              {!isMember && (
                <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={handleClaimTrial}
                    disabled={isActivatingTrial}
                    className="inline-flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-slate-950 shadow-md hover:from-amber-300 hover:to-amber-500 transition-all active:scale-95"
                  >
                    <Gift className="h-3.5 w-3.5" />
                    <span>{isActivatingTrial ? 'Activating...' : 'Claim 3-Day Free Trial ($0 Upfront)'}</span>
                  </button>

                  {onOpenMembership && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenMembership();
                      }}
                      className="inline-flex items-center space-x-1.5 rounded-xl border border-purple-600/60 bg-purple-950/60 px-3.5 py-2 text-xs font-semibold text-purple-200 hover:bg-purple-900/60 hover:text-white transition-all"
                    >
                      <Crown className="h-3.5 w-3.5 text-amber-300" />
                      <span>View Club Plans ($3, $11, $33)</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. SANCTUARY ACCOUNT AUTHENTICATION (EMAIL & PASSWORD) */}
          {/* ========================================================================= */}
          <div className="rounded-2xl border border-purple-800/60 bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/40 p-4 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-amber-400" />
                <span className="font-serif text-xs font-bold text-slate-100 uppercase tracking-wider">
                  Sanctuary Account Security
                </span>
              </div>

              {userProfile.email ? (
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 flex items-center space-x-1">
                  <Check className="h-3 w-3" />
                  <span>Authenticated</span>
                </span>
              ) : (
                <span className="rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5">
                  Guest Seeker
                </span>
              )}
            </div>

            {userProfile.email ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-amber-200">
                    {userProfile.email}
                  </div>
                  <p className="text-[11px] text-purple-300/80">
                    Your cosmic profile, readings, and encrypted diary are synced with this account.
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {onOpenSignIn && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenSignIn();
                      }}
                      className="rounded-xl border border-purple-600/60 bg-purple-950/60 px-3 py-1.5 text-xs font-semibold text-purple-200 hover:bg-purple-900/60 hover:text-white transition-all"
                    >
                      Switch Account
                    </button>
                  )}

                  {onSignOut && (
                    <button
                      type="button"
                      onClick={() => {
                        onSignOut();
                        onClose();
                      }}
                      className="rounded-xl border border-rose-500/40 bg-rose-950/30 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-900/40 transition-all"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <p className="text-xs text-purple-200/90 leading-relaxed">
                  Sign in or register with your email and password to secure your personal readings, custom settings, and lockable diary across devices.
                </p>

                {onOpenSignIn && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSignIn();
                    }}
                    className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-500/50 px-4 py-2 text-xs font-bold text-white shadow-md hover:from-purple-500 hover:to-indigo-500 active:scale-95 transition-all shrink-0"
                  >
                    Sign In with Email & Password
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 3. USER CREDENTIALS (GIVEN AFTER DOWNLOADING THE APP) */}
          {/* ========================================================================= */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-purple-800/50 pb-2">
              <User className="h-4 w-4 text-amber-400" />
              <h4 className="font-serif text-sm font-bold text-slate-100 uppercase tracking-wider">
                Seeker Credentials & Birth Matrix
              </h4>
            </div>

            {/* Account Photo & Avatar Selection */}
            <div className="rounded-2xl border border-purple-800/50 bg-slate-950/70 p-4 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-purple-200 flex items-center space-x-1.5">
                  <Camera className="h-4 w-4 text-amber-400" />
                  <span>Account Photo & Custom Avatar</span>
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
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center overflow-hidden rounded-full border-2 border-amber-400 bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 shadow-xl shadow-purple-950/50">
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
                    className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md transition-transform active:scale-95"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                </div>

                {/* Controls & Guidance */}
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
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
                        onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: undefined }))}
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

            {/* Credential 1: Full Name */}
            <div>
              <label className="block text-xs font-medium text-purple-200 mb-1.5 flex items-center space-x-1.5">
                <User className="h-3.5 w-3.5 text-amber-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                id="input-profile-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Seraphina Starling"
                className="w-full rounded-2xl border border-purple-900/60 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all"
              />
            </div>

            {/* Credential 2: Birth Date with 2-Times Edit Restriction */}
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
              </div>

              {!isBirthdateLocked && (
                <div className="flex items-center justify-between text-[11px] text-purple-300/80 px-0.5">
                  <span>Allowed to change 2 times if entered incorrectly upon download.</span>
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

            {/* Credential 3 & 4: Time of Birth & Place of Birth Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-purple-200 mb-1.5 flex items-center space-x-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span>Time of Birth (Optional if known to give optimal readings)</span>
                </label>
                <input
                  type="time"
                  id="input-profile-birthtime"
                  value={formData.birthTime || ''}
                  onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                  className="w-full rounded-2xl border border-purple-900/60 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 focus:border-amber-400 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-purple-200 mb-1.5 flex items-center space-x-1.5">
                  <MapPin className="h-3.5 w-3.5 text-purple-400" />
                  <span>Place of Birth (City & State)</span>
                </label>
                <input
                  type="text"
                  id="input-profile-birthplace"
                  value={formData.birthPlace || ''}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                  placeholder="e.g. Sedona, Arizona"
                  className="w-full rounded-2xl border border-purple-900/60 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-amber-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Numerology System */}
            <div>
              <label className="block text-xs font-medium text-purple-200 mb-1.5 flex items-center space-x-1.5">
                <Compass className="h-3.5 w-3.5 text-amber-400" />
                <span>Sacred Numerology System</span>
              </label>
              <div className="rounded-2xl border border-amber-400/50 bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-950 p-3.5 flex items-start space-x-3 shadow-inner">
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

            {/* Device Permissions & Live Astronomical Grounding */}
            <div className="rounded-2xl border border-purple-800/50 bg-slate-950/70 p-4 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-purple-900/40 pb-2">
                <div className="flex items-center space-x-2">
                  <Radio className="h-4 w-4 text-amber-400 animate-pulse" />
                  <span className="font-serif text-xs font-bold text-slate-100 uppercase tracking-wider">
                    Device Permissions & Live Grounding
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-300">
                  NASA JPL Grounded
                </span>
              </div>

              {/* GPS Grounding Sub-card */}
              <div className="flex items-center justify-between rounded-xl bg-purple-950/30 border border-purple-900/40 p-3">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200">
                    <Compass className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Astronomical Location Grounding</span>
                  </div>
                  <div className="text-[11px] text-purple-300/80 font-mono">
                    {storedLoc 
                      ? `📍 ${storedLoc.city || 'Detected'}, ${storedLoc.region || ''} (${storedLoc.latitude}°, ${storedLoc.longitude}°)` 
                      : 'Location access required for NASA ephemeris telemetry'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetectingLoc}
                  className="rounded-xl bg-cyan-500/20 border border-cyan-500/50 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 active:scale-95 transition-all shrink-0 ml-2"
                >
                  {isDetectingLoc ? 'Detecting...' : (storedLoc ? 'Refresh GPS' : 'Detect GPS')}
                </button>
              </div>

              {/* Celestial Notifications Sub-card */}
              <div className="flex items-center justify-between rounded-xl bg-purple-950/30 border border-purple-900/40 p-3">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200">
                    <Bell className="h-3.5 w-3.5 text-amber-400" />
                    <span>Daily Midnight & Transit Alerts</span>
                  </div>
                  <div className="text-[11px] text-purple-300/80">
                    {permissionsState.notifications === 'granted'
                      ? '✅ Active (Midnight Tarot Resets & 8:00 AM Transits)'
                      : 'Enable to receive daily midnight resets & guidance'}
                  </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0 ml-2">
                  {permissionsState.notifications === 'granted' ? (
                    <button
                      type="button"
                      onClick={handleSendTestNotification}
                      className="rounded-xl bg-purple-600/30 border border-purple-500/50 px-2.5 py-1.5 text-xs font-bold text-purple-200 hover:bg-purple-600/50 active:scale-95 transition-all"
                    >
                      Test Alert
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleToggleNotifications}
                      disabled={isRequestingNotif}
                      className="rounded-xl bg-amber-500/20 border border-amber-500/50 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30 active:scale-95 transition-all"
                    >
                      {isRequestingNotif ? 'Enabling...' : 'Enable Alerts'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Save Credentials Action Button */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="submit"
                id="btn-save-profile"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition-opacity active:scale-[0.99]"
              >
                {savedSuccess ? (
                  <>
                    <Check className="h-4 w-4 text-white" />
                    <span>Aligned & Saved!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>Save My Credentials & Alignment</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* ========================================================================= */}
          {/* 3. SANCTUARY CLUB & CLUB TRIAL SECTION (ALL DETAILS FROM CLUB TRIAL) */}
          {/* ========================================================================= */}
          <div className="pt-3 border-t-2 border-purple-800/60 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-800/40 pb-2">
              <div className="flex items-center space-x-2">
                <Crown className="h-4 w-4 text-amber-400" />
                <h4 className="font-serif text-sm font-bold text-amber-200 uppercase tracking-wider">
                  The Sanctuary Club & Trial Guide
                </h4>
              </div>
              <span className="rounded-full bg-amber-400/15 border border-amber-400/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                3-DAY FREE TRIAL • $0 UPFRONT
              </span>
            </div>

            {/* Parchment Welcome Letter Card */}
            <div className="relative rounded-3xl border border-amber-500/30 bg-gradient-to-b from-purple-950/50 via-slate-900 to-indigo-950/40 p-5 sm:p-6 shadow-inner space-y-3">
              <div className="space-y-2.5 text-xs sm:text-sm text-purple-100/90 leading-relaxed font-sans">
                <p className="font-serif italic text-sm sm:text-base text-amber-200 font-semibold">
                  Dear Seeker & Honored Sanctuary Club Member,
                </p>
                
                <p>
                  Welcome to <strong className="text-amber-300">Cosmic Breadcrumbs & The Sanctuary Club</strong> — your sacred daily haven for universal insights, crafted with love to awaken your third eye, expand celestial awareness, and unlock your natural intuitive gifts.
                </p>

                <p>
                  The universe is always leaving gentle trails of wisdom for you—follow the breadcrumbs and embrace the boundless depths of your true potential. As a valued member, you are invited to activate your <strong className="text-amber-300">Free 3-Day Sanctuary Club Trial with $0 upfront costs</strong>.
                </p>
              </div>

              {/* Important Mandatory Notice Box */}
              <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 p-4 space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                  <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Important Sanctuary Club Access Notice:</span>
                </div>
                <p className="text-xs text-amber-100/95 leading-relaxed font-medium">
                  You <strong>must have the free trial activated or a Sanctuary Club membership</strong> to access all features of the app. The free app gives access to your <strong>daily horoscope (calculated with live NASA JPL ephemeris data)</strong>, <strong>daily tarot card pull</strong>, and <strong>Life Path number calculation</strong>.
                </p>
              </div>
            </div>

            {/* Side-by-Side Comparison Matrix */}
            <div className="rounded-3xl border border-purple-800/50 bg-slate-950/60 p-5 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-900/40 pb-2.5">
                <h5 className="font-serif text-xs sm:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-rose-200 uppercase tracking-wider flex items-center space-x-2">
                  <Compass className="h-4 w-4 text-amber-400" />
                  <span>Free Seeker vs. Sanctuary Club Access</span>
                </h5>
                <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2.5 py-0.5 text-[10px] font-bold text-rose-300">
                  See What Free Users Miss
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-slate-300 font-bold border-b border-slate-800 pb-1.5">
                    <span>✨ Free App Tier</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">Included Free</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300 text-[11px]">
                    <li className="flex items-center space-x-2">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Daily Personalized Horoscope (Real-Time NASA Ephemeris)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Daily Tarot Card Pull (1-Card)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Basic Life Path Number Calculation</span>
                    </li>
                    <li className="flex items-center space-x-2 text-rose-400/80 font-medium">
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500/20 text-[10px] text-rose-400 font-bold">✕</span>
                      <span>All other sanctuary sacred tools locked</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-purple-950/40 via-amber-950/20 to-slate-900 p-3.5 space-y-2 shadow-lg shadow-amber-500/5">
                  <div className="flex items-center justify-between text-amber-300 font-bold border-b border-amber-500/30 pb-1.5">
                    <span className="flex items-center space-x-1.5">
                      <Crown className="h-3.5 w-3.5 text-amber-400" />
                      <span>👑 The Sanctuary Club</span>
                    </span>
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300 font-extrabold">All Unlocked ($0 Trial)</span>
                  </div>
                  <ul className="space-y-1.5 text-purple-100 text-[11px]">
                    <li className="flex items-center space-x-2">
                      <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>Full Sacred Chaldean Matrix (Destiny + Soul Urge)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>Calculate Matrix for Loved Ones & Synastry</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>Archangel Oracle Guidance & Clarification Draws</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>Dream Sanctuary & Midnight Symbol Decoder</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>4-Digit PIN Encrypted Private Intuition Diary</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>AI Cosmic Oracle 24/7 Consultations</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* What Free Users Miss 6-Card Grid */}
              <div className="mt-3 rounded-2xl border border-rose-500/30 bg-gradient-to-b from-rose-950/20 via-slate-900 to-purple-950/20 p-4 space-y-2.5">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-rose-400" />
                  <h6 className="font-serif text-xs font-bold text-rose-200 uppercase tracking-wide">
                    Everything You Miss Out On Without Sanctuary Club Access:
                  </h6>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl border border-rose-900/40 bg-slate-950/60 p-2.5 space-y-1">
                    <span className="font-bold text-rose-300 flex items-center space-x-1">
                      <span>🔒 Chaldean Destiny & Soul Urge</span>
                    </span>
                    <p className="text-[11px] text-purple-200/80 leading-relaxed">
                      Free users only see basic Life Path. Miss discovering root Chaldean Destiny and Soul Urge.
                    </p>
                  </div>

                  <div className="rounded-xl border border-rose-900/40 bg-slate-950/60 p-2.5 space-y-1">
                    <span className="font-bold text-rose-300 flex items-center space-x-1">
                      <span>🔒 Loved Ones Synastry</span>
                    </span>
                    <p className="text-[11px] text-purple-200/80 leading-relaxed">
                      Inability to calculate matrix vibrations for romantic partners, friends, or family.
                    </p>
                  </div>

                  <div className="rounded-xl border border-rose-900/40 bg-slate-950/60 p-2.5 space-y-1">
                    <span className="font-bold text-rose-300 flex items-center space-x-1">
                      <span>🔒 Archangel Temple</span>
                    </span>
                    <p className="text-[11px] text-purple-200/80 leading-relaxed">
                      15 Archangel roster, daily transmissions, clarification draws, and color ray attunements.
                    </p>
                  </div>

                  <div className="rounded-xl border border-rose-900/40 bg-slate-950/60 p-2.5 space-y-1">
                    <span className="font-bold text-rose-300 flex items-center space-x-1">
                      <span>🔒 Dreamscape Decoder</span>
                    </span>
                    <p className="text-[11px] text-purple-200/80 leading-relaxed">
                      Nocturnal dream analysis, archetype recognition, and subconscious symbol interpretation.
                    </p>
                  </div>

                  <div className="rounded-xl border border-rose-900/40 bg-slate-950/60 p-2.5 space-y-1">
                    <span className="font-bold text-rose-300 flex items-center space-x-1">
                      <span>🔒 4-Digit Encrypted Diary</span>
                    </span>
                    <p className="text-[11px] text-purple-200/80 leading-relaxed">
                      PIN-protected private mystic journal with auto-save for tarot, horoscope, and oracle readings.
                    </p>
                  </div>

                  <div className="rounded-xl border border-rose-900/40 bg-slate-950/60 p-2.5 space-y-1">
                    <span className="font-bold text-rose-300 flex items-center space-x-1">
                      <span>🔒 AI Cosmic Oracle 24/7</span>
                    </span>
                    <p className="text-[11px] text-purple-200/80 leading-relaxed">
                      Direct AI channeling for relationship, soul mission, career, and deep astrology inquiries.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Plans CTA Box */}
            <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-purple-950/80 via-amber-950/40 to-slate-950 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="font-serif text-sm sm:text-base font-bold text-amber-200">
                  {isMember ? 'Sanctuary Club Membership Active' : 'Ready to Unlock All Sacred Sanctuary Realms?'}
                </div>
                <p className="text-xs text-purple-200/80">
                  {isMember 
                    ? 'Manage your subscription or explore lifetime upgrades.' 
                    : 'Start your Free 3-Day Trial ($0 upfront) or choose a flexible plan.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 justify-center sm:justify-end shrink-0">
                {!isMember && (
                  <button
                    type="button"
                    onClick={handleClaimTrial}
                    disabled={isActivatingTrial}
                    className="rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-5 py-2.5 font-serif text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 transition-all active:scale-95"
                  >
                    {isActivatingTrial ? 'Activating...' : 'Claim Free 3-Day Trial'}
                  </button>
                )}

                {onOpenMembership && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenMembership();
                    }}
                    className="rounded-2xl border border-amber-400/60 bg-amber-400/10 px-5 py-2.5 font-serif text-xs sm:text-sm font-bold text-amber-200 hover:bg-amber-400/20 transition-all"
                  >
                    {isMember ? 'Manage Plans ($3, $11, $33)' : 'Join Club ($3, $11, $33)'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Sub-Modal */}
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
                    className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:from-purple-500 hover:to-indigo-500"
                  >
                    Send to Support
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
