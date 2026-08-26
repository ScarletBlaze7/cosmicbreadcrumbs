import React, { useState } from 'react';
import { 
  Hash, 
  Sparkles, 
  HeartHandshake, 
  Layers, 
  RefreshCw, 
  Share2, 
  CheckCircle2,
  Calendar,
  Gem,
  Award,
  CircleDot,
  Lock,
  UserPlus,
  Compass,
  Flame,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  Users,
  Sun,
  Moon,
  Info,
  Globe,
  Radio,
  Crown,
  Gift,
  AlertCircle,
  Feather,
  CloudMoon,
  BookMarked,
  MoveRight
} from 'lucide-react';
import { UserProfile, MembershipStatus, CosmicView } from '../types';
import { 
  getFullNumerologyAnalysis, 
  calculateLifePath, 
  calculateDestinyNumber, 
  calculateSoulUrgeNumber,
  calculatePersonalityNumber,
  calculateBirthdayNumber,
  calculatePersonalYear,
  calculateNumerologySynastry,
  isMasterNumber,
  reduceToDigit,
  CHALDEAN_MAP
} from '../utils/numerologyCalc';
import { 
  NUMEROLOGY_PROFILES, 
  NUMEROLOGY_NUMBER_LIST, 
  NumberProfile,
  CHALDEAN_NUMEROLOGY_INFO
} from '../data/numerologyData';

interface NumerologyViewProps {
  userProfile: UserProfile;
  onSaveJournal: (title: string, type: 'numerology' | 'horoscope' | 'tarot' | 'angel', content: string) => void;
  membership?: MembershipStatus;
  onOpenWelcomeModal?: (featureName?: string, tab?: 'letter' | 'plans') => void;
  onNavigate?: (view: CosmicView) => void;
}

