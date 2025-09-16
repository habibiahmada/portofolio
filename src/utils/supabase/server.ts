import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(
          name: string,
          value: string,
          options: Parameters<typeof cookieStore.set>[0] extends object
            ? Partial<Parameters<typeof cookieStore.set>[0]>
            : Record<string, unknown>
        ) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            throw error
          }
        },
        remove(
          name: string,
          options: Parameters<typeof cookieStore.set>[0] extends object
            ? Partial<Parameters<typeof cookieStore.set>[0]>
            : Record<string, unknown>
        ) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            throw error
          }
        },
      },
    }
  )
}
