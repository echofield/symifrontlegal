export function InstrumentHero() {
  return (
    <section className="container">
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <h1 className="title" style={{ fontSize: '3rem', marginBottom: '16px' }}>
          SYMIONE
        </h1>
        <p className="muted" style={{ fontSize: '1.2rem', marginBottom: '32px' }}>
          Automatisation juridique de précision pour pratique professionnelle
        </p>
        <div className="row" style={{ justifyContent: 'center', gap: '16px' }}>
          <button className="btn btn-primary" style={{ padding: '12px 24px' }}>
            Accéder au système
          </button>
          <button className="btn btn-secondary" style={{ padding: '12px 24px' }}>
            Conseiller juridique
          </button>
        </div>
      </div>
    </section>
  );
}
