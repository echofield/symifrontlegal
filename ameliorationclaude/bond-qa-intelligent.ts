// bond-qa-intelligent.ts

// Types pour le système Q&A
interface Question {
  id: string;
  question: string;
  type: 'select' | 'multiselect' | 'text' | 'number' | 'date' | 'conditional';
  options?: string[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    customValidator?: (value: any) => boolean;
  };
  conditions?: {
    dependsOn: string;
    showIf: any;
  };
  help?: string;
  legalImplication?: string;
  defaultValue?: any;
  dynamicOptions?: (context: any) => string[];
}

interface QAFlow {
  templateId: string;
  sections: QASection[];
  validationRules: ValidationRule[];
}

interface QASection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  order: number;
}

interface ValidationRule {
  id: string;
  description: string;
  validate: (answers: any) => boolean;
  errorMessage: string;
}

// Base de questions enrichie par type de contrat
export const intelligentQASystem: Record<string, QAFlow> = {
  'service': {
    templateId: 'service',
    sections: [
      {
        id: 'parties',
        title: 'Identification des parties',
        order: 1,
        questions: [
          {
            id: 'client_type',
            question: 'Le client est-il un particulier ou un professionnel ?',
            type: 'select',
            options: ['Particulier', 'Professionnel', 'Association', 'Administration'],
            validation: { required: true },
            legalImplication: 'Détermine le droit applicable (B2C ou B2B) et les obligations légales'
          },
          {
            id: 'client_name',
            question: 'Nom complet du client (ou raison sociale)',
            type: 'text',
            validation: { required: true, pattern: '^[A-Za-zÀ-ÿ\\s\\-\\.]+$' }
          },
          {
            id: 'client_id',
            question: 'SIRET/SIREN du client (si professionnel)',
            type: 'text',
            conditions: { dependsOn: 'client_type', showIf: ['Professionnel', 'Association'] },
            validation: { pattern: '^\\d{14}$' },
            help: 'Format: 14 chiffres sans espaces'
          },
          {
            id: 'provider_name',
            question: 'Nom du prestataire (ou raison sociale)',
            type: 'text',
            validation: { required: true }
          },
          {
            id: 'provider_qualification',
            question: 'Qualifications/certifications du prestataire',
            type: 'multiselect',
            options: ['Auto-entrepreneur', 'SARL/EURL', 'SAS/SASU', 'Profession libérale', 'Artisan', 'Expert certifié'],
            help: 'Sélectionnez toutes les qualifications applicables'
          }
        ]
      },
      {
        id: 'service_details',
        title: 'Description de la prestation',
        order: 2,
        questions: [
          {
            id: 'service_nature',
            question: 'Nature précise de la prestation',
            type: 'select',
            options: [
              'Développement logiciel',
              'Consulting/Conseil',
              'Design/Création graphique',
              'Marketing/Communication',
              'Formation',
              'Maintenance/Support',
              'Audit/Expertise',
              'Autre prestation intellectuelle'
            ],
            validation: { required: true }
          },
          {
            id: 'service_description',
            question: 'Description détaillée des livrables attendus',
            type: 'text',
            validation: { required: true, min: 50 },
            help: 'Minimum 50 caractères. Soyez précis sur ce qui sera livré.'
          },
          {
            id: 'service_location',
            question: 'Lieu d\'exécution de la prestation',
            type: 'select',
            options: ['Sur site client', 'Locaux prestataire', 'Télétravail/Distance', 'Mixte'],
            legalImplication: 'Impact sur la responsabilité et les assurances'
          },
          {
            id: 'technical_specs',
            question: 'Y a-t-il des spécifications techniques particulières ?',
            type: 'text',
            help: 'Technologies, frameworks, normes à respecter...'
          }
        ]
      },
      {
        id: 'timeline',
        title: 'Planning et jalons',
        order: 3,
        questions: [
          {
            id: 'start_date',
            question: 'Date de début de la prestation',
            type: 'date',
            validation: { required: true },
            defaultValue: () => new Date().toISOString().split('T')[0]
          },
          {
            id: 'end_date',
            question: 'Date de fin prévisionnelle',
            type: 'date',
            validation: { required: true }
          },
          {
            id: 'milestone_type',
            question: 'Organisation des jalons de paiement',
            type: 'select',
            options: [
              'Paiement unique à la livraison',
              '2 jalons (50% début, 50% fin)',
              '3 jalons (30% début, 40% milieu, 30% fin)',
              'Jalons personnalisés',
              'Paiement mensuel régulier'
            ],
            validation: { required: true }
          },
          {
            id: 'custom_milestones',
            question: 'Définir les jalons personnalisés',
            type: 'text',
            conditions: { dependsOn: 'milestone_type', showIf: 'Jalons personnalisés' },
            help: 'Format: Jalon 1 (date, %, description); Jalon 2...'
          },
          {
            id: 'delay_penalties',
            question: 'Prévoir des pénalités de retard ?',
            type: 'select',
            options: ['Non', 'Oui - 0.5% par jour', 'Oui - 1% par jour', 'Oui - montant fixe'],
            legalImplication: 'Article 1231-5 Code civil - Les pénalités doivent être proportionnées'
          }
        ]
      },
      {
        id: 'financial',
        title: 'Conditions financières',
        order: 4,
        questions: [
          {
            id: 'total_amount',
            question: 'Montant total HT de la prestation (en €)',
            type: 'number',
            validation: { required: true, min: 1 },
            help: 'Montant hors taxes en euros'
          },
          {
            id: 'vat_rate',
            question: 'Taux de TVA applicable',
            type: 'select',
            options: ['20% (taux normal)', '10% (taux réduit)', '5.5% (taux réduit)', '2.1% (taux super réduit)', 'Exonéré'],
            defaultValue: '20% (taux normal)'
          },
          {
            id: 'payment_terms',
            question: 'Délai de paiement après facturation',
            type: 'select',
            options: [
              'Comptant',
              '30 jours fin de mois',
              '45 jours fin de mois',
              '60 jours net',
              'Autre'
            ],
            validation: { required: true },
            legalImplication: 'Art. L441-10 Code commerce - Max 60 jours ou 45 jours fin de mois'
          },
          {
            id: 'payment_method',
            question: 'Mode de paiement accepté',
            type: 'multiselect',
            options: ['Virement', 'Chèque', 'Prélèvement', 'CB/PayPal', 'Espèces (max 1000€)']
          },
          {
            id: 'advance_payment',
            question: 'Acompte à la signature ?',
            type: 'select',
            options: ['Non', '10%', '20%', '30%', '50%', 'Autre montant'],
            help: 'Sécurise l\'engagement des deux parties'
          }
        ]
      },
      {
        id: 'intellectual_property',
        title: 'Propriété intellectuelle',
        order: 5,
        questions: [
          {
            id: 'ip_ownership',
            question: 'Propriété des droits sur les livrables',
            type: 'select',
            options: [
              'Cession totale au client',
              'Licence d\'utilisation au client',
              'Copropriété',
              'Propriété prestataire avec licence',
              'Selon la nature des livrables'
            ],
            validation: { required: true },
            legalImplication: 'Art. L131-3 CPI - La cession doit être explicite et délimitée'
          },
          {
            id: 'existing_ip',
            question: 'Utilisation d\'éléments préexistants du prestataire ?',
            type: 'select',
            options: ['Non', 'Oui - avec licence', 'Oui - intégrés au livrable'],
            help: 'Frameworks, bibliothèques, templates existants...'
          },
          {
            id: 'moral_rights',
            question: 'Mention du nom du créateur (droit moral) ?',
            type: 'select',
            options: ['Oui obligatoire', 'Oui si possible', 'Non', 'À discuter'],
            legalImplication: 'Le droit moral est inaliénable en France (Art. L121-1 CPI)'
          }
        ]
      },
      {
        id: 'confidentiality',
        title: 'Confidentialité et données',
        order: 6,
        questions: [
          {
            id: 'confidentiality_level',
            question: 'Niveau de confidentialité requis',
            type: 'select',
            options: [
              'Standard (informations commerciales)',
              'Élevé (secrets d\'affaires)',
              'Très élevé (données sensibles)',
              'Aucun'
            ],
            validation: { required: true }
          },
          {
            id: 'confidentiality_duration',
            question: 'Durée de la confidentialité après fin du contrat',
            type: 'select',
            options: ['1 an', '2 ans', '3 ans', '5 ans', 'Illimitée'],
            conditions: { dependsOn: 'confidentiality_level', showIf: ['Standard', 'Élevé', 'Très élevé'] }
          },
          {
            id: 'personal_data',
            question: 'Traitement de données personnelles ?',
            type: 'select',
            options: ['Non', 'Oui - données clients', 'Oui - données employés', 'Oui - données sensibles'],
            legalImplication: 'RGPD applicable - nécessite clauses spécifiques'
          },
          {
            id: 'data_hosting',
            question: 'Hébergement des données',
            type: 'select',
            options: ['France', 'UE', 'Hors UE avec garanties', 'Non applicable'],
            conditions: { dependsOn: 'personal_data', showIf: ['Oui - données clients', 'Oui - données employés', 'Oui - données sensibles'] }
          }
        ]
      },
      {
        id: 'liability',
        title: 'Responsabilités et garanties',
        order: 7,
        questions: [
          {
            id: 'warranty_duration',
            question: 'Durée de garantie sur les livrables',
            type: 'select',
            options: ['3 mois', '6 mois', '1 an', '2 ans', 'Garantie légale uniquement'],
            validation: { required: true }
          },
          {
            id: 'liability_cap',
            question: 'Plafond de responsabilité du prestataire',
            type: 'select',
            options: [
              'Montant du contrat',
              '50% du contrat',
              '200% du contrat',
              'Montant des sommes versées',
              'Illimité',
              'Autre montant'
            ],
            legalImplication: 'Clause limitative valable sauf faute lourde/dolosive'
          },
          {
            id: 'insurance_required',
            question: 'Assurance professionnelle requise ?',
            type: 'select',
            options: [
              'Non',
              'RC Pro minimum',
              'RC Pro + décennale',
              'RC Pro + cyber',
              'Toutes assurances métier'
            ]
          },
          {
            id: 'force_majeure',
            question: 'Inclure une clause de force majeure étendue (COVID, etc.) ?',
            type: 'select',
            options: ['Oui', 'Non', 'Clause standard uniquement'],
            help: 'Prend en compte pandémies, cyber-attaques, etc.'
          }
        ]
      },
      {
        id: 'termination',
        title: 'Fin et résiliation',
        order: 8,
        questions: [
          {
            id: 'termination_notice',
            question: 'Préavis de résiliation anticipée',
            type: 'select',
            options: ['Impossible', '7 jours', '15 jours', '30 jours', '60 jours'],
            validation: { required: true }
          },
          {
            id: 'termination_penalty',
            question: 'Indemnité en cas de résiliation anticipée',
            type: 'select',
            options: [
              'Aucune',
              'Travaux effectués uniquement',
              'Travaux + 10% du solde',
              'Travaux + 25% du solde',
              'Totalité du contrat'
            ]
          },
          {
            id: 'deliverables_on_termination',
            question: 'Sort des livrables en cas de résiliation',
            type: 'select',
            options: [
              'Remis en l\'état',
              'Conservés par le client',
              'Détruits',
              'Selon paiements effectués'
            ]
          }
        ]
      },
      {
        id: 'dispute_resolution',
        title: 'Résolution des litiges',
        order: 9,
        questions: [
          {
            id: 'applicable_law',
            question: 'Droit applicable',
            type: 'select',
            options: ['Droit français', 'Droit du pays du client', 'Droit du pays du prestataire'],
            defaultValue: 'Droit français'
          },
          {
            id: 'dispute_resolution_method',
            question: 'Mode de résolution des litiges',
            type: 'select',
            options: [
              'Médiation puis tribunal',
              'Arbitrage',
              'Tribunal compétent directement',
              'Médiation obligatoire',
              'Conciliation'
            ],
            validation: { required: true }
          },
          {
            id: 'competent_jurisdiction',
            question: 'Tribunal compétent',
            type: 'select',
            options: [
              'Tribunal du siège du défendeur',
              'Tribunal du siège du client',
              'Tribunal du siège du prestataire',
              'Tribunal du lieu d\'exécution'
            ]
          }
        ]
      }
    ],
    validationRules: [
      {
        id: 'dates_coherence',
        description: 'La date de fin doit être après la date de début',
        validate: (answers) => {
          if (!answers.start_date || !answers.end_date) return true;
          return new Date(answers.end_date) > new Date(answers.start_date);
        },
        errorMessage: 'La date de fin doit être postérieure à la date de début'
      },
      {
        id: 'amount_minimum',
        description: 'Montant minimum pour un contrat',
        validate: (answers) => {
          return !answers.total_amount || answers.total_amount >= 100;
        },
        errorMessage: 'Le montant minimum d\'un contrat est de 100€'
      },
      {
        id: 'rgpd_compliance',
        description: 'Conformité RGPD si traitement de données',
        validate: (answers) => {
          if (answers.personal_data && answers.personal_data !== 'Non') {
            return answers.data_hosting && answers.data_hosting !== '';
          }
          return true;
        },
        errorMessage: 'L\'hébergement des données doit être précisé (RGPD)'
      }
    ]
  },

  'travaux': {
    templateId: 'travaux',
    sections: [
      // Structure similaire mais adaptée aux travaux
      // Avec questions spécifiques : devis, plans, matériaux, normes, etc.
    ],
    validationRules: []
  },

  'creation': {
    templateId: 'creation',
    sections: [
      // Questions spécifiques création : brief créatif, nombre de propositions, retouches, etc.
    ],
    validationRules: []
  }
};

