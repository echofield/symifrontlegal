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
  const [projectAmount, setProjectAmount] = useState<string>('');
  const [showExplainerModal, setShowExplainerModal] = useState(false);

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
        {/* Header */}
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
                Tableaux de bord
              </h1>
              <p className="text-[0.875rem] text-muted-foreground mt-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                Système de jalons collaboratifs et paiements sécurisés
              </p>
              
              <button 
                onClick={() => setShowExplainerModal(true)}
                className="text-accent underline mt-2 flex items-center hover:text-accent/80 transition-colors"
              >
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                </svg>
                Comment ça marche?
              </button>
            </div>

            <button
              onClick={() => onNavigate('bond-create')}
              className="px-10 py-4 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 inline-flex items-center gap-3"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              <span className="text-[0.75rem] uppercase tracking-[0.12em]">Créer un contrat</span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: 'linear' }}
          className="mb-12"
        >
          <div className="pricing-container max-w-4xl mx-auto">
            {/* PRICING CARD - Same style as pricing tiers */}
            <div className="pricing-card border border-border rounded-lg p-8 bg-card">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Tarification Transparente</h2>
              
              {/* Price breakdown - clean table style */}
              <div className="price-breakdown space-y-4 mb-8">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-lg text-foreground">Création du contrat sur-mesure:</span>
                  <span className="text-3xl font-bold text-accent">119€</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-lg text-foreground">+ Commission escrow sécurisé:</span>
                  <span className="text-3xl font-bold text-accent">3%</span>
                </div>
              </div>
              
              {/* Calculator */}
              <div className="calculator bg-muted/30 p-6 rounded-lg mb-8">
                <h3 className="font-semibold mb-3 text-foreground">Simulez vos frais:</h3>
                <input
                  type="number"
                  placeholder="Montant du projet (€)"
                  value={projectAmount}
                  onChange={(e) => setProjectAmount(e.target.value)}
                  className="w-full p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors mb-4"
                />
                {projectAmount && (
                  <div className="result p-4 bg-card rounded border border-border">
                    <p className="text-muted-foreground">Pour un projet de <strong className="text-foreground">{formatNumber(projectAmount)}€</strong></p>
                    <p className="text-3xl font-bold text-accent mt-2">
                      {formatNumber(119 + (parseFloat(projectAmount) * 0.03))}€
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      119€ + {formatNumber(parseFloat(projectAmount) * 0.03)}€ commission
                    </p>
                  </div>
                )}
              </div>
              
              {/* Features included - SAME STYLE AS PRICING TIERS */}
              <div className="features-included">
                <h3 className="font-bold text-xl mb-4 text-foreground">Ce forfait inclut:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-foreground">Contrat professionnel sur-mesure (30+ articles, validé par avocat)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-foreground">Système escrow Stripe Connect sécurisé</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-foreground">Gestion automatisée des jalons (milestones)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-foreground">Validation et libération automatique des fonds (72h)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-foreground">Service d'arbitrage en cas de litige</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-foreground">Suivi en temps réel de l'avancement du projet</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-foreground">Notifications automatiques par email</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-foreground">Export PDF & DOCX du contrat</span>
                  </li>
                </ul>
              </div>
              
              <button 
                onClick={() => onNavigate('bond-create')}
                className="w-full mt-8 py-4 text-lg font-semibold bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg transition-colors"
              >
                Créer un contrat sécurisé →
              </button>
              
              {/* Stripe Fees Disclaimer */}
              <div className="mt-6 p-3 bg-muted/30 border border-border rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Frais bancaires inclus:</strong> Les frais bancaires Stripe (≈3%) sont inclus dans notre commission escrow de 3%. 
                  Vous ne payez que ce qui est affiché, sans frais cachés.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[0.875rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>Chargement des contrats…</p>
          </div>
        )}

        {/* Contracts List */}
        {!loading && contracts.length > 0 && (
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
                    {/* Left: Info */}
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

                    {/* Right: Amount */}
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
        )}

        {/* Empty State */}
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
      
      {/* Explainer Modal */}
      {showExplainerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Comment fonctionnent les Contrats Bond?
                </h2>
                <button
                  onClick={() => setShowExplainerModal(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="steps space-y-6">
                {/* Step 1 */}
                <div className="step flex">
                  <div className="step-number bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 text-foreground">Création du contrat à jalons</h3>
                    <p className="text-muted-foreground">
                      Définissez votre projet en plusieurs étapes (milestones) avec livrables précis et montants associés.
                      <br/>
                      <span className="text-sm text-muted-foreground italic">
                        Ex: M1 Maquettes (10k€), M2 Frontend (15k€), M3 Backend (15k€), M4 Deploy (10k€)
                      </span>
                    </p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="step flex">
                  <div className="step-number bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 text-foreground">Paiement sécurisé escrow</h3>
                    <p className="text-muted-foreground">
                      Le client paie le montant total (50k€) via Stripe. Les fonds sont <strong>bloqués sur un compte escrow sécurisé</strong>, ni le prestataire ni le client n'y ont accès direct.
                    </p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="step flex">
                  <div className="step-number bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 text-foreground">Livraison & validation jalons</h3>
                    <p className="text-muted-foreground">
                      Le prestataire livre chaque jalon avec preuves (code, maquettes, démo). Le client a <strong>72h pour valider ou contester</strong>. Si validé (ou timeout), l'argent du jalon est <strong>libéré automatiquement</strong> au prestataire.
                    </p>
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="step flex">
                  <div className="step-number bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 text-foreground">Arbitrage en cas de litige</h3>
                    <p className="text-muted-foreground">
                      Si le client conteste, les fonds restent bloqués. SYMIONE examine les preuves (livrables, échanges) et décide qui a raison dans un <strong>délai de 7 jours</strong>. Décision finale et sans appel.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefits */}
              <div className="benefits mt-8 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                <h3 className="font-bold mb-2 text-foreground">Avantages pour tous:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-muted-foreground"><strong className="text-foreground">Client protégé:</strong> Argent bloqué tant que livraison non conforme</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-muted-foreground"><strong className="text-foreground">Prestataire protégé:</strong> Paiement garanti si livre correctement</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-muted-foreground"><strong className="text-foreground">0 conflit:</strong> Validation objective via preuves tangibles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-muted-foreground"><strong className="text-foreground">Automatisé:</strong> Libération auto après validation, pas d'action manuelle</span>
                  </li>
                </ul>
              </div>
              
              <button 
                onClick={() => {
                  setShowExplainerModal(false);
                  onNavigate('bond-create');
                }}
                className="w-full mt-6 py-3 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg transition-colors font-semibold"
              >
                J'ai compris, créer mon contrat →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
