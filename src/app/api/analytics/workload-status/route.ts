import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Feature 9: Workload Status Overview
// Summarizes counts of ongoing, completed, and payment-pending jobs
export async function GET() {
    try {
        const sql = `
            SELECT 
                SUM(CASE WHEN J.status = 'ongoing' THEN 1 ELSE 0 END) AS ongoing_count,
                SUM(CASE WHEN J.status = 'completed' THEN 1 ELSE 0 END) AS completed_count,
                SUM(CASE WHEN J.status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_count,
                (SELECT COUNT(*) FROM Payment WHERE payment_status = 'pending') AS pending_payments
            FROM Job J
        `;

        const results = await query(sql);

        return NextResponse.json({
            success: true,
            feature: 'Workload Status Overview',
            description: 'Summary of job statuses and pending payments',
            sql: sql.trim(),
            data: results[0] || {
                ongoing_count: 0,
                completed_count: 0,
                cancelled_count: 0,
                pending_payments: 0
            }
        });
    } catch (error) {
        console.error('Workload status query failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Database query failed'
        }, { status: 500 });
    }
}
