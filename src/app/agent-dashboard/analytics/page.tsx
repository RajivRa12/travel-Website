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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  Users,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Calendar,
  Package,
  Star,
  MessageSquare,
  Download,
  Filter,
  BarChart3,
  Activity,
  Globe,
} from "lucide-react";
import { GoogleAnalyticsDashboard } from "@/components/analytics/google-analytics-dashboard";

// Mock analytics data
const mockData = {
  overview: {
    totalViews: 15234,
    viewsChange: 12.5,
    totalEnquiries: 456,
    enquiriesChange: -5.2,
    conversionRate: 3.2,
    conversionChange: 0.8,
    totalRevenue: 2456789,
    revenueChange: 23.1,
  },
  packagePerformance: [
    {
      id: 1,
      title: "Bangkok Pattaya Discovery",
      views: 3456,
      enquiries: 89,
      bookings: 12,
      conversionRate: 3.5,
      revenue: 311988,
      rating: 4.8,
      reviewsCount: 24,
    },
    {
      id: 2,
      title: "Bali Cultural Heritage",
      views: 2789,
      enquiries: 67,
      bookings: 8,
      conversionRate: 2.9,
      revenue: 263992,
      rating: 4.5,
      reviewsCount: 18,
    },
    {
      id: 3,
      title: "Singapore Marina Bay Experience",
      views: 4321,
      enquiries: 112,
      bookings: 15,
      conversionRate: 3.5,
      revenue: 2969910,
      rating: 4.9,
      reviewsCount: 32,
    },
    {
      id: 4,
      title: "Vietnam Scenic Journey",
      views: 1876,
      enquiries: 34,
      bookings: 3,
      conversionRate: 1.6,
      revenue: 296991,
      rating: 4.3,
      reviewsCount: 8,
    },
  ],
  monthlyData: [
    {
      month: "Jan 2024",
      views: 2456,
      enquiries: 78,
      bookings: 8,
      revenue: 198456,
    },
    {
      month: "Feb 2024",
      views: 3123,
      enquiries: 92,
      bookings: 12,
      revenue: 345678,
    },
    {
      month: "Mar 2024",
      views: 3567,
      enquiries: 104,
      bookings: 15,
      revenue: 423890,
    },
    {
      month: "Apr 2024",
      views: 2890,
      enquiries: 87,
      bookings: 9,
      revenue: 287654,
    },
    {
      month: "May 2024",
      views: 3234,
      enquiries: 95,
      bookings: 14,
      revenue: 389567,
    },
  ],
  topSources: [
    { source: "Organic Search", percentage: 45.6, visitors: 6946 },
    { source: "Direct Traffic", percentage: 23.4, visitors: 3565 },
    { source: "Social Media", percentage: 18.7, visitors: 2849 },
    { source: "Referrals", percentage: 8.9, visitors: 1356 },
    { source: "Email Campaigns", percentage: 3.4, visitors: 518 },
  ],
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");
  const [selectedPackage, setSelectedPackage] = useState("all");

  const formatCurrency = (amount: number) => (
    <>
      <span className="rupee-font">₹</span>
      {amount.toLocaleString()}
    </>
  );
  const formatPercentage = (value: number) =>
    `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

  // Handle export functionality
  const handleExport = () => {
    const csvData = [
      ['Package', 'Views', 'Enquiries', 'Bookings', 'Conversion Rate', 'Revenue', 'Rating', 'Reviews'],
      ...mockData.packagePerformance.map(pkg => [
        pkg.title,
        pkg.views,
        pkg.enquiries,
        pkg.bookings,
        `${pkg.conversionRate}%`,
        pkg.revenue,
        pkg.rating,
        pkg.reviewsCount
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Handle create functionality
  const handleCreate = () => {
    // This would typically open a modal or navigate to a creation page
    alert('Create new package/campaign functionality would be implemented here');
  };

  const getTrendIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getTrendColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  const BusinessAnalyticsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-start xs:items-center">
        <div>
          <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 text-responsive-lg">Business Analytics</h2>
          <p className="text-xs xs:text-sm text-gray-600 text-responsive-xs">
            Track your package performance and business metrics
          </p>
        </div>
        <div className="flex items-center space-x-2 xs:space-x-4 agent-spacing">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32 xs:w-40 text-xs xs:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport} className="touch-target agent-btn-compact text-xs xs:text-sm">
            <Download className="h-3 w-3 xs:h-4 xs:w-4 mr-1 xs:mr-2" />
            <span className="hidden xs:inline">Export Report</span>
            <span className="xs:hidden">Export</span>
          </Button>
          <Button onClick={handleCreate} className="touch-target agent-btn-compact text-xs xs:text-sm">
            <span className="hidden xs:inline">Create Package</span>
            <span className="xs:hidden">Create</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 agent-form-mobile">
        <Card className="agent-card">
          <CardContent className="p-3 xs:p-4 sm:p-6 p-mobile-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs xs:text-sm font-medium text-gray-600 text-responsive-xs">Total Views</p>
                <p className="text-lg xs:text-xl sm:text-2xl font-bold text-responsive-lg">
                  {mockData.overview.totalViews.toLocaleString()}
                </p>
                <div
                  className={`flex items-center text-xs xs:text-sm ${getTrendColor(mockData.overview.viewsChange)} text-responsive-xs`}
                >
                  {getTrendIcon(mockData.overview.viewsChange)}
                  <span className="ml-1">
                    {formatPercentage(mockData.overview.viewsChange)}
                  </span>
                  <span className="text-gray-500 ml-1 hidden xs:inline">vs last period</span>
                </div>
              </div>
              <Eye className="h-6 w-6 xs:h-8 xs:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Enquiries
                </p>
                <p className="text-2xl font-bold">
                  {mockData.overview.totalEnquiries.toLocaleString()}
                </p>
                <div
                  className={`flex items-center text-sm ${getTrendColor(mockData.overview.enquiriesChange)}`}
                >
                  {getTrendIcon(mockData.overview.enquiriesChange)}
                  <span className="ml-1">
                    {formatPercentage(mockData.overview.enquiriesChange)}
                  </span>
                  <span className="text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Conversion Rate
                </p>
                <p className="text-2xl font-bold">
                  {mockData.overview.conversionRate}%
                </p>
                <div
                  className={`flex items-center text-sm ${getTrendColor(mockData.overview.conversionChange)}`}
                >
                  {getTrendIcon(mockData.overview.conversionChange)}
                  <span className="ml-1">
                    {formatPercentage(mockData.overview.conversionChange)}
                  </span>
                  <span className="text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(mockData.overview.totalRevenue)}
                </p>
                <div
                  className={`flex items-center text-sm ${getTrendColor(mockData.overview.revenueChange)}`}
                >
                  {getTrendIcon(mockData.overview.revenueChange)}
                  <span className="ml-1">
                    {formatPercentage(mockData.overview.revenueChange)}
                  </span>
                  <span className="text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <IndianRupee className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Performance Trend</CardTitle>
            <CardDescription>
              Views, enquiries, bookings, and revenue over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.monthlyData.map((month, index) => (
                <div
                  key={month.month}
                  className="grid grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {month.month}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Views</p>
                    <p className="font-medium">
                      {month.views.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Enquiries</p>
                    <p className="font-medium">{month.enquiries}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Bookings</p>
                    <p className="font-medium">{month.bookings}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="font-medium">
                      {formatCurrency(month.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>
              Where your visitors are coming from
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.topSources.map((source, index) => (
                <div
                  key={source.source}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{source.source}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm font-medium">{source.percentage}%</p>
                    <p className="text-xs text-gray-500">
                      {source.visitors.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Package Performance Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Package Performance</CardTitle>
              <CardDescription>
                Detailed analytics for each of your packages
              </CardDescription>
            </div>
            <Select value={selectedPackage} onValueChange={setSelectedPackage}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by package" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Packages</SelectItem>
                {mockData.packagePerformance.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id.toString()}>
                    {pkg.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Enquiries</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Reviews</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.packagePerformance.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>
                    <div
                      className="max-w-48 truncate font-medium"
                      title={pkg.title}
                    >
                      {pkg.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1 text-gray-400" />
                      {pkg.views.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1 text-gray-400" />
                      {pkg.enquiries}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      {pkg.bookings}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        pkg.conversionRate >= 3 ? "default" : "secondary"
                      }
                    >
                      {pkg.conversionRate}%
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(pkg.revenue)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400" />
                      {pkg.rating}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {pkg.reviewsCount} reviews
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">📊 Quick Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-4 rounded-lg">
              <p className="font-medium text-blue-800">
                🏆 Best Performing Package
              </p>
              <p className="text-blue-700">
                Singapore Marina Bay Experience with 4.9★ rating
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="font-medium text-blue-800">📈 Growth Opportunity</p>
              <p className="text-blue-700">
                Vietnam Scenic Journey has potential for improvement (1.6%
                conversion)
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="font-medium text-blue-800">🎯 Traffic Source</p>
              <p className="text-blue-700">
                45.6% of traffic comes from organic search
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="font-medium text-blue-800">💡 Recommendation</p>
              <p className="text-blue-700">
                Focus on improving package descriptions for better conversions
              </p>
            </div>
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
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive analytics for your travel business
          </p>
        </div>
      </div>

      <Tabs defaultValue="google-analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="google-analytics" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Google Analytics
          </TabsTrigger>
          <TabsTrigger value="business-analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Business Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="google-analytics">
          <GoogleAnalyticsDashboard userRole="agent" />
        </TabsContent>

        <TabsContent value="business-analytics">
          <BusinessAnalyticsContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
