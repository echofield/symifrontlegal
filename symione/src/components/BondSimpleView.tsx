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

  // Template icons helper function
  const getTemplateIcon = (type: string) => {
    const icons = {
      service: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      ),
      freelance: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
      ),
      partnership: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
      ),
      nda: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
      ),
      work: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
      ),
      custom: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
      )
    };
    return icons[type] || icons.service;
  };

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
                Contrats de Confiance avec Coffre-Fort intégré
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

        {/* Pricing Popup - Style exact photo 2 */}
        {showPricingDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white border-l-4 border-r-4 border-l-accent border-r-accent max-w-md w-full">
              
              {/* Title and Price Section */}
              <div className="px-8 py-8">
                <h2 className="text-[2rem] font-bold text-foreground mb-2" style={{ fontWeight: 600 }}>
                  Bond
                </h2>
                <p className="text-[0.75rem] uppercase tracking-[0.1em] text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                  CONTRATS DE CONFIANCE AVEC COFFRE-FORT
                </p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-[3rem] font-bold text-foreground" style={{ fontWeight: 600 }}>119</span>
                  <span className="text-[1rem] text-muted-foreground">€ + 3%</span>
                </div>
                <p className="text-[0.875rem] text-muted-foreground">
                  Vos paiements par jalons protégés dans un coffre-fort digital
                </p>
              </div>
              
              {/* Separator */}
              <div className="border-t border-border mx-8"></div>
              
              {/* Benefits Introduction */}
              <div className="px-8 py-4">
                <div className="bg-muted/30 rounded p-4 flex items-center gap-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-accent-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-[0.875rem] text-muted-foreground">
                    Système de coffre-fort sécurisé
                  </span>
                </div>
              </div>
              
              {/* Benefits List */}
              <div className="px-8 pb-6">
                <div className="space-y-3">
                  {[
                    "Contrat professionnel sur-mesure (30+ articles, validé par avocat)",
                    "Système de coffre-fort Stripe Connect sécurisé", 
                    "Gestion automatisée des jalons (milestones)",
                    "Validation et libération automatique des fonds (72h)",
                    "Service d'arbitrage en cas de litige",
                    "Suivi en temps réel de l'avancement du projet",
                    "Notifications automatiques par email",
                    "Export PDF & DOCX du contrat"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-2 h-2 text-accent-foreground" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span className="text-[0.875rem] text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Stripe Fees Disclaimer */}
              <div className="px-8 py-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Frais bancaires inclus:</strong> Les frais bancaires Stripe (≈3%) sont inclus 
                    dans notre commission de sécurisation coffre-fort de 3%. 
                    Vous ne payez que ce qui est affiché, sans frais cachés.
                  </p>
                </div>
              </div>
              
              {/* Call to Action Button */}
              <div className="px-8 pb-8">
                <button
                  onClick={() => {
                    setShowPricingDetails(false);
                    onNavigate('bond-create');
                  }}
                  className="w-full bg-accent text-accent-foreground py-4 rounded text-[0.75rem] uppercase tracking-[0.1em] font-semibold hover:bg-accent/90 transition-colors"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
                >
                  CRÉER UN CONTRAT BOND
                </button>
              </div>
              
              {/* Close button */}
              <button
                onClick={() => setShowPricingDetails(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'service', title: 'Contrat de Prestation', description: 'Services professionnels avec jalons', category: 'ENTREPRISE', popular: true, type: 'service' },
              { id: 'freelance', title: 'Freelance', description: 'Travail indépendant sécurisé', category: 'EMPLOI', popular: false, type: 'freelance' },
              { id: 'partnership', title: 'Partenariat', description: 'Collaboration entre entreprises', category: 'ENTREPRISE', popular: false, type: 'partnership' },
              { id: 'nda', title: 'Accord de Confidentialité', description: 'Protection des informations', category: 'ENTREPRISE', popular: false, type: 'nda' },
              { id: 'work', title: 'Contrat de Travail', description: 'Emploi avec jalons de performance', category: 'EMPLOI', popular: false, type: 'work' },
              { id: 'custom', title: 'Contrat Personnalisé', description: 'Sur-mesure selon vos besoins', category: 'CUSTOM', popular: false, type: 'custom' },
            ].map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => onNavigate('bond-create')}
                className="template-card group relative bg-card border-2 border-border rounded-xl p-6 text-left hover:border-accent hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                
                {/* Icon container with gradient background */}
                <div className="icon-container mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl flex items-center justify-center group-hover:from-accent group-hover:to-accent/80 transition-all duration-300">
                    <svg className="w-8 h-8 text-accent group-hover:text-accent-foreground transition-colors duration-300">
                      {getTemplateIcon(template.type)}
                    </svg>
                  </div>
                </div>
                
                {/* Title with hover color */}
                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-accent transition-colors">
                  {template.title}
                </h3>
                
                {/* Description with better line height */}
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed min-h-[60px]">
                  {template.description}
                </p>
                
                {/* Metadata with icons */}
                <div className="metadata space-y-2 pt-4 border-t border-border">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <svg className="w-4 h-4 mr-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                    <span><strong className="font-semibold">Rôles:</strong> Client, Prestataire</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <svg className="w-4 h-4 mr-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    <span><strong className="font-semibold">Jalons:</strong> 3-5 étapes</span>
                  </div>
                  {template.popular && (
                    <div className="inline-flex items-center px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      Populaire
                    </div>
                  )}
                </div>
                
                {/* Arrow indicator on hover */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
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