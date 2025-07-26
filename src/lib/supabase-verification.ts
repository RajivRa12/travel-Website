// Supabase Database Verification Utility
// This helps verify that the database tables are properly set up

import { supabase } from './supabaseClient';

export interface DatabaseVerificationResult {
  isConnected: boolean;
  tablesExist: {
    users: boolean;
    agents: boolean;
    packages: boolean;
    bookings: boolean;
    notifications: boolean;
    messages: boolean;
    activity_logs: boolean;
  };
  errors: string[];
}

export async function verifySupabaseSetup(): Promise<DatabaseVerificationResult> {
  const result: DatabaseVerificationResult = {
    isConnected: false,
    tablesExist: {
      users: false,
      agents: false,
      packages: false,
      bookings: false,
      notifications: false,
      messages: false,
      activity_logs: false,
    },
    errors: [],
  };

  try {
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      result.errors.push(`Database connection error: ${error.message}`);
      return result;
    }

    result.isConnected = true;

    // Check each table existence
    const tables = ['users', 'agents', 'packages', 'bookings', 'notifications', 'messages', 'activity_logs'];
    
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase.from(table).select('*').limit(1);
        if (!tableError) {
          result.tablesExist[table as keyof typeof result.tablesExist] = true;
        } else {
          result.errors.push(`Table '${table}' error: ${tableError.message}`);
        }
      } catch (err) {
        result.errors.push(`Table '${table}' check failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

  } catch (error) {
    result.errors.push(`General verification error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
}

export async function testAgentRegistration(): Promise<boolean> {
  try {
    // Test if we can perform basic operations on the agents table
    const { error } = await supabase
      .from('agents')
      .select('id, status, company_name')
      .limit(1);

    return !error;
  } catch (error) {
    console.error('Agent registration test failed:', error);
    return false;
  }
}

export function getSetupInstructions(): string[] {
  return [
    "1. Create a Supabase project at https://supabase.com",
    "2. Go to the SQL Editor in your Supabase dashboard",
    "3. Run the database schema from: src/lib/database-schema.sql",
    "4. Run the RLS policies from: src/lib/database-policies.sql",
    "5. Update your environment variables:",
    "   - NEXT_PUBLIC_SUPABASE_URL=your_project_url",
    "   - NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key",
    "6. Enable Row Level Security for all tables",
    "7. Test the connection using this verification utility"
  ];
}

// Console helper function for debugging
export async function logDatabaseStatus(): Promise<void> {
  console.log('🔍 Verifying Supabase Database Setup...');
  
  const result = await verifySupabaseSetup();
  
  console.log('📊 Database Verification Results:');
  console.log('- Connected:', result.isConnected ? '✅' : '❌');
  
  console.log('\n📋 Tables Status:');
  Object.entries(result.tablesExist).forEach(([table, exists]) => {
    console.log(`- ${table}:`, exists ? '✅' : '❌');
  });

  if (result.errors.length > 0) {
    console.log('\n❌ Errors:');
    result.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });

    console.log('\n🛠️ Setup Instructions:');
    getSetupInstructions().forEach((instruction, index) => {
      console.log(`${index + 1}. ${instruction}`);
    });
  } else {
    console.log('\n✅ All systems operational!');
  }
}
