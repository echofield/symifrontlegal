import { motion } from "motion/react";
import { ArrowLeft, Download, CheckCircle2, Clock, AlertCircle, CreditCard } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "./ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { bondFetch } from "./lib/useBondApi";

interface BondContractViewProps {
  contractId: string;
  onBack: () => void;
  onNavigate: (view: string, contractId?: string) => void;
}

type MilestoneStatus = 'upcoming' | 'submitted' | 'validated' | 'paid';

interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  deadline: string;
  status: MilestoneStatus;
  submittedDate?: string;
  validatedDate?: string;
  paidDate?: string;
}

const mockContract = {
  id: '001',
  title: 'Développement application mobile',
  status: 'active' as const,
  totalAmount: 45000,
  parties: {
    client: {
      name: 'Startup Tech SAS',
      email: 'contact@startuptech.fr'
    },
    provider: {
      name: 'Digital Agency Inc.',
      email: 'hello@digitalagency.com'
    }
  },
  createdAt: '2025-09-15',
  milestones: [
    {
      id: 'm1',
      title: 'Phase de conception et wireframes',
      description: 'Design UX/UI complet, wireframes interactifs, validation du parcours utilisateur',
      amount: 12000,
      deadline: '2025-10-13',
      status: 'paid' as MilestoneStatus,
      submittedDate: '2025-10-10',
      validatedDate: '2025-10-11',
      paidDate: '2025-10-12'
    },
    {
      id: 'm2',
      title: 'Développement MVP (Minimum Viable Product)',
      description: 'Développement des fonctionnalités core, intégration API, tests unitaires',
      amount: 28000,
      deadline: '2025-12-22',
      status: 'submitted' as MilestoneStatus,
      submittedDate: '2025-10-16'
    },
    {
      id: 'm3',
      title: 'Tests, déploiement et formation',
      description: 'Tests QA complets, déploiement stores, documentation et formation équipe',
      amount: 5000,
      deadline: '2026-01-12',
      status: 'upcoming' as MilestoneStatus
    }
  ],
  clauses: [
    {
      title: 'Propriété intellectuelle',
      content: 'Tous les droits de propriété intellectuelle relatifs aux livrables seront transférés au client à la finalisation complète du projet et après réception du paiement final.'
    },
    {
      title: 'Garantie et maintenance',
      content: 'Le prestataire garantit une période de maintenance de 6 mois post-livraison, incluant les corrections de bugs et le support technique de premier niveau.'
    },
    {
      title: 'Révisions',
      content: 'Chaque jalon inclut un nombre illimité de révisions tant que le jalon n\'est pas validé. Les modifications de scope nécessitent un avenant contractuel.'
    },
    {
      title: 'Paiement et rétention',
      content: 'Les paiements s\'effectuent par jalon selon le calendrier défini. Une rétention de 10% du montant total sera libérée à la livraison finale et validation du projet.'
    },
    {
      title: 'Confidentialité',
      content: 'Les deux parties s\'engagent à respecter la confidentialité des informations échangées dans le cadre de cette mission, pendant et après la durée du contrat.'
    }
  ]
};

const statusLabels: Record<MilestoneStatus, string> = {
  upcoming: 'À venir',
  submitted: 'Soumis',
  validated: 'Validé',
  paid: 'Payé'
};

const statusColors: Record<MilestoneStatus, string> = {
  upcoming: 'bg-muted text-muted-foreground',
  submitted: 'bg-accent/10 text-accent border-accent/20',
  validated: 'bg-secondary text-secondary-foreground',
  paid: 'bg-accent/20 text-accent border-accent/30'
};

const statusIcons: Record<MilestoneStatus, React.ReactNode> = {
  upcoming: <Clock className="w-4 h-4" />,
  submitted: <AlertCircle className="w-4 h-4" />,
  validated: <CheckCircle2 className="w-4 h-4" />,
  paid: <CheckCircle2 className="w-4 h-4" />
};

