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
import { Switch } from "@/components/ui/switch";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  Upload,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Eye,
  CreditCard,
  AlertTriangle,
  Settings,
  Zap,
  Building,
} from "lucide-react";

// Mock payout data
const mockPayouts = [
  {
    id: "PO2024001",
    agentName: "Paradise Tours & Travels",
    agentEmail: "contact@paradisetours.com",
    amount: 125000,
    requestDate: "2024-01-15",
    bookingsCount: 8,
    status: "pending",
    bankDetails: {
      accountNumber: "****5678",
      ifsc: "HDFC0001234",
      accountHolder: "Paradise Tours Pvt Ltd",
    },
    utrNumber: null,
    processedDate: null,
    commission: 22058,
    netAmount: 102942,
  },
  {
    id: "PO2024002",
    agentName: "Exotic Destinations",
    agentEmail: "info@exoticdest.com",
    amount: 89500,
    requestDate: "2024-01-12",
    bookingsCount: 5,
    status: "processing",
    bankDetails: {
      accountNumber: "****9012",
      ifsc: "ICICI0005678",
      accountHolder: "Exotic Destinations LLP",
    },
    utrNumber: null,
    processedDate: null,
    commission: 15915,
    netAmount: 73585,
  },
  {
    id: "PO2024003",
    agentName: "Travel Masters Inc",
    agentEmail: "admin@travelmasters.com",
    amount: 175000,
    requestDate: "2024-01-10",
    bookingsCount: 12,
    status: "paid",
    bankDetails: {
      accountNumber: "****3456",
      ifsc: "SBI0009876",
      accountHolder: "Travel Masters Inc",
    },
    utrNumber: "UTR240110789456",
    processedDate: "2024-01-12",
    commission: 31150,
    netAmount: 143850,
  },
  {
    id: "PO2024004",
    agentName: "Coastal Escapes",
    agentEmail: "bookings@coastalescapes.in",
    amount: 67800,
    requestDate: "2024-01-08",
    bookingsCount: 4,
    status: "rejected",
    bankDetails: {
      accountNumber: "****7890",
      ifsc: "AXIS0002468",
      accountHolder: "Coastal Escapes",
    },
    utrNumber: null,
    processedDate: "2024-01-09",
    commission: 12069,
    netAmount: 55731,
    rejectionReason: "Incomplete bank verification documents",
  },
];

