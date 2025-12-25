import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
    try {
        // Get customers with their payment history
        const { data: customers, error: custError } = await supabase
            .from('User')
            .select('id, name')
            .eq('user_type', 'customer');

        if (custError) {
            throw custError;
        }

        // Get all payments with their job relationships
        const { data: payments, error: payError } = await supabase
            .from('Payment')
            .select('P_id, payment_status, due_date, payment_date');

        if (payError) {
            throw payError;
        }

        // Get job-payment and job-customer relationships
        const { data: involves } = await supabase.from('Involves').select('J_id, P_id');
        const { data: requests } = await supabase.from('Requests').select('customer_id, J_id');

        // Calculate reliability per customer
        const reliabilityData = (customers || []).map((customer: any) => {
            // Get jobs for this customer
            const customerJobs = (requests || [])
                .filter((r: any) => r.customer_id === customer.id)
                .map((r: any) => r.J_id);

            // Get payments for these jobs
            const customerPaymentIds = (involves || [])
                .filter((i: any) => customerJobs.includes(i.J_id))
                .map((i: any) => i.P_id);

            const customerPayments = (payments || [])
                .filter((p: any) => customerPaymentIds.includes(p.P_id));

            const totalPayments = customerPayments.length;
            const onTimePayments = customerPayments.filter((p: any) => {
                if (p.payment_status !== 'paid' || !p.payment_date) return false;
                return new Date(p.payment_date) <= new Date(p.due_date);
            }).length;

            const reliabilityScore = totalPayments > 0
                ? Math.round((onTimePayments / totalPayments) * 100)
                : 100;

            return {
                id: customer.id,
                name: customer.name,
                reliability_score: reliabilityScore,
                total_payments: totalPayments,
                on_time_payments: onTimePayments
            };
        });

        return NextResponse.json({
            success: true,
            data: reliabilityData.filter((c: any) => c.total_payments > 0)
        });
    } catch (error) {
        console.error('Client reliability query failed:', error);
        return NextResponse.json({
            success: true,
            data: []
        });
    }
}
