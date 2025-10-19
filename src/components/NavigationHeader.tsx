interface NavigationHeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  canGoBack: boolean;
  onBack: () => void;
}

export function NavigationHeader({ currentView, onNavigate, canGoBack, onBack }: NavigationHeaderProps) {
  return (
    <header className="header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h1 className="title" style={{ margin: 0 }}>
          SYMIONE
        </h1>
        <span className="badge">
          {currentView}
        </span>
      </div>
      
      <div className="row">
        {canGoBack && (
          <button onClick={onBack} className="btn btn-secondary">
            ← Retour
          </button>
        )}
        <button onClick={() => onNavigate('home')} className="btn btn-secondary">
          Accueil
        </button>
      </div>
    </header>
  );
}
