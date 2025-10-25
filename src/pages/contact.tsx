export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 space-y-4">
      <h1 className="text-3xl font-bold text-slate-900">Contact</h1>
      <p className="text-slate-600">
        Besoin d’un accompagnement sur mesure ? Envoyez-nous un email et un membre de l’équipe vous répond sous 24h.
      </p>
      <a
        href="mailto:contact@symi.legal"
        className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
      >
        contact@symi.legal
      </a>
    </div>
  );
}
