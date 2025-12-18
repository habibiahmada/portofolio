import React from "react"

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
  technologies: string[]
  color?: string
}

export default function ServiceCard({
  icon,
  title,
  description,
  technologies,
  color,
}: ServiceCardProps) {
  return (
    <div
      className="
        p-6
        border-border       
        border-r border-b
        hover:bg-muted
        transition-colors duration-500
        md:[&:nth-child(3n)]:border-r-0
        lg:[&:nth-child(3n)]:border-r-0
        [&:nth-last-child(-n+1)]:border-b-0
        md:[&:nth-last-child(-n+2)]:border-b-0
        lg:[&:nth-last-child(-n+3)]:border-b-0
      "
    >

      <div
        className={`w-14 h-14 flex items-center justify-center bg-gradient-to-br ${color}
        rounded-lg mb-6`}
      >
        {icon}
      </div>

      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>

      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
        {description}
      </p>

      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, i) => (
          <span
            key={i}
            className="text-xs px-3 py-1 bg-muted text-muted-foreground rounded-full"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