export default function SuperAdminPayoutsPage() {
  const { toast } = useToast();
  const [payouts, setPayouts] = React.useState(mockPayouts);
  const [filteredPayouts, setFilteredPayouts] = React.useState(mockPayouts);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [autoPayoutEnabled, setAutoPayoutEnabled] = React.useState(false);
  const [selectedPayout, setSelectedPayout] = React.useState<any>(null);
  const [actionDialog, setActionDialog] = React.useState<{
    open: boolean;
    type: "approve" | "reject" | "mark-paid" | null;
    payout: any;
  }>({ open: false, type: null, payout: null });
  const [utrNumber, setUtrNumber] = React.useState("");
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [paymentScreenshot, setPaymentScreenshot] = React.useState<File | null>(
    null,
  );

  React.useEffect(() => {
    let filtered = payouts;
    if (statusFilter !== "all") {
      filtered = payouts.filter((payout) => payout.status === statusFilter);
    }
    setFilteredPayouts(filtered);
  }, [statusFilter, payouts]);

  const handleAction = (type: string, payout: any) => {
    setActionDialog({ open: true, type: type as any, payout });
    setSelectedPayout(payout);
  };

  const confirmAction = async () => {
    const { type, payout } = actionDialog;
    if (!type || !payout) return;

    setPayouts((prev) =>
      prev.map((p) => {
        if (p.id === payout.id) {
          switch (type) {
            case "mark-paid":
              return {
                ...p,
                status: "paid" as const,
                utrNumber: utrNumber,
                processedDate: new Date().toISOString().split("T")[0],
              } as any;
            case "reject":
              return {
                ...p,
                status: "rejected" as const,
                rejectionReason: rejectionReason,
                processedDate: new Date().toISOString().split("T")[0],
              } as any;
            case "approve":
              return {
                ...p,
                status: "processing" as const,
              } as any;
            default:
              return p;
          }
        }
        return p;
      }),
    );

    toast({
      title: "Action Completed",
      description: `Payout ${payout.id} has been ${type === "mark-paid" ? "marked as paid" : type}d successfully.`,
    });

    setActionDialog({ open: false, type: null, payout: null });
    setUtrNumber("");
    setRejectionReason("");
    setPaymentScreenshot(null);
  };

  const exportPayouts = () => {
    const csvData = filteredPayouts.map((payout) => ({
      ID: payout.id,
      Agent: payout.agentName,
      Amount: payout.amount,
      Status: payout.status,
      Request_Date: payout.requestDate,
      Processed_Date: payout.processedDate || "N/A",
      UTR: payout.utrNumber || "N/A",
      Bookings: payout.bookingsCount,
    }));

    console.log("Exporting payout data:", csvData);
    toast({
      title: "Export Started",
      description: "Payout data is being exported to CSV format.",
    });
  };

  const stats = {
    total: payouts.length,
    pending: payouts.filter((p) => p.status === "pending").length,
    processing: payouts.filter((p) => p.status === "processing").length,
    paid: payouts.filter((p) => p.status === "paid").length,
    rejected: payouts.filter((p) => p.status === "rejected").length,
    totalAmount: payouts
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0),
    paidAmount: payouts
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Payout Management
          </h1>
          <p className="text-gray-600">
            Process DMC payout requests and manage automated payments
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={exportPayouts}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Requests
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
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
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.processing}
                </p>
              </div>
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.paid}
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
                <p className="text-sm font-medium text-gray-600">
                  Pending Amount
                </p>
                <p className="text-xl font-bold text-orange-600">
                  <span className="rupee-font">₹</span>
                  {stats.totalAmount.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Amount</p>
                <p className="text-xl font-bold text-green-600">
                  <span className="rupee-font">₹</span>
                  {stats.paidAmount.toLocaleString()}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auto Payout Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-600" />
                Automated Payout Settings
              </CardTitle>
              <CardDescription>
                Configure automatic payout processing via Stripe Connect
              </CardDescription>
            </div>
            <Switch
              checked={autoPayoutEnabled}
              onCheckedChange={setAutoPayoutEnabled}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Payout Schedule</Label>
              <Select defaultValue="weekly">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Minimum Amount</Label>
              <Input
                type="number"
                placeholder="5000"
                defaultValue="5000"
                disabled={!autoPayoutEnabled}
              />
            </div>
            <div className="space-y-2">
              <Label>Processing Day</Label>
              <Select defaultValue="friday">
                <SelectTrigger disabled={!autoPayoutEnabled}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {autoPayoutEnabled && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900">
                Automated Payouts Enabled
              </p>
              <p className="text-sm text-blue-700">
                Payouts will be processed automatically every Friday for amounts
                above ₹5,000. DMCs will receive notifications when payouts are
                initiated.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-600">
              Showing {filteredPayouts.length} of {payouts.length} requests
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payouts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Requests</CardTitle>
          <CardDescription>
            Manage and process DMC payout requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request Details</TableHead>
                <TableHead>DMC Information</TableHead>
                <TableHead>Amount Breakdown</TableHead>
                <TableHead>Bank Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium font-mono">{payout.id}</div>
                      <div className="text-sm text-gray-500">
                        Requested:{" "}
                        {new Date(payout.requestDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payout.bookingsCount} bookings
                      </div>
                      {payout.processedDate && (
                        <div className="text-sm text-gray-500">
                          Processed:{" "}
                          {new Date(payout.processedDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{payout.agentName}</div>
                      <div className="text-sm text-gray-500">
                        {payout.agentEmail}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Building className="h-3 w-3 mr-1" />
                        DMC Partner
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        <span className="rupee-font">₹</span>
                        {payout.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-red-600">
                        -<span className="rupee-font">₹</span>
                        {payout.commission.toLocaleString()} (15% fee)
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        <span className="rupee-font">₹</span>
                        {payout.netAmount.toLocaleString()} net
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {payout.bankDetails.accountHolder}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payout.bankDetails.accountNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payout.bankDetails.ifsc}
                      </div>
                      {payout.utrNumber && (
                        <div className="text-sm font-mono text-green-600">
                          UTR: {payout.utrNumber}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Badge
                        variant={
                          payout.status === "paid"
                            ? "default"
                            : payout.status === "processing"
                              ? "secondary"
                              : payout.status === "pending"
                                ? "outline"
                                : "destructive"
                        }
                        className={
                          payout.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : payout.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : payout.status === "pending"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                        }
                      >
                        {payout.status === "paid" && (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {payout.status === "processing" && (
                          <Settings className="h-3 w-3 mr-1" />
                        )}
                        {payout.status === "pending" && (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {payout.status === "rejected" && (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {payout.status.charAt(0).toUpperCase() +
                          payout.status.slice(1)}
                      </Badge>
                      {payout.rejectionReason && (
                        <div className="text-xs text-red-600">
                          {payout.rejectionReason}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {payout.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleAction("approve", payout)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleAction("reject", payout)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {payout.status === "processing" && (
                        <Button
                          size="sm"
                          onClick={() => handleAction("mark-paid", payout)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark Paid
                        </Button>
                      )}
                      {payout.status === "paid" && (
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Receipt
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog
        open={actionDialog.open}
        onOpenChange={(open) =>
          !open && setActionDialog({ open: false, type: null, payout: null })
        }
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === "mark-paid"
                ? "Mark Payout as Paid"
                : actionDialog.type === "reject"
                  ? "Reject Payout Request"
                  : "Approve Payout Request"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === "mark-paid"
                ? "Confirm payment completion and provide UTR number"
                : actionDialog.type === "reject"
                  ? "Provide reason for rejection"
                  : "Approve this payout request for processing"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {actionDialog.payout && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium">
                  {actionDialog.payout.agentName}
                </div>
                <div className="text-sm text-gray-600">
                  Amount: <span className="rupee-font">₹</span>
                  {actionDialog.payout.amount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  Net: <span className="rupee-font">₹</span>
                  {actionDialog.payout.netAmount.toLocaleString()}
                </div>
              </div>
            )}

            {actionDialog.type === "mark-paid" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="utr">UTR Number *</Label>
                  <Input
                    id="utr"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="Enter UTR number"
                  />
                </div>
                <div>
                  <Label htmlFor="screenshot">
                    Payment Screenshot (Optional)
                  </Label>
                  <Input
                    id="screenshot"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setPaymentScreenshot(e.target.files?.[0] || null)
                    }
                  />
                </div>
              </div>
            )}

            {actionDialog.type === "reject" && (
              <div>
                <Label htmlFor="reason">Rejection Reason *</Label>
                <Textarea
                  id="reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide detailed reason for rejection..."
                  rows={3}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setActionDialog({ open: false, type: null, payout: null })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              disabled={
                (actionDialog.type === "mark-paid" && !utrNumber.trim()) ||
                (actionDialog.type === "reject" && !rejectionReason.trim())
              }
            >
              {actionDialog.type === "mark-paid"
                ? "Mark as Paid"
                : actionDialog.type === "reject"
                  ? "Reject Request"
                  : "Approve Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
