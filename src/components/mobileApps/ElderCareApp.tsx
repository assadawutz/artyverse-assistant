import React, { useState } from 'react';
import { PhoneCall, AlertTriangle, Pill, HeartPulse, UserCheck, ShieldCheck, Volume2, CheckCircle2 } from 'lucide-react';
import { playHapticSound, speakAccessibilityLabel } from '../../utils/audio';

interface Props {
  dynamicScale: number;
  screenReader: boolean;
  hapticEnabled: boolean;
}

export const ElderCareApp: React.FC<Props> = ({ dynamicScale, screenReader, hapticEnabled }) => {
  const [sosActive, setSosActive] = useState(false);
  const [pillsTaken, setPillsTaken] = useState<{ [key: string]: boolean }>({
    morning: true,
    afternoon: false,
    evening: false,
  });

  const handleInteract = (label: string, action?: () => void) => {
    if (hapticEnabled) playHapticSound('tap');
    if (screenReader) speakAccessibilityLabel(label);
    if (action) action();
  };

  const handleSos = () => {
    if (hapticEnabled) playHapticSound('alert');
    const newState = !sosActive;
    setSosActive(newState);
    const msg = newState ? 'ขอความช่วยเหลือฉุกเฉิน กำลังส่งตำแหน่ง GPS ไปยังศูนย์ 1669' : 'ยกเลิกการแจ้งเตือนฉุกเฉิน';
    speakAccessibilityLabel(msg);
  };

  const togglePill = (id: string, name: string) => {
    const next = !pillsTaken[id];
    setPillsTaken((prev) => ({ ...prev, [id]: next }));
    const msg = next ? `รับประทาน ${name} เรียบร้อยแล้วค่ะ` : `ยกเลิกการทาน ${name}`;
    handleInteract(msg);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-none overflow-y-auto">
      {/* Top App Header with Senior High Contrast */}
      <div className="px-5 py-4 bg-indigo-950 border-b border-indigo-800/80 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-rose-400 animate-pulse" />
            <h1
              className="font-bold text-white tracking-wide"
              style={{ fontSize: `${1.25 * dynamicScale}rem` }}
            >
              ArtyCare Senior
            </h1>
          </div>
          <p
            className="text-indigo-200 mt-0.5"
            style={{ fontSize: `${0.875 * dynamicScale}rem` }}
          >
            คุณสมศรี มีสุข (อายุ 76 ปี)
          </p>
        </div>
        <button
          onClick={() => handleInteract('ระบบตรวจจับการล้มทำงานปกติ มีการเข้ารหัสข้อมูลระดับสูงสุด')}
          className="p-3 bg-emerald-950/80 text-emerald-300 border border-emerald-600 rounded-xl flex items-center gap-1.5 focus:ring-4 focus:ring-emerald-400"
          aria-label="สถานะความปลอดภัย"
          data-interactive="true"
          data-dimensions="48x48"
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs font-semibold">ปลอดภัย</span>
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* SOS Emergency Dispatch Button (WCAG AAA Giant Target 64x64+ dp) */}
        <div className="bg-slate-950 rounded-2xl p-4 border border-rose-900/60 shadow-lg">
          <button
            onClick={handleSos}
            aria-label={sosActive ? 'กำลังส่งความช่วยเหลือฉุกเฉิน' : 'ปุ่มขอความช่วยเหลือฉุกเฉิน SOS กดเพื่อเรียกรถพยาบาล'}
            data-interactive="true"
            data-dimensions="100%x76"
            className={`w-full py-5 px-6 rounded-2xl flex items-center justify-center gap-4 transition-all duration-200 font-extrabold shadow-xl focus:ring-4 focus:ring-yellow-300 ${
              sosActive
                ? 'bg-rose-600 text-white animate-bounce ring-4 ring-rose-400'
                : 'bg-rose-700 hover:bg-rose-600 text-white active:scale-95'
            }`}
          >
            <AlertTriangle className="w-9 h-9 text-yellow-300 flex-shrink-0" />
            <div className="text-left">
              <span
                className="block leading-none uppercase tracking-wider"
                style={{ fontSize: `${1.4 * dynamicScale}rem` }}
              >
                {sosActive ? '🚨 กำลังเรียกรถพยาบาล...' : 'กดปุ่มฉุกเฉิน SOS'}
              </span>
              <span
                className="text-rose-100 font-medium block mt-1"
                style={{ fontSize: `${0.85 * dynamicScale}rem` }}
              >
                {sosActive ? 'โทรติดต่อ 1669 และส่งพิกัดบ้านแล้ว' : 'ส่งสัญญาณทันที ไม่ต้องกดหลายขั้นตอน'}
              </span>
            </div>
          </button>
        </div>

        {/* Quick Contact Caregiver */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleInteract('กำลังโทรหา ลูกสาว น้องพิมพ์')}
            data-interactive="true"
            data-dimensions="100%x64"
            className="p-4 bg-blue-950 border-2 border-blue-600 rounded-2xl text-left hover:bg-blue-900 transition flex items-center gap-3 focus:ring-4 focus:ring-blue-300"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <div
                className="font-bold text-white"
                style={{ fontSize: `${1 * dynamicScale}rem` }}
              >
                โทรหาลูก
              </div>
              <div
                className="text-blue-200 text-xs"
                style={{ fontSize: `${0.8 * dynamicScale}rem` }}
              >
                น้องพิมพ์ (ด่วน)
              </div>
            </div>
          </button>

          <button
            onClick={() => handleInteract('กำลังโทรปรึกษา แพทย์ประจำตัว นายแพทย์วิชัย')}
            data-interactive="true"
            data-dimensions="100%x64"
            className="p-4 bg-emerald-950 border-2 border-emerald-600 rounded-2xl text-left hover:bg-emerald-900 transition flex items-center gap-3 focus:ring-4 focus:ring-emerald-300"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div
                className="font-bold text-white"
                style={{ fontSize: `${1 * dynamicScale}rem` }}
              >
                ปรึกษาหมอ
              </div>
              <div
                className="text-emerald-200 text-xs"
                style={{ fontSize: `${0.8 * dynamicScale}rem` }}
              >
                นพ. วิชัย (รพ.จุฬาฯ)
              </div>
            </div>
          </button>
        </div>

        {/* Medication Schedule with Oversized Touch Targets */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Pill className="w-6 h-6 text-amber-400" />
              <h2
                className="font-bold text-white"
                style={{ fontSize: `${1.1 * dynamicScale}rem` }}
              >
                ตารางทานยาประจำวัน
              </h2>
            </div>
            <button
              onClick={() => handleInteract('อ่านตารางทานยาวันนี้: เช้า ทานแล้ว, กลางวัน ยาเบาหวาน 1 เม็ด, เย็น ยาลดไขมัน 1 เม็ด')}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg flex items-center gap-1 text-xs"
              title="ฟังเสียงอ่านตารางยา"
              data-interactive="true"
              data-dimensions="36x36"
            >
              <Volume2 className="w-4 h-4" />
              <span>ฟังเสียง</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              { id: 'morning', time: 'เช้า (08:00)', name: 'ยาความดันโลหิต 1 เม็ด', detail: 'หลังอาหารเช้า 15 นาที' },
              { id: 'afternoon', time: 'กลางวัน (12:30)', name: 'ยาบำรุงไต & แคลเซียม', detail: 'พร้อมน้ำอุ่น 1 แก้ว' },
              { id: 'evening', time: 'ก่อนนอน (20:30)', name: 'ยาลดไขมันในเลือด', detail: 'ก่อนเข้านอน' },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => togglePill(item.id, item.name)}
                data-interactive="true"
                data-dimensions="100%x58"
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
                  pillsTaken[item.id]
                    ? 'bg-emerald-950/60 border-emerald-600 text-emerald-100'
                    : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-500'
                }`}
              >
                <div>
                  <span
                    className="font-bold block"
                    style={{ fontSize: `${1 * dynamicScale}rem` }}
                  >
                    {item.time} : {item.name}
                  </span>
                  <span
                    className="text-xs text-slate-400 block mt-0.5"
                    style={{ fontSize: `${0.825 * dynamicScale}rem` }}
                  >
                    {item.detail}
                  </span>
                </div>
                <div className="p-1">
                  {pillsTaken[item.id] ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-slate-500 flex items-center justify-center text-xs text-slate-400 font-bold">
                      ทาน
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
