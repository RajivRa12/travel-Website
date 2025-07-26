# Customer, Agent, and Super Admin Workflow Integration Guide

This guide covers the complete integration of Customer, Agent, and Super Admin workflows with proper access control, notifications, and approval systems.

## 🗂️ Database Schema Overview

### Core Tables
- **users**: Base user accounts with roles (customer, agent, super_admin)
- **agents**: Extended agent profiles with approval status
- **packages**: Travel packages with approval workflow
- **bookings**: Customer bookings with agent assignments
- **notifications**: Real-time notification system
- **messages**: Agent-customer communication
- **activity_logs**: Complete audit trail

### Key Status Enums
- **Agent Status**: `pending`, `approved`, `rejected`, `suspended`
- **Package Status**: `draft`, `pending`, `approved`, `rejected`, `archived`
- **Booking Status**: `pending`, `confirmed`, `cancelled`, `completed`

## 🔧 Setup Instructions

### 1. Database Setup
```sql
-- Run these SQL files in your Supabase SQL editor:
-- 1. src/lib/database-schema.sql (creates tables and triggers)
-- 2. src/lib/database-policies.sql (sets up Row Level Security)
```

### 2. Environment Variables
Ensure your Supabase environment variables are configured:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies
```bash
npm install @supabase/supabase-js date-fns
```

## 🎯 Workflow Features

### Customer Workflow
1. **Registration & Login**: Standard authentication
2. **Package Browsing**: View only approved packages
3. **Booking Creation**: Automatic agent notification
4. **Booking Management**: Track status and communicate with agents

### Agent Workflow
1. **Registration**: Multi-step registration with pending status
2. **Approval Process**: Super Admin review required
3. **Package Management**: Create packages requiring approval
4. **Booking Management**: Receive and manage customer bookings
5. **Restrictions**: Limited access until approved

### Super Admin Workflow
1. **Agent Approval**: Review and approve/reject agent registrations
2. **Package Moderation**: Approve/reject package submissions
3. **System Monitoring**: View all activities and audit logs
4. **Dispute Resolution**: Access to all bookings and communications

## 🔐 Access Control

### Role-Based Permissions
- **Customers**: Own bookings and approved packages only
- **Agents**: Own packages/bookings, approved status required
- **Super Admins**: Full system access

### Row Level Security (RLS)
All tables have RLS policies enforcing proper access control:
- Users can only access their own data
- Agents can only access their packages/bookings
- Super admins have unrestricted access

## 📋 API Endpoints

### Agent Approval
```typescript
PATCH /api/admin/agents/[id]/approve
Body: { action: 'approve' | 'reject', rejection_reason?: string }
```

### Package Approval
```typescript
PATCH /api/admin/packages/[id]/approve
Body: { action: 'approve' | 'reject', rejection_reason?: string }
```

### Bookings
```typescript
POST /api/bookings
GET /api/bookings?status=pending&agent_id=xxx
```

## 📱 UI Components

### Agent Status Banner
Shows current approval status and restrictions:
```tsx
import { AgentStatusBanner } from '@/components/agent/agent-status-banner';

// Use in agent dashboard pages
<AgentStatusBanner />
```

### Notification System
Real-time notifications with Supabase subscriptions:
```tsx
import { NotificationProvider } from '@/components/notifications/notification-provider';
import { NotificationDropdown } from '@/components/notifications/notification-dropdown';

// Wrap your app
<NotificationProvider>
  <YourApp />
</NotificationProvider>

// Add notification bell
<NotificationDropdown />
```

### Super Admin Interfaces
- Agent approval: `/superadmin/agents/approval`
- Package approval: `/superadmin/packages/approval`

## 🔄 Key Workflows

### 1. Agent Registration Flow
1. Agent fills registration modal
2. Account created with `pending` status
3. Super Admin receives notification
4. Super Admin reviews and approves/rejects
5. Agent receives notification of decision
6. Approved agents gain full access

### 2. Package Creation Flow
1. Approved agent creates package
2. Package saved as `pending` status
3. Super Admin receives notification
4. Super Admin reviews and approves/rejects
5. Agent receives notification
6. Approved packages become visible to customers

### 3. Booking Flow
1. Customer creates booking
2. Agent and customer receive notifications
3. Agent can manage booking status
4. All activity is logged for audit

### 4. Activity Logging
All major actions are automatically logged:
```typescript
import { activityLogger } from '@/lib/services/activity-logger';

// Log custom activities
await activityLogger.logPackageCreated(packageId, agentId, title);
```

## 🛡️ Security Features

### Authentication Middleware
```typescript
import { requireSuperAdmin, requireAgent } from '@/lib/middleware/auth';

// Protect API routes
export const POST = requireSuperAdmin(async (request, context) => {
  // Super admin only logic
});
```

### Client-Side Protection
```typescript
import { clientAuth } from '@/lib/middleware/auth';

// Check permissions in components
if (!clientAuth.hasRole('super_admin')) {
  return <UnauthorizedComponent />;
}
```

## 📊 Monitoring & Auditing

### Activity Logs
All actions are logged with:
- User who performed the action
- Action type and description
- Entity affected
- Metadata and context
- IP address and user agent

### Notification System
- Real-time notifications for all stakeholders
- Toast notifications for immediate feedback
- Email notifications (can be added)
- Action buttons for quick responses

## 🚀 Testing the Integration

### Test Scenarios
1. **Agent Registration**: Complete flow from registration to approval
2. **Package Approval**: Create and approve/reject packages
3. **Booking Flow**: End-to-end customer booking with agent notification
4. **Access Control**: Verify restricted access for pending agents
5. **Real-time Updates**: Test notification delivery

### Test Users
Create test accounts for each role:
```sql
-- Insert test super admin
INSERT INTO users (email, name, role) VALUES ('admin@test.com', 'Test Admin', 'super_admin');

-- Test with pending agent registration
-- Test with approved agent creating packages
-- Test with customer making bookings
```

## 🔧 Configuration Options

### Notification Settings
Customize notification behavior in the NotificationProvider component.

### Activity Logging
Configure which activities to log in the activity-logger service.

### Access Control
Modify RLS policies for custom permission requirements.

## 📚 Additional Resources

### Supabase Features Used
- **Row Level Security**: Database-level access control
- **Real-time Subscriptions**: Live notification delivery
- **Triggers**: Automatic activity logging
- **Functions**: Custom business logic

### Best Practices
1. Always use typed interfaces for database operations
2. Log all significant user actions
3. Send notifications for workflow state changes
4. Implement proper error handling
5. Use middleware for consistent access control

## 🐛 Troubleshooting

### Common Issues
1. **RLS Policies**: Ensure policies match your user roles
2. **Real-time Subscriptions**: Check Supabase connection
3. **Activity Logging**: Verify trigger functions are working
4. **Notifications**: Test notification delivery channels

### Debug Tools
- Supabase dashboard for database inspection
- Browser dev tools for real-time subscriptions
- Activity logs table for audit trail
- Notification table for delivery status

This integration provides a complete workflow management system with proper access control, real-time notifications, and comprehensive auditing for your travel booking platform.
