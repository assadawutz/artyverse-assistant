import React, { useState } from 'react';
import {
  MessageSquare,
  Image as ImageIcon,
  Mic,
  Clapperboard,
  MapPin,
  ShieldAlert,
  FolderSync,
} from 'lucide-react';
import { ActiveTab } from '../types';
import { ChatTab } from './tabs/ChatTab';
import { SketchVisionTab } from './tabs/SketchVisionTab';
import { VoiceStudioTab } from './tabs/VoiceStudioTab';
import { GenMediaTab } from './tabs/GenMediaTab';
import { EmergencyGISTab } from './tabs/EmergencyGISTab';
import { SecurityAuditTab } from './tabs/SecurityAuditTab';
import { WorkspaceHubTab } from './tabs/WorkspaceHubTab';

interface Props {
  onPushToCanvas: (codeSnippet: string) => void;
}

export const LeftPanel: React.FC<Props> = ({ onPushToCanvas }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');

  const tabs = [
    { id: 'chat', label: 'Co-Pilot Chat', icon: MessageSquare },
    { id: 'sketch', label: 'Vision & Sketch', icon: ImageIcon },
    { id: 'voice', label: 'Voice & TTS', icon: Mic },
    { id: 'media', label: 'GenMedia Studio', icon: Clapperboard },
    { id: 'gis', label: 'Emergency GIS', icon: MapPin },
    { id: 'security', label: 'Security & OWASP', icon: ShieldAlert },
    { id: 'workspace', label: 'Workspace Hub', icon: FolderSync },
  ];

  return (
    <div className="w-full lg:w-[540px] xl:w-[600px] flex-shrink-0 flex flex-col h-full bg-slate-950 border-r border-slate-800">
      {/* Navigation Tabs Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition flex-shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && <ChatTab onPushToCanvas={onPushToCanvas} />}
        {activeTab === 'sketch' && <SketchVisionTab onPushToCanvas={onPushToCanvas} />}
        {activeTab === 'voice' && <VoiceStudioTab />}
        {activeTab === 'media' && <GenMediaTab />}
        {activeTab === 'gis' && <EmergencyGISTab />}
        {activeTab === 'security' && <SecurityAuditTab />}
        {activeTab === 'workspace' && <WorkspaceHubTab />}
      </div>
    </div>
  );
};
