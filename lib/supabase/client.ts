import { createBrowserClient } from "@supabase/ssr"

const SUPABASE_CLIENT_KEY = "__supabase_client__"

export function createClient() {
  if (typeof window === "undefined") {
    // Server-side: create new client each time
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    )
  }

  // Browser-side: use singleton stored on window
  const windowWithSupabase = window as typeof window & {
    [SUPABASE_CLIENT_KEY]?: ReturnType<typeof createBrowserClient>
  }

  if (windowWithSupabase[SUPABASE_CLIENT_KEY]) {
    return windowWithSupabase[SUPABASE_CLIENT_KEY]
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  windowWithSupabase[SUPABASE_CLIENT_KEY] = createBrowserClient(supabaseUrl, supabaseAnonKey)

  return windowWithSupabase[SUPABASE_CLIENT_KEY]
}
