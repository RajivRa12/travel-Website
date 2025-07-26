"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Demo agent credentials
const demoAgent = {
  id: "agent_001",
  email: "demo@agent.com",
  password: "demo123",
  name: "Travel Pro Agency",
  plan: "growth",
};

export default function AgentLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check demo credentials
      if (email === demoAgent.email && password === demoAgent.password) {
        // Set agent session
        localStorage.setItem(
          "agent_session",
          JSON.stringify({
            id: demoAgent.id,
            name: demoAgent.name,
            plan: demoAgent.plan,
            email: demoAgent.email,
          }),
        );

        // Navigate to agent dashboard
        router.push("/agent-dashboard");
      } else {
        setError(
          "Invalid email or password. Try the demo account: demo@agent.com / demo123"
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-2 xs:py-4 sm:py-12 px-2 sm:px-4 lg:px-8">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 xs:gap-4 lg:gap-8 items-start agent-form-mobile">
          {/* Left Column - Header and Demo Info */}
          <div className="space-y-2 xs:space-y-4 lg:space-y-8">
            {/* Header */}
            <div className="text-center lg:text-left">
              <div className="mx-auto lg:mx-0 h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h2 className="mt-2 xs:mt-4 sm:mt-6 text-lg xs:text-2xl sm:text-3xl font-bold text-gray-900 text-responsive-xl">
                Agent Dashboard Login
              </h2>
              <p className="mt-1 xs:mt-2 text-xs xs:text-sm text-gray-600 text-responsive-sm">
                Sign in to your agent account to manage packages and bookings
              </p>
            </div>

            {/* Demo Account Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-2 xs:p-3 sm:p-4 agent-card">
                <h3 className="font-medium text-blue-900 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base text-responsive-base">Demo Account</h3>
                <div className="text-xs sm:text-sm text-blue-800 space-y-1 text-responsive-sm">
                  <p><strong>Email:</strong> demo@agent.com</p>
                  <p><strong>Password:</strong> demo123</p>
                  <p className="text-blue-600 mt-1 xs:mt-2">Use these credentials to access the agent dashboard</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-1 xs:mt-2 text-xs touch-target agent-btn-compact"
                    onClick={() => {
                      setEmail(demoAgent.email);
                      setPassword(demoAgent.password);
                    }}
                  >
                    Auto-fill Demo Credentials
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Login Form */}
          <div className="space-y-2 xs:space-y-4">

            {/* Login Form */}
            <Card className="agent-card">
              <CardHeader className="pb-2 xs:pb-3 sm:pb-6 p-mobile-3">
                <CardTitle className="text-base xs:text-lg sm:text-xl text-responsive-lg">Sign In</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-responsive-sm">
                  Enter your registered agent credentials to access the dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 p-mobile-3">
                <form onSubmit={handleLogin} className="space-y-2 xs:space-y-3 sm:space-y-4 space-mobile-2">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="pl-9 sm:pl-10 text-sm h-9 sm:h-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="password" className="text-xs sm:text-sm">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="pl-9 sm:pl-10 pr-10 text-sm h-9 sm:h-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-2 sm:px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full text-sm h-9 sm:h-10" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      <>
                        <LogIn className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Additional Links */}
            <div className="text-center space-y-2">
              <p className="text-xs sm:text-sm text-gray-600">
                Don't have an agent account?{" "}
                <button
                  onClick={() => router.push("/?register=agent")}
                  className="text-blue-600 hover:underline"
                >
                  Register as Agent
                </button>
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                <Link href="/" className="text-blue-600 hover:underline">
                  ← Back to Main Site
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
