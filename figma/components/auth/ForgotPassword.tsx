import { useState } from "react";
import { Sparkles, ArrowLeft, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with Flask backend password reset
    console.log("Password reset requested for:", email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo and Back to Home */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-4">
            <Sparkles className="h-6 w-6" />
            <span className="text-lg">AI Resume Classifier</span>
          </a>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              {submitted 
                ? "Check your email for reset instructions"
                : "Enter your email to receive password reset instructions"
              }
            </CardDescription>
          </CardHeader>
          {!submitted ? (
            <>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Reset Link
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-gray-600">
                  <a href="/student-login" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700">
                    <ArrowLeft className="h-3 w-3" />
                    Back to Login
                  </a>
                </div>
              </CardFooter>
            </>
          ) : (
            <>
              <CardContent>
                <div className="text-center space-y-4 py-4">
                  <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                    <p className="text-sm">
                      We've sent password reset instructions to <strong>{email}</strong>
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Please check your email and follow the link to reset your password. 
                    The link will expire in 24 hours.
                  </p>
                  <p className="text-sm text-gray-600">
                    Didn't receive the email? Check your spam folder or{" "}
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      try again
                    </button>
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button variant="outline" className="w-full" asChild>
                  <a href="/student-login" className="inline-flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </a>
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
