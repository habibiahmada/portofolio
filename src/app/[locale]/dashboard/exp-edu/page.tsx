"use client"

import { useCallback, useEffect, useState } from "react"
import { useLocale } from "next-intl"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  ExperienceFormModal,
  ExperienceForm,
} from "@/components/ui/sections/admin/experienceformmodal"
import {
  Briefcase,
  GraduationCap,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react"

/* ================= TYPES ================= */

type ExperienceItem = {
  id: string
  type: "experience" | "education"
  company: string
  location: string
  start_date: string | null
  end_date: string | null
  skills: string[]
  title: string
  description: string
  location_type: string
  highlight: string
}

type ExperienceTranslationAPI = {
  title?: string
  description?: string
  location_type?: string
  highlight?: string
}

type ExperienceAPI = {
  id: string
  type: "experience" | "education"
  company: string
  location: string
  start_date: string | null
  end_date: string | null
  skills?: string[]
  experience_translations?: ExperienceTranslationAPI[]
}


type FilterType = "all" | "experience" | "education"
type ModalMode = "create" | "edit" | "view" | null

/* ================= PAGE ================= */

export default function Page() {
  const locale = useLocale()

  const emptyForm: ExperienceForm = {
    type: "experience",
    company: "",
    location: "",
    start_date: "",
    end_date: "",
    skills: "",
    title: "",
    description: "",
    location_type: "",
    highlight: "",
  }

  const [data, setData] = useState<ExperienceItem[]>([])
  const [form, setForm] = useState<ExperienceForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [filter, setFilter] = useState<FilterType>("all")
  const [loading, setLoading] = useState(false)

  /* ================= API ================= */

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/experiences?lang=${locale}`)
      const json: { data?: ExperienceAPI[] } = await res.json()

      setData(
        (json.data ?? []).map((item) => {
          const t = item.experience_translations?.[0]
          return {
            id: item.id,
            type: item.type,
            company: item.company,
            location: item.location,
            start_date: item.start_date,
            end_date: item.end_date,
            skills: item.skills ?? [],
            title: t?.title ?? "",
            description: t?.description ?? "",
            location_type: t?.location_type ?? "",
            highlight: t?.highlight ?? "",
          }
        })
      )
    } catch {
      toast.error("Gagal mengambil data")
    } finally {
      setLoading(false)
    }
  }, [locale])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const submit = async () => {
    setLoading(true)

    const method = editingId ? "PUT" : "POST"
    const url = editingId
      ? `/api/experiences/${editingId}`
      : "/api/experiences"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          language: locale,
          skills: form.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      })

      if (!res.ok) throw new Error()

      toast.success("Data tersimpan")
      closeModal()
      fetchData()
    } catch {
      toast.error("Gagal menyimpan data")
    } finally {
      setLoading(false)
    }
  }

  const deleteData = async (id: string) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return

    setLoading(true)
    try {
      const res = await fetch(`/api/experiences/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()

      toast.success("Data terhapus")
      fetchData()
    } catch {
      toast.error("Gagal menghapus data")
      setLoading(false)
    }
  }

  /* ================= MODAL CONTROL ================= */

  const openCreate = () => {
    setForm(emptyForm)
    setEditingId(null)
    setModalMode("create")
  }

  const openEdit = (item: ExperienceItem) => {
    setEditingId(item.id)
    setForm({
      ...item,
      skills: item.skills.join(", "),
      start_date: item.start_date ?? "",
      end_date: item.end_date ?? "",
    })
    setModalMode("edit")
  }

  const openView = (item: ExperienceItem) => {
    setForm({
      ...item,
      skills: item.skills.join(", "),
      start_date: item.start_date ?? "",
      end_date: item.end_date ?? "",
    })
    setModalMode("view")
  }

  const closeModal = () => {
    setModalMode(null)
    setEditingId(null)
    setForm(emptyForm)
  }

  const filteredData =
    filter === "all" ? data : data.filter((d) => d.type === filter)

  /* ================= UI ================= */

  return (
    <div className="min-h-screen p-6 space-y-6">

      {/* GLOBAL LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center">
          <div className="rounded-md bg-card px-4 py-2 shadow">
            Loading...
          </div>
        </div>
      )}

      <div className="flex justify-between items-center rounded-xl border bg-card p-6">
        <div>
          <h1 className="text-2xl font-bold">Experience & Education</h1>
          <p className="text-sm text-muted-foreground">
            Manage your experience and education
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCreate} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        {(["all", "experience", "education"] as FilterType[]).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
            disabled={loading}
            className="gap-2"
          >
            {f === "experience" && <Briefcase className="h-3 w-3" />}
            {f === "education" && <GraduationCap className="h-3 w-3" />}
            {f.toUpperCase()}
          </Button>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.company} • {item.location}
                </p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openView(item)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteData(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ExperienceFormModal
        open={modalMode !== null}
        onOpenChange={(v) => !v && closeModal()}
        form={form}
        mode={modalMode ?? "view"}
        loading={loading}
        onChange={(k, v) =>
          modalMode !== "view" &&
          setForm((prev) => ({ ...prev, [k]: v }))
        }
        onSubmit={submit}
      />
    </div>
  )
}