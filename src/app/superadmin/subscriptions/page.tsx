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
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  IndianRupee,
  Calendar,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
} from "lucide-react";

// Mock subscription data
const subscriptions = [
  {
    id: "SUB001",
    agentId: "AGT001",
    agentName: "Wanderlust Travel Co.",
    agentEmail: "contact@wanderlust.com",
    plan: "Growth",
    status: "active",
    amount: 3499,
    billingCycle: "yearly",
    startDate: "2024-01-15",
    endDate: "2025-01-15",
    nextBilling: "2025-01-15",
    paymentMethod: "Credit Card",
    lastPayment: "2024-01-15",
    autoRenew: true,
    usage: {
      packages: 12,
      maxPackages: 50,
      bookings: 89,
      maxBookings: 500,
    },
  },
  {
    id: "SUB002",
    agentId: "AGT002",
    agentName: "Adventure Tours Ltd.",
    agentEmail: "info@adventure.com",
    plan: "Pro",
    status: "active",
    amount: 9999,
    billingCycle: "yearly",
    startDate: "2024-02-01",
    endDate: "2025-02-01",
    nextBilling: "2025-02-01",
    paymentMethod: "Bank Transfer",
    lastPayment: "2024-02-01",
    autoRenew: true,
    usage: {
      packages: 45,
      maxPackages: -1,
      bookings: 234,
      maxBookings: -1,
    },
  },
  {
    id: "SUB003",
    agentId: "AGT003",
    agentName: "Dream Destinations",
    agentEmail: "hello@dream.com",
    plan: "Trial",
    status: "expired",
    amount: 0,
    billingCycle: "trial",
    startDate: "2024-03-01",
    endDate: "2024-03-15",
    nextBilling: null,
    paymentMethod: null,
    lastPayment: null,
    autoRenew: false,
    usage: {
      packages: 3,
      maxPackages: 5,
      bookings: 2,
      maxBookings: 10,
    },
  },
  {
    id: "SUB004",
    agentId: "AGT004",
    agentName: "Exotic Travels",
    agentEmail: "support@exotic.com",
    plan: "Growth",
    status: "payment_failed",
    amount: 3499,
    billingCycle: "yearly",
    startDate: "2024-01-20",
    endDate: "2025-01-20",
    nextBilling: "2024-12-20",
    paymentMethod: "Credit Card",
    lastPayment: "2024-01-20",
    autoRenew: true,
    usage: {
      packages: 8,
      maxPackages: 50,
      bookings: 45,
      maxBookings: 500,
    },
  },
  {
    id: "SUB005",
    agentId: "AGT005",
    agentName: "Coastal Adventures",
    agentEmail: "info@coastal.com",
    plan: "Growth",
    status: "cancelled",
    amount: 3499,
    billingCycle: "yearly",
    startDate: "2024-01-10",
    endDate: "2024-12-10",
    nextBilling: null,
    paymentMethod: "Credit Card",
    lastPayment: "2024-01-10",
    autoRenew: false,
    usage: {
      packages: 15,
      maxPackages: 50,
      bookings: 67,
      maxBookings: 500,
    },
  },
];

