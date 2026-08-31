import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-3xl border border-purple-800/60 bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950 p-6 sm:p-8 text-center space-y-4 shadow-2xl my-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-serif text-lg font-bold text-slate-100">
              {this.props.fallbackTitle || 'Celestial Harmony Restoring'}
            </h3>
            <p className="text-xs text-purple-200/90 leading-relaxed">
              {this.props.fallbackMessage || 'The cosmic energy is realigning this section. Tap below to reconnect.'}
            </p>
          </div>

          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:opacity-90 transition-all cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Restore Sanctuary View</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
