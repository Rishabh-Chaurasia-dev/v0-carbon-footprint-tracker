import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"

export default function MarketplacePage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Credit Marketplace</h1>
        <p className="text-muted-foreground">
          Browse and purchase verified carbon credits from individual generators.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <ShoppingCart className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg mb-2">Marketplace Coming Soon</CardTitle>
          <CardDescription className="text-center max-w-md">
            The carbon credit marketplace is being built. Soon you will be able to browse, filter, and purchase verified carbon credits listed by individual generators.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
