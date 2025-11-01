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
    if (batteryLevel >= 75) return <FaBatteryFull className="text-green-500" />;
    if (batteryLevel >= 50) return <FaBatteryThreeQuarters className="text-green-400" />;
    if (batteryLevel >= 25) return <FaBatteryHalf className="text-yellow-500" />;
    if (batteryLevel >= 10) return <FaBatteryQuarter className="text-orange-500" />;
    return <FaBatteryEmpty className="text-red-500" />;
  };

  const getBatteryColor = () => {
    if (batteryLevel >= 50) return 'bg-green-500';
    if (batteryLevel >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <header className="h-[55px] bg-[#141414] border-b border-[#1A1A1A] flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-50">
      {/* Sol: Logo */}
      <div className="flex items-center gap-2.5">
        <img 
          src="/gama_logo0.png" 
          alt="Gama Logo" 
          className="h-8 w-auto object-contain"
        />
        <h1 className="text-sm font-semibold text-white hidden sm:block">Gama Control Panel</h1>
      </div>

      {/* Orta: Bağlantı Durumu, Sinyal ve Pil */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Bağlantı Durumu */}
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-400">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Sinyal Gücü */}
        <div className="flex items-center gap-2">
          <FaSignal className={`text-sm ${
            signalStrength >= 70 ? 'text-green-500' : 
            signalStrength >= 40 ? 'text-yellow-500' : 
            'text-red-500'
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
            <span className={`text-xs w-8 ${
              signalStrength >= 70 ? 'text-green-400' : 
              signalStrength >= 40 ? 'text-yellow-400' : 
              'text-red-400'
            }`}>{Math.round(signalStrength)}%</span>
          </div>
        </div>

        {/* Pil Seviyesi */}
        <div className="flex items-center gap-2">
          {getBatteryIcon()}
          <div className="flex items-center gap-1.5">
            <Progress 
              value={batteryLevel} 
              className="h-1.5 w-16"
            />
            <span className="text-xs text-gray-400 w-8">{Math.round(batteryLevel)}%</span>
          </div>
        </div>
      </div>

      {/* Sağ: Kullanıcı ve Acil Durdurma */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Kullanıcı Menüsü */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10">
              <FaUserCircle className="text-base" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#141414] border-[#1A1A1A] text-white">
            <DropdownMenuItem className="hover:bg-[#1A1A1A] cursor-pointer text-sm">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#1A1A1A] cursor-pointer text-sm">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Acil Durdurma Butonu */}
        <Button
          onClick={onEmergencyStop}
          className="bg-transparent hover:bg-red-500/20 border border-red-500/50 text-red-400 hover:text-red-300 font-semibold px-3 md:px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-all text-xs"
        >
          <FaExclamationTriangle className="text-xs" />
          <span className="hidden sm:inline">EMERGENCY</span>
        </Button>
      </div>
    </header>
  );
}

