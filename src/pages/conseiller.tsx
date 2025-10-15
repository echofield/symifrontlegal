import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { Lawyer } from '@/components/LawyerMap';

type AdvisorOutput = {
  thought: string;
  followup_question: string | null;
  action: { type: string; args?: Record<string, unknown> };
  reply_text: string;
};

const LawyerMap = dynamic(() => import('@/components/LawyerMap'), { ssr: false });

export default function ConseillerPage() {
  const [q, setQ] = useState('');
  const [answer, setAnswer] = useState<AdvisorOutput | null>(null);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [finding, setFinding] = useState(false);
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    setLoading(true);
    try {
      const api = process.env.NEXT_PUBLIC_API_URL;
      const r = await fetch(`${api}/api/advisor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await r.json();
      setAnswer(data.output);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la consultation.');
    } finally {
      setLoading(false);
    }
  };

  const searchLawyers = async () => {
    setFinding(true);
    let userLoc: { lat: number; lng: number } | null = null;
    try {
      userLoc = await new Promise((resolve) => {
        if (!navigator.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => resolve(null),
          { timeout: 3000 }
        );
      });
    } catch {}

    const fallback = { lat: 48.8566, lng: 2.3522 };
    if (!userLoc) alert('Localisation non disponible, affichage des résultats à Paris.');
    const loc = userLoc || fallback;
    setCoords(loc);

    const spec = (answer?.action?.args?.topic as string) || 'contrat';
    try {
      const api = process.env.NEXT_PUBLIC_API_URL;
      const r = await fetch(`${api}/api/lawyers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `avocat ${spec}`,
          lat: loc.lat,
          lng: loc.lng,
        }),
      });
      const data = await r.json();
      setLawyers(data.lawyers || []);
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la recherche.');
    } finally {
      setFinding(false);
    }
  };

  return (
    <main className="container">
      <h1>Conseiller</h1>
      <p>
        Posez votre question juridique, SYMIONE vous oriente vers le bon modèle ou un avocat.
      </p>

      <div className="row" style={{ marginBottom: 16 }}>
        <input
          className="input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ex: Je veux rompre un CDD, que faire ?"
          style={{ flex: 1 }}
        />
        <button onClick={ask} disabled={loading} className="btn btn-primary">
          {loading ? 'Analyse…' : 'Demander'}
        </button>
      </div>

      {answer && (
        <section className="card" style={{ marginTop: 16 }}>
          <h2>Réponse</h2>
          <p>{answer.reply_text}</p>
          <div className="row">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/contracts" className="btn btn-secondary">
              Voir les modèles
            </a>
            <button onClick={searchLawyers} className="btn btn-primary">
              {finding ? 'Recherche…' : 'Trouver un avocat'}
            </button>
          </div>
        </section>
      )}

      {lawyers.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h3>Avocats recommandés</h3>
          <div className="grid grid-5-7" style={{ gap: 16, alignItems: 'stretch' }}>
            <aside className="card">
              <ul className="list">
                {lawyers.map((l, i) => (
                  <li
                    key={i}
                    onClick={() => setSelected(i)}
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      cursor: 'pointer',
                      background: selected === i ? 'var(--accent-weak)' : 'transparent',
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{l.name}</div>
                    <div className="muted" style={{ fontSize: 13 }}>
                      {typeof l.rating === 'number' ? `⭐️ ${l.rating} ` : ''}
                      {l.address ? `• ${l.address}` : ''}
                    </div>
                    <div
