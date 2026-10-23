import React from 'react';
import { Smartphone, Sparkles, Volume2, Shield, Eye, Award } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-5 py-3 flex items-center justify-between select-none">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <Smartphone className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-white text-base tracking-tight flex items-center gap-1.5">
              <span>ARTYVERSE ASSISTANT</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v4.0 Perpetual Lockspec
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Senior Mobile Architecture & Elderly Accessibility Orchestrator (WCAG 2.1 AAA)
          </p>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-3 text-xs">
        {/* Cute Thai Voice Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-950/60 border border-pink-700/50 text-pink-300">
          <Volume2 className="w-3.5 h-3.5" />
          <span>เสียงผู้หญิงไทย น่ารัก อบอุ่น</span>
        </div>

        {/* WCAG AAA Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-300">
          <Award className="w-3.5 h-3.5" />
          <span>WCAG 2.1 AAA & 48dp</span>
        </div>

        {/* Security Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-700/50 text-indigo-300">
          <Shield className="w-3.5 h-3.5" />
          <span>OWASP & Keychain</span>
        </div>
      </div>
    </header>
  );
};
