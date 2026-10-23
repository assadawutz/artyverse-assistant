import React, { useState } from 'react';
import { Landmark, ArrowUpRight, ArrowDownLeft, Fingerprint, Shield, Eye, EyeOff, Volume2 } from 'lucide-react';
import { playHapticSound, speakAccessibilityLabel } from '../../utils/audio';

interface Props {
  dynamicScale: number;
  screenReader: boolean;
  hapticEnabled: boolean;
}

export const ElderBankApp: React.FC<Props> = ({ dynamicScale, screenReader, hapticEnabled }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState(24500);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleInteract = (label: string, action?: () => void) => {
    if (hapticEnabled) playHapticSound('tap');
    if (screenReader) speakAccessibilityLabel(label);
    if (action) action();
  };

  const handleQuickTransfer = (name: string, amount: number) => {
    if (hapticEnabled) playHapticSound('success');
    if (balance >= amount) {
      setBalance((b) => b - amount);
      const text = `โอนเงินสำเร็จ ${amount} บาท ให้ ${name} ยอดเงินคงเหลือ ${balance - amount} บาท`;
      setFeedbackMsg(`โอนเงิน ${amount} บ. ให้ ${name} สำเร็จ`);
      speakAccessibilityLabel(text);
      setTimeout(() => setFeedbackMsg(''), 4000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white select-none overflow-y-auto">
      {/* Header with High-Contrast Bank Badge */}
      <div className="px-5 py-4 bg-yellow-400 text-black flex items-center justify-between border-b-4 border-black">
        <div className="flex items-center gap-2">
          <Landmark className="w-7 h-7 text-black stroke-[2.5]" />
          <div>
            <h1
              className="font-extrabold tracking-tight"
              style={{ fontSize: `${1.2 * dynamicScale}rem` }}
            >
              ธนาคารวัยสุข (ElderBank)
            </h1>
            <p className="text-xs font-bold text-slate-900">
              ความปลอดภัยสูง • ตัวหนังสือใหญ่พิเศษ
            </p>
          </div>
        </div>
        <div
          className="p-2 bg-black text-yellow-400 rounded-xl flex items-center gap-1 text-xs font-bold"
          title="เข้ารหัสด้วย iOS Keychain / Android Keystore"
        >
          <Shield className="w-4 h-4" />
          <span>FIPS 140-3</span>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {feedbackMsg && (
          <div className="p-3 bg-emerald-500 text-black font-extrabold rounded-xl text-center text-sm animate-pulse border-2 border-white">
            ✅ {feedbackMsg}
          </div>
        )}

        {/* Big Balance Card (Contrast Ratio 15:1) */}
        <div className="bg-slate-900 border-3 border-yellow-400 rounded-2xl p-5 shadow-2xl">
          <div className="flex items-center justify-between text-yellow-300 font-bold mb-1">
            <span style={{ fontSize: `${1 * dynamicScale}rem` }}>ยอดเงินในบัญชีออมทรัพย์</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowBalance(!showBalance);
                  handleInteract(showBalance ? 'ซ่อนยอดเงิน' : 'แสดงยอดเงิน');
                }}
                className="p-2 bg-slate-800 rounded-lg text-yellow-300"
                aria-label="เปิดปิดแสดงยอดเงิน"
                data-interactive="true"
                data-dimensions="36x36"
              >
                {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <button
                onClick={() =>
                  handleInteract(
                    `ยอดเงินคงเหลือของคุณคือ สองหมื่นสี่พันห้าร้อยบาทถ้วน`
                  )
                }
                className="p-2 bg-slate-800 rounded-lg text-yellow-300"
                title="ฟังเสียงอ่านยอดเงิน"
                data-interactive="true"
                data-dimensions="36x36"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            className="font-black text-white tracking-wide py-2"
            style={{ fontSize: `${2.2 * dynamicScale}rem` }}
          >
            {showBalance ? `฿ ${balance.toLocaleString('th-TH')}` : '฿ ••••••••'}
          </div>

          <p className="text-slate-400 text-xs mt-1">
            เลขบัญชี: 123-4-56789-0 (บัญชีเบี้ยยังชีพและเงินออม)
          </p>
        </div>

        {/* Biometric Scan Prompt */}
        <div className="flex items-center gap-3 p-3.5 bg-slate-900 border-2 border-slate-700 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-bold">
            <Fingerprint className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-sm">สแกนลายนิ้วมือ / ใบหน้า</div>
            <div className="text-slate-400 text-xs">ยืนยันตัวตนอัตโนมัติ ไม่ต้องจำรหัสผ่าน</div>
          </div>
        </div>

        {/* Quick Transfer to Loved Ones (Oversized 56x56 Touch Targets) */}
        <div className="space-y-2">
          <div className="text-yellow-300 font-extrabold text-sm uppercase tracking-wider">
            โอนเงินด่วนให้คนในครอบครัว (1-แตะ)
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {[
              { name: 'ลูกสาว (พิมพ์ใจ)', amount: 500, phone: '081-999-1234' },
              { name: 'หลานชาย (น้องกานต์)', amount: 300, phone: '089-555-6789' },
            ].map((person) => (
              <button
                key={person.name}
                onClick={() => handleQuickTransfer(person.name, person.amount)}
                data-interactive="true"
                data-dimensions="100%x64"
                className="w-full p-4 bg-slate-900 hover:bg-slate-800 border-2 border-yellow-400 rounded-2xl flex items-center justify-between text-left transition active:scale-98 focus:ring-4 focus:ring-yellow-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-400 text-black flex items-center justify-center font-black text-lg">
                    <ArrowUpRight className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div>
                    <div
                      className="font-extrabold text-white"
                      style={{ fontSize: `${1.05 * dynamicScale}rem` }}
                    >
                      {person.name}
                    </div>
                    <div className="text-xs text-yellow-300 font-medium">
                      {person.phone}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className="font-black text-yellow-400 text-base"
                    style={{ fontSize: `${1.1 * dynamicScale}rem` }}
                  >
                    โอน ฿{person.amount}
                  </div>
                  <div className="text-[10px] text-slate-400">กดเพื่อโอนทันที</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
