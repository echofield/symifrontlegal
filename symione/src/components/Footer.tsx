export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-[1920px] mx-auto px-8 lg:px-16 py-8">
        <div className="flex flex-col gap-6">
          <div className="disclaimer-section border border-border p-4">
            <p className="text-[0.8125rem] mb-2" style={{ lineHeight: 1.6 }}>
              Avertissement juridique: Symione est un outil d'aide à la décision. Nos contenus sont informatifs et ne constituent pas des conseils juridiques personnalisés. Nous recommandons de consulter un avocat pour toute situation complexe.
            </p>
            <p className="text-[0.8125rem] text-muted-foreground">
              Vos données sont chiffrées et conformes au RGPD.
              <a href="/confidentialite" className="underline ml-2">Politique de confidentialité</a>
              <span className="mx-2">•</span>
              <a href="/mentions-legales" className="underline">Mentions légales</a>
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-[0.75rem] text-muted-foreground uppercase tracking-wide" style={{ fontWeight: 500 }}>
                © 2025 SYMIONE
              </p>
              <p className="text-[0.75rem] text-muted-foreground">
                Intelligent legal systems for modern practices
              </p>
            </div>

            <div className="flex gap-8">
              <a 
                href="/confidentialite" 
                className="text-[0.75rem] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide"
                style={{ fontWeight: 500 }}
              >
                Confidentialité
              </a>
              <a 
                href="/mentions-legales" 
                className="text-[0.75rem] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide"
                style={{ fontWeight: 500 }}
              >
                Mentions légales
              </a>
              <a 
                href="#support" 
                className="text-[0.75rem] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide"
                style={{ fontWeight: 500 }}
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
