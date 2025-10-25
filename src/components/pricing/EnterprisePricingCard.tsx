const ENTERPRISE_FEATURES = [
  "Génération de contrats à partir de vos templates",
  "Workflows d'approbation multi-équipes",
  "Intégration SSO & reporting personnalisé",
  "Accompagnement juridique dédié",
];

export function EnterprisePricingCard() {
  return (
    <div className="rounded-3xl border border-dashed border-primary-200 bg-white/60 p-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary-500">Entreprise</p>
      <h3 className="mt-2 text-3xl font-bold text-slate-900">Programme sur-mesure</h3>
      <p className="mt-4 text-slate-600">
        Déployez SYMI Legal à l’échelle de votre organisation : connecteurs API, gestion documentaire, audits automatisés.
      </p>

      <ul className="mt-8 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
        {ENTERPRISE_FEATURES.map((feature) => (
          <li key={feature} className="flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary-500" aria-hidden />
            {feature}
          </li>
        ))}
      </ul>

      <a
        href="mailto:contact@symi.legal?subject=Programme%20Entreprise"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
      >
        Contacter un expert
      </a>
    </div>
  );
}
