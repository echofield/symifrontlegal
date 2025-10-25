import { useMemo, useState } from "react";
import { LAWYER_AUDIT_QUESTIONS } from "@/data/lawyer-audit-questions";
import { FormField } from "@/components/forms/FormField";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type AdvisorResponse = {
  output?: {
    reply_text?: string;
  };
};

type AdvisorForm = Record<string, string>;

export default function ConseillerPage() {
  const [question, setQuestion] = useState("");
  const [formData, setFormData] = useState<AdvisorForm>({ typeSituation: "", urgence: "", budget: "" });
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [advisorAnswer, setAdvisorAnswer] = useState<string | null>(null);

  const defaultFormData = useMemo(() => {
    const defaults: AdvisorForm = {};
    for (const q of LAWYER_AUDIT_QUESTIONS) {
      defaults[q.id] = "";
    }
    return defaults;
  }, []);

  const mergedFormData = { ...defaultFormData, ...formData };

  const handleSubmit = async () => {
    if (!question || !mergedFormData.typeSituation) return;

    setSubmitting(true);
    setStatusMessage(null);

    try {
      const response = await fetch(`${API_URL}/api/advisor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context: mergedFormData }),
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const data = (await response.json()) as AdvisorResponse;
      setAdvisorAnswer(data.output?.reply_text ?? null);
      setStatusMessage("✅ Vos informations ont bien été transmises à un conseiller juridique.");
      setQuestion("");
      setFormData({ ...defaultFormData });
    } catch (error) {
      console.error(error);
      setStatusMessage("❌ Une erreur est survenue, veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-10 space-y-3">
        <h1 className="text-3xl font-bold text-slate-900">Assistant juridique</h1>
        <p className="text-slate-600">
          Décrivez votre situation pour recevoir une analyse détaillée et des recommandations d&apos;avocats.
        </p>
      </header>

      <div className="mb-8 space-y-3">
        <label className="block text-sm font-medium text-slate-700">
          Décrivez votre situation à gauche pour recevoir une analyse juridique détaillée
        </label>
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Exemple: Mon employeur refuse de me payer mes heures supplémentaires depuis 3 mois..."
          rows={6}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>

      <div className="space-y-6">
        {LAWYER_AUDIT_QUESTIONS.map((q) => (
          <FormField
            key={q.id}
            question={q}
            value={mergedFormData[q.id]}
            onChange={(value) => setFormData((prev) => ({ ...prev, [q.id]: value }))}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!question || !mergedFormData.typeSituation || submitting}
        className="mt-8 w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {submitting ? "Envoi en cours..." : "Obtenir une analyse et des recommandations d\u2019avocats"}
      </button>

      {advisorAnswer && (
        <section className="mt-10 rounded-2xl border border-primary-100 bg-primary-50 p-6 text-sm text-primary-900">
          <h2 className="text-lg font-semibold text-primary-700">Réponse du conseiller</h2>
          <p className="mt-2 whitespace-pre-wrap">{advisorAnswer}</p>
        </section>
      )}

      {statusMessage && (
        <p className="mt-6 text-sm text-slate-700" role="status">
          {statusMessage}
        </p>
      )}
    </div>
  );
}
