'use client';

interface CircularGaugeProps {
  value: number;
  min: number;
  max: number;
  label: string;
  color: string;
}

export default function CircularGauge({ value, min, max, label, color }: CircularGaugeProps) {
  const size = 84;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  
  // Değeri 0-100 arasına normalize et
  const normalizedValue = ((value - min) / (max - min)) * 100;
  const offset = circumference - (normalizedValue / 100) * circumference;
  
  const colorMap: Record<string, string> = {
    '#007BFF': '#007BFF',
    '#28A745': '#28A745',
    '#DC3545': '#DC3545',
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="6"
          />
          
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colorMap[color] || color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-200"
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs font-bold text-gray-800">
              {value > 0 ? '+' : ''}{value.toFixed(1)}°
            </div>
          </div>
        </div>
      </div>
      <span className="text-[9px] text-gray-700 uppercase font-medium">{label}</span>
    </div>
  );
}

