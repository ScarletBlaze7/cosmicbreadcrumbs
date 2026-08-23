import React, { useState, useEffect } from 'react';
import { CosmicView, UserProfile, JournalEntry, MembershipStatus } from './types';
import { Header } from './components/Header';
import { DailyDashboard } from './components/DailyDashboard';
import { HoroscopeView } from './components/HoroscopeView';
import { NumerologyView } from './components/NumerologyView';
import { AngelOracleView } from './components/AngelOracleView';
import { TarotPullView } from './components/TarotPullView';
import { PrivateDiaryView } from './components/PrivateDiaryView';
import { DreamSanctuaryView } from './components/DreamSanctuaryView';
import { ProfileModal } from './components/ProfileModal';
import { CosmicOracleChat } from './components/CosmicOracleChat';
import { CosmicLogo } from './components/CosmicLogo';
import { WelcomeLetterModal } from './components/WelcomeLetterModal';
import { FirstLaunchOnboardingModal } from './components/FirstLaunchOnboardingModal';
import { PermissionsRequestModal } from './components/PermissionsRequestModal';
import { SanctuaryWelcomeVideoModal } from './components/SanctuaryWelcomeVideoModal';
import { ShootingStarsCanvas } from './components/ShootingStarsCanvas';
import { getSunSignFromDate } from './utils/astrologyCalc';
import { calculateLifePath, calculateDestinyNumber } from './utils/numerologyCalc';
import { getStoredMembership, isFeatureUnlocked, activateSubscription } from './utils/membership';
import { initFontSize } from './utils/fontSizePreference';
import { initCelestialNotificationService, getStoredPermissionsState } from './utils/permissionManager';
import { Sparkles, Moon, Compass, Hash, Feather, Heart, Lock, Gift, Crown } from 'lucide-react';

const INITIAL_PROFILE: UserProfile = {
  name: 'Seraphina Starling',
  birthDate: '1996-07-22',
  birthTime: '11:11',
  birthPlace: 'Sedona, Arizona',
  sunSign: 'Cancer',
  lifePathNumber: 9,
  destinyNumber: 3,
  numerologySystem: 'chaldean',
};

