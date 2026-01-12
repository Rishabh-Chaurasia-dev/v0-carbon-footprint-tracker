import { createClient } from "@/lib/supabase/server"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { ImpactChart } from "@/components/dashboard/impact-chart"
import type { Profile, Activity, ActivityType } from "@/lib/types"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  // Fetch recent activities with activity type info
  const { data: activities } = await supabase
    .from("activities")
    .select(`*, activity_types(*)`)
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Fetch activity stats for chart (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: weeklyActivities } = await supabase
    .from("activities")
    .select("created_at, carbon_saved_kg, points_earned")
    .eq("user_id", user?.id)
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: true })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your environmental impact overview</p>
      </div>

      <StatsCards profile={profile as Profile | null} activitiesCount={activities?.length || 0} />

      <div className="grid lg:grid-cols-2 gap-6">
        <ImpactChart activities={weeklyActivities || []} />
        <RecentActivities activities={(activities as (Activity & { activity_types: ActivityType })[]) || []} />
      </div>
    </div>
  )
}
