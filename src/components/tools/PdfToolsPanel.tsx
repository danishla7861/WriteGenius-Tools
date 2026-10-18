import React, { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  Download,
  RotateCw,
  Check,
  AlertCircle,
  Trash2,
  Plus,
  RefreshCw,
  Eye,
  Layers,
  Scissors,
  Minimize2,
  ZoomIn,
  ZoomOut,
  ExternalLink,
} from 'lucide-react';
import { ToolDefinition } from '../../types/tools';
import {
  mergePdfFiles,
  splitPdf,
  compressPdf,
  rotatePdfPages,
  extractPdfPages,
  removePdfPages,
  addPageNumbersToPdf,
  imagesToPdf,
  countPdfPages,
  pdfToImages,
} from '../../utils/pdfUtils';
import { recordToolUsage } from '../../utils/usageHistoryUtils';

interface PdfToolsPanelProps {
  tool: ToolDefinition;
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export const PdfToolsPanel: React.FC<PdfToolsPanelProps> = ({ tool, onShowToast }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState<string>('output.pdf');
  const [pageRange, setPageRange] = useState('1-3');
  const [rotationAngle, setRotationAngle] = useState(90);
  const [pagesToRemove, setPagesToRemove] = useState('2');
  const [pageNumberPosition, setPageNumberPosition] = useState<'bottom-center' | 'bottom-right'>('bottom-center');
  const [pdfMeta, setPdfMeta] = useState<{ pageCount: number; title?: string; sizeBytes: number } | null>(null);
  const [compressionStats, setCompressionStats] = useState<{ original: number; compressed: number; saved: number } | null>(null);
  const [renderedImages, setRenderedImages] = useState<{ dataUrl: string; pageNum: number; width: number; height: number }[]>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    if (selected.length === 0) return;

    setFiles(selected);
    setResultUrl(null);
    setCompressionStats(null);
    setRenderedImages([]);

    // Create object URL for input preview
    if (selected[0] && selected[0].type === 'application/pdf') {
      const url = URL.createObjectURL(selected[0]);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    // Read metadata
    if (selected[0] && selected[0].type === 'application/pdf') {
      try {
        const meta = await countPdfPages(selected[0]);
        setPdfMeta(meta);
      } catch {
        // Soft fallback
        setPdfMeta({
          pageCount: 1,
          sizeBytes: selected[0].size,
          title: selected[0].name,
        });
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    if (updated.length === 0) {
      setPreviewUrl(null);
      setResultUrl(null);
      setPdfMeta(null);
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      onShowToast('Please select at least one file to process.', 'error');
      return;
    }

    setLoading(true);
    try {
      let outputData: Uint8Array | null = null;
      let downloadName = 'output.pdf';

      switch (tool.slug) {
        case 'merge-pdf': {
          if (files.length < 2) {
            onShowToast('Please select at least 2 PDF files to merge.', 'error');
            setLoading(false);
            return;
          }
          outputData = await mergePdfFiles(files);
          downloadName = 'merged-document.pdf';
          break;
        }

        case 'split-pdf': {
          const splitResults = await splitPdf(files[0], pageRange);
          if (splitResults.length > 0) {
            outputData = splitResults[0].data;
            downloadName = `${splitResults[0].label}.pdf`;
          }
          break;
        }

        case 'compress-pdf': {
          const res = await compressPdf(files[0]);
          outputData = res.data;
          downloadName = `compressed-${files[0].name}`;
          setCompressionStats({
            original: res.originalSize,
            compressed: res.newSize,
            saved: res.savedPercent,
          });
          break;
        }

        case 'pdf-to-images': {
          const imgs = await pdfToImages(files[0]);
          setRenderedImages(imgs);
          recordToolUsage(tool.slug, 'success');
          onShowToast(`Extracted ${imgs.length} high-resolution page images!`, 'success');
          setLoading(false);
          return;
        }

        case 'rotate-pdf': {
          outputData = await rotatePdfPages(files[0], rotationAngle);
          downloadName = `rotated-${files[0].name}`;
          break;
        }

        case 'extract-pdf-pages': {
          const pages = pageRange
            .split(',')
            .map((p) => parseInt(p.trim(), 10))
            .filter((p) => !isNaN(p));
          outputData = await extractPdfPages(files[0], pages);
          downloadName = `extracted-pages.pdf`;
          break;
        }

        case 'remove-pdf-pages': {
          const removeList = pagesToRemove
            .split(',')
            .map((p) => parseInt(p.trim(), 10))
            .filter((p) => !isNaN(p));
          outputData = await removePdfPages(files[0], removeList);
          downloadName = `trimmed-${files[0].name}`;
          break;
        }

        case 'add-pdf-page-numbers': {
          outputData = await addPageNumbersToPdf(files[0], pageNumberPosition);
          downloadName = `numbered-${files[0].name}`;
          break;
        }

        case 'images-to-pdf': {
          outputData = await imagesToPdf(files);
          downloadName = 'converted-images.pdf';
          break;
        }

        default:
          outputData = await files[0].arrayBuffer().then((buf) => new Uint8Array(buf));
      }

      if (outputData) {
        const blob = new Blob([outputData as unknown as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setResultUrl(url);
        setResultFileName(downloadName);
        recordToolUsage(tool.slug, 'success');
        onShowToast('PDF processed successfully! Real preview generated.', 'success');
      }
    } catch (err: any) {
      console.error(err);
      onShowToast(err?.message || 'Failed to process PDF', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isMultiFile = tool.slug === 'merge-pdf' || tool.slug === 'images-to-pdf';
  const acceptedTypes = tool.slug === 'images-to-pdf' ? 'image/jpeg,image/png,image/webp' : 'application/pdf';

  return (
    <div className="space-y-6">
      {/* Main Grid: Upload & Controls on Left, Real Document Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Upload & Configuration Controls */}
        <div className="lg:col-span-6 space-y-5">
          {/* Upload Card */}
          <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#F8FAFF]">
                {isMultiFile ? 'Select or Drop Multiple Documents' : 'Upload PDF Document'}
              </span>
              <span className="text-[11px] text-emerald-400 font-mono px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-800">
                100% Private (Client-Side)
              </span>
            </div>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#263653] hover:border-[#4776FF] rounded-xl p-8 cursor-pointer transition-colors bg-[#090F1D] group">
              <div className="w-12 h-12 rounded-2xl bg-[#111A2E] text-[#4776FF] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#263653]">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-[#F8FAFF] mt-3">
                Click to upload or drag & drop
              </span>
              <span className="text-xs text-[#AAB8D0] mt-1">
                {tool.slug === 'images-to-pdf'
                  ? 'Supports JPG, PNG, and WebP images'
                  : 'Standard PDF files up to 50MB (processed in memory)'}
              </span>
              <input
                type="file"
                multiple={isMultiFile}
                accept={acceptedTypes}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Selected Files List with Metadata */}
            {files.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#263653]">
                <div className="flex items-center justify-between text-xs text-[#AAB8D0]">
                  <span>Selected ({files.length} {files.length === 1 ? 'file' : 'files'}):</span>
                  {pdfMeta && <span>{pdfMeta.pageCount} total pages detected</span>}
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#090F1D] border border-[#263653] text-xs text-[#F8FAFF]"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-[#4776FF] shrink-0" />
                        <span className="truncate">{f.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[#AAB8D0] font-mono text-[11px]">
                          {(f.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(i)}
                          className="p-1 text-[#AAB8D0] hover:text-rose-400 transition-colors"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tool-specific Settings */}
            {tool.slug === 'split-pdf' && (
              <div className="space-y-1.5 pt-2 border-t border-[#263653]">
                <label className="text-xs font-semibold text-[#F8FAFF]">Page Range to Extract</label>
                <input
                  type="text"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder="e.g. 1-3, 5 or all"
                  className="w-full p-2.5 text-xs rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF] focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
                />
                <span className="text-[11px] text-[#AAB8D0] block">
                  Format: &quot;1-3, 5&quot; extracts pages 1 through 3 and page 5.
                </span>
              </div>
            )}

            {tool.slug === 'rotate-pdf' && (
              <div className="space-y-1.5 pt-2 border-t border-[#263653]">
                <label className="text-xs font-semibold text-[#F8FAFF]">Clockwise Rotation Angle</label>
                <div className="grid grid-cols-3 gap-2">
                  {[90, 180, 270].map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => setRotationAngle(deg)}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                        rotationAngle === deg
                          ? 'bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white border-transparent shadow-md'
                          : 'bg-[#090F1D] text-[#AAB8D0] border-[#263653] hover:text-[#F8FAFF] hover:bg-[#111A2E]'
                      }`}
                    >
                      Rotate {deg}°
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tool.slug === 'remove-pdf-pages' && (
              <div className="space-y-1.5 pt-2 border-t border-[#263653]">
                <label className="text-xs font-semibold text-[#F8FAFF]">Pages to Remove</label>
                <input
                  type="text"
                  value={pagesToRemove}
                  onChange={(e) => setPagesToRemove(e.target.value)}
                  placeholder="e.g. 2, 4, 7"
                  className="w-full p-2.5 text-xs rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF] focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
                />
                <span className="text-[11px] text-[#AAB8D0] block">
                  Enter comma-separated page numbers to exclude from output.
                </span>
              </div>
            )}

            {tool.slug === 'add-pdf-page-numbers' && (
              <div className="space-y-1.5 pt-2 border-t border-[#263653]">
                <label className="text-xs font-semibold text-[#F8FAFF]">Page Number Alignment</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'bottom-center', label: 'Bottom Center' },
                    { id: 'bottom-right', label: 'Bottom Right' },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => setPageNumberPosition(pos.id as any)}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                        pageNumberPosition === pos.id
                          ? 'bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white border-transparent shadow-md'
                          : 'bg-[#090F1D] text-[#AAB8D0] border-[#263653] hover:text-[#F8FAFF] hover:bg-[#111A2E]'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Execute Process Button */}
            {tool.slug !== 'pdf-page-counter' && (
              <div className="pt-3 border-t border-[#263653] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setFiles([]);
                    setPreviewUrl(null);
                    setResultUrl(null);
                    setPdfMeta(null);
                    setCompressionStats(null);
                    setRenderedImages([]);
                  }}
                  className="px-3 py-2 text-xs font-medium text-[#AAB8D0] hover:text-[#F8FAFF] hover:bg-[#111A2E] rounded-xl transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  disabled={loading || files.length === 0}
                  onClick={handleProcess}
                  className={`flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 rounded-xl transition-all shadow-lg ${
                    loading || files.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing in Memory...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Execute {tool.title}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Compression Stats Card */}
          {compressionStats && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center justify-between shadow-xl">
              <span className="font-medium">
                Optimized: Reduced from {(compressionStats.original / 1024).toFixed(1)} KB to{' '}
                {(compressionStats.compressed / 1024).toFixed(1)} KB
              </span>
              <span className="font-bold font-mono px-2 py-0.5 rounded-md bg-emerald-900/60 border border-emerald-700">
                {compressionStats.saved}% Saved
              </span>
            </div>
          )}

          {/* Metadata Card for Page Counter */}
          {tool.slug === 'pdf-page-counter' && pdfMeta && (
            <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-[#F8FAFF] uppercase tracking-wider">Document Anatomy</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653]">
                  <span className="text-[#AAB8D0] block text-[11px]">Total Page Count</span>
                  <p className="text-2xl font-bold font-mono text-[#4776FF] mt-1">
                    {pdfMeta.pageCount} Pages
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653]">
                  <span className="text-[#AAB8D0] block text-[11px]">Memory Footprint</span>
                  <p className="text-base font-bold font-mono text-[#F8FAFF] mt-1">
                    {(pdfMeta.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Document Preview Workspace */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#263653]">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#4776FF]" />
                <span className="text-xs font-bold text-[#F8FAFF] tracking-wide uppercase">
                  {resultUrl ? 'Processed Document Preview' : 'Document Viewer Preview'}
                </span>
              </div>

              {/* Zoom & Direct Open Controls */}
              {(resultUrl || previewUrl) && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.max(60, prev - 20))}
                    className="p-1.5 text-[#AAB8D0] hover:text-[#F8FAFF] rounded-lg hover:bg-[#111A2E] transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-[#AAB8D0] px-1">{zoomLevel}%</span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.min(160, prev + 20))}
                    className="p-1.5 text-[#AAB8D0] hover:text-[#F8FAFF] rounded-lg hover:bg-[#111A2E] transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={resultUrl || previewUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-[#AAB8D0] hover:text-[#4776FF] rounded-lg hover:bg-[#111A2E] transition-colors ml-1"
                    title="Open document in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Document Viewer Canvas / Object Container */}
            <div className="rounded-xl overflow-hidden bg-[#090F1D] border border-[#263653] min-h-[460px] flex flex-col items-center justify-center p-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
                  <div className="w-8 h-8 border-2 border-[#4776FF] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-[#F8FAFF] font-medium">Processing document streams...</p>
                  <p className="text-[11px] text-[#AAB8D0]">Running WebAssembly byte transformations locally</p>
                </div>
              ) : resultUrl || previewUrl ? (
                <div
                  className="w-full flex-1 flex flex-col items-center justify-center transition-all duration-150"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                >
                  <object
                    data={resultUrl || previewUrl || undefined}
                    type="application/pdf"
                    className="w-full h-[480px] rounded-lg border border-[#263653] bg-white"
                  >
                    <div className="p-8 text-center text-xs text-[#AAB8D0] space-y-3">
                      <FileText className="w-10 h-10 mx-auto text-[#4776FF]" />
                      <p className="text-[#F8FAFF] font-semibold">Embedded PDF Display</p>
                      <p>Your browser is currently protecting iframe rendering.</p>
                      <a
                        href={resultUrl || previewUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#4776FF] rounded-xl hover:bg-[#3461e0] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Open Document in Viewer Tab</span>
                      </a>
                    </div>
                  </object>
                </div>
              ) : (
                <div className="p-8 text-center space-y-3 max-w-sm">
                  <div className="w-12 h-12 rounded-2xl bg-[#111A2E] text-[#4776FF] flex items-center justify-center mx-auto border border-[#263653]">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-[#F8FAFF] uppercase tracking-wider">
                    Interactive PDF Preview
                  </h4>
                  <p className="text-xs text-[#AAB8D0] leading-relaxed">
                    Upload a PDF document on the left to inspect pages, verify formatting, and preview real-time results before downloading.
                  </p>
                </div>
              )}
            </div>

            {/* Download Action Footer */}
            {resultUrl && (
              <div className="p-4 rounded-xl bg-[#111A2E] border border-emerald-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 truncate">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-medium text-[#F8FAFF] truncate">
                    Ready: {resultFileName}
                  </span>
                </div>
                <a
                  href={resultUrl}
                  download={resultFileName}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 rounded-xl transition-all shadow-lg shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Result</span>
                </a>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Rendered Images Grid for pdf-to-images */}
      {renderedImages.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#263653]">
            <h3 className="text-xs font-bold text-[#F8FAFF] uppercase tracking-wider">
              Exported Pages ({renderedImages.length} High-Res Images)
            </h3>
            <span className="text-xs text-[#AAB8D0] font-mono">300 DPI Rendering Quality</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderedImages.map((img) => (
              <div
                key={img.pageNum}
                className="p-3 rounded-xl border border-[#263653] bg-[#090F1D] space-y-2.5"
              >
                <div className="rounded-lg overflow-hidden border border-[#263653] bg-white flex items-center justify-center h-48">
                  <img
                    src={img.dataUrl}
                    alt={`Page ${img.pageNum}`}
                    className="max-h-48 max-w-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-semibold text-[#F8FAFF]">
                    Page {img.pageNum}
                  </span>
                  <a
                    href={img.dataUrl}
                    download={`page-${img.pageNum}.jpg`}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-[#4776FF] hover:bg-[#3461e0] rounded-lg transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Save JPG</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
