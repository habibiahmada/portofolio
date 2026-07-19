export interface Database {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow;
        Insert: Omit<ProjectRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ProjectRow, "id">>;
      };
      certificates: {
        Row: CertificateRow;
        Insert: Omit<CertificateRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<CertificateRow, "id">>;
      };
      companies: {
        Row: CompanyRow;
        Insert: Omit<CompanyRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<CompanyRow, "id">>;
      };
      allowed_users: {
        Row: AllowedUserRow;
        Insert: Omit<AllowedUserRow, "id" | "created_at">;
        Update: Partial<Omit<AllowedUserRow, "id">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export interface ProjectRow {
  id: string;
  title_en: string;
  title_id: string;
  description_en: string;
  description_id: string;
  image: string;
  tags: string[];
  live_url: string;
  github_url: string;
  year: number;
  created_at?: string;
  updated_at?: string;
}

export interface CertificateRow {
  id: string;
  org: string;
  title: string;
  description: string;
  pages: string[];
  thumb: string;
  is_pinned: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyRow {
  id: string;
  name: string;
  logo: string;
  created_at?: string;
  updated_at?: string;
}

export interface AllowedUserRow {
  id: string;
  email: string;
  created_at?: string;
}

// ── Frontend-friendly types ──────────────────────────────────────────────────

export type Project = ProjectRow;
export type Certificate = CertificateRow;
export type Company = CompanyRow;
