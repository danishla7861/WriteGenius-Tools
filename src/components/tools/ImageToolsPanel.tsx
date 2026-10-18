import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Download,
  RefreshCw,
  Sliders,
  Check,
  Maximize2,
  Minimize2,
  Crop,
  Layers,
  Info,
  RotateCw,
  Eye,
} from 'lucide-react';
import { ToolDefinition } from '../../types/tools';
import {
  ImageMetadata,
  getImageMetadata,
  resizeImage,
  compressImage,
  convertImageFormat,
  cropImage,
  calculateAspectRatio,
  PASSPORT_PRESETS,
  PassportPreset,
} from '../../utils/imageUtils';
import { recordToolUsage } from '../../utils/usageHistoryUtils';

interface ImageToolsPanelProps {
  tool: ToolDefinition;
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export const ImageToolsPanel: React.FC<ImageToolsPanelProps> = ({ tool, onShowToast }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [loading, setLoading] = useState(false);

  // Resize state
  const [targetWidth, setTargetWidth] = useState<number>(1200);
  const [targetHeight, setTargetHeight] = useState<number>(800);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [resizeQuality, setResizeQuality] = useState<number>(0.9);
  const [resizeFormat, setResizeFormat] = useState<string>('image/jpeg');

  // Compress state
  const [compressQuality, setCompressQuality] = useState<number>(0.75);
  const [compressResult, setCompressResult] = useState<{
    originalSize: number;
    newSize: number;
    savedPercent: number;
  } | null>(null);

  // Crop state
  const [cropPreset, setCropPreset] = useState<'free' | '1:1' | '16:9' | '4:3' | '9:16'>('1:1');
  const [cropX, setCropX] = useState<number>(0);
  const [cropY, setCropY] = useState<number>(0);
  const [cropW, setCropW] = useState<number>(400);
  const [cropH, setCropH] = useState<number>(400);

  // Format Converter state
  const [targetMime, setTargetMime] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/png');

  // Passport state
  const [selectedPresetId, setSelectedPresetId] = useState<string>('us-visa');
  const [passportZoom, setPassportZoom] = useState<number>(1);
  const [passportOffsetY, setPassportOffsetY] = useState<number>(0);

  // Aspect ratio calculator state
  const [calcW, setCalcW] = useState<number>(1920);
  const [calcH, setCalcH] = useState<number>(1080);
  const [scaledW, setScaledW] = useState<number>(1280);
  const [scaledH, setScaledH] = useState<number>(720);

  // Result output
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState<string>('edited-image.jpg');
  const [resultSize, setResultSize] = useState<number | null>(null);

  // When tool changes, reset states
  useEffect(() => {
    if (tool.slug === 'jpg-to-png') {
      setTargetMime('image/png');
    } else if (tool.slug === 'png-to-jpg') {
      setTargetMime('image/jpeg');
    } else if (tool.slug === 'webp-converter') {
      setTargetMime('image/webp');
    }
  }, [tool.slug]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const selected = e.target.files[0];
    setFile(selected);
    setResultUrl(null);
    setCompressResult(null);

    const objectUrl = URL.createObjectURL(selected);
    setPreviewUrl(objectUrl);

    try {
      const meta = await getImageMetadata(selected);
      setMetadata(meta);
      setTargetWidth(meta.width);
      setTargetHeight(meta.height);
      setCalcW(meta.width);
      setCalcH(meta.height);

      // Default crop box: centered square or 80% box
      const minDim = Math.min(meta.width, meta.height);
      const initialCrop = Math.round(minDim * 0.8);
      setCropW(initialCrop);
      setCropH(initialCrop);
      setCropX(Math.round((meta.width - initialCrop) / 2));
      setCropY(Math.round((meta.height - initialCrop) / 2));
    } catch (err: any) {
      console.error(err);
      onShowToast('Could not load image dimensions', 'error');
    }
  };

  const handleWidthChange = (w: number) => {
    setTargetWidth(w);
    if (lockAspectRatio && metadata && metadata.width > 0) {
      const ratio = metadata.height / metadata.width;
      setTargetHeight(Math.round(w * ratio));
    }
  };

  const handleHeightChange = (h: number) => {
    setTargetHeight(h);
    if (lockAspectRatio && metadata && metadata.height > 0) {
      const ratio = metadata.width / metadata.height;
      setTargetWidth(Math.round(h * ratio));
    }
  };

  const handleProcessResize = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await resizeImage(file, targetWidth, targetHeight, resizeFormat, resizeQuality);
      setResultUrl(res.url);
      setResultSize(res.size);
      const ext = resizeFormat === 'image/png' ? 'png' : resizeFormat === 'image/webp' ? 'webp' : 'jpg';
      setResultFileName(`resized-${targetWidth}x${targetHeight}.${ext}`);
      recordToolUsage(tool.slug, 'success');
      onShowToast('Image resized successfully!', 'success');
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to resize image', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessCompress = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await compressImage(file, compressQuality);
      setResultUrl(res.url);
      setResultSize(res.newSize);
      setCompressResult({
        originalSize: res.originalSize,
        newSize: res.newSize,
        savedPercent: res.savedPercent,
      });
      setResultFileName(`compressed-${file.name}`);
      recordToolUsage(tool.slug, 'success');
      onShowToast(`Image compressed! Reduced by ${res.savedPercent}%.`, 'success');
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to compress image', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessCrop = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await cropImage(file, cropX, cropY, cropW, cropH);
      setResultUrl(res.url);
      setResultSize(res.size);
      setResultFileName(`cropped-${file.name}`);
      recordToolUsage(tool.slug, 'success');
      onShowToast('Image cropped successfully!', 'success');
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to crop image', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessConvert = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await convertImageFormat(file, targetMime);
      setResultUrl(res.url);
      setResultSize(res.size);
      const ext = targetMime === 'image/png' ? 'png' : targetMime === 'image/webp' ? 'webp' : 'jpg';
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'image';
      setResultFileName(`${baseName}.${ext}`);
      recordToolUsage(tool.slug, 'success');
      onShowToast(`Converted to ${ext.toUpperCase()} successfully!`, 'success');
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to convert format', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPassport = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const preset = PASSPORT_PRESETS.find((p) => p.id === selectedPresetId) || PASSPORT_PRESETS[0];
      // Passport crop centered with offset
      const imgMeta = metadata || (await getImageMetadata(file));
      const targetAspect = preset.widthPx / preset.heightPx;
      let srcW = imgMeta.width / passportZoom;
      let srcH = srcW / targetAspect;

      if (srcH > imgMeta.height) {
        srcH = imgMeta.height / passportZoom;
        srcW = srcH * targetAspect;
      }

      const srcX = Math.max(0, Math.round((imgMeta.width - srcW) / 2));
      const srcY = Math.max(0, Math.min(imgMeta.height - srcH, Math.round((imgMeta.height - srcH) / 2 + passportOffsetY)));

      const cropped = await cropImage(file, srcX, srcY, Math.round(srcW), Math.round(srcH));
      const resized = await resizeImage(
        new File([cropped.blob], 'temp.jpg', { type: 'image/jpeg' }),
        preset.widthPx,
        preset.heightPx,
        'image/jpeg',
        0.98
      );

      setResultUrl(resized.url);
      setResultSize(resized.size);
      setResultFileName(`passport-${preset.id}-${preset.widthPx}x${preset.heightPx}.jpg`);
      recordToolUsage(tool.slug, 'success');
      onShowToast(`Passport photo prepared for ${preset.country}!`, 'success');
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to process passport photo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCalcScaleW = (newW: number) => {
    setScaledW(newW);
    if (calcW > 0) {
      setScaledH(Math.round(newW * (calcH / calcW)));
    }
  };

  const handleCalcScaleH = (newH: number) => {
    setScaledH(newH);
    if (calcH > 0) {
      setScaledW(Math.round(newH * (calcW / calcH)));
    }
  };

  return (
    <div className="space-y-8">
      {/* ---------------------------------------------------------------- */}
      {/* Upload Zone */}
      {/* ---------------------------------------------------------------- */}
      <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#F8FAFF]">
            Upload Image
          </span>
          <span className="text-xs text-[#4776FF] font-mono">
            100% Client-Side Privacy (Never leaves browser)
          </span>
        </div>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#263653] hover:border-indigo-500 dark:hover:border-indigo-500 rounded-xl p-8 cursor-pointer transition-colors bg-[#090F1D] group">
          <div className="w-12 h-12 rounded-full bg-[#111A2E] text-[#4776FF] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold text-[#F8FAFF] mt-3">
            {file ? file.name : 'Click to upload or drag & drop image'}
          </span>
          <span className="text-xs text-[#AAB8D0] mt-1">
            Supports JPG, PNG, WebP, GIF, BMP, SVG up to 50MB
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Image Preview & Quick Meta Bar */}
        {previewUrl && metadata && (
          <div className="pt-4 border-t border-[#263653]/80 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="relative rounded-lg overflow-hidden border border-[#263653] bg-[#090F1D] max-h-48 flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Source preview"
                className="max-h-48 max-w-full object-contain"
              />
            </div>
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#090F1D] border border-[#263653]">
                <span className="text-[#AAB8D0] block text-[11px]">Dimensions</span>
                <span className="font-mono font-semibold text-[#F8FAFF]">
                  {metadata.width} × {metadata.height} px
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#090F1D] border border-[#263653]">
                <span className="text-[#AAB8D0] block text-[11px]">Aspect Ratio</span>
                <span className="font-mono font-semibold text-[#F8FAFF]">
                  {metadata.aspectRatio}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#090F1D] border border-[#263653]">
                <span className="text-[#AAB8D0] block text-[11px]">File Size</span>
                <span className="font-mono font-semibold text-[#F8FAFF]">
                  {(metadata.sizeBytes / 1024).toFixed(1)} KB
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#090F1D] border border-[#263653]">
                <span className="text-[#AAB8D0] block text-[11px]">Format</span>
                <span className="font-mono font-semibold text-[#F8FAFF]">
                  {metadata.format}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Tool-Specific Controls */}
      {/* ---------------------------------------------------------------- */}

      {/* 1. Image Resizer */}
      {tool.slug === 'image-resizer' && (
        <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-[#F8FAFF] flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-[#4776FF]" />
            <span>Resize Dimensions & Format</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F8FAFF]">
                Target Width (px)
              </label>
              <input
                type="number"
                value={targetWidth}
                onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 0)}
                className="w-full p-2.5 text-xs rounded-lg bg-[#090F1D] border border-[#263653] text-[#F8FAFF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F8FAFF]">
                Target Height (px)
              </label>
              <input
                type="number"
                value={targetHeight}
                onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 0)}
                className="w-full p-2.5 text-xs rounded-lg bg-[#090F1D] border border-[#263653] text-[#F8FAFF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F8FAFF]">
                Export Format
              </label>
              <select
                value={resizeFormat}
                onChange={(e) => setResizeFormat(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg bg-[#090F1D] border border-[#263653] text-[#F8FAFF]"
              >
                <option value="image/jpeg">JPG / JPEG</option>
                <option value="image/png">PNG (Lossless)</option>
                <option value="image/webp">WebP (Modern)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#F8FAFF]">
              <input
                type="checkbox"
                checked={lockAspectRatio}
                onChange={(e) => setLockAspectRatio(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Lock Aspect Ratio</span>
            </label>
          </div>

          {/* Quick presets */}
          <div className="space-y-2 pt-2 border-t border-[#263653]">
            <span className="text-xs text-[#AAB8D0] font-medium">Quick Dimension Presets:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Full HD (1920×1080)', w: 1920, h: 1080 },
                { label: 'HD 720p (1280×720)', w: 1280, h: 720 },
                { label: 'Instagram (1080×1080)', w: 1080, h: 1080 },
                { label: 'X / Twitter (1200×675)', w: 1200, h: 675 },
                { label: 'Web standard (800×600)', w: 800, h: 600 },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setTargetWidth(p.w);
                    setTargetHeight(p.h);
                  }}
                  className="px-2.5 py-1 text-xs rounded-md bg-[#111A2E] text-[#F8FAFF] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#263653] flex justify-end">
            <button
              type="button"
              disabled={loading || !file}
              onClick={handleProcessResize}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 rounded-lg transition-colors shadow-xs disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Resize Image</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Image Compressor */}
      {tool.slug === 'image-compressor' && (
        <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-[#F8FAFF] flex items-center gap-2">
            <Minimize2 className="w-4 h-4 text-[#4776FF]" />
            <span>Compression & Quality Adjustment</span>
          </h2>

          <div className="space-y-2 max-w-md">
            <div className="flex justify-between text-xs font-semibold text-[#F8FAFF]">
              <span>Image Quality: {Math.round(compressQuality * 100)}%</span>
              <span className="text-[#AAB8D0] font-mono">
                {compressQuality <= 0.5 ? 'Maximum Compression' : compressQuality >= 0.85 ? 'High Fidelity' : 'Balanced'}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.95"
              step="0.05"
              value={compressQuality}
              onChange={(e) => setCompressQuality(parseFloat(e.target.value))}
              className="w-full accent-[#4776FF]"
            />
            <p className="text-[11px] text-[#AAB8D0]">
              Lower quality delivers smaller file size with minimal noticeable compression artifacts.
            </p>
          </div>

          {compressResult && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
              <span>
                Original: {(compressResult.originalSize / 1024).toFixed(1)} KB → Compressed:{' '}
                {(compressResult.newSize / 1024).toFixed(1)} KB
              </span>
              <span className="font-bold text-sm font-mono text-emerald-600 dark:text-emerald-400">
                {compressResult.savedPercent}% Space Saved
              </span>
            </div>
          )}

          <div className="pt-3 border-t border-[#263653] flex justify-end">
            <button
              type="button"
              disabled={loading || !file}
              onClick={handleProcessCompress}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 rounded-lg transition-colors shadow-xs disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Compress Image Now</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Image Cropper */}
      {tool.slug === 'image-cropper' && (
        <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-[#F8FAFF] flex items-center gap-2">
            <Crop className="w-4 h-4 text-[#4776FF]" />
            <span>Crop Area & Ratio</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {[
              { id: '1:1', label: '1:1 Square' },
              { id: '16:9', label: '16:9 Landscape' },
              { id: '4:3', label: '4:3 Standard' },
              { id: '9:16', label: '9:16 Vertical / Reel' },
              { id: 'free', label: 'Freeform' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setCropPreset(p.id as any);
                  if (metadata) {
                    if (p.id === '1:1') {
                      const s = Math.min(metadata.width, metadata.height);
                      setCropW(s);
                      setCropH(s);
                      setCropX(Math.round((metadata.width - s) / 2));
                      setCropY(Math.round((metadata.height - s) / 2));
                    } else if (p.id === '16:9') {
                      const w = metadata.width;
                      const h = Math.round(w * (9 / 16));
                      if (h <= metadata.height) {
                        setCropW(w);
                        setCropH(h);
                        setCropX(0);
                        setCropY(Math.round((metadata.height - h) / 2));
                      }
                    }
                  }
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  cropPreset === p.id
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-[#111A2E] text-[#F8FAFF] border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#F8FAFF]">X Offset (px)</label>
              <input
                type="number"
                value={cropX}
                onChange={(e) => setCropX(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full p-2 text-xs rounded-lg bg-[#090F1D] border border-[#263653]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-[#F8FAFF]">Y Offset (px)</label>
              <input
                type="number"
                value={cropY}
                onChange={(e) => setCropY(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full p-2 text-xs rounded-lg bg-[#090F1D] border border-[#263653]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-[#F8FAFF]">Crop Width (px)</label>
              <input
                type="number"
                value={cropW}
                onChange={(e) => setCropW(Math.max(10, parseInt(e.target.value, 10) || 10))}
                className="w-full p-2 text-xs rounded-lg bg-[#090F1D] border border-[#263653]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-[#F8FAFF]">Crop Height (px)</label>
              <input
                type="number"
                value={cropH}
                onChange={(e) => setCropH(Math.max(10, parseInt(e.target.value, 10) || 10))}
                className="w-full p-2 text-xs rounded-lg bg-[#090F1D] border border-[#263653]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#263653] flex justify-end">
            <button
              type="button"
              disabled={loading || !file}
              onClick={handleProcessCrop}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 rounded-lg transition-colors shadow-xs disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Crop className="w-4 h-4" />}
              <span>Crop & Save</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Format Converters (image-format-converter, jpg-to-png, png-to-jpg, webp-converter) */}
      {(tool.slug === 'image-format-converter' ||
        tool.slug === 'jpg-to-png' ||
        tool.slug === 'png-to-jpg' ||
        tool.slug === 'webp-converter') && (
        <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-[#F8FAFF] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#4776FF]" />
            <span>Format Conversion Settings</span>
          </h2>

          <div className="space-y-2 max-w-sm">
            <label className="text-xs font-semibold text-[#F8FAFF]">
              Target Output Format
            </label>
            <div className="flex gap-2">
              {[
                { id: 'image/png', label: 'PNG (Lossless)' },
                { id: 'image/jpeg', label: 'JPG / JPEG' },
                { id: 'image/webp', label: 'WebP (Next-Gen)' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setTargetMime(fmt.id as any)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                    targetMime === fmt.id
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-[#111A2E] text-[#F8FAFF] border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#263653] flex justify-end">
            <button
              type="button"
              disabled={loading || !file}
              onClick={handleProcessConvert}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 rounded-lg transition-colors shadow-xs disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Convert to {targetMime.replace('image/', '').toUpperCase()}</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Dimension Checker */}
      {tool.slug === 'image-dimension-checker' && metadata && (
        <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#F8FAFF] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#4776FF]" />
            <span>Detailed Image Metrics</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#090F1D] border border-[#263653]">
              <span className="text-[#AAB8D0] block text-[11px]">Resolution</span>
              <p className="text-base font-bold font-mono text-[#F8FAFF] mt-1">
                {metadata.width} × {metadata.height}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#090F1D] border border-[#263653]">
              <span className="text-[#AAB8D0] block text-[11px]">Megapixels</span>
              <p className="text-base font-bold font-mono text-[#4776FF] mt-1">
                {((metadata.width * metadata.height) / 1000000).toFixed(2)} MP
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#090F1D] border border-[#263653]">
              <span className="text-[#AAB8D0] block text-[11px]">Aspect Ratio</span>
              <p className="text-base font-bold font-mono text-[#F8FAFF] mt-1">
                {metadata.aspectRatio}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#090F1D] border border-[#263653]">
              <span className="text-[#AAB8D0] block text-[11px]">Print Size (300 DPI)</span>
              <p className="text-base font-bold font-mono text-[#F8FAFF] mt-1">
                {(metadata.width / 300).toFixed(1)}&quot; × {(metadata.height / 300).toFixed(1)}&quot;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. Aspect Ratio Calculator */}
      {tool.slug === 'aspect-ratio-calculator' && (
        <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-[#F8FAFF] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#4776FF]" />
            <span>Interactive Aspect Ratio Calculator</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3 p-4 rounded-xl bg-[#090F1D] border border-[#263653]">
              <span className="text-xs font-semibold text-[#F8FAFF]">
                1. Original Dimensions
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#AAB8D0]">Width</label>
                  <input
                    type="number"
                    value={calcW}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10) || 1;
                      setCalcW(v);
                      setScaledH(Math.round(scaledW * (calcH / v)));
                    }}
                    className="w-full p-2 text-xs rounded-lg bg-[#0D1424] border border-[#263653]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#AAB8D0]">Height</label>
                  <input
                    type="number"
                    value={calcH}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10) || 1;
                      setCalcH(v);
                      setScaledH(Math.round(scaledW * (v / calcW)));
                    }}
                    className="w-full p-2 text-xs rounded-lg bg-[#0D1424] border border-[#263653]"
                  />
                </div>
              </div>
              <div className="pt-2">
                <span className="text-xs text-[#AAB8D0]">Computed Ratio: </span>
                <span className="text-sm font-bold font-mono text-[#4776FF]">
                  {calculateAspectRatio(calcW, calcH)}
                </span>
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-[#090F1D] border border-[#263653]">
              <span className="text-xs font-semibold text-[#F8FAFF]">
                2. Calculate New Proportional Size
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#AAB8D0]">New Width</label>
                  <input
                    type="number"
                    value={scaledW}
                    onChange={(e) => handleCalcScaleW(parseInt(e.target.value, 10) || 1)}
                    className="w-full p-2 text-xs rounded-lg bg-[#0D1424] border border-[#263653]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#AAB8D0]">Proportional Height</label>
                  <input
                    type="number"
                    value={scaledH}
                    onChange={(e) => handleCalcScaleH(parseInt(e.target.value, 10) || 1)}
                    className="w-full p-2 text-xs rounded-lg bg-[#0D1424] border border-[#263653]"
                  />
                </div>
              </div>
              <p className="text-[11px] text-[#AAB8D0] pt-2">
                Adjust either width or height; the other dimension scales automatically to preserve ratio.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7. Passport Photo Resizer */}
      {tool.slug === 'passport-photo-resizer' && (
        <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-[#F8FAFF] flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#4776FF]" />
            <span>Official Country Passport & Visa Presets</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PASSPORT_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPresetId(p.id)}
                className={`p-3 text-left rounded-xl border transition-all ${
                  selectedPresetId === p.id
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-xs'
                    : 'border-[#263653] bg-[#090F1D] text-[#F8FAFF] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold block">{p.country}</span>
                <span className="text-[11px] text-[#AAB8D0] block mt-0.5">
                  {p.widthMm} × {p.heightMm} mm ({p.widthPx}×{p.heightPx} px)
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#F8FAFF]">
                Face Zoom: {passportZoom}x
              </label>
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.05"
                value={passportZoom}
                onChange={(e) => setPassportZoom(parseFloat(e.target.value))}
                className="w-full accent-[#4776FF]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#F8FAFF]">
                Vertical Chin / Eye Alignment (px)
              </label>
              <input
                type="range"
                min="-150"
                max="150"
                step="5"
                value={passportOffsetY}
                onChange={(e) => setPassportOffsetY(parseInt(e.target.value, 10))}
                className="w-full accent-[#4776FF]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#263653] flex justify-end">
            <button
              type="button"
              disabled={loading || !file}
              onClick={handleProcessPassport}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 rounded-lg transition-colors shadow-xs disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Generate Official Passport Photo</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Output / Download Bar */}
      {/* ---------------------------------------------------------------- */}
      {resultUrl && (
        <div className="p-5 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#263653] bg-[#090F1D] flex items-center justify-center shrink-0">
              <img src={resultUrl} alt="Result thumbnail" className="h-full w-full object-cover" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#F8FAFF] block">
                {resultFileName}
              </span>
              {resultSize && (
                <span className="text-[11px] text-[#AAB8D0] font-mono">
                  {(resultSize / 1024).toFixed(1)} KB
                </span>
              )}
            </div>
          </div>

          <a
            href={resultUrl}
            download={resultFileName}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Image</span>
          </a>
        </div>
      )}
    </div>
  );
};
