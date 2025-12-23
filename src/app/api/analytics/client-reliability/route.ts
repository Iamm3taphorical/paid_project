import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Feature 3: Client Payment Reliability Scoring
// Calculates on-time payment percentage per customer using comparisons between payment_date and due_date
export async function GET() {
    try {
        const sql = `
            SELECT 
                C.id,
                U.name,
                COUNT(*) AS total_payments,
                SUM(CASE WHEN P.payment_date <= P.due_date THEN 1 ELSE 0 END) AS on_time_payments,
                ROUND(
                    SUM(CASE WHEN P.payment_date <= P.due_date THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 
                    2
                ) AS reliability_score
            FROM Customer C
            JOIN User U ON C.id = U.id
            JOIN Requests R ON C.id = R.id
            JOIN Job J ON R.J_id = J.J_id
            JOIN Involves I ON J.J_id = I.J_id
            JOIN Payment P ON I.P_id = P.P_id
            WHERE P.payment_status = 'paid'
            GROUP BY C.id, U.name
            ORDER BY reliability_score DESC
        `;

        const results = await query(sql);

        return NextResponse.json({
            success: true,
            feature: 'Client Payment Reliability',
            description: 'On-time payment percentage per customer',
            sql: sql.trim(),
            data: results
        });
    } catch (error) {
        console.error('Client reliability query failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Database query failed'
        }, { status: 500 });
    }
}
