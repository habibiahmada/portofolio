import Image from 'next/image'
import { DynamicIcon } from '@/components/ui/dynamicIcon'

interface PreviewProps {
  title: string
  description: string
  bullets: string[]
  icon?: string
  color?: string
}

export default function PreviewCard({
  title,
  description,
  bullets,
  icon,
  color = 'from-indigo-500 to-blue-500',
}: PreviewProps) {
  const isImg = /^https?:\/\//.test(icon || '')

  return (
    <div className="rounded-2xl border bg-card p-8 shadow-sm">
      <div
        className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${color}
        flex items-center justify-center`}
      >
        {icon ? (
          isImg ? (
            <div className="relative w-10 h-10">
              <Image src={icon} alt="" fill className="object-contain" />
            </div>
          ) : (
            <DynamicIcon name={icon} className="w-9 h-9 text-white" />
          )
        ) : (
          <div className="w-8 h-8 bg-white/20 rounded" />
        )}
      </div>

      <h3 className="text-xl font-semibold mb-2">
        {title || 'Service title'}
      </h3>

      <p className="text-sm text-muted-foreground mb-4">
        {description || 'Service description'}
      </p>

      {bullets.length > 0 && (
        <ul className="space-y-2">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span
                className={`mt-2 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${color}`}
              />
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
