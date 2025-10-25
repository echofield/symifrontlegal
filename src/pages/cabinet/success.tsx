const FEATURES = [
  "Accès à l’espace cabinet et onboarding personnalisé",
  "Alertes BODACC & opportunités ciblées",
  "Référencement prioritaire auprès des clients SYMI",
];

export default function CabinetSubscribeSuccessPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <div className="space-y-4">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-3xl text-primary-600">
          ✅
        </span>
        <h1 className="text-3xl font-bold text-slate-900">Merci !</h1>
        <p className="text-slate-600">Accès envoyé par email sous 24h.</p>
      </div>

      <div className="mx-auto mt-10 max-w-md space-y-3 text-left text-sm text-slate-600">
        <h2 className="text-center text-base font-semibold text-primary-700">Vous recevez aussi</h2>
        <ul className="space-y-2">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" aria-hidden />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
