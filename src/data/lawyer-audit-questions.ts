export type LawyerAuditQuestion = {
  id: string;
  label: string;
  type?: "text" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
};

export const LAWYER_AUDIT_QUESTIONS: LawyerAuditQuestion[] = [
  {
    id: "typeSituation",
    label: "Quel est le type de situation juridique ?",
    type: "select",
    options: ["Contrat", "Ressources humaines", "Immobilier", "Entreprise", "Contentieux", "Autre"],
  },
  {
    id: "urgence",
    label: "Quel est votre niveau d'urgence ?",
    type: "select",
    options: ["Immédiate", "Sous 72h", "Flexible"],
  },
  {
    id: "budget",
    label: "Quel budget souhaitez-vous allouer ?",
    type: "select",
    options: ["< 300 €", "300 - 800 €", "800 - 1500 €", "> 1500 €"],
  },
  {
    id: "objectif",
    label: "Quel est votre objectif principal ?",
    placeholder: "Ex: sécuriser un contrat, résoudre un litige...",
  },
  {
    id: "statut",
    label: "Quel est votre statut ?",
    type: "select",
    options: ["Freelance", "Dirigeant", "Particulier", "Autre"],
  },
  {
    id: "secteur",
    label: "Dans quel secteur intervenez-vous ?",
    placeholder: "Ex: Tech, bâtiment, événementiel...",
  },
  {
    id: "nombreParties",
    label: "Combien de parties sont impliquées ?",
    placeholder: "Ex: 2 parties, 3 partenaires...",
  },
  {
    id: "pays",
    label: "Dans quel pays est situé votre activité principale ?",
    placeholder: "Ex: France, Belgique...",
  },
  {
    id: "region",
    label: "Une région spécifique ?",
    placeholder: "Ex: Île-de-France, PACA...",
  },
  {
    id: "dateEcheance",
    label: "Quelle est la date d'échéance ?",
    placeholder: "Ex: 30 avril 2025",
  },
  {
    id: "documents",
    label: "Quels documents avez-vous déjà ?",
    placeholder: "Ex: Devis signé, échanges d'emails...",
  },
  {
    id: "contraintes",
    label: "Y a-t-il des contraintes spécifiques ?",
    placeholder: "Ex: confidentialité, clause de non-concurrence...",
  },
  {
    id: "historique",
    label: "Y a-t-il un historique ou litige en cours ?",
    placeholder: "Décrivez rapidement les éléments clés",
  },
  {
    id: "interlocuteurs",
    label: "Qui sont vos interlocuteurs principaux ?",
    placeholder: "Ex: client final, sous-traitant, avocat adverse...",
  },
  {
    id: "decisionnaire",
    label: "Qui prendra la décision finale ?",
    placeholder: "Ex: CEO, associé principal, conseil d'administration...",
  },
  {
    id: "outils",
    label: "Utilisez-vous des outils spécifiques ?",
    placeholder: "Ex: Notion, Jira, CRM...",
  },
  {
    id: "delai",
    label: "Quel délai idéal pour la réponse ?",
    placeholder: "Ex: cette semaine, ce mois-ci...",
  },
  {
    id: "contact",
    label: "Comment préférez-vous être contacté ?",
    type: "select",
    options: ["Email", "Téléphone", "Visio", "WhatsApp"],
  },
];
