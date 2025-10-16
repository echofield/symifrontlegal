import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Fuse from "fuse.js";

// ✅ helper for safety
function ensureArray<T>(value: unknown, label = "list"): T[] {
  if (!Array.isArray(value)) {
    console.warn(`[ensureArray] expected array for ${label}, got`, value);
    return [];
  }
  return value;
}

type IndexEntry = {
  id: string;
  title: string;
  category?: string;
  lang?: string;
  jurisdiction?: string;
  keywords?: string[];
};

const CATS = [
  "business",
  "employment",
  "property",
  "freelance",
  "personal",
  "closure",
  "custom",
] as const;

const LANGS = ["fr", "en"] as const;

export default function ContractsListPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<IndexEntry[]>([]);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [sortAlpha, setSortAlpha] = useState(true);
  const [page, setPage] = useState(1);
  const [autoOpened, setAutoOpened] = useState(false);
  const pageSize = 20;

  const api = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  // ---- Load contracts safely
  useEffect(() => {
    async function loadContracts() {
      setLoading(true);
      try {
        const res = await fetch(`${api}/api/contracts?lang=${lang}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const raw =
          data?.contracts || data?.index || (Array.isArray(data) ? data : []);
        setItems(ensureArray(raw, "contracts"));
      } catch (err) {
        console.error("❌ loadContracts failed:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    loadContracts();
  }, [api, lang]);

  // ---- Fuse search setup
  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ["title", "category", "keywords"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [items]
  );

  // ---- Filter + sort safely
  const results = useMemo(() => {
    const baseItems = ensureArray(items, "items");

    let base =
      query.trim().length > 0
        ? ensureArray(fuse.search(query).map((r) => r.item), "searchResults")
        : baseItems;

    if (cat !== "all") base = base.filter((i) => i.category === cat);
    if (lang) base = base.filter((i) => i.lang === lang);

    base.sort((a, b) =>
      sortAlpha
        ? a.title.localeCompare(b.title, lang === "fr" ? "fr" : "en")
        : b.title.localeCompare(a.title, lang === "fr" ? "fr" : "en")
    );

    return base;
  }, [query, cat, lang, sortAlpha, items, fuse]);

  const totalPages = Math.max(1, Math.ceil(ensureArray(results).length / pageSize));
  const paged = ensureArray(results).slice((page - 1) * pageSize, page * pageSize);

  // ---- Auto-open single match
  useEffect(() => {
    if (autoOpened || query.trim().length < 3) return;
    const safeResults = ensureArray(results, "autoOpenResults");
    if (safeResults.length === 1) {
      const top = safeResults[0];
      setAutoOpened(true);
      router.push(`/contracts/${top.id}`);
    }
  }, [results, query, autoOpened, router]);

  // ---- UI
  return (
    <main className="container">
      <h1>Modèles de contrats</h1>
      <p className="muted">Décrivez votre besoin juridique — SYMIONE vous oriente.</p>

      {/* Search bar */}
      <div className="row" style={{ marginBottom: 12 }}>
        <input
          className="input"
          placeholder={
            lang === "fr"
              ? "Ex : Je veux rompre un CDD"
              : "Ex: I want to terminate a contract"
          }
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setAutoOpened(false);
            setPage(1);
          }}
        />
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as "fr" | "en")}
          className="input"
          style={{ width: 120 }}
        >
          {LANGS.map((l) => (
            <option key={l} value={l}>
              {l.toUpperCase()}
            </option>
          ))}
        </select>
        <button onClick={() => setSortAlpha(!sortAlpha)} className="btn btn-secondary">
          {sortAlpha ? "A → Z" : "Z → A"}
        </button>
      </div>

      {/* Category filters */}
      <div className="row" style={{ flexWrap: "wrap", marginBottom: 16 }}>
        <button
          className={`chip ${cat === "all" ? "chip-active" : ""}`}
          onClick={() => setCat("all")}
        >
          Tous
        </button>
        {CATS.map((c) => (
          <button
            key={c}
            className={`chip ${cat === c ? "chip-active" : ""}`}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <p>Chargement…</p>
      ) : ensureArray(paged).length > 0 ? (
        <ul className="list">
          {paged.map((i) => (
            <li key={i.id} className="list-item" style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{i.title}</div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    {i.category || "Autre"} • {i.lang?.toUpperCase() || "?"}
                  </div>
                </div>
                <Link href={`/contracts/${i.id}`} className="btn btn-primary">
                  Ouvrir
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted" style={{ marginTop: 16 }}>
          Aucun contrat trouvé pour cette recherche.
        </p>
      )}

      {/* Pagination */}
      {ensureArray(results).length > pageSize && (
        <div className="pagination" style={{ marginTop: 12 }}>
          <button
            className="btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Précédent
          </button>
          <span className="muted">
            Page {page}/{totalPages}
          </span>
          <button
            className="btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Suivant
          </button>
        </div>
      )}
    </main>
  );
}
