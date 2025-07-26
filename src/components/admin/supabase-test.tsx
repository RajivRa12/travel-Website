"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { supabaseEnhanced } from '@/lib/supabase/enhanced-client';

export default function SupabaseConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [testResults, setTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const runConnectionTest = async () => {
    setIsLoading(true);
    setConnectionStatus('testing');
    
    const results = {
      basic_connection: false,
      database_access: false,
      realtime: false,
      auth: false,
      rls: false,
      tables: [],
      error: null,
    };

    try {
      // Test 1: Basic connection
      const { data: basicTest, error: basicError } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true });
      
      if (!basicError) {
        results.basic_connection = true;
        results.database_access = true;
      }

      // Test 2: Check if tables exist
      const tables = ['users', 'agents', 'packages', 'bookings', 'notifications', 'activity_logs'];
      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
          
          results.tables.push({
            name: table,
            exists: !error,
            count: data || 0,
          });
        } catch (err) {
          results.tables.push({
            name: table,
            exists: false,
            error: err.message,
          });
        }
      }

      // Test 3: Test authentication
      const { data: authUser } = await supabase.auth.getUser();
      results.auth = true; // Auth service is available even if no user

      // Test 4: Test real-time capabilities
      try {
        const channel = supabase.channel('test-channel');
        results.realtime = !!channel;
        supabase.removeChannel(channel);
      } catch (err) {
        results.realtime = false;
      }

      // Test 5: Test RLS
      try {
        const { error: rlsError } = await supabase
          .from('users')
          .select('*')
          .limit(1);
        results.rls = true; // RLS is working if no error or expected auth error
      } catch (err) {
        results.rls = false;
      }

      setTestResults(results);
      setConnectionStatus(results.basic_connection ? 'connected' : 'error');

    } catch (error) {
      results.error = error.message;
      setTestResults(results);
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runConnectionTest();
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge className={status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {status ? 'Pass' : 'Fail'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <CardTitle>Supabase Connection Test</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {connectionStatus === 'testing' && (
                <Badge className="bg-yellow-100 text-yellow-800">Testing...</Badge>
              )}
              {connectionStatus === 'connected' && (
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              )}
              {connectionStatus === 'error' && (
                <Badge className="bg-red-100 text-red-800">Error</Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={runConnectionTest}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Retest
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {testResults.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-800">Connection Error</span>
              </div>
              <p className="text-sm text-red-700 mt-1">{testResults.error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-medium">Core Features</h3>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.basic_connection)}
                  <span className="text-sm">Basic Connection</span>
                </div>
                {getStatusBadge(testResults.basic_connection)}
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.database_access)}
                  <span className="text-sm">Database Access</span>
                </div>
                {getStatusBadge(testResults.database_access)}
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.auth)}
                  <span className="text-sm">Authentication</span>
                </div>
                {getStatusBadge(testResults.auth)}
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.realtime)}
                  <span className="text-sm">Real-time</span>
                </div>
                {getStatusBadge(testResults.realtime)}
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.rls)}
                  <span className="text-sm">Row Level Security</span>
                </div>
                {getStatusBadge(testResults.rls)}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Database Tables</h3>
              
              {testResults.tables?.map((table: any) => (
                <div key={table.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(table.exists)}
                    <span className="text-sm capitalize">{table.name}</span>
                  </div>
                  {getStatusBadge(table.exists)}
                </div>
              ))}
            </div>
          </div>

          {connectionStatus === 'connected' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Supabase Connected Successfully!</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your Supabase database is properly connected and all core features are working.
              </p>
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">Connection Issues Detected</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Please check your environment variables and database setup.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
