"use client"

import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Building2, Plus, Save, Trash2, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { useLocale, useTranslations } from 'next-intl'

interface CompanyItem {
  id?: number
  name: string
  logo?: string
  _file?: File | null
}

export default function CompaniesAdminPage() {
  const locale = useLocale()
  const t = useTranslations('companies')
  const [companies, setCompanies] = useState<CompanyItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCompanies()
  }, [])

  async function fetchCompanies() {
    setLoading(true)
    try {
      const res = await fetch(`/api/companies/all?lang=${locale}`)
      const json = await res.json()
      setCompanies(json.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function onFileChange(index: number, file?: File | null) {
    const copy = [...companies]
    ;(copy[index] as any)._file = file || null
    // if choosing a local file, clear existing logo preview (will show object URL)
    if (file) (copy[index] as any).logo = (file && URL.createObjectURL(file)) as any
    setCompanies(copy)
  }

  function updateField(index: number, field: keyof CompanyItem, value: any) {
    const copy = [...companies]
    ;(copy[index] as any)[field] = value
    setCompanies(copy)
  }

  async function saveCompany(index: number) {
    const c = companies[index]
    try {
      // If a new file has been selected, upload it first to Supabase storage
      let finalLogo = c.logo || ''
      const file = (c as any)._file as File | null | undefined
      if (file) {
        const formData = new FormData()
        formData.append('file', file)

        const uploadRes = await fetch('/api/upload/company', {
          method: 'POST',
          body: formData
        })

        if (!uploadRes.ok) throw new Error('Upload failed')

        const uploadJson = await uploadRes.json()
        finalLogo = uploadJson.url || finalLogo
      }

      let res
        if (c.id) {

        toast.loading(t('admin.updating'))
        res = await fetch('/api/companies/all', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: c.id, name: c.name, logo: finalLogo })
        })
      } else {
        
        toast.loading(t('admin.creating'))
        res = await fetch('/api/companies/all', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: c.name, logo: finalLogo })
        })
      }
      if (!res || !res.ok) throw new Error('Failed')
      toast.success(t('admin.saved'))
      fetchCompanies()
    } catch (err) {
      console.error(err)
      toast.error(t('admin.saveFailed'))
    }
  }

  function deleteCompany(index: number) {
    if (confirm(t('admin.deleteConfirm'))) {
      setCompanies(prev => prev.filter((_, i) => i !== index))
    }
  }

  function addEmpty() {
    setCompanies(prev => [...prev, { name: '', logo: '' }])
  }

  return (
    <div className="min-h-screen">
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-card px-4 py-2 rounded-md shadow">
            {t('admin.loading')}
          </div>
        </div>
      )}
      <div className="mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{t('admin.headerTitle')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('admin.subtitle')}</p>
        </div>

        {/* Companies List */}
        <div className="space-y-4">
          {companies.map((c, i) => (
            <div key={c.id ?? i} className="bg-card rounded-lg border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_1fr_auto] gap-4 items-start">
                {/* Logo Preview */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">{t('admin.logoPreview')}</label>
                  <div className="w-full h-24 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center overflow-hidden">
                    {c.logo ? (
                      <img 
                        src={c.logo} 
                        alt={c.name || 'Company logo'} 
                        className="max-w-full max-h-full object-contain p-2"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                    ) : null}
                    <div className={c.logo ? 'hidden' : 'text-gray-400 text-center px-2'}>
                      <Building2 className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <span className="text-xs">{t('admin.noLogo')}</span>
                    </div>
                  </div>
                </div>

                {/* Company Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">{t('admin.companyName')}</label>
                  <Input 
                    value={c.name} 
                    onChange={(e) => updateField(i, 'name', e.target.value)}
                    placeholder={t('admin.enterNamePlaceholder')}
                    className="bg-card border-border focus:border-gray-500 focus:ring-gray-500"
                  />
                </div>

                {/* Logo Upload */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">{t('admin.logoUploadLabel')}</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onFileChange(i, e.target.files?.[0] || null)}
                    className="text-sm"
                  />
                  <label className="text-sm text-gray-400">{t('admin.orKeepUrl')}</label>
                  <Input
                    value={c.logo || ''}
                    onChange={(e) => updateField(i, 'logo', e.target.value)}
                    placeholder={t('admin.logoUrlPlaceholder')}
                    className="bg-card border-border focus:border-gray-500 focus:ring-gray-500"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">{t('admin.actionsLabel')}</label>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => saveCompany(i)}
                      className="bg-gray-800 hover:bg-gray-900 text-white"
                      size="sm"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      {t('admin.save')}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => deleteCompany(i)}
                      className="border-border text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {c.id && (
                <div className="mt-3 pt-3 border-t border-border">
                  <span className="text-xs text-gray-500">{t('admin.idLabel', { id: c.id })}</span>
                </div>
              )}
            </div>
          ))}

          {companies.length === 0 && (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">{t('admin.emptyTitle')}</h3>
              <p className="text-gray-600 mb-4">{t('admin.emptyDescription')}</p>
            </div>
          )}
        </div>

        {/* Add Button */}
        <div className="mt-6 flex gap-3">
          <Button 
            onClick={addEmpty}
            variant="outline"
            className="border-border text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('admin.addNew')}
          </Button>
          <Button 
            onClick={fetchCompanies}
            variant="outline"
            className="border-border text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('admin.refresh')}
          </Button>
        </div>
      </div>
    </div>
  )
}