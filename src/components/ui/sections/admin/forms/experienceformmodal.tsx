"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Briefcase, GraduationCap } from "lucide-react"

export type ExperienceForm = {
  type: "experience" | "education"
  title: string
  company: string
  location: string
  location_type: string
  start_date: string
  end_date: string
  skills: string
  highlight: string
  description: string
}

interface Props {
  open: boolean
  loading?: boolean
  form: ExperienceForm
  mode: "create" | "edit" | "view"
  onOpenChange: (v: boolean) => void
  onChange: <K extends keyof ExperienceForm>(
    key: K,
    value: ExperienceForm[K]
  ) => void
  onSubmit: () => void
}

export function ExperienceFormModal({
  open,
  onOpenChange,
  form,
  onChange,
  onSubmit,
  mode,
  loading,
}: Props) {
  const readOnly = mode === "view"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Tambah Data"}
            {mode === "edit" && "Edit Data"}
            {mode === "view" && "Detail Data"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TYPE */}
          <div className="space-y-1">
            <Label className="text-sm font-medium text-muted-foreground" id="type-label">Tipe</Label>
            <Select
              value={form.type}
              disabled={readOnly}
              onValueChange={(v) =>
                onChange("type", v as ExperienceForm["type"])
              }
            >
              <SelectTrigger aria-labelledby="type-label">
                <SelectValue placeholder="Pilih tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="experience">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Experience
                  </div>
                </SelectItem>
                <SelectItem value="education">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Education
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* TITLE */}
          <div className="space-y-1">
            <Label className="text-sm font-medium text-muted-foreground" htmlFor="title">Posisi / Jurusan</Label>
            <Input
              id="title"
              value={form.title}
              disabled={readOnly}
              onChange={(e) => onChange("title", e.target.value)}
            />
          </div>

          {/* COMPANY */}
          <div className="space-y-1">
            <Label className="text-sm font-medium text-muted-foreground" htmlFor="company">Perusahaan / Institusi</Label>
            <Input
              id="company"
              value={form.company}
              disabled={readOnly}
              onChange={(e) => onChange("company", e.target.value)}
            />
          </div>

          {/* LOCATION */}
          <div className="space-y-1">
            <Label className="text-sm font-medium text-muted-foreground" htmlFor="location">Lokasi</Label>
            <Input
              id="location"
              value={form.location}
              disabled={readOnly}
              onChange={(e) => onChange("location", e.target.value)}
            />
          </div>

          {/* LOCATION TYPE */}
          <div className="space-y-1">
            <Label className="text-sm font-medium text-muted-foreground" id="location-type-label">Tipe Lokasi</Label>
            <Select
              value={form.location_type}
              disabled={readOnly}
              onValueChange={(v) => onChange("location_type", v)}
            >
              <SelectTrigger aria-labelledby="location-type-label">
                <SelectValue placeholder="Pilih tipe lokasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="On Site">On Site</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* START DATE */}
          <div className="space-y-1">
            <Label className="text-sm font-medium text-muted-foreground" htmlFor="start_date">Tanggal Mulai</Label>
            <Input
              id="start_date"
              type="date"
              value={form.start_date}
              disabled={readOnly}
              onChange={(e) => onChange("start_date", e.target.value)}
            />
          </div>

          {/* END DATE */}
          <div className="space-y-1">
            <Label className="text-sm font-medium" htmlFor="end_date">Tanggal Selesai</Label>
            <Input
              id="end_date"
              type="date"
              value={form.end_date}
              disabled={readOnly}
              onChange={(e) => onChange("end_date", e.target.value)}
            />
          </div>

          {/* SKILLS */}
          <div className="space-y-1 md:col-span-2">
            <Label className="text-sm font-medium text-muted-foreground" htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              placeholder="Pisahkan dengan koma"
              value={form.skills}
              disabled={readOnly}
              onChange={(e) => onChange("skills", e.target.value)}
            />
          </div>

          {/* HIGHLIGHT */}
          <div className="space-y-1 md:col-span-2">
            <Label className="text-sm font-medium text-muted-foreground" htmlFor="highlight">Highlight</Label>
            <Input
              id="highlight"
              value={form.highlight}
              disabled={readOnly}
              onChange={(e) => onChange("highlight", e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1 md:col-span-2">
            <Label className="text-sm font-medium text-muted-foreground" htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              rows={4}
              value={form.description}
              disabled={readOnly}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          {mode !== "view" && (
            <Button onClick={onSubmit} disabled={loading}>
              {mode === "edit" ? "Update" : "Simpan"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
