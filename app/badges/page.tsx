'use client';

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge as UiBadge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Loader2, Lock } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import { API_URL } from "@/lib/api"

export default function BadgesPage() {
  const [allBadges, setAllBadges] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchData(user ? user._id : null);
  }, [user]);

  const fetchData = async (userId: string | null) => {
    try {
      const [badgesRes, userRes] = await Promise.all([
        fetch(`${API_URL}/api/badges`),
        userId ? fetch(`${API_URL}/api/user/${userId}`) : Promise.resolve(null)
      ]);

      if (badgesRes.ok) {
        setAllBadges(await badgesRes.json());
      }

      if (userRes && userRes.ok) {
        const currentUser = await userRes.json();
        if (currentUser && currentUser.badges) {
          setUserBadges(currentUser.badges);
        }
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const BadgeCard = ({ badge }: { badge: any }) => {
    const earnedBadge = userBadges.find((ub: any) => {
      const ubId = ub.badge._id || ub.badge;
      const bId = badge._id;
      return ubId === bId;
    });
    const isUnlocked = !!earnedBadge;

    return (
      <Card className={`relative overflow-hidden ${isUnlocked ? 'border-primary/50 bg-primary/5' : 'opacity-70 grayscale'}`}>
        {!isUnlocked && (
          <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="text-4xl">{badge.icon}</div>
          <div>
            <CardTitle className="text-lg">{badge.name}</CardTitle>
            <UiBadge variant={badge.rarity === 'legendary' ? 'destructive' : badge.rarity === 'epic' ? 'default' : 'secondary'}>
              {badge.rarity}
            </UiBadge>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">{badge.description}</CardDescription>
          <div className="text-xs text-muted-foreground">
            {badge.criteria}
          </div>
          {isUnlocked && (
            <div className="mt-4 text-xs font-medium text-primary">
              Earned: {new Date(earnedBadge.earnedAt).toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 relative">
        {!user && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[2px]">
            <div className="text-center p-6 bg-card border border-border shadow-lg rounded-xl">
              <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Login to View Badges</h2>
              <p className="text-muted-foreground mb-6">Earn badges by participating in challenges.</p>
              <Link href="/login">
                <Button size="lg">Login Now</Button>
              </Link>
            </div>
          </div>
        )}

        <div className={!user ? "blur-sm pointer-events-none select-none" : ""}>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Badges & Achievements</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Earn badges by participating in challenges, maintaining streaks, and helping the community.
            </p>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="justify-center">
              <TabsTrigger value="all">All Badges</TabsTrigger>
              <TabsTrigger value="earned">Earned</TabsTrigger>
              <TabsTrigger value="locked">Locked</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {allBadges.map(badge => <BadgeCard key={badge._id} badge={badge} />)}
              </div>
            </TabsContent>

            <TabsContent value="earned">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {allBadges.filter(b => userBadges.some((ub: any) => (ub.badge._id || ub.badge) === b._id)).map(badge => <BadgeCard key={badge._id} badge={badge} />)}
                {userBadges.length === 0 && <div className="col-span-full text-center py-12 text-muted-foreground">No badges earned yet. Start solving challenges!</div>}
              </div>
            </TabsContent>

            <TabsContent value="locked">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {allBadges.filter(b => !userBadges.some((ub: any) => (ub.badge._id || ub.badge) === b._id)).map(badge => <BadgeCard key={badge._id} badge={badge} />)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
