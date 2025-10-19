interface ControlSurfaceProps {
  onNavigate: (route: string) => void;
  onNavigateConseiller: () => void;
}

export function ControlSurface({ onNavigate, onNavigateConseiller }: ControlSurfaceProps) {
  return (
    <section className="container">
      <div className="grid grid-2" style={{ marginTop: '24px' }}>
        <button 
          onClick={() => onNavigate('contracts')}
          className="btn btn-primary"
          style={{ padding: '16px', fontSize: '16px', fontWeight: '600' }}
        >
          📄 Modèles de Contrats
        </button>
        
        <button 
          onClick={() => onNavigate('editor')}
          className="btn btn-primary"
          style={{ padding: '16px', fontSize: '16px', fontWeight: '600' }}
        >
          ✏️ Éditeur de Contrats
        </button>
        
        <button 
          onClick={() => onNavigate('bond')}
          className="btn btn-primary"
          style={{ padding: '16px', fontSize: '16px', fontWeight: '600' }}
        >
          🔒 Module Bond/Escrow
        </button>
        
        <button 
          onClick={onNavigateConseiller}
          className="btn btn-primary"
          style={{ padding: '16px', fontSize: '16px', fontWeight: '600' }}
        >
          🤖 Conseiller Juridique
        </button>
      </div>
    </section>
  );
}
