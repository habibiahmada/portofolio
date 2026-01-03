import { supabaseAdmin } from "@/lib/supabase/admin"

export async function getDashboardData() {
  const db = supabaseAdmin

  // Parallel Fetching
  const [
    projects,
    articles,
    experiences,
    certifications,
    testimonials,
    services,
    tools,
    messagesCount,
    recentMessages
  ] = await Promise.all([
    db.from("projects").select("*", { count: "exact", head: true }),
    db.from("articles").select("*", { count: "exact", head: true }),
    db.from("experiences").select("*", { count: "exact", head: true }),
    db.from("certifications").select("*", { count: "exact", head: true }),
    db.from("testimonials").select("*", { count: "exact", head: true }),
    db.from("services").select("*", { count: "exact", head: true }),
    db.from("tools_logo").select("*", { count: "exact", head: true }),
    db.from("contacts").select("*", { count: "exact", head: true }),
    db.from("contacts")
      .select("*")
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  return {
    counts: {
      projects: projects.count ?? 0,
      articles: articles.count ?? 0,
      experiences: experiences.count ?? 0,
      certifications: certifications.count ?? 0,
      testimonials: testimonials.count ?? 0,
      services: services.count ?? 0,
      tools: tools.count ?? 0,
      messages: messagesCount.count ?? 0
    },
    messages: recentMessages.data ?? []
  }
}