// Classe pour gérer le flux Q&A
export class IntelligentQAManager {
  private currentFlow: QAFlow;
  private answers: Record<string, any> = {};
  private currentSectionIndex: number = 0;

  constructor(templateId: string) {
    this.currentFlow = intelligentQASystem[templateId];
    if (!this.currentFlow) {
      throw new Error(`Template ${templateId} not found`);
    }
  }

  getCurrentSection(): QASection {
    return this.currentFlow.sections[this.currentSectionIndex];
  }

  getVisibleQuestions(): Question[] {
    const section = this.getCurrentSection();
    return section.questions.filter(q => this.isQuestionVisible(q));
  }

  private isQuestionVisible(question: Question): boolean {
    if (!question.conditions) return true;
    
    const { dependsOn, showIf } = question.conditions;
    const dependencyValue = this.answers[dependsOn];
    
    if (Array.isArray(showIf)) {
      return showIf.includes(dependencyValue);
    }
    
    return dependencyValue === showIf;
  }

  validateAnswer(questionId: string, value: any): string | null {
    const question = this.findQuestion(questionId);
    if (!question || !question.validation) return null;

    const { required, min, max, pattern, customValidator } = question.validation;

    if (required && !value) {
      return 'Ce champ est obligatoire';
    }

    if (min !== undefined) {
      if (typeof value === 'string' && value.length < min) {
        return `Minimum ${min} caractères requis`;
      }
      if (typeof value === 'number' && value < min) {
        return `La valeur minimum est ${min}`;
      }
    }

    if (max !== undefined) {
      if (typeof value === 'string' && value.length > max) {
        return `Maximum ${max} caractères autorisés`;
      }
      if (typeof value === 'number' && value > max) {
        return `La valeur maximum est ${max}`;
      }
    }

    if (pattern && typeof value === 'string') {
      const regex = new RegExp(pattern);
      if (!regex.test(value)) {
        return 'Format invalide';
      }
    }

    if (customValidator && !customValidator(value)) {
      return 'Valeur invalide';
    }

    return null;
  }

