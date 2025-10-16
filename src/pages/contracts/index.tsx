import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";

type IndexEntry = {
  id: string;
  title: string;
  category?: string;
  lang?: string;
  jurisdiction?: string;
  keywords?: string[];
};

const CATS = ["business","employment","property","freelance","personal","closure","custom"] as const;
const LANGS = ["fr", "en"] as const;

export default function ContractsListPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<IndexEntry[]>([]);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [sortAlpha, setSortAlpha] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const api = process.env.NEXT_PUBLIC_API_URL;

  // Load contracts
  useEffect(() => {
    async function loadContracts() {
      setLoading(true);
      try {
        const res = await fetch(`${api}/api/contracts?lang=${lang}`);
        const data = await res.json();
        const list = data?.contracts || data?.index || (Array.isArray(data) ? data : []);
        setItems(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    loadContracts();
  }, [api, lang]);

  // Prepare fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: ["title", "category", "keywords"],
      threshold: 0.4, // adjust for sensitivity
    });
  }, [items]);

  // Apply search, filter, sort
  const results = useMemo(() => {
    let base = query.trim() ? fuse.search(query).map(r => r.item) : items;

    if (cat !== "all") base = base.filter(i => i.category === cat);
    if (lang) base = base.filter(i => i.lang === lang);

    if (sortAlpha)
      base = [...base].sort((a, b) => a.title.localeCompare(b.title, lang === "fr" ? "fr" : "en"));
    else
      base = [...base].sort((a, b) => b.title.localeCompare(a.title, lang === "fr" ? "fr" : "en"));

    return base;
  }, [query, cat, lang, sortAlpha, items, fuse]);

  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  const paged = results.slice((page - 1) * pageSize, page * pageSize);

  return (
    <main className="container">
      <h1>Modèles de contrats</h1>
      <p className="muted">Rechercher un contrat par besoin ou mot-clé</p>

      <div className="row" style={{ marginBottom: 12 }}>
        <input
          className="input"
          placeholder={lang === "fr" ? "Ex : rompre un CDD" : "Ex: terminate a contract"}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        />
        <select value={lang} onChange={(e) => setLang(e.target.value as "fr" | "en")} className="input" style={{ width: 120 }}>
          {LANGS.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
        </select>
        <button onClick={() => setSortAlpha(!sortAlpha)} className="btn btn-secondary">
          {sortAlpha ? "A → Z" : "Z → A"}
        </button>
      </div>

      <div className="row" style={{ flexWrap: "wrap", marginBottom: 16 }}>
        <button className={`chip ${cat==='all'?'chip-active':''}`} onClick={()=>setCat('all')}>Tous</button>
        {CATS.map(c => (
          <button key={c} className={`chip ${cat===c?'chip-active':''}`} onClick={()=>setCat(c)}>{c}</button>
        ))}
      </div>

      {loading ? (
        <p>Chargement…</p>
      ) : (
        <>
          {paged.length > 0 ? (
            <ul className="list">
              {paged.map((i) => (
                <li key={i.id} className="list-item" style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{i.title}</div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        {i.category || "Autre"} • {i.lang?.toUpperCase() || "?"}
                      </div>
                    </div>
                    <Link href={`/contracts/${i.id}`} className="btn btn-primary">Ouvrir</Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted" style={{ marginTop: 16 }}>
              Aucun contrat trouvé pour cette recherche.
            </p>
          )}
        </>
      )}
    </main>
  );
}
