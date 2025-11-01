'use client';

import { useState } from 'react';
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaHome,
  FaExpand,
  FaQuestionCircle,
  FaLock,
  FaUnlock
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';

export default function Footer() {
  const [isArmed, setIsArmed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleTakeoff = () => {
    if (!isArmed) {
      alert('Önce drone\'u silahlandırın (Arm)!');
      return;
    }
    if (confirm('Kalkış yapılacak. Emin misiniz?')) {
      alert('Kalkış başlatıldı!');
    }
  };

  const handleLand = () => {
    if (confirm('İniş yapılacak. Emin misiniz?')) {
      alert('İniş başlatıldı!');
    }
  };

  const handleReturnToHome = () => {
    if (confirm('Drone eve dönecek. Emin misiniz?')) {
      alert('Eve dönüş başlatıldı!');
    }
  };

  const handleArmToggle = () => {
    if (isArmed) {
      if (confirm('Drone silahsızlandırılacak. Emin misiniz?')) {
        setIsArmed(false);
      }
    } else {
      if (confirm('Drone silahlandırılacak. Emin misiniz?')) {
        setIsArmed(true);
      }
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleHelp = () => {
    // Dialog zaten DialogTrigger ile açılıyor
  };

  return (
    <footer className="h-[50px] bg-[#252525] border-t border-[#333] flex items-center justify-between px-2 md:px-6 flex-shrink-0">
      {/* Sol: Hızlı Eylem Butonları */}
      <div className="flex items-center gap-1 md:gap-3">
        <Button
          onClick={handleTakeoff}
          className="bg-[#28A745] hover:bg-[#218838] text-white px-2 md:px-4 py-2 flex items-center gap-1 md:gap-2 text-xs md:text-sm"
          size="sm"
        >
          <FaArrowUp />
          <span className="hidden sm:inline">Kalkış</span>
        </Button>
        
        <Button
          onClick={handleLand}
          className="bg-[#DC3545] hover:bg-[#C82333] text-white px-2 md:px-4 py-2 flex items-center gap-1 md:gap-2 text-xs md:text-sm"
          size="sm"
        >
          <FaArrowDown />
          <span className="hidden sm:inline">İniş</span>
        </Button>
        
        <Button
          onClick={handleReturnToHome}
          className="bg-[#007BFF] hover:bg-[#0069d9] text-white px-2 md:px-4 py-2 flex items-center gap-1 md:gap-2 text-xs md:text-sm"
          size="sm"
        >
          <FaHome />
          <span className="hidden sm:inline">Eve Dön</span>
        </Button>
      </div>

      {/* Orta: Arm/Disarm Anahtarı */}
      <div className="flex items-center gap-3">
        <span className={`text-sm font-semibold ${isArmed ? 'text-green-500' : 'text-red-500'}`}>
          {isArmed ? 'SİLAHLI' : 'SİLAHSIZ'}
        </span>
        <Switch
          checked={isArmed}
          onCheckedChange={handleArmToggle}
          className={isArmed ? 'bg-green-500' : 'bg-red-500'}
        />
        {isArmed ? (
          <FaLock className="text-green-500" />
        ) : (
          <FaUnlock className="text-red-500" />
        )}
      </div>

      {/* Sağ: Tam Ekran ve Yardım */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFullscreen}
          className="text-gray-300 hover:text-white"
          title="Tam Ekran"
        >
          <FaExpand />
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:text-white"
              title="Yardım"
            >
              <FaQuestionCircle />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#252525] border-[#333] text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Klavye Kısayolları</DialogTitle>
              <DialogDescription className="text-gray-400">
                Drone kontrolü için kullanabileceğiniz klavye kısayolları
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Card className="bg-[#1E1E1E] border-[#333] p-4">
                <h4 className="font-semibold mb-2 text-[#007BFF]">Hareket Kontrolü</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>W / ↑</span>
                    <span>İleri</span>
                  </div>
                  <div className="flex justify-between">
                    <span>S / ↓</span>
                    <span>Geri</span>
                  </div>
                  <div className="flex justify-between">
                    <span>A / ←</span>
                    <span>Sol</span>
                  </div>
                  <div className="flex justify-between">
                    <span>D / →</span>
                    <span>Sağ</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#1E1E1E] border-[#333] p-4">
                <h4 className="font-semibold mb-2 text-[#007BFF]">Kamera Kontrolü</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Ok Tuşları</span>
                    <span>Pan / Tilt</span>
                  </div>
                  <div className="flex justify-between">
                    <span>+ / -</span>
                    <span>Zoom</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#1E1E1E] border-[#333] p-4">
                <h4 className="font-semibold mb-2 text-[#28A745]">Uçuş Kontrolü</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Space</span>
                    <span>Kalkış</span>
                  </div>
                  <div className="flex justify-between">
                    <span>L</span>
                    <span>İniş</span>
                  </div>
                  <div className="flex justify-between">
                    <span>H</span>
                    <span>Eve Dön</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#1E1E1E] border-[#333] p-4">
                <h4 className="font-semibold mb-2 text-[#DC3545]">Güvenlik</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>ESC</span>
                    <span>Acil Durdurma</span>
                  </div>
                  <div className="flex justify-between">
                    <span>R</span>
                    <span>Arm/Disarm</span>
                  </div>
                </div>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </footer>
  );
}

