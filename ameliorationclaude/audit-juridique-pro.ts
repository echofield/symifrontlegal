// audit-juridique-pro.ts
const generateProfessionalAudit = (problem: string) => {
  const systemPrompt = `Tu es un expert juridique français avec 20 ans d'expérience. 
Tu analyses les situations juridiques en profondeur avec précision et rigueur.
Tu connais parfaitement le droit français : Code civil, Code du travail, Code de commerce, Code pénal, etc.
Tu fournis toujours des références légales précises et des conseils actionnables.`;

  const userPrompt = `Analyse cette situation juridique de manière APPROFONDIE et PROFESSIONNELLE :

"""
${problem}
"""

Réponds UNIQUEMENT en JSON valide avec ce format COMPLET ET DÉTAILLÉ :

{
  "summary": "Résumé exécutif en 2-3 phrases avec qualification juridique précise",
  
  "legalQualification": {
    "category": "Catégorie juridique principale (ex: Droit du travail, Droit commercial, etc.)",
    "subcategory": "Sous-catégorie spécifique",
    "legalNature": "Nature juridique exacte (contrat, délit, litige, etc.)",
    "applicableLaw": ["Article L.XXX du Code Y", "Loi du XX/XX/XXXX", "Jurisprudence Cass. XX"]
  },
  
  "stakeholders": {
    "parties": ["Partie 1: statut/rôle", "Partie 2: statut/rôle"],
    "thirdParties": ["Tiers impliqués le cas échéant"],
    "jurisdiction": "Tribunal compétent (TI, TJ, Prud'hommes, Commerce, etc.)"
  },
  
  "financialAnalysis": {
    "estimatedAmount": "Montant estimé de l'enjeu en euros",
    "minAmount": "Montant minimum",
    "maxAmount": "Montant maximum",
    "costs": {
      "legalFees": "Estimation frais d'avocat",
      "courtFees": "Frais de justice",
      "otherCosts": "Autres frais (expertise, huissier, etc.)"
    }
  },
  
  "timelineAnalysis": {
    "prescriptionDelay": "Délai de prescription applicable",
    "remainingTime": "Temps restant avant prescription",
    "criticalDates": [
      {"date": "JJ/MM/AAAA ou délai", "event": "Événement critique", "mandatory": true}
    ],
    "estimatedDuration": "Durée estimée de résolution (amiable/judiciaire)"
  },
  
  "riskAssessment": {
    "immediateRisks": [
      {"risk": "Description du risque", "probability": "Faible/Moyenne/Élevée", "impact": "1-10"}
    ],
    "legalRisks": [
      {"risk": "Risque juridique", "penalty": "Sanction possible", "references": ["Art. XXX"]}
    ],
    "financialRisks": [
      {"risk": "Risque financier", "amount": "Montant estimé", "mitigation": "Solution"}
    ],
    "reputationalRisks": ["Impact réputation si applicable"],
    "globalRisk": "Score 1-10 avec justification"
  },
  
  "legalPoints": [
    {
      "point": "Point de droit crucial",
      "explanation": "Explication détaillée",
      "references": ["Article L.XXX", "Jurisprudence"],
      "strength": "Force du point (Faible/Moyenne/Forte)"
    }
  ],
  
  "actionPlan": {
    "immediate": [
      {
        "action": "Action à faire sous 48h",
        "responsible": "Qui doit le faire",
        "deadline": "Délai précis",
        "documents": ["Documents nécessaires"],
        "cost": "Coût estimé"
      }
    ],
    "shortTerm": [
      {
        "action": "Action sous 15 jours",
        "responsible": "Responsable",
        "deadline": "Délai",
        "prerequisites": ["Prérequis"]
      }
    ],
    "mediumTerm": [
      {
        "action": "Action sous 3 mois",
        "milestone": "Jalon clé",
        "expectedOutcome": "Résultat attendu"
      }
    ]
  },
  
  "evidenceRequired": {
    "essential": ["Preuve indispensable 1", "Preuve 2"],
    "supporting": ["Preuve complémentaire"],
    "obtaining": [
      {"evidence": "Type de preuve", "method": "Comment l'obtenir", "delay": "Délai"}
    ]
  },
  
  "resolutionStrategies": {
    "amicable": {
      "possible": true,
      "probability": "Faible/Moyenne/Élevée",
      "approach": "Stratégie de négociation",
      "duration": "2-4 mois",
      "cost": "500-2000€"
    },
    "mediation": {
      "recommended": true,
      "type": "Médiation conventionnelle/judiciaire",
      "duration": "1-3 mois",
      "cost": "1000-3000€"
    },
    "litigation": {
      "lastResort": true,
      "procedure": "Procédure applicable",
      "duration": "6-18 mois",
      "successRate": "60-80%",
      "cost": "3000-15000€"
    }
  },
  
  "lawyerRecommendation": {
    "necessary": true,
    "urgency": "Immédiate/Sous 7 jours/Sous 1 mois",
    "specialty": "Spécialité exacte requise",
    "subSpecialties": ["Sous-spécialité 1", "Sous-spécialité 2"],
    "expertise": ["Expertise spécifique recherchée"],
    "estimatedHours": "20-50 heures",
    "budget": "2000-10000€"
  },
  
  "templates": {
    "recommendedTemplateId": "ID du template le plus pertinent",
    "alternativeTemplates": ["template-alternatif-1", "template-alternatif-2"],
    "customizationNeeded": ["Point à personnaliser 1", "Point 2"],
    "clausesToAdd": ["Clause spécifique à ajouter"]
  },
  
  "followUp": {
    "questions": [
      "Question pour clarifier un point important non mentionné",
      "Question sur un détail crucial manquant"
    ],
    "missingInfo": ["Information manquante importante"],
    "assumptions": ["Hypothèse faite à valider"]
  },
  
  "metadata": {
    "complexity": "Simple/Moyenne/Complexe/Très complexe",
    "urgency": "Score 1-10 avec justification",
    "confidence": "Niveau de confiance dans l'analyse 70-100%",
    "lastUpdated": "Date de dernière mise à jour du droit applicable"
  }
}

RÈGLES IMPÉRATIVES :
- Toujours citer des articles de loi précis
- Donner des montants réalistes en euros
- Fournir des délais concrets
- needsLawyer=true si : enjeux > 5000€, procédure judiciaire, pénal, ou négociation complexe
- Être précis sur les juridictions compétentes
- Donner un plan d'action chronologique clair`;

  return { systemPrompt, userPrompt };
};

