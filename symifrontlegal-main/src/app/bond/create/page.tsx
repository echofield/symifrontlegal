"use client";

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
  // ❌ SUPPRIMER "IA libre"
  // ❌ SUPPRIMER "Pacte entre amis" (pas professionnel)
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
    if (currentStep === FORM_STEPS.length - 1) return;
    setCurrentStep((step) => Math.min(step + 1, FORM_STEPS.length - 1));
  };

  const goPrev = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-blue-600">Bond</p>
        <h1 className="text-4xl font-bold">Configurer votre contrat sécurisé</h1>
        <p className="text-gray-600 max-w-2xl">
          Sélectionnez un type de mission puis complétez les étapes. Bond génère automatiquement un contrat juridique,
          un plan de jalons et un escrow pour sécuriser le paiement.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        {BOND_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`text-left border rounded-2xl p-6 transition hover:border-blue-500 hover:shadow-sm ${
              selectedType === type.id ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{type.name}</h2>
              {type.popular && (
                <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">Populaire</span>
              )}
            </div>
            <p className="text-gray-600 leading-relaxed">{type.description}</p>
          </button>
        ))}
      </section>

      <section className="border border-gray-200 rounded-3xl bg-white shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase text-gray-500 tracking-[0.3em]">Configuration du contrat</p>
            <h2 className="text-2xl font-semibold text-gray-900">Étape {currentStep + 1} sur {FORM_STEPS.length}</h2>
          </div>
          <span className="text-sm font-semibold text-blue-600">{progress}% complété</span>
        </div>

        <div className="w-full bg-gray-100 h-2 rounded-full mb-8">
          <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
        </div>

        <div className="grid md:grid-cols-[2fr,3fr] gap-8 items-start">
          <aside className="space-y-3">
            {FORM_STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                  index === currentStep
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-transparent hover:border-gray-200"
                }`}
              >
                <p className="text-sm font-semibold">Étape {index + 1}</p>
                <p className="text-sm text-gray-600">{step.title}</p>
              </button>
            ))}
          </aside>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{currentQuestion.title}</h3>
              <p className="text-gray-600 mb-4">{currentQuestion.description}</p>
              <textarea
                value={responses[currentQuestion.id] ?? ""}
                onChange={(event) =>
                  setResponses((prev) => ({ ...prev, [currentQuestion.id]: event.target.value }))
                }
                placeholder={currentQuestion.placeholder}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex gap-2">
                <button
                  onClick={goPrev}
                  disabled={currentStep === 0}
                  className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Étape précédente
                </button>
                <button
                  onClick={goNext}
                  disabled={currentStep === FORM_STEPS.length - 1}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  Étape suivante
                </button>
              </div>
              <button className="px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800">
                Générer l'aperçu du contrat
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
