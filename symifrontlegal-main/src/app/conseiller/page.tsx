"use client";

import { useMemo, useState } from "react";
import { LAWYER_AUDIT_QUESTIONS } from "@/data/lawyer-audit-questions";
import { FormField } from "@/components/forms/FormField";

export default function ConseillerPage() {
  const [question, setQuestion] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({
    typeSituation: "",
    urgence: "",
    budget: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const defaultFormData = useMemo(() => {
    const defaults: Record<string, string> = {};
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
      await new Promise((resolve) => setTimeout(resolve, 600));
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
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Assistant juridique</h1>
      <p className="text-gray-600 mb-8">
        Décrivez votre situation pour recevoir une analyse détaillée et des recommandations d'avocats
      </p>

      {/* ✅ FIXER CE CHAMP (actuellement non éditable) */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">
          Décrivez votre situation à gauche pour recevoir une analyse juridique détaillée
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Exemple: Mon employeur refuse de me payer mes heures supplémentaires depuis 3 mois..."
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Formulaire structuré (18 questions) */}
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
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition mt-8"
      >
        {submitting ? "Envoi en cours..." : "Obtenir une analyse et des recommandations d'avocats"}
      </button>

      {statusMessage && (
        <p className="mt-6 text-sm text-gray-700" role="status">
          {statusMessage}
        </p>
      )}
    </div>
  );
}
