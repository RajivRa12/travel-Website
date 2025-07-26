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
  UserPlus,
  User,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/components/auth/auth-context";
import { useRouter } from "next/navigation";

const SignUpHeader = () => (
  <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm app-header agent-header-mobile">
    <div className="mx-auto flex max-w-2xl items-center justify-between p-2 xs:p-4 app-header-content">
      <Link href="/" passHref>
        <Button variant="ghost" size="icon" className="touch-target">
          <ArrowLeft className="h-4 w-4 xs:h-5 xs:w-5" />
          <span className="sr-only">Back</span>
        </Button>
      </Link>
      <h1 className="text-lg xs:text-xl font-bold text-foreground font-headline text-responsive-lg">
        Create Account
      </h1>
      <div className="w-8 xs:w-10"></div>
    </div>
  </header>
);

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      // Basic validation
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords don't match");
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Demo signup - auto-login for demo purposes
      login({
        name: formData.name,
        email: formData.email,
        avatar: "https://placehold.co/100x100.png",
      });

      setMessage("Account created successfully! Redirecting...");

      setTimeout(() => {
        router.push("/");
      }, 1000);

    } catch (error) {
      console.error("SignUp error:", error);
      setError("An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto max-w-2xl">
        <div className="min-h-screen">
          <SignUpHeader />
          <main className="p-3 xs:p-6 agent-container">
            <div className="max-w-md mx-auto space-y-4 xs:space-y-6 py-4 pb-8">
              <div className="text-center space-y-2">
                <div className="mx-auto h-12 w-12 xs:h-16 xs:w-16 bg-primary rounded-lg flex items-center justify-center">
                  <UserPlus className="h-6 w-6 xs:h-8 xs:w-8 text-primary-foreground" />
                </div>
                <h2 className="text-xl xs:text-2xl font-bold text-responsive-lg">
                  Join Roam Southeast
                </h2>
                <p className="text-sm xs:text-base text-muted-foreground text-responsive-sm">
                  Create your account and start exploring amazing travel packages
                </p>
              </div>

              <Card className="agent-card">
                <CardHeader className="p-3 xs:p-6 p-mobile-3">
                  <CardTitle className="text-base xs:text-lg text-responsive-base">
                    Create Your Account
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 xs:p-6 pt-0 p-mobile-3">
                  <form onSubmit={handleSignUp} className="space-y-4 xs:space-y-5 space-mobile-3">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription className="text-responsive-xs">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    {message && (
                      <Alert>
                        <AlertDescription className="text-responsive-xs text-green-600">
                          {message}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-1 xs:space-y-2">
                      <Label htmlFor="name" className="text-xs xs:text-sm text-responsive-xs">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 xs:h-4 xs:w-4 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Enter your full name"
                          className="pl-8 xs:pl-10 text-sm h-9 xs:h-10 text-responsive-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1 xs:space-y-2">
                      <Label htmlFor="email" className="text-xs xs:text-sm text-responsive-xs">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 xs:h-4 xs:w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Enter your email"
                          className="pl-8 xs:pl-10 text-sm h-9 xs:h-10 text-responsive-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1 xs:space-y-2">
                      <Label htmlFor="phone" className="text-xs xs:text-sm text-responsive-xs">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 xs:h-4 xs:w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="Enter your phone number"
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
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          placeholder="Create a password"
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

                    <div className="space-y-1 xs:space-y-2">
                      <Label htmlFor="confirmPassword" className="text-xs xs:text-sm text-responsive-xs">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 xs:h-4 xs:w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          placeholder="Confirm your password"
                          className="pl-8 xs:pl-10 pr-10 text-sm h-9 xs:h-10 text-responsive-sm"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-2 xs:px-3 touch-target"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
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
                          Creating Account...
                        </div>
                      ) : (
                        <>
                          <UserPlus className="h-3 w-3 xs:h-4 xs:w-4 mr-2" />
                          Create Account
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Sign In Link */}
              <div className="text-center space-y-3 pb-8 mt-8">
                <p className="text-xs xs:text-sm text-muted-foreground text-responsive-xs">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-primary hover:underline font-medium"
                  >
                    Sign In
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
