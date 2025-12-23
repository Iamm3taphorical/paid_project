import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Update payment (primarily for changing status to paid)
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const paymentId = params.id;
        const body = await request.json();
        const { payment_status, payment_date, method } = body;

        const updates: string[] = [];
        const values: any[] = [];

        if (payment_status !== undefined) {
            updates.push('payment_status = ?');
            values.push(payment_status);

            // Auto-set payment_date when marking as paid
            if (payment_status === 'paid' && !payment_date) {
                updates.push('payment_date = CURDATE()');
            }
        }

        if (payment_date !== undefined) {
            updates.push('payment_date = ?');
            values.push(payment_date);
        }

        if (method !== undefined) {
            updates.push('method = ?');
            values.push(method);
        }

        if (updates.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'No fields to update'
            }, { status: 400 });
        }

        values.push(paymentId);
        await query(
            `UPDATE Payment SET ${updates.join(', ')} WHERE P_id = ?`,
            values
        );

        return NextResponse.json({
            success: true,
            message: 'Payment updated successfully'
        });
    } catch (error) {
        console.error('Update payment failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update payment'
        }, { status: 500 });
    }
}
