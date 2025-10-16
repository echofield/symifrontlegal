import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
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

const ensureArray = <T,>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : [];

const sanitizeIndexEntries = (value: unknown): IndexEntry[] =>
  ensureArray<unknown>(value).filter((entry): entry is IndexEntry => {
    if (!entry || typeof entry !== "object") return false;
    const candidate = entry as Partial<IndexEntry>;
    return typeof candidate.id === "string" && typeof candidate.title === "string";
  });

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

  // Load contracts
  useEffect(() => {
    async function loadContracts() {
      setLoading(true);
      try {
        const res = await fetch(`${api}/api/contracts?lang=${lang}`);
        if (!res.ok) throw new Error('Invalid response');
        const data = await res
          .json()
          .catch(() => ({} as unknown));
        const fromContracts = sanitizeIndexEntries(
          (data as { contracts?: unknown })?.contracts
        );
        const fromIndex = sanitizeIndexEntries(
          (data as { index?: unknown })?.index
        );
        const fallbackArray = sanitizeIndexEntries(data as unknown);
        const arrayCandidates =
          fromContracts.length > 0
            ? fromContracts
            : fromIndex.length > 0
            ? fromIndex
            : fallbackArray;
        setItems(sanitizeIndexEntries(arrayCandidates));
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    loadContracts();
  }, [api, lang]);

  // Fuzzy search setup
  const safeItems = sanitizeIndexEntries(items);

  const fuse = useMemo(
    () =>
      new Fuse(safeItems, {
        keys: ["title", "category", "keywords"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [safeItems]
  );

  // Filter + sort
  const results = useMemo(() => {
    const searchResults = query.trim() ? fuse.search(query) : [];
    const safeSearchResults = sanitizeIndexEntries(
      ensureArray<IndexEntry | { item: IndexEntry }>(searchResults as unknown).map((r) =>
        typeof r === "object" && r !== null && "item" in r
          ? (r as { item: IndexEntry }).item
          : (r as IndexEntry)
      )
    );

    const base = query.trim() ? safeSearchResults : safeItems;
    let working = sanitizeIndexEntries(base);

    if (cat !== "all") {
      working = working.filter((i) => i.category === cat);
    }

    if (lang) {
      working = working.filter((i) => i.lang === lang);
    }

    const locale = lang === "fr" ? "fr" : "en";
    const sorted = working.slice();
    sorted.sort((a, b) =>
      sortAlpha
        ? String(a?.title || "").localeCompare(String(b?.title || ""), locale)
        : String(b?.title || "").localeCompare(String(a?.title || ""), locale)
    );

    return sorted;
  }, [query, cat, lang, sortAlpha, safeItems, fuse]);

  const safeResults = sanitizeIndexEntries(results);
  const totalPages = Math.max(1, Math.ceil(safeResults.length / pageSize));
  const paged = safeResults.slice((page - 1) * pageSize, page * pageSize);

  // 🔮 Auto-open the best match if only one strong result
  useEffect(() => {
    if (autoOpened || query.trim().length < 3) return;
    const normalizedResults = sanitizeIndexEntries(results);
    if (normalizedResults.length === 1) {
      const top = normalizedResults[0];
      setAutoOpened(true);
      if (top?.id) router.push(`/contracts/${top.id}`);
    }
  }, [results, query, autoOpened, router]);

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
          {(Array.isArray(LANGS) ? LANGS : []).map((l) => (
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
        {(Array.isArray(CATS) ? CATS : []).map((c) => (
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
      ) : (
        <>
          {paged.length > 0 ? (
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
                    <Link
                      href={`/contracts/${i.id}`}
                      className="btn btn-primary"
                    >
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
        </>
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
