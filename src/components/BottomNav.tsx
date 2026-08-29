import React from 'react';
import { Sparkles, Compass, Moon, Feather, Hash } from 'lucide-react';
import { CosmicView, MembershipStatus } from '../types';

interface BottomNavProps {
  currentView: CosmicView;
  onViewChange: (view: CosmicView) => void;
  membership?: MembershipStatus;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onViewChange,
}) => {
  const navButtons: { id: CosmicView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Cosmic Hub', icon: Sparkles },
    { id: 'horoscope', label: 'Zodiac', icon: Compass },
    { id: 'tarot', label: 'Tarot', icon: Moon },
    { id: 'angel-oracle', label: 'Angels', icon: Feather },
    { id: 'numerology', label: 'Numbers', icon: Hash },
  ];

  return (
    <nav
      id="bottom-app-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-purple-900/80 bg-[#070514]/95 backdrop-blur-xl shadow-2xl shadow-purple-950 py-2 px-2 sm:px-4 pb-[max(env(safe-area-inset-bottom),8px)]"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {navButtons.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => {
                onViewChange(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-amber-300 scale-105'
                  : 'text-purple-300/70 hover:text-purple-100'
              }`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                  isActive
                    ? 'bg-purple-900/90 border border-amber-400/80 text-amber-300 shadow-lg shadow-purple-950/80'
                    : 'bg-transparent text-purple-300'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-amber-300 animate-pulse' : 'text-purple-300'}`} />
              </div>
              <span className={`text-[11px] font-sans font-bold tracking-wide mt-0.5 ${isActive ? 'text-amber-300' : 'text-purple-300/80'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
