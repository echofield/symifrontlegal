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
          <div className="pb-6 border-b border-border">
            <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
              SYMI BOND / CONTRATS SÉCURISÉS
            </p>
            <h1 className="text-[2rem] md:text-[3rem] tracking-[-0.03em]" style={{ fontWeight: 600, lineHeight: 1.1 }}>
              Créer un contrat sécurisé
            </h1>
            <p className="text-[0.875rem] text-muted-foreground mt-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
              Contrats de Confiance avec Coffre-Fort intégré
            </p>

            <div className="mt-6 p-6 bg-accent/5 border border-accent/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-[1rem] font-semibold mb-1">Tarification transparente</h3>
                  <p className="text-[0.875rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                    Setup: <span className="font-semibold text-accent">€149</span> • Commission: <span className="font-semibold text-accent">3%</span> par jalon
                  </p>
                </div>
                <button
                  onClick={() => setShowPricingDetails(!showPricingDetails)}
                  className="text-accent hover:text-accent/80 text-[0.75rem] uppercase tracking-[0.12em]"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
                >
                  {showPricingDetails ? 'Masquer' : 'Comment ça marche?'}
                </button>
              </div>

              {showPricingDetails && (
                <div className="mt-4 pt-4 border-t border-accent/20">
                  <p className="text-[0.75rem] text-muted-foreground mb-3" style={{ fontFamily: 'var(--font-mono)' }}>
                    <strong>Exemple:</strong> Mission €10,000 avec 5 jalons
                  </p>
                  <ul className="space-y-2 text-[0.75rem]" style={{ fontFamily: 'var(--font-mono)' }}>
                    <li className="flex justify-between">
                      <span>Setup contrat</span>
                      <span className="font-medium">€149</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Commission (3% × €10,000)</span>
                      <span className="font-medium">€300</span>
                    </li>
                    <li className="flex justify-between border-t border-accent/20 pt-2 font-semibold">
                      <span>Total</span>
                      <span className="text-accent">€449</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <button
              onClick={() => onNavigate('bond-guide')}
              className="text-accent underline text-[0.75rem] uppercase tracking-[0.12em]"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
            >
              Guide détaillé
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
        </motion.div>

        {/* Contract Templates - Style suisse strict comme première image */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: 'linear' }}
          className="mb-16"
        >
          <div className="mb-8">
            <h2 className="text-[1.25rem] mb-2 tracking-[-0.01em]" style={{ fontWeight: 600 }}>
              Choisissez le type de contrat qui correspond à votre projet
            </h2>
            <p className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
              Sélectionnez un modèle pour commencer la création de votre contrat sécurisé
            </p>
          </div>
          
          <div className="space-y-3">
            {[
              { id: 'service', title: 'Prestation de service', description: 'Pour missions de conseil, développement, design, marketing...', category: 'ENTREPRISE', popular: true, type: 'service' },
              { id: 'travaux', title: 'Travaux', description: 'Construction, rénovation, aménagements...', category: 'CONSTRUCTION', popular: false, type: 'work' },
              { id: 'creation', title: 'Création artistique', description: 'Design, illustration, musique, vidéo...', category: 'CRÉATIF', popular: false, type: 'custom' },
              { id: 'challenge', title: 'Pacte entre amis', description: 'Défis, paris, engagements personnels...', category: 'PERSONNEL', popular: false, type: 'partnership' },
              { id: 'custom', title: 'IA libre', description: 'Décrivez entièrement votre besoin, l\'IA s\'adapte', category: 'CUSTOM', popular: false, type: 'custom' },
            ].map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05, ease: 'linear' }}
                onClick={() => onNavigate('bond-create', template.id)}
                className="w-full border border-border p-8 lg:p-10 text-left hover:border-accent/50 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className="text-[2rem] flex-shrink-0">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-200">
                      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {getTemplateIcon(template.type)}
                      </svg>
                    </div>
                  </div>
                  
                  {/* Content avec metadata */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-[1.125rem] mb-2 tracking-[-0.005em]" style={{ fontWeight: 600 }}>
                          {template.title}
                        </h3>
                        <p className="text-[0.875rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                          {template.description}
                        </p>
                      </div>
                      {template.popular && (
                        <span className="bg-accent/10 text-accent border border-accent/20 px-3 py-1 text-[0.625rem] uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                          POPULAIRE
                        </span>
                      )}
                    </div>
                    
                    {/* Métadonnées 👥 📋 */}
                    <div className="flex items-center gap-6 text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                        </svg>
                        <span>Rôles: Client, Prestataire</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                        <span>Jalons: 3-5 étapes</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Checkbox de sélection à droite */}
                  <div className="w-6 h-6 border-2 border-border group-hover:border-accent transition-colors duration-200 flex-shrink-0" />
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