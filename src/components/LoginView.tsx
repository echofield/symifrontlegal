interface LoginViewProps {
  onNavigate: (view: string) => void;
}

export function LoginView({ onNavigate }: LoginViewProps) {
  return (
    <main className="container">
      <h1 className="title">Connexion</h1>
      <p className="muted">
        Connectez-vous pour accéder à toutes les fonctionnalités.
      </p>
      
      <div className="card" style={{ marginTop: '24px' }}>
        <p className="muted">
          Page de connexion à développer.
        </p>
      </div>
    </main>
  );
}
