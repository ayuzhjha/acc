"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { challenges, leaderboard } from "@/lib/data"
import {
  ArrowLeft,
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
  Share2,
  Flame,
  Medal,
} from "lucide-react"
import { cn } from "@/lib/utils"

const typeConfig = {
  external: { icon: ExternalLink, label: "External Platform", color: "text-blue-400", bg: "bg-blue-500/10" },
  file: { icon: Upload, label: "File Upload", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  github: { icon: Github, label: "GitHub", color: "text-orange-400", bg: "bg-orange-500/10" },
}

const difficultyConfig = {
  easy: { label: "Easy", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  medium: { label: "Medium", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  hard: { label: "Hard", color: "bg-red-500/20 text-red-400 border-red-500/30" },
}

export default function ChallengeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [submissionUrl, setSubmissionUrl] = useState("")
  const [comment, setComment] = useState("")

  const challenge = challenges.find((c) => c.id === params.id)

  if (!challenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Challenge Not Found</h1>
          <Button onClick={() => router.push("/challenges")}>Back to Challenges</Button>
        </div>
      </div>
    )
  }

  const TypeIcon = typeConfig[challenge.type].icon
  const timeLeft = getTimeLeft(challenge.endAt, challenge.status)
  const progress = challenge.status === "ended" ? 100 : getProgress(challenge.startAt, challenge.endAt)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => router.push("/challenges")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Challenges
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Challenge Header Card */}
            <Card className="border-border bg-card overflow-hidden">
              {/* Type Banner */}
              <div className={cn("px-6 py-3 flex items-center gap-3", typeConfig[challenge.type].bg)}>
                <TypeIcon className={cn("h-5 w-5", typeConfig[challenge.type].color)} />
                <span className={cn("font-medium", typeConfig[challenge.type].color)}>
                  {typeConfig[challenge.type].label}
                </span>
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl md:text-3xl mb-3">{challenge.title}</CardTitle>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline" className={cn(difficultyConfig[challenge.difficulty].color)}>
                        {difficultyConfig[challenge.difficulty].label}
                      </Badge>
                      <span className="text-sm text-muted-foreground">Week {challenge.week}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="flex items-center gap-1 text-primary font-medium">
                        <Trophy className="h-4 w-4" />
                        {challenge.pointsSchema.base} points
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {/* Progress for Active */}
                {challenge.status === "active" && (
                  <div className="mb-6 p-4 rounded-lg bg-secondary border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {timeLeft}
                      </span>
                      <span className="text-sm text-muted-foreground">{Math.round(progress)}% elapsed</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    icon={<Users className="h-4 w-4" />}
                    label="Participants"
                    value={challenge.participantCount}
                  />
                  <StatCard
                    icon={<Upload className="h-4 w-4" />}
                    label="Submissions"
                    value={challenge.submissionCount}
                  />
                  <StatCard
                    icon={<Trophy className="h-4 w-4" />}
                    label="First Solve Bonus"
                    value={`+${challenge.pointsSchema.firstSolveBonus}`}
                  />
                  <StatCard icon={<Clock className="h-4 w-4" />} label="Duration" value="7 days" />
                </div>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <Card className="border-border bg-card">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-auto p-0">
                  <TabsTrigger
                    value="overview"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="submit"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Submit
                  </TabsTrigger>
                  <TabsTrigger
                    value="discussion"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Discussion
                  </TabsTrigger>
                  <TabsTrigger
                    value="resources"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                  >
                    <FileCode className="h-4 w-4 mr-2" />
                    Resources
                  </TabsTrigger>
                </TabsList>

                <div className="p-6">
                  <TabsContent value="overview" className="m-0 space-y-6">
                    {/* Description */}
                    <div className="prose prose-invert prose-sm max-w-none">
                      <div className="bg-secondary rounded-lg p-6 border border-border">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-foreground/90 leading-relaxed">
                          {challenge.description}
                        </pre>
                      </div>
                    </div>

                    {/* Rules Notice */}
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-400">Academic Integrity Policy</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          No plagiarism. Submissions may be automatically checked for similarity using advanced code
                          analysis. Violations will result in disqualification and potential reporting to academic
                          affairs.
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3">Topics & Skills</p>
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
                    <SubmissionFlow
                      challenge={challenge}
                      submissionUrl={submissionUrl}
                      setSubmissionUrl={setSubmissionUrl}
                    />
                  </TabsContent>

                  <TabsContent value="discussion" className="m-0 space-y-6">
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Ask a question or share your approach..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="bg-secondary border-border min-h-[100px]"
                      />
                      <div className="flex justify-end">
                        <Button className="gap-2 bg-primary hover:bg-primary/90">
                          <Send className="h-4 w-4" />
                          Post Comment
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-border">
                      <CommentItem
                        author="Priya Patel"
                        avatar="/indian-female-developer.jpg"
                        time="2 hours ago"
                        content="Has anyone tried the sliding window approach? I'm getting TLE on larger inputs."
                      />
                      <CommentItem
                        author="Marcus Johnson"
                        avatar="/male-developer.png"
                        time="1 hour ago"
                        content="Try optimizing with a hash map instead. Brought my solution down from O(n²) to O(n). Happy to discuss in DMs!"
                        isReply
                      />
                      <CommentItem
                        author="Emily Zhang"
                        avatar="/chinese-female-developer.jpg"
                        time="30 minutes ago"
                        content="Great tip Marcus! Also, don't forget to handle the edge case where the array has duplicate values."
                        isReply
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="resources" className="m-0 space-y-4">
                    {challenge.attachments.length > 0 ? (
                      challenge.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-border hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <FileCode className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium text-foreground">{attachment.name}</p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {attachment.type.replace("-", " ")}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <FileCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No resources available</p>
                        <p className="text-sm mt-1">Check back later for starter code and test cases.</p>
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join CTA */}
            {challenge.status === "active" && (
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Ready to compete?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join the challenge and start solving to earn points and climb the leaderboard.
                  </p>
                  <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                    <Flame className="h-4 w-4" />
                    Join Challenge
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Challenge Leaderboard */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Medal className="h-5 w-5 text-primary" />
                  Challenge Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {leaderboard.slice(0, 5).map((entry, index) => (
                    <div key={entry.user.id} className="flex items-center gap-3 px-6 py-3">
                      <span
                        className={cn(
                          "w-6 text-center font-semibold",
                          index === 0 && "text-amber-400",
                          index === 1 && "text-slate-400",
                          index === 2 && "text-orange-400",
                          index > 2 && "text-muted-foreground",
                        )}
                      >
                        {entry.rank}
                      </span>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={entry.user.avatarUrl || "/placeholder.svg"} alt={entry.user.name} />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {entry.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex-1 font-medium text-sm truncate">{entry.user.name}</span>
                      <span className="text-sm text-primary font-medium">{entry.points}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-border">
                  <Button variant="outline" className="w-full bg-transparent" size="sm">
                    View Full Leaderboard
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Similar Challenges */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Similar Challenges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {challenges
                  .filter((c) => c.id !== challenge.id)
                  .slice(0, 3)
                  .map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-lg bg-secondary border border-border hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/challenges/${c.id}`)}
                    >
                      <p className="font-medium text-sm text-foreground line-clamp-1">{c.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={cn("text-xs px-2 py-0", difficultyConfig[c.difficulty].color)}
                        >
                          {difficultyConfig[c.difficulty].label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{c.pointsSchema.base} pts</span>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="p-4 rounded-lg bg-secondary border border-border">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="font-semibold text-lg text-foreground">{value}</p>
    </div>
  )
}

function SubmissionFlow({
  challenge,
  submissionUrl,
  setSubmissionUrl,
}: {
  challenge: (typeof challenges)[0]
  submissionUrl: string
  setSubmissionUrl: (v: string) => void
}) {
  if (challenge.type === "external") {
    return (
      <div className="space-y-6">
        <div className="p-6 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-3 mb-3">
            <ExternalLink className="h-6 w-6 text-blue-400" />
            <h3 className="font-semibold text-foreground">External Platform Challenge</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Complete this challenge on the external platform, then submit your solution URL as proof of completion.
          </p>
          <Button className="gap-2 bg-blue-500 hover:bg-blue-600 text-white">
            <ExternalLink className="h-4 w-4" />
            Open Challenge on LeetCode
          </Button>
        </div>
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Solution URL</label>
          <div className="flex gap-3">
            <Input
              placeholder="https://leetcode.com/submissions/detail/..."
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              className="bg-secondary border-border flex-1"
            />
            <Button className="gap-2 bg-primary hover:bg-primary/90 shrink-0">
              <CheckCircle2 className="h-4 w-4" />
              Submit
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Paste your accepted submission URL from LeetCode</p>
        </div>
      </div>
    )
  }

  if (challenge.type === "file") {
    return (
      <div className="space-y-6">
        <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Upload className="h-8 w-8 text-emerald-400" />
          </div>
          <p className="font-medium text-foreground mb-1">Drop your solution file here</p>
          <p className="text-sm text-muted-foreground mb-4">or click to browse your files</p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {[".py", ".java", ".cpp", ".js", ".ts"].map((ext) => (
              <Badge key={ext} variant="secondary" className="bg-secondary">
                {ext}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Maximum file size: 5MB</p>
          <Button variant="outline" className="mt-4 gap-2 bg-transparent">
            <Upload className="h-4 w-4" />
            Browse Files
          </Button>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary border border-border">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground">File uploaded successfully!</p>
            <p className="text-muted-foreground">solution.py • 2.3 KB</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-lg bg-orange-500/10 border border-orange-500/20">
        <div className="flex items-center gap-3 mb-3">
          <Github className="h-6 w-6 text-orange-400" />
          <h3 className="font-semibold text-foreground">GitHub Submission</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Fork the template repository, implement your solution, and submit your repository URL or pull request link.
        </p>
        <Button className="gap-2 bg-orange-500 hover:bg-orange-600 text-white">
          <Github className="h-4 w-4" />
          Fork Template Repository
        </Button>
      </div>
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Repository / PR URL</label>
        <div className="flex gap-3">
          <Input
            placeholder="https://github.com/username/repo"
            value={submissionUrl}
            onChange={(e) => setSubmissionUrl(e.target.value)}
            className="bg-secondary border-border flex-1"
          />
          <Button className="gap-2 bg-primary hover:bg-primary/90 shrink-0">
            <Link2 className="h-4 w-4" />
            Submit
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Make sure your repository is public or you&apos;ve granted access
        </p>
      </div>
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
    <div className={cn("flex gap-3", isReply && "ml-10")}>
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarImage src={avatar || "/placeholder.svg"} alt={author} />
        <AvatarFallback className="bg-primary/20 text-primary text-xs">
          {author
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 bg-secondary rounded-lg p-4 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-foreground text-sm">{author}</span>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className="text-sm text-foreground/90">{content}</p>
      </div>
    </div>
  )
}

function getTimeLeft(endAt: string, status: string): string {
  if (status === "ended") return "Challenge ended"
  if (status === "upcoming") return "Not started yet"

  const end = new Date(endAt)
  const now = new Date()
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) return "Challenge ended"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) return `${days} days, ${hours} hours remaining`
  return `${hours} hours remaining`
}

function getProgress(startAt: string, endAt: string): number {
  const start = new Date(startAt).getTime()
  const end = new Date(endAt).getTime()
  const now = Date.now()

  if (now <= start) return 0
  if (now >= end) return 100

  return ((now - start) / (end - start)) * 100
}
