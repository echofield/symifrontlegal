import Link from "next/link";
import { DocumentCard } from "@/components/pricing/DocumentCard";
import { BondPricingCard } from "@/components/pricing/BondPricingCard";
import { CabinetPricingCard } from "@/components/pricing/CabinetPricingCard";
import { EnterprisePricingCard } from "@/components/pricing/EnterprisePricingCard";
import { DOCUMENTS } from "@/data/documents";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <section className="mb-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-slate-900">Tarifs</h1>
        <p className="mt-3 text-lg text-slate-600">Simple, transparent, sans engagement</p>
      </section>

      <section className="mb-20">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-slate-900">Documents juridiques</h2>
          <div className="mt-6 inline-flex flex-col items-center rounded-2xl border border-primary-100 bg-primary-50 px-6 py-4">
            <span className="text-6xl font-bold text-primary-600">€119</span>
            <p className="text-sm text-primary-700">par document • tous types</p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DOCUMENTS.map((doc) => (
            <DocumentCard key={doc.id} {...doc} price={119} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/contracts"
            className="inline-flex items-center justify-center rounded-full bg-primary-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            Générer un document →
          </Link>
        </div>
      </section>

      <section className="mb-20">
        <BondPricingCard setup={149} commission={3} types={["service", "travaux", "creation", "event"]} />
      </section>

      <section className="mb-20">
        <CabinetPricingCard price={350} />
      </section>

      <section>
        <EnterprisePricingCard />
      </section>
    </div>
  );
}
