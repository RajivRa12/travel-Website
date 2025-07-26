"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Building2,
  CreditCard,
  Package,
  Inbox,
  Wallet,
  BarChart3,
  Settings,
  Home,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import AgentNavigation from "@/components/agent/agent-navigation";
import { useEffect, useState } from "react";

export default function AgentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for agent session
    const agentSession = localStorage.getItem("agent_session");
    if (agentSession) {
      setIsAuthenticated(true);
    } else {
      router.replace("/agent-login");
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-12 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/" className="text-lg sm:text-xl font-bold text-blue-600">
                Roam Southeast
              </Link>
              <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">Agent Dashboard</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="text-xs px-2 py-1 sm:px-3 sm:py-2"
                onClick={() => {
                  localStorage.removeItem("agent_session");
                  router.push("/");
                }}
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
              <Button variant="outline" size="sm" className="text-xs px-2 py-1 sm:px-3 sm:py-2" asChild>
                <Link href="/">
                  <Home className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Site</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-2 sm:gap-8">
          {/* Sidebar Navigation - Horizontal on mobile landscape, vertical on larger screens */}
          <div className="lg:w-64 lg:flex-shrink-0">
            <AgentNavigation />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
