import React, { useState } from 'react';
import { RealmPhotoDisplay } from '../components/RealmPhotoDisplay';
import { BookOpen, Plus, Trash2 } from 'lucide-react';

interface JournalLog {
  id: string;
  date: string;
  title: string;
  content: string;
}

export const JournalScreen: React.FC = () => {
  const [logs, setLogs] = useState<JournalLog[]>(() => {
    try {
      const saved = localStorage.getItem('cosmic_journal_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: '1',
        date: 'Today · Sacred Space',
        title: 'Aligning with Universal Guidance',
        content: 'Noticed the numbers 111 and 444 repeatedly today. Trusting the gentle trail of breadcrumbs leading forward.'
      }
    ];
  });

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = () => {
    if (!newContent.trim()) return;
    const newLog: JournalLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: newTitle.trim() || 'Cosmic Reflection',
      content: newContent.trim()
    };
    const updated = [newLog, ...logs];
    setLogs(updated);
    try {
      localStorage.setItem('cosmic_journal_logs', JSON.stringify(updated));
    } catch (e) {}
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const updated = logs.filter(l => l.id !== id);
    setLogs(updated);
    try {
      localStorage.setItem('cosmic_journal_logs', JSON.stringify(updated));
    } catch (e) {}
  };

  return (
    <div className="space-y-4 pb-24">
      {/* TOP SANCTUARY LOG BANNER */}
      <RealmPhotoDisplay 
        realm="journal"
        title="Cosmic Breadcrumbs & Sacred Reflections"
        subtitle="Sanctuary Log"
      />

      {/* ADD REFLECTION CARD */}
      <div className="bg-[#12101f] border border-[#241f3d] rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-purple-400" />
            <h3 className="text-xs font-bold tracking-[2px] uppercase text-purple-400">
              Record Cosmic Reflection
            </h3>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="p-1 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30 hover:bg-purple-900 transition-all"
          >
            <Plus size={14} />
          </button>
        </div>

        {isAdding && (
          <div className="space-y-2.5 pt-2 border-t border-[#1f1a36]">
            <input
              type="text"
              placeholder="Title or Theme of Insight..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-[#18142b] border border-[#2e2552] rounded-xl p-2.5 text-white text-sm focus:border-purple-500 outline-none placeholder:text-gray-500"
            />
            <textarea
              placeholder="Write your reflections, synchronicities, or signs received..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={3}
              className="w-full bg-[#18142b] border border-[#2e2552] rounded-xl p-2.5 text-white text-sm focus:border-purple-500 outline-none resize-none placeholder:text-gray-500"
            />
            <button
              onClick={handleSave}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold text-xs tracking-[1.5px] uppercase text-white shadow-lg shadow-purple-950/40 transition-all"
            >
              Save Reflection
            </button>
          </div>
        )}
      </div>

      {/* LOGS LIST */}
      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="bg-[#12101f] border border-[#241f3d] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-[#1f1a36] pb-2">
              <span className="text-[10px] text-gray-400 font-medium">{log.date}</span>
              <button 
                onClick={() => handleDelete(log.id)}
                className="text-gray-500 hover:text-red-400 transition-colors p-1"
              >
                <Trash2 size={12} />
              </button>
            </div>
            <h4 className="text-sm font-bold text-white tracking-wide">{log.title}</h4>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-serif">
              {log.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
