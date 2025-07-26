"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  Globe,
  Users,
  Eye,
  Clock,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GoogleAnalyticsProps {
  userRole?: 'superadmin' | 'agent';
  agentId?: string;
}

// Generate dynamic analytics data based on time range and user role
const generateAnalyticsData = (userRole: string, timeRange: string) => {
  return generateAnalyticsDataWithSeed(userRole, timeRange, userRole.length + timeRange.length);
};

const generateAnalyticsDataWithSeed = (userRole: string, timeRange: string, customSeed: number) => {
  const baseMultiplier = userRole === 'superadmin' ? 37 : 1;
  const timeMultiplier = timeRange === "1d" ? 0.1 : timeRange === "7d" ? 1 : timeRange === "30d" ? 4.3 : 13;

  // Use deterministic "random" values based on seed to avoid hydration issues
  const seed = customSeed;
  const deterministicRandom = (index: number) => ((seed + index) * 9301 + 49297) % 233280 / 233280;

  return {
    overview: {
      totalUsers: Math.round(1234 * baseMultiplier * timeMultiplier),
      usersChange: (deterministicRandom(1) * 30 - 5),
      sessions: Math.round(2156 * baseMultiplier * timeMultiplier),
      sessionsChange: (deterministicRandom(2) * 20 - 3),
      pageViews: Math.round(8945 * baseMultiplier * timeMultiplier),
      pageViewsChange: (deterministicRandom(3) * 25 - 2),
      bounceRate: 35 + (deterministicRandom(4) * 20),
      bounceRateChange: (deterministicRandom(5) * 10 - 5),
      avgSessionDuration: `${Math.floor(deterministicRandom(6) * 3) + 2}m ${Math.floor(deterministicRandom(7) * 60)}s`,
      durationChange: (deterministicRandom(8) * 30 - 5),
      conversionRate: 3 + (deterministicRandom(9) * 2),
      conversionChange: (deterministicRandom(10) * 2 - 0.5),
    },
    traffic: Array.from({ length: timeRange === "1d" ? 24 : timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90 }, (_, i) => {
      const baseDate = new Date('2024-01-01').getTime();
      return {
        date: new Date(baseDate + (i * (timeRange === "1d" ? 3600000 : 86400000))).toISOString().split('T')[0],
        users: Math.floor(deterministicRandom(i + 20) * 500) + 800,
        sessions: Math.floor(deterministicRandom(i + 30) * 800) + 1200,
        pageViews: Math.floor(deterministicRandom(i + 40) * 1500) + 3000,
      };
    }),
    deviceTypes: [
      { name: 'Mobile', value: 60 + deterministicRandom(11) * 10, users: Math.round(2890 * baseMultiplier), color: '#0088FE' },
      { name: 'Desktop', value: 25 + deterministicRandom(12) * 8, users: Math.round(1244 * baseMultiplier), color: '#00C49F' },
      { name: 'Tablet', value: 5 + deterministicRandom(13) * 5, users: Math.round(311 * baseMultiplier), color: '#FFBB28' },
    ],
    topPages: [
      { page: '/', views: Math.round(12534 * baseMultiplier * timeMultiplier), bounce: 30 + deterministicRandom(14) * 10, avgTime: '2m 45s' },
      { page: '/packages', views: Math.round(8945 * baseMultiplier * timeMultiplier), bounce: 25 + deterministicRandom(15) * 8, avgTime: '4m 12s' },
      { page: '/packages/bali-discovery', views: Math.round(5672 * baseMultiplier * timeMultiplier), bounce: 20 + deterministicRandom(16) * 8, avgTime: '5m 30s' },
      { page: '/packages/thailand-adventure', views: Math.round(4321 * baseMultiplier * timeMultiplier), bounce: 22 + deterministicRandom(17) * 8, avgTime: '4m 58s' },
      { page: '/agent-login', views: Math.round(2145 * baseMultiplier * timeMultiplier), bounce: 40 + deterministicRandom(18) * 10, avgTime: '1m 32s' },
    ],
    acquisitionChannels: [
      { channel: 'Organic Search', sessions: Math.round(3456 * baseMultiplier * timeMultiplier), percentage: 35 + deterministicRandom(19) * 15, color: '#8884d8' },
      { channel: 'Direct', sessions: Math.round(2134 * baseMultiplier * timeMultiplier), percentage: 20 + deterministicRandom(20) * 10, color: '#82ca9d' },
      { channel: 'Social Media', sessions: Math.round(1523 * baseMultiplier * timeMultiplier), percentage: 15 + deterministicRandom(21) * 10, color: '#ffc658' },
      { channel: 'Referral', sessions: Math.round(892 * baseMultiplier * timeMultiplier), percentage: 8 + deterministicRandom(22) * 7, color: '#ff7300' },
      { channel: 'Email', sessions: Math.round(205 * baseMultiplier * timeMultiplier), percentage: 2 + deterministicRandom(23) * 3, color: '#00ff00' },
    ],
    realTimeUsers: Math.round(847 * baseMultiplier * (timeRange === "1d" ? 0.8 : 1)),
    countries: [
      { country: 'India', users: Math.round(2345 * baseMultiplier * timeMultiplier), flag: '🇮🇳' },
      { country: 'United States', users: Math.round(567 * baseMultiplier * timeMultiplier), flag: '🇺🇸' },
      { country: 'United Kingdom', users: Math.round(234 * baseMultiplier * timeMultiplier), flag: '🇬🇧' },
      { country: 'Australia', users: Math.round(198 * baseMultiplier * timeMultiplier), flag: '🇦🇺' },
      { country: 'Canada', users: Math.round(145 * baseMultiplier * timeMultiplier), flag: '🇨🇦' },
    ],
  };
};