const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: 'entry-1',
    date: new Date(Date.now() - 86400000).toISOString(),
    title: 'Daily Tarot Pull - The Star (Upright)',
    type: 'tarot',
    content: '🃏 Card: The Star (Upright)\nMeaning: Renewed hope, celestial inspiration, and serene faith in divine timing.\n\nDivine Advice: Open your heart to the blessings descending quietly around you.\nAffirmation: "I am a conduit of celestial light and infinite possibility."',
    isFavorite: true,
  },
  {
    id: 'entry-2',
    date: new Date(Date.now() - 172800000).toISOString(),
    title: 'Angel Synchronicity 1111 - Gateways of Awakening',
    type: 'angel',
    content: '🕊️ Angel Number: 1111\nArchangel: Metatron\nVibration: Rapid Manifestation & Sacred Gateway\n\nGuidance: Your thoughts are materializing into form instantaneously. Maintain positive spiritual alignment.',
    isFavorite: true,
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState<CosmicView>('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOracleChatOpen, setIsOracleChatOpen] = useState(false);

  // Membership & Trial State
  const [membership, setMembership] = useState<MembershipStatus>(() => getStoredMembership());
  
  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('auranova_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_PROFILE;
  });

  // First Download / First Launch Onboarding: "Find your Zodiac Sign"
  const [isFirstLaunchModalOpen, setIsFirstLaunchModalOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('auranova_profile');
    if (!saved) return true;
    try {
      const parsed = JSON.parse(saved);
      return !parsed.hasCompletedOnboarding;
    } catch {
      return true;
    }
  });

  // First Download / Permission Request Modal for Location Grounding & Notifications
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('auranova_profile');
    const permState = getStoredPermissionsState();
    if (!saved) return false;
    try {
      const parsed = JSON.parse(saved);
      if (!parsed.hasCompletedOnboarding) return false;
    } catch {
      return false;
    }
    return !permState.hasRequestedPermissions;
  });

  // Show welcome letter modal after onboarding or on first visit
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState<boolean>(() => {
    const current = getStoredMembership();
    const savedProfile = localStorage.getItem('auranova_profile');
    // If first launch onboarding or permission modal is active, let them finish first
    if (!savedProfile) return false;
    return !current.hasSeenWelcomeLetter;
  });

  const [requestedLockedFeature, setRequestedLockedFeature] = useState<string | undefined>(undefined);
  const [welcomeModalTab, setWelcomeModalTab] = useState<'letter' | 'plans' | 'guide'>('letter');
  const [isWelcomeVideoOpen, setIsWelcomeVideoOpen] = useState<boolean>(false);

  // Check URL params for Stripe checkout redirect return & init background celestial services
  useEffect(() => {
    initFontSize();
    initCelestialNotificationService();
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('payment_success') === 'true') {
        const plan = (params.get('plan') as 'weekly' | 'monthly' | 'lifetime') || 'monthly';
        const sessionId = params.get('session_id');

        fetch('/api/payment/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, planId: plan }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.verified) {
              const updated = activateSubscription(data.planId || plan);
              setMembership(updated);
              setIsWelcomeVideoOpen(true);
            }
          })
          .catch(() => {
            const updated = activateSubscription(plan);
            setMembership(updated);
            setIsWelcomeVideoOpen(true);
          })
          .finally(() => {
            window.history.replaceState({}, document.title, window.location.pathname);
          });
      }
    } catch (e) {
      console.error('Error parsing payment URL params:', e);
    }
  }, []);

  // Listen for membership updates across tabs / events
  useEffect(() => {
    const handleUpdate = () => {
      setMembership(getStoredMembership());
    };
    window.addEventListener('membership-updated', handleUpdate);
    return () => window.removeEventListener('membership-updated', handleUpdate);
  }, []);

  // Mystic Journal Entries
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('auranova_journal');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_JOURNAL;
  });

  // Save profile updates
  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('auranova_profile', JSON.stringify(profile));
  };

  // Save to journal
  const handleSaveJournal = (title: string, type: 'tarot' | 'horoscope' | 'angel' | 'numerology' | 'affirmation', content: string) => {
    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toISOString(),
      title,
      type,
      content,
      isFavorite: false,
    };

    const updated = [newEntry, ...journalEntries];
    setJournalEntries(updated);
    localStorage.setItem('auranova_journal', JSON.stringify(updated));
  };

  const handleDeleteJournalEntry = (id: string) => {
    const updated = journalEntries.filter((e) => e.id !== id);
    setJournalEntries(updated);
    localStorage.setItem('auranova_journal', JSON.stringify(updated));
  };

  const handleToggleFavorite = (id: string) => {
    const updated = journalEntries.map((e) =>
      e.id === id ? { ...e, isFavorite: !e.isFavorite } : e
    );
    setJournalEntries(updated);
    localStorage.setItem('auranova_journal', JSON.stringify(updated));
  };

  const getFeatureDisplayName = (view: CosmicView): string => {
    switch (view) {
      case 'numerology':
        return 'Numerology Matrix & Life Path';
      case 'angel-oracle':
        return 'Archangel Daily Guidance Sanctuary';
      case 'dreams':
        return 'Dreamscape';
      case 'diary':
      case 'journal':
        return 'Daily Log/Journal';
      default:
        return 'Sanctuary Feature';
    }
  };

  // Navigation with Access Control Gating
  const handleNavigate = (view: CosmicView) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (isFeatureUnlocked(view, membership)) {
      setCurrentView(view);
    } else {
      // Locked feature! Prompt Free 3-day trial / membership modal
      setRequestedLockedFeature(getFeatureDisplayName(view));
      setWelcomeModalTab('letter');
      setIsWelcomeModalOpen(true);
    }
  };

  const handleOpenWelcomeModal = (featureName?: string, tab: 'letter' | 'plans' | 'guide' = 'letter') => {
    setRequestedLockedFeature(featureName);
    setWelcomeModalTab(tab);
    setIsWelcomeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#06070f] cosmic-dot-bg text-slate-100 selection:bg-fuchsia-600 selection:text-white flex flex-col justify-between relative overflow-hidden">
      {/* Animated Shooting Stars & Twinkling Celestial Canvas */}
      <ShootingStarsCanvas intensity="low" />

      {/* Ambient Deep Space Glow */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-1/3 h-96 w-96 rounded-full bg-purple-900/30 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-fuchsia-900/20 blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Navigation Header */}
        <Header
          currentView={currentView}
          onViewChange={handleNavigate}
          userProfile={userProfile}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenOracleChat={() => {
            if (!membership.isActive) {
              handleOpenWelcomeModal('AI Cosmic Oracle Consultations');
            } else {
              setIsOracleChatOpen(true);
            }
          }}
          membership={membership}
          onOpenMembership={() => handleOpenWelcomeModal(undefined, 'letter')}
        />

        {/* View Content */}
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 flex-1">
          {currentView === 'dashboard' && (
            <DailyDashboard
              userProfile={userProfile}
              onNavigate={handleNavigate}
              onSaveJournal={handleSaveJournal}
              membership={membership}
              onOpenWelcomeModal={handleOpenWelcomeModal}
              onOpenProfile={() => setIsProfileOpen(true)}
            />
          )}

          {currentView === 'horoscope' && (
            <HoroscopeView
              userProfile={userProfile}
              onSaveJournal={handleSaveJournal}
              membership={membership}
              onOpenWelcomeModal={handleOpenWelcomeModal}
            />
          )}

          {currentView === 'numerology' && (
            <NumerologyView
              userProfile={userProfile}
              onSaveJournal={handleSaveJournal}
              membership={membership}
              onOpenWelcomeModal={handleOpenWelcomeModal}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'angel-oracle' && (
            <AngelOracleView
              userProfile={userProfile}
              onSaveJournal={handleSaveJournal}
            />
          )}

          {currentView === 'tarot' && (
            <TarotPullView
              userProfile={userProfile}
              onSaveJournal={handleSaveJournal}
              membership={membership}
              onOpenWelcomeModal={handleOpenWelcomeModal}
            />
          )}

          {currentView === 'dreams' && (
            <DreamSanctuaryView
              userProfile={userProfile}
            />
          )}

          {(currentView === 'diary' || currentView === 'journal') && (
            <PrivateDiaryView
              userProfile={userProfile}
              journalEntries={journalEntries}
              onDeleteJournalEntry={handleDeleteJournalEntry}
              onToggleJournalFavorite={handleToggleFavorite}
              initialTab={currentView === 'journal' ? 'keepsakes' : 'diary'}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-purple-950/80 bg-[#060710]/95 py-8 text-center text-xs text-slate-400">
          <div className="mx-auto max-w-7xl px-4 flex flex-col items-center space-y-6">
            {/* Top row: Brand & Navigation */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-purple-950/60">
              <div className="flex items-center space-x-2.5">
                <CosmicLogo size="sm" showUploadTrigger={false} />
                <div className="text-left">
                  <span className="font-flavors text-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200 tracking-wide block">
                    Cosmic Breadcrumbs
                  </span>
                  <span className="text-[9px] text-purple-300/80 font-mono tracking-widest uppercase">
                    Universal Insights
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono uppercase tracking-wider text-purple-200">
                <button
                  onClick={() => handleNavigate('horoscope')}
                  className="hover:text-white transition-colors"
                >
                  Horoscopes (Free)
                </button>
                <button
                  onClick={() => handleNavigate('tarot')}
                  className="hover:text-white transition-colors"
                >
                  Tarot Pull (Free)
                </button>
                <button
                  onClick={() => handleNavigate('numerology')}
                  className="hover:text-white transition-colors"
                >
                  Numerology Matrix
                </button>
                <button
                  onClick={() => handleNavigate('angel-oracle')}
                  className="hover:text-white transition-colors"
                >
                  Archangel Guidance
                </button>
                <button
                  onClick={() => handleNavigate('dreams')}
                  className="hover:text-white transition-colors"
                >
                  Dreamscape
                </button>
                <button
                  onClick={() => handleNavigate('diary')}
                  className="hover:text-white transition-colors"
                >
                  Daily Log/Journal
                </button>
                <button
                  onClick={() => handleOpenWelcomeModal(undefined, 'letter')}
                  className="text-purple-300 font-bold hover:text-white transition-colors"
                >
                  Sanctuary Club Free Trial ($3, $11, $33)
                </button>
              </div>
            </div>

            {/* Description Banner on the bottom of every page */}
            <div className="max-w-3xl mx-auto px-4">
              <p className="font-sans text-xs sm:text-sm leading-relaxed text-slate-300/90 text-center">
                “Your daily guide to universal insights—designed to awaken your third eye, expand awareness, and unlock your intuitive power. The universe is always leaving trails of wisdom—follow the breadcrumbs and explore the depths of your true potential.”
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
        membership={membership}
        onOpenMembership={() => handleOpenWelcomeModal(undefined, 'plans')}
        onMembershipUpdated={(newStatus) => setMembership(newStatus)}
        onPlayWelcomeVideo={() => setIsWelcomeVideoOpen(true)}
      />

      {/* Live AI Oracle Chat Modal */}
      <CosmicOracleChat
        isOpen={isOracleChatOpen}
        onClose={() => setIsOracleChatOpen(false)}
        userProfile={userProfile}
        membership={membership}
        onOpenMembership={() => handleOpenWelcomeModal('AI Cosmic Oracle', 'letter')}
      />

      {/* First Download Onboarding Modal: Find Your Zodiac Sign */}
      <FirstLaunchOnboardingModal
        isOpen={isFirstLaunchModalOpen}
        onComplete={(newProfile) => {
          handleSaveProfile(newProfile);
          setIsFirstLaunchModalOpen(false);
          // Request permissions for location and notifications on first download
          const permState = getStoredPermissionsState();
          if (!permState.hasRequestedPermissions) {
            setIsPermissionsModalOpen(true);
          } else if (!membership.hasSeenWelcomeLetter) {
            setIsWelcomeModalOpen(true);
          }
        }}
      />

      {/* Permissions Request Modal: Location Grounding & Notifications on First Download */}
      <PermissionsRequestModal
        isOpen={isPermissionsModalOpen}
        onComplete={(detectedLocation) => {
          if (detectedLocation) {
            const placeStr = [detectedLocation.city, detectedLocation.region, detectedLocation.country].filter(Boolean).join(', ');
            const updatedProfile: UserProfile = {
              ...userProfile,
              location: detectedLocation,
              birthPlace: (!userProfile.birthPlace || userProfile.birthPlace === 'Sedona, Arizona') && placeStr
                ? placeStr
                : userProfile.birthPlace,
              hasGrantedPermissions: true,
            };
            handleSaveProfile(updatedProfile);
          }
          setIsPermissionsModalOpen(false);
          if (!membership.hasSeenWelcomeLetter) {
            setIsWelcomeModalOpen(true);
          }
        }}
        onSkip={() => {
          setIsPermissionsModalOpen(false);
          if (!membership.hasSeenWelcomeLetter) {
            setIsWelcomeModalOpen(true);
          }
        }}
      />

      {/* Welcome Letter & Membership Modal (Auto-shows on first download/visit or when prompted) */}
      <WelcomeLetterModal
        isOpen={isWelcomeModalOpen}
        onClose={() => {
          setIsWelcomeModalOpen(false);
          setRequestedLockedFeature(undefined);
        }}
        membership={membership}
        onMembershipUpdated={(newStatus) => setMembership(newStatus)}
        initialTab={welcomeModalTab}
        requestedFeatureName={requestedLockedFeature}
        onPlayWelcomeVideo={() => setIsWelcomeVideoOpen(true)}
      />

      {/* Sanctuary Welcome Video Modal (Plays SanctuaryWelcome.mp4 after joining trial or purchasing membership) */}
      <SanctuaryWelcomeVideoModal
        isOpen={isWelcomeVideoOpen}
        onClose={() => setIsWelcomeVideoOpen(false)}
      />
    </div>
  );
}

