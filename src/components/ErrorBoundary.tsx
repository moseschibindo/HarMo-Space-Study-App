import React, { useState, useEffect, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

export function ErrorBoundary({ children }: Props) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setHasError(true);
      setError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const handleReset = () => {
    setHasError(false);
    setError(null);
    window.location.reload();
  };

  if (hasError) {
    let errorMessage = "Something went wrong. Please try again.";
    
    try {
      if (error?.message) {
        const parsed = JSON.parse(error.message);
        if (parsed.error && parsed.operationType) {
          errorMessage = `Database error during ${parsed.operationType}: ${parsed.error}`;
        }
      }
    } catch (e) {
      errorMessage = error?.message || errorMessage;
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div className="max-w-md w-full glass-panel rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-bold text-slate-900">Oops!</h2>
            <p className="text-slate-600 leading-relaxed">
              {errorMessage}
            </p>
          </div>
          <button
            onClick={handleReset}
            className="w-full py-3 px-6 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            <RefreshCcw size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
