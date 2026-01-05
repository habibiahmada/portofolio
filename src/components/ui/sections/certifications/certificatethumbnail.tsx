'use client';

import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface Props {
  file: string;
}

export default function CertificateThumbnail({ file }: Props) {
  if (!file) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800">
        <span className="text-sm text-slate-500">
          No Preview
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <Document file={file} loading={null}>
        <Page
          pageNumber={1}
          width={280}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
}