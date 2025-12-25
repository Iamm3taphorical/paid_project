import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

// Get all payments
export async function GET() {
    try {
        const { data: payments, error } = await supabase
            .from('Payment')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            data: payments || []
        });
    } catch (error) {
        console.error('Payments query failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Database query failed'
        }, { status: 500 });
    }
}
