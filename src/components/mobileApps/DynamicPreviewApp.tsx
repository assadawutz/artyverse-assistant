import React, { useState } from 'react';
import { Smartphone, Sparkles, RefreshCw, Layers, CheckCircle } from 'lucide-react';
import { playHapticSound, speakAccessibilityLabel } from '../../utils/audio';

interface Props {
  dynamicScale: number;
  screenReader: boolean;
  hapticEnabled: boolean;
  customCodeSnippet?: string;
}

export const DynamicPreviewApp: React.FC<Props> = ({
  dynamicScale,
  screenReader,
  hapticEnabled,
  customCodeSnippet,
}) => {
  const [activeItem, setActiveItem] = useState('Home');
  const [counter, setCounter] = useState(1);

  const handleInteract = (label: string, action?: () => void) => {
    if (hapticEnabled) playHapticSound('tap');
    if (screenReader) speakAccessibilityLabel(label);
    if (action) action();
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-none overflow-y-auto">
      {/* Live Canvas Bar */}
      <div className="px-4 py-3 bg-indigo-900 text-white flex items-center justify-between border-b border-indigo-700">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-indigo-300" />
          <span className="font-bold text-sm tracking-wide">Live Component Hot-Reload</span>
        </div>
        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[11px] rounded-full border border-emerald-500/40 flex items-center gap-1 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          Ready
        </span>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Code info banner */}
        <div className="p-3 bg-indigo-950/60 border border-indigo-800 rounded-xl text-xs text-indigo-200 flex items-center justify-between">
          <span>🎯 Mobile Clean Architecture Canvas</span>
          <span className="font-mono text-[10px] text-slate-400">WCAG 2.1 AAA</span>
        </div>

        {/* Live Interactive Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h2
              className="font-bold text-white"
              style={{ fontSize: `${1.1 * dynamicScale}rem` }}
            >
              Interactive Preview Engine
            </h2>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>

          <p
            className="text-slate-300 text-sm"
            style={{ fontSize: `${0.9 * dynamicScale}rem` }}
          >
            Components generated in the Left Workspace automatically hot-reload into this mobile sandbox with touch-target auditing and dynamic font scaling.
          </p>

          {/* Interactive Counter Element */}
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Touch Target Test</span>
              <span
                className="font-black text-indigo-400"
                style={{ fontSize: `${1.4 * dynamicScale}rem` }}
              >
                Score: {counter * 10} pts
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleInteract('ลดคะแนน', () => setCounter(Math.max(1, counter - 1)))}
                data-interactive="true"
                data-dimensions="48x48"
                className="w-12 h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center justify-center text-lg active:scale-95 border border-slate-600 focus:ring-2 focus:ring-indigo-400"
              >
                -
              </button>
              <button
                onClick={() => handleInteract('เพิ่มคะแนน', () => setCounter(counter + 1))}
                data-interactive="true"
                data-dimensions="48x48"
                className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center text-lg active:scale-95 shadow-md focus:ring-2 focus:ring-indigo-400"
              >
                +
              </button>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {['Home', 'Schedule', 'Profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleInteract(`เลือกหน้า ${tab}`, () => setActiveItem(tab))}
                data-interactive="true"
                data-dimensions="100%x48"
                className={`py-3 rounded-xl font-bold text-xs transition border focus:ring-2 focus:ring-indigo-400 ${
                  activeItem === tab
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Code Snippet viewer if available */}
        {customCodeSnippet && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="text-[10px] uppercase font-mono text-slate-400 mb-1 flex items-center justify-between">
              <span>Synchronized Mobile Code</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <pre className="text-[10px] font-mono text-indigo-300 max-h-32 overflow-y-auto whitespace-pre-wrap bg-slate-900 p-2 rounded">
              {customCodeSnippet.slice(0, 300)}...
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
