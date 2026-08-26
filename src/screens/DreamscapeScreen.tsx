import React, { useState } from 'react';
import { RealmPhotoDisplay } from '../components/RealmPhotoDisplay';
import { Moon, Sparkles, Feather } from 'lucide-react';

interface DreamEntry {
  id: string;
  date: string;
  dreamText: string;
  interpretation: string;
}

export const DreamscapeScreen: React.FC = () => {
  const [dreamInput, setDreamInput] = useState<string>('');
  const [entries, setEntries] = useState<DreamEntry[]>(() => {
    try {
      const saved = localStorage.getItem('cosmic_dreamscape_entries');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: '1',
        date: 'Today · Astral Realm',
        dreamText: 'Flying over crystal blue mountains beneath two golden moons.',
        interpretation: 'Signifies an awakening of higher vision and liberation from self-imposed limitations.'
      }
    ];
  });

  const handleInterpretDream = () => {
    if (!dreamInput.trim()) return;

    const symbols = [
      "Water / Ocean: Emotional cleansing and subconscious depth.",
      "Flight / Flying: Release of tension, elevation of spirit, and intuitive breakthrough.",
      "Doors / Gates: Major transitions arriving; walk forward with confidence.",
      "Animals / Guides: An ally is communicating wisdom; look for signs today.",
      "Stars / Light: Divine alignment and protection from your higher guides."
    ];
    const pickedSymbol = symbols[Math.floor(Math.random() * symbols.length)];

    const newEntry: DreamEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      dreamText: dreamInput,
      interpretation: `Key Symbolism: ${pickedSymbol}`
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    try {
      localStorage.setItem('cosmic_dreamscape_entries', JSON.stringify(updated));
    } catch (e) {}
    setDreamInput('');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* TOP DREAMSCAPE ASTRAL BANNER */}
      <RealmPhotoDisplay 
        realm="dream"
        title="Subconscious Gateway & Astral Visions"
        subtitle="Dreamscape"
      />

      {/* DREAM ENTRY RECORDER */}
      <div className="bg-[#12101f] border border-[#241f3d] rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon size={16} className="text-indigo-400" />
            <h3 className="text-xs font-bold tracking-[2px] uppercase text-indigo-300">
              Log Your Dreamscape Vision
            </h3>
          </div>
          <span className="text-[10px] text-gray-400">Astral Journal</span>
        </div>

        <textarea
          value={dreamInput}
          onChange={(e) => setDreamInput(e.target.value)}
          placeholder="Describe your dream, symbols, colors, emotions, or encounters..."
          rows={3}
          className="w-full bg-[#18142b] border border-[#2e2552] rounded-xl p-3 text-white text-sm focus:border-indigo-500 outline-none resize-none placeholder:text-gray-500"
        />

        <button
          onClick={handleInterpretDream}
          disabled={!dreamInput.trim()}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 font-bold text-xs tracking-[1.5px] uppercase text-white shadow-lg shadow-indigo-950/40 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles size={14} />
          <span>Decode Dreamscape Symbols</span>
        </button>
      </div>

      {/* RECENT DREAMSCAPE VISIONS */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold tracking-[2px] uppercase text-indigo-300 px-1">
          Recent Astral Encounters ({entries.length})
        </h4>

        {entries.map((entry) => (
          <div key={entry.id} className="bg-[#12101f] border border-[#241f3d] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-[10.5px] text-gray-400 border-b border-[#1f1a36] pb-2">
              <span className="flex items-center gap-1">
                <Feather size={12} className="text-indigo-400" /> {entry.date}
              </span>
              <span className="text-indigo-300 font-semibold">Dream Decoded</span>
            </div>
            <p className="text-gray-200 text-sm font-serif italic">
              "{entry.dreamText}"
            </p>
            <div className="bg-[#18142b] p-2.5 rounded-xl border border-[#28214a] text-xs text-indigo-200">
              <p className="font-medium">{entry.interpretation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
