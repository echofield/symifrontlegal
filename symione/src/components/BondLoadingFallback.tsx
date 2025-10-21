import React from 'react';

export function BondLoadingFallback() {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 text-center">
        <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Chargement du module Bond
        </h2>
        
        <p className="text-muted-foreground">
          Préparation de votre environnement sécurisé...
        </p>
      </div>
    </div>
  );
}
