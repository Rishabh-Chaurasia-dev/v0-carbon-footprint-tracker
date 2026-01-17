import { createClient } from "@/lib/supabase/server"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { ImpactChart } from "@/components/dashboard/impact-chart"
import type { Profile, Activity, ActivityType } from "@/lib/types"

export default async function DashboardPage() {
  const supabase = await createClient()

  let user = null
  let profile = null
  let activities: (Activity & { activity_types: ActivityType })[] = []
  let weeklyActivities: { created_at: string; carbon_saved_kg: number; points_earned: number }[] = []

  try {
    const { data: userData } = await supabase.auth.getUser()
    user = userData?.user

    if (user) {
      // Fetch user profile
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      profile = profileData

      // Fetch recent activities with activity type info
      const { data: activitiesData } = await supabase
        .from("activities")
        .select(`*, activity_types(*)`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)
      activities = (activitiesData as (Activity & { activity_types: ActivityType })[]) || []

      // Fetch activity stats for chart (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { data: weeklyData } = await supabase
        .from("activities")
        .select("created_at, carbon_saved_kg, points_earned")
        .eq("user_id", user.id)
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: true })
      weeklyActivities = weeklyData || []
    }
  } catch (err) {
    console.error("Error fetching dashboard data:", err)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your environmental impact overview</p>
      </div>

      <StatsCards profile={profile as Profile | null} activitiesCount={activities.length} />

      <div className="grid lg:grid-cols-2 gap-6">
        <ImpactChart activities={weeklyActivities} />
        <RecentActivities activities={activities} />
      </div>
    </div>
  )
}
