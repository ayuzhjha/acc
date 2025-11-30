"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Code2,
  ArrowLeft,
  AlertTriangle,
  Search,
  Flag,
  CheckCircle2,
  XCircle,
  Eye,
  FileCode,
  Users,
  Calendar,
  Percent,
} from "lucide-react"
import { cn } from "@/lib/utils"

const plagiarismReports = [
  {
    id: "1",
    submissionA: { id: "SUB-234", user: "John Smith", challenge: "Two Sum Variations" },
    submissionB: { id: "SUB-256", user: "Jane Doe", challenge: "Two Sum Variations" },
    similarity: 87,
    status: "pending",
    flaggedAt: "2024-11-28T10:30:00Z",
    matchedLines: 45,
    totalLines: 52,
  },
  {
    id: "2",
    submissionA: { id: "SUB-189", user: "Mike Johnson", challenge: "Binary Tree Serialization" },
    submissionB: { id: "SUB-201", user: "Sarah Lee", challenge: "Binary Tree Serialization" },
    similarity: 72,
    status: "reviewed",
    flaggedAt: "2024-11-27T14:15:00Z",
    matchedLines: 38,
    totalLines: 53,
    resolution: "cleared",
  },
  {
    id: "3",
    submissionA: { id: "SUB-312", user: "Alex Chen", challenge: "Linked List Cycle" },
    submissionB: { id: "SUB-318", user: "Emily Wang", challenge: "Linked List Cycle" },
    similarity: 94,
    status: "reviewed",
    flaggedAt: "2024-11-26T09:00:00Z",
    matchedLines: 67,
    totalLines: 71,
    resolution: "confirmed",
  },
]

export default function PlagiarismPage() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReport, setSelectedReport] = useState<(typeof plagiarismReports)[0] | null>(null)

  const filteredReports = plagiarismReports.filter((report) => {
    if (filter !== "all" && report.status !== filter) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        report.submissionA.user.toLowerCase().includes(query) ||
        report.submissionB.user.toLowerCase().includes(query) ||
        report.submissionA.challenge.toLowerCase().includes(query)
      )
    }
    return true
  })

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
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Flag className="h-4 w-4" />
              Run Full Scan
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-8 w-8 text-amber-400" />
            <h1 className="text-3xl font-bold text-foreground">Plagiarism Detection</h1>
          </div>
          <p className="text-muted-foreground">Review flagged submissions and manage academic integrity</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {plagiarismReports.filter((r) => r.status === "pending").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {plagiarismReports.filter((r) => r.resolution === "confirmed").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Confirmed Cases</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {plagiarismReports.filter((r) => r.resolution === "cleared").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Cleared</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Percent className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">70%</p>
                  <p className="text-sm text-muted-foreground">Threshold</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user or challenge..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="bg-secondary">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Reports List */}
        <Card className="border-border bg-card">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredReports.map((report) => (
                <div key={report.id} className="p-4 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Severity Indicator */}
                    <div
                      className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
                        report.similarity >= 85 ? "bg-red-500/20" : "bg-amber-500/20",
                      )}
                    >
                      <span
                        className={cn("text-lg font-bold", report.similarity >= 85 ? "text-red-400" : "text-amber-400")}
                      >
                        {report.similarity}%
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            report.status === "pending"
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                              : report.resolution === "confirmed"
                                ? "border-red-500/30 bg-red-500/10 text-red-400"
                                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
                          )}
                        >
                          {report.status === "pending"
                            ? "Pending Review"
                            : report.resolution === "confirmed"
                              ? "Plagiarism Confirmed"
                              : "Cleared"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {report.matchedLines} / {report.totalLines} lines matched
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="p-3 rounded-lg bg-secondary border border-border">
                          <div className="flex items-center gap-2 text-sm mb-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{report.submissionA.user}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{report.submissionA.id}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary border border-border">
                          <div className="flex items-center gap-2 text-sm mb-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{report.submissionB.user}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{report.submissionB.id}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileCode className="h-4 w-4" />
                          {report.submissionA.challenge}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(report.flaggedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Eye className="h-4 w-4" />
                        Compare
                      </Button>
                      {report.status === "pending" && (
                        <>
                          <Button size="sm" variant="destructive" className="gap-2">
                            <XCircle className="h-4 w-4" />
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 bg-transparent"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Clear
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">No plagiarism cases found</p>
            <p className="text-muted-foreground">All submissions are looking clean!</p>
          </div>
        )}
      </main>
    </div>
  )
}
