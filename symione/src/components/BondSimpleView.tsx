import { motion } from "motion/react";
import { Plus, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface BondContract {
  id: string;
  title: string;
  amount: number;
  status: string;
}

interface BondSimpleViewProps {
  onNavigate: (view: string, contractId?: string) => void;
}

export function BondSimpleView({ onNavigate }: BondSimpleViewProps) {
  const [contracts, setContracts] = useState<BondContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPricingDetails, setShowPricingDetails] = useState(false);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch('https://symilegalback.vercel.app/api/escrow/contracts');
        const data = await response.json();
        if (data.success && data.contracts) {
          setContracts(data.contracts);
        }
      } catch (error) {
        console.error('Error fetching contracts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-accent/10 text-accent border-accent/20';
      case 'pending': return 'bg-muted text-muted-foreground';
      case 'completed': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'EN COURS';
      case 'pending': return 'EN ATTENTE';
      case 'completed': return 'TERMINÉ';
      default: return 'INCONNU';
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
        
        {/* Header - Style suisse strict */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'linear' }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-6 border-b border-border">
            <div>
              <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                SYMI BOND / CONTRATS SÉCURISÉS
              </p>
              <h1 className="text-[2rem] md:text-[3rem] tracking-[-0.03em]" style={{ fontWeight: 600, lineHeight: 1.1 }}>
                Créer un contrat sécurisé
              </h1>
              <p className="text-[0.875rem] text-muted-foreground mt-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                Système de jalons collaboratifs et paiements sécurisés
              </p>
              
              <button 
                onClick={() => onNavigate('bond-guide')}
                className="text-accent underline mt-2 flex items-center hover:text-accent/80 transition-colors"
              >
                Comment ça marche?
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPricingDetails(!showPricingDetails)}
                className="px-6 py-3 border border-border hover:border-foreground transition-all duration-200 text-[0.75rem] tracking-[0.12em] uppercase inline-flex items-center gap-3"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
              >
                Tarif
              </button>
              <button
                onClick={() => onNavigate('bond-create')}
                className="px-10 py-4 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 inline-flex items-center gap-3"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
              >
                <Plus className="w-4 h-4" strokeWidth={2} />
                <span className="text-[0.75rem] uppercase tracking-[0.12em]">Créer un contrat</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Pricing Popup - Style pricing tiers */}
        {showPricingDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    Tarification Bond
                  </h2>
                  <button
                    onClick={() => setShowPricingDetails(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Pricing breakdown - Same style as pricing tiers */}
                <div className="space-y-6">
                  <div className="pricing-item border border-border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-foreground">Création contrat sur-mesure</h3>
                      <span className="text-2xl font-bold text-accent">119€</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Contrat professionnel validé par avocat avec 30+ articles
                    </p>
                  </div>
                  
                  <div className="pricing-item border border-border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-foreground">Commission escrow sécurisé</h3>
                      <span className="text-2xl font-bold text-accent">3%</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Système Stripe Connect avec gestion automatisée des jalons
                    </p>
                  </div>
                  
                  <div className="pricing-item border border-border rounded-lg p-6 bg-accent/5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-foreground">Total</h3>
                      <span className="text-3xl font-bold text-accent">119€ + 3%</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Frais bancaires Stripe inclus dans la commission
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-muted/30 border border-border rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Frais bancaires inclus:</strong> Les frais bancaires Stripe (≈3%) sont inclus dans notre commission escrow de 3%. 
                    Vous ne payez que ce qui est affiché, sans frais cachés.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Contract Templates - Style suisse strict comme première image */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: 'linear' }}
          className="mb-16"
        >
          <h2 className="text-[1.25rem] mb-6" style={{ fontWeight: 600 }}>
            Choisissez votre type de contrat
          </h2>
          
          <div className="space-y-2">
            {[
              { id: 'service', title: 'Contrat de Prestation', description: 'Services professionnels avec jalons', category: 'ENTREPRISE', popular: true },
              { id: 'freelance', title: 'Freelance', description: 'Travail indépendant sécurisé', category: 'EMPLOI', popular: false },
              { id: 'partnership', title: 'Partenariat', description: 'Collaboration entre entreprises', category: 'ENTREPRISE', popular: false },
              { id: 'nda', title: 'Accord de Confidentialité', description: 'Protection des informations', category: 'ENTREPRISE', popular: false },
              { id: 'work', title: 'Contrat de Travail', description: 'Emploi avec jalons de performance', category: 'EMPLOI', popular: false },
              { id: 'custom', title: 'Contrat Personnalisé', description: 'Sur-mesure selon vos besoins', category: 'CUSTOM', popular: false },
            ].map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05, ease: 'linear' }}
                onClick={() => onNavigate('bond-create')}
                className="w-full border border-border hover:border-foreground transition-all duration-200 p-6 cursor-pointer"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-[1.125rem] tracking-[-0.01em]" style={{ fontWeight: 600 }}>
                            {template.title}
                          </h3>
                          {template.popular && (
                            <span className="px-2 py-1 rounded text-[0.625rem] uppercase tracking-[0.1em] border border-accent/20 bg-accent/10 text-accent" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                              POPULAIRE
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                          <span>CATEGORY</span>
                          <span>{template.category}</span>
                        </div>
                        <p className="text-[0.875rem] text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 lg:flex-col lg:items-end lg:gap-4">
                    <div className="text-right">
                      <div className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground mb-1" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                        TYPE
                      </div>
                      <div className="text-[0.875rem] tracking-[-0.02em]" style={{ fontWeight: 400 }}>
                        ESCROW
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Existing Contracts Section */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[0.875rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
              Chargement des contrats…
            </p>
          </div>
        )}

        {!loading && contracts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'linear' }}
            className="mt-16"
          >
            <h2 className="text-[1.25rem] mb-6" style={{ fontWeight: 600 }}>
              Vos contrats existants
            </h2>
            <div className="space-y-2">
              {contracts.map((contract, index) => (
                <motion.div
                  key={contract.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05, ease: 'linear' }}
                >
                  <div className="w-full border border-border hover:border-foreground transition-all duration-200 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                              <h3 className="text-[1.125rem] tracking-[-0.01em]" style={{ fontWeight: 600 }}>
                                {contract.title}
                              </h3>
                              <span className={`px-2 py-1 rounded text-[0.625rem] uppercase tracking-[0.1em] border ${getStatusColor(contract.status)}`} style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                                {getStatusLabel(contract.status)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                              <span>ID: {contract.id}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 lg:flex-col lg:items-end lg:gap-4">
                        <div className="text-right">
                          <div className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground mb-1" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                            MONTANT
                          </div>
                          <div className="text-[1.5rem] tracking-[-0.02em]" style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                            {contract.amount.toLocaleString('fr-FR')} €
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {!loading && contracts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'linear' }}
            className="text-center py-20"
          >
            <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
              <Plus className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <h3 className="text-[1.25rem] mb-3" style={{ fontWeight: 600 }}>
              Aucun contrat pour le moment
            </h3>
            <p className="text-[0.875rem] text-muted-foreground mb-8" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
              Créez votre premier contrat sécurisé avec jalons
            </p>
            <button
              onClick={() => onNavigate('bond-create')}
              className="px-10 py-4 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 inline-flex items-center gap-3"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              <span className="text-[0.75rem] uppercase tracking-[0.12em]">Créer un contrat</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}