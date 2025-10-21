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
      example: [
        "• Jalon 1: Maquettes → 10 000€",
        "• Jalon 2: Développement → 25 000€", 
        "• Jalon 3: Tests & déploiement → 15 000€"
      ],
      illustration: "🎯"
    },
    {
      id: 2,
      title: "Paiement sécurisé escrow",
      description: "Le client paie le montant total. Les fonds sont bloqués sur un compte escrow Stripe — personne n'y a accès direct.",
      example: [
        "• Montant total: 50 000€",
        "• Bloqué sur compte Stripe",
        "• Aucun accès direct possible"
      ],
      illustration: "🔒"
    },
    {
      id: 3,
      title: "Livraison & validation",
      description: "Le prestataire livre chaque jalon avec preuves. Le client a 72h pour valider. Si validé (ou timeout), l'argent est libéré automatiquement.",
      example: [
        "• Livraison avec preuves",
        "• Validation sous 72h",
        "• Libération automatique"
      ],
      illustration: "✅"
    },
    {
      id: 4,
      title: "Arbitrage si nécessaire",
      description: "En cas de litige, SYMIONE examine les preuves et décide dans un délai de 7 jours. Décision finale et équitable.",
      example: [
        "• Examen des preuves",
        "• Décision sous 7 jours",
        "• Arbitrage équitable"
      ],
      illustration: "⚖️"
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
      
      {/* Header */}
      <header className="text-center py-12 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground">
        <div className="max-w-4xl mx-auto px-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 text-accent-foreground/80 hover:text-accent-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </motion.button>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            Comment fonctionnent les Contrats Bond?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl opacity-90"
          >
            Paiements sécurisés par jalons
          </motion.p>
        </div>
      </header>

      {/* Interactive visual steps */}
      <div className="steps-visual py-16 max-w-6xl mx-auto px-6">
        
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`step-row flex items-center gap-12 mb-16 ${
              index % 2 === 1 ? 'flex-row-reverse' : ''
            }`}
          >
            
            {/* Step Illustration */}
            <div className="step-illustration w-1/2">
              <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-12 text-center">
                <div className="text-8xl mb-4">{step.illustration}</div>
                <div className="step-number bg-accent text-accent-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  {step.id}
                </div>
              </div>
            </div>
            
            {/* Step Content */}
            <div className="step-content w-1/2">
              <h2 className="text-2xl font-bold mb-3 text-foreground">{step.title}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                {step.description}
              </p>
              <div className="example mt-4 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                <p className="text-sm font-semibold mb-2 text-foreground">Exemple:</p>
                <ul className="text-sm space-y-1">
                  {step.example.map((item, i) => (
                    <li key={i} className="text-muted-foreground">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            
          </motion.div>
        ))}
        
      </div>

      {/* Benefits section */}
      <div className="benefits-section bg-muted/30 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 text-foreground"
          >
            Avantages pour tous
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="benefit-card bg-card border border-border p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="icon mb-4">
                    <IconComponent className={`w-12 h-12 ${benefit.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">{benefit.title}</h3>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-section text-center py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4 text-foreground"
          >
            Prêt à sécuriser votre projet?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground mb-8"
          >
            Créez votre premier contrat Bond en quelques minutes
          </motion.p>
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={onBack}
            className="px-8 py-4 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg transition-colors text-lg font-semibold"
          >
            Créer mon premier contrat Bond →
          </motion.button>
        </div>
      </div>

      {/* Trust badges */}
      <div className="trust-section py-12 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-8"
          >
            <div className="trust-badge flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-muted-foreground">Sécurisé par Stripe Connect</span>
            </div>
            <div className="trust-badge flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm text-muted-foreground">Validation automatique</span>
            </div>
            <div className="trust-badge flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm text-muted-foreground">Processus automatisé</span>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
