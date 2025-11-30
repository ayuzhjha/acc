export type ChallengeType = "external" | "file" | "github"
export type Difficulty = "easy" | "medium" | "hard"
export type SubmissionStatus = "pending" | "graded" | "flagged"
export type UserRole = "student" | "admin"

export interface User {
  id: string
  name: string
  email: string
  verified: boolean
  githubHandle?: string
  avatarUrl?: string
  college: string
  role: UserRole
  badges: Badge[]
  points: number
  rank?: number
  streak: number
  joinedAt: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
  type: "achievement" | "streak" | "rank" | "special"
}

export interface Challenge {
  id: string
  title: string
  type: ChallengeType
  description: string
  shortDescription: string
  startAt: string
  endAt: string
  tags: string[]
  difficulty: Difficulty
  externalUrl?: string
  attachments: Attachment[]
  pointsSchema: PointsSchema
  submissionCount: number
  participantCount: number
  week: number
  year: number
  status: "upcoming" | "active" | "ended"
  prize?: string
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: "starter-code" | "resource" | "testcase"
}

export interface PointsSchema {
  base: number
  timeBonus: boolean
  firstSolveBonus: number
}

export interface Submission {
  id: string
  userId: string
  challengeId: string
  type: ChallengeType
  fileUrl?: string
  repoUrl?: string
  status: SubmissionStatus
  score: number
  createdAt: string
  feedback?: string
}

export interface LeaderboardEntry {
  rank: number
  user: User
  points: number
  solves: number
  streak: number
  weeklyChange: number
}

export interface PlagiarismReport {
  id: string
  submissionA: string
  submissionB: string
  similarityScore: number
  flaggedBy: string
  createdAt: string
  status: "pending" | "reviewed" | "cleared"
}
