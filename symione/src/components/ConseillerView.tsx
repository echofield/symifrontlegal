import { motion } from "motion/react";
import { ArrowLeft, MapPin, Phone, Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { showToast } from "./SystemToast";

const SYSTEM_GREETING = `Bonjour, je suis votre assistant juridique intelligent.

Je fournis des informations générales et des recommandations basées sur votre situation, mais je ne remplace pas un avocat.

Pour toute situation complexe, à fort enjeu, ou nécessitant une action en justice, je vous recommanderai de consulter un professionnel du droit.

Comment puis-je vous aider aujourd'hui?`;

interface ConseillerViewProps {
  onBack: () => void;
}

interface LawyerRec {
  name: string;
  firm?: string;
  specialty?: string;
  city?: string;
  phone?: string;
  rating?: number;
}

interface AnalyzeResult {
  audit: { summary: string; risks: string[]; urgency: string; complexity: string };
  recommendedTemplate?: { id: string; name: string; reason?: string } | null;
  recommendedLawyers?: LawyerRec[];
}

export function ConseillerView({ onBack }: ConseillerViewProps) {
  const [problem, setProblem] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  const analyzeAndRecommend = async () => {
    if (!problem || problem.trim().length < 50) {
      showToast('Veuillez décrire votre situation en détail (min 50 caractères)', 'error');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const r = await fetch('/api/conseiller/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem, city }),
      });
      if (!r.ok) throw new Error('Erreur lors de l\'analyse');
      const data = await r.json();
      setResult(data);
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de l\'analyse', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchLawyers = async () => {
    if (!searchQuery.trim()) {
      showToast('Veuillez entrer une localisation', 'error');
      return;
    }

    setSearching(true);
    try {
      // Call backend lawyers search API
      const response = await fetch(`/api/lawyers/search?near=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) throw new Error('Erreur API');
      
      const data = await response.json();
      setLawyers(data.lawyers || []);
      
      showToast(`${data.lawyers?.length || 0} avocats trouvés`, 'success');
    } catch (err: any) {
      // Fallback to mock data if API fails
      setLawyers([
        {
          id: '1',
          name: 'Cabinet Dubois & Associés',
          specialties: ['Droit des affaires', 'Droit commercial'],
          address: '45 Rue de la République, 75001 Paris',
          phone: '+33 1 42 86 55 00',
          email: 'contact@dubois-avocats.fr',
          distance: '1.2 km',
        },
        {
          id: '2',
          name: 'Maître Sophie Martin',
          specialties: ['Droit du travail', 'Droit social'],
          address: '12 Avenue des Champs-Élysées, 75008 Paris',
          phone: '+33 1 53 93 60 00',
          email: 's.martin@avocat-paris.fr',
          distance: '2.8 km',
        },
        {
          id: '3',
          name: 'SCP Laurent & Moreau',
          specialties: ['Droit immobilier', 'Droit de la famille'],
          address: '78 Boulevard Saint-Germain, 75005 Paris',
          phone: '+33 1 43 26 71 00',
          email: 'contact@laurent-moreau.fr',
          distance: '3.5 km',
        },
      ]);
      showToast('Utilisation des données de démonstration', 'info');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'linear' }}
          className="mb-12"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" strokeWidth={1.5} />
            <span className="text-[0.625rem] uppercase tracking-[0.12em]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
              Retour
            </span>
          </button>

          <div className="pb-6 border-b border-border">
            <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
              MODULE CONSEIL / ASSISTANCE
            </p>
            <h1 className="text-[2rem] md:text-[3rem] tracking-[-0.03em]" style={{ fontWeight: 600, lineHeight: 1.1 }}>
              Conseiller juridique
            </h1>
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Input */}
        <div className="lg:col-span-5 space-y-6">
          {/* System greeting */}
          <div className="bg-blue-50 border border-blue-200 text-blue-900 p-4" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {SYSTEM_GREETING}
          </div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: 'linear' }}
              className="bg-card border border-border p-6 lg:p-8"
            >
            <div className="space-y-4">
              <div>
                <label className="block text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                  Décrivez votre situation
                </label>
                <textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  rows={8}
                  placeholder={"Contexte, enjeux, dates clés, actions déjà réalisées"}
                  className="w-full px-3 py-2.5 bg-input-background border border-border focus-precision transition-all duration-200 text-[0.875rem] resize-none placeholder:text-muted-foreground/50"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
                />
              </div>

              <div>
                <label className="block text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                  Ville (pour recommandation avocat)
                </label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Paris"
                  className="w-full px-3 py-2.5 bg-input-background border border-border focus-precision transition-all duration-200 text-[0.875rem] placeholder:text-muted-foreground/50"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
                />
              </div>

              <button
                onClick={analyzeAndRecommend}
                disabled={loading || !problem.trim()}
                className="w-full px-6 py-3 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 text-[0.625rem] uppercase tracking-[0.12em] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.5} />
                    Analyse en cours...
                  </>
                ) : (
                  'Analyser ma situation'
                )}
              </button>

              <p className="text-[0.625rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300, lineHeight: 1.5 }}>
                Réponse en moins de 30 secondes • Service confidentiel
              </p>
            </div>
            </motion.div>
          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'linear' }}
              className="space-y-6"
            >
              {/* Audit */}
              <div className="bg-card border border-border p-6 lg:p-8">
                <h2 className="text-[1.25rem] mb-2" style={{ fontWeight: 600 }}>Analyse de votre situation</h2>
                <p className="text-[0.875rem] mb-4" style={{ lineHeight: 1.6 }}>{result.audit.summary}</p>
                {Array.isArray(result.audit.risks) && result.audit.risks.length > 0 && (
                  <div className="text-[0.875rem]" style={{ lineHeight: 1.6 }}>
                    <div className="mb-1" style={{ fontWeight: 600 }}>Points d'attention:</div>
                    <ul className="list-disc pl-5">
                      {result.audit.risks.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="text-[0.75rem] text-muted-foreground mt-3" style={{ fontFamily: 'var(--font-mono)' }}>
                  <span>Urgence: {result.audit.urgency}</span> • <span>Complexité: {result.audit.complexity}</span>
                </div>
              </div>

              {/* Template */}
              {result.recommendedTemplate && (
                <div className="bg-card border border-border p-6 lg:p-8">
                  <h2 className="text-[1.25rem] mb-2" style={{ fontWeight: 600 }}>Modèle recommandé</h2>
                  <div className="text-[1rem]" style={{ fontWeight: 600 }}>{result.recommendedTemplate.name}</div>
                  {result.recommendedTemplate.reason && (
                    <p className="text-[0.875rem] mt-1 text-muted-foreground">{result.recommendedTemplate.reason}</p>
                  )}
                </div>
              )}

              {/* Lawyers */}
              {Array.isArray(result.recommendedLawyers) && result.recommendedLawyers.length > 0 && (
                <div className="bg-card border border-border p-6 lg:p-8">
                  <h2 className="text-[1.25rem] mb-4" style={{ fontWeight: 600 }}>Avocats recommandés</h2>
                  <div className="space-y-3">
                    {result.recommendedLawyers.map((l, i) => (
                      <div key={i} className="border border-border p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-[1rem]" style={{ fontWeight: 600 }}>{l.name}</div>
                          {typeof l.rating === 'number' && (
                            <div className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>{l.rating}/5</div>
                          )}
                        </div>
                        <div className="text-[0.875rem] text-muted-foreground mt-1">
                          {[l.specialty, l.city, l.firm].filter(Boolean).join(' • ')}
                        </div>
                        {l.phone && (
                          <a href={`tel:${l.phone}`} className="text-[0.75rem] mt-2 inline-block underline">Contacter</a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Soft CTA */}
              <div className="border border-border p-4 text-[0.875rem] bg-accent/5">
                <span className="mr-2">💡</span>
                Créez un compte gratuit pour sauvegarder vos consultations et générer des contrats personnalisés.
                <button onClick={() => (window.location.href = '/login')} className="ml-3 underline">Créer un compte</button>
              </div>
            </motion.div>
          )}
          </div>
        {/* Right column left empty to preserve layout spacing */}
        <div className="lg:col-span-7" />
        </div>
      </div>
    </div>
  );
}
