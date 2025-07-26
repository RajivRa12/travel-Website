# Agent Dashboard Demo

## Overview

The Roam Southeast platform includes a comprehensive agent dashboard that allows travel agents and DMCs (Destination Management Companies) to manage their business operations.

## Demo Access

### Agent Login Credentials

**URL:** `/agent-login`

#### Demo Accounts Available:

1. **Trial Agent Account**
   - Email: `trial@agent.com`
   - Password: `trial123`
   - Plan: Trial (Free)
   - Features: 3 packages, 30 photos, basic support

2. **Growth Agent Account**
   - Email: `demo@agent.com`
   - Password: `demo123`
   - Plan: Growth (₹3,499/year)
   - Features: 25 packages, 250 photos, priority support, auto-publish

3. **Pro Agent Account**
   - Email: `pro@agent.com`
   - Password: `pro123`
   - Plan: Pro (₹9,999/year)
   - Features: Unlimited packages, unlimited photos, 24/7 support, custom branding

## Dashboard Features

### 1. **Registration Page**

- Complete agent onboarding form
- Company details, GSTIN, contact information
- Bank account setup for payouts
- Document upload (GSTIN certificate, PAN card, etc.)

### 2. **Subscription Management**

- View current plan and usage limits
- Upgrade/downgrade plans
- Stripe checkout integration (demo mode)
- Plan comparison with features

### 3. **Plan Limits Enforcement**

- Real-time usage tracking
- Package and photo limits based on plan
- Visual progress bars and warnings
- Upgrade prompts when near limits

### 4. **Package Management (CRUD)**

- Create new travel packages
- Rich form with all package details:
  - Title, slug, destination, duration
  - Pricing tiers (adult/child/infant)
  - Highlights, inclusions, exclusions
  - Detailed itinerary with markdown support
  - Image gallery (up to 10 photos)
  - PDF brochure upload
- Edit existing packages
- Delete packages
- Auto-publish toggle (plan-dependent)

### 5. **Booking Inbox**

- View all package bookings
- Customer details and contact information
- Booking status management (New, Confirmed, Completed, Cancelled)
- Payment tracking (total, paid, pending)
- Special requests from customers
- Filter and search functionality

### 6. **Payout Requests**

- View eligible bookings for payout
- Select multiple bookings for batch payout
- Request payout with admin notifications
- Track payout history and status
- Commission structure (15% platform fee)
- Minimum payout threshold (₹5,000)

### 7. **Analytics Dashboard**

- Key metrics overview:
  - Total views, enquiries, conversion rate
  - Revenue tracking with trends
- Package performance analysis
- Traffic source breakdown
- Monthly performance charts
- Insights and recommendations

## Technical Features

### Authentication

- Demo login system with session management
- Protected routes for agent dashboard
- Plan-based feature access control

### UI/UX

- Responsive design for all devices
- Professional color scheme and branding
- Intuitive navigation with vertical sidebar
- Progress indicators and status badges
- Real-time form validation

### Data Management

- Mock data for realistic demo experience
- Local storage for session persistence
- Form state management
- File upload placeholders

## Getting Started

1. **Access the main site:** `http://localhost:3000`
2. **Click "Agent Login"** in the header
3. **Use any demo credentials** to login
4. **Explore all 7 dashboard sections**

## Navigation

The agent dashboard uses a clean vertical navigation layout:

- **Overview** - Dashboard summary and quick actions
- **Registration** - Complete agent setup
- **Subscription** - Plan management
- **Package Management** - CRUD operations for packages
- **Booking Inbox** - Customer booking management
- **Payout Requests** - Financial transactions
- **Analytics** - Business performance metrics

## Notes

- All payment integrations are in demo mode
- File uploads are simulated (no actual file storage)
- Email notifications are logged to console
- Database operations use mock data
- Real-world implementation would require backend APIs

## Plan Limits

### Trial Plan (Free)

- 3 packages maximum
- 30 photos total
- 5 bookings per month
- Basic email support
- No auto-publishing

### Growth Plan (₹3,499/year)

- 25 packages maximum
- 250 photos total
- 50 bookings per month
- Priority email support
- Auto-publishing enabled
- Basic analytics

### Pro Plan (₹9,999/year)

- Unlimited packages
- Unlimited photos
- Unlimited bookings
- 24/7 phone & email support
- Auto-publishing enabled
- Advanced analytics
- Custom branding
- API access
- Dedicated account manager

---

This comprehensive agent dashboard provides everything needed for travel agents to manage their business operations on the Roam Southeast platform.
