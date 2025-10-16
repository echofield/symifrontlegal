import { motion } from "motion/react";

interface ControlSurfaceProps {
  onNavigate: (route: 'contracts' | 'editor') => void;
  onNavigateConseiller: () => void;
}

const modules = [
  {
    id: 'synthesis',
    code: 'SYN',
    title: 'Module de Synthèse',
    function: 'Génération de contrats',
    description: 'Création automatisée de documents depuis la bibliothèque',
    route: 'contracts' as const,
    status: 'PRÊT',
  },
  {
    id: 'compliance',
    code: 'CMP',
    title: 'Scanner de Conformité',
    function: 'Révision et analyse',
    description: 'Vérification juridique en temps réel',
    route: 'editor' as const,
    status: 'PRÊT',
  },
  {
    id: 'conseiller',
    code: 'CNS',
    title: 'Module Conseil',
    function: 'Assistance juridique',
    description: 'Conseil expert et réseau d\'avocats',
    route: 'conseiller' as const,
    status: 'PRÊT',
  },
];

export function ControlSurface({ onNavigate, onNavigateConseiller }: ControlSurfaceProps) {
  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Control panel header */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: 'linear' }}
          className="mb-12 pb-8 border-b border-border"
        >
          <div className="flex items-end justify-between">
            <div>
              <p 
                className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-3"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
              >
                SYSTEM / MODULES
              </p>
              <h2 
                className="text-[2rem] md:text-[2.5rem] tracking-[-0.02em]" 
                style={{ fontWeight: 600, lineHeight: 1.1 }}
              >
                Surface de contrôle
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <p 
                className="text-[0.625rem] tracking-[0.05em] text-muted-foreground"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
              >
                3 MODULES PRÊTS
              </p>
            </div>
          </div>
        </motion.div>

        {/* Module grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
          {modules.map((module, index) => (
            <motion.button
              key={module.id}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: index * 0.08, ease: 'linear' }}
              onClick={() => {
                if (module.id === 'conseiller') {
                  onNavigateConseiller();
                } else if (module.route) {
                  onNavigate(module.route);
                }
              }}
              disabled={!module.route}
              className={`group relative bg-card p-8 lg:p-10 text-left transition-all duration-200 ${
                module.route 
                  ? 'hover:bg-accent/5 cursor-pointer' 
                  : 'cursor-not-allowed opacity-60'
              }`}
            >


              {/* Module code */}
              <div className="flex items-start justify-between mb-8">
                <div 
                  className="text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground px-2 py-1 border border-border"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                >
                  {module.code}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    module.status === 'PRÊT' ? 'bg-accent' : 'bg-muted-foreground/40'
                  }`} />
                  <span 
                    className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
                  >
                    {module.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 
                    className="text-[1.25rem] mb-1 tracking-[-0.01em]" 
                    style={{ fontWeight: 600, lineHeight: 1.3 }}
                  >
                    {module.title}
                  </h3>
                  <p 
                    className="text-[0.75rem] uppercase tracking-[0.1em] text-accent"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                  >
                    {module.function}
                  </p>
                </div>
                <p 
                  className="text-[0.875rem] text-muted-foreground" 
                  style={{ lineHeight: 1.6 }}
                >
                  {module.description}
                </p>
              </div>

              {/* Action button */}
              {module.route && (
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex items-center justify-between group-hover:opacity-100 transition-opacity duration-200">
                    <span 
                      className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground"
                      style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                    >
                      Module disponible
                    </span>
                    <div className="flex items-center gap-2 text-accent">
                      <span 
                        className="text-[0.625rem] uppercase tracking-[0.12em]"
                        style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
                      >
                        Ouvrir
                      </span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="stroke-current transform group-hover:translate-x-1 transition-transform duration-200">
                        <path d="M2 6H10M10 6L7 3M10 6L7 9" strokeWidth="1" strokeLinecap="square" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
