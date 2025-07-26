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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import {
  CreditCard,
  DollarSign,
  Smartphone,
  Building,
  Globe,
  Shield,
  Activity,
  Settings,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { useToast } from '@/hooks/use-toast';

// Payment gateway types
interface PaymentGateway {
  id: string;
  name: string;
  type: 'card' | 'wallet' | 'bank' | 'crypto' | 'bnpl';
  provider: string;
  status: 'active' | 'inactive' | 'testing' | 'error';
  isEnabled: boolean;
  processingFee: number;
  currency: string[];
  countries: string[];
  minAmount: number;
  maxAmount: number;
  settlementTime: string;
  apiKey: string;
  webhookUrl: string;
  lastTransaction: string;
  totalVolume: number;
  successRate: number;
  averageTime: number;
  createdAt: string;
  updatedAt: string;
}

interface PaymentTransaction {
  id: string;
  gateway: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending' | 'refunded';
  customer: string;
  orderId: string;
  timestamp: string;
  processingTime: number;
  fee: number;
}

interface PaymentAnalytics {
  totalVolume: number;
  totalTransactions: number;
  successRate: number;
  averageAmount: number;
  topGateways: Array<{
    name: string;
    volume: number;
    transactions: number;
    percentage: number;
    color: string;
  }>;
  volumeTrend: Array<{
    date: string;
    volume: number;
    transactions: number;
    successRate: number;
  }>;
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
    color: string;
  }>;
}