const planConfig = {
  Trial: {
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
  Growth: {
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  Pro: {
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
};

const statusConfig = {
  active: {
    label: "Active",
    color: "text-green-600",
    bgColor: "bg-green-50",
    icon: CheckCircle,
  },
  expired: {
    label: "Expired",
    color: "text-red-600",
    bgColor: "bg-red-50",
    icon: XCircle,
  },
  payment_failed: {
    label: "Payment Failed",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    icon: AlertTriangle,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    icon: XCircle,
  },
  pending: {
    label: "Pending",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    icon: Clock,
  },
};

export default function SuperAdminSubscriptionsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [planFilter, setPlanFilter] = React.useState("all");

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.agentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    const matchesPlan = planFilter === "all" || sub.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const stats = {
    totalSubscriptions: subscriptions.length,
    activeSubscriptions: subscriptions.filter((s) => s.status === "active")
      .length,
    expiredSubscriptions: subscriptions.filter((s) => s.status === "expired")
      .length,
    failedPayments: subscriptions.filter((s) => s.status === "payment_failed")
      .length,
    totalRevenue: subscriptions
      .filter((s) => s.status === "active")
      .reduce((sum, s) => sum + s.amount, 0),
  };

  const handleUpgradeDowngrade = (subscriptionId: string, newPlan: string) => {
    toast({
      title: "Plan Updated",
      description: `Subscription ${subscriptionId} has been updated to ${newPlan} plan.`,
    });
  };

  const handleRetryPayment = (subscriptionId: string) => {
    toast({
      title: "Payment Retry Initiated",
      description: `Payment retry has been initiated for subscription ${subscriptionId}.`,
    });
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    toast({
      title: "Subscription Cancelled",
      description: `Subscription ${subscriptionId} has been cancelled.`,
      variant: "destructive",
    });
  };

  const exportSubscriptionData = () => {
    try {
      const csvData = filteredSubscriptions.map((subscription) => ({
        ID: subscription.id,
        Agent_Name: subscription.agentName,
        Agent_Email: subscription.agentEmail,
        Plan: subscription.plan,
        Status: subscription.status,
        Amount: subscription.amount,
        Billing_Cycle: subscription.billingCycle,
        Start_Date: subscription.startDate,
        End_Date: subscription.endDate,
        Next_Billing: subscription.nextBilling || 'N/A',
        Payment_Method: subscription.paymentMethod || 'N/A',
        Auto_Renew: subscription.autoRenew ? 'Yes' : 'No',
        Packages_Used: subscription.usage.packages,
        Max_Packages: subscription.usage.maxPackages === -1 ? 'Unlimited' : subscription.usage.maxPackages,
        Bookings_Used: subscription.usage.bookings,
        Max_Bookings: subscription.usage.maxBookings === -1 ? 'Unlimited' : subscription.usage.maxBookings,
      }));

      // Convert to CSV string
      const headers = Object.keys(csvData[0]).join(',');
      const rows = csvData.map(row => Object.values(row).join(','));
      const csvContent = [headers, ...rows].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `subscription-data-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `${csvData.length} subscription records exported to CSV.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export subscription data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const syncBillingData = async () => {
    try {
      // Simulate API call to sync billing data
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Billing Sync Complete",
        description: "Successfully synchronized billing data with payment providers.",
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync billing data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    if (amount === 0) return "Free";
    return (
      <>
        <span className="rupee-font">₹</span>
        {amount.toLocaleString()}
      </>
    );
  };

  const getUsagePercentage = (used: number, max: number) => {
    if (max === -1) return 0; // Unlimited
    return Math.round((used / max) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Subscription Management
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage agent subscription plans and billing
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportSubscriptionData}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={syncBillingData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Billing
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Subscriptions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalSubscriptions}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activeSubscriptions}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.expiredSubscriptions}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Payment Issues
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.failedPayments}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Monthly Revenue
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  <span className="rupee-font">₹</span>
                  {Math.round(stats.totalRevenue / 12).toLocaleString()}
                </p>
              </div>
              <IndianRupee className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by agent name, email, or subscription ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="payment_failed">Payment Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="Trial">Trial</SelectItem>
                <SelectItem value="Growth">Growth</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
          <CardDescription>
            Showing {filteredSubscriptions.length} of {subscriptions.length}{" "}
            subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Next Billing</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                                {filteredSubscriptions.map((subscription) => {
                  const statusInfo = statusConfig[subscription.status as keyof typeof statusConfig];
                  const planInfo = planConfig[subscription.plan as keyof typeof planConfig];
                  const StatusIcon = statusInfo.icon;

                  return (
                    <TableRow key={subscription.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {subscription.agentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {subscription.agentEmail}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: {subscription.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${planInfo.bgColor} ${planInfo.color} ${planInfo.borderColor}`}
                        >
                          {subscription.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <StatusIcon
                            className={`h-4 w-4 ${statusInfo.color}`}
                          />
                          <Badge
                            variant="outline"
                            className={`${statusInfo.bgColor} ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {formatAmount(subscription.amount)}
                          </div>
                          {subscription.amount > 0 && (
                            <div className="text-sm text-gray-500 capitalize">
                              {subscription.billingCycle}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            Packages: {subscription.usage.packages}
                            {subscription.usage.maxPackages > 0 &&
                              ` / ${subscription.usage.maxPackages}`}
                            {subscription.usage.maxPackages === -1 &&
                              " / Unlimited"}
                          </div>
                          <div className="text-sm">
                            Bookings: {subscription.usage.bookings}
                            {subscription.usage.maxBookings > 0 &&
                              ` / ${subscription.usage.maxBookings}`}
                            {subscription.usage.maxBookings === -1 &&
                              " / Unlimited"}
                          </div>
                          {subscription.usage.maxPackages > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div
                                className="bg-blue-600 h-1 rounded-full"
                                style={{
                                  width: `${getUsagePercentage(
                                    subscription.usage.packages,
                                    subscription.usage.maxPackages,
                                  )}%`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {subscription.nextBilling ? (
                          <div>
                            <div className="text-sm font-medium">
                              {formatDate(subscription.nextBilling)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {subscription.autoRenew ? "Auto-renew" : "Manual"}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Plan
                            </DropdownMenuItem>
                            {subscription.status === "payment_failed" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRetryPayment(subscription.id)
                                }
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Retry Payment
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() =>
                                handleCancelSubscription(subscription.id)
                              }
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Cancel Subscription
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
