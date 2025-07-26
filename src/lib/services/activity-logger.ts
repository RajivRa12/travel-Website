import { supabaseHelpers } from '@/lib/supabaseClient';
import { ActivityType } from '@/lib/types/database';

export interface ActivityLogEntry {
  activity_type: ActivityType;
  description: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: any;
  ip_address?: string;
  user_agent?: string;
}

class ActivityLogger {
  private static instance: ActivityLogger;

  private constructor() {}

  public static getInstance(): ActivityLogger {
    if (!ActivityLogger.instance) {
      ActivityLogger.instance = new ActivityLogger();
    }
    return ActivityLogger.instance;
  }

  async log(entry: ActivityLogEntry): Promise<void> {
    try {
      await supabaseHelpers.logActivity(entry);
    } catch (error) {
      console.error('Failed to log activity:', error);
      // Don't throw here to avoid breaking main functionality
    }
  }

  // Convenience methods for common activities
  async logRegistration(userId: string, userType: 'customer' | 'agent', metadata?: any): Promise<void> {
    await this.log({
      activity_type: 'registration',
      description: `New ${userType} registration`,
      entity_type: 'user',
      entity_id: userId,
      metadata: { user_type: userType, ...metadata }
    });
  }

  async logLogin(userId: string, userType: string, metadata?: any): Promise<void> {
    await this.log({
      activity_type: 'login',
      description: `${userType} logged in`,
      entity_type: 'user',
      entity_id: userId,
      metadata: { user_type: userType, ...metadata }
    });
  }

  async logPackageCreated(packageId: string, agentId: string, packageTitle: string): Promise<void> {
    await this.log({
      activity_type: 'package_created',
      description: `New package created: ${packageTitle}`,
      entity_type: 'package',
      entity_id: packageId,
      metadata: { agent_id: agentId, package_title: packageTitle }
    });
  }

  async logPackageApproved(packageId: string, packageTitle: string, approvedBy: string): Promise<void> {
    await this.log({
      activity_type: 'package_approved',
      description: `Package approved: ${packageTitle}`,
      entity_type: 'package',
      entity_id: packageId,
      metadata: { package_title: packageTitle, approved_by: approvedBy }
    });
  }

  async logPackageRejected(packageId: string, packageTitle: string, rejectedBy: string, reason: string): Promise<void> {
    await this.log({
      activity_type: 'package_rejected',
      description: `Package rejected: ${packageTitle}`,
      entity_type: 'package',
      entity_id: packageId,
      metadata: { 
        package_title: packageTitle, 
        rejected_by: rejectedBy, 
        rejection_reason: reason 
      }
    });
  }

  async logBookingCreated(bookingId: string, packageId: string, customerId: string, agentId: string, amount: number): Promise<void> {
    await this.log({
      activity_type: 'booking_created',
      description: `New booking created`,
      entity_type: 'booking',
      entity_id: bookingId,
      metadata: { 
        package_id: packageId, 
        customer_id: customerId, 
        agent_id: agentId, 
        amount 
      }
    });
  }

  async logBookingConfirmed(bookingId: string, confirmedBy: string): Promise<void> {
    await this.log({
      activity_type: 'booking_confirmed',
      description: `Booking confirmed`,
      entity_type: 'booking',
      entity_id: bookingId,
      metadata: { confirmed_by: confirmedBy }
    });
  }

  async logBookingCancelled(bookingId: string, cancelledBy: string, reason?: string): Promise<void> {
    await this.log({
      activity_type: 'booking_cancelled',
      description: `Booking cancelled`,
      entity_type: 'booking',
      entity_id: bookingId,
      metadata: { cancelled_by: cancelledBy, reason }
    });
  }

  async logAgentApproved(agentId: string, companyName: string, approvedBy: string): Promise<void> {
    await this.log({
      activity_type: 'agent_approved',
      description: `Agent approved: ${companyName}`,
      entity_type: 'agent',
      entity_id: agentId,
      metadata: { company_name: companyName, approved_by: approvedBy }
    });
  }

  async logAgentRejected(agentId: string, companyName: string, rejectedBy: string, reason: string): Promise<void> {
    await this.log({
      activity_type: 'agent_rejected',
      description: `Agent rejected: ${companyName}`,
      entity_type: 'agent',
      entity_id: agentId,
      metadata: { 
        company_name: companyName, 
        rejected_by: rejectedBy, 
        rejection_reason: reason 
      }
    });
  }

  async logMessageSent(messageId: string, senderId: string, recipientId: string, bookingId: string): Promise<void> {
    await this.log({
      activity_type: 'message_sent',
      description: `Message sent`,
      entity_type: 'message',
      entity_id: messageId,
      metadata: { 
        sender_id: senderId, 
        recipient_id: recipientId, 
        booking_id: bookingId 
      }
    });
  }

  // Get activity logs with filtering
  async getActivityLogs(filters: {
    user_id?: string;
    activity_type?: ActivityType;
    entity_type?: string;
    entity_id?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
  } = {}) {
    // This would typically use the Supabase client to fetch logs
    // Implementation depends on your specific querying needs
    return [];
  }

  // Get audit trail for specific entity
  async getEntityAuditTrail(entityType: string, entityId: string) {
    return this.getActivityLogs({
      entity_type: entityType,
      entity_id: entityId
    });
  }
}

// Export singleton instance
export const activityLogger = ActivityLogger.getInstance();

// Helper function to log activities with request context
export const logWithContext = async (
  entry: ActivityLogEntry,
  request?: Request
): Promise<void> => {
  const enhancedEntry = { ...entry };

  if (request) {
    // Extract IP address and user agent from request
    enhancedEntry.ip_address = request.headers.get('x-forwarded-for') || 
                              request.headers.get('x-real-ip') || 
                              'unknown';
    enhancedEntry.user_agent = request.headers.get('user-agent') || 'unknown';
  }

  await activityLogger.log(enhancedEntry);
};
