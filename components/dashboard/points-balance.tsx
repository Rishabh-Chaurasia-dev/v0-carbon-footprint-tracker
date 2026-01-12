import { Card, CardContent } from "@/components/ui/card"
import { Coins, TrendingUp } from "lucide-react"
import type { Profile } from "@/lib/types"

interface PointsBalanceProps {
  profile: Profile | null
}

export function PointsBalance({ profile }: PointsBalanceProps) {
  return (
    <Card className="border-border bg-primary text-primary-foreground">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary-foreground/80 mb-1">Your Points Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{profile?.total_points?.toLocaleString() || "0"}</span>
              <span className="text-sm text-primary-foreground/80">points available</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-primary-foreground/80">Carbon Saved</p>
              <p className="text-lg font-semibold">{profile?.carbon_saved_kg?.toFixed(1) || "0"} kg</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Coins className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-primary-foreground/20">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
            <TrendingUp className="w-4 h-4" />
            <span>Keep logging activities to earn more points!</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
