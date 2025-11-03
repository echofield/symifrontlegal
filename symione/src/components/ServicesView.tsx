import { motion } from 'motion/react';
import { Check, ArrowRight, Shield, Target, Gauge } from 'lucide-react';

interface ServicesViewProps {
  onStartAuditLite?: () => void;
  onStartAuditPro?: () => void;
  onContactPilot?: () => void;
}

export function ServicesView({ onStartAuditLite, onStartAuditPro, onContactPilot }: ServicesViewProps) {
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
            CONSEIL & MISE EN OEUVRE
          </p>
          <h1 className="text-[2rem] md:text-[2.5rem] tracking-[-0.02em] mb-4" style={{ fontWeight: 600, lineHeight: 1.2 }}>
            Systèmes d’intelligence en production.
          </h1>
          <div className="text-[1rem] text-foreground/80 max-w-3xl" style={{ lineHeight: 1.7 }}>
            <p>L’intelligence n’est plus un concept — c’est l’infrastructure vivante de l’entreprise moderne.</p>
            <p>Des résultats tangibles, sans promesse creuse.</p>
          </div>
        </motion.div>

        {/* Intent → Resonance → Pattern → Emergence (ASCII) */}
        <div className="mb-12 border border-border p-6 bg-card">
          <pre
            className="text-[0.875rem] leading-6 whitespace-pre-wrap"
            style={{ fontFamily: 'var(--font-mono)' }}
          >{`Human Intent ────> Clarté

                    ↓

               [Résonance]

                    ↑

          AI Pattern ────┘

                    ↓

              ROI  •  Sérénité

                    ↓

             Emergent System`}</pre>
        </div>

        {/* Positioning */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[{
            icon: Target,
            title: 'Clarté',
            text: 'Plan 90 jours priorisé, focalisé sur vos objectifs métier.'
          },{
            icon: Gauge,
            title: 'ROI',
            text: 'Gains et économies documentés (heures, revenus, NPS).'
          },{
            icon: Shield,
            title: 'Sérénité',
            text: 'Gouvernance, sécurité et conformité dès le jour 1.'
          }].map((b, i) => {
            const Icon = b.icon as any;
            return (
              <motion.div key={b.title} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.2, delay: i * 0.06, ease: 'linear' }} className="sd-border p-6">
                <Icon className="w-5 h-5 mb-3 text-accent" />
                <h3 className="font-semibold mb-1">{b.title}</h3>
                <p className="text-sm text-foreground/80">{b.text}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Method */}
        <div className="sd-border p-8 mb-14">
          <h2 className="text-xl font-semibold mb-4">Méthode 360°</h2>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Activité & clients</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Processus & outils</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Données & sécurité</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Architecture & coûts</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Organisation & gouvernance</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Indicateurs & ROI</li>
          </ul>
        </div>

        {/* Offers */}
        <div id="forfaits" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14">
          {/* Impulse 48 */}
          <div className="border border-border bg-card p-8 lg:p-10 relative hover:border-accent/50 transition-all duration-200">
            <div className="mb-8 pb-8 border-b border-border">
              <h3 className="text-[1.5rem] mb-2 tracking-[-0.01em]" style={{ fontWeight: 600 }}>Impulse 48</h3>
              <p className="text-[0.75rem] uppercase tracking-[0.1em] text-muted-foreground mb-6" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>Démarrage 48 h</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-[3.5rem] tracking-[-0.03em]" style={{ fontWeight: 600, lineHeight: 1, fontFamily: 'var(--font-mono)' }}>590</span>
                <span className="text-[1rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>€</span>
              </div>
              <p className="text-[0.8125rem] text-foreground/80" style={{ lineHeight: 1.5 }}>Audit express et mini‑implémentation livrable.</p>
            </div>

            <ul className="space-y-3 mb-10">
              <li className="flex items-start gap-3"><Check className="w-4 h-4 text-accent" /><span className="text-[0.875rem]" style={{ lineHeight: 1.6 }}>Carte d’opportunités (3 priorités 90 j)</span></li>
              <li className="flex items-start gap-3"><Check className="w-4 h-4 text-accent" /><span className="text-[0.875rem]" style={{ lineHeight: 1.6 }}>Mini‑implémentation utilisable dès aujourd’hui</span></li>
              <li className="flex items-start gap-3"><Check className="w-4 h-4 text-accent" /><span className="text-[0.875rem]" style={{ lineHeight: 1.6 }}>Rapport 1 page + plan d’action</span></li>
            </ul>

            <button onClick={onStartAuditLite} className="w-full px-8 py-5 text-[0.75rem] uppercase tracking-[0.12em] border border-border hover:border-foreground hover:bg-accent/5 transition-all duration-200" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
              Démarrer en 48 h
            </button>
          </div>

          {/* Kernel 360 (highlighted) */}
          <div className="border border-border bg-card p-8 lg:p-10 relative transition-all duration-200 ring-2 ring-accent ring-offset-2 ring-offset-background">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-[0.625rem] uppercase tracking-[0.12em]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>Recommandé</div>
            <div className="mb-8 pb-8 border-b border-border">
              <h3 className="text-[1.5rem] mb-2 tracking-[-0.01em]" style={{ fontWeight: 600 }}>Kernel 360</h3>
              <p className="text-[0.75rem] uppercase tracking-[0.1em] text-muted-foreground mb-6" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>Architecture + Bloc</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-[3.5rem] tracking-[-0.03em]" style={{ fontWeight: 600, lineHeight: 1, fontFamily: 'var(--font-mono)' }}>990</span>
                <span className="text-[1rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>€</span>
              </div>
              <p className="text-[0.8125rem] text-foreground/80" style={{ lineHeight: 1.5 }}>Architecture cible + premier bloc opérationnel connecté.</p>
            </div>

            <ul className="space-y-3 mb-10">
              <li className="flex items-start gap-3"><Check className="w-4 h-4 text-accent" /><span className="text-[0.875rem]" style={{ lineHeight: 1.6 }}>Architecture cible + feuille de route 90 j</span></li>
              <li className="flex items-start gap-3"><Check className="w-4 h-4 text-accent" /><span className="text-[0.875rem]" style={{ lineHeight: 1.6 }}>1 bloc opérationnel connecté à vos outils</span></li>
              <li className="flex items-start gap-3"><Check className="w-4 h-4 text-accent" /><span className="text-[0.875rem]" style={{ lineHeight: 1.6 }}>2 KPI actifs + garde‑fous coûts/sécurité</span></li>
            </ul>

            <button onClick={onStartAuditPro} className="w-full px-8 py-5 text-[0.75rem] uppercase tracking-[0.12em] bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
              Activer Kernel 360
            </button>
          </div>

          {/* Continuum 30 */}
          <div className="border border-border bg-card p-8 lg:p-10 relative hover:border-accent/50 transition-all duration-200">
            <div className="mb-8 pb-8 border-b border-border">
              <h3 className="text-[1.5rem] mb-2 tracking-[-0.01em]" style={{ fontWeight: 600 }}>Continuum 30</h3>
              <p className="text-[0.75rem] uppercase tracking-[0.1em] text-muted-foreground mb-6" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>Production 30 jours</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-[1.75rem] tracking-[-0.01em]" style={{ fontWeight: 600, lineHeight: 1.2 }}>À partir de 3 000 €</span>
              </div>
              <p className="text-[0.8125rem] text-foreground/80" style={{ lineHeight: 1.5 }}>Cas d’usage complet en production avec transfert.</p>
            </div>

            <ul className="space-y-3 mb-10">
              <li className="flex items-start gap-3"><Check className="w-4 h-4 text-accent" /><span className="text-[0.875rem]" style={{ lineHeight: 1.6 }}>Intégrations, monitoring, SOPs, transfert</span></li>
              <li className="flex items-start gap-3"><Check className="w-4 h-4 text-accent" /><span className="text-[0.875rem]" style={{ lineHeight: 1.6 }}>Revue KPI & itérations — sans dette technique</span></li>
              <li className="flex items-start gap-3"><Check className="w-4 h-4 text-accent" /><span className="text-[0.875rem]" style={{ lineHeight: 1.6 }}>Accompagnement gouvernance et sécurité</span></li>
            </ul>

            <button onClick={onContactPilot} className="w-full px-8 py-5 text-[0.75rem] uppercase tracking-[0.12em] border border-border hover:border-foreground hover:bg-accent/5 transition-all duration-200 inline-flex items-center justify-center gap-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
              Parler d’un déploiement <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="border border-border p-8 mb-14">
          <h2 className="text-xl font-semibold mb-4">Timeline</h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="border border-dashed border-border p-4">
              <div className="text-xs text-muted-foreground mb-1">Impulse 48</div>
              <div className="font-semibold">Démarrage sous 48 h</div>
            </div>
            <div className="border border-dashed border-border p-4">
              <div className="text-xs text-muted-foreground mb-1">Kernel 360</div>
              <div className="font-semibold">Bloc opérationnel en 7 j ouvrés</div>
            </div>
            <div className="border border-dashed border-border p-4">
              <div className="text-xs text-muted-foreground mb-1">Continuum 30</div>
              <div className="font-semibold">Cas complet en prod en 30 j</div>
            </div>
          </div>
        </div>

        {/* Use cases */}
        <div className="sd-border p-8">
          <h2 className="text-xl font-semibold mb-4">Cas d’usage</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Juridique : génération, revue, triage dossiers</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Commercial : qualification, outreach ciblé, RDV</li>
            </ul>
            <ul className="space-y-2">
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Support : réponses de niveau 1, escalade contextualisée</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Finance/OPS : rapprochements, contrôles qualité</li>
            </ul>
          </div>
        </div>

        {/* Global CTA */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={onStartAuditLite} className="px-6 py-3 bg-accent text-accent-foreground text-[0.75rem] uppercase tracking-[0.12em] hover:shadow-[0_0_20px_var(--accent-glow)] transition">Activer Impulse 48 — 590 €</button>
          <button onClick={onContactPilot} className="px-6 py-3 border border-border text-[0.75rem] uppercase tracking-[0.12em]">Découvrir nos systèmes</button>
        </div>
      </div>
    </div>
  );
}

export default ServicesView;


