'use client';

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CheckCircle2, Circle, Clock, ArrowRight, ExternalLink, FileText, Loader2, Lock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/challenges`);
      if (res.ok) {
        const data = await res.json();
        setChallenges(data);
      }
    } catch (error) {
      console.error("Failed to fetch challenges", error);
    } finally {
      setLoading(false);
    }
  };

  const activeChallenges = challenges.filter(c => c.status === 'active');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const ChallengeCard = ({ challenge }: { challenge: any }) => (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge
            variant={challenge.difficulty === "Easy" ? "secondary" : challenge.difficulty === "Medium" ? "default" : "destructive"}
          >
            {challenge.difficulty}
          </Badge>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {challenge.deadline ? new Date(challenge.deadline).toLocaleDateString() : 'No Deadline'}
          </span>
        </div>
        <CardTitle className="line-clamp-1">{challenge.title}</CardTitle>
        <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>{challenge.points} Points</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>{challenge.type === 'platform' ? 'Platform' : 'Custom'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Circle className={`h-3 w-3 ${challenge.status === 'active' ? 'text-green-500 fill-green-500' : challenge.status === 'ended' ? 'text-red-500 fill-red-500' : 'text-yellow-500 fill-yellow-500'}`} />
            <span className="capitalize">{challenge.status}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {challenge.status === 'ended' && challenge.type === 'platform' ? (
          <Button className="w-full" disabled>
            Ended <Lock className="ml-2 h-4 w-4" />
          </Button>
        ) : challenge.type === 'platform' && challenge.externalLink ? (
          <Button className="w-full" asChild>
            <a href={challenge.externalLink} target="_blank" rel="noopener noreferrer">
              Solve on Platform <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        ) : (
          <Button className="w-full" asChild>
            <Link href={`/challenges/${challenge._id}`}>
              {challenge.status === 'ended' ? 'View Problem' : 'View Problem'} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 relative">
        {!user && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[2px]">
            <div className="text-center p-6 bg-card border border-border shadow-lg rounded-xl">
              <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Login to Unlock</h2>
              <p className="text-muted-foreground mb-6">You need to be logged in to view and solve challenges.</p>
              <Link href="/login">
                <Button size="lg">Login Now</Button>
              </Link>
            </div>
          </div>
        )}

        <div className={!user ? "blur-sm pointer-events-none select-none" : ""}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Coding Challenges</h1>
            <p className="text-muted-foreground">
              Sharpen your skills with our weekly coding problems. Solve them to earn points and climb the leaderboard.
            </p>
          </div>

          <Tabs defaultValue="active" className="space-y-6">
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="all">All Challenges</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activeChallenges.length > 0 ? (
                  activeChallenges.map((challenge) => (
                    <ChallengeCard key={challenge._id} challenge={challenge} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    No active challenges found.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="all" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {challenges.map((challenge) => (
                  <ChallengeCard key={challenge._id} challenge={challenge} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
