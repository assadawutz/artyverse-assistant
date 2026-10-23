import React, { useState } from 'react';
import {
  MapPin,
  Ambulance,
  Phone,
  Navigation,
  Sparkles,
  Volume2,
  ShieldAlert,
  Activity,
  Heart,
  UserCheck,
} from 'lucide-react';
import { speakAccessibilityLabel } from '../../utils/audio';

export const EmergencyGISTab: React.FC = () => {
  const [location, setLocation] = useState('Sathorn, Bangkok, Thailand');
  const [emergencyType, setEmergencyType] = useState('Senior Fall & Hip Trauma');
  const [seniorMode, setSeniorMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<string | null>(null);

  // Fall Detection Simulator state
  const [fallDetected, setFallDetected] = useState(false);
  const [accelerometerG, setAccelerometerG] = useState(1.0);

  const handleCalculateRoute = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/emergency-gis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          emergencyType,
          seniorMode,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setDispatchResult(data.guide);
    } catch (err: any) {
      console.error('GIS Error:', err);
      alert('Failed to calculate route: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const simulateFallTrigger = () => {
    setAccelerometerG(3.8); // Sudden G spike
    setFallDetected(true);
    speakAccessibilityLabel(
      'ตรวจพบการล้มอย่างรุนแรง กำลังส่งพิกัดฉุกเฉินไปยังศูนย์กู้ชีพ 1669',
      'th-TH'
    );
    setTimeout(() => {
      setAccelerometerG(1.0);
    }, 4000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-5">
      {/* SECTION 1: Emergency GIS & Google Maps Grounding */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">Emergency GIS & Hospital Dispatch</h2>
              <p className="text-[11px] text-slate-400">
                Google Maps Grounding for nearest trauma centers and simplified senior navigation
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 text-[10px] font-mono">
            googleMaps Tool
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Senior Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Emergency Condition:</label>
            <select
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-teal-500 focus:outline-none"
            >
              <option value="Senior Fall & Hip Trauma">Senior Fall & Hip Trauma (อุบัติเหตุล้ม)</option>
              <option value="Cardiac & Chest Pain">Cardiac & Chest Pain (แน่นหน้าอกฉุกเฉิน)</option>
              <option value="Stroke & Weakness">Stroke Symptoms (แขนขาอ่อนแรงเฉียบพลัน)</option>
              <option value="General Geriatric Emergency">General Emergency (อาการฉุกเฉินทั่วไป)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleCalculateRoute}
          disabled={loading}
          className="w-full py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 transition"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{loading ? 'Calculating Realtime Maps Route...' : 'Dispatch Nearest Ambulance & Route'}</span>
        </button>

        {dispatchResult && (
          <div className="p-4 bg-slate-950 rounded-xl border border-teal-500/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-teal-400 flex items-center gap-1.5">
                <Ambulance className="w-4 h-4" />
                <span>Google Maps Emergency Dispatch Guide</span>
              </span>
              <button
                onClick={() => speakAccessibilityLabel(dispatchResult.slice(0, 300), 'th-TH')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded text-xs flex items-center gap-1"
                title="ฟังเสียงอ่านคำแนะนำ"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>อ่านออกเสียง</span>
              </button>
            </div>
            <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {dispatchResult}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: MediaPipe / Vision Fall Detection Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">
                Mobile Vision & Accelerometer Fall Detector
              </h2>
              <p className="text-[11px] text-slate-400">
                MediaPipe on-device pose estimation & 3-axis sensor fall trigger
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-mono">
            On-Device Sensor
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Simulated 3-Axis Force</span>
            <div className="font-mono text-xl font-bold text-indigo-400">
              {accelerometerG.toFixed(2)} G
            </div>
            <span className="text-[11px] text-slate-500">Threshold: &gt; 2.8G indicates impact</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Pose Orientation</span>
            <div className={`font-mono text-xl font-bold ${fallDetected ? 'text-rose-400' : 'text-emerald-400'}`}>
              {fallDetected ? 'Horizontal (Fallen)' : 'Vertical (Standing)'}
            </div>
            <span className="text-[11px] text-slate-500">Angle: {fallDetected ? '88° tilt' : '4° tilt'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={simulateFallTrigger}
            className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow transition"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Simulate Senior Fall Event</span>
          </button>

          {fallDetected && (
            <button
              onClick={() => setFallDetected(false)}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
