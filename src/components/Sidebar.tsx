'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  FaChevronLeft, 
  FaChevronRight,
  FaArrowUp,
  FaTachometerAlt,
  FaMapMarkerAlt,
  FaClock,
  FaHandPaper,
  FaRobot,
  FaRoute,
  FaTimes
} from 'react-icons/fa';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Map from './Map';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  selectedDrone: string;
  onDroneChange: (drone: string) => void;
  flightMode: 'manual' | 'auto' | 'patrol';
  onFlightModeChange: (mode: 'manual' | 'auto' | 'patrol') => void;
}

interface TelemetryData {
  altitude: number;
  speed: number;
  latitude: number;
  longitude: number;
  flightTime: string;
}

export default function Sidebar({ 
  isCollapsed, 
  onToggleCollapse, 
  selectedDrone, 
  onDroneChange,
  flightMode,
  onFlightModeChange
}: SidebarProps) {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    altitude: 150,
    speed: 20,
    latitude: 41.0122,
    longitude: 28.9743,
    flightTime: '00:12:45',
  });
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapPosition, setMapPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });


  // Harita pozisyonunu kaydet
  const handleMapClick = () => {
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      // Fixed positioning için viewport'a göre pozisyon (scroll'a gerek yok)
      setMapPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
      setIsMapExpanded(true);
      setIsAnimating(false);
      document.body.style.overflow = 'hidden';
      
      // Double requestAnimationFrame ile animasyonu başlat (layout'u garanti etmek için)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    }
  };

  // Haritayı kapat
  const handleMapClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsMapExpanded(false);
      document.body.style.overflow = '';
    }, 400); // Animasyon süresi kadar bekle
  };

  // ESC tuşu ile kapat
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMapExpanded) {
        handleMapClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMapExpanded]);

  // Mesafe hesaplama
  const totalDistance = useMemo(() => {
    const [hours, minutes] = telemetry.flightTime.split(':').map(Number);
    const totalHours = hours + minutes / 60;
    return (telemetry.speed * totalHours).toFixed(1);
  }, [telemetry.speed, telemetry.flightTime]);

  // Gerçek zamanlı telemetri simülasyonu
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        altitude: prev.altitude + (Math.random() * 2 - 1), // ±1m değişim
        speed: Math.max(0, prev.speed + (Math.random() * 1 - 0.5)), // ±0.5 km/h
        latitude: prev.latitude,
        longitude: prev.longitude,
        flightTime: calculateFlightTime(prev.flightTime),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const calculateFlightTime = (currentTime: string): string => {
    const [hours, minutes, seconds] = currentTime.split(':').map(Number);
    let newSeconds = seconds + 1;
    let newMinutes = minutes;
    let newHours = hours;

    if (newSeconds >= 60) {
      newSeconds = 0;
      newMinutes++;
    }
    if (newMinutes >= 60) {
      newMinutes = 0;
      newHours++;
    }

    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
  };

  const TelemetryRow = ({ icon, label, value, unit }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    unit?: string;
  }) => (
    <div className="flex items-center justify-between py-1 px-2.5 text-[11px] border-b border-white/20 last:border-0">
      <div className="flex items-center gap-1.5 text-gray-600">
        <span className="text-[9px]">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="font-medium text-gray-800 text-[11px]">
        {value}{unit && unit}
      </span>
    </div>
  );

  return (
    <aside 
      className={`bg-white/40 backdrop-blur-xl border-r border-white/70 transition-all duration-300 flex flex-col shadow-2xl ${
        isCollapsed ? 'w-[48px]' : 'w-[216px]'
      } hidden md:flex`}
      style={{ 
        boxShadow: '4px 0 24px 0 rgba(31, 38, 135, 0.25), inset -1px 0 0 rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(12px) saturate(180%)',
      }}
    >
      {/* Collapse Button */}
      <div className="p-1 border-b border-white/30">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-7 w-7 text-gray-700 hover:text-gray-900 hover:bg-white/60 bg-white/40 backdrop-blur-lg border border-white/70 shadow-lg p-0 transition-all" style={{
            backdropFilter: 'blur(10px) saturate(180%)',
            boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
          }}
        >
          {isCollapsed ? <FaChevronRight className="text-[10px]" /> : <FaChevronLeft className="text-[10px]" />}
        </Button>
      </div>

      {!isCollapsed && (
        <>
          {/* Drone Seçimi */}
          <div className="px-2 py-1.5 border-b border-white/30">
            <Select value={selectedDrone} onValueChange={onDroneChange}>
              <SelectTrigger className="h-7 text-[11px] bg-white/50 backdrop-blur-lg border-white/80 text-gray-800 py-0 shadow-lg" style={{
                backdropFilter: 'blur(10px) saturate(180%)',
                boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/60 backdrop-blur-xl border-white/80 text-gray-800 shadow-2xl" style={{ 
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(12px) saturate(180%)',
              }}>
                <SelectItem value="Drone-001" className="text-[11px]">Drone-001</SelectItem>
                <SelectItem value="Drone-002" className="text-[11px]">Drone-002</SelectItem>
                <SelectItem value="Drone-003" className="text-[11px]">Drone-003</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Telemetri Verileri */}
          <div className="flex-1 overflow-y-auto">
            <div className="bg-white/50 backdrop-blur-lg border-b border-white/70 rounded-lg m-2 shadow-2xl" style={{ 
              boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px) saturate(180%)',
            }}>
              <TelemetryRow
                icon={<FaArrowUp className="text-[#007BFF]" />}
                label="Altitude"
                value={telemetry.altitude.toFixed(1)}
                unit="m"
              />
              <TelemetryRow
                icon={<FaTachometerAlt className="text-[#28A745]" />}
                label="Speed"
                value={telemetry.speed.toFixed(1)}
                unit="km/h"
              />
              <TelemetryRow
                icon={<FaMapMarkerAlt className="text-[#DC3545]" />}
                label="GPS"
                value={`${telemetry.latitude.toFixed(2)}°,${telemetry.longitude.toFixed(2)}°`}
              />

              <TelemetryRow
                icon={<FaClock className="text-[#FFC107]" />}
                label="Flight"
                value={telemetry.flightTime}
              />
            </div>

            {/* Uçuş İstatistikleri - Alt kısımda */}
            <div className="px-2 py-1.5 border-t border-white/30">
              <div className="text-[10px] text-gray-600 mb-2 font-medium">Statistics</div>
              <div className="space-y-2">
                <div className="bg-white/60 backdrop-blur-lg rounded p-2 border border-white/80 shadow-xl" style={{ 
                  boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px) saturate(180%)',
                }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-gray-600">Max Altitude</span>
                    <span className="text-[10px] font-semibold text-gray-800">{(telemetry.altitude + 50).toFixed(0)}m</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-gray-600">Max Speed</span>
                    <span className="text-[10px] font-semibold text-gray-800">{(telemetry.speed + 15).toFixed(0)} km/h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-gray-600">Distance</span>
                    <span className="text-[10px] font-semibold text-gray-800">{totalDistance} km</span>
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-lg rounded p-2 border border-white/80 shadow-xl" style={{ 
                  boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px) saturate(180%)',
                }}>
                  <div className="text-[9px] text-gray-600 mb-1">GPS Coordinates</div>
                  <div className="text-[9px] font-mono text-gray-800 space-y-0.5">
                    <div>Lat: {telemetry.latitude.toFixed(4)}°</div>
                    <div>Lng: {telemetry.longitude.toFixed(4)}°</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map - Below Statistics */}
            <div className="px-2 py-1.5 border-t border-white/30">
              <div className="text-[10px] text-gray-600 mb-2 font-medium">Map</div>
              <div 
                ref={mapContainerRef}
                className={`border border-white/80 rounded overflow-hidden shadow-xl bg-white/50 backdrop-blur-lg cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl relative ${isMapExpanded ? 'opacity-0 pointer-events-none' : ''}`}
                style={{ 
                  height: '180px', 
                  boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px) saturate(180%)',
                }}
                onClick={handleMapClick}
              >
                {/* Tıklanabilir overlay - iframe tıklamalarını engeller */}
                <div 
                  className="absolute inset-0 z-10 cursor-pointer"
                  onClick={handleMapClick}
                  style={{ pointerEvents: 'auto' }}
                />
                <div style={{ pointerEvents: 'none' }}>
                  <Map 
                    hideOverlays={true}
                    waypoints={[{
                      id: 1,
                      lat: telemetry.latitude,
                      lng: telemetry.longitude,
                      label: selectedDrone
                    }]} 
                  />
                </div>
              </div>
            </div>

            {/* Büyük Harita - Expanded View (Portal ile body'ye render) */}
            {isMapExpanded && typeof window !== 'undefined' && createPortal(
              <>
                {/* Overlay */}
                <div 
                  className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
                  onClick={handleMapClose}
                  style={{
                    animation: 'fadeIn 0.3s ease-out',
                    zIndex: 99998,
                  }}
                />
                
                {/* Expanded Map */}
                <div
                  className="fixed bg-white/40 backdrop-blur-xl border-white/70 rounded-lg overflow-hidden shadow-2xl flex flex-col"
                  style={{
                    top: isAnimating ? '50%' : `${mapPosition.top}px`,
                    left: isAnimating ? '50%' : `${mapPosition.left}px`,
                    width: isAnimating ? 'min(90vw, 1600px)' : `${mapPosition.width}px`,
                    height: isAnimating ? 'min(85vh, 900px)' : `${mapPosition.height}px`,
                    maxWidth: isAnimating ? '1600px' : 'none',
                    maxHeight: isAnimating ? '900px' : 'none',
                    transform: isAnimating ? 'translate(-50%, -50%)' : 'translate(0, 0)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(12px) saturate(180%)',
                    zIndex: 99999,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="px-6 pt-4 pb-3 flex items-center justify-between border-b border-white/30 flex-shrink-0">
                    <h3 className="text-gray-800 font-semibold text-lg">
                      {selectedDrone} - Live Map
                    </h3>
                    <button
                      onClick={handleMapClose}
                      className="p-2 rounded-full bg-white/50 hover:bg-white/60 backdrop-blur-lg border border-white/80 text-gray-800 transition-all hover:scale-110 shadow-xl"
                      style={{
                        boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(10px) saturate(180%)',
                      }}
                    >
                      <FaTimes className="text-sm" />
                    </button>
                  </div>
                  
                  {/* Map Container - Daha büyük harita */}
                  <div 
                    className="w-full flex-1 min-h-0"
                    style={{ minHeight: '600px' }}
                    onTransitionEnd={(e) => {
                      // Animasyon tamamlandığında haritayı resize et
                      if (e.currentTarget === e.target && isAnimating) {
                        // Map component'ine resize sinyali gönder
                        setTimeout(() => {
                          window.dispatchEvent(new Event('resize'));
                        }, 100);
                      }
                    }}
                  >
                    <Map 
                      key={`map-${isMapExpanded ? 'expanded' : 'normal'}-${isAnimating}`}
                      interactive={true}
                      waypoints={[{
                        id: 1,
                        lat: telemetry.latitude,
                        lng: telemetry.longitude,
                        label: selectedDrone
                      }]} 
                    />
                  </div>
                </div>
              </>,
              document.body
            )}
          </div>

          {/* Uçuş Modu */}
          <div className="p-1.5 border-t border-white/70 bg-white/40 backdrop-blur-lg shadow-xl" style={{
            boxShadow: '0 -2px 8px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px) saturate(180%)',
          }}>
            <div className="text-[10px] text-gray-600 mb-1.5 font-medium px-0.5">Flight Mode</div>
            <div className="flex gap-1 min-w-0">
              <Button
                size="sm"
                variant="ghost"
                className={`flex-1 min-w-0 h-7 text-[10px] font-medium transition-all duration-200 px-1 ${
                  flightMode === 'manual' 
                    ? 'bg-blue-500/80 hover:bg-blue-600/80 backdrop-blur-lg text-white shadow-2xl shadow-blue-500/50 border border-blue-400/80' 
                    : 'bg-white/50 backdrop-blur-lg border border-white/70 text-gray-600 hover:bg-white/70 hover:text-gray-800 hover:border-white/90 shadow-lg'
                }`}
                onClick={() => onFlightModeChange('manual')}
              >
                <div className="flex items-center justify-center gap-1 min-w-0">
                  <FaHandPaper className={`flex-shrink-0 ${flightMode === 'manual' ? 'text-white' : 'text-gray-600'}`} style={{ fontSize: '9px' }} />
                  <span className="truncate">Manual</span>
                </div>
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className={`flex-1 min-w-0 h-7 text-[10px] font-medium transition-all duration-200 px-1 ${
                  flightMode === 'auto' 
                    ? 'bg-green-500/80 hover:bg-green-600/80 backdrop-blur-sm text-white shadow-lg shadow-green-500/30 border border-green-400/60' 
                    : 'bg-white/30 backdrop-blur-sm border border-white/40 text-gray-600 hover:bg-white/50 hover:text-gray-800 hover:border-white/60'
                }`}
                onClick={() => onFlightModeChange('auto')}
              >
                <div className="flex items-center justify-center gap-1 min-w-0">
                  <FaRobot className={`flex-shrink-0 ${flightMode === 'auto' ? 'text-white' : 'text-gray-600'}`} style={{ fontSize: '9px' }} />
                  <span className="truncate">Auto</span>
                </div>
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className={`flex-1 min-w-0 h-7 text-[10px] font-medium transition-all duration-200 px-1 ${
                  flightMode === 'patrol' 
                    ? 'bg-orange-500/80 hover:bg-orange-600/80 backdrop-blur-sm text-white shadow-lg shadow-orange-500/30 border border-orange-400/60' 
                    : 'bg-white/30 backdrop-blur-sm border border-white/40 text-gray-600 hover:bg-white/50 hover:text-gray-800 hover:border-white/60'
                }`}
                onClick={() => onFlightModeChange('patrol')}
              >
                <div className="flex items-center justify-center gap-1 min-w-0">
                  <FaRoute className={`flex-shrink-0 ${flightMode === 'patrol' ? 'text-white' : 'text-gray-600'}`} style={{ fontSize: '9px' }} />
                  <span className="truncate">Patrol</span>
                </div>
              </Button>
            </div>
            {/* Aktif Mod Göstergesi */}
            <div className="mt-1.5 text-[8px] text-gray-600 text-center px-0.5">
              {flightMode === 'manual' && (
                <span className="text-blue-600">Manuel kontrol aktif</span>
              )}
              {flightMode === 'auto' && (
                <span className="text-green-600">Otomatik uçuş aktif</span>
              )}
              {flightMode === 'patrol' && (
                <span className="text-orange-600">Patrol modu aktif</span>
              )}
            </div>
          </div>
        </>
      )}
    </aside>
  );
}

