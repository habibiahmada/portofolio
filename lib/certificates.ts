import certsData from '@/public/data/certificates.json'

export interface Certificate {
  id: string
  org: string
  title: string
  description: string
  pages: string[]
  thumb: string
  isPinned: boolean
}

export const certificates: Certificate[] = certsData as Certificate[]
