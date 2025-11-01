'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import RightPanel from '@/components/RightPanel';
import { toast } from 'sonner';

export default function Home() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(75);
  const [signalStrength, setSignalStrength] = useState(80);
  const [selectedDrone, setSelectedDrone] = useState('Drone-001');
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);
  const [flightMode, setFlightMode] = useState<'manual' | 'auto' | 'patrol'>('manual');

  const handleEmergencyStop = useCallback(() => {
    if (confirm('Emergency stop will be triggered. Are you sure?')) {
      toast.error('Emergency stop triggered!');
      setIsConnected(false);
    }
  }, []);

  // Gerçek zamanlı veri simülasyonu
  useEffect(() => {
    const interval = setInterval(() => {
      // Batarya seviyesi simülasyonu (gerçekçi değişim)
      setBatteryLevel((prev) => {
        const change = Math.random() * 0.5 - 0.25; // -0.25 ile +0.25 arası değişim
        return Math.max(0, Math.min(100, prev + change));
      });
      // Sinyal gücü simülasyonu
      setSignalStrength((prev) => {
        const change = Math.random() * 4 - 2; // -2 ile +2 arası değişim
        return Math.max(0, Math.min(100, prev + change));
      });
    }, 5000); // Her 5 saniyede bir güncelle

    return () => clearInterval(interval);
  }, []);

  // Klavye kısayolları
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // ESC - Acil durdurma
      if (e.key === 'Escape') {
        handleEmergencyStop();
      }
      // Space - Kalkış (preventDefault ile sayfa kaydırmayı önle)
      else if (e.key === ' ') {
        e.preventDefault();
        toast.info('Takeoff command sent');
      }
      // L - İniş
      else if (e.key === 'l' || e.key === 'L') {
        toast.info('Landing command sent');
      }
      // H - Eve dön
      else if (e.key === 'h' || e.key === 'H') {
        toast.info('Return to home command sent');
      }
      // R - Arm/Disarm
      else if (e.key === 'r' || e.key === 'R') {
        toast.info('Arm/Disarm command sent');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleEmergencyStop]);

  // Responsive: Mobilde sidebar ve right panel'i gizle
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
        setIsRightPanelVisible(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#0A0A0A]">
      {/* Bağlantı Uyarısı */}
      {!isConnected && (
        <div className="bg-red-600 text-white text-center py-2 px-4 flex items-center justify-center gap-2">
          <span className="font-bold">⚠ CONNECTION LOST - ALL CONTROLS DISABLED</span>
        </div>
      )}

      {/* Header - Sabit üst bar */}
      <Header 
        isConnected={isConnected}
        batteryLevel={batteryLevel}
        signalStrength={signalStrength}
        onEmergencyStop={handleEmergencyStop}
      />

      {/* Ana içerik alanı - Grid Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Sol panel */}
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          selectedDrone={selectedDrone}
          onDroneChange={setSelectedDrone}
          flightMode={flightMode}
          onFlightModeChange={setFlightMode}
        />

        {/* Main Content - Orta alan */}
        <MainContent 
          onEmergencyStop={handleEmergencyStop}
          flightMode={flightMode}
        />

        {/* Right Panel - Sağ panel */}
        {isRightPanelVisible && <RightPanel />}
      </div>
    </div>
  );
}
