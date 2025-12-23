import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Feature 4: Average Project Completion Time
// Measures temporal gap between Job.datetime and associated Payment.payment_date
export async function GET() {
    try {
        const sql = `
            SELECT 
                ROUND(AVG(DATEDIFF(P.payment_date, J.datetime)), 2) AS avg_days
            FROM Job J
            JOIN Involves I ON J.J_id = I.J_id
            JOIN Payment P ON I.P_id = P.P_id
            WHERE J.status = 'completed'
              AND P.payment_status = 'paid'
              AND P.payment_date IS NOT NULL
        `;

        const results = await query(sql);

        return NextResponse.json({
            success: true,
            feature: 'Average Project Completion Time',
            description: 'Average days from job start to payment completion',
            sql: sql.trim(),
            data: {
                avg_days: results[0]?.avg_days || 0
            }
        });
    } catch (error) {
        console.error('Completion time query failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Database query failed'
        }, { status: 500 });
    }
}
