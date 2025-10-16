import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, ChevronRight } from 'lucide-react';

const faqs = [
  {
    id: 'signup',
    question: 'Comment créer un compte ?',
    answer: 'Cliquez sur "Connexion" en haut à droite, puis "S\'inscrire". Remplissez vos informations et choisissez votre plan.',
  },
  {
    id: 'plans',
    question: 'Quels sont les plans disponibles ?',
    answer: 'Nous proposons 3 plans : Découverte Pro (50€/mois), Plan Pro (149€/mois), et Cabinet sur consultation. Consultez la page Prix pour plus de détails.',
  },
  {
    id: 'templates',
    question: 'Combien de templates sont disponibles ?',
    answer: 'Nous proposons plus de 50 templates professionnels couvrant 3 juridictions (FR, UK, US), incluant contrats de travail, commerciaux, NDA, baux, etc.',
  },
  {
    id: 'export',
    question: 'Comment exporter mes contrats ?',
    answer: 'Avec le plan Découverte Pro, vous exportez en PDF. Avec le plan Pro et Cabinet, vous pouvez exporter en PDF et DOCX.',
  },
  {
    id: 'time',
    question: 'Combien de temps prend la génération ?',
    answer: 'La génération d\'un contrat prend moins de 5 minutes en moyenne, de la sélection du template à l\'export final.',
  },
  {
    id: 'lawyer',
    question: 'Puis-je faire valider par un avocat ?',
    answer: 'Oui, nous proposons une option Validation Avocat à 100€ par document : relecture + cachet professionnel + archivage sécurisé.',
  },
  {
    id: 'support',
    question: 'Comment vous contacter ?',
    answer: 'Envoyez-nous un email à contact@symi.io. Nous répondons sous 24h ouvrées. Les abonnés Pro et Cabinet bénéficient d\'un support prioritaire.',
  },
];

export function SupportAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<string | null>(null);

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.2, ease: 'linear' }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-accent text-accent-foreground shadow-lg hover:shadow-[0_0_24px_var(--accent-glow)] transition-all duration-200 border border-accent"
        aria-label="Assistance"
      >
        {isOpen ? (
          <X className="w-6 h-6" strokeWidth={1.5} />
        ) : (
          <MessageSquare className="w-6 h-6" strokeWidth={1.5} />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'linear' }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[600px] bg-card border border-border shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border bg-accent/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <h3 
                  className="text-[1rem] tracking-[-0.01em]"
                  style={{ fontWeight: 600 }}
                >
                  Assistant SYMIONE
                </h3>
              </div>
              <p 
                className="text-[0.75rem] text-muted-foreground"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
              >
                Questions fréquentes
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {selectedFaq ? (
                <div className="p-6">
                  <button
                    onClick={() => setSelectedFaq(null)}
                    className="flex items-center gap-2 text-[0.75rem] text-accent hover:underline mb-4"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    ← Retour aux questions
                  </button>
                  <div className="bg-accent/5 p-4 border border-accent/10 mb-4">
                    <p 
                      className="text-[0.875rem]"
                      style={{ fontWeight: 600, lineHeight: 1.5 }}
                    >
                      {faqs.find(f => f.id === selectedFaq)?.question}
                    </p>
                  </div>
                  <p 
                    className="text-[0.875rem] text-muted-foreground"
                    style={{ lineHeight: 1.6 }}
                  >
                    {faqs.find(f => f.id === selectedFaq)?.answer}
                  </p>
                </div>
              ) : (
                <div className="p-4">
                  <div className="space-y-2">
                    {faqs.map((faq) => (
                      <button
                        key={faq.id}
                        onClick={() => setSelectedFaq(faq.id)}
                        className="w-full text-left p-3 hover:bg-accent/5 transition-colors duration-200 border border-transparent hover:border-accent/20 group"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span 
                            className="text-[0.8125rem] flex-1"
                            style={{ lineHeight: 1.5 }}
                          >
                            {faq.question}
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors duration-200" strokeWidth={1.5} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/30">
              <p 
                className="text-[0.75rem] text-muted-foreground text-center mb-2"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
              >
                Besoin d'aide supplémentaire ?
              </p>
              <a
                href="mailto:contact@symi.io"
                className="block text-center text-[0.75rem] text-accent hover:underline"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                contact@symi.io
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
