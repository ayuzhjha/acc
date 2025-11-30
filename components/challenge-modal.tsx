"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Challenge } from "@/lib/types"
import {
  ExternalLink,
  Upload,
  Github,
  Clock,
  Users,
  Trophy,
  Download,
  FileCode,
  MessageSquare,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Link2,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"

const typeConfig = {
  external: { icon: ExternalLink, label: "External Platform", color: "text-blue-400" },
  file: { icon: Upload, label: "File Upload", color: "text-emerald-400" },
  github: { icon: Github, label: "GitHub", color: "text-orange-400" },
}

const difficultyConfig = {
  easy: { label: "Easy", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  medium: { label: "Medium", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  hard: { label: "Hard", color: "bg-red-500/20 text-red-400 border-red-500/30" },
}

interface ChallengeModalProps {
  challenge: Challenge | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChallengeModal({ challenge, open, onOpenChange }: ChallengeModalProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [submissionUrl, setSubmissionUrl] = useState("")
  const [comment, setComment] = useState("")

  if (!challenge) return null

  const TypeIcon = typeConfig[challenge.type].icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col bg-card border-border">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border",
                "bg-secondary border-border",
              )}
            >
              <TypeIcon className={cn("h-6 w-6", typeConfig[challenge.type].color)} />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-bold text-foreground pr-8">{challenge.title}</DialogTitle>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <Badge variant="outline" className={cn("text-xs", difficultyConfig[challenge.difficulty].color)}>
                  {difficultyConfig[challenge.difficulty].label}
                </Badge>
                <span className={cn("text-sm", typeConfig[challenge.type].color)}>
                  {typeConfig[challenge.type].label}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5 text-primary" />
                  {challenge.pointsSchema.base} points
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-auto p-0">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="submit"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Upload className="h-4 w-4 mr-2" />
              Submit
            </TabsTrigger>
            <TabsTrigger
              value="discussion"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Discussion
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <FileCode className="h-4 w-4 mr-2" />
              Resources
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="overview" className="m-0 space-y-6">
              {/* Challenge Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoCard icon={<Clock className="h-4 w-4" />} label="Duration" value="7 days" />
                <InfoCard
                  icon={<Users className="h-4 w-4" />}
                  label="Participants"
                  value={challenge.participantCount.toString()}
                />
                <InfoCard
                  icon={<Upload className="h-4 w-4" />}
                  label="Submissions"
                  value={challenge.submissionCount.toString()}
                />
                <InfoCard
                  icon={<Trophy className="h-4 w-4" />}
                  label="First Solve Bonus"
                  value={`+${challenge.pointsSchema.firstSolveBonus}`}
                />
              </div>

              {/* Description */}
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="bg-secondary rounded-lg p-4 border border-border">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-foreground/90">
                    {challenge.description}
                  </pre>
                </div>
              </div>

              {/* Rules Notice */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-400">Academic Integrity</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    No plagiarism. Submissions may be automatically checked for similarity. Violations will result in
                    disqualification.
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Topics</p>
                <div className="flex flex-wrap gap-2">
                  {challenge.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="submit" className="m-0 space-y-6">
              {challenge.type === "external" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm text-foreground mb-3">
                      Complete this challenge on the external platform, then submit your solution URL as proof.
                    </p>
                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                      <ExternalLink className="h-4 w-4" />
                      Open on LeetCode
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="solution-url">Solution URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="solution-url"
                        placeholder="https://leetcode.com/submissions/..."
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        className="bg-secondary border-border"
                      />
                      <Button className="gap-2 bg-primary hover:bg-primary/90">
                        <CheckCircle2 className="h-4 w-4" />
                        Submit
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {challenge.type === "file" && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground">Drop your solution file here</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supported: .py, .java, .cpp, .js, .ts (max 5MB)
                    </p>
                    <Button variant="outline" className="mt-4 gap-2 bg-transparent">
                      <Upload className="h-4 w-4" />
                      Browse Files
                    </Button>
                  </div>
                </div>
              )}

              {challenge.type === "github" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <p className="text-sm text-foreground mb-3">
                      Fork the template repository, implement your solution, and submit your repo URL or PR link.
                    </p>
                    <Button className="gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                      <Github className="h-4 w-4" />
                      Fork Template Repo
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="repo-url">Repository / PR URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="repo-url"
                        placeholder="https://github.com/username/repo"
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        className="bg-secondary border-border"
                      />
                      <Button className="gap-2 bg-primary hover:bg-primary/90">
                        <Link2 className="h-4 w-4" />
                        Submit
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="discussion" className="m-0 space-y-4">
              {/* Comment Input */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Ask a question or share your approach..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-secondary border-border min-h-[80px]"
                />
                <div className="flex justify-end">
                  <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                    <Send className="h-4 w-4" />
                    Post Comment
                  </Button>
                </div>
              </div>

              {/* Sample Comments */}
              <div className="space-y-4 pt-4 border-t border-border">
                <CommentItem
                  author="Priya Patel"
                  avatar="/female-developer.png"
                  time="2 hours ago"
                  content="Has anyone tried the sliding window approach? I'm getting TLE on larger inputs."
                />
                <CommentItem
                  author="Marcus Johnson"
                  avatar="/male-developer.png"
                  time="1 hour ago"
                  content="Try optimizing with a hash map instead. Brought my solution down from O(n²) to O(n)."
                  isReply
                />
              </div>
            </TabsContent>

            <TabsContent value="resources" className="m-0 space-y-4">
              {challenge.attachments.length > 0 ? (
                challenge.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <FileCode className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{attachment.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{attachment.type.replace("-", " ")}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileCode className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p>No resources available for this challenge.</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-secondary border border-border">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  )
}

function CommentItem({
  author,
  avatar,
  time,
  content,
  isReply = false,
}: {
  author: string
  avatar: string
  time: string
  content: string
  isReply?: boolean
}) {
  return (
    <div className={cn("flex gap-3", isReply && "ml-8")}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={avatar || "/placeholder.svg"} alt={author} />
        <AvatarFallback className="bg-primary/20 text-primary text-xs">
          {author
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground text-sm">{author}</span>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className="text-sm text-foreground/90 mt-1">{content}</p>
      </div>
    </div>
  )
}
