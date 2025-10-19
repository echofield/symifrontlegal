interface ConseillerViewProps {
  onBack: () => void;
}

export function ConseillerView({ onBack }: ConseillerViewProps) {
  return (
    <main className="container">
      <div className="header">
        <button onClick={onBack} className="btn btn-secondary">
          ← Retour
        </button>
      </div>
      
      <h1 className="title">Conseiller Juridique</h1>
      <p className="muted">
        Cette vue sera intégrée avec la page conseiller existante.
      </p>
      
      <div className="card" style={{ marginTop: '24px' }}>
        <p className="muted">
          Redirection vers la page conseiller existante...
        </p>
      </div>
    </main>
  );
}
