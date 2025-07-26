"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  verifySupabaseSetup, 
  testAgentRegistration, 
  getSetupInstructions,
  DatabaseVerificationResult 
} from '@/lib/supabase-verification';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Database, 
  RefreshCw, 
  Info,
  Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DatabaseStatusPage() {
  const [verificationResult, setVerificationResult] = useState<DatabaseVerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [agentRegistrationWorking, setAgentRegistrationWorking] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    runVerification();
  }, []);

  const runVerification = async () => {
    setIsLoading(true);
    try {
      const result = await verifySupabaseSetup();
      setVerificationResult(result);

      if (result.isConnected && result.tablesExist.agents) {
        const agentTest = await testAgentRegistration();
        setAgentRegistrationWorking(agentTest);
      }
    } catch (error) {
      console.error('Verification failed:', error);
      toast({
        title: "Verification Failed",
        description: "Failed to verify database status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  const getStatusBadge = (status: boolean, label: string) => {
    return (
      <Badge className={status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
        {getStatusIcon(status)}
        <span className="ml-1">{label}</span>
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Database className="h-8 w-8" />
            Database Status
          </h1>
          <p className="text-gray-600 mt-2">
            Verify Supabase database setup and agent registration functionality
          </p>
        </div>
        <Button onClick={runVerification} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Checking...' : 'Refresh Status'}
        </Button>
      </div>

      {verificationResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Supabase Connection</span>
                  {getStatusBadge(verificationResult.isConnected, verificationResult.isConnected ? 'Connected' : 'Failed')}
                </div>
                
                {verificationResult.isConnected && (
                  <div className="flex items-center justify-between">
                    <span>Agent Registration Test</span>
                    {agentRegistrationWorking !== null && 
                      getStatusBadge(agentRegistrationWorking, agentRegistrationWorking ? 'Working' : 'Failed')
                    }
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tables Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Database Tables
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(verificationResult.tablesExist).map(([table, exists]) => (
                  <div key={table} className="flex items-center justify-between">
                    <span className="font-mono text-sm">{table}</span>
                    {getStatusIcon(exists)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Errors Display */}
      {verificationResult?.errors.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Issues Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {verificationResult.errors.map((error, index) => (
                <Alert key={index} className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Database Setup Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getSetupInstructions().map((instruction, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{instruction}</p>
                  {instruction.includes('NEXT_PUBLIC_') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(instruction.split(':')[1]?.trim() || instruction)}
                      className="mt-1 h-6 text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle>Required Environment Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="bg-gray-100 p-3 rounded font-mono text-sm">
              <div className="flex items-center justify-between">
                <span>NEXT_PUBLIC_SUPABASE_URL=your_project_url</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard('NEXT_PUBLIC_SUPABASE_URL=')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="bg-gray-100 p-3 rounded font-mono text-sm">
              <div className="flex items-center justify-between">
                <span>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard('NEXT_PUBLIC_SUPABASE_ANON_KEY=')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <p className="text-sm text-gray-600">
            Add these to your <code className="bg-gray-100 px-1 rounded">.env.local</code> file
          </p>
        </CardContent>
      </Card>

      {/* Database Schema Files */}
      <Card>
        <CardHeader>
          <CardTitle>Database Schema Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">src/lib/database-schema.sql</span>
              <Badge variant="secondary">Required</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">src/lib/database-policies.sql</span>
              <Badge variant="secondary">Required</Badge>
            </div>
            <p className="text-sm text-gray-600">
              Run these SQL files in your Supabase SQL Editor to set up the database structure.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
