import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

// 🛡️ Ultra-safe helper functions
function ensureArray<T>(value: unknown, label = "list"): T[] {
  if (value === undefined || value === null) {
    console.warn(`[ensureArray] ${label} is undefined or null`);
    return [];
  }
  if (!Array.isArray(value)) {
    console.warn(`[ensureArray] expected array for ${label}, got`, typeof value, value);
    return [];
  }
  return value;
}

// Simple search without Fuse.js to avoid crashes
function simpleSearch(items: any[], query: string): any[] {
  if (!query.trim()) return items;
  
  const searchTerm = query.toLowerCase();
  return items.filter(item => {
    if (!item) return false;
    const title = item.title?.toLowerCase() || '';
    const category = item.category?.toLowerCase() || '';
    const keywords = Array.isArray(item.keywords) ? item.keywords.join(' ').toLowerCase() : '';
    
    return title.includes(searchTerm) || 
           category.includes(searchTerm) || 
           keywords.includes(searchTerm);
  });
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
        console.log("📡 Loading contracts from:", `${api}/api/contracts?lang=${lang}`);
        const res = await fetch(`${api}/api/contracts?lang=${lang}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        // Multiple fallback strategies for data extraction
        const raw = data?.contracts || data?.index || data || [];
        const safeArray = Array.isArray(raw) ? raw.filter(item => item && item.id) : [];
        
        console.log(`✅ Loaded ${safeArray.length} contracts`);
        setItems(safeArray);
      } catch (err) {
        console.error("❌ loadContracts failed:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    
    if (api) {
      loadContracts();
    } else {
      console.warn("❌ No API URL configured");
      setLoading(false);
    }
  }, [api, lang]);

  // ---- Ultra-safe filter + sort (NO FUSE.JS)
  const results = useMemo(() => {
    const safeItems = ensureArray<IndexEntry>(items, "items");
    console.log("🔍 Filtering with items:", safeItems.length);
    
    if (safeItems.length === 0) return [];

    let filtered = simpleSearch(safeItems, query);

    // Safe filtering with null checks
    if (cat !== "all") {
      filtered = ensureArray(filtered.filter((i) => i && i.category === cat), "categoryFilter");
    }
    
    if (lang) {
      filtered = ensureArray(filtered.filter((i) => i && i.lang === lang), "langFilter");
    }

    // Safe sorting
    try {
      filtered.sort((a, b) => {
        const titleA = a?.title || "";
        const titleB = b?.title || "";
        return sortAlpha
          ? titleA.localeCompare(titleB, lang === "fr" ? "fr" : "en")
          : titleB.localeCompare(titleA, lang === "fr" ? "fr" : "en");
      });
    } catch (error) {
      console.warn("❌ Sort failed, keeping original order");
    }

    return filtered;
  }, [query, cat, lang, sortAlpha, items]);

  // ---- Safe pagination
  const safeResults = ensureArray(results, "paginationResults");
  const totalPages = Math.max(1, Math.ceil(safeResults.length / pageSize));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const paged = safeResults.slice(
    (safePage - 1) * pageSize, 
    safePage * pageSize
  );

  // Reset page if results change
  useEffect(() => {
    setPage(1);
  }, [query, cat, lang]);

  // ---- Safe auto-open single match
  useEffect(() => {
    if (autoOpened || query.trim().length < 3) return;
    
    const safeResults = ensureArray(results, "autoOpenResults");
    if (safeResults.length === 1) {
      const top = safeResults[0];
      if (top && top.id) {
        setAutoOpened(true);
        router.push(`/contracts/${top.id}`);
      }
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
        <button 
          onClick={() => setSortAlpha(!sortAlpha)} 
          className="btn btn-secondary"
        >
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
      ) : paged.length > 0 ? (
        <ul className="list">
          {paged.map((i) => (
            <li key={i?.id || Math.random()} className="list-item" style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{i?.title || "Sans titre"}</div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    {i?.category || "Autre"} • {i?.lang?.toUpperCase() || "?"}
                  </div>
                </div>
                {i?.id && (
                  <Link href={`/contracts/${i.id}`} className="btn btn-primary">
                    Ouvrir
                  </Link>
                )}
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
      {safeResults.length > pageSize && (
        <div className="pagination" style={{ marginTop: 12 }}>
          <button
            className="btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
          >
            Précédent
          </button>
          <span className="muted">
            Page {safePage}/{totalPages}
          </span>
          <button
            className="btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}
    </main>
  );
}
