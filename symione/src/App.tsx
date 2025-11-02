import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavigationHeader } from './components/NavigationHeader';
import { Footer } from './components/Footer';
import { InstrumentHero } from './components/InstrumentHero';
import { ControlSurface } from './components/ControlSurface';
import { ContractsListView } from './components/ContractsListView';
import { ContractEditorView } from './components/ContractEditorView';
import { ConseillerView } from './components/ConseillerView';
import ConseillerWizardView from './components/ConseillerWizardView';
import { PricingView } from './components/PricingView';
import { LoginView } from './components/LoginView';
import { DocsView } from './components/DocsView';
import { ContactView } from './components/ContactView';
import { BondCreateViewEnhanced } from './components/BondCreateViewEnhanced';
import { BondSimpleView } from './components/BondSimpleView';
import { BondGuideView } from './components/BondGuideView';
import { SystemToast } from './components/SystemToast';
import { SystemStatus } from './components/SystemStatus';
const SupportAgent = lazy(() => import('./components/SupportAgent').then(m => ({ default: m.SupportAgent })));
import { UIProvider } from './components/state-management';
import { ThemeProvider } from './components/ThemeSystem';
import { NotificationContainer } from './components/NotificationSystem';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initializePerformanceMonitoring, useRenderPerformance } from './lib/performance-monitoring';
import { supabase } from './lib/supabaseClient';
import ConseillerChatView from './components/ConseillerChatView';

