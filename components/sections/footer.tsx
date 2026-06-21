'use client'


import { Code2, Mail, MessageCircle, Send } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Code2, label: 'GitHub', href: '#' },
    { icon: MessageCircle, label: 'LinkedIn', href: '#' },
    { icon: Send, label: 'Twitter', href: '#' },
    { icon: Mail, label: 'Email', href: 'mailto:contact@habibiahmad.dev' },
  ]

  return (
    <footer className="backdrop-blur-lg border-t border-border py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent mb-3">
              HA
            </h3>
            <p className="text-sm text-foreground/70">
              Full-Stack Web Developer
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#hero" className="text-foreground/70 hover:text-primary transition-colors duration-200 hover:translate-x-1 inline-block">
                  Home
                </a>
              </li>
              <li>
                <a href="#projects" className="text-foreground/70 hover:text-primary transition-colors duration-200 hover:translate-x-1 inline-block">
                  Projects
                </a>
              </li>
              <li>
                <a href="#services" className="text-foreground/70 hover:text-primary transition-colors duration-200 hover:translate-x-1 inline-block">
                  Services
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary transition-colors duration-200 hover:translate-x-1 inline-block">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary transition-colors duration-200 hover:translate-x-1 inline-block">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary transition-colors duration-200 hover:translate-x-1 inline-block">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Follow</h4>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="p-2.5 backdrop-blur-md bg-black/5 dark:bg-white/5 hover:bg-primary/20 hover:text-primary transition-all duration-200 text-foreground/70 border border-border/40 hover:border-primary/40"
                  aria-label={label}
                  title={label}
                >
                  <Icon size={18} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60 gap-4">
          <p>
            &copy; {currentYear} Habibi Ahmad. All rights reserved.
          </p>
          <p>Built with Next.js, React & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}
