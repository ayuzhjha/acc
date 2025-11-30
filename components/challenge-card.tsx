"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Challenge } from "@/lib/types"
import { ExternalLink, Upload, Github, Clock, Users, Trophy, ArrowRight, Gift } from "lucide-react"
import { cn } from "@/lib/utils"

const typeConfig = {
  external: { icon: ExternalLink, label: "External", color: "text-blue-400" },
  file: { icon: Upload, label: "File Upload", color: "text-emerald-400" },
  github: { icon: Github, label: "GitHub", color: "text-orange-400" },
}

const difficultyConfig = {
  easy: { label: "Easy", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  medium: { label: "Medium", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  hard: { label: "Hard", color: "bg-red-500/20 text-red-400 border-red-500/30" },
}

const statusConfig = {
  upcoming: { label: "Upcoming", color: "bg-primary/20 text-primary border-primary/30" },
  active: { label: "Active", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  ended: { label: "Ended", color: "bg-muted text-muted-foreground border-border" },
}

interface ChallengeCardProps {
  challenge: Challenge
  onViewDetails: (challenge: Challenge) => void
}

export function ChallengeCard({ challenge, onViewDetails }: ChallengeCardProps) {
  const TypeIcon = typeConfig[challenge.type].icon
  const timeLeft = getTimeLeft(challenge.endAt, challenge.status)
  const progress = challenge.status === "ended" ? 100 : getProgress(challenge.startAt, challenge.endAt)

  return (
    <Card className="group relative overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <Badge variant="outline" className={cn("text-xs", statusConfig[challenge.status].color)}>
          {statusConfig[challenge.status].label}
        </Badge>
      </div>

      {/* Prize Banner */}
      {challenge.prize && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary/20 to-accent/20 px-4 py-1.5 flex items-center justify-center gap-2 border-b border-primary/20">
          <Gift className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">{challenge.prize}</span>
        </div>
      )}

      <CardHeader className={cn("pb-3", challenge.prize && "pt-10")}>
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
              "bg-secondary border-border group-hover:border-primary/50 transition-colors",
            )}
          >
            <TypeIcon className={cn("h-5 w-5", typeConfig[challenge.type].color)} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {challenge.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("text-xs", typeConfig[challenge.type].color)}>
                {typeConfig[challenge.type].label}
              </span>
              <span className="text-muted-foreground">•</span>
              <Badge
                variant="outline"
                className={cn("text-xs px-2 py-0", difficultyConfig[challenge.difficulty].color)}
              >
                {difficultyConfig[challenge.difficulty].label}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{challenge.shortDescription}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {challenge.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
              {tag}
            </Badge>
          ))}
          {challenge.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-secondary text-muted-foreground">
              +{challenge.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Progress Bar */}
        {challenge.status === "active" && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {timeLeft}
              </div>
              <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{challenge.participantCount}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Upload className="h-4 w-4" />
            <span>{challenge.submissionCount}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-primary ml-auto">
            <Trophy className="h-4 w-4" />
            <span className="font-medium">{challenge.pointsSchema.base} pts</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          className="w-full gap-2 bg-secondary hover:bg-primary hover:text-primary-foreground transition-all"
          onClick={() => onViewDetails(challenge)}
        >
          {challenge.status === "active" ? "Join Challenge" : "View Details"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

function getTimeLeft(endAt: string, status: Challenge["status"]): string {
  if (status === "ended") return "Ended"
  if (status === "upcoming") return "Not started"

  const end = new Date(endAt)
  const now = new Date()
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) return "Ended"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) return `${days}d ${hours}h left`
  return `${hours}h left`
}

function getProgress(startAt: string, endAt: string): number {
  const start = new Date(startAt).getTime()
  const end = new Date(endAt).getTime()
  const now = Date.now()

  if (now <= start) return 0
  if (now >= end) return 100

  return ((now - start) / (end - start)) * 100
}
