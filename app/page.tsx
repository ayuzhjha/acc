'use client';

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code2, Trophy, Users, Calendar, Star, CheckCircle2, ExternalLink, Lock } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import Aurora from "@/components/Aurora"

import { API_URL } from "@/lib/api"

export default function Home() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [latestChallenge, setLatestChallenge] = useState<any>(null);
  const [upcomingChallenges, setUpcomingChallenges] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await fetch(`${API_URL}/api/challenges`);
        const data = await res.json();
        setChallenges(data);

        const active = data.filter((c: any) => c.status === 'active');
        const upcoming = data.filter((c: any) => c.status === 'upcoming');

        if (active.length > 0) {
          // Sort by date descending
          setLatestChallenge(active.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]);
        }
        setUpcomingChallenges(upcoming);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChallenges();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col relative">

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden" style={{ backgroundColor: "#0f0f23" }}>
          {/* Warm Amber Background */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, 
                  rgba(245, 158, 11, 0.14) 0%, 
                  rgba(245, 158, 11, 0.08) 25%, 
                  rgba(245, 158, 11, 0.03) 35%, 
                  transparent 50%
                )
              `,
              backgroundSize: "100% 100%",
            }}
          />

          <div className="absolute inset-0 z-0">
            <Aurora
              colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
              blend={0.5}
              amplitude={1.0}
              speed={0.5}
            />
          </div>

          {/* Diagonal Fade Grid Background - Top Left */}
          <div
            className="absolute top-0 left-0 z-0 pointer-events-none w-full md:w-[600px] h-[600px] opacity-20 md:opacity-100"
            style={{
              backgroundImage: `
                linear-gradient(to right, #d1d5db 1px, transparent 1px),
                linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
              `,
              backgroundSize: "32px 32px",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
              maskImage:
                "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
            }}
          />

          {/* Diagonal Fade Grid Background - Top Right */}
          <div
            className="absolute top-0 right-0 z-0 pointer-events-none w-full md:w-[600px] h-[600px] opacity-20 md:opacity-100"
            style={{
              backgroundImage: `
                linear-gradient(to right, #d1d5db 1px, transparent 1px),
                linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
              `,
              backgroundSize: "32px 32px",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
              maskImage:
                "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
            }}
          />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Weekly Challenge is Live
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
              Master Coding.<br />
              <span className="text-primary">Build Your Legacy.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Join the ACM Student Chapter's weekly coding challenges. Compete with peers, earn badges, and climb the leaderboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/challenges">
                <Button size="lg" className="h-12 px-8 text-base">
                  Start Coding <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Current Challenge Section */}
        <section className="py-16 bg-secondary/30 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-2">This Week's Challenge</h2>
                <p className="text-muted-foreground">Solve this problem to earn maximum points this week.</p>
              </div>
              <Link href="/challenges">
                <Button variant="ghost" className="mt-4 md:mt-0">
                  View All Challenges <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {latestChallenge ? (

              <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 overflow-hidden relative">
                {!user && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                    <div className="text-center p-6">
                      <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <h3 className="text-xl font-bold mb-2">Login to Unlock</h3>
                      <p className="text-muted-foreground mb-4">Sign in to view this week's challenge.</p>
                      <Link href="/login">
                        <Button size="lg">Login Now</Button>
                      </Link>
                    </div>
                  </div>
                )}
                <div className={!user ? "blur-sm pointer-events-none select-none" : ""}>
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Code2 className="h-32 w-32 text-primary" />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">Active</Badge>
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        {latestChallenge.points} Points
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl md:text-3xl">{latestChallenge.title}</CardTitle>
                    <CardDescription className="text-base mt-2 max-w-3xl">
                      {latestChallenge.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/50 px-3 py-1.5 rounded-full border border-border/50">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>Deadline: {latestChallenge.deadline ? new Date(latestChallenge.deadline).toLocaleDateString() : 'None'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/50 px-3 py-1.5 rounded-full border border-border/50">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{latestChallenge.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/50 px-3 py-1.5 rounded-full border border-border/50">
                        <Star className="h-4 w-4 text-primary" />
                        <span>{latestChallenge.type}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {latestChallenge.type === 'platform' && latestChallenge.externalLink ? (
                      <Button size="lg" className="w-full md:w-auto" asChild>
                        <a href={latestChallenge.externalLink} target="_blank" rel="noopener noreferrer">
                          Solve Challenge <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <Button size="lg" className="w-full md:w-auto" asChild>
                        <Link href={`/challenges/${latestChallenge._id}`}>
                          View Problem <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </div>
              </Card>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No active challenge at the moment.</p>
              </div>
            )}

            {/* Upcoming Challenges */}
            {upcomingChallenges.length > 0 && (
              <div className="mt-16">
                <h3 className="text-2xl font-bold mb-6">Upcoming Challenges</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingChallenges.map(challenge => (
                    <Card key={challenge._id} className="relative overflow-hidden border-dashed border-border">
                      <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <div className="bg-background/80 px-4 py-2 rounded-full border shadow-sm flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">Locked</span>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline">Upcoming</Badge>
                          <span className="text-sm text-muted-foreground">{challenge.difficulty}</span>
                        </div>
                        <CardTitle>{challenge.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Starts soon</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                    <Code2 className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle>Weekly Problems</CardTitle>
                  <CardDescription>
                    New coding challenges released every week covering various algorithms and data structures.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                    <Trophy className="h-6 w-6 text-amber-500" />
                  </div>
                  <CardTitle>Global Leaderboard</CardTitle>
                  <CardDescription>
                    Compete with other students and see where you stand on the global ranking.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-purple-500" />
                  </div>
                  <CardTitle>Earn Badges</CardTitle>
                  <CardDescription>
                    Unlock exclusive badges for streaks, difficult problems, and community contributions.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div >
  )
}
