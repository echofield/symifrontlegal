import { SYSTEM_FR, userPromptFr } from './prompts';

// Use dynamic imports for heavy AI SDKs to reduce cold starts
export async function suggestContractFR(input: {
  description: string;
  budget?: number;
  roleA?: string;
  roleB?: string;
}) {
  const provider = (process.env.AI_PROVIDER ?? 'none').toLowerCase();
  const system = SYSTEM_FR;
  const user = userPromptFr(input);

  if (provider === 'openai' && process.env.OPENAI_API_KEY) {
    const OpenAI = (await import('openai')).default;
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const res = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_object' },
    });
    return JSON.parse(res.choices[0].message.content!);
  }

  if (provider === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const res = await client.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: user }],
      temperature: 0.2,
    });
    const text = res.content[0].type === 'text' ? res.content[0].text : '';
    return JSON.parse(text);
  }

  // Deterministic fallback if no AI provider
  return {
    title: 'Contrat de prestation à jalons',
    durationWeeks: 4,
    milestones: [
      { title: 'Cadrage', description: 'Spécifications et planning', amount: Math.round((input.budget ?? 100000) * 0.2) },
      { title: 'Prototype', description: 'Livrable v1', amount: Math.round((input.budget ?? 100000) * 0.4) },
      { title: 'Finalisation', description: 'Recette et remise', amount: Math.round((input.budget ?? 100000) * 0.4) },
    ],
    terms: [
      "Fonds détenus par la plateforme jusqu'à validation des jalons.",
      "Auto-validation après 5 jours ouvrés sans réponse.",
      'Transfert manuel des fonds au prestataire après validation.',
    ],
    risks: ['Retard côté client', 'Ambiguïté des livrables', 'Dépendances externes'],
  };
}


