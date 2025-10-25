import Link from "next/link";

type CabinetPricingCardProps = {
  price: number;
};

const FEATURES = [
  "Veille BODACC hebdomadaire",
  "Référencement prioritaire des dossiers",
  "Support juridique dédié sous 48h",
];

export function CabinetPricingCard({ price }: CabinetPricingCardProps) {
  return (
    <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:grid-cols-[3fr,2fr]">
      <div className="space-y-4">
        <h3 className="text-3xl font-bold text-slate-900">Cabinets partenaires</h3>
        <p className="text-slate-600">
          Accédez à une plateforme complète pour qualifier vos leads, suivre les demandes et assurer une présence renforcée auprès
          des clients SYMI.
        </p>
        <div className="inline-flex items-baseline gap-2 rounded-full bg-primary-50 px-4 py-2 text-primary-700">
          <span className="text-3xl font-semibold">€{price}</span>
          <span className="text-xs uppercase tracking-[0.3em]">/ mois</span>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl bg-slate-900 p-6 text-white">
        <ul className="space-y-3 text-sm">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary-300" aria-hidden />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/cabinet/subscribe"
          className="inline-flex w-full items-center justify-center rounded-xl bg-white py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
        >
          Rejoindre le programme
        </Link>
      </div>
    </div>
  );
}
