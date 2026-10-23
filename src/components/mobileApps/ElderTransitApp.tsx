import React, { useState } from 'react';
import { Navigation, MapPin, Ambulance, Phone, Volume2, ShieldAlert } from 'lucide-react';
import { playHapticSound, speakAccessibilityLabel } from '../../utils/audio';

interface Props {
  dynamicScale: number;
  screenReader: boolean;
  hapticEnabled: boolean;
}

export const ElderTransitApp: React.FC<Props> = ({ dynamicScale, screenReader, hapticEnabled }) => {
  const [selectedHospital, setSelectedHospital] = useState(0);

  const hospitals = [
    {
      name: 'โรงพยาบาลศิริราช (Siriraj Hospital)',
      distance: '1.2 กม. (ใช้เวลา 5 นาที)',
      emergencyTel: '02-419-7000',
      bedsAvailable: 'มีเตียงฉุกเฉินว่าง',
      routeSteps: [
        'เดินตรงไปข้างหน้า 50 เมตร แล้วเลี้ยวขวา',
        'ขึ้นรถพยาบาลฉุกเฉินที่จุดนัดรับหน้าปากซอย',
        'ตรงเข้าสู่อาคารผู้ป่วยวิกฤต (อุบัติเหตุและฉุกเฉิน ชั้น 1)',
      ],
    },
    {
      name: 'โรงพยาบาลธนบุรี (Thonburi Hospital)',
      distance: '2.5 กม. (ใช้เวลา 8 นาที)',
      emergencyTel: '1645',
      bedsAvailable: 'แผนกหัวใจพร้อมรับผู้ป่วย',
      routeSteps: [
        'เลี้ยวซ้ายถนนใหญ่ มุ่งหน้าสะพานอรุณอมรินทร์',
        'เข้าช่องทางฉุกเฉินสีแดงหน้าโรงพยาบาล',
      ],
    },
  ];

  const handleInteract = (label: string, action?: () => void) => {
    if (hapticEnabled) playHapticSound('tap');
    if (screenReader) speakAccessibilityLabel(label);
    if (action) action();
  };

  const current = hospitals[selectedHospital];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white select-none overflow-y-auto">
      {/* App Header */}
      <div className="px-5 py-4 bg-teal-950 border-b-2 border-teal-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-6 h-6 text-teal-400" />
          <h1
            className="font-bold text-white tracking-wide"
            style={{ fontSize: `${1.15 * dynamicScale}rem` }}
          >
            ระบบนำทางฉุกเฉิน LifeRoute
          </h1>
        </div>
        <span className="px-2.5 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg flex items-center gap-1">
          <Ambulance className="w-4 h-4 animate-bounce" />
          <span>GPS ฉุกเฉิน</span>
        </span>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Hospital Selector Buttons */}
        <div className="flex gap-2">
          {hospitals.map((h, idx) => (
            <button
              key={h.name}
              onClick={() => {
                setSelectedHospital(idx);
                handleInteract(`เลือกเส้นทางไปยัง ${h.name}`);
              }}
              data-interactive="true"
              data-dimensions="50%x48"
              className={`flex-1 py-3 px-3 rounded-xl border-2 font-bold text-xs transition text-center focus:ring-4 focus:ring-teal-400 ${
                selectedHospital === idx
                  ? 'bg-teal-700 border-teal-300 text-white shadow-lg'
                  : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              {h.name.split(' ')[0]} ({h.distance.split(' ')[0]})
            </button>
          ))}
        </div>

        {/* Selected Hospital Emergency Card */}
        <div className="bg-slate-900 border-2 border-teal-500 rounded-2xl p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div
                className="font-extrabold text-teal-300 flex items-center gap-1.5"
                style={{ fontSize: `${1.1 * dynamicScale}rem` }}
              >
                <MapPin className="w-5 h-5 text-rose-400 flex-shrink-0" />
                {current.name}
              </div>
              <div className="text-slate-300 text-xs mt-1 font-semibold flex items-center gap-2">
                <span>📍 ระยะทาง: {current.distance}</span>
                <span className="text-emerald-400 font-bold">• {current.bedsAvailable}</span>
              </div>
            </div>
            <button
              onClick={() =>
                handleInteract(
                  `โรงพยาบาลที่ใกล้ที่สุดคือ ${current.name} ระยะทาง ${current.distance} สายด่วนโทร ${current.emergencyTel}`
                )
              }
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl"
              title="ฟังเสียงข้อมูลโรงพยาบาล"
              data-interactive="true"
              data-dimensions="40x40"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Call Ambulance */}
          <a
            href={`tel:${current.emergencyTel}`}
            onClick={(e) => {
              e.preventDefault();
              handleInteract(`กำลังโทรเรียกรถพยาบาลฉุกเฉินเบอร์ ${current.emergencyTel}`);
            }}
            data-interactive="true"
            data-dimensions="100%x56"
            className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-98"
          >
            <Phone className="w-5 h-5 animate-pulse" />
            <span style={{ fontSize: `${1 * dynamicScale}rem` }}>
              โทรสายด่วนห้องฉุกเฉิน {current.emergencyTel}
            </span>
          </a>
        </div>

        {/* Big Step-by-Step Directions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <h2
            className="font-bold text-white mb-3 flex items-center gap-2"
            style={{ fontSize: `${1 * dynamicScale}rem` }}
          >
            <span>🚶 ขั้นตอนการเดินทาง (ตัวโต อ่านง่าย)</span>
          </h2>

          <div className="space-y-3">
            {current.routeSteps.map((step, index) => (
              <div
                key={index}
                onClick={() => handleInteract(`ขั้นตอนที่ ${index + 1}: ${step}`)}
                data-interactive="true"
                data-dimensions="100%x48"
                className="p-3 bg-slate-950 border-2 border-slate-700 hover:border-teal-400 rounded-xl flex items-center gap-3 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-950 font-black flex items-center justify-center flex-shrink-0 text-sm">
                  {index + 1}
                </div>
                <div
                  className="font-semibold text-slate-200"
                  style={{ fontSize: `${0.95 * dynamicScale}rem` }}
                >
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
