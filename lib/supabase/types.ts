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
      blog_reactions: {
        Row: BlogReactionRow;
        Insert: Omit<BlogReactionRow, "created_at">;
        Update: Partial<Omit<BlogReactionRow, "post_id" | "visitor_key">>;
      };
      blog_comments: {
        Row: BlogCommentRow;
        Insert: Omit<BlogCommentRow, "id" | "created_at" | "updated_at" | "status"> &
          Partial<Pick<BlogCommentRow, "status">>;
        Update: Partial<Omit<BlogCommentRow, "id">>;
      };
      blog_posts: {
        Row: BlogPostRow;
        Insert: Omit<
          BlogPostRow,
          | "id"
          | "created_at"
          | "updated_at"
          | "reaction_counts"
          | "locale"
          | "status"
          | "source"
        > &
          Partial<
            Pick<
              BlogPostRow,
              "reaction_counts" | "locale" | "status" | "source"
            >
          >;
        Update: Partial<Omit<BlogPostRow, "id">>;
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

export type BlogCategory =
  | "programming"
  | "education"
  | "web"
  | "career"
  | "opinion"
  | "news-commentary";

export type BlogStatus = "draft" | "published" | "archived";

export interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  body_md: string;
  category: BlogCategory;
  tags: string[];
  locale: string;
  status: BlogStatus;
  cover_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  reading_time_minutes: number | null;
  reaction_counts: Record<string, number>;
  source: "agent" | "admin";
  published_at: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AllowedUserRow {
  id: string;
  email: string;
  created_at?: string;
}

export interface BlogReactionRow {
  post_id: string;
  reaction: "like" | "insightful" | "useful";
  visitor_key: string;
  created_at?: string;
}

export type BlogCommentStatus = "pending" | "approved" | "rejected";

export interface BlogCommentRow {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  status: BlogCommentStatus;
  created_at?: string;
  updated_at?: string;
}

// ── Frontend-friendly types ──────────────────────────────────────────────────

export type BlogPost = BlogPostRow;
export type BlogReaction = BlogReactionRow;
export type BlogComment = BlogCommentRow;
export type Project = ProjectRow;
export type Certificate = CertificateRow;
export type Company = CompanyRow;
