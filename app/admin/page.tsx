'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Plus, Edit, Trash, Shield, Save } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { Checkbox } from '@/components/ui/checkbox';

import { useAuth } from "@/context/AuthContext"

import { API_URL } from "@/lib/api"

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [badges, setBadges] = useState([]);
  const [token, setToken] = useState('');

  // Challenge Form State
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    points: 10,
    category: 'General',
    type: 'platform',
    externalLink: '',
    resourceLink: '',
    testInput: '',
    testOutput: '',
    deadline: '',
    status: 'active'
  });

  // Edit Challenge State
  const [editingChallenge, setEditingChallenge] = useState<any>(null);

  // User Edit State
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editPoints, setEditPoints] = useState(0);
  const [editStreak, setEditStreak] = useState(0);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);

  useEffect(() => {
    if (authLoading) return;

    const storedToken = localStorage.getItem('token');

    if (!user || !storedToken) {
      router.push('/login');
      return;
    }

    if (user.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      router.push('/');
      return;
    }

    setToken(storedToken);
    fetchData(storedToken);
  }, [user, authLoading, router]);

  const fetchData = async (authToken: string) => {
    try {
      setLoading(true);
      const [usersRes, challengesRes, badgesRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/users`, { headers: { 'x-auth-token': authToken } }),
        fetch(`${API_URL}/api/challenges`),
        fetch(`${API_URL}/api/admin/badges`, { headers: { 'x-auth-token': authToken } })
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (challengesRes.ok) setChallenges(await challengesRes.json());
      if (badgesRes.ok) setBadges(await badgesRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChallenge = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/challenge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          ...newChallenge,
          testCases: [{ input: newChallenge.testInput, output: newChallenge.testOutput }]
        })
      });

      if (res.ok) {
        toast.success('Challenge created');
        fetchData(token);
        setNewChallenge({
          title: '', description: '', difficulty: 'Easy', points: 10, category: 'General',
          type: 'platform', externalLink: '', resourceLink: '', testInput: '', testOutput: '',
          deadline: '', status: 'active'
        });
      } else {
        toast.error('Failed to create challenge');
      }
    } catch (error) {
      toast.error('Error creating challenge');
    }
  };

  const handleUpdateChallenge = async () => {
    if (!editingChallenge) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/challenge/${editingChallenge._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(editingChallenge)
      });

      if (res.ok) {
        toast.success('Challenge updated');
        setEditingChallenge(null);
        fetchData(token);
      } else {
        toast.error('Failed to update challenge');
      }
    } catch (error) {
      toast.error('Error updating challenge');
    }
  };

  const handleDeleteChallenge = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/challenge/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });

      if (res.ok) {
        toast.success('Challenge deleted');
        fetchData(token);
      } else {
        toast.error('Failed to delete challenge');
      }
    } catch (error) {
      toast.error('Error deleting challenge');
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setEditPoints(user.points);
    setEditStreak(user.streak || 0);
    setEditEmail(user.email);
    setEditPassword(''); // Don't show current password
    setSelectedBadges(user.badges.map((b: any) => b.badge._id || b.badge));
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    try {
      const body: any = {
        points: editPoints,
        streak: editStreak,
        badges: selectedBadges,
        email: editEmail
      };

      if (editPassword) {
        body.password = editPassword;
      }

      const res = await fetch(`${API_URL}/api/admin/user/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        toast.success('User updated');
        setEditingUser(null);
        fetchData(token);
      } else {
        toast.error('Failed to update user');
      }
    } catch (error) {
      toast.error('Error updating user');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/user/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });

      if (res.ok) {
        toast.success('User deleted');
        fetchData(token);
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      toast.error('Error deleting user');
    }
  };

  const toggleBadge = (badgeId: string) => {
    if (selectedBadges.includes(badgeId)) {
      setSelectedBadges(selectedBadges.filter(id => id !== badgeId));
    } else {
      setSelectedBadges([...selectedBadges, badgeId]);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="challenges">
          <TabsList className="mb-8">
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="challenges">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage Challenges</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button><Plus className="mr-2 h-4 w-4" /> Add Challenge</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Challenge</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Title</Label>
                      <Input value={newChallenge.title} onChange={e => setNewChallenge({ ...newChallenge, title: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Description</Label>
                      <Input value={newChallenge.description} onChange={e => setNewChallenge({ ...newChallenge, description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Difficulty</Label>
                        <Select onValueChange={v => setNewChallenge({ ...newChallenge, difficulty: v })} defaultValue={newChallenge.difficulty}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Points</Label>
                        <Input type="number" value={newChallenge.points} onChange={e => setNewChallenge({ ...newChallenge, points: Number(e.target.value) })} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Type</Label>
                        <Select onValueChange={v => setNewChallenge({ ...newChallenge, type: v })} defaultValue={newChallenge.type}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="platform">Platform</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Status</Label>
                        <Select onValueChange={v => setNewChallenge({ ...newChallenge, status: v })} defaultValue={newChallenge.status}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="ended">Ended</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Deadline</Label>
                      <Input type="date" value={newChallenge.deadline} onChange={e => setNewChallenge({ ...newChallenge, deadline: e.target.value })} />
                    </div>

                    {newChallenge.type === 'platform' ? (
                      <div className="grid gap-2">
                        <Label>Contest/Problem Link</Label>
                        <Input placeholder="https://hackerrank.com/..." value={newChallenge.externalLink} onChange={e => setNewChallenge({ ...newChallenge, externalLink: e.target.value })} />
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        <Label>Resource Link (PDF/Image)</Label>
                        <Input placeholder="https://drive.google.com/..." value={newChallenge.resourceLink} onChange={e => setNewChallenge({ ...newChallenge, resourceLink: e.target.value })} />
                      </div>
                    )}

                    <Button onClick={handleCreateChallenge}>Create Challenge</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {challenges.map((challenge: any) => (
                <Card key={challenge._id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{challenge.title}</span>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setEditingChallenge(challenge)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Challenge</DialogTitle>
                            </DialogHeader>
                            {editingChallenge && (
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label>Title</Label>
                                  <Input value={editingChallenge.title} onChange={e => setEditingChallenge({ ...editingChallenge, title: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                  <Label>Description</Label>
                                  <Input value={editingChallenge.description} onChange={e => setEditingChallenge({ ...editingChallenge, description: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="grid gap-2">
                                    <Label>Status</Label>
                                    <Select onValueChange={v => setEditingChallenge({ ...editingChallenge, status: v })} defaultValue={editingChallenge.status}>
                                      <SelectTrigger><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="upcoming">Upcoming</SelectItem>
                                        <SelectItem value="ended">Ended</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label>Deadline</Label>
                                    <Input type="date" value={editingChallenge.deadline ? editingChallenge.deadline.split('T')[0] : ''} onChange={e => setEditingChallenge({ ...editingChallenge, deadline: e.target.value })} />
                                  </div>
                                </div>
                                <Button onClick={handleUpdateChallenge}>Save Changes</Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteChallenge(challenge._id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {challenge.difficulty} | {challenge.points} pts | {challenge.status.toUpperCase()}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Badges</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: any) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.points}</TableCell>
                      <TableCell>{user.badges?.length || 0}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User: {user.name}</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label>Email</Label>
                                  <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                  <Label>New Password (leave empty to keep current)</Label>
                                  <Input type="password" placeholder="New Password" value={editPassword} onChange={e => setEditPassword(e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                  <Label>Points</Label>
                                  <Input type="number" value={editPoints} onChange={e => setEditPoints(Number(e.target.value))} />
                                </div>
                                <div className="grid gap-2">
                                  <Label>Streak</Label>
                                  <Input type="number" value={editStreak} onChange={e => setEditStreak(Number(e.target.value))} />
                                </div>
                                <div className="grid gap-2">
                                  <Label>Badges</Label>
                                  <div className="grid grid-cols-2 gap-2 border p-2 rounded-md max-h-40 overflow-y-auto">
                                    {badges.map((badge: any) => (
                                      <div key={badge._id} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`badge-${badge._id}`}
                                          checked={selectedBadges.includes(badge._id)}
                                          onCheckedChange={() => toggleBadge(badge._id)}
                                        />
                                        <label htmlFor={`badge-${badge._id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                          {badge.name}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <Button onClick={handleSaveUser}>Save Changes</Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteUser(user._id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
