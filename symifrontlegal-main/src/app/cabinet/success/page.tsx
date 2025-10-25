const INCLUDED_FEATURES = [
  "Accès administrateur envoyé sous 24h",
  "Veille BODACC & alertes personnalisées",
  "Support prioritaire par un juriste référent",
  "Accès aux modèles premium SYMI Legal",
];

export default function CabinetSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-8">
      <div className="space-y-3">
        <span className="inline-flex items-center justify-center rounded-full bg-blue-50 text-blue-700 px-4 py-1 text-sm font-medium">
          Abonnement confirmé
        </span>
        <h1 className="text-4xl font-bold text-gray-900">
          Merci ! Accès envoyé par email sous 24h
        </h1>
        <p className="text-gray-600">
          Notre équipe Legal Ops finalise la configuration de votre espace. Vous recevrez un email de bienvenue avec les
          prochaines étapes et les accès collaborateurs.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8 text-left">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ce qui est inclus</h2>
        <ul className="space-y-3 text-gray-700">
          {INCLUDED_FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" aria-hidden />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-gray-500">
        Besoin d’aide immédiate ? Écrivez-nous sur <a className="text-blue-600 hover:underline" href="mailto:hello@symi.legal">hello@symi.legal</a>.
      </p>
    </div>
  );
}
