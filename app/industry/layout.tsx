import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { IndustryNav } from "@/components/industry/industry-nav"

export default async function IndustryLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Verify this user has the industry role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, company_name")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "industry") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <IndustryNav user={user} companyName={profile.company_name} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
