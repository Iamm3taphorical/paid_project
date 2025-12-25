import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
    try {
        // Get job counts by status
        const { data: jobs, error: jobError } = await supabase
            .from('Job')
            .select('status');

        if (jobError) {
            throw jobError;
        }

        // Get pending payments count
        const { data: pendingPayments, error: payError } = await supabase
            .from('Payment')
            .select('P_id')
            .eq('payment_status', 'pending');

        if (payError) {
            throw payError;
        }

        // Count by status
        const ongoing = (jobs || []).filter((j: any) => j.status === 'ongoing').length;
        const completed = (jobs || []).filter((j: any) => j.status === 'completed').length;
        const cancelled = (jobs || []).filter((j: any) => j.status === 'cancelled').length;

        return NextResponse.json({
            success: true,
            data: {
                ongoing_count: ongoing,
                completed_count: completed,
                cancelled_count: cancelled,
                pending_payments: (pendingPayments || []).length
            }
        });
    } catch (error) {
        console.error('Workload status query failed:', error);
        return NextResponse.json({
            success: true,
            data: {
                ongoing_count: 0,
                completed_count: 0,
                cancelled_count: 0,
                pending_payments: 0
            }
        });
    }
}
