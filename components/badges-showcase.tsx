"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

const badges = [
  { id: "1", name: "First Blood", description: "First to solve a challenge", icon: "🎯", rarity: "rare" },
  { id: "2", name: "Streak Master", description: "10 week participation streak", icon: "🔥", rarity: "epic" },
  { id: "3", name: "Gold Champion", description: "Top 1 finish", icon: "🥇", rarity: "legendary" },
  { id: "4", name: "Silver Star", description: "Top 2 finish", icon: "🥈", rarity: "epic" },
  { id: "5", name: "Bronze Hero", description: "Top 3 finish", icon: "🥉", rarity: "rare" },
  { id: "6", name: "Community Helper", description: "Help 10 students in discussions", icon: "💬", rarity: "uncommon" },
]

const rarityColors = {
  common: "border-slate-500/30 bg-slate-500/10",
  uncommon: "border-emerald-500/30 bg-emerald-500/10",
  rare: "border-blue-500/30 bg-blue-500/10",
  epic: "border-purple-500/30 bg-purple-500/10",
  legendary: "border-amber-500/30 bg-amber-500/10",
}

export function BadgesShowcase() {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
                Gamification
              </Badge>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Earn Badges</h2>
            <p className="text-muted-foreground mt-1">Showcase your achievements and climb the ranks</p>
          </div>
          <Button variant="outline" className="gap-2 border-border bg-secondary hover:bg-secondary/80">
            View All Badges
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge) => (
            <Card
              key={badge.id}
              className={`group border bg-card hover:scale-105 transition-all duration-300 cursor-pointer ${rarityColors[badge.rarity as keyof typeof rarityColors]}`}
            >
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{badge.icon}</div>
                <p className="font-semibold text-foreground text-sm">{badge.name}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{badge.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
