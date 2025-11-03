import { motion } from 'motion/react';
import { Check, ArrowRight, Shield, Target, Gauge } from 'lucide-react';

interface ServicesViewProps {
  onStartAuditLite?: () => void;
  onStartAuditPro?: () => void;
  onContactPilot?: () => void;
}

export function ServicesView({ onStartAuditLite, onStartAuditPro, onContactPilot }: ServicesViewProps) {
  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'linear' }}
          className="mb-14"
        >
          <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-6" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
            CONSEIL & MISE EN OEUVRE IA
          </p>
          <h1 className="text-[2rem] md:text-[2.5rem] tracking-[-0.02em] mb-4" style={{ fontWeight: 600, lineHeight: 1.2 }}>
            L'IA n’est plus une option. C’est l’électricité de l’entreprise moderne.
          </h1>
          <p className="text-[1rem] text-muted-foreground max-w-3xl" style={{ lineHeight: 1.7 }}>
            Nous analysons votre activité à 360° et livrons des systèmes fiables, mesurables et rentables. Pas de buzzwords — des résultats chiffrés, en production.
          </p>
        </motion.div>

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
              <motion.div key={b.title} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.2, delay: i * 0.06, ease: 'linear' }} className="border border-border p-6">
                <Icon className="w-5 h-5 mb-3 text-accent" />
                <h3 className="font-semibold mb-1">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.text}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Method */}
        <div className="border border-border p-8 mb-14">
          <h2 className="text-xl font-semibold mb-4">Méthode 360°</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Marché & clients (frictions, parcours)</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Processus & outils (où l’IA remplace/accélère)</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Données & sécurité (qualité, confidentialité)</li>
            </ul>
            <ul className="space-y-2">
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Architecture & coûts (cloud/on‑device, observation)</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Organisation & gouvernance (rôles, risques)</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Indicateurs & ROI (KPI, contrat d’objectifs)</li>
            </ul>
          </div>
        </div>

        {/* Offers */}
        <div className="grid lg:grid-cols-3 gap-6 mb-14">
          {/* Audit Lite */}
          <div className="border border-border p-8">
            <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-mono)' }}>Audit 48h</p>
            <h3 className="text-xl font-semibold mb-1">Audit Lite</h3>
            <div className="text-3xl font-semibold mb-4">590 €</div>
            <ul className="text-sm text-muted-foreground space-y-2 mb-6">
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> 3 cas d’usage prioritaires</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> ROI estimatif + risques majeurs</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Plan d’actions 30 jours</li>
            </ul>
            <button onClick={onStartAuditLite} className="w-full px-4 py-3 border border-border hover:border-foreground transition">
              Commencer (48h)
            </button>
          </div>

          {/* Audit Pro */}
          <div className="border border-border p-8 ring-1 ring-accent">
            <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-mono)' }}>Audit 1 semaine</p>
            <h3 className="text-xl font-semibold mb-1">Audit Pro</h3>
            <div className="text-3xl font-semibold mb-4">990 €</div>
            <ul className="text-sm text-muted-foreground space-y-2 mb-6">
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Architecture cible + feuille de route 90 jours</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Maquette du cas prioritaire</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> KPI & gouvernance (sécurité, coûts)</li>
            </ul>
            <button onClick={onStartAuditPro} className="w-full px-4 py-3 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition">
              Réserver l’audit
            </button>
          </div>

          {/* Implementation */}
          <div className="border border-border p-8">
            <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-mono)' }}>Pilote 30 jours</p>
            <h3 className="text-xl font-semibold mb-1">Implémentation</h3>
            <div className="text-3xl font-semibold mb-4">À partir de 3 000 €</div>
            <ul className="text-sm text-muted-foreground space-y-2 mb-6">
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Agent métier en production</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Tableau de bord & transfert</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Revue KPI mensuelle</li>
            </ul>
            <button onClick={onContactPilot} className="w-full px-4 py-3 border border-border hover:border-foreground transition inline-flex items-center justify-center gap-2">
              Parler d’un pilote <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Use cases */}
        <div className="border border-border p-8">
          <h2 className="text-xl font-semibold mb-4">Cas d’usage</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Juridique : génération, revue, triage dossiers</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Commercial : qualification, outreach ciblé, RDV</li>
            </ul>
            <ul className="space-y-2">
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Support : agent voix 24/7, escalade contextualisée</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Finance/OPS : rapprochements, contrôles qualité</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesView;


