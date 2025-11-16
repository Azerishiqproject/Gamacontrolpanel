'use client';

import { useState, useEffect } from 'react';
import { FaRobot, FaRoute, FaInfoCircle } from 'react-icons/fa';
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


  const isManual = flightMode === 'manual';
  const isAuto = flightMode === 'auto';
  const isPatrol = flightMode === 'patrol';

  return (
    <div className="h-full flex flex-col bg-white/40 backdrop-blur-xl rounded-xl border border-white/70 shadow-2xl overflow-auto" style={{ 
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(12px) saturate(180%)',
    }}>
      {/* Üst: Kontroller */}
      <div className="flex-1 flex items-center justify-center p-3 gap-6">
        {/* Sol: Hareket Joystick */}
        <div className="flex flex-col items-center gap-2 relative">
          <h3 className="text-[10px] text-gray-700 uppercase tracking-wide font-medium">Movement</h3>
          <Joystick
            onMove={handleJoystickMove}
            size={144}
            label="Roll / Pitch"
            disabled={!isManual}
          />
          {!isManual && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/60 backdrop-blur-xl rounded-lg px-3 py-1.5 border border-white/80 shadow-2xl" style={{ 
                boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(12px) saturate(180%)',
              }}>
                <span className="text-[10px] text-gray-800 font-medium">
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
            color={isManual ? "#007BFF" : "#999999"}
          />
          <CircularGauge
            value={roll}
            min={-30}
            max={30}
            label="Roll"
            color={isManual ? "#28A745" : "#999999"}
          />
          <CircularGauge
            value={yaw}
            min={-180}
            max={180}
            label="Yaw"
            color={isManual ? "#DC3545" : "#999999"}
          />
        </div>

        {/* Sağ: Kamera Joystick */}
        <div className="flex flex-col items-center gap-2 relative">
          <h3 className="text-[10px] text-gray-700 uppercase tracking-wide font-medium">Camera</h3>
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
              <div className="bg-white/60 backdrop-blur-xl rounded-lg px-3 py-1.5 border border-white/80 shadow-2xl" style={{ 
                boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(12px) saturate(180%)',
              }}>
                <span className="text-[10px] text-gray-800 font-medium">
                  {isAuto ? 'AUTO MODE' : 'PATROL MODE'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mod Bilgilendirme Mesajı */}
      {!isManual && (
        <div className={`px-4 py-2 mx-4 mb-2 rounded-lg border backdrop-blur-lg ${
          isAuto 
            ? 'bg-green-500/40 border-green-500/70' 
            : 'bg-orange-500/40 border-orange-500/70'
        } shadow-2xl`} style={{ 
          boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px) saturate(180%)',
        }}>
          <div className="flex items-center gap-2">
            {isAuto ? (
              <FaRobot className={`text-sm ${isAuto ? 'text-green-700' : 'text-orange-700'}`} />
            ) : (
              <FaRoute className="text-sm text-orange-700" />
            )}
            <div className="flex-1">
              <p className={`text-[10px] font-medium ${
                isAuto ? 'text-green-800' : 'text-orange-800'
              }`}>
                {isAuto 
                  ? 'Otomatik Uçuş Modu Aktif - Drone otomatik olarak kontrol ediliyor'
                  : 'Patrol Modu Aktif - Drone önceden tanımlanmış rotayı takip ediyor'
                }
              </p>
            </div>
            <FaInfoCircle className={`text-xs ${isAuto ? 'text-green-700' : 'text-orange-700'}`} />
          </div>
        </div>
      )}

    </div>
  );
}

