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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Users,
  MapPin,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
} from "lucide-react";

// Mock booking data
const mockBookings = [
  {
    id: "BK001",
    packageTitle: "Bangkok Pattaya Discovery",
    customerName: "Rajesh Kumar",
    customerEmail: "rajesh@email.com",
    customerPhone: "+91 9876543210",
    travelers: 4,
    adults: 2,
    children: 2,
    infants: 0,
    travelDate: "2024-03-15",
    bookingDate: "2024-01-15",
    status: "confirmed",
    totalAmount: 103996,
    paidAmount: 103996,
    payoutEligible: false,
    payoutAmount: 88396, // After 15% commission
    specialRequests: "Vegetarian meals, wheelchair accessible room",
  },
  {
    id: "BK002",
    packageTitle: "Bali Cultural Heritage",
    customerName: "Priya Sharma",
    customerEmail: "priya@email.com",
    customerPhone: "+91 9876543211",
    travelers: 2,
    adults: 2,
    children: 0,
    infants: 0,
    travelDate: "2024-02-28",
    bookingDate: "2024-01-10",
    status: "completed",
    totalAmount: 65998,
    paidAmount: 65998,
    payoutEligible: true,
    payoutAmount: 56098,
    specialRequests: "",
  },
  {
    id: "BK003",
    packageTitle: "Singapore Marina Bay Experience",
    customerName: "Amit Patel",
    customerEmail: "amit@email.com",
    customerPhone: "+91 9876543212",
    travelers: 6,
    adults: 4,
    children: 2,
    infants: 0,
    travelDate: "2024-04-10",
    bookingDate: "2024-01-20",
    status: "new",
    totalAmount: 197994,
    paidAmount: 59398, // Partial payment
    payoutEligible: false,
    payoutAmount: 168295,
    specialRequests: "Anniversary celebration, room decoration",
  },
  {
    id: "BK004",
    packageTitle: "Vietnam Scenic Journey",
    customerName: "Sneha Reddy",
    customerEmail: "sneha@email.com",
    customerPhone: "+91 9876543213",
    travelers: 3,
    adults: 2,
    children: 1,
    infants: 0,
    travelDate: "2024-01-25",
    bookingDate: "2023-12-15",
    status: "cancelled",
    totalAmount: 98997,
    paidAmount: 0,
    payoutEligible: false,
    payoutAmount: 0,
    specialRequests: "",
  },
];

