import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
    try {
        // Get payments due within 7 days
        const today = new Date();
        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);

        const { data: payments, error } = await supabase
            .from('Payment')
            .select('*')
            .in('payment_status', ['pending', 'overdue'])
            .lte('due_date', weekFromNow.toISOString().split('T')[0])
            .order('due_date', { ascending: true });

        if (error) {
            throw error;
        }

        // Add alert level
        const alertsWithLevel = (payments || []).map((p: any) => {
            const dueDate = new Date(p.due_date);
            const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            let alert_level = 'normal';
            if (daysUntilDue < 0) alert_level = 'critical';
            else if (daysUntilDue <= 3) alert_level = 'warning';

            return { ...p, days_until_due: daysUntilDue, alert_level };
        });

        return NextResponse.json({
            success: true,
            data: alertsWithLevel
        });
    } catch (error) {
        console.error('Payment alerts query failed:', error);
        return NextResponse.json({
            success: true,
            data: []
        });
    }
}
