import { motion } from "motion/react";
import { Plus, ChevronRight } from "lucide-react";

interface BondSimpleViewProps {
  onNavigate: (view: string, contractId?: string) => void;
}

export function BondSimpleView({ onNavigate }: BondSimpleViewProps) {
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

        {/* Simple Test Content */}
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
            Module Bond - Test Simple
          </h3>
          <p className="text-[0.875rem] text-muted-foreground mb-8" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
            Cette page fonctionne sans JavaScript complexe
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="px-10 py-4 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 inline-flex items-center gap-3"
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
          >
            <ChevronRight className="w-4 h-4" strokeWidth={2} />
            <span className="text-[0.75rem] uppercase tracking-[0.12em]">Retour à l'accueil</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
