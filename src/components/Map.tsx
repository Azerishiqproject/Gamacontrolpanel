'use client';

interface MapProps {
  waypoints: Array<{ id: number; lat: number; lng: number; label: string }>;
  interactive?: boolean; // Haritanın etkileşimli olup olmayacağını belirler
  hideOverlays?: boolean; // Overlay'leri gizle (küçük harita için)
}

export default function Map({ waypoints, interactive = false, hideOverlays = false }: MapProps) {
  // İlk waypoint'in koordinatlarını al veya varsayılan koordinatları kullan
  const firstWaypoint = waypoints.length > 0 ? waypoints[0] : null;
  const lat = firstWaypoint ? firstWaypoint.lat : 41.0122;
  const lng = firstWaypoint ? firstWaypoint.lng : 28.9743;
  
  // Google Maps Embed URL oluştur - Basit format (API key gerektirmez)
  // UI kontrollerini ve yazıları gizlemek için parametreler ekliyoruz
  const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&output=embed&hl=tr&t=m&z=14`;


  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ backgroundColor: '#e5e7eb' }}>
      {/* Üstteki yazıları ve logoları gizlemek için overlay - sadece büyük harita için */}
      {!hideOverlays && (
        <>
          <div 
            className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
            style={{ 
              height: '80px',
              background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 100%)'
            }}
          />
          {/* Alttaki yazıları gizlemek için overlay */}
          <div 
            className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
            style={{ 
              height: '60px',
              background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 100%)'
            }}
          />
        </>
      )}
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ 
          border: 0, 
          pointerEvents: interactive ? 'auto' : 'none',
          marginTop: hideOverlays ? '0' : '-80px',
          marginBottom: hideOverlays ? '0' : '-60px',
          height: hideOverlays ? '100%' : 'calc(100% + 140px)'
        }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full"
      />
    </div>
  );
}

