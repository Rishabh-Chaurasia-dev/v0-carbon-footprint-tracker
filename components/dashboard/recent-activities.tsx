import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import {
  Sun,
  ShoppingBag,
  Car,
  Bus,
  Bike,
  TreeDeciduous,
  Trash,
  Leaf,
  Recycle,
  Salad,
  Flower,
  PlusCircle,
  type LucideIcon,
} from "lucide-react"
import type { Activity, ActivityType } from "@/lib/types"

interface RecentActivitiesProps {
  activities: (Activity & { activity_types: ActivityType })[]
}

const iconMap: Record<string, LucideIcon> = {
  sun: Sun,
  "shopping-bag": ShoppingBag,
  car: Car,
  bus: Bus,
  bike: Bike,
  "tree-deciduous": TreeDeciduous,
  trash: Trash,
  leaf: Leaf,
  recycle: Recycle,
  salad: Salad,
  flower: Flower,
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  if (activities.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No activities yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start logging your eco-friendly actions to see them here
            </p>
            <Link href="/dashboard/log">
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                Log your first activity
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Activities</CardTitle>
        <Link href="/dashboard/log">
          <Button variant="ghost" size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            Log New
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = iconMap[activity.activity_types?.icon || "leaf"] || Leaf
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.activity_types?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.quantity} {activity.activity_types?.unit}
                        {activity.quantity > 1 ? "s" : ""}
                      </p>
                    </div>
                    <Badge variant="secondary" className="flex-shrink-0">
                      +{activity.points_earned} pts
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
