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
import ServicesView from './components/ServicesView';
import { SystemStatus } from './components/SystemStatus';
const SupportAgent = lazy(() => import('./components/SupportAgent').then(m => ({ default: m.SupportAgent })));
import { UIProvider } from './components/state-management';
import { ThemeProvider } from './components/ThemeSystem';
import { NotificationContainer } from './components/NotificationSystem';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initializePerformanceMonitoring, useRenderPerformance } from './lib/performance-monitoring';
import { supabase } from './lib/supabaseClient';
import ConseillerChatView from './components/ConseillerChatView';

type View = 'home' | 'contracts' | 'editor' | 'conseiller' | 'conseiller-wizard' | 'conseiller-chat' | 'pricing' | 'docs' | 'contact' | 'login' | 'bond' | 'bond-create' | 'bond-contract' | 'bond-payment' | 'bond-settings' | 'bond-guide' | 'services';

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
        case 'services': return '/services';
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
      if (path.startsWith('/services')) return 'services';
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
          case 'services': return '/services';
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
              {/* New Hero */}
              <section className="py-16 lg:py-24">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
                  <div className="max-w-4xl">
                    <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-6" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                      SYSTÈMES IA EN PRODUCTION
                    </p>
                    <h1 className="text-[2.25rem] md:text-[3rem] tracking-[-0.03em] mb-4" style={{ fontWeight: 600, lineHeight: 1.1 }}>
                      L’IA n’est plus une option. C’est l’électricité de l’entreprise moderne.
                    </h1>
                    <p className="text-[1rem] text-muted-foreground mb-8" style={{ lineHeight: 1.7 }}>
                      Nous analysons votre activité à 360° et livrons des systèmes fiables, mesurables et rentables. Pas de buzzwords — des résultats chiffrés, en production.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button onClick={() => handleNavigate('contracts')} className="px-12 py-5 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 text-[0.75rem] tracking-[0.12em] uppercase" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>Créer un contrat</button>
                      <button onClick={() => handleNavigate('services')} className="px-12 py-5 border border-border hover:border-foreground transition-all duration-200 text-[0.75rem] tracking-[0.12em] uppercase" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>Découvrir nos Services</button>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4">
                      <button onClick={() => handleNavigate('bond')} className="px-6 py-3 border border-border text-[0.6875rem] uppercase tracking-[0.12em]">Escrow Bond</button>
                      <button onClick={() => handleNavigate('conseiller')} className="px-6 py-3 border border-border text-[0.6875rem] uppercase tracking-[0.12em]">Conseiller IA (BETA)</button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Keep existing components below */}
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

              {/* Products */}
              <section className="py-20 lg:py-24 border-t border-border">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
                  <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-10" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>PRODUITS</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[{
                      title: 'Documents',
                      desc: 'À partir de 79 € / document. Prévisualisation gratuite, export professionnel.',
                      cta: 'Voir les modèles',
                      action: () => handleNavigate('contracts')
                    },{
                      title: 'Bond (Escrow)',
                      desc: '149 / 299 / 499 € selon le ticket. Paiements par jalons, libération conditionnelle.',
                      cta: 'Découvrir Bond',
                      action: () => handleNavigate('bond')
                    },{
                      title: 'Conseiller IA (BETA)',
                      desc: 'Réponse rapide et orientation stratégique. Audit 48h: 590 €.',
                      cta: 'Ouvrir Conseiller',
                      action: () => handleNavigate('conseiller')
                    }].map((card) => (
                      <div key={card.title} className="border border-border p-8">
                        <h3 className="text-[1.25rem] mb-2" style={{ fontWeight: 600 }}>{card.title}</h3>
                        <p className="text-sm text-muted-foreground mb-6" style={{ lineHeight: 1.6 }}>{card.desc}</p>
                        <button onClick={card.action} className="px-6 py-3 border border-border hover:border-foreground transition text-[0.75rem] uppercase tracking-[0.12em]">{card.cta}</button>
                      </div>
                    ))}
                  </div>
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
                      <button onClick={() => handleNavigate('contracts')} className="px-12 py-5 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 text-[0.75rem] tracking-[0.12em] uppercase inline-flex items-center justify-center gap-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>Créer un contrat</button>
                      <button onClick={() => handleNavigate('services')} className="px-12 py-5 border border-border hover:border-foreground transition-all duration-200 text-[0.75rem] tracking-[0.12em] uppercase inline-flex items-center justify-center gap-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>Découvrir nos Services</button>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Méthode 360° */}
              <section className="py-20 lg:py-24 border-t border-border">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
                  <h2 className="text-[1.5rem] mb-6" style={{ fontWeight: 600 }}>Méthode 360°</h2>
                  <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                    <ul className="space-y-2">
                      <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></span> Marché & clients (frictions, parcours)</li>
                      <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></span> Processus & outils (où l’IA remplace/accélère)</li>
                      <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></span> Données & sécurité (qualité, confidentialité)</li>
                    </ul>
                    <ul className="space-y-2">
                      <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></span> Architecture & coûts (cloud/on‑device, observation)</li>
                      <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></span> Organisation & gouvernance (rôles, risques)</li>
                      <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></span> Indicateurs & ROI (KPI, contrat d’objectifs)</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Cas d’usage */}
              <section className="py-20 lg:py-24 border-t border-border">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
                  <h2 className="text-[1.5rem] mb-6" style={{ fontWeight: 600 }}>Cas d’usage</h2>
                  <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground mb-6">
                    <ul className="space-y-2">
                      <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></span> Juridique : génération, revue, triage dossiers</li>
                      <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></span> Commercial : qualification, outreach ciblé, RDV</li>
                    </ul>
                    <ul className="space-y-2">
                      <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></span> Support : agent voix 24/7, escalade contextualisée</li>
                      <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></span> Finance/OPS : rapprochements, contrôles qualité</li>
                    </ul>
                  </div>
                  <button onClick={() => handleNavigate('services')} className="px-8 py-4 bg-accent text-accent-foreground text-[0.75rem] uppercase tracking-[0.12em] hover:shadow-[0_0_20px_var(--accent-glow)] transition">Commencer par un Audit 48h — 590 €</button>
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

          {currentView === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'linear' }}
            >
              <ServicesView 
                onStartAuditLite={() => window.location.href = 'mailto:contact@symione.com?subject=Audit%2048h%20(590€)'}
                onStartAuditPro={() => window.location.href = 'mailto:contact@symione.com?subject=Audit%20Pro%20(990€)'}
                onContactPilot={() => window.location.href = 'mailto:contact@symione.com?subject=Pilote%20IA%20(≥3000€)'}
              />
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
