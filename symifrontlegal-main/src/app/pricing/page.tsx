import { DOCUMENTS } from "@/data/documents";
import { DocumentCard } from "@/components/pricing/DocumentCard";
import { BondPricingCard } from "@/components/pricing/BondPricingCard";
import { CabinetPricingCard } from "@/components/pricing/CabinetPricingCard";
import { EnterprisePricingCard } from "@/components/pricing/EnterprisePricingCard";

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Tarifs</h1>
        <p className="text-xl text-gray-600">Simple, transparent, sans engagement</p>
      </div>

      {/* Prix unique documents */}
      <section id="documents" className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-4">Documents juridiques</h2>
          <div className="inline-block">
            <div className="text-6xl font-bold text-blue-600 mb-2">€119</div>
            <p className="text-gray-600">par document • tous types</p>
          </div>
        </div>

        {/* Liste documents (garde ton style actuel) */}
        <div className="grid md:grid-cols-3 gap-4">
          {DOCUMENTS.map((doc) => (
            <DocumentCard key={doc.id} {...doc} price={119} />
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
            Générer un document →
          </button>
        </div>
      </section>

      {/* Bond (garde ton design Image 2) */}
      <section className="mb-20">
        <BondPricingCard setup={149} commission={3} types={["service", "travaux", "creation", "event"]} />
      </section>

      {/* Cabinet (garde ton design Image 1) */}
      <section className="mb-20">
        <CabinetPricingCard price={350} />
      </section>

      {/* Entreprise */}
      <section>
        <EnterprisePricingCard />
      </section>
    </div>
  );
}
