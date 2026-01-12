"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { format, parseISO, startOfDay, eachDayOfInterval, subDays } from "date-fns"

interface ImpactChartProps {
  activities: {
    created_at: string
    carbon_saved_kg: number
    points_earned: number
  }[]
}

export function ImpactChart({ activities }: ImpactChartProps) {
  // Generate last 7 days
  const today = new Date()
  const sevenDaysAgo = subDays(today, 6)
  const days = eachDayOfInterval({ start: sevenDaysAgo, end: today })

  // Aggregate activities by day
  const chartData = days.map((day) => {
    const dayStart = startOfDay(day)
    const dayActivities = activities.filter((a) => {
      const activityDate = startOfDay(parseISO(a.created_at))
      return activityDate.getTime() === dayStart.getTime()
    })

    const totalCarbon = dayActivities.reduce((sum, a) => sum + Number(a.carbon_saved_kg), 0)
    const totalPoints = dayActivities.reduce((sum, a) => sum + a.points_earned, 0)

    return {
      date: format(day, "EEE"),
      carbon: Number(totalCarbon.toFixed(2)),
      points: totalPoints,
    }
  })

  const chartConfig = {
    carbon: {
      label: "Carbon Saved (kg)",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">Weekly Impact</CardTitle>
        <CardDescription>Carbon saved over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} tickMargin={8} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="carbon" fill="var(--color-carbon)" radius={[4, 4, 0, 0]} name="Carbon (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
