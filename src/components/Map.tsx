'use client';

import { useEffect, useRef, useState } from 'react';

interface MapProps {
  waypoints: Array<{ id: number; lat: number; lng: number; label: string }>;
}

export default function Map({ waypoints }: MapProps) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current || mapRef.current) return;

    const loadMap = async () => {
      const L = await import('leaflet');
      // CSS dinamik olarak yükleniyor
      if (typeof document !== 'undefined') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Marker ikon sorununu düzelt
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      // Leaflet haritasını oluştur
      const map = L.map(mapContainerRef.current!, {
        center: [41.0122, 28.9743],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      // Esri World Imagery - Satellite style (free, no API key needed)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = { map, L };
      setIsLoaded(true);
    };

    loadMap();

    return () => {
      if (mapRef.current?.map) {
        mapRef.current.map.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Waypoint'leri haritada güncelle
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const { map, L } = mapRef.current;

    // Eski marker'ları temizle
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Yeni marker'ları ekle - daha belirgin marker
    waypoints.forEach((wp) => {
      const marker = L.marker([wp.lat, wp.lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: #007BFF; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,123,255,0.6);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        }),
      }).addTo(map);

      // Haritayı marker'a odakla
      map.setView([wp.lat, wp.lng], 14);
      
      marker.bindPopup(wp.label);
      markersRef.current.push(marker);
    });
  }, [waypoints, isLoaded]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full rounded-lg overflow-hidden bg-[#1a1a1a]"
    />
  );
}

