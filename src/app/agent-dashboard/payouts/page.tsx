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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Wallet,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  IndianRupee,
  AlertCircle,
  CreditCard,
  Send,
} from "lucide-react";

// Mock data for eligible bookings and payout history
const eligibleBookings = [
  {
    id: "BK002",
    packageTitle: "Bali Cultural Heritage",
    customerName: "Priya Sharma",
    completionDate: "2024-02-01",
    totalAmount: 65998,
    payoutAmount: 56098,
    commissionDeducted: 9900,
  },
  {
    id: "BK005",
    packageTitle: "Thailand Island Hopping",
    customerName: "Rohit Gupta",
    completionDate: "2024-02-05",
    totalAmount: 89997,
    payoutAmount: 76497,
    commissionDeducted: 13500,
  },
  {
    id: "BK007",
    packageTitle: "Singapore City Explorer",
    customerName: "Neha Agarwal",
    completionDate: "2024-02-10",
    totalAmount: 45999,
    payoutAmount: 39099,
    commissionDeducted: 6900,
  },
];

const payoutHistory = [
  {
    id: "PO001",
    requestDate: "2024-01-15",
    amount: 125000,
    bookingsCount: 3,
    status: "paid",
    processedDate: "2024-01-22",
    transactionId: "TXN123456789",
    notes: "January payout batch - processed successfully",
  },
  {
    id: "PO002",
    requestDate: "2024-02-01",
    amount: 85000,
    bookingsCount: 2,
    status: "processing",
    processedDate: null,
    transactionId: null,
    notes: "Under review by finance team",
  },
  {
    id: "PO003",
    requestDate: "2024-01-05",
    amount: 65000,
    bookingsCount: 2,
    status: "rejected",
    processedDate: "2024-01-08",
    transactionId: null,
    notes: "Rejected due to incomplete bank details",
  },
];

