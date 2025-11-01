'use client';

import { useState, useEffect } from 'react';

interface CompassProps {
  heading: number;
  size?: number;
}

export default function Compass({ heading, size = 200 }: CompassProps) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
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
          stroke="#1A1A1A"
          strokeWidth="3"
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
              stroke="white"
              strokeWidth={isMajor ? 2 : 1}
              opacity={0.9}
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
          
          return (
            <text
              key={angle}
              x={100 + 75 * Math.cos(rad)}
              y={100 + 75 * Math.sin(rad)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize={angle % 90 === 0 ? "14" : "10"}
              fontWeight={angle % 90 === 0 ? "bold" : "normal"}
              transform={`rotate(${angle + 90} 100 100)`}
            >
              {labels[angle]}
            </text>
          );
        })}
        
        {/* Pusula iğnesi */}
        <g transform={`rotate(${heading} 100 100)`}>
          {/* Kuzey iğnesi (kırmızı) */}
          <polygon
            points="100,20 90,60 100,50 110,60"
            fill="#DC3545"
          />
          {/* Güney iğnesi (beyaz) */}
          <polygon
            points="100,180 90,140 100,150 110,140"
            fill="white"
          />
          {/* Merkez */}
          <circle cx="100" cy="100" r="8" fill="#1A1A1A" />
          <circle cx="100" cy="100" r="4" fill="white" />
        </g>
      </svg>
      
      {/* Merkez heading gösterimi */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-2xl font-bold text-white font-mono">
          {Math.round(heading)}°
        </div>
        <div className="text-xs text-gray-400">Heading</div>
      </div>
    </div>
  );
}

