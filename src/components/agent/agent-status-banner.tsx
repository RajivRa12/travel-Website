"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabaseHelpers } from '@/lib/supabaseClient';
import { Clock, CheckCircle, XCircle, AlertTriangle, Mail, Phone, Building } from 'lucide-react';

interface AgentStatus {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  company_name: string;
  rejection_reason?: string;
  approved_at?: string;
  created_at: string;
}

export function AgentStatusBanner() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgentStatus();
  }, []);

  const fetchAgentStatus = async () => {
    try {
      const agent = await supabaseHelpers.getCurrentAgent();
      setAgentStatus(agent);
    } catch (error) {
      console.error('Error fetching agent status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!agentStatus) {
    return (
      <Alert className="mb-6 border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription>
          Agent profile not found. Please contact support.
        </AlertDescription>
      </Alert>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          badge: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
          alert: { color: 'border-yellow-200 bg-yellow-50', iconColor: 'text-yellow-600' },
          title: 'Registration Under Review',
          description: 'Your agent registration is being reviewed by our team. This process typically takes 2-3 business days.'
        };
      case 'approved':
        return {
          badge: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
          alert: { color: 'border-green-200 bg-green-50', iconColor: 'text-green-600' },
          title: 'Account Approved',
          description: 'Welcome! Your agent account has been approved. You can now create packages and manage bookings.'
        };
      case 'rejected':
        return {
          badge: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
          alert: { color: 'border-red-200 bg-red-50', iconColor: 'text-red-600' },
          title: 'Registration Rejected',
          description: agentStatus.rejection_reason || 'Your registration has been rejected. Please contact support for more information.'
        };
      case 'suspended':
        return {
          badge: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: XCircle },
          alert: { color: 'border-gray-200 bg-gray-50', iconColor: 'text-gray-600' },
          title: 'Account Suspended',
          description: 'Your account has been temporarily suspended. Please contact support to resolve this issue.'
        };
      default:
        return {
          badge: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock },
          alert: { color: 'border-gray-200 bg-gray-50', iconColor: 'text-gray-600' },
          title: 'Status Unknown',
          description: 'Unable to determine account status. Please contact support.'
        };
    }
  };

  const config = getStatusConfig(agentStatus.status);
  const BadgeIcon = config.badge.icon;

  const getRestrictedFeatures = () => {
    if (agentStatus.status === 'approved') return [];
    
    return [
      'Create new packages',
      'Manage existing packages',
      'Receive new bookings',
      'Process payments',
      'Access analytics dashboard'
    ];
  };

  const restrictedFeatures = getRestrictedFeatures();

  return (
    <div className="space-y-4 mb-6">
      {/* Status Alert */}
      <Alert className={config.alert.color}>
        <BadgeIcon className={`h-4 w-4 ${config.alert.iconColor}`} />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium mb-1">{config.title}</div>
              <div className="text-sm">{config.description}</div>
              {agentStatus.status === 'pending' && (
                <div className="text-xs mt-2 text-gray-600">
                  Submitted on: {new Date(agentStatus.created_at).toLocaleDateString()}
                </div>
              )}
            </div>
            <Badge className={config.badge.color}>
              <BadgeIcon className="w-3 h-3 mr-1" />
              {agentStatus.status.charAt(0).toUpperCase() + agentStatus.status.slice(1)}
            </Badge>
          </div>
        </AlertDescription>
      </Alert>

      {/* Company Info Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Building className="h-5 w-5 text-gray-500" />
            <div>
              <div className="font-medium">{agentStatus.company_name}</div>
              <div className="text-sm text-gray-600">Travel Agent</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Restrictions for non-approved agents */}
      {restrictedFeatures.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-orange-800 mb-2">Limited Access</div>
                <div className="text-sm text-orange-700 mb-3">
                  The following features are restricted until your account is approved:
                </div>
                <ul className="text-sm text-orange-700 space-y-1">
                  {restrictedFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-orange-600 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                {agentStatus.status === 'rejected' && (
                  <div className="mt-3 pt-3 border-t border-orange-200">
                    <Button size="sm" variant="outline" className="text-orange-700 border-orange-300 hover:bg-orange-100">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success message for approved agents */}
      {agentStatus.status === 'approved' && agentStatus.approved_at && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="text-sm text-green-800">
                <div className="font-medium">You're all set!</div>
                <div>Account approved on {new Date(agentStatus.approved_at).toLocaleDateString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
