'use client';

import VideoFeed from './VideoFeed';
import ControlPanel from './ControlPanel';

interface MainContentProps {
  onEmergencyStop?: () => void;
  flightMode: 'manual' | 'auto' | 'patrol';
}

export default function MainContent({ onEmergencyStop, flightMode }: MainContentProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0A0A]">
      {/* Üst Kısım: Video Feed (%50 yükseklik) */}
      <div className="flex-1 min-h-0">
        <VideoFeed />
      </div>

      {/* Alt Kısım: Kontrol Paneli (%50 yükseklik) */}
      <div className="flex-1 min-h-0 border-t border-[#1A1A1A]">
        <ControlPanel onEmergencyStop={onEmergencyStop} flightMode={flightMode} />
      </div>
    </div>
  );
}

