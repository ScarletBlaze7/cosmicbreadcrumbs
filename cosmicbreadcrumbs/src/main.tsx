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
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#070614] p-6 text-center text-white">
          <div className="max-w-md rounded-3xl border border-purple-800/80 bg-slate-900/90 p-8 shadow-2xl space-y-4">
            <div className="text-4xl">✨</div>
            <h2 className="font-serif text-xl font-bold text-amber-200">
              Cosmic Sanctuary Calibrating
            </h2>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              The cosmic conduit encountered a momentary misalignment. Tap below to refresh your connection to the cosmos:
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 py-3 text-xs font-bold text-white shadow-lg hover:opacity-90 active:scale-95 transition-all"
              >
                Re-enter Sanctuary (Refresh)
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    sessionStorage.clear();
                  } catch {}
                  window.location.reload();
                }}
                className="w-full rounded-2xl border border-purple-800/60 bg-purple-950/40 py-2.5 text-xs text-purple-300 hover:text-white transition-all"
              >
                Reset Session & Reload
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
