export default function DocumentationPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">Documentation produit</h1>
      <p className="text-gray-600">
        Retrouvez prochainement les guides d’utilisation détaillés pour SYMI Legal. En attendant, contactez notre équipe pour
        accéder aux ressources ou planifier une démonstration personnalisée.
      </p>
      <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-4 text-blue-700">
        Besoin d’un guide spécifique ? Écrivez-nous sur <a className="font-semibold underline" href="mailto:hello@symi.legal">hello@symi.legal</a>.
      </div>
    </div>
  );
}
