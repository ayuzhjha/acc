import type { Challenge, LeaderboardEntry, User } from "./types"

export const currentUser: User = {
  id: "1",
  name: "Alex Chen",
  email: "alex.chen@university.edu",
  verified: true,
  githubHandle: "alexchen",
  avatarUrl: "/developer-avatar.png",
  college: "State University",
  role: "student",
  badges: [
    {
      id: "1",
      name: "First Blood",
      description: "First solve of a challenge",
      icon: "🎯",
      earnedAt: "2024-01-15",
      type: "achievement",
    },
    { id: "2", name: "On Fire", description: "5 week streak", icon: "🔥", earnedAt: "2024-02-20", type: "streak" },
    { id: "3", name: "Bronze Champion", description: "Top 3 finish", icon: "🥉", earnedAt: "2024-03-01", type: "rank" },
  ],
  points: 2450,
  rank: 12,
  streak: 5,
  joinedAt: "2024-01-01",
}

export const challenges: Challenge[] = [
  {
    id: "1",
    title: "Two Sum Variations",
    type: "external",
    description: `# Two Sum Variations

Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

## Challenge
Solve this classic problem and its variations on LeetCode. Submit your solution URL as proof of completion.

## Scoring
- Base points: 100
- Time bonus: +50 for submissions within first 24 hours
- First solve bonus: +100

## Rules
- No plagiarism. Submissions are automatically checked for similarity.
- You must submit your own solution link.`,
    shortDescription: "Classic array manipulation problem with variations. Solve on LeetCode.",
    startAt: "2024-11-25T00:00:00Z",
    endAt: "2024-12-02T23:59:59Z",
    tags: ["Arrays", "Hash Table", "Beginner Friendly"],
    difficulty: "easy",
    externalUrl: "https://leetcode.com/problems/two-sum/",
    attachments: [],
    pointsSchema: { base: 100, timeBonus: true, firstSolveBonus: 100 },
    submissionCount: 156,
    participantCount: 203,
    week: 48,
    year: 2024,
    status: "active",
  },
  {
    id: "2",
    title: "Binary Tree Serialization",
    type: "file",
    description: `# Binary Tree Serialization

Design an algorithm to serialize and deserialize a binary tree.

## Task
Implement two functions:
1. \`serialize(root)\` - Encodes a tree to a single string
2. \`deserialize(data)\` - Decodes your encoded data to tree

## Submission
Upload your solution file (Python, Java, C++, or JavaScript).

## Scoring
- Correctness: 70 points
- Efficiency: 20 points
- Code quality: 10 points`,
    shortDescription: "Implement tree serialization/deserialization. Upload your solution.",
    startAt: "2024-11-18T00:00:00Z",
    endAt: "2024-11-25T23:59:59Z",
    tags: ["Trees", "DFS", "Design"],
    difficulty: "medium",
    attachments: [
      { id: "1", name: "starter_code.py", url: "#", type: "starter-code" },
      { id: "2", name: "test_cases.json", url: "#", type: "testcase" },
    ],
    pointsSchema: { base: 150, timeBonus: false, firstSolveBonus: 75 },
    submissionCount: 89,
    participantCount: 145,
    week: 47,
    year: 2024,
    status: "ended",
  },
  {
    id: "3",
    title: "Rate Limiter Implementation",
    type: "github",
    description: `# Rate Limiter Implementation

Build a distributed rate limiter that can handle high throughput.

## Requirements
- Token bucket or sliding window algorithm
- Redis integration
- REST API endpoints
- Unit tests

## Submission
Fork the template repo and submit a PR with your implementation.

## Evaluation
- Functionality: 50%
- Scalability: 25%
- Code quality & tests: 25%`,
    shortDescription: "Build a distributed rate limiter. Submit via GitHub PR.",
    startAt: "2024-12-02T00:00:00Z",
    endAt: "2024-12-09T23:59:59Z",
    tags: ["System Design", "Redis", "API"],
    difficulty: "hard",
    attachments: [
      {
        id: "3",
        name: "template_repo",
        url: "https://github.com/acm-chapter/rate-limiter-template",
        type: "starter-code",
      },
    ],
    pointsSchema: { base: 200, timeBonus: true, firstSolveBonus: 150 },
    submissionCount: 23,
    participantCount: 67,
    week: 49,
    year: 2024,
    status: "upcoming",
    prize: "$50 Amazon Gift Card",
  },
  {
    id: "4",
    title: "Graph Algorithms Sprint",
    type: "external",
    description: `# Graph Algorithms Sprint

Master graph algorithms through a series of progressive challenges on HackerRank.

## Problems
1. BFS Shortest Path
2. DFS Connected Components
3. Dijkstra's Algorithm
4. Minimum Spanning Tree

## Scoring
Complete all 4 problems for maximum points.`,
    shortDescription: "Four progressive graph problems on HackerRank.",
    startAt: "2024-12-09T00:00:00Z",
    endAt: "2024-12-16T23:59:59Z",
    tags: ["Graphs", "BFS", "DFS", "Advanced"],
    difficulty: "hard",
    externalUrl: "https://hackerrank.com/",
    attachments: [],
    pointsSchema: { base: 250, timeBonus: true, firstSolveBonus: 200 },
    submissionCount: 0,
    participantCount: 34,
    week: 50,
    year: 2024,
    status: "upcoming",
  },
]

export const leaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    user: {
      ...currentUser,
      id: "10",
      name: "Sarah Kim",
      points: 4200,
      rank: 1,
      avatarUrl: "/female-developer.png",
      badges: [],
    },
    points: 4200,
    solves: 28,
    streak: 12,
    weeklyChange: 0,
  },
  {
    rank: 2,
    user: {
      ...currentUser,
      id: "11",
      name: "Marcus Johnson",
      points: 3850,
      rank: 2,
      avatarUrl: "/male-developer.png",
      badges: [],
    },
    points: 3850,
    solves: 25,
    streak: 8,
    weeklyChange: 1,
  },
  {
    rank: 3,
    user: {
      ...currentUser,
      id: "12",
      name: "Priya Patel",
      points: 3600,
      rank: 3,
      avatarUrl: "/indian-female-developer.jpg",
      badges: [],
    },
    points: 3600,
    solves: 24,
    streak: 10,
    weeklyChange: -1,
  },
  {
    rank: 4,
    user: {
      ...currentUser,
      id: "13",
      name: "James Wilson",
      points: 3200,
      rank: 4,
      avatarUrl: "/asian-male-developer.png",
      badges: [],
    },
    points: 3200,
    solves: 21,
    streak: 6,
    weeklyChange: 2,
  },
  {
    rank: 5,
    user: {
      ...currentUser,
      id: "14",
      name: "Emily Zhang",
      points: 2900,
      rank: 5,
      avatarUrl: "/chinese-female-developer.jpg",
      badges: [],
    },
    points: 2900,
    solves: 19,
    streak: 4,
    weeklyChange: 0,
  },
]

export const stats = {
  totalParticipants: 1247,
  challengesCompleted: 48,
  totalSubmissions: 8934,
  activeStreak: 52,
}
