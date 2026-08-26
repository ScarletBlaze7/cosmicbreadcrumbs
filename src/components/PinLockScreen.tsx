import React, { useState, useEffect, useCallback } from 'react';
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  AlertCircle, 
  Delete, 
  Sparkles,
  KeyRound,
  RotateCcw
} from 'lucide-react';

interface PinLockScreenProps {
  title: string;
  subtitle: string;
  badge?: string;
  storedPin: string;
  onUnlock: () => void;
  onResetPin?: () => void;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({
  title,
  subtitle,
  badge = 'Sacred Privacy Shield',
  storedPin,
  onUnlock,
  onResetPin,
}) => {
  const [enteredDigits, setEnteredDigits] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [showForgotConfirm, setShowForgotConfirm] = useState<boolean>(false);

  const handleDigitPress = useCallback((digit: string) => {
    if (enteredDigits.length < 4) {
      const next = enteredDigits + digit;
      setEnteredDigits(next);
      setErrorMessage('');

      if (next.length === 4) {
        // Auto-check PIN
        if (next === storedPin) {
          onUnlock();
        } else {
          setIsShaking(true);
          setErrorMessage('Incorrect 4-digit PIN. Please try again.');
          setTimeout(() => {
            setEnteredDigits('');
            setIsShaking(false);
          }, 700);
        }
      }
    }
  }, [enteredDigits, storedPin, onUnlock]);

  const handleDelete = useCallback(() => {
    if (enteredDigits.length > 0) {
      setEnteredDigits((prev) => prev.slice(0, -1));
      setErrorMessage('');
    }
  }, [enteredDigits]);

  const handleClear = useCallback(() => {
    setEnteredDigits('');
    setErrorMessage('');
  }, []);

  // Physical Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigitPress, handleDelete, handleClear]);

  const handleResetForgotPin = () => {
    if (onResetPin) {
      onResetPin();
      setShowForgotConfirm(false);
      onUnlock();
    }
  };

  return (
    <div className="mx-auto max-w-md py-8 px-4 animate-in fade-in zoom-in-95 duration-300">
      <div className={`rounded-3xl border border-purple-800/60 bg-slate-900/95 p-6 sm:p-8 text-center shadow-2xl shadow-purple-950/80 backdrop-blur-xl space-y-6 ${isShaking ? 'animate-shake' : ''}`}>
        
        {/* Animated Sacred Lock Badge */}
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-purple-950 via-indigo-900 to-amber-900/40 border border-amber-500/40 text-amber-300 shadow-xl shadow-amber-500/10">
          <Lock className="h-10 w-10 animate-pulse text-amber-400" />
          <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-md">
            <KeyRound className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-purple-950/80 border border-purple-800/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
            <ShieldCheck className="h-3 w-3" />
            <span>{badge}</span>
          </span>
          <h2 className="font-serif text-2xl font-bold text-slate-100">
            {title}
          </h2>
          <p className="text-xs text-purple-200/80 max-w-xs mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 4-Digit Display Indicators */}
        <div className="flex justify-center items-center space-x-3 sm:space-x-4 py-2">
          {[0, 1, 2, 3].map((index) => {
            const hasDigit = enteredDigits.length > index;
            return (
              <div
                key={index}
                className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 ${
                  hasDigit
                    ? 'border-amber-400 bg-amber-500/15 shadow-md shadow-amber-500/20 scale-105'
                    : 'border-purple-800/60 bg-slate-950/70'
                }`}
              >
                {hasDigit ? (
                  <div className="h-4 w-4 rounded-full bg-amber-400 shadow-sm animate-in zoom-in-50 duration-150" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-purple-700/40" />
                )}
              </div>
            );
          })}
        </div>

        {/* Error Feedback */}
        {errorMessage ? (
          <div className="flex items-center justify-center space-x-1.5 text-xs font-semibold text-rose-400 animate-in fade-in">
            <AlertCircle className="h-4 w-4" />
            <span>{errorMessage}</span>
          </div>
        ) : (
          <p className="text-[11px] text-purple-400/70">
            Enter your 4-digit PIN via keypad or physical keyboard
          </p>
        )}

        {/* Celestial Numeric Keypad (0-9) */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-xs mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigitPress(num)}
              className="flex h-13 sm:h-14 items-center justify-center rounded-2xl border border-purple-800/40 bg-purple-950/30 text-lg sm:text-xl font-bold font-mono text-purple-100 shadow-md hover:border-amber-400 hover:bg-purple-900/60 hover:text-amber-300 active:scale-95 transition-all duration-150"
            >
              {num}
            </button>
          ))}

          {/* Clear Button */}
          <button
            type="button"
            onClick={handleClear}
            className="flex h-13 sm:h-14 items-center justify-center rounded-2xl border border-purple-900/40 bg-slate-950/40 text-xs font-semibold text-purple-400 hover:border-purple-600 hover:text-purple-200 active:scale-95 transition-all"
            title="Clear all digits"
          >
            Clear
          </button>

          {/* Zero (0) */}
          <button
            type="button"
            onClick={() => handleDigitPress('0')}
            className="flex h-13 sm:h-14 items-center justify-center rounded-2xl border border-purple-800/40 bg-purple-950/30 text-lg sm:text-xl font-bold font-mono text-purple-100 shadow-md hover:border-amber-400 hover:bg-purple-900/60 hover:text-amber-300 active:scale-95 transition-all duration-150"
          >
            0
          </button>

          {/* Backspace Delete */}
          <button
            type="button"
            onClick={handleDelete}
            className="flex h-13 sm:h-14 items-center justify-center rounded-2xl border border-purple-900/40 bg-slate-950/40 text-purple-300 hover:border-purple-600 hover:text-rose-300 active:scale-95 transition-all"
            title="Delete last digit"
          >
            <Delete className="h-5 w-5" />
          </button>
        </div>

        {/* Footer info & Optional Reset */}
        <div className="pt-2 border-t border-purple-900/40 flex flex-col items-center space-y-2">
          <div className="text-[11px] text-purple-400/60 flex items-center space-x-1">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
            <span>Private Local Storage • No Cloud Leakage</span>
          </div>

          {onResetPin && (
            <div>
              {!showForgotConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowForgotConfirm(true)}
                  className="text-[11px] text-purple-400 hover:text-amber-300 underline transition-colors"
                >
                  Forgot your 4-digit PIN?
                </button>
              ) : (
                <div className="rounded-xl border border-rose-800/50 bg-rose-950/40 p-2.5 text-center space-y-2 animate-in fade-in max-w-xs">
                  <p className="text-[11px] text-rose-200">
                    Resetting will remove the PIN lock and grant immediate access.
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      type="button"
                      onClick={handleResetForgotPin}
                      className="rounded-lg bg-rose-600 px-3 py-1 text-[10px] font-bold text-white hover:bg-rose-500 transition-colors"
                    >
                      Confirm Reset & Unlock
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForgotConfirm(false)}
                      className="rounded-lg bg-slate-800 px-3 py-1 text-[10px] text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
