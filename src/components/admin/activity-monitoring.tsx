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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Activity,
  Users,
  UserCheck,
  Package,
  Briefcase,
  CreditCard,
  MessageSquare,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  Clock,
  Globe,
  Monitor,
  Smartphone,
  Laptop,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

// Activity types and interfaces
interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_role: string;
  activity_type: string;
  description: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: any;
  ip_address?: string;
  user_agent?: string;
  location?: string;
  device_type?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface SystemMetrics {
  activeUsers: number;
  totalSessions: number;
  avgSessionDuration: string;
  errorRate: number;
  responseTime: number;
  requestsPerSecond: number;
  memoryUsage: number;
  cpuUsage: number;
}

interface SecurityEvent {
  id: string;
  type: 'failed_login' | 'suspicious_activity' | 'unauthorized_access' | 'data_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  user_id?: string;
  ip_address: string;
  location: string;
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
}

const ActivityMonitoring: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRealTime, setIsRealTime] = useState(true);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockActivities: ActivityLog[] = [
    {
      id: '1',
      user_id: 'user_1',
      user_name: 'John Admin',
      user_email: 'john@roam.com',
      user_role: 'admin',
      activity_type: 'package_approved',
      description: 'Approved package "Bali Adventure Tour"',
      entity_type: 'package',
      entity_id: 'pkg_123',
      metadata: { package_name: 'Bali Adventure Tour', agent_id: 'agent_45' },
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'Mumbai, India',
      device_type: 'desktop',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      severity: 'medium',
    },
    {
      id: '2',
      user_id: 'user_2',
      user_name: 'Sarah Content',
      user_email: 'sarah@roam.com',
      user_role: 'content_manager',
      activity_type: 'agent_approved',
      description: 'Approved new agent registration for "Travel Experts Co."',
      entity_type: 'agent',
      entity_id: 'agent_67',
      metadata: { company_name: 'Travel Experts Co.', license: 'TRV123456' },
      ip_address: '192.168.1.101',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      location: 'Delhi, India',
      device_type: 'desktop',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      severity: 'high',
    },
    {
      id: '3',
      user_id: 'user_3',
      user_name: 'Mike Finance',
      user_email: 'mike@roam.com',
      user_role: 'financial_manager',
      activity_type: 'payout_processed',
      description: 'Processed payout of ₹45,000 to agent',
      entity_type: 'payout',
      entity_id: 'payout_89',
      metadata: { amount: 45000, agent_id: 'agent_23', currency: 'INR' },
      ip_address: '192.168.1.102',
      user_agent: 'Mozilla/5.0 (X11; Linux x86_64)',
      location: 'Bangalore, India',
      device_type: 'desktop',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      severity: 'high',
    },
    {
      id: '4',
      user_id: 'user_4',
      user_name: 'Anonymous',
      user_email: 'unknown@suspicious.com',
      user_role: 'unknown',
      activity_type: 'failed_login',
      description: 'Multiple failed login attempts',
      metadata: { attempt_count: 5, blocked: true },
      ip_address: '203.0.113.45',
      user_agent: 'curl/7.68.0',
      location: 'Unknown',
      device_type: 'bot',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      severity: 'critical',
    },
    {
      id: '5',
      user_id: 'user_5',
      user_name: 'Customer User',
      user_email: 'customer@email.com',
      user_role: 'customer',
      activity_type: 'booking_created',
      description: 'Created new booking for Thailand package',
      entity_type: 'booking',
      entity_id: 'booking_456',
      metadata: { package_id: 'pkg_789', amount: 58500 },
      ip_address: '192.168.1.103',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
      location: 'Chennai, India',
      device_type: 'mobile',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      severity: 'low',
    },
  ];

  const mockSystemMetrics: SystemMetrics = {
    activeUsers: 147,
    totalSessions: 1283,
    avgSessionDuration: '24m 32s',
    errorRate: 0.12,
    responseTime: 285,
    requestsPerSecond: 45,
    memoryUsage: 67,
    cpuUsage: 23,
  };

  const mockSecurityEvents: SecurityEvent[] = [
    {
      id: 'sec_1',
      type: 'failed_login',
      severity: 'critical',
      description: 'Multiple failed login attempts from suspicious IP',
      ip_address: '203.0.113.45',
      location: 'Unknown',
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      status: 'investigating',
    },
    {
      id: 'sec_2',
      type: 'unauthorized_access',
      severity: 'high',
      description: 'Attempted access to admin panel without proper permissions',
      user_id: 'user_suspicious',
      ip_address: '198.51.100.23',
      location: 'Singapore',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      status: 'open',
    },
    {
      id: 'sec_3',
      type: 'suspicious_activity',
      severity: 'medium',
      description: 'Unusual API usage pattern detected',
      ip_address: '192.0.2.123',
      location: 'Mumbai, India',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      status: 'resolved',
    },
  ];

  useEffect(() => {
    fetchData();
    
    // Set up real-time updates
    if (isRealTime) {
      const interval = setInterval(() => {
        fetchData();
      }, 30000); // Update every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [isRealTime]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // In production, fetch from Supabase with real-time subscriptions
      await new Promise(resolve => setTimeout(resolve, 500));
      setActivities(mockActivities);
      setSystemMetrics(mockSystemMetrics);
      setSecurityEvents(mockSecurityEvents);
    } catch (error) {
      console.error('Error fetching activity data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch activity monitoring data',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'login':
      case 'logout':
        return Users;
      case 'package_created':
      case 'package_approved':
      case 'package_rejected':
        return Package;
      case 'agent_approved':
      case 'agent_rejected':
        return UserCheck;
      case 'booking_created':
      case 'booking_confirmed':
        return Briefcase;
      case 'payout_processed':
        return CreditCard;
      case 'message_sent':
        return MessageSquare;
      case 'failed_login':
      case 'unauthorized_access':
        return Shield;
      default:
        return Activity;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const getSecurityEventIcon = (type: string) => {
    switch (type) {
      case 'failed_login':
        return Shield;
      case 'unauthorized_access':
        return AlertTriangle;
      case 'suspicious_activity':
        return Eye;
      case 'data_breach':
        return XCircle;
      default:
        return Shield;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-red-100 text-red-800">Open</Badge>;
      case 'investigating':
        return <Badge className="bg-yellow-100 text-yellow-800">Investigating</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'false_positive':
        return <Badge className="bg-gray-100 text-gray-800">False Positive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return Smartphone;
      case 'desktop':
        return Monitor;
      case 'tablet':
        return Laptop;
      default:
        return Globe;
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesType = filterType === 'all' || activity.activity_type === filterType;
    const matchesSeverity = filterSeverity === 'all' || activity.severity === filterSeverity;
    const matchesSearch = searchQuery === '' || 
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user_email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesSeverity && matchesSearch;
  });

  if (!systemMetrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activity Monitoring</h2>
          <p className="text-gray-600">Real-time system activity and security monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={isRealTime ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {isRealTime ? 'Live' : 'Paused'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRealTime(!isRealTime)}
          >
            {isRealTime ? 'Pause' : 'Resume'} Monitoring
          </Button>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{systemMetrics.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Time</p>
                <p className="text-2xl font-bold">{systemMetrics.responseTime}ms</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Error Rate</p>
                <p className="text-2xl font-bold">{systemMetrics.errorRate}%</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Requests/sec</p>
                <p className="text-2xl font-bold">{systemMetrics.requestsPerSecond}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activities" className="space-y-6">
        <TabsList>
          <TabsTrigger value="activities">Activity Logs</TabsTrigger>
          <TabsTrigger value="security">Security Events</TabsTrigger>
          <TabsTrigger value="system">System Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search activities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="login">Login/Logout</SelectItem>
                    <SelectItem value="package_approved">Package Actions</SelectItem>
                    <SelectItem value="agent_approved">Agent Actions</SelectItem>
                    <SelectItem value="booking_created">Booking Actions</SelectItem>
                    <SelectItem value="payout_processed">Payment Actions</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities ({filteredActivities.length})</CardTitle>
              <CardDescription>Real-time system and user activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {filteredActivities.map((activity) => {
                    const ActivityIcon = getActivityIcon(activity.activity_type);
                    const DeviceIcon = getDeviceIcon(activity.device_type || 'desktop');
                    
                    return (
                      <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                        <div className={`p-2 rounded-full ${
                          activity.severity === 'critical' ? 'bg-red-100' :
                          activity.severity === 'high' ? 'bg-orange-100' :
                          activity.severity === 'medium' ? 'bg-yellow-100' :
                          'bg-green-100'
                        }`}>
                          <ActivityIcon className={`h-4 w-4 ${
                            activity.severity === 'critical' ? 'text-red-600' :
                            activity.severity === 'high' ? 'text-orange-600' :
                            activity.severity === 'medium' ? 'text-yellow-600' :
                            'text-green-600'
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">{activity.description}</p>
                            {getSeverityBadge(activity.severity)}
                          </div>
                          
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {activity.user_name} ({activity.user_role})
                            </div>
                            <div className="flex items-center gap-1">
                              <DeviceIcon className="h-3 w-3" />
                              {activity.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                            </div>
                          </div>

                          {activity.metadata && (
                            <div className="mt-2 text-xs text-gray-500">
                              IP: {activity.ip_address} • 
                              {Object.entries(activity.metadata).map(([key, value]) => 
                                ` ${key}: ${value}`
                              ).join(' •')}
                            </div>
                          )}
                        </div>

                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
              <CardDescription>Security incidents and threats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityEvents.map((event) => {
                  const EventIcon = getSecurityEventIcon(event.type);
                  
                  return (
                    <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className={`p-2 rounded-full ${
                        event.severity === 'critical' ? 'bg-red-100' :
                        event.severity === 'high' ? 'bg-orange-100' :
                        'bg-yellow-100'
                      }`}>
                        <EventIcon className={`h-4 w-4 ${
                          event.severity === 'critical' ? 'text-red-600' :
                          event.severity === 'high' ? 'text-orange-600' :
                          'text-yellow-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{event.description}</p>
                          <div className="flex items-center gap-2">
                            {getSeverityBadge(event.severity)}
                            {getStatusBadge(event.status)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>IP: {event.ip_address}</span>
                          <span>Location: {event.location}</span>
                          <span>{formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}</span>
                        </div>
                      </div>

                      <Button variant="outline" size="sm">
                        Investigate
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>{systemMetrics.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${systemMetrics.memoryUsage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span>{systemMetrics.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${systemMetrics.cpuUsage}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Sessions</p>
                    <p className="text-xl font-bold">{systemMetrics.totalSessions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Duration</p>
                    <p className="text-xl font-bold">{systemMetrics.avgSessionDuration}</p>
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

export default ActivityMonitoring;
