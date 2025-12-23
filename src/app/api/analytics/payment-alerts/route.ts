import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Feature 1: Automatic Payment Due Alerts
// Detects unpaid payments whose due dates are within the next 7 days or already overdue
export async function GET() {
    try {
        const sql = `
            SELECT 
                P.P_id,
                P.amount,
                P.due_date,
                P.payment_status,
                J.title AS job_title,
                U.name AS client_name,
                DATEDIFF(P.due_date, CURDATE()) AS days_until_due,
                CASE WHEN P.due_date < CURDATE() THEN 1 ELSE 0 END AS is_overdue
            FROM Payment P
            JOIN Involves I ON P.P_id = I.P_id
            JOIN Job J ON I.J_id = J.J_id
            JOIN Requests R ON J.J_id = R.J_id
            JOIN Customer C ON R.id = C.id
            JOIN User U ON C.id = U.id
            WHERE P.payment_status != 'paid'
              AND P.due_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
            ORDER BY P.due_date ASC
        `;

        const results = await query(sql);

        return NextResponse.json({
            success: true,
            feature: 'Payment Due Alerts',
            description: 'Unpaid payments due within 7 days or overdue',
            sql: sql.trim(),
            data: results
        });
    } catch (error) {
        console.error('Payment alerts query failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Database query failed'
        }, { status: 500 });
    }
}
