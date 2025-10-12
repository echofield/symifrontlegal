import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type IndexEntry = { id: string; title: string; category: string; path: string };

const CATS = ['business','employment','property','freelance','personal','closure','custom'] as const;

export default function ContractsListPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<IndexEntry[]>([]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string>('all');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    const url = '/api/contracts?jurisdiction=FR';
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setItems(data.index || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const base = items.filter((i) => i.title.toLowerCase().includes(q.toLowerCase()));
    const c = cat === 'all' ? base : base.filter((i) => i.category === cat);
    return c;
  }, [items, q, cat]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page-1)*pageSize, page*pageSize);

  return (
    <main className="container">
      <h1 style={{ marginBottom: 8 }}>Modèles de contrats</h1>
      <p className="muted" style={{ marginTop: 0 }}>Rechercher un contrat…</p>
      <input className="input" placeholder="Rechercher un contrat…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
      <div className="row" style={{ marginTop: 12, flexWrap: 'wrap' }}>
        <button className={`chip ${cat==='all'?'chip-active':''}`} onClick={()=>{setCat('all');setPage(1);}}>Tous</button>
        {CATS.map(c => (
          <button key={c} className={`chip ${cat===c?'chip-active':''}`} onClick={()=>{setCat(c);setPage(1);}}>{c}</button>
        ))}
      </div>
      {loading ? (
        <div className="muted">Chargement…</div>
      ) : (
        <>
          <ul className="list" style={{ marginTop: 12 }}>
            {paged.map((i) => (
              <li key={i.id} className="list-item" style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{i.title}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{i.category}</div>
                  </div>
                  <Link href={`/contracts/${i.id}`} className="btn btn-primary">Ouvrir</Link>
                </div>
              </li>
            ))}
          </ul>
          <div className="pagination" style={{ marginTop: 12 }}>
            <button className="btn" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>Précédent</button>
            <span className="muted">Page {page}/{totalPages}</span>
            <button className="btn" onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>Suivant</button>
          </div>
        </>
      )}
    </main>
  );
}


