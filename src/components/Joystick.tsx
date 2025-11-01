'use client';

import { useState, useRef, useEffect } from 'react';

interface JoystickProps {
  onMove: (x: number, y: number) => void;
  size: number;
  label: string;
  disabled?: boolean;
}

export default function Joystick({ onMove, size, label, disabled = false }: JoystickProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const joystickRef = useRef<HTMLDivElement>(null);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 20;

  const getDistance = (x: number, y: number) => {
    return Math.sqrt(x * x + y * y);
  };

  const constrainPosition = (x: number, y: number) => {
    const distance = getDistance(x, y);
    if (distance > radius) {
      return {
        x: (x / distance) * radius,
        y: (y / distance) * radius,
      };
    }
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updatePosition(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && joystickRef.current) {
      updatePosition(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    onMove(0, 0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    const touch = e.touches[0];
    updatePosition(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && joystickRef.current && e.touches[0]) {
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const updatePosition = (clientX: number, clientY: number) => {
    if (!joystickRef.current) return;

    const rect = joystickRef.current.getBoundingClientRect();
    const x = clientX - rect.left - centerX;
    const y = clientY - rect.top - centerY;

    const constrained = constrainPosition(x, y);
    setPosition(constrained);

    // Normalize değerleri -1 ile 1 arası
    const normalizedX = constrained.x / radius;
    const normalizedY = -constrained.y / radius; // Y ekseni ters çevrilmiş

    onMove(normalizedX, normalizedY);
  };

  useEffect(() => {
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
    <div className="flex flex-col items-center gap-1.5">
      <div
        ref={joystickRef}
        className={`relative select-none ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        style={{ width: size, height: size }}
        onMouseDown={disabled ? undefined : handleMouseDown}
        onTouchStart={disabled ? undefined : handleTouchStart}
      >
        {/* Dış çember - gölge efekti */}
        <div
          className="absolute rounded-full bg-[#141414] shadow-inner"
          style={{
            width: size,
            height: size,
            top: 0,
            left: 0,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
          }}
        />
        
        {/* İç çember - hafif border */}
        <div
          className="absolute rounded-full border border-[#1A1A1A]"
          style={{
            width: size - 4,
            height: size - 4,
            top: 2,
            left: 2,
          }}
        />
        
        {/* Merkez çizgiler - crosshair */}
        <svg
          className="absolute"
          width={size}
          height={size}
          style={{ top: 0, left: 0 }}
        >
          <line
            x1={size / 2}
            y1={0}
            x2={size / 2}
            y2={size}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
          />
          <line
            x1={0}
            y1={size / 2}
            x2={size}
            y2={size / 2}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
          />
        </svg>

        {/* Joystick topu - daha güzel görünüm */}
        <div
          className="absolute rounded-full bg-gradient-to-br from-[#007BFF] to-[#0056b3] transition-all duration-100 shadow-lg border border-[#0056b3]"
          style={{
            width: size * 0.28,
            height: size * 0.28,
            left: centerX + position.x - (size * 0.14),
            top: centerY + position.y - (size * 0.14),
            transform: isDragging ? 'scale(1.15)' : 'scale(1)',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out, left 0.15s ease-out, top 0.15s ease-out',
            boxShadow: isDragging 
              ? '0 4px 12px rgba(0,123,255,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
              : '0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        />
        
        {/* İç highlight */}
        <div
          className="absolute rounded-full bg-white opacity-20"
          style={{
            width: size * 0.14,
            height: size * 0.14,
            left: centerX + position.x - (size * 0.07),
            top: centerY + position.y - (size * 0.07),
            transition: isDragging ? 'none' : 'left 0.15s ease-out, top 0.15s ease-out',
          }}
        />
      </div>
      {label && <span className="text-[10px] text-gray-400 font-medium">{label}</span>}
    </div>
  );
}

