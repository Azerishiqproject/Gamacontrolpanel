'use client';

import { useState } from 'react';
import { 
  FaCog, 
  FaPlug, 
  FaBatteryFull, 
  FaBatteryThreeQuarters,
  FaBatteryHalf,
  FaBatteryQuarter,
  FaBatteryEmpty,
  FaUserCircle,
  FaExclamationTriangle,
  FaSignal
} from 'react-icons/fa';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isConnected: boolean;
  batteryLevel: number;
  signalStrength: number;
  onEmergencyStop: () => void;
}

export default function Header({ isConnected, batteryLevel, signalStrength, onEmergencyStop }: HeaderProps) {
  const getBatteryIcon = () => {
    if (batteryLevel >= 75) return <FaBatteryFull className="text-green-600" />;
    if (batteryLevel >= 50) return <FaBatteryThreeQuarters className="text-green-500" />;
    if (batteryLevel >= 25) return <FaBatteryHalf className="text-yellow-600" />;
    if (batteryLevel >= 10) return <FaBatteryQuarter className="text-orange-600" />;
    return <FaBatteryEmpty className="text-red-600" />;
  };

  const getBatteryColor = () => {
    if (batteryLevel >= 50) return 'bg-green-500';
    if (batteryLevel >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <header className="h-[55px] bg-white/40 backdrop-blur-xl border-b border-white/70 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-50 shadow-2xl" style={{ 
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(12px) saturate(180%)',
    }}>
      {/* Sol: Logo */}
      <div className="flex items-center gap-2.5">
        <img 
          src="/gama_logo0.png" 
          alt="Gama Logo" 
          className="h-8 w-auto object-contain"
        />
        <h1 className="text-sm font-semibold text-gray-800 hidden sm:block">Gama Control Panel</h1>
      </div>

      {/* Orta: Bağlantı Durumu, Sinyal ve Pil */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Bağlantı Durumu */}
        <div className="flex items-center gap-1.5 bg-white/50 backdrop-blur-lg px-3 py-1.5 rounded-full border border-white/80 shadow-xl" style={{
          boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(10px) saturate(180%)',
        }}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-700 font-medium">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Sinyal Gücü */}
        <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/40">
          <FaSignal className={`text-sm ${
            signalStrength >= 70 ? 'text-green-600' : 
            signalStrength >= 40 ? 'text-yellow-600' : 
            'text-red-600'
          }`} />
          <div className="flex items-center gap-1.5">
            <Progress 
              value={signalStrength} 
              className={`h-1.5 w-16 ${
                signalStrength >= 70 ? '[&>div]:bg-green-500' : 
                signalStrength >= 40 ? '[&>div]:bg-yellow-500' : 
                '[&>div]:bg-red-500'
              }`}
            />
            <span className={`text-xs w-8 font-medium ${
              signalStrength >= 70 ? 'text-green-700' : 
              signalStrength >= 40 ? 'text-yellow-700' : 
              'text-red-700'
            }`}>{Math.round(signalStrength)}%</span>
          </div>
        </div>

        {/* Pil Seviyesi */}
        <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/40">
          {getBatteryIcon()}
          <div className="flex items-center gap-1.5">
            <Progress 
              value={batteryLevel} 
              className="h-1.5 w-16"
            />
            <span className="text-xs text-gray-700 font-medium w-8">{Math.round(batteryLevel)}%</span>
          </div>
        </div>
      </div>

      {/* Sağ: Kullanıcı ve Acil Durdurma */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Kullanıcı Menüsü */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-700 hover:text-gray-900 hover:bg-white/60 bg-white/40 backdrop-blur-lg border border-white/70 shadow-lg transition-all" style={{
              backdropFilter: 'blur(10px) saturate(180%)',
              boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
            }}>
              <FaUserCircle className="text-base" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white/60 backdrop-blur-xl border-white/80 text-gray-800 shadow-2xl" style={{ 
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(12px) saturate(180%)',
          }}>
            <DropdownMenuItem className="hover:bg-white/60 cursor-pointer text-sm">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/60 cursor-pointer text-sm">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Acil Durdurma Butonu */}
        <Button
          onClick={onEmergencyStop}
          className="bg-red-500/40 hover:bg-red-500/50 backdrop-blur-lg border border-red-500/70 text-red-700 hover:text-red-800 font-semibold px-3 md:px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-all text-xs shadow-2xl" style={{
            boxShadow: '0 4px 16px 0 rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(10px) saturate(180%)',
          }}
        >
          <FaExclamationTriangle className="text-xs" />
          <span className="hidden sm:inline">EMERGENCY</span>
        </Button>
      </div>
    </header>
  );
}

