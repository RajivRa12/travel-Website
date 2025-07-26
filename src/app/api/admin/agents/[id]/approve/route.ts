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

    // Update agent status
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

    const { data: agent, error } = await supabase
      .from('agents')
      .update(updateData)
      .eq('id', id)
      .select('*, user:users(*)')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send notification to agent
    await supabaseHelpers.sendNotification({
      recipient_id: agent.user_id,
      title: action === 'approve' ? 'Agent Registration Approved' : 'Agent Registration Rejected',
      message: action === 'approve' 
        ? 'Congratulations! Your agent registration has been approved. You can now start creating packages and managing bookings.'
        : `Your agent registration has been rejected. Reason: ${rejection_reason}`,
      related_type: 'agent',
      related_id: id,
      action_url: '/agent-dashboard'
    });

    // Log activity
    await supabaseHelpers.logActivity({
      activity_type: action === 'approve' ? 'agent_approved' : 'agent_rejected',
      description: `Agent ${agent.company_name} has been ${action}d`,
      entity_type: 'agent',
      entity_id: id,
      metadata: { rejection_reason }
    });

    return NextResponse.json({ 
      success: true, 
      agent,
      message: `Agent ${action}d successfully` 
    });

  } catch (error) {
    console.error('Agent approval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
