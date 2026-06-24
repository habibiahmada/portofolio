'use client'

import Image from 'next/image'

const companies = [
  { name: 'Neskar', logo: '/images/companies/neskar.png' },
  { name: 'PPLG', logo: '/images/companies/pplg.png' },
  { name: 'Sagasitas', logo: '/images/companies/sagasitas.png' },
  { name: 'Smartplus', logo: '/images/companies/smartplus.png' },
  { name: 'Webekspres', logo: '/images/companies/webekspres.png' },
]

// Duplicate marquee items for a seamless scrolling loop
const marqueeItems = [...companies, ...companies, ...companies]

export function Companies() {
  return (
    <section id="companies" className="py-16 overflow-hidden w-full bg-transparent">
      <div className="max-w-6xl mx-auto px-6">
        {/* Modern minimal label */}
        <h2 className="text-center text-xs font-mono tracking-widest text-muted-foreground/60 uppercase mb-10 select-none">
          // Collaborations & Trusted By
        </h2>
        
        {/* Fade-masked marquee container */}
        <div className="relative w-full overflow-hidden flex items-center [mask-image:linear-gradient(to_right,transparent_0,black_20%,black_80%,transparent_100%)]">
          
          <div className="flex gap-16 py-4 animate-marquee whitespace-nowrap">
            {marqueeItems.map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="relative h-12 w-32 shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer"
              >
                <Image
                  src={company.logo}
                  alt={company.name}
                  fill
                  className="object-contain"
                  sizes="120px"
                />
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  )
}
