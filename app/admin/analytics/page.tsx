"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Code2,
  ArrowLeft,
  BarChart3,
  Users,
  FileText,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const participationData = [
  { week: "W44", participants: 145, submissions: 89 },
  { week: "W45", participants: 178, submissions: 134 },
  { week: "W46", participants: 203, submissions: 156 },
  { week: "W47", participants: 189, submissions: 142 },
  { week: "W48", participants: 234, submissions: 178 },
]

const difficultyDistribution = [
  { name: "Easy", value: 35, color: "#22c55e" },
  { name: "Medium", value: 45, color: "#f59e0b" },
  { name: "Hard", value: 20, color: "#ef4444" },
]

const retentionData = [
  { week: 1, retained: 100 },
  { week: 2, retained: 78 },
  { week: 3, retained: 65 },
  { week: 4, retained: 58 },
  { week: 5, retained: 52 },
  { week: 6, retained: 48 },
  { week: 7, retained: 45 },
  { week: 8, retained: 42 },
]

const topChallenges = [
  { name: "Two Sum Variations", submissions: 156, passRate: 78 },
  { name: "Binary Tree Serialization", submissions: 89, passRate: 65 },
  { name: "Linked List Cycle", submissions: 134, passRate: 82 },
  { name: "Graph Traversal", submissions: 67, passRate: 45 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Code2 className="h-5 w-5" />
              </div>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Track participation, engagement, and platform performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard title="Total Participants" value="1,247" change={12} icon={<Users className="h-5 w-5" />} />
          <MetricCard title="Avg. Pass Rate" value="68%" change={5} icon={<Target className="h-5 w-5" />} />
          <MetricCard title="Weekly Retention" value="72%" change={-3} icon={<Activity className="h-5 w-5" />} />
          <MetricCard title="Avg. Submissions/Week" value="156" change={18} icon={<FileText className="h-5 w-5" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Participation Trend */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Participation Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  participants: { label: "Participants", color: "hsl(var(--primary))" },
                  submissions: { label: "Submissions", color: "hsl(var(--accent))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={participationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="participants"
                      stackId="1"
                      stroke="var(--color-participants)"
                      fill="var(--color-participants)"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="submissions"
                      stackId="2"
                      stroke="var(--color-submissions)"
                      fill="var(--color-submissions)"
                      fillOpacity={0.3}
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Difficulty Distribution */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Submissions by Difficulty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={difficultyDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {difficultyDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Retention Curve */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Weekly Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  retained: { label: "Retained %", color: "hsl(var(--primary))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={retentionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="week"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(v) => `Week ${v}`}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v}%`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="retained"
                      stroke="var(--color-retained)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-retained)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Top Challenges */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Most Attempted Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topChallenges.map((challenge, index) => (
                  <div key={challenge.name} className="flex items-center gap-4">
                    <span className="text-lg font-bold text-muted-foreground w-6">{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{challenge.name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{challenge.submissions} submissions</span>
                        <span className="text-emerald-400">{challenge.passRate}% pass rate</span>
                      </div>
                    </div>
                    <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(challenge.submissions / 156) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function MetricCard({
  title,
  value,
  change,
  icon,
}: {
  title: string
  value: string
  change: number
  icon: React.ReactNode
}) {
  const isPositive = change >= 0
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
          <Badge
            variant="outline"
            className={
              isPositive
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 gap-1"
                : "border-red-500/30 bg-red-500/10 text-red-400 gap-1"
            }
          >
            {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {isPositive ? "+" : ""}
            {change}%
          </Badge>
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </CardContent>
    </Card>
  )
}
