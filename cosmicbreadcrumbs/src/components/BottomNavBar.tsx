import React from 'react';
import { Sparkles, Compass, Moon, Feather, Hash, Lock } from 'lucide-react';
import { CosmicView, MembershipStatus } from '../types';
import { isFeatureUnlocked } from '../utils/membership';

interface BottomNavBarProps {
  currentView: CosmicView;
  onViewChange: (view: CosmicView) => void;
  membership: MembershipStatus;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentView,
  onViewChange,
  membership,
}) => {
  const navTabs: { id: CosmicView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Cosmic Hub', icon: Sparkles },
    { id: 'horoscope', label: 'Zodiac', icon: Compass },
    { id: 'tarot', label: 'Tarot', icon: Moon },
    { id: 'angel-oracle', label: 'Angels', icon: Feather },
    { id: 'numerology', label: 'Numbers', icon: Hash },
  ];

  return (
    <nav 
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-purple-900/70 bg-[#070614]/95 backdrop-blur-xl shadow-[0_-5px_25px_rgba(0,0,0,0.7)] pb-safe"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1.5">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          const isUnlocked = isFeatureUnlocked(tab.id, membership);

          return (
            <button
              key={tab.id}
              id={`bottom-nav-${tab.id}`}
              type="button"
              onClick={() => onViewChange(tab.id)}
              className={`relative flex flex-1 flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 ${
                isActive
                  ? 'text-amber-300'
                  : 'text-purple-300/75 hover:text-purple-100 hover:bg-purple-950/30'
              }`}
            >
              {/* Active Glow Pill */}
              {isActive && (
                <span className="absolute -top-1 h-1 w-8 rounded-full bg-gradient-to-r from-amber-400 via-purple-400 to-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
              )}

              <div className={`relative flex h-7 w-7 items-center justify-center rounded-xl transition-all ${
                isActive
                  ? 'bg-purple-900/80 border border-purple-500/80 text-amber-300 shadow-md shadow-purple-950/80 scale-110'
                  : 'text-purple-300'
              }`}>
                <Icon className="h-4 w-4" />
                {!isUnlocked && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-950 border border-purple-400/80 text-purple-200">
                    <Lock className="h-2 w-2" />
                  </span>
                )}
              </div>

              <span className={`text-[10px] font-sans font-bold tracking-tight mt-1 truncate max-w-full ${
                isActive ? 'text-amber-200 font-extrabold drop-shadow-sm' : 'text-purple-300/80'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
