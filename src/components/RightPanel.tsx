'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  FaVideo,
  FaThermometerHalf,
  FaBatteryFull,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaInfoCircle
} from 'react-icons/fa';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface LogEntry {
  time: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface RightPanelProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function RightPanel({ isCollapsed, onToggleCollapse }: RightPanelProps) {
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

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-600 text-xs" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-600 text-xs" />;
      case 'error':
        return <FaTimesCircle className="text-red-600 text-xs" />;
      default:
        return <FaInfoCircle className="text-blue-600 text-xs" />;
    }
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'warning':
        return 'text-yellow-800';
      case 'error':
        return 'text-red-800';
      default:
        return 'text-gray-800';
    }
  };

  const getLogBgColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 backdrop-blur-md border-green-500/40';
      case 'warning':
        return 'bg-yellow-500/20 backdrop-blur-md border-yellow-500/40';
      case 'error':
        return 'bg-red-500/20 backdrop-blur-md border-red-500/40';
      default:
        return 'bg-blue-500/20 backdrop-blur-md border-blue-500/40';
    }
  };

  return (
    <aside 
      className={`bg-white/40 backdrop-blur-xl border-l border-white/70 transition-all duration-300 flex flex-col overflow-hidden hidden lg:flex shadow-2xl ${
        isCollapsed ? 'w-[48px]' : 'w-[280px]'
      }`}
      style={{ 
        boxShadow: '-4px 0 24px 0 rgba(31, 38, 135, 0.25), inset 1px 0 0 rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(12px) saturate(180%)',
      }}
    >
      {/* Collapse Button */}
      <div className="p-1 border-b border-white/30 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-7 w-7 text-gray-700 hover:text-gray-900 hover:bg-white/60 bg-white/40 backdrop-blur-lg border border-white/70 shadow-lg p-0 transition-all" style={{
            backdropFilter: 'blur(10px) saturate(180%)',
            boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
          }}
        >
          {isCollapsed ? <FaChevronLeft className="text-[10px]" /> : <FaChevronRight className="text-[10px]" />}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Sensör Verileri */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Sensor Data
          </h3>
          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="camera" className="border-white/70 bg-white/50 backdrop-blur-lg rounded-lg shadow-xl" style={{ 
              boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px) saturate(180%)',
            }}>
              <AccordionTrigger className="text-sm text-gray-800 hover:no-underline py-3 px-4 hover:bg-white/30 rounded-lg transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <FaVideo className="text-blue-600 text-base" />
                  <span className="font-medium">Camera Status</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs text-gray-700 space-y-1.5 px-4 pb-3 pt-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Resolution:</span>
                  <span className="font-medium text-gray-800">1920x1080</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">FPS:</span>
                  <span className="font-medium text-gray-800">30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Zoom:</span>
                  <span className="font-medium text-gray-800">1x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recording:</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="imu" className="border-white/70 bg-white/50 backdrop-blur-lg rounded-lg shadow-xl" style={{ 
              boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px) saturate(180%)',
            }}>
              <AccordionTrigger className="text-sm text-gray-800 hover:no-underline py-3 px-4 hover:bg-white/30 rounded-lg transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <FaThermometerHalf className="text-green-600 text-base" />
                  <span className="font-medium">IMU</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs text-gray-700 space-y-1.5 px-4 pb-3 pt-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pitch:</span>
                  <span className="font-medium text-gray-800">2.3°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Roll:</span>
                  <span className="font-medium text-gray-800">-1.5°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Yaw:</span>
                  <span className="font-medium text-gray-800">45.2°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Acceleration:</span>
                  <span className="font-medium text-gray-800">9.81 m/s²</span>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="battery" className="border-white/70 bg-white/50 backdrop-blur-lg rounded-lg shadow-xl" style={{ 
              boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px) saturate(180%)',
            }}>
              <AccordionTrigger className="text-sm text-gray-800 hover:no-underline py-3 px-4 hover:bg-white/30 rounded-lg transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <FaBatteryFull className="text-red-600 text-base" />
                  <span className="font-medium">Battery Detail</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs text-gray-700 space-y-1.5 px-4 pb-3 pt-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium text-gray-800">75%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Voltage:</span>
                  <span className="font-medium text-gray-800">12.6V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current:</span>
                  <span className="font-medium text-gray-800">15.2A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Temperature:</span>
                  <span className="font-medium text-gray-800">28°C</span>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="temp" className="border-white/70 bg-white/50 backdrop-blur-lg rounded-lg shadow-xl" style={{ 
              boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px) saturate(180%)',
            }}>
              <AccordionTrigger className="text-sm text-gray-800 hover:no-underline py-3 px-4 hover:bg-white/30 rounded-lg transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <FaThermometerHalf className="text-orange-600 text-base" />
                  <span className="font-medium">Temperature</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs text-gray-700 space-y-1.5 px-4 pb-3 pt-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Motor:</span>
                  <span className="font-medium text-gray-800">45°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Battery:</span>
                  <span className="font-medium text-gray-800">28°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Camera:</span>
                  <span className="font-medium text-gray-800">32°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Air:</span>
                  <span className="font-medium text-gray-800">22°C</span>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Olay Günlüğü */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Event Log
          </h3>
          <Card className="bg-white/30 backdrop-blur-xl border-white/60 p-3 shadow-2xl" style={{ 
            boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(12px) saturate(180%)',
          }}>
            <div className="max-h-48 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2.5 rounded-lg border transition-all hover:scale-[1.02] ${getLogBgColor(log.type)}`}
                  style={{
                    boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex-shrink-0">
                      {getLogIcon(log.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] text-gray-500 font-mono font-medium">
                          {log.time}
                        </span>
                      </div>
                      <span className={`text-xs font-medium leading-relaxed ${getLogColor(log.type)}`}>
                        {log.message}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </Card>
        </div>
        </div>
      )}
    </aside>
  );
}

