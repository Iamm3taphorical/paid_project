import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Feature 6: Revenue Breakdown by Service
// Joining services to jobs and payments and summing paid amounts
export async function GET() {
    try {
        const sql = `
            SELECT 
                S.S_id,
                S.name,
                S.description,
                COALESCE(SUM(P.amount), 0) AS total_revenue,
                COUNT(DISTINCT J.J_id) AS job_count
            FROM Service S
            LEFT JOIN Requires RQ ON S.S_id = RQ.S_id
            LEFT JOIN Job J ON RQ.J_id = J.J_id
            LEFT JOIN Involves I ON J.J_id = I.J_id
            LEFT JOIN Payment P ON I.P_id = P.P_id AND P.payment_status = 'paid'
            GROUP BY S.S_id, S.name, S.description
            ORDER BY total_revenue DESC
        `;

        const results = await query(sql);

        return NextResponse.json({
            success: true,
            feature: 'Revenue by Service',
            description: 'Total paid revenue grouped by service type',
            sql: sql.trim(),
            data: results
        });
    } catch (error) {
        console.error('Service revenue query failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Database query failed'
        }, { status: 500 });
    }
}
