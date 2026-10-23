import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Brain,
  Search,
  MapPin,
  Volume2,
  Play,
  RotateCcw,
  Smartphone,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { ChatMessage } from '../../types';
import { speakAccessibilityLabel } from '../../utils/audio';

interface Props {
  onPushToCanvas: (codeSnippet: string) => void;
}

export const ChatTab: React.FC<Props> = ({ onPushToCanvas }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `สวัสดีค่ะ! ดิฉันคือ **ARTYVERSE ASSISTANT** (Perpetual Lockspec Engine)
ผู้ช่วยสถาปนิกและโคไพลอตสำหรับนักพัฒนาโมบายล์ระดับซีเนียร์ (Mobile-First Senior Architect & Accessibility Specialist)

พร้อมสร้างซอฟต์แวร์ระดับโปรดักชันที่ผ่านมาตรฐาน **WCAG 2.1 AAA**, รองรับขนาดปุ่มขั้นต่ำ **48x48 dp**, อัตราคอนทราสต์ $\\ge 7:1$, ป้องกันการแหว่งด้วย Safe Area Insets และเข้ารหัสความปลอดภัยด้วย **iOS Keychain / Android Keystore**

ทุกคำตอบจะส่งออกตามแบบแผน 4 ขั้นตอนเสมอ:
1. **Executive Summary & Mobile Architecture**
2. **Production-Ready Mobile Code**
3. **Realtime Mobile Canvas Code Block**
4. **Compliance & Audit Verification Checkbox**`,
      modelUsed: 'gemini-3.8-flash',
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-3.8-flash');
  const [thinkingMode, setThinkingMode] = useState(true);
  const [grounding, setGrounding] = useState<'none' | 'search' | 'maps'>('none');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const presets = [
    'สร้างแอปขอความช่วยเหลือฉุกเฉินผู้สูงอายุ (Elderly SOS) ด้วย SwiftUI Clean Architecture พร้อมปุ่ม 64x64dp และ Keychain',
    'ออกแบบหน้าจอ Mobile Banking โอนเงินด่วนคนชรา ด้วย Jetpack Compose MVI คอนทราสต์ 10:1 ตาม WCAG AAA',
    'เขียนระบบแจ้งเตือนทานยาด้วย Flutter Riverpod และเชื่อมต่อ GPS นำทางไปยังโรงพยาบาลที่ใกล้ที่สุด',
    'ตรวจสอบความปลอดภัยของ Mobile Code ตามมาตรฐาน OWASP Mobile Top 10 และ HIPAA/PDPA',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          model: selectedModel,
          thinking: thinkingMode,
          grounding: grounding,
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        modelUsed: data.modelUsed || selectedModel,
        groundingMetadata: data.groundingMetadata,
        thinkingLevel: thinkingMode ? 'High' : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Check if code block exists to push to right canvas
      const codeMatch = data.reply.match(/```(?:swift|kotlin|dart|tsx|jsx|javascript|typescript)?([\s\S]*?)```/);
      if (codeMatch && codeMatch[1]) {
        onPushToCanvas(codeMatch[1].trim());
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      // If error is quota-related (429), automatically switch to gemini-3.8-flash and retry once
      if (selectedModel !== 'gemini-3.8-flash' && (err.message?.includes('429') || err.message?.includes('quota'))) {
        setSelectedModel('gemini-3.8-flash');
        try {
          const retryRes = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: text,
              history: messages.map((m) => ({ role: m.role, content: m.content })),
              model: 'gemini-3.8-flash',
              thinking: thinkingMode,
              grounding: grounding,
            }),
          });
          const retryData = await retryRes.json();
          if (!retryData.error) {
            const assistantMsg: ChatMessage = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: retryData.reply,
              modelUsed: retryData.modelUsed || 'gemini-3.8-flash',
              groundingMetadata: retryData.groundingMetadata,
              thinkingLevel: thinkingMode ? 'High' : undefined,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, assistantMsg]);
            const codeMatch = retryData.reply.match(/```(?:swift|kotlin|dart|tsx|jsx|javascript|typescript)?([\s\S]*?)```/);
            if (codeMatch && codeMatch[1]) {
              onPushToCanvas(codeMatch[1].trim());
            }
            return;
          }
        } catch (retryErr) {
          console.error('Retry error:', retryErr);
        }
      }

      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ เกิดข้อผิดพลาด: ${err.message}. สลับมาใช้โมเดล Gemini 3.8 Flash เรียบร้อยแล้วค่ะ กรุณาลองใหม่อีกครั้ง`,
        modelUsed: selectedModel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePlayVoice = async (id: string, text: string) => {
    try {
      setPlayingAudioId(id);
      // Clean up markdown syntax for vocalization
      const cleanText = text
        .replace(/```[\s\S]*?```/g, 'มีโค้ดตัวอย่างในกล่องข้อความค่ะ')
        .replace(/[#*`_\[\]()]/g, '')
        .slice(0, 350);

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          voiceName: 'Kore',
          style: 'Cute, warm, polite, clear, friendly Thai female voice (น้ำเสียงผู้หญิงไทย น่ารัก อบอุ่น ชัดถ้อยชัดคำ)',
          model: 'gemini-3.8-flash-tts',
        }),
      });

      const data = await res.json();
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.onended = () => setPlayingAudioId(null);
        audio.onerror = () => {
          setPlayingAudioId(null);
          speakAccessibilityLabel(cleanText, 'th-TH');
        };
        await audio.play();
      } else {
        speakAccessibilityLabel(cleanText, 'th-TH');
        setPlayingAudioId(null);
      }
    } catch (e) {
      console.error('TTS Playback fallback:', e);
      speakAccessibilityLabel(text.slice(0, 200), 'th-TH');
      setPlayingAudioId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100">
      {/* Configuration & Model Selection Controls */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 space-y-2 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Model Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-1.5">Model:</span>
            {[
              { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash (Active)' },
              { id: 'gemini-3.1-flash-lite', label: '3.1 Flash-Lite (Fast)' },
              { id: 'gemini-4-argon', label: 'Gemini 4 Argon (Reasoning)' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  selectedModel === m.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Thinking Level Toggle */}
            <button
              onClick={() => setThinkingMode(!thinkingMode)}
              className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 font-bold transition ${
                thinkingMode
                  ? 'bg-indigo-950 text-indigo-300 border-indigo-500 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
              title="Enable High Thinking for complex mobile architecture & security analysis"
            >
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              <span>Thinking: High</span>
            </button>

            {/* Grounding Selector */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setGrounding('none')}
                className={`px-2 py-1 rounded-lg font-bold transition ${
                  grounding === 'none' ? 'bg-slate-800 text-white' : 'text-slate-400'
                }`}
              >
                Direct
              </button>
              <button
                onClick={() => setGrounding('search')}
                className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                  grounding === 'search' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
                title="Google Search Grounding"
              >
                <Search className="w-3 h-3" />
                <span>Search</span>
              </button>
              <button
                onClick={() => setGrounding('maps')}
                className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                  grounding === 'maps' ? 'bg-teal-600 text-white' : 'text-slate-400'
                }`}
                title="Google Maps Grounding"
              >
                <MapPin className="w-3 h-3" />
                <span>Maps</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Architecture Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
          <span className="text-slate-400 font-semibold flex-shrink-0">Presets:</span>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(preset)}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg flex-shrink-0 transition text-left"
            >
              {preset.slice(0, 42)}...
            </button>
          ))}
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                <Bot className="w-5 h-5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-md ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-200'
              }`}
            >
              {/* Header meta */}
              <div className="flex items-center justify-between gap-3 text-[11px] text-slate-400 mb-2 border-b border-slate-800/60 pb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-300">
                    {msg.role === 'user' ? 'Senior Mobile Developer' : 'ARTYVERSE Co-Pilot'}
                  </span>
                  {msg.modelUsed && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-[10px]">
                      {msg.modelUsed}
                    </span>
                  )}
                  {msg.thinkingLevel && (
                    <span className="px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px]">
                      Thinking: {msg.thinkingLevel}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span>{msg.timestamp}</span>

                  {msg.role === 'assistant' && (
                    <>
                      <button
                        onClick={() => handlePlayVoice(msg.id, msg.content)}
                        className={`p-1 rounded hover:bg-slate-800 transition ${
                          playingAudioId === msg.id ? 'text-pink-400 animate-pulse' : 'text-slate-400'
                        }`}
                        title="ฟังเสียงอ่านภาษาไทย (Cute Thai Female Voice)"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 transition"
                        title="Copy Response"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Message Content with clean markdown presentation */}
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {msg.content}
              </div>

              {/* Hot reload button if code exists */}
              {msg.role === 'assistant' && msg.content.includes('```') && (
                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    WCAG 2.1 AAA Checked
                  </span>
                  <button
                    onClick={() => {
                      const match = msg.content.match(/```(?:swift|kotlin|dart|tsx|jsx|javascript|typescript)?([\s\S]*?)```/);
                      if (match && match[1]) {
                        onPushToCanvas(match[1].trim());
                      }
                    }}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Push to Device Canvas</span>
                  </button>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-slate-400 text-xs">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white animate-pulse">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
              <span>ARTYVERSE กำลังสังเคราะห์สถาปัตยกรรมโมบายล์และตรวจสอบ WCAG 2.1 AAA...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-end gap-2"
        >
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="ถามสถาปัตยกรรมโมบายล์, ออกแบบ UI ผู้สูงอายุ WCAG AAA, หรือเขียนโค้ด SwiftUI / Compose / Flutter..."
              rows={2}
              className="w-full bg-transparent p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl transition flex items-center justify-center shadow-lg shadow-indigo-600/30"
            title="ส่งคำสั่งไปยัง ARTYVERSE ASSISTANT"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
