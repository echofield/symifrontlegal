import { motion } from 'motion/react';

type View = 'home' | 'contracts' | 'editor' | 'conseiller' | 'conseiller-wizard' | 'pricing' | 'contact' | 'login' | 'bond' | 'bond-create' | 'bond-contract' | 'bond-payment' | 'bond-settings' | 'services';

interface NavigationHeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
  canGoBack: boolean;
  onBack: () => void;
}

export function NavigationHeader({ currentView, onNavigate, canGoBack, onBack }: NavigationHeaderProps) {
  const navItems = [
    { label: 'Modèles', view: 'contracts' as View },
    { label: 'Bond', view: 'bond' as View },
    { label: 'Services', view: 'services' as View },
    { label: 'Prix', view: 'pricing' as View },
    { label: 'Nous consulter', view: 'contact' as View },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'linear' }}
      className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Left: Branding + Back button */}
          <div className="flex items-center gap-6">
            {canGoBack && (
              <button
                onClick={onBack}
                className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label="Retour"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="stroke-current">
                  <path d="M10 14L4 8L10 2" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
                <span 
                  className="text-[0.625rem] uppercase tracking-[0.12em]"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                >
                  Retour
                </span>
              </button>
            )}
            <button
              onClick={() => onNavigate('home')}
              className="hover:opacity-80 transition-opacity duration-200"
            >
              <span 
                className="text-[1.25rem] tracking-[-0.02em]"
                style={{ fontWeight: 600, lineHeight: 1 }}
              >
                SYMIONE
              </span>
            </button>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = currentView === item.view || 
                (item.view === 'bond' && ['bond-create', 'bond-contract', 'bond-payment', 'bond-settings'].includes(currentView)) ||
                (item.view === 'conseiller' && currentView === 'conseiller-wizard');
              
              return (
                <button
                  key={item.view}
                  onClick={() => onNavigate(item.view)}
                  className={`text-[0.75rem] uppercase tracking-[0.08em] transition-colors duration-200 ${
                    isActive
                      ? 'text-accent'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: isActive ? 500 : 400 }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('contracts')}
              className="px-10 py-3.5 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 text-[0.75rem] tracking-[0.12em] uppercase inline-flex items-center gap-2"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
            >
              Commencer
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="stroke-current">
                <path d="M2 6H10M10 6L7 3M10 6L7 9" strokeWidth="1" strokeLinecap="square" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <nav className="lg:hidden pb-4 flex gap-4 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = currentView === item.view || 
              (item.view === 'bond' && ['bond-create', 'bond-contract', 'bond-payment', 'bond-settings'].includes(currentView)) ||
              (item.view === 'conseiller' && currentView === 'conseiller-wizard');
            
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`text-[0.625rem] uppercase tracking-[0.08em] whitespace-nowrap transition-colors duration-200 ${
                  isActive
                    ? 'text-accent'
                    : 'text-muted-foreground'
                }`}
                style={{ fontFamily: 'var(--font-mono)', fontWeight: isActive ? 500 : 400 }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}
