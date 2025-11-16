'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import RightPanel from '@/components/RightPanel';
import { toast } from 'sonner';

export default function Home() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
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
    <div 
      className="h-screen w-screen flex flex-col overflow-hidden relative"
      style={{
        backgroundImage: 'url(/bg_image.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay for better glassmorphism visibility */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.15) 75%, rgba(255, 255, 255, 0.15) 100%)',
          backdropFilter: 'blur(0.5px)',
        }}
      />
      {/* Bağlantı Uyarısı */}
      {!isConnected && (
        <div className="relative z-10 bg-red-500/90 backdrop-blur-md text-white text-center py-2 px-4 flex items-center justify-center gap-2 shadow-lg">
          <span className="font-bold">⚠ CONNECTION LOST - ALL CONTROLS DISABLED</span>
        </div>
      )}

      {/* Header - Sabit üst bar */}
      <div className="relative z-10">
        <Header 
        isConnected={isConnected}
        batteryLevel={batteryLevel}
        signalStrength={signalStrength}
        onEmergencyStop={handleEmergencyStop}
        />
      </div>

      {/* Ana içerik alanı - Grid Layout */}
      <div className="relative z-10 flex-1 flex overflow-hidden">
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
        {isRightPanelVisible && (
          <RightPanel 
            isCollapsed={isRightPanelCollapsed}
            onToggleCollapse={() => setIsRightPanelCollapsed(!isRightPanelCollapsed)}
          />
        )}
      </div>
    </div>
  );
}
