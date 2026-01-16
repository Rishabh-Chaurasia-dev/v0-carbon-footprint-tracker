import { createClient } from "@/lib/supabase/server"
import { ActivityLogForm } from "@/components/dashboard/activity-log-form"
import type { ActivityType } from "@/lib/types"

export default async function LogActivityPage() {
  const supabase = await createClient()

  // Fetch all activity types, filtering out removed ones
  const { data: activityTypes } = await supabase
    .from("activity_types")
    .select("*")
    .neq("name", "Composting")
    .neq("name", "Beach/Park Cleanup")
    .neq("name", "Community Garden")
    .neq("name", "Recycling")
    .neq("name", "Tote Bag Usage")
    .neq("name", "Tree Planting")
    .order("name", { ascending: true })

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Log Activity</h1>
        <p className="text-muted-foreground mt-1">Record your eco-friendly actions and earn points</p>
      </div>

      <ActivityLogForm activityTypes={(activityTypes as ActivityType[]) || []} />
    </div>
  )
}
