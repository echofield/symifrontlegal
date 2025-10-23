export type DocumentCategory =
  | 'emploi'
  | 'confidentialite'
  | 'creation'
  | 'rh'
  | 'commercial'
  | 'immobilier';

export interface DocumentPricing {
  id: string;
  name: string;
  price: number;
  category: DocumentCategory;
  description?: string;
}

export const DOCUMENTS_PRICING: Record<string, DocumentPricing> = {
  'contrat-cdi-classique': {
    id: 'contrat-cdi-classique',
    name: 'Contrat CDI standard',
    price: 149,
    category: 'emploi',
    description: 'Contrat à durée indéterminée complet avec période d\'essai modulable.',
  },
  'contrat-cdd-projet': {
    id: 'contrat-cdd-projet',
    name: 'Contrat CDD projet',
    price: 139,
    category: 'emploi',
    description: 'Pour missions temporaires ou accroissement d\'activité (jusqu\'à 36 mois).',
  },
  'contrat-freelance-cadre': {
    id: 'contrat-freelance-cadre',
    name: 'Contrat freelance cadre dirigeant',
    price: 159,
    category: 'emploi',
    description: 'Mission indépendante avec clauses de confidentialité et IP renforcées.',
  },
  'avenant-salaire': {
    id: 'avenant-salaire',
    name: 'Avenant évolution salaire',
    price: 79,
    category: 'emploi',
    description: 'Encadrement des augmentations et primes exceptionnelles.',
  },
  'rupture-conventionnelle': {
    id: 'rupture-conventionnelle',
    name: 'Rupture conventionnelle',
    price: 189,
    category: 'emploi',
    description: 'Procédure complète avec calendrier et notifications DREETS.',
  },
  'nda-unilateral': {
    id: 'nda-unilateral',
    name: 'Accord de confidentialité unilatéral',
    price: 69,
    category: 'confidentialite',
    description: 'Protection d\'un secret d\'affaires transmis à un partenaire ou prestataire.',
  },
  'nda-mutuel': {
    id: 'nda-mutuel',
    name: 'Accord de confidentialité mutuel',
    price: 89,
    category: 'confidentialite',
    description: 'Confidentialité bilatérale pour négociations, due diligence ou partenariats.',
  },
  'clause-non-concurrence': {
    id: 'clause-non-concurrence',
    name: 'Clause non-concurrence & non-sollicitation',
    price: 99,
    category: 'confidentialite',
    description: 'Blocage des activités concurrentes et débauchage pendant 12 à 24 mois.',
  },
  'dpa-traitement-donnees': {
    id: 'dpa-traitement-donnees',
    name: 'Accord traitement des données (RGPD)',
    price: 129,
    category: 'confidentialite',
    description: 'Encadrement des traitements confiés à un sous-traitant avec annexes techniques.',
  },
  'statuts-sas': {
    id: 'statuts-sas',
    name: 'Statuts SAS modulables',
    price: 249,
    category: 'creation',
    description: 'Clauses d\'associés avec actions de préférence et gouvernance flexible.',
  },
  'statuts-sasu': {
    id: 'statuts-sasu',
    name: 'Statuts SASU',
    price: 219,
    category: 'creation',
    description: 'Structure solo avec présidence unique et options dividendes optimisées.',
  },
  'pacte-associes-startup': {
    id: 'pacte-associes-startup',
    name: 'Pacte d\'associés start-up',
    price: 299,
    category: 'creation',
    description: 'Clauses d\'inaliénabilité, liquidité préférentielle et vesting fondateurs.',
  },
  'pack-immatriculation': {
    id: 'pack-immatriculation',
    name: 'Pack immatriculation (SAS/SARL)',
    price: 329,
    category: 'creation',
    description: 'Statuts + annonce légale + formulaire M0 automatisé.',
  },
  'reglement-interieur': {
    id: 'reglement-interieur',
    name: 'Règlement intérieur PME',
    price: 199,
    category: 'rh',
    description: 'Conforme Code du travail avec procédures disciplinaires et sécurité.',
  },
  'charte-teletravail': {
    id: 'charte-teletravail',
    name: 'Charte télétravail & BYOD',
    price: 119,
    category: 'rh',
    description: 'Encadrement du travail hybride, sécurité IT et remboursement frais.',
  },
  'politique-conges': {
    id: 'politique-conges',
    name: 'Politique congés & absences',
    price: 99,
    category: 'rh',
    description: 'Gestion des congés payés, RTT, absences exceptionnelles et report.',
  },
  'kit-entretien-annuel': {
    id: 'kit-entretien-annuel',
    name: 'Kit entretien annuel & objectifs',
    price: 89,
    category: 'rh',
    description: 'Supports d\'évaluation, grille de compétences et formalisation objectifs.',
  },
  'cgv-b2b': {
    id: 'cgv-b2b',
    name: 'Conditions générales de vente B2B',
    price: 189,
    category: 'commercial',
    description: 'Clause de limitation de responsabilité, pénalités de retard et RGPD.',
  },
  'cgv-ecommerce': {
    id: 'cgv-ecommerce',
    name: 'CGV e-commerce B2C',
    price: 159,
    category: 'commercial',
    description: 'Conforme Code de la consommation avec droit de rétractation 14 jours.',
  },
  'cgu-saas': {
    id: 'cgu-saas',
    name: 'CGU SaaS & licence logicielle',
    price: 179,
    category: 'commercial',
    description: 'Gestion des SLA, disponibilité, sécurité et transfert de données.',
  },
  'contrat-prestation-service': {
    id: 'contrat-prestation-service',
    name: 'Contrat de prestation de services',
    price: 169,
    category: 'commercial',
    description: 'Missions B2B avec jalons, propriété intellectuelle et clause de résultat.',
  },
  'contrat-partenariat': {
    id: 'contrat-partenariat',
    name: 'Contrat de partenariat & affiliation',
    price: 149,
    category: 'commercial',
    description: 'Distribution conjointe, partage de revenus et obligations marketing.',
  },
  'bail-commercial': {
    id: 'bail-commercial',
    name: 'Bail commercial 3-6-9',
    price: 249,
    category: 'immobilier',
    description: 'Clauses de destination, charges récupérables et révision triennale.',
  },
  'bail-professionnel': {
    id: 'bail-professionnel',
    name: 'Bail professionnel',
    price: 199,
    category: 'immobilier',
    description: 'Pour professions libérales avec résiliation annuelle possible.',
  },
  'bail-mobilite': {
    id: 'bail-mobilite',
    name: 'Bail mobilité meublé',
    price: 129,
    category: 'immobilier',
    description: 'Locations de 1 à 10 mois pour étudiants, stagiaires ou missions temporaires.',
  },
  'contrat-sous-location': {
    id: 'contrat-sous-location',
    name: 'Contrat de sous-location',
    price: 119,
    category: 'immobilier',
    description: 'Encadrement du sous-locataire avec accord du bailleur et état des lieux.',
  },
  'mandat-gestion-locative': {
    id: 'mandat-gestion-locative',
    name: 'Mandat de gestion locative',
    price: 179,
    category: 'immobilier',
    description: 'Mission complète de gestion pour agences avec obligations comptables.',
  },
};

export interface BondPricingConfig {
  setupFee: number;
  commissionPercent: number;
  templates: string[];
  example: {
    amount: number;
    milestones: number;
    commissionValue: number;
    total: number;
  };
  features: string[];
}

export const BOND_PRICING: BondPricingConfig = {
  setupFee: 149,
  commissionPercent: 3,
  templates: [
    'Prestation de service (dev, design, conseil...)',
    'Travaux (construction, rénovation, BTP...)',
    'Création artistique (logo, vidéo, musique...)',
  ],
  example: {
    amount: 10_000,
    milestones: 5,
    commissionValue: 300,
    total: 449,
  },
  features: [
    'Paiements sécurisés',
    'Validation par jalons',
    'Protection vendeur et acheteur',
    'Livraison conditionnelle',
  ],
};
