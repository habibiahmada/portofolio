"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import CertificatePreview from "../../certifications/certificatepreview"

import { toast } from "sonner"
import useCertificateActions from "@/hooks/api/admin/certificates/useCertificateActions"

/* ================= TYPES ================= */

interface CertificateTranslationForm {
  title: string
  description: string
  skills: string
}

interface CertificateTranslation {
  title?: string
  description?: string
  skills?: string[]
}

interface CertificateInitialData {
  issuer?: string
  year?: number
  preview?: string
  certification_translations?: CertificateTranslation[]
}

interface Props {
  mode: "create" | "edit"
  initialData?: CertificateInitialData
  certificateId?: string
  onSuccess?: () => void
}

/* ================= COMPONENT ================= */

export default function CertificateForm({
  mode,
  initialData,
  certificateId,
  onSuccess,
}: Props) {
  /* ---------- main fields ---------- */
  const [issuer, setIssuer] = useState("")
  const [year, setYear] = useState("")

  /* ---------- PDF handling ---------- */
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string>("")

  const [uploading, setUploading] = useState(false)


  // Hooks
  const { createCertificate, updateCertificate, uploadFile, submitting } = useCertificateActions(onSuccess);

  /* ---------- translations ---------- */
  const [translations, setTranslations] = useState<
    CertificateTranslationForm[]
  >([{ title: "", description: "", skills: "" }])

  /* ---------- hydrate edit mode ---------- */
  useEffect(() => {
    if (!initialData) return

    setIssuer(initialData.issuer ?? "")
    setYear(String(initialData.year ?? ""))
    setUploadedUrl(initialData.preview ?? "")
    setPreviewUrl(initialData.preview ?? "")

    if (Array.isArray(initialData.certification_translations)) {
      setTranslations(
        initialData.certification_translations.map(t => ({
          title: t.title ?? "",
          description: t.description ?? "",
          skills: (t.skills ?? []).join(", "),
        }))
      )
    }
  }, [initialData])

  /* ---------- file select ---------- */
  function handleFileChange(file: File) {
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  /* ---------- upload PDF ---------- */
  async function uploadPdf() {
    if (!selectedFile) return

    setUploading(true)
    try {
      const url = await uploadFile(selectedFile);
      setUploadedUrl(url)
      setPreviewUrl(url)
      setSelectedFile(null)
    } catch {
      // Handled in hook
    } finally {
      setUploading(false)
    }
  }

  /* ---------- submit ---------- */
  async function handleSubmit() {
    if (mode === "edit" && !certificateId) {
      toast.error("Certificate ID tidak ditemukan")
      return
    }

    if (!uploadedUrl) {
      toast.error("Upload PDF terlebih dahulu")
      return
    }

    const payload = {
      issuer,
      year,
      preview: uploadedUrl,
      title: translations[0].title,
      description: translations[0].description,
      skills: translations[0].skills
        .split(",")
        .map(s => s.trim())
        .filter(Boolean),
    }

    if (mode === "edit" && certificateId) {
      await updateCertificate(certificateId, payload);
    } else {
      await createCertificate(payload);
    }
  }

  /* ---------- helpers ---------- */
  function updateTranslation(
    index: number,
    field: keyof CertificateTranslationForm,
    value: string
  ) {
    setTranslations(prev =>
      prev.map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      )
    )
  }

  /* ================= UI ================= */

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* LEFT */}
      <div className="space-y-6">
        <Input
          placeholder="Issuer"
          value={issuer}
          onChange={e => setIssuer(e.target.value)}
        />

        <Input
          placeholder="Year"
          value={year}
          onChange={e => setYear(e.target.value)}
        />

        <Input
          type="file"
          accept="application/pdf"
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) handleFileChange(file)
          }}
        />

        {selectedFile && (
          <Button onClick={uploadPdf} disabled={uploading} aria-label="Upload PDF">
            {uploading ? "Uploading..." : "Upload PDF"}
          </Button>
        )}

        <Input
          placeholder="Title"
          value={translations[0].title}
          onChange={e =>
            updateTranslation(0, "title", e.target.value)
          }
        />

        <Textarea
          placeholder="Description"
          value={translations[0].description}
          onChange={e =>
            updateTranslation(0, "description", e.target.value)
          }
        />

        <Input
          placeholder="Skills (comma separated)"
          value={translations[0].skills}
          onChange={e =>
            updateTranslation(0, "skills", e.target.value)
          }
        />

        <Button
          onClick={handleSubmit}
          disabled={submitting || !uploadedUrl}
          aria-label="Submit certificate"
        >
          {mode === "create"
            ? "Create Certificate"
            : "Update Certificate"}
        </Button>
      </div>

      {/* RIGHT */}
      <div>
        {previewUrl ? (
          <CertificatePreview fileUrl={previewUrl} active={true} onClose={() => setPreviewUrl(null)} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Select PDF to preview
          </p>
        )}
      </div>
    </div>
  )
}