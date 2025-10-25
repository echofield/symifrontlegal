import { Document } from "@/data/documents";

type DocumentCardProps = Document & {
  price: number;
};

export function DocumentCard({ title, description, tags, price }: DocumentCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <span className="text-lg font-medium text-blue-600">{price} €</span>
      </div>
      <p className="text-gray-600 leading-relaxed mb-6">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
