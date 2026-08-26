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
      <div className="relative my-auto w-full max-w-md rounded-3xl border border-amber-500/50 bg-gradient-to-b from-[#150d2e] via-[#0d0a1e] to-[#060410] shadow-2xl shadow-purple-950/90 overflow-hidden">
        {/* Top Celestial Ambient Glow */}
        <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-32 w-64 rounded-full bg-gradient-to-b from-amber-400/20 via-purple-600/25 to-transparent blur-2xl" />

        {/* Modal Header */}
        <div className="relative border-b border-purple-800/40 bg-slate-950/70 px-4 py-3 sm:px-5 text-center space-y-1">
          <div className="inline-flex items-center space-x-1 rounded-full bg-amber-400/15 border border-amber-400/35 px-2.5 py-0.5 text-[9px] font-mono font-bold text-amber-300 uppercase tracking-wider">
            <Radio className="h-2.5 w-2.5 text-amber-300 animate-pulse" />
            <span>Cosmic Grounding</span>
          </div>

          <h2 className="font-serif text-lg sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-100 to-purple-200">
            Sacred Grounding & Alerts
          </h2>
          <p className="text-[11px] sm:text-xs text-purple-200/80 max-w-xs mx-auto leading-tight">
            Enable location and daily alerts for NASA live ephemeris transits and midnight resets.
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-3.5 sm:p-4 space-y-2.5 max-h-[75vh] overflow-y-auto">
          {/* Card 1: Location Permission */}
          <div className={`rounded-2xl border p-2.5 sm:p-3 transition-all ${
            isLocationGranted 
              ? 'border-emerald-500/60 bg-emerald-950/20 shadow-md shadow-emerald-950/30' 
              : 'border-purple-800/50 bg-purple-950/25 hover:border-purple-600/70'
          }`}>
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border shadow-sm ${
                  isLocationGranted
                    ? 'border-emerald-500/80 bg-emerald-900/60 text-emerald-300'
                    : 'border-amber-500/60 bg-amber-500/15 text-amber-300'
                }`}>
                  <Compass className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-slate-100 truncate">
                      Astrological Location
                    </h3>
                    {isLocationGranted && (
                      <span className="flex items-center space-x-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300">
                        <Check className="h-2 w-2" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-purple-200/75 leading-tight truncate">
                    {isLocationGranted && userLocation ? `${userLocation.city || 'Sedona'}, ${userLocation.region || 'AZ'} Grounded` : 'Aligns NASA ephemeris to your coordinates.'}
                  </p>
                </div>
              </div>

              {!isLocationGranted && (
                <button
                  type="button"
                  onClick={handleRequestLocation}
                  disabled={isRequestingLocation}
                  className="shrink-0 rounded-xl bg-amber-500/20 border border-amber-500/60 px-2.5 py-1.5 text-[11px] font-bold text-amber-300 hover:bg-amber-500/30 active:scale-95 transition-all cursor-pointer"
                >
                  {isRequestingLocation ? 'Detecting...' : 'Allow'}
                </button>
              )}
            </div>
          </div>

          {/* Card 2: Notification Permission */}
          <div className={`rounded-2xl border p-2.5 sm:p-3 transition-all ${
            isNotificationGranted 
              ? 'border-emerald-500/60 bg-emerald-950/20 shadow-md shadow-emerald-950/30' 
              : 'border-purple-800/50 bg-purple-950/25 hover:border-purple-600/70'
          }`}>
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border shadow-sm ${
                  isNotificationGranted
                    ? 'border-emerald-500/80 bg-emerald-900/60 text-emerald-300'
                    : 'border-purple-500/60 bg-purple-500/15 text-purple-300'
                }`}>
                  <Bell className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-slate-100 truncate">
                      Midnight & Transit Alerts
                    </h3>
                    {isNotificationGranted && (
                      <span className="flex items-center space-x-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300">
                        <Check className="h-2 w-2" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-purple-200/75 leading-tight truncate">
                    {isNotificationGranted ? 'Midnight Tarot reset & transit alerts active.' : 'Daily Tarot reset & planetary notifications.'}
                  </p>
                </div>
              </div>

              {!isNotificationGranted && (
                <button
                  type="button"
                  onClick={handleRequestNotification}
                  disabled={isRequestingNotification}
                  className="shrink-0 rounded-xl bg-purple-600/30 border border-purple-500/60 px-2.5 py-1.5 text-[11px] font-bold text-purple-200 hover:bg-purple-600/50 active:scale-95 transition-all cursor-pointer"
                >
                  {isRequestingNotification ? 'Enabling...' : 'Allow'}
                </button>
              )}
            </div>
          </div>

          {/* Privacy & Safety Note */}
          <div className="rounded-xl border border-purple-900/40 bg-slate-950/60 px-3 py-1.5 text-[10px] text-purple-300/80 leading-snug flex items-center space-x-2">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>Coordinates are processed strictly on-device for sacred alignment.</span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-1.5 pt-1">
            <button
              type="button"
              onClick={handleEnableAllAndProceed}
              disabled={isEnablingAll}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 py-2.5 px-4 font-serif text-xs sm:text-sm font-bold text-slate-950 shadow-md shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 transition-all active:scale-[0.99] cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                {isEnablingAll ? 'Calibrating...' : (isLocationGranted && isNotificationGranted ? 'Enter Cosmic Hub' : 'Enable & Enter Cosmic Hub')}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="w-full text-center text-[11px] text-purple-400/80 hover:text-amber-200 transition-colors py-1 cursor-pointer"
            >
              Continue without permissions for now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
