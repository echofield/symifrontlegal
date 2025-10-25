export default function DocumentationPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 space-y-4">
      <h1 className="text-3xl font-bold text-slate-900">Documentation</h1>
      <p className="text-slate-600">
        Les guides d’intégration et la documentation API arrivent bientôt. Contactez-nous pour recevoir un accès prioritaire.
      </p>
      <a
        href="mailto:contact@symi.legal?subject=Documentation"
        className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
      >
        Demander l’accès
      </a>
    </div>
  );
}
