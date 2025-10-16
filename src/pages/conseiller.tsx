import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Lawyer } from "@/components/LawyerMap";

import { ensureArray } from "@/utils/ensureArray";

type AdvisorOutput = {
  thought: string;
  followup_question: string | null;
  action: { type: string; args?: Record<string, unknown> };
  reply_text: string;
};

const LawyerMap = dynamic(() => import("@/components/LawyerMap"), { ssr: false });

export default function ConseillerPage() {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState<AdvisorOutput | null>(null);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [finding, setFinding] = useState(false);
  const [loading, setLoading] = useState(false);

  const api = process.env.NEXT_PUBLIC_API_URL;

  const { list: safeLawyers, dropped: droppedLocalLawyers } = useMemo(() => {
    const normalized = ensureArray<Lawyer>(lawyers, "state.lawyers");
    const filtered = normalized.filter(
      (lawyer): lawyer is Lawyer => Boolean(lawyer) && typeof lawyer?.name === "string",
    );

    return { list: filtered, dropped: normalized.length - filtered.length };
  }, [lawyers]);

  useEffect(() => {
    if (droppedLocalLawyers > 0) {
      console.warn(
        `${droppedLocalLawyers} avocat(s) invalide(s) ignoré(s) dans l'état local.`,
      );
    }
  }, [droppedLocalLawyers]);

  // ---- Ask the AI advisor ----
  const ask = async () => {
    if (!q.trim()) {
      alert("Veuillez poser une question.");
      return;
    }

    setLoading(true);
    try {
      const r = await fetch(`${api}/api/advisor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      if (!r.ok) throw new Error("Réponse invalide du serveur.");
      const data = await r.json();
      setAnswer(data?.output || null);
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de la consultation.");
    } finally {
      setLoading(false);
    }
  };

  // ---- Search nearby lawyers ----
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
    } catch (err) {
      console.warn("Erreur géolocalisation:", err);
    }

    const fallback = { lat: 48.8566, lng: 2.3522 }; // Paris default
    const loc = userLoc || fallback;
    if (!userLoc) alert("Localisation non disponible, affichage des résultats à Paris.");
    setCoords(loc);

    const spec = (answer?.action?.args?.topic as string) || "contrat";

    try {
      const r = await fetch(`${api}/api/lawyers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `avocat ${spec}`,
          lat: loc.lat,
          lng: loc.lng,
        }),
      });

      if (!r.ok) throw new Error("Réponse invalide du serveur.");
      const data = await r.json();

      const normalizedLawyers = ensureArray<Lawyer>(data?.lawyers, "api.lawyers");
      const validLawyers = normalizedLawyers.filter((l) => typeof l?.name === "string");

      if (validLawyers.length !== normalizedLawyers.length) {
        console.warn(
          `${normalizedLawyers.length - validLawyers.length} avocat(s) ignoré(s) car sans nom valide.`,
        );
      }

      setLawyers(validLawyers);
      setSelected(null);
    } catch (err) {
      console.error("Erreur recherche avocat:", err);
      alert("Erreur lors de la recherche d'avocats.");
      setLawyers([]); // ensure safe fallback
    } finally {
      setFinding(false);
    }
  };

  return (
    <main className="container">
      <h1>Conseiller</h1>
      <p>Posez votre question juridique, SYMIONE vous oriente vers le bon modèle ou un avocat.</p>

      {/* --- Question Input --- */}
      <div className="row" style={{ marginBottom: 16 }}>
        <input
          className="input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ex : Je veux rompre un CDD, que faire ?"
          style={{ flex: 1 }}
        />
        <button onClick={ask} disabled={loading} className="btn btn-primary">
          {loading ? "Analyse…" : "Demander"}
        </button>
      </div>

      {/* --- Advisor Response --- */}
      {answer && (
        <section className="card" style={{ marginTop: 16 }}>
          <h2>Réponse</h2>
          <p>{answer.reply_text || "Aucune réponse disponible."}</p>
          <div className="row">
            <Link href="/contracts" className="btn btn-secondary">
              Voir les modèles
            </Link>
            <button onClick={searchLawyers} className="btn btn-primary">
              {finding ? "Recherche…" : "Trouver un avocat"}
            </button>
          </div>
        </section>
      )}

      {/* --- Lawyer Results --- */}
      {safeLawyers.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h3>Avocats recommandés</h3>
          <div className="grid grid-5-7" style={{ gap: 16, alignItems: "stretch" }}>
            <aside className="card">
              <ul className="list">
                {safeLawyers.map((l, i) => {
                  const ratingText = typeof l.rating === "number" ? `⭐️ ${l.rating}` : "";
                  const addressText = l.address ? l.address : "";
                  const displayText = [ratingText, addressText].filter(Boolean).join(" • ");

                  return (
                    <li
                      key={i}
                      onClick={() => setSelected(i)}
                      style={{
                        padding: 10,
                        borderRadius: 8,
                        cursor: "pointer",
                        background: selected === i ? "var(--accent-weak)" : "transparent",
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{l.name}</div>
                      {displayText && (
                        <div className="muted" style={{ fontSize: 13 }}>
                          {displayText}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                        {l.place_id && (
                          <a
                            href={`https://www.google.com/maps/place/?q=place_id:${l.place_id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="link"
                          >
                            Voir sur Google Maps
                          </a>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="footer-note" style={{ marginTop: 12 }}>
                Les avocats affichés proviennent de Google Maps. SYMIONE ne garantit ni ne recommande
                aucune prestation.
              </div>
            </aside>

            <div style={{ height: 420 }}>
              <LawyerMap
                lawyers={safeLawyers}
                center={coords || undefined}
                onSelect={setSelected}
                selectedIndex={selected}
              />
            </div>
          </div>
        </section>
      )}

      {/* --- Empty state --- */}
      {safeLawyers.length === 0 && answer && !finding && (
        <p style={{ marginTop: 16, color: "#888" }}>Aucun avocat trouvé pour cette recherche.</p>
      )}
    </main>
  );
}
