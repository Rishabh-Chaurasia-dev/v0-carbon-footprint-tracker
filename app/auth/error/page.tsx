import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Leaf, AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-semibold text-foreground">EcoTrack</span>
          </div>
          <Card className="border-border">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Authentication Error</CardTitle>
              <CardDescription className="mt-2">
                Something went wrong during the authentication process. Please try again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <Link href="/auth/login">
                  <Button className="w-full">Try again</Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost" className="w-full">
                    Return to home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