export const NumerologyView: React.FC<NumerologyViewProps> = ({
  userProfile,
  onSaveJournal,
  membership,
  onOpenWelcomeModal,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'chaldean' | 'all-numbers' | 'other-person' | 'compatibility'>('matrix');
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiSynthesis, setAiSynthesis] = useState<any | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // All Numbers Guide state
  const [selectedNumber, setSelectedNumber] = useState<number>(1);
  const [numberFilter, setNumberFilter] = useState<'all' | 'single' | 'master'>('all');

  // Partner Compatibility state
  const [partnerName, setPartnerName] = useState('');
  const [partnerBirthDate, setPartnerBirthDate] = useState('');
  const [partnerResult, setPartnerResult] = useState<any | null>(null);

  // Other Person Calculation state (Unique Tab - Members Only)
  const [otherName, setOtherName] = useState('');
  const [otherBirthDate, setOtherBirthDate] = useState('');
  const [otherRelationship, setOtherRelationship] = useState('Partner');
  const [otherResult, setOtherResult] = useState<any | null>(null);
  const [isOtherSaved, setIsOtherSaved] = useState(false);

  // Membership & Free Trial State Checks
  const isMemberUnlocked = Boolean(membership?.isActive);
  const isTrialExpired = Boolean(membership?.trialStartDate && !membership?.isActive);
  const hasTrialAvailable = Boolean(!membership?.trialStartDate && !membership?.isActive);

  // Querent's Numerology analysis using sacred Chaldean vibration
  const analysis = getFullNumerologyAnalysis(userProfile.name, userProfile.birthDate);
  const lpProfile = NUMEROLOGY_PROFILES[analysis.lifePath.number] || NUMEROLOGY_PROFILES[1];

  // Request AI synthesis (Members & Trial Only)
  const handleGenerateAINumerology = async () => {
    if (!isMemberUnlocked) {
      if (isTrialExpired) {
        onOpenWelcomeModal?.('AI Cosmic Blueprint Synthesis', 'plans');
      } else {
        onOpenWelcomeModal?.('AI Cosmic Blueprint Synthesis', 'letter');
      }
      return;
    }

    setLoadingAI(true);
    try {
      const res = await fetch('/api/gemini/numerology-synthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userProfile.name,
          lifePath: analysis.lifePath.number,
          destiny: analysis.destiny.number,
          soulUrge: analysis.soulUrge.number,
          birthdayNum: analysis.birthdayNumber.number,
          personalYear: analysis.personalYear.yearNumber,
          system: 'Chaldean Sacred Vibrations',
        }),
      });

      const data = await res.json();
      if (data.data) {
        setAiSynthesis(data.data);
      }
    } catch (err) {
      console.error('AI numerology request failed:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleCalculateCompatibility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMemberUnlocked) {
      if (isTrialExpired) {
        onOpenWelcomeModal?.('Chaldean Vibrational Compatibility', 'plans');
      } else {
        onOpenWelcomeModal?.('Chaldean Vibrational Compatibility', 'letter');
      }
      return;
    }

    if (!partnerBirthDate) return;

    const synastry = calculateNumerologySynastry(
      userProfile.name,
      userProfile.birthDate,
      partnerName || 'Partner',
      partnerBirthDate
    );

    setPartnerResult(synastry);
  };

  const handleCalculateOtherPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMemberUnlocked) {
      if (isTrialExpired) {
        onOpenWelcomeModal?.('Calculate for Someone Else', 'plans');
      } else {
        onOpenWelcomeModal?.('Calculate for Someone Else', 'letter');
      }
      return;
    }

    if (!otherBirthDate || !otherName) return;

    const otherAnalysis = getFullNumerologyAnalysis(otherName, otherBirthDate);
    const synastry = calculateNumerologySynastry(
      userProfile.name,
      userProfile.birthDate,
      otherName,
      otherBirthDate
    );

    setOtherResult({
      analysis: otherAnalysis,
      profile: NUMEROLOGY_PROFILES[otherAnalysis.lifePath.number] || NUMEROLOGY_PROFILES[1],
      relationship: otherRelationship,
      synastry,
    });
  };

  const handleSaveToJournal = () => {
    const title = `Chaldean Numerology Matrix - Life Path ${analysis.lifePath.number} (${userProfile.name})`;
    const content = isMemberUnlocked && aiSynthesis
      ? `System: Chaldean Sacred Numerology\nCosmic Blueprint: ${aiSynthesis.cosmicBlueprint}\n\nSoul Urge Truth: ${aiSynthesis.soulDesireTruth}\nPersonal Year ${analysis.personalYear.yearNumber} Theme: ${aiSynthesis.yearTheme}\n\nDaily Frequency Message: ${aiSynthesis.dailyFrequencyMessage}`
      : `System: Chaldean Sacred Numerology\nLife Path ${analysis.lifePath.number}: ${analysis.lifePath.title}\nArchetype: ${analysis.lifePath.archetype}\nPlanet: ${lpProfile.planet}\nElement: ${lpProfile.element}\n\nSummary: ${analysis.lifePath.description}\n\nAffirmation: "${lpProfile.affirmation}"`;

    onSaveJournal(title, 'numerology', content);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleSaveOtherToJournal = () => {
    if (!otherResult) return;
    const oAnalysis = otherResult.analysis;
    const title = `Chaldean Numerology Matrix for ${otherName} (${otherResult.relationship}) - Life Path ${oAnalysis.lifePath.number}`;
    const content = `Seeker: ${otherName}\nRelationship: ${otherResult.relationship}\nDate of Birth: ${otherBirthDate}\nSystem: Chaldean Sacred Numerology\n\n` +
      `Life Path ${oAnalysis.lifePath.number}: ${oAnalysis.lifePath.title}\nArchetype: ${oAnalysis.lifePath.archetype}\n` +
      `Chaldean Destiny / Expression: ${oAnalysis.destiny.number} (${oAnalysis.destiny.title})\n` +
      `Chaldean Soul Urge: ${oAnalysis.soulUrge.number}\nPersonality: ${oAnalysis.personality.number}\n` +
      `Personal Year: ${oAnalysis.personalYear.yearNumber} (${oAnalysis.personalYear.theme})\n\n` +
      `Harmonic Synergy with ${userProfile.name}: ${otherResult.synastry.harmonyScore}%\n` +
      `Life Path Dynamic: ${otherResult.synastry.lifePathResonance}\n` +
      `Soul Urge Resonance: ${otherResult.synastry.soulUrgeResonance}\n` +
      `Guidance: ${otherResult.synastry.relationshipAdvice}`;

    onSaveJournal(title, 'numerology', content);
    setIsOtherSaved(true);
    setTimeout(() => setIsOtherSaved(false), 2500);
  };

  const filteredNumbers = NUMEROLOGY_NUMBER_LIST.filter((num) => {
    if (numberFilter === 'single') return num <= 9;
    if (numberFilter === 'master') return isMasterNumber(num);
    return true;
  });

  const activeNumberDetail: NumberProfile = NUMEROLOGY_PROFILES[selectedNumber] || NUMEROLOGY_PROFILES[1];

  const handleUnlockClick = (featureName: string) => {
    if (isTrialExpired) {
      onOpenWelcomeModal?.(featureName, 'plans');
    } else {
      onOpenWelcomeModal?.(featureName, 'letter');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-purple-900/50 pb-5">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <Radio className="h-4 w-4" />
          <span>Sacred Sound Vibrations & Babylonian Geometry</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
          Chaldean Sacred Numerology
        </h1>
        <p className="text-xs text-purple-300/80 mt-1">
          Free Life Path Blueprints • Members-Only Sound Vibrations (Destiny, Soul Urge, Synastry & Auxiliary Calculations)
        </p>
      </div>

      {/* PERMANENT FEATURED NUMEROLOGY ARTWORK BANNER */}
      <div className="relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden border border-purple-500/40 shadow-2xl bg-black/50">
        <img
          src="/assets/numerologyart.jpg"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = './assets/numerologyart.jpg'; }}
          alt="Sacred Numerology Matrix"
          className="w-full h-auto object-cover rounded-3xl select-none"
        />
      </div>

      {/* View Navigation Tabs - Positioned Under Photo & Above Calculation Section */}
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-purple-700/60 bg-slate-900/95 p-2 sm:p-2.5 shadow-xl max-w-4xl mx-auto">
        {/* Tab 1: My Soul Matrix */}
        <button
          key="tab-matrix"
          id="tab-numerology-matrix"
          onClick={() => setActiveTab('matrix')}
          className={`shrink-0 rounded-xl px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'matrix'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border border-amber-400/50 scale-105'
              : 'bg-slate-950/80 border border-purple-900/60 text-purple-100 hover:bg-purple-950/60 hover:text-white'
          }`}
        >
          <Hash className="h-4 w-4 text-purple-300" />
          <span>My Soul Matrix</span>
          <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold border ${
            activeTab === 'matrix'
              ? 'bg-emerald-400 text-slate-950 border-emerald-300'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }`}>
            Free Life Path
          </span>
        </button>

        {/* Tab 2: Chaldean Wisdom */}
        <button
          key="tab-chaldean"
          id="tab-numerology-chaldean-wisdom"
          onClick={() => setActiveTab('chaldean')}
          className={`shrink-0 rounded-xl px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'chaldean'
              ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md border border-amber-300 scale-105'
              : 'bg-slate-950/80 border border-purple-900/60 text-amber-300 hover:bg-purple-950/60 hover:text-amber-200'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Chaldean Wisdom</span>
        </button>

        {/* Tab 3: All Numbers Guide */}
        <button
          key="tab-all-numbers"
          id="tab-numerology-all-numbers"
          onClick={() => setActiveTab('all-numbers')}
          className={`shrink-0 rounded-xl px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'all-numbers'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border border-amber-400/50 scale-105'
              : 'bg-slate-950/80 border border-purple-900/60 text-purple-100 hover:bg-purple-950/60 hover:text-white'
          }`}
        >
          <BookOpen className="h-4 w-4 text-purple-300" />
          <span>All Numbers Guide</span>
        </button>

        {/* Tab 4: Calculate for Someone Else */}
        <button
          key="tab-other-person"
          id="tab-numerology-other-person"
          onClick={() => setActiveTab('other-person')}
          className={`shrink-0 rounded-xl px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'other-person'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border border-amber-400/50 scale-105'
              : 'bg-slate-950/80 border border-purple-900/60 text-purple-100 hover:bg-purple-950/60 hover:text-white'
          }`}
        >
          <UserPlus className="h-4 w-4 text-amber-400" />
          <span>Calculate for Someone Else</span>
          <span className="flex items-center space-x-0.5 rounded-full bg-amber-400/20 text-amber-300 px-1.5 py-0.5 text-[9px] font-bold border border-amber-400/40">
            <Lock className="h-2.5 w-2.5 inline" />
            <span>PRO</span>
          </span>
        </button>

        {/* Tab 5: Vibrational Compatibility */}
        <button
          key="tab-compatibility"
          id="tab-numerology-compatibility"
          onClick={() => setActiveTab('compatibility')}
          className={`shrink-0 rounded-xl px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'compatibility'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border border-amber-400/50 scale-105'
              : 'bg-slate-950/80 border border-purple-900/60 text-purple-100 hover:bg-purple-950/60 hover:text-white'
          }`}
        >
          <HeartHandshake className="h-4 w-4 text-rose-400" />
          <span>Vibrational Match</span>
          <span className="flex items-center space-x-0.5 rounded-full bg-amber-400/20 text-amber-300 px-1.5 py-0.5 text-[9px] font-bold border border-amber-400/40">
            <Lock className="h-2.5 w-2.5 inline" />
            <span>PRO</span>
          </span>
        </button>
      </div>

      {/* Trial Expired Alert Banner (Encouraging Membership) */}
      {isTrialExpired && (
        <div className="rounded-3xl border-2 border-amber-500/60 bg-gradient-to-r from-amber-950/60 via-purple-950/70 to-slate-950 p-5 sm:p-6 shadow-2xl animate-in fade-in flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/25 border border-amber-400/50 text-amber-300">
              <AlertCircle className="h-6 w-6 text-amber-400 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-serif text-sm sm:text-base font-bold text-amber-200">
                  Your 3-Day Free Trial Has Concluded
                </span>
                <span className="rounded-full bg-amber-500/20 border border-amber-400/50 px-2 py-0.5 text-[9px] font-bold text-amber-300 uppercase">
                  Trial Expired
                </span>
              </div>
              <p className="text-xs text-purple-200/90 leading-relaxed max-w-3xl">
                Life Path calculations remain 100% free! To continue unlocking your <strong>Chaldean Destiny Number</strong>, <strong>Soul Urge Acoustic Vibrations</strong>, <strong>Compatibility Synastry</strong>, and <strong>Calculating for Loved Ones</strong>, join the Sanctuary Club.
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenWelcomeModal?.('The Sanctuary Club Membership', 'plans')}
            className="shrink-0 flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-6 py-3 font-serif text-xs font-bold text-slate-950 shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Crown className="h-4 w-4" />
            <span>Join Sanctuary Club ($3, $11, $33)</span>
          </button>
        </div>
      )}

      {/* Free Trial Not Yet Claimed Banner (for non-trial users) */}
      {hasTrialAvailable && (
        <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-r from-purple-950/60 via-slate-900 to-amber-950/30 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-serif text-lg font-bold">
              <Gift className="h-5 w-5 animate-pulse text-amber-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-serif text-sm font-bold text-amber-200">
                  Free Life Path Active • 3-Day Free Trial Available ($0 Upfront)
                </span>
                <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 text-[9px] font-bold uppercase">
                  Free Seeker
                </span>
              </div>
              <p className="text-xs text-purple-200/80 leading-relaxed max-w-2xl">
                Your Life Path number and sacred wisdom guide are free forever. Unlock Chaldean Destiny, Soul Urge vibrations, synastry reports, and someone else calculations with your 3-day free trial.
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenWelcomeModal?.('3-Day Free Trial', 'letter')}
            className="shrink-0 flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2 font-serif text-xs font-bold text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 transition-all self-start sm:self-auto"
          >
            <span>Activate 3-Day Free Trial</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* TAB 1: Soul Matrix */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Chaldean Sacred System Banner */}
          <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-purple-950/50 to-slate-950 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/40 font-serif text-lg font-bold">
                ✦
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-serif text-sm sm:text-base font-bold text-slate-100">
                    Calculated Exclusively with Chaldean Sacred Numerology
                  </span>
                  <span className="rounded-full bg-amber-400/25 border border-amber-400/50 px-2 py-0.5 text-[9px] font-bold text-amber-300 tracking-wider">
                    ANCIENT SOUND FREQUENCIES
                  </span>
                </div>
                <p className="text-xs text-purple-200/80 leading-relaxed max-w-3xl">
                  {CHALDEAN_NUMEROLOGY_INFO.shortDescription}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('chaldean')}
              className="shrink-0 flex items-center space-x-1.5 rounded-xl border border-amber-400/60 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all self-start sm:self-auto"
            >
              <span>Explore Chaldean Wisdom</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Core Numbers Bento Grid: 1 FREE (Life Path) + 3 MEMBERS-ONLY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Life Path Number (100% FREE & FULLY VISIBLE) */}
            <div className={`relative overflow-hidden rounded-3xl border ${
              analysis.lifePath.masterNumber 
                ? 'border-amber-400/80 bg-gradient-to-br from-amber-950/50 via-slate-900 to-purple-950/80 shadow-2xl ring-2 ring-amber-400/30' 
                : 'border-emerald-500/50 bg-gradient-to-br from-purple-950/70 via-slate-900 to-slate-950 shadow-xl'
            } p-5`}>
              <div className="flex items-center justify-between text-xs font-semibold uppercase">
                <span className="text-amber-300 flex items-center space-x-1">
                  <span>Life Path Number</span>
                </span>
                <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 text-[9px] font-bold tracking-wider">
                  FREE ACCESS
                </span>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="font-serif text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                  {analysis.lifePath.number}
                </span>
                <span className="text-xs font-semibold text-purple-200 truncate">
                  {analysis.lifePath.archetype}
                </span>
              </div>
              <p className="mt-2 text-xs text-purple-200/90 leading-relaxed">
                {analysis.lifePath.description}
              </p>
              {analysis.lifePath.masterNumber && (
                <div className="mt-3 flex items-center space-x-1 text-[10px] text-amber-300 font-semibold">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span>Sacred Master Number Frequency</span>
                </div>
              )}
            </div>

            {/* 2. Destiny / Expression Number (MEMBERS ONLY) */}
            {isMemberUnlocked ? (
              <div className={`rounded-3xl border ${
                isMasterNumber(analysis.destiny.number) 
                  ? 'border-purple-400/60 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/80' 
                  : 'border-purple-800/40 bg-slate-900/90'
              } p-5 shadow-xl`}>
                <div className="flex items-center justify-between text-xs text-purple-400 font-semibold uppercase">
                  <span className="flex items-center space-x-1">
                    <span>Chaldean Destiny</span>
                    <span className="text-[9px] text-amber-400 lowercase">(sound)</span>
                  </span>
                  {isMasterNumber(analysis.destiny.number) ? (
                    <span className="rounded-full bg-purple-400/20 border border-purple-400 px-1.5 py-0.5 text-[9px] text-purple-200">
                      MASTER
                    </span>
                  ) : (
                    <span className="rounded-full bg-purple-950 border border-purple-700/50 px-1.5 py-0.5 text-[9px] text-purple-300">
                      MEMBER
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-baseline space-x-2">
                  <span className="font-serif text-4xl font-bold text-purple-300">
                    {analysis.destiny.number}
                  </span>
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {analysis.destiny.title.split(':')[0]}
                  </span>
                </div>
                <p className="mt-2 text-xs text-purple-200/80 line-clamp-2">
                  {analysis.destiny.description}
                </p>
              </div>
            ) : (
              /* Gated Locked Card for Destiny */
              <div 
                onClick={() => handleUnlockClick('Chaldean Destiny Number')}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-purple-800/50 bg-slate-900/80 p-5 shadow-xl hover:border-amber-400/60 transition-all"
              >
                <div className="flex items-center justify-between text-xs text-purple-400/80 font-semibold uppercase">
                  <span>Chaldean Destiny</span>
                  <span className="flex items-center space-x-1 rounded-full bg-amber-400/20 text-amber-300 px-2 py-0.5 text-[9px] font-bold border border-amber-400/40">
                    <Lock className="h-2.5 w-2.5 inline" />
                    <span>Members Only</span>
                  </span>
                </div>
                
                <div className="mt-3 flex items-baseline space-x-2 filter blur-sm select-none opacity-40">
                  <span className="font-serif text-4xl font-bold text-purple-300">
                    {analysis.destiny.number}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">
                    Name Sound Frequency
                  </span>
                </div>

                <div className="mt-3 rounded-2xl bg-purple-950/70 border border-purple-700/40 p-3 text-center space-y-1">
                  <div className="flex items-center justify-center space-x-1 text-amber-300 text-xs font-semibold">
                    <Lock className="h-3 w-3" />
                    <span>{isTrialExpired ? 'Trial Expired — Join Circle' : 'Unlock with Free Trial'}</span>
                  </div>
                  <p className="text-[10px] text-purple-300/80">
                    Vibrational sound frequency of your full name.
                  </p>
                </div>
              </div>
            )}

            {/* 3. Soul Urge Number (MEMBERS ONLY) */}
            {isMemberUnlocked ? (
              <div className="rounded-3xl border border-rose-900/40 bg-slate-900/90 p-5 shadow-xl">
                <div className="flex items-center justify-between text-xs text-rose-400 font-semibold uppercase">
                  <span className="flex items-center space-x-1">
                    <span>Chaldean Soul Urge</span>
                    <span className="text-[9px] text-rose-300 lowercase">(vowels)</span>
                  </span>
                  {isMasterNumber(analysis.soulUrge.number) ? (
                    <span className="rounded-full bg-rose-400/20 border border-rose-400 px-1.5 py-0.5 text-[9px] text-rose-200">
                      MASTER
                    </span>
                  ) : (
                    <span className="rounded-full bg-rose-950 border border-rose-700/50 px-1.5 py-0.5 text-[9px] text-rose-300">
                      MEMBER
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-baseline space-x-2">
                  <span className="font-serif text-4xl font-bold text-rose-300">
                    {analysis.soulUrge.number}
                  </span>
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    Heart's Secret Longing
                  </span>
                </div>
                <p className="mt-2 text-xs text-purple-200/80 line-clamp-2">
                  {analysis.soulUrge.description}
                </p>
              </div>
            ) : (
              /* Gated Locked Card for Soul Urge */
              <div 
                onClick={() => handleUnlockClick('Chaldean Soul Urge Vibration')}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-purple-800/50 bg-slate-900/80 p-5 shadow-xl hover:border-rose-400/60 transition-all"
              >
                <div className="flex items-center justify-between text-xs text-rose-400/80 font-semibold uppercase">
                  <span>Chaldean Soul Urge</span>
                  <span className="flex items-center space-x-1 rounded-full bg-amber-400/20 text-amber-300 px-2 py-0.5 text-[9px] font-bold border border-amber-400/40">
                    <Lock className="h-2.5 w-2.5 inline" />
                    <span>Members Only</span>
                  </span>
                </div>
                
                <div className="mt-3 flex items-baseline space-x-2 filter blur-sm select-none opacity-40">
                  <span className="font-serif text-4xl font-bold text-rose-300">
                    {analysis.soulUrge.number}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">
                    Heart's Desire Frequency
                  </span>
                </div>

                <div className="mt-3 rounded-2xl bg-rose-950/50 border border-rose-800/40 p-3 text-center space-y-1">
                  <div className="flex items-center justify-center space-x-1 text-rose-300 text-xs font-semibold">
                    <Lock className="h-3 w-3" />
                    <span>{isTrialExpired ? 'Trial Expired — Join Circle' : 'Unlock with Free Trial'}</span>
                  </div>
                  <p className="text-[10px] text-purple-300/80">
                    Acoustic vowel frequencies of your inner spirit.
                  </p>
                </div>
              </div>
            )}

            {/* 4. Personal Year Cycle (MEMBERS ONLY) */}
            {isMemberUnlocked ? (
              <div className="rounded-3xl border border-indigo-800/40 bg-slate-900/90 p-5 shadow-xl">
                <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold uppercase">
                  <span>Personal Year</span>
                  {isMasterNumber(analysis.personalYear.yearNumber) ? (
                    <span className="rounded-full bg-indigo-400/20 border border-indigo-400 px-1.5 py-0.5 text-[9px] text-indigo-200">
                      MASTER YEAR
                    </span>
                  ) : (
                    <span className="rounded-full bg-indigo-950 border border-indigo-700/50 px-1.5 py-0.5 text-[9px] text-indigo-300">
                      MEMBER
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-baseline space-x-2">
                  <span className="font-serif text-4xl font-bold text-indigo-300">
                    {analysis.personalYear.yearNumber}
                  </span>
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    Of 9-Year Cycle
                  </span>
                </div>
                <p className="mt-2 text-xs text-purple-200/80 line-clamp-2">
                  {analysis.personalYear.description}
                </p>
              </div>
            ) : (
              /* Gated Locked Card for Personal Year */
              <div 
                onClick={() => handleUnlockClick('Personal Year Cycle')}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-purple-800/50 bg-slate-900/80 p-5 shadow-xl hover:border-indigo-400/60 transition-all"
              >
                <div className="flex items-center justify-between text-xs text-indigo-400/80 font-semibold uppercase">
                  <span>Personal Year</span>
                  <span className="flex items-center space-x-1 rounded-full bg-amber-400/20 text-amber-300 px-2 py-0.5 text-[9px] font-bold border border-amber-400/40">
                    <Lock className="h-2.5 w-2.5 inline" />
                    <span>Members Only</span>
                  </span>
                </div>
                
                <div className="mt-3 flex items-baseline space-x-2 filter blur-sm select-none opacity-40">
                  <span className="font-serif text-4xl font-bold text-indigo-300">
                    {analysis.personalYear.yearNumber}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">
                    9-Year Spiritual Transit
                  </span>
                </div>

                <div className="mt-3 rounded-2xl bg-indigo-950/50 border border-indigo-800/40 p-3 text-center space-y-1">
                  <div className="flex items-center justify-center space-x-1 text-indigo-300 text-xs font-semibold">
                    <Lock className="h-3 w-3" />
                    <span>{isTrialExpired ? 'Trial Expired — Join Circle' : 'Unlock with Free Trial'}</span>
                  </div>
                  <p className="text-[10px] text-purple-300/80">
                    Your current yearly cosmic forecast cycle.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Deep Life Path & Synthesis Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Full Life Path Information (100% FREE) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-purple-800/40 bg-slate-900/90 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                    <Compass className="h-4 w-4" />
                    <span>Free Life Path Blueprint</span>
                  </span>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 text-[10px] font-bold">
                    UNLOCKED
                  </span>
                </div>

                <div className="flex items-center space-x-3.5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/40 font-serif text-3xl font-bold shadow-inner">
                    {analysis.lifePath.number}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-100">
                      {lpProfile.title}
                    </h3>
                    <p className="text-xs text-purple-300 mt-0.5">
                      Ruling Planet: <span className="text-amber-300 font-semibold">{lpProfile.planet}</span> • Element: <span className="text-cyan-300 font-semibold">{lpProfile.element}</span>
                    </p>
                  </div>
                </div>

                {/* Master Number Callout if applicable */}
                {analysis.lifePath.masterNumber && (
                  <div className="rounded-2xl border border-amber-500/40 bg-amber-950/30 p-3 text-xs text-amber-200/90 leading-relaxed">
                    <span className="font-semibold text-amber-300 flex items-center space-x-1 mb-1">
                      <Star className="h-3.5 w-3.5 inline text-amber-400" />
                      <span>Sacred Master Number Frequency ({analysis.lifePath.number})</span>
                    </span>
                    You carry a sacred master vibration embodying heightened spiritual responsibility, higher intuition, and purpose-driven alignment.
                  </div>
                )}

                {/* Core Strengths */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-semibold text-amber-300 flex items-center space-x-1.5">
                    <Award className="h-3.5 w-3.5" />
                    <span>Inherent Spiritual Strengths</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {lpProfile.strengths.map((str, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg border border-purple-700/40 bg-purple-950/40 px-2.5 py-1 text-[11px] text-purple-200"
                      >
                        ✓ {str}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Growth Challenges */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-semibold text-rose-400 flex items-center space-x-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    <span>Karmic Lessons & Shadow</span>
                  </div>
                  <ul className="space-y-1 text-xs text-purple-200/80">
                    {lpProfile.challenges.map((ch, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-rose-400">•</span>
                        <span>{ch}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resonant Crystals & Sacred Correspondences */}
                <div className="rounded-2xl border border-purple-900/60 bg-slate-950/60 p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 flex items-center space-x-1">
                      <Gem className="h-3 w-3 text-cyan-400" />
                      <span>Resonance Gemstones:</span>
                    </span>
                    <span className="font-semibold text-slate-200">{lpProfile.gemstone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 flex items-center space-x-1">
                      <CircleDot className="h-3 w-3 text-amber-400" />
                      <span>Sacred Symbol:</span>
                    </span>
                    <span className="font-semibold text-amber-300 truncate max-w-[170px]">{lpProfile.sacredSymbol}</span>
                  </div>
                </div>

                {/* Free Affirmation */}
                <div className="pt-2 border-t border-purple-900/40 text-center">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mb-0.5">
                    Daily Life Path Affirmation
                  </span>
                  <p className="font-serif text-xs text-slate-200 italic">
                    "{lpProfile.affirmation}"
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: AI Cosmic Blueprint Synthesis & Multi-Number Integration */}
            <div className="lg:col-span-7 space-y-6">
              {isMemberUnlocked ? (
                /* Unlocked AI Synthesis for Members / Free Trial */
                <div className="rounded-3xl border border-purple-700/50 bg-gradient-to-br from-purple-950/70 via-slate-900 to-slate-950 p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-800/40 pb-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
                        <Sparkles className="h-5 w-5 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-serif text-base font-bold text-slate-100">
                            Chaldean Cosmic Blueprint Synthesis
                          </h3>
                          <span className="rounded-full bg-purple-500/20 border border-purple-400/40 px-2 py-0.5 text-[9px] font-bold text-purple-300">
                            MEMBERS
                          </span>
                        </div>
                        <p className="text-xs text-purple-300/80">
                          Harmonizing Life Path {analysis.lifePath.number} + Chaldean Destiny {analysis.destiny.number} + Soul Urge {analysis.soulUrge.number}
                        </p>
                      </div>
                    </div>

                    <button
                      id="btn-ai-numerology-synthesis"
                      onClick={handleGenerateAINumerology}
                      disabled={loadingAI}
                      className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${loadingAI ? 'animate-spin' : ''}`} />
                      <span>{loadingAI ? 'Channeling Chaldean Matrix...' : 'AI Chaldean Synthesis'}</span>
                    </button>
                  </div>

                  <div className="mt-4 space-y-4">
                    <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
                      {aiSynthesis?.cosmicBlueprint || analysis.lifePath.description}
                    </p>

                    {/* Soul Urge Truth */}
                    <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-4 space-y-1">
                      <div className="text-xs font-semibold text-rose-300">
                        Chaldean Soul Urge {analysis.soulUrge.number} — The Heart's Hidden Drive
                      </div>
                      <p className="text-xs text-purple-200/80 leading-relaxed">
                        {aiSynthesis?.soulDesireTruth || analysis.soulUrge.description}
                      </p>
                    </div>

                    {/* Personal Year Guidance */}
                    <div className="rounded-2xl border border-indigo-900/40 bg-indigo-950/20 p-4 space-y-1">
                      <div className="text-xs font-semibold text-indigo-300">
                        {analysis.personalYear.theme}
                      </div>
                      <p className="text-xs text-purple-200/80 leading-relaxed">
                        {aiSynthesis?.yearTheme || analysis.personalYear.description}
                      </p>
                    </div>

                    {/* Log Action */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <div className="text-xs text-amber-200 italic font-serif">
                        "{aiSynthesis?.dailyFrequencyMessage || lpProfile.affirmation || 'Honor your sacred number vibration and walk your authentic truth.'}"
                      </div>

                      <button
                        onClick={handleSaveToJournal}
                        className={`flex shrink-0 items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                          isSaved
                            ? 'bg-emerald-600 text-white'
                            : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800 border border-purple-700/50'
                        }`}
                      >
                        {isSaved ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Logged to Journal!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="h-4 w-4" />
                            <span>Log Matrix to Journal</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Gated Presentation for Non-Members / Expired Trial */
                <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-purple-950/70 via-slate-900 to-amber-950/30 p-6 sm:p-8 shadow-2xl space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-inner">
                      <Lock className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                        Members & Free Trial Feature
                      </span>
                      <h3 className="font-serif text-xl font-bold text-slate-100 mt-1">
                        Chaldean Multi-Frequency Matrix Synthesis
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
                    While your <strong>Life Path {analysis.lifePath.number}</strong> is free, ancient Chaldean wisdom unlocks its deepest secrets when harmonized with your <strong>Destiny Sound Frequency</strong>, <strong>Soul Urge Heart Longings</strong>, and <strong>Personal Year Forecast</strong>.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="rounded-2xl border border-purple-800/40 bg-slate-950/60 p-3.5 space-y-1">
                      <span className="text-purple-300 font-semibold text-xs flex items-center space-x-1">
                        <Zap className="h-3.5 w-3.5 text-purple-400" />
                        <span>Destiny Sound Vibration</span>
                      </span>
                      <p className="text-[11px] text-purple-300/80">
                        The acoustic sound vibration of your spoken name and cosmic destiny.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-rose-900/40 bg-slate-950/60 p-3.5 space-y-1">
                      <span className="text-rose-300 font-semibold text-xs flex items-center space-x-1">
                        <Flame className="h-3.5 w-3.5 text-rose-400" />
                        <span>Soul Urge Longing</span>
                      </span>
                      <p className="text-[11px] text-purple-300/80">
                        Acoustic vowel frequencies revealing your spirit's deepest subconscious craving.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-indigo-800/40 bg-slate-950/60 p-3.5 space-y-1">
                      <span className="text-indigo-300 font-semibold text-xs flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Personal Year Transit</span>
                      </span>
                      <p className="text-[11px] text-purple-300/80">
                        Your exact placement within the sacred 9-year cycle of manifestation.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-purple-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-purple-300/80 text-center sm:text-left">
                      {isTrialExpired ? (
                        <span className="text-amber-300 font-semibold">
                          Your trial has ended. Select a plan to continue unlocking full readings.
                        </span>
                      ) : (
                        <span>
                          Activate your 3-day free trial at $0 upfront to unlock all matrix frequencies.
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleUnlockClick('Chaldean Cosmic Blueprint Synthesis')}
                      className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-6 py-3 font-serif text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      {isTrialExpired ? 'Join Membership ($3, $11, $33)' : 'Start 3-Day Free Trial ($0)'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Chaldean Sacred Wisdom & Why It Is Considered Most Sacred */}
      {activeTab === 'chaldean' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Main Wisdom Banner */}
          <div className="rounded-3xl border border-amber-400/60 bg-gradient-to-br from-purple-950/80 via-slate-900 to-amber-950/40 p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="h-4 w-4" />
              <span>Sacred Esoteric Science • {CHALDEAN_NUMEROLOGY_INFO.origin}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
              What Is Chaldean Numerology & Why Is It Considered Most Sacred?
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed max-w-4xl">
              {CHALDEAN_NUMEROLOGY_INFO.shortDescription}
            </p>
          </div>

          {/* 4 Pillars of Sacredness Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {CHALDEAN_NUMEROLOGY_INFO.whyConsideredMostSacred.map((pillar, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-purple-800/50 bg-slate-900/90 p-6 shadow-xl space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 font-serif font-bold text-sm border border-amber-400/40">
                    {idx + 1}
                  </div>
                  <h3 className="font-serif text-base font-bold text-slate-100">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-xs text-purple-200/80 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* The Sacred Mystery of 9 Spotlight Card */}
          <div className="rounded-3xl border border-amber-500/50 bg-gradient-to-r from-amber-950/30 via-slate-900 to-purple-950/70 p-6 sm:p-7 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <Star className="h-4 w-4 text-amber-400" />
              <span>The Divine Mystery of Number 9</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-100">
              Why Is the Number 9 Excluded from Letter Assignments?
            </h3>
            <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
              In Chaldean tradition, <strong>9 represents the highest spiritual frequency of the Divine Source, universal creation, and eternal perfection</strong>. Because it is the sacred number of God and cosmic completion, the ancient Chaldean mystics believed it would be sacrilegious to affix 9 to any mortal or material alphabet character. It stands sacred and solitary—manifesting only when numbers naturally sum to 9 or in birth dates, signaling divine intervention and spiritual culmination.
            </p>
          </div>

          {/* Chaldean Sacred Letter Vibration Table */}
          <div className="rounded-3xl border border-purple-800/40 bg-slate-900/90 p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-900/50 pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-100 flex items-center space-x-2">
                  <Radio className="h-4 w-4 text-amber-400" />
                  <span>The Chaldean Sound-Letter Frequency Matrix (1–8)</span>
                </h3>
                <p className="text-xs text-purple-300/80">
                  Every letter is matched directly to its occult acoustic frequency and governing planetary sphere.
                </p>
              </div>
              <span className="rounded-full bg-purple-950 border border-purple-700/50 px-3 py-1 text-[10px] text-purple-300 self-start sm:self-auto">
                No Letter = 9 (Sacred)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {CHALDEAN_NUMEROLOGY_INFO.letterVibrations.map((item) => (
                <div
                  key={item.number}
                  className="rounded-2xl border border-purple-900/60 bg-slate-950/70 p-4 space-y-2 hover:border-amber-400/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 font-serif text-lg font-bold border border-amber-400/30">
                      {item.number}
                    </span>
                    <span className="text-[11px] font-semibold text-purple-300">
                      {item.planet}
                    </span>
                  </div>

                  <div className="pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Sacred Letters
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.letters.map((char) => (
                        <span
                          key={char}
                          className="rounded-md bg-purple-900/40 border border-purple-700/50 px-2 py-0.5 font-mono text-xs font-bold text-amber-200"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-purple-200/70 pt-1 leading-snug">
                    {item.vibrationalEssence}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: All Numbers & Master Vibrations (1–9, 11, 22, 33) Guide */}
      {activeTab === 'all-numbers' && (
        <div className="space-y-6">
          {/* Header & Filter Controls */}
          <div className="rounded-3xl border border-purple-800/40 bg-slate-900/90 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs text-amber-400 font-semibold uppercase">
                <BookOpen className="h-4 w-4" />
                <span>Sacred Vibrational Encyclopedia</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-100 mt-1">
                Complete Numerology Explanations & Archetypes
              </h2>
              <p className="text-xs text-purple-300/80 mt-1">
                Detailed explanations, divine missions, shadow lessons, and correspondences for every sacred frequency (1–9, 11, 22, 33).
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-1 rounded-2xl border border-purple-800/60 bg-slate-950 p-1 self-start md:self-auto">
              <button
                onClick={() => setNumberFilter('all')}
                className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
                  numberFilter === 'all'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-300/70 hover:bg-purple-950/50'
                }`}
              >
                All (12)
              </button>
              <button
                onClick={() => setNumberFilter('single')}
                className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
                  numberFilter === 'single'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-300/70 hover:bg-purple-950/50'
                }`}
              >
                Root Digits (1–9)
              </button>
              <button
                onClick={() => setNumberFilter('master')}
                className={`rounded-xl px-3 py-1 text-xs font-semibold flex items-center space-x-1 transition-all ${
                  numberFilter === 'master'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-amber-300/80 hover:bg-purple-950/50'
                }`}
              >
                <Sparkles className="h-3 w-3" />
                <span>Master (11, 22, 33)</span>
              </button>
            </div>
          </div>

          {/* Number Selector Carousel / Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2.5">
            {filteredNumbers.map((num) => {
              const prof = NUMEROLOGY_PROFILES[num];
              const isSelected = selectedNumber === num;
              const isMaster = isMasterNumber(num);

              return (
                <button
                  key={num}
                  id={`btn-select-number-${num}`}
                  onClick={() => setSelectedNumber(num)}
                  className={`relative flex flex-col items-center justify-center rounded-2xl p-3 text-center transition-all ${
                    isSelected
                      ? isMaster
                        ? 'border-2 border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/20 scale-105 ring-2 ring-amber-400/40'
                        : 'border-2 border-purple-400 bg-purple-600/30 shadow-lg shadow-purple-600/20 scale-105'
                      : isMaster
                        ? 'border border-amber-500/50 bg-slate-900/90 hover:border-amber-400/80'
                        : 'border border-purple-900/50 bg-slate-900/80 hover:border-purple-700/60'
                  }`}
                >
                  {isMaster && (
                    <span className="absolute -top-1.5 -right-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-[8px] px-1 py-0.2 shadow">
                      ★
                    </span>
                  )}
                  <span className={`font-serif text-2xl font-black ${
                    isMaster ? 'text-amber-300' : 'text-slate-100'
                  }`}>
                    {num}
                  </span>
                  <span className="text-[10px] text-purple-200/80 font-medium truncate max-w-full mt-0.5">
                    {prof?.archetype.split('/')[0].trim()}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Number Card */}
          <div className={`rounded-3xl border ${
            activeNumberDetail.isMasterNumber
              ? 'border-amber-400/60 bg-gradient-to-br from-purple-950/60 via-slate-900 to-amber-950/30 shadow-2xl ring-1 ring-amber-400/30'
              : 'border-purple-800/40 bg-slate-900/90 shadow-xl'
          } p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200`}>
            {/* Title Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-900/50 pb-6">
              <div className="flex items-center space-x-4">
                <div className={`flex h-16 w-16 items-center justify-center rounded-3xl font-serif text-3xl font-black shadow-inner ${
                  activeNumberDetail.isMasterNumber
                    ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 ring-2 ring-amber-300'
                    : 'bg-gradient-to-br from-purple-600 to-indigo-800 text-white'
                }`}>
                  {activeNumberDetail.number}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-100">
                      {activeNumberDetail.title}
                    </h3>
                    {activeNumberDetail.isMasterNumber && (
                      <span className="rounded-full bg-amber-400/20 border border-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 tracking-wider">
                        SACRED MASTER VIBRATION
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-purple-300 mt-1">
                    Archetype: <span className="text-amber-300 font-semibold">{activeNumberDetail.archetype}</span> • Planet: <span className="text-slate-200 font-semibold">{activeNumberDetail.planet}</span> • Element: <span className="text-slate-200 font-semibold">{activeNumberDetail.element}</span>
                  </p>
                </div>
              </div>

              {/* Keywords Pills */}
              <div className="flex flex-wrap gap-1.5 self-start sm:self-auto max-w-sm">
                {activeNumberDetail.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-purple-950/70 border border-purple-700/50 px-2.5 py-1 text-[11px] font-medium text-purple-200"
                  >
                    ✦ {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Explanations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Life Path Meaning */}
              <div className="rounded-2xl border border-amber-900/40 bg-slate-950/60 p-4 space-y-2">
                <div className="text-xs font-bold text-amber-400 uppercase flex items-center space-x-1.5">
                  <Compass className="h-3.5 w-3.5" />
                  <span>Life Path & Soul Purpose</span>
                </div>
                <p className="text-xs text-purple-100/90 leading-relaxed">
                  {activeNumberDetail.lifePathSummary}
                </p>
              </div>

              {/* Destiny Meaning */}
              <div className="rounded-2xl border border-purple-900/40 bg-slate-950/60 p-4 space-y-2">
                <div className="text-xs font-bold text-purple-400 uppercase flex items-center space-x-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Destiny & Outer Calling</span>
                </div>
                <p className="text-xs text-purple-100/90 leading-relaxed">
                  {activeNumberDetail.destinySummary}
                </p>
              </div>

              {/* Soul Urge Meaning */}
              <div className="rounded-2xl border border-rose-900/40 bg-slate-950/60 p-4 space-y-2">
                <div className="text-xs font-bold text-rose-400 uppercase flex items-center space-x-1.5">
                  <Flame className="h-3.5 w-3.5" />
                  <span>Soul Urge & Inner Longing</span>
                </div>
                <p className="text-xs text-purple-100/90 leading-relaxed">
                  {activeNumberDetail.soulUrgeSummary}
                </p>
              </div>
            </div>

            {/* Strengths, Shadow Lessons & Divine Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths & Careers */}
              <div className="space-y-4 rounded-2xl border border-purple-800/40 bg-slate-950/40 p-5">
                <div>
                  <div className="text-xs font-bold text-emerald-400 uppercase flex items-center space-x-1.5 mb-2">
                    <Award className="h-3.5 w-3.5" />
                    <span>Gifts, Strengths & Master Qualities</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeNumberDetail.strengths.map((str, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 text-xs text-emerald-200"
                      >
                        ✓ {str}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-xs font-bold text-cyan-400 uppercase mb-1.5">
                    Aligned Vocations & Career Paths
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeNumberDetail.careerPaths.map((cp, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 text-[11px] text-cyan-200"
                      >
                        • {cp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Shadow Lessons & Spiritual Mission */}
              <div className="space-y-4 rounded-2xl border border-purple-800/40 bg-slate-950/40 p-5">
                <div>
                  <div className="text-xs font-bold text-rose-400 uppercase flex items-center space-x-1.5 mb-2">
                    <Layers className="h-3.5 w-3.5" />
                    <span>Karmic Shadow & Growth Lessons</span>
                  </div>
                  <ul className="space-y-1 text-xs text-purple-200/80">
                    {activeNumberDetail.challenges.map((ch, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-rose-400">•</span>
                        <span>{ch}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {activeNumberDetail.spiritualMission && (
                  <div className="pt-2 border-t border-purple-900/50">
                    <div className="text-xs font-bold text-amber-300 uppercase mb-1">
                      Divine Spiritual Mission
                    </div>
                    <p className="text-xs text-purple-200/90 leading-relaxed italic">
                      "{activeNumberDetail.spiritualMission}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sacred Correspondences & Daily Affirmation Footer */}
            <div className="rounded-2xl border border-purple-900/60 bg-purple-950/30 p-4 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-purple-400 block text-[10px] uppercase">Harmonic Gemstones</span>
                  <span className="font-semibold text-slate-200">{activeNumberDetail.gemstone}</span>
                </div>
                <div>
                  <span className="text-purple-400 block text-[10px] uppercase">Sacred Symbol</span>
                  <span className="font-semibold text-amber-300">{activeNumberDetail.sacredSymbol}</span>
                </div>
                <div>
                  <span className="text-purple-400 block text-[10px] uppercase">Aura Color</span>
                  <span className="font-semibold text-slate-200">{activeNumberDetail.color}</span>
                </div>
                <div>
                  <span className="text-purple-400 block text-[10px] uppercase">Tarot Archetype</span>
                  <span className="font-semibold text-purple-200">{activeNumberDetail.tarotCard || 'Universal Key'}</span>
                </div>
              </div>

              {activeNumberDetail.affirmation && (
                <div className="pt-2 border-t border-purple-900/40 text-center">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mb-0.5">
                    Sacred Vibration Affirmation
                  </span>
                  <p className="font-serif text-xs sm:text-sm text-slate-200 italic">
                    "{activeNumberDetail.affirmation}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Calculate for Someone Else (Unique Dedicated Tab - Free Trial & Members Only) */}
      {activeTab === 'other-person' && (
        <div className="max-w-4xl mx-auto space-y-6">
          {!isMemberUnlocked ? (
            /* Member-Gated Banner */
            <div className="rounded-3xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-950/30 via-slate-900 to-purple-950/80 p-8 sm:p-10 shadow-2xl text-center space-y-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-inner">
                <UserPlus className="h-8 w-8" />
              </div>
              <div className="max-w-xl mx-auto space-y-2">
                <span className="rounded-full bg-amber-400/20 border border-amber-400 px-3 py-1 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Arcana Sanctuary Members & Trial Seekers
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-2">
                  Calculate Someone Else's Chaldean Matrix
                </h2>
                <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
                  Perform complete numerical blueprints and comparative soul synastry readings for romantic partners, children, close friends, clients, or family members using ancient Chaldean sound vibrations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left pt-2">
                <div className="rounded-2xl border border-purple-800/40 bg-slate-950/60 p-4 space-y-1.5">
                  <div className="text-amber-300 font-semibold text-xs flex items-center space-x-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>5-Number Sacred Matrix</span>
                  </div>
                  <p className="text-[11px] text-purple-300/80">
                    Calculates their Life Path, Master Numbers (11, 22, 33), Chaldean Destiny, and Soul Urge frequencies.
                  </p>
                </div>
                <div className="rounded-2xl border border-purple-800/40 bg-slate-950/60 p-4 space-y-1.5">
                  <div className="text-rose-300 font-semibold text-xs flex items-center space-x-1">
                    <HeartHandshake className="h-3.5 w-3.5" />
                    <span>Dual Soul Synastry</span>
                  </div>
                  <p className="text-[11px] text-purple-300/80">
                    Reveals mutual Bridge numbers, core harmonic resonance %, and relationship evolution.
                  </p>
                </div>
                <div className="rounded-2xl border border-purple-800/40 bg-slate-950/60 p-4 space-y-1.5">
                  <div className="text-emerald-300 font-semibold text-xs flex items-center space-x-1">
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Save to Mystic Journal</span>
                  </div>
                  <p className="text-[11px] text-purple-300/80">
                    Save unlimited reading profiles and comparative synastry reports directly to your journal.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-purple-900/50 flex flex-col items-center justify-center space-y-2">
                {isTrialExpired ? (
                  <>
                    <div className="text-xs text-amber-300 font-semibold mb-1">
                      Your Free Trial is Over — Join Arcana Sanctuary Membership
                    </div>
                    <button
                      id="btn-unlock-other-numerology-plans"
                      onClick={() => onOpenWelcomeModal?.('Calculate for Someone Else', 'plans')}
                      className="rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-8 py-3.5 font-serif text-xs sm:text-sm font-bold text-slate-950 shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
                    >
                      <Crown className="h-4 w-4" />
                      <span>Join Membership ($3, $11, $33)</span>
                    </button>
                    <p className="text-[11px] text-purple-300/60">
                      Weekly Pass ($3), Monthly ($11), or Lifetime Access ($33) with zero recurring commitments.
                    </p>
                  </>
                ) : (
                  <>
                    <button
                      id="btn-unlock-other-numerology-trial"
                      onClick={() => onOpenWelcomeModal?.('Calculate for Someone Else', 'letter')}
                      className="rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-8 py-3.5 font-serif text-xs sm:text-sm font-bold text-slate-950 shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
                    >
                      <Gift className="h-4 w-4" />
                      <span>Start 3-Day Free Trial ($0 Upfront)</span>
                    </button>
                    <p className="text-[11px] text-purple-300/60">
                      Instant access to calculate for someone else, tarot spreads, angel oracle, and dream calculations.
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Member Unlocked Calculator */
            <div className="space-y-6">
              <div className="rounded-3xl border border-purple-800/40 bg-slate-900/90 p-6 sm:p-8 shadow-xl">
                <div className="text-center space-y-2 mb-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    <UserPlus className="h-6 w-6" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-slate-100">
                    Calculate Someone Else's Chaldean Matrix
                  </h2>
                  <p className="text-xs text-purple-300/80 max-w-md mx-auto">
                    Enter the name and birth date of a loved one, partner, child, friend, or seeker to uncover their full matrix and your comparative synastry.
                  </p>
                </div>

                <form onSubmit={handleCalculateOtherPerson} className="space-y-4 max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-purple-200 mb-1">
                        Their Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Elena Vance"
                        value={otherName}
                        onChange={(e) => setOtherName(e.target.value)}
                        className="w-full rounded-xl border border-purple-900/60 bg-slate-950/80 px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-purple-200 mb-1">
                        Their Date of Birth
                      </label>
                      <input
                        type="date"
                        required
                        value={otherBirthDate}
                        onChange={(e) => setOtherBirthDate(e.target.value)}
                        className="w-full rounded-xl border border-purple-900/60 bg-slate-950/80 px-3.5 py-2.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-purple-200 mb-1">
                        Relationship to You
                      </label>
                      <select
                        value={otherRelationship}
                        onChange={(e) => setOtherRelationship(e.target.value)}
                        className="w-full rounded-xl border border-purple-900/60 bg-slate-950/80 px-3.5 py-2.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                      >
                        <option value="Partner">Romantic Partner / Spouse</option>
                        <option value="Child">Child / Family Member</option>
                        <option value="Parent">Parent / Ancestor</option>
                        <option value="Friend">Close Friend / Soul Companion</option>
                        <option value="Colleague">Colleague / Business Partner</option>
                        <option value="Client">Client / Student</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-purple-200 mb-1">
                        Numerology System
                      </label>
                      <div className="rounded-xl border border-amber-400/40 bg-amber-950/20 px-3 py-2 text-xs flex items-center justify-between text-amber-200">
                        <span className="font-semibold flex items-center space-x-1.5">
                          <Radio className="h-3.5 w-3.5 text-amber-400" />
                          <span>Chaldean Sacred Vibrations</span>
                        </span>
                        <span className="text-[10px] text-amber-400 font-bold uppercase">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="submit"
                      id="btn-run-other-calculation"
                      className="rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition-opacity"
                    >
                      Calculate Full Chaldean Matrix & Synastry
                    </button>
                  </div>
                </form>

                {/* Calculation Result */}
                {otherResult && (
                  <div className="mt-8 pt-6 border-t border-purple-900/50 space-y-6 animate-in fade-in zoom-in-95">
                    {/* Header Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-950/40 rounded-2xl p-4 border border-purple-800/40">
                      <div>
                        <div className="text-[10px] text-amber-400 font-semibold uppercase">
                          Matrix Profile: {otherResult.relationship}
                        </div>
                        <h3 className="font-serif text-xl font-bold text-slate-100">
                          {otherName} • Life Path {otherResult.analysis.lifePath.number}
                        </h3>
                        <p className="text-xs text-purple-300">
                          Chaldean Destiny {otherResult.analysis.destiny.number} • Soul Urge {otherResult.analysis.soulUrge.number} • Personal Year {otherResult.analysis.personalYear.yearNumber}
                        </p>
                      </div>

                      <button
                        onClick={handleSaveOtherToJournal}
                        className={`flex shrink-0 items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                          isOtherSaved
                            ? 'bg-emerald-600 text-white'
                            : 'bg-purple-900/80 text-purple-200 hover:bg-purple-800 border border-purple-700/50'
                        }`}
                      >
                        {isOtherSaved ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Logged to Journal!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="h-4 w-4" />
                            <span>Save Profile & Synastry to Journal</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Dual Comparative Synastry Card */}
                    <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-purple-950/40 p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
                        <div className="flex items-center space-x-2">
                          <HeartHandshake className="h-5 w-5 text-rose-400" />
                          <h4 className="font-serif text-base font-bold text-slate-100">
                            Dual Chaldean Soul Synastry: {userProfile.name} & {otherName}
                          </h4>
                        </div>
                        <div className="flex items-center space-x-1.5 rounded-full bg-amber-400/20 border border-amber-400 px-3 py-0.5 text-xs font-bold text-amber-300">
                          <span>{otherResult.synastry.harmonyScore}% Harmonic Resonance</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5 rounded-2xl bg-slate-950/60 p-4 border border-purple-900/50">
                          <span className="text-amber-400 font-semibold block uppercase text-[10px]">
                            Life Path Interplay
                          </span>
                          <p className="text-purple-200/90 leading-relaxed">
                            {otherResult.synastry.lifePathResonance}
                          </p>
                        </div>
                        <div className="space-y-1.5 rounded-2xl bg-slate-950/60 p-4 border border-purple-900/50">
                          <span className="text-rose-400 font-semibold block uppercase text-[10px]">
                            Soul Urge Resonance
                          </span>
                          <p className="text-purple-200/90 leading-relaxed">
                            {otherResult.synastry.soulUrgeResonance}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-purple-950/30 p-4 border border-purple-900/50 text-xs space-y-1">
                        <span className="text-amber-300 font-semibold block">
                          Bridge Guidance (Bridge Vibration {otherResult.synastry.bridgeNumber})
                        </span>
                        <p className="text-purple-200/90 leading-relaxed">
                          {otherResult.synastry.relationshipAdvice}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Vibrational Match / Partner Compatibility (Free Trial & Members Only) */}
      {activeTab === 'compatibility' && (
        <div className="max-w-4xl mx-auto space-y-6">
          {!isMemberUnlocked ? (
            /* Member Gated Banner for Compatibility */
            <div className="rounded-3xl border-2 border-rose-500/40 bg-gradient-to-br from-rose-950/30 via-slate-900 to-purple-950/80 p-8 sm:p-10 shadow-2xl text-center space-y-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-500/20 text-rose-300 border border-rose-400/40 shadow-inner">
                <HeartHandshake className="h-8 w-8" />
              </div>
              <div className="max-w-xl mx-auto space-y-2">
                <span className="rounded-full bg-rose-400/20 border border-rose-400 px-3 py-1 text-xs font-bold text-rose-300 uppercase tracking-wider">
                  Arcana Sanctuary Members & Trial Seekers
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-2">
                  Chaldean Vibrational Synastry & Compatibility
                </h2>
                <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
                  Discover the sacred sound resonance, Life Path interplay, mutual Bridge number vibrations, and soul harmony score between you and your partner.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left pt-2">
                <div className="rounded-2xl border border-rose-900/40 bg-slate-950/60 p-4 space-y-1.5">
                  <div className="text-rose-300 font-semibold text-xs flex items-center space-x-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Harmonic Score %</span>
                  </div>
                  <p className="text-[11px] text-purple-300/80">
                    Precise vibrational harmony percentage calculated from sacred Babylonian root number compatibility.
                  </p>
                </div>
                <div className="rounded-2xl border border-rose-900/40 bg-slate-950/60 p-4 space-y-1.5">
                  <div className="text-amber-300 font-semibold text-xs flex items-center space-x-1">
                    <Compass className="h-3.5 w-3.5" />
                    <span>Bridge Number Vibration</span>
                  </div>
                  <p className="text-[11px] text-purple-300/80">
                    The connective vibrational frequency that reconciles your karmic differences and fosters intimacy.
                  </p>
                </div>
                <div className="rounded-2xl border border-rose-900/40 bg-slate-950/60 p-4 space-y-1.5">
                  <div className="text-purple-300 font-semibold text-xs flex items-center space-x-1">
                    <Flame className="h-3.5 w-3.5" />
                    <span>Soul Urge Synergy</span>
                  </div>
                  <p className="text-[11px] text-purple-300/80">
                    How your secret heart longings and acoustic vowel frequencies communicate and nourish each other.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-purple-900/50 flex flex-col items-center justify-center space-y-2">
                {isTrialExpired ? (
                  <>
                    <div className="text-xs text-amber-300 font-semibold mb-1">
                      Your Free Trial is Over — Join Arcana Sanctuary Membership
                    </div>
                    <button
                      id="btn-unlock-compatibility-plans"
                      onClick={() => onOpenWelcomeModal?.('Chaldean Compatibility Synastry', 'plans')}
                      className="rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 px-8 py-3.5 font-serif text-xs sm:text-sm font-bold text-white shadow-xl shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
                    >
                      <Crown className="h-4 w-4" />
                      <span>Join Membership ($3, $11, $33)</span>
                    </button>
                    <p className="text-[11px] text-purple-300/60">
                      Weekly Pass ($3), Monthly ($11), or Lifetime Access ($33) with zero recurring commitments.
                    </p>
                  </>
                ) : (
                  <>
                    <button
                      id="btn-unlock-compatibility-trial"
                      onClick={() => onOpenWelcomeModal?.('Chaldean Compatibility Synastry', 'letter')}
                      className="rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 px-8 py-3.5 font-serif text-xs sm:text-sm font-bold text-white shadow-xl shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
                    >
                      <Gift className="h-4 w-4" />
                      <span>Start 3-Day Free Trial ($0 Upfront)</span>
                    </button>
                    <p className="text-[11px] text-purple-300/60">
                      Instant access to compatibility synastry, calculate for others, and all spiritual tools.
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Unlocked Compatibility View */
            <div className="rounded-3xl border border-purple-800/40 bg-slate-900/90 p-6 sm:p-8 shadow-xl">
              <div className="text-center space-y-2 mb-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-slate-100">
                  Chaldean Vibrational Synastry & Compatibility
                </h2>
                <p className="text-xs text-purple-300/80 max-w-md mx-auto">
                  Discover the sacred geometry and vibrational resonance between your soul matrix and your partner or companion.
                </p>
              </div>

              <form onSubmit={handleCalculateCompatibility} className="space-y-4 max-w-xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-purple-200 mb-1">
                      Partner / Companion Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Julian Drake"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      className="w-full rounded-xl border border-purple-900/60 bg-slate-950/80 px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-purple-200 mb-1">
                      Partner Date of Birth
                    </label>
                    <input
                      type="date"
                      required
                      value={partnerBirthDate}
                      onChange={(e) => setPartnerBirthDate(e.target.value)}
                      className="w-full rounded-xl border border-purple-900/60 bg-slate-950/80 px-3.5 py-2.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="submit"
                    id="btn-calculate-synastry"
                    className="rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition-opacity"
                  >
                    Calculate Chaldean Synastry
                  </button>
                </div>
              </form>

              {/* Partner Result */}
              {partnerResult && (
                <div className="mt-8 pt-6 border-t border-purple-900/50 space-y-6 animate-in fade-in zoom-in-95">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-950/40 rounded-2xl p-4 border border-purple-800/40">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-slate-100">
                        {partnerResult.person1.name} & {partnerResult.person2.name}
                      </h3>
                      <p className="text-xs text-purple-300">
                        Life Path {partnerResult.person1.lifePath} + Life Path {partnerResult.person2.lifePath} • Bridge Vibration: {partnerResult.bridgeNumber}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 rounded-2xl bg-amber-500/20 border border-amber-400/50 px-3.5 py-1.5 text-amber-300">
                      <Sparkles className="h-4 w-4" />
                      <span className="font-serif text-base font-bold">{partnerResult.harmonyScore}% Harmony</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5 rounded-2xl bg-slate-950/60 p-4 border border-purple-900/50">
                      <span className="text-amber-400 font-semibold block uppercase text-[10px]">
                        Life Path Resonance
                      </span>
                      <p className="text-purple-200/90 leading-relaxed">
                        {partnerResult.lifePathResonance}
                      </p>
                    </div>
                    <div className="space-y-1.5 rounded-2xl bg-slate-950/60 p-4 border border-purple-900/50">
                      <span className="text-rose-400 font-semibold block uppercase text-[10px]">
                        Soul Urge Synergy
                      </span>
                      <p className="text-purple-200/90 leading-relaxed">
                        {partnerResult.soulUrgeResonance}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-purple-950/30 p-4 border border-purple-900/50 text-xs space-y-1">
                    <span className="text-amber-300 font-semibold block">
                      Relationship Evolution & Advice
                    </span>
                    <p className="text-purple-200/90 leading-relaxed">
                      {partnerResult.relationshipAdvice}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Next Realms Beyond Numerology Exploration Banner & Jump Links */}
      <div className="mt-10 rounded-3xl border border-purple-800/60 bg-gradient-to-b from-[#0e0a24] via-[#120e2d] to-[#090718] p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-900/50 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-slate-100">
                Explore Dimensions Past Numerology
              </h3>
              <p className="text-xs text-purple-300">
                Slide your finger across the top navigation bar to explore more realms
              </p>
            </div>
          </div>

          <div className="inline-flex items-center space-x-1 rounded-full bg-purple-950/80 px-3 py-1 text-[11px] font-mono text-amber-300 border border-purple-700/50 self-start sm:self-auto">
            <span className="animate-pulse">👉</span>
            <span>Swipe navigation bar left for tabs 5, 6 & 7</span>
          </div>
        </div>

        {/* Quick-Jump Realm Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Realm 1: Archangels */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('angel-oracle')}
            className="group text-left rounded-2xl border border-purple-800/60 bg-[#140f30]/80 hover:bg-purple-900/40 p-4 transition-all hover:border-amber-400/60 hover:-translate-y-0.5 shadow-md flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-950 border border-purple-700/60 text-purple-300 group-hover:text-amber-300 group-hover:border-amber-400/50 transition-colors">
                <Feather className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-purple-300/80 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-800/40">
                Tab 5
              </span>
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-white group-hover:text-amber-200 transition-colors">
                Archangels & Oracle
              </h4>
              <p className="text-[11px] text-purple-300/80 line-clamp-2 mt-0.5">
                Channel direct transmissions, sacred prayer keys & daily angelic guidance.
              </p>
            </div>
            <div className="flex items-center text-[11px] font-mono font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Open Archangels</span>
              <MoveRight className="h-3 w-3 ml-1" />
            </div>
          </button>

          {/* Realm 2: Dream Sanctuary */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('dreams')}
            className="group text-left rounded-2xl border border-purple-800/60 bg-[#140f30]/80 hover:bg-purple-900/40 p-4 transition-all hover:border-amber-400/60 hover:-translate-y-0.5 shadow-md flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-950 border border-purple-700/60 text-indigo-300 group-hover:text-amber-300 group-hover:border-amber-400/50 transition-colors">
                <CloudMoon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-purple-300/80 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-800/40">
                Tab 6
              </span>
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-white group-hover:text-amber-200 transition-colors">
                Dream Sanctuary
              </h4>
              <p className="text-[11px] text-purple-300/80 line-clamp-2 mt-0.5">
                Calculate dream archetype numbers, decoders & Jungian shadow insights.
              </p>
            </div>
            <div className="flex items-center text-[11px] font-mono font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Open Dream Sanctuary</span>
              <MoveRight className="h-3 w-3 ml-1" />
            </div>
          </button>

          {/* Realm 3: Daily Log / Journal */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('diary')}
            className="group text-left rounded-2xl border border-purple-800/60 bg-[#140f30]/80 hover:bg-purple-900/40 p-4 transition-all hover:border-amber-400/60 hover:-translate-y-0.5 shadow-md flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-950 border border-purple-700/60 text-amber-300 group-hover:text-amber-200 group-hover:border-amber-400/50 transition-colors">
                <BookMarked className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-purple-300/80 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-800/40">
                Tab 7
              </span>
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-white group-hover:text-amber-200 transition-colors">
                Daily Log & Journal
              </h4>
              <p className="text-[11px] text-purple-300/80 line-clamp-2 mt-0.5">
                Your private 4-digit PIN locked sacred journal & saved cosmic readings vault.
              </p>
            </div>
            <div className="flex items-center text-[11px] font-mono font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Open Sacred Journal</span>
              <MoveRight className="h-3 w-3 ml-1" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