export default function PayoutRequestPage() {
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [payoutRequests, setPayoutRequests] = useState(payoutHistory);
  const [requestNotes, setRequestNotes] = useState("");

  const totalEligibleAmount = eligibleBookings.reduce(
    (sum, booking) => sum + booking.payoutAmount,
    0,
  );
  const selectedAmount = eligibleBookings
    .filter((booking) => selectedBookings.includes(booking.id))
    .reduce((sum, booking) => sum + booking.payoutAmount, 0);

  const handleBookingSelect = (bookingId: string) => {
    setSelectedBookings((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId],
    );
  };

  const handleSelectAll = () => {
    if (selectedBookings.length === eligibleBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(eligibleBookings.map((b) => b.id));
    }
  };

  const handlePayoutRequest = () => {
    if (selectedBookings.length === 0) {
      alert("Please select at least one booking for payout request.");
      return;
    }

    const newRequest = {
      id: `PO${String(payoutRequests.length + 1).padStart(3, "0")}`,
      requestDate: new Date().toISOString().split("T")[0],
      amount: selectedAmount,
      bookingsCount: selectedBookings.length,
      status: "pending",
      processedDate: null,
      transactionId: null,
      notes: requestNotes || "Payout request submitted",
    };

    setPayoutRequests((prev) => [newRequest, ...prev]);
    setSelectedBookings([]);
    setRequestNotes("");

    // Simulate admin notification
    alert(
      `Payout request ${newRequest.id} submitted successfully! Our admin team has been notified and will process your request within 2-3 business days.`,
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
    );
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      processing: <AlertCircle className="h-4 w-4" />,
      paid: <CheckCircle className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
    };
    return icons[status as keyof typeof icons] || <Clock className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payout Requests</h1>
        <p className="text-gray-600">
          Request payouts for completed bookings and track payment status
        </p>
      </div>

      {/* Payout Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Available for Payout
                </p>
                <p className="text-2xl font-bold text-green-600">
                  <span className="rupee-font">₹</span>
                  {totalEligibleAmount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {eligibleBookings.length} completed bookings
                </p>
              </div>
              <Wallet className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Requests
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {
                    payoutRequests.filter(
                      (p) =>
                        p.status === "pending" || p.status === "processing",
                    ).length
                  }
                </p>
                <p className="text-sm text-gray-500">Awaiting processing</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Paid Out
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  <span className="rupee-font">₹</span>
                  {payoutRequests
                    .filter((p) => p.status === "paid")
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Lifetime earnings</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Eligible Bookings for Payout */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Eligible Bookings for Payout</CardTitle>
              <CardDescription>
                Select completed bookings to request payout (₹
                {selectedAmount.toLocaleString()} selected)
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleSelectAll}>
                {selectedBookings.length === eligibleBookings.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={selectedBookings.length === 0}>
                    <Send className="h-4 w-4 mr-2" />
                    Request Payout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Payout Request</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are requesting a payout of ₹
                      {selectedAmount.toLocaleString()} for{" "}
                      {selectedBookings.length} booking(s). This request will be
                      sent to our admin team for review and processing.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={requestNotes}
                        onChange={(e) => setRequestNotes(e.target.value)}
                        placeholder="Any additional information for the admin team..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePayoutRequest}>
                      Submit Request
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={
                      selectedBookings.length === eligibleBookings.length
                    }
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </TableHead>
                <TableHead>Booking ID</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Completion Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Payout Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eligibleBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedBookings.includes(booking.id)}
                      onChange={() => handleBookingSelect(booking.id)}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell className="font-mono">{booking.id}</TableCell>
                  <TableCell>
                    <div
                      className="max-w-48 truncate"
                      title={booking.packageTitle}
                    >
                      {booking.packageTitle}
                    </div>
                  </TableCell>
                  <TableCell>{booking.customerName}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {new Date(booking.completionDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="rupee-font">₹</span>
                    {booking.totalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-red-600">
                    -<span className="rupee-font">₹</span>
                    {booking.commissionDeducted.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    <span className="rupee-font">₹</span>
                    {booking.payoutAmount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payout Request History */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Request History</CardTitle>
          <CardDescription>
            Track all your payout requests and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Processed Date</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payoutRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-mono">{request.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {new Date(request.requestDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <span className="rupee-font">₹</span>
                    {request.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{request.bookingsCount}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {request.processedDate ? (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {new Date(request.processedDate).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {request.transactionId ? (
                      <span className="font-mono text-sm">
                        {request.transactionId}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Payout Request Details - {request.id}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-600">
                                Amount
                              </Label>
                              <p className="font-bold">
                                <span className="rupee-font">₹</span>
                                {request.amount.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-600">
                                Status
                              </Label>
                              <Badge className={getStatusBadge(request.status)}>
                                {getStatusIcon(request.status)}
                                <span className="ml-1 capitalize">
                                  {request.status}
                                </span>
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">
                              Notes
                            </Label>
                            <p className="text-gray-700">{request.notes}</p>
                          </div>
                          {request.status === "paid" &&
                            request.transactionId && (
                              <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm font-medium text-green-800">
                                  Payment Successful
                                </p>
                                <p className="text-sm text-green-600">
                                  Transaction ID: {request.transactionId}
                                </p>
                              </div>
                            )}
                          {request.status === "rejected" && (
                            <div className="bg-red-50 p-4 rounded-lg">
                              <p className="text-sm font-medium text-red-800">
                                Request Rejected
                              </p>
                              <p className="text-sm text-red-600">
                                Please contact support for more information.
                              </p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payout Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Payout Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-blue-800">Processing Time:</p>
              <p className="text-blue-700">
                2-3 business days after request submission
              </p>
            </div>
            <div>
              <p className="font-medium text-blue-800">Commission Structure:</p>
              <p className="text-blue-700">
                15% platform fee deducted from total booking amount
              </p>
            </div>
            <div>
              <p className="font-medium text-blue-800">Minimum Payout:</p>
              <p className="text-blue-700">
                ₹5,000 minimum amount required for payout request
              </p>
            </div>
            <div>
              <p className="font-medium text-blue-800">Payment Method:</p>
              <p className="text-blue-700">
                Direct bank transfer to registered account
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
