"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Code2, Trophy, User, LogOut, Menu, Github, Bell, ChevronDown, X } from "lucide-react"
import { toast } from "sonner"

const navigation = [
  { name: "Challenges", href: "/challenges" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Badges", href: "/badges" },
  { name: "Community", href: "https://discord.gg/hCV9phzpQf", external: true },
]

import { useAuth } from "@/context/AuthContext"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [userBadges, setUserBadges] = useState<any[]>([])

  useEffect(() => {
    if (isProfileOpen && user?._id) {
      // Fetch fresh user data to get badges
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/user/${user._id}`)
        .then(res => res.json())
        .then(currentUser => {
          if (currentUser && currentUser.badges) {
            setUserBadges(currentUser.badges);
          }
        })
        .catch(err => console.error("Failed to fetch user badges", err));
    }
  }, [isProfileOpen, user]);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/intrologo.png" alt="ACM Logo" className="h-9 w-9 rounded-lg transition-transform group-hover:scale-105" />
          <div className="hidden sm:block">
            <span className="font-semibold text-foreground">ACM</span>
            <span className="ml-1 text-muted-foreground">Chapter</span>
            <span className="ml-1 text-muted-foreground">XIM</span>
            <span className="ml-1 text-muted-foreground">University</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => (
            item.external ? (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
              >
                {item.name}
              </a>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
              >
                {item.name}
              </Link>
            )
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative" onClick={() => toast.info("Feature coming soon")}>
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-primary-foreground">
              3
            </span>
          </Button>

          {/* User Menu or Login Button */}
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {user.name
                          ? user.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">#{user.rank || 'N/A'}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setIsProfileOpen(true)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/badges" className="w-full cursor-pointer">
                      <Trophy className="mr-2 h-4 w-4" />
                      My Achievements
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Available in future")}>
                    <Github className="mr-2 h-4 w-4" />
                    Connect GitHub
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="w-full cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>User Profile</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-center gap-4 py-4">
                    <Avatar className="h-24 w-24 border-2 border-primary">
                      <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="text-2xl">
                        {user.name ? user.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h2 className="text-xl font-bold">{user.name}</h2>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>

                    <div className="w-full mt-4">
                      <h3 className="font-semibold mb-3">Badges Earned</h3>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {userBadges.length > 0 ? (
                          userBadges.map((ub: any) => (
                            <div key={ub.badge._id} className="flex flex-col items-center p-2 bg-secondary/50 rounded-lg" title={ub.badge.name}>
                              <span className="text-2xl">{ub.badge.icon}</span>
                              <span className="text-xs mt-1 font-medium">{ub.badge.name}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No badges earned yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => (
                  item.external ? (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  )
                ))}
                {!user && (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Login</Button>
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function Settings({ className }: { className?: string }) {
  return <User className={className} /> // Just a placeholder icon if needed, but we removed the Settings menu item
}
