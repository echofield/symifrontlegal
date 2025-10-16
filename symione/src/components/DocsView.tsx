import { motion } from 'motion/react';
import { Book, Code, FileText, Zap } from 'lucide-react';

export function DocsView() {
  const sections = [
    {
      icon: Zap,
      title: 'Démarrage rapide',
      description: 'Commencez en moins de 5 minutes',
      items: [
        'Créer un compte',
        'Choisir un template',
        'Générer votre premier contrat',
        'Exporter en PDF/DOCX',
      ],
    },
    {
      icon: FileText,
      title: 'Bibliothèque de templates',
      description: '50+ modèles professionnels',
      items: [
        'Contrats de travail (CDI, CDD, Stage)',
        'Contrats commerciaux (Vente, Prestation)',
        'Accords de confidentialité (NDA)',
        'Baux et locations',
      ],
    },
    {
      icon: Code,
      title: 'API & Intégrations',
      description: 'Pour les plans Cabinet',
      items: [
        'REST API documentation',
        'Webhooks & événements',
        'White label & branding',
        'SSO & authentification',
      ],
    },
    {
      icon: Book,
      title: 'Guide juridique',
      description: 'Comprendre vos contrats',
      items: [
        'Clauses essentielles',
        'Mentions obligatoires',
        'Juridictions supportées',
        'Conformité RGPD',
      ],
    },
  ];

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
            className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-4"
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
          >
            SYSTÈME / DOCUMENTATION
          </p>
          <h1 
            className="text-[3rem] md:text-[4rem] mb-6 tracking-[-0.03em]"
            style={{ fontWeight: 600, lineHeight: 1.1 }}
          >
            Documentation.
          </h1>
          <p 
            className="text-[1rem] text-muted-foreground max-w-2xl"
            style={{ lineHeight: 1.7 }}
          >
            Guides complets, références API et ressources pour maîtriser la plateforme SYMIONE.
          </p>
        </motion.div>

        {/* Documentation sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: index * 0.08, ease: 'linear' }}
                className="bg-card p-8 lg:p-10 hover:bg-accent/5 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 border border-border">
                    <Icon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 
                      className="text-[1.25rem] mb-1 tracking-[-0.01em]"
                      style={{ fontWeight: 600 }}
                    >
                      {section.title}
                    </h3>
                    <p 
                      className="text-[0.75rem] text-muted-foreground"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {section.description}
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 border-t border-border pt-6">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 group">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full group-hover:bg-accent transition-colors duration-200" />
                      <span 
                        className="text-[0.875rem] group-hover:text-accent transition-colors duration-200"
                        style={{ lineHeight: 1.6 }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Additional resources */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: 'linear', delay: 0.3 }}
          className="mt-16 border border-border p-8 lg:p-10"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 
                className="text-[1.5rem] mb-2 tracking-[-0.01em]"
                style={{ fontWeight: 600 }}
              >
                Besoin d'aide supplémentaire ?
              </h3>
              <p 
                className="text-[0.875rem] text-muted-foreground"
                style={{ lineHeight: 1.6 }}
              >
                Notre équipe support est disponible pour vous accompagner.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                className="px-10 py-4 border border-border hover:border-foreground transition-all duration-200 text-[0.75rem] uppercase tracking-[0.12em]"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
              >
                Support
              </button>
              <button
                className="px-10 py-4 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 text-[0.75rem] uppercase tracking-[0.12em]"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
              >
                API Docs
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
