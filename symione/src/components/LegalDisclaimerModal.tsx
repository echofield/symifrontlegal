interface LegalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  type: 'contract' | 'advisor' | 'payment';
}

export function LegalDisclaimerModal({ isOpen, onClose, onAccept, type }: LegalDisclaimerModalProps) {
  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case 'contract':
        return {
          title: 'Conditions d\'utilisation - Génération de contrat',
          content: [
            'Ce document est généré automatiquement par intelligence artificielle et constitue un modèle type.',
            'Il ne remplace pas l\'avis d\'un avocat et doit être adapté à votre situation spécifique.',
            'Symione décline toute responsabilité quant à l\'utilisation de ce document.',
            'Pour des situations complexes ou litigieuses, nous recommandons fortement de consulter un professionnel du droit.',
          ],
          rgpd: 'Vos données sont traitées conformément au RGPD. Elles sont chiffrées et ne sont pas partagées avec des tiers.'
        };
      case 'advisor':
        return {
          title: 'Avertissement - Conseiller juridique',
          content: [
            'Le conseiller juridique fournit des informations générales et ne constitue pas un conseil juridique personnalisé.',
            'Les recommandations d\'avocats sont fournies à titre informatif et ne constituent pas un engagement de notre part.',
            'Symione n\'est pas responsable des conseils ou services fournis par les avocats recommandés.',
            'Toute décision prise sur la base de ces informations relève de votre seule responsabilité.',
          ],
          rgpd: 'Vos questions et réponses sont anonymisées et utilisées pour améliorer notre service. Données conformes RGPD.'
        };
      case 'payment':
        return {
          title: 'Conditions de paiement - Bond',
          content: [
            'Les fonds sont sécurisés via notre partenaire Stripe jusqu\'à validation des livrables.',
            'Une commission de 3% s\'applique sur chaque jalon validé, en plus des frais de setup de 149€.',
            'Le prestataire doit fournir les livrables convenus avant libération des fonds.',
            'En cas de litige, Symione se réserve le droit de médiation mais n\'est pas partie prenante du contrat.',
          ],
          rgpd: 'Les informations de paiement sont traitées par Stripe (certifié PCI DSS). Symione ne stocke pas vos données bancaires.'
        };
    }
  };

  const { title, content, rgpd } = getContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-2xl w-full mx-4 bg-background border border-border p-8 max-h-[80vh] overflow-y-auto">
        <div className="mb-6">
          <h2 
            className="text-[1.5rem] mb-2 tracking-[-0.01em]"
            style={{ fontWeight: 600 }}
          >
            {title}
          </h2>
          <div className="h-px bg-border mt-4" />
        </div>

        <div className="space-y-4 mb-6">
          {content.map((paragraph, index) => (
            <p 
              key={index}
              className="text-[0.875rem] text-muted-foreground"
              style={{ lineHeight: 1.7 }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="p-4 bg-accent/5 border border-accent/10 mb-6">
          <p className="text-[0.8125rem] text-muted-foreground" style={{ lineHeight: 1.6 }}>
            <strong className="text-foreground">Protection des données: </strong>
            {rgpd}
          </p>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-border hover:border-foreground transition-colors text-[0.75rem] uppercase tracking-[0.12em]"
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
          >
            Annuler
          </button>
          <button
            onClick={onAccept}
            className="flex-1 px-6 py-3 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all text-[0.75rem] uppercase tracking-[0.12em]"
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
          >
            J'accepte et continue
          </button>
        </div>
      </div>
    </div>
  );
}

