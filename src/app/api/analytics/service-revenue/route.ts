import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
    try {
        // Get services
        const { data: services, error: svcError } = await supabase
            .from('Service')
            .select('S_id, name');

        if (svcError) {
            throw svcError;
        }

        // Get job-service relationships
        const { data: requires } = await supabase.from('Requires').select('J_id, S_id');

        // Get job-payment relationships
        const { data: involves } = await supabase.from('Involves').select('J_id, P_id');

        // Get paid payments
        const { data: payments } = await supabase
            .from('Payment')
            .select('P_id, amount')
            .eq('payment_status', 'paid');

        // Calculate revenue per service
        const revenueData = (services || []).map((service: any) => {
            // Get jobs for this service
            const serviceJobs = (requires || [])
                .filter((r: any) => r.S_id === service.S_id)
                .map((r: any) => r.J_id);

            // Get payment IDs for these jobs
            const paymentIds = (involves || [])
                .filter((i: any) => serviceJobs.includes(i.J_id))
                .map((i: any) => i.P_id);

            // Sum up the payments
            const totalRevenue = (payments || [])
                .filter((p: any) => paymentIds.includes(p.P_id))
                .reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);

            return {
                S_id: service.S_id,
                name: service.name,
                total_revenue: totalRevenue
            };
        }).sort((a: any, b: any) => b.total_revenue - a.total_revenue);

        return NextResponse.json({
            success: true,
            data: revenueData
        });
    } catch (error) {
        console.error('Service revenue query failed:', error);
        return NextResponse.json({
            success: true,
            data: []
        });
    }
}
