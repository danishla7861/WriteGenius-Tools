import React, { useState } from 'react';
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

interface PdfToolsPanelProps {
  tool: ToolDefinition;
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export const PdfToolsPanel: React.FC<PdfToolsPanelProps> = ({ tool, onShowToast }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState<string>('output.pdf');
  const [pageRange, setPageRange] = useState('1-3');
  const [rotationAngle, setRotationAngle] = useState(90);
  const [pagesToRemove, setPagesToRemove] = useState('2');
  const [pageNumberPosition, setPageNumberPosition] = useState<'bottom-center' | 'bottom-right'>('bottom-center');
  const [pdfMeta, setPdfMeta] = useState<{ pageCount: number; title?: string; sizeBytes: number } | null>(null);
  const [compressionStats, setCompressionStats] = useState<{ original: number; compressed: number; saved: number } | null>(null);
  const [renderedImages, setRenderedImages] = useState<{ dataUrl: string; pageNum: number; width: number; height: number }[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setResultUrl(null);
    setCompressionStats(null);
    setRenderedImages([]);

    // If PDF page counter, immediately count
    if (tool.slug === 'pdf-page-counter' && selected[0]) {
      try {
        const meta = await countPdfPages(selected[0]);
        setPdfMeta(meta);
      } catch (err) {
        onShowToast('Could not parse PDF metadata', 'error');
      }
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      onShowToast('Please select at least one file.', 'error');
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
          onShowToast(`Rendered ${imgs.length} pages as high-resolution images!`, 'success');
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
        onShowToast('PDF processed successfully! Ready for download.', 'success');
      }
    } catch (err: any) {
      console.error(err);
      onShowToast(err?.message || 'Failed to process PDF', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isMultiFile = tool.slug === 'merge-pdf' || tool.slug === 'images-to-pdf';
  const acceptedTypes = tool.slug === 'images-to-pdf' ? 'image/jpeg,image/png' : 'application/pdf';

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {isMultiFile ? 'Select or Drop Multiple Files' : 'Select or Drop PDF File'}
          </span>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">
            100% Client-Side Privacy (Never uploaded to remote server)
          </span>
        </div>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl p-8 cursor-pointer transition-colors bg-slate-50/60 dark:bg-slate-950/40 group">
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-200 mt-3">
            Click to upload or drag & drop
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {tool.slug === 'images-to-pdf' ? 'Supports JPG, PNG images' : 'Supports standard PDF files up to 50MB'}
          </span>
          <input
            type="file"
            multiple={isMultiFile}
            accept={acceptedTypes}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Selected Files List */}
        {files.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Selected ({files.length} {files.length === 1 ? 'file' : 'files'}):
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="truncate">{f.name}</span>
                  </div>
                  <span className="text-slate-400 font-mono shrink-0 ml-2">
                    {(f.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tool-specific Options */}
        {tool.slug === 'split-pdf' && (
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Page Range to Extract</label>
            <input
              type="text"
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              placeholder="e.g. 1-3, 5 or all"
              className="w-full p-2.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-[11px] text-slate-500">
              Specify single pages or comma-separated ranges (e.g. &quot;1-2, 4&quot; or &quot;all&quot;).
            </span>
          </div>
        )}

        {tool.slug === 'rotate-pdf' && (
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Clockwise Rotation Angle</label>
            <div className="flex gap-2">
              {[90, 180, 270].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => setRotationAngle(deg)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg border transition-colors ${
                    rotationAngle === deg
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Rotate {deg}°
                </button>
              ))}
            </div>
          </div>
        )}

        {tool.slug === 'remove-pdf-pages' && (
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pages to Delete</label>
            <input
              type="text"
              value={pagesToRemove}
              onChange={(e) => setPagesToRemove(e.target.value)}
              placeholder="e.g. 2, 4, 7"
              className="w-full p-2.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-[11px] text-slate-500">
              Enter page numbers to exclude from the final PDF.
            </span>
          </div>
        )}

        {tool.slug === 'add-pdf-page-numbers' && (
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Page Number Alignment</label>
            <div className="flex gap-2">
              {[
                { id: 'bottom-center', label: 'Bottom Center' },
                { id: 'bottom-right', label: 'Bottom Right' },
              ].map((pos) => (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() => setPageNumberPosition(pos.id as any)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg border transition-colors ${
                    pageNumberPosition === pos.id
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Process Button */}
        {tool.slug !== 'pdf-page-counter' && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              disabled={loading || files.length === 0}
              onClick={handleProcess}
              className={`flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs ${
                loading || files.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing in Browser...</span>
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

      {/* Metadata Card for PDF Page Counter */}
      {tool.slug === 'pdf-page-counter' && pdfMeta && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">PDF Document Analysis</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block text-[11px]">Total Page Count</span>
              <p className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                {pdfMeta.pageCount} Pages
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block text-[11px]">File Size</span>
              <p className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
                {(pdfMeta.sizeBytes / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block text-[11px]">Document Title</span>
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-1 truncate">
                {pdfMeta.title || 'Untitled Document'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Compression Summary */}
      {compressionStats && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
          <span>
            Optimized: Reduced from {(compressionStats.original / 1024).toFixed(1)} KB to{' '}
            {(compressionStats.compressed / 1024).toFixed(1)} KB ({compressionStats.saved}% saved)
          </span>
        </div>
      )}

      {/* Rendered Images for pdf-to-images */}
      {renderedImages.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Exported Pages ({renderedImages.length} Images)
            </h3>
            <span className="text-xs text-slate-500 font-mono">High Resolution (300 DPI equivalent)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderedImages.map((img) => (
              <div
                key={img.pageNum}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-2"
              >
                <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center h-48">
                  <img src={img.dataUrl} alt={`Page ${img.pageNum}`} className="max-h-48 max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Page {img.pageNum}
                  </span>
                  <a
                    href={img.dataUrl}
                    download={`page-${img.pageNum}.jpg`}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save JPG</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Download Action Area */}
      {resultUrl && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Ready: {resultFileName}
            </span>
          </div>
          <a
            href={resultUrl}
            download={resultFileName}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </a>
        </div>
      )}
    </div>
  );
};
