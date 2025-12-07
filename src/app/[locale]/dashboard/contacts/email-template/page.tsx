"use client"

import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Eye, EyeOff, Save, Type } from 'lucide-react'

export default function EmailTemplateEditor() {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [preview, setPreview] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch('/api/email-template?key=contact')
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
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setMessage(null)
    setLoading(true)
    try {
      const res = await fetch('/api/email-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'contact', subject, body }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setMessage('Template saved successfully')
      } else {
        setMessage('Failed to save template: ' + (data?.error || JSON.stringify(data)))
      }
    } catch (err: unknown) {
      const messageText = err instanceof Error ? err.message : String(err)
      setMessage('Error: ' + messageText)
    } finally {
      setLoading(false)
    }
  }

  const renderPreviewSubject = () => {
    return subject
      .replace(/{{name}}/g, 'Habibi')
      .replace(/{{subject}}/g, 'Business Inquiry')
      .replace(/{{email}}/g, 'habibi@example.com')
  }

  const renderPreviewBody = () => {
    return body
      .replace(/{{name}}/g, 'Habibi')
      .replace(/{{email}}/g, 'habibi@example.com')
      .replace(/{{phone}}/g, '+62 812 3456 7890')
      .replace(/{{subject}}/g, 'Business Inquiry')
      .replace(/{{message}}/g, 'Hi, I would like to discuss a potential collaboration opportunity. Looking forward to hearing from you.')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-1 flex-col gap-4 sm:gap-6 p-2 bg-background min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Email Template Editor</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Customize your contact form notification template</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Editor Section */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Type className="w-4 h-4 text-slate-600" />
                <h2 className="text-lg font-medium text-foreground">Template Configuration</h2>
              </div>

              {/* Subject Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Email Subject
                </label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject line..."
                  className="w-full border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition bg-transparent"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Available: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{'{{name}}'}</code>, <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{'{{subject}}'}</code>
                </p>
              </div>

              {/* Body Field */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Email Body
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={14}
                  placeholder="Enter email body content..."
                  className="w-full border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition resize-none bg-transparent"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Available: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{'{{name}}'}</code>, <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{'{{email}}'}</code>, <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{'{{message}}'}</code>, <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{'{{phone}}'}</code>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={save}
                  disabled={loading}
                  className="flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-95 disabled:opacity-50 px-5 py-2.5 rounded-lg font-medium transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Template'}
                </button>
                <button
                  onClick={() => setPreview((p) => !p)}
                  className="flex items-center gap-2 border border-border hover:bg-muted/50 text-muted-foreground px-4 py-2.5 rounded-lg font-medium transition-colors"
                  type="button"
                >
                  {preview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {preview ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>
              {message && (
                <div className={`mt-4 px-4 py-3 rounded-lg text-sm ${
                  message.includes('success')
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          {preview && (
            <div className="space-y-6">
              <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="border-b border-border px-6 py-4">
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Live Preview
                  </h3>
                </div>

                {/* Email Preview Container */}
                <div className="p-6">
                  {/* Subject Preview */}
                  <div className="mb-6">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Subject Line</div>
                    <div className="bg-card border border-border rounded-lg px-4 py-3">
                      <p className="text-foreground font-medium">{renderPreviewSubject()}</p>
                    </div>
                  </div>

                  {/* Body Preview */}
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Email Content</div>
                    <div className="bg-card border border-border rounded-lg p-6">
                      <div className="prose prose-slate prose-sm max-w-none">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: (props) => <p className="text-muted-foreground leading-relaxed mb-3 last:mb-0" {...props} />,
                            strong: (props) => <strong className="text-foreground font-semibold" {...props} />,
                            a: (props) => <a className="text-primary underline" {...props} />,
                            code: (props) => <code className="bg-muted/30 text-foreground px-1 py-0.5 rounded text-xs" {...props} />
                          }}
                        >
                          {renderPreviewBody()}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h4 className="text-sm font-medium text-foreground mb-3">Preview Information</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The preview above shows how your email will appear with sample data. Placeholders are automatically replaced with example values to help you visualize the final result.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}