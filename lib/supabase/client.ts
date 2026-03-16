import { createBrowserClient } from "@supabase/ssr"

declare global {
  interface Window {
    __supabase_client?: ReturnType<typeof createBrowserClient>
  }
}

let cachedClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (cachedClient) {
    return cachedClient
  }

  if (typeof window !== "undefined" && window.__supabase_client) {
    cachedClient = window.__supabase_client
    return cachedClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  const client = createBrowserClient(supabaseUrl, supabaseAnonKey)
  cachedClient = client

  if (typeof window !== "undefined") {
    window.__supabase_client = client
  }

  return client
}
