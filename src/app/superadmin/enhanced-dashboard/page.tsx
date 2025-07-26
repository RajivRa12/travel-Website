"use client";

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  CreditCard,
  Activity,
  Shield,
  Settings,
  Bell,
} from 'lucide-react';
import EnhancedAnalyticsDashboard from '@/components/admin/enhanced-analytics-dashboard';
import UserRolesManagement from '@/components/admin/user-roles-management';
import PaymentGatewayManagement from '@/components/admin/payment-gateway-management';
import ActivityMonitoring from '@/components/admin/activity-monitoring';
import SupabaseConnectionTest from '@/components/admin/supabase-test';
import { useAdminAuth } from '@/components/auth/admin-auth-context';

export default function EnhancedDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { adminUser } = useAdminAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Admin Dashboard</h1>
          <p className="text-gray-600">Comprehensive platform management and analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-medium">Welcome back, {adminUser?.email}</p>
            <p className="text-xs text-gray-500">Super Administrator</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Revenue</p>
                <p className="text-2xl font-bold">
                  <span className="rupee-font">₹</span>2.85M
                </p>
                <p className="text-xs text-blue-100">+12.5% from last month</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Active Users</p>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-green-100">+8.3% from last month</p>
              </div>
              <Users className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Total Bookings</p>
                <p className="text-2xl font-bold">486</p>
                <p className="text-xs text-purple-100">+15.2% from last month</p>
              </div>
              <Activity className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Success Rate</p>
                <p className="text-2xl font-bold">96.8%</p>
                <p className="text-xs text-orange-100">+0.8% from last month</p>
              </div>
              <Shield className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:w-fit">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button className="justify-start" onClick={() => setActiveTab('users')}>
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => setActiveTab('analytics')}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => setActiveTab('payments')}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Settings
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => setActiveTab('activity')}>
                    <Activity className="h-4 w-4 mr-2" />
                    Monitor Activity
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Response Time</span>
                    <span className="text-sm font-medium text-green-600">285ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Status</span>
                    <span className="text-sm font-medium text-green-600">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cache Hit Rate</span>
                    <span className="text-sm font-medium text-green-600">94.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Error Rate</span>
                    <span className="text-sm font-medium text-green-600">0.12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Platform Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Advanced Analytics</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Comprehensive insights with real-time data visualization and AI-powered recommendations
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Enhanced Security</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Multi-layered security with role-based access control and real-time threat monitoring
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">Payment Integration</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Multiple payment gateways with intelligent routing and comprehensive transaction monitoring
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <EnhancedAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="users">
          <UserRolesManagement />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentGatewayManagement />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityMonitoring />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <SupabaseConnectionTest />

          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Platform Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      General Settings
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Bell className="h-4 w-4 mr-2" />
                      Notification Settings
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Security Settings
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Configuration
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Database Management</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start">
                      <Activity className="h-4 w-4 mr-2" />
                      Database Status
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Performance Metrics
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Advanced Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      User Management
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Activity className="h-4 w-4 mr-2" />
                      API Management
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
