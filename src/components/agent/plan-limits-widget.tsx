"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  Crown,
  TrendingUp,
  Package,
  Camera,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface PlanLimitsProps {
  currentPlan: "trial" | "growth" | "pro";
  usage: {
    packages: {
      current: number;
      limit: number;
    };
    photos: {
      current: number;
      limit: number;
    };
    bookingsThisMonth: {
      current: number;
      limit: number;
    };
  };
}

const planDetails = {
  trial: {
    name: "Trial",
    price: "₹0/year",
    color: "bg-gray-100 text-gray-600",
    icon: Zap,
    features: ["3 packages", "30 photos", "Basic support"],
  },
  growth: {
    name: "Growth",
    price: "₹3,499/year",
    color: "bg-blue-100 text-blue-600",
    icon: TrendingUp,
    features: ["25 packages", "250 photos", "Priority support", "Auto-publish"],
  },
  pro: {
    name: "Pro",
    price: "₹9,999/year",
    color: "bg-purple-100 text-purple-600",
    icon: Crown,
    features: [
      "Unlimited packages",
      "Unlimited photos",
      "24/7 support",
      "Custom branding",
    ],
  },
};

export default function PlanLimitsWidget({
  currentPlan,
  usage,
}: PlanLimitsProps) {
  const plan = planDetails[currentPlan];
  const Icon = plan.icon;

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (current: number, limit: number) => {
    if (limit === -1) return "text-green-600"; // Unlimited
    const percentage = (current / limit) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-orange-600";
    return "text-green-600";
  };

  const isLimitReached = (current: number, limit: number) => {
    return limit !== -1 && current >= limit;
  };

  const isNearLimit = (current: number, limit: number) => {
    return limit !== -1 && current / limit >= 0.8;
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${plan.color}`}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg">{plan.name} Plan</CardTitle>
              <p className="text-xs sm:text-sm text-gray-500">{plan.price}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto" asChild>
            <Link href="/agent-dashboard/subscription">
              {currentPlan === "trial" ? "Upgrade Plan" : "Manage Plan"}
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Usage Metrics */}
        <div className="space-y-4">
          {/* Packages Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Packages</span>
                {isLimitReached(
                  usage.packages.current,
                  usage.packages.limit,
                ) && (
                  <Badge variant="destructive" className="text-xs">
                    Limit Reached
                  </Badge>
                )}
                {isNearLimit(usage.packages.current, usage.packages.limit) &&
                  !isLimitReached(
                    usage.packages.current,
                    usage.packages.limit,
                  ) && (
                    <Badge
                      variant="outline"
                      className="text-xs text-orange-600"
                    >
                      Near Limit
                    </Badge>
                  )}
              </div>
              <span
                className={`text-sm font-medium ${getUsageColor(usage.packages.current, usage.packages.limit)}`}
              >
                {usage.packages.current}
                {usage.packages.limit !== -1 && `/${usage.packages.limit}`}
                {usage.packages.limit === -1 && " (Unlimited)"}
              </span>
            </div>
            {usage.packages.limit !== -1 && (
              <Progress
                value={getUsagePercentage(
                  usage.packages.current,
                  usage.packages.limit,
                )}
                className="h-2"
              />
            )}
          </div>

          {/* Photos Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Camera className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Photos</span>
                {isLimitReached(usage.photos.current, usage.photos.limit) && (
                  <Badge variant="destructive" className="text-xs">
                    Limit Reached
                  </Badge>
                )}
                {isNearLimit(usage.photos.current, usage.photos.limit) &&
                  !isLimitReached(usage.photos.current, usage.photos.limit) && (
                    <Badge
                      variant="outline"
                      className="text-xs text-orange-600"
                    >
                      Near Limit
                    </Badge>
                  )}
              </div>
              <span
                className={`text-sm font-medium ${getUsageColor(usage.photos.current, usage.photos.limit)}`}
              >
                {usage.photos.current}
                {usage.photos.limit !== -1 && `/${usage.photos.limit}`}
                {usage.photos.limit === -1 && " (Unlimited)"}
              </span>
            </div>
            {usage.photos.limit !== -1 && (
              <Progress
                value={getUsagePercentage(
                  usage.photos.current,
                  usage.photos.limit,
                )}
                className="h-2"
              />
            )}
          </div>

          {/* Monthly Bookings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">
                  Bookings (This Month)
                </span>
              </div>
              <span
                className={`text-sm font-medium ${getUsageColor(usage.bookingsThisMonth.current, usage.bookingsThisMonth.limit)}`}
              >
                {usage.bookingsThisMonth.current}
                {usage.bookingsThisMonth.limit !== -1 &&
                  `/${usage.bookingsThisMonth.limit}`}
                {usage.bookingsThisMonth.limit === -1 && " (Unlimited)"}
              </span>
            </div>
            {usage.bookingsThisMonth.limit !== -1 && (
              <Progress
                value={getUsagePercentage(
                  usage.bookingsThisMonth.current,
                  usage.bookingsThisMonth.limit,
                )}
                className="h-2"
              />
            )}
          </div>
        </div>

        {/* Upgrade Recommendations */}
        {currentPlan === "trial" && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">
                  Ready to grow?
                </p>
                <p className="text-xs text-blue-600">
                  Upgrade to Growth plan for 25 packages, auto-publishing, and
                  priority support.
                </p>
                <Button size="sm" className="mt-2" asChild>
                  <Link href="/agent-dashboard/subscription">
                    Upgrade to Growth - <span className="rupee-font">₹</span>3,499/year
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentPlan === "growth" && (
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <div className="flex items-start space-x-2">
              <Crown className="h-4 w-4 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-800">
                  Scale your business
                </p>
                <p className="text-xs text-purple-600">
                  Go Pro for unlimited packages, custom branding, and dedicated
                  support.
                </p>
                <Button size="sm" variant="outline" className="mt-2" asChild>
                  <Link href="/agent-dashboard/subscription">
                    Upgrade to Pro - <span className="rupee-font">₹</span>9,999/year
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Plan Features */}
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-2">
            Plan Features
          </p>
          <div className="flex flex-wrap gap-1">
            {plan.features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
