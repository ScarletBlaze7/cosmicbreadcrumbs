import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Moon, 
  Star, 
  Sun,
  CheckCircle2
} from 'lucide-react';

export interface CalendarMarker {
  count: number;
  mood?: string;
  type?: string;
  label?: string;
  isFavorite?: boolean;
}

interface JournalCalendarProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
  markedDates: Record<string, CalendarMarker>; // Key: YYYY-MM-DD
  variant?: 'diary' | 'dreams';
  title?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const JournalCalendar: React.FC<JournalCalendarProps> = ({
  selectedDate,
  onSelectDate,
  markedDates,
  variant = 'diary',
  title = 'Sanctuary Calendar'
}) => {
  // Current viewing month/year in calendar
  const initialDate = selectedDate ? new Date(selectedDate + 'T12:00:00') : new Date();
  const [currentYear, setCurrentYear] = useState<number>(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(initialDate.getMonth()); // 0-11

  const todayStr = new Date().toISOString().slice(0, 10);

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    onSelectDate(todayStr);
  };

  // Calculate calendar grid days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0-6 (Sun-Sat)
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Find marked dates for current month
  const totalEntriesThisMonth = Object.keys(markedDates).filter((d) => {
    const [y, m] = d.split('-').map(Number);
    return y === currentYear && m === currentMonth + 1;
  }).reduce((acc, curr) => acc + (markedDates[curr]?.count || 0), 0);

  // Sorted list of all recorded dates
  const allRecordedDates = Object.keys(markedDates).sort();

  const handlePrevRecordedDate = () => {
    const prev = [...allRecordedDates].reverse().find((d) => d < selectedDate);
    if (prev) {
      const [y, m] = prev.split('-').map(Number);
      setCurrentYear(y);
      setCurrentMonth(m - 1);
      onSelectDate(prev);
    }
  };

  const handleNextRecordedDate = () => {
    const next = allRecordedDates.find((d) => d > selectedDate);
    if (next) {
      const [y, m] = next.split('-').map(Number);
      setCurrentYear(y);
      setCurrentMonth(m - 1);
      onSelectDate(next);
    }
  };

  return (
    <div className="rounded-3xl border border-purple-800/60 bg-slate-900/95 p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
        <div className="flex items-center space-x-2">
          {variant === 'dreams' ? (
            <Moon className="h-4 w-4 text-cyan-400" />
          ) : (
            <CalendarIcon className="h-4 w-4 text-amber-400" />
          )}
          <h3 className="font-serif text-sm font-bold text-slate-100">
            {title}
          </h3>
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="rounded-lg p-1.5 text-purple-300 hover:bg-purple-950/80 hover:text-white transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <span className="font-serif text-xs font-bold text-amber-200 px-2 min-w-[110px] text-center">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>

          <button
            type="button"
            onClick={handleNextMonth}
            className="rounded-lg p-1.5 text-purple-300 hover:bg-purple-950/80 hover:text-white transition-colors"
            title="Next Month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono font-bold text-purple-400/80 uppercase">
        {DAYS_OF_WEEK.map((d, i) => (
          <div key={i} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Leading empty cells for offset */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="h-9 rounded-xl opacity-0" />
        ))}

        {/* Month Day Cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const isSelected = selectedDate === dayStr;
          const isToday = todayStr === dayStr;
          const marker = markedDates[dayStr];
          const hasEntry = Boolean(marker && marker.count > 0);

          return (
            <button
              key={dayStr}
              type="button"
              onClick={() => onSelectDate(dayStr)}
              className={`group relative flex h-9 w-full flex-col items-center justify-center rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 scale-105 z-10'
                  : hasEntry
                  ? 'bg-purple-950/70 border border-amber-500/40 text-amber-200 hover:bg-purple-900/80 hover:border-amber-400'
                  : 'text-slate-300 hover:bg-purple-950/50 hover:text-white'
              } ${isToday && !isSelected ? 'ring-1 ring-cyan-400 font-bold text-cyan-200' : ''}`}
            >
              <span className="leading-none text-[11px]">{dayNum}</span>

              {/* Entry marker dot/badge */}
              {hasEntry && (
                <span
                  className={`mt-0.5 inline-flex h-1.5 w-1.5 rounded-full ${
                    isSelected
                      ? 'bg-slate-950'
                      : marker.isFavorite
                      ? 'bg-amber-400 animate-pulse'
                      : variant === 'dreams'
                      ? 'bg-cyan-400'
                      : 'bg-amber-400'
                  }`}
                  title={`${marker.count} entry on ${dayStr}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Navigation / Summary Footer */}
      <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-[11px]">
        <div className="text-purple-300/80 font-mono">
          <span>{totalEntriesThisMonth} {variant === 'dreams' ? 'dreams' : 'entries'} this month</span>
        </div>

        <div className="flex items-center space-x-1.5">
          {allRecordedDates.length > 0 && (
            <>
              <button
                type="button"
                onClick={handlePrevRecordedDate}
                disabled={!allRecordedDates.some((d) => d < selectedDate)}
                className="rounded-lg bg-purple-950/60 border border-purple-800/60 px-2 py-1 text-[10px] text-purple-200 hover:text-amber-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Jump to previous recorded entry date"
              >
                ← Prev Entry
              </button>

              <button
                type="button"
                onClick={handleNextRecordedDate}
                disabled={!allRecordedDates.some((d) => d > selectedDate)}
                className="rounded-lg bg-purple-950/60 border border-purple-800/60 px-2 py-1 text-[10px] text-purple-200 hover:text-amber-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Jump to next recorded entry date"
              >
                Next Entry →
              </button>
            </>
          )}

          <button
            type="button"
            onClick={handleJumpToToday}
            className="rounded-lg bg-amber-500/20 border border-amber-400/40 px-2 py-1 text-[10px] font-bold text-amber-300 hover:bg-amber-500/30 transition-colors"
          >
            Today
          </button>
        </div>
      </div>
    </div>
  );
};