export function BondContractView({ contractId, onBack, onNavigate }: BondContractViewProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [contract, setContract] = useState<any>(null);
  const milestones: Milestone[] = useMemo(() => {
    if (!contract) return [];
    return (contract.milestones || []).map((m: any) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      amount: m.amount / 100 ?? m.amount,
      deadline: m.dueAt ? new Date(m.dueAt).toLocaleDateString('fr-FR') : '',
      status: (m.status === 'PAID' ? 'paid' : m.status === 'SUBMITTED' ? 'submitted' : 'upcoming') as MilestoneStatus,
    }));
  }, [contract]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await bondFetch<{ ok: boolean; contract: any }>(`/api/escrow/contracts/${contractId}`);
        if (!mounted) return;
        setContract(data?.contract);
        setNotFound(!data?.contract);
      } catch (e) {
        setNotFound(true);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [contractId]);

  const paidAmount = milestones
    .filter(m => m.status === 'paid')
    .reduce((sum, m) => sum + m.amount, 0);

  const totalAmount = (contract?.totalAmount ?? mockContract.totalAmount) / 100 ?? contract?.totalAmount ?? mockContract.totalAmount;
  const progressPercentage = totalAmount ? (paidAmount / totalAmount) * 100 : 0;

  const handleSubmitMilestone = (milestoneId: string) => {
    console.log('Submit milestone:', milestoneId);
  };

  const handleValidateMilestone = (milestoneId: string) => {
    console.log('Validate milestone:', milestoneId);
  };

  const handlePayMilestone = (milestoneId: string) => {
    onNavigate('bond-payment', milestoneId);
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
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
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                  CONTRAT #{contract?.id || contractId}
                </p>
                <h1 className="text-[2rem] md:text-[3rem] tracking-[-0.03em] mb-4" style={{ fontWeight: 600, lineHeight: 1.1 }}>
                  {contract?.title || mockContract.title}
                </h1>
                <div className="flex items-center gap-3">
                  <Badge className="bg-accent/10 text-accent border-accent/20 border text-[0.625rem] uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                    {(contract?.status || 'ACTIVE') === 'COMPLETED' ? 'Terminé' : 'En cours'}
                  </Badge>
                  <span className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                    {contract?.createdAt ? `Créé le ${new Date(contract.createdAt).toLocaleDateString('fr-FR')}` : ''}
                  </span>
                </div>
              </div>

              <button
                className="px-10 py-4 border border-border hover:border-foreground transition-all duration-200 inline-flex items-center gap-3"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
              >
                <Download className="w-4 h-4" strokeWidth={2} />
                <span className="text-[0.75rem] uppercase tracking-[0.12em]">Télécharger PDF</span>
              </button>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="border-l-2 border-border pl-4">
                <div className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                  Client
                </div>
                <div className="text-[1rem] mb-1" style={{ fontWeight: 600 }}>
                  {mockContract.parties.client.name}
                </div>
                <div className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                  {mockContract.parties.client.email}
                </div>
              </div>
              <div className="border-l-2 border-border pl-4">
                <div className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                  Prestataire
                </div>
                <div className="text-[1rem] mb-1" style={{ fontWeight: 600 }}>
                  {mockContract.parties.provider.name}
                </div>
                <div className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                  {mockContract.parties.provider.email}
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                  Progression financière
                </span>
                <div className="text-right">
                  <span className="text-[1rem]" style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    {paidAmount.toLocaleString('fr-FR')} €
                  </span>
                  <span className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                    {' / '}{totalAmount.toLocaleString('fr-FR')} €
                  </span>
                </div>
              </div>
              <div className="h-2 bg-muted overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="text-[0.75rem] text-muted-foreground mt-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                {progressPercentage.toFixed(0)}% complété
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Milestones */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: 'linear' }}
            >
              <h2 className="text-[0.75rem] uppercase tracking-[0.1em] mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                <div className="w-1 h-1 rounded-full bg-accent" />
                Jalons ({milestones.length})
              </h2>

              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="border border-border p-6">
                    <div className="flex flex-col gap-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                              Jalon {index + 1}
                            </span>
                            <Badge className={`${statusColors[milestone.status]} border inline-flex items-center gap-1.5 text-[0.625rem] uppercase tracking-[0.1em]`} style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                              {statusIcons[milestone.status]}
                              {statusLabels[milestone.status]}
                            </Badge>
                          </div>
                          <h3 className="text-[1.125rem] mb-2" style={{ fontWeight: 600 }}>
                            {milestone.title}
                          </h3>
                          <p className="text-[0.875rem] text-muted-foreground mb-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                            {milestone.description}
                          </p>
                          <div className="flex items-center gap-4 text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                            <span>Échéance: {milestone.deadline}</span>
                            {milestone.submittedDate && (
                              <>
                                <span>•</span>
                                <span>Soumis: {milestone.submittedDate}</span>
                              </>
                            )}
                            {milestone.paidDate && (
                              <>
                                <span>•</span>
                                <span>Payé: {milestone.paidDate}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[1.25rem] tracking-[-0.02em]" style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                            {milestone.amount.toLocaleString('fr-FR')} €
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-3 border-t border-border">
                        {milestone.status === 'upcoming' && (
                          <button
                            onClick={() => handleSubmitMilestone(milestone.id)}
                            className="px-6 py-2.5 border border-border hover:border-foreground transition-all duration-200 text-[0.75rem] uppercase tracking-[0.1em]"
                            style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                          >
                            Soumettre
                          </button>
                        )}
                        {milestone.status === 'submitted' && (
                          <button
                            onClick={() => handleValidateMilestone(milestone.id)}
                            className="px-6 py-2.5 bg-accent text-accent-foreground hover:shadow-[0_0_15px_var(--accent-glow)] transition-all duration-200 text-[0.75rem] uppercase tracking-[0.1em]"
                            style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
                          >
                            Valider
                          </button>
                        )}
                        {milestone.status === 'validated' && (
                          <button
                            onClick={() => handlePayMilestone(milestone.id)}
                            className="px-6 py-2.5 bg-accent text-accent-foreground hover:shadow-[0_0_15px_var(--accent-glow)] transition-all duration-200 inline-flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.1em]"
                            style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
                          >
                            <CreditCard className="w-3.5 h-3.5" strokeWidth={2} />
                            Payer
                          </button>
                        )}
                        {milestone.status === 'paid' && (
                          <div className="px-6 py-2.5 bg-accent/10 text-accent inline-flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                            Payé
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Clauses */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2, ease: 'linear' }}
            >
              <h2 className="text-[0.75rem] uppercase tracking-[0.1em] mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                <div className="w-1 h-1 rounded-full bg-accent" />
                Clauses contractuelles
              </h2>

              <Accordion type="single" collapsible className="border border-border">
                {(Array.isArray(contract?.termsJson?.terms) ? contract.termsJson.terms : []).map((clause: string, index: number) => (
                  <AccordionItem key={index} value={`clause-${index}`} className="border-b border-border last:border-0">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline text-[0.875rem]" style={{ fontWeight: 600 }}>
                      Clause {index + 1}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-[0.875rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                      {clause}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15, ease: 'linear' }}
              className="border border-border p-6"
            >
              <h3 className="text-[0.75rem] uppercase tracking-[0.1em] mb-6" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                Récapitulatif
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-start pb-3 border-b border-border">
                  <span className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                    Montant total
                  </span>
                  <span className="text-[1.125rem]" style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    {mockContract.totalAmount.toLocaleString('fr-FR')} €
                  </span>
                </div>
                <div className="flex justify-between items-start pb-3 border-b border-border">
                  <span className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                    Payé
                  </span>
                  <span className="text-[1.125rem] text-accent" style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    {paidAmount.toLocaleString('fr-FR')} €
                  </span>
                </div>
                <div className="flex justify-between items-start pb-3 border-b border-border">
                  <span className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                    Restant
                  </span>
                  <span className="text-[1.125rem]" style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    {(mockContract.totalAmount - paidAmount).toLocaleString('fr-FR')} €
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                    Nombre de jalons
                  </span>
                  <span className="text-[1.125rem]" style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    {milestones.length}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Status Summary */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2, ease: 'linear' }}
              className="border border-border p-6"
            >
              <h3 className="text-[0.75rem] uppercase tracking-[0.1em] mb-6" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                État des jalons
              </h3>
              <div className="space-y-3">
                {Object.entries(statusLabels).map(([status, label]) => {
                  const count = milestones.filter(m => m.status === status).length;
                  return (
                    <div key={status} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-[0.75rem]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                          {label}
                        </span>
                      </div>
                      <span className="text-[0.875rem]" style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
