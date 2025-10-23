import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Check, Sparkles, Info } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface BondCreateViewProps {
  onBack: () => void;
  onNavigate: (view: string, contractId?: string) => void;
  onContractCreated?: (contractId: string) => void;
}

type Step = 0 | 1 | 2 | 3 | 4;
type TemplateId = "service" | "works" | "creative";

type QuestionType = "choice" | "text";

interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  legalContext?: string;
  placeholder?: string;
}

interface Template {
  id: TemplateId;
  title: string;
  description: string;
  roles: string;
  milestones: string;
  popular?: boolean;
  questions: Question[];
}

interface PreviewMilestone {
  name: string;
  description: string;
  amount: string;
  timing: string;
}

interface ContractPreview {
  templateTitle: string;
  heading: string;
  summary: string;
  keyPoints: string[];
  milestones: PreviewMilestone[];
  clauses: string[];
  legalNotes: string[];
}

const servoTransition = { duration: 0.3, ease: "linear" } as const;

const steps = ["Template", "Brief", "Questions", "Génération", "Aperçu"];

const templates: Template[] = [
  {
    id: "service",
    title: "Prestation de service",
    description: "Contrat de prestation (consulting, développement, design) avec jalons de livraison.",
    roles: "Client, Prestataire",
    milestones: "3-5 étapes",
    popular: true,
    questions: [
      {
        id: "client-type",
        question: "Quel est le type de client ?",
        type: "choice",
        options: ["Particulier", "Professionnel", "Copropriété", "Collectivité"],
        legalContext: "Détermine le régime applicable (B2C ou B2B) et les obligations d'information ou de garantie à prévoir."
      },
      {
        id: "service-payment",
        question: "Quelle structure de paiement souhaitez-vous ?",
        type: "choice",
        options: ["Paiement unique", "Paiement par jalons", "Abonnement mensuel"],
        legalContext: "Les modalités de facturation doivent préciser les jalons, délais de paiement et pénalités de retard (art. L441-10 C. com.)."
      },
      {
        id: "confidentiality-level",
        question: "Quel niveau de confidentialité souhaitez-vous appliquer ?",
        type: "choice",
        options: [
          "Confidentialité stricte (NDA dédiée)",
          "Clause standard de confidentialité",
          "Pas de clause spécifique"
        ],
        legalContext: "La confidentialité encadre l'usage des informations sensibles et peut nécessiter un accord distinct avant la phase d'audit."
      },
      {
        id: "ip-rights",
        question: "Quelle cession des droits de propriété intellectuelle est prévue ?",
        type: "choice",
        options: [
          "Transfert complet des droits",
          "Transfert partiel (usage défini)",
          "Licence d'utilisation"
        ],
        legalContext: "Les droits patrimoniaux doivent être cédés par écrit en détaillant l'étendue, la durée et le territoire (art. L131-3 CPI)."
      },
      {
        id: "service-timeline",
        question: "Quel est le délai de la mission ?",
        type: "choice",
        options: ["Moins d'un mois", "1 à 3 mois", "3 à 6 mois", "Plus de 6 mois"],
        legalContext: "Le calendrier influence les pénalités de retard et la planification des jalons contractuels."
      }
    ]
  },
  {
    id: "works",
    title: "Contrat de travaux",
    description: "Opérations de construction, rénovation ou aménagement avec garanties spécifiques.",
    roles: "Maître d'ouvrage, Entrepreneur",
    milestones: "Ouverture, exécution, réception",
    questions: [
      {
        id: "works-type",
        question: "Quel type de chantier est concerné ?",
        type: "choice",
        options: ["Construction neuve", "Rénovation lourde", "Extension", "Aménagement intérieur"],
        legalContext: "La nature des travaux influe sur les autorisations préalables et le régime de responsabilité du constructeur."
      },
      {
        id: "works-insurance",
        question: "Disposez-vous d'une assurance décennale ?",
        type: "choice",
        options: ["Oui, décennale obligatoire", "Non, non nécessaire (petits travaux)"],
        legalContext: "L'assurance décennale est obligatoire pour la plupart des travaux structurels (art. L241-1 Code des assurances)."
      },
      {
        id: "works-payment",
        question: "Comment seront planifiés les paiements ?",
        type: "choice",
        options: ["Acompte 30% + solde", "Échelonné par jalons (loi Scrivener)", "Mensuel selon avancement"],
        legalContext: "Les paiements échelonnés doivent respecter la loi Scrivener pour les particuliers et préciser les retenues de garantie."
      },
      {
        id: "works-duration",
        question: "Quelle est la durée prévisionnelle des travaux ?",
        type: "choice",
        options: ["Moins de 3 mois", "3 à 6 mois", "6 à 12 mois", "Plus de 12 mois"],
        legalContext: "Le calendrier doit intégrer pénalités de retard et modalités de réception (procès-verbal, réserves)."
      }
    ]
  },
  {
    id: "creative",
    title: "Projet artistique / création",
    description: "Production créative (design, illustration, vidéo, musique) avec gestion des droits d'auteur.",
    roles: "Client, Créateur",
    milestones: "Brief, production, livraison",
    questions: [
      {
        id: "creative-type",
        question: "Quel type de création réalisez-vous ?",
        type: "choice",
        options: ["Design graphique", "Illustration", "Production vidéo", "Composition musicale", "Photographie", "Autre"],
        legalContext: "Chaque discipline a ses usages (formats, délais de remise, livrables source) à préciser contractuellement."
      },
      {
        id: "creative-rights",
        question: "Comment gérez-vous la cession des droits d'auteur ?",
        type: "choice",
        options: [
          "Cession complète des droits (tous supports)",
          "Cession limitée (durée/supports définis)",
          "Licence exclusive",
          "Licence non-exclusive"
        ],
        legalContext: "Une cession doit détailler les modes d'exploitation autorisés et respecter le droit moral de l'auteur."
      },
      {
        id: "creative-revisions",
        question: "Combien de cycles de révision incluez-vous ?",
        type: "choice",
        options: [
          "1 ronde de corrections",
          "2 rondes de corrections",
          "3 rondes de corrections",
          "Corrections illimitées encadrées"
        ],
        legalContext: "Définir les révisions évite les demandes illimitées et encadre les avenants hors périmètre initial."
      },
      {
        id: "creative-usage",
        question: "Pour quel usage la création sera-t-elle exploitée ?",
        type: "choice",
        options: [
          "Usage commercial (publicité/vente)",
          "Usage interne (communication corporate)",
          "Usage web & réseaux sociaux",
          "Usage personnel uniquement"
        ],
        legalContext: "L'usage final conditionne les droits cédés, les mentions de crédit et les redevances éventuelles (SACEM, ADAGP)."
      }
    ]
  }
];

