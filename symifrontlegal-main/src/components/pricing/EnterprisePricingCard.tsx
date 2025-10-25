export function EnterprisePricingCard() {
  const MailIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M4 4h16v16H4z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );

  const BuildingIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 21V9h6v12" />
      <path d="M9 7h6" />
      <path d="M7 12h2" />
      <path d="M15 12h2" />
    </svg>
  );

  return (
    <div className="border border-gray-200 rounded-3xl p-10 bg-slate-50">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center">
          <BuildingIcon />
        </div>
        <div>
          <span className="uppercase text-sm tracking-[0.4em] text-gray-500">Entreprise</span>
          <h3 className="text-3xl font-semibold text-gray-900 mt-2">Programme Legal Ops</h3>
        </div>
      </div>

      <p className="text-gray-600 leading-relaxed mb-8">
        Onboardez vos équipes avec un accompagnement complet: templates personnalisés, automatisation des revues et
        suivi des risques. Idéal pour les entreprises en forte croissance ou les cabinets qui souhaitent industrialiser
        leurs processus.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          {
            title: "Template Factory",
            description: "Création et maintenance de votre bibliothèque contractuelle.",
          },
          {
            title: "Workflow Ops",
            description: "Routage interne, niveaux d'approbation et base de connaissances.",
          },
          {
            title: "Data & Risk",
            description: "Tableaux de bord, obligations et alertes par notifications.",
          },
        ].map((item) => (
          <div key={item.title} className="p-6 rounded-2xl bg-white shadow-sm border border-gray-200">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-800">Sur devis</p>
          <p className="text-sm text-gray-500">Pack annuel avec pilotage par un Legal Ops senior.</p>
        </div>
        <a
          href="mailto:hello@symi.legal"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          <MailIcon />
          Discuter de votre programme
        </a>
      </div>
    </div>
  );
}
