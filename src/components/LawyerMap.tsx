/// <reference types="google.maps" />
import { useEffect, useRef } from 'react';

export type Lawyer = {
  name: string;
  address?: string;
  rating?: number;
  place_id?: string;
  lat?: number;
  lng?: number;
};

type Props = {
  lawyers: Lawyer[];
  center?: { lat: number; lng: number };
  onSelect?: (index: number) => void;
  selectedIndex?: number | null;
};

export default function LawyerMap({ lawyers, center, onSelect, selectedIndex }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapObj = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function ensureMaps() {
      if (typeof window === 'undefined') return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existing = (window as any).google?.maps;
      if (existing) return existing;
      const apiKey = (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY) as string | undefined;
      if (!apiKey) return null;
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement('script');
        s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Failed to load Google Maps'));
        document.head.appendChild(s);
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (window as any).google?.maps;
    }

    async function init() {
      const maps = await ensureMaps();
      if (cancelled || !mapRef.current || !maps) return;

      const defaultCenter = center || { lat: 48.8566, lng: 2.3522 }; // Paris
      mapObj.current = new maps.Map(mapRef.current, { center: defaultCenter, zoom: 12, mapTypeControl: false, streetViewControl: false });

      // Place markers
      markers.current.forEach((m) => m.setMap(null));
      markers.current = [];
      lawyers.forEach((l, idx) => {
        if (typeof l.lat !== 'number' || typeof l.lng !== 'number') return;
        const marker = new maps.Marker({ position: { lat: l.lat, lng: l.lng }, map: mapObj.current!, title: l.name });
        marker.addListener('click', () => onSelect && onSelect(idx));
        markers.current.push(marker);
      });

      // Fit bounds if multiple
      if (lawyers.length > 0) {
        const bounds = new maps.LatLngBounds();
        markers.current.forEach((m) => bounds.extend(m.getPosition()!));
        const currentMap = mapObj.current;
        if (!bounds.isEmpty() && currentMap) currentMap.fitBounds(bounds);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [lawyers, center, onSelect]);

  useEffect(() => {
    // Optional: bounce selected marker
    if (!markers.current.length || selectedIndex == null) return;
    markers.current.forEach((m) => m.setAnimation(null as unknown as google.maps.Animation));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const maps = (window as any).google?.maps;
    if (!maps) return;
    const sel = markers.current[selectedIndex];
    if (sel) sel.setAnimation(maps.Animation.BOUNCE);
  }, [selectedIndex]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 12, border: '1px solid #e5e7eb' }} />;
}
