"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Users, Trophy } from "lucide-react"
import { stats } from "@/lib/data"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 blur-[120px] rounded-full" />

      <div className="container relative mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-primary/30 bg-primary/5">
            <Zap className="mr-2 h-3.5 w-3.5 text-primary" />
            Week 48 Challenge is Live
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            <span className="text-foreground">ACM Weekly</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Coding Challenge
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty">
            Solve. Submit. Climb the leaderboard. Join weekly challenges, earn badges, and level up your coding skills
            with the ACM Student Chapter.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="px-8 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
            >
              Join This Week&apos;s Challenge
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 border-border bg-secondary/50 hover:bg-secondary">
              View Leaderboard
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <StatItem
              icon={<Users className="h-5 w-5" />}
              value={stats.totalParticipants.toLocaleString()}
              label="Active Members"
            />
            <StatItem
              icon={<Trophy className="h-5 w-5" />}
              value={stats.challengesCompleted.toString()}
              label="Challenges Run"
            />
            <StatItem
              icon={<Zap className="h-5 w-5" />}
              value={stats.totalSubmissions.toLocaleString()}
              label="Submissions"
            />
            <StatItem
              icon={<span className="text-lg">🔥</span>}
              value={`${stats.activeStreak} weeks`}
              label="Active Streak"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 text-primary mb-1">
        {icon}
        <span className="text-2xl md:text-3xl font-bold text-foreground">{value}</span>
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}
