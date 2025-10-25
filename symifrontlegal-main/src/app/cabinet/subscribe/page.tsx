"use client";

import { FormEvent, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const SUBSCRIPTION_FEATURES = [
  "Veille BODACC hebdomadaire",
  "Référencement prioritaire dans l’annuaire SYMI",
  "Support juridique garanti en 48h",
];

export default function CabinetSubscribePage() {
  const [email, setEmail] = useState("");
  const [cabinetName, setCabinetName] = useState("");
  const [siret, setSiret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const normalizedSiret = siret.replace(/\s+/g, "");
    if (!/^\d{14}$/.test(normalizedSiret)) {
      setError("Le SIRET doit contenir exactement 14 chiffres.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/cabinet/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          cabinetName,
          siret: normalizedSiret,
        }),
      });

      if (!response.ok) {
        throw new Error("Impossible de créer l’abonnement. Merci de réessayer.");
      }

      const data = (await response.json()) as { checkoutUrl?: string };

      if (!data.checkoutUrl) {
        throw new Error("URL de paiement manquante dans la réponse du serveur.");
      }

      window.location.href = data.checkoutUrl;
    } catch (submitError) {
      console.error(submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Une erreur inattendue est survenue."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10 text-center space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-blue-600">
          Abonnement cabinet
        </p>
        <h1 className="text-4xl font-bold text-gray-900">Accès prioritaire SYMI Legal</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {" "}
          Abonnez votre cabinet pour bénéficier d’une veille proactive et d’un support juridique prioritaire.
        </p>
        <div className="inline-flex items-baseline gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold mt-4">
          <span className="text-3xl">350 €</span>
          <span className="text-sm uppercase tracking-[0.3em]">/ mois</span>
        </div>
      </div>

      <div className="grid md:grid-cols-[2fr,1fr] gap-8">
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email professionnel
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="contact@votrecabinet.fr"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cabinetName" className="text-sm font-medium text-gray-700">
              Nom du cabinet
            </label>
            <input
              id="cabinetName"
              type="text"
              required
              value={cabinetName}
              onChange={(event) => setCabinetName(event.target.value)}
              placeholder="Cabinet Dupont & Associés"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="siret" className="text-sm font-medium text-gray-700">
              SIRET
            </label>
            <input
              id="siret"
              type="text"
              required
              inputMode="numeric"
              value={siret}
              onChange={(event) => setSiret(event.target.value)}
              placeholder="123 456 789 00012"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500">14 chiffres sans espaces obligatoires (espaces acceptés).</p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Redirection en cours..." : "Confirmer l’abonnement"}
          </button>
        </form>

        <aside className="bg-blue-600 text-white rounded-3xl p-8 space-y-4">
          <h2 className="text-xl font-semibold">Inclus dans l’abonnement</h2>
          <ul className="space-y-3 text-sm leading-relaxed">
            {SUBSCRIPTION_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white" aria-hidden />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-blue-100">
            Dès validation, un juriste référent vous contacte pour paramétrer votre espace et vos alertes personnalisées.
          </p>
        </aside>
      </div>
    </div>
  );
}
