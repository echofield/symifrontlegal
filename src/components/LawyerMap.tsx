import { useEffect, useMemo, useRef, useState } from 'react';

type LatLngLiteral = { lat: number; lng: number };

type Lawyer = {
  name: string;
  address?: string;
  rating?: number;
  place_id?: string;
  lat?: number;
  lng?: number;
};

interface GoogleLatLng {
  lat(): number;
  lng(): number;
}

interface GoogleLatLngBounds {
  extend(position: GoogleLatLng | LatLngLiteral): void;
  isEmpty(): boolean;
}

interface GoogleMarker {
  setMap(map: GoogleMap | null): void;
  addListener(eventName: 'click', handler: () => void): void;
  setAnimation(animation: unknown | null): void;
  getPosition(): GoogleLatLng | null;
}

interface GoogleMap {
  fitBounds(bounds: GoogleLatLngBounds): void;
  setCenter(position: LatLngLiteral): void;
}

interface GoogleMapOptions {
  center: LatLngLiteral;
  zoom: number;
  mapTypeControl: boolean;
  streetViewControl: boolean;
}

interface GoogleMarkerOptions {
  position: LatLngLiteral;
  map: GoogleMap;
  title?: string;
}

interface GoogleMapsApi {
  Map: new (mapDiv: HTMLElement, opts: GoogleMapOptions) => GoogleMap;
  Marker: new (opts: GoogleMarkerOptions) => GoogleMarker;
  LatLngBounds: new () => GoogleLatLngBounds;
  Animation: { BOUNCE: unknown };
}

type GoogleWindow = typeof window & { google?: { maps?: GoogleMapsApi } };

let mapsLoader: Promise<GoogleMapsApi | null> | null = null;

const DEFAULT_CENTER: LatLngLiteral = { lat: 48.8566, lng: 2.3522 };

const ensureMaps = async (): Promise<GoogleMapsApi | null> => {
  if (typeof window === 'undefined') return null;
  const existing = (window as GoogleWindow).google?.maps;
  if (existing) return existing;
  if (!mapsLoader) {
    const apiKey = (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY) as string | undefined;
    if (!apiKey) return null;

    mapsLoader = new Promise<GoogleMapsApi | null>((resolve, reject) => {
      const scriptId = 'google-maps-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;

      const resolveMaps = () => resolve((window as GoogleWindow).google?.maps ?? null);

      function cleanup() {
        if (!script) return;
        script.removeEventListener('load', handleLoad);
        script.removeEventListener('error', handleError);
      }

      function handleLoad() {
        cleanup();
        if (script) script.setAttribute('data-loaded', 'true');
        resolveMaps();
      }

      function handleError() {
        cleanup();
        reject(new Error('Failed to load Google Maps script.'));
      }

      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        document.head.appendChild(script);
      } else if (script.getAttribute('data-loaded') === 'true') {
        cleanup();
        resolveMaps();
        return;
      }

      script.addEventListener('load', handleLoad, { once: true });
      script.addEventListener('error', handleError, { once: true });
    }).catch(() => null);
  }

  const maps = await mapsLoader;
  if (!maps) {
    mapsLoader = null;
    return null;
  }
  return maps;
};

type Props = {
  lawyers: Lawyer[];
  center?: LatLngLiteral;
  onSelect?: (index: number) => void;
  selectedIndex?: number | null;
};

export default function LawyerMap({ lawyers, center, onSelect, selectedIndex }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapObj = useRef<GoogleMap | null>(null);
  const markers = useRef<GoogleMarker[]>([]);
  const mapsApi = useRef<GoogleMapsApi | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapUnavailable, setMapUnavailable] = useState(false);
  const fallbackCenter = useMemo(() => center ?? DEFAULT_CENTER, [center]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const maps = await ensureMaps();
      if (cancelled) return;
      if (!mapRef.current || !maps) {
        setMapUnavailable(true);
        setMapReady(false);
        return;
      }

      setMapUnavailable(false);
      mapsApi.current = maps;

      if (!mapObj.current) {
        mapObj.current = new maps.Map(mapRef.current, {
          center: fallbackCenter,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
        });
        setMapReady(true);
      } else if (mapObj.current) {
        mapObj.current.setCenter(fallbackCenter);
        setMapReady(true);
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, [fallbackCenter]);

  useEffect(() => {
    if (!mapReady || !mapObj.current || !mapsApi.current) return;

    markers.current.forEach((m) => m.setMap(null));
    markers.current = [];

    lawyers.forEach((l, idx) => {
      if (typeof l.lat !== 'number' || typeof l.lng !== 'number') return;
      const maps = mapsApi.current;
      if (!maps) return;
      const marker = new maps.Marker({ position: { lat: l.lat, lng: l.lng }, map: mapObj.current!, title: l.name });
      marker.addListener('click', () => onSelect && onSelect(idx));
      markers.current.push(marker);
    });

    if (!markers.current.length) {
      mapObj.current.setCenter(fallbackCenter);
      return;
    }

    if (markers.current.length === 1) {
      const pos = markers.current[0].getPosition();
      if (pos) mapObj.current.setCenter({ lat: pos.lat(), lng: pos.lng() });
      return;
    }

    const maps = mapsApi.current;
    if (!maps) return;
    const bounds = new maps.LatLngBounds();
    markers.current.forEach((m) => {
      const pos = m.getPosition();
      if (pos) bounds.extend(pos);
    });
    if (!bounds.isEmpty()) {
      mapObj.current.fitBounds(bounds);
    }
  }, [lawyers, onSelect, mapReady, fallbackCenter]);

  useEffect(() => {
    // Optional: bounce selected marker
    if (!mapReady || !markers.current.length || selectedIndex == null) return;
    markers.current.forEach((m) => m.setAnimation(null));
    const maps = mapsApi.current;
    if (!maps) return;
    const sel = markers.current[selectedIndex];
    if (sel) sel.setAnimation(maps.Animation.BOUNCE);
  }, [selectedIndex, mapReady]);

  if (mapUnavailable) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b7280',
          fontSize: 14,
          textAlign: 'center',
          padding: 16,
        }}
      >
        Impossible de charger la carte Google Maps. Vérifiez la clé d&apos;API.
      </div>
    );
  }

  return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 12, border: '1px solid #e5e7eb' }} />;
}
