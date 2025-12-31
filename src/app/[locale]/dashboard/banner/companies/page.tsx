"use client"

import React, { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Building2, Plus, Save, Trash2, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"
import DashboardHeader from "@/components/ui/sections/admin/dashboardheader"

interface CompanyItem {
  id?: number
  name: string
  logo?: string
  file?: File | null
}

export default function CompaniesAdminPage() {
  const locale = useLocale()
  const t = useTranslations("companies")

  const [companies, setCompanies] = useState<CompanyItem[]>([])

  const fetchCompanies = useCallback(async () => {
    try {
      const res = await fetch(`/api/companies/all?lang=${locale}`)
      const json: { data?: CompanyItem[] } = await res.json()
      setCompanies(json.data ?? [])
    } catch (error) {
      console.error(error)
    }
  }, [locale])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  function onFileChange(index: number, file: File | null) {
    setCompanies(prev =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              file,
              logo: file ? URL.createObjectURL(file) : item.logo
            }
          : item
      )
    )
  }

  function updateField<K extends keyof CompanyItem>(
    index: number,
    field: K,
    value: CompanyItem[K]
  ) {
    setCompanies(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    )
  }

  async function saveCompany(index: number) {
    const company = companies[index]

    try {
      let finalLogo = company.logo ?? ""

      if (company.file) {
        const formData = new FormData()
        formData.append("file", company.file)

        const uploadRes = await fetch("/api/upload/company", {
          method: "POST",
          body: formData
        })

        if (!uploadRes.ok) throw new Error("Upload failed")

        const uploadJson: { url?: string } = await uploadRes.json()
        finalLogo = uploadJson.url ?? finalLogo
      }

      const res = await fetch("/api/companies/all", {
        method: company.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: company.id,
          name: company.name,
          logo: finalLogo
        })
      })

      if (!res.ok) throw new Error("Save failed")

      toast.success(t("admin.saved"))
      fetchCompanies()
    } catch (error) {
      console.error(error)
      toast.error(t("admin.saveFailed"))
    }
  }

  function deleteCompany(index: number) {
    if (!confirm(t("admin.deleteConfirm"))) return
    setCompanies(prev => prev.filter((_, i) => i !== index))
  }

  function addEmpty() {
    setCompanies(prev => [...prev, { name: "" }])
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto space-y-6">
        <DashboardHeader  
          title={t("admin.headerTitle")}
          description={t("admin.subtitle")}
        />

        <div className="space-y-4">
          {companies.map((c, i) => (
            <div
              key={c.id ?? i}
              className="bg-card rounded-lg border p-5 shadow-sm"
            >
              <div className="grid lg:grid-cols-[200px_1fr_1fr_auto] gap-4">
                <div>
                  <label className="text-sm font-medium">
                    {t("admin.logoPreview")}
                  </label>
                  <div className="w-full h-24 bg-gray-100 rounded-md border flex items-center justify-center overflow-hidden">
                    {c.logo ? (
                      <Image
                        src={c.logo}
                        alt={c.name}
                        width={160}
                        height={96}
                        className="object-contain"
                      />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <Building2 className="mx-auto mb-1 opacity-50" />
                        <span className="text-xs">
                          {t("admin.noLogo")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    {t("admin.companyName")}
                  </label>
                  <Input
                    value={c.name}
                    onChange={e =>
                      updateField(i, "name", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    {t("admin.logoUploadLabel")}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e =>
                      onFileChange(i, e.target.files?.[0] ?? null)
                    }
                  />
                  <Input
                    value={c.logo ?? ""}
                    onChange={e =>
                      updateField(i, "logo", e.target.value)
                    }
                    placeholder={t("admin.logoUrlPlaceholder")}
                  />
                </div>

                <div className="flex gap-2 items-end">
                  <Button size="sm" onClick={() => saveCompany(i)} aria-label={t("admin.save")}>
                    <Save className="w-4 h-4 mr-1" />
                    {t("admin.save")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteCompany(i)}
                    aria-label={t("admin.delete")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={addEmpty} aria-label={t("admin.addNew")}>
            <Plus className="w-4 h-4 mr-2" />
            {t("admin.addNew")}
          </Button>
          <Button variant="outline" onClick={fetchCompanies} aria-label={t("admin.refresh")}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("admin.refresh")}
          </Button>
        </div>
      </div>
    </div>
  )
}