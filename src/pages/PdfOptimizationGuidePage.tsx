import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldCheck, ArrowRight, CheckCircle2, Home, ChevronRight, Layers, Lock, Cpu } from 'lucide-react';
import { updateDocumentSeo } from '../utils/seoUtils';

export const PdfOptimizationGuidePage: React.FC = () => {
  useEffect(() => {
    updateDocumentSeo({
      title: 'In-Browser PDF Compression & Merging: Complete Technical Guide',
      description: 'Learn how client-side WebAssembly allows you to merge, split, and compress confidential PDF documents without uploading data to external servers.',
      canonicalPath: '/guides/pdf-optimization-guide',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Guides', url: '/guides' },
        { name: 'PDF Optimization Guide', url: '/guides/pdf-optimization-guide' },
      ],
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Complete Guide to In-Browser PDF Compression, Merging & Document Privacy',
        description: 'How modern WebAssembly executes PDF manipulation in local browser memory with zero cloud security risks.',
        author: {
          '@type': 'Organization',
          name: 'WriteGenius Tools Editorial Team',
        },
      },
    });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="space-y-10 max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <section className="p-8 sm:p-10 rounded-3xl bg-[#0D1424] border border-[#263653] shadow-2xl space-y-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#AAB8D0]">
          <Link to="/" className="flex items-center gap-1 hover:text-[#F8FAFF] transition-colors">
            <Home className="w-3.5 h-3.5 text-[#4776FF]" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#263653]" />
          <Link to="/guides" className="hover:text-[#F8FAFF] transition-colors">
            Guides
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#263653]" />
          <span className="text-[#F8FAFF] font-medium" aria-current="page">
            PDF Optimization Guide
          </span>
        </nav>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111A2E] border border-[#263653] text-xs font-semibold text-[#4776FF]">
            <FileText className="w-3.5 h-3.5" />
            <span>Document Architecture & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFF] tracking-tight">
            In-Browser PDF Compression, Merging & Document Security
          </h1>
          <p className="text-sm sm:text-base text-[#AAB8D0] leading-relaxed">
            Understand how modern client-side PDF processing eliminates the security risks of uploading confidential tax records, financial ledgers, and signed contracts to third-party servers.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="space-y-8 text-sm text-[#AAB8D0] leading-relaxed">
        
        {/* Section 1 */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-[#F8FAFF]">
            1. The Problem with Cloud-Based PDF Converters
          </h2>
          <p>
            Traditional free PDF converter sites require you to upload your files to their backend servers. While convenient, this architecture presents significant data security and compliance liabilities. When you upload a loan agreement, medical history summary, or corporate NDA, your data passes through unknown proxies, gets cached on external hard drives, and may even be retained indefinitely.
          </p>
          <p>
            Compliance standards such as HIPAA, GDPR, and CCPA strictly regulate how Personally Identifiable Information (PII) is transmitted. Relying on anonymous cloud conversion tools introduces severe vulnerability vectors.
          </p>
        </section>

        {/* Section 2 */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-[#F8FAFF]">
            2. How WebAssembly & Client-Side PDF Processing Works
          </h2>
          <p>
            At WriteGenius Tools, our PDF utilities run on a fundamentally different paradigm. Using <strong>pdf-lib</strong> compiled to high-speed client-side JavaScript and WebAssembly, all document manipulation takes place strictly inside your browser\'s local RAM.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] space-y-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xs font-bold text-[#F8FAFF]">Zero Server Uploads</h3>
              <p className="text-xs">Your documents never travel across a network wire. They remain in local device memory.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] space-y-2">
              <Cpu className="w-5 h-5 text-[#4776FF]" />
              <h3 className="text-xs font-bold text-[#F8FAFF]">Instant Latency</h3>
              <p className="text-xs">Processing is bounded only by your CPU speed, avoiding upload/download queue delays.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] space-y-2">
              <Layers className="w-5 h-5 text-[#8957FF]" />
              <h3 className="text-xs font-bold text-[#F8FAFF]">Lossless Streams</h3>
              <p className="text-xs">Direct manipulation of PDF content streams preserves exact vector typography and hyperlinks.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Recommended Tools Callout */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-[#F8FAFF]">
            3. Recommended Private PDF Utilities
          </h2>
          <p>
            You can utilize our suite of client-side PDF utilities directly in your browser with no account setup:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <Link
              to="/tools/merge-pdf"
              className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] hover:border-[#4776FF] transition-all group"
            >
              <h3 className="text-xs font-bold text-[#F8FAFF] group-hover:text-[#4776FF]">Merge PDF Files</h3>
              <p className="text-[11px] text-[#AAB8D0] mt-1">Combine multiple PDFs into one unified document.</p>
            </Link>
            <Link
              to="/tools/compress-pdf"
              className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] hover:border-[#4776FF] transition-all group"
            >
              <h3 className="text-xs font-bold text-[#F8FAFF] group-hover:text-[#4776FF]">Compress PDF</h3>
              <p className="text-[11px] text-[#AAB8D0] mt-1">Reduce PDF byte sizes for email attachments.</p>
            </Link>
            <Link
              to="/tools/split-pdf"
              className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] hover:border-[#4776FF] transition-all group"
            >
              <h3 className="text-xs font-bold text-[#F8FAFF] group-hover:text-[#4776FF]">Split PDF Pages</h3>
              <p className="text-[11px] text-[#AAB8D0] mt-1">Extract specific page ranges into separate files.</p>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};
