"use client";

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  IndianRupee,
  Package,
  Briefcase,
  UserCheck,
  Activity,
  Globe,
  Star,
  Clock,
  CreditCard,
  BarChart3,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

// Enhanced data types
interface AnalyticsData {
  overview: {
    totalRevenue: number;
    revenueChange: number;
    totalBookings: number;
    bookingsChange: number;
    activeAgents: number;
    agentsChange: number;
    avgBookingValue: number;
    avgValueChange: number;
    conversionRate: number;
    conversionChange: number;
    customerSatisfaction: number;
    satisfactionChange: number;
  };
  revenueData: Array<{
    month: string;
    revenue: number;
    bookings: number;
    avgValue: number;
  }>;
  bookingTrends: Array<{
    date: string;
    bookings: number;
    revenue: number;
    customers: number;
  }>;
  topDestinations: Array<{
    name: string;
    revenue: number;
    bookings: number;
    growth: number;
    color: string;
  }>;
  agentPerformance: Array<{
    name: string;
    revenue: number;
    bookings: number;
    rating: number;
    packages: number;
  }>;
  customerSegments: Array<{
    segment: string;
    value: number;
    percentage: number;
    color: string;
  }>;
  platformMetrics: {
    dau: number;
    mau: number;
    retention: number;
    churnRate: number;
    ltv: number;
    cac: number;
  };
}

const EnhancedAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  // Mock data - in production, this would come from Supabase
  const mockAnalyticsData: AnalyticsData = {
    overview: {
      totalRevenue: 2850000,
      revenueChange: 12.5,
      totalBookings: 486,
      bookingsChange: 8.3,
      activeAgents: 23,
      agentsChange: 15.2,
      avgBookingValue: 58600,
      avgValueChange: 4.1,
      conversionRate: 3.2,
      conversionChange: 0.8,
      customerSatisfaction: 4.7,
      satisfactionChange: 0.2,
    },
    revenueData: [
      { month: 'Jan', revenue: 420000, bookings: 72, avgValue: 58333 },
      { month: 'Feb', revenue: 380000, bookings: 65, avgValue: 58461 },
      { month: 'Mar', revenue: 520000, bookings: 89, avgValue: 58426 },
      { month: 'Apr', revenue: 680000, bookings: 116, avgValue: 58620 },
      { month: 'May', revenue: 450000, bookings: 77, avgValue: 58441 },
      { month: 'Jun', revenue: 750000, bookings: 128, avgValue: 58594 },
    ],
    bookingTrends: [
      { date: '2024-01-01', bookings: 12, revenue: 720000, customers: 45 },
      { date: '2024-01-02', bookings: 15, revenue: 890000, customers: 52 },
      { date: '2024-01-03', bookings: 8, revenue: 460000, customers: 28 },
      { date: '2024-01-04', bookings: 18, revenue: 1080000, customers: 64 },
      { date: '2024-01-05', bookings: 22, revenue: 1320000, customers: 78 },
      { date: '2024-01-06', bookings: 14, revenue: 840000, customers: 48 },
      { date: '2024-01-07', bookings: 19, revenue: 1140000, customers: 67 },
    ],
    topDestinations: [
      { name: 'Thailand', revenue: 980000, bookings: 156, growth: 15.2, color: '#0088FE' },
      { name: 'Indonesia', revenue: 750000, bookings: 128, growth: 12.8, color: '#00C49F' },
      { name: 'Vietnam', revenue: 520000, bookings: 89, growth: 8.4, color: '#FFBB28' },
      { name: 'Singapore', revenue: 380000, bookings: 64, growth: 22.1, color: '#FF8042' },
      { name: 'Malaysia', revenue: 220000, bookings: 49, growth: 5.7, color: '#8884d8' },
    ],
    agentPerformance: [
      { name: 'Travel Experts Co.', revenue: 450000, bookings: 78, rating: 4.9, packages: 12 },
      { name: 'Southeast Adventures', revenue: 380000, bookings: 65, rating: 4.8, packages: 15 },
      { name: 'Dream Destinations', revenue: 320000, bookings: 54, rating: 4.7, packages: 9 },
      { name: 'Island Hoppers', revenue: 280000, bookings: 47, rating: 4.6, packages: 8 },
      { name: 'Cultural Journeys', revenue: 250000, bookings: 42, rating: 4.8, packages: 11 },
    ],
    customerSegments: [
      { segment: 'Premium Travelers', value: 45, percentage: 45, color: '#0088FE' },
      { segment: 'Adventure Seekers', value: 30, percentage: 30, color: '#00C49F' },
      { segment: 'Cultural Enthusiasts', value: 15, percentage: 15, color: '#FFBB28' },
      { segment: 'Budget Travelers', value: 10, percentage: 10, color: '#FF8042' },
    ],
    platformMetrics: {
      dau: 1250,
      mau: 15600,
      retention: 78.5,
      churnRate: 5.2,
      ltv: 125000,
      cac: 8500,
    },
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // In production, fetch real data from Supabase
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setAnalyticsData(mockAnalyticsData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => (
    <>
      <span className="rupee-font">₹</span>
      {amount.toLocaleString()}
    </>
  );
  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercentage = (num: number) => `${num}%`;

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="h-3 w-3 text-green-600" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-600" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enhanced Analytics</h2>
          <p className="text-gray-600">Comprehensive platform insights and metrics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalyticsData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(analyticsData.overview.totalRevenue)}</p>
                <div className={`flex items-center gap-1 text-xs ${getChangeColor(analyticsData.overview.revenueChange)}`}>
                  {getChangeIcon(analyticsData.overview.revenueChange)}
                  {Math.abs(analyticsData.overview.revenueChange)}% vs last period
                </div>
              </div>
              <IndianRupee className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{formatNumber(analyticsData.overview.totalBookings)}</p>
                <div className={`flex items-center gap-1 text-xs ${getChangeColor(analyticsData.overview.bookingsChange)}`}>
                  {getChangeIcon(analyticsData.overview.bookingsChange)}
                  {Math.abs(analyticsData.overview.bookingsChange)}% vs last period
                </div>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold">{formatNumber(analyticsData.overview.activeAgents)}</p>
                <div className={`flex items-center gap-1 text-xs ${getChangeColor(analyticsData.overview.agentsChange)}`}>
                  {getChangeIcon(analyticsData.overview.agentsChange)}
                  {Math.abs(analyticsData.overview.agentsChange)}% vs last period
                </div>
              </div>
              <UserCheck className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Booking Value</p>
                <p className="text-2xl font-bold">{formatCurrency(analyticsData.overview.avgBookingValue)}</p>
                <div className={`flex items-center gap-1 text-xs ${getChangeColor(analyticsData.overview.avgValueChange)}`}>
                  {getChangeIcon(analyticsData.overview.avgValueChange)}
                  {Math.abs(analyticsData.overview.avgValueChange)}% vs last period
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{formatPercentage(analyticsData.overview.conversionRate)}</p>
                <div className={`flex items-center gap-1 text-xs ${getChangeColor(analyticsData.overview.conversionChange)}`}>
                  {getChangeIcon(analyticsData.overview.conversionChange)}
                  {Math.abs(analyticsData.overview.conversionChange)}% vs last period
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Satisfaction</p>
                <p className="text-2xl font-bold">{analyticsData.overview.customerSatisfaction}/5</p>
                <div className={`flex items-center gap-1 text-xs ${getChangeColor(analyticsData.overview.satisfactionChange)}`}>
                  {getChangeIcon(analyticsData.overview.satisfactionChange)}
                  {Math.abs(analyticsData.overview.satisfactionChange)} vs last period
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-fit">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `₹${(value / 1000)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0088FE"
                      fill="#0088FE"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Destinations</CardTitle>
                <CardDescription>Revenue by destination</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.topDestinations}
                      dataKey="revenue"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                    >
                      {analyticsData.topDestinations.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
                <CardDescription>Daily booking performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.bookingTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value, name) => [
                        name === 'revenue' ? formatCurrency(value as number) : value,
                        name
                      ]}
                    />
                    <Line type="monotone" dataKey="bookings" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="customers" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>Top performing agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.agentPerformance.map((agent, index) => (
                    <div key={agent.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-sm text-gray-600">{agent.packages} packages • {agent.bookings} bookings</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(agent.revenue)}</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm">{agent.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>Customer distribution by segment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart data={analyticsData.customerSegments}>
                    <RadialBar
                      dataKey="percentage"
                      cornerRadius={10}
                      fill="#8884d8"
                    />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Metrics</CardTitle>
                <CardDescription>Key engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{formatNumber(analyticsData.platformMetrics.dau)}</p>
                    <p className="text-sm text-gray-600">Daily Active Users</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{formatNumber(analyticsData.platformMetrics.mau)}</p>
                    <p className="text-sm text-gray-600">Monthly Active Users</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{analyticsData.platformMetrics.retention}%</p>
                    <p className="text-sm text-gray-600">Retention Rate</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(analyticsData.platformMetrics.ltv)}</p>
                    <p className="text-sm text-gray-600">Customer LTV</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>AI-powered recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Strong Performance</p>
                      <p className="text-sm text-green-700">Thailand packages showing 15.2% growth this quarter</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Attention Needed</p>
                      <p className="text-sm text-yellow-700">Customer acquisition cost increased by 12% this month</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Opportunity</p>
                      <p className="text-sm text-blue-700">Singapore market shows potential for 25% revenue increase</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Suggested actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <p className="font-medium">Expand Thailand Offerings</p>
                    <p className="text-sm text-gray-600">Consider adding more Thailand packages to capitalize on high demand</p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <p className="font-medium">Agent Training Program</p>
                    <p className="text-sm text-gray-600">Implement training for agents with lower performance ratings</p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <p className="font-medium">Customer Retention Campaign</p>
                    <p className="text-sm text-gray-600">Launch loyalty program to improve retention rates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