export function GoogleAnalyticsDashboard({ userRole = 'agent', agentId }: GoogleAnalyticsProps) {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [analyticsData, setAnalyticsData] = useState(() => generateAnalyticsData(userRole, "7d"));
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state and initial timestamp after hydration
  useEffect(() => {
    setIsMounted(true);
    setLastUpdated(new Date());
  }, []);

  // Update data when time range changes
  useEffect(() => {
    if (isMounted) {
      setAnalyticsData(generateAnalyticsData(userRole, timeRange));
      setLastUpdated(new Date());
    }
  }, [timeRange, userRole, isMounted]);

  const refreshData = () => {
    if (!isMounted) return;

    setIsLoading(true);

    toast({
      title: "Refreshing Analytics",
      description: "Fetching latest data from Google Analytics...",
    });

    setTimeout(() => {
      // Create new data with a timestamp-based seed for variety
      const refreshSeed = Math.floor(Date.now() / 60000); // Changes every minute
      setAnalyticsData(generateAnalyticsDataWithSeed(userRole, timeRange, refreshSeed));
      setLastUpdated(new Date());
      setIsLoading(false);

      toast({
        title: "Data Updated",
        description: "Google Analytics data has been refreshed successfully.",
      });
    }, 2000);
  };

  const exportData = () => {
    const csvData = [
      ['Metric', 'Value', 'Change'],
      ['Total Users', analyticsData.overview.totalUsers, `${analyticsData.overview.usersChange.toFixed(1)}%`],
      ['Sessions', analyticsData.overview.sessions, `${analyticsData.overview.sessionsChange.toFixed(1)}%`],
      ['Page Views', analyticsData.overview.pageViews, `${analyticsData.overview.pageViewsChange.toFixed(1)}%`],
      ['Bounce Rate', `${analyticsData.overview.bounceRate.toFixed(1)}%`, `${analyticsData.overview.bounceRateChange.toFixed(1)}%`],
      ['Avg Session Duration', analyticsData.overview.avgSessionDuration, `${analyticsData.overview.durationChange.toFixed(1)}%`],
      ['Conversion Rate', `${analyticsData.overview.conversionRate.toFixed(1)}%`, `${analyticsData.overview.conversionChange.toFixed(1)}%`],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `google-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Analytics data exported for ${timeRange} period.`,
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getTimeRangeLabel = (range: string) => {
    switch(range) {
      case "1d": return "Last 24 hours";
      case "7d": return "Last 7 days";
      case "30d": return "Last 30 days";
      case "90d": return "Last 3 months";
      default: return "Last 7 days";
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              Google Analytics
              {userRole === 'superadmin' && (
                <Badge variant="secondary" className="ml-2">Super Admin View</Badge>
              )}
            </h2>
            <p className="text-gray-600 mt-1">
              Loading analytics data...
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <div className="text-xs text-gray-500">Loading data...</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Google Analytics
            {userRole === 'superadmin' && (
              <Badge variant="secondary" className="ml-2">Super Admin View</Badge>
            )}
          </h2>
          <p className="text-gray-600 mt-1">
            Last updated: {lastUpdated ? lastUpdated.toLocaleString() : 'Loading...'} • Period: {getTimeRangeLabel(timeRange)}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Real-time Users */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Real-time Active Users</p>
              <p className="text-3xl font-bold text-blue-600 flex items-center gap-2">
                <Activity className="h-8 w-8" />
                {analyticsData.realTimeUsers.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Currently browsing your site</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.totalUsers)}</div>
            <div className={`text-xs flex items-center gap-1 ${getChangeColor(analyticsData.overview.usersChange)}`}>
              {getChangeIcon(analyticsData.overview.usersChange)}
              {Math.abs(analyticsData.overview.usersChange).toFixed(1)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.sessions)}</div>
            <div className={`text-xs flex items-center gap-1 ${getChangeColor(analyticsData.overview.sessionsChange)}`}>
              {getChangeIcon(analyticsData.overview.sessionsChange)}
              {Math.abs(analyticsData.overview.sessionsChange).toFixed(1)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.pageViews)}</div>
            <div className={`text-xs flex items-center gap-1 ${getChangeColor(analyticsData.overview.pageViewsChange)}`}>
              {getChangeIcon(analyticsData.overview.pageViewsChange)}
              {Math.abs(analyticsData.overview.pageViewsChange).toFixed(1)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.bounceRate.toFixed(1)}%</div>
            <div className={`text-xs flex items-center gap-1 ${getChangeColor(-analyticsData.overview.bounceRateChange)}`}>
              {getChangeIcon(-analyticsData.overview.bounceRateChange)}
              {Math.abs(analyticsData.overview.bounceRateChange).toFixed(1)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.avgSessionDuration}</div>
            <div className={`text-xs flex items-center gap-1 ${getChangeColor(analyticsData.overview.durationChange)}`}>
              {getChangeIcon(analyticsData.overview.durationChange)}
              {Math.abs(analyticsData.overview.durationChange).toFixed(1)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.conversionRate.toFixed(1)}%</div>
            <div className={`text-xs flex items-center gap-1 ${getChangeColor(analyticsData.overview.conversionChange)}`}>
              {getChangeIcon(analyticsData.overview.conversionChange)}
              {Math.abs(analyticsData.overview.conversionChange).toFixed(1)}% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Traffic Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Traffic Trend</CardTitle>
            <CardDescription>Users, sessions, and page views over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.traffic}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Area type="monotone" dataKey="sessions" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Area type="monotone" dataKey="pageViews" stackId="1" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Types */}
        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
            <CardDescription>Traffic breakdown by device</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analyticsData.deviceTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value.toFixed(1)}%`}
                >
                  {analyticsData.deviceTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Acquisition Channels */}
        <Card>
          <CardHeader>
            <CardTitle>Acquisition Channels</CardTitle>
            <CardDescription>How users find your site</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analyticsData.acquisitionChannels} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="channel" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="sessions" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most viewed pages on your site</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Bounce Rate</TableHead>
                  <TableHead>Avg. Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticsData.topPages.map((page, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">{page.page}</TableCell>
                    <TableCell>{page.views.toLocaleString()}</TableCell>
                    <TableCell>{page.bounce.toFixed(1)}%</TableCell>
                    <TableCell>{page.avgTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Geographic distribution of users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.countries.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <span className="font-medium">{country.country}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{country.users.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">users</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Google Analytics Integration Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Globe className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900">Google Analytics Integration Status</h3>
              <p className="text-sm text-blue-700 mt-1">
                ⚠️ <strong>Demo Mode:</strong> This dashboard shows simulated Google Analytics data for demonstration purposes. 
                To connect real Google Analytics, you would need to integrate with the Google Analytics Reporting API using OAuth 2.0 authentication 
                and your Google Analytics 4 property ID.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Demo Data</Badge>
                <Badge variant="outline" className="bg-green-100 text-green-800">Real-time Updates</Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">Exportable</Badge>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Data refreshes automatically when you change time ranges or click refresh. Export functionality downloads current view as CSV.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
