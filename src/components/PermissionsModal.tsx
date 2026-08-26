import React, { useState } from 'react';
import { Compass, Bell, Sparkles, Check, X, ShieldCheck } from 'lucide-react';
import { requestLocationPermission, requestNotificationPermission, getStoredPermissions, savePermissions } from '../utils/permissionManager';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionsUpdated?: () => void;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  onPermissionsUpdated,
}) => {
  const [locationStatus, setLocationStatus] = useState(() => getStoredPermissions().location);
  const [notificationStatus, setNotificationStatus] = useState(() => getStoredPermissions().notification);
  const [isRequesting, setIsRequesting] = useState(false);

  if (!isOpen) return null;

  const handleEnableAll = async () => {
    setIsRequesting(true);
    try {
      // 1. Request location
      const locRes = await requestLocationPermission();
      setLocationStatus(locRes.granted ? 'granted' : 'denied');

      // 2. Request notifications
      const notifRes = await requestNotificationPermission();
      setNotificationStatus(notifRes ? 'granted' : 'denied');

      const current = getStoredPermissions();
      savePermissions({ ...current, hasAsked: true });

      if (onPermissionsUpdated) onPermissionsUpdated();
      setTimeout(onClose, 600);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSkip = () => {
    const current = getStoredPermissions();
    savePermissions({ ...current, hasAsked: true });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#12101f] border border-purple-500/40 rounded-3xl p-6 shadow-2xl shadow-purple-950/80 overflow-hidden text-center">
        
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 rounded-full bg-purple-950/80 text-purple-300 hover:text-white border border-purple-500/30 transition-all"
        >
          <X size={16} />
        </button>

        {/* Icon & Title */}
        <div className="w-16 h-16 mx-auto mb-3.5 rounded-2xl bg-purple-950/80 border border-purple-500/50 flex items-center justify-center shadow-lg shadow-purple-900/40">
          <Sparkles className="h-8 w-8 text-amber-300 animate-pulse" />
        </div>

        <h3 className="text-xl font-bold text-white font-serif tracking-wide mb-1.5">
          Align Your Celestial Senses
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto mb-5 font-sans">
          To receive authentic real-time astronomical readings and daily guidance, please grant access to your cosmic permissions:
        </p>

        {/* Permission Cards */}
        <div className="space-y-3 mb-6 text-left">
          {/* Location Permission */}
          <div className="p-3.5 rounded-2xl bg-[#18142b] border border-purple-500/30 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/20 mt-0.5">
              <Compass size={20} className="text-purple-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Location Alignment</h4>
                {locationStatus === 'granted' && (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <Check size={12} /> Granted
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400 leading-snug mt-0.5">
                Calibrates NASA Ephemeris, sunrise/moonrise, and live planetary transit radar to your exact geographical sky.
              </p>
            </div>
          </div>

          {/* Notification Permission */}
          <div className="p-3.5 rounded-2xl bg-[#18142b] border border-purple-500/30 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/20 mt-0.5">
              <Bell size={20} className="text-purple-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Daily Guidance Notifications</h4>
                {notificationStatus === 'granted' && (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <Check size={12} /> Granted
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400 leading-snug mt-0.5">
                Delivers morning Angel guidance, daily breadcrumbs, and alerts you when your midnight tarot resets.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleEnableAll}
            disabled={isRequesting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 hover:from-purple-500 hover:to-purple-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-purple-950/60 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ShieldCheck size={16} />
            <span>{isRequesting ? 'Connecting...' : 'Allow Celestial Permissions'}</span>
          </button>

          <button
            onClick={handleSkip}
            className="w-full py-2.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};
