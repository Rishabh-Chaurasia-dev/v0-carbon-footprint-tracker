"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Gift, Clock, Store, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import type { Voucher } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

interface VoucherGridProps {
  vouchers: Voucher[]
  userPoints: number
}

function generateRedemptionCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = "ECO-"
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function VoucherGrid({ vouchers, userPoints }: VoucherGridProps) {
  const router = useRouter()
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [redemptionResult, setRedemptionResult] = useState<{
    success: boolean
    code?: string
    message?: string
  } | null>(null)

  const handleRedeem = async () => {
    if (!selectedVoucher) return

    setIsRedeeming(true)
    setRedemptionResult(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const redemptionCode = generateRedemptionCode()

      const { error } = await supabase.from("redemptions").insert({
        user_id: user.id,
        voucher_id: selectedVoucher.id,
        points_spent: selectedVoucher.points_required,
        redemption_code: redemptionCode,
      })

      if (error) throw error

      setRedemptionResult({
        success: true,
        code: redemptionCode,
      })

      setTimeout(() => {
        router.refresh()
      }, 2000)
    } catch (err) {
      setRedemptionResult({
        success: false,
        message: err instanceof Error ? err.message : "Failed to redeem voucher",
      })
    } finally {
      setIsRedeeming(false)
    }
  }

  const closeDialog = () => {
    setSelectedVoucher(null)
    setRedemptionResult(null)
  }

  if (vouchers.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="py-12">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No vouchers available</h3>
            <p className="text-sm text-muted-foreground">Check back later for new rewards!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vouchers.map((voucher) => {
          const canAfford = userPoints >= voucher.points_required
          const isExpiringSoon =
            voucher.expires_at && new Date(voucher.expires_at).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000

          return (
            <Card key={voucher.id} className="border-border flex flex-col">
              <CardContent className="pt-6 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                    <Store className="w-6 h-6 text-primary" />
                  </div>
                  {isExpiringSoon && (
                    <Badge variant="destructive" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      Expiring soon
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-foreground mb-1">{voucher.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{voucher.company_name}</p>
                {voucher.description && <p className="text-sm text-muted-foreground mb-3">{voucher.description}</p>}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">{voucher.points_required.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground ml-1">pts</span>
                  </div>
                  {voucher.value_amount && <Badge variant="secondary">${voucher.value_amount.toFixed(2)} value</Badge>}
                </div>
                {voucher.expires_at && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Expires {formatDistanceToNow(new Date(voucher.expires_at), { addSuffix: true })}
                  </p>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  className="w-full"
                  variant={canAfford ? "default" : "secondary"}
                  disabled={!canAfford}
                  onClick={() => setSelectedVoucher(voucher)}
                >
                  {canAfford ? "Redeem" : `Need ${(voucher.points_required - userPoints).toLocaleString()} more pts`}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <Dialog open={!!selectedVoucher} onOpenChange={() => closeDialog()}>
        <DialogContent>
          {!redemptionResult ? (
            <>
              <DialogHeader>
                <DialogTitle>Confirm Redemption</DialogTitle>
                <DialogDescription>
                  You are about to redeem the following voucher. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              {selectedVoucher && (
                <div className="py-4">
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <h4 className="font-semibold text-foreground">{selectedVoucher.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedVoucher.company_name}</p>
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Points required:</span>
                        <span className="font-semibold text-foreground">
                          {selectedVoucher.points_required.toLocaleString()} pts
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Your balance after:</span>
                        <span className="font-semibold text-foreground">
                          {(userPoints - selectedVoucher.points_required).toLocaleString()} pts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog} className="bg-transparent">
                  Cancel
                </Button>
                <Button onClick={handleRedeem} disabled={isRedeeming}>
                  {isRedeeming ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Redeeming...
                    </>
                  ) : (
                    "Confirm Redemption"
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : redemptionResult.success ? (
            <>
              <DialogHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <DialogTitle className="text-center">Redemption Successful!</DialogTitle>
                <DialogDescription className="text-center">
                  Your voucher has been redeemed. Use the code below at {selectedVoucher?.company_name}.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="bg-secondary rounded-lg p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Your redemption code:</p>
                  <p className="text-2xl font-mono font-bold text-foreground tracking-wider">{redemptionResult.code}</p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={closeDialog} className="w-full">
                  Done
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <DialogTitle className="text-center">Redemption Failed</DialogTitle>
                <DialogDescription className="text-center">{redemptionResult.message}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={closeDialog} className="w-full">
                  Try Again
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
