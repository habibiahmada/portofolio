'use client'

import Image from 'next/image'

const companies = [
  { name: 'Neskar', logo: '/images/companies/neskar.png' },
  { name: 'PPLG', logo: '/images/companies/pplg.png' },
  { name: 'Sagasitas', logo: '/images/companies/sagasitas.png' },
  { name: 'Smartplus', logo: '/images/companies/smartplus.png' },
  { name: 'Webekspres', logo: '/images/companies/webekspres.png' },
]

// Duplicate for seamless loop
const marqueeItems = [...companies, ...companies]

export function Companies() {
  return (
    <section id="companies" className="py-20 border-y border-zinc-400 overflow-hidden">
      <div className="w-full mx-auto">
        <h2 className="text-center text-4xl md:text-5xl font-bold uppercase mb-10">
          Trusted by leading companies
        </h2>
        <div className='w-40 h-1 mx-auto bg-zinc-200 mb-10'/>
        <div className="relative flex overflow-hidden ">
          <div className="flex gap-16 animate-marquee border border-zinc-400">
            {marqueeItems.map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="relative h-28 w-40 shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 border-x border-zinc-400"
              >
                <Image
                  src={company.logo}
                  alt={company.name}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
