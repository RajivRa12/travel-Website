import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseHelpers } from '@/lib/supabaseClient';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { action, rejection_reason } = await request.json();

    // Verify user is super admin
    const currentUser = await supabaseHelpers.getCurrentUser();
    if (!currentUser || currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update package status
    const updateData: any = {
      approved_by: currentUser.id,
      approved_at: new Date().toISOString()
    };

    if (action === 'approve') {
      updateData.status = 'approved';
    } else if (action === 'reject') {
      updateData.status = 'rejected';
      updateData.rejection_reason = rejection_reason;
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const { data: package_, error } = await supabase
      .from('packages')
      .update(updateData)
      .eq('id', id)
      .select('*, agent:agents(*, user:users(*))')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send notification to agent
    await supabaseHelpers.sendNotification({
      recipient_id: package_.agent.user_id,
      title: action === 'approve' ? 'Package Approved' : 'Package Rejected',
      message: action === 'approve' 
        ? `Your package "${package_.title}" has been approved and is now live for bookings.`
        : `Your package "${package_.title}" has been rejected. Reason: ${rejection_reason}`,
      related_type: 'package',
      related_id: id,
      action_url: `/agent-dashboard/packages/${id}`
    });

    // Log activity
    await supabaseHelpers.logActivity({
      activity_type: action === 'approve' ? 'package_approved' : 'package_rejected',
      description: `Package "${package_.title}" has been ${action}d`,
      entity_type: 'package',
      entity_id: id,
      metadata: { rejection_reason }
    });

    return NextResponse.json({ 
      success: true, 
      package: package_,
      message: `Package ${action}d successfully` 
    });

  } catch (error) {
    console.error('Package approval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
