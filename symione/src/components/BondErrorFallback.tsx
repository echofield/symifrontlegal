import React from 'react';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

interface BondErrorFallbackProps {
  onBack: () => void;
  error?: Error;
  resetError?: () => void;
}

export function BondErrorFallback({ onBack, error, resetError }: BondErrorFallbackProps) {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Erreur dans le module Bond
        </h1>
        
        <p className="text-muted-foreground mb-6">
          Une erreur inattendue s'est produite. Veuillez réessayer ou revenir à la page précédente.
        </p>
        
        {process.env.NODE_ENV === 'development' && error && (
          <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-foreground mb-2">Détails de l'erreur:</h3>
            <pre className="text-xs text-muted-foreground overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-border hover:border-foreground transition-all duration-200 text-[0.75rem] tracking-[0.12em] uppercase inline-flex items-center justify-center gap-3"
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          
          {resetError && (
            <button
              onClick={resetError}
              className="px-6 py-3 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-200 text-[0.75rem] tracking-[0.12em] uppercase inline-flex items-center justify-center gap-3"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
