import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

/**
 * Merges multiple PDF files into one combined PDF document.
 */
export async function mergePdfFiles(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

/**
 * Splits a PDF document by specified page ranges or into individual pages.
 * Page ranges string format: e.g. "1-3, 5, 7-10" or "all"
 */
export async function splitPdf(
  file: File,
  pageRangeStr: string
): Promise<{ data: Uint8Array; label: string }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(arrayBuffer);
  const totalPages = srcPdf.getPageCount();

  const results: { data: Uint8Array; label: string }[] = [];

  if (pageRangeStr.trim().toLowerCase() === 'all' || !pageRangeStr.trim()) {
    // Split into every single page
    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(srcPdf, [i]);
      newPdf.addPage(copiedPage);
      const data = await newPdf.save();
      results.push({ data, label: `page-${i + 1}` });
    }
  } else {
    // Parse range e.g. "1-2, 4"
    const parts = pageRangeStr.split(',').map((p) => p.trim());
    let partIndex = 1;

    for (const part of parts) {
      const pageIndices: number[] = [];
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map((s) => parseInt(s.trim(), 10));
        const start = Math.max(1, startStr || 1);
        const end = Math.min(totalPages, endStr || totalPages);
        for (let p = start; p <= end; p++) {
          pageIndices.push(p - 1);
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p >= 1 && p <= totalPages) {
          pageIndices.push(p - 1);
        }
      }

      if (pageIndices.length > 0) {
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
        copiedPages.forEach((cp) => newPdf.addPage(cp));
        const data = await newPdf.save();
        results.push({ data, label: `part-${partIndex}_pages-${part}` });
        partIndex++;
      }
    }
  }

  return results;
}

/**
 * Rotates all pages in a PDF document by 90, 180, or 270 degrees.
 */
export async function rotatePdfPages(file: File, rotationAngle: number = 90): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();

  pages.forEach((page) => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + rotationAngle) % 360));
  });

  return await pdfDoc.save();
}

/**
 * Extracts specific pages from a PDF.
 */
export async function extractPdfPages(file: File, pageNumbers: number[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  const total = srcPdf.getPageCount();

  const validIndices = pageNumbers
    .filter((p) => p >= 1 && p <= total)
    .map((p) => p - 1);

  const copiedPages = await newPdf.copyPages(srcPdf, validIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

/**
 * Removes selected pages from a PDF.
 */
export async function removePdfPages(file: File, pageNumbersToRemove: number[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  const total = srcPdf.getPageCount();

  const toRemoveSet = new Set(pageNumbersToRemove);
  const keepIndices: number[] = [];

  for (let i = 1; i <= total; i++) {
    if (!toRemoveSet.has(i)) {
      keepIndices.push(i - 1);
    }
  }

  if (keepIndices.length === 0) {
    throw new Error('Cannot remove all pages from PDF. At least one page must remain.');
  }

  const copiedPages = await newPdf.copyPages(srcPdf, keepIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

/**
 * Adds page numbering (e.g. "Page 1 of 5") to all pages of a PDF.
 */
export async function addPageNumbersToPdf(
  file: File,
  position: 'bottom-center' | 'bottom-right' = 'bottom-center'
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const total = pages.length;

  pages.forEach((page, index) => {
    const { width } = page.getSize();
    const text = `Page ${index + 1} of ${total}`;
    const textSize = 10;
    const textWidth = font.widthOfTextAtSize(text, textSize);

    let x = (width - textWidth) / 2;
    if (position === 'bottom-right') {
      x = width - textWidth - 40;
    }

    page.drawText(text, {
      x,
      y: 25,
      size: textSize,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });
  });

  return await pdfDoc.save();
}

/**
 * Converts multiple image files (JPG, PNG) into a single PDF document.
 */
export async function imagesToPdf(imageFiles: File[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (const imgFile of imageFiles) {
    const arrayBuffer = await imgFile.arrayBuffer();
    let embeddedImage;

    if (imgFile.type.includes('png')) {
      embeddedImage = await pdfDoc.embedPng(arrayBuffer);
    } else {
      embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
    }

    const { width, height } = embeddedImage.scale(1);
    // Standard A4 aspect or exact image size
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  return await pdfDoc.save();
}

/**
 * Reads metadata and counts pages of a PDF file.
 */
export async function countPdfPages(
  file: File
): Promise<{ pageCount: number; title?: string; author?: string; sizeBytes: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  return {
    pageCount: pdfDoc.getPageCount(),
    title: pdfDoc.getTitle(),
    author: pdfDoc.getAuthor(),
    sizeBytes: file.size,
  };
}

/**
 * Compresses PDF by rebuilding object streams and removing unreferenced dictionary metadata.
 */
export async function compressPdf(
  file: File
): Promise<{ data: Uint8Array; originalSize: number; newSize: number; savedPercent: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const data = await pdfDoc.save({ useObjectStreams: true });
  const originalSize = file.size;
  const newSize = data.byteLength;
  const savedPercent = Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100));

  return {
    data,
    originalSize,
    newSize,
    savedPercent,
  };
}

/**
 * Converts all pages of a PDF document into high-resolution JPG images.
 */
export async function pdfToImages(
  file: File,
  scale: number = 1.5
): Promise<{ dataUrl: string; pageNum: number; width: number; height: number }[]> {
  const pdfjsLib = await import('pdfjs-dist');
  if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  const results: { dataUrl: string; pageNum: number; width: number; height: number }[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // @ts-expect-error pdfjs typing compatibility
      await page.render({ canvasContext: ctx, viewport }).promise;
      results.push({
        dataUrl: canvas.toDataURL('image/jpeg', 0.92),
        pageNum: i,
        width: Math.round(viewport.width),
        height: Math.round(viewport.height),
      });
    }
  }

  return results;
}
