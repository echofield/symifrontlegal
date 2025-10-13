import { motion } from "motion/react";
import { ArrowLeft, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { LexClient } from "../lib/lexClient";
import { showToast } from "./SystemToast";
import type { ContractIndexEntry } from "../types/contracts";

interface ContractsListViewProps {
  onBack: () => void;
  onSelectTemplate: (templateId: string) => void;
}

const categoryLabels: Record<string, string> = {
  business: 'Entreprise',
  employment: 'Emploi',
  property: 'Immobilier',
  freelance: 'Freelance',
  personal: 'Personnel',
  closure: 'Clôture',
  custom: 'Personnalisé',
};

export function ContractsListView({ onBack, onSelectTemplate }: ContractsListViewProps) {
  const [contracts, setContracts] = useState<ContractIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadContracts() {
      try {
        const { index } = await LexClient.listContracts();
        setContracts(index);
      } catch (err: any) {
        showToast(err.message || 'Failed to load templates', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadContracts();
  }, []);

  const filteredContracts = contracts.filter((contract) => {
    const query = searchQuery.toLowerCase();
    return (
      contract.title.toLowerCase().includes(query) ||
      contract.category.toLowerCase().includes(query) ||
      contract.id.toLowerCase().includes(query)
    );
  });
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
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" strokeWidth={1.5} />
            <span className="text-[0.625rem] uppercase tracking-[0.12em]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
              Return to Control Surface
            </span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-6 border-b border-border">
            <div>
              <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                SYNTHESIS MODULE / TEMPLATE LIBRARY
              </p>
              <h1 className="text-[2rem] md:text-[3rem] tracking-[-0.03em]" style={{ fontWeight: 600, lineHeight: 1.1 }}>
                Select template
              </h1>
            </div>

            {/* Search */}
            <div className="relative lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search by name, category, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-input-background border border-border focus-precision transition-all duration-200 text-[0.875rem]"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
              />
            </div>
          </div>

          {/* System status */}
          <div className="mt-4 flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-system-standby animate-pulse' : 'bg-accent'}`} />
            <span className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
              {loading ? 'Loading templates...' : `${filteredContracts.length} templates available`}
            </span>
          </div>
        </motion.div>

        {/* Template data grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-accent" strokeWidth={1.5} />
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[0.875rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
              {searchQuery ? 'No templates match your search' : 'No templates available'}
            </p>
          </div>
        ) : (
          <div className="space-y-px bg-border">
            {filteredContracts.map((contract, index) => (
              <motion.button
                key={contract.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04, ease: 'linear' }}
                onClick={() => onSelectTemplate(contract.id)}
                className="group bg-card p-6 lg:p-8 text-left hover:bg-accent/5 transition-all duration-200 relative w-full border-l-2 border-transparent hover:border-l-accent"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
                  {/* ID */}
                  <div className="lg:col-span-1">
                    <span 
                      className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground"
                      style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                    >
                      {contract.id.toUpperCase()}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="lg:col-span-5">
                    <h3 className="text-[1.125rem] tracking-[-0.01em]" style={{ fontWeight: 600 }}>
                      {contract.title}
                    </h3>
                  </div>

                  {/* Metadata */}
                  <div className="lg:col-span-3">
                    <div className="flex flex-col gap-1">
                      <span 
                        className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground"
                        style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                      >
                        Category
                      </span>
                      <span className="text-[0.75rem]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                        {categoryLabels[contract.category] || contract.category}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    <div className="flex flex-col gap-1">
                      <span 
                        className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground"
                        style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                      >
                        Path
                      </span>
                      <span className="text-[0.625rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                        {contract.path}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selection indicator */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="stroke-accent">
                    <path d="M2 6H10M10 6L7 3M10 6L7 9" strokeWidth="1" strokeLinecap="square" />
                  </svg>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
