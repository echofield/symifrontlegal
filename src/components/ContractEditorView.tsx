interface ContractEditorViewProps {
  templateId: string;
  onBack: () => void;
}

export function ContractEditorView({ templateId, onBack }: ContractEditorViewProps) {
  return (
    <main className="container">
      <div className="header">
        <button onClick={onBack} className="btn btn-secondary">
          ← Retour
        </button>
      </div>
      
      <h1 className="title">Éditeur de Contrat</h1>
      <p className="muted">
        Template ID: {templateId}
      </p>
      
      <div className="card" style={{ marginTop: '24px' }}>
        <p className="muted">
          Cette vue sera intégrée avec l'éditeur existant.
        </p>
      </div>
    </main>
  );
}
