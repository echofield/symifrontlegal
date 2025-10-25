import { motion } from 'motion/react';
import { Check, Phone, MessageSquare, Scale } from 'lucide-react';

interface PricingViewProps {
  onNavigate: (view: 'contracts' | 'login' | 'contact') => void;
}

const plans = [
  {
    id: 'documents',
    name: 'Documents',
    price: '119',
    period: '/ document',
    description: 'Tous types de contrats juridiques professionnels',
    features: [
      'CDI, CDD, Stage, Freelance',
      'NDA, CGU/CGV, Prestation services',
      'Bail habitation, Promesse vente',
      'Reconnaissance dette, Pacte associés',
      'Export PDF professionnel',
      'Support standard',
    ],
    icon: MessageSquare,
    iconText: 'Accès immédiat sans engagement',
    cta: 'Générer un contrat',
    variant: 'outline' as const,
    target: 'Particuliers & Professionnels',
  },
  {
    id: 'cabinet',
    name: 'Cabinet',
    price: '350',
    period: '/ mois',
    description: 'Pour cabinets d\'avocats et directions juridiques',
    features: [
      'Rapport BODACC hebdomadaire',
      'Veille juridique entreprises',
      'Référencement prioritaire conseiller',
      'Support prioritaire 48h',
      'Accès API données entreprises',
    ],
    icon: Scale,
    iconText: 'Partenariat professionnel et visibilité',
    cta: 'Devenir partenaire',
    variant: 'accent' as const,
    highlighted: true,
    target: 'Cabinets & Directions juridiques',
  },
  {
    id: 'enterprise',
    name: 'Entreprise',
    price: 'Sur consultation',
    period: '',
    description: 'Pour grandes organisations (20+ employés)',
    features: [
      'Documents illimités',
      'API Access (ERP/CRM)',
      'White-label complet',
      'Support dédié',
      'SLA 99.9%',
      'Installation sur-mesure',
    ],
    icon: Phone,
    iconText: 'Solutions sur-mesure et intégration',
    cta: 'Nous consulter',
    variant: 'outline' as const,
    target: 'Grandes organisations',
  },
];

