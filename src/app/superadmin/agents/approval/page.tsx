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
import { CheckCircle, XCircle, Eye, Clock, Building, Mail, Phone, FileText } from 'lucide-react';

interface Agent {
  id: string;
  user_id: string;
  company_name: string;
  company_address?: string;
  license_number?: string;
  business_type?: string;
  status: string;
  created_at: string;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
}

export default function AgentApprovalPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select(`
          *,
          user:users(name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch agents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (agentId: string, action: 'approve' | 'reject') => {
    setActionLoading(agentId);
    try {
      const response = await fetch(`/api/admin/agents/${agentId}/approve`, {
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
        throw new Error(result.error || 'Failed to update agent status');
      }

      toast({
        title: "Success",
        description: result.message,
      });

      // Refresh agents list
      fetchAgents();
      setRejectionReason('');
      setSelectedAgent(null);
    } catch (error) {
      console.error('Error updating agent:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update agent status",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
      suspended: { color: 'bg-gray-100 text-gray-800', icon: XCircle }
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

  const AgentCard = ({ agent }: { agent: Agent }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="w-5 h-5" />
            {agent.company_name}
          </CardTitle>
          {getStatusBadge(agent.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-600">Contact Person</p>
              <p>{agent.user.name}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Business Type</p>
              <p>{agent.business_type || 'Not specified'}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Email</p>
              <p className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {agent.user.email}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Phone</p>
              <p className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {agent.user.phone || 'Not provided'}
              </p>
            </div>
            {agent.license_number && (
              <div>
                <p className="font-medium text-gray-600">License Number</p>
                <p>{agent.license_number}</p>
              </div>
            )}
            <div>
              <p className="font-medium text-gray-600">Applied On</p>
              <p>{new Date(agent.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {agent.company_address && (
            <div>
              <p className="font-medium text-gray-600">Company Address</p>
              <p className="text-sm">{agent.company_address}</p>
            </div>
          )}

          {agent.status === 'pending' && (
            <div className="flex gap-2 pt-3">
              <Button
                onClick={() => handleApproval(agent.id, 'approve')}
                disabled={actionLoading === agent.id}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    onClick={() => setSelectedAgent(agent)}
                    disabled={actionLoading === agent.id}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Agent Registration</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>Are you sure you want to reject the registration for <strong>{agent.company_name}</strong>?</p>
                    <Textarea
                      placeholder="Please provide a reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        onClick={() => handleApproval(agent.id, 'reject')}
                        disabled={!rejectionReason.trim() || actionLoading === agent.id}
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
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Agent Details - {agent.company_name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Contact Person</p>
                        <p>{agent.user.name}</p>
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <p>{agent.user.email}</p>
                      </div>
                      <div>
                        <p className="font-medium">Phone</p>
                        <p>{agent.user.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="font-medium">Business Type</p>
                        <p>{agent.business_type || 'Not specified'}</p>
                      </div>
                      {agent.license_number && (
                        <div>
                          <p className="font-medium">License Number</p>
                          <p>{agent.license_number}</p>
                        </div>
                      )}
                    </div>
                    {agent.company_address && (
                      <div>
                        <p className="font-medium">Company Address</p>
                        <p>{agent.company_address}</p>
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

  const filterAgentsByStatus = (status: string) => {
    return agents.filter(agent => agent.status === status);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Loading agents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Agent Approval Management</h1>
        <p className="text-gray-600">Review and manage agent registration requests</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pending ({filterAgentsByStatus('pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({filterAgentsByStatus('approved').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({filterAgentsByStatus('rejected').length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({agents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {filterAgentsByStatus('pending').length === 0 ? (
            <Card>
              <CardContent className="text-center p-6">
                <p className="text-gray-500">No pending agent registrations</p>
              </CardContent>
            </Card>
          ) : (
            filterAgentsByStatus('pending').map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {filterAgentsByStatus('approved').length === 0 ? (
            <Card>
              <CardContent className="text-center p-6">
                <p className="text-gray-500">No approved agents</p>
              </CardContent>
            </Card>
          ) : (
            filterAgentsByStatus('approved').map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          {filterAgentsByStatus('rejected').length === 0 ? (
            <Card>
              <CardContent className="text-center p-6">
                <p className="text-gray-500">No rejected agents</p>
              </CardContent>
            </Card>
          ) : (
            filterAgentsByStatus('rejected').map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          {agents.length === 0 ? (
            <Card>
              <CardContent className="text-center p-6">
                <p className="text-gray-500">No agents found</p>
              </CardContent>
            </Card>
          ) : (
            agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
