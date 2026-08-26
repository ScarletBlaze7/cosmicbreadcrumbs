import React, { useState } from 'react';
import { RealmPhotoDisplay } from '../components/RealmPhotoDisplay';

const ZODIAC_SIGNS = [
  { name: 'Aries', dates: 'Mar 21 - Apr 19', symbol: '♈', element: 'Fire' },
  { name: 'Taurus', dates: 'Apr 20 - May 20', symbol: '♉', element: 'Earth' },
  { name: 'Gemini', dates: 'May 21 - Jun 20', symbol: '♊', element: 'Air' },
  { name: 'Cancer', dates: 'Jun 21 - Jul 22', symbol: '♋', element: 'Water' },
  { name: 'Leo', dates: 'Jul 23 - Aug 22', symbol: '♌', element: 'Fire' },
  { name: 'Virgo', dates: 'Aug 23 - Sep 22', symbol: '♍', element: 'Earth' },
  { name: 'Libra', dates: 'Sep 23 - Oct 22', symbol: '♎', element: 'Air' },
  { name: 'Scorpio', dates: 'Oct 23 - Nov 21', symbol: '♏', element: 'Water' },
  { name: 'Sagittarius', dates: 'Nov 22 - Dec 21', symbol: '♐', element: 'Fire' },
  { name: 'Capricorn', dates: 'Dec 22 - Jan 19', symbol: '♑', element: 'Earth' },
  { name: 'Aquarius', dates: 'Jan 20 - Feb 18', symbol: '♒', element: 'Air' },
  { name: 'Pisces', dates: 'Feb 19 - Mar 20', symbol: '♓', element: 'Water' },
];

export const HoroscopeScreen: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState(ZODIAC_SIGNS[5]); // Virgo

  return (
    <div className="space-y-4 pb-24">
      {/* TOP CELESTIAL ASTROLOGY BANNER */}
      <RealmPhotoDisplay 
        realm="astrology"
        title="Celestial Alignments & Zodiac Harmonics"
        subtitle="Astrology Wheel"
      />

      {/* ZODIAC SELECTOR CAROUSEL */}
      <div className="overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none flex gap-2">
        {ZODIAC_SIGNS.map((sign) => {
          const isSelected = selectedSign.name === sign.name;
          return (
            <button
              key={sign.name}
              onClick={() => setSelectedSign(sign)}
              className={`flex-shrink-0 px-3.5 py-2.5 rounded-xl border transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-purple-900/60 border-purple-400 text-white shadow-md shadow-purple-900/40'
                  : 'bg-[#12101f] border-[#241f3d] text-gray-400 hover:text-gray-200'
              }`}
            >
              <span className="text-lg">{sign.symbol}</span>
              <div className="text-left">
                <p className="text-xs font-bold leading-tight">{sign.name}</p>
                <p className="text-[9px] text-gray-400">{sign.dates}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* SIGN READING DETAILS */}
      <div className="bg-[#12101f] border border-[#241f3d] rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-[#1f1a36] pb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl text-purple-300">{selectedSign.symbol}</span>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {selectedSign.name}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                  {selectedSign.element}
                </span>
              </h3>
              <p className="text-[10.5px] text-gray-400">{selectedSign.dates}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
              Daily Transit
            </span>
            <span className="text-xs text-white font-semibold">Moon Sextile Sun</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[2px] uppercase text-purple-400 mb-1.5">
            Cosmic Forecast
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed font-serif">
            A harmonious planetary aspect stimulates your creative insight and communication. 
            Embrace moments of stillness to receive subtle guidance from the universe.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 text-center">
          <div className="bg-[#18142b] p-2.5 rounded-xl border border-[#241f3d]">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Lucky Number</p>
            <p className="text-sm font-bold text-purple-300 mt-0.5">7 · 21</p>
          </div>
          <div className="bg-[#18142b] p-2.5 rounded-xl border border-[#241f3d]">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Power Color</p>
            <p className="text-sm font-bold text-purple-300 mt-0.5">Violet Gold</p>
          </div>
          <div className="bg-[#18142b] p-2.5 rounded-xl border border-[#241f3d]">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Compatibility</p>
            <p className="text-sm font-bold text-purple-300 mt-0.5">Taurus, Pisces</p>
          </div>
        </div>
      </div>
    </div>
  );
};
