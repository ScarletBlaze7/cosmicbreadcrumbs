import React, { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Cosmic Sanctuary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'An unknown initialization error occurred.';
      const errorStack = this.state.error?.stack || '';

      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#070614] p-4 text-center text-white font-sans">
          <div className="max-w-lg w-full rounded-3xl border border-purple-800/80 bg-slate-900/95 p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="text-4xl">✨</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-amber-200">
              Cosmic Sanctuary Calibrating
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
              The cosmic conduit encountered a momentary misalignment. Tap below to reload or reset the connection:
            </p>

            {/* Error Message Details */}
            <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-left">
              <div className="text-xs font-mono font-bold text-rose-300">
                {errorMessage}
              </div>
              {errorStack && (
                <pre className="mt-2 text-[10px] font-mono text-rose-200/70 overflow-x-auto max-h-32 p-2 bg-black/40 rounded-lg whitespace-pre-wrap">
                  {errorStack}
                </pre>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 py-3 text-xs sm:text-sm font-bold text-white shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                Re-enter Sanctuary (Reload)
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.clear();
                    sessionStorage.clear();
                  } catch (e) {}
                  window.location.reload();
                }}
                className="w-full rounded-2xl border border-amber-500/60 bg-amber-500/10 py-2.5 text-xs font-bold text-amber-200 hover:bg-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                🧹 Clear Cached Data & Reset Cleanly
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
