import Link from "next/link";

type CabinetPricingCardProps = {
  price: number;
};

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 text-blue-600 mt-1"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const cabinetFeatures = [
  "Veille BODACC hebdomadaire",
  "Référencement prioritaire dans le réseau SYMI",
  "Support juridique en 48h ouvrées",
  "Alerte sur les opportunités de missions",
];

export function CabinetPricingCard({ price }: CabinetPricingCardProps) {
  return (
    <div className="border border-gray-200 rounded-3xl p-10 bg-white shadow-lg">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <span className="uppercase text-sm tracking-[0.4em] text-gray-500">Cabinet</span>
          <h3 className="text-3xl font-semibold mt-4">Abonnement cabinet</h3>
        </div>
        <div className="text-right">
          <p className="text-5xl font-bold text-gray-900">{price} €</p>
          <p className="text-gray-500">par mois</p>
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {cabinetFeatures.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-gray-700">
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-gray-500">
          Délais garantis sous 48h et accompagnement par un juriste référent dédié.
        </p>
        <Link
          href="/cabinet/subscribe"
          className={[
            "inline-flex items-center justify-center",
            "bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold",
            "hover:bg-blue-700 transition",
          ].join(" ")}
        >
          Abonner mon cabinet
        </Link>
      </div>
    </div>
  );
}
