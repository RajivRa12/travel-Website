"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IndianRupee,
  Users,
  Package,
  UserCheck,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  Star,
  Globe,
  CreditCard,
  UserX,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Activity,
} from "lucide-react";
import { GoogleAnalyticsDashboard } from "@/components/analytics/google-analytics-dashboard";

// Mock data for charts
const monthlyRevenueData = [
  { month: "Jan", revenue: 450000, bookings: 65, mrr: 125000 },
  { month: "Feb", revenue: 520000, bookings: 59, mrr: 135000 },
  { month: "Mar", revenue: 680000, bookings: 80, mrr: 145000 },
  { month: "Apr", revenue: 710000, bookings: 81, mrr: 155000 },
  { month: "May", revenue: 620000, bookings: 56, mrr: 165000 },
  { month: "Jun", revenue: 850000, bookings: 95, mrr: 175000 },
];

const destinationRevenueData = [
  { name: "Thailand", value: 2400000, bookings: 145, color: "#0088FE" },
  { name: "Indonesia", value: 1800000, bookings: 89, color: "#00C49F" },
  { name: "Vietnam", value: 1200000, bookings: 67, color: "#FFBB28" },
  { name: "Singapore", value: 950000, bookings: 45, color: "#FF8042" },
  { name: "Malaysia", value: 750000, bookings: 34, color: "#8884d8" },
];

const npsData = [
  { category: "Promoters (9-10)", count: 156, percentage: 78 },
  { category: "Passives (7-8)", count: 32, percentage: 16 },
  { category: "Detractors (0-6)", count: 12, percentage: 6 },
];

