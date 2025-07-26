"use client";

import * as React from "react";
import Link from "next/link";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  MoreHorizontal,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  MapPin,
  Calendar,
  Users,
  Star,
  IndianRupee,
  AlertTriangle,
  FileText,
  Camera,
  Trash2,
} from "lucide-react";
import { packages as allPackages, agents } from "@/lib/data";

type PackageWithStatus = (typeof allPackages)[0] & {
  moderationStatus: "pending" | "approved" | "rejected";
  publishStatus: "draft" | "published" | "unpublished";
  submissionDate: string;
  lastModified: string;
  moderationReason?: string;
  agentName: string;
  agentEmail: string;
  views: number;
  bookings: number;
  conversionRate: number;
};

export default function SuperAdminPackagesPage() {
  const { toast } = useToast();
  const [packageList, setPackageList] = React.useState<PackageWithStatus[]>([]);
  const [filteredPackages, setFilteredPackages] = React.useState<
    PackageWithStatus[]
  >([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [destinationFilter, setDestinationFilter] = React.useState("all");
  const [selectedPackages, setSelectedPackages] = React.useState<number[]>([]);
  const [actionDialog, setActionDialog] = React.useState<{
    open: boolean;
    type:
      | "approve"
      | "reject"
      | "unpublish"
      | "bulk-approve"
      | "bulk-reject"
      | "bulk-unpublish"
      | null;
    packages: PackageWithStatus[];
  }>({ open: false, type: null, packages: [] });
  const [actionReason, setActionReason] = React.useState("");

  React.useEffect(() => {
    // Enhanced mock data for packages
    const initialPackages: PackageWithStatus[] = allPackages.map(
      (pkg, index) => {
        const agent = agents.find((a) => a.id === pkg.agentId);
        return {
          ...pkg,
          moderationStatus: ["pending", "approved", "rejected"][
            Math.floor(Math.random() * 3)
          ] as any,
          publishStatus: ["draft", "published", "unpublished"][
            Math.floor(Math.random() * 3)
          ] as any,
          submissionDate: new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
          )
            .toISOString()
            .split("T")[0],
          lastModified: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
          )
            .toISOString()
            .split("T")[0],
          moderationReason:
            Math.random() > 0.7 ? "Requires better image quality" : undefined,
          agentName: agent?.name || "Unknown Agent",
          agentEmail: agent?.email || "unknown@example.com",
          views: Math.floor(Math.random() * 5000) + 100,
          bookings: Math.floor(Math.random() * 50) + 1,
          conversionRate: Math.random() * 10 + 1,
        };
      },
    );
    setPackageList(initialPackages);
    setFilteredPackages(initialPackages);
  }, []);

  React.useEffect(() => {
    let filtered = packageList.filter((pkg) => {
      const matchesSearch =
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || pkg.moderationStatus === statusFilter;
      const matchesDestination =
        destinationFilter === "all" || pkg.destination === destinationFilter;

      return matchesSearch && matchesStatus && matchesDestination;
    });
    setFilteredPackages(filtered);
  }, [searchTerm, statusFilter, destinationFilter, packageList]);

  const handleSingleAction = (type: string, pkg: PackageWithStatus) => {
    setActionDialog({ open: true, type: type as any, packages: [pkg] });
  };

  const handleBulkAction = (type: string) => {
    const selectedPkgs = packageList.filter((pkg) =>
      selectedPackages.includes(pkg.id),
    );
    if (selectedPkgs.length === 0) {
      toast({
        title: "No packages selected",
        description: "Please select at least one package for bulk action.",
        variant: "destructive",
      });
      return;
    }
    setActionDialog({ open: true, type: type as any, packages: selectedPkgs });
  };

  const confirmAction = async () => {
    const { type, packages } = actionDialog;
    if (!type || packages.length === 0) return;

    // Update packages based on action type
    setPackageList((prev) =>
      prev.map((pkg) => {
        if (packages.some((p) => p.id === pkg.id)) {
          switch (type) {
            case "approve":
            case "bulk-approve":
              return {
                ...pkg,
                moderationStatus: "approved" as const,
                publishStatus: "published" as const,
                moderationReason: actionReason || undefined,
              };
            case "reject":
            case "bulk-reject":
              return {
                ...pkg,
                moderationStatus: "rejected" as const,
                moderationReason:
                  actionReason || "Does not meet platform standards",
              };
            case "unpublish":
            case "bulk-unpublish":
              return {
                ...pkg,
                publishStatus: "unpublished" as const,
                moderationReason: actionReason || undefined,
              };
            default:
              return pkg;
          }
        }
        return pkg;
      }),
    );

    const actionName = type.replace("bulk-", "");
    toast({
      title: "Action Completed",
      description: `Successfully ${actionName}d ${packages.length} package(s).`,
    });

    setActionDialog({ open: false, type: null, packages: [] });
    setActionReason("");
    setSelectedPackages([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPackages(filteredPackages.map((pkg) => pkg.id));
    } else {
      setSelectedPackages([]);
    }
  };

  const handleSelectPackage = (packageId: number, checked: boolean) => {
    if (checked) {
      setSelectedPackages((prev) => [...prev, packageId]);
    } else {
      setSelectedPackages((prev) => prev.filter((id) => id !== packageId));
    }
  };

  const exportData = () => {
    const csvData = filteredPackages.map((pkg) => ({
      Title: pkg.title,
      Agent: pkg.agentName,
      Destination: pkg.destination,
      Price: pkg.price,
      Status: pkg.moderationStatus,
      Published: pkg.publishStatus,
      Views: pkg.views,
      Bookings: pkg.bookings,
      Conversion: pkg.conversionRate,
      Submitted: pkg.submissionDate,
    }));

    console.log("Exporting CSV data:", csvData);
    toast({
      title: "Export Started",
      description: "Package data is being exported to CSV format.",
    });
  };

  const stats = {
    total: packageList.length,
    pending: packageList.filter((p) => p.moderationStatus === "pending").length,
    approved: packageList.filter((p) => p.moderationStatus === "approved")
      .length,
    rejected: packageList.filter((p) => p.moderationStatus === "rejected")
      .length,
    published: packageList.filter((p) => p.publishStatus === "published")
      .length,
  };

  const uniqueDestinations = [
    ...new Set(packageList.map((pkg) => pkg.destination)),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Package Moderation
          </h1>
          <p className="text-gray-600">
            Review and approve travel packages from DMCs
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Packages
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
                <p className="text-sm font-medium text-gray-600">
                  Pending Review
                </p>
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
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approved}
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
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.rejected}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.published}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Bulk Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search packages by title, agent, or destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={destinationFilter}
              onValueChange={setDestinationFilter}
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Destinations</SelectItem>
                {uniqueDestinations.map((dest) => (
                  <SelectItem key={dest} value={dest}>
                    {dest}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedPackages.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-blue-900">
                  {selectedPackages.length} package(s) selected
                </p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleBulkAction("bulk-approve")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Bulk Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleBulkAction("bulk-reject")}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Bulk Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("bulk-unpublish")}
                  >
                    <EyeOff className="h-4 w-4 mr-1" />
                    Bulk Unpublish
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Packages Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Packages ({filteredPackages.length})</CardTitle>
          <CardDescription>Review and moderate travel packages</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedPackages.length === filteredPackages.length &&
                      filteredPackages.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all packages"
                  />
                </TableHead>
                <TableHead>Package Details</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPackages.includes(pkg.id)}
                      onCheckedChange={(checked) =>
                        handleSelectPackage(pkg.id, checked as boolean)
                      }
                      aria-label={`Select ${pkg.title}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start space-x-3">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">{pkg.title}</div>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {pkg.destination}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {pkg.duration}
                          </div>
                          <div className="flex items-center">
                            <IndianRupee className="h-3 w-3 mr-1" />
                            {pkg.price.toLocaleString()}
                          </div>
                        </div>
                        {pkg.moderationReason && (
                          <div className="text-xs text-red-600 mt-1 flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {pkg.moderationReason}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">{pkg.agentName}</div>
                      <div className="text-xs text-gray-500">
                        {pkg.agentEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Badge
                        variant={
                          pkg.moderationStatus === "approved"
                            ? "default"
                            : pkg.moderationStatus === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className={
                          pkg.moderationStatus === "approved"
                            ? "bg-green-100 text-green-800"
                            : pkg.moderationStatus === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {pkg.moderationStatus === "approved" && (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {pkg.moderationStatus === "pending" && (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {pkg.moderationStatus === "rejected" && (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {pkg.moderationStatus}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          pkg.publishStatus === "published"
                            ? "border-green-300 text-green-700"
                            : pkg.publishStatus === "draft"
                              ? "border-yellow-300 text-yellow-700"
                              : "border-gray-300 text-gray-700"
                        }
                      >
                        {pkg.publishStatus === "published" && (
                          <Eye className="h-3 w-3 mr-1" />
                        )}
                        {pkg.publishStatus === "unpublished" && (
                          <EyeOff className="h-3 w-3 mr-1" />
                        )}
                        {pkg.publishStatus}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">
                          {pkg.views.toLocaleString()}
                        </span>
                        <span className="text-gray-500 ml-1">views</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{pkg.bookings}</span>
                        <span className="text-gray-500 ml-1">bookings</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {pkg.conversionRate.toFixed(1)}% conversion
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">
                        Submitted:{" "}
                        {new Date(pkg.submissionDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Modified:{" "}
                        {new Date(pkg.lastModified).toLocaleDateString()}
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
                        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Package
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Moderation</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleSingleAction("approve", pkg)}
                          disabled={pkg.moderationStatus === "approved"}
                          className="text-green-600"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSingleAction("reject", pkg)}
                          disabled={pkg.moderationStatus === "rejected"}
                          className="text-red-600"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSingleAction("unpublish", pkg)}
                          disabled={pkg.publishStatus !== "published"}
                          className="text-orange-600"
                        >
                          <EyeOff className="h-4 w-4 mr-2" />
                          Unpublish
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
          !open && setActionDialog({ open: false, type: null, packages: [] })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm{" "}
              {actionDialog.type?.replace("bulk-", "").charAt(0).toUpperCase()}
              {actionDialog.type?.replace("bulk-", "").slice(1)} Action
            </DialogTitle>
            <DialogDescription>
              You are about to {actionDialog.type?.replace("bulk-", "")}{" "}
              {actionDialog.packages.length} package(s).
              {actionDialog.type?.includes("bulk") &&
                " This bulk action will affect multiple packages simultaneously."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {actionDialog.packages.length <= 3 && (
              <div className="space-y-2">
                <Label>Affected Packages:</Label>
                {actionDialog.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="text-sm text-gray-600 p-2 bg-gray-50 rounded"
                  >
                    {pkg.title} - {pkg.agentName}
                  </div>
                ))}
              </div>
            )}
            <div>
              <Label htmlFor="reason">
                Reason{" "}
                {actionDialog.type === "reject" ||
                actionDialog.type === "bulk-reject"
                  ? "(Required)"
                  : "(Optional)"}
              </Label>
              <Textarea
                id="reason"
                placeholder={
                  actionDialog.type === "approve" ||
                  actionDialog.type === "bulk-approve"
                    ? "Package approved for publication..."
                    : actionDialog.type === "reject" ||
                        actionDialog.type === "bulk-reject"
                      ? "Please specify reason for rejection..."
                      : "Reason for unpublishing..."
                }
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
                setActionDialog({ open: false, type: null, packages: [] })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              disabled={
                (actionDialog.type === "reject" ||
                  actionDialog.type === "bulk-reject") &&
                !actionReason.trim()
              }
            >
              Confirm{" "}
              {actionDialog.type?.replace("bulk-", "").charAt(0).toUpperCase()}
              {actionDialog.type?.replace("bulk-", "").slice(1)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
