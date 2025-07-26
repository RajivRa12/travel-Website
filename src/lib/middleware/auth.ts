import { NextRequest, NextResponse } from 'next/server';
import { supabaseHelpers } from '@/lib/supabaseClient';

export interface AuthContext {
  user: any;
  agent?: any;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string, resourceId?: string) => Promise<boolean>;
}

export function withAuth(
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>,
  options: {
    roles?: string[];
    permissions?: string[];
    requireAgent?: boolean;
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Get current user
      const user = await supabaseHelpers.getCurrentUser();
      
      if (!user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Check role requirements
      if (options.roles && !options.roles.includes(user.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      // Get agent profile if required or user is agent
      let agent = null;
      if (options.requireAgent || user.role === 'agent') {
        agent = await supabaseHelpers.getCurrentAgent();
        
        if (options.requireAgent && !agent) {
          return NextResponse.json(
            { error: 'Agent profile required' },
            { status: 403 }
          );
        }

        // Check agent status for agents
        if (user.role === 'agent' && agent?.status !== 'approved') {
          return NextResponse.json(
            { 
              error: 'Agent account pending approval',
              status: agent?.status || 'pending'
            },
            { status: 403 }
          );
        }
      }

      // Create auth context
      const context: AuthContext = {
        user,
        agent,
        hasRole: (role: string) => user.role === role,
        hasPermission: async (permission: string, resourceId?: string) => {
          return await supabaseHelpers.hasPermission(permission, resourceId);
        }
      };

      // Check specific permissions
      if (options.permissions) {
        for (const permission of options.permissions) {
          const hasPermission = await context.hasPermission(permission);
          if (!hasPermission) {
            return NextResponse.json(
              { error: `Permission denied: ${permission}` },
              { status: 403 }
            );
          }
        }
      }

      return await handler(request, context);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

// Specific middleware functions
export const requireSuperAdmin = (
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>
) => withAuth(handler, { roles: ['super_admin'] });

export const requireAgent = (
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>
) => withAuth(handler, { roles: ['agent'], requireAgent: true });

export const requireCustomer = (
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>
) => withAuth(handler, { roles: ['customer'] });

export const requireApprovedAgent = (
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>
) => withAuth(handler, { roles: ['agent'], requireAgent: true });

// Client-side auth helpers
export const clientAuth = {
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  },

  hasRole: (role: string) => {
    if (typeof window === 'undefined') return false;
    const userRole = localStorage.getItem('user_role');
    return userRole === role;
  },

  isApprovedAgent: () => {
    if (typeof window === 'undefined') return false;
    const agentStatus = localStorage.getItem('agent_status');
    return agentStatus === 'approved';
  },

  redirectIfUnauthorized: (requiredRole?: string) => {
    if (typeof window === 'undefined') return;
    
    const isAuth = clientAuth.isAuthenticated();
    const userRole = localStorage.getItem('user_role');

    if (!isAuth) {
      window.location.href = '/login';
      return;
    }

    if (requiredRole && userRole !== requiredRole) {
      if (userRole === 'customer') {
        window.location.href = '/';
      } else if (userRole === 'agent') {
        window.location.href = '/agent-dashboard';
      } else if (userRole === 'super_admin') {
        window.location.href = '/superadmin/dashboard';
      } else {
        window.location.href = '/login';
      }
    }
  }
};
