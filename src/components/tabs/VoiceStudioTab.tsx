import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Play,
  Pause,
  Download,
  Sparkles,
  Radio,
  FileAudio,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { speakAccessibilityLabel } from '../../utils/audio';

export const VoiceStudioTab: React.FC = () => {
  // TTS State
  const [ttsText, setTtsText] = useState(
    'สวัสดีค่ะคุณยาย วันนี้เวลาบ่ายสองโมง มีนัดตรวจวัดความดันกับคุณหมอวิชัยนะคะ อย่าลืมดื่มน้ำอุ่น 1 แก้วก่อนออกเดินทางค่ะ'
  );
  const [ttsModel, setTtsModel] = useState('gemini-3.8-flash-tts');
  const [ttsVoice, setTtsVoice] = useState('Kore');
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [isPlayingTts, setIsPlayingTts] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Audio Transcription State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [transcribeLoading, setTranscribeLoading] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Live API WebSocket State
  const [liveConnected, setLiveConnected] = useState(false);
  const [liveLog, setLiveLog] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  // Sample elderly TTS prompts
  const samplePrompts = [
    'สวัสดีค่ะคุณตา อย่าลืมทานยาความดัน 1 เม็ดหลังอาหารเช้านะคะ',
    'คุณหมอคอนเฟิร์มผลตรวจเลือดแล้วค่ะ ปกติดีทุกรายการ สุขภาพแข็งแรงมากค่ะ',
    'กำลังต่อสายเรียกรถพยาบาลฉุกเฉิน 1669 ให้อย่างเร่งด่วนค่ะ อยู่ในที่ปลอดภัยนะคะ',
  ];

  // Handle TTS Generation
  const handleGenerateTts = async (textToUse?: string) => {
    const text = textToUse || ttsText;
    if (!text.trim() || ttsLoading) return;
    setTtsLoading(true);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          model: ttsModel,
          voiceName: ttsVoice,
          style: 'Cute, warm, polite, clear, friendly Thai female voice (น้ำเสียงผู้หญิงไทย น่ารัก อบอุ่น ชัดถ้อยชัดคำ ฟังง่าย)',
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setTtsAudioUrl(data.audioUrl);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = data.audioUrl;
        audioPlayerRef.current.play();
        setIsPlayingTts(true);
      }
    } catch (err: any) {
      console.error('TTS error:', err);
      // Accessibility fallback
      speakAccessibilityLabel(text, 'th-TH');
    } finally {
      setTtsLoading(false);
    }
  };

  // Start Mic Recording for Gemini 3.5 Transcribe
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Unable to access microphone. Please grant permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Transcribe Recorded or Uploaded Audio
  const handleTranscribe = async (blobToTranscribe?: Blob) => {
    const blob = blobToTranscribe || recordedAudioBlob;
    if (!blob || transcribeLoading) return;
    setTranscribeLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Audio = reader.result as string;
        const res = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Audio,
            mimeType: blob.type || 'audio/webm',
          }),
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setTranscriptionResult(data.transcription);
      };
      reader.readAsDataURL(blob);
    } catch (err: any) {
      console.error('Transcription error:', err);
      alert('Failed to transcribe: ' + err.message);
    } finally {
      setTranscribeLoading(false);
    }
  };

  // Live API WebSocket connection
  const toggleLiveSession = () => {
    if (liveConnected) {
      if (wsRef.current) wsRef.current.close();
      setLiveConnected(false);
      setLiveLog((prev) => [...prev, '🔴 Live session disconnected.']);
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setLiveConnected(true);
        setLiveLog((prev) => [...prev, '🟢 Connected to Gemini 3.8 Live API Voice Engine.']);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'connected') {
            setLiveLog((prev) => [...prev, `⚡ ${data.message}`]);
          } else if (data.text) {
            setLiveLog((prev) => [...prev, `🤖 Assistant: ${data.text}`]);
          } else if (data.error) {
            setLiveLog((prev) => [...prev, `⚠️ Error: ${data.message}`]);
          }
        } catch (e) {
          console.error(e);
        }
      };

      ws.onclose = () => {
        setLiveConnected(false);
        setLiveLog((prev) => [...prev, '🔴 Live socket closed.']);
      };
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-5">
      {/* SECTION 1: Thai Female Voice TTS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/30">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">
                Cute Thai Female Voice TTS (Gemini 3.8 Flash TTS)
              </h2>
              <p className="text-[11px] text-pink-300">
                น้ำเสียงผู้หญิงไทย น่ารัก อบอุ่น ชัดถ้อยชัดคำ ฟังง่ายสำหรับผู้สูงอายุ
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-700/50 text-[10px] font-mono">
            gemini-3.8-flash-tts
          </span>
        </div>

        {/* Preset Sentences */}
        <div className="space-y-1.5">
          <span className="text-xs text-slate-400 font-semibold">ตัวอย่างประโยคดูแลผู้สูงอายุ:</span>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTtsText(p);
                  handleGenerateTts(p);
                }}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-300 transition text-left"
              >
                {p.slice(0, 36)}...
              </button>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <div>
          <textarea
            value={ttsText}
            onChange={(e) => setTtsText(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:border-pink-500 focus:outline-none resize-none font-thai"
            placeholder="พิมพ์ข้อความภาษาไทยที่ต้องการให้สังเคราะห์เสียง..."
          />
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Voice:</span>
            <select
              value={ttsVoice}
              onChange={(e) => setTtsVoice(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200"
            >
              <option value="Kore">Kore (Soft & Warm Female)</option>
              <option value="Zephyr">Zephyr (Bright & Friendly)</option>
              <option value="Puck">Puck (Gentle Host)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleGenerateTts()}
              disabled={ttsLoading || !ttsText.trim()}
              className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-pink-600/20 disabled:opacity-50 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{ttsLoading ? 'สังเคราะห์เสียง...' : 'สร้างเสียงพูด'}</span>
            </button>

            {ttsAudioUrl && (
              <a
                href={ttsAudioUrl}
                download="artyverse-thai-voice.wav"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl"
                title="ดาวน์โหลดไฟล์เสียง WAV"
              >
                <Download className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Hidden Audio Player for playback */}
        <audio
          ref={audioPlayerRef}
          onPlay={() => setIsPlayingTts(true)}
          onEnded={() => setIsPlayingTts(false)}
          controls
          className={`w-full mt-2 h-10 ${ttsAudioUrl ? 'block' : 'hidden'}`}
        />
      </div>

      {/* SECTION 2: Audio Transcription (Gemini 3.5 Transcribe) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">
                Audio Transcription (Gemini 3.5 Transcribe)
              </h2>
              <p className="text-[11px] text-slate-400">
                แปลงเสียงพูดภาษาไทย/อังกฤษเป็นข้อความ พร้อมจับเวลาและบันทึกอาการสุขภาพ
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono">
            gemini-3.5-transcribe
          </span>
        </div>

        {/* Recording Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isRecording ? (
              <button
                onClick={stopRecording}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg animate-pulse"
              >
                <MicOff className="w-4 h-4" />
                <span>หยุดบันทึกเสียง</span>
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg"
              >
                <Mic className="w-4 h-4" />
                <span>กดเพื่อพูดอัดเสียง (Mic)</span>
              </button>
            )}

            {recordedAudioBlob && !isRecording && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>บันทึกเสียงแล้ว ({Math.round(recordedAudioBlob.size / 1024)} KB)</span>
              </span>
            )}
          </div>

          <button
            onClick={() => handleTranscribe()}
            disabled={!recordedAudioBlob || transcribeLoading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-indigo-300 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-indigo-500/40"
          >
            <Sparkles className="w-4 h-4" />
            <span>{transcribeLoading ? 'กำลังถอดเทปเสียง...' : 'เริ่มถอดความ'}</span>
          </button>
        </div>

        {/* Transcription Output */}
        {transcriptionResult && (
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">ผลการถอดข้อความ:</span>
            <p className="text-xs text-slate-200 whitespace-pre-wrap font-thai leading-relaxed">
              {transcriptionResult}
            </p>
          </div>
        )}
      </div>

      {/* SECTION 3: Live API Realtime Voice Bridge (Gemini 3.8 Live) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h2 className="font-bold text-sm text-white">Gemini 3.8 Live API Voice Bridge</h2>
          </div>
          <button
            onClick={toggleLiveSession}
            className={`px-3 py-1 rounded-xl font-bold text-xs transition ${
              liveConnected
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {liveConnected ? 'Disconnect Live' : 'Connect Live Stream'}
          </button>
        </div>

        <div className="bg-slate-950 rounded-xl p-3 h-28 overflow-y-auto border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
          {liveLog.length === 0 ? (
            <div className="text-slate-500 text-center py-6">
              Press "Connect Live Stream" to initialize real-time bidirectional voice stream with Gemini 3.8 Live API.
            </div>
          ) : (
            liveLog.map((log, idx) => <div key={idx}>{log}</div>)
          )}
        </div>
      </div>
    </div>
  );
};
