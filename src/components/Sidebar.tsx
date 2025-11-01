'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  FaChevronLeft, 
  FaChevronRight,
  FaArrowUp,
  FaTachometerAlt,
  FaMapMarkerAlt,
  FaClock,
  FaHandPaper,
  FaRobot,
  FaRoute
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
    <div className="flex items-center justify-between py-1 px-2.5 text-[11px] border-b border-[#1A1A1A] last:border-0">
      <div className="flex items-center gap-1.5 text-gray-400">
        <span className="text-[9px]">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="font-medium text-white text-[11px]">
        {value}{unit && unit}
      </span>
    </div>
  );

  return (
    <aside 
      className={`bg-[#141414] border-r border-[#1A1A1A] transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-[48px]' : 'w-[216px]'
      } hidden md:flex`}
    >
      {/* Collapse Button */}
      <div className="p-1 border-b border-[#1A1A1A]">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-7 w-7 text-gray-400 hover:text-white p-0"
        >
          {isCollapsed ? <FaChevronRight className="text-[10px]" /> : <FaChevronLeft className="text-[10px]" />}
        </Button>
      </div>

      {!isCollapsed && (
        <>
          {/* Drone Seçimi */}
          <div className="px-2 py-1.5 border-b border-[#1A1A1A]">
            <Select value={selectedDrone} onValueChange={onDroneChange}>
              <SelectTrigger className="h-7 text-[11px] bg-[#0D0D0D] border-[#1A1A1A] text-white py-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#141414] border-[#1A1A1A] text-white">
                <SelectItem value="Drone-001" className="text-[11px]">Drone-001</SelectItem>
                <SelectItem value="Drone-002" className="text-[11px]">Drone-002</SelectItem>
                <SelectItem value="Drone-003" className="text-[11px]">Drone-003</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Telemetri Verileri */}
          <div className="flex-1 overflow-y-auto">
            <div className="bg-[#0D0D0D] border-b border-[#1A1A1A]">
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
            <div className="px-2 py-1.5 border-t border-[#1A1A1A]">
              <div className="text-[10px] text-gray-400 mb-2 font-medium">Statistics</div>
              <div className="space-y-2">
                <div className="bg-[#0D0D0D] rounded p-2 border border-[#1A1A1A]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-gray-400">Max Altitude</span>
                    <span className="text-[10px] font-semibold text-white">{(telemetry.altitude + 50).toFixed(0)}m</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-gray-400">Max Speed</span>
                    <span className="text-[10px] font-semibold text-white">{(telemetry.speed + 15).toFixed(0)} km/h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-gray-400">Distance</span>
                    <span className="text-[10px] font-semibold text-white">{totalDistance} km</span>
                  </div>
                </div>
                <div className="bg-[#0D0D0D] rounded p-2 border border-[#1A1A1A]">
                  <div className="text-[9px] text-gray-400 mb-1">GPS Coordinates</div>
                  <div className="text-[9px] font-mono text-white space-y-0.5">
                    <div>Lat: {telemetry.latitude.toFixed(4)}°</div>
                    <div>Lng: {telemetry.longitude.toFixed(4)}°</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map - Below Statistics */}
            <div className="px-2 py-1.5 border-t border-[#1A1A1A]">
              <div className="text-[10px] text-gray-400 mb-2 font-medium">Map</div>
              <div className="border border-[#1A1A1A] rounded overflow-hidden" style={{ height: '180px' }}>
                <Map 
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

          {/* Uçuş Modu */}
          <div className="p-1.5 border-t border-[#1A1A1A] bg-[#0D0D0D]">
            <div className="text-[10px] text-gray-400 mb-1.5 font-medium px-0.5">Flight Mode</div>
            <div className="flex gap-1 min-w-0">
              <Button
                size="sm"
                variant="ghost"
                className={`flex-1 min-w-0 h-7 text-[10px] font-medium transition-all duration-200 px-1 ${
                  flightMode === 'manual' 
                    ? 'bg-[#007BFF] hover:bg-[#0069d9] text-white shadow-lg shadow-blue-500/30 border border-blue-400/50' 
                    : 'bg-[#141414] border border-[#1A1A1A] text-gray-400 hover:bg-[#1A1A1A] hover:text-white hover:border-[#2A2A2A]'
                }`}
                onClick={() => onFlightModeChange('manual')}
              >
                <div className="flex items-center justify-center gap-1 min-w-0">
                  <FaHandPaper className={`flex-shrink-0 ${flightMode === 'manual' ? 'text-white' : 'text-gray-500'}`} style={{ fontSize: '9px' }} />
                  <span className="truncate">Manual</span>
                </div>
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className={`flex-1 min-w-0 h-7 text-[10px] font-medium transition-all duration-200 px-1 ${
                  flightMode === 'auto' 
                    ? 'bg-[#28A745] hover:bg-[#218838] text-white shadow-lg shadow-green-500/30 border border-green-400/50' 
                    : 'bg-[#141414] border border-[#1A1A1A] text-gray-400 hover:bg-[#1A1A1A] hover:text-white hover:border-[#2A2A2A]'
                }`}
                onClick={() => onFlightModeChange('auto')}
              >
                <div className="flex items-center justify-center gap-1 min-w-0">
                  <FaRobot className={`flex-shrink-0 ${flightMode === 'auto' ? 'text-white' : 'text-gray-500'}`} style={{ fontSize: '9px' }} />
                  <span className="truncate">Auto</span>
                </div>
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className={`flex-1 min-w-0 h-7 text-[10px] font-medium transition-all duration-200 px-1 ${
                  flightMode === 'patrol' 
                    ? 'bg-[#FF9800] hover:bg-[#F57C00] text-white shadow-lg shadow-orange-500/30 border border-orange-400/50' 
                    : 'bg-[#141414] border border-[#1A1A1A] text-gray-400 hover:bg-[#1A1A1A] hover:text-white hover:border-[#2A2A2A]'
                }`}
                onClick={() => onFlightModeChange('patrol')}
              >
                <div className="flex items-center justify-center gap-1 min-w-0">
                  <FaRoute className={`flex-shrink-0 ${flightMode === 'patrol' ? 'text-white' : 'text-gray-500'}`} style={{ fontSize: '9px' }} />
                  <span className="truncate">Patrol</span>
                </div>
              </Button>
            </div>
            {/* Aktif Mod Göstergesi */}
            <div className="mt-1.5 text-[8px] text-gray-500 text-center px-0.5">
              {flightMode === 'manual' && (
                <span className="text-blue-400">Manuel kontrol aktif</span>
              )}
              {flightMode === 'auto' && (
                <span className="text-green-400">Otomatik uçuş aktif</span>
              )}
              {flightMode === 'patrol' && (
                <span className="text-orange-400">Patrol modu aktif</span>
              )}
            </div>
          </div>
        </>
      )}
    </aside>
  );
}