export function PricingView({ onNavigate }: PricingViewProps) {
  const handleSelectPlan = (planId: string) => {
    if (planId === 'cabinet' || planId === 'enterprise') {
      onNavigate('contact');
    } else if (planId === 'documents') {
      onNavigate('contracts');
    } else {
      onNavigate('login');
    }
  };

  return (
    <div className="min-h-screen py-20 lg:py-24">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'linear' }}
          className="mb-16"
        >
          <p 
            className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-8 text-center"
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
          >
            TARIFICATION / PLANS
          </p>
          
          {/* Framed message */}
          <div className="max-w-3xl mx-auto border border-border p-12 text-center">
            <h1 
              className="text-[2rem] md:text-[2.5rem] mb-6 tracking-[-0.02em]"
              style={{ fontWeight: 600, lineHeight: 1.2 }}
            >
              Choisissez votre liberté.
            </h1>
            <p 
              className="text-[1rem] text-muted-foreground"
              style={{ lineHeight: 1.7 }}
            >
              Pas d'engagement. Pas de surprise. Juste des
              <br />
              contrats professionnels accessibles à tous.
            </p>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.08, ease: 'linear' }}
                className={`border border-border bg-card p-8 lg:p-10 relative transition-all duration-200 ${
                  plan.highlighted 
                    ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' 
                    : 'hover:border-accent/50'
                }`}
              >
                {plan.highlighted && (
                  <div 
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-[0.625rem] uppercase tracking-[0.12em]"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
                  >
                    Recommandé
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-8 pb-8 border-b border-border">
                  <h3 
                    className="text-[1.5rem] mb-2 tracking-[-0.01em]"
                    style={{ fontWeight: 600 }}
                  >
                    {plan.name}
                  </h3>
                  <p 
                    className="text-[0.75rem] uppercase tracking-[0.1em] text-muted-foreground mb-6"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                  >
                    {plan.target}
                  </p>
                  <div className="flex items-baseline gap-2 mb-4">
                    {plan.id !== 'enterprise' ? (
                      <>
                        <span 
                          className="text-[3.5rem] tracking-[-0.03em]"
                          style={{ fontWeight: 600, lineHeight: 1, fontFamily: 'var(--font-mono)' }}
                        >
                          {plan.price}
                        </span>
                        <span 
                          className="text-[1rem] text-muted-foreground"
                          style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                        >
                          € {plan.period}
                        </span>
                      </>
                    ) : (
                      <span 
                        className="text-[1.75rem] tracking-[-0.01em]"
                        style={{ fontWeight: 600, lineHeight: 1.2 }}
                      >
                        {plan.price}
                      </span>
                    )}
                  </div>
                  <p 
                    className="text-[0.8125rem] text-muted-foreground"
                    style={{ lineHeight: 1.5 }}
                  >
                    {plan.description}
                  </p>
                </div>

                {/* Icon feature */}
                <div className="flex items-start gap-3 mb-6 p-3 bg-accent/5 border border-accent/10">
                  <Icon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <p 
                    className="text-[0.75rem]"
                    style={{ lineHeight: 1.5, fontFamily: 'var(--font-mono)', fontWeight: 300 }}
                  >
                    {plan.iconText}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-10">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">
                        <Check className="w-4 h-4 text-accent" strokeWidth={2} />
                      </div>
                      <span 
                        className="text-[0.875rem]"
                        style={{ lineHeight: 1.6 }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={async () => {
                    if (plan.id === 'cabinet') {
                      try {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://symilegalback-virid.vercel.app'}/api/cabinet/subscribe`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: '', cabinetName: '', siret: '' })
                        });
                        const data = await res.json();
                        if (data?.checkoutUrl) window.location.href = data.checkoutUrl; else handleSelectPlan(plan.id);
                      } catch {
                        handleSelectPlan(plan.id);
                      }
                    } else {
                      handleSelectPlan(plan.id);
                    }
                  }}
                  className={`w-full px-8 py-5 text-[0.75rem] uppercase tracking-[0.12em] transition-all duration-200 ${
                    plan.variant === 'accent'
                      ? 'bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)]'
                      : 'border border-border hover:border-foreground hover:bg-accent/5'
                  }`}
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
                >
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Bond Section */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: 'linear', delay: 0.3 }}
          className="mt-16 border border-border p-10"
        >
          <div className="flex items-start justify-between mb-8">
            <div>
              <h3 
                className="text-[2rem] mb-4 tracking-[-0.02em]"
                style={{ fontWeight: 600 }}
              >
                Bond - Coffre-fort Sécurisé
              </h3>
              <p 
                className="text-[1rem] text-muted-foreground mb-4"
                style={{ lineHeight: 1.7 }}
              >
                Pour missions freelance avec paiements par jalons sécurisés
              </p>
              <div className="flex items-baseline gap-4">
                <div>
                  <span 
                    className="text-[2.5rem] tracking-[-0.03em]"
                    style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}
                  >
                    149
                  </span>
                  <span 
                    className="text-[1rem] text-muted-foreground ml-1"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    € setup
                  </span>
                </div>
                <span className="text-muted-foreground mx-2">+</span>
                <div>
                  <span 
                    className="text-[2.5rem] tracking-[-0.03em]"
                    style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}
                  >
                    3
                  </span>
                  <span 
                    className="text-[1rem] text-muted-foreground ml-1"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    % commission
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-sm font-medium mb-3">4 types de contrats :</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  Prestation de service (dev, design, conseil...)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  Travaux (construction, rénovation...)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  Création artistique (design, vidéo...)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  Événementiel (organisation, traiteur...)
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Fonctionnalités :</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  Paiements sécurisés par jalon
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  Validation client avant versement
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  Protection vendeur et acheteur
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  Livraison conditionnelle
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Exemple : Mission 10 000€ = 149€ + 300€ commission = <span className="font-semibold text-foreground">449€ total</span>
            </p>
            <button
              onClick={() => onNavigate('contracts')}
              className="px-8 py-3 bg-accent text-accent-foreground text-[0.75rem] uppercase tracking-[0.12em] hover:shadow-[0_0_20px_var(--accent-glow)] transition-all"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
            >
              Créer un contrat Bond
            </button>
          </div>
        </motion.div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: 'linear', delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p 
            className="text-[0.875rem] text-muted-foreground mb-6"
            style={{ lineHeight: 1.7 }}
          >
            Documents générés conformes au droit français. Garantie de génération en moins de 5 minutes.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="text-[0.75rem] uppercase tracking-[0.08em] text-accent hover:underline"
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
          >
            Besoin d'un plan sur mesure ? Contactez-nous →
          </button>
        </motion.div>
      </div>
    </div>
  );
}
