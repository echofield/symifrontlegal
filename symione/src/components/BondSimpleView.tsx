import { motion } from "motion/react";
import { Plus, CheckCircle } from "lucide-react";
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
  const [projectAmount, setProjectAmount] = useState<string>('');
  const [showPricingDetails, setShowPricingDetails] = useState(false);

  const formatNumber = (num: string | number) => {
    const value = typeof num === 'string' ? parseFloat(num) : num;
    return new Intl.NumberFormat('fr-FR').format(value);
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
      case 'active': return 'En cours';
      case 'pending': return 'En attente';
      case 'completed': return 'Terminé';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
        
        {/* NEW LAYOUT: Contract Creation Hero + Pricing Sidebar */}
        <div className="bond-page-layout flex gap-8">
          
          {/* LEFT/MAIN: Contract Creation (Priority - 80%) */}
          <div className="contract-creation-main flex-1">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'linear' }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold mb-2 text-foreground">Créer un contrat sécurisé</h1>
              <p className="text-muted-foreground text-lg mb-4">
                Système de jalons collaboratifs et paiements sécurisés
              </p>
              <button 
                onClick={() => onNavigate('bond-guide')}
                className="text-sm text-accent hover:underline inline-block"
              >
                Comment ça marche? →
              </button>
            </motion.div>
            
            {/* Contract Creation Hero */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: 'linear' }}
              className="wizard-container"
            >
              
              {/* Stepper */}
              <div className="steps mb-8">
                <div className="flex items-center justify-between max-w-2xl">
                  {[1,2,3,4,5].map(step => (
                    <div key={step} className="step-item flex items-center">
                      <div className={`step-circle w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        step <= 1 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {step}
                      </div>
                      {step < 5 && (
                        <div className={`step-line w-16 h-0.5 mx-2 ${
                          step < 1 ? 'bg-accent' : 'bg-muted'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Step Content */}
              <div className="step-content bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Choisissez votre type de contrat</h2>
                
                {/* Contract Templates Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {[
                    { id: 'service', title: 'Contrat de Prestation', description: 'Services professionnels avec jalons', popular: true },
                    { id: 'freelance', title: 'Freelance', description: 'Travail indépendant sécurisé', popular: false },
                    { id: 'partnership', title: 'Partenariat', description: 'Collaboration entre entreprises', popular: false },
                    { id: 'nda', title: 'Accord de Confidentialité', description: 'Protection des informations', popular: false },
                    { id: 'work', title: 'Contrat de Travail', description: 'Emploi avec jalons de performance', popular: false },
                    { id: 'custom', title: 'Contrat Personnalisé', description: 'Sur-mesure selon vos besoins', popular: false },
                  ].map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onClick={() => onNavigate('bond-create')}
                      className="bg-card border border-border rounded-xl p-6 cursor-pointer hover:border-accent hover:shadow-lg transition-all group"
                    >
                      <h3 className="text-xl font-bold mb-3 text-foreground">{template.title}</h3>
                      <p className="text-muted-foreground mb-4">{template.description}</p>
                      
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          <strong>Rôles:</strong> Client, Prestataire
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <strong>Jalons:</strong> 3-5 étapes
                        </div>
                        {template.popular && (
                          <div className="inline-flex items-center px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Populaire
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Quick Start */}
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-3 text-foreground">Démarrage rapide</h3>
                  <p className="text-muted-foreground mb-4">
                    Commencez par choisir un template ci-dessus, ou créez un contrat personnalisé en quelques minutes.
                  </p>
                  <button
                    onClick={() => onNavigate('bond-create')}
                    className="px-6 py-3 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg transition-colors font-semibold"
                  >
                    Commencer la création →
                  </button>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="wizard-nav flex justify-between mt-6">
                <button 
                  className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                  disabled={true}
                >
                  ← Retour
                </button>
                <button 
                  onClick={() => onNavigate('bond-create')}
                  className="px-6 py-3 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg transition-colors"
                >
                  Créer le contrat →
                </button>
              </div>
            </motion.div>
            
          </div>
          
          {/* RIGHT/SIDEBAR: Pricing Module (Minimized - 20%) */}
          <div className="pricing-sidebar w-80 flex-shrink-0">
            
            {/* Collapsible pricing card */}
            <div className="sticky top-8">
              <div className="pricing-card bg-card border border-border rounded-lg p-6">
                
                <button 
                  onClick={() => setShowPricingDetails(!showPricingDetails)}
                  className="flex items-center justify-between w-full text-left mb-4"
                >
                  <h3 className="font-bold text-lg text-foreground">Tarification</h3>
                  <svg 
                    className={`w-5 h-5 transition-transform ${showPricingDetails ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Always visible: Summary */}
                <div className="pricing-summary">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground">Création contrat:</span>
                    <span className="font-bold text-accent">119€</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground">Commission escrow:</span>
                    <span className="font-bold text-accent">3%</span>
                  </div>
                </div>
                
                {/* Expandable: Details + Calculator */}
                {showPricingDetails && (
                  <div className="pricing-details mt-4 pt-4 border-t border-border">
                    
                    {/* Calculator */}
                    <div className="calculator mb-4">
                      <label className="text-sm font-semibold mb-2 block text-foreground">
                        Simulez vos frais:
                      </label>
                      <input
                        type="number"
                        placeholder="Montant projet (€)"
                        value={projectAmount}
                        onChange={(e) => setProjectAmount(e.target.value)}
                        className="w-full p-2 bg-input-background border border-border rounded text-sm"
                      />
                      {projectAmount && (
                        <div className="result mt-3 p-3 bg-card rounded border border-border">
                          <p className="text-xs text-muted-foreground">Total:</p>
                          <p className="text-2xl font-bold text-accent">
                            {formatNumber(119 + (parseFloat(projectAmount) * 0.03))}€
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Features included (collapsed by default) */}
                    <details className="mt-4">
                      <summary className="text-sm font-semibold cursor-pointer text-foreground">
                        Ce qui est inclus
                      </summary>
                      <ul className="mt-2 space-y-1 text-xs">
                        <li className="flex items-start">
                          <span className="text-green-500 mr-1">✓</span>
                          <span className="text-muted-foreground">Contrat sur-mesure validé par avocat</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-1">✓</span>
                          <span className="text-muted-foreground">Escrow Stripe Connect sécurisé</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-1">✓</span>
                          <span className="text-muted-foreground">Gestion automatisée des jalons</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-1">✓</span>
                          <span className="text-muted-foreground">Validation auto (72h)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-1">✓</span>
                          <span className="text-muted-foreground">Service d'arbitrage</span>
                        </li>
                      </ul>
                    </details>
                    
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground mt-4">
                  Frais bancaires Stripe inclus
                </p>
                
              </div>
            </div>
            
          </div>
          
        </div>

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
            <h2 className="text-2xl font-bold mb-6 text-foreground">Vos contrats existants</h2>
            <div className="grid gap-4">
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
                            Montant
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