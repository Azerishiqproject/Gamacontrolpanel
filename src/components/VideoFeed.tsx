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
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden m-2 shadow-2xl border border-[#1A1A1A]">
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
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 pointer-events-auto border border-white/10">
        <div className="flex items-center gap-3 text-white text-sm">
          <span className="px-2 py-1 bg-[#007BFF]/30 rounded text-[#007BFF] font-semibold text-xs">HDR</span>
          <span className="font-mono text-xs">{videoQuality} - {fps} FPS</span>
        </div>
      </div>

      {/* Play/Pause & Timer - Sağ Üst */}
      <div className="absolute top-4 right-4 flex items-center gap-3 pointer-events-auto">
        <Button
          size="icon"
          variant="ghost"
          onClick={handlePlayPause}
          className="bg-black/70 hover:bg-black/90 text-white border border-white/20 backdrop-blur-sm"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </Button>
        <div className="bg-black/70 backdrop-blur-sm rounded px-3 py-1 border border-white/10">
          <span className="text-white font-mono text-sm">+ {recordingTime}</span>
        </div>
      </div>

      {/* HUD Katmanı */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Pusula - Üst Orta */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform" viewBox="0 0 128 128">
              {/* Pusula çemberi */}
              <circle cx="64" cy="64" r="60" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
              
              {/* Yön işaretleri */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const labels = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
                return (
                  <g key={i} transform={`rotate(${angle} 64 64)`}>
                    <line x1="64" y1="4" x2="64" y2="20" stroke="white" strokeWidth="2" />
                    <text x="64" y="28" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
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
              />
              
              {/* Merkez nokta */}
              <circle cx="64" cy="64" r="3" fill="white" />
            </svg>
            {/* Derece gösterimi */}
            <div className="absolute top-32 left-1/2 transform -translate-x-1/2 text-white text-xs font-mono bg-black/50 px-2 py-1 rounded">
              {Math.round(compassHeading)}°
            </div>
          </div>
        </div>

        {/* Yapay Ufuk Çizgisi - Alt Orta */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="relative w-64 h-16">
            <svg className="w-64 h-16" viewBox="0 0 256 64">
              {/* Ufuk çizgisi */}
              <line
                x1="0"
                y1={32 + pitch * 0.5}
                x2="256"
                y2={32 + pitch * 0.5}
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="2.5"
                transform={`rotate(${roll} 128 32)`}
              />
              {/* Merkez çizgi */}
              <line x1="128" y1="0" x2="128" y2="64" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeDasharray="4,4" />
              {/* Pitch göstergeleri */}
              {[-20, -10, 0, 10, 20].map((angle) => (
                <g key={angle}>
                  <line
                    x1={128 - 30}
                    y1={32 + angle * 0.5}
                    x2={128 - 20}
                    y2={32 + angle * 0.5}
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="1.5"
                    transform={`rotate(${roll} 128 32)`}
                  />
                  <text
                    x={128 - 35}
                    y={32 + angle * 0.5 + 4}
                    fill="white"
                    fontSize="10"
                    textAnchor="end"
                    transform={`rotate(${roll} 128 32)`}
                  >
                    {angle}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Nişangah - Merkez */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <svg className="w-24 h-24 opacity-75" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="40" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4,4" />
              <line x1="48" y1="8" x2="48" y2="24" stroke="white" strokeWidth="2" />
              <line x1="48" y1="72" x2="48" y2="88" stroke="white" strokeWidth="2" />
              <line x1="8" y1="48" x2="24" y2="48" stroke="white" strokeWidth="2" />
              <line x1="72" y1="48" x2="88" y2="48" stroke="white" strokeWidth="2" />
              <circle cx="48" cy="48" r="2" fill="white" />
            </svg>
          </div>
        </div>
      </div>

      {/* Kamera Zoom Kontrolü - Sağ Alt */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 pointer-events-auto">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomIn}
          className="bg-black/70 hover:bg-black/90 text-white border border-white/20"
        >
          <FaPlus />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomOut}
          className="bg-black/70 hover:bg-black/90 text-white border border-white/20"
        >
          <FaMinus />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleFullscreen}
          className="bg-black/70 hover:bg-black/90 text-white border border-white/20"
        >
          <FaExpand />
        </Button>
      </div>
    </div>
  );
}

