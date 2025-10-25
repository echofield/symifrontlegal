export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">Contact</h1>
      <p className="text-gray-600">
        Notre équipe répond sous 48h ouvrées. Partagez votre besoin commercial ou juridique et nous vous recontactons rapidement.
      </p>
      <div className="rounded-3xl border border-gray-200 bg-white p-8 space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-blue-600">Email</p>
          <a className="text-lg font-semibold text-blue-700" href="mailto:hello@symi.legal">
            hello@symi.legal
          </a>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-blue-600">Téléphone</p>
          <a className="text-lg font-semibold text-blue-700" href="tel:+33980801010">
            +33 9 80 80 10 10
          </a>
        </div>
      </div>
    </div>
  );
}
