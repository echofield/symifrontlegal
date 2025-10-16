import { motion } from 'motion/react';
import { Check, Phone, MessageSquare, Scale } from 'lucide-react';

interface PricingViewProps {
  onNavigate: (view: 'contracts' | 'login' | 'contact') => void;
}

const plans = [
  {
    id: 'discovery',
    name: 'Découverte Professionnelle',
    price: '50',
    period: '/ mois',
    description: 'Pour les indépendants, startups ou dirigeants qui veulent expérimenter l\'automatisation juridique sans compromis',
    features: [
      '4 contrats par mois',
      'Accès bibliothèque (50+ modèles FR & UE)',
      'Assistant IA vocal & textuel',
      'Recommandation d\'avocats par géolocalisation',
      'Export PDF uniquement',
      'Support email prioritaire',
    ],
    icon: Phone,
    iconText: 'Appel IA + mise en relation avocat partenaire',
    cta: 'Commencer l\'essai pro',
    variant: 'outline' as const,
    target: 'Indépendants & Startups',
  },
  {
    id: 'pro',
    name: 'Plan Pro',
    price: '149',
    period: '/ mois',
    description: 'Pour PME, RH, et consultants qui veulent un assistant juridique complet au quotidien',
    features: [
      '10 contrats par mois',
      'Export PDF & DOCX',
      'Révision automatique illimitée',
      'Conseiller IA expert (chat + voix)',
      'Recherche d\'avocats & analyse de risques',
      'Support prioritaire (< 12h)',
    ],
    icon: MessageSquare,
    iconText: 'IA conseil + intégration lois FR & UE + triage automatique',
    cta: 'Passer au plan Pro',
    variant: 'accent' as const,
    highlighted: true,
    target: 'PME, RH, Consultants',
  },
  {
    id: 'cabinet',
    name: 'Cabinet & Entreprise',
    price: 'Sur consultation',
    period: '',
    description: 'Pour cabinets d\'avocats, directions juridiques et grands comptes',
    features: [
      'Contrats illimités',
      'API & intégrations (ERP, CRM, Notion...)',
      'IA dédiée & white label (votre marque)',
      'Référencement prioritaire SYMIONE Search',
      'Support dédié + SLA contractuel',
      'Formation équipe incluse',
    ],
    icon: Scale,
    iconText: 'À partir de 900€/mois selon volume et intégration',
    cta: 'Devenir partenaire cabinet',
    variant: 'outline' as const,
    target: 'Cabinets d\'avocats',
  },
];

export function PricingView({ onNavigate }: PricingViewProps) {
  const handleSelectPlan = (planId: string) => {
    if (planId === 'discovery') {
      onNavigate('contracts');
    } else if (planId === 'cabinet') {
      onNavigate('contact');
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
                    Populaire
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
                    {plan.id !== 'cabinet' ? (
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
                  onClick={() => handleSelectPlan(plan.id)}
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

        {/* Validation avocat option */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: 'linear', delay: 0.3 }}
          className="mt-12 border border-accent/30 bg-accent/5 p-8 lg:p-10"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 border border-accent">
                  <Scale className="w-5 h-5 text-accent" strokeWidth={1.5} />
                </div>
                <h3 
                  className="text-[1.25rem] tracking-[-0.01em]"
                  style={{ fontWeight: 600 }}
                >
                  Option : Validation Avocat
                </h3>
              </div>
              <p 
                className="text-[0.875rem] mb-3"
                style={{ lineHeight: 1.6 }}
              >
                Relecture + cachet professionnel + archivage sécurisé
              </p>
              <div className="space-y-1">
                <p 
                  className="text-[0.75rem] text-muted-foreground"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
                >
                  • Délai : ~2h ouvrées
                </p>
                <p 
                  className="text-[0.75rem] text-muted-foreground"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
                >
                  • Avocat certifié (Barreau de Paris)
                </p>
                <p 
                  className="text-[0.75rem] text-muted-foreground"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
                >
                  • Disponible sur demande à la fin de chaque génération
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span 
                className="text-[2.5rem] tracking-[-0.03em]"
                style={{ fontWeight: 600, lineHeight: 1, fontFamily: 'var(--font-mono)' }}
              >
                100
              </span>
              <span 
                className="text-[1rem] text-muted-foreground"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
              >
                € / document
              </span>
            </div>
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
            Tous les plans incluent l'accès aux 3 juridictions (FR, UK, US) et la garantie de génération en moins de 5 minutes.
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
