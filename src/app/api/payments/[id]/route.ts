import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

// Update payment status
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const paymentId = parseInt(params.id);
        const body = await request.json();
        const { payment_status, payment_date } = body;

        const updateData: Record<string, any> = {};

        if (payment_status) {
            updateData.payment_status = payment_status;
        }

        if (payment_status === 'paid') {
            updateData.payment_date = payment_date || new Date().toISOString().split('T')[0];
        }

        const { error } = await supabase
            .from('Payment')
            .update(updateData)
            .eq('P_id', paymentId);

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            message: 'Payment updated successfully'
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update payment'
        }, { status: 500 });
    }
}