// Exemple d'utilisation avec OpenAI
export async function performProfessionalAudit(problem: string) {
  const { systemPrompt, userPrompt } = generateProfessionalAudit(problem);
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3, // Plus de précision
      max_tokens: 4000, // Plus de tokens pour analyse complète
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(response.choices[0].message.content || "{}");
    
    // Validation et enrichissement post-traitement
    return enrichAnalysis(analysis);
  } catch (error) {
    console.error("Erreur audit:", error);
    throw error;
  }
}

// Post-traitement pour enrichir l'analyse
function enrichAnalysis(analysis: any) {
  // Calcul du score de risque global
  if (analysis.riskAssessment?.immediateRisks) {
    const avgRisk = analysis.riskAssessment.immediateRisks.reduce(
      (acc: number, r: any) => acc + (r.impact || 5), 0
    ) / analysis.riskAssessment.immediateRisks.length;
    analysis.riskAssessment.globalRisk = Math.round(avgRisk);
  }
  
  // Ajout de références légales si manquantes
  if (analysis.legalQualification?.category) {
    const legalRefs = getLegalReferences(analysis.legalQualification.category);
    analysis.legalQualification.applicableLaw = [
      ...new Set([
        ...(analysis.legalQualification.applicableLaw || []),
        ...legalRefs
      ])
    ];
  }
  
  return analysis;
}

// Base de références légales par domaine
function getLegalReferences(category: string): string[] {
  const references: Record<string, string[]> = {
    "Droit du travail": [
      "Art. L1232-1 et s. Code du travail (licenciement)",
      "Art. L1221-1 et s. Code du travail (contrat)",
      "Art. L3121-1 et s. Code du travail (durée du travail)"
    ],
    "Droit commercial": [
      "Art. L110-1 et s. Code de commerce",
      "Art. L210-1 et s. Code de commerce (sociétés)",
      "Art. L441-1 et s. Code de commerce (pratiques)"
    ],
    "Droit de la consommation": [
      "Art. L111-1 et s. Code de la consommation",
      "Art. L217-1 et s. Code de la consommation (garanties)",
      "Art. L221-1 et s. Code de la consommation (distance)"
    ],
    "Droit civil": [
      "Art. 1101 et s. Code civil (contrats)",
      "Art. 1240 et s. Code civil (responsabilité)",
      "Art. 544 et s. Code civil (propriété)"
    ]
  };
  
  return references[category] || ["Code civil", "Code de commerce"];
}