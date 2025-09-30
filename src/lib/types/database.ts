export interface Company {
  name: string;
  logo: string;
}

export interface Project {
  id: string;
  image_url: string;
  year: number;
  technologies: string[];
  live_url: string;
  github_url: string;
  projects_translations?: {
    title: string;
    description: string;
  }[];
}

export interface TechItem {
  id: number;
  name: string;
  key: string;
  color: string;
};

export interface Experience {
  id: string;
  type: "experience" | "education";
  start_date: string;
  end_date: string;
  company: string;
  location: string;
  skills: string[];
  experience_translations?: {
    id: number;
    title: string;
    language: string;
    description: string;
    location_type: string;
    highlight?: string;
  }[];
}

export interface Certificate {
  id: string;
  issuer: string;
  year: string;
  preview: string;
  skills: string[];
  certification_translations?: {
    title: string;
    description: string;
    skills: string[];
  }[];
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
      experiences: {
        Row: Experience
        Insert: Omit<Experience, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Experience, 'id' | 'created_at' | 'updated_at'>>
      }
      certifications: {
        Row: Certificate
        Insert: Omit<Certificate, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Certificate, 'id' | 'created_at' | 'updated_at'>>
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
