import { useMemo, useState } from "react";

const BOND_TYPES = [
  {
    id: "service",
    name: "Prestation de service",
    description: "Pour missions de conseil, développement, design, marketing...",
    popular: true,
  },
  {
    id: "travaux",
    name: "Travaux",
    description: "Construction, rénovation, aménagements...",
  },
  {
    id: "creation",
    name: "Création artistique",
    description: "Design, illustration, musique, vidéo...",
  },
  {
    id: "event",
    name: "Événementiel",
    description: "Organisation événements, traiteur, location matériel...",
  },
];

const FORM_STEPS = [
  {
    id: "missionTitle",
    title: "Nom du projet",
    description: "Donnez un titre clair pour identifier votre mission.",
    placeholder: "Ex: Site web vitrine pour Maison Horizon",
  },
  {
    id: "missionType",
    title: "Type de mission",
    description: "Précisez la nature du travail attendu.",
    placeholder: "Ex: Refonte UX/UI, Maintenance, Chantier clé en main...",
  },
  {
    id: "deliverables",
    title: "Livrables principaux",
    description: "Indiquez les éléments attendus à la livraison.",
    placeholder: "Ex: maquettes Figma, code source, rapport d'audit...",
  },
  {
    id: "milestones",
    title: "Jalons & échéances",
    description: "Découpez votre mission en étapes avec des dates clés.",
    placeholder: "Ex: Kickoff 05/03, Livraison design 18/03, Recette 25/03...",
  },
  {
    id: "budget",
    title: "Budget & modalités",
    description: "Mentionnez le budget global ou le mode de rémunération.",
    placeholder: "Ex: 8 500 € HT en 3 échéances",
  },
  {
    id: "paiement",
    title: "Modalités de paiement",
    description: "Précisez les conditions d'escrow ou de facturation.",
    placeholder: "Ex: 30% à la signature, 40% mi-parcours, 30% à la livraison",
  },
  {
    id: "collaborateurs",
    title: "Parties prenantes",
    description: "Identifiez les interlocuteurs côté client et prestataire.",
    placeholder: "Ex: Chef de projet, CTO, Responsable juridique...",
  },
  {
    id: "contexte",
    title: "Contexte & objectifs",
    description: "Décrivez la situation actuelle et le résultat attendu.",
    placeholder: "Ex: refonte après levée de fonds, assurer conformité RGPD...",
  },
  {
    id: "contraintes",
    title: "Contraintes spécifiques",
    description: "Précisez les conditions légales ou opérationnelles.",
    placeholder: "Ex: confidentialité renforcée, hébergement en France...",
  },
  {
    id: "risques",
    title: "Points de vigilance",
    description: "Mentionnez les risques identifiés à traiter dans le contrat.",
    placeholder: "Ex: dépendance à un fournisseur, planning serré...",
  },
  {
    id: "outils",
    title: "Outils & environnements",
    description: "Listez les outils ou environnements utilisés.",
    placeholder: "Ex: Notion, Slack, Environnement staging...",
  },
  {
    id: "validation",
    title: "Processus de validation",
    description: "Indiquez comment seront validés les livrables et par qui.",
    placeholder: "Ex: Validation design par Product Owner, signature électronique...",
  },
];

export default function BondCreatePage() {
  const [selectedType, setSelectedType] = useState<string | null>(BOND_TYPES[0]?.id ?? null);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});

  const progress = useMemo(() => Math.round(((currentStep + 1) / FORM_STEPS.length) * 100), [currentStep]);
  const currentQuestion = FORM_STEPS[currentStep];

  const goToStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= FORM_STEPS.length) return;
    setCurrentStep(stepIndex);
  };

  const goNext = () => {
    setCurrentStep((step) => Math.min(step + 1, FORM_STEPS.length - 1));
  };

  const goPrev = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-6 py-12">
      <header className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary-600">Bond</p>
        <h1 className="text-4xl font-bold text-slate-900">Configurer votre contrat sécurisé</h1>
        <p className="text-slate-600">
          Sélectionnez un type de mission puis complétez les étapes. Bond génère automatiquement un contrat juridique, un plan de
          jalons et un escrow pour sécuriser le paiement.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {BOND_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`text-left rounded-2xl border p-6 transition hover:border-primary-500 hover:shadow ${
              selectedType === type.id ? "border-primary-500 bg-primary-50" : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">{type.name}</h2>
              {type.popular && (
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600">Populaire</span>
              )}
            </div>
            <p className="mt-3 text-sm text-slate-600">{type.description}</p>
          </button>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Configuration du contrat</p>
            <h2 className="text-2xl font-semibold text-slate-900">Étape {currentStep + 1} sur {FORM_STEPS.length}</h2>
          </div>
          <span className="text-sm font-semibold text-primary-600">{progress}% complété</span>
        </div>

        <div className="mt-6 h-2 w-full rounded-full bg-slate-100">
          <div className="h-2 rounded-full bg-primary-600 transition-all" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[220px,1fr]">
          <aside className="space-y-3">
            {FORM_STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  index === currentStep
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-transparent hover:border-slate-200"
                }`}
              >
                <p className="font-semibold">Étape {index + 1}</p>
                <p className="text-slate-600">{step.title}</p>
              </button>
            ))}
          </aside>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{currentQuestion.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{currentQuestion.description}</p>
              <textarea
                value={responses[currentQuestion.id] ?? ""}
                onChange={(event) =>
                  setResponses((prev) => ({ ...prev, [currentQuestion.id]: event.target.value }))
                }
                placeholder={currentQuestion.placeholder}
                rows={5}
                className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={goPrev}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 disabled:opacity-40"
                disabled={currentStep === 0}
              >
                Étape précédente
              </button>
              <button
                onClick={goNext}
                className="inline-flex items-center justify-center rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                disabled={currentStep === FORM_STEPS.length - 1}
              >
                Étape suivante
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
