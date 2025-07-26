"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Eye, Clock, MapPin, DollarSign, Calendar, Building } from 'lucide-react';

interface Package {
  id: string;
  title: string;
  description?: string;
  price: number;
  duration_days?: number;
  location?: string;
  status: string;
  created_at: string;
  agent: {
    id: string;
    company_name: string;
    user: {
      name: string;
      email: string;
    };
  };
}

export default function PackageApprovalPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          agent:agents(
            id,
            company_name,
            user:users(name, email)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch packages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (packageId: string, action: 'approve' | 'reject') => {
    setActionLoading(packageId);
    try {
      const response = await fetch(`/api/admin/packages/${packageId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          rejection_reason: action === 'reject' ? rejectionReason : undefined
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update package status');
      }

      toast({
        title: "Success",
        description: result.message,
      });

      // Refresh packages list
      fetchPackages();
      setRejectionReason('');
      setSelectedPackage(null);
    } catch (error) {
      console.error('Error updating package:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update package status",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', icon: Clock },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
      archived: { color: 'bg-gray-100 text-gray-800', icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const PackageCard = ({ package_: pkg }: { package_: Package }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{pkg.title}</CardTitle>
          {getStatusBadge(pkg.status)}
        </div>
        <div className="text-sm text-gray-600 flex items-center gap-1">
          <Building className="w-4 h-4" />
          {pkg.agent.company_name} - {pkg.agent.user.name}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-medium"><span className="rupee-font">₹</span>{pkg.price.toLocaleString()}</span>
            </div>
            {pkg.duration_days && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{pkg.duration_days} days</span>
              </div>
            )}
            {pkg.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>{pkg.location}</span>
              </div>
            )}
          </div>

          {pkg.description && (
            <div>
              <p className="text-sm text-gray-700 line-clamp-2">{pkg.description}</p>
            </div>
          )}

          <div className="text-xs text-gray-500">
            Submitted on: {new Date(pkg.created_at).toLocaleDateString()}
          </div>

          {pkg.status === 'pending' && (
            <div className="flex gap-2 pt-3">
              <Button
                onClick={() => handleApproval(pkg.id, 'approve')}
                disabled={actionLoading === pkg.id}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    onClick={() => setSelectedPackage(pkg)}
                    disabled={actionLoading === pkg.id}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Package</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>Are you sure you want to reject the package <strong>{pkg.title}</strong>?</p>
                    <Textarea
                      placeholder="Please provide a reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        onClick={() => handleApproval(pkg.id, 'reject')}
                        disabled={!rejectionReason.trim() || actionLoading === pkg.id}
                      >
                        Confirm Rejection
                      </Button>
                      <Button variant="outline" onClick={() => setRejectionReason('')}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{pkg.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Agent</p>
                        <p>{pkg.agent.company_name}</p>
                        <p className="text-sm text-gray-600">{pkg.agent.user.name}</p>
                      </div>
                      <div>
                        <p className="font-medium">Price</p>
                        <p className="text-lg font-bold text-green-600"><span className="rupee-font">₹</span>{pkg.price.toLocaleString()}</p>
                      </div>
                      {pkg.duration_days && (
                        <div>
                          <p className="font-medium">Duration</p>
                          <p>{pkg.duration_days} days</p>
                        </div>
                      )}
                      {pkg.location && (
                        <div>
                          <p className="font-medium">Location</p>
                          <p>{pkg.location}</p>
                        </div>
                      )}
                    </div>
                    {pkg.description && (
                      <div>
                        <p className="font-medium">Description</p>
                        <p className="text-sm text-gray-700 mt-1">{pkg.description}</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const filterPackagesByStatus = (status: string) => {
    return packages.filter(pkg => pkg.status === status);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Loading packages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Package Approval Management</h1>
        <p className="text-gray-600">Review and manage package submissions from agents</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pending">
            Pending ({filterPackagesByStatus('pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({filterPackagesByStatus('approved').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({filterPackagesByStatus('rejected').length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Draft ({filterPackagesByStatus('draft').length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({packages.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {filterPackagesByStatus('pending').length === 0 ? (
            <Card>
              <CardContent className="text-center p-6">
                <p className="text-gray-500">No pending packages for approval</p>
              </CardContent>
            </Card>
          ) : (
            filterPackagesByStatus('pending').map((pkg) => (
              <PackageCard key={pkg.id} package_={pkg} />
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {filterPackagesByStatus('approved').length === 0 ? (
            <Card>
              <CardContent className="text-center p-6">
                <p className="text-gray-500">No approved packages</p>
              </CardContent>
            </Card>
          ) : (
            filterPackagesByStatus('approved').map((pkg) => (
              <PackageCard key={pkg.id} package_={pkg} />
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          {filterPackagesByStatus('rejected').length === 0 ? (
            <Card>
              <CardContent className="text-center p-6">
                <p className="text-gray-500">No rejected packages</p>
              </CardContent>
            </Card>
          ) : (
            filterPackagesByStatus('rejected').map((pkg) => (
              <PackageCard key={pkg.id} package_={pkg} />
            ))
          )}
        </TabsContent>

        <TabsContent value="draft" className="mt-6">
          {filterPackagesByStatus('draft').length === 0 ? (
            <Card>
              <CardContent className="text-center p-6">
                <p className="text-gray-500">No draft packages</p>
              </CardContent>
            </Card>
          ) : (
            filterPackagesByStatus('draft').map((pkg) => (
              <PackageCard key={pkg.id} package_={pkg} />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          {packages.length === 0 ? (
            <Card>
              <CardContent className="text-center p-6">
                <p className="text-gray-500">No packages found</p>
              </CardContent>
            </Card>
          ) : (
            packages.map((pkg) => (
              <PackageCard key={pkg.id} package_={pkg} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
