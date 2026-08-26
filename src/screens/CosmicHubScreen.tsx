import React, { useState } from 'react';
import { RealmPhotoDisplay } from '../components/RealmPhotoDisplay';
import { ARCHANGELS, Archangel } from '../data/angels';
import { Sparkles, Eye, ShieldCheck, Heart, RefreshCw } from 'lucide-react';

export const CosmicHubScreen: React.FC = () => {
  const [selectedAngel, setSelectedAngel] = useState<Archangel>(ARCHANGELS[0]); // Michael
  const [selectedMood, setSelectedMood] = useState<string>('Aligned');

  const pullRandomAngel = () => {
    const next = ARCHANGELS[Math.floor(Math.random() * ARCHANGELS.length)];
    setSelectedAngel(next);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* 1. TOP-ALIGNED PERMANENT BANNER (Cosmic Sanctuary Hub) */}
      <RealmPhotoDisplay 
        realm="cosmic_hub"
        title="Cosmic Sanctuary & Guidance"
        subtitle="Universal Hub"
      />

      {/* 2. DEDICATED ARCHANGELS REALM SECTION */}
      <div className="bg-[#12101f] border border-[#241f3d] rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-purple-400 animate-pulse" />
            <span className="text-[11px] font-bold tracking-[2px] uppercase text-purple-400">
              Archangel Guidance & Messages
            </span>
          </div>
          <button 
            onClick={pullRandomAngel}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 hover:bg-purple-900 border border-purple-500/30 text-[10.5px] text-purple-200 font-medium transition-all"
          >
            <RefreshCw size={11} />
            <span>Pull Angel Card ✧</span>
          </button>
        </div>

        {/* Selected Archangel Spotlight with Photo */}
        <div className="flex items-center gap-4 bg-[#18142b] p-3.5 rounded-xl border border-[#28214a] mb-3">
          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-purple-500/40 flex-shrink-0 shadow-md">
            <img 
              src={selectedAngel.photo} 
              alt={selectedAngel.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">
              {selectedAngel.name}
            </h3>
            <p className="text-[10.5px] text-purple-300 font-medium mt-0.5">
              {selectedAngel.title}
            </p>
            <span className="inline-block mt-1 text-[9.5px] px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30">
              {selectedAngel.frequency} · {selectedAngel.chakra}
            </span>
          </div>
        </div>

        <p className="text-gray-200 text-sm sm:text-base leading-relaxed italic my-2 font-serif">
          "{selectedAngel.message}"
        </p>

        <div className="mt-3 pt-3 border-t border-[#1f1a36] text-[11px] text-gray-400">
          <p className="text-purple-300 font-medium italic">
            <span className="text-gray-400 not-italic font-bold">Affirmation: </span>
            "{selectedAngel.affirmation}"
          </p>
        </div>
      </div>

      {/* 3. 12 ARCHANGELS GALLERY CAROUSEL */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10.5px] font-bold tracking-[2px] uppercase text-purple-400">
            The 12 Archangels
          </span>
          <span className="text-[10px] text-gray-400">Tap to connect</span>
        </div>
        <div className="overflow-x-auto pb-1 -mx-4 px-4 flex gap-2.5 scrollbar-none">
          {ARCHANGELS.map((angel) => {
            const isCurrent = selectedAngel.id === angel.id;
            return (
              <button
                key={angel.id}
                onClick={() => setSelectedAngel(angel)}
                className={`flex-shrink-0 w-24 p-2 rounded-xl border flex flex-col items-center text-center transition-all ${
                  isCurrent
                    ? 'bg-purple-900/60 border-purple-400 shadow-md shadow-purple-950/40 scale-105'
                    : 'bg-[#12101f] border-[#241f3d] text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden mb-1.5 border border-purple-500/30">
                  <img src={angel.photo} alt={angel.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-bold text-white truncate w-full">
                  {angel.name.replace('Archangel ', '')}
                </span>
                <span className="text-[8px] text-purple-300 truncate w-full">
                  {angel.chakra.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. ENERGY ALIGNMENT / MOOD PICKER */}
      <div className="bg-[#12101f] border border-[#241f3d] rounded-2xl p-4">
        <h3 className="text-xs font-bold tracking-[2px] uppercase text-purple-400 mb-2.5">
          Tune Your Daily Frequency
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {['Aligned', 'Intuitive', 'Receptive', 'Transmuting'].map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`py-2 px-1 rounded-xl text-center text-xs font-medium border transition-all ${
                selectedMood === mood
                  ? 'bg-purple-600/30 border-purple-400 text-white shadow-md shadow-purple-900/30'
                  : 'bg-[#18142b] border-[#241f3d] text-gray-400 hover:text-gray-200'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* 5. DAILY PILLARS */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#12101f] border border-[#241f3d] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span className="text-xs font-bold text-white">Divine Shield</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-normal">
            Your energetic field is grounded and surrounded with peaceful clarity.
          </p>
        </div>

        <div className="bg-[#12101f] border border-[#241f3d] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Heart size={16} className="text-pink-400" />
            <span className="text-xs font-bold text-white">Heart Harmony</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-normal">
            Open channels for intuition, deep peace, and divine synchronicities.
          </p>
        </div>
      </div>
    </div>
  );
};
