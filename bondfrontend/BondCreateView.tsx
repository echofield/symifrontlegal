import { motion } from "motion/react";
import { ArrowLeft, Sparkles, RotateCw, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { BondAPI } from "./lib/useBondApi";

interface BondCreateViewProps {
  onBack: () => void;
  onNavigate: (view: string, contractId?: string) => void;
}

type Step = 0 | 1 | 2 | 3 | 4;

type TemplateType = 'service' | 'travaux' | 'creation' | 'challenge' | 'hybrid';

interface Template { id: TemplateType; title: string; description: string; icon: string; }

interface Question { id: string; question: string; options?: string[]; }

interface Answer {
  questionId: string;
  value: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  deadline: string;
}

interface AIProposal {
  title: string;
  milestones: Milestone[];
  clauses: string[];
  risks: string[];
}

const templates: Template[] = [
  { id: 'service', title: 'Prestation de service', description: 'Pour missions de conseil, dev, design...', icon: '💼' },
  { id: 'travaux', title: 'Travaux', description: 'Chantier / construction', icon: '🧱' },
  { id: 'creation', title: 'Création artistique', description: 'Design, illustration, musique, vidéo...', icon: '🎨' },
  { id: 'challenge', title: 'Pacte entre amis', description: 'Défis / engagements personnels', icon: '🎮' },
  { id: 'hybrid', title: 'IA libre', description: "Décrivez entièrement votre besoin, l'IA s'adapte", icon: '🧠' }
];

const mockProposal: AIProposal = {
  title: "Développement application mobile - iOS & Android",
  milestones: [
    {
      id: "m1",
      title: "Phase de conception et wireframes",
      description: "Design UX/UI complet, wireframes interactifs, validation du parcours utilisateur",
      amount: 12000,
      deadline: "4 semaines"
    },
    {
      id: "m2",
      title: "Développement MVP (Minimum Viable Product)",
      description: "Développement des fonctionnalités core, intégration API, tests unitaires",
      amount: 28000,
      deadline: "10 semaines"
    },
    {
      id: "m3",
      title: "Tests, déploiement et formation",
      description: "Tests QA complets, déploiement stores, documentation et formation équipe",
      amount: 10000,
      deadline: "3 semaines"
    }
  ],
  clauses: [
    "Propriété intellectuelle transférée au client à la finalisation du projet",
    "Garantie de maintenance de 6 mois post-livraison",
    "Révisions illimitées durant chaque phase avant validation",
    "Paiement par jalon avec rétention de 10% jusqu'à livraison finale",
    "Clause de confidentialité mutuelle (NDA)"
  ],
  risks: [
    "Dépendance aux APIs tierces (vérifier disponibilité et documentation)",
    "Délais d'approbation stores (prévoir 2-3 semaines supplémentaires)",
    "Changements de scope en cours de projet (définir processus de change request)"
  ]
};

export function BondCreateView({ onBack, onNavigate }: BondCreateViewProps) {
  const [step, setStep] = useState<Step>(0);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [projectDescription, setProjectDescription] = useState("");
  const [estimatedBudget, setEstimatedBudget] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposal, setProposal] = useState<AIProposal | null>(null);
  
  const currentTemplate = templates.find(t => t.id === selectedTemplate);
  const [qa, setQa] = useState<Question[]>([]);

  // Load Q&A when moving to step 2
  useEffect(() => {
    if (step === 2 && selectedTemplate && selectedTemplate !== 'hybrid') {
      BondAPI.getQuestions(selectedTemplate)
        .then((r) => {
          const list = Array.isArray(r.questions) ? r.questions : [];
          // Map to simple Question shape
          setQa(list.map((q: any) => ({ id: q.id, question: q.question, options: q.options })));
        })
        .catch(() => setQa([]));
    }
  }, [step, selectedTemplate]);

  const handleTemplateSelect = (templateId: TemplateType) => {
    setSelectedTemplate(templateId);
  };
  
  const handleContinueFromTemplate = () => {
    if (selectedTemplate) {
      setStep(1);
    }
  };
  
  const handleContinueFromDescription = () => {
    if (selectedTemplate === 'hybrid') {
      setStep(3);
    } else {
      setStep(2);
    }
  };
  
  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => a.questionId === questionId ? { ...a, value } : a);
      }
      return [...prev, { questionId, value }];
    });
  };
  
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const ansObj = answers.reduce((acc, a) => { acc[a.questionId] = a.value; return acc; }, {} as Record<string,string>);
      const payload = {
        description: projectDescription,
        budget: Number(estimatedBudget) * 100,
        templateId: selectedTemplate,
        answers: ansObj,
      };
      const draft = await BondAPI.suggest(payload);
      // Map draft to AIProposal view model
      const mapped: AIProposal = {
        title: draft.title || 'Proposition de contrat',
        milestones: (draft.milestones || []).map((m: any, i: number) => ({
          id: `m${i + 1}`,
          title: m.title,
          description: m.description,
          amount: m.amount,
          deadline: m.deadline || ''
        })),
        clauses: draft.terms || draft.clauses || [],
        risks: draft.risks || [],
      };
      setProposal(mapped);
      setStep(3);
    } catch (e) {
      // no toast lib in scope; keep silent per instructions
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGenerating(false);
  };

  const handleValidate = () => {
    setStep(4);
  };

  const handleCreateContract = async () => {
    if (!proposal || !selectedTemplate) return;
    try {
      const payload = {
        title: proposal.title,
        payerId: 'payer_demo', // replace with real user id when available
        payeeId: 'payee_demo',
        currency: 'eur',
        termsJson: { terms: proposal.clauses },
        milestones: proposal.milestones.map((m) => ({ title: m.title, description: m.description, amount: m.amount })),
      };
      const created = await BondAPI.create(payload);
      onNavigate('bond-contract', created?.id || 'new');
    } catch {}
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-12">
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
              Retour au tableau de bord
            </span>
          </button>

          <div className="pb-6 border-b border-border">
            <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
              SYMI BOND / ASSISTANT DE CRÉATION
            </p>
            <h1 className="text-[2rem] md:text-[3rem] tracking-[-0.03em] mb-3" style={{ fontWeight: 600, lineHeight: 1.1 }}>
              Nouveau contrat
            </h1>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 mt-6">
              {[0, 1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[0.75rem] transition-all duration-200 ${
                    s === step 
                      ? 'border-accent bg-accent text-accent-foreground' 
                      : s < step 
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-muted-foreground'
                  }`} style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {s < step ? <Check className="w-4 h-4" strokeWidth={2.5} /> : s + 1}
                  </div>
                  {s < 4 && (
                    <div className={`h-0.5 w-8 transition-all duration-200 ${
                      s < step ? 'bg-accent' : 'bg-border'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Step 0: Template Selection */}
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'linear' }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-[1.25rem] mb-3 tracking-[-0.01em]" style={{ fontWeight: 600 }}>
                Quel type de contrat souhaitez-vous créer ?
              </h2>
              <p className="text-[0.875rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                Sélectionnez le template qui correspond le mieux à votre projet
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`border-2 p-6 text-left transition-all duration-200 hover:border-accent group ${
                    selectedTemplate === template.id 
                      ? 'border-accent bg-accent/5' 
                      : 'border-border'
                  }`}
                >
                  <div className="text-[2.5rem] mb-4">{template.icon}</div>
                  <h3 className="text-[1rem] mb-2" style={{ fontWeight: 600 }}>
                    {template.title}
                  </h3>
                  <p className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                    {template.description}
                  </p>
                  {selectedTemplate === template.id && (
                    <div className="mt-4 pt-4 border-t border-accent/20">
                      <div className="flex items-center gap-2 text-accent text-[0.75rem] uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                        <Check className="w-3.5 h-3.5" strokeWidth={2} />
                        Sélectionné
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleContinueFromTemplate}
              disabled={!selectedTemplate}
              className="px-12 py-5 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
            >
              <span className="text-[0.75rem] uppercase tracking-[0.12em]">Continuer</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="stroke-current">
                <path d="M2 7H12M12 7L8 3M12 7L8 11" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
            </button>
          </motion.div>
        )}

        {/* Step 1: Description */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'linear' }}
            className="space-y-8"
          >
            <div>
              <label className="block text-[0.75rem] uppercase tracking-[0.1em] mb-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                Décrivez votre projet ou mission
              </label>
              <Textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Ex: Développement d'une application mobile pour la gestion de stocks avec fonctionnalités de scan de codes-barres, synchronisation cloud, et tableau de bord analytique..."
                className="min-h-[200px] border-border focus-visible:ring-accent resize-none text-[0.9375rem]"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
              />
              <p className="text-[0.75rem] text-muted-foreground mt-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                Plus vous donnez de détails, plus la proposition sera précise
              </p>
            </div>

            <div>
              <label className="block text-[0.75rem] uppercase tracking-[0.1em] mb-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                Budget estimé (€)
              </label>
              <Input
                type="number"
                value={estimatedBudget}
                onChange={(e) => setEstimatedBudget(e.target.value)}
                placeholder="50000"
                className="border-border focus-visible:ring-accent text-[0.9375rem]"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
              />
            </div>

            <button
              onClick={handleContinueFromDescription}
              disabled={!projectDescription || !estimatedBudget}
              className="px-12 py-5 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
            >
              <span className="text-[0.75rem] uppercase tracking-[0.12em]">Continuer</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="stroke-current">
                <path d="M2 7H12M12 7L8 3M12 7L8 11" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
            </button>
          </motion.div>
        )}

        {/* Step 2: Smart Q&A */}
        {step === 2 && currentTemplate && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'linear' }}
            className="space-y-8"
          >
            <div>
              <Badge className="bg-accent/10 text-accent border-accent/20 border mb-4 text-[0.625rem] uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                {currentTemplate.icon} {currentTemplate.title}
              </Badge>
              <h2 className="text-[1.25rem] mb-3 tracking-[-0.01em]" style={{ fontWeight: 600 }}>
                Précisez les modalités de votre contrat
              </h2>
              <p className="text-[0.875rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                Répondez à ces questions pour personnaliser votre contrat
              </p>
            </div>

            <div className="space-y-6">
              {(qa.length ? qa : []).map((question, index) => {
                const answer = answers.find(a => a.questionId === question.id);
                
                return (
                  <div key={question.id} className="border border-border p-6">
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                          Question {index + 1}/{currentTemplate.questions.length}
                        </span>
                      </div>
                      <h3 className="text-[1rem]" style={{ fontWeight: 600 }}>
                        {question.question}
                      </h3>
                    </div>

                    {question.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {question.options.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleAnswer(question.id, option)}
                            className={`px-6 py-4 border-2 transition-all duration-200 text-left ${
                              answer?.value === option
                                ? 'border-accent bg-accent/5'
                                : 'border-border hover:border-accent/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                answer?.value === option
                                  ? 'border-accent bg-accent'
                                  : 'border-border'
                              }`}>
                                {answer?.value === option && (
                                  <div className="w-2 h-2 rounded-full bg-accent-foreground" />
                                )}
                              </div>
                              <span className="text-[0.875rem]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                                {option}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {!question.options && (
                      <Input
                        value={answer?.value || ''}
                        onChange={(e) => handleAnswer(question.id, e.target.value)}
                        placeholder="Votre réponse..."
                        className="border-border focus-visible:ring-accent text-[0.9375rem]"
                        style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-10 py-4 border border-border hover:border-foreground transition-all duration-200 inline-flex items-center gap-3"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                <span className="text-[0.75rem] uppercase tracking-[0.12em]">Retour</span>
              </button>
              <button
                onClick={handleGenerate}
                disabled={answers.length < currentTemplate.questions.length || isGenerating}
                className="px-12 py-5 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                    <span className="text-[0.75rem] uppercase tracking-[0.12em]">Génération en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" strokeWidth={2} />
                    <span className="text-[0.75rem] uppercase tracking-[0.12em]">Générer la proposition</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: AI Proposal */}
        {step === 3 && proposal && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'linear' }}
            className="space-y-8"
          >
            {/* Title */}
            <div className="pb-6 border-b border-border">
              <Badge className="bg-accent/10 text-accent border-accent/20 border mb-4 text-[0.625rem] uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                Proposition IA
              </Badge>
              <h2 className="text-[1.5rem] tracking-[-0.02em]" style={{ fontWeight: 600 }}>
                {proposal.title}
              </h2>
            </div>

            {/* Milestones */}
            <div>
              <h3 className="text-[0.75rem] uppercase tracking-[0.1em] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                <div className="w-1 h-1 rounded-full bg-accent" />
                Jalons proposés ({proposal.milestones.length})
              </h3>
              <div className="space-y-3">
                {proposal.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="border border-border p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                            Jalon {index + 1}
                          </span>
                          <span className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                            {milestone.deadline}
                          </span>
                        </div>
                        <h4 className="text-[1rem] mb-2" style={{ fontWeight: 600 }}>
                          {milestone.title}
                        </h4>
                        <p className="text-[0.875rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                          {milestone.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-[1.25rem] tracking-[-0.02em]" style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                          {milestone.amount.toLocaleString('fr-FR')} €
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                <span className="text-[0.75rem] uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                  Total
                </span>
                <span className="text-[1.5rem] tracking-[-0.02em]" style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  {proposal.milestones.reduce((sum, m) => sum + m.amount, 0).toLocaleString('fr-FR')} €
                </span>
              </div>
            </div>

            {/* Clauses */}
            <div>
              <h3 className="text-[0.75rem] uppercase tracking-[0.1em] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                <div className="w-1 h-1 rounded-full bg-accent" />
                Clauses contractuelles
              </h3>
              <div className="border border-border p-5">
                <ul className="space-y-3">
                  {proposal.clauses.map((clause, index) => (
                    <li key={index} className="flex items-start gap-3 text-[0.875rem]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                      <span className="text-accent mt-0.5">•</span>
                      <span>{clause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Risks */}
            <div>
              <h3 className="text-[0.75rem] uppercase tracking-[0.1em] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                <div className="w-1 h-1 rounded-full bg-destructive" />
                Points d'attention
              </h3>
              <div className="border border-border bg-muted/30 p-5">
                <ul className="space-y-3">
                  {proposal.risks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-3 text-[0.875rem]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                      <span className="text-destructive mt-0.5">⚠</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="px-10 py-4 border border-border hover:border-foreground transition-all duration-200 inline-flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <RotateCw className="w-4 h-4" strokeWidth={2} />
                )}
                <span className="text-[0.75rem] uppercase tracking-[0.12em]">Regénérer</span>
              </button>
              <button
                onClick={handleValidate}
                className="px-10 py-4 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 inline-flex items-center justify-center gap-3"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
              >
                <Check className="w-4 h-4" strokeWidth={2} />
                <span className="text-[0.75rem] uppercase tracking-[0.12em]">Valider cette version</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'linear' }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 rounded-full bg-accent/10 mx-auto mb-6 flex items-center justify-center">
              <Check className="w-8 h-8 text-accent" strokeWidth={2} />
            </div>
            <h2 className="text-[2rem] mb-4 tracking-[-0.02em]" style={{ fontWeight: 600 }}>
              Votre contrat est prêt
            </h2>
            <p className="text-[0.875rem] text-muted-foreground mb-10 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
              Le contrat a été généré avec succès. Vous pouvez maintenant l'envoyer aux parties concernées pour signature et activation.
            </p>
            <button
              onClick={handleCreateContract}
              className="px-12 py-5 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 inline-flex items-center gap-3"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
            >
              <span className="text-[0.75rem] uppercase tracking-[0.12em]">Créer le contrat</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="stroke-current">
                <path d="M2 7H12M12 7L8 3M12 7L8 11" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
