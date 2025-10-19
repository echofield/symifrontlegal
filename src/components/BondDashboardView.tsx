import { motion } from "motion/react";
import { Plus, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { bondFetch } from "./lib/useBondApi";

interface BondContract {
  id: string;
  title: string;
  totalAmount: number;
  status: 'draft' | 'active' | 'completed' | 'disputed';
  parties: {
    client: string;
    provider: string;
  };
  createdAt: string;
  progress: number;
}

interface BondDashboardViewProps {
  onNavigate: (view: string, contractId?: string) => void;
}

// Temporary fallback while no listing API exists
const mockContracts: BondContract[] = [];

const statusLabels: Record<BondContract['status'], string> = {
  draft: 'Brouillon',
  active: 'En cours',
  completed: 'Terminé',
  disputed: 'Litige'
};

const statusColors: Record<BondContract['status'], string> = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-accent/10 text-accent border-accent/20',
  completed: 'bg-secondary text-secondary-foreground',
  disputed: 'bg-destructive/10 text-destructive border-destructive/20'
};

export function BondDashboardView({ onNavigate }: BondDashboardViewProps) {
  const [contracts, setContracts] = useState<BondContract[]>(mockContracts);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await bondFetch<{ ok: boolean; contracts: any[] }>(`/api/escrow/contracts`);
        if (!mounted) return;
        const mapped = (data?.contracts || []).map((c) => ({
          id: c.id,
          title: c.title,
          totalAmount: c.totalAmount / 100 ?? c.totalAmount,
          status: String(c.status || 'active').toLowerCase() as BondContract['status'],
          parties: { client: '', provider: '' },
          createdAt: new Date(c.createdAt).toLocaleDateString('fr-FR'),
          progress: c.milestonesCount ? Math.round((c.paidCount / c.milestonesCount) * 100) : 0,
        })) as BondContract[];
        setContracts(mapped);
        setError(null);
      } catch (e: any) {
        console.error('Dashboard fetch error', e?.message || e);
        setError('Impossible de charger les contrats');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

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

        {/* Loader */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[0.875rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>Chargement…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-12">
            <p className="text-[0.875rem] text-destructive" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>{error}</p>
          </div>
        )}

        {/* Contracts Grid */}
        <div className="grid gap-4">
          {contracts.map((contract, index) => (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05, ease: 'linear' }}
            >
              <button
                onClick={() => onNavigate('bond-contract', contract.id)}
                className="w-full border border-border hover:border-foreground transition-all duration-200 p-6 text-left group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-[1.125rem] tracking-[-0.01em]" style={{ fontWeight: 600 }}>
                            {contract.title}
                          </h3>
                          <Badge className={`${statusColors[contract.status]} border text-[0.625rem] uppercase tracking-[0.1em]`} style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                            {statusLabels[contract.status]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                          <span>ID: {contract.id}</span>
                          <span>•</span>
                          <span>{contract.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Parties */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="text-[0.75rem]" style={{ fontFamily: 'var(--font-mono)' }}>
                        <span className="text-muted-foreground uppercase tracking-[0.1em] block mb-1" style={{ fontWeight: 400 }}>Client</span>
                        <span style={{ fontWeight: 400 }}>{contract.parties.client}</span>
                      </div>
                      <div className="text-[0.75rem]" style={{ fontFamily: 'var(--font-mono)' }}>
                        <span className="text-muted-foreground uppercase tracking-[0.1em] block mb-1" style={{ fontWeight: 400 }}>Prestataire</span>
                        <span style={{ fontWeight: 400 }}>{contract.parties.provider}</span>
                      </div>
                    </div>

                    {/* Progress */}
                    {contract.status === 'active' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                            Progression
                          </span>
                          <span className="text-[0.75rem]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                            {contract.progress}%
                          </span>
                        </div>
                        <div className="h-1 bg-muted overflow-hidden">
                          <div 
                            className="h-full bg-accent transition-all duration-500"
                            style={{ width: `${contract.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Amount + Action */}
                  <div className="flex items-center gap-6 lg:flex-col lg:items-end lg:gap-4">
                    <div className="text-right">
                      <div className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground mb-1" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                        Montant total
                      </div>
                      <div className="text-[1.5rem] tracking-[-0.02em]" style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                        {contract.totalAmount.toLocaleString('fr-FR')} €
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.1em] text-accent group-hover:gap-3 transition-all duration-200" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                      Ouvrir
                      <ChevronRight className="w-4 h-4" strokeWidth={2} />
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && !error && contracts.length === 0 && (
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
