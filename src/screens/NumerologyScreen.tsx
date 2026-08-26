import React, { useState } from 'react';
import { RealmPhotoDisplay } from '../components/RealmPhotoDisplay';
import { Calculator } from 'lucide-react';

export const NumerologyScreen: React.FC = () => {
  const [birthMonth, setBirthMonth] = useState<string>('8');
  const [birthDay, setBirthDay] = useState<string>('23');
  const [birthYear, setBirthYear] = useState<string>('1995');
  const [calculatedPath, setCalculatedPath] = useState<number | null>(1);

  const calculateLifePath = () => {
    const str = `${birthMonth}${birthDay}${birthYear}`;
    let sum = str.split('').reduce((acc, digit) => acc + (parseInt(digit, 10) || 0), 0);
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }
    setCalculatedPath(sum);
  };

  const getLifePathDescription = (num: number) => {
    switch (num) {
      case 1: return "The Leader & Pioneer: Initiator of destiny, independent visionary with immense creative power.";
      case 2: return "The Diplomat & Intuitive: Master of harmony, sensitive to subtle energy currents and peace.";
      case 3: return "The Creative Alchemist: Expressive artist, uplifting communicator, and inspiring guide.";
      case 4: return "The Master Builder: Grounded architect of lasting foundations, disciplined and reliable.";
      case 5: return "The Free Spirit: Dynamic explorer, catalyst for transformation and boundless adaptability.";
      case 6: return "The Healer & Nurturer: Compassionate caregiver, harmonic creator in home and heart.";
      case 7: return "The Mystic & Truth Seeker: Deep spiritual explorer, intuitive analyst of cosmic mysteries.";
      case 8: return "The Power Manifestor: Sovereign ruler of material and spiritual abundance, leader of change.";
      case 9: return "The Universal Philanthropist: Compassionate soul with deep global awareness and wisdom.";
      case 11: return "Master Number 11 (The Illuminator): High spiritual intuition, channel for divine insight.";
      case 22: return "Master Number 22 (The Master Architect): Turns visionary dreams into tangible reality.";
      case 33: return "Master Number 33 (The Master Teacher): Avatar of universal love and spiritual upliftment.";
      default: return "Harmonic vibration in resonance with sacred universal frequencies.";
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* TOP SACRED NUMBERS BANNER */}
      <RealmPhotoDisplay 
        realm="numerology"
        title="Sacred Numbers & Universal Matrices"
        subtitle="Numerology Matrix"
      />

      {/* LIFE PATH CALCULATOR */}
      <div className="bg-[#12101f] border border-[#241f3d] rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center gap-2">
          <Calculator size={16} className="text-purple-400" />
          <h3 className="text-xs font-bold tracking-[2px] uppercase text-purple-400">
            Life Path Frequency Calculator
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] text-gray-400 uppercase font-medium">Month (1-12)</label>
            <input 
              type="number" 
              value={birthMonth} 
              onChange={(e) => setBirthMonth(e.target.value)}
              className="w-full bg-[#18142b] border border-[#2e2552] rounded-xl p-2.5 text-center text-white text-sm focus:border-purple-500 outline-none"
              placeholder="MM"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 uppercase font-medium">Day (1-31)</label>
            <input 
              type="number" 
              value={birthDay} 
              onChange={(e) => setBirthDay(e.target.value)}
              className="w-full bg-[#18142b] border border-[#2e2552] rounded-xl p-2.5 text-center text-white text-sm focus:border-purple-500 outline-none"
              placeholder="DD"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 uppercase font-medium">Year (YYYY)</label>
            <input 
              type="number" 
              value={birthYear} 
              onChange={(e) => setBirthYear(e.target.value)}
              className="w-full bg-[#18142b] border border-[#2e2552] rounded-xl p-2.5 text-center text-white text-sm focus:border-purple-500 outline-none"
              placeholder="YYYY"
            />
          </div>
        </div>

        <button 
          onClick={calculateLifePath}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold text-xs tracking-[1.5px] uppercase text-white shadow-lg shadow-purple-900/40 transition-all mt-1"
        >
          Calculate Life Path
        </button>

        {calculatedPath !== null && (
          <div className="mt-4 pt-3 border-t border-[#1f1a36] text-center">
            <div className="inline-block p-3 rounded-2xl bg-purple-950/60 border border-purple-500/40 mb-2">
              <span className="text-3xl font-black text-purple-300 font-serif">
                Life Path {calculatedPath}
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed font-serif">
              {getLifePathDescription(calculatedPath)}
            </p>
          </div>
        )}
      </div>

      {/* SYNCHRONICITY NUMBERS */}
      <div className="bg-[#12101f] border border-[#241f3d] rounded-2xl p-4 space-y-2.5">
        <h4 className="text-xs font-bold tracking-[2px] uppercase text-purple-400">
          Universal Number Synchronicities
        </h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#18142b] p-3 rounded-xl border border-[#241f3d]">
            <p className="text-lg font-black text-purple-300">111</p>
            <p className="text-[9.5px] text-gray-400 mt-0.5">Intuition & Beginnings</p>
          </div>
          <div className="bg-[#18142b] p-3 rounded-xl border border-[#241f3d]">
            <p className="text-lg font-black text-purple-300">444</p>
            <p className="text-[9.5px] text-gray-400 mt-0.5">Protection & Guidance</p>
          </div>
          <div className="bg-[#18142b] p-3 rounded-xl border border-[#241f3d]">
            <p className="text-lg font-black text-purple-300">777</p>
            <p className="text-[9.5px] text-gray-400 mt-0.5">Divine Luck & Wisdom</p>
          </div>
        </div>
      </div>
    </div>
  );
};
