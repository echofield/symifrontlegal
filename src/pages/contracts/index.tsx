import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Fuse from "fuse.js";

// ✅ Ultra-safe helper functions
function ensureArray<T>(value: unknown, label = "list"): T[] {
  if (!Array.isArray(value)) {
    console.warn(`[ensureArray] expected array for ${label}, got`, value);
    return [];
  }
  return value;
}

function safeFuseSearch(fuseInstance: Fuse<any> | null, query: string): any[] {
  if (!fuseInstance) return [];
  try {
    const results = fuseInstance.search(query);
    return Array.isArray(results) ? results : [];
  } catch (error) {
    console.warn("[safeFuseSearch] search failed:", error);
    return [];
  }
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
        
        // Multiple fallback strategies for data extraction
        const raw = data?.contracts || data?.index || data || [];
        const safeArray = Array.isArray(raw) ? raw : [];
        
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

  // ---- Safe Fuse search setup
  const fuse = useMemo(() => {
    if (!items || items.length === 0) return null;
    try {
      return new Fuse(items, {
        keys: ["title", "category", "keywords"],
        threshold: 0.35,
        ignoreLocation: true,
      });
    } catch (error) {
      console.error("❌ Fuse initialization failed:", error);
      return null;
    }
  }, [items]);

  // ---- Ultra-safe filter + sort
  const results = useMemo(() => {
    const safeItems = ensureArray<IndexEntry>(items, "items");
    
    if (safeItems.length === 0) return [];

    let filtered: IndexEntry[] = [];

    // Safe search
    if (query.trim().length > 0 && fuse) {
      try {
        const searchResults = safeFuseSearch(fuse, query);
        filtered = searchResults.map((r) => r.item).filter(Boolean);
      } catch (error) {
        console.warn("❌ Search failed, falling back to full list");
        filtered = [...safeItems];
      }
    } else {
      filtered = [...safeItems];
    }

    // Safe filtering
    if (cat !== "all") {
      filtered = filtered.filter((i) => i && i.category === cat);
    }
    
    if (lang) {
      filtered = filtered.filter((i) => i && i.lang === lang);
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
  }, [query, cat, lang, sortAlpha, items, fuse]);

  // ---- Safe pagination
  const totalPages = Math.max(1, Math.ceil(ensureArray(results).length / pageSize));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const paged = ensureArray(results).slice(
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
      ) : ensureArray(paged).length > 0 ? (
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
      {ensureArray(results).length > pageSize && (
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
