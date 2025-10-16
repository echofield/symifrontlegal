import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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
    fetch(`${api}/api/contracts/${id}`)
      .then((r) => r.json())
      .then((data) => setTemplate(data.template))
      .finally(() => setLoading(false));
  }, [id, api]);

  // Generate the contract preview text
  useEffect(() => {
    if (!template) return;
    const filled = template.clauses
      .map((c) =>
        c.body.replace(/\{\{(.*?)\}\}/g, (_, k) => String(form[String(k).trim()] ?? `{{${k}}}`)),
      )
      .join('\n\n');
    setPreview(`# ${template.metadata.title}\n\n${filled}`);
  }, [template, form]);

  if (loading) return <main className="container">Chargement…</main>;
  if (!template) return <main className="container">Introuvable</main>;

  const onChange = (key: string, value: string | number | boolean) =>
    setForm((s) => ({ ...s, [key]: value }));

  const downloadPdf = async () => {
    const res = await fetch(`${api}/api/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contract_text: preview,
        format: 'pdf',
        metadata: { version: template.metadata.version },
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
  };

  return (
    <main className="container">
      <h1 style={{ marginBottom: 8 }}>{template.metadata.title}</h1>
      <p style={{ color: '#6b7280', marginTop: 0 }}>Générer le contrat</p>

      <div className="grid grid-2" style={{ gap: 24 }}>
        <section className="card">
          {template.inputs.map((inp) => (
            <div key={inp.key} style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>{inp.label}</label>
              <input
                className="input"
                type={inp.type === 'textarea' ? 'text' : inp.type}
                onChange={(e) => onChange(inp.key, e.target.value)}
                placeholder={inp.label}
              />
            </div>
          ))}
          <button onClick={downloadPdf} className="btn btn-primary">
            Télécharger le PDF
          </button>
        </section>

        <section className="card">
          <pre className="pre">{preview}</pre>
        </section>
      </div>
    </main>
  );
}
