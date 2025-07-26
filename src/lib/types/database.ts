// Database types for TypeScript support
export type UserRole = 'customer' | 'agent' | 'super_admin';
export type AgentStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type PackageStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type NotificationStatus = 'unread' | 'read';
export type ActivityType = 'registration' | 'login' | 'package_created' | 'package_approved' | 'package_rejected' | 'booking_created' | 'booking_confirmed' | 'booking_cancelled' | 'agent_approved' | 'agent_rejected' | 'message_sent';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: string;
  user_id: string;
  company_name: string;
  company_address?: string;
  license_number?: string;
  business_type?: string;
  status: AgentStatus;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  documents?: any;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Package {
  id: string;
  agent_id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  duration_days?: number;
  location?: string;
  images?: any;
  itinerary?: any;
  inclusions?: string[];
  exclusions?: string[];
  status: PackageStatus;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  max_bookings?: number;
  current_bookings?: number;
  created_at: string;
  updated_at: string;
  agent?: Agent;
}

export interface Booking {
  id: string;
  booking_id: string;
  package_id: string;
  customer_id: string;
  agent_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  travel_date: string;
  number_of_travelers: number;
  special_requests?: string;
  emergency_name?: string;
  emergency_phone?: string;
  emergency_relation?: string;
  base_price: number;
  total_amount: number;
  status: BookingStatus;
  payment_status?: string;
  payment_id?: string;
  created_at: string;
  updated_at: string;
  package?: Package;
  customer?: User;
  agent?: Agent;
}

export interface Notification {
  id: string;
  recipient_id: string;
  sender_id?: string;
  title: string;
  message: string;
  status: NotificationStatus;
  related_type?: string;
  related_id?: string;
  action_url?: string;
  created_at: string;
  sender?: User;
}

export interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  attachments?: any;
  read_at?: string;
  created_at: string;
  sender?: User;
  recipient?: User;
}

export interface ActivityLog {
  id: string;
  user_id?: string;
  activity_type: ActivityType;
  description: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user?: User;
}

// Database schema type
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      agents: {
        Row: Agent;
        Insert: Omit<Agent, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Agent, 'id' | 'created_at' | 'updated_at'>>;
      };
      packages: {
        Row: Package;
        Insert: Omit<Package, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Package, 'id' | 'created_at' | 'updated_at'>>;
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, 'id' | 'booking_id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Booking, 'id' | 'booking_id' | 'created_at' | 'updated_at'>>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at'>;
        Update: Partial<Omit<Notification, 'id' | 'created_at'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at'>;
        Update: Partial<Omit<Message, 'id' | 'created_at'>>;
      };
      activity_logs: {
        Row: ActivityLog;
        Insert: Omit<ActivityLog, 'id' | 'created_at'>;
        Update: Partial<Omit<ActivityLog, 'id' | 'created_at'>>;
      };
    };
  };
}
