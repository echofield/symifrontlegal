import { motion } from "motion/react";
import { ArrowLeft, Shield, Wallet, CheckCircle, Zap } from "lucide-react";

interface BondGuideViewProps {
  onBack: () => void;
}

export function BondGuideView({ onBack }: BondGuideViewProps) {
  const steps = [
    {
      id: 1,
      title: "Définissez vos jalons",
      description: "Découpez votre projet en étapes claires avec livrables et montants précis.",
      details: [
        "Définition des étapes de livraison",
        "Montants associés à chaque jalon",
        "Critères de validation précis"
      ]
    },
    {
      id: 2,
      title: "Paiement sécurisé escrow",
      description: "Le client paie le montant total. Les fonds sont bloqués sur un compte escrow Stripe — personne n'y a accès direct.",
      details: [
        "Paiement total via Stripe Connect",
        "Fonds bloqués sur compte escrow",
        "Aucun accès direct possible"
      ]
    },
    {
      id: 3,
      title: "Livraison & validation",
      description: "Le prestataire livre chaque jalon avec preuves. Le client a 72h pour valider. Si validé (ou timeout), l'argent est libéré automatiquement.",
      details: [
        "Livraison avec preuves tangibles",
        "Validation sous 72h maximum",
        "Libération automatique des fonds"
      ]
    },
    {
      id: 4,
      title: "Arbitrage si nécessaire",
      description: "En cas de litige, SYMIONE examine les preuves et décide dans un délai de 7 jours. Décision finale et équitable.",
      details: [
        "Examen objectif des preuves",
        "Décision sous 7 jours",
        "Arbitrage équitable et définitif"
      ]
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Client protégé",
      description: "Votre argent est bloqué jusqu'à livraison conforme. Pas de risque de perte.",
      color: "text-green-600"
    },
    {
      icon: Wallet,
      title: "Prestataire protégé", 
      description: "Paiement garanti dès que vous livrez correctement. Fini les impayés.",
      color: "text-blue-600"
    },
    {
      icon: CheckCircle,
      title: "0 conflit",
      description: "Validation objective via preuves tangibles. Pas de discussions sans fin.",
      color: "text-purple-600"
    },
    {
      icon: Zap,
      title: "100% automatisé",
      description: "Libération auto après validation. Aucune action manuelle nécessaire.",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      
      {/* Header - Style suisse strict */}
      <header className="py-12 border-b border-border">
        <div className="max-w-4xl mx-auto px-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
              SYMI BOND / GUIDE
            </p>
            <h1 className="text-[2rem] md:text-[3rem] tracking-[-0.03em]" style={{ fontWeight: 600, lineHeight: 1.1 }}>
              Comment fonctionnent les Contrats Bond
            </h1>
            <p className="text-[0.875rem] text-muted-foreground mt-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
              Paiements sécurisés par jalons
            </p>
          </motion.div>
        </div>
      </header>

      {/* Steps - Style suisse strict */}
      <div className="py-16 max-w-4xl mx-auto px-6">
        
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="mb-16"
          >
            
            <div className="flex items-start gap-8">
              
              {/* Step Number */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                  {step.id}
                </div>
              </div>
              
              {/* Step Content */}
              <div className="flex-1">
                <h2 className="text-[1.5rem] font-bold mb-3 text-foreground" style={{ fontWeight: 600 }}>
                  {step.title}
                </h2>
                <p className="text-[0.875rem] text-muted-foreground mb-4" style={{ lineHeight: 1.6 }}>
                  {step.description}
                </p>
                
                {/* Details */}
                <div className="space-y-2">
                  {step.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-3 text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                      <div className="w-1 h-1 bg-muted-foreground rounded-full flex-shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
            
          </motion.div>
        ))}
        
      </div>

      {/* Benefits section - Style sobre avec trait bleu */}
      <div className="benefits-section bg-muted/30 py-16 border-t border-border">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[1.5rem] font-bold text-center mb-12 text-foreground"
            style={{ fontWeight: 600 }}
          >
            Avantages pour tous
          </motion.h2>
          
          <div className="space-y-2">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border-l-4 border-l-accent p-6 hover:border-l-accent/80 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <IconComponent className={`w-6 h-6 ${benefit.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[1.125rem] font-bold mb-2 text-foreground" style={{ fontWeight: 600 }}>
                        {benefit.title}
                      </h3>
                      <p className="text-[0.875rem] text-muted-foreground" style={{ lineHeight: 1.6 }}>
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trust badges - Style suisse strict */}
      <div className="trust-section py-12 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-[0.75rem] uppercase tracking-[0.12em] text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
              SÉCURISÉ PAR
            </p>
            <div className="flex items-center justify-center gap-8">
              <div className="trust-badge flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                  Stripe Connect
                </span>
              </div>
              <div className="trust-badge flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                  Validation automatique
                </span>
              </div>
              <div className="trust-badge flex items-center gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 text-purple-600" />
                </div>
                <span className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                  Processus automatisé
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA - Style suisse strict */}
      <div className="cta-section text-center py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[1.5rem] font-bold mb-4 text-foreground"
            style={{ fontWeight: 600 }}
          >
            Prêt à sécuriser votre projet?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[0.875rem] text-muted-foreground mb-8"
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
          >
            Créez votre premier contrat Bond en quelques minutes
          </motion.p>
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={onBack}
            className="px-10 py-4 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 inline-flex items-center gap-3"
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
          >
            <span className="text-[0.75rem] uppercase tracking-[0.12em]">Créer mon premier contrat Bond</span>
          </motion.button>
        </div>
      </div>

    </div>
  );
}