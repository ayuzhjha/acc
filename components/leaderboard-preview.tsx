"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Minus, ArrowRight, Flame } from "lucide-react"
import { leaderboard } from "@/lib/data"
import { cn } from "@/lib/utils"

const rankColors = {
  1: "from-amber-400 to-yellow-500 text-amber-900",
  2: "from-slate-300 to-slate-400 text-slate-800",
  3: "from-orange-400 to-amber-600 text-amber-900",
}

export function LeaderboardPreview() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Leaderboard</h2>
            <p className="text-muted-foreground mt-1">Top performers this week</p>
          </div>
          <Button variant="outline" className="gap-2 border-border bg-secondary hover:bg-secondary/80">
            View Full Leaderboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <Card className="border-border bg-card overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.user.id}
                  className={cn(
                    "flex items-center gap-4 p-4 transition-colors hover:bg-secondary/50",
                    index === 0 && "bg-gradient-to-r from-amber-500/5 to-transparent",
                  )}
                >
                  {/* Rank */}
                  <div className="w-12 flex justify-center">
                    {entry.rank <= 3 ? (
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br",
                          rankColors[entry.rank as keyof typeof rankColors],
                        )}
                      >
                        {entry.rank}
                      </div>
                    ) : (
                      <span className="text-lg font-semibold text-muted-foreground">{entry.rank}</span>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={entry.user.avatarUrl || "/placeholder.svg"} alt={entry.user.name} />
                      <AvatarFallback className="bg-primary/20 text-primary text-sm">
                        {entry.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{entry.user.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{entry.solves} solves</span>
                        {entry.streak > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-orange-400">
                              <Flame className="h-3.5 w-3.5" />
                              {entry.streak}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Weekly Change */}
                  <div className="hidden sm:flex items-center gap-1 w-20 justify-center">
                    {entry.weeklyChange > 0 ? (
                      <Badge
                        variant="outline"
                        className="gap-1 text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                      >
                        <TrendingUp className="h-3 w-3" />+{entry.weeklyChange}
                      </Badge>
                    ) : entry.weeklyChange < 0 ? (
                      <Badge variant="outline" className="gap-1 text-red-400 border-red-500/30 bg-red-500/10">
                        <TrendingDown className="h-3 w-3" />
                        {entry.weeklyChange}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 text-muted-foreground border-border bg-secondary">
                        <Minus className="h-3 w-3" />0
                      </Badge>
                    )}
                  </div>

                  {/* Points */}
                  <div className="w-24 text-right">
                    <span className="text-lg font-bold text-primary">{entry.points.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground ml-1">pts</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
