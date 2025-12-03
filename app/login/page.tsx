'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { HomeBackground } from '@/components/home-background';

import { useAuth } from "@/context/AuthContext"

import { API_URL } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Attempting login to:", `${API_URL}/api/auth/login`);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Use context login function
      login(data.token, data.user);

      toast.success('Logged in successfully');
      router.push('/'); // Redirect to home
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <HomeBackground />
      <div className="absolute inset-0 bg-background/30 backdrop-blur-md" />

      <div className="relative z-10 w-full max-w-sm px-4">
        <Card className="w-full bg-card/90 border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="text-right">
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=ucse24017@stu.xim.edu.in&su=Password%20Reset%20Request&body=Dear%20Support%20Team%2C%0A%0AI%20have%20forgotten%20my%20account%20password.%20My%20name%20is%20%5Bname%5D%20and%20my%20registered%20email%20address%20is%20%5Bemail%5D.%0A%0AI%20request%20you%20to%20kindly%20initiate%20the%20password%20reset%20process%20at%20the%20earliest.%0A%0AThank%20you.%0A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Forget Password?
                </a>
              </div>
              <Button className="w-full mt-2" type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Sign in'}
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
