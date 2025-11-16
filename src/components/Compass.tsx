'use client';

import { useState, useRef, useEffect } from 'react';

interface CompassProps {
  heading: number;
  size?: number;
}

export default function Compass({ heading: initialHeading, size = 200 }: CompassProps) {
  const [currentHeading, setCurrentHeading] = useState(initialHeading);
  const [isDragging, setIsDragging] = useState(false);
  const compassRef = useRef<HTMLDivElement>(null);

  // Initial heading değiştiğinde güncelle
  useEffect(() => {
    if (!isDragging) {
      setCurrentHeading(initialHeading);
    }
  }, [initialHeading, isDragging]);

  const calculateAngle = (clientX: number, clientY: number): number => {
    if (!compassRef.current) return currentHeading;
    
    const rect = compassRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    
    // Açıyı hesapla (0-360 arası)
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360; // 0 derece kuzey olacak şekilde ayarla
    
    return angle;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const angle = calculateAngle(e.clientX, e.clientY);
    setCurrentHeading(angle);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    const angle = calculateAngle(touch.clientX, touch.clientY);
    setCurrentHeading(angle);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const angle = calculateAngle(e.clientX, e.clientY);
        setCurrentHeading(angle);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        const touch = e.touches[0];
        const angle = calculateAngle(touch.clientX, touch.clientY);
        setCurrentHeading(angle);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={compassRef}
      className="relative cursor-grab active:cursor-grabbing select-none" 
      style={{ width: size, height: size }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        viewBox="0 0 200 200"
      >
        {/* Arka plan çember */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="2"
        />
        
        {/* Derece işaretleri */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = i * 10;
          const rad = (angle * Math.PI) / 180;
          const isMajor = angle % 30 === 0;
          const innerRadius = isMajor ? 85 : 90;
          const outerRadius = 95;
          
          return (
            <line
              key={i}
              x1={100 + innerRadius * Math.cos(rad)}
              y1={100 + innerRadius * Math.sin(rad)}
              x2={100 + outerRadius * Math.cos(rad)}
              y2={100 + outerRadius * Math.sin(rad)}
              stroke="rgba(0,0,0,0.4)"
              strokeWidth={isMajor ? 2 : 1}
              opacity={0.8}
            />
          );
        })}
        
        {/* Yön etiketleri */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const labels: Record<number, string> = {
            0: 'N', 90: 'E', 180: 'S', 270: 'W',
            30: '30', 60: '60', 120: '120', 150: '150',
            210: '210', 240: '240', 300: '300', 330: '330',
          };
          const isCardinal = angle % 90 === 0;
          
          return (
            <text
              key={angle}
              x={100 + 75 * Math.cos(rad)}
              y={100 + 75 * Math.sin(rad)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isCardinal ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.6)"}
              fontSize={isCardinal ? "14" : "10"}
              fontWeight={isCardinal ? "bold" : "normal"}
              transform={`rotate(${angle + 90} 100 100)`}
            >
              {labels[angle]}
            </text>
          );
        })}
        
        {/* Pusula iğnesi */}
        <g transform={`rotate(${currentHeading} 100 100)`}>
          {/* Kuzey iğnesi (kırmızı) - mevcut heading */}
          <polygon
            points="100,20 90,60 100,50 110,60"
            fill="#DC3545"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="1"
          />
          {/* Güney iğnesi (beyaz) - kuzey yönü */}
          <polygon
            points="100,180 90,140 100,150 110,140"
            fill="white"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="1"
          />
          {/* Merkez */}
          <circle cx="100" cy="100" r="8" fill="rgba(0,0,0,0.3)" />
          <circle cx="100" cy="100" r="4" fill="rgba(0,0,0,0.6)" />
        </g>
      </svg>
    </div>
  );
}

