import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Coins, TreeDeciduous, Activity } from "lucide-react"
import type { Profile } from "@/lib/types"

interface StatsCardsProps {
  profile: Profile | null
  activitiesCount: number
}

export function StatsCards({ profile, activitiesCount }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Points",
      value: profile?.total_points?.toLocaleString() || "0",
      description: "Available for redemption",
      icon: Coins,
    },
    {
      title: "Carbon Saved",
      value: `${profile?.carbon_saved_kg?.toFixed(1) || "0"} kg`,
      description: "CO2 equivalent",
      icon: Leaf,
    },
    {
      title: "Trees Equivalent",
      value: Math.floor((profile?.carbon_saved_kg || 0) / 21.77).toString(),
      description: "Annual tree absorption",
      icon: TreeDeciduous,
    },
    {
      title: "Activities Logged",
      value: activitiesCount.toString(),
      description: "Total contributions",
      icon: Activity,
    },
  ]

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
