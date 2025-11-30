'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { HomeBackground } from '@/components/home-background';

import { useAuth } from "@/context/AuthContext"

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    age: '',
    isAcmMember: false,
    acmId: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, gender: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isAcmMember: checked }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic Validation
    if (!formData.email.endsWith('@stu.xim.edu.in')) {
      toast.error('Email must end with @stu.xim.edu.in');
      setLoading(false);
      return;
    }

    if (formData.isAcmMember && !formData.acmId) {
      toast.error('ACM ID is required for ACM members');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Use context login function
      login(data.token, data.user);

      toast.success('Account created successfully');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-8">
      <HomeBackground />
      <div className="absolute inset-0 bg-background/30 backdrop-blur-md" />

      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="w-full bg-card/90 border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Enter your information to get started.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required value={formData.name} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email (@stu.xim.edu.in)</Label>
                <Input id="email" name="email" type="email" placeholder="u123456@stu.xim.edu.in" required value={formData.email} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select onValueChange={handleSelectChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" name="age" type="number" min="1" required value={formData.age} onChange={handleChange} />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="isAcmMember" className="border-primary" checked={formData.isAcmMember} onCheckedChange={handleCheckboxChange} />
                <Label htmlFor="isAcmMember">Are you an ACM Member?</Label>
              </div>

              {formData.isAcmMember && (
                <div className="grid gap-2">
                  <Label htmlFor="acmId">ACM ID</Label>
                  <Input id="acmId" name="acmId" placeholder="ACM-12345" required value={formData.acmId} onChange={handleChange} />
                </div>
              )}

            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full mt-4" type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign Up'}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
