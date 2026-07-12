'use client'



import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { CpuArchitecture } from '@/components/ui/cpu-architecture'
import { GlitchText } from '@/components/ui/glitch-text'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cpuWrapperRef = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, active: false })

  // Track mouse coordinates for background spotlight without re-rendering React
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    if (spotlightRef.current) {
      spotlightRef.current.style.setProperty('--mouse-x', `${x}px`)
      spotlightRef.current.style.setProperty('--mouse-y', `${y}px`)
    }
    
    mouseRef.current = { x, y, active: true }
  }

  const handleMouseLeave = () => {
    mouseRef.current.active = false
  }

  // Node Network Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string
    }> = []

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 15000))
      particles = []
      for (let i = 0; i < count; i++) {
        const isRed = Math.random() > 0.5
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: Math.random() * 2.5 + 2,
          color: isRed ? 'rgba(244, 63, 94, 0.75)' : 'rgba(59, 130, 246, 0.75)'
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Move & draw nodes
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy

        // Bounce
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // Keep inside bounds just in case of resize
        p.x = Math.max(0, Math.min(canvas.width, p.x))
        p.y = Math.max(0, Math.min(canvas.height, p.y))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
      })

      // Draw lines between nearby nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const pi = particles[i]
          const pj = particles[j]
          const dist = Math.hypot(pi.x - pj.x, pi.y - pj.y)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(pi.x, pi.y)
            ctx.lineTo(pj.x, pj.y)
            // Fade out lines further away
            ctx.strokeStyle = `rgba(100, 110, 140, ${0.18 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Draw line to mouse from closest nodes
      if (mouseRef.current.active) {
        const mouse = mouseRef.current
        
        // Find particles and sort by distance to mouse
        const sorted = particles
          .map(p => ({ p, dist: Math.hypot(p.x - mouse.x, p.y - mouse.y) }))
          .sort((a, b) => a.dist - b.dist)

        // Draw line from top 3 closest nodes to mouse
        const maxMouseConnections = Math.min(3, sorted.length)
        for (let k = 0; k < maxMouseConnections; k++) {
          const { p, dist } = sorted[k]
          if (dist < 220) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)
            
            // Glitch color for mouse connection (gradient or red/blue mix)
            const color = k % 2 === 0 ? 'rgba(244, 63, 94,' : 'rgba(59, 130, 246,'
            ctx.strokeStyle = `${color}${0.25 * (1 - dist / 120)})`
            ctx.lineWidth = k === 0 ? 5 : 4
            ctx.stroke()

            // Subtle pulsing glow at connection points
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.radius * 1.6, 0, Math.PI * 2)
            ctx.fillStyle = k % 2 === 0 ? 'rgba(244, 63, 94, 0.4)' : 'rgba(59, 130, 246, 0.4)'
            ctx.fill()
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  useEffect(() => {
    const el = cpuWrapperRef.current
    if (!el) return

    // Initial isometric state 
    gsap.set(el, {
      rotationX: 38,
      rotationY: 58,
      rotationZ: -38,
      transformPerspective: 900,
      transformOrigin: '50% 50%',
    })

    // Animate back to flat as user scrolls down
    const tween = gsap.to(el, {
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 0.6,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  const headingText = "Building digital experiences that actually matter"
  const words = headingText.split(" ")

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Hero section"
      className="relative min-h-screen w-full flex flex-col pt-28 pb-16 overflow-hidden group/hero"
    >
      {/* Node Network Background Canvas */}
      <div className="absolute inset-0 h-full w-full pointer-events-none z-0">
        <canvas ref={canvasRef} className="h-full w-full opacity-100 dark:opacity-75" />
      </div>

      {/* Background Image positioned on the right */}
      <div 
        className="absolute inset-y-0 right-0 h-full w-full lg:w-[55%] pointer-events-none z-0 opacity-40 dark:opacity-20"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 30%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%)'
        }}
      >
        <Image 
          src="/images/glitch-hero.png" 
          alt="Hero Background" 
          fill
          priority
          draggable={false}
          className="object-cover lg:object-[60%_15%]" 
        />
      </div>

      {/* Full-width background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-rose-500/3 via-blue-500/1 to-transparent pointer-events-none" />

      {/* Dynamic spotlight overlay */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none opacity-0 group-hover/hero:opacity-100 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(244, 63, 94, 0.05), rgba(59, 130, 246, 0.05) 50%, transparent 80%)'
        }}
      />

      <div className="relative z-10 w-full mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">

        {/* Main Content: Cinematic Copywriting */}
        <div className="lg:col-span-9 max-w-4xl flex flex-col items-start gap-8 lg:self-end z-10 relative">
        

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-black/5 dark:border-white/5 bg-
            black/[0.02] dark:bg-white/2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
              Available for Freelance & Contracts
            </span>
          </motion.div>

          {/* Heading with Glitch Effect */}
          <GlitchText as="h1" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight leading-[1.08] select-none text-foreground" interval={5000} duration={400}>
            {words.map((word, i) => {
              const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "")
              const isAccent = cleanWord === "experiences" || cleanWord === "matter"
              return (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.2em] origin-bottom"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.05 + 0.1,
                    ease: [0.215, 0.61, 0.355, 1]
                  }}
                  style={isAccent ? { color: "var(--navy-accent-text)" } : undefined}
                >
                  {word}
                </motion.span>
              )
            })}
          </GlitchText>

          {/* Sub description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
            className="text-base md:text-lg text-muted-foreground/80 l leading-relaxed font-medium"
          >
            Full-stack developer crafting high-performance, accessible, and beautifully animated web products from concept to deployment.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <a
              href="#projects"
              aria-label="View my projects"
              className="px-8 py-3.5 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-full font-bold text-sm text-center shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              View My Work
            </a>
            <a
              href="#cta"
              aria-label="Get in touch"
              className="px-8 py-3.5 rounded-full font-bold text-sm text-center border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 bg-black/2 dark:bg-white/2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-foreground"
            >
              Get in Touch
            </a>
          </motion.div>
        </div>

      </div>

      {/* Full-width bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
