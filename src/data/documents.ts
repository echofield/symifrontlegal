export type Document = {
  id: string;
  title: string;
  description: string;
  tags: string[];
};

export const DOCUMENTS: Document[] = [
  {
    id: "contrat-prestation",
    title: "Contrat de prestation de service",
    description: "Sécurisez vos missions de conseil, développement ou marketing avec un contrat complet et clair.",
    tags: ["freelance", "service", "B2B"],
  },
  {
    id: "contrat-travaux",
    title: "Contrat de travaux",
    description:
      "Encadrez vos chantiers de construction ou de rénovation avec des clauses précises sur les délais et la qualité.",
    tags: ["travaux", "BTP", "chantier"],
  },
  {
    id: "contrat-creation",
    title: "Contrat de création artistique",
    description: "Protégez vos œuvres et vos droits d'auteur pour des projets de design, d'illustration ou de vidéo.",
    tags: ["création", "droits d'auteur", "studio"],
  },
  {
    id: "contrat-evenement",
    title: "Contrat événementiel",
    description:
      "Définissez clairement les responsabilités pour l'organisation d'événements, traiteurs ou locations de matériel.",
    tags: ["événement", "logistique", "prestataires"],
  },
  {
    id: "contrat-saas",
    title: "Contrat SaaS",
    description: "Formalisez vos offres logicielles avec des clauses de service, de disponibilité et de support.",
    tags: ["SaaS", "logiciel", "support"],
  },
  {
    id: "contrat-collaboration",
    title: "Pacte de collaboration",
    description: "Cadrez vos collaborations professionnelles avec une gouvernance claire et des clauses de sortie.",
    tags: ["partenariat", "startup", "entreprise"],
  },
  {
    id: "contrat-cdd",
    title: "Contrat de travail CDD",
    description: "Sécurisez vos recrutements temporaires avec un contrat conforme au droit du travail et aux conventions.",
    tags: ["RH", "CDD", "emploi"],
  },
  {
    id: "contrat-cdi",
    title: "Contrat de travail CDI",
    description: "Formalisez une embauche durable avec des clauses adaptées aux postes cadres et non cadres.",
    tags: ["RH", "CDI", "emploi"],
  },
  {
    id: "accord-confidentialite",
    title: "Accord de confidentialité (NDA)",
    description: "Protégez vos informations sensibles lors de discussions commerciales ou partenariats stratégiques.",
    tags: ["confidentialité", "partenariat", "NDA"],
  },
  {
    id: "conditions-generales",
    title: "Conditions générales de vente",
    description: "Définissez un cadre légal clair pour la vente de vos produits ou services en ligne.",
    tags: ["e-commerce", "SaaS", "CGV"],
  },
  {
    id: "pacte-associes",
    title: "Pacte d'associés",
    description: "Organisez la gouvernance de votre société et anticipez les scénarios de sortie des associés.",
    tags: ["startup", "investissement", "gouvernance"],
  },
  {
    id: "contrat-licence",
    title: "Contrat de licence logicielle",
    description: "Attribuez des droits d'utilisation de vos logiciels tout en protégeant votre propriété intellectuelle.",
    tags: ["logiciel", "licence", "PI"],
  },
  {
    id: "contrat-influence",
    title: "Contrat d'influence",
    description:
      "Cadrez les collaborations avec des créateurs de contenu et assurez-vous du respect des obligations publicitaires.",
    tags: ["marketing", "influence", "communication"],
  },
];
