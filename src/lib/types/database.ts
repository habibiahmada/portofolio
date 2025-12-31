export interface Company {
  id: string;
  name: string;
  logo?: string;
  created_at?: string;
}

export interface Project {
  id: string;
  image_url?: string;
  image?: string;
  year: number;
  technologies: string[];
  live_url?: string;
  github_url?: string;
  created_at?: string;
  updated_at?: string;
  projects_translations?: ProjectTranslation[];
}

export interface ProjectTranslation {
  id: number;
  projects_id: string;
  language: string;
  title: string;
  description: string;
  created_at?: string;
}

export interface TechItem {
  id: string;
  name: string;
  key: string;
  color: string;
  created_at?: string;
};

export interface Experience {
  id: string;
  type: "experience" | "education";
  start_date: string;
  end_date: string;
  company: string;
  location: string;
  skills: string[];
  created_at?: string;
  updated_at?: string;
  experience_translations?: ExperienceTranslation[];
}

export interface ExperienceTranslation {
  id: number;
  experience_id: string;
  language: string;
  title: string;
  description: string;
  location_type: string;
  highlight?: string;
  created_at?: string;
}

export interface Certificate {
  id: string;
  issuer: string;
  year: string;
  preview?: string;
  skills: string[];
  created_at?: string;
  updated_at?: string;
  thumbnail?: string;
  certification_translations?: CertificationTranslation[];
}

export interface CertificationTranslation {
  id: number;
  certification_id: string;
  language: string;
  title: string;
  description: string;
  skills: string[];
  created_at?: string;
}

export interface Service {
  id: string;
  key: string;
  icon: string;
  color: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
  service_translations?: ServiceTranslation[];
}

export interface ServiceTranslation {
  id: number;
  service_id: string;
  language: string;
  title: string;
  description: string;
  bullet: string[];
  bullets?: string[]; // Alias
  created_at?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
  rating: number;
  created_at?: string;
  updated_at?: string;
  testimonial_translations?: TestimonialTranslation[];
}

export interface TestimonialTranslation {
  id: number;
  testimonial_id: string;
  language: string;
  content: string;
  created_at?: string;
}

export interface Article {
  id: string;
  image_url?: string;
  image?: string; // Alias
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  article_translations?: ArticleTranslation[];
}

export interface ArticleTranslation {
  id: number;
  article_id: string;
  language: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  read_time: string;
  created_at?: string;
}

export interface HeroSection {
  id: string;
  image_url?: string;
  cv_url?: string;
  created_at?: string;
  updated_at?: string;
  hero_section_translations?: HeroSectionTranslation[];
}

export interface HeroSectionTranslation {
  id: number;
  hero_section_id: string;
  language: string;
  greeting: string;
  description: string;
  typewriter_texts: string[];
  developer_tag?: string;
  console_tag?: string;
  created_at?: string;
}

export interface Statistic {
  id: string;
  key: string;
  count_value: number;
  icon: string;
  color: string;
  bg_color_light: string;
  bg_color_dark: string;
  created_at?: string;
  updated_at?: string;
  statistic_translations?: StatisticTranslation[];
}

export interface StatisticTranslation {
  id: number;
  statistic_id: string;
  language: string;
  label: string;
  description: string;
  suffix?: string;
  created_at?: string;
}

export interface FAQ {
  id: string;
  order_index: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  faq_translations?: FAQTranslation[];
}

export interface FAQTranslation {
  id: number;
  faq_id: string;
  lang: string;
  question: string;
  answer: string;
  created_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: Company
        Insert: Omit<Company, 'id' | 'created_at'>
        Update: Partial<Omit<Company, 'id' | 'created_at'>>
      }
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
      }
      projects_translations: {
        Row: ProjectTranslation
        Insert: Omit<ProjectTranslation, 'id' | 'created_at'>
        Update: Partial<Omit<ProjectTranslation, 'id' | 'created_at'>>
      }
      experiences: {
        Row: Experience
        Insert: Omit<Experience, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Experience, 'id' | 'created_at' | 'updated_at'>>
      }
      experience_translations: {
        Row: ExperienceTranslation
        Insert: Omit<ExperienceTranslation, 'id' | 'created_at'>
        Update: Partial<Omit<ExperienceTranslation, 'id' | 'created_at'>>
      }
      certifications: {
        Row: Certificate
        Insert: Omit<Certificate, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Certificate, 'id' | 'created_at' | 'updated_at'>>
      }
      certification_translations: {
        Row: CertificationTranslation
        Insert: Omit<CertificationTranslation, 'id' | 'created_at'>
        Update: Partial<Omit<CertificationTranslation, 'id' | 'created_at'>>
      }
      services: {
        Row: Service
        Insert: Omit<Service, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>
      }
      service_translations: {
        Row: ServiceTranslation
        Insert: Omit<ServiceTranslation, 'id' | 'created_at'>
        Update: Partial<Omit<ServiceTranslation, 'id' | 'created_at'>>
      }
      testimonials: {
        Row: Testimonial
        Insert: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>>
      }
      testimonial_translations: {
        Row: TestimonialTranslation
        Insert: Omit<TestimonialTranslation, 'id' | 'created_at'>
        Update: Partial<Omit<TestimonialTranslation, 'id' | 'created_at'>>
      }
      articles: {
        Row: Article
        Insert: Omit<Article, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Article, 'id' | 'created_at' | 'updated_at'>>
      }
      article_translations: {
        Row: ArticleTranslation
        Insert: Omit<ArticleTranslation, 'id' | 'created_at'>
        Update: Partial<Omit<ArticleTranslation, 'id' | 'created_at'>>
      }
      hero_sections: {
        Row: HeroSection
        Insert: Omit<HeroSection, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<HeroSection, 'id' | 'created_at' | 'updated_at'>>
      }
      hero_section_translations: {
        Row: HeroSectionTranslation
        Insert: Omit<HeroSectionTranslation, 'id' | 'created_at'>
        Update: Partial<Omit<HeroSectionTranslation, 'id' | 'created_at'>>
      }
      statistics: {
        Row: Statistic
        Insert: Omit<Statistic, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Statistic, 'id' | 'created_at' | 'updated_at'>>
      }
      statistic_translations: {
        Row: StatisticTranslation
        Insert: Omit<StatisticTranslation, 'id' | 'created_at'>
        Update: Partial<Omit<StatisticTranslation, 'id' | 'created_at'>>
      }
      faqs: {
        Row: FAQ
        Insert: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<FAQ, 'id' | 'created_at' | 'updated_at'>>
      }
      faq_translations: {
        Row: FAQTranslation
        Insert: Omit<FAQTranslation, 'id' | 'created_at'>
        Update: Partial<Omit<FAQTranslation, 'id' | 'created_at'>>
      }
      tools_logo: {
        Row: TechItem
        Insert: Omit<TechItem, 'id' | 'created_at'>
        Update: Partial<Omit<TechItem, 'id' | 'created_at'>>
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