// Workflow data
const workflowSteps = [
  {
    id: 1,
    title: "KYC Approval",
    description: "Review & approve new agent registrations",
    icon: UserCheck,
    href: "/superadmin/agents",
    pending: 3,
    status: "pending",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    id: 2,
    title: "Subscription Check",
    description: "Verify agent subscription status",
    icon: CreditCard,
    href: "/superadmin/subscriptions",
    pending: 2,
    status: "pending",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    id: 3,
    title: "Package Approval",
    description: "Review & approve travel packages",
    icon: Package,
    href: "/superadmin/packages",
    pending: 7,
    status: "pending",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    id: 4,
    title: "Monitor Bookings",
    description: "Track booking operations & status",
    icon: Briefcase,
    href: "/superadmin/bookings",
    pending: 12,
    status: "active",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    id: 5,
    title: "Payout Approval",
    description: "Process agent payout requests",
    icon: IndianRupee,
    href: "/superadmin/payouts",
    pending: 2,
    status: "pending",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  {
    id: 6,
    title: "Analytics",
    description: "View platform performance metrics",
    icon: TrendingUp,
    href: "/superadmin/dashboard",
    pending: 0,
    status: "completed",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
  },
];

export default function SuperAdminDashboardPage() {
  const [dateRange, setDateRange] = React.useState("30d");
  const [selectedDestination, setSelectedDestination] = React.useState("all");
  const [selectedMetric, setSelectedMetric] = React.useState("revenue");

  // Calculate NPS score: (% Promoters - % Detractors)
  const npsScore = npsData[0].percentage - npsData[2].percentage;

  const kpiCards = [
    {
      title: "Daily Bookings",
      value: "23",
      change: "+12.5%",
      trend: "up",
      icon: Briefcase,
      description: "Today vs Yesterday",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Monthly Recurring Revenue (MRR)",
      value: "₹1,75,000",
      change: "+8.3%",
      trend: "up",
      icon: CreditCard,
      description: "Subscription revenue",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Active DMCs",
      value: "234",
      change: "+15",
      trend: "up",
      icon: UserCheck,
      description: "Verified & Active",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Traveler NPS Score",
      value: `${npsScore}`,
      change: "+5 points",
      trend: "up",
      icon: Star,
      description: "Net Promoter Score",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Total Revenue",
      value: "₹45,23,189",
      change: "+20.1%",
      trend: "up",
      icon: IndianRupee,
      description: "This month",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Pending Approvals",
      value: "12",
      change: "-3",
      trend: "down",
      icon: Clock,
      description: "DMCs + Packages",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Platform Health",
      value: "99.2%",
      change: "+0.1%",
      trend: "up",
      icon: CheckCircle,
      description: "Uptime this month",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Support Tickets",
      value: "8",
      change: "-4",
      trend: "down",
      icon: AlertTriangle,
      description: "Open tickets",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const recentActivities = [
    {
      type: "booking",
      message: "New booking by Rahul Sharma for Thailand package",
      time: "2 min ago",
      status: "success",
    },
    {
      type: "dmc",
      message: "DMC 'Exotic Travel Co' submitted new package for approval",
      time: "15 min ago",
      status: "pending",
    },
    {
      type: "payout",
      message: "Payout of ₹45,000 processed to Paradise Tours",
      time: "1 hour ago",
      status: "success",
    },
    {
      type: "alert",
      message: "High bounce rate detected on Singapore packages",
      time: "2 hours ago",
      status: "warning",
    },
    {
      type: "user",
      message: "124 new user registrations today",
      time: "3 hours ago",
      status: "info",
    },
  ];

  const handleExportData = () => {
    // Mock export functionality
    alert("Exporting dashboard data as CSV...");
  };

  const PlatformOverviewContent = () => (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Platform Overview
          </h2>
          <p className="text-gray-600">
            Comprehensive platform overview and business analytics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <Select
              value={selectedDestination}
              onValueChange={setSelectedDestination}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Destinations</SelectItem>
                <SelectItem value="thailand">Thailand</SelectItem>
                <SelectItem value="indonesia">Indonesia</SelectItem>
                <SelectItem value="vietnam">Vietnam</SelectItem>
                <SelectItem value="singapore">Singapore</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          const TrendIcon = card.trend === "up" ? TrendingUp : TrendingDown;
          const trendColor =
            card.trend === "up" ? "text-green-600" : "text-red-600";

          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {card.title === "Total Revenue" ? (
                        <>
                          <span className="rupee-font">₹</span>
                          {card.value.replace('₹', '')}
                        </>
                      ) : (
                        card.value
                      )}
                    </p>
                    <div className={`flex items-center text-sm ${trendColor}`}>
                      <TrendIcon className="h-3 w-3 mr-1" />
                      <span className="font-medium">{card.change}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {card.description}
                    </p>
                  </div>
                  <div className={`${card.bgColor} p-3 rounded-full`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Admin Workflow Section */}
      <div className="mt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Workflow
          </h2>
          <p className="text-gray-600">
            Follow the sequential workflow to manage the platform effectively
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = step.status === "completed";
            const isPending = step.status === "pending";
            const hasNext = index < workflowSteps.length - 1;

            return (
              <div key={step.id} className="relative">
                <Card
                  className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${step.borderColor} border-2 ${isPending ? "ring-2 ring-offset-2 ring-orange-500" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${step.bgColor}`}>
                        <Icon className={`h-6 w-6 ${step.color}`} />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          Step {step.id}
                        </Badge>
                        {step.pending > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {step.pending}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {step.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {isCompleted && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {isPending && (
                          <Clock className="h-4 w-4 text-orange-600" />
                        )}
                        <span
                          className={`text-xs font-medium ${isCompleted ? "text-green-600" : isPending ? "text-orange-600" : "text-blue-600"}`}
                        >
                          {isCompleted
                            ? "Completed"
                            : isPending
                              ? "Needs Action"
                              : "Active"}
                        </span>
                      </div>

                      <Button
                        size="sm"
                        variant={isPending ? "default" : "outline"}
                        onClick={() => (window.location.href = step.href)}
                      >
                        {isPending ? "Review" : "View"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Connection Arrow */}
                {hasNext && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <div className="w-4 h-0.5 bg-gray-300"></div>
                    <div className="w-0 h-0 border-l-4 border-l-gray-300 border-t-2 border-b-2 border-t-transparent border-b-transparent absolute top-0 right-0 transform -translate-y-1/2"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Workflow Progress */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">
              Overall Workflow Progress
            </h4>
            <span className="text-sm text-gray-600">
              {workflowSteps.filter((s) => s.status === "completed").length} of{" "}
              {workflowSteps.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(workflowSteps.filter((s) => s.status === "completed").length / workflowSteps.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Booking Trends</CardTitle>
            <CardDescription>Monthly performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value, name) => [
                    name === "revenue" ? `₹${value.toLocaleString()}` : value,
                    name === "revenue"
                      ? "Revenue"
                      : name === "bookings"
                        ? "Bookings"
                        : "MRR",
                  ]}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="revenue"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bookings"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="bookings"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="mrr"
                  stroke="#ffc658"
                  strokeWidth={2}
                  name="mrr"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Destination Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Destination</CardTitle>
            <CardDescription>Top performing locations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={destinationRevenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {destinationRevenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `₹${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* NPS Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Net Promoter Score (NPS)</CardTitle>
            <CardDescription>Customer satisfaction breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {npsScore}
                </div>
                <p className="text-sm text-gray-600">Excellent Score</p>
              </div>
              {npsData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Platform Activity</CardTitle>
            <CardDescription>
              Live updates from across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === "success"
                        ? "bg-green-500"
                        : activity.status === "warning"
                          ? "bg-yellow-500"
                          : activity.status === "pending"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col">
              <UserCheck className="h-6 w-6 mb-2" />
              <span className="text-sm">Approve DMCs</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Package className="h-6 w-6 mb-2" />
              <span className="text-sm">Review Packages</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <IndianRupee className="h-6 w-6 mb-2" />
              <span className="text-sm">Process Payouts</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Users className="h-6 w-6 mb-2" />
              <span className="text-sm">Manage Users</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive platform analytics and management
          </p>
        </div>
      </div>

      <Tabs defaultValue="google-analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="google-analytics" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Google Analytics
          </TabsTrigger>
          <TabsTrigger value="platform-overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Platform Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="google-analytics">
          <GoogleAnalyticsDashboard userRole="superadmin" />
        </TabsContent>

        <TabsContent value="platform-overview">
          <PlatformOverviewContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
