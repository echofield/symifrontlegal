interface ContractsListViewProps {
  onBack: () => void;
  onSelectTemplate: (templateId: string) => void;
}

export function ContractsListView({ onBack, onSelectTemplate }: ContractsListViewProps) {
  return (
    <main className="container">
      <div className="header">
        <button onClick={onBack} className="btn btn-secondary">
          ← Retour
        </button>
      </div>
      
      <h1 className="title">Modèles de Contrats</h1>
      <p className="muted">
        Sélectionnez un modèle de contrat pour commencer la génération.
      </p>
      
      <div className="card" style={{ marginTop: '24px' }}>
        <p className="muted">
          Cette vue sera intégrée avec la liste existante des contrats.
        </p>
      </div>
    </main>
  );
}
