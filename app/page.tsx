import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Sun, Car, TreeDeciduous, Gift, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">Carbonova</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#rewards" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Rewards
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm mb-6">
              <Leaf className="w-4 h-4" />
              <span>Make every action count</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight text-balance">
              Track Your Positive Carbon Footprint
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Log your eco-friendly activities, monitor your environmental impact, and earn rewards for making
              sustainable choices. Turn your green actions into real value.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Tracking Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary">12.5K+</div>
              <div className="mt-1 text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary">850K</div>
              <div className="mt-1 text-sm text-muted-foreground">kg CO2 Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary">25K+</div>
              <div className="mt-1 text-sm text-muted-foreground">Trees Planted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary">$45K</div>
              <div className="mt-1 text-sm text-muted-foreground">Rewards Redeemed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">Track Every Green Action</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              From renewable energy to sustainable transportation, log all your eco-friendly activities in one place.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <Sun className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Solar Energy</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your solar panel app and automatically track the clean energy you generate.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Green Transportation</h3>
                <p className="text-sm text-muted-foreground">
                  Log miles driven in EVs, hybrids, or public transport. Every sustainable trip counts.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <TreeDeciduous className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Tree Planting</h3>
                <p className="text-sm text-muted-foreground">
                  Document your plantation activities with photos and earn significant carbon credits.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Sustainable Choices</h3>
                <p className="text-sm text-muted-foreground">
                  Upload photos of tote bag usage, composting, recycling, and other daily eco-actions.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Impact Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize your carbon savings with detailed charts and track your progress over time.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Earn Rewards</h3>
                <p className="text-sm text-muted-foreground">
                  Convert your eco-points into vouchers, discounts, or cash from partnering companies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-card/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
            <p className="mt-4 text-muted-foreground">Three simple steps to start making an impact</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Log Your Activities</h3>
              <p className="text-muted-foreground">
                Enter data from your solar app, upload photos of eco-actions, or log sustainable transportation miles.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Earn Points</h3>
              <p className="text-muted-foreground">
                Each activity earns you points based on its environmental impact. Watch your carbon savings grow.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Redeem Rewards</h3>
              <p className="text-muted-foreground">
                Exchange your points for vouchers, discounts, or cash offers from our partner companies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section id="rewards" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Turn Green Actions Into Real Value</h2>
              <p className="text-muted-foreground mb-8">
                Our partner network offers exclusive rewards for eco-conscious individuals. The more you contribute to a
                sustainable future, the more you earn.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Discounts at eco-friendly stores and cafes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Free services like bike rentals and solar cleaning</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Cash conversion options for high earners</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Exclusive partnership deals and early access</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link href="/auth/sign-up">
                  <Button size="lg">
                    Join Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-border">
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-primary">500</div>
                  <div className="text-sm text-muted-foreground mt-1">Points</div>
                  <div className="mt-4 text-sm font-medium text-foreground">Coffee Shop Discount</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-primary">1,000</div>
                  <div className="text-sm text-muted-foreground mt-1">Points</div>
                  <div className="mt-4 text-sm font-medium text-foreground">$10 Store Credit</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-primary">2,500</div>
                  <div className="text-sm text-muted-foreground mt-1">Points</div>
                  <div className="mt-4 text-sm font-medium text-foreground">Fashion Voucher</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-primary">5,000</div>
                  <div className="text-sm text-muted-foreground mt-1">Points</div>
                  <div className="mt-4 text-sm font-medium text-foreground">Tree Adoption</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to Make a Difference?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of eco-conscious individuals who are tracking their impact and earning rewards for a
            sustainable future.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" variant="secondary">
              Create Your Free Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">Carbonova</span>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Carbonova. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
