"use client"

import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Eye, EyeOff, Save, Type } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export default function EmailTemplateEditor() {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch('/api/email-template?key=contact', { next: { revalidate: 0 } })
      .then((r) => r.json())
      .then((data) => {
        if (data?.template) {
          setSubject(data.template.subject ?? '')
          setBody(data.template.body ?? '')
        } else {
          setSubject('New contact from {{name}} — {{subject}}')
          setBody(
            'Hello,\n\nYou have a new message from {{name}} ({{email}}):\n\n{{message}}\n\nPhone: {{phone}}\n\n--\nThis is an automated notification.'
          )
        }
      })
      .catch(() => {
        toast.error('Failed to load email template')
      })
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/email-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'contact', subject, body }),
        next: { revalidate: 0 },
      })

      const data = await res.json()

      if (res.ok && data.ok) {
        toast.success('Template saved successfully')
      } else {
        toast.error(
          data?.error
            ? `Failed to save template: ${data.error}`
            : 'Failed to save template'
        )
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      toast.error(`Error: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  const renderPreviewSubject = () =>
    subject
      .replace(/{{name}}/g, 'Habibi')
      .replace(/{{subject}}/g, 'Business Inquiry')
      .replace(/{{email}}/g, 'habibi@example.com')

  const renderPreviewBody = () =>
    body
      .replace(/{{name}}/g, 'Habibi')
      .replace(/{{email}}/g, 'habibi@example.com')
      .replace(/{{phone}}/g, '+62 812 3456 7890')
      .replace(/{{subject}}/g, 'Business Inquiry')
      .replace(
        /{{message}}/g,
        'Hi, I would like to discuss a potential collaboration opportunity. Looking forward to hearing from you.'
      )

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-1 flex-col gap-4 sm:gap-6 p-2 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Email Template Editor
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Customize your contact form notification template
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Type className="w-4 h-4 text-slate-600" />
                <h2 className="text-lg font-medium">
                  Template Configuration
                </h2>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Email Subject
                </label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5 bg-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Body
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={14}
                  className="w-full border rounded-lg px-4 py-3 font-mono text-sm bg-transparent resize-none"
                />
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <div className="flex gap-3 flex-wrap">
                <Button
                  onClick={save}
                  disabled={loading}
                  aria-label="Save Template"
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Template'}
                </Button>

                <Button
                  type="button"
                  onClick={() => setPreview((p) => !p)}
                  aria-label="Toggle Preview"
                  className="flex items-center gap-2 border px-4 py-2.5 rounded-lg"
                >
                  {preview ? <EyeOff size={16} /> : <Eye size={16} />}
                  {preview ? 'Hide Preview' : 'Show Preview'}
                </Button>
              </div>
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div className="space-y-6">
              <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <div className="border-b px-6 py-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Live Preview
                  </h3>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <div className="text-xs uppercase mb-2">
                      Subject Line
                    </div>
                    <div className="border rounded-lg px-4 py-3">
                      {renderPreviewSubject()}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs uppercase mb-2">
                      Email Content
                    </div>
                    <div className="border rounded-lg p-6">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {renderPreviewBody()}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}