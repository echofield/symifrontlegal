import { motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface ServicesViewProps {
  onStartAuditLite?: () => void;
  onStartAuditPro?: () => void;
  onContactPilot?: () => void;
}

const plans = [
  {
    id: 'impulse',
    name: 'Impulse 48',
    price: '590 €',
    label: 'DÉMARRAGE 48 H',
    description: 'Architecture + bloc opérationnel',
    features: [
      "Carte d'opportunités (3 priorités 90 j)",
      "Mini-implémentation utilisable dès aujourd'hui",
      "Rapport 1 page + plan d'action"
    ],
    cta: 'Démarrer en 48 h',
    timeline: 'Démarrage sous 48 h',
    delivery: 'Impulse 48',
    popular: false
  },
  {
    id: 'kernel',
    name: 'Kernel 360',
    price: '990 €',
    label: 'ARCHITECTURE + BLOC',
    description: 'Bloc opérationnel en 7 j ouvrés',
    features: [
      'Architecture cible + feuille de route 90 j',
      '1 bloc opérationnel connecté à vos outils',
      '2 KPI actifs + garde-fous coûts/sécurité'
    ],
    cta: 'Activer Kernel 360',
    timeline: 'Bloc opérationnel en 7 j ouvrés',
    delivery: 'Kernel 360',
    popular: true
  },
  {
    id: 'continuum',
    name: 'Continuum 30',
    price: 'À partir de 3 000 €',
    label: 'PRODUCTION 30 JOURS',
    description: 'Cas complet en prod en 30 j',
    features: [
      "Cas d'usage complet en production",
      'Intégrations, monitoring, SOPs, transfert',
      'Revue KPI & itérations — sans dette technique'
    ],
    cta: "Parler d'un déploiement",
    timeline: 'Cas complet en prod en 30 j',
    delivery: 'Continuum 30',
    popular: false,
    contact: true
  }
];

export function ServicesView({ onStartAuditLite, onStartAuditPro, onContactPilot }: ServicesViewProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  return (
    <div className="min-h-screen py-16 lg:py-24 services-swiss">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'linear' }}
          className="mb-14"
        >
          <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-6" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
            SOLUTIONS
          </p>
          <h1 className="text-[2rem] md:text-[2.5rem] tracking-[-0.02em] mb-4" style={{ fontWeight: 700, lineHeight: 1.2 }}>
            Systèmes d’intelligence en production.
          </h1>
          <div className="text-[1rem] text-foreground/80 max-w-3xl" style={{ lineHeight: 1.7 }}>
            <p>L’intelligence n’est plus un concept — c’est l’infrastructure vivante de l’entreprise moderne.</p>
            <p>Des résultats tangibles, sans promesse creuse.</p>
          </div>
        </motion.div>

        {/* Timeline */}
        <section className="border-b border-[#EAECF0] bg-white py-16">
          <div className="mx-auto max-w-7xl px-6">
            <h3 className="text-xs uppercase tracking-wider text-[#667085] font-mono mb-12">TIMELINE</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {plans.map((plan, index) => (
                <div key={plan.id} className="relative">
                  {index < plans.length - 1 && (
                    <div className="hidden md:block absolute top-2 left-full w-full h-px bg-[#EAECF0]" />
                  )}
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-accent mb-4" />
                    <p className="text-sm mb-1">{plan.delivery}</p>
                    <p className="text-xs text-[#667085] font-mono">{plan.timeline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl tracking-tight mb-4">Choisissez votre départ</h2>
              <p className="text-lg text-[#667085]">Du prototype 48h au système complet en production</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
              {plans.map((plan) => (
                <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                  className={`relative border rounded-xl p-8 bg-white ${plan.popular ? 'border-accent shadow-lg ring-2 ring-accent ring-opacity-20' : 'border-[#EAECF0] hover:border-accent hover:shadow-md'} transition-all duration-200`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-accent text-accent-foreground text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full">Populaire</span>
                    </div>
                  )}
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-wider text-[#667085] font-mono mb-2">{plan.label}</p>
                    <h3 className="text-2xl mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-2 mb-3"><span className="text-3xl tracking-tight">{plan.price}</span></div>
                    <p className="text-sm text-[#667085]">{plan.description}</p>
                  </div>
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3"><Check className="h-4 w-4 text-[#19B37A] flex-shrink-0 mt-0.5" strokeWidth={2} /><span className="text-sm text-[#101828] leading-relaxed">{feature}</span></div>
                    ))}
                  </div>
                  <Button onClick={() => setSelectedPlan(plan.id)} className={`w-full ${plan.popular ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : 'bg-white border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground'}`}>
                    {plan.cta}
                    {plan.contact && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact measured */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-20">
                <h3 className="text-3xl tracking-tight">Impact mesuré</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#EAECF0]">
                <div className="relative bg-[#F8FAFC] p-12 border-r border-[#EAECF0]">
                  <div className="absolute top-6 left-6"><span className="text-xs uppercase tracking-wider text-[#667085] font-mono">Sans SYMIONE</span></div>
                  <div className="mt-8 space-y-8">
                    <div>
                      <div className="flex items-baseline gap-3 mb-2"><span className="text-4xl tracking-tight text-[#101828]">2-4</span><span className="text-sm text-[#101828] font-mono">semaines</span></div>
                      <div className="h-px bg-[#EAECF0]" />
                      <p className="text-xs text-[#667085] mt-2">Délai de livraison</p>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-3 mb-2"><span className="text-4xl tracking-tight text-[#101828]">2000-5000</span><span className="text-sm text-[#101828] font-mono">€</span></div>
                      <div className="h-px bg-[#EAECF0]" />
                      <p className="text-xs text-[#667085] mt-2">Coût moyen</p>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-3 mb-2"><span className="text-4xl tracking-tight text-[#101828]">100%</span><span className="text-sm text-[#101828] font-mono">manuel</span></div>
                      <div className="h-px bg-[#EAECF0]" />
                      <p className="text-xs text-[#667085] mt-2">Processus humain</p>
                    </div>
                  </div>
                </div>
                <div className="relative bg-white p-12">
                  <div className="absolute top-6 left-6"><span className="text-xs uppercase tracking-wider text-accent font-mono">Avec SYMIONE</span></div>
                  <div className="mt-8 space-y-8">
                    <div>
                  <div className="flex items-baseline gap-3 mb-2"><span className="text-4xl tracking-tight text-[#101828]">48H-30J</span><span className="text-sm text-accent font-mono">-70%</span></div>
                      <div className="h-px bg-accent" />
                      <p className="text-xs text-[#667085] mt-2">Délai de livraison</p>
                    </div>
                    <div>
                  <div className="flex items-baseline gap-3 mb-2"><span className="text-4xl tracking-tight text-[#101828]">590-2900</span><span className="text-sm text-accent font-mono">€ -60%</span></div>
                      <div className="h-px bg-accent" />
                      <p className="text-xs text-[#667085] mt-2">Coût moyen</p>
                    </div>
                    <div>
                  <div className="flex items-baseline gap-3 mb-2"><span className="text-4xl tracking-tight text-[#101828]">Intelligence + HUMAINS</span><span className="text-sm text-accent font-mono">Assistance augmentée</span></div>
                  <div className="h-px bg-accent" />
                  <p className="text-xs text-[#667085] mt-2">Assistance augmentée</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-px bg-[#EAECF0] border border-[#EAECF0] mt-0">
                <div className="bg-white px-6 py-4 text-center"><p className="text-2xl tracking-tight mb-1">48H</p><p className="text-xs text-[#667085] font-mono">Premier livrable</p></div>
                <div className="bg-white px-6 py-4 text-center"><p className="text-2xl tracking-tight mb-1">100%</p><p className="text-xs text-[#667085] font-mono">Traçabilité</p></div>
                <div className="bg-white px-6 py-4 text-center"><p className="text-2xl tracking-tight mb-1">0</p><p className="text-xs text-[#667085] font-mono">Engagement initial</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="border-t border-[#EAECF0] bg-[#F8FAFC] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <h3 className="text-xs uppercase tracking-wider text-[#667085] font-mono mb-8">CAS D'USAGE</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { category: 'Juridique', examples: 'génération, revue, triage dossiers' },
                { category: 'Commercial', examples: 'qualification, outreach ciblé, RDV' },
                { category: 'Support', examples: 'réponses de niveau 1, escalade contextualisée' },
                { category: 'Finance/OPS', examples: 'rapprochements, contrôles qualité' }
              ].map((useCase, index) => (
                <div key={index} className="bg-white border border-[#EAECF0] rounded-lg px-4 py-3">
                  <div className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-[#19B37A] flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <div>
                      <p className="text-sm"><span className="text-[#101828]">{useCase.category}</span><span className="text-[#667085]"> : {useCase.examples}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ServicesView;


