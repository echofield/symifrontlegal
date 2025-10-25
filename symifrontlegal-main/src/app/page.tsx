import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-center space-y-6">
      <h1 className="text-5xl font-bold">Bienvenue chez SYMI Legal</h1>
      <p className="text-xl text-gray-600">
        Accédez à nos outils juridiques: génération de documents, contrats sécurisés Bond et assistant juridique.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/pricing"
          className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Voir nos tarifs
        </Link>
        <Link
          href="/conseiller"
          className="px-6 py-3 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
        >
          Parler à un conseiller
        </Link>
      </div>
    </main>
  );
}
