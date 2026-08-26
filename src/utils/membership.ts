import { MembershipStatus, CosmicView } from '../types';

export const MEMBERSHIP_STORAGE_KEY = 'cosmic_breadcrumbs_membership';

export const FREE_ACCESSIBLE_VIEWS: CosmicView[] = ['dashboard', 'horoscope', 'tarot', 'numerology'];

export const GATED_VIEWS: CosmicView[] = [
  'angel-oracle',
  'dreams',
  'diary',
  'journal',
  'oracle-chat',
];

export const SUBSCRIPTION_PLANS = [
  {
    id: 'weekly',
    name: 'Sanctuary Club Weekly Pass',
    price: '$3',
    period: '/ week',
    rawPrice: 3,
    badge: 'Sanctuary Club • Flexible',
    description: 'Billed weekly at $3/week. Cancel anytime. Full unlimited access to all Sanctuary Club tools.',
    features: [
      'Complete Numerology Matrix & Life Path',
      'Angel Numbers & Archangel Oracle Guidance',
      'Dream Sanctuary & Symbol Meaning Calculator',
      'Lockable Private Daily Diary with 4-Digit PIN',
      'Daily Reflection & Reading Accuracy Reviews',
      'AI Cosmic Oracle Unlimited Consultations',
      'Daily Horoscope & Tarot pulls included',
    ],
  },
  {
    id: 'monthly',
    name: 'Sanctuary Club Monthly Pass',
    price: '$11',
    period: '/ month',
    rawPrice: 11,
    badge: 'Sanctuary Club • Most Popular',
    popular: true,
    description: 'Billed monthly at $11/month. Divine alignment with the master number 11 of intuition.',
    features: [
      'Everything in Weekly Pass',
      'Full Sacred Chaldean Numerology Matrix',
      'Past Dream Chronicles & Recurring Dream Logs',
      'Custom Solfeggio 528Hz & 432Hz Sound Healing',
      'Priority Cosmic Oracle response streaming',
      'Continuous daily reading accuracy tracking',
    ],
  },
  {
    id: 'lifetime',
    name: 'Sanctuary Club Lifetime VIP',
    price: '$33',
    period: 'one-time',
    rawPrice: 33,
    badge: 'Sanctuary Club • Best Value',
    lifetime: true,
    description: 'One single payment of $33 for lifetime complete use of all features with zero recurring charges.',
    features: [
      'Unlimited lifetime access to all current & future features',
      'Master Teacher 33 vibration blessing',
      'No recurring subscriptions or renewals ever',
      'Unlimited private intuition diary and past dream logs',
      'Unlimited AI Cosmic Oracle conversations',
      'Sanctuary Club VIP Seeker badge on your birth matrix profile',
    ],
  },
];

export const getStoredMembership = (): MembershipStatus => {
  try {
    const raw = localStorage.getItem(MEMBERSHIP_STORAGE_KEY);
    if (raw) {
      const parsed: MembershipStatus = JSON.parse(raw);
      
      // Check if trial is expired
      if (parsed.tier === 'trial' && parsed.trialExpiryDate) {
        const expiryTime = new Date(parsed.trialExpiryDate).getTime();
        const now = Date.now();
        if (now > expiryTime) {
          parsed.isActive = false;
        } else {
          parsed.isActive = true;
        }
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error loading membership:', err);
  }

  // Default: Free user who hasn't seen welcome letter yet
  return {
    tier: 'free',
    isActive: false,
    hasSeenWelcomeLetter: false,
  };
};

export const saveMembership = (status: MembershipStatus) => {
  try {
    localStorage.setItem(MEMBERSHIP_STORAGE_KEY, JSON.stringify(status));
    window.dispatchEvent(new Event('membership-updated'));
  } catch (err) {
    console.error('Error saving membership:', err);
  }
};

export const activateThreeDayTrial = (): MembershipStatus => {
  const now = new Date();
  const expiry = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 72 hours

  const newStatus: MembershipStatus = {
    tier: 'trial',
    isActive: true,
    trialStartDate: now.toISOString(),
    trialExpiryDate: expiry.toISOString(),
    activatedAt: now.toISOString(),
    planName: 'Sanctuary Club 3-Day Free Trial ($0 Upfront)',
    price: '$0.00',
    hasSeenWelcomeLetter: true,
  };

  saveMembership(newStatus);
  return newStatus;
};

export const activateSubscription = (
  tier: 'weekly' | 'monthly' | 'lifetime'
): MembershipStatus => {
  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === tier);
  const now = new Date();

  const newStatus: MembershipStatus = {
    tier,
    isActive: true,
    activatedAt: now.toISOString(),
    planName: plan?.name || tier,
    price: plan?.price || '',
    hasSeenWelcomeLetter: true,
  };

  saveMembership(newStatus);
  return newStatus;
};

export const isFeatureUnlocked = (
  view: CosmicView,
  membership: MembershipStatus
): boolean => {
  // Free views are always accessible
  if (FREE_ACCESSIBLE_VIEWS.includes(view)) {
    return true;
  }
  // Paid or trial tier must be active
  return Boolean(membership.isActive);
};

export const getTrialTimeRemaining = (expiryDate?: string): { days: number; hours: number; minutes: number; expired: boolean } => {
  if (!expiryDate) return { days: 0, hours: 0, minutes: 0, expired: true };
  const diff = new Date(expiryDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, expired: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, expired: false };
};
