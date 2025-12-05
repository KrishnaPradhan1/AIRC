import { useState } from "react";
import { Sparkles, ArrowLeft, Mail, Key, Lock, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sendOtp, verifyOtp, resetPassword } from "@/lib/api";

type Step = 'email' | 'otp' | 'password' | 'success';

export function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await sendOtp(email);
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const data = await verifyOtp(email, otp);
      if (data.access_token) {
        localStorage.setItem('token', data.access_token); // Temporarily store token for reset
        setStep('password');
      } else {
        setError("Invalid OTP response.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await resetPassword(password);
      localStorage.removeItem('token'); // Clear temp token
      setStep('success');
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-4">
            <Sparkles className="h-6 w-6" />
            <span className="text-lg">AI Resume Classifier</span>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                {step === 'email' && <Mail className="h-6 w-6 text-blue-600" />}
                {step === 'otp' && <Key className="h-6 w-6 text-blue-600" />}
                {step === 'password' && <Lock className="h-6 w-6 text-blue-600" />}
                {step === 'success' && <Sparkles className="h-6 w-6 text-green-600" />}
              </div>
            </div>
            <CardTitle className="text-2xl text-center">
              {step === 'email' && "Reset Password"}
              {step === 'otp' && "Enter OTP"}
              {step === 'password' && "New Password"}
              {step === 'success' && "Password Reset!"}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 'email' && "Enter your email to receive a verification code"}
              {step === 'otp' && `Enter the code sent to ${email}`}
              {step === 'password' && "Create a new strong password"}
              {step === 'success' && "Your password has been successfully updated"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center mb-4">
                {error}
              </div>
            )}

            {step === 'email' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send OTP
                </Button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    disabled={isLoading}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify OTP
                </Button>
                <div className="text-center">
                  <button type="button" onClick={() => setStep('email')} className="text-sm text-blue-600 hover:underline">
                    Change Email
                  </button>
                </div>
              </form>
            )}

            {step === 'password' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Reset Password
                </Button>
              </form>
            )}

            {step === 'success' && (
              <div className="space-y-4">
                <Button className="w-full" onClick={() => router.push('/auth/login')}>
                  Go to Login
                </Button>
              </div>
            )}
          </CardContent>

          {step !== 'success' && (
            <CardFooter className="flex justify-center">
              <Link href="/auth/login" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
