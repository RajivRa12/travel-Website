import { createClient } from '@supabase/supabase-js';
import { Database } from './types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions for common operations
export const supabaseHelpers = {
  // Get current user with role
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return userData;
  },

  // Get agent profile for current user
  async getCurrentAgent() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: agent } = await supabase
      .from('agents')
      .select('*, user:users(*)')
      .eq('user_id', user.id)
      .single();

    return agent;
  },

  // Check if user has permission for action
  async hasPermission(action: string, resourceId?: string) {
    const user = await this.getCurrentUser();
    if (!user) return false;

    // Super admin has all permissions
    if (user.role === 'super_admin') return true;

    // Add specific permission logic here
    return false;
  },

  // Log activity
  async logActivity({
    activity_type,
    description,
    entity_type,
    entity_id,
    metadata
  }: {
    activity_type: string;
    description: string;
    entity_type?: string;
    entity_id?: string;
    metadata?: any;
  }) {
    const { data: { user } } = await supabase.auth.getUser();

    return supabase.from('activity_logs').insert({
      user_id: user?.id,
      activity_type: activity_type as any,
      description,
      entity_type,
      entity_id,
      metadata
    });
  },

  // Send notification
  async sendNotification({
    recipient_id,
    title,
    message,
    related_type,
    related_id,
    action_url
  }: {
    recipient_id: string;
    title: string;
    message: string;
    related_type?: string;
    related_id?: string;
    action_url?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();

    return supabase.from('notifications').insert({
      recipient_id,
      sender_id: user?.id,
      title,
      message,
      related_type,
      related_id,
      action_url,
      status: 'unread'
    });
  }
};