const formatCurrency = (value: number | null | undefined) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "Non défini";
  }
  return value.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  });
};

const parseBudgetValue = (raw: string): number | null => {
  const sanitized = raw.replace(/[^0-9.,]/g, "").replace(/,/g, ".");
  const numeric = Number.parseFloat(sanitized);
  return Number.isFinite(numeric) ? numeric : null;
};

const allocateAmount = (total: number | null, ratio: number) => {
  if (!total) return "Inclus dans le forfait";
  const amount = Math.round(total * ratio);
  return formatCurrency(amount);
};

const buildPreview = (
  template: Template,
  answers: Record<string, string>,
  description: string,
  budget: string
): ContractPreview => {
  const budgetValue = parseBudgetValue(budget);
  const descriptionText = description.trim().length > 0 ? description.trim() : "Projet en cours de définition";

  if (template.id === "service") {
    const clientType = answers["client-type"] || "Professionnel";
    const payment = answers["service-payment"] || "Paiement par jalons";
    const confidentiality = answers["confidentiality-level"] || "Clause standard de confidentialité";
    const ipRights = answers["ip-rights"] || "Transfert complet des droits";
    const timeline = answers["service-timeline"] || "3 à 6 mois";

    const milestones: PreviewMilestone[] = [
      {
        name: "Cadrage & préparation",
        description: "Ateliers de cadrage, plan de projet détaillé, validation du périmètre fonctionnel.",
        amount: allocateAmount(budgetValue, 0.3),
        timing: "Semaine 1"
      },
      {
        name: "Exécution & production",
        description: "Développement des livrables, points d'avancement hebdomadaires, recettes intermédiaires.",
        amount: allocateAmount(budgetValue, 0.5),
        timing: "Phase centrale"
      },
      {
        name: "Recette & transfert",
        description: "Tests finaux, transfert des livrables sources, formation éventuelle.",
        amount: allocateAmount(budgetValue, 0.2),
        timing: timeline
      }
    ];

    const clauses = [
      `Paiement : ${payment} avec facture à l'issue de chaque jalon validé.`,
      `Confidentialité : ${confidentiality}. Les informations sensibles sont protégées pendant toute la mission et 24 mois après.`,
      `Propriété intellectuelle : ${ipRights}. La clause précise la date de transfert et les formats remis.`
    ];

    const legalNotes: string[] = [];
    if (clientType === "Particulier") {
      legalNotes.push("Contrat B2C : intégrer droit de rétractation de 14 jours et garantie légale de conformité.");
    }
    if (payment === "Paiement par jalons") {
      legalNotes.push("Définir précisément les critères de validation des jalons pour déclencher la facturation.");
    }
    if (confidentiality === "Confidentialité stricte (NDA dédiée)") {
      legalNotes.push("Prévoir signature d'un accord de confidentialité distinct avant tout échange de données sensibles.");
    }

    return {
      templateTitle: template.title,
      heading: `Contrat ${template.title}`,
      summary: `Le contrat encadre une mission ${clientType.toLowerCase()} avec un budget estimé à ${formatCurrency(budgetValue)}. ${descriptionText}`,
      keyPoints: [
        `Structure de paiement : ${payment}.`,
        `Calendrier indicatif : ${timeline}.`,
        `Gestion des droits : ${ipRights}.`,
        `Confidentialité : ${confidentiality}.`
      ],
      milestones,
      clauses,
      legalNotes
    };
  }

  if (template.id === "works") {
    const worksType = answers["works-type"] || "Construction neuve";
    const insurance = answers["works-insurance"] || "Oui, décennale obligatoire";
    const payment = answers["works-payment"] || "Acompte 30% + solde";
    const duration = answers["works-duration"] || "3 à 6 mois";

    const milestones: PreviewMilestone[] = [
      {
        name: "Préparation chantier",
        description: "Déclaration préalable, installation, validation des plans d'exécution.",
        amount: allocateAmount(budgetValue, 0.3),
        timing: "Avant ouverture"
      },
      {
        name: "Exécution des travaux",
        description: "Réalisation des ouvrages, réunions de chantier, comptes-rendus hebdomadaires.",
        amount: allocateAmount(budgetValue, 0.5),
        timing: duration
      },
      {
        name: "Réception & levée des réserves",
        description: "Procès-verbal de réception, levée des réserves, remise des DOE.",
        amount: allocateAmount(budgetValue, 0.2),
        timing: "Clôture"
      }
    ];

    const clauses = [
      `Assurance : ${insurance}. L'attestation est annexée au contrat.`,
      `Paiement : ${payment} avec retenue de garantie de 5% jusqu'à la levée des réserves.`,
      `Planning : durée prévisionnelle ${duration} incluant réunions de chantier et procédures de réception.`
    ];

    const legalNotes: string[] = [];
    if (insurance === "Oui, décennale obligatoire") {
      legalNotes.push("Vérifier la validité de l'assurance décennale pour l'activité déclarée.");
    } else {
      legalNotes.push("Préciser par écrit pourquoi la décennale n'est pas requise (travaux de faible ampleur).");
    }
    if (payment === "Échelonné par jalons (loi Scrivener)") {
      legalNotes.push("Respecter le calendrier de paiement légal pour les particuliers (loi du 3 janvier 1967).");
    }
    if (duration === "Plus de 12 mois") {
      legalNotes.push("Prévoir clause de révision de prix et pénalités de retard adaptées aux longs chantiers.");
    }

    return {
      templateTitle: template.title,
      heading: `Contrat ${template.title}`,
      summary: `Le chantier concerne : ${worksType.toLowerCase()}. Budget indicatif ${formatCurrency(budgetValue)}. ${descriptionText}`,
      keyPoints: [
        `Type de travaux : ${worksType}.`,
        `Assurance : ${insurance}.`,
        `Modalités de paiement : ${payment}.`,
        `Durée prévisionnelle : ${duration}.`
      ],
      milestones,
      clauses,
      legalNotes
    };
  }

  const creationType = answers["creative-type"] || "Design graphique";
  const rights = answers["creative-rights"] || "Cession complète des droits (tous supports)";
  const revisions = answers["creative-revisions"] || "2 rondes de corrections";
  const usage = answers["creative-usage"] || "Usage web & réseaux sociaux";

  const milestones: PreviewMilestone[] = [
    {
      name: "Immersion & moodboard",
      description: "Collecte des références, moodboard détaillé, validation du ton visuel.",
      amount: allocateAmount(budgetValue, 0.3),
      timing: "Semaine 1"
    },
    {
      name: "Production créative",
      description: "Proposition initiale, itérations selon le nombre de révisions prévues.",
      amount: allocateAmount(budgetValue, 0.4),
      timing: "Phase centrale"
    },
    {
      name: "Livraison finale",
      description: "Remise des fichiers haute définition, exports optimisés selon l'usage ${usage.toLowerCase()}.",
      amount: allocateAmount(budgetValue, 0.3),
      timing: "Clôture"
    }
  ];

  const clauses = [
    `Droits d'auteur : ${rights}. La clause rappelle le respect du droit moral et les mentions de crédit.`,
    `Révisions : ${revisions} incluses. Au-delà, un devis additionnel est requis.`,
    `Usage final : ${usage}. Les livrables sont fournis dans les formats adaptés.`
  ];

  const legalNotes: string[] = [];
  if (rights === "Cession complète des droits (tous supports)") {
    legalNotes.push("Fixer le périmètre de la cession (territoire, durée) et prévoir le paiement intégral avant transfert complet.");
  }
  if (rights === "Licence exclusive") {
    legalNotes.push("L'exclusivité doit préciser la durée et les canaux pour éviter toute ambiguïté.");
  }
  if (usage === "Usage commercial (publicité/vente)") {
    legalNotes.push("Vérifier les droits tiers (modèles, polices, musiques) avant exploitation commerciale.");
  }
  if (revisions === "Corrections illimitées encadrées") {
    legalNotes.push("Encadrer les demandes par un processus écrit pour éviter le scope creep.");
  }

  return {
    templateTitle: template.title,
    heading: `Contrat ${template.title}`,
    summary: `Création : ${creationType.toLowerCase()} destinée à ${usage.toLowerCase()}. Budget estimé ${formatCurrency(budgetValue)}. ${descriptionText}`,
    keyPoints: [
      `Discipline : ${creationType}.`,
      `Cession des droits : ${rights}.`,
      `Nombre de révisions : ${revisions}.`,
      `Usage prévu : ${usage}.`
    ],
    milestones,
    clauses,
    legalNotes
  };
};

