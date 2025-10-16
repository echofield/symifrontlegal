import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import { ensureArray } from '@/utils/ensureArray';

type InputDef = { key: string; label: string; type: string; required: boolean };
type Clause = { id: string; title: string; body: string };
type Template = {
  metadata: { title: string; jurisdiction: string; governing_law: string; version: string };
  inputs: InputDef[];
  clauses: Clause[];
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
    setLoading(true);
    fetch(`${api}/api/contracts/${id}`)
      .then((r) => {
        if (!r.ok) {
          console.warn(`Impossible de charger le contrat ${id} (${r.status}).`);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        setTemplate(data?.template ?? null);
      })
      .catch((err) => {
        console.error('Error loading template:', err);
        setTemplate(null);
      })
      .finally(() => setLoading(false));
  }, [id, api]);

  // Generate the contract preview text
  const { list: safeClauses, dropped: droppedClauses } = useMemo(() => {
    if (!template) {
      return { list: [], dropped: 0 };
    }

    const normalized = ensureArray<Clause>(template.clauses, 'template.clauses');
    const filtered = normalized.filter(
      (clause): clause is Clause => Boolean(clause) && typeof clause?.body === 'string',
    );

    return { list: filtered, dropped: normalized.length - filtered.length };
  }, [template]);

  useEffect(() => {
    if (droppedClauses > 0) {
      console.warn(`${droppedClauses} clause(s) ignorée(s) car sans contenu valide.`);
    }
  }, [droppedClauses]);

  useEffect(() => {
    if (!template) return;

    const filled = safeClauses
      .map((c) =>
        c.body.replace(/\{\{(.*?)\}\}/g, (_, k) => String(form[String(k).trim()] ?? `{{${k}}}`)),
      )
      .join('\n\n');
    const title = template?.metadata?.title ?? 'Modèle de contrat';
    setPreview(`# ${title}\n\n${filled}`);
  }, [template, form, safeClauses]);

  const { list: safeInputs, dropped: droppedInputs } = useMemo(() => {
    if (!template) {
      return { list: [], dropped: 0 };
    }

    const normalized = ensureArray<InputDef>(template.inputs, 'template.inputs');
    const filtered = normalized.filter(
      (input): input is InputDef =>
        Boolean(input) && typeof input.key === 'string' && typeof input.label === 'string',
    );

    return { list: filtered, dropped: normalized.length - filtered.length };
  }, [template]);

  useEffect(() => {
    if (droppedInputs > 0) {
      console.warn(`${droppedInputs} champ(s) ignoré(s) car sans métadonnées valides.`);
    }
  }, [droppedInputs]);

  if (loading) return <main className="container">Chargement…</main>;
  if (!template) return <main className="container">Introuvable</main>;

  const onChange = (key: string, value: string | number | boolean) =>
    setForm((s) => ({ ...s, [key]: value }));

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
          {safeInputs.length > 0 ? (
            safeInputs.map((inp) => (
              <div key={inp.key} style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 6 }}>{inp.label}</label>
                <input
                  className="input"
                  type={inp.type === 'textarea' ? 'text' : inp.type}
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
