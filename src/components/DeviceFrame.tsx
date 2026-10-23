import React from 'react';
import { Wifi, Battery, Signal, Sparkles } from 'lucide-react';
import { DeviceType, DeviceOrientation } from '../types';

interface Props {
  deviceType: DeviceType;
  orientation: DeviceOrientation;
  safeAreaOverlay: boolean;
  highContrast: boolean;
  dynamicScale: number;
  inspectTouchTargets: boolean;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<Props> = ({
  deviceType,
  orientation,
  safeAreaOverlay,
  highContrast,
  dynamicScale,
  inspectTouchTargets,
  children,
}) => {
  // Dimensions for device frame simulation
  const isLandscape = orientation === 'landscape';

  let frameWidth = '393px';
  let frameHeight = '852px';

  if (deviceType === 'pixel') {
    frameWidth = isLandscape ? '870px' : '412px';
    frameHeight = isLandscape ? '412px' : '870px';
  } else if (deviceType === 'tablet') {
    frameWidth = isLandscape ? '960px' : '700px';
    frameHeight = isLandscape ? '700px' : '960px';
  } else {
    // iPhone 16 Pro
    frameWidth = isLandscape ? '852px' : '393px';
    frameHeight = isLandscape ? '393px' : '852px';
  }

  return (
    <div className="relative flex items-center justify-center p-4">
      {/* Device Exterior Shell */}
      <div
        className={`relative rounded-[50px] p-3 shadow-2xl transition-all duration-300 border-[6px] border-slate-700 bg-slate-900 ring-1 ring-slate-800 ${
          highContrast ? 'wcag-high-contrast' : ''
        }`}
        style={{
          width: frameWidth,
          height: frameHeight,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(99, 102, 241, 0.15)',
        }}
      >
        {/* Physical Button Accents */}
        <div className="absolute -left-[9px] top-28 w-1 h-12 bg-slate-600 rounded-l"></div>
        <div className="absolute -left-[9px] top-44 w-1 h-12 bg-slate-600 rounded-l"></div>
        <div className="absolute -right-[9px] top-36 w-1 h-16 bg-slate-600 rounded-r"></div>

        {/* Device Screen Bezel */}
        <div
          className={`relative w-full h-full rounded-[40px] overflow-hidden bg-slate-950 flex flex-col ${
            inspectTouchTargets ? 'inspect-touch-targets' : ''
          }`}
          style={{ '--dynamic-type-scale': dynamicScale } as React.CSSProperties}
        >
          {/* Status Bar */}
          <div className="relative z-30 h-11 px-6 flex items-center justify-between text-white text-xs select-none">
            <span className="font-semibold text-[13px] tracking-tight">09:41</span>

            {/* Notch / Dynamic Island / Punch Hole */}
            {deviceType === 'iphone' && (
              <div className="absolute left-1/2 -translate-x-1/2 top-2 w-28 h-7 bg-black rounded-full flex items-center justify-between px-2.5 shadow-md">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-indigo-500/70"></div>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
              </div>
            )}

            {deviceType === 'pixel' && (
              <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-4 h-4 rounded-full bg-black border border-slate-800"></div>
            )}

            <div className="flex items-center gap-2 text-slate-200">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          {/* Safe Area Inset Overlay (Notch + Home Bar Visualizer) */}
          {safeAreaOverlay && (
            <div className="absolute inset-0 pointer-events-none z-40 border-2 border-dashed border-amber-400/80">
              <div className="h-11 bg-amber-500/20 text-amber-300 text-[10px] flex items-center justify-center font-mono font-bold">
                ⚠️ Top Safe Area Inset (47pt)
              </div>
              <div className="absolute bottom-0 inset-x-0 h-8 bg-amber-500/20 text-amber-300 text-[10px] flex items-center justify-center font-mono font-bold">
                ⚠️ Bottom Safe Area Inset (34pt)
              </div>
            </div>
          )}

          {/* Screen Content */}
          <div className="flex-1 relative overflow-hidden flex flex-col">{children}</div>

          {/* Home Bar Indicator (iOS style) */}
          <div className="relative z-30 h-7 flex items-center justify-center pointer-events-none bg-transparent">
            <div className="w-32 h-1 bg-slate-400/70 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
