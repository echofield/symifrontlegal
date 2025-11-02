import { motion } from "motion/react";
import { ArrowLeft, MapPin, Phone, Mail, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { showToast } from "./SystemToast";
import { ConseillerAPI, useAPI, APIError, RateLimitError } from "../lib/api-client";
import { LoadingSpinner, LoadingButton, useLoadingState } from "./LoadingComponents";
import { ErrorBoundary } from "./ErrorBoundary";
import { LawyerContactCard } from "./LawyerContactCard";
import { LegalDisclaimerModal } from "./LegalDisclaimerModal";

const SYSTEM_GREETING = `Bonjour, je suis votre assistant juridique intelligent.

Je fournis des informations générales et des recommandations basées sur votre situation, mais je ne remplace pas un avocat.

Pour toute situation complexe, à fort enjeu, ou nécessitant une action en justice, je vous recommanderai de consulter un professionnel du droit.

Comment puis-je vous aider aujourd'hui?`;

interface ConseillerViewProps {
  onBack: () => void;
  onNavigate?: (view: any) => void;
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
  success?: boolean;
  analysis?: any;
  // Legacy fields
  audit?: { summary: string; risks: string[]; urgency: string; complexity: string };
  recommendedTemplate?: { id: string | null; name: string | null; slug: string | null; available: boolean; reason?: string } | null;
  needsLawyer?: boolean;
  recommendedLawyers?: LawyerRec[];
}

const HELPER_QUESTIONS = [
  "Type de situation juridique ?",
  "Niveau d'urgence ?",
  "Budget disponible pour honoraires avocat ?",
  "Quel est l'enjeu financier du dossier ?",
  "Qui est la partie adverse ?",
  "Y a-t-il une procédure déjà en cours ?",
  "Avez-vous des documents/preuves ?",
  "Localisation géographique du dossier ?",
  "Préférence type d'avocat ?",
  "Expérience minimale souhaitée ?",
  "Langue(s) de travail souhaitée(s) ?",
  "Modalité de rendez-vous préférée ?",
  "Votre disponibilité pour un premier RDV ?",
  "Avez-vous déjà consulté un avocat pour ce dossier ?",
  "Quel est votre objectif principal ?",
  "Le dossier présente-t-il une sensibilité particulière ?",
  "Contexte, enjeux, dates clés ?",
  "Actions déjà entreprises ?"
];

export function ConseillerView({ onBack, onNavigate }: ConseillerViewProps) {
  const safeText = (v: any): string => (typeof v === 'string' ? v : v == null ? '' : String(v));
  const [problem, setProblem] = useState('');
  const [city, setCity] = useState('');
  const [situationType, setSituationType] = useState('');
  const [urgence, setUrgence] = useState('');
  const [hasProofs, setHasProofs] = useState('');
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string }[]>([]);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showHelperQuestions, setShowHelperQuestions] = useState(false);
  
  const { loading, error, startLoading, stopLoading, setErrorState } = useLoadingState();

  const analyzeAndRecommend = async () => {
    if (!safeText(problem) || safeText(problem).trim().length < 20) {
      showToast('Veuillez décrire votre situation en détail (min 20 caractères)', 'error');
      return;
    }
    
    setShowDisclaimer(true);
  };

  const handleDisclaimerAccept = async () => {
    setShowDisclaimer(false);
    
    try {
      startLoading();
      setResult(null);
      
      // Map fields for backend compatibility
      const categoryMap: Record<string, string> = {
        'voisinage': 'Litige avec voisin (bruit, empiètement, etc.)',
        'travail': 'Problème employeur/salarié (licenciement, harcèlement, etc.)',
        'commercial': 'Contrat commercial (prestation, vente, etc.)',
        'immobilier': 'Immobilier (achat, location, travaux)',
        'famille': 'Famille (divorce, garde d\'enfants, succession)',
        'consommation': 'Litige consommation (achat défectueux, SAV)',
        'autre': 'Autre'
      };

      const urgencyMap: Record<string, number> = {
        'tres_urgent': 9,
        'urgent': 7,
        'moyen': 5,
        'pas_urgent': 3
      };
      
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 12000);

      const response: any = await ConseillerAPI.analyze({ 
        problem, 
        city,
        category: categoryMap[situationType] || situationType,
        urgency: urgencyMap[urgence] || 5,
        hasEvidence: hasProofs === 'oui'
      });

      clearTimeout(timeoutId);
      
      // Handle new response format
      if ((response as any)?.success && (response as any)?.analysis) {
        const analysis = (response as any).analysis;
        setResult({
          audit: {
            summary: analysis.resume || '',
            risks: analysis.analyse?.faiblesses || [],
            urgency: analysis.scoring?.urgenceIA || '5',
            complexity: analysis.scoring?.complexite || 'Moyenne'
          },
          recommendedTemplate: analysis.recommendedTemplate,
          needsLawyer: analysis.recommandation?.needsLawyer || false,
          recommendedLawyers: analysis.recommendedLawyers || []
        });
      } else {
        // Legacy format
        setResult(response);
      }
      
      setMessages((prev) => [
        ...prev,
        { id: `u-${Date.now()}`, role: 'user', content: problem },
        { id: `a-${Date.now()}`, role: 'assistant', content: `Analyse complétée pour ${city || 'votre zone'}.` },
      ]);
      
      showToast('Analyse terminée avec succès', 'success');
    } catch (err: any) {
      console.error('Analysis error:', err);
      
      if (err instanceof RateLimitError) {
        showToast(`Limite de taux atteinte. Réessayez dans ${err.retryAfter} secondes.`, 'error');
      } else if (err instanceof APIError) {
        showToast(err.message, 'error');
      } else if ((err as any)?.name === 'AbortError') {
        showToast(`L'analyse prend trop de temps. Réessayez avec une description plus courte.`, 'error');
      } else {
        showToast('Erreur lors de l\'analyse. Veuillez réessayer.', 'error');
      }
      
      setErrorState(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      stopLoading();
    }
  };

  const handleFollowUp = () => {
    if (!safeText(followUpQuestion).trim()) return;
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', content: followUpQuestion }, { id: `a-${Date.now()}`, role: 'assistant', content: 'Réponse contextuelle (bientôt disponible).' }]);
    setFollowUpQuestion('');
  };

  // Placeholder for lawyer search, will be integrated with backend later
  const [searchQuery, setSearchQuery] = useState('');
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearchLawyers = async () => {
    if (!safeText(searchQuery).trim()) {
      showToast('Veuillez entrer une localisation', 'error');
      return;
    }

    setSearching(true);
    try {
      // Call backend lawyers search API
      // This part needs to be updated to use the new API client and actual backend endpoint
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
    <ErrorBoundary>
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
            <div className="mt-4">
              <a
                href="/conseiller-chat"
                onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('conseiller-chat'); } }}
                className="inline-block px-4 py-2 text-[0.75rem] uppercase tracking-[0.12em] border border-border hover:border-foreground transition-all duration-200"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
              >
                Essayer le mode chat
              </a>
            </div>
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-6">
        {/* Left column: Input (sticky on desktop) */}
        <div className="space-y-6 lg:sticky lg:top-20 self-start">
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
              {/* Essential Questions */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4 text-foreground">Pour une recommandation précise:</h3>
                
                {/* Question 1: Type de situation */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-foreground mb-2">Type de situation juridique:</label>
                  <select 
                    value={situationType} 
                    onChange={(e) => setSituationType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-input-background border border-border focus-precision transition-all duration-200 text-[0.875rem]"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="voisinage">Litige avec voisin (bruit, empiètement, etc.)</option>
                    <option value="travail">Problème employeur/salarié (licenciement, harcèlement, etc.)</option>
                    <option value="commercial">Contrat commercial (prestation, vente, etc.)</option>
                    <option value="immobilier">Immobilier (achat, location, travaux)</option>
                    <option value="famille">Famille (divorce, garde d'enfants, succession)</option>
                    <option value="consommation">Litige consommation (achat défectueux, SAV)</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                
                {/* Question 2: Urgence */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-foreground mb-2">Niveau d'urgence:</label>
                  <select 
                    value={urgence} 
                    onChange={(e) => setUrgence(e.target.value)}
                    className="w-full px-3 py-2.5 bg-input-background border border-border focus-precision transition-all duration-200 text-[0.875rem]"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="tres_urgent">Très urgent (action dans les 48h)</option>
                    <option value="urgent">Urgent (action cette semaine)</option>
                    <option value="moyen">Moyen (action ce mois-ci)</option>
                    <option value="pas_urgent">Pas urgent (information préventive)</option>
                  </select>
                </div>
                
                {/* Question 3: Preuves */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Avez-vous des preuves/documents?</label>
                  <div className="flex gap-3">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        value="oui" 
                        checked={hasProofs === 'oui'}
                        onChange={(e) => setHasProofs(e.target.value)}
                        className="mr-1.5"
                      />
                      <span className="text-sm text-foreground">Oui, j'ai des preuves</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        value="non" 
                        checked={hasProofs === 'non'}
                        onChange={(e) => setHasProofs(e.target.value)}
                        className="mr-1.5"
                      />
                      <span className="text-sm text-foreground">Non, pas de preuves</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                    Décrivez votre situation en détail
                  </label>
                  <button
                    onClick={() => setShowHelperQuestions(!showHelperQuestions)}
                    className="text-[0.625rem] uppercase tracking-[0.08em] text-accent hover:underline"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                  >
                    {showHelperQuestions ? 'Masquer les suggestions' : 'Voir les questions suggérées'}
                  </button>
                </div>
                
                {showHelperQuestions && (
                  <div className="mb-3 p-3 bg-accent/5 border border-accent/10 text-[0.75rem] space-y-1">
                    <p className="text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                      Pour une analyse complète, pensez à mentionner:
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground/80">
                      {HELPER_QUESTIONS.slice(0, 8).map((q, i) => (
                        <li key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  rows={8}
                  placeholder={"Contexte, enjeux, dates clés, actions déjà réalisées..."}
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

              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                <LoadingButton
                  loading={loading}
                  onClick={analyzeAndRecommend}
                  disabled={!safeText(problem).trim()}
                  className="w-full px-6 py-3 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 text-[0.625rem] uppercase tracking-[0.12em]"
                >
                  {loading ? 'Analyse en cours...' : 'Analyser ma situation'}
                </LoadingButton>
              </div>

              <p className="text-[0.625rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300, lineHeight: 1.5 }}>
                Réponse en moins de 30 secondes • Service confidentiel
              </p>
              
              {/* Error display */}
              {error && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                </div>
              )}
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
                <p className="text-[0.875rem] mb-4" style={{ lineHeight: 1.6 }}>{result.audit?.summary || ''}</p>
                {/* V2 chips if present on analysis */}
                {(result as any).analysis?.risk_matrix && (
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {((result as any).analysis.risk_matrix.severity) && (
                      <span className={`px-2 py-1 text-[0.75rem] rounded ${
                        (result as any).analysis.risk_matrix.severity === 'Élevé' ? 'bg-red-100 text-red-800' :
                        (result as any).analysis.risk_matrix.severity === 'Moyen' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>Sévérité: {(result as any).analysis.risk_matrix.severity}</span>
                    )}
                    {((result as any).analysis.risk_matrix.proof_strength) && (
                      <span className="px-2 py-1 text-[0.75rem] rounded bg-blue-100 text-blue-800">Preuve: {(result as any).analysis.risk_matrix.proof_strength}</span>
                    )}
                    {((result as any).analysis.estimated_costs) && (
                      <span className="px-2 py-1 text-[0.75rem] rounded bg-gray-100 text-gray-800">Coûts: {((result as any).analysis.estimated_costs.amiable || '-')}/{((result as any).analysis.estimated_costs.judiciaire || '-')}</span>
                    )}
                  </div>
                )}
                {Array.isArray(result.audit?.risks) && result.audit!.risks.length > 0 && (
                  <div className="text-[0.875rem]" style={{ lineHeight: 1.6 }}>
                    <div className="mb-1" style={{ fontWeight: 600 }}>Points d'attention:</div>
                    <ul className="list-disc pl-5">
                      {result.audit!.risks.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="text-[0.75rem] text-muted-foreground mt-3" style={{ fontFamily: 'var(--font-mono)' }}>
                  <span>Urgence: {result.audit?.urgency}</span> • <span>Complexité: {result.audit?.complexity}</span>
                </div>
                {((result as any).analysis?.next_critical_step) && (
                  <div className="mt-3 text-[0.875rem] text-indigo-900 bg-indigo-50 border border-indigo-200 p-3">
                    <strong>Prochaine étape critique:</strong> {(result as any).analysis.next_critical_step}
                  </div>
                )}
              </div>

              {/* Template */}
              {result.recommendedTemplate && (
                <div className="bg-card border border-border p-6 lg:p-8">
                  <h2 className="text-[1.25rem] mb-2" style={{ fontWeight: 600 }}>Modèle recommandé</h2>
                  <div className="text-[1rem]" style={{ fontWeight: 600 }}>{result.recommendedTemplate.name}</div>
                  {result.recommendedTemplate.reason && (
                    <p className="text-[0.875rem] mt-1 text-muted-foreground">{result.recommendedTemplate.reason}</p>
                  )}
                  <div className="mt-2">
                    {result.recommendedTemplate.available ? (
                      <span className="px-2 py-1 text-[0.75rem] bg-green-50 text-green-800 border border-green-200">
                        <CheckCircle className="inline-block w-3 h-3 mr-1" />
                        Disponible gratuitement
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-[0.75rem] bg-amber-50 text-amber-800 border border-amber-200">
                        Plan Pro requis
                      </span>
                    )}
                  </div>
                  {result.recommendedTemplate.id && (
                    <button 
                      className="mt-4 px-6 py-2.5 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-[0.875rem]" 
                      onClick={() => {
                        const templateId = result.recommendedTemplate!.id || result.recommendedTemplate!.slug;
                        window.location.href = `/contracts/${templateId}`;
                      }}
                    >
                      Ouvrir le modèle →
                    </button>
                  )}
                  {result.needsLawyer && (
                    <div className="mt-3 text-[0.875rem] text-amber-800 bg-amber-50 border border-amber-200 p-3">
                      <AlertCircle className="inline-block w-4 h-4 mr-1" />
                      <strong>Attention:</strong> Votre situation est complexe. Nous recommandons aussi de consulter un avocat.
                    </div>
                  )}
                </div>
              )}

              {/* Lawyers */}
              {(result.needsLawyer || (result.recommendedLawyers && result.recommendedLawyers.length > 0)) && (
                <div className="bg-card border border-border p-6 lg:p-8">
                  <h2 className="text-[1.25rem] mb-4" style={{ fontWeight: 600 }}>Avocats recommandés</h2>
                  {!result.recommendedTemplate && (
                    <p className="text-[0.875rem] text-muted-foreground mb-4">Ce cas nécessite l'expertise d'un avocat spécialisé. Aucun template standard ne correspond à votre situation.</p>
                  )}
                  {result.recommendedLawyers && result.recommendedLawyers.length > 0 ? (
                    <>
                      <p className="text-[0.875rem] text-muted-foreground mb-4">
                        Basé sur votre localisation et votre situation, voici {result.recommendedLawyers.length} avocats spécialisés:
                      </p>
                      <div className="grid grid-cols-1 gap-4">
                        {result.recommendedLawyers.map((lawyer: any, i: number) => (
                          <div key={i} className="border border-border p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                              <div className="flex-1">
                                <h4 className="text-[1rem] font-semibold mb-1">{lawyer.nom || lawyer.name}</h4>
                                <p className="text-[0.875rem] text-muted-foreground mb-2">{lawyer.cabinet || lawyer.firm}</p>
                                
                                <div className="space-y-2 text-[0.875rem]">
                                  {lawyer.adresse && (
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                      <span>{lawyer.adresse}</span>
                                    </div>
                                  )}
                                  
                                  {lawyer.telephone && lawyer.telephone !== 'Non disponible' && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                      <a href={`tel:${lawyer.telephone}`} className="text-accent hover:underline">
                                        {lawyer.telephone}
                                      </a>
                                    </div>
                                  )}
                                  
                                  {lawyer.email && lawyer.email !== 'Non disponible' && (
                                    <div className="flex items-center gap-2">
                                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                      <a href={`mailto:${lawyer.email}?subject=Consultation juridique via Symione`} className="text-accent hover:underline">
                                        {lawyer.email}
                                      </a>
                                    </div>
                                  )}
                                  
                                  {lawyer.specialites && Array.isArray(lawyer.specialites) && lawyer.specialites.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {lawyer.specialites.map((spec: string, j: number) => (
                                        <span key={j} className="px-2 py-1 text-[0.75rem] bg-accent/10 text-accent border border-accent/20">
                                          {spec}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  
                                  {lawyer.experience && lawyer.experience !== 'Non précisée' && (
                                    <p className="text-[0.75rem] text-muted-foreground mt-2">
                                      <strong>Expérience:</strong> {lawyer.experience}
                                    </p>
                                  )}
                                </div>
                                
                                <button 
                                  className="mt-4 px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-[0.875rem] w-full"
                                  onClick={() => window.open(`mailto:${lawyer.email || 'contact@symi.io'}?subject=Consultation juridique via Symione`, '_blank')}
                                >
                                  Contacter
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-[0.75rem] text-muted-foreground mt-4 p-3 bg-amber-50 border border-amber-200">
                        ℹ️ Ces recommandations sont basées sur des recherches automatisées. 
                        Vérifiez toujours les qualifications et inscriptions au barreau avant consultation.
                      </p>
                    </>
                  ) : (
                    <div className="text-center p-6 bg-accent/5 border border-accent/10">
                      <p className="text-[0.875rem] text-muted-foreground mb-3">
                        Aucun avocat trouvé dans votre zone.
                      </p>
                      <a 
                        href="mailto:contact@symi.io"
                        className="text-accent hover:underline text-[0.75rem] uppercase tracking-[0.08em]"
                        style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                      >
                        Contactez-nous pour une mise en relation
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Soft CTA */}
              <div className="border border-border p-4 text-[0.875rem] bg-accent/5">
                Créez un compte pour sauvegarder vos consultations et générer des contrats personnalisés.
                <button onClick={() => (window.location.href = '/login')} className="ml-3 underline text-accent">Créer un compte</button>
              </div>

              {/* Deep analysis request (email follow-up) */}
              <div className="border border-border p-4 bg-card">
                <div className="text-[0.95rem] mb-2" style={{ fontWeight: 600 }}>Recevoir une étude approfondie par email</div>
                <p className="text-[0.875rem] text-muted-foreground mb-3">Vous recevrez une version détaillée (citations, jurisprudence, coûts, protocole) sous 30–120 minutes.</p>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="flex-1 px-3 py-2 bg-input-background border border-border"
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        const email = target.value.trim();
                        if (!email) return;
                        try {
                          const categoryValue = situationType || 'Général';
                          const urgencyMap: Record<string, number> = { 'tres_urgent': 9, 'urgent': 7, 'moyen': 5, 'pas_urgent': 3 };
                          await fetch('https://api.symione.com/api/conseiller/jobs/create', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ problem, category: categoryValue, urgency: urgencyMap[urgence] || 5, hasEvidence: hasProofs === 'oui', city, email })
                          });
                        } catch {}
                        target.value = '';
                        alert('Merci. Vous recevrez l’étude approfondie par email.');
                      }
                    }}
                  />
                  <button
                    className="px-4 py-2 border border-border"
                    onClick={async () => {
                      const input = (document.activeElement as HTMLInputElement)?.type === 'email'
                        ? (document.activeElement as HTMLInputElement)
                        : (document.querySelector('input[type="email"]') as HTMLInputElement);
                      const email = input?.value?.trim();
                      if (!email) return;
                      try {
                        const categoryValue = situationType || 'Général';
                        const urgencyMap: Record<string, number> = { 'tres_urgent': 9, 'urgent': 7, 'moyen': 5, 'pas_urgent': 3 };
                        await fetch('https://api.symione.com/api/conseiller/jobs/create', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ problem, category: categoryValue, urgency: urgencyMap[urgence] || 5, hasEvidence: hasProofs === 'oui', city, email })
                        });
                      } catch {}
                      if (input) input.value = '';
                      alert('Merci. Vous recevrez l’étude approfondie par email.');
                    }}
                  >
                    Demander l’étude par email
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          </div>
        {/* Right column: Chat-style results */}
        <div>
          <div className="bg-card border border-border p-4 lg:p-6 min-h-[520px] flex flex-col gap-4">
            {!result && !loading && (
              <div className="text-center text-[0.875rem] text-muted-foreground py-16">
                Décrivez votre situation à gauche pour recevoir une analyse juridique détaillée
              </div>
            )}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '120ms' }} />
                <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '240ms' }} />
              </div>
            )}

            {result && (
              <>
                {/* Message 1: Audit */}
                <div className="border border-border p-4">
                  <h4 className="text-[0.95rem] mb-2">📋 Analyse de votre situation</h4>
                  <p className="text-[0.875rem] mb-2"><strong>Résumé:</strong> {result.audit?.summary || ''}</p>
                  {Array.isArray(result.audit?.risks) && result.audit!.risks.length > 0 && (
                    <div className="text-[0.875rem] mb-2">
                      <strong>Points d'attention:</strong>
                      <ul className="list-disc pl-5">
                        {result.audit!.risks.map((p, i) => (<li key={i}>{p}</li>))}
                      </ul>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-[0.75rem] text-muted-foreground">
                    <span>Urgence: {result.audit?.urgency}</span>
                    <span>•</span>
                    <span>Complexité: {result.audit?.complexity}</span>
                  </div>
                </div>

                {/* Message 2: Template */}
                {result.recommendedTemplate && (
                  <div className="border border-border p-4">
                    <h4 className="text-[0.95rem] mb-2">📄 Template recommandé</h4>
                    <div className="text-[1rem]" style={{ fontWeight: 600 }}>{result.recommendedTemplate.name}</div>
                    {result.recommendedTemplate.reason && <p className="text-[0.875rem] text-muted-foreground mt-1">{result.recommendedTemplate.reason}</p>}
                    <div className="mt-2">
                      {result.recommendedTemplate.available ? (
                        <span className="px-2 py-1 text-[0.75rem] bg-green-50 text-green-800 border border-green-200">✓ Disponible gratuitement</span>
                      ) : (
                        <span className="px-2 py-1 text-[0.75rem] bg-amber-50 text-amber-800 border border-amber-200">⭐ Plan Pro requis</span>
                      )}
                    </div>
                    {result.recommendedTemplate.slug && (
                      <button className="mt-3 px-4 py-2 border border-border" onClick={() => (window.location.href = `/contracts/${result.recommendedTemplate!.slug}`)}>Utiliser ce template →</button>
                    )}
                    {result.needsLawyer && (
                      <p className="mt-3 text-[0.875rem] text-amber-800 bg-amber-50 border border-amber-200 p-3">⚠️ Situation complexe: nous recommandons aussi de consulter un avocat</p>
                    )}
                  </div>
                )}

                {/* Message 3: Lawyers if needed */}
                {Array.isArray(result.recommendedLawyers) && result.recommendedLawyers.length > 0 && (
                  <div className="border border-border p-4">
                    <h4 className="text-[0.95rem] mb-2">⚖️ Avocats recommandés {city ? `à ${city}` : ''}</h4>
                    {!result.recommendedTemplate && (
                      <p className="text-[0.875rem] text-muted-foreground mb-2">Ce cas nécessite l'expertise d'un avocat spécialisé. Aucun template standard ne correspond à votre situation.</p>
                    )}
                    <div className="space-y-3">
                      {result.recommendedLawyers.map((l, i) => (
                        <div key={i} className="border border-border p-3">
                          <div className="flex items-center justify-between">
                            <div className="text-[1rem]" style={{ fontWeight: 600 }}>{l.name}</div>
                            {typeof l.rating === 'number' && <div className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>{l.rating}/5</div>}
                          </div>
                          <div className="text-[0.875rem] text-muted-foreground">{[l.specialty, l.city, l.firm].filter(Boolean).join(' • ')}</div>
                          {l.phone && <a href={`tel:${l.phone}`} className="underline text-[0.8125rem] mt-1 inline-block">Contacter</a>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conversation history */}
                {messages.map((m) => (
                  <div key={m.id} className={`p-3 border ${m.role === 'assistant' ? 'bg-accent/5 border-accent/20' : 'bg-card border-border'}`}>{m.content}</div>
                ))}

                {/* Follow-up input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Question complémentaire..."
                    value={followUpQuestion}
                    onChange={(e) => setFollowUpQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleFollowUp()}
                    className="flex-1 px-3 py-2 bg-input-background border border-border"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  />
                  <button onClick={handleFollowUp} className="px-4 py-2 border border-border">→</button>
                </div>
              </>
            )}
          </div>
        </div>
        </div>
      </div>
      </div>

      {/* Legal Disclaimer Modal */}
      <LegalDisclaimerModal
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        onAccept={handleDisclaimerAccept}
        type="advisor"
      />
    </ErrorBoundary>
  );
}
