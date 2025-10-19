export const SYSTEM_FR = `
Tu es un juriste-conseil. Propose une structuration de contrat de prestation à jalons.
RENVOIE UNIQUEMENT du JSON strict:
{
  "title": string,
  "durationWeeks": number,
  "milestones": [{"title": string, "description": string, "amount": number}],
  "terms": [string],
  "risks": [string]
}
Les "amount" doivent sommer le budget si fourni, sinon proposer une répartition cohérente.
`;

export function userPromptFr(input: { description: string; budget?: number; roleA?: string; roleB?: string }) {
  return `Description: ${input.description}
Budget: ${input.budget ?? 'N/A'}
Parties: ${input.roleA ?? 'Client'} vs ${input.roleB ?? 'Prestataire'}
Langue: FR`;
}


