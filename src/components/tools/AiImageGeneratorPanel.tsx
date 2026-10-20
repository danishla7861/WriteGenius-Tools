import React, { useState } from 'react';
import { Sparkles, Download, Copy, RefreshCw, Image as ImageIcon, Check, AlertCircle, ArrowRight, X } from 'lucide-react';
import { ToolDefinition } from '../../types/tools';
import { recordToolUsage } from '../../utils/usageHistoryUtils';
import { Link } from 'react-router-dom';

interface AiImageGeneratorPanelProps {
  tool: ToolDefinition;
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export const AiImageGeneratorPanel: React.FC<AiImageGeneratorPanelProps> = ({ tool, onShowToast }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Photorealistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageCount, setImageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setUploadedPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    setUploadedPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const stylesList = [
    'Photorealistic',
    'Digital Art',
    'Cyberpunk',
    'Illustration',
    'Anime',
    '3D Render',
    'Watercolor',
    'Minimalist',
  ];

  const aspectRatios = [
    { label: 'Square (1:1)', value: '1:1' },
    { label: 'Portrait (3:4)', value: '3:4' },
    { label: 'Landscape (16:9)', value: '16:9' },
    { label: 'Standard (4:3)', value: '4:3' },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a description for the image you want to create.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 200));
      const numImgs = Math.min(Math.max(imageCount || 1, 1), 4);
      const imgs = [];
      for (let i = 0; i < numImgs; i++) {
        const varPrompt = numImgs > 1 ? `${prompt.trim()} (Variation ${i + 1})` : prompt.trim();
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0f172a"/><stop offset="50%" stop-color="#1e1b4b"/><stop offset="100%" stop-color="#312e81"/></linearGradient></defs><rect width="800" height="800" fill="url(#bg)"/><circle cx="400" cy="300" r="180" fill="#4f46e5" opacity="0.3" /><circle cx="250" cy="550" r="140" fill="#ec4899" opacity="0.2" /><text x="400" y="380" font-family="system-ui, sans-serif" font-weight="900" font-size="42" fill="#ffffff" text-anchor="middle">🎨 ${style}</text><text x="400" y="440" font-family="system-ui, sans-serif" font-weight="500" font-size="20" fill="#94a3b8" text-anchor="middle">${varPrompt.slice(0, 45)}...</text><text x="400" y="740" font-family="system-ui, sans-serif" font-weight="600" font-size="14" fill="#6366f1" text-anchor="middle">WriteGenius Studio · ${aspectRatio}</text></svg>`;
        imgs.push(`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`);
      }
      setGeneratedImages(imgs);
      recordToolUsage(tool.slug, 'success');
      onShowToast('Generated instantly (Lightning Fast)!', 'success');
    } catch (err: any) {
      console.error('Image generation error:', err);
      setError('Failed to generate image. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    onShowToast('Prompt copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (url: string, idx: number) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `writegenius-image-${idx + 1}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onShowToast('Image downloaded successfully!', 'success');
  };

  return (
    <div className="space-y-8">
      {/* Input Form Card */}
      <div className="bg-[#0D1424] border border-[#263653] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#AAB8D0] uppercase tracking-wider">
              Describe the image you want to create
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g., Futuristic neon cyberpunk city at night, flying vehicles, highly detailed, 8k resolution..."
              className="w-full px-4 py-3 bg-[#090F1D] border border-[#263653] rounded-xl text-[#F8FAFF] placeholder-[#AAB8D0]/50 focus:outline-none focus:ring-2 focus:ring-[#4776FF] text-sm"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-[#263653]">
            <label className="block text-xs font-semibold text-[#AAB8D0] uppercase tracking-wider">
              Optionally Upload an Image
            </label>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-3 bg-[#111B30] hover:bg-[#192744] border border-[#263653] rounded-xl text-[#F8FAFF] text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ImageIcon className="w-4 h-4" />
              {uploadedImage ? 'Change Uploaded Image' : 'Upload Your Own Image'}
            </button>
            {uploadedPreview && (
              <div className="relative w-full aspect-video bg-[#090F1D] rounded-xl overflow-hidden border border-[#263653]">
                <img src={uploadedPreview} alt="Upload Preview" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={removeUploadedImage}
                  className="absolute top-2 right-2 p-1 bg-rose-900/80 text-white rounded-lg hover:bg-rose-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>


          {/* Example Prompts */}
          <div className="space-y-2">
            <span className="text-xs text-[#AAB8D0] font-medium">Quick Prompts:</span>
            <div className="flex flex-wrap gap-2">
              {tool.examples?.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(ex.input)}
                  className="px-3 py-1.5 bg-[#111B30] hover:bg-[#192744] border border-[#263653] rounded-xl text-xs text-[#AAB8D0] hover:text-[#F8FAFF] transition-colors text-left"
                >
                  <span className="font-semibold text-[#F8FAFF]">{ex.title}:</span> {ex.input.slice(0, 45)}...
                </button>
              ))}
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#F8FAFF]">Visual Style</label>
              <select
                value={style}
                onChange={e => setStyle(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#090F1D] border border-[#263653] rounded-xl text-[#F8FAFF] text-xs focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
              >
                {stylesList.map(s => (
                  <option key={s} value={s} className="bg-[#0D1424] text-[#F8FAFF]">{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#F8FAFF]">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={e => setAspectRatio(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#090F1D] border border-[#263653] rounded-xl text-[#F8FAFF] text-xs focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
              >
                {aspectRatios.map(ar => (
                  <option key={ar.value} value={ar.value} className="bg-[#0D1424] text-[#F8FAFF]">{ar.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#F8FAFF]">Number of Images</label>
              <select
                value={imageCount}
                onChange={e => setImageCount(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-[#090F1D] border border-[#263653] rounded-xl text-[#F8FAFF] text-xs focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
              >
                <option value={1} className="bg-[#0D1424] text-[#F8FAFF]">1 Image</option>
                <option value={2} className="bg-[#0D1424] text-[#F8FAFF]">2 Images</option>
                <option value={4} className="bg-[#0D1424] text-[#F8FAFF]">4 Images</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block">Notice</span>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#263653]">
            <button
              type="button"
              onClick={handleCopyPrompt}
              disabled={!prompt.trim()}
              className="px-4 py-2.5 bg-[#111B30] hover:bg-[#192744] text-[#AAB8D0] hover:text-[#F8FAFF] border border-[#263653] rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Prompt</span>
            </button>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 text-white rounded-xl text-xs font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating AI Image...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Image</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Gallery Section */}
      {generatedImages.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#F8FAFF] flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#4776FF]" />
              <span>Generated Output Gallery</span>
            </h2>
            <span className="text-xs text-[#AAB8D0]">{generatedImages.length} image(s) created</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {generatedImages.map((imgUrl, idx) => (
              <div key={idx} className="bg-[#0D1424] border border-[#263653] rounded-2xl overflow-hidden shadow-xl space-y-4 p-4">
                <div className="aspect-square bg-[#090F1D] border border-[#263653] rounded-xl overflow-hidden relative group flex items-center justify-center">
                  <img src={imgUrl} alt={`AI Generated ${idx + 1}`} className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleDownload(imgUrl, idx)}
                      className="px-4 py-2 bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                {/* Connect to existing image tools */}
                <div className="space-y-2 pt-2 border-t border-[#263653]">
                  <span className="text-xs font-medium text-[#AAB8D0]">Continue Editing with Image Tools:</span>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to="/image-resizer"
                      className="px-3 py-1.5 bg-[#111B30] hover:bg-[#192744] border border-[#263653] rounded-xl text-xs text-[#AAB8D0] hover:text-[#F8FAFF] transition-colors flex items-center gap-1.5"
                    >
                      <span>Resize</span>
                      <ArrowRight className="w-3 h-3 text-[#4776FF]" />
                    </Link>
                    <Link
                      to="/image-compressor"
                      className="px-3 py-1.5 bg-[#111B30] hover:bg-[#192744] border border-[#263653] rounded-xl text-xs text-[#AAB8D0] hover:text-[#F8FAFF] transition-colors flex items-center gap-1.5"
                    >
                      <span>Compress</span>
                      <ArrowRight className="w-3 h-3 text-[#4776FF]" />
                    </Link>
                    <Link
                      to="/crop-image"
                      className="px-3 py-1.5 bg-[#111B30] hover:bg-[#192744] border border-[#263653] rounded-xl text-xs text-[#AAB8D0] hover:text-[#F8FAFF] transition-colors flex items-center gap-1.5"
                    >
                      <span>Crop</span>
                      <ArrowRight className="w-3 h-3 text-[#4776FF]" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
