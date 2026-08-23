import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, RefreshCw, MessageSquareQuote, Lock, Gift } from 'lucide-react';
import { UserProfile, MembershipStatus } from '../types';
import { generateCelestialOracleResponse } from '../utils/celestialOracleEngine';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface CosmicOracleChatProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  membership?: MembershipStatus;
  onOpenMembership?: () => void;
}

export const CosmicOracleChat: React.FC<CosmicOracleChatProps> = ({
  isOpen,
  onClose,
  userProfile,
  membership,
  onOpenMembership,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Greetings, ${userProfile.name || 'Beloved Seeker'}. I am the Celestial Oracle. The planetary transits, sacred numbers, and angelic frequencies are woven together before me. What question or dream stirs within your soul today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (membership && !membership.isActive) {
      if (onOpenMembership) {
        onOpenMembership();
      }
      return;
    }

    const userText = input.trim();
    setInput('');

    const newMsg: Message = {
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, newMsg];
    setMessages(updatedHistory);
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/oracle-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userProfile,
        }),
      });

      const data = await res.json();
      const genericFallback = "The celestial currents are aligned with your heart. Trust your intuition and take one mindful step toward your highest joy today.";

      if (data.reply && data.reply.trim() !== genericFallback) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        // Dynamic Astrological / Hermetic engine response tailored to seeker & topic
        const dynamicAnswer = generateCelestialOracleResponse({
          userProfile,
          lastMessage: userText,
          chatHistoryLength: updatedHistory.length,
        });

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: dynamicAnswer,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      // Dynamic fallback for offline mobile WebView or serverless environment
      const dynamicAnswer = generateCelestialOracleResponse({
        userProfile,
        lastMessage: userText,
        chatHistoryLength: updatedHistory.length,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: dynamicAnswer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'What is the meaning of a vivid recurring dream?',
    'How should I approach a major career decision?',
    'What karmic lesson is currently active in my life?',
    'How can I open my heart chakra to receive love?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative flex h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-purple-800/60 bg-slate-900 shadow-2xl shadow-purple-950/60 animate-in fade-in zoom-in-95">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-purple-800/40 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-4 sm:p-5">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/30 border border-purple-500/40 text-amber-300">
              <MessageSquareQuote className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-slate-100 flex items-center space-x-2">
                <span>The Celestial Oracle</span>
                <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[9px] font-mono text-amber-300">
                  ONLINE
                </span>
              </h3>
              <p className="text-[11px] text-purple-300/80">
                Personalized for {userProfile.name} • {userProfile.sunSign} Sun • Life Path {userProfile.lifePathNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-purple-900/40 hover:text-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Message Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                    isUser
                      ? 'border-amber-500/40 bg-amber-500/20 text-amber-300'
                      : 'border-purple-500/40 bg-purple-600/30 text-purple-300'
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-purple-600 text-white rounded-tr-none shadow-md'
                      : 'border border-purple-900/60 bg-slate-950/80 text-purple-100/90 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  <span
                    className={`mt-1.5 block text-[9px] ${
                      isUser ? 'text-purple-200/70 text-right' : 'text-purple-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-3 text-purple-400 text-xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-purple-500/40 bg-purple-600/30 text-amber-300">
                <Sparkles className="h-4 w-4 animate-spin-slow" />
              </div>
              <div className="rounded-2xl border border-purple-900/60 bg-slate-950/80 px-4 py-3 text-xs text-purple-300 flex items-center space-x-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-400" />
                <span>The Oracle is consulting the celestial planes...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {messages.length < 3 && (
          <div className="border-t border-purple-950 bg-slate-950/60 px-4 py-2 flex space-x-2 overflow-x-auto no-scrollbar">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setInput(q)}
                className="shrink-0 rounded-full border border-purple-800/40 bg-slate-900 px-3 py-1 text-[11px] text-purple-300 hover:border-amber-400 hover:text-amber-300 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar or Unlock Trial CTA */}
        {membership && !membership.isActive ? (
          <div className="border-t border-purple-800/40 bg-slate-950 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-amber-300 font-semibold">
                <Lock className="h-4 w-4 text-amber-400" />
                <span>Oracle AI Requires The Sanctuary Club Access</span>
              </div>
              <span className="text-[10px] text-purple-300">$0 Upfront Trial</span>
            </div>
            <p className="text-[11px] text-purple-200/80">
              Join the <strong>Sanctuary Club</strong> with a <strong>3-Day Free Trial ($0 upfront)</strong> or weekly ($3/wk), monthly ($11/mo), and lifetime ($33) access.
            </p>
            <button
              type="button"
              onClick={onOpenMembership}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-2.5 font-serif text-xs font-bold text-slate-950 shadow-md hover:from-amber-300 hover:to-amber-400 transition-all"
            >
              <Gift className="h-4 w-4" />
              <span>Join Sanctuary Club (3-Day Free Trial)</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="border-t border-purple-800/40 bg-slate-950 p-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the Oracle about dreams, love, purpose, or synchronicities..."
                className="flex-1 rounded-2xl border border-purple-900/60 bg-slate-900 px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-purple-400/50 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                id="btn-send-oracle-msg"
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-amber-500 text-white shadow-md hover:opacity-90 disabled:opacity-40 transition-all"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
