"use client";

import * as React from "react";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  LogIn,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/components/auth/auth-context";
import { useRouter } from "next/navigation";

const LoginHeader = () => (
  <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm app-header agent-header-mobile">
    <div className="mx-auto flex max-w-2xl items-center justify-between p-2 xs:p-4 app-header-content">
      <Link href="/" passHref>
        <Button variant="ghost" size="icon" className="touch-target">
          <ArrowLeft className="h-4 w-4 xs:h-5 xs:w-5" />
          <span className="sr-only">Back</span>
        </Button>
      </Link>
      <h1 className="text-lg xs:text-xl font-bold text-foreground font-headline text-responsive-lg">
        Sign In
      </h1>
      <div className="w-8 xs:w-10"></div>
    </div>
  </header>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Demo login - accept any email/password for demo purposes
      login({
        name: "Demo User",
        email: email,
        avatar: "https://placehold.co/100x100.png",
      });

      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto max-w-2xl">
        <div className="min-h-screen">
          <LoginHeader />
          <main className="p-3 xs:p-6 agent-container">
            <div className="max-w-md mx-auto space-y-4 xs:space-y-6 py-4 pb-8">
              <div className="text-center space-y-2">
                <div className="mx-auto h-12 w-12 xs:h-16 xs:w-16 bg-primary rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6 xs:h-8 xs:w-8 text-primary-foreground" />
                </div>
                <h2 className="text-xl xs:text-2xl font-bold text-responsive-lg">
                  Welcome Back
                </h2>
                <p className="text-sm xs:text-base text-muted-foreground text-responsive-sm">
                  Sign in to your account to continue your travel journey
                </p>
              </div>

              <Card className="agent-card">
                <CardHeader className="p-3 xs:p-6 p-mobile-3">
                  <CardTitle className="text-base xs:text-lg text-responsive-base">
                    Sign In to Your Account
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 xs:p-6 pt-0 p-mobile-3">
                  <form onSubmit={handleLogin} className="space-y-4 xs:space-y-5 space-mobile-3">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription className="text-responsive-xs">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-1 xs:space-y-2">
                      <Label htmlFor="email" className="text-xs xs:text-sm text-responsive-xs">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 xs:h-4 xs:w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="pl-8 xs:pl-10 text-sm h-9 xs:h-10 text-responsive-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1 xs:space-y-2">
                      <Label htmlFor="password" className="text-xs xs:text-sm text-responsive-xs">
                        Password
                      </Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 xs:h-4 xs:w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="pl-8 xs:pl-10 pr-10 text-sm h-9 xs:h-10 text-responsive-sm"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-2 xs:px-3 touch-target"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-3 w-3 xs:h-4 xs:w-4" />
                          ) : (
                            <Eye className="h-3 w-3 xs:h-4 xs:w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full text-sm h-9 xs:h-10 touch-target text-responsive-sm"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-3 w-3 xs:h-4 xs:w-4 border-b-2 border-white mr-2"></div>
                          Signing in...
                        </div>
                      ) : (
                        <>
                          <LogIn className="h-3 w-3 xs:h-4 xs:w-4 mr-2" />
                          Sign In
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Demo Account Info */}
              <Card className="bg-blue-50 border-blue-200 agent-card">
                <CardContent className="p-3 xs:p-4 p-mobile-3">
                  <h3 className="font-medium text-blue-900 mb-2 text-xs xs:text-sm text-responsive-xs">
                    Demo Account
                  </h3>
                  <p className="text-xs xs:text-sm text-blue-800 text-responsive-xs">
                    Use any email and password to sign in for demo purposes.
                  </p>
                </CardContent>
              </Card>

              {/* Sign Up Link */}
              <div className="text-center space-y-3 pb-8 mt-8">
                <p className="text-xs xs:text-sm text-muted-foreground text-responsive-xs">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-primary hover:underline font-medium"
                  >
                    Create Account
                  </Link>
                </p>
                <p className="text-xs xs:text-sm text-muted-foreground text-responsive-xs">
                  <Link href="/" className="text-primary hover:underline">
                    ← Back to Homepage
                  </Link>
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