  setAnswer(questionId: string, value: any): void {
    const error = this.validateAnswer(questionId, value);
    if (error) throw new Error(error);
    
    this.answers[questionId] = value;
  }

  private findQuestion(questionId: string): Question | undefined {
    for (const section of this.currentFlow.sections) {
      const question = section.questions.find(q => q.id === questionId);
      if (question) return question;
    }
    return undefined;
  }

  canMoveToNextSection(): boolean {
    const currentQuestions = this.getVisibleQuestions();
    
    for (const question of currentQuestions) {
      if (question.validation?.required && !this.answers[question.id]) {
        return false;
      }
    }
    
    return true;
  }

  moveToNextSection(): boolean {
    if (this.canMoveToNextSection() && 
        this.currentSectionIndex < this.currentFlow.sections.length - 1) {
      this.currentSectionIndex++;
      return true;
    }
    return false;
  }

  moveToPreviousSection(): boolean {
    if (this.currentSectionIndex > 0) {
      this.currentSectionIndex--;
      return true;
    }
    return false;
  }

  isComplete(): boolean {
    return this.currentSectionIndex === this.currentFlow.sections.length - 1 &&
           this.canMoveToNextSection();
  }

  validateAllRules(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (const rule of this.currentFlow.validationRules) {
      if (!rule.validate(this.answers)) {
        errors.push(rule.errorMessage);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  getAnswers(): Record<string, any> {
    return { ...this.answers };
  }

  getProgress(): number {
    const totalSections = this.currentFlow.sections.length;
    const completedSections = this.currentSectionIndex;
    const currentSectionQuestions = this.getVisibleQuestions();
    const answeredInCurrent = currentSectionQuestions.filter(
      q => this.answers[q.id] !== undefined
    ).length;
    
    const currentSectionProgress = currentSectionQuestions.length > 0
      ? answeredInCurrent / currentSectionQuestions.length
      : 0;
    
    return ((completedSections + currentSectionProgress) / totalSections) * 100;
  }
}

// Générateur de contrat intelligent basé sur les réponses
export async function generateSmartContract(
  templateId: string,
  answers: Record<string, any>
): Promise<string> {
  // Ici, on génère un contrat juridiquement solide basé sur les réponses
  // En utilisant GPT-4 avec un prompt très détaillé incluant tous les articles de loi
  
  const contractPrompt = buildContractPrompt(templateId, answers);
  
  // Appel à OpenAI pour générer le contrat
  const contract = await generateWithOpenAI(contractPrompt);
  
  // Post-traitement et validation juridique
  return postProcessContract(contract, answers);
}

function buildContractPrompt(templateId: string, answers: Record<string, any>): string {
  // Construction d'un prompt détaillé avec toutes les clauses juridiques nécessaires
  return `Génère un contrat de ${templateId} professionnel et juridiquement solide...`;
}

async function generateWithOpenAI(prompt: string): Promise<string> {
  // Implémentation de l'appel OpenAI
  return '';
}

function postProcessContract(contract: string, answers: Record<string, any>): string {
  // Validation et enrichissement du contrat
  return contract;
}