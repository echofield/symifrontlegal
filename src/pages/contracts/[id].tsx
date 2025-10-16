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

// 🛡️ Ultra-safe array helper
const ensureArray = <T,>(val: unknown, label: string): T[] => {
  if (!val) return [];
  if (!Array.isArray(val)) {
    console.warn(`[ensureArray] Expected array for ${label}, got`, val);
    return [];
  }
  return val as T[];
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
      setError(null);
      try {
        const res = await fetch(`${api}/api/contracts/${id}`);
        if (!res.ok) throw new Error(`Failed to load template (${res.status})`);
        const data = await res.json();
        
        // 🛡️ Validate the response structure
        if (!data || typeof data !== 'object') {
          throw new Error("Invalid response format");
        }
        
        setTemplate(data);
        console.log("✅ Template loaded:", data);
      } catch (err: any) {
        console.error("❌ Template load error:", err);
        setError(err.message || "Erreur de chargement");
        setTemplate(null);
      } finally {
        setLoading(false);
      }
    }
    
    load();
  }, [api, id]);

  // 🛡️ Safe data extraction - only after template is loaded
  const clauses = template ? ensureArray<Clause>(template.clauses, "clauses") : [];
  const inputs = template ? ensureArray<InputField>(template.inputs, "inputs") : [];

  if (loading) return <main className="container"><p>Chargement…</p></main>;
  if (error) return <main className="container"><p style={{ color: "red" }}>{error}</p></main>;
  if (!template) return <main className="container"><p>Aucun modèle trouvé.</p></main>;

  return (
    <main className="container">
      <h1>{template.title || "Sans titre"}</h1>
      {template.description && <p className="muted">{template.description}</p>}

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
                <strong>{c.title || "Sans titre"}</strong>: {c.text || "Contenu manquant"}
              </li>
            ))}
          </ul>
        </section>
      )}

      {inputs.length === 0 && clauses.length === 0 && (
        <p className="muted" style={{ marginTop: 16 }}>
          Ce modèle n'a pas encore de contenu détaillé.
        </p>
      )}
    </main>
  );
}
