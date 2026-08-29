'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

const ease = [0.215, 0.61, 0.355, 1] as const

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form data:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <section
      id="contact-form"
      className="py-20 px-6 border-b border-border"
    >
      <div className="max-w-3xl mx-auto">
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          onSubmit={handleSubmit}
          className="backdrop-blur-lg bg-black/5 dark:bg-white/5 border border-border/40 p-8 md:p-12 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-border/40 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/60 transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-border/40 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/60 transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-semibold mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-border/40 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/60 transition-colors"
              placeholder="Project discussion"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-border/40 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/60 transition-colors resize-none"
              placeholder="Tell me about your project..."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitted}
              className="w-full group backdrop-blur-md bg-primary/80 hover:bg-primary disabled:opacity-50 text-primary-foreground px-8 py-4 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 border border-border inline-flex items-center justify-center gap-2"
            >
              {submitted ? 'Message Sent!' : 'Send Message'}
              <Send
                size={20}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </button>
          </div>

          {submitted && (
            <div className="p-4 border border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400 text-center">
              Thank you for your message! I&apos;ll get back to you soon.
            </div>
          )}
        </motion.form>
      </div>
    </section>
  )
}
