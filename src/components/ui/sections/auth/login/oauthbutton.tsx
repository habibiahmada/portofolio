import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'
import { SiGoogle } from 'react-icons/si'

interface Props {
  loading: boolean
  isDark: boolean
  onGoogle: () => void
  onGitHub: () => void
}

export function OAuthButtons({ loading, onGoogle, onGitHub }: Props) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      <Button onClick={onGoogle} disabled={loading}>
        <SiGoogle className="mr-2" /> Google
      </Button>

      <Button onClick={onGitHub} disabled={loading}>
        <Github className="mr-2" /> GitHub
      </Button>
    </div>
  )
}
