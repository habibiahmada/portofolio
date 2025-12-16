"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import CertificatePreview from "../certifications/certificatepreview"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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
}

/* ================= COMPONENT ================= */

export default function CertificateForm({
  mode,
  initialData,
  certificateId,
}: Props) {
  /* ---------- main fields ---------- */
  const [issuer, setIssuer] = useState("")
  const [year, setYear] = useState("")

  /* ---------- PDF handling ---------- */
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string>("")

  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const locale = useLocale() || "en"
  const router = useRouter()

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

    const toastId = toast.loading("Uploading PDF...")
    setUploading(true)

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const res = await fetch("/api/upload/certificate", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Failed to upload PDF")

      const data: { url: string } = await res.json()

      setUploadedUrl(data.url)
      setPreviewUrl(data.url)
      setSelectedFile(null)

      toast.success("PDF uploaded successfully", { id: toastId })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Upload error"
      toast.error(message, { id: toastId })
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

    const toastId = toast.loading("Saving...")
    setSubmitting(true)

    const payload = {
      issuer,
      year: Number(year),
      preview: uploadedUrl,
      translations: translations.map(t => ({
        language: locale,
        title: t.title,
        description: t.description,
        skills: t.skills
          .split(",")
          .map(s => s.trim())
          .filter(Boolean),
      })),
    }

    try {
      const res = await fetch(
        mode === "create"
          ? "/api/certificates"
          : `/api/certificates/${certificateId}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) {
        const errData: { error?: string } = await res.json()
        throw new Error(errData.error || "Failed to save certificate")
      }

      toast.success("Certificate saved successfully", { id: toastId })
      router.push("/dashboard/certificates")
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Submit error"
      toast.error(message, { id: toastId })
    } finally {
      setSubmitting(false)
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
          <Button onClick={uploadPdf} disabled={uploading}>
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
        >
          {mode === "create"
            ? "Create Certificate"
            : "Update Certificate"}
        </Button>
      </div>

      {/* RIGHT */}
      <div>
        {previewUrl ? (
          <CertificatePreview file={previewUrl} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Select PDF to preview
          </p>
        )}
      </div>
    </div>
  )
}