'use client';

import VideoFeed from './VideoFeed';
import ControlPanel from './ControlPanel';

interface MainContentProps {
  onEmergencyStop?: () => void;
  flightMode: 'manual' | 'auto' | 'patrol';
}

export default function MainContent({ onEmergencyStop, flightMode }: MainContentProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Üst Kısım: Video Feed (%50 yükseklik) */}
      <div className="flex-1 min-h-0 p-3">
        <VideoFeed />
      </div>

      {/* Alt Kısım: Kontrol Paneli (%50 yükseklik) */}
      <div className="flex-1 min-h-0 p-3 pt-0">
        <ControlPanel onEmergencyStop={onEmergencyStop} flightMode={flightMode} />
      </div>
    </div>
  );
}

