"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { currentUser } from "@/lib/data"
import {
  Github,
  Mail,
  Building2,
  Calendar,
  Trophy,
  Flame,
  Target,
  TrendingUp,
  Award,
  Settings,
  Share2,
  Download,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"

const activityData = [
  { date: "2024-11-25", count: 3 },
  { date: "2024-11-24", count: 1 },
  { date: "2024-11-23", count: 2 },
  { date: "2024-11-22", count: 0 },
  { date: "2024-11-21", count: 4 },
  { date: "2024-11-20", count: 1 },
  { date: "2024-11-19", count: 2 },
]

const submissionHistory = [
  { id: "1", challenge: "Two Sum Variations", status: "accepted", score: 100, date: "2024-11-25" },
  { id: "2", challenge: "Binary Tree Serialization", status: "accepted", score: 145, date: "2024-11-20" },
  { id: "3", challenge: "Linked List Cycle", status: "accepted", score: 90, date: "2024-11-15" },
  { id: "4", challenge: "Graph Traversal", status: "pending", score: 0, date: "2024-11-10" },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="border-border bg-card mb-8 overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20" />

          <CardContent className="relative pb-6">
            {/* Avatar */}
            <div className="absolute -top-16 left-6">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={currentUser.avatarUrl || "/placeholder.svg"} alt={currentUser.name} />
                <AvatarFallback className="bg-primary/20 text-primary text-3xl">
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Settings className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            {/* Info */}
            <div className="mt-12">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{currentUser.name}</h1>
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                  #{currentUser.rank}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {currentUser.email}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {currentUser.college}
                </span>
                {currentUser.githubHandle && (
                  <span className="flex items-center gap-1">
                    <Github className="h-4 w-4" />@{currentUser.githubHandle}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined{" "}
                  {new Date(currentUser.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <StatCard
                  icon={<Trophy className="h-5 w-5 text-primary" />}
                  value={currentUser.points.toLocaleString()}
                  label="Total Points"
                />
                <StatCard icon={<Target className="h-5 w-5 text-emerald-400" />} value="15" label="Problems Solved" />
                <StatCard
                  icon={<Flame className="h-5 w-5 text-orange-400" />}
                  value={`${currentUser.streak} weeks`}
                  label="Current Streak"
                />
                <StatCard
                  icon={<Award className="h-5 w-5 text-amber-400" />}
                  value={currentUser.badges.length.toString()}
                  label="Badges Earned"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start bg-secondary mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 m-0">
                {/* Activity Heatmap */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-1">
                      {Array.from({ length: 52 }).map((_, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                          {Array.from({ length: 7 }).map((_, dayIndex) => {
                            const intensity = Math.random()
                            return (
                              <div
                                key={dayIndex}
                                className={cn(
                                  "w-3 h-3 rounded-sm",
                                  intensity === 0 && "bg-secondary",
                                  intensity > 0 && intensity < 0.3 && "bg-primary/30",
                                  intensity >= 0.3 && intensity < 0.6 && "bg-primary/50",
                                  intensity >= 0.6 && intensity < 0.8 && "bg-primary/70",
                                  intensity >= 0.8 && "bg-primary",
                                )}
                              />
                            )
                          })}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
                      <span>Less</span>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-secondary" />
                        <div className="w-3 h-3 rounded-sm bg-primary/30" />
                        <div className="w-3 h-3 rounded-sm bg-primary/50" />
                        <div className="w-3 h-3 rounded-sm bg-primary/70" />
                        <div className="w-3 h-3 rounded-sm bg-primary" />
                      </div>
                      <span>More</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Progress */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Skills Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <SkillProgress label="Arrays & Strings" progress={85} />
                    <SkillProgress label="Trees & Graphs" progress={65} />
                    <SkillProgress label="Dynamic Programming" progress={45} />
                    <SkillProgress label="System Design" progress={30} />
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {submissionHistory.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 rounded-lg bg-secondary border border-border"
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            item.status === "accepted" ? "bg-emerald-500/20" : "bg-amber-500/20",
                          )}
                        >
                          {item.status === "accepted" ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          ) : (
                            <Clock className="h-5 w-5 text-amber-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{item.challenge}</p>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                        </div>
                        {item.status === "accepted" && (
                          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                            +{item.score} pts
                          </Badge>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="submissions" className="m-0">
                <Card className="border-border bg-card">
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {submissionHistory.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors"
                        >
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                              item.status === "accepted" ? "bg-emerald-500/20" : "bg-amber-500/20",
                            )}
                          >
                            {item.status === "accepted" ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            ) : (
                              <Clock className="h-5 w-5 text-amber-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{item.challenge}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{item.date}</span>
                              <span>•</span>
                              <span className={item.status === "accepted" ? "text-emerald-400" : "text-amber-400"}>
                                {item.status === "accepted" ? "Accepted" : "Pending"}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            {item.status === "accepted" && <p className="font-bold text-primary">+{item.score}</p>}
                          </div>
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="badges" className="m-0">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {currentUser.badges.map((badge) => (
                    <Card key={badge.id} className="border-border bg-card hover:border-primary/50 transition-colors">
                      <CardContent className="p-6 text-center">
                        <div className="text-5xl mb-3">{badge.icon}</div>
                        <h3 className="font-semibold text-foreground mb-1">{badge.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Earned {new Date(badge.earnedAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Locked Badges */}
                  {[
                    { name: "Gold Champion", icon: "🥇", description: "Achieve Top 1 finish" },
                    { name: "Streak Legend", icon: "💎", description: "20 week participation streak" },
                  ].map((badge, idx) => (
                    <Card key={idx} className="border-border bg-card opacity-50">
                      <CardContent className="p-6 text-center">
                        <div className="text-5xl mb-3 grayscale">{badge.icon}</div>
                        <h3 className="font-semibold text-foreground mb-1">{badge.name}</h3>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          Locked
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Export Achievements */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Export Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Download Certificate
                </Button>
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <Share2 className="h-4 w-4" />
                  Share to LinkedIn
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  &quot;ACM Weekly Challenge — Rank #{currentUser.rank} (Nov 2024)&quot;
                </p>
              </CardContent>
            </Card>

            {/* Rank Progress */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Rank Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-4xl font-bold text-primary">#{currentUser.rank}</p>
                  <p className="text-sm text-muted-foreground">Current Rank</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Points to #11</span>
                    <span className="text-foreground font-medium">150 pts</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Connect GitHub */}
            {!currentUser.githubHandle && (
              <Card className="border-orange-500/30 bg-orange-500/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Github className="h-6 w-6 text-orange-400" />
                    <h3 className="font-semibold text-foreground">Connect GitHub</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Link your GitHub account to submit PR-based challenges and showcase your contributions.
                  </p>
                  <Button className="w-full gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                    <Github className="h-4 w-4" />
                    Connect GitHub
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="p-4 rounded-lg bg-secondary border border-border">
      <div className="flex items-center gap-2 mb-2">{icon}</div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

function SkillProgress({ label, progress }: { label: string; progress: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-foreground">{label}</span>
        <span className="text-muted-foreground">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}
