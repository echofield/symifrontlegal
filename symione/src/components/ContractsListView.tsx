import { motion } from "motion/react";
import { ArrowLeft, Search, Loader2, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { LexClient } from "../lib/lexClient";
import { showToast } from "./SystemToast";
import type { ContractIndexEntry } from "../types/contracts";

interface ContractsListViewProps {
  onBack: () => void;
  onSelectTemplate: (templateId: string, jurisdiction: string) => void;
  plan?: 'free' | 'pro' | 'cabinet' | 'entreprise';
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

export function ContractsListView({ onBack, onSelectTemplate, plan = 'free' }: ContractsListViewProps) {
  const [contracts, setContracts] = useState<ContractIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [jurisdiction, setJurisdiction] = useState<string>((import.meta as any).env?.VITE_JURISDICTION || 'FR');
  const [searchAnalysis, setSearchAnalysis] = useState<{ interpretation: string; matchingTemplates: { id: string; name: string; description?: string; available: boolean; matchScore: number }[] } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    async function loadContracts() {
      try {
        const { index } = await LexClient.listContracts(jurisdiction);
        if (!Array.isArray(index) || index.length === 0) {
          // Fallback: seed with minimal free + premium placeholders
          const fallback: ContractIndexEntry[] = [
            { id: 'contrat-de-travail-dur-e-ind-termin-e-cdi', title: 'Contrat de travail CDI', category: 'employment', path: '/contracts/employment/contrat-de-travail-dur-e-ind-termin-e-cdi.json' },
            { id: 'freelance-services-agreement', title: 'Contrat de prestation freelance', category: 'business', path: '/contracts/business/freelance-services-agreement.json' },
            { id: 'one-way-non-disclosure-agreement', title: 'Accord de confidentialité (NDA)', category: 'business', path: '/contracts/business/one-way-non-disclosure-agreement.json' },
            { id: 'bail-d-habitation-non-meubl', title: "Bail d'habitation non meublé", category: 'property', path: '/contracts/property/bail-d-habitation-non-meubl.json' },
            { id: 'convention-de-rupture-conventionnelle', title: 'Rupture conventionnelle', category: 'employment', path: '/contracts/employment/convention-de-rupture-conventionnelle.json' },
            { id: 'terms-of-service', title: 'Conditions générales (CGU/CGV)', category: 'business', path: '/contracts/business/terms-of-service.json' },
            { id: 'promesse-synallagmatique-de-vente-immobili-re', title: 'Promesse de vente immobilière', category: 'property', path: '/contracts/property/promesse-synallagmatique-de-vente-immobili-re.json' },
            { id: 'partnership-agreement', title: "Pacte d'associés (Partnership)", category: 'business', path: '/contracts/business/partnership-agreement.json' },
            { id: 'contrat-de-prestation-de-services', title: 'Contrat de prestation de services', category: 'business', path: '/contracts/business/contrat-de-prestation-de-services.json' },
            { id: 'reconnaissance-de-dette', title: 'Reconnaissance de dette', category: 'personal', path: '/contracts/personal/reconnaissance-de-dette.json' },
            // Premium placeholders
            { id: 'contrat-de-travail-dur-e-d-termin-e-cdd', title: 'Contrat CDD', category: 'employment', path: '/contracts/employment/contrat-de-travail-dur-e-d-termin-e-cdd.json' },
            { id: 'convention-de-stage', title: 'Convention de stage', category: 'employment', path: '/contracts/employment/convention-de-stage.json' },
          ];
          setContracts(fallback);
        } else {
          setContracts(index);
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to load templates', 'error');
        const fallback: ContractIndexEntry[] = [
          { id: 'contrat-de-travail-dur-e-ind-termin-e-cdi', title: 'Contrat de travail CDI', category: 'employment', path: '/contracts/employment/contrat-de-travail-dur-e-ind-termin-e-cdi.json' },
          { id: 'freelance-services-agreement', title: 'Contrat de prestation freelance', category: 'business', path: '/contracts/business/freelance-services-agreement.json' },
          { id: 'one-way-non-disclosure-agreement', title: 'Accord de confidentialité (NDA)', category: 'business', path: '/contracts/business/one-way-non-disclosure-agreement.json' },
          { id: 'bail-d-habitation-non-meubl', title: "Bail d'habitation non meublé", category: 'property', path: '/contracts/property/bail-d-habitation-non-meubl.json' },
          { id: 'convention-de-rupture-conventionnelle', title: 'Rupture conventionnelle', category: 'employment', path: '/contracts/employment/convention-de-rupture-conventionnelle.json' },
          { id: 'terms-of-service', title: 'Conditions générales (CGU/CGV)', category: 'business', path: '/contracts/business/terms-of-service.json' },
          { id: 'promesse-synallagmatique-de-vente-immobili-re', title: 'Promesse de vente immobilière', category: 'property', path: '/contracts/property/promesse-synallagmatique-de-vente-immobili-re.json' },
          { id: 'partnership-agreement', title: "Pacte d'associés (Partnership)", category: 'business', path: '/contracts/business/partnership-agreement.json' },
          { id: 'contrat-de-prestation-de-services', title: 'Contrat de prestation de services', category: 'business', path: '/contracts/business/contrat-de-prestation-de-services.json' },
          { id: 'reconnaissance-de-dette', title: 'Reconnaissance de dette', category: 'personal', path: '/contracts/personal/reconnaissance-de-dette.json' },
          { id: 'contrat-de-travail-dur-e-d-termin-e-cdd', title: 'Contrat CDD', category: 'employment', path: '/contracts/employment/contrat-de-travail-dur-e-d-termin-e-cdd.json' },
          { id: 'convention-de-stage', title: 'Convention de stage', category: 'employment', path: '/contracts/employment/convention-de-stage.json' },
        ];
        setContracts(fallback);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    loadContracts();
  }, [jurisdiction]);

  console.log('🔍 Filter debug:', {
    array: contracts,
    arrayType: typeof contracts,
    isArray: Array.isArray(contracts),
    location: 'ContractsListView filteredContracts'
  });
  const filteredContracts = (contracts || []).filter((contract) => {
    const query = searchQuery.toLowerCase();
    return (
      contract.title.toLowerCase().includes(query) ||
      contract.category.toLowerCase().includes(query) ||
      contract.id.toLowerCase().includes(query)
    );
  });

  // Mini-audit search analyze
  async function analyzeSearch(q: string) {
    if (!q || q.length < 16) { setSearchAnalysis(null); return; }
    setAnalyzing(true);
    try {
      const res = await fetch('/api/templates/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q }) });
      if (res.ok) {
        const data = await res.json();
        setSearchAnalysis(data);
      }
    } finally {
      setAnalyzing(false);
    }
  }

  const FREE_TEMPLATE_IDS = new Set<string>([
    'contrat-de-travail-dur-e-ind-termin-e-cdi',
    'freelance-services-agreement',
    'one-way-non-disclosure-agreement',
    'bail-d-habitation-non-meubl',
    'convention-de-rupture-conventionnelle',
    'terms-of-service',
    'promesse-synallagmatique-de-vente-immobili-re',
    'partnership-agreement',
    'contrat-de-prestation-de-services',
    'reconnaissance-de-dette',
  ]);

  const isLocked = (id: string) => plan === 'free' && !FREE_TEMPLATE_IDS.has(id);
  const [showLockModal, setShowLockModal] = useState(false);
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
            <div className="flex items-center gap-3">
              <div className="relative lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="🔍 Rechercher un contrat (ex: bail, CDI, NDA...)"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); analyzeSearch(e.target.value); }}
                className="w-full pl-10 pr-4 py-3 bg-input-background border border-border focus-precision transition-all duration-200 text-[0.875rem]"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
              />
              </div>
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="px-3 py-2 bg-input-background border border-border text-[0.75rem] uppercase tracking-[0.12em]"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
              >
                <option value="FR">FR</option>
                <option value="EN">EN</option>
              </select>
            </div>
          </div>

          {/* System status + Mini-audit */}
          <div className="mt-4 flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-system-standby animate-pulse' : 'bg-accent'}`} />
            <span className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
              {loading ? 'Loading templates...' : `${filteredContracts.length} templates available`}
            </span>
          </div>
          {searchQuery.length > 15 && (
            <div className="mt-4 border border-border p-4">
              {analyzing && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                  <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '120ms' }} />
                  <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '240ms' }} />
                </div>
              )}
              {searchAnalysis && (
                <>
                  <div className="text-[0.875rem] mb-3">
                    <h4 className="text-[0.95rem] mb-1" style={{ fontWeight: 600 }}>💡 Analyse de votre besoin</h4>
                    <p className="text-muted-foreground">{searchAnalysis.interpretation}</p>
                  </div>
                  {searchAnalysis.matchingTemplates.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="text-[0.95rem]" style={{ fontWeight: 600 }}>📄 Templates correspondants</h4>
                      {searchAnalysis.matchingTemplates.map((t) => (
                        <button key={t.id} onClick={() => onSelectTemplate(t.id, jurisdiction)} className="w-full text-left border border-border p-3 hover:border-foreground">
                          <div className="flex items-center justify-between">
                            <div className="text-[1rem]" style={{ fontWeight: 600 }}>{t.name}</div>
                            <span className={`text-[0.75rem] ${t.available ? 'text-green-700' : 'text-amber-700'}`}>{t.available ? '✓ Disponible' : '🔒 Plan Pro'}</span>
                          </div>
                          {t.description && <p className="text-[0.8125rem] text-muted-foreground">{t.description}</p>}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <p className="text-[0.875rem] text-muted-foreground">Aucun template exact — ce cas peut nécessiter un avocat.</p>
                      <button onClick={() => { window.location.href = '#conseiller'; }} className="mt-2 px-4 py-2 border border-border">Consulter le Conseiller Juridique →</button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </motion.div>

        {/* Template data grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-accent" strokeWidth={1.5} />
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[0.875rem] text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
              Aucun template ne correspond à votre recherche
            </p>
            <button
              onClick={() => { window.location.href = '#conseiller'; }}
              className="px-6 py-3 border border-border text-[0.75rem] uppercase tracking-[0.12em]"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
            >
              💬 Décrire mon besoin au Conseiller Juridique
            </button>
          </div>
        ) : (
          <div className="space-y-px bg-border">
            {filteredContracts.map((contract, index) => {
              const locked = isLocked(contract.id);
              return (
              <motion.button
                key={contract.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04, ease: 'linear' }}
                onClick={() => { if (!locked) onSelectTemplate(contract.id, jurisdiction); else setShowLockModal(true); }}
                className={`group bg-card p-6 lg:p-8 text-left transition-all duration-200 relative w-full border-l-2 ${locked ? 'opacity-70 cursor-not-allowed' : 'hover:bg-accent/5 hover:border-l-accent border-transparent'}`}
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
                {/* Indicator */}
                {locked ? (
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[0.6875rem]">
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                    <span className="text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>Plan Pro requis</span>
                  </div>
                ) : (
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="stroke-accent">
                      <path d="M2 6H10M10 6L7 3M10 6L7 9" strokeWidth="1" strokeLinecap="square" />
                    </svg>
                  </div>
                )}
              </motion.button>
            );})}
          </div>
        )}

        {/* Lock modal */}
        {showLockModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card border border-border p-6 w-full max-w-md">
              <h3 className="text-[1.125rem] mb-2" style={{ fontWeight: 600 }}>Template Premium</h3>
              <p className="text-[0. NineTwoFiverem] text-muted-foreground" style={{ lineHeight: 1.6 }}>
                Ce template est disponible dans le Plan Pro (149€/mois) qui inclut 50+ templates et 20 contrats/mois.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button onClick={() => setShowLockModal(false)} className="px-4 py-2 border border-border">Annuler</button>
                <button onClick={() => { window.location.href = '/login'; }} className="px-4 py-2 border border-border">Créer un compte gratuit</button>
                <button onClick={() => { window.location.href = '/prix'; }} className="px-4 py-2 bg-accent text-accent-foreground">Passer au Plan Pro</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
