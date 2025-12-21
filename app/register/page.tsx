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

import { API_URL } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState<'register' | 'verify'>('register');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    age: '',
    isAcmMember: false,
    acmId: '',
    collegeName: '',
    graduationYear: ''
  });

  const [otp, setOtp] = useState('');
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.isAcmMember && !formData.acmId) {
      toast.error('ACM ID is required for ACM members');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
          graduationYear: formData.graduationYear ? Number(formData.graduationYear) : undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (data.needsVerification) {
        if (data.emailError) {
          toast.error(`Email failed: ${data.emailError}. Check credentials.`, {
            duration: 5000,
          });
          // Still allow proceeding if they somehow know the OTP (e.g. from server logs)
          // or we might want to stop them? The previous flow allowed it. 
          // User asked to "fix the error", seeing the error helps them fix it.
          // We'll show the error but still switch step so they aren't stuck if they fix it backend side?
          // Actually, if email failed, they can't verify. But let's leave the step switch 
          // so they see the UI state.
        } else {
          toast.success('Registration successful. Please check your email for OTP.');
        }
        setStep('verify');
      } else {
        // Fallback if verification not needed (should not happen with new logic)
        login(data.token, data.user);
        toast.success('Account created successfully');
        router.push('/');
      }

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      login(data.token, data.user);
      toast.success('Email verified successfully!');
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
            <CardTitle className="text-2xl">
              {step === 'register' ? 'Create an account' : 'Verify Email'}
            </CardTitle>
            <CardDescription>
              {step === 'register'
                ? 'Enter your information to get started.'
                : `We sent a code to ${formData.email}. Please enter it below.`
              }
            </CardDescription>
          </CardHeader>

          {step === 'register' ? (
            <form onSubmit={handleRegisterSubmit}>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="AS per college ID" required value={formData.name} onChange={handleChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="user@example.com" required value={formData.email} onChange={handleChange} />
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

                <div className="grid gap-2">
                  <Label htmlFor="collegeName">College Name</Label>
                  <Input id="collegeName" name="collegeName" placeholder="College/University Name" value={formData.collegeName} onChange={handleChange} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input id="graduationYear" name="graduationYear" type="number" placeholder="e.g. 2028" value={formData.graduationYear} onChange={handleChange} />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="isAcmMember" className="border-primary" checked={formData.isAcmMember} onCheckedChange={handleCheckboxChange} />
                  <Label htmlFor="isAcmMember">Are you an ACM Member? (Optional)</Label>
                </div>

                {formData.isAcmMember && (
                  <div className="grid gap-2">
                    <Label htmlFor="acmId">ACM ID</Label>
                    <Input id="acmId" name="acmId" placeholder="acmid" required value={formData.acmId} onChange={handleChange} />
                  </div>
                )}

              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full mt-4" type="submit" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Next'}
                </Button>
                <div className="text-center text-sm">
                  Already have an account?{' '}
                  <Link href="/login" className="underline">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleVerifySubmit}>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="otp">One-Time Password</Label>
                  <Input
                    id="otp"
                    name="otp"
                    placeholder="123456"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full mt-4" type="submit" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify Email'}
                </Button>

                <div className="text-center text-sm mt-2 text-muted-foreground">
                  <p>Didn't receive the email? Check your <strong>Spam/Junk</strong> folder.</p>
                </div>

                <Button
                  variant="link"
                  className="w-full"
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    try {
                      setLoading(true);
                      const res = await fetch(`${API_URL}/api/auth/resend-otp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: formData.email }),
                      });
                      const data = await res.json();
                      if (res.ok) {
                        toast.success('OTP resent! Check your email (and spam folder).');
                      } else {
                        toast.error(data.message || 'Failed to resend OTP');
                      }
                    } catch (err) {
                      toast.error('Something went wrong');
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  Resend OTP
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setStep('register')}
                  disabled={loading}
                >
                  Back to Registration
                </Button>
              </CardFooter>
            </form>
          )}

        </Card>
      </div>
    </div>
  );
}
