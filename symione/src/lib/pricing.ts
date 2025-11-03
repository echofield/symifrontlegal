export const TEMPLATE_PRICE_EUR: Record<string, number> = {
  // Essentials → 79 €
  'bail-d-habitation-non-meubl': 79,
  'bail-de-location-meubl-e': 79,
  'contrat-de-colocation': 79,
  'reconnaissance-de-dette': 79,
  'attestation-de-fin-de-contrat-et-solde-de-tout-compte': 79,

  // Pro → 89 €
  'contrat-de-prestation-de-services': 89,
  'contrat-de-travail-dur-e-ind-termin-e-cdi': 89,
  'contrat-de-travail-dur-e-d-termin-e-cdd': 89,
  'convention-de-rupture-conventionnelle': 89,
  'lettre-de-licenciement-pour-faute-grave': 89,

  // Premium → 249 €
  'bail-commercial-3-6-9': 249,
  'promesse-synallagmatique-de-vente-immobili-re': 249,
};

export function getTemplatePrice(templateId: string): number {
  return TEMPLATE_PRICE_EUR[templateId] ?? 89;
}


