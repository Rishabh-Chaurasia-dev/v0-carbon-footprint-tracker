import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function PortfolioPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Credit Portfolio</h1>
        <p className="text-muted-foreground">
          Track your purchased credits, retirements, and ESG progress.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg mb-2">Portfolio Coming Soon</CardTitle>
          <CardDescription className="text-center max-w-md">
            Your credit portfolio will show all purchased and retired credits, along with analytics on your carbon offset progress and ESG compliance.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
