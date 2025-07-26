import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Enhanced Supabase helpers with comprehensive functionality
export const supabaseEnhanced = {
  // Authentication methods
  auth: {
    async signUp(email: string, password: string, userData?: any) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      return { data, error };
    },

    async signIn(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    },

    async signOut() {
      const { error } = await supabase.auth.signOut();
      return { error };
    },

    async getCurrentUser() {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },

    async getCurrentSession() {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },

    // Subscribe to auth changes
    onAuthStateChange(callback: (event: string, session: any) => void) {
      return supabase.auth.onAuthStateChange(callback);
    },
  },

  // User management
  users: {
    async getUser(userId: string) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      return { data, error };
    },

    async updateUser(userId: string, updates: any) {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      return { data, error };
    },

    async getUserWithRole(userId: string) {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          agent:agents(*),
          customer_profile:customer_profiles(*)
        `)
        .eq('id', userId)
        .single();
      return { data, error };
    },

    async getAllUsers(filters?: any) {
      let query = supabase
        .from('users')
        .select(`
          *,
          agent:agents(*),
          customer_profile:customer_profiles(*)
        `);

      if (filters?.role) {
        query = query.eq('role', filters.role);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      return { data, error };
    },
  },

  // Agent management
  agents: {
    async getAgent(agentId: string) {
      const { data, error } = await supabase
        .from('agents')
        .select(`
          *,
          user:users(*),
          packages(*),
          bookings(*)
        `)
        .eq('id', agentId)
        .single();
      return { data, error };
    },

    async getAllAgents(filters?: any) {
      let query = supabase
        .from('agents')
        .select(`
          *,
          user:users(*),
          packages(count),
          bookings(count)
        `);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      return { data, error };
    },

    async approveAgent(agentId: string, approvedBy: string) {
      const { data, error } = await supabase
        .from('agents')
        .update({
          status: 'approved',
          approved_by: approvedBy,
          approved_at: new Date().toISOString(),
        })
        .eq('id', agentId)
        .select()
        .single();

      if (!error) {
        // Log activity
        await supabaseEnhanced.activity.logActivity({
          activity_type: 'agent_approved',
          description: `Agent approved: ${data.company_name}`,
          entity_type: 'agent',
          entity_id: agentId,
        });

        // Send notification to agent
        const agent = await supabaseEnhanced.agents.getAgent(agentId);
        if (agent.data?.user) {
          await supabaseEnhanced.notifications.sendNotification({
            recipient_id: agent.data.user.id,
            title: 'Agent Application Approved',
            message: 'Your agent application has been approved! You can now start creating packages.',
            related_type: 'agent',
            related_id: agentId,
            action_url: '/agent-dashboard',
          });
        }
      }

      return { data, error };
    },

    async rejectAgent(agentId: string, reason: string) {
      const { data, error } = await supabase
        .from('agents')
        .update({
          status: 'rejected',
          rejection_reason: reason,
        })
        .eq('id', agentId)
        .select()
        .single();

      if (!error) {
        // Log activity
        await supabaseEnhanced.activity.logActivity({
          activity_type: 'agent_rejected',
          description: `Agent rejected: ${data.company_name}`,
          entity_type: 'agent',
          entity_id: agentId,
          metadata: { reason },
        });
      }

      return { data, error };
    },
  },

  // Package management
  packages: {
    async getPackage(packageId: string) {
      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          agent:agents(*),
          bookings(*)
        `)
        .eq('id', packageId)
        .single();
      return { data, error };
    },

    async getAllPackages(filters?: any) {
      let query = supabase
        .from('packages')
        .select(`
          *,
          agent:agents(company_name, user:users(name, email)),
          bookings(count)
        `);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.agent_id) {
        query = query.eq('agent_id', filters.agent_id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      return { data, error };
    },

    async approvePackage(packageId: string, approvedBy: string) {
      const { data, error } = await supabase
        .from('packages')
        .update({
          status: 'approved',
          approved_by: approvedBy,
          approved_at: new Date().toISOString(),
        })
        .eq('id', packageId)
        .select()
        .single();

      if (!error) {
        // Log activity
        await supabaseEnhanced.activity.logActivity({
          activity_type: 'package_approved',
          description: `Package approved: ${data.title}`,
          entity_type: 'package',
          entity_id: packageId,
        });
      }

      return { data, error };
    },
  },

  // Booking management
  bookings: {
    async getBooking(bookingId: string) {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          package:packages(*),
          customer:users(*),
          agent:agents(*)
        `)
        .eq('id', bookingId)
        .single();
      return { data, error };
    },

    async getAllBookings(filters?: any) {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          package:packages(title, price),
          customer:users(name, email),
          agent:agents(company_name)
        `);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.agent_id) {
        query = query.eq('agent_id', filters.agent_id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      return { data, error };
    },

    async updateBookingStatus(bookingId: string, status: string) {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .select()
        .single();

      if (!error) {
        // Log activity
        await supabaseEnhanced.activity.logActivity({
          activity_type: `booking_${status}`,
          description: `Booking ${status}: ${data.booking_id}`,
          entity_type: 'booking',
          entity_id: bookingId,
        });
      }

      return { data, error };
    },
  },

  // Notification system
  notifications: {
    async sendNotification({
      recipient_id,
      title,
      message,
      related_type,
      related_id,
      action_url,
    }: {
      recipient_id: string;
      title: string;
      message: string;
      related_type?: string;
      related_id?: string;
      action_url?: string;
    }) {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          recipient_id,
          sender_id: user?.id,
          title,
          message,
          related_type,
          related_id,
          action_url,
          status: 'unread',
        })
        .select()
        .single();

      return { data, error };
    },

    async getNotifications(userId: string, limit = 50) {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          sender:users(name, email)
        `)
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      return { data, error };
    },

    async markAsRead(notificationId: string) {
      const { data, error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('id', notificationId)
        .select()
        .single();

      return { data, error };
    },

    async markAllAsRead(userId: string) {
      const { data, error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('recipient_id', userId)
        .eq('status', 'unread');

      return { data, error };
    },

    // Real-time notification subscription
    subscribeToNotifications(userId: string, callback: (notification: any) => void) {
      return supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `recipient_id=eq.${userId}`,
          },
          callback
        )
        .subscribe();
    },
  },

  // Activity logging
  activity: {
    async logActivity({
      activity_type,
      description,
      entity_type,
      entity_id,
      metadata,
    }: {
      activity_type: string;
      description: string;
      entity_type?: string;
      entity_id?: string;
      metadata?: any;
    }) {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: user?.id,
          activity_type: activity_type as any,
          description,
          entity_type,
          entity_id,
          metadata,
        })
        .select()
        .single();

      return { data, error };
    },

    async getActivityLogs(filters?: any, limit = 100) {
      let query = supabase
        .from('activity_logs')
        .select(`
          *,
          user:users(name, email, role)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (filters?.user_id) {
        query = query.eq('user_id', filters.user_id);
      }

      if (filters?.activity_type) {
        query = query.eq('activity_type', filters.activity_type);
      }

      if (filters?.entity_type) {
        query = query.eq('entity_type', filters.entity_type);
      }

      const { data, error } = await query;
      return { data, error };
    },

    // Real-time activity subscription
    subscribeToActivity(callback: (activity: any) => void) {
      return supabase
        .channel('activity_logs')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'activity_logs',
          },
          callback
        )
        .subscribe();
    },
  },

  // Analytics and reporting
  analytics: {
    async getOverviewStats() {
      const [
        { count: totalUsers },
        { count: totalAgents },
        { count: totalPackages },
        { count: totalBookings },
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('agents').select('*', { count: 'exact', head: true }),
        supabase.from('packages').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
      ]);

      return {
        totalUsers: totalUsers || 0,
        totalAgents: totalAgents || 0,
        totalPackages: totalPackages || 0,
        totalBookings: totalBookings || 0,
      };
    },

    async getRevenueData(startDate?: string, endDate?: string) {
      let query = supabase
        .from('bookings')
        .select('total_amount, created_at, status')
        .eq('status', 'confirmed');

      if (startDate) {
        query = query.gte('created_at', startDate);
      }

      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      const { data, error } = await query;
      return { data, error };
    },

    async getTopPerformingAgents(limit = 10) {
      const { data, error } = await supabase
        .from('agents')
        .select(`
          *,
          user:users(name, email),
          bookings(total_amount, status)
        `)
        .eq('status', 'approved')
        .limit(limit);

      return { data, error };
    },
  },

  // Real-time subscriptions
  realtime: {
    subscribeToTable(table: string, callback: (payload: any) => void) {
      return supabase
        .channel(`${table}_changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
          },
          callback
        )
        .subscribe();
    },

    unsubscribe(channel: any) {
      return supabase.removeChannel(channel);
    },
  },

  // File storage
  storage: {
    async uploadFile(bucket: string, path: string, file: File) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file);
      return { data, error };
    },

    async downloadFile(bucket: string, path: string) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);
      return { data, error };
    },

    async deleteFile(bucket: string, path: string) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove([path]);
      return { data, error };
    },

    getPublicUrl(bucket: string, path: string) {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
      return data.publicUrl;
    },
  },
};

export default supabaseEnhanced;
