import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, AlertTriangle, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { apiClient } from '../lib/api-client';

interface Question {
  id: string;
  type: 'text' | 'select' | 'radio' | 'amount';
  label: string;
  subtext?: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface AnalysisPreview {
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  immediateSteps?: string[];
}

interface LawyerSuggestion {
  id: string;
  name: string;
  specialty: string;
  city: string;
  rating: number;
}

const FALLBACK_QUESTIONS: Question[] = [
  { id: 'q1', type: 'text', label: 'Quelle est la nature de votre projet ou problématique juridique ?', subtext: 'Décrivez en quelques mots votre situation', placeholder: "Ex: Création d'une SAS, litige commercial, rupture de contrat..." },
  { id: 'q2', type: 'select', label: 'Dans quelle catégorie juridique se situe votre situation ?', options: [
    { value: 'immobilier', label: 'Immobilier' },
    { value: 'travail', label: 'Droit du travail' },
    { value: 'commercial', label: 'Droit commercial' },
    { value: 'famille', label: 'Droit de la famille' },
    { value: 'autre', label: 'Autre' },
  ]},
  { id: 'q3', type: 'amount', label: "Quel est l'enjeu financier estimé de ce dossier ?", subtext: 'Indiquez un montant en euros', placeholder: 'Ex: 5000' },
  { id: 'q4', type: 'radio', label: 'Avez-vous déjà des documents ou preuves (contrats, emails, photos) ?', options: [ { value: 'yes', label: 'Oui' }, { value: 'no', label: 'Non' } ] },
  { id: 'q5', type: 'text', label: 'Dans quelle ville ou région se situe principalement cette affaire ?', placeholder: 'Ex: Paris, Lyon, Marseille' },
  { id: 'q6', type: 'select', label: 'Quel est votre objectif principal ?', options: [
    { value: 'conseil', label: 'Obtenir un conseil juridique' },
    { value: 'resolution_amiable', label: "Résoudre à l'amiable" },
    { value: 'procedure', label: 'Engager une procédure' },
    { value: 'prevention', label: 'Prévenir un risque' },
  ] },
  { id: 'q7', type: 'text', label: "Qui est la partie adverse ou l'autre partie impliquée ?", placeholder: 'Ex: Mon ancien employeur, un voisin, un client...' },
  { id: 'q8', type: 'radio', label: "Y a-t-il une procédure judiciaire déjà en cours ?", options: [ { value: 'yes', label: 'Oui' }, { value: 'no', label: 'Non' } ] },
  { id: 'q9', type: 'select', label: "Quel est le niveau d'urgence de votre situation ?", options: [
    { value: '10', label: 'Très urgent (48h)' }, { value: '7', label: 'Urgent (1 semaine)' }, { value: '5', label: 'Moyen (1 mois)' }, { value: '3', label: 'Faible (préventif)' }
  ] },
  { id: 'q10', type: 'text', label: 'Quelles sont les dates clés ou échéances importantes ?', placeholder: "Ex: Date de fin de contrat, date de l'incident..." },
  { id: 'q11', type: 'text', label: 'Quelles actions avez-vous déjà entreprises ?', placeholder: 'Ex: Lettre recommandée, appel téléphonique...' },
  { id: 'q12', type: 'radio', label: "Souhaitez-vous une recommandation d'avocat si nécessaire ?", options: [ { value: 'yes', label: 'Oui' }, { value: 'no', label: 'Non' } ] },
  { id: 'q13', type: 'text', label: "Avez-vous des préférences pour le type d'avocat (ex: jeune, expérimenté, cabinet) ?", placeholder: "Ex: Un avocat avec au moins 10 ans d'expérience" },
  { id: 'q14', type: 'select', label: 'Quelle est votre disponibilité pour un premier rendez-vous ?', options: [ { value: 'rapide', label: 'Très rapide (cette semaine)' }, { value: 'flexible', label: 'Flexible (2-3 semaines)' }, { value: 'pas_urgent', label: 'Pas urgent' } ] },
  { id: 'q15', type: 'text', label: "Y a-t-il des sensibilités particulières à prendre en compte ?", subtext: 'Ex: Confidentialité, médiatisation, relations personnelles...', placeholder: 'Ex: Je souhaite une discrétion absolue' },
  { id: 'q16', type: 'radio', label: "Avez-vous déjà consulté un autre professionnel du droit pour ce dossier ?", options: [ { value: 'yes', label: 'Oui' }, { value: 'no', label: 'Non' } ] },
  { id: 'q17', type: 'text', label: 'Quel est le résultat souhaité idéal pour cette situation ?', placeholder: 'Ex: Obtenir réparation, annuler un contrat, gagner un procès...' },
  { id: 'q18', type: 'text', label: "Y a-t-il d'autres informations importantes à ajouter ?", placeholder: 'Tout détail pertinent non couvert par les questions précédentes.' },
];

export default function ConseillerWizardView() {
  const [contextId, setContextId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(18);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(FALLBACK_QUESTIONS[0]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [analysis, setAnalysis] = useState<AnalysisPreview>({});
  const [lawyers, setLawyers] = useState<LawyerSuggestion[]>([]);
  const [userCity, setUserCity] = useState<string>('');

  const [isLoadingStep, setIsLoadingStep] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepTimeout, setStepTimeout] = useState(false);

  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  useEffect(() => {
    if (userCity) {
      fetchLawyers(userCity);
    }
  }, [userCity]);

  const fetchNextStep = async (answer: string) => {
    setIsLoadingStep(true);
    setError(null);
    setStepTimeout(false);

    const timeoutId = setTimeout(() => {
      setStepTimeout(true);
    }, 4000);

    try {
      let data: any;
      try {
        data = await apiClient.post<any>('/conseiller/step', { contextId, questionId: currentQuestion.id, answer });
      } catch {
        // Fallback locally if API route is missing
        const idx = FALLBACK_QUESTIONS.findIndex(q => q.id === currentQuestion.id);
        const next = FALLBACK_QUESTIONS[idx + 1];
        data = {
          contextId: contextId || `ctx_${Date.now()}`,
          nextQuestion: next || null,
          partialAnalysis: idx >= 1 ? { summary: `${answers['q1'] || ''}`.slice(0, 80) } : undefined,
          isFinished: !next,
        };
      }

      setContextId(data.contextId);
      setCurrentQuestion(data.nextQuestion || currentQuestion);
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));

      if (data.partialAnalysis) {
        setAnalysis(prev => ({ ...prev, ...data.partialAnalysis }));
      }

      if (currentQuestion.id === 'city' && answer) {
        setUserCity(answer);
      }

      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      setCurrentAnswer('');
    } catch (_err) {
      clearTimeout(timeoutId);
      setError('Impossible de charger la question suivante. Veuillez réessayer.');
    } finally {
      setIsLoadingStep(false);
    }
  };