type View = 'home' | 'contracts' | 'editor' | 'conseiller' | 'conseiller-wizard' | 'conseiller-chat' | 'pricing' | 'docs' | 'contact' | 'login' | 'bond' | 'bond-create' | 'bond-contract' | 'bond-payment' | 'bond-settings' | 'bond-guide';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('home');
  
  // Performance monitoring
  useRenderPerformance('App');
  
  // Initialize performance monitoring
  useEffect(() => {
    initializePerformanceMonitoring();
  }, []);

  // Lightweight path-based routing for deep links
  useEffect(() => {
    const viewToPath = (view: View) => {
      switch (view) {
        case 'home': return '/';
        case 'contracts': return '/modeles';
        case 'editor': return '/editeur';
        case 'conseiller': return '/conseiller';
        case 'conseiller-wizard': return '/conseiller/wizard';
        case 'conseiller-chat': return '/conseiller-chat';
        case 'pricing': return '/prix';
        case 'docs': return '/documentation';
        case 'contact': return '/nous-consulter';
        case 'bond': return '/bond';
        case 'bond-create': return '/bond/create';
        case 'bond-guide': return '/bond/guide';
        default: return '/';
      }
    };

    const pathToView = (path: string): View => {
      if (path.startsWith('/conseiller-chat')) return 'conseiller-chat';
      if (path.startsWith('/conseiller/wizard')) return 'conseiller-wizard';
      if (path.startsWith('/conseiller')) return 'conseiller';
      if (path.startsWith('/modeles')) return 'contracts';
      if (path.startsWith('/prix')) return 'pricing';
      if (path.startsWith('/documentation')) return 'docs';
      if (path.startsWith('/nous-consulter')) return 'contact';
      if (path.startsWith('/bond/guide')) return 'bond-guide';
      if (path.startsWith('/bond/create')) return 'bond-create';
      if (path.startsWith('/bond')) return 'bond';
      return 'home';
    };

    // Initialize from current path
    const initialView = pathToView(window.location.pathname);
    setCurrentView(initialView);
    setNavigationHistory([initialView]);

    // Sync back/forward navigation
    const onPopState = () => {
      const view = pathToView(window.location.pathname);
      setCurrentView(view);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const [navigationHistory, setNavigationHistory] = useState<View[]>(['home']);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string>('free');

  const handleNavigate = (view: View, templateId?: string, jurisdiction?: string) => {
    setNavigationHistory(prev => [...prev, view]);
    setCurrentView(view);
    if (templateId) setSelectedTemplateId(templateId);
    if (jurisdiction) setSelectedJurisdiction(jurisdiction);
    // Update URL path for deep links
    try {
      const viewToPath = (v: View) => {
        switch (v) {
          case 'home': return '/';
          case 'contracts': return '/modeles';
          case 'editor': return '/editeur';
          case 'conseiller': return '/conseiller';
          case 'conseiller-wizard': return '/conseiller/wizard';
          case 'conseiller-chat': return '/conseiller-chat';
          case 'pricing': return '/prix';
          case 'docs': return '/documentation';
          case 'contact': return '/nous-consulter';
          case 'bond': return '/bond';
          case 'bond-create': return '/bond/create';
          case 'bond-guide': return '/bond/guide';
          default: return '/';
        }
      };
      const path = viewToPath(view);
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current
      const previousView = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentView(previousView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const canGoBack = navigationHistory.length > 1;

  // Session and plan fetching
  supabase.auth.onAuthStateChange(async (_event, session) => {
    const uid = session?.user?.id || null;
    setUserEmail(session?.user?.email || null);
    if (uid) {
      try {
        const { data } = await supabase
          .from('users')
          .select('plan')
          .eq('id', uid)
          .maybeSingle();
        setUserPlan((data?.plan as string) || 'free');
      } catch {
        setUserPlan('free');
      }
    } else {
      setUserPlan('free');
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationHeader 
        currentView={currentView}
        onNavigate={handleNavigate}
        canGoBack={canGoBack}
        onBack={handleBack}
      />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'linear' }}
            >
              <InstrumentHero />
              <ControlSurface 
                onNavigate={(route) => {
                  if (route === 'contracts') handleNavigate('contracts');
                  if (route === 'editor') handleNavigate('editor');
                }}
                onNavigateConseiller={() => handleNavigate('conseiller')}
              />
              
              {/* System capabilities */}
              <section className="py-20 lg:py-24 border-t border-border">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, ease: 'linear' }}
                  >
                    <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-10" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                      CAPACITÉS SYSTÈME
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                      {[
                        {
                          code: 'TPL',
                          title: '50+ Templates',
                          description: 'Bibliothèque professionnelle de modèles juridiques',
                        },
                        {
                          code: 'JUR',
                          title: '3 Juridictions',
                          description: 'France, Royaume-Uni, États-Unis',
                        },
                        {
                          code: 'VIT',
                          title: 'Génération Rapide',
                          description: 'Moins de 5 minutes par contrat',
                        },
                      ].map((feature, index) => (
                        <motion.div
                          key={feature.code}
                          initial={{ opacity: 0, y: 6 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.2, delay: index * 0.06, ease: 'linear' }}
                          className="border-l border-border pl-4"
                        >
                          <div className="text-[0.625rem] uppercase tracking-[0.12em] text-accent mb-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                            {feature.code}
                          </div>
                          <h3 className="text-[1.125rem] mb-2 tracking-[-0.01em]" style={{ fontWeight: 600 }}>
                            {feature.title}
                          </h3>
                          <p className="text-[0.8125rem] text-muted-foreground" style={{ lineHeight: 1.6, fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                            {feature.description}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* System metrics */}
              <section className="py-20 lg:py-24 border-t border-border">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                    {[
                      { value: '50+', label: 'Templates professionnels', unit: 'DOCS' },
                      { value: '3', label: 'Juridictions', unit: 'FR, UK, US' },
                      { value: '<5', label: 'Par contrat', unit: 'MIN' },
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.2, delay: index * 0.08, ease: 'linear' }}
                        className="border-l-2 border-border pl-6"
                      >
                        <div className="mb-2">
                          <div className="text-[3.5rem] md:text-[4.5rem] tracking-[-0.03em] mb-2" style={{ fontWeight: 600, lineHeight: 1, fontFamily: 'var(--font-mono)' }}>
                            {stat.value}
                          </div>
                          <span className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground block" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                            {stat.unit}
                          </span>
                        </div>
                        <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                          {stat.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Initialization prompt */}
              <section className="py-20 lg:py-24 border-t border-border">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, ease: 'linear' }}
                    className="max-w-4xl"
                  >
                    <div className="flex items-start gap-3 mb-6">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                      <div>
                        <h2 className="text-[2rem] md:text-[3rem] mb-3 tracking-[-0.03em]" style={{ fontWeight: 600, lineHeight: 1.1 }}>
                          Système prêt.
                        </h2>
                        <p className="text-[0.875rem] text-muted-foreground" style={{ lineHeight: 1.7, fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                          50+ templates professionnels • 3 juridictions • Génération {'<5'} min
                        </p>
                      </div>
                    </div>
                    <p className="text-[0.9375rem] mb-10" style={{ lineHeight: 1.7 }}>
                      Automatisation juridique de précision pour pratique professionnelle.
                      Démarrez la synthèse documentaire ou consultez un expert.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={() => handleNavigate('login')}
                        className="px-12 py-5 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 text-[0.75rem] tracking-[0.12em] uppercase inline-flex items-center justify-center gap-3"
                        style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
                      >
                        S'inscrire pour accéder
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="stroke-current">
                          <path d="M2 7H12M12 7L8 3M12 7L8 11" strokeWidth="1.5" strokeLinecap="square" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleNavigate('conseiller')}
                        className="px-12 py-5 border border-border hover:border-foreground transition-all duration-200 text-[0.75rem] tracking-[0.12em] uppercase inline-flex items-center justify-center gap-3"
                        style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                      >
                        Conseiller juridique
                      </button>
                    </div>
                  </motion.div>
                </div>
              </section>
            </motion.div>
          )}

          {currentView === 'contracts' && (
            <motion.div
              key="contracts"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'linear' }}
            >
              <ContractsListView 
                onBack={handleBack}
                onSelectTemplate={(templateId, jurisdiction) => handleNavigate('editor', templateId, jurisdiction)}
                plan={userPlan as any}
              />
            </motion.div>
          )}

          {currentView === 'editor' && selectedTemplateId && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'linear' }}
            >
              <ContractEditorView 
                templateId={selectedTemplateId}
                jurisdiction={selectedJurisdiction || undefined}
                onBack={handleBack}
              />
            </motion.div>
          )}

          {currentView === 'conseiller' && (
            <motion.div
              key="conseiller"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'linear' }}
            >
              <ConseillerView 
                onBack={handleBack}
                onNavigate={(v: any) => handleNavigate(v as any)}
              />
            </motion.div>
          )}

          {currentView === 'conseiller-chat' && (
            <motion.div
              key="conseiller-chat"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'linear' }}
            >
              <ConseillerChatView />
            </motion.div>
          )}

          {currentView === 'conseiller-wizard' && (
            <motion.div
              key="conseiller-wizard"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'linear' }}
            >
              <ConseillerWizardView />
            </motion.div>
          )}

          {currentView === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'linear' }}
            >
              <PricingView onNavigate={handleNavigate} />
            </motion.div>
          )}

          {currentView === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'linear' }}
            >
              <LoginView onNavigate={handleNavigate} />
            </motion.div>
          )}

          {currentView === 'docs' && (
            <motion.div
              key="docs"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'linear' }}
            >
              <DocsView />
            </motion.div>
          )}

          {currentView === 'bond-create' && (
            <motion.div
              key="bond-create"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'linear' }}
            >
              <BondCreateViewEnhanced onNavigate={handleNavigate} />
            </motion.div>
          )}

          {currentView === 'bond' && (
            <motion.div
              key="bond"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'linear' }}
            >
              <BondSimpleView onNavigate={handleNavigate} />
            </motion.div>
          )}

          {currentView === 'bond-guide' && (
            <motion.div
              key="bond-guide"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'linear' }}
            >
              <BondGuideView onBack={() => handleNavigate('bond')} />
            </motion.div>
          )}

          {currentView === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'linear' }}
            >
              <ContactView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {currentView === 'home' && <Footer />}
      <SystemToast />
      <SystemStatus />
      <Suspense fallback={null}><SupportAgent /></Suspense>
      <NotificationContainer />
    </div>
  );
}

// Main App component with providers
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <UIProvider>
          <AppContent />
        </UIProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
