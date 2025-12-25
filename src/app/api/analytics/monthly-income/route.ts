import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
    try {
        // Get all paid payments and group by month
        const { data: payments, error } = await supabase
            .from('Payment')
            .select('amount, payment_date')
            .eq('payment_status', 'paid')
            .not('payment_date', 'is', null);

        if (error) {
            throw error;
        }

        // Group by year and month
        const monthlyTotals: Record<string, { year: number; month: number; total_income: number }> = {};

        (payments || []).forEach((p: any) => {
            if (p.payment_date) {
                const date = new Date(p.payment_date);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const key = `${year}-${month}`;

                if (!monthlyTotals[key]) {
                    monthlyTotals[key] = { year, month, total_income: 0 };
                }
                monthlyTotals[key].total_income += parseFloat(p.amount) || 0;
            }
        });

        const results = Object.values(monthlyTotals)
            .sort((a, b) => (b.year - a.year) || (b.month - a.month));

        return NextResponse.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Monthly income query failed:', error);
        return NextResponse.json({
            success: true,
            data: []
        });
    }
}
