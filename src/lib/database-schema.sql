-- Database Schema for Customer, Agent, and Super Admin Workflows
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User roles enum
CREATE TYPE user_role AS ENUM ('customer', 'agent', 'super_admin');

-- Status enums
CREATE TYPE agent_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE package_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'archived');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE notification_status AS ENUM ('unread', 'read');
CREATE TYPE activity_type AS ENUM ('registration', 'login', 'package_created', 'package_approved', 'package_rejected', 'booking_created', 'booking_confirmed', 'booking_cancelled', 'agent_approved', 'agent_rejected', 'message_sent');

-- Users table (extended from basic auth)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    role user_role DEFAULT 'customer',
    phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agents table (extended profile for agents)
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    company_address TEXT,
    license_number VARCHAR(100),
    business_type VARCHAR(100),
    status agent_status DEFAULT 'pending',
    approved_by UUID REFERENCES public.users(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    documents JSONB, -- Store document URLs
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Packages table
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_days INTEGER,
    location VARCHAR(255),
    images JSONB, -- Array of image URLs
    itinerary JSONB, -- Detailed itinerary
    inclusions TEXT[],
    exclusions TEXT[],
    status package_status DEFAULT 'draft',
    approved_by UUID REFERENCES public.users(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    max_bookings INTEGER DEFAULT 100,
    current_bookings INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id VARCHAR(20) UNIQUE NOT NULL, -- Human readable booking ID
    package_id UUID REFERENCES public.packages(id) ON DELETE RESTRICT,
    customer_id UUID REFERENCES public.users(id) ON DELETE RESTRICT,
    agent_id UUID REFERENCES public.agents(id) ON DELETE RESTRICT,
    
    -- Personal Information
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    
    -- Travel Details
    travel_date DATE NOT NULL,
    number_of_travelers INTEGER NOT NULL,
    special_requests TEXT,
    
    -- Emergency Contact
    emergency_name VARCHAR(255),
    emergency_phone VARCHAR(20),
    emergency_relation VARCHAR(100),
    
    -- Pricing
    base_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    
    status booking_status DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_id VARCHAR(255),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    recipient_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status notification_status DEFAULT 'unread',
    related_type VARCHAR(50), -- 'booking', 'package', 'agent', etc.
    related_id UUID, -- ID of related entity
    action_url VARCHAR(500), -- URL for call-to-action
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table (for agent-customer communication)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id) ON DELETE RESTRICT,
    recipient_id UUID REFERENCES public.users(id) ON DELETE RESTRICT,
    message TEXT NOT NULL,
    attachments JSONB, -- File URLs
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity logs table (for auditing)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    activity_type activity_type NOT NULL,
    description TEXT NOT NULL,
    entity_type VARCHAR(50), -- 'package', 'booking', 'agent', etc.
    entity_id UUID,
    metadata JSONB, -- Additional context data
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agents_status ON public.agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON public.agents(user_id);
CREATE INDEX IF NOT EXISTS idx_packages_status ON public.packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_agent_id ON public.packages(agent_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_agent_id ON public.bookings(agent_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);
CREATE INDEX IF NOT EXISTS idx_messages_booking_id ON public.messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate booking ID function
CREATE OR REPLACE FUNCTION generate_booking_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.booking_id = 'BK' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply booking ID trigger
CREATE TRIGGER generate_booking_id_trigger BEFORE INSERT ON public.bookings FOR EACH ROW EXECUTE FUNCTION generate_booking_id();
