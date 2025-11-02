export const TEMPLATE_PRICE_EUR: Record<string, number> = {
  // Essential
  'bail-d-habitation-non-meubl': 29,
  'bail-de-location-meubl-e': 29,
  'contrat-de-colocation': 29,
  'reconnaissance-de-dette': 39,
  'attestation-de-fin-de-contrat-et-solde-de-tout-compte': 19,

  // Pro
  'contrat-de-prestation-de-services': 79,
  'contrat-de-travail-dur-e-ind-termin-e-cdi': 79,
  'contrat-de-travail-dur-e-d-termin-e-cdd': 79,
  'convention-de-rupture-conventionnelle': 89,
  'lettre-de-licenciement-pour-faute-grave': 79,

  // Premium
  'bail-commercial-3-6-9': 249,
  'promesse-synallagmatique-de-vente-immobili-re': 249,
};

export function getTemplatePrice(templateId: string): number {
  return TEMPLATE_PRICE_EUR[templateId] ?? 79;
}


