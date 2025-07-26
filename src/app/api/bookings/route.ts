import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseHelpers } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();

    // Verify user is authenticated
    const currentUser = await supabaseHelpers.getCurrentUser();
    if (!currentUser || currentUser.role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get package and agent details
    const { data: package_, error: packageError } = await supabase
      .from('packages')
      .select('*, agent:agents(*, user:users(*))')
      .eq('id', bookingData.package_id)
      .single();

    if (packageError || !package_) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    // Check if package is approved
    if (package_.status !== 'approved') {
      return NextResponse.json({ error: 'Package is not available for booking' }, { status: 400 });
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        ...bookingData,
        customer_id: currentUser.id,
        agent_id: package_.agent_id,
        status: 'pending'
      })
      .select('*')
      .single();

    if (bookingError) {
      return NextResponse.json({ error: bookingError.message }, { status: 500 });
    }

    // Send notification to agent
    await supabaseHelpers.sendNotification({
      recipient_id: package_.agent.user_id,
      title: 'New Booking Received',
      message: `You have received a new booking for "${package_.title}" from ${bookingData.customer_name}.`,
      related_type: 'booking',
      related_id: booking.id,
      action_url: `/agent-dashboard/bookings/${booking.id}`
    });

    // Send confirmation notification to customer
    await supabaseHelpers.sendNotification({
      recipient_id: currentUser.id,
      title: 'Booking Confirmation',
      message: `Your booking for "${package_.title}" has been submitted successfully. Booking ID: ${booking.booking_id}`,
      related_type: 'booking',
      related_id: booking.id,
      action_url: `/my-trips`
    });

    // Log activity
    await supabaseHelpers.logActivity({
      activity_type: 'booking_created',
      description: `New booking created for package "${package_.title}"`,
      entity_type: 'booking',
      entity_id: booking.id,
      metadata: { 
        package_id: package_.id,
        agent_id: package_.agent_id,
        total_amount: bookingData.total_amount
      }
    });

    // Update package booking count
    await supabase
      .from('packages')
      .update({ 
        current_bookings: (package_.current_bookings || 0) + 1 
      })
      .eq('id', package_.id);

    return NextResponse.json({ 
      success: true, 
      booking,
      message: 'Booking created successfully' 
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const agentId = searchParams.get('agent_id');

    // Verify user is authenticated
    const currentUser = await supabaseHelpers.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    let query = supabase
      .from('bookings')
      .select('*, package:packages(*), customer:users(*), agent:agents(*, user:users(*))');

    // Apply filters based on user role
    if (currentUser.role === 'customer') {
      query = query.eq('customer_id', currentUser.id);
    } else if (currentUser.role === 'agent') {
      const agent = await supabaseHelpers.getCurrentAgent();
      if (!agent) {
        return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 });
      }
      query = query.eq('agent_id', agent.id);
    } else if (currentUser.role === 'super_admin') {
      // Super admin can see all bookings
      if (agentId) {
        query = query.eq('agent_id', agentId);
      }
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: bookings, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bookings });

  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
