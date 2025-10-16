import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type InputDef = { key: string; label: string; type: string; required: boolean };
type Clause = { id: string; title: string; body: string };
type Template = {
  metadata: { title: string; jurisdiction: string; governing_law: string; version: string };
  inputs: InputDef[];
  clauses: Clause[];
};

const ensureArray = <T,>(value: unknown, label?: string): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (label) {
    console.warn(`[contracts/[id]] Fallback to [] for ${label}`, value);
  }
  return [];
};

export default function ContractDetailPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState<Template | null>(null);
  const [form, setForm] = useState<Record<string, string | number | boolean>>({});
  const [preview, setPreview] = useState('');

  // ✅ Correct variable for Next.js
  const api = process.env.NEXT_PUBLIC_API_URL;

  // Fetch the contract template
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function loadTemplate() {
      setLoading(true);
      try {
        const res = await fetch(`${api}/api/contracts/${id}`);
        if (!res.ok) throw new Error('Invalid response');
        const data = await res
          .json()
          .catch((err) => {
            console.warn("[contracts/[id]] Failed to parse contract detail response", err);
            return {} as unknown;
          });
        const templateData =
          data && typeof data === 'object' && data !== null
            ? (data as { template?: unknown }).template
            : null;
        if (
          templateData &&
          typeof templateData === 'object' &&
          !Array.isArray((templateData as Template).clauses)
        ) {
          console.warn('[contracts/[id]] Template clauses missing or invalid', templateData);
        }
        if (
          templateData &&
          typeof templateData === 'object' &&
          !Array.isArray((templateData as Template).inputs)
        ) {
          console.warn('[contracts/[id]] Template inputs missing or invalid', templateData);
        }
        const safeTemplate =
          templateData && typeof templateData === 'object'
            ? (templateData as Template)
            : null;
        if (!cancelled) setTemplate(safeTemplate);
      } catch (err) {
        console.error('Error loading template:', err);
        if (!cancelled) setTemplate(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTemplate();

    return () => {
      cancelled = true;
    };
  }, [id, api]);

  // Generate the contract preview text
  useEffect(() => {
    if (!template) return;
    const safeClauses = ensureArray<unknown>(template?.clauses, 'template-clauses').filter(
      (clause): clause is Clause =>
        !!clause &&
        typeof clause === 'object' &&
        typeof (clause as Clause).body === 'string'
    );
    const filled = safeClauses
      .map((c) =>
        c.body.replace(/\{\{(.*?)\}\}/g, (_, k) => String(form[String(k).trim()] ?? `{{${k}}}`)),
      )
      .join('\n\n');
    const title = template?.metadata?.title || 'Modèle de contrat';
    setPreview(`# ${title}\n\n${filled}`);
  }, [template, form]);

  if (loading) return <main className="container">Chargement…</main>;
  if (!template) return <main className="container">Introuvable</main>;

  const onChange = (key: string, value: string | number | boolean) =>
    setForm((s) => ({ ...s, [key]: value }));

  const validInputs = ensureArray<unknown>(template.inputs, 'template-inputs').filter(
    (input): input is InputDef =>
      !!input &&
      typeof input === 'object' &&
      typeof (input as InputDef).key === 'string' &&
      typeof (input as InputDef).label === 'string'
  );

  const downloadPdf = async () => {
    try {
      const res = await fetch(`${api}/api/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract_text: preview,
          format: 'pdf',
          metadata: { version: template?.metadata?.version },
        }),
      });

      if (!res.ok) {
        alert('Erreur lors de la génération du PDF.');
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      alert('Erreur lors de la génération du PDF.');
    }
  };

  return (
    <main className="container">
      <h1 style={{ marginBottom: 8 }}>{template?.metadata?.title || 'Modèle de contrat'}</h1>
      <p style={{ color: '#6b7280', marginTop: 0 }}>Générer le contrat</p>

      <div className="grid grid-2" style={{ gap: 24 }}>
        <section className="card">
          {validInputs.length > 0 ? (
            validInputs.map((inp) => (
              <div key={inp.key} style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 6 }}>{inp.label}</label>
                <input
                  className="input"
                  type={
                    typeof inp.type === 'string'
                      ? inp.type === 'textarea'
                        ? 'text'
                        : inp.type
                      : 'text'
                  }
                  onChange={(e) => onChange(inp.key, e.target.value)}
                  placeholder={inp.label}
                />
              </div>
            ))
          ) : (
            <p style={{ color: '#888', fontSize: 14 }}>Aucun champ à remplir.</p>
          )}
          <button onClick={downloadPdf} className="btn btn-primary">
            Télécharger le PDF
          </button>
        </section>

        <section className="card">
          <pre className="pre">{preview || 'Prévisualisation du contrat...'}</pre>
        </section>
      </div>
    </main>
  );
}
