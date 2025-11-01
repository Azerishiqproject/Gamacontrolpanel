'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  FaVideo,
  FaThermometerHalf,
  FaBatteryFull
} from 'react-icons/fa';
import { Card } from '@/components/ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Compass from './Compass';

interface LogEntry {
  time: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

export default function RightPanel() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: '14:32:10', message: 'Takeoff initiated', type: 'success' },
    { time: '14:33:05', message: 'Low battery warning (20%)', type: 'warning' },
  ]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Yeni log ekleme simülasyonu
  useEffect(() => {
    const interval = setInterval(() => {
      const types: LogEntry['type'][] = ['info', 'success', 'warning'];
      const messages = [
        'GPS position updated',
        'Sensor data received',
        'Camera setting changed',
      ];
      
      const newLog: LogEntry = {
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        message: messages[Math.floor(Math.random() * messages.length)],
        type: types[Math.floor(Math.random() * types.length)],
      };
      
      setLogs((prev) => [...prev.slice(-49), newLog]); // Son 50 log tut
    }, 10000); // Her 10 saniyede bir

    return () => clearInterval(interval);
  }, []);

  // Log scroll'u en alta kaydır
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-300';
    }
  };

  const getLogBgColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      default:
        return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <aside className="w-[280px] bg-[#141414] border-l border-[#1A1A1A] flex flex-col overflow-hidden hidden lg:flex">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Sensör Verileri */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
            Sensor Data
          </h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="camera" className="border-[#1A1A1A]">
              <AccordionTrigger className="text-sm text-white hover:no-underline">
                <div className="flex items-center gap-2">
                  <FaVideo className="text-[#007BFF]" />
                  <span>Camera Status</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs text-gray-300 space-y-1">
                <div>Resolution: 1920x1080</div>
                <div>FPS: 30</div>
                <div>Zoom: 1x</div>
                <div>Recording: Active</div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="imu" className="border-[#1A1A1A]">
              <AccordionTrigger className="text-sm text-white hover:no-underline">
                <div className="flex items-center gap-2">
                  <FaThermometerHalf className="text-[#28A745]" />
                  <span>IMU</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs text-gray-300 space-y-1">
                <div>Pitch: 2.3°</div>
                <div>Roll: -1.5°</div>
                <div>Yaw: 45.2°</div>
                <div>Acceleration: 9.81 m/s²</div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="battery" className="border-[#1A1A1A]">
              <AccordionTrigger className="text-sm text-white hover:no-underline">
                <div className="flex items-center gap-2">
                  <FaBatteryFull className="text-[#DC3545]" />
                  <span>Battery Detail</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs text-gray-300 space-y-1">
                <div>Level: 75%</div>
                <div>Voltage: 12.6V</div>
                <div>Current: 15.2A</div>
                <div>Temperature: 28°C</div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="temp" className="border-[#1A1A1A]">
              <AccordionTrigger className="text-sm text-white hover:no-underline">
                <div className="flex items-center gap-2">
                  <FaThermometerHalf className="text-orange-500" />
                  <span>Temperature</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs text-gray-300 space-y-1">
                <div>Motor: 45°C</div>
                <div>Battery: 28°C</div>
                <div>Camera: 32°C</div>
                <div>Air: 22°C</div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Compass - Sadece pusula, daha küçük */}
        <div className="flex flex-col items-center bg-[#0D0D0D] rounded-lg p-3 border border-[#1A1A1A]">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
            Compass
          </h3>
          <Compass heading={45} size={150} />
        </div>

        {/* Olay Günlüğü */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
            Event Log
          </h3>
          <Card className="bg-[#0D0D0D] border-[#1A1A1A] p-2">
            <div className="max-h-48 overflow-y-auto space-y-1">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2 rounded border text-xs ${getLogBgColor(log.type)}`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 font-mono">{log.time}</span>
                    <span className={`flex-1 ${getLogColor(log.type)}`}>
                      {log.message}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </Card>
        </div>
      </div>
    </aside>
  );
}

