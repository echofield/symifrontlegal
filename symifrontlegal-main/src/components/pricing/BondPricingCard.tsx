import Link from "next/link";

type BondPricingCardProps = {
  setup: number;
  commission: number;
  types: string[];
};

function CheckCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 mt-1 text-blue-400"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

const bondFeatures = [
  "Workflow complet: signature électronique, facturation et suivi",
  "Escrow automatique pour sécuriser le paiement",
  "Alertes jalons et validation livrables",
  "Support dédié par juriste partenaire",
];

export function BondPricingCard({ setup, commission, types }: BondPricingCardProps) {
  return (
    <div className="bg-slate-900 text-white rounded-3xl p-10 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700/20 via-blue-500/10 to-transparent" />
      <div className="relative">
        <span className="uppercase tracking-[0.4em] text-sm text-blue-300">Bond</span>
        <h3 className="text-3xl font-semibold mt-4 mb-6">Contrats avec paiement sécurisé</h3>

        <div className="flex flex-wrap items-end gap-6 mb-8">
          <div>
            <p className="text-sm uppercase text-slate-300">Mise en place</p>
            <p className="text-4xl font-bold">{setup} €</p>
          </div>
          <div className="flex-1 border-l border-slate-700 pl-6">
            <p className="text-sm uppercase text-slate-300 mb-1">Commission</p>
            <p className="text-2xl font-semibold">{commission}% / transaction</p>
            <p className="text-slate-400 text-sm">Encaissement par compte séquestre SYMI.</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm uppercase text-slate-300 mb-3">Types de missions pris en charge</p>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <span key={type} className="px-4 py-1 rounded-full bg-slate-800 text-sm capitalize">
                {type}
              </span>
            ))}
          </div>
        </div>

        <ul className="space-y-4 mb-10">
          {bondFeatures.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-slate-200">
              <CheckCircleIcon />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/bond/create"
          className={[
            "inline-flex items-center justify-center",
            "bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold",
            "hover:bg-slate-100 transition",
          ].join(" ")}
        >
          Activer Bond
        </Link>
      </div>
    </div>
  );
}
