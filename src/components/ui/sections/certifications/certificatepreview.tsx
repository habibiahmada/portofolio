"use client";

import dynamic from "next/dynamic";

const PdfPreviewClient = dynamic(
  () => import("./pdfpreviewclient"),
  { ssr: false }
);

interface Props {
  fileUrl: string;
  active: boolean;
}

export default function CertificatePreview({ fileUrl, active }: Props) {
  if (!active) return null;
  return <PdfPreviewClient fileUrl={fileUrl} />;
}
