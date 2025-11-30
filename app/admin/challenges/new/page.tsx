"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Code2,
  ArrowLeft,
  ExternalLink,
  Upload,
  Github,
  Calendar,
  Trophy,
  Plus,
  X,
  Save,
  Eye,
  FileCode,
  Link2,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const challengeTypes = [
  {
    value: "external",
    label: "External Platform",
    icon: ExternalLink,
    description: "Redirect to LeetCode, HackerRank, etc.",
  },
  { value: "file", label: "File Upload", icon: Upload, description: "Upload solution files for judging" },
  { value: "github", label: "GitHub", icon: Github, description: "Submit via PR or repository link" },
]

export default function NewChallengePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [tags, setTags] = useState<string[]>(["Arrays"])
  const [newTag, setNewTag] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    type: "external",
    difficulty: "medium",
    description: "",
    shortDescription: "",
    externalUrl: "",
    startDate: "",
    startTime: "00:00",
    endDate: "",
    endTime: "23:59",
    basePoints: 100,
    timeBonus: true,
    firstSolveBonus: 50,
    prize: "",
  })

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSave = () => {
    console.log("Saving challenge:", { ...formData, tags })
    router.push("/admin/challenges")
  }

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
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Create Challenge
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Challenge</h1>
          <p className="text-muted-foreground">Set up a new weekly coding challenge for participants</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start bg-secondary mb-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="scoring">Scoring</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 m-0">
            {/* Challenge Type */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Challenge Type</CardTitle>
                <CardDescription>How will participants submit their solutions?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {challengeTypes.map((type) => (
                    <div
                      key={type.value}
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-all",
                        formData.type === type.value
                          ? "border-primary bg-primary/10"
                          : "border-border bg-secondary hover:border-primary/50",
                      )}
                    >
                      <type.icon
                        className={cn(
                          "h-6 w-6 mb-3",
                          formData.type === type.value ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      <p className="font-medium text-foreground">{type.label}</p>
                      <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Basic Details */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Basic Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Challenge Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Two Sum Variations"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(v) => setFormData({ ...formData, difficulty: v })}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.type === "external" && (
                    <div className="space-y-2">
                      <Label htmlFor="externalUrl">External URL</Label>
                      <Input
                        id="externalUrl"
                        placeholder="https://leetcode.com/problems/..."
                        value={formData.externalUrl}
                        onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                        className="bg-secondary border-border"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Input
                    id="shortDescription"
                    placeholder="Brief one-line description for cards"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                        {tag}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 hover:bg-destructive/20"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                      className="bg-secondary border-border"
                    />
                    <Button variant="outline" onClick={handleAddTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Start Date & Time</Label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="bg-secondary border-border"
                      />
                      <Input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="bg-secondary border-border w-32"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label>End Date & Time</Label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="bg-secondary border-border"
                      />
                      <Input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="bg-secondary border-border w-32"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6 m-0">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Challenge Description</CardTitle>
                <CardDescription>Full problem description, instructions, and rules. Supports Markdown.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="# Challenge Title

## Problem Statement
Describe the problem here...

## Examples
Input: [1, 2, 3]
Output: 6

## Constraints
- 1 <= nums.length <= 10^4

## Scoring
- Base points: 100
- Time bonus available for early submissions"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[400px] bg-secondary border-border font-mono text-sm"
                />
              </CardContent>
            </Card>

            {/* Plagiarism Warning */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-400">Academic Integrity Notice</p>
                <p className="text-sm text-muted-foreground mt-1">
                  All challenges automatically include the plagiarism warning. Submissions will be checked for
                  similarity.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scoring" className="space-y-6 m-0">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Points Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="basePoints">Base Points</Label>
                    <Input
                      id="basePoints"
                      type="number"
                      value={formData.basePoints}
                      onChange={(e) => setFormData({ ...formData, basePoints: Number.parseInt(e.target.value) })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstSolveBonus">First Solve Bonus</Label>
                    <Input
                      id="firstSolveBonus"
                      type="number"
                      value={formData.firstSolveBonus}
                      onChange={(e) => setFormData({ ...formData, firstSolveBonus: Number.parseInt(e.target.value) })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time Bonus</Label>
                    <div className="flex items-center gap-3 h-10">
                      <Switch
                        checked={formData.timeBonus}
                        onCheckedChange={(checked) => setFormData({ ...formData, timeBonus: checked })}
                      />
                      <span className="text-sm text-muted-foreground">
                        {formData.timeBonus ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prize">Prize (Optional)</Label>
                  <Input
                    id="prize"
                    placeholder="e.g., $50 Amazon Gift Card"
                    value={formData.prize}
                    onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6 m-0">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-primary" />
                  Attachments
                </CardTitle>
                <CardDescription>Upload starter code, test cases, or other resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium text-foreground">Drop files here or click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported: .py, .java, .cpp, .js, .json, .zip (max 10MB)
                  </p>
                  <Button variant="outline" className="mt-4 gap-2 bg-transparent">
                    <Upload className="h-4 w-4" />
                    Browse Files
                  </Button>
                </div>

                {formData.type === "github" && (
                  <div className="mt-6 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Github className="h-5 w-5 text-orange-400" />
                      <span className="font-medium text-foreground">Template Repository</span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://github.com/acm-chapter/template-repo"
                        className="bg-secondary border-border"
                      />
                      <Button variant="outline" className="gap-2 bg-transparent">
                        <Link2 className="h-4 w-4" />
                        Verify
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
