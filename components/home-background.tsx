'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight, Code2, Trophy, Star } from "lucide-react"

export function HomeBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            {/* Hero Section Visuals */}
            <section className="relative py-20 md:py-32 overflow-hidden h-full">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
                <div className="absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

                <div className="container relative z-10 mx-auto px-4 text-center opacity-40 blur-[2px]">
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
                        <Button size="lg" className="h-12 px-8 text-base">
                            Start Coding <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                            View Leaderboard
                        </Button>
                    </div>

                    {/* Features Grid Visuals */}
                    <div className="grid md:grid-cols-3 gap-8 mt-20 text-left">
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
        </div>
    )
}
