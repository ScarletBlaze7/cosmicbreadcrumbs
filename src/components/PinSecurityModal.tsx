import React, { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  Unlock, 
  Trash2, 
  Check, 
  AlertCircle,
  Sparkles,
  X
} from 'lucide-react';
import { triggerFireworkBurst } from '../utils/fireworks';

interface PinSecurityModalProps {
  title: string;
  storageKey: string;
  currentStoredPin: string | null;
  isOpen: boolean;
  onClose: () => void;
  onPinSaved: (newPin: string) => void;
  onPinRemoved: () => void;
}

export const PinSecurityModal: React.FC<PinSecurityModalProps> = ({
  title,
  storageKey,
  currentStoredPin,
  isOpen,
  onClose,
  onPinSaved,
  onPinRemoved,
}) => {
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // If changing existing PIN, verify old PIN
    if (currentStoredPin && oldPinInput !== currentStoredPin) {
      setError('Current 4-digit PIN is incorrect.');
      return;
    }

    // Validate 4 digits
    if (!/^\d{4}$/.test(newPinInput)) {
      setError('PIN must be exactly 4 digits (0-9).');
      return;
    }

    if (newPinInput !== confirmPinInput) {
      setError('New PINs do not match. Please re-enter.');
      return;
    }

    localStorage.setItem(storageKey, newPinInput);
    onPinSaved(newPinInput);
    
    // Fireworks starburst
    triggerFireworkBurst({
      particleCount: 50,
      scalar: 1.1,
    });

    setSuccessMsg('4-digit PIN protection updated successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleRemove = () => {
    if (currentStoredPin && oldPinInput !== currentStoredPin) {
      setError('Please enter your current 4-digit PIN above to remove protection.');
      return;
    }

    localStorage.removeItem(storageKey);
    onPinRemoved();
    setSuccessMsg('PIN Lock removed. Diary is now open and accessible.');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl border border-purple-800/60 bg-slate-900 p-6 sm:p-7 shadow-2xl shadow-purple-950/80 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-900/50 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-slate-100">
                {title} PIN Protection
              </h3>
              <p className="text-[11px] text-purple-300/80">
                Optional 4-digit privacy lock to prevent others from peeking
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-purple-400 hover:bg-purple-950 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Current PIN verification if already set */}
          {currentStoredPin && (
            <div className="space-y-1.5 rounded-2xl border border-purple-800/40 bg-slate-950/60 p-3.5">
              <label className="text-xs font-semibold text-purple-200 flex items-center space-x-1.5">
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                <span>Current 4-Digit PIN (Required to Change or Remove)</span>
              </label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={oldPinInput}
                onChange={(e) => setOldPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="● ● ● ●"
                className="w-full rounded-xl border border-purple-800/60 bg-slate-950 px-4 py-2 text-center text-base font-mono tracking-widest text-amber-300 placeholder:text-purple-400/30 focus:border-amber-400 focus:outline-none"
              />
            </div>
          )}

          {/* New 4-digit PIN */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-purple-200 flex items-center justify-between">
              <span>{currentStoredPin ? 'New 4-Digit PIN' : 'Create 4-Digit PIN'}</span>
              <span className="text-[10px] text-purple-400 font-normal">Exact 4 numbers (0-9)</span>
            </label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 7777"
              className="w-full rounded-xl border border-purple-800/60 bg-slate-950 px-4 py-2.5 text-center text-lg font-mono tracking-widest text-amber-300 placeholder:text-purple-400/30 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Confirm 4-digit PIN */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-purple-200">
              Confirm 4-Digit PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={confirmPinInput}
              onChange={(e) => setConfirmPinInput(e.target.value.replace(/\D/g, ''))}
              placeholder="Re-enter 4 digits"
              className="w-full rounded-xl border border-purple-800/60 bg-slate-950 px-4 py-2.5 text-center text-lg font-mono tracking-widest text-amber-300 placeholder:text-purple-400/30 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="flex items-center space-x-1.5 rounded-xl border border-rose-800/50 bg-rose-950/40 p-2.5 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center space-x-1.5 rounded-xl border border-emerald-800/50 bg-emerald-950/40 p-2.5 text-xs text-emerald-300 animate-in fade-in">
              <Check className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 font-serif text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{currentStoredPin ? 'Update 4-Digit PIN' : 'Enable 4-Digit PIN Lock'}</span>
          </button>
        </form>

        {/* Remove PIN Option */}
        {currentStoredPin && (
          <div className="pt-3 border-t border-purple-900/50 space-y-2">
            <button
              type="button"
              onClick={handleRemove}
              className="w-full flex items-center justify-center space-x-2 rounded-xl border border-rose-900/40 bg-rose-950/20 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-900/40 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Remove 4-Digit PIN (Disable Lock)</span>
            </button>
            <p className="text-[10px] text-center text-purple-400/60">
              Removing the PIN makes this section openly accessible without prompting.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
