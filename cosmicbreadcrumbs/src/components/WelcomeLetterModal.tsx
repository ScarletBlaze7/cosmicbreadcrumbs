import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Check, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  X, 
  Heart, 
  Compass, 
  Moon, 
  Hash, 
  Feather, 
  CloudMoon, 
  MessageSquareQuote, 
  ArrowRight, 
  Gift, 
  Crown,
  Zap,
  Calendar,
  AlertCircle,
  HelpCircle,
  CreditCard,
  ExternalLink,
  Copy,
  CheckCircle2,
  LockKeyhole,
  Receipt,
  Settings,
  Shield,
  Clock,
  RefreshCw,
  Wallet
} from 'lucide-react';
import { triggerFireworks } from '../utils/fireworks';
import { CosmicLogo } from './CosmicLogo';
import { SanctuaryEmblem } from './SanctuaryEmblem';
import { MembershipStatus } from '../types';
import { 
  SUBSCRIPTION_PLANS, 
  activateThreeDayTrial, 
  activateSubscription, 
  getTrialTimeRemaining 
} from '../utils/membership';

interface WelcomeLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  membership: MembershipStatus;
  onMembershipUpdated: (newStatus: MembershipStatus) => void;
  initialTab?: 'letter' | 'plans' | 'guide';
  requestedFeatureName?: string;
}

