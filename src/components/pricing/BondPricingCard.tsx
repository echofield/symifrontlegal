type BondPricingCardProps = {
  setup: number;
  commission: number;
  types: string[];
};

const typeLabels: Record<string, string> = {
  service: "Prestation de service",
  travaux: "Travaux",
  creation: "Création artistique",
  event: "Événementiel",
};

export function BondPricingCard({ setup, commission, types }: BondPricingCardProps) {
  return (
    <div className="grid gap-6 rounded-3xl bg-slate-900 p-8 text-white md:grid-cols-[2fr,3fr]">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary-200">Bond</p>
        <h3 className="text-3xl font-bold">Contrat + Escrow + Signature</h3>
        <p className="text-sm text-slate-200">
          Sécurisez vos missions complexes avec un contrat sur-mesure, un suivi de jalons et un paiement sous séquestre.
        </p>

        <div className="rounded-2xl bg-white/10 p-4 text-sm">
          <p>
            Frais de mise en place : <span className="font-semibold">€{setup}</span>
          </p>
          <p>
            Commission escrow : <span className="font-semibold">{commission}%</span>
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 text-slate-900">
        <h4 className="text-lg font-semibold">Missions couvertes</h4>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          {types.map((type) => (
            <li key={type} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary-600" aria-hidden />
              <span>{typeLabels[type] ?? type}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
