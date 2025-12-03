'use client';

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, TrendingUp, TrendingDown, Minus, Flame, Search, Medal, Crown, Star, Award, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { API_URL } from "@/lib/api"

const rankIcons = {
  1: Crown,
  2: Medal,
  3: Award,
}

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState("weekly")
  const [searchQuery, setSearchQuery] = useState("")
  const [leaderboardData, setLeaderboardData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${API_URL}/api/leaderboard`);
      if (res.ok) {
        const data = await res.json();
        // Add rank to data
        let currentRank = 1;
        const rankedData = data.map((user: any) => {
          const isSystemAdmin = user.role === 'admin';
          return {
            ...user,
            rank: isSystemAdmin ? null : currentRank++, // Admins get null rank
            solves: user.solvedChallenges?.length || 0,
            weeklyChange: 0
          };
        });
        setLeaderboardData(rankedData);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaderboard = leaderboardData.filter((entry) =>
    entry.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Find current user's position
  const userEntry = user ? leaderboardData.find(u => u._id === user._id) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 relative">
        {!user && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[2px]">
            <div className="text-center p-6 bg-card border border-border shadow-lg rounded-xl">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Login to View Leaderboard</h2>
              <p className="text-muted-foreground mb-6">See where you stand among your peers.</p>
              <Link href="/login">
                <Button size="lg">Login Now</Button>
              </Link>
            </div>
          </div>
        )}

        <div className={!user ? "blur-sm pointer-events-none select-none" : ""}>
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Leaderboard</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Top performers competing for glory. Climb the ranks and prove your skills.
            </p>
          </div>

          {/* Top 3 Podium */}
          {leaderboardData.length >= 3 && (
            <div className="flex justify-center items-end gap-4 mb-12">
              {/* Second Place */}
              <div className="flex flex-col items-center">
                <Avatar className="h-16 w-16 border-4 border-slate-400 mb-2">
                  <AvatarImage src={leaderboardData[1]?.profilePicture || leaderboardData[1]?.avatarUrl || "/default.svg"} alt={leaderboardData[1]?.name} />
                  <AvatarFallback className="bg-slate-500/20 text-slate-400 text-lg">
                    {leaderboardData[1]?.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="w-24 h-24 bg-gradient-to-b from-slate-400/20 to-slate-500/10 rounded-t-lg flex flex-col items-center justify-center border border-slate-500/30 border-b-0">
                  <Medal className="h-6 w-6 text-slate-400 mb-1" />
                  <span className="text-2xl font-bold text-slate-400">2</span>
                </div>
                <div className="text-center mt-2">
                  <p className="font-semibold text-foreground text-sm">{leaderboardData[1]?.name}</p>
                  <p className="text-primary font-bold">{leaderboardData[1]?.points.toLocaleString()}</p>
                </div>
              </div>

              {/* First Place */}
              <div className="flex flex-col items-center -mt-8">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-amber-400 mb-2">
                    <AvatarImage
                      src={leaderboardData[0]?.profilePicture || leaderboardData[0]?.avatarUrl || "/default.svg"}
                      alt={leaderboardData[0]?.name}
                    />
                    <AvatarFallback className="bg-amber-500/20 text-amber-400 text-xl">
                      {leaderboardData[0]?.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Crown className="h-8 w-8 text-amber-400" />
                  </div>
                </div>
                <div className="w-28 h-32 bg-gradient-to-b from-amber-400/20 to-amber-500/10 rounded-t-lg flex flex-col items-center justify-center border border-amber-500/30 border-b-0">
                  <Star className="h-8 w-8 text-amber-400 mb-1" />
                  <span className="text-3xl font-bold text-amber-400">1</span>
                </div>
                <div className="text-center mt-2">
                  <p className="font-semibold text-foreground">{leaderboardData[0]?.name}</p>
                  <p className="text-primary font-bold text-lg">{leaderboardData[0]?.points.toLocaleString()}</p>
                </div>
              </div>

              {/* Third Place */}
              <div className="flex flex-col items-center">
                <Avatar className="h-16 w-16 border-4 border-orange-400 mb-2">
                  <AvatarImage src={leaderboardData[2]?.profilePicture || leaderboardData[2]?.avatarUrl || "/default.svg"} alt={leaderboardData[2]?.name} />
                  <AvatarFallback className="bg-orange-500/20 text-orange-400 text-lg">
                    {leaderboardData[2]?.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="w-24 h-20 bg-gradient-to-b from-orange-400/20 to-orange-500/10 rounded-t-lg flex flex-col items-center justify-center border border-orange-500/30 border-b-0">
                  <Award className="h-6 w-6 text-orange-400 mb-1" />
                  <span className="text-2xl font-bold text-orange-400">3</span>
                </div>
                <div className="text-center mt-2">
                  <p className="font-semibold text-foreground text-sm">{leaderboardData[2]?.name}</p>
                  <p className="text-primary font-bold">{leaderboardData[2]?.points.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Your Position Card */}
          {userEntry && (
            <Card className="mb-8 border-primary/30 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 text-center">
                    {userEntry.role === 'admin' ? (
                      <Crown className="h-6 w-6 text-primary mx-auto" />
                    ) : (
                      <span className="text-2xl font-bold text-primary">#{userEntry.rank}</span>
                    )}
                  </div>
                  <Avatar className="h-12 w-12 border-2 border-primary">
                    <AvatarImage src={userEntry.profilePicture || userEntry.avatarUrl || "/default.svg"} alt={userEntry.name} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {userEntry.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{userEntry.name}</p>
                    <p className="text-sm text-muted-foreground">Your current position</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Streak</p>
                      {userEntry.role === 'admin' ? (
                        <span className="text-muted-foreground">-</span>
                      ) : (
                        <p className="font-semibold text-orange-400 flex items-center gap-1">
                          <Flame className="h-4 w-4" />
                          {userEntry.streak}
                        </p>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Points</p>
                      {userEntry.role === 'admin' ? (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/50 hover:bg-primary/20 transition-colors">
                          System Admin
                        </Badge>
                      ) : (
                        <p className="font-bold text-primary text-xl">{userEntry.points.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search participants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <Tabs value={timeFilter} onValueChange={setTimeFilter}>
              <TabsList className="bg-secondary">
                <TabsTrigger value="weekly">This Week</TabsTrigger>
                <TabsTrigger value="monthly">This Month</TabsTrigger>
                <TabsTrigger value="all-time">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Leaderboard Table */}
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border text-sm font-medium text-muted-foreground">
                <div className="col-span-1">Rank</div>
                <div className="col-span-5">Participant</div>
                <div className="col-span-2 text-center hidden sm:block">Solves</div>
                <div className="col-span-2 text-center hidden sm:block">Streak</div>
                <div className="col-span-2 text-right">Points</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border">
                {filteredLeaderboard.map((entry, index) => {
                  const RankIcon = rankIcons[entry.rank as keyof typeof rankIcons]
                  return (
                    <div
                      key={entry._id}
                      className={cn(
                        "grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-secondary/50 transition-colors",
                        entry.rank === 1 && "bg-amber-500/5",
                        entry.rank === 2 && "bg-slate-400/5",
                        entry.rank === 3 && "bg-orange-500/5",
                      )}
                    >
                      {/* Rank */}
                      <div className="col-span-1">
                        {RankIcon && entry.rank ? (
                          <RankIcon
                            className={cn(
                              "h-6 w-6",
                              entry.rank === 1 && "text-amber-400",
                              entry.rank === 2 && "text-slate-400",
                              entry.rank === 3 && "text-orange-400",
                            )}
                          />
                        ) : (
                          <span className="text-lg font-semibold text-muted-foreground">{entry.rank || '-'}</span>
                        )}
                      </div>

                      {/* User */}
                      <div className="col-span-5 flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-border">
                          <AvatarImage src={entry.profilePicture || entry.avatarUrl || "/default.svg"} alt={entry.name} />
                          <AvatarFallback className="bg-primary/20 text-primary text-sm">
                            {entry.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{entry.name}</p>
                          <div className="flex items-center gap-2">
                            {entry.weeklyChange > 0 ? (
                              <span className="text-xs text-emerald-400 flex items-center gap-0.5">
                                <TrendingUp className="h-3 w-3" />+{entry.weeklyChange}
                              </span>
                            ) : entry.weeklyChange < 0 ? (
                              <span className="text-xs text-red-400 flex items-center gap-0.5">
                                <TrendingDown className="h-3 w-3" />
                                {entry.weeklyChange}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                                <Minus className="h-3 w-3" />0
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Solves */}
                      <div className="col-span-2 text-center hidden sm:block">
                        {entry.role === 'admin' ? (
                          <span className="text-muted-foreground">-</span>
                        ) : (
                          <span className="text-foreground font-medium">{entry.solves}</span>
                        )}
                      </div>

                      {/* Streak */}
                      <div className="col-span-2 text-center hidden sm:block">
                        {entry.role === 'admin' ? (
                          <span className="text-muted-foreground">-</span>
                        ) : entry.streak > 0 ? (
                          <span className="inline-flex items-center gap-1 text-orange-400 font-medium">
                            <Flame className="h-4 w-4" />
                            {entry.streak}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>

                      {/* Points / Admin Label */}
                      <div className="col-span-2 text-right">
                        {entry.role === 'admin' ? (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/50 hover:bg-primary/20 transition-colors">
                            System Admin
                          </Badge>
                        ) : (
                          <span className="text-lg font-bold text-primary">{entry.points.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {filteredLeaderboard.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No participants found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
