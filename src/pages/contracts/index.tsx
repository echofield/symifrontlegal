import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Fuse from "fuse.js";

// ✅ universal guard
const ensureArray = (val: unknown, label = "unknown") => {
  if (!Array.isArray(val)) {
    console.warn(`[ensureArray] expected array for ${label}, got`, val);
    return [];
  }
  return val;
};

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

  // ---- Fetch contracts safely
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${api}/api/contracts?lang=${lang}`);
        const data = await res.json();
        const raw =
          data?.contracts || data?.index || (Array.isArray(data) ? data : []);
        const safe = ensureArray(raw, "contracts");
        setItems(safe);
        console.log(`✅ Loaded ${safe.length} contracts`);
      } catch (err) {
        console.error("❌ Failed to load contracts:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [api, lang]);

  // ---- Fuse search
  const fuse = useMemo(() => {
    const safe = ensureArray(items, "fuseItems");
    return new Fuse(safe, {
      keys: ["title", "category", "keywords"],
      threshold: 0.35,
      ignoreLocation: true,
    });
  }, [items]);

  // ---- Compute results safely
  const results = useMemo(() => {
    let base: IndexEntry[] = ensureArray(items, "items");
    let searched: IndexEntry[] = [];

    if (query.trim().length > 0) {
      try {
        const fuseResults = fuse.search(query);
        searched = ensureArray(fuseResults.map((r) => r.item), "fuseResults");
      } catch (e) {
        console.warn("⚠️ Fuse search error:", e);
        searched = [];
      }
    } else {
      searched = base;
    }

    let filtered = ensureArray(searched, "filteredStart");

    if (cat !== "all") {
      filtered = filtered.filter((i) => i.category === cat);
    }

    if (lang) {
      filtered = filtered.filter((i) => i.lang === lang);
    }

    filtered = filtered.sort((a, b) =>
      sortAlpha
        ? a.title.localeCompare(b.title, lang)
        : b.title.localeCompare(a.title, lang)
    );

    return filtered;
  }, [query, cat, lang, sortAlpha, items, fuse]);

  const safeResults = ensureArray(results, "results");
  const totalPages = Math.max(1, Math.ceil(safeResults.length / pageSize));
  const paged = safeResults.slice((page - 1) * pageSize, page * pageSize);

  // ---- Auto-open if one result
  useEffect(() => {
    if (autoOpened || query.trim().length < 3) return;
    if (safeResults.length === 1) {
      setAutoOpened(true);
      router.push(`/contracts/${safeResults[0].id}`);
    }
  }, [safeResults, query, autoOpened, router]);

  // ---- Render
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
      {safeResults.length > pageSize && (
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
