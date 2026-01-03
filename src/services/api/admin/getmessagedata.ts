import { supabaseAdmin } from "@/lib/supabase/admin"

export async function getMessageData() {
  const db = supabaseAdmin

  // Parallel Fetching
  const [
    messagesCount,
    recentMessages
  ] = await Promise.all([
    db.from("contacts").select("*", { count: "exact", head: true }),
    db.from("contacts")
      .select("*")
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  return {
    counts: {
      messages: messagesCount.count ?? 0
    },
    messages: recentMessages.data ?? []
  }
}