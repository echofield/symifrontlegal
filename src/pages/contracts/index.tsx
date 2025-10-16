import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { ensureArray } from "@/utils/ensureArray";

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

  // Load contracts
  useEffect(() => {
    async function loadContracts() {
      setLoading(true);
      try {
        const res = await fetch(`${api}/api/contracts?lang=${lang}`);
        if (!res.ok) {
          console.warn(`Impossible de charger les contrats (${res.status}).`);
          setItems([]);
          return;
        }

        const data = await res.json();
        const contracts = ensureArray<IndexEntry>(data?.contracts, "contracts");
        const indexEntries = ensureArray<IndexEntry>(data?.index, "index");
        const fallback = Array.isArray(data)
          ? ensureArray<IndexEntry>(data, "contractsResponse")
          : [];
        const list =
          contracts.length > 0
            ? contracts
            : indexEntries.length > 0
            ? indexEntries
            : fallback;

        if (list.length === 0) {
          console.warn("Aucun contrat reçu depuis l'API contracts.", data);
        }

        const sanitized = list.filter((item): item is IndexEntry => {
          if (!item || typeof item !== "object") {
            return false;
          }

          const candidate = item as Partial<IndexEntry>;
          return typeof candidate.id === "string" && typeof candidate.title === "string";
        });

        if (sanitized.length !== list.length) {
          console.warn(
            `${list.length - sanitized.length} entrée(s) de contrat ignorée(s) car sans id ou titre valide.`,
          );
        }

        setItems(sanitized);
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    loadContracts();
  }, [api, lang]);

  // Filter + sort
  const { list: results, warnSearch } = useMemo(() => {
    const safeItems = ensureArray<IndexEntry>(items, "contractsItems");

    const normalizedQuery = query.trim().toLowerCase();
    const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

    let base: IndexEntry[] = safeItems;
    let warnNoMatch = false;

    if (tokens.length > 0) {
      const filteredByQuery = safeItems.filter((item) => {
        const haystacks = [
          item.title,
          item.category,
          item.jurisdiction,
          ...ensureArray<string>(item.keywords, "contract.keywords"),
        ]
          .filter((value): value is string => typeof value === "string")
          .map((value) => value.toLowerCase());

        if (haystacks.length === 0) {
          return false;
        }

        return tokens.every((token) => haystacks.some((field) => field.includes(token)));
      });

      if (filteredByQuery.length === 0 && safeItems.length > 0) {
        warnNoMatch = true;
      }

      base = filteredByQuery;
    }

    if (cat !== "all") {
      base = base.filter((i) => i.category === cat);
    }

    if (lang) {
      base = base.filter((i) => i.lang === lang);
    }

    const sorted = [...base].sort((a, b) => {
      const locale = lang === "fr" ? "fr" : "en";
      return sortAlpha
        ? a.title.localeCompare(b.title, locale)
        : b.title.localeCompare(a.title, locale);
    });

    return { list: sorted, warnSearch: warnNoMatch };
  }, [query, cat, lang, sortAlpha, items]);

  useEffect(() => {
    if (warnSearch) {
      console.warn("Aucun contrat ne correspond à la recherche fournie.");
    }
  }, [warnSearch]);

  const safeResults = ensureArray<IndexEntry>(results, "contractsResults");
  const totalPages = Math.max(1, Math.ceil(safeResults.length / pageSize));
  const paged = safeResults.slice((page - 1) * pageSize, page * pageSize);
  const safePaged = ensureArray<IndexEntry>(paged, "contractsPaged");

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [cat, lang]);

  // 🔮 Auto-open the best match if only one strong result
  useEffect(() => {
    if (autoOpened || query.trim().length < 3) return;
    if (safeResults.length === 1) {
      const top = safeResults[0];
      if (!top?.id) {
        console.warn("Résultat de contrat invalide sans identifiant:", top);
        return;
      }
      setAutoOpened(true);
      router.push(`/contracts/${top.id}`);
    }
  }, [safeResults, query, autoOpened, router]);

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
      ) : (
        <>
          {safePaged.length > 0 ? (
            <ul className="list">
              {safePaged.map((i) => (
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
