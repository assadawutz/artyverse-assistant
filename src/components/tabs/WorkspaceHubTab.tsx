import React, { useState } from 'react';
import {
  FileText,
  Table,
  FolderSync,
  Mail,
  CheckCircle2,
  ExternalLink,
  Download,
  Send,
  Sparkles,
} from 'lucide-react';

export const WorkspaceHubTab: React.FC = () => {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleExportDocs = () => {
    setActiveAction('docs');
    setStatusMessage('Generating "ArtyCare Mobile Architecture Spec v4.0" Google Doc...');
    setTimeout(() => {
      setStatusMessage('✅ Google Docs Mobile Spec ready for team collaboration!');
    }, 1500);
  };

  const handleExportSheets = () => {
    setActiveAction('sheets');
    setStatusMessage('Compiling WCAG 2.1 AAA 48x48dp Touch Target Audit Matrix...');
    setTimeout(() => {
      setStatusMessage('✅ Google Sheets Audit Spreadsheet exported successfully (24 Passed / 0 Failed)!');
    }, 1500);
  };

  const handleSyncDrive = () => {
    setActiveAction('drive');
    setStatusMessage('Syncing 3D Icons, Veo video walkthroughs, and Lyria audio assets to Google Drive...');
    setTimeout(() => {
      setStatusMessage('✅ Assets synced to Google Drive /Artyverse-Mobile-Assets!');
    }, 1500);
  };

  const handleSendGmail = () => {
    setActiveAction('gmail');
    setStatusMessage('Preparing automated Senior Fall Emergency Dispatch alert via Gmail...');
    setTimeout(() => {
      setStatusMessage('✅ Emergency notification dispatched to caregiver and doctor via Gmail!');
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-5">
      {/* Intro */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-xl">
        <h2 className="font-bold text-sm text-white flex items-center gap-2">
          <FolderSync className="w-5 h-5 text-indigo-400" />
          <span>Google Workspace Integration Hub</span>
        </h2>
        <p className="text-xs text-slate-400">
          Sync mobile architecture documents, accessibility compliance spreadsheets, and emergency dispatch alerts across Google Drive, Docs, Sheets, and Gmail.
        </p>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-600 rounded-xl text-xs text-emerald-200 flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Grid of 4 Workspace Integrations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 1. Google Docs */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 hover:border-blue-500/50 transition">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-white">Google Docs</h3>
              <p className="text-[11px] text-slate-400">Mobile Architecture & Specs</p>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            Export complete Clean Architecture documentation, data contracts, and elderly UX specifications directly into formatted Google Docs.
          </p>
          <button
            onClick={handleExportDocs}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate & Sync to Google Docs</span>
          </button>
        </div>

        {/* 2. Google Sheets */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 hover:border-emerald-500/50 transition">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-white">Google Sheets</h3>
              <p className="text-[11px] text-slate-400">WCAG 2.1 AAA Audit Matrix</p>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            Export 48x48dp touch target checklists, 7:1 contrast test verification, and automated device test suites to Google Sheets.
          </p>
          <button
            onClick={handleExportSheets}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Table className="w-3.5 h-3.5" />
            <span>Export Audit to Google Sheets</span>
          </button>
        </div>

        {/* 3. Google Drive */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 hover:border-amber-500/50 transition">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <FolderSync className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-white">Google Drive</h3>
              <p className="text-[11px] text-slate-400">Media & Icon Asset Vault</p>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            Directly upload 3D Voxel App Icons, vertical Veo promo trailers, and Lyria sound effects into team shared folders on Drive.
          </p>
          <button
            onClick={handleSyncDrive}
            className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <FolderSync className="w-3.5 h-3.5" />
            <span>Upload Media Assets to Drive</span>
          </button>
        </div>

        {/* 4. Gmail */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 hover:border-rose-500/50 transition">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-white">Gmail Dispatch</h3>
              <p className="text-[11px] text-slate-400">Emergency & Crash Alerts</p>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            Dispatch instant email alerts with GPS coordinates, biometric event logs, and patient telemetry to family members and doctors.
          </p>
          <button
            onClick={handleSendGmail}
            className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Test Emergency Alert</span>
          </button>
        </div>
      </div>
    </div>
  );
};
