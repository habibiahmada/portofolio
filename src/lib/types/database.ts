export interface Project {
  id: string
  title: string
  description: string
  image_url?: string
  live_url?: string
  github_url?: string
  technologies: string[]
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'other'
  level: number // 1-5
  icon?: string
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  company: string
  position: string
  description: string
  start_date: string
  end_date?: string
  current: boolean
  location: string
  created_at: string
  updated_at: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  start_date: string
  end_date?: string
  gpa?: number
  description?: string
  created_at: string
  updated_at: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issue_date: string
  expiry_date?: string
  credential_id?: string
  credential_url?: string
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  name: string
  position: string
  company: string
  content: string
  rating: number // 1-5
  avatar_url?: string
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image?: string
  published: boolean
  published_at?: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  created_at: string
  updated_at: string
}

// Database schema type untuk Supabase
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
      }
      skills: {
        Row: Skill
        Insert: Omit<Skill, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Skill, 'id' | 'created_at' | 'updated_at'>>
      }
      experiences: {
        Row: Experience
        Insert: Omit<Experience, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Experience, 'id' | 'created_at' | 'updated_at'>>
      }
      educations: {
        Row: Education
        Insert: Omit<Education, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Education, 'id' | 'created_at' | 'updated_at'>>
      }
      certifications: {
        Row: Certification
        Insert: Omit<Certification, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Certification, 'id' | 'created_at' | 'updated_at'>>
      }
      testimonials: {
        Row: Testimonial
        Insert: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>>
      }
      articles: {
        Row: Article
        Insert: Omit<Article, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Article, 'id' | 'created_at' | 'updated_at'>>
      }
      contact_messages: {
        Row: ContactMessage
        Insert: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ContactMessage, 'id' | 'created_at' | 'updated_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
