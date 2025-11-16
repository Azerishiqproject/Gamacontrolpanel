'use client';

import { useState, useRef, useEffect } from 'react';
import { FaPlus, FaMinus, FaExpand, FaPlay, FaPause } from 'react-icons/fa';
import { Button } from '@/components/ui/button';


export default function VideoFeed() {
  const [zoom, setZoom] = useState(1);
  const [compassHeading, setCompassHeading] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [roll, setRoll] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showGrid] = useState(true);
  const [videoQuality] = useState('4K');
  const [fps] = useState(30);
  const [recordingTime, setRecordingTime] = useState('00:02:13');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pusula ve tutum simülasyonu
  useEffect(() => {
    const interval = setInterval(() => {
      setCompassHeading((prev) => (prev + Math.random() * 2 - 1) % 360);
      setPitch((prev) => Math.max(-30, Math.min(30, prev + (Math.random() * 0.5 - 0.25))));
      setRoll((prev) => Math.max(-30, Math.min(30, prev + (Math.random() * 0.5 - 0.25))));
    }, 100);

    // Kayıt süresi simülasyonu
    const timeInterval = setInterval(() => {
      setRecordingTime((prev) => {
        const [hours, minutes, seconds] = prev.split(':').map(Number);
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
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  const handleZoomIn = () => setZoom((prev) => Math.min(5, prev + 0.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(1, prev - 0.5));
  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Video yüklendiğinde otomatik oynat
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay başarısız olursa sessizce devam et
      });
    }
  }, []);

  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden shadow-2xl border border-white/70" style={{ 
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    }}>
      {/* Video Player */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        loop
        style={{ transform: `scale(${zoom})` }}
      >
        <source src="/video/1101.mp4" type="video/mp4" />
      </video>

      {/* %10 Siyah Overlay */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none z-10" />

      {/* Grid Overlay - Daha belirgin */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>
      )}

      {/* Video Info Overlay - Sol Üst (Basitleştirilmiş) */}
      <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-xl rounded-lg px-3 py-2 pointer-events-auto border border-white/40 shadow-2xl" style={{ 
        boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(12px) saturate(180%)',
      }}>
        <div className="flex items-center gap-3 text-gray-800 text-sm">
          <span className="px-2 py-1 bg-blue-500/30 backdrop-blur-sm rounded text-blue-700 font-semibold text-xs border border-blue-400/40">HDR</span>
          <span className="font-mono text-xs font-medium">{videoQuality} - {fps} FPS</span>
        </div>
      </div>

      {/* Play/Pause & Timer & Compass - Sağ Üst */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-3 pointer-events-auto">
        {/* Play/Pause & Timer */}
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={handlePlayPause}
            className="bg-white/20 hover:bg-white/30 text-gray-800 border border-white/40 backdrop-blur-lg shadow-xl transition-all h-9 w-9" style={{
              backdropFilter: 'blur(10px) saturate(180%)',
              boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            }}
          >
            {isPlaying ? <FaPause className="text-sm" /> : <FaPlay className="text-sm" />}
          </Button>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg px-3 py-1.5 border border-white/40 shadow-xl" style={{ 
            boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px) saturate(180%)',
          }}>
            <span className="text-gray-800 font-mono text-xs font-semibold">+ {recordingTime}</span>
          </div>
        </div>

        {/* Pusula - Küçültülmüş, Timer'ın Altında */}
        <div className="relative w-20 h-20 pointer-events-none">
          {/* Glassmorphism arka plan */}
          <div className="absolute inset-0 bg-white/15 backdrop-blur-lg rounded-full border border-white/30 shadow-xl" style={{
            backdropFilter: 'blur(10px) saturate(180%)',
            boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          }} />
          <svg className="w-20 h-20 transform relative z-10" viewBox="0 0 128 128">
            {/* Pusula çemberi */}
            <circle cx="64" cy="64" r="60" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            
            {/* Yön işaretleri */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const labels = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
              return (
                <g key={i} transform={`rotate(${angle} 64 64)`}>
                  <line x1="64" y1="4" x2="64" y2="20" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
                  <text x="64" y="28" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="11" fontWeight="bold">
                    {labels[i]}
                  </text>
                </g>
              );
            })}
            
            {/* Kuzey işareti (kırmızı) */}
            <polygon
              points="64,10 58,25 70,25"
              fill="#DC3545"
              transform={`rotate(${compassHeading} 64 64)`}
              opacity="0.9"
            />
            
            {/* Merkez nokta */}
            <circle cx="64" cy="64" r="3" fill="rgba(255,255,255,0.8)" />
          </svg>
          {/* Derece gösterimi - Pusulanın ortasında */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-800 text-xs font-mono bg-white/25 backdrop-blur-xl px-1.5 py-0.5 rounded-full border border-white/40 shadow-2xl z-20" style={{ 
            boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(12px) saturate(180%)',
          }}>
            {Math.round(compassHeading)}°
          </div>
        </div>
      </div>

      {/* Kamera Zoom Kontrolü - Sağ Alt */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 pointer-events-auto">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomIn}
          className="bg-white/20 hover:bg-white/30 text-gray-800 border border-white/40 backdrop-blur-xl shadow-2xl transition-all" style={{
            backdropFilter: 'blur(12px) saturate(180%)',
            boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          }}
        >
          <FaPlus />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomOut}
          className="bg-white/20 hover:bg-white/30 text-gray-800 border border-white/40 backdrop-blur-xl shadow-2xl transition-all" style={{
            backdropFilter: 'blur(12px) saturate(180%)',
            boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          }}
        >
          <FaMinus />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleFullscreen}
          className="bg-white/20 hover:bg-white/30 text-gray-800 border border-white/40 backdrop-blur-xl shadow-2xl transition-all" style={{
            backdropFilter: 'blur(12px) saturate(180%)',
            boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          }}
        >
          <FaExpand />
        </Button>
      </div>
    </div>
  );
}

