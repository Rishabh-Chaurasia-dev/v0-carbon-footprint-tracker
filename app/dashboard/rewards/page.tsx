import { createClient } from "@/lib/supabase/server"
import { VoucherGrid } from "@/components/dashboard/voucher-grid"
import { RedemptionHistory } from "@/components/dashboard/redemption-history"
import { PointsBalance } from "@/components/dashboard/points-balance"
import type { Profile, Voucher, Redemption } from "@/lib/types"

export default async function RewardsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user profile for points balance
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  // Fetch available vouchers
  const { data: vouchers } = await supabase
    .from("vouchers")
    .select("*")
    .eq("is_active", true)
    .gt("remaining", 0)
    .order("points_required", { ascending: true })

  // Fetch user's redemption history
  const { data: redemptions } = await supabase
    .from("redemptions")
    .select(`*, vouchers(*)`)
    .eq("user_id", user?.id)
    .order("redeemed_at", { ascending: false })
    .limit(10)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Rewards</h1>
        <p className="text-muted-foreground mt-1">Redeem your points for exclusive vouchers and offers</p>
      </div>

      <PointsBalance profile={profile as Profile | null} />

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Available Vouchers</h2>
        <VoucherGrid vouchers={(vouchers as Voucher[]) || []} userPoints={profile?.total_points || 0} />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Redemption History</h2>
        <RedemptionHistory redemptions={(redemptions as (Redemption & { vouchers: Voucher })[]) || []} />
      </div>
    </div>
  )
}
