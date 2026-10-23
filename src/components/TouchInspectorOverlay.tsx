import React from 'react';
import {
  Crosshair,
  Maximize2,
  SunMoon,
  Type,
  Volume2,
  Vibrate,
  Smartphone,
  Tablet,
  RotateCw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { DeviceType, DeviceOrientation, InspectorState } from '../types';

interface Props {
  inspectorState: InspectorState;
  setInspectorState: React.Dispatch<React.SetStateAction<InspectorState>>;
  deviceType: DeviceType;
  setDeviceType: (d: DeviceType) => void;
  orientation: DeviceOrientation;
  setOrientation: (o: DeviceOrientation) => void;
  currentApp: string;
  setCurrentApp: (a: string) => void;
}

export const TouchInspectorOverlay: React.FC<Props> = ({
  inspectorState,
  setInspectorState,
  deviceType,
  setDeviceType,
  orientation,
  setOrientation,
  currentApp,
  setCurrentApp,
}) => {
  const toggleKey = (key: keyof InspectorState) => {
    setInspectorState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 p-3 space-y-2.5">
      {/* Top Bar: Device & App Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Mobile App Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider">
            Mobile App:
          </span>
          {[
            { id: 'care', label: 'ArtyCare Senior' },
            { id: 'bank', label: 'ElderBank (AAA)' },
            { id: 'transit', label: 'LifeRoute GIS' },
            { id: 'preview', label: 'Hot-Reload Canvas' },
          ].map((app) => (
            <button
              key={app.id}
              onClick={() => setCurrentApp(app.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                currentApp === app.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {app.label}
            </button>
          ))}
        </div>

        {/* Device Model & Orientation Switchers */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setDeviceType('iphone')}
              className={`p-1.5 rounded-lg flex items-center gap-1 transition ${
                deviceType === 'iphone' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Apple iPhone 16 Pro (Dynamic Island)"
            >
              <Smartphone className="w-4 h-4" />
              <span className="font-semibold text-[11px]">iPhone 16</span>
            </button>
            <button
              onClick={() => setDeviceType('pixel')}
              className={`p-1.5 rounded-lg flex items-center gap-1 transition ${
                deviceType === 'pixel' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Google Pixel 9 Pro"
            >
              <Smartphone className="w-4 h-4" />
              <span className="font-semibold text-[11px]">Pixel 9</span>
            </button>
            <button
              onClick={() => setDeviceType('tablet')}
              className={`p-1.5 rounded-lg flex items-center gap-1 transition ${
                deviceType === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="iPad Mini / Senior Tablet"
            >
              <Tablet className="w-4 h-4" />
              <span className="font-semibold text-[11px]">Tablet</span>
            </button>
          </div>

          <button
            onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
            className="p-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl flex items-center gap-1"
            title="Rotate Device Orientation"
          >
            <RotateCw className="w-4 h-4" />
            <span className="font-semibold capitalize text-[11px]">{orientation}</span>
          </button>
        </div>
      </div>

      {/* Senior Accessibility & Touch Target Inspector Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Touch Target 48x48dp Toggle */}
          <button
            onClick={() => toggleKey('touchTargets')}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition ${
              inspectorState.touchTargets
                ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Crosshair className="w-4 h-4 text-rose-400" />
            <span>Target Inspector (48dp)</span>
            {inspectorState.touchTargets && (
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
            )}
          </button>

          {/* Safe Area Inset Toggle */}
          <button
            onClick={() => toggleKey('safeArea')}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition ${
              inspectorState.safeArea
                ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Maximize2 className="w-4 h-4 text-amber-400" />
            <span>Safe Area Insets</span>
          </button>

          {/* WCAG 2.1 AAA High Contrast */}
          <button
            onClick={() => toggleKey('highContrast')}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition ${
              inspectorState.highContrast
                ? 'bg-yellow-400 text-black border-yellow-300 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <SunMoon className="w-4 h-4" />
            <span>WCAG AAA 7:1 Contrast</span>
          </button>

          {/* Screen Reader VoiceOver Simulator */}
          <button
            onClick={() => toggleKey('screenReader')}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition ${
              inspectorState.screenReader
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
            title="Simulates VoiceOver / TalkBack announcements on tap"
          >
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>TalkBack / VoiceOver</span>
          </button>

          {/* Haptic Simulator */}
          <button
            onClick={() => toggleKey('hapticEnabled')}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition ${
              inspectorState.hapticEnabled
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Vibrate className="w-4 h-4 text-cyan-400" />
            <span>Haptics & Cues</span>
          </button>
        </div>

        {/* Dynamic Type Scale Slider (100% to 300% for Senior Accessibility) */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Type className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-300">
            Dynamic Type: {(inspectorState.dynamicScale * 100).toFixed(0)}%
          </span>
          <input
            type="range"
            min="1.0"
            max="3.0"
            step="0.25"
            value={inspectorState.dynamicScale}
            onChange={(e) =>
              setInspectorState((prev) => ({
                ...prev,
                dynamicScale: parseFloat(e.target.value),
              }))
            }
            className="w-24 accent-indigo-500 cursor-pointer"
            title="Scale font sizes up to 300% without layout truncation"
          />
        </div>
      </div>
    </div>
  );
};
