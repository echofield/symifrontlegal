import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

import { BOND_PRICING, DOCUMENTS_PRICING, DocumentPricing } from '@/config/pricing';

interface PricingViewProps {
  onNavigate: (view: 'contracts' | 'login' | 'contact' | 'bond') => void;
}

const CATEGORY_DEFINITIONS = [
  { key: 'emploi', title: '📄 Contrats de travail' },
  { key: 'confidentialite', title: '📄 Confidentialité' },
  { key: 'creation', title: '📄 Création entreprise' },
  { key: 'rh', title: '📄 Ressources Humaines' },
  { key: 'commercial', title: '📄 Documents commerciaux' },
  { key: 'immobilier', title: '📄 Immobilier' },
] as const;

type CategoryKey = (typeof CATEGORY_DEFINITIONS)[number]['key'];
type DocumentsByCategory = Record<CategoryKey, DocumentPricing[]>;

const formatCurrency = (value: number) =>
  `€${value.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

export function PricingView({ onNavigate }: PricingViewProps) {
  const documentsByCategory = useMemo<DocumentsByCategory>(() => {
    const docs = Object.values(DOCUMENTS_PRICING);
    const initial = {} as DocumentsByCategory;
    CATEGORY_DEFINITIONS.forEach(({ key }) => {
      initial[key] = docs.filter((doc) => doc.category === key);
    });
    return initial;
  }, []);

  const handleExploreDocuments = () => onNavigate('contracts');

  return (
    <div className="min-h-screen py-20 lg:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.section
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'linear' }}
          className="mb-16 text-center"
        >
          <p
            className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-6"
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
          >
            TARIFICATION / SYMIONE
          </p>
          <h1
            className="text-[2rem] md:text-[3rem] tracking-[-0.03em] mb-4"
            style={{ fontWeight: 600, lineHeight: 1.1 }}
          >
            Tarifs
          </h1>
          <p className="text-[1rem] text-muted-foreground">
            Payez uniquement ce dont vous avez besoin
          </p>
        </motion.section>

        <section className="mb-20">
          <h2
            className="text-[1.5rem] tracking-[-0.01em] mb-8"
            style={{ fontWeight: 600 }}
          >
            Documents juridiques
          </h2>

          {CATEGORY_DEFINITIONS.map(({ key, title }) => (
            <CategorySection
              key={key}
              title={title}
              documents={documentsByCategory[key]}
              onExplore={handleExploreDocuments}
            />
          ))}

          <div className="text-center mt-12">
            <button
              onClick={handleExploreDocuments}
              className="inline-flex items-center gap-2 border border-border px-6 py-3 text-[0.75rem] uppercase tracking-[0.12em] transition-all duration-200 hover:border-foreground hover:bg-accent/5"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
            >
              Voir tous les modèles →
            </button>
          </div>
        </section>

        <section className="mb-20">
          <BondPricingCard
            onNavigate={() => onNavigate('bond')}
          />
        </section>

        <section className="mb-20">
          <div className="p-8 bg-foreground text-background border border-border">
            <h2 className="text-[1.75rem] mb-3 tracking-[-0.01em]" style={{ fontWeight: 600 }}>
              Solutions Entreprise
            </h2>
            <p className="text-[0.875rem] text-background/70 mb-6" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
              Pour grandes organisations (20+ employés)
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {[
                'Documents illimités',
                'API Access (ERP/CRM)',
                'White-label complet',
                'Support dédié',
                'Multi-juridictions',
                'SLA 99.9%',
              ].map((feature) => (
                <FeatureItem key={feature} text={feature} />
              ))}
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-[1.125rem] font-medium mb-1">Prix sur consultation</p>
                <p className="text-[0.8125rem] text-background/70">En moyenne €2000-5000/mois</p>
              </div>
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 bg-background text-foreground px-6 py-3 text-[0.75rem] uppercase tracking-[0.12em] transition-all duration-200 hover:bg-accent/10"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
              >
                Discuter de vos besoins →
              </button>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="text-center border border-border px-8 py-10 bg-accent/5">
            <p className="text-[0.9375rem] mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
              Questions ? Notre conseiller juridique est gratuit
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 text-[0.75rem] uppercase tracking-[0.12em] transition-all duration-200 hover:shadow-[0_0_20px_var(--accent-glow)]"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
            >
              Poser une question →
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

type CategorySectionProps = {
  title: string;
  documents: DocumentPricing[];
  onExplore: () => void;
};

function CategorySection({ title, documents, onExplore }: CategorySectionProps) {
  if (!documents?.length) return null;

  return (
    <div className="mb-12">
      <h3 className="text-[0.875rem] font-medium mb-4 text-muted-foreground uppercase tracking-[0.08em]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
        {title}
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <button
            key={doc.id}
            type="button"
            onClick={onExplore}
            className="group flex items-center justify-between gap-6 border border-border bg-card px-6 py-5 text-left transition-all duration-200 hover:border-accent/50 hover:bg-accent/5"
          >
            <div>
              <p className="text-[0.9375rem] tracking-[-0.01em]" style={{ fontWeight: 500 }}>
                {doc.name}
              </p>
              {doc.description && (
                <p className="text-[0.75rem] text-muted-foreground mt-2 leading-relaxed" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                  {doc.description}
                </p>
              )}
            </div>
            <span className="text-[1.5rem] text-accent" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
              {formatCurrency(doc.price)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

type BondPricingCardProps = {
  onNavigate: () => void;
};

function BondPricingCard({ onNavigate }: BondPricingCardProps) {
  return (
    <div className="border border-accent bg-gradient-to-br from-accent/10 via-accent/5 to-transparent p-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
        <div>
          <div className="inline-block px-3 py-1 bg-accent text-accent-foreground text-[0.6875rem] font-semibold uppercase tracking-[0.14em] mb-3">
            Recommandé
          </div>
          <h2 className="text-[1.75rem] tracking-[-0.01em] mb-2" style={{ fontWeight: 600 }}>
            Bond - Coffre-Fort
          </h2>
          <p className="text-[0.875rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
            Pour missions freelance avec paiements par jalons
          </p>
        </div>
        <div className="text-left lg:text-right">
          <div className="text-[2.5rem] font-semibold text-accent" style={{ fontFamily: 'var(--font-mono)' }}>
            {formatCurrency(BOND_PRICING.setupFee)}
          </div>
          <div className="text-[0.8125rem] text-muted-foreground">
            + {BOND_PRICING.commissionPercent}% par jalon
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-[0.875rem] text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
          3 types de contrats disponibles :
        </p>
        <ul className="space-y-2 mb-6">
          {BOND_PRICING.templates.map((template) => (
            <li key={template} className="flex items-center gap-2 text-[0.875rem]">
              <Check className="w-4 h-4 text-green-600" strokeWidth={2} />
              <span>{template}</span>
            </li>
          ))}
        </ul>

        <div className="border border-border bg-background px-4 py-3 mb-6">
          <p className="text-[0.75rem] font-medium mb-1">Exemple de tarif :</p>
          <p className="text-[0.75rem] text-muted-foreground">
            Mission {formatCurrency(BOND_PRICING.example.amount)} sur {BOND_PRICING.example.milestones} jalons = {formatCurrency(BOND_PRICING.setupFee)} + {formatCurrency(BOND_PRICING.example.commissionValue)} commission =
            <span className="font-semibold text-accent"> {formatCurrency(BOND_PRICING.example.total)}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3 mb-6">
          {BOND_PRICING.features.map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-[0.75rem]">
              <Check className="w-4 h-4 text-green-600" strokeWidth={2} />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onNavigate}
        className="w-full bg-accent text-accent-foreground py-3 text-[0.75rem] uppercase tracking-[0.12em] transition-all duration-200 hover:shadow-[0_0_20px_var(--accent-glow)]"
        style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
      >
        Créer un contrat Bond →
      </button>
    </div>
  );
}

type FeatureItemProps = {
  text: string;
};

function FeatureItem({ text }: FeatureItemProps) {
  return (
    <div className="flex items-center gap-2 text-[0.8125rem]">
      <Check className="w-4 h-4 text-green-500" strokeWidth={2} />
      <span>{text}</span>
    </div>
  );
}
