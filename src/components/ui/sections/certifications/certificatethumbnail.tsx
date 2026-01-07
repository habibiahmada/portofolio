"use client";

import dynamic from "next/dynamic";

const PdfThumbnailClient = dynamic(
  () => import("./pdfthumbnailclient"),
  { ssr: false }
);

export default function CertificateThumbnail({ file }: { file: string }) {
  return <PdfThumbnailClient file={file} />;
}
