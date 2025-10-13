import { motion } from "motion/react";
import { FileText, Search, Download } from "lucide-react";

interface RoutesPanelProps {
  onNavigate: (route: 'contracts' | 'editor') => void;
}

export function RoutesPanel({ onNavigate }: RoutesPanelProps) {
  const routes = [
    {
      id: 'generate',
      icon: FileText,
      title: 'Generate',
      description: 'Create new contracts from templates using AI-powered generation',
      action: () => onNavigate('contracts'),
    },
    {
      id: 'review',
      icon: Search,
      title: 'Review',
      description: 'Analyze and review existing contracts with intelligent insights',
      action: () => onNavigate('editor'),
    },
    {
      id: 'export',
      icon: Download,
      title: 'Export',
      description: 'Export finalized documents in multiple formats and standards',
      action: () => {},
    },
  ];

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-[0.75rem] uppercase tracking-[0.15em] text-muted-foreground mb-4" style={{ fontWeight: 500 }}>
            Core Functions
          </p>
          <h2 className="text-[2.5rem] md:text-[3.5rem] tracking-[-0.02em]" style={{ fontWeight: 600, lineHeight: 1.1 }}>
            Three pathways to
            <br />
            legal precision
          </h2>
        </motion.div>

        {/* Routes grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {routes.map((route, index) => (
            <motion.button
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              onClick={route.action}
              className="group relative bg-card border border-border p-8 lg:p-10 text-left transition-all duration-300 hover:border-foreground"
            >
              {/* Number */}
              <div className="absolute top-8 right-8 text-[4rem] opacity-5 group-hover:opacity-10 transition-opacity" style={{ fontWeight: 700 }}>
                {(index + 1).toString().padStart(2, '0')}
              </div>

              {/* Icon */}
              <div className="mb-6">
                <route.icon className="w-8 h-8 stroke-[1.5]" />
              </div>

              {/* Content */}
              <h3 className="text-[1.5rem] mb-3 tracking-[-0.01em]" style={{ fontWeight: 600 }}>
                {route.title}
              </h3>
              <p className="text-[0.9375rem] text-muted-foreground" style={{ lineHeight: 1.6 }}>
                {route.description}
              </p>

              {/* Arrow indicator */}
              <div className="mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[0.75rem] uppercase tracking-[0.15em]" style={{ fontWeight: 500 }}>
                  Enter
                </span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="stroke-current">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
