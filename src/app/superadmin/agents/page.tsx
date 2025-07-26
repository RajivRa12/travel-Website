"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  PlusCircle,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  CreditCard,
  UserX,
  UserCheck,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  IndianRupee,
} from "lucide-react";
import { agents } from "@/lib/data";

type AgentWithStatus = (typeof agents)[0] & {
  kycStatus: "Verified" | "Pending" | "Rejected";
  accountStatus: "Active" | "Suspended";
  subscriptionPlan: "trial" | "growth" | "pro";
  subscriptionExpiry: string;
  totalRevenue: number;
  packagesCount: number;
  bookingsCount: number;
  joinDate: string;
  lastActive: string;
};

export default function SuperAdminAgentsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [agentList, setAgentList] = React.useState<AgentWithStatus[]>([]);
  const [filteredAgents, setFilteredAgents] = React.useState<AgentWithStatus[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [kycFilter, setKycFilter] = React.useState("all");
  const [selectedAgent, setSelectedAgent] =
    React.useState<AgentWithStatus | null>(null);
  const [actionDialog, setActionDialog] = React.useState<{
    open: boolean;
    type: "approve" | "reject" | "suspend" | "upgrade" | "downgrade" | null;
    agent: AgentWithStatus | null;
  }>({ open: false, type: null, agent: null });
  const [actionReason, setActionReason] = React.useState("");

  React.useEffect(() => {
    // Enhanced mock data for agents
    const initialAgents: AgentWithStatus[] = agents.map((agent, index) => ({
      ...agent,
      kycStatus: ["Verified", "Pending", "Rejected"][
        Math.floor(Math.random() * 3)
      ] as "Verified" | "Pending" | "Rejected",
      accountStatus: (Math.random() > 0.2 ? "Active" : "Suspended") as
        | "Active"
        | "Suspended",
      subscriptionPlan: ["trial", "growth", "pro"][
        Math.floor(Math.random() * 3)
      ] as "trial" | "growth" | "pro",
      subscriptionExpiry: new Date(
        Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .split("T")[0],
      totalRevenue: Math.floor(Math.random() * 500000) + 50000,
      packagesCount: Math.floor(Math.random() * 25) + 1,
      bookingsCount: Math.floor(Math.random() * 100) + 5,
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    }));
    setAgentList(initialAgents);
    setFilteredAgents(initialAgents);
  }, []);

  React.useEffect(() => {
    let filtered = agentList.filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        agent.accountStatus.toLowerCase() === statusFilter;
      const matchesKyc =
        kycFilter === "all" || agent.kycStatus.toLowerCase() === kycFilter;

      return matchesSearch && matchesStatus && matchesKyc;
    });
    setFilteredAgents(filtered);
  }, [searchTerm, statusFilter, kycFilter, agentList]);

  const handleAction = async (type: string, agent: AgentWithStatus) => {
    setActionDialog({ open: true, type: type as any, agent });
  };

  const confirmAction = async () => {
    if (!actionDialog.agent || !actionDialog.type) return;

    const { agent, type } = actionDialog;

    // Update agent based on action type
    setAgentList((prev) =>
      prev.map((a) => {
        if (a.id === agent.id) {
          switch (type) {
            case "approve":
              return { ...a, kycStatus: "Verified" as const };
            case "reject":
              return { ...a, kycStatus: "Rejected" as const };
            case "suspend":
              return { ...a, accountStatus: "Suspended" as const };
            case "upgrade":
              const newPlan = a.subscriptionPlan === "trial" ? "growth" : "pro";
              return { ...a, subscriptionPlan: newPlan as any };
            case "downgrade":
              const downgradePlan =
                a.subscriptionPlan === "pro" ? "growth" : "trial";
              return { ...a, subscriptionPlan: downgradePlan as any };
            default:
              return a;
          }
        }
        return a;
      }),
    );

    toast({
      title: "Action Completed",
      description: `Successfully ${type}d ${agent.name}. ${actionReason ? `Reason: ${actionReason}` : ""}`,
    });

    setActionDialog({ open: false, type: null, agent: null });
    setActionReason("");
  };

  const exportData = () => {
    try {
      const csvData = filteredAgents.map((agent) => ({
        Name: agent.name,
        Email: agent.email,
        KYC_Status: agent.kycStatus,
        Account_Status: agent.accountStatus,
        Subscription: agent.subscriptionPlan,
        Revenue: agent.totalRevenue,
        Packages: agent.packagesCount,
        Bookings: agent.bookingsCount,
        Join_Date: agent.joinDate,
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
      link.setAttribute('download', `dmc-data-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `${csvData.length} DMC records exported to CSV.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export DMC data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stats = {
    total: agentList.length,
    pending: agentList.filter((a) => a.kycStatus === "Pending").length,
    verified: agentList.filter((a) => a.kycStatus === "Verified").length,
    active: agentList.filter((a) => a.accountStatus === "Active").length,
    suspended: agentList.filter((a) => a.accountStatus === "Suspended").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">DMC Management</h1>
          <p className="text-gray-600">
            Manage and approve Destination Management Companies
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => router.push('/superadmin/agents/new')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New DMC
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total DMCs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending KYC</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.verified}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.active}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.suspended}
                </p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search DMCs by name, email, or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Account Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={kycFilter} onValueChange={setKycFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="KYC Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All KYC</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* DMC Table */}
      <Card>
        <CardHeader>
          <CardTitle>All DMCs ({filteredAgents.length})</CardTitle>
          <CardDescription>
            Comprehensive list of registered DMCs with management controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DMC Details</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-gray-500">
                          {agent.specialty}
                        </div>
                        <div className="text-xs text-gray-400">
                          Joined:{" "}
                          {new Date(agent.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1 text-gray-400" />
                        {agent.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1 text-gray-400" />
                        {agent.phone}
                      </div>
                      <div className="flex items-center text-sm">
                        <Globe className="h-3 w-3 mr-1 text-gray-400" />
                        {agent.website}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        agent.kycStatus === "Verified"
                          ? "default"
                          : agent.kycStatus === "Pending"
                            ? "secondary"
                            : "destructive"
                      }
                      className={
                        agent.kycStatus === "Verified"
                          ? "bg-green-100 text-green-800"
                          : agent.kycStatus === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {agent.kycStatus === "Verified" && (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      )}
                      {agent.kycStatus === "Pending" && (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {agent.kycStatus === "Rejected" && (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {agent.kycStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge
                        variant={
                          agent.accountStatus === "Active"
                            ? "default"
                            : "destructive"
                        }
                        className={
                          agent.accountStatus === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {agent.accountStatus}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        Last active:{" "}
                        {new Date(agent.lastActive).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge
                        variant="outline"
                        className={
                          agent.subscriptionPlan === "pro"
                            ? "border-purple-300 text-purple-700"
                            : agent.subscriptionPlan === "growth"
                              ? "border-blue-300 text-blue-700"
                              : "border-gray-300 text-gray-700"
                        }
                      >
                        {agent.subscriptionPlan.toUpperCase()}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        Expires:{" "}
                        {new Date(
                          agent.subscriptionExpiry,
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        <span className="rupee-font">₹</span>
                        {agent.totalRevenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {agent.packagesCount} packages • {agent.bookingsCount}{" "}
                        bookings
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/superadmin/agents/${agent.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>KYC Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleAction("approve", agent)}
                          disabled={agent.kycStatus === "Verified"}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve KYC
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction("reject", agent)}
                          disabled={agent.kycStatus === "Rejected"}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject KYC
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>
                          Account Management
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleAction("suspend", agent)}
                          disabled={agent.accountStatus === "Suspended"}
                          className="text-red-600"
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Suspend Account
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Subscription</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleAction("upgrade", agent)}
                          disabled={agent.subscriptionPlan === "pro"}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Upgrade Plan
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction("downgrade", agent)}
                          disabled={agent.subscriptionPlan === "trial"}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Downgrade Plan
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Confirmation Dialog */}
      <Dialog
        open={actionDialog.open}
        onOpenChange={(open) =>
          !open && setActionDialog({ open: false, type: null, agent: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm {actionDialog.type?.charAt(0).toUpperCase()}
              {actionDialog.type?.slice(1)} Action
            </DialogTitle>
            <DialogDescription>
              You are about to {actionDialog.type} {actionDialog.agent?.name}.
              This action will be logged and may trigger notifications.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for this action..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setActionDialog({ open: false, type: null, agent: null })
              }
            >
              Cancel
            </Button>
            <Button onClick={confirmAction}>
              Confirm {actionDialog.type?.charAt(0).toUpperCase()}
              {actionDialog.type?.slice(1)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