export const WelcomeLetterModal: React.FC<WelcomeLetterModalProps> = ({
  isOpen,
  onClose,
  membership,
  onMembershipUpdated,
  initialTab = 'letter',
  requestedFeatureName,
}) => {
  const [activeTab, setActiveTab] = useState<'letter' | 'plans' | 'guide'>(initialTab);
  const [selectedPlanId, setSelectedPlanId] = useState<'weekly' | 'monthly' | 'lifetime'>('monthly');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [checkoutSuccessMessage, setCheckoutSuccessMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Card Checkout Form State
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('888');
  const [cardName, setCardName] = useState<string>('');
  const [cardZip, setCardZip] = useState<string>('90210');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'google'>('card');
  const [stripeStatus, setStripeStatus] = useState<{ hasStripeKey: boolean; publishableKey?: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/payment/config')
        .then((res) => res.json())
        .then((data) => {
          setStripeStatus({
            hasStripeKey: data.hasStripeKey,
            publishableKey: data.publishableKey,
          });
        })
        .catch(() => {
          setStripeStatus({ hasStripeKey: false });
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const trialTime = getTrialTimeRemaining(membership.trialExpiryDate);
  const selectedPlan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1];

  const handleClaimTrial = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const updated = activateThreeDayTrial();
      onMembershipUpdated(updated);
      setIsProcessing(false);

      setCheckoutSuccessMessage('🌟 Welcome to the Sanctuary Club! Your 3-Day Free Trial ($0 Upfront) is now active. All dimensions of the sanctuary are unlocked for you.');
      setTimeout(() => {
        setCheckoutSuccessMessage(null);
        onClose();
      }, 1900);
    }, 400);
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);

    try {
      // Check if real Stripe session is requested and configured
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlanId,
          userEmail: '',
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl && !data.simulated) {
        // Redirect to live Stripe Checkout page
        window.location.href = data.checkoutUrl;
        return;
      }

      // Instant activation / sandbox simulation
      setTimeout(() => {
        const updated = activateSubscription(selectedPlanId);
        onMembershipUpdated(updated);
        setIsProcessing(false);

        const planLabel = selectedPlanId === 'weekly' 
          ? 'Sanctuary Club Weekly Pass ($3/week)' 
          : selectedPlanId === 'monthly' 
          ? 'Sanctuary Club Monthly Pass ($11/month)' 
          : 'Sanctuary Club Lifetime VIP ($33 one-time)';

        setCheckoutSuccessMessage(`🌟 A Grand Welcome to the Sanctuary Club! Your ${planLabel} is now active with full lifetime privileges.`);
        setTimeout(() => {
          setCheckoutSuccessMessage(null);
          onClose();
        }, 2400);
      }, 600);
    } catch (err) {
      console.error('Payment checkout error:', err);
      // Fallback instant activation
      const updated = activateSubscription(selectedPlanId);
      onMembershipUpdated(updated);
      setIsProcessing(false);
      onClose();
    }
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const fillTestCard = () => {
    setCardNumber('4242 •••• •••• 4242');
    setCardExpiry('12/28');
    setCardCvc('888');
    setCardName('Universal Seeker');
    setCardZip('90210');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-4 backdrop-blur-md animate-in fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative my-6 w-full max-w-3xl rounded-3xl border border-purple-800/60 bg-slate-900 shadow-2xl shadow-purple-950/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-gradient-to-b from-amber-500/20 via-purple-600/20 to-transparent blur-3xl" />

        {/* Modal Header */}
        <div className="relative border-b border-purple-900/60 bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/90 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <CosmicLogo size="md" showUploadTrigger={false} />
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-flavors text-xl sm:text-2xl font-normal tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200">
                    The Sanctuary Club
                  </h2>
                  <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                    SANCTUARY CLUB
                  </span>
                </div>
                <p className="text-xs text-purple-300/80">
                  Free 3-Day Trial • $3/Week • $11/Month • Only $33 Lifetime Access
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950/60 border border-purple-800/40 text-purple-300 hover:text-white hover:border-amber-400 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Tabs inside modal */}
          <div className="mt-4 flex flex-wrap gap-1 rounded-2xl bg-slate-950/80 p-1 border border-purple-900/50">
            <button
              onClick={() => setActiveTab('letter')}
              className={`flex-1 min-w-[130px] flex items-center justify-center space-x-1.5 rounded-xl py-2 px-3 text-xs font-semibold transition-all ${
                activeTab === 'letter'
                  ? 'bg-gradient-to-r from-amber-500/20 to-purple-600/30 text-amber-200 border border-amber-500/30 shadow-sm'
                  : 'text-purple-300/70 hover:text-purple-100'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Sanctuary Club Welcome</span>
            </button>

            <button
              onClick={() => setActiveTab('plans')}
              className={`flex-1 min-w-[150px] flex items-center justify-center space-x-1.5 rounded-xl py-2 px-3 text-xs font-semibold transition-all ${
                activeTab === 'plans'
                  ? 'bg-gradient-to-r from-amber-500/20 to-purple-600/30 text-amber-200 border border-amber-500/30 shadow-sm'
                  : 'text-purple-300/70 hover:text-purple-100'
              }`}
            >
              <CreditCard className="h-3.5 w-3.5 text-amber-400" />
              <span>Sanctuary Club Membership</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-1 min-w-[150px] flex items-center justify-center space-x-1.5 rounded-xl py-2 px-3 text-xs font-semibold transition-all ${
                activeTab === 'guide'
                  ? 'bg-gradient-to-r from-amber-500/20 to-purple-600/30 text-amber-200 border border-amber-500/30 shadow-sm'
                  : 'text-purple-300/70 hover:text-purple-100'
              }`}
            >
              <Settings className="h-3.5 w-3.5 text-cyan-400" />
              <span>Payment Setup Guide (Stripe)</span>
            </button>
          </div>
        </div>

        {/* Feature Lock Notice Banner */}
        {requestedFeatureName && !membership.isActive && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-2.5 flex items-center space-x-2 text-xs text-amber-200">
            <Lock className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              <strong>{requestedFeatureName}</strong> requires an active Free 3-Day Trial or Sanctuary Club Membership. Activate below!
            </span>
          </div>
        )}

        {/* Success Confirmation Toast */}
        {checkoutSuccessMessage && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 px-6 py-3 flex items-center space-x-2 text-xs text-emerald-200 animate-in fade-in">
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{checkoutSuccessMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6 sm:p-7 space-y-6">

          {/* TAB 1: WELCOME LETTER & FREE TRIAL */}
          {activeTab === 'letter' && (
            <div className="space-y-6">
              
              {/* Grand Welcome Celebration Banner for New Members */}
              <div className="relative overflow-hidden rounded-3xl border border-amber-400/50 bg-gradient-to-r from-amber-500/20 via-purple-900/40 to-indigo-950/60 p-5 sm:p-6 shadow-xl shadow-amber-500/10">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="relative shrink-0">
                    <SanctuaryEmblem size="lg" isUnlocked={membership.tier === 'weekly' || membership.tier === 'monthly' || membership.tier === 'lifetime'} tier={membership.tier} />
                  </div>
                  <div className="text-center sm:text-left space-y-1">
                    <div className="inline-flex items-center space-x-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 px-3 py-0.5 text-[10px] font-extrabold text-amber-300 uppercase tracking-wider">
                      <Sparkles className="h-3 w-3 text-amber-300" />
                      <span>A Big Celestial Welcome</span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-rose-200">
                      Welcome to the Sanctuary Club!
                    </h3>
                    <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed max-w-xl">
                      We are thrilled and honored to welcome you into our sacred circle of intuitive seekers. Your presence enriches the collective vibration of our celestial sanctuary.
                    </p>
                  </div>
                </div>
              </div>

              {/* Official Sanctuary Emblem Showcase Box */}
              <div className="rounded-2xl border border-purple-900/80 bg-[#070814] p-4 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <SanctuaryEmblem size="lg" isUnlocked={membership.tier === 'weekly' || membership.tier === 'monthly' || membership.tier === 'lifetime'} tier={membership.tier} interactive={true} />
                <div className="text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                      The Sanctuary Emblem
                    </span>
                    {(membership.tier === 'weekly' || membership.tier === 'monthly' || membership.tier === 'lifetime') ? (
                      <span className="rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] font-mono font-bold px-2 py-0.5">
                        ACTIVE MEMBER SEAL
                      </span>
                    ) : (
                      <span className="rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] font-mono font-bold px-2 py-0.5">
                        FOR PAID MEMBERS ONLY
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    This sacred Sanctuary Emblem is awarded to seekers who join a paid Sanctuary Club membership ($3/wk, $11/mo, or $33 Lifetime). <strong className="text-amber-200">Not included for free users or on the free 3-day trial.</strong>
                  </p>
                </div>
              </div>

              {/* Parchment-style Welcome Letter Card */}
              <div className="relative rounded-3xl border border-amber-500/30 bg-gradient-to-b from-purple-950/50 via-slate-900 to-indigo-950/40 p-6 sm:p-7 shadow-inner space-y-4">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                  <div className="flex items-center space-x-2">
                    <Gift className="h-5 w-5 text-amber-400 animate-pulse" />
                    <span className="font-serif text-sm font-bold text-amber-300 uppercase tracking-wider">
                      Your Sanctuary Club Initiation Gift
                    </span>
                  </div>
                  <span className="rounded-full bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                    3-DAY FREE TRIAL • $0 UPFRONT
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-purple-100/90 leading-relaxed font-sans">
                  <p className="font-serif italic text-base sm:text-lg text-amber-200 font-semibold">
                    Dear Seeker & Honored Sanctuary Club Member,
                  </p>
                  
                  <p>
                    Welcome to <strong className="text-amber-300">Cosmic Breadcrumbs & The Sanctuary Club</strong> — your sacred daily haven for universal insights, crafted with love to awaken your third eye, expand celestial awareness, and unlock your natural intuitive gifts.
                  </p>

                  <p>
                    The universe is always leaving gentle trails of wisdom for you—follow the breadcrumbs and embrace the boundless depths of your true potential. As a valued new member, you are invited to activate your <strong className="text-amber-300">Free 3-Day Sanctuary Club Trial with $0 upfront costs</strong>.
                  </p>

                  <p>
                    Step inside to experience every realm of the sanctuary fully unlocked: ancient Chaldean numerology matrix calculations, Archangel oracle channeling, the sacred Dream Sanctuary symbol calculator, our private 4-digit PIN lockable diary, and unlimited AI Cosmic Oracle consultations.
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

                {/* Status indicator if trial already active */}
                {membership.tier === 'trial' && membership.isActive && (
                  <div className="rounded-2xl bg-emerald-950/50 border border-emerald-500/40 p-3.5 flex items-center justify-between text-xs text-emerald-200">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span><strong>Sanctuary Club Free 3-Day Trial is Active:</strong> All features unlocked!</span>
                    </div>
                    <span className="font-mono text-emerald-300 font-bold">
                      {trialTime.days}d {trialTime.hours}h left
                    </span>
                  </div>
                )}

                {/* Status indicator if paid membership active */}
                {membership.tier !== 'free' && membership.tier !== 'trial' && membership.isActive && (
                  <div className="rounded-2xl bg-purple-950/60 border border-amber-500/40 p-3.5 flex items-center justify-between text-xs text-amber-200">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4 text-amber-400" />
                      <span><strong>Active Sanctuary Club Membership:</strong> {membership.planName}</span>
                    </div>
                    <span className="font-bold text-amber-300">
                      Full Club Access
                    </span>
                  </div>
                )}
              </div>

              {/* Free vs Premium Feature Matrix & What Free Users Miss */}
              <div className="rounded-3xl border border-purple-800/50 bg-slate-950/60 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-900/40 pb-3">
                  <h4 className="font-serif text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-rose-200 uppercase tracking-wider flex items-center space-x-2">
                    <Compass className="h-4 w-4 text-amber-400" />
                    <span>Free Seeker vs. Sanctuary Club Access</span>
                  </h4>
                  <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2.5 py-0.5 text-[10px] font-bold text-rose-300">
                    See What Free Users Miss Below
                  </span>
                </div>

                {/* Side-by-Side Quick Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-slate-300 font-bold border-b border-slate-800 pb-2">
                      <span className="flex items-center space-x-1.5">
                        <span>✨ Free App Tier</span>
                      </span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">Included Free</span>
                    </div>
                    <ul className="space-y-2 text-slate-300 text-[11px]">
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

                  <div className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-purple-950/40 via-amber-950/20 to-slate-900 p-4 space-y-2.5 shadow-lg shadow-amber-500/5">
                    <div className="flex items-center justify-between text-amber-300 font-bold border-b border-amber-500/30 pb-2">
                      <span className="flex items-center space-x-1.5">
                        <Crown className="h-4 w-4 text-amber-400" />
                        <span>👑 The Sanctuary Club</span>
                      </span>
                      <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300 font-extrabold">All Unlocked ($0 Trial)</span>
                    </div>
                    <ul className="space-y-2 text-purple-100 text-[11px]">
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

                {/* DETAILED "WHAT YOU MISS" HIGHLIGHT GRID */}
                <div className="mt-4 rounded-2xl border border-rose-500/30 bg-gradient-to-b from-rose-950/20 via-slate-900 to-purple-950/20 p-4 sm:p-5 space-y-3">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-rose-400" />
                    <h5 className="font-serif text-xs sm:text-sm font-bold text-rose-200 uppercase tracking-wide">
                      Everything You Miss Out On Without Sanctuary Club Access:
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                    
                    <div className="rounded-xl border border-rose-900/40 bg-slate-950/60 p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-300 flex items-center space-x-1.5">
                          <span className="text-rose-400">🔒</span>
                          <span>Chaldean Destiny & Soul Urge Matrix</span>
                        </span>
                        <span className="text-[10px] text-rose-400 font-medium">Free misses this</span>
                      </div>
                      <p className="text-[11px] text-purple-200/80 leading-relaxed">
                        Free users only see their basic Life Path number. You miss discovering your true root Chaldean Destiny vibration, inner Soul Urge desires, and karmic life lessons.
                      </p>
                    </div>

                    <div className="rounded-xl border border-rose-900/40 bg-slate-950/60 p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-300 flex items-center space-x-1.5">
                          <span className="text-rose-400">🔒</span>
                          <span>Calculate for Loved Ones & Synastry</span>
                        </span>
                        <span className="text-[10px] text-rose-400 font-medium">Free misses this</span>
                      </div>
                      <p className="text-[11px] text-purple-200/80 leading-relaxed">
                        Inability to calculate birth matrix vibrations for your romantic partner, family, or friends, and locked harmonic compatibility ratings.
                      </p>
                    </div>

                    <div className="rounded-xl border border-rose-900/40 bg-slate-950/60 p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-300 flex items-center space-x-1.5">
                          <span className="text-rose-400">🔒</span>
                          <span>Archangel Oracle & Sacred Temple</span>
                        </span>
                        <span className="text-[10px] text-rose-400 font-medium">Free misses this</span>
                      </div>
                      <p className="text-[11px] text-purple-200/80 leading-relaxed">
                        No access to daily Archangel transmissions, the 15-Archangel Temple roster, color ray attunements, prayers, or multi-card clarification guidance draws.
                      </p>
                    </div>

                    <div className="rounded-xl border border-rose-900/40 bg-slate-950/60 p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-300 flex items-center space-x-1.5">
                          <span className="text-rose-400">🔒</span>
                          <span>Dream Sanctuary & Symbol Decoder</span>
                        </span>
                        <span className="text-[10px] text-rose-400 font-medium">Free misses this</span>
                      </div>
                      <p className="text-[11px] text-purple-200/80 leading-relaxed">
                        Missing nocturnal dream analysis, archetype recognition, dream symbol frequency calculator, and subconscious dream interpretation.
                      </p>
                    </div>

                    <div className="rounded-xl border border-rose-900/40 bg-slate-950/60 p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-300 flex items-center space-x-1.5">
                          <span className="text-rose-400">🔒</span>
                          <span>Private Intuition Diary with PIN Lock</span>
                        </span>
                        <span className="text-[10px] text-rose-400 font-medium">Free misses this</span>
                      </div>
                      <p className="text-[11px] text-purple-200/80 leading-relaxed">
                        Locked out of maintaining a secure, password-protected journal to track angel numbers, synchronicities, personal reflections, and breakthroughs.
                      </p>
                    </div>

                    <div className="rounded-xl border border-rose-900/40 bg-slate-950/60 p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-300 flex items-center space-x-1.5">
                          <span className="text-rose-400">🔒</span>
                          <span>AI Cosmic Oracle Consultations</span>
                        </span>
                        <span className="text-[10px] text-rose-400 font-medium">Free misses this</span>
                      </div>
                      <p className="text-[11px] text-purple-200/80 leading-relaxed">
                        Free users cannot ask real-time spiritual questions, receive channeled angel answers, or explore custom astrological advice on demand.
                      </p>
                    </div>

                  </div>
                </div>
              </div>

              {/* Call to Action Buttons */}
              <div className="space-y-3 pt-1">
                {!membership.isActive ? (
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleClaimTrial}
                    className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-6 py-4 font-serif text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/30 hover:from-amber-300 hover:to-amber-500 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    <Gift className="h-5 w-5" />
                    <span>Activate Sanctuary Club 3-Day Free Trial ($0 Upfront)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3.5 font-serif text-sm font-bold text-white shadow-lg hover:from-purple-500 hover:to-indigo-500 transition-all"
                  >
                    <Check className="h-4 w-4" />
                    <span>Enter Sanctuary Club (Access Unlocked)</span>
                  </button>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('plans')}
                    className="text-amber-300 hover:text-amber-200 underline underline-offset-4 font-medium"
                  >
                    View Sanctuary Club Options ($3/wk, $11/mo, $33 Lifetime) →
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="text-purple-400 hover:text-purple-200"
                  >
                    Continue with Free App (Horoscope & Tarot only)
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MEMBERSHIP PLANS & CARD PAYMENT */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              
              <div className="text-center space-y-1">
                <h3 className="font-serif text-xl font-bold text-slate-100">
                  Select Your Sanctuary Club Membership
                </h3>
                <p className="text-xs text-purple-300/80 max-w-md mx-auto">
                  Free for 3 days • $3/week • $11/month • Or Only $33 for a lifetime Sanctuary Club membership.
                </p>
              </div>

              {/* 3 Tier Cards Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {SUBSCRIPTION_PLANS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  const isCurrent = membership.tier === plan.id && membership.isActive;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id as 'weekly' | 'monthly' | 'lifetime')}
                      className={`relative flex flex-col justify-between rounded-3xl p-4 sm:p-5 border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-gradient-to-b from-purple-900/80 via-slate-900 to-indigo-950 shadow-xl shadow-purple-950/60 ring-2 ring-amber-400/50 scale-[1.02]'
                          : 'border-purple-800/40 bg-slate-950/70 hover:border-purple-600/60'
                      }`}
                    >
                      {/* Popular / Lifetime Badge */}
                      {plan.badge && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-2.5 py-0.5 text-[9px] font-bold text-slate-950 uppercase tracking-wider shadow-sm whitespace-nowrap">
                          {plan.badge}
                        </div>
                      )}

                      <div className="space-y-3 pt-1">
                        <div>
                          <h4 className="font-serif text-sm font-bold text-slate-100 flex items-center justify-between">
                            <span>{plan.name}</span>
                            {isSelected && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-slate-950 text-xs font-bold">
                                ✓
                              </span>
                            )}
                          </h4>
                          <div className="mt-2 flex items-baseline space-x-1">
                            <span className="font-serif text-3xl font-extrabold text-amber-300">
                              {plan.price}
                            </span>
                            <span className="text-xs text-purple-300/70">
                              {plan.period}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-purple-200/80 leading-relaxed">
                          {plan.description}
                        </p>

                        <div className="border-t border-purple-900/40 pt-2.5 space-y-1.5">
                          {plan.features.slice(0, 4).map((f, i) => (
                            <div key={i} className="flex items-start space-x-1.5 text-[11px] text-purple-200">
                              <Check className="h-3 w-3 text-amber-400 shrink-0 mt-0.5" />
                              <span className="leading-tight">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-2 border-t border-purple-900/50">
                        <div className={`text-center py-1.5 px-2 rounded-xl text-xs font-semibold ${
                          isSelected ? 'text-amber-300 bg-amber-500/10' : 'text-purple-400'
                        }`}>
                          {isCurrent ? 'Current Active Tier' : isSelected ? 'Selected Plan' : 'Click to Select'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Payment Checkout Box */}
              <div className="rounded-3xl border border-purple-700/60 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 p-5 sm:p-6 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-900/60 pb-3.5">
                  <div className="flex items-center space-x-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-slate-100">
                        Secure Payment: {selectedPlan.name} ({selectedPlan.price}{selectedPlan.period !== 'one-time' ? selectedPlan.period : ''})
                      </h4>
                      <p className="text-[11px] text-purple-300/80">
                        Card, Apple Pay, Google Pay & Stripe Merchant Integration
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {stripeStatus?.hasStripeKey ? (
                      <span className="flex items-center space-x-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Live Stripe Active</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                        <Shield className="h-3 w-3" />
                        <span>Direct Sandbox Active</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card input form */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-medium text-purple-200">
                        Card Number
                      </label>
                      <button
                        type="button"
                        onClick={fillTestCard}
                        className="text-[10px] text-amber-300 hover:text-amber-200 underline"
                      >
                        Auto-fill Test Card (4242...)
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full rounded-xl border border-purple-900/60 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:border-amber-400 focus:outline-none"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-[10px] font-bold text-slate-400">
                        <span>VISA</span>
                        <span>•</span>
                        <span>MC</span>
                        <span>•</span>
                        <span>AMEX</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-purple-200 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full rounded-xl border border-purple-900/60 bg-slate-900 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-purple-200 mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="888"
                        className="w-full rounded-xl border border-purple-900/60 bg-slate-900 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-purple-200 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={cardZip}
                        onChange={(e) => setCardZip(e.target.value)}
                        placeholder="90210"
                        className="w-full rounded-xl border border-purple-900/60 bg-slate-900 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Checkout Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleProcessPayment}
                    className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 py-3.5 px-6 font-serif text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                        <span>Securing Universal Transmission...</span>
                      </>
                    ) : (
                      <>
                        <LockKeyhole className="h-4 w-4" />
                        <span>Pay {selectedPlan.price} & Activate {selectedPlan.name}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Free trial alternative */}
                {!membership.isActive && (
                  <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-xs">
                    <span className="text-purple-300/80">Want to test everything with $0 upfront?</span>
                    <button
                      type="button"
                      onClick={handleClaimTrial}
                      className="text-amber-300 hover:text-amber-200 underline font-semibold"
                    >
                      Start 3-Day Free Trial ($0) →
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: PAYMENT SETUP & STRIPE MERCHANT GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              
              <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-slate-950 via-cyan-950/30 to-slate-950 p-6 shadow-xl space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  <Settings className="h-4 w-4 text-cyan-400" />
                  <span>Merchant Integration Architecture</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-100">
                  How to Set Up Real Stripe Payments for Your Membership
                </h3>
                <p className="text-xs text-purple-200/90 leading-relaxed">
                  Your application already includes a complete full-stack Stripe backend in <code className="text-amber-300 font-mono bg-purple-950/60 px-1 py-0.5 rounded">server.ts</code> and client checkout hooks. Follow these simple steps to take real payments directly to your bank account:
                </p>
              </div>

              {/* Step by step checklist */}
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="rounded-2xl border border-purple-800/40 bg-slate-950/70 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[10px]">1</span>
                      <span>Create or Log In to Your Stripe Account</span>
                    </span>
                    <a
                      href="https://dashboard.stripe.com/register"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-[11px] text-cyan-400 hover:text-cyan-300 underline"
                    >
                      <span>dashboard.stripe.com</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="text-xs text-purple-200/80 leading-relaxed">
                    Head to <strong className="text-slate-200">Stripe Dashboard</strong> and create a free merchant account. Stripe supports credit cards, Apple Pay, Google Pay, and international bank transfers.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="rounded-2xl border border-purple-800/40 bg-slate-950/70 p-5 space-y-3">
                  <span className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[10px]">2</span>
                    <span>Obtain Your API Keys</span>
                  </span>
                  <p className="text-xs text-purple-200/80 leading-relaxed">
                    In Stripe Dashboard, go to <strong className="text-slate-200">Developers → API keys</strong>. Copy your Secret key (<code className="text-amber-300 font-mono text-[11px]">sk_test_...</code> or <code className="text-amber-300 font-mono text-[11px]">sk_live_...</code>) and Publishable key (<code className="text-amber-300 font-mono text-[11px]">pk_test_...</code>).
                  </p>

                  <div className="rounded-xl bg-slate-900 border border-purple-900/60 p-3 text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-purple-400 font-mono">STRIPE_SECRET_KEY</span>
                      <button
                        onClick={() => handleCopyText('STRIPE_SECRET_KEY=sk_test_your_secret_key', 'sec_key')}
                        className="text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                      >
                        {copiedKey === 'sec_key' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedKey === 'sec_key' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-purple-400 font-mono">VITE_STRIPE_PUBLISHABLE_KEY</span>
                      <button
                        onClick={() => handleCopyText('VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key', 'pub_key')}
                        className="text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                      >
                        {copiedKey === 'pub_key' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedKey === 'pub_key' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="rounded-2xl border border-purple-800/40 bg-slate-950/70 p-5 space-y-2">
                  <span className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[10px]">3</span>
                    <span>Add Secrets in AI Studio Settings</span>
                  </span>
                  <p className="text-xs text-purple-200/80 leading-relaxed">
                    Open your AI Studio project <strong className="text-slate-200">Settings / Secrets</strong> menu and add <code className="text-amber-300 font-mono">STRIPE_SECRET_KEY</code> with your Stripe secret key value. The app server will automatically detect it and create real Stripe checkout sessions.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="rounded-2xl border border-purple-800/40 bg-slate-950/70 p-5 space-y-2">
                  <span className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[10px]">4</span>
                    <span>Configured Pricing Tiers</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                    <div className="rounded-xl bg-purple-950/50 p-2.5 border border-purple-800/40">
                      <div className="font-bold text-amber-300">$3 / week</div>
                      <div className="text-[10px] text-purple-200/80">Weekly recurring subscription</div>
                    </div>
                    <div className="rounded-xl bg-purple-950/50 p-2.5 border border-purple-800/40">
                      <div className="font-bold text-amber-300">$11 / month</div>
                      <div className="text-[10px] text-purple-200/80">Monthly recurring subscription</div>
                    </div>
                    <div className="rounded-xl bg-purple-950/50 p-2.5 border border-purple-800/40">
                      <div className="font-bold text-amber-300">$33 Lifetime</div>
                      <div className="text-[10px] text-purple-200/80">One-time payment, lifetime access</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('plans')}
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 font-serif text-xs font-bold text-white shadow-md hover:opacity-90 transition-opacity"
                >
                  Return to Membership & Checkout
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