export default function BookingInboxPage() {
  const [bookings, setBookings] = useState(mockBookings);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      filterStatus === "all" || booking.status === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.packageTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: bookings.length,
    new: bookings.filter((b) => b.status === "new").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    totalRevenue: bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + b.totalAmount, 0),
    eligiblePayout: bookings
      .filter((b) => b.payoutEligible)
      .reduce((sum, b) => sum + b.payoutAmount, 0),
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      new: "bg-blue-100 text-blue-800",
      confirmed: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
    );
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      new: <AlertCircle className="h-4 w-4" />,
      confirmed: <CheckCircle className="h-4 w-4" />,
      completed: <CheckCircle className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />,
    };
    return icons[status as keyof typeof icons] || <Clock className="h-4 w-4" />;
  };

  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Booking Inbox</h1>
        <p className="text-gray-600">
          Manage all your package bookings and track payouts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Bookings
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  New Bookings
                </p>
                <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-green-600">
                  <span className="rupee-font">₹</span>
                  {stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <IndianRupee className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Eligible Payout
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  <span className="rupee-font">₹</span>
                  {stats.eligiblePayout.toLocaleString()}
                </p>
              </div>
              <Download className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by customer name, package, or booking ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings ({filteredBookings.length})</CardTitle>
          <CardDescription>
            Track and manage your package bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Travel Date</TableHead>
                <TableHead>Travelers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-mono">{booking.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.customerName}</div>
                      <div className="text-sm text-gray-500">
                        {booking.customerEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className="max-w-48 truncate"
                      title={booking.packageTitle}
                    >
                      {booking.packageTitle}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {new Date(booking.travelDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      {booking.travelers}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(booking.status)}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1 capitalize">{booking.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        <span className="rupee-font">₹</span>
                        {booking.totalAmount.toLocaleString()}
                      </div>
                      {booking.paidAmount < booking.totalAmount && (
                        <div className="text-sm text-orange-600">
                          Paid: <span className="rupee-font">₹</span>
                          {booking.paidAmount.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {booking.payoutEligible ? (
                        <Badge className="bg-green-100 text-green-800">
                          <span className="rupee-font">₹</span>
                          {booking.payoutAmount.toLocaleString()}
                        </Badge>
                      ) : (
                        <span className="text-gray-500">Pending</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedBooking(booking)}
                            className="touch-target"
                          >
                            <Eye className="h-3 w-3 xs:h-4 xs:w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] xs:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto agent-modal-mobile">
                          <DialogHeader className="p-mobile-3">
                            <DialogTitle className="text-responsive-base">
                              Booking Details - {booking.id}
                            </DialogTitle>
                            <DialogDescription className="text-responsive-xs">
                              Complete booking information and customer details
                            </DialogDescription>
                          </DialogHeader>
                          <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-mobile-3">
                            {selectedBooking && (
                              <BookingDetailsModal
                                booking={selectedBooking}
                                onStatusUpdate={handleStatusUpdate}
                              />
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="outline" className="touch-target" onClick={() => alert('Message customer functionality would be implemented here')}>
                        <MessageSquare className="h-3 w-3 xs:h-4 xs:w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function BookingDetailsModal({ booking, onStatusUpdate }: any) {
  return (
    <div className="space-y-3 xs:space-y-6 space-mobile-2">
      {/* Customer Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-6 agent-form-mobile">
        <Card className="agent-card">
          <CardHeader className="p-mobile-3">
            <CardTitle className="text-base xs:text-lg text-responsive-base">Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 xs:space-y-3 p-mobile-3 space-mobile-1">
            <div>
              <label className="text-xs xs:text-sm font-medium text-gray-600 text-responsive-xs">Name</label>
              <p className="font-medium text-responsive-sm">{booking.customerName}</p>
            </div>
            <div>
              <label className="text-xs xs:text-sm font-medium text-gray-600 text-responsive-xs">Email</label>
              <p className="flex items-center text-responsive-sm">
                <Mail className="h-3 w-3 xs:h-4 xs:w-4 mr-1 text-gray-400" />
                {booking.customerEmail}
              </p>
            </div>
            <div>
              <label className="text-xs xs:text-sm font-medium text-gray-600 text-responsive-xs">Phone</label>
              <p className="flex items-center text-responsive-sm">
                <Phone className="h-3 w-3 xs:h-4 xs:w-4 mr-1 text-gray-400" />
                {booking.customerPhone}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="agent-card">
          <CardHeader className="p-mobile-3">
            <CardTitle className="text-base xs:text-lg text-responsive-base">Travel Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 xs:space-y-3 p-mobile-3 space-mobile-1">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Package
              </label>
              <p className="font-medium">{booking.packageTitle}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Travel Date
              </label>
              <p className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                {new Date(booking.travelDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Travelers
              </label>
              <p className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-gray-400" />
                {booking.adults} Adults, {booking.children} Children,{" "}
                {booking.infants} Infants
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Payment & Payout Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Total Amount
              </label>
              <p className="text-lg font-bold">
                <span className="rupee-font">₹</span>
                {booking.totalAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Amount Paid
              </label>
              <p className="text-lg font-bold text-green-600">
                <span className="rupee-font">₹</span>
                {booking.paidAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Payout Amount (85%)
              </label>
              <p className="text-lg font-bold text-purple-600">
                <span className="rupee-font">₹</span>
                {booking.payoutAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Requests */}
      {booking.specialRequests && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Special Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{booking.specialRequests}</p>
          </CardContent>
        </Card>
      )}

      {/* Status Update */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Update Booking Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Select
              defaultValue={booking.status}
              onValueChange={(value) => onStatusUpdate(booking.id, value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button>Update Status</Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Mark as "Completed" after successful trip completion to enable
            payout eligibility.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
