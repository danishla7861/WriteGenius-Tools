import React from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, CheckCircle, ArrowRight, Sliders } from 'lucide-react';

export const ImageFormatGuidePage: React.FC = () => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto py-8">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111A2E] border border-slate-800 text-xs font-medium text-[#4776FF]">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Complete Technical Guide</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Web Image Formats Explained: PNG, JPG, WebP, SVG & AVIF
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Choose the right image format for your website, app, or design project to balance lightning-fast loading speeds, crystal-clear visual quality, and modern browser compatibility.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#4776FF]" />
          <span>Quick Format Comparison Matrix</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-4 font-semibold text-white">Format</th>
                <th className="py-3 px-4 font-semibold text-white">Best Use Cases</th>
                <th className="py-3 px-4 font-semibold text-white">Transparency</th>
                <th className="py-3 px-4 font-semibold text-white">Animation</th>
                <th className="py-3 px-4 font-semibold text-white">Compression</th>
                <th className="py-3 px-4 font-semibold text-white">Main Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-white">PNG</td>
                <td className="py-3 px-4">Transparent logos, icons, screenshots, lossless graphics</td>
                <td className="py-3 px-4 text-emerald-400 font-medium">Yes (Alpha)</td>
                <td className="py-3 px-4 text-rose-400">No</td>
                <td className="py-3 px-4">Lossless</td>
                <td className="py-3 px-4">Zero quality loss, crisp lines</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-white">JPG / JPEG</td>
                <td className="py-3 px-4">Photographs, complex color gradients, web hero banners</td>
                <td className="py-3 px-4 text-rose-400">No</td>
                <td className="py-3 px-4 text-rose-400">No</td>
                <td className="py-3 px-4">Lossy</td>
                <td className="py-3 px-4">Small file size for photos, universal support</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-white">WebP</td>
                <td className="py-3 px-4">Modern website graphics, photos, transparent UI assets</td>
                <td className="py-3 px-4 text-emerald-400 font-medium">Yes (Lossy/Lossless)</td>
                <td className="py-3 px-4 text-emerald-400">Yes</td>
                <td className="py-3 px-4">Both</td>
                <td className="py-3 px-4">25-35% smaller than PNG/JPG</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-white">SVG</td>
                <td className="py-3 px-4">Scalable vector logos, UI icons, simple illustrations</td>
                <td className="py-3 px-4 text-emerald-400 font-medium">Yes</td>
                <td className="py-3 px-4 text-emerald-400">Yes (CSS/SMIL)</td>
                <td className="py-3 px-4">Vector XML</td>
                <td className="py-3 px-4">Infinitely scalable without pixelation</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-white">AVIF</td>
                <td className="py-3 px-4">Ultra-high-efficiency modern web photographs</td>
                <td className="py-3 px-4 text-emerald-400 font-medium">Yes</td>
                <td className="py-3 px-4 text-emerald-400">Yes</td>
                <td className="py-3 px-4">Lossy/Lossless</td>
                <td className="py-3 px-4">Superior compression ratios</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-white">GIF</td>
                <td className="py-3 px-4">Short low-fidelity looping animations and memes</td>
                <td className="py-3 px-4 text-amber-400">Binary (1-bit)</td>
                <td className="py-3 px-4 text-emerald-400 font-medium">Yes</td>
                <td className="py-3 px-4">Lossless (256 colors)</td>
                <td className="py-3 px-4">Universal legacy animation playback</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Format Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-6 space-y-3 shadow-lg">
          <h3 className="text-lg font-bold text-white">1. PNG (Portable Network Graphics)</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            PNG is the gold standard for lossless raster graphics. It preserves every single pixel of original data without degradation.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Best for transparent logos, UI icons, and crisp screenshots.</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Full alpha transparency support.</li>
            <li className="flex items-center gap-2 text-rose-300"><span className="w-3.5 h-3.5 text-rose-400 text-center font-bold">✕</span> File sizes are significantly larger than JPEG or WebP for photographs.</li>
          </ul>
        </div>

        <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-6 space-y-3 shadow-lg">
          <h3 className="text-lg font-bold text-white">2. JPG / JPEG</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            JPEG utilizes lossy compression optimized for continuous-tone photographic images where minor color loss is imperceptible to the human eye.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Ideal for photographs and complex photo galleries.</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Highly efficient file sizes and universal browser compatibility.</li>
            <li className="flex items-center gap-2 text-rose-300"><span className="w-3.5 h-3.5 text-rose-400 text-center font-bold">✕</span> Does not support transparency (renders black or white background).</li>
          </ul>
        </div>

        <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-6 space-y-3 shadow-lg">
          <h3 className="text-lg font-bold text-white">3. WebP</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Developed by Google, WebP supports both lossy and lossless compression as well as transparency, often achieving 30% smaller file sizes than PNG or JPEG.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Superior compression for modern web pages.</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Supports animation and alpha transparency simultaneously.</li>
            <li className="flex items-center gap-2 text-slate-400">Older legacy systems may require JPEG/PNG fallback.</li>
          </ul>
        </div>

        <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-6 space-y-3 shadow-lg">
          <h3 className="text-lg font-bold text-white">4. SVG (Scalable Vector Graphics)</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            SVG is an XML-based vector image format. Instead of pixels, it stores mathematical paths, shapes, and curves.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Infinitely scalable to any screen resolution without blurring.</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Tiny file sizes for icons and vector logos.</li>
            <li className="flex items-center gap-2 text-rose-300"><span className="w-3.5 h-3.5 text-rose-400 text-center font-bold">✕</span> Unsuitable for complex photographic imagery.</li>
          </ul>
        </div>
      </div>

      {/* Decision Guide & FAQs */}
      <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-8 space-y-6 shadow-xl">
        <h2 className="text-xl font-bold text-white">Smart Format Decision Guide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
            <div className="font-semibold text-white">Transparent Brand Logo</div>
            <div className="text-slate-400">Use <strong className="text-[#4776FF]">PNG</strong> or <strong className="text-[#4776FF]">SVG</strong> for crystal-clear scalability.</div>
          </div>
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
            <div className="font-semibold text-white">Website Blog Photos & Banners</div>
            <div className="text-slate-400">Use <strong className="text-[#4776FF]">WebP</strong> or <strong className="text-[#4776FF]">AVIF</strong> for maximum loading speed.</div>
          </div>
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
            <div className="font-semibold text-white">Interface UI Screenshots</div>
            <div className="text-slate-400">Use <strong className="text-[#4776FF]">PNG</strong> to keep text razor-sharp without compression artifacts.</div>
          </div>
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
            <div className="font-semibold text-white">Short Animations</div>
            <div className="text-slate-400">Use <strong className="text-[#4776FF]">GIF</strong> or WebP animated loops.</div>
          </div>
        </div>
      </div>

      {/* Internal Tool Links */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-8 text-center space-y-6">
        <h2 className="text-2xl font-bold text-white">Ready to Optimize Your Images?</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Use our free, private browser-based image tools to resize, compress, crop, and convert formats instantly.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/tools/image/image-resizer"
            className="px-4 py-2.5 rounded-xl bg-[#4776FF] hover:bg-blue-600 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg"
          >
            <span>Image Resizer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/tools/image/image-compressor"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors border border-slate-700 flex items-center gap-2"
          >
            <span>Image Compressor</span>
          </Link>
          <Link
            to="/tools/image/image-format-converter"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors border border-slate-700 flex items-center gap-2"
          >
            <span>Format Converter</span>
          </Link>
          <Link
            to="/tools/image/jpg-to-png"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors border border-slate-700 flex items-center gap-2"
          >
            <span>JPG to PNG</span>
          </Link>
          <Link
            to="/tools/image/webp-converter"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors border border-slate-700 flex items-center gap-2"
          >
            <span>WebP Converter</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
