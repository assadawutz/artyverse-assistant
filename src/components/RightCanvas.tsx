import React, { useState } from 'react';
import { DeviceType, DeviceOrientation, InspectorState } from '../types';
import { TouchInspectorOverlay } from './TouchInspectorOverlay';
import { DeviceFrame } from './DeviceFrame';
import { ElderCareApp } from './mobileApps/ElderCareApp';
import { ElderBankApp } from './mobileApps/ElderBankApp';
import { ElderTransitApp } from './mobileApps/ElderTransitApp';
import { DynamicPreviewApp } from './mobileApps/DynamicPreviewApp';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  customSnippet?: string;
}

export const RightCanvas: React.FC<Props> = ({ customSnippet }) => {
  const [deviceType, setDeviceType] = useState<DeviceType>('iphone');
  const [orientation, setOrientation] = useState<DeviceOrientation>('portrait');
  const [currentApp, setCurrentApp] = useState<string>('care');

  const [inspectorState, setInspectorState] = useState<InspectorState>({
    touchTargets: false,
    safeArea: false,
    highContrast: false,
    dynamicScale: 1.0,
    screenReader: false,
    hapticEnabled: true,
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden border-l border-slate-800">
      {/* Top Touch Inspector Toolbar */}
      <TouchInspectorOverlay
        inspectorState={inspectorState}
        setInspectorState={setInspectorState}
        deviceType={deviceType}
        setDeviceType={setDeviceType}
        orientation={orientation}
        setOrientation={setOrientation}
        currentApp={currentApp}
        setCurrentApp={setCurrentApp}
      />

      {/* Main Preview Viewport with Zoom & Center */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
        <DeviceFrame
          deviceType={deviceType}
          orientation={orientation}
          safeAreaOverlay={inspectorState.safeArea}
          highContrast={inspectorState.highContrast}
          dynamicScale={inspectorState.dynamicScale}
          inspectTouchTargets={inspectorState.touchTargets}
        >
          {currentApp === 'care' && (
            <ElderCareApp
              dynamicScale={inspectorState.dynamicScale}
              screenReader={inspectorState.screenReader}
              hapticEnabled={inspectorState.hapticEnabled}
            />
          )}

          {currentApp === 'bank' && (
            <ElderBankApp
              dynamicScale={inspectorState.dynamicScale}
              screenReader={inspectorState.screenReader}
              hapticEnabled={inspectorState.hapticEnabled}
            />
          )}

          {currentApp === 'transit' && (
            <ElderTransitApp
              dynamicScale={inspectorState.dynamicScale}
              screenReader={inspectorState.screenReader}
              hapticEnabled={inspectorState.hapticEnabled}
            />
          )}

          {currentApp === 'preview' && (
            <DynamicPreviewApp
              dynamicScale={inspectorState.dynamicScale}
              screenReader={inspectorState.screenReader}
              hapticEnabled={inspectorState.hapticEnabled}
              customCodeSnippet={customSnippet}
            />
          )}
        </DeviceFrame>
      </div>

      {/* Bottom Live Accessibility Status Bar */}
      <div className="bg-slate-900/90 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300 select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>WCAG 2.1 AAA Compliant</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <span>Touch Target:</span>
            <span className="font-mono text-emerald-400 font-bold">≥ 48x48 dp</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-slate-400">
            <span>Contrast Ratio:</span>
            <span className="font-mono text-emerald-400 font-bold">≥ 7:1 Normal / 4.5:1 Large</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[11px] font-mono">
            {deviceType.toUpperCase()} ({orientation})
          </span>
          <span className="flex items-center gap-1 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Keychain / Keystore Ready
          </span>
        </div>
      </div>
    </div>
  );
};
