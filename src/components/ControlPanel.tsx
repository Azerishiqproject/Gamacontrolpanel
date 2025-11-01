'use client';

import { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaHome, FaExclamationTriangle, FaRobot, FaRoute, FaHandPaper, FaInfoCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import CircularGauge from './CircularGauge';
import Joystick from './Joystick';

interface ControlPanelProps {
  onEmergencyStop?: () => void;
  flightMode: 'manual' | 'auto' | 'patrol';
}

export default function ControlPanel({ onEmergencyStop, flightMode }: ControlPanelProps) {
  const [pitch, setPitch] = useState(0);
  const [roll, setRoll] = useState(0);
  const [yaw, setYaw] = useState(0);

  // Joystick hareketlerinden tutum değerlerini güncelle
  const handleJoystickMove = (x: number, y: number) => {
    if (flightMode === 'manual') {
      setRoll(x * 30);
      setPitch(y * 30);
    }
  };

  // Gerçek zamanlı simülasyon
  useEffect(() => {
    const interval = setInterval(() => {
      setPitch((prev) => prev + (Math.random() * 0.2 - 0.1));
      setRoll((prev) => prev + (Math.random() * 0.2 - 0.1));
      setYaw((prev) => prev + (Math.random() * 0.2 - 0.1));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleTakeoff = () => {
    if (confirm('Takeoff will be initiated. Are you sure?')) {
      // Kalkış işlemi
    }
  };

  const handleLand = () => {
    if (confirm('Landing will be initiated. Are you sure?')) {
      // İniş işlemi
    }
  };

  const handleReturnToHome = () => {
    if (confirm('Drone will return to home. Are you sure?')) {
      // Eve dönüş işlemi
    }
  };

  const handleEmergencyStopClick = () => {
    if (confirm('Emergency stop will be triggered. Are you sure?')) {
      onEmergencyStop?.();
    }
  };

  const isManual = flightMode === 'manual';
  const isAuto = flightMode === 'auto';
  const isPatrol = flightMode === 'patrol';

  return (
    <div className="h-full flex flex-col bg-[#0A0A0A] overflow-auto">
      {/* Üst: Kontroller */}
      <div className="flex-1 flex items-center justify-center p-3 gap-6">
        {/* Sol: Hareket Joystick */}
        <div className="flex flex-col items-center gap-2 relative">
          <h3 className="text-[10px] text-gray-400 uppercase tracking-wide">Movement</h3>
          <Joystick
            onMove={handleJoystickMove}
            size={144}
            label="Roll / Pitch"
            disabled={!isManual}
          />
          {!isManual && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/70 rounded-lg px-3 py-1.5 border border-gray-600">
                <span className="text-[10px] text-gray-300 font-medium">
                  {isAuto ? 'AUTO MODE' : 'PATROL MODE'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Orta: Tutum Göstergeleri */}
        <div className="flex gap-4">
          <CircularGauge
            value={pitch}
            min={-30}
            max={30}
            label="Pitch"
            color={isManual ? "#007BFF" : "#555555"}
          />
          <CircularGauge
            value={roll}
            min={-30}
            max={30}
            label="Roll"
            color={isManual ? "#28A745" : "#555555"}
          />
          <CircularGauge
            value={yaw}
            min={-180}
            max={180}
            label="Yaw"
            color={isManual ? "#DC3545" : "#555555"}
          />
        </div>

        {/* Sağ: Kamera Joystick */}
        <div className="flex flex-col items-center gap-2 relative">
          <h3 className="text-[10px] text-gray-400 uppercase tracking-wide">Camera</h3>
          <Joystick
            onMove={(x, y) => {
              if (isManual) {
                console.log('Camera:', x, y);
              }
            }}
            size={144}
            label="Pan / Tilt"
            disabled={!isManual}
          />
          {!isManual && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/70 rounded-lg px-3 py-1.5 border border-gray-600">
                <span className="text-[10px] text-gray-300 font-medium">
                  {isAuto ? 'AUTO MODE' : 'PATROL MODE'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mod Bilgilendirme Mesajı */}
      {!isManual && (
        <div className={`px-4 py-2 mx-4 mb-2 rounded-lg border ${
          isAuto 
            ? 'bg-green-500/10 border-green-500/30' 
            : 'bg-orange-500/10 border-orange-500/30'
        }`}>
          <div className="flex items-center gap-2">
            {isAuto ? (
              <FaRobot className={`text-sm ${isAuto ? 'text-green-400' : 'text-orange-400'}`} />
            ) : (
              <FaRoute className="text-sm text-orange-400" />
            )}
            <div className="flex-1">
              <p className={`text-[10px] font-medium ${
                isAuto ? 'text-green-300' : 'text-orange-300'
              }`}>
                {isAuto 
                  ? 'Otomatik Uçuş Modu Aktif - Drone otomatik olarak kontrol ediliyor'
                  : 'Patrol Modu Aktif - Drone önceden tanımlanmış rotayı takip ediyor'
                }
              </p>
            </div>
            <FaInfoCircle className={`text-xs ${isAuto ? 'text-green-400' : 'text-orange-400'}`} />
          </div>
        </div>
      )}

      {/* Alt: Hızlı Eylem Butonları */}
      <div className=" p-4 flex items-center justify-center gap-4">
        <Button
          onClick={handleTakeoff}
          className="rounded-full w-14 h-14 bg-transparent hover:bg-white/10 border border-[#1A1A1A] text-white mb-[20px]"
          size="icon"
          title="Takeoff"
        >
          <FaArrowUp className="text-lg" />
        </Button>

        <Button
          onClick={handleLand}
          className="rounded-full w-14 h-14 bg-transparent hover:bg-white/10 border border-[#1A1A1A] text-white"
          size="icon"
          title="Land"
        >
          <FaArrowDown className="text-lg" />
        </Button>

        <Button
          onClick={handleReturnToHome}
          className="rounded-full w-14 h-14 bg-transparent hover:bg-white/10 border border-[#1A1A1A] text-white"
          size="icon"
          title="Return to Home"
        >
          <FaHome className="text-lg" />
        </Button>

        <Button
          onClick={handleEmergencyStopClick}
          className="rounded-full w-14 h-14 bg-transparent hover:bg-white/10 border border-[#1A1A1A] text-white mb-[20px]"
          size="icon"
          title="Emergency Stop"
        >
          <FaExclamationTriangle className="text-lg" />
        </Button>
      </div>
    </div>
  );
}

