"use client"

import type React from "react"
import { signup } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Leaf, User, Building2 } from "lucide-react"
import type { UserRole } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function SignUpPage() {
  const [role, setRole] = useState<UserRole | null>(null)
  const [fullName, setFullName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) {
      setError("Please select your account type")
      return
    }
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    if (role === "industry" && !companyName.trim()) {
      setError("Company name is required for industry accounts")
      setIsLoading(false)
      return
    }

    try {
      const result = await signup({
        email,
        password,
        fullName,
        role,
        companyName: role === "industry" ? companyName : undefined,
      })
      if (result.error) {
        setError(result.error)
      } else {
        router.push("/auth/sign-up-success")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-lg">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-semibold text-foreground">Carbonova</span>
          </div>
          <Card className="border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>Choose your account type to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-5">
                  {/* Role Selection */}
                  <div className="grid gap-2">
                    <Label>I am registering as</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole("individual")}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all cursor-pointer",
                          role === "individual"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/30"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center",
                          role === "individual" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          <User className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                          <p className={cn(
                            "font-medium text-sm",
                            role === "individual" ? "text-primary" : "text-foreground"
                          )}>Individual</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Earn & sell credits</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("industry")}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all cursor-pointer",
                          role === "industry"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/30"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center",
                          role === "industry" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                          <p className={cn(
                            "font-medium text-sm",
                            role === "industry" ? "text-primary" : "text-foreground"
                          )}>Industry</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Buy & offset credits</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Conditional Fields */}
                  {role && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="fullName">
                          {role === "industry" ? "Contact Person Name" : "Full Name"}
                        </Label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder={role === "industry" ? "Jane Smith" : "John Doe"}
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>

                      {role === "industry" && (
                        <div className="grid gap-2">
                          <Label htmlFor="companyName">Company Name</Label>
                          <Input
                            id="companyName"
                            type="text"
                            placeholder="Acme Corporation"
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                          />
                        </div>
                      )}

                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={role === "industry" ? "contact@company.com" : "you@example.com"}
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="repeat-password">Confirm Password</Label>
                        <Input
                          id="repeat-password"
                          type="password"
                          required
                          value={repeatPassword}
                          onChange={(e) => setRepeatPassword(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <Button type="submit" className="w-full" disabled={isLoading || !role}>
                    {isLoading
                      ? "Creating account..."
                      : role
                        ? `Create ${role === "industry" ? "Industry" : "Individual"} Account`
                        : "Select account type"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  {"Already have an account? "}
                  <Link href="/auth/login" className="text-primary underline underline-offset-4">
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