  const fetchLawyers = async (city: string, specialty?: string) => {
    try {
      const params = new URLSearchParams({ city });
      if (specialty) params.append('specialty', specialty);

      const response = await fetch(`/api/conseiller/lawyers?${params}`);
      if (!response.ok) return;

      const data = await response.json();
      setLawyers(data.lawyers || []);
    } catch (_err) {
      // ignore silently
    }
  };

  const generateSummary = async () => {
    if (!contextId) return;
    setIsLoadingSummary(true);
    setError(null);
    try {
      let data: any;
      try {
        data = await apiClient.post<any>('/conseiller/summarize', { contextId });
      } catch {
        data = { analysis: {
          summary: `Analyse rapide basée sur ${Object.keys(answers).length} réponses.`,
          strengths: ['Description claire'],
          weaknesses: ['Préciser les dates clés'],
          immediateSteps: ['Consolider les preuves', 'Définir l’objectif principal']
        }};
      }
      setAnalysis(data.analysis || {});
    } catch (_err) {
      setError("Impossible de générer l'analyse. Veuillez réessayer.");
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const safeText = (v: any): string => (typeof v === 'string' ? v : v == null ? '' : String(v));
  const handleNext = async () => {
    if (!safeText(currentAnswer).trim()) return;
    setDirection('forward');
    if (currentStep === totalSteps) {
      await generateSummary();
    } else {
      await fetchNextStep(currentAnswer);
    }
  };

  const handlePrevious = () => {
    if (currentStep === 1) return;
    setDirection('backward');
    setCurrentStep(prev => prev - 1);
    const prevQuestionId = `q${currentStep - 1}`;
    setCurrentAnswer(answers[prevQuestionId] || '');
  };

  const handleSkip = async () => {
    setDirection('forward');
    await fetchNextStep('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && safeText(currentAnswer).trim()) {
      handleNext();
    }
  };

  const slideVariants = {
    enter: (dir: 'forward' | 'backward') => ({ x: dir === 'forward' ? 20 : -20, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: 'forward' | 'backward') => ({ x: dir === 'forward' ? -20 : 20, opacity: 0 })
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-[#EAECF0] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="tracking-tight">SYMIONE</h1>
              <p className="text-[#667085] font-mono text-sm mt-1">lex-engine</p>
            </div>
            <div className="text-sm text-[#667085]">Étape {currentStep} / {totalSteps}</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {stepTimeout && !error && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  La requête prend plus de temps que prévu.{' '}
                  <button onClick={handleSkip} className="underline hover:no-underline">
                    Passer cette question
                  </button>
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-white border border-[#EAECF0] rounded-xl p-8">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentQuestion.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                >
                  {isLoadingStep ? (
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-12 w-full mt-6" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-[#101828]">{currentStep}. {currentQuestion.label}</h2>
                        {currentQuestion.subtext && (
                          <p className="text-[#667085] text-sm mt-2">{currentQuestion.subtext}</p>
                        )}
                      </div>

                      <div>
                        {currentQuestion.type === 'text' && (
                          <Input
                            value={currentAnswer}
                            onChange={(e) => setCurrentAnswer(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={currentQuestion.placeholder}
                            className="w-full"
                            autoFocus
                          />
                        )}

                        {currentQuestion.type === 'amount' && (
                          <div className="relative">
                            <Input
                              type="number"
                              value={currentAnswer}
                              onChange={(e) => setCurrentAnswer(e.target.value)}
                              onKeyDown={handleKeyDown}
                              placeholder={currentQuestion.placeholder || '0'}
                              className="w-full pl-8"
                              autoFocus
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]">€</span>
                          </div>
                        )}

                        {currentQuestion.type === 'select' && currentQuestion.options && (
                          <Select value={currentAnswer} onValueChange={setCurrentAnswer}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une option" />
                            </SelectTrigger>
                            <SelectContent>
                              {currentQuestion.options.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {currentQuestion.type === 'radio' && currentQuestion.options && (
                          <RadioGroup value={currentAnswer} onValueChange={setCurrentAnswer}>
                            <div className="space-y-2">
                              {currentQuestion.options.map(opt => (
                                <div key={opt.value} className="flex items-center space-x-2">
                                  <RadioGroupItem value={opt.value} id={opt.value} />
                                  <Label htmlFor={opt.value} className="cursor-pointer text-sm">{opt.label}</Label>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between gap-4">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1 || isLoadingStep} className="w-20">
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex-1 flex items-center justify-center gap-4">
                <Button onClick={handleNext} disabled={!currentAnswer.trim() || isLoadingStep} className="min-w-32 bg-[#1B4CFF] hover:bg-[#1B4CFF]/90">
                  {currentStep === totalSteps ? 'Terminer' : 'Suivant'}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
                {currentStep < totalSteps && (
                  <button onClick={handleSkip} disabled={isLoadingStep} className="text-sm text-[#667085] hover:text-[#101828] underline">
                    Sauter
                  </button>
                )}
              </div>

              <div className="w-20" />
            </div>

            <div className="flex justify-center gap-2 pt-4" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className={`h-2 w-2 rounded-full transition-colors ${i < currentStep ? 'bg-[#1B4CFF]' : 'bg-[#EAECF0]'}`} />
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-4">
              <div className="bg-white border border-[#EAECF0] rounded-xl p-6 space-y-6">
                <div>
                  <h3 className="text-sm text-[#667085] mb-3">PRÉVISUALISATION D'AUDIT</h3>
                  {analysis.summary ? (
                    <p className="text-sm text-[#101828] mb-4">{analysis.summary}</p>
                  ) : (
                    <Skeleton className="h-20 w-full mb-4" />
                  )}
                </div>

                {analysis.strengths && analysis.strengths.length > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-[#19B37A]" />
                      <span className="text-sm">Points forts</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.strengths.map((strength, i) => (
                        <Badge key={i} variant="outline" className="border-[#19B37A] text-[#19B37A] bg-[#19B37A]/5">{strength}</Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#EAECF0]" />
                      <span className="text-sm text-[#667085]">Points forts</span>
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                )}

                {analysis.weaknesses && analysis.weaknesses.length > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-[#FFB020]" />
                      <span className="text-sm">Points de vigilance</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.weaknesses.map((weakness, i) => (
                        <Badge key={i} variant="outline" className="border-[#FFB020] text-[#FFB020] bg-[#FFB020]/5">{weakness}</Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-[#EAECF0]" />
                      <span className="text-sm text-[#667085]">Points de vigilance</span>
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                )}

                {analysis.immediateSteps && analysis.immediateSteps.length > 0 ? (
                  <div>
                    <h4 className="text-sm mb-3">Étapes immédiates</h4>
                    <ul className="space-y-2">
                      {analysis.immediateSteps.map((step, i) => (
                        <li key={i} className="text-sm text-[#667085] flex gap-2">
                          <span className="text-[#1B4CFF]">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h4 className="text-sm text-[#667085]">Étapes immédiates</h4>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                )}
              </div>

              {userCity && (
                <div className="bg-white border border-[#EAECF0] rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4 text-[#1B4CFF]" />
                    <h3 className="text-sm">Avocats recommandés</h3>
                    <span className="text-xs text-[#667085]">(optionnel)</span>
                  </div>
                  {lawyers.length > 0 ? (
                    <div className="space-y-3">
                      {lawyers.slice(0, 3).map(lawyer => (
                        <div key={lawyer.id} className="p-3 border border-[#EAECF0] rounded-lg hover:border-[#1B4CFF] transition-colors cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm">{lawyer.name}</p>
                              <p className="text-xs text-[#667085]">{lawyer.specialty}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">⭐ {lawyer.rating}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#667085]">Avocats disponibles à {userCity}...</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

