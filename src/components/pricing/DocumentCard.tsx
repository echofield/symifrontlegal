import { Document } from "@/data/documents";

type DocumentCardProps = Document & { price: number };

export function DocumentCard({ title, description, tags, price }: DocumentCardProps) {
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <header className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </header>

      <footer className="mt-6 flex items-center justify-between">
        <div className="flex flex-wrap gap-2 text-xs text-primary-700">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-primary-50 px-3 py-1 font-medium">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-lg font-semibold text-primary-600">€{price}</span>
      </footer>
    </article>
  );
}
