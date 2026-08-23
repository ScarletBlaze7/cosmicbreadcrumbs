import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  Bell, 
  MapPin, 
  Check, 
  ShieldCheck, 
  Globe2, 
  Moon, 
  ArrowRight,
  Radio,
  Clock
} from 'lucide-react';
import { CosmicLogo } from './CosmicLogo';
import { 
  requestNotificationPermission, 
  requestLocationPermission, 
  getStoredPermissionsState, 
  getStoredLocation,
  savePermissionsState 
} from '../utils/permissionManager';
import { UserLocation, AppPermissionsState } from '../types';

interface PermissionsRequestModalProps {
  isOpen: boolean;
  onComplete: (location?: UserLocation) => void;
  onSkip: () => void;
}

export const PermissionsRequestModal: React.FC<PermissionsRequestModalProps> = ({
  isOpen,
  onComplete,
  onSkip,
}) => {
  const [permissionsState, setPermissionsState] = useState<AppPermissionsState>(() => getStoredPermissionsState());
  const [userLocation, setUserLocation] = useState<UserLocation | null>(() => getStoredLocation());
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [isRequestingNotification, setIsRequestingNotification] = useState(false);
  const [isEnablingAll, setIsEnablingAll] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPermissionsState(getStoredPermissionsState());
      setUserLocation(getStoredLocation());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestLocation = async () => {
    setIsRequestingLocation(true);
    try {
      const loc = await requestLocationPermission();
      setUserLocation(loc);
      setPermissionsState(getStoredPermissionsState());
    } catch (e) {
      console.warn('Location request rejected or timed out');
      setPermissionsState(getStoredPermissionsState());
    } finally {
      setIsRequestingLocation(false);
    }
  };

  const handleRequestNotification = async () => {
    setIsRequestingNotification(true);
    try {
      await requestNotificationPermission();
      setPermissionsState(getStoredPermissionsState());
    } catch (e) {
      console.warn('Notification request rejected');
      setPermissionsState(getStoredPermissionsState());
    } finally {
      setIsRequestingNotification(false);
    }
  };

  const handleEnableAllAndProceed = async () => {
    setIsEnablingAll(true);

    let detectedLoc = userLocation;

    // 1. Request Location
    try {
      detectedLoc = await requestLocationPermission();
      setUserLocation(detectedLoc);
    } catch (e) {
      console.warn('Location grant skipped or denied');
    }

    // 2. Request Notifications
    try {
      await requestNotificationPermission();
    } catch (e) {
      console.warn('Notification grant skipped or denied');
    }

    savePermissionsState({ hasRequestedPermissions: true });
    setIsEnablingAll(false);
    onComplete(detectedLoc || undefined);
  };

  const handleDismiss = () => {
    savePermissionsState({ hasRequestedPermissions: true });
    onSkip();
  };

  const isLocationGranted = permissionsState.location === 'granted' && !!userLocation;
  const isNotificationGranted = permissionsState.notifications === 'granted';

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
            <Radio className="h-3 w-3 text-amber-300 animate-pulse" />
            <span>Cosmic Calibration & Permissions</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-100 to-purple-200">
            Ground Your Sacred Readings
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/90 max-w-md mx-auto leading-relaxed">
            Allow notifications and location access so Cosmic Breadcrumbs can calculate real-time NASA JPL planetary transits and deliver your daily resets.
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-7 space-y-5 max-h-[72vh] overflow-y-auto">
          {/* Card 1: Location Permission */}
          <div className={`rounded-2xl border p-4 sm:p-5 transition-all ${
            isLocationGranted 
              ? 'border-emerald-500/60 bg-emerald-950/20 shadow-lg shadow-emerald-950/30' 
              : 'border-purple-800/60 bg-purple-950/30 hover:border-purple-600/70'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3.5">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-md ${
                  isLocationGranted
                    ? 'border-emerald-500/80 bg-emerald-900/60 text-emerald-300'
                    : 'border-amber-500/60 bg-amber-500/15 text-amber-300'
                }`}>
                  <Compass className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-slate-100">
                      Real-Time Astrological Grounding
                    </h3>
                    {isLocationGranted && (
                      <span className="flex items-center space-x-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                        <Check className="h-2.5 w-2.5" />
                        <span>Grounded</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-purple-200/80 leading-relaxed">
                    Aligns live NASA JPL ephemeris coordinates, local midnight clock resets, and astrological houses with your exact Earth position.
                  </p>
                  {isLocationGranted && userLocation && (
                    <div className="mt-2 flex items-center space-x-1.5 font-mono text-xs text-emerald-300">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{userLocation.city || 'Sedona'}, {userLocation.region || 'AZ'} ({userLocation.latitude}°, {userLocation.longitude}°)</span>
                    </div>
                  )}
                </div>
              </div>

              {!isLocationGranted && (
                <button
                  type="button"
                  onClick={handleRequestLocation}
                  disabled={isRequestingLocation}
                  className="shrink-0 rounded-xl bg-amber-500/20 border border-amber-500/60 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/30 active:scale-95 transition-all"
                >
                  {isRequestingLocation ? 'Detecting...' : 'Allow Location'}
                </button>
              )}
            </div>
          </div>

          {/* Card 2: Notification Permission */}
          <div className={`rounded-2xl border p-4 sm:p-5 transition-all ${
            isNotificationGranted 
              ? 'border-emerald-500/60 bg-emerald-950/20 shadow-lg shadow-emerald-950/30' 
              : 'border-purple-800/60 bg-purple-950/30 hover:border-purple-600/70'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3.5">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-md ${
                  isNotificationGranted
                    ? 'border-emerald-500/80 bg-emerald-900/60 text-emerald-300'
                    : 'border-purple-500/60 bg-purple-500/15 text-purple-300'
                }`}>
                  <Bell className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-slate-100">
                      Daily Midnight & Transit Alerts
                    </h3>
                    {isNotificationGranted && (
                      <span className="flex items-center space-x-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                        <Check className="h-2.5 w-2.5" />
                        <span>Enabled</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-purple-200/80 leading-relaxed">
                    Notifies you when your daily Tarot pull resets at midnight, when morning horoscopes synthesize, and during rare planetary retrogrades.
                  </p>
                  {isNotificationGranted && (
                    <div className="mt-2 flex items-center space-x-1.5 font-mono text-xs text-emerald-300">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Midnight Reset (00:00) & Morning Transits (08:00) Active</span>
                    </div>
                  )}
                </div>
              </div>

              {!isNotificationGranted && (
                <button
                  type="button"
                  onClick={handleRequestNotification}
                  disabled={isRequestingNotification}
                  className="shrink-0 rounded-xl bg-purple-600/30 border border-purple-500/60 px-3.5 py-2 text-xs font-bold text-purple-200 hover:bg-purple-600/50 active:scale-95 transition-all"
                >
                  {isRequestingNotification ? 'Enabling...' : 'Allow Alerts'}
                </button>
              )}
            </div>
          </div>

          {/* Privacy & Safety Note */}
          <div className="rounded-2xl border border-purple-900/40 bg-slate-950/60 p-3.5 text-xs text-purple-300/80 leading-relaxed flex items-start space-x-2.5">
            <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Sanctuary Privacy Protection:</strong> Your location coordinates are processed strictly on-device for astrological trigonometry and ephemeris grounding.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleEnableAllAndProceed}
              disabled={isEnablingAll}
              className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 py-3.5 px-6 font-serif text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 transition-all active:scale-[0.99]"
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {isEnablingAll ? 'Calibrating Sanctuary...' : (isLocationGranted && isNotificationGranted ? 'Confirm & Enter Sanctuary' : 'Enable Permissions & Enter Sanctuary')}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="w-full text-center text-xs text-purple-400 hover:text-purple-200 transition-colors py-1.5 font-medium"
            >
              Continue without permissions for now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