const PaymentGatewayManagement: React.FC = () => {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [analytics, setAnalytics] = useState<PaymentAnalytics | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);
  const [isGatewayDialogOpen, setIsGatewayDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock data
  const mockGateways: PaymentGateway[] = [
    {
      id: 'stripe',
      name: 'Stripe',
      type: 'card',
      provider: 'Stripe Inc.',
      status: 'active',
      isEnabled: true,
      processingFee: 2.9,
      currency: ['INR', 'USD', 'EUR'],
      countries: ['IN', 'US', 'GB', 'AU'],
      minAmount: 100,
      maxAmount: 1000000,
      settlementTime: '2-3 business days',
      apiKey: 'sk_test_****',
      webhookUrl: 'https://api.roam.com/webhooks/stripe',
      lastTransaction: '2024-01-26T10:30:00Z',
      totalVolume: 2450000,
      successRate: 98.5,
      averageTime: 3.2,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-26',
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      type: 'card',
      provider: 'Razorpay Software',
      status: 'active',
      isEnabled: true,
      processingFee: 2.0,
      currency: ['INR'],
      countries: ['IN'],
      minAmount: 100,
      maxAmount: 500000,
      settlementTime: '1-2 business days',
      apiKey: 'rzp_test_****',
      webhookUrl: 'https://api.roam.com/webhooks/razorpay',
      lastTransaction: '2024-01-26T09:15:00Z',
      totalVolume: 1850000,
      successRate: 97.2,
      averageTime: 2.8,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-26',
    },
    {
      id: 'paytm',
      name: 'Paytm',
      type: 'wallet',
      provider: 'Paytm Payments Bank',
      status: 'active',
      isEnabled: true,
      processingFee: 1.5,
      currency: ['INR'],
      countries: ['IN'],
      minAmount: 50,
      maxAmount: 200000,
      settlementTime: '1 business day',
      apiKey: 'paytm_test_****',
      webhookUrl: 'https://api.roam.com/webhooks/paytm',
      lastTransaction: '2024-01-26T08:45:00Z',
      totalVolume: 980000,
      successRate: 95.8,
      averageTime: 1.5,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-26',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      type: 'card',
      provider: 'PayPal Holdings',
      status: 'testing',
      isEnabled: false,
      processingFee: 3.5,
      currency: ['USD', 'EUR', 'GBP'],
      countries: ['US', 'GB', 'DE', 'FR'],
      minAmount: 100,
      maxAmount: 2000000,
      settlementTime: '3-5 business days',
      apiKey: 'paypal_test_****',
      webhookUrl: 'https://api.roam.com/webhooks/paypal',
      lastTransaction: '2024-01-25T16:20:00Z',
      totalVolume: 450000,
      successRate: 96.3,
      averageTime: 4.1,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-25',
    },
    {
      id: 'upi',
      name: 'UPI Payments',
      type: 'bank',
      provider: 'NPCI',
      status: 'active',
      isEnabled: true,
      processingFee: 0.5,
      currency: ['INR'],
      countries: ['IN'],
      minAmount: 10,
      maxAmount: 100000,
      settlementTime: 'Instant',
      apiKey: 'upi_test_****',
      webhookUrl: 'https://api.roam.com/webhooks/upi',
      lastTransaction: '2024-01-26T11:00:00Z',
      totalVolume: 1200000,
      successRate: 94.5,
      averageTime: 0.8,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-26',
    },
  ];

  const mockTransactions: PaymentTransaction[] = [
    {
      id: 'txn_001',
      gateway: 'Stripe',
      amount: 58500,
      currency: 'INR',
      status: 'success',
      customer: 'john@example.com',
      orderId: 'ORD_001',
      timestamp: '2024-01-26T10:30:00Z',
      processingTime: 3.2,
      fee: 1696.5,
    },
    {
      id: 'txn_002',
      gateway: 'Razorpay',
      amount: 42000,
      currency: 'INR',
      status: 'success',
      customer: 'sarah@example.com',
      orderId: 'ORD_002',
      timestamp: '2024-01-26T09:15:00Z',
      processingTime: 2.8,
      fee: 840,
    },
    {
      id: 'txn_003',
      gateway: 'UPI',
      amount: 25000,
      currency: 'INR',
      status: 'failed',
      customer: 'mike@example.com',
      orderId: 'ORD_003',
      timestamp: '2024-01-26T08:45:00Z',
      processingTime: 1.2,
      fee: 0,
    },
  ];

  const mockAnalytics: PaymentAnalytics = {
    totalVolume: 6930000,
    totalTransactions: 1247,
    successRate: 96.8,
    averageAmount: 55590,
    topGateways: [
      { name: 'Stripe', volume: 2450000, transactions: 418, percentage: 35.4, color: '#635BFF' },
      { name: 'Razorpay', volume: 1850000, transactions: 371, percentage: 26.7, color: '#3395FF' },
      { name: 'UPI', volume: 1200000, transactions: 286, percentage: 17.3, color: '#FF6B35' },
      { name: 'Paytm', volume: 980000, transactions: 132, percentage: 14.1, color: '#00BAF2' },
      { name: 'PayPal', volume: 450000, transactions: 40, percentage: 6.5, color: '#FFC439' },
    ],
    volumeTrend: [
      { date: '2024-01-20', volume: 180000, transactions: 32, successRate: 97.2 },
      { date: '2024-01-21', volume: 220000, transactions: 38, successRate: 96.8 },
      { date: '2024-01-22', volume: 195000, transactions: 34, successRate: 98.1 },
      { date: '2024-01-23', volume: 245000, transactions: 42, successRate: 95.9 },
      { date: '2024-01-24', volume: 280000, transactions: 48, successRate: 97.5 },
      { date: '2024-01-25', volume: 265000, transactions: 45, successRate: 96.3 },
      { date: '2024-01-26', volume: 310000, transactions: 52, successRate: 97.8 },
    ],
    statusDistribution: [
      { status: 'Success', count: 1207, percentage: 96.8, color: '#10B981' },
      { status: 'Failed', count: 25, percentage: 2.0, color: '#EF4444' },
      { status: 'Pending', count: 10, percentage: 0.8, color: '#F59E0B' },
      { status: 'Refunded', count: 5, percentage: 0.4, color: '#6B7280' },
    ],
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGateways(mockGateways);
      setTransactions(mockTransactions);
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching payment data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch payment gateway data',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleGateway = async (gatewayId: string, enabled: boolean) => {
    try {
      setGateways(prev => prev.map(gw => 
        gw.id === gatewayId ? { ...gw, isEnabled: enabled, status: enabled ? 'active' : 'inactive' } : gw
      ));

      toast({
        title: enabled ? 'Gateway Enabled' : 'Gateway Disabled',
        description: `Payment gateway has been ${enabled ? 'enabled' : 'disabled'} successfully`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update gateway status',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      case 'testing':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'card':
        return CreditCard;
      case 'wallet':
        return Smartphone;
      case 'bank':
        return Building;
      case 'crypto':
        return DollarSign;
      default:
        return CreditCard;
    }
  };

  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'refunded':
        return <Badge className="bg-gray-100 text-gray-800">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => (
    <>
      <span className="rupee-font">₹</span>
      {amount.toLocaleString()}
    </>
  );

  if (!analytics) {
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
          <h2 className="text-2xl font-bold text-gray-900">Payment Gateway Management</h2>
          <p className="text-gray-600">Manage payment providers and transaction monitoring</p>
        </div>
        <Dialog open={isGatewayDialogOpen} onOpenChange={setIsGatewayDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Gateway
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Payment Gateway</DialogTitle>
              <DialogDescription>
                Configure a new payment gateway provider
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Gateway Name</Label>
                  <Input placeholder="Enter gateway name" />
                </div>
                <div>
                  <Label>Provider</Label>
                  <Input placeholder="Provider company" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="wallet">Digital Wallet</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Processing Fee (%)</Label>
                  <Input type="number" step="0.1" placeholder="2.9" />
                </div>
              </div>
              <div>
                <Label>API Key</Label>
                <Input type="password" placeholder="Enter API key" />
              </div>
              <div>
                <Label>Webhook URL</Label>
                <Input placeholder="https://api.example.com/webhook" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGatewayDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsGatewayDialogOpen(false)}>
                Add Gateway
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.totalVolume)}</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  +12.5% vs last month
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold">{analytics.totalTransactions.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  +8.3% vs last month
                </div>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{analytics.successRate}%</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  +0.8% vs last month
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Amount</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.averageAmount)}</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  +4.1% vs last month
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="gateways" className="space-y-6">
        <TabsList>
          <TabsTrigger value="gateways">Gateways</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="gateways" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gateways.map((gateway) => {
              const TypeIcon = getTypeIcon(gateway.type);
              return (
                <Card key={gateway.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4" />
                        <CardTitle className="text-lg">{gateway.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(gateway.status)}
                        <Switch
                          checked={gateway.isEnabled}
                          onCheckedChange={(checked) => handleToggleGateway(gateway.id, checked)}
                        />
                      </div>
                    </div>
                    <CardDescription>{gateway.provider}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Processing Fee</p>
                          <p className="font-medium">{gateway.processingFee}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Success Rate</p>
                          <p className="font-medium">{gateway.successRate}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Settlement</p>
                          <p className="font-medium">{gateway.settlementTime}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Avg Time</p>
                          <p className="font-medium">{gateway.averageTime}s</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-2">Volume (This Month)</p>
                        <p className="text-lg font-bold">{formatCurrency(gateway.totalVolume)}</p>
                        <Progress value={gateway.successRate} className="mt-2" />
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="h-3 w-3 mr-1" />
                          Config
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest payment transactions across all gateways</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon('card')}
                          {transaction.gateway}
                        </div>
                      </TableCell>
                      <TableCell>{transaction.customer}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>{getTransactionStatusBadge(transaction.status)}</TableCell>
                      <TableCell>
                        {new Date(transaction.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Volume Trend</CardTitle>
                <CardDescription>Daily transaction volume and success rate</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.volumeTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <YAxis yAxisId="left" tickFormatter={(value) => `₹${(value / 1000)}k`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value, name) => [
                        name === 'volume' ? formatCurrency(value as number) : `${value}%`,
                        name
                      ]}
                    />
                    <Bar yAxisId="left" dataKey="volume" fill="#3B82F6" />
                    <Line yAxisId="right" type="monotone" dataKey="successRate" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gateway Distribution</CardTitle>
                <CardDescription>Volume share by payment gateway</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={analytics.topGateways}
                      dataKey="volume"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                    >
                      {analytics.topGateways.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Gateway Performance</CardTitle>
              <CardDescription>Detailed performance metrics by gateway</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topGateways.map((gateway) => (
                  <div key={gateway.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: gateway.color }}
                      ></div>
                      <div>
                        <p className="font-medium">{gateway.name}</p>
                        <p className="text-sm text-gray-600">{gateway.transactions} transactions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(gateway.volume)}</p>
                      <p className="text-sm text-gray-600">{gateway.percentage}% of total</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Payment Settings</CardTitle>
              <CardDescription>Configure global payment preferences and limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Default Currency</Label>
                  <Select defaultValue="INR">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Payment Timeout</Label>
                  <Select defaultValue="900">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300">5 minutes</SelectItem>
                      <SelectItem value="600">10 minutes</SelectItem>
                      <SelectItem value="900">15 minutes</SelectItem>
                      <SelectItem value="1800">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Minimum Amount</Label>
                  <Input type="number" defaultValue="100" />
                </div>
                <div>
                  <Label>Maximum Amount</Label>
                  <Input type="number" defaultValue="1000000" />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Security Settings</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable 3D Secure</p>
                      <p className="text-sm text-gray-600">Additional authentication for card payments</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Fraud Detection</p>
                      <p className="text-sm text-gray-600">Automatic fraud detection and prevention</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Webhook Notifications</p>
                      <p className="text-sm text-gray-600">Real-time payment status updates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentGatewayManagement;
