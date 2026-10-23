export type DeviceType = 'iphone' | 'pixel' | 'tablet';
export type DeviceOrientation = 'portrait' | 'landscape';
export type ActiveTab = 'chat' | 'sketch' | 'voice' | 'media' | 'gis' | 'security' | 'workspace';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  modelUsed?: string;
  timestamp: string;
  groundingMetadata?: any;
  thinkingLevel?: string;
  structuredOutput?: {
    summary?: string;
    code?: string;
    canvasComponent?: string;
    compliance?: {
      wcagAAA: boolean;
      touchTargets: boolean;
      encryption: boolean;
      hipaa: boolean;
    };
  };
}

export interface InspectorState {
  touchTargets: boolean;
  safeArea: boolean;
  highContrast: boolean;
  dynamicScale: number; // 1.0 to 3.0
  screenReader: boolean;
  hapticEnabled: boolean;
}

export interface MobileAppPreset {
  id: string;
  name: string;
  description: string;
  category: string;
}
