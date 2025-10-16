/// <reference types="google.maps" />
import { useEffect, useRef } from "react";

import { ensureArray } from "@/utils/ensureArray";

export type Lawyer = {
  name: string;
  address?: string;
  rating?: number;
  place_id?: string;
  lat?: number;
  lng?: number;
};

type Props = {
  lawyers?: Lawyer[];
  center?: { lat: number; lng: number };
  onSelect?: (index: number) => void;
  selectedIndex?: number | null;
};

export default function LawyerMap({ lawyers = [], center, onSelect, selectedIndex }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapObj = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);
  const loaderRef = useRef<Promise<typeof google.maps> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMaps() {
      if (typeof window === "undefined") return null;

      const globalWindow = window as typeof window & { google?: typeof google };
      if (globalWindow.google?.maps) {
        return globalWindow.google.maps;
      }

      if (!loaderRef.current) {
        const apiKey =
          process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          console.warn("Clé Google Maps manquante, la carte ne peut pas être initialisée.");
          return null;
        }

        loaderRef.current = new Promise<typeof google.maps>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
          script.async = true;
          script.onload = () => {
            const mapsInstance = globalWindow.google?.maps;
            if (mapsInstance) {
              resolve(mapsInstance);
            } else {
              loaderRef.current = null;
              reject(new Error("Google Maps chargé sans exposer l'API."));
            }
          };
          script.onerror = () => {
            loaderRef.current = null;
            reject(new Error("Impossible de charger Google Maps."));
          };
          document.head.appendChild(script);
        });
      }

      try {
        return await loaderRef.current;
      } catch (err) {
        console.warn("Erreur de chargement Google Maps:", err);
        return null;
      }
    }

    async function init() {
      try {
        const maps = await loadMaps();
        if (cancelled || !maps || !mapRef.current) {
          return;
        }

        const defaultCenter = center || { lat: 48.8566, lng: 2.3522 }; // Paris

        if (!mapObj.current) {
          mapObj.current = new maps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: 12,
            mapTypeControl: false,
            streetViewControl: false,
          });
        } else if (center) {
          mapObj.current.setCenter(center);
        }
      } catch (err) {
        console.warn("Impossible d'initialiser Google Maps:", err);
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [center]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const globalWindow = window as typeof window & { google?: typeof google };
    const maps = globalWindow.google?.maps;
    if (!maps || !mapObj.current) {
      return;
    }

    ensureArray<google.maps.Marker>(markers.current, "map.markers").forEach((m) =>
      m.setMap(null),
    );
    markers.current = [];

    const safeLawyers = ensureArray<Lawyer>(lawyers, "map.lawyers");
    if (safeLawyers.length === 0) {
      return;
    }

    let skipped = 0;

    safeLawyers.forEach((l, idx) => {
      if (typeof l.lat !== "number" || typeof l.lng !== "number") {
        skipped += 1;
        return;
      }

      const marker = new maps.Marker({
        position: { lat: l.lat, lng: l.lng },
        map: mapObj.current!,
        title: l.name || `Avocat ${idx + 1}`,
      });

      marker.addListener("click", () => onSelect && onSelect(idx));
      markers.current.push(marker);
    });

    if (skipped > 0) {
      console.warn(`${skipped} avocat(s) ignoré(s) car sans coordonnées valides.`);
    }

    const safeMarkers = ensureArray<google.maps.Marker>(markers.current, "map.markers");
    if (safeMarkers.length === 0) {
      return;
    }

    if (safeMarkers.length === 1 && center) {
      mapObj.current.setCenter(center);
      return;
    }

    const bounds = new maps.LatLngBounds();
    safeMarkers.forEach((m) => {
      const pos = m.getPosition();
      if (pos) bounds.extend(pos);
    });
    if (!bounds.isEmpty()) {
      mapObj.current.fitBounds(bounds);
    }
  }, [lawyers, center, onSelect]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Optional: bounce selected marker
    const globalWindow = window as typeof window & { google?: typeof google };
    const maps = globalWindow.google?.maps;
    if (!maps) {
      return;
    }

    const currentMarkers = ensureArray<google.maps.Marker>(markers.current, "map.markers");
    if (currentMarkers.length === 0 || selectedIndex == null) {
      return;
    }

    currentMarkers.forEach((m) => m.setAnimation(null as unknown as google.maps.Animation));

    const sel = currentMarkers[selectedIndex];
    if (sel) sel.setAnimation(maps.Animation.BOUNCE);
  }, [selectedIndex]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        backgroundColor: "#f9fafb",
      }}
    />
  );
}
