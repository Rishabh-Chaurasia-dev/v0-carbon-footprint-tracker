import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, CheckCircle2, Clock, XCircle } from "lucide-react"
import type { Redemption, Voucher } from "@/lib/types"
import { format } from "date-fns"

interface RedemptionHistoryProps {
  redemptions: (Redemption & { vouchers: Voucher })[]
}

const statusConfig = {
  pending: {
    label: "Active",
    icon: Clock,
    variant: "secondary" as const,
  },
  used: {
    label: "Used",
    icon: CheckCircle2,
    variant: "default" as const,
  },
  expired: {
    label: "Expired",
    icon: XCircle,
    variant: "destructive" as const,
  },
}

export function RedemptionHistory({ redemptions }: RedemptionHistoryProps) {
  if (redemptions.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="py-12">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No redemptions yet</h3>
            <p className="text-sm text-muted-foreground">Your redeemed vouchers will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {redemptions.map((redemption) => {
            const status = statusConfig[redemption.status]
            const StatusIcon = status.icon

            return (
              <div
                key={redemption.id}
                className="flex items-start justify-between gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{redemption.vouchers?.name}</h4>
                      <p className="text-sm text-muted-foreground">{redemption.vouchers?.company_name}</p>
                    </div>
                    <Badge variant={status.variant} className="flex items-center gap-1">
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Code: <span className="font-mono font-medium text-foreground">{redemption.redemption_code}</span>
                    </span>
                    <span className="text-muted-foreground">
                      {format(new Date(redemption.redeemed_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
