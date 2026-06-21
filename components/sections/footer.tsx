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
    <footer className="bg-secondary/50 border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
              Habibi Ahmad
            </h3>
            <p className="text-sm text-foreground/60">
              Full-Stack Web Developer
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Links</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li>
                <a href="#projects" className="hover:text-primary transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#cta" className="hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">
              Follow me
            </h4>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-foreground/60 hover:text-primary"
                  aria-label={label}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-foreground/50">
          <p>
            &copy; {currentYear} Habibi Ahmad. All rights reserved.
          </p>
          <p>Made with passion & code</p>
        </div>
      </div>
    </footer>
  )
}
