-- Row Level Security Policies for Access Control
-- Run this after creating the tables

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Super admins can read all users
CREATE POLICY "Super admins can read all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Super admins can update all users
CREATE POLICY "Super admins can update all users" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Agents table policies
-- Agents can read their own profile
CREATE POLICY "Agents can read own profile" ON public.agents
    FOR SELECT USING (user_id = auth.uid());

-- Agents can update their own profile (when pending or approved)
CREATE POLICY "Agents can update own profile" ON public.agents
    FOR UPDATE USING (
        user_id = auth.uid() AND 
        status IN ('pending', 'approved')
    );

-- Super admins can read all agents
CREATE POLICY "Super admins can read all agents" ON public.agents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Super admins can update all agents
CREATE POLICY "Super admins can update all agents" ON public.agents
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Customers can read approved agents
CREATE POLICY "Customers can read approved agents" ON public.agents
    FOR SELECT USING (
        status = 'approved' AND
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'customer'
        )
    );

-- Packages table policies
-- Agents can read their own packages
CREATE POLICY "Agents can read own packages" ON public.packages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.agents 
            WHERE id = agent_id AND user_id = auth.uid()
        )
    );

-- Agents can create packages
CREATE POLICY "Agents can create packages" ON public.packages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.agents 
            WHERE id = agent_id AND user_id = auth.uid() AND status = 'approved'
        )
    );

-- Agents can update their own packages (when not rejected)
CREATE POLICY "Agents can update own packages" ON public.packages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.agents 
            WHERE id = agent_id AND user_id = auth.uid()
        ) AND status != 'rejected'
    );

-- Customers can read approved packages
CREATE POLICY "Customers can read approved packages" ON public.packages
    FOR SELECT USING (
        status = 'approved' AND
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'customer'
        )
    );

-- Super admins can read all packages
CREATE POLICY "Super admins can read all packages" ON public.packages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Super admins can update all packages
CREATE POLICY "Super admins can update all packages" ON public.packages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Bookings table policies
-- Customers can read their own bookings
CREATE POLICY "Customers can read own bookings" ON public.bookings
    FOR SELECT USING (customer_id = auth.uid());

-- Customers can create bookings
CREATE POLICY "Customers can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (customer_id = auth.uid());

-- Agents can read bookings for their packages
CREATE POLICY "Agents can read own package bookings" ON public.bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.agents 
            WHERE id = agent_id AND user_id = auth.uid()
        )
    );

-- Agents can update bookings for their packages
CREATE POLICY "Agents can update own package bookings" ON public.bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.agents 
            WHERE id = agent_id AND user_id = auth.uid()
        )
    );

-- Super admins can read all bookings
CREATE POLICY "Super admins can read all bookings" ON public.bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Super admins can update all bookings
CREATE POLICY "Super admins can update all bookings" ON public.bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Notifications table policies
-- Users can read their own notifications
CREATE POLICY "Users can read own notifications" ON public.notifications
    FOR SELECT USING (recipient_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (recipient_id = auth.uid());

-- System can create notifications for any user
CREATE POLICY "System can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- Messages table policies
-- Users can read messages for their bookings
CREATE POLICY "Users can read own booking messages" ON public.messages
    FOR SELECT USING (
        sender_id = auth.uid() OR recipient_id = auth.uid()
    );

-- Users can create messages for their bookings
CREATE POLICY "Users can create messages" ON public.messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        (
            -- Customer can message agent for their booking
            (EXISTS (
                SELECT 1 FROM public.bookings 
                WHERE id = booking_id AND customer_id = auth.uid()
            )) OR
            -- Agent can message customer for their booking
            (EXISTS (
                SELECT 1 FROM public.bookings b
                INNER JOIN public.agents a ON b.agent_id = a.id
                WHERE b.id = booking_id AND a.user_id = auth.uid()
            ))
        )
    );

-- Super admins can read all messages
CREATE POLICY "Super admins can read all messages" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Activity logs table policies
-- Super admins can read all activity logs
CREATE POLICY "Super admins can read all activity logs" ON public.activity_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- System can create activity logs
CREATE POLICY "System can create activity logs" ON public.activity_logs
    FOR INSERT WITH CHECK (true);

-- Users can read their own activity logs
CREATE POLICY "Users can read own activity logs" ON public.activity_logs
    FOR SELECT USING (user_id = auth.uid());
