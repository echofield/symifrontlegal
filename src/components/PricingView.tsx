interface PricingViewProps {
  onNavigate: (view: string) => void;
}

export function PricingView({ onNavigate }: PricingViewProps) {
  return (
    <main className="container">
      <h1 className="title">Tarifs</h1>
      <p className="muted">
        Découvrez nos offres pour votre pratique juridique.
      </p>
      
      <div className="card" style={{ marginTop: '24px' }}>
        <p className="muted">
          Page de tarification à développer.
        </p>
      </div>
    </main>
  );
}
