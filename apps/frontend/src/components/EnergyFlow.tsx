import { Sun, Battery, Home, Zap } from 'lucide-react';
import React from 'react';

interface EnergyFlowProps {
  solarPower: number; // kW
  batteryPower: number; // kW (negative = charging, positive = discharging)
  gridPower: number; // kW (positive = importing, negative = exporting)
  homePower: number; // kW
  batterySoc: number; // %
}

export const EnergyFlow: React.FC<EnergyFlowProps> = ({
  solarPower,
  batteryPower,
  gridPower,
  homePower,
  batterySoc,
}) => {
  // Determine power flows for animations
  // Flows are represented as booleans: is it flowing?
  const isSolarGenerating = solarPower > 0.01;
  const isBatteryCharging = batteryPower < -0.01;
  const isBatteryDischarging = batteryPower > 0.01;
  const isGridImporting = gridPower > 0.01;
  const isGridExporting = gridPower < -0.01;
  const isHomeConsuming = homePower > 0.01;

  const nodeClass = "flex flex-col items-center justify-center p-4 rounded-xl border bg-card text-card-foreground shadow z-10 w-32 h-32 overflow-hidden";
  const labelClass = "text-xs font-medium text-muted-foreground uppercase tracking-wider mt-2";
  const valueClass = "text-lg font-bold mt-1";

  return (
    <div className="relative w-full max-w-3xl mx-auto h-[500px] flex items-center justify-center bg-background rounded-2xl border p-8">
      {/* Central Hub */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 border-muted flex items-center justify-center z-20 bg-background">
        <Zap className="h-6 w-6 text-muted-foreground opacity-50" />
      </div>

      {/* SVG Connecting Lines & Animations */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* 
          Coordinates mapping (approximate based on max-w-3xl h-[500px]):
          Center: 50%, 50%
          Top (Solar): 50%, 20%
          Left (Grid): 20%, 50%
          Right (Home): 80%, 50%
          Bottom (Battery): 50%, 80%
        */}

        {/* Static Paths */}
        <line x1="50%" y1="20%" x2="50%" y2="50%" stroke="hsl(var(--muted))" strokeWidth="4" />
        <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="hsl(var(--muted))" strokeWidth="4" />
        <line x1="50%" y1="50%" x2="80%" y2="50%" stroke="hsl(var(--muted))" strokeWidth="4" />
        <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="hsl(var(--muted))" strokeWidth="4" />

        {/* Animated Particles - Solar to Center */}
        {isSolarGenerating && (
          <circle r="4" fill="#eab308" filter="url(#glow)">
            <animate attributeName="cy" values="20%;50%" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="cx" values="50%;50%" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Animated Particles - Center to Home */}
        {isHomeConsuming && (
          <circle r="4" fill="#a855f7" filter="url(#glow)">
            <animate attributeName="cx" values="50%;80%" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="cy" values="50%;50%" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Animated Particles - Center to Battery (Charging) */}
        {isBatteryCharging && (
          <circle r="4" fill="#22c55e" filter="url(#glow)">
            <animate attributeName="cy" values="50%;80%" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="cx" values="50%;50%" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Animated Particles - Battery to Center (Discharging) */}
        {isBatteryDischarging && (
          <circle r="4" fill="#22c55e" filter="url(#glow)">
            <animate attributeName="cy" values="80%;50%" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="cx" values="50%;50%" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Animated Particles - Grid to Center (Importing) */}
        {isGridImporting && (
          <circle r="4" fill="#3b82f6" filter="url(#glow)">
            <animate attributeName="cx" values="20%;50%" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="cy" values="50%;50%" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Animated Particles - Center to Grid (Exporting) */}
        {isGridExporting && (
          <circle r="4" fill="#3b82f6" filter="url(#glow)">
            <animate attributeName="cx" values="50%;20%" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="cy" values="50%;50%" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>

      {/* Nodes */}
      {/* Solar (Top) */}
      <div className={`absolute top-4 left-1/2 -translate-x-1/2 ${nodeClass} border-t-4 border-t-yellow-500`}>
        <Sun className="h-8 w-8 text-yellow-500" />
        <span className={labelClass}>Solar PV</span>
        <span className={`${valueClass} text-yellow-500`}>{solarPower.toFixed(2)} kW</span>
      </div>

      {/* Grid (Left) */}
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${nodeClass} border-l-4 border-l-blue-500`}>
        <Zap className="h-8 w-8 text-blue-500" />
        <span className={labelClass}>Grid</span>
        <span className={`${valueClass} text-blue-500`}>{Math.abs(gridPower).toFixed(2)} kW</span>
        <span className="text-[10px] text-muted-foreground mt-1">
          {isGridImporting ? 'IMPORTING' : isGridExporting ? 'EXPORTING' : 'IDLE'}
        </span>
      </div>

      {/* Home (Right) */}
      <div className={`absolute right-4 top-1/2 -translate-y-1/2 ${nodeClass} border-r-4 border-r-purple-500`}>
        <Home className="h-8 w-8 text-purple-500" />
        <span className={labelClass}>Home Load</span>
        <span className={`${valueClass} text-purple-500`}>{homePower.toFixed(2)} kW</span>
      </div>

      {/* Battery (Bottom) */}
      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 ${nodeClass} border-b-4 border-b-green-500`}>
        <div className="absolute inset-x-0 bottom-0 bg-green-500/10 -z-10" style={{ height: `${batterySoc}%` }} />
        <Battery className="h-8 w-8 text-green-500" />
        <span className={labelClass}>Battery</span>
        <span className={`${valueClass} text-green-500`}>{Math.abs(batteryPower).toFixed(2)} kW</span>
        <span className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
          {batterySoc.toFixed(1)}% {isBatteryCharging ? '(CHG)' : isBatteryDischarging ? '(DIS)' : ''}
        </span>
      </div>
    </div>
  );
};
