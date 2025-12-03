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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Code2, Trophy, User, LogOut, Menu, Github, Bell, ChevronDown, X, Settings } from "lucide-react"
import { toast } from "sonner"

const navigation = [
  { name: "Challenges", href: "/challenges" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Badges", href: "/badges" },
  { name: "Community", href: "https://discord.gg/hCV9phzpQf", external: true },
]

import { useAuth } from "@/context/AuthContext"
import { API_URL } from "@/lib/api"

export function Header() {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Renamed from isOpen to avoid conflict

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  useEffect(() => {
    if (user) {
      setProfilePicUrl(user.profilePicture || '');
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleUpdateProfilePic = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify({ profilePicture: profilePicUrl })
      });

      if (res.ok) {
        setIsEditingProfile(false);
        // Ideally update user context here, but for now a reload or re-fetch works
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update profile picture", error);
      toast.error("Failed to update profile picture.");
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/api/notifications`, {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.read).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const markAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await fetch(`${API_URL}/api/notifications/read`, {
        method: 'PUT',
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
    }
  };

  useEffect(() => {
    if (isProfileOpen && user?._id) {
      fetch(`${API_URL}/api/user/${user._id}`)
        .then(res => res.json())
        .then(currentUser => {
          if (currentUser) {
            if (currentUser.badges) setUserBadges(currentUser.badges);
            if (currentUser.profilePicture) setProfilePicUrl(currentUser.profilePicture);
          }
        })
        .catch(err => console.error("Failed to fetch user data", err));
    }
  }, [isProfileOpen, user]);

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
          {user && (
            <Popover onOpenChange={(open) => { if (open) markAsRead(); }}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-primary-foreground">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b font-semibold">Notifications</div>
                <ScrollArea className="h-[300px]">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      No notifications
                    </div>
                  ) : (
                    <div className="divide-y">
                      {notifications.map((notification) => (
                        <div key={notification._id} className={`p-4 text-sm ${notification.read ? 'bg-background' : 'bg-muted/50'}`}>
                          <p>{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>
          )}

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
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
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
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  )
                ))}
                {!user && (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
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
