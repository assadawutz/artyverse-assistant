import React, { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Smartphone,
  Copy,
  Check,
  Code2,
  FileText,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  onPushToCanvas: (codeSnippet: string) => void;
}

export const SketchVisionTab: React.FC<Props> = ({ onPushToCanvas }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState('image/png');
  const [targetFramework, setTargetFramework] = useState('swiftui');
  const [customInstructions, setCustomInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Pre-configured SVG Sketch Wireframes for 1-click test
  const sampleSketches = [
    {
      id: 'elder-sos',
      title: 'Senior SOS Dispatch Sketch',
      desc: 'Hand-drawn paper wireframe for senior emergency trigger with 64dp button',
      dataUrl:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="360" height="640" viewBox="0 0 360 640" fill="%23f8fafc"><rect width="360" height="640" fill="%230f172a"/><rect x="20" y="40" width="320" height="60" rx="12" fill="%231e293b" stroke="%236366f1" stroke-width="2"/><text x="180" y="75" fill="%23ffffff" font-size="18" text-anchor="middle" font-family="sans-serif">Elderly Care Header</text><rect x="30" y="140" width="300" height="120" rx="20" fill="%23dc2626" stroke="%23f87171" stroke-width="3"/><text x="180" y="195" fill="%23ffffff" font-size="28" font-weight="bold" text-anchor="middle" font-family="sans-serif">SOS EMERGENCY</text><text x="180" y="230" fill="%23fecaca" font-size="14" text-anchor="middle" font-family="sans-serif">Touch target: 120dp (WCAG AAA)</text><rect x="30" y="290" width="140" height="80" rx="16" fill="%231e293b" stroke="%2338bdf8" stroke-width="2"/><text x="100" y="335" fill="%2338bdf8" font-size="16" text-anchor="middle" font-family="sans-serif">Call Family</text><rect x="190" y="290" width="140" height="80" rx="16" fill="%231e293b" stroke="%2334d399" stroke-width="2"/><text x="260" y="335" fill="%2334d399" font-size="16" text-anchor="middle" font-family="sans-serif">Call Doctor</text></svg>',
    },
    {
      id: 'pill-tracker',
      title: 'Senior Pill Checklist Wireframe',
      desc: 'Whiteboard drawing for daily medicine checklist with big contrast boxes',
      dataUrl:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="360" height="640" viewBox="0 0 360 640" fill="%23f8fafc"><rect width="360" height="640" fill="%23020617"/><text x="180" y="60" fill="%23fbbf24" font-size="22" font-weight="bold" text-anchor="middle" font-family="sans-serif">Daily Medicine Log</text><rect x="24" y="100" width="312" height="70" rx="14" fill="%231e293b" stroke="%23fbbf24" stroke-width="2"/><text x="44" y="140" fill="%23ffffff" font-size="18" font-family="sans-serif">08:00 AM : Blood Pressure</text><circle cx="300" cy="135" r="16" fill="%2310b981"/><rect x="24" y="190" width="312" height="70" rx="14" fill="%231e293b" stroke="%2364748b" stroke-width="2"/><text x="44" y="230" fill="%23ffffff" font-size="18" font-family="sans-serif">12:30 PM : Calcium 1 Tab</text><circle cx="300" cy="225" r="16" fill="%23475569"/></svg>',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageMime(file.type || 'image/png');
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConvert = async () => {
    if (!selectedImage || loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/sketch-to-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: imageMime,
          targetFramework,
          instructions: customInstructions,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setGeneratedResult(data.result);

      // Extract code block and push to Right Canvas
      const codeMatch = data.result.match(/```(?:swift|kotlin|dart|tsx|jsx|javascript|typescript)?([\s\S]*?)```/);
      if (codeMatch && codeMatch[1]) {
        onPushToCanvas(codeMatch[1].trim());
      }
    } catch (err: any) {
      console.error('Conversion error:', err);
      alert('Error parsing sketch: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4">
      {/* Intro */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
        <h2 className="font-extrabold text-white text-base flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-indigo-400" />
          <span>Multimodal Vision & Sketch-to-Code (Gemini 4 Argon)</span>
        </h2>
        <p className="text-xs text-slate-400">
          Upload hand-sketched wireframes, whiteboard architectures, or mobile screenshots. Gemini 4 Argon parses layout geometry and produces native code with WCAG 2.1 AAA touch targets.
        </p>
      </div>

      {/* Preset Wireframes */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Quick Test Sample Wireframes:
        </span>
        <div className="grid grid-cols-2 gap-3">
          {sampleSketches.map((sample) => (
            <div
              key={sample.id}
              onClick={() => {
                setSelectedImage(sample.dataUrl);
                setImageMime('image/svg+xml');
              }}
              className={`p-3 bg-slate-900 border-2 rounded-xl cursor-pointer transition ${
                selectedImage === sample.dataUrl
                  ? 'border-indigo-500 bg-indigo-950/40 shadow-md'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-xs text-white">{sample.title}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{sample.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Zone */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
          Or Upload Hand-Sketch / Screenshot / ER-Diagram:
        </label>
        <div className="relative border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-6 text-center bg-slate-900/60 transition">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
          <span className="text-xs font-bold text-slate-300 block">
            Click to upload or drag & drop image
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            PNG, JPG, SVG, WebP wireframes up to 25MB
          </span>
        </div>
      </div>

      {/* Selected Image Preview */}
      {selectedImage && (
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={selectedImage}
              alt="Selected sketch"
              className="w-16 h-16 object-contain bg-slate-950 rounded-lg border border-slate-700"
            />
            <div>
              <span className="font-bold text-xs text-white block">Wireframe Loaded</span>
              <span className="text-[11px] text-emerald-400">Ready for Multimodal Vision Parsing</span>
            </div>
          </div>

          <button
            onClick={() => setSelectedImage(null)}
            className="text-xs text-rose-400 hover:text-rose-300 font-bold px-2 py-1"
          >
            Clear
          </button>
        </div>
      )}

      {/* Framework & Options */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1">Target Framework:</label>
          <select
            value={targetFramework}
            onChange={(e) => setTargetFramework(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 font-semibold focus:border-indigo-500 focus:outline-none"
          >
            <option value="swiftui">SwiftUI (iOS Clean Architecture)</option>
            <option value="compose">Jetpack Compose (Android MVI)</option>
            <option value="flutter">Flutter (Riverpod / Bloc)</option>
            <option value="react-native">React Native (TypeScript + Zustand)</option>
            <option value="react">React Mobile Web (Tailwind AAA)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1">Specific Instructions:</label>
          <input
            type="text"
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="e.g. Ensure 64x64dp buttons, add VoiceOver hints"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleConvert}
        disabled={!selectedImage || loading}
        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition text-sm"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span>{loading ? 'Synthesizing Clean Architecture Code...' : 'Convert Sketch to Production Code'}</span>
      </button>

      {/* Generated Code Result */}
      {generatedResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-xs text-indigo-300 flex items-center gap-1.5">
              <Code2 className="w-4 h-4" />
              <span>Generated {targetFramework.toUpperCase()} Architecture</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedResult);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg flex items-center gap-1 font-semibold text-slate-300"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => {
                  const match = generatedResult.match(/```(?:swift|kotlin|dart|tsx|jsx|javascript|typescript)?([\s\S]*?)```/);
                  if (match && match[1]) {
                    onPushToCanvas(match[1].trim());
                  }
                }}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-xs text-white rounded-lg font-bold flex items-center gap-1 shadow"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Hot-Reload to Phone</span>
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto whitespace-pre-wrap text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
            {generatedResult}
          </div>
        </div>
      )}
    </div>
  );
};
