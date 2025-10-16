import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Clause = { title: string; text: string };
type InputField = { name: string; label: string; type?: string };
type Template = {
  id: string;
  title: string;
  description?: string;
  clauses?: Clause[];
  inputs?: InputField[];
  category?: string;
};

const ensureArray = (val: any, label: string) => {
  if (!Array.isArray(val)) {
    console.warn(`[ensureArray] Expected array for ${label}, got`, val);
    return [];
  }
  return val;
};

export default function ContractDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${api}/api/contracts/${id}`);
        if (!res.ok) throw new Error(`Failed to load template (${res.status})`);
        const data = await res.json();
        setTemplate(data);
        console.log("✅ Template loaded:", data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [api, id]);

  if (loading) return <p>Chargement…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!template) return <p>Aucun modèle trouvé.</p>;

  // 🧱 Defensive normalization
  const clauses = ensureArray(template.clauses, "clauses");
  const inputs = ensureArray(template.inputs, "inputs");

  return (
    <main className="container">
      <h1>{template.title}</h1>
      <p className="muted">{template.description}</p>

      {inputs.length > 0 && (
        <section style={{ marginTop: 20 }}>
          <h3>Champs à remplir</h3>
          <ul>
            {inputs.map((field, i) => (
              <li key={i}>
                {field.label} ({field.type || "text"})
              </li>
            ))}
          </ul>
        </section>
      )}

      {clauses.length > 0 && (
        <section style={{ marginTop: 20 }}>
          <h3>Clauses principales</h3>
          <ul>
            {clauses.map((c, i) => (
              <li key={i}>
                <strong>{c.title}</strong>: {c.text}
              </li>
            ))}
          </ul>
        </section>
      )}

      {inputs.length === 0 && clauses.length === 0 && (
        <p className="muted" style={{ marginTop: 16 }}>
          Ce modèle n’a pas encore de contenu détaillé.
        </p>
      )}
    </main>
  );
}
