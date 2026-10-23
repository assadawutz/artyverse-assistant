import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Video,
  Music,
  Download,
  Play,
  Layers,
  Sliders,
  Loader2,
  CheckCircle,
} from 'lucide-react';

export const GenMediaTab: React.FC = () => {
  // Image State
  const [imagePrompt, setImagePrompt] = useState(
    'A premium 3D isometric mobile app icon of a glowing red medical heart with a gold shield, clean glassmorphism rounded square background, 1024x1024, vibrant senior healthcare aesthetic'
  );
  const [imageAspectRatio, setImageAspectRatio] = useState('1:1');
  const [imageResolution, setImageResolution] = useState('1K');
  const [imageModel, setImageModel] = useState('gemini-nano-banana-2.1');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  // Video State (Veo 3)
  const [videoPrompt, setVideoPrompt] = useState(
    'A cinematic vertical 9:16 mobile app demonstration showcasing an elderly person smiling gently as their healthcare smartwatch alerts emergency dispatch in Bangkok'
  );
  const [videoAspectRatio, setVideoAspectRatio] = useState('9:16');
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoOperationName, setVideoOperationName] = useState<string | null>(null);
  const [videoStatusText, setVideoStatusText] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  // Music State (Lyria)
  const [musicPrompt, setMusicPrompt] = useState(
    'A calm, uplifting Thai acoustic guitar and soft traditional xylophone melody for elderly meditation, gentle and peaceful'
  );
  const [musicModel, setMusicModel] = useState('lyria-3-clip-preview');
  const [musicLoading, setMusicLoading] = useState(false);
  const [generatedMusicUrl, setGeneratedMusicUrl] = useState<string | null>(null);
  const [generatedLyrics, setGeneratedLyrics] = useState<string | null>(null);

  // 1. Generate Image (Nano Banana 2.1 / Pro Image)
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || imageLoading) return;
    setImageLoading(true);

    try {
      const res = await fetch('/api/image-gen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          aspectRatio: imageAspectRatio,
          imageSize: imageResolution,
          model: imageModel,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setGeneratedImageUrl(data.imageUrl);
    } catch (err: any) {
      console.error('Image gen error:', err);
      alert('Failed to generate image: ' + err.message);
    } finally {
      setImageLoading(false);
    }
  };

  // 2. Generate Video (Veo 3)
  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim() || videoLoading) return;
    setVideoLoading(true);
    setVideoStatusText('Initiating Veo 3 video render...');

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          aspectRatio: videoAspectRatio,
          resolution: '720p',
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const opName = data.operationName;
      setVideoOperationName(opName);
      setVideoStatusText('Veo 3 video rendering in progress. Polling status...');

      // Polling loop
      let done = false;
      let attempts = 0;
      while (!done && attempts < 40) {
        await new Promise((r) => setTimeout(r, 7000));
        attempts++;
        setVideoStatusText(`Synthesizing frames... (${attempts * 7}s elapsed)`);

        const statusRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName: opName }),
        });
        const statusData = await statusRes.json();
        if (statusData.done) {
          done = true;
          setVideoStatusText('Video render complete! Downloading stream...');

          const downloadRes = await fetch('/api/video-download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operationName: opName }),
          });

          const blob = await downloadRes.blob();
          const videoBlobUrl = URL.createObjectURL(blob);
          setGeneratedVideoUrl(videoBlobUrl);
          setVideoStatusText('Ready to watch!');
          break;
        }
      }
    } catch (err: any) {
      console.error('Video error:', err);
      setVideoStatusText('Video error: ' + err.message);
    } finally {
      setVideoLoading(false);
    }
  };

  // 3. Generate Music (Lyria)
  const handleGenerateMusic = async () => {
    if (!musicPrompt.trim() || musicLoading) return;
    setMusicLoading(true);

    try {
      const res = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: musicPrompt,
          model: musicModel,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setGeneratedMusicUrl(data.audioUrl);
      setGeneratedLyrics(data.lyrics || null);
    } catch (err: any) {
      console.error('Music error:', err);
      alert('Failed to generate music: ' + err.message);
    } finally {
      setMusicLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-5">
      {/* SECTION 1: 3D App Icon & Asset Generation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">
                3D App Icon & UI Asset Studio (Gemini Nano Banana 2.1)
              </h2>
              <p className="text-[11px] text-slate-400">
                Generate 1024x1024 store icons, onboarding banners, and UI illustrations
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono">
            {imageModel}
          </span>
        </div>

        {/* Prompt */}
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1">Asset Prompt:</label>
          <textarea
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            rows={2}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none"
          />
        </div>

        {/* Configurations: Aspect Ratio & Resolution */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Aspect Ratio:</label>
            <select
              value={imageAspectRatio}
              onChange={(e) => setImageAspectRatio(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
            >
              <option value="1:1">1:1 (App Icon / Square)</option>
              <option value="9:16">9:16 (Mobile Fullscreen)</option>
              <option value="16:9">16:9 (Landscape Banner)</option>
              <option value="3:4">3:4 (Portrait Card)</option>
              <option value="4:3">4:3 (Standard Banner)</option>
              <option value="21:9">21:9 (Ultrawide Hero)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Resolution:</label>
            <select
              value={imageResolution}
              onChange={(e) => setImageResolution(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
            >
              <option value="1K">1K (1024 x 1024)</option>
              <option value="2K">2K (High-Res Retina)</option>
              <option value="4K">4K (Ultra HD Studio)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Model Engine:</label>
            <select
              value={imageModel}
              onChange={(e) => setImageModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
            >
              <option value="gemini-nano-banana-2.1">Nano Banana 2.1</option>
              <option value="gemini-3-pro-image">Gemini 3 Pro Image</option>
              <option value="gemini-3.1-flash-lite-image">3.1 Flash Lite Image</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateImage}
          disabled={imageLoading || !imagePrompt.trim()}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{imageLoading ? 'Generating High-Quality Image...' : 'Generate App Asset'}</span>
        </button>

        {generatedImageUrl && (
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
            <img
              src={generatedImageUrl}
              alt="Generated asset"
              className="w-24 h-24 object-contain rounded-lg border border-slate-700 bg-black"
            />
            <div className="flex-1">
              <span className="text-xs font-bold text-white block">Asset Ready</span>
              <span className="text-[11px] text-emerald-400 block mt-0.5">
                {imageResolution} • {imageAspectRatio}
              </span>
            </div>
            <a
              href={generatedImageUrl}
              download="artyverse-app-asset.png"
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center gap-1 text-xs font-bold"
            >
              <Download className="w-4 h-4" />
              <span>Save</span>
            </a>
          </div>
        )}
      </div>

      {/* SECTION 2: Veo 3 Video Generator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">Veo 3 Video Generator</h2>
              <p className="text-[11px] text-slate-400">
                Generate 9:16 vertical walkthrough trailers or 16:9 cinematic promos
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-mono">
            veo-3.1-lite
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1">Video Scene Description:</label>
          <textarea
            value={videoPrompt}
            onChange={(e) => setVideoPrompt(e.target.value)}
            rows={2}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-rose-500 focus:outline-none resize-none"
          />
        </div>

        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Aspect Ratio:</span>
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setVideoAspectRatio('9:16')}
                className={`px-3 py-1 rounded font-bold transition ${
                  videoAspectRatio === '9:16' ? 'bg-rose-600 text-white' : 'text-slate-400'
                }`}
              >
                9:16 (Vertical)
              </button>
              <button
                onClick={() => setVideoAspectRatio('16:9')}
                className={`px-3 py-1 rounded font-bold transition ${
                  videoAspectRatio === '16:9' ? 'bg-rose-600 text-white' : 'text-slate-400'
                }`}
              >
                16:9 (Landscape)
              </button>
            </div>
          </div>

          <button
            onClick={handleGenerateVideo}
            disabled={videoLoading || !videoPrompt.trim()}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>{videoLoading ? 'Rendering Video...' : 'Generate Veo Video'}</span>
          </button>
        </div>

        {videoStatusText && (
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
            {videoLoading && <Loader2 className="w-4 h-4 text-rose-400 animate-spin" />}
            <span>{videoStatusText}</span>
          </div>
        )}

        {generatedVideoUrl && (
          <div className="space-y-2">
            <video
              src={generatedVideoUrl}
              controls
              className="w-full max-h-64 bg-black rounded-xl border border-slate-800"
            />
            <a
              href={generatedVideoUrl}
              download="artyverse-promo.mp4"
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Video (.mp4)</span>
            </a>
          </div>
        )}
      </div>

      {/* SECTION 3: Lyria Music Generation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">Lyria Music Studio</h2>
              <p className="text-[11px] text-slate-400">
                Generate 30s UI audio clips or full ambient tracks
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono">
            {musicModel}
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1">Music Prompt:</label>
          <input
            type="text"
            value={musicPrompt}
            onChange={(e) => setMusicPrompt(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Track Length:</span>
            <select
              value={musicModel}
              onChange={(e) => setMusicModel(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-slate-200"
            >
              <option value="lyria-3-clip-preview">Short Clip (30 seconds)</option>
              <option value="lyria-3-pro-preview">Full-Length Track</option>
            </select>
          </div>

          <button
            onClick={handleGenerateMusic}
            disabled={musicLoading || !musicPrompt.trim()}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>{musicLoading ? 'Synthesizing Audio Stream...' : 'Generate Lyria Track'}</span>
          </button>
        </div>

        {generatedMusicUrl && (
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <audio src={generatedMusicUrl} controls className="w-full h-10" />
            {generatedLyrics && (
              <p className="text-xs text-slate-300 italic">Lyrics: {generatedLyrics}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
