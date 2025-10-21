import { motion } from "motion/react";
import { ArrowLeft, AlertTriangle, CheckCircle2, Clock, CreditCard } from "lucide-react";
import { Badge } from "./ui/badge";

interface BondSettingsViewProps {
  onBack: () => void;
}

type ActionType = 'contract_created' | 'milestone_submitted' | 'milestone_validated' | 'payment_sent' | 'payment_received' | 'dispute_opened';

interface Action {
  id: string;
  type: ActionType;
  title: string;
  description: string;
  amount?: number;
  date: string;
  contractId: string;
  contractTitle: string;
}

const mockActions: Action[] = [
  {
    id: 'a1',
    type: 'payment_received',
    title: 'Paiement reçu',
    description: 'Jalon 1 - Phase de conception et wireframes',
    amount: 12000,
    date: '2025-10-12',
    contractId: '001',
    contractTitle: 'Développement application mobile'
  },
  {
    id: 'a2',
    type: 'milestone_submitted',
    title: 'Jalon soumis',
    description: 'Jalon 2 - Développement MVP',
    date: '2025-10-16',
    contractId: '001',
    contractTitle: 'Développement application mobile'
  },
  {
    id: 'a3',
    type: 'milestone_validated',
    title: 'Jalon validé',
    description: 'Jalon 1 - Phase de conception et wireframes',
    date: '2025-10-11',
    contractId: '001',
    contractTitle: 'Développement application mobile'
  },
  {
    id: 'a4',
    type: 'contract_created',
    title: 'Contrat créé',
    description: 'Nouveau contrat Bond initié',
    amount: 45000,
    date: '2025-09-15',
    contractId: '001',
    contractTitle: 'Développement application mobile'
  },
  {
    id: 'a5',
    type: 'payment_sent',
    title: 'Paiement envoyé',
    description: 'Jalon 1 - Conception identité visuelle',
    amount: 4000,
    date: '2025-10-05',
    contractId: '002',
    contractTitle: 'Conception identité visuelle'
  }
];

const mockDispute = {
  contractId: '002',
  contractTitle: 'Conception identité visuelle',
  milestoneTitle: 'Jalon 2 - Révisions finales',
  openedDate: '2025-10-14',
  status: 'in_review' as const,
  reason: 'Désaccord sur le nombre de révisions effectuées',
  description: 'Le client estime que les révisions demandées n\'ont pas été entièrement appliquées selon les spécifications du brief initial. Le prestataire maintient que toutes les révisions dans le scope ont été complétées.',
  amount: 8000
};

const actionIcons: Record<ActionType, React.ReactNode> = {
  contract_created: <CheckCircle2 className="w-4 h-4" />,
  milestone_submitted: <Clock className="w-4 h-4" />,
  milestone_validated: <CheckCircle2 className="w-4 h-4" />,
  payment_sent: <CreditCard className="w-4 h-4" />,
  payment_received: <CreditCard className="w-4 h-4" />,
  dispute_opened: <AlertTriangle className="w-4 h-4" />
};

const actionColors: Record<ActionType, string> = {
  contract_created: 'text-accent',
  milestone_submitted: 'text-muted-foreground',
  milestone_validated: 'text-accent',
  payment_sent: 'text-accent',
  payment_received: 'text-accent',
  dispute_opened: 'text-destructive'
};

