'use client'

import { useEffect, useRef } from 'react'

/**
 * Animated node network (particle system) drawn on a canvas.
 * Nodes connect to nearby neighbours and react to mouse movement.
 */
export interface NodeNetworkProps {
  /** Optional external mouse ref for parents that track mouse elsewhere (e.g. hero) */
  externalMouseRef?: React.MutableRefObject<{ x: number; y: number; active: boolean } | null>
  /** Particle density bias. 'uniform' spreads evenly; 'topLeft' clusters in top-left/center; 'topRight' clusters in top-right/center. Default: 'uniform' */
  densityBias?: 'uniform' | 'topLeft' | 'topRight'
}

export function NodeNetwork({ externalMouseRef, densityBias = 'uniform' }: NodeNetworkProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, active: false })

  // Track mouse within this container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    }
  }

  const handleMouseLeave = () => {
    mouseRef.current.active = false
  }

  // Canvas animation loop
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
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
      initParticles()
    }

    const initParticles = () => {
      // Fewer nodes on mid-size screens keeps O(n²) edges cheap
      const area = canvas.width * canvas.height
      const count = Math.min(
        area < 900_000 ? 28 : 48,
        Math.floor(area / 18_000),
      )
      particles = []
      for (let i = 0; i < count; i++) {
        const isRed = Math.random() > 0.5

        let x: number, y: number
        if (densityBias === 'topLeft') {
          // Bias toward top-left → top-center → left-center
          // Weighted random: most particles in the first ~55% of width & height
          x = (1 - Math.sqrt(Math.random())) * canvas.width * 0.55
          y = (1 - Math.sqrt(Math.random())) * canvas.height * 0.55
        } else if (densityBias === 'topRight') {
          // Bias toward top-right → top-center → right-center
          // Mirrors topLeft on the x-axis
          x = canvas.width - (1 - Math.sqrt(Math.random())) * canvas.width * 0.55
          y = (1 - Math.sqrt(Math.random())) * canvas.height * 0.55
        } else {
          x = Math.random() * canvas.width
          y = Math.random() * canvas.height
        }

        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: Math.random() * 2.5 + 2,
          color: isRed ? 'rgba(239, 68, 68, 0.75)' : 'rgba(59, 130, 246, 0.75)',
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Move & draw nodes
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        p.x = Math.max(0, Math.min(canvas.width, p.x))
        p.y = Math.max(0, Math.min(canvas.height, p.y))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
      })

      // Draw lines between nearby nodes — more visible with matching colors
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const pi = particles[i]
          const pj = particles[j]
          const dist = Math.hypot(pi.x - pj.x, pi.y - pj.y)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(pi.x, pi.y)
            ctx.lineTo(pj.x, pj.y)
            // Use the color of the first node in the pair
            const alpha = 0.45 * (1 - dist / 120)
            const baseRgb = pi.color.includes('239, 68, 68') ? '239, 68, 68' : '59, 130, 246'
            ctx.strokeStyle = `rgba(${baseRgb}, ${alpha})`
            ctx.lineWidth = 1.5
            ctx.stroke()
          }
        }
      }

      // Use external mouse if provided, otherwise use internal tracking
      const activeMouse = externalMouseRef?.current?.active
        ? externalMouseRef.current
        : mouseRef.current

      // Draw lines from mouse to closest nodes
      if (activeMouse.active) {
        const mouse = activeMouse
        const sorted = particles
          .map((p) => ({ p, dist: Math.hypot(p.x - mouse.x, p.y - mouse.y) }))
          .sort((a, b) => a.dist - b.dist)

        const maxMouseConnections = Math.min(3, sorted.length)
        for (let k = 0; k < maxMouseConnections; k++) {
          const { p, dist } = sorted[k]
          if (dist < 220) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)

            const color = k % 2 === 0 ? 'rgba(239, 68, 68,' : 'rgba(59, 130, 246,'
            ctx.strokeStyle = `${color}${0.45 * (1 - dist / 120)})`
            ctx.lineWidth = k === 0 ? 5 : 4
            ctx.stroke()

            // Pulse glow at connection
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.radius * 1.6, 0, Math.PI * 2)
            ctx.fillStyle = k % 2 === 0 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.4)'
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

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 z-0"
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full opacity-100 dark:opacity-75 pointer-events-none"
      />
    </div>
  )
}