export function BondCreateView({ onBack, onNavigate, onContractCreated }: BondCreateViewProps) {
  const [step, setStep] = useState<Step>(0);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(null);
  const [projectDescription, setProjectDescription] = useState("");
  const [estimatedBudget, setEstimatedBudget] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<ContractPreview | null>(null);

  const generationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentTemplate = useMemo(() => templates.find(t => t.id === selectedTemplate) || null, [selectedTemplate]);
  const currentQuestion = step === 2 && currentTemplate ? currentTemplate.questions[currentQuestionIndex] : null;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : "";

  const canContinueTemplate = Boolean(selectedTemplate);
  const canContinueDescription = projectDescription.trim().length > 0 && estimatedBudget.trim().length > 0;
  const canProceedQuestion = Boolean(currentAnswer && currentAnswer.trim().length > 0);

  useEffect(() => {
    return () => {
      if (generationTimer.current) {
        clearTimeout(generationTimer.current);
      }
    };
  }, []);

  const resetFlow = () => {
    setStep(0);
    setProjectDescription("");
    setEstimatedBudget("");
    setAnswers({});
    setCurrentQuestionIndex(0);
    setPreview(null);
    setIsGenerating(false);
  };

  const handleTemplateSelect = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setPreview(null);
  };

  const handleContinueFromTemplate = () => {
    if (!canContinueTemplate) return;
    setStep(1);
  };

  const handleBackToTemplates = () => {
    setStep(0);
    setAnswers({});
    setCurrentQuestionIndex(0);
  };

  const handleContinueFromDescription = () => {
    if (!canContinueDescription || !currentTemplate) return;
    setStep(2);
    setCurrentQuestionIndex(0);
  };

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNextQuestion = () => {
    if (!currentTemplate || !currentQuestion) return;

    if (currentQuestionIndex < currentTemplate.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      startGeneration();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex === 0) {
      setStep(1);
    } else {
      setCurrentQuestionIndex(prevIndex => Math.max(0, prevIndex - 1));
    }
  };

  const startGeneration = () => {
    if (!currentTemplate) return;
    setStep(3);
    setIsGenerating(true);

    if (generationTimer.current) {
      clearTimeout(generationTimer.current);
    }

    generationTimer.current = setTimeout(() => {
      const previewData = buildPreview(currentTemplate, answers, projectDescription, estimatedBudget);
      setPreview(previewData);
      setIsGenerating(false);
      setStep(4);
    }, 3000);
  };

  const handleEditPreview = () => {
    setStep(2);
    setIsGenerating(false);
    if (generationTimer.current) {
      clearTimeout(generationTimer.current);
    }
  };

  const handleFinalizeContract = () => {
    const generatedId = `bond-${Date.now()}`;
    if (onContractCreated) {
      onContractCreated(generatedId);
    } else {
      onNavigate("bond-contract", generatedId);
    }
    resetFlow();
  };

  const templateBadge = currentTemplate ? (
    <Badge
      className="bg-accent/10 text-accent border border-accent/20 text-[0.625rem] uppercase tracking-[0.1em]"
      style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}
    >
      {currentTemplate.title}
    </Badge>
  ) : null;

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={servoTransition}
          className="mb-12"
        >
          <button
            onClick={() => {
              if (step === 0) {
                onBack();
              } else if (step === 1) {
                handleBackToTemplates();
              } else if (step === 2) {
                handlePreviousQuestion();
              } else if (step === 3) {
                setStep(2);
                setIsGenerating(false);
                if (generationTimer.current) {
                  clearTimeout(generationTimer.current);
                }
              } else if (step === 4) {
                handleEditPreview();
              }
            }}
            className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" strokeWidth={1.5} />
            <span
              className="text-[0.625rem] uppercase tracking-[0.12em]"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
            >
              Retour
            </span>
          </button>

          <div className="pb-6 border-b border-border">
            <p
              className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-3"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
            >
              SYMIONE LEX-ENGINE / BOND CONTRACT WIZARD
            </p>
            <h1
              className="text-[2rem] md:text-[3rem] tracking-[-0.03em] mb-6"
              style={{ fontWeight: 600, lineHeight: 1.1 }}
            >
              Nouveau contrat Bond
            </h1>

            <div className="grid grid-cols-5 gap-2">
              {steps.map((label, index) => {
                const active = index === step;
                const completed = index < step;
                return (
                  <div key={label} className="flex flex-col gap-2">
                    <div
                      className={`h-1 transition-colors duration-200 ${
                        completed ? "bg-accent" : active ? "bg-accent/60" : "bg-border"
                      }`}
                    />
                    <div
                      className={`border px-3 py-3 text-[0.625rem] uppercase tracking-[0.1em] transition-colors duration-200 ${
                        active ? "border-accent text-foreground" : completed ? "border-accent/40 text-accent" : "border-border text-muted-foreground"
                      }`}
                      style={{ fontFamily: "var(--font-mono)", fontWeight: active ? 600 : 400 }}
                    >
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {step === 0 && (
          <motion.div
            key="step-templates"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={servoTransition}
            className="space-y-8"
          >
            <div className="max-w-2xl">
              <h2 className="text-[1.25rem] mb-3 tracking-[-0.01em]" style={{ fontWeight: 600 }}>
                Sélectionnez un template contractuel
              </h2>
              <p
                className="text-[0.875rem] text-muted-foreground"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 300 }}
              >
                Trois modèles optimisés pour le droit français. Choisissez celui qui correspond le mieux à votre situation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => {
                const isSelected = selectedTemplate === template.id;
                return (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`border p-8 lg:p-10 text-left transition-all duration-200 hover:border-accent/50 ${
                      isSelected ? "border-accent bg-accent/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-[1.125rem] mb-2 tracking-[-0.005em]" style={{ fontWeight: 600 }}>
                          {template.title}
                        </h3>
                        <p
                          className="text-[0.875rem] text-muted-foreground"
                          style={{ fontFamily: "var(--font-mono)", fontWeight: 300 }}
                        >
                          {template.description}
                        </p>
                      </div>
                      {template.popular && (
                        <Badge
                          className="bg-accent text-accent-foreground text-[0.625rem] uppercase tracking-[0.1em]"
                          style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}
                        >
                          Populaire
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2 text-[0.75rem]" style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}>
                      <div className="text-muted-foreground">■ RÔLES : {template.roles}</div>
                      <div className="text-muted-foreground">■ JALONS : {template.milestones}</div>
                    </div>

                    {isSelected && (
                      <div className="mt-6 pt-6 border-t border-accent/20 flex items-center gap-3 text-accent">
                        <div className="w-5 h-5 flex items-center justify-center border border-accent">
                          <Check className="w-3 h-3" strokeWidth={2} />
                        </div>
                        <span
                          className="text-[0.75rem] uppercase tracking-[0.12em]"
                          style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}
                        >
                          Sélectionné
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div>
              <button
                onClick={handleContinueFromTemplate}
                disabled={!canContinueTemplate}
                className="px-12 py-5 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}
              >
                <span className="text-[0.75rem] uppercase tracking-[0.12em]">Continuer</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="stroke-current">
                  <path d="M2 7H12M12 7L8 3M12 7L8 11" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}

        {step === 1 && currentTemplate && (
          <motion.div
            key="step-brief"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={servoTransition}
            className="space-y-8"
          >
            <div className="flex flex-col gap-4">
              {templateBadge}
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
                <div>
                  <label
                    className="block text-[0.75rem] uppercase tracking-[0.1em] mb-3"
                    style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}
                  >
                    Décrivez votre projet
                  </label>
                  <Textarea
                    value={projectDescription}
                    onChange={(event) => setProjectDescription(event.target.value)}
                    placeholder="Ex : mission de conseil tech incluant audit cybersécurité, rédaction de recommandations et accompagnement de mise en œuvre."
                    className="min-h-[200px] border border-border bg-background focus-visible:ring-0 focus-visible:outline-none"
                    style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
                  />
                  <p
                    className="text-[0.75rem] text-muted-foreground mt-2"
                    style={{ fontFamily: "var(--font-mono)", fontWeight: 300 }}
                  >
                    Plus le contexte est précis, plus la proposition contractuelle sera fine.
                  </p>
                </div>
                <div className="border border-border p-6">
                  <label
                    className="block text-[0.75rem] uppercase tracking-[0.1em] mb-3"
                    style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}
                  >
                    Budget estimé (€)
                  </label>
                  <Input
                    value={estimatedBudget}
                    onChange={(event) => setEstimatedBudget(event.target.value)}
                    placeholder="50000"
                    inputMode="decimal"
                    className="h-12 border border-border px-4 focus-visible:ring-0 focus-visible:outline-none"
                    style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
                  />
                  <p
                    className="text-[0.75rem] text-muted-foreground mt-2"
                    style={{ fontFamily: "var(--font-mono)", fontWeight: 300 }}
                  >
                    Indiquez un montant HT estimatif. Le système calcule les jalons proposés.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToTemplates}
                className="px-10 py-4 border border-border hover:border-foreground transition-all duration-200 inline-flex items-center gap-3"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                <span className="text-[0.75rem] uppercase tracking-[0.12em]">Retour</span>
              </button>
              <button
                onClick={handleContinueFromDescription}
                disabled={!canContinueDescription}
                className="px-12 py-5 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}
              >
                <span className="text-[0.75rem] uppercase tracking-[0.12em]">Continuer</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="stroke-current">
                  <path d="M2 7H12M12 7L8 3M12 7L8 11" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && currentTemplate && currentQuestion && (
          <motion.div
            key="step-questions"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={servoTransition}
            className="space-y-8"
          >
            <div className="flex flex-col gap-4">
              {templateBadge}
              <div>
                <p
                  className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground mb-3"
                  style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}
                >
                  Question {currentQuestionIndex + 1}/{currentTemplate.questions.length}
                </p>
                <h2 className="text-[1.25rem] mb-3 tracking-[-0.01em]" style={{ fontWeight: 600 }}>
                  {currentQuestion.question}
                </h2>
                {currentQuestion.legalContext && (
                  <div className="bg-accent/5 border border-accent/20 p-4 flex items-start gap-3">
                    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Info className="w-3 h-3" strokeWidth={2} />
                    </div>
                    <p
                      className="text-[0.75rem] text-muted-foreground"
                      style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
                    >
                      {currentQuestion.legalContext}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="block text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}
              >
                Votre réponse
              </label>
              {currentQuestion.type === "choice" && currentQuestion.options && (
                <Select
                  value={currentAnswer || undefined}
                  onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
                >
                  <SelectTrigger
                    className="h-12 px-4 border border-border bg-background hover:border-accent/50 transition-colors duration-200"
                    style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
                  >
                    <SelectValue placeholder="Sélectionnez une option..." />
                  </SelectTrigger>
                  <SelectContent
                    className="border border-border bg-background"
                    style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
                  >
                    {currentQuestion.options.map((option) => (
                      <SelectItem
                        key={option}
                        value={option}
                        className="text-[0.875rem] py-3 px-4 border-b border-border last:border-0 transition-colors duration-200 data-[highlighted]:bg-accent/10 data-[state=checked]:bg-accent/10"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {currentQuestion.type === "text" && (
                <Input
                  value={currentAnswer || ""}
                  onChange={(event) => handleAnswer(currentQuestion.id, event.target.value)}
                  placeholder={currentQuestion.placeholder || "Votre réponse"}
                  className="h-12 border border-border px-4 focus-visible:ring-0 focus-visible:outline-none"
                  style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
                />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handlePreviousQuestion}
                className="px-10 py-4 border border-border hover:border-foreground transition-all duration-200 inline-flex items-center gap-3"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                <span className="text-[0.75rem] uppercase tracking-[0.12em]">
                  {currentQuestionIndex === 0 ? "Retour" : "Question précédente"}
                </span>
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={!canProceedQuestion}
                className="px-12 py-5 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}
              >
                {currentQuestionIndex === currentTemplate.questions.length - 1 ? (
                  <>
                    <Sparkles className="w-4 h-4" strokeWidth={2} />
                    <span className="text-[0.75rem] uppercase tracking-[0.12em]">Générer la proposition</span>
                  </>
                ) : (
                  <>
                    <span className="text-[0.75rem] uppercase tracking-[0.12em]">Question suivante</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="stroke-current">
                      <path d="M2 7H12M12 7L8 3M12 7L8 11" strokeWidth="1.5" strokeLinecap="square" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step-generation"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={servoTransition}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <div className="w-16 h-16 border-2 border-accent border-t-transparent animate-spin" />
            <h2 className="text-[1.5rem] tracking-[-0.02em]" style={{ fontWeight: 600 }}>
              Génération de votre contrat…
            </h2>
            <p
              className="text-[0.875rem] text-muted-foreground text-center max-w-lg"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 300 }}
            >
              Le moteur lex-engine consolide les jalons, clauses et obligations légales selon vos réponses.
            </p>
          </motion.div>
        )}

        {step === 4 && preview && (
          <motion.div
            key="step-preview"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={servoTransition}
            className="space-y-10"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 border border-accent/30 bg-accent/10 flex items-center justify-center">
                <Check className="w-8 h-8 text-accent" strokeWidth={2} />
              </div>
              <h2 className="text-[2rem] tracking-[-0.02em]" style={{ fontWeight: 600 }}>
                Contrat généré avec succès
              </h2>
              <p
                className="text-[0.875rem] text-muted-foreground max-w-2xl"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 300 }}
              >
                Révisez la synthèse ci-dessous avant validation. Vous pouvez revenir aux questions pour ajuster un paramètre.
              </p>
            </div>

            <div className="border border-border p-8 lg:p-10 space-y-8">
              <div className="space-y-3">
                {templateBadge}
                <h3 className="text-[1.5rem] tracking-[-0.02em]" style={{ fontWeight: 600 }}>
                  {preview.heading}
                </h3>
                <p
                  className="text-[0.875rem] text-muted-foreground"
                  style={{ fontFamily: "var(--font-mono)", fontWeight: 300 }}
                >
                  {preview.summary}
                </p>
              </div>

              <div>
                <h4 className="text-[0.75rem] uppercase tracking-[0.1em] mb-3" style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>
                  Synthèse opérationnelle
                </h4>
                <ul className="space-y-2">
                  {preview.keyPoints.map((point) => (
                    <li
                      key={point}
                      className="text-[0.875rem]"
                      style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
                    >
                      • {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-[0.75rem] uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>
                  Jalons et paiements proposés
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {preview.milestones.map((milestone) => (
                    <div key={milestone.name} className="border border-border p-4 space-y-2">
                      <div className="text-[0.75rem] uppercase tracking-[0.1em] text-muted-foreground" style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>
                        {milestone.name}
                      </div>
                      <div className="text-[0.875rem]" style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}>
                        {milestone.description}
                      </div>
                      <div className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>
                        {milestone.amount} · {milestone.timing}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[0.75rem] uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>
                  Clauses essentielles
                </h4>
                <div className="border border-border p-6 space-y-3">
                  {preview.clauses.map((clause) => (
                    <p
                      key={clause}
                      className="text-[0.875rem]"
                      style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
                    >
                      • {clause}
                    </p>
                  ))}
                </div>
              </div>

              {preview.legalNotes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[0.75rem] uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>
                    Points de vigilance juridique
                  </h4>
                  <div className="space-y-3">
                    {preview.legalNotes.map((note) => (
                      <div key={note} className="bg-accent/5 border border-accent/20 p-4 flex items-start gap-3">
                        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-accent/10 text-accent">
                          <Info className="w-3 h-3" strokeWidth={2} />
                        </div>
                        <p
                          className="text-[0.75rem] text-muted-foreground"
                          style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
                        >
                          {note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleEditPreview}
                className="px-10 py-4 border border-border hover:border-foreground transition-all duration-200 inline-flex items-center gap-3"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                <span className="text-[0.75rem] uppercase tracking-[0.12em]">Modifier les réponses</span>
              </button>
              <button
                onClick={handleFinalizeContract}
                className="px-12 py-5 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 inline-flex items-center gap-3"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}
              >
                <Check className="w-4 h-4" strokeWidth={2} />
                <span className="text-[0.75rem] uppercase tracking-[0.12em]">Finaliser le contrat</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