export function BondSettingsView({ onBack }: BondSettingsViewProps) {
  const hasDispute = true; // mockDispute exists

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'linear' }}
          className="mb-12"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" strokeWidth={1.5} />
            <span className="text-[0.625rem] uppercase tracking-[0.12em]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
              Retour au tableau de bord
            </span>
          </button>

          <div className="pb-6 border-b border-border">
            <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
              SYMI BOND / HISTORIQUE & ARBITRAGE
            </p>
            <h1 className="text-[2rem] md:text-[3rem] tracking-[-0.03em]" style={{ fontWeight: 600, lineHeight: 1.1 }}>
              Paramètres et activité
            </h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Dispute Section */}
            {hasDispute && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1, ease: 'linear' }}
              >
                <h2 className="text-[0.75rem] uppercase tracking-[0.1em] mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                  <div className="w-1 h-1 rounded-full bg-destructive" />
                  Litige en cours
                </h2>

                <div className="border-2 border-destructive/30 bg-destructive/5 p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-destructive" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[1.125rem]" style={{ fontWeight: 600 }}>
                          {mockDispute.contractTitle}
                        </h3>
                        <Badge className="bg-destructive/10 text-destructive border-destructive/20 border text-[0.625rem] uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                          En révision
                        </Badge>
                      </div>
                      <p className="text-[0.75rem] text-muted-foreground mb-1" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                        Contrat #{mockDispute.contractId} • Ouvert le {mockDispute.openedDate}
                      </p>
                      <p className="text-[0.875rem] mb-1" style={{ fontWeight: 600 }}>
                        {mockDispute.milestoneTitle}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-[0.75rem] uppercase tracking-[0.1em] mb-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                        Motif
                      </div>
                      <p className="text-[0.875rem]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                        {mockDispute.reason}
                      </p>
                    </div>
                    <div>
                      <div className="text-[0.75rem] uppercase tracking-[0.1em] mb-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                        Détails
                      </div>
                      <p className="text-[0.875rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                        {mockDispute.description}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-destructive/20">
                      <div className="flex justify-between items-center">
                        <span className="text-[0.75rem] uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                          Montant concerné
                        </span>
                        <span className="text-[1.25rem] tracking-[-0.02em]" style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                          {mockDispute.amount.toLocaleString('fr-FR')} €
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background/50 border border-destructive/20 p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <h4 className="text-[0.875rem] mb-2" style={{ fontWeight: 600 }}>
                          Processus d'arbitrage Symi Bond
                        </h4>
                        <p className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                          Notre équipe d'arbitrage étudie actuellement ce litige. Les deux parties recevront une décision sous 5-7 jours ouvrés. Les fonds restent en sécurité jusqu'à résolution.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="px-8 py-3 border border-border hover:border-foreground transition-all duration-200 text-[0.75rem] uppercase tracking-[0.1em]"
                      style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                    >
                      Voir détails
                    </button>
                    <button
                      className="px-8 py-3 bg-accent text-accent-foreground hover:shadow-[0_0_15px_var(--accent-glow)] transition-all duration-200 text-[0.75rem] uppercase tracking-[0.1em]"
                      style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
                    >
                      Contacter arbitrage
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Activity History */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: hasDispute ? 0.15 : 0.1, ease: 'linear' }}
            >
              <h2 className="text-[0.75rem] uppercase tracking-[0.1em] mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                <div className="w-1 h-1 rounded-full bg-accent" />
                Historique des actions
              </h2>

              <div className="space-y-3">
                {mockActions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: (hasDispute ? 0.2 : 0.15) + (index * 0.05), ease: 'linear' }}
                    className="border border-border p-5 hover:border-accent/50 transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`mt-0.5 ${actionColors[action.type]}`}>
                        {actionIcons[action.type]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="text-[1rem] mb-1" style={{ fontWeight: 600 }}>
                              {action.title}
                            </h3>
                            <p className="text-[0.875rem] text-muted-foreground mb-1" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                              {action.description}
                            </p>
                            <div className="flex items-center gap-3 text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                              <span>{action.contractTitle}</span>
                              <span>•</span>
                              <span>#{action.contractId}</span>
                            </div>
                          </div>
                          {action.amount && (
                            <div className="text-right">
                              <div className="text-[1.125rem] tracking-[-0.02em]" style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                                {action.amount.toLocaleString('fr-FR')} €
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                          {action.date}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2, ease: 'linear' }}
              className="border border-border p-8"
            >
              <h3 className="text-[0.75rem] uppercase tracking-[0.1em] mb-8 pb-4 border-b border-border" 
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                Statistiques
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-baseline pb-4 border-b border-border">
                  <span className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground" 
                        style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                    Contrats actifs
                  </span>
                  <span className="text-[2rem] tracking-[-0.02em]" 
                        style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    3
                  </span>
                </div>
                <div className="flex justify-between items-baseline pb-4 border-b border-border">
                  <span className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground" 
                        style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                    Total traité
                  </span>
                  <span className="text-[1.5rem] tracking-[-0.02em]" 
                        style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    85 000 €
                  </span>
                </div>
                <div className="flex justify-between items-baseline pb-4 border-b border-border">
                  <span className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground" 
                        style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                    Jalons complétés
                  </span>
                  <span className="text-[1.5rem] tracking-[-0.02em]" 
                        style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    12
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground" 
                        style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                    Litiges résolus
                  </span>
                  <span className="text-[1.5rem] tracking-[-0.02em]" 
                        style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    1
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25, ease: 'linear' }}
              className="border border-border p-8"
            >
              <h3 className="text-[0.75rem] uppercase tracking-[0.1em] mb-8 pb-4 border-b border-border" 
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                Actions rapides
              </h3>
              <div className="space-y-4">
                <button className="w-full px-8 py-3 border border-border hover:border-foreground transition-all duration-200 text-left"
                        style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                  <span className="text-[0.75rem] uppercase tracking-[0.12em]">Exporter l'historique</span>
                </button>
                <button className="w-full px-8 py-3 border border-border hover:border-foreground transition-all duration-200 text-left"
                        style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                  <span className="text-[0.75rem] uppercase tracking-[0.12em]">Notifications</span>
                </button>
                <button className="w-full px-8 py-3 border border-border hover:border-foreground transition-all duration-200 text-left"
                        style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                  <span className="text-[0.75rem] uppercase tracking-[0.12em]">Paramètres de compte</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
