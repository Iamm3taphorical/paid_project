import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Feature 2: Monthly and Yearly Income Comparison
// Aggregates paid Payment.amount values filtered by payment_date
export async function GET() {
    try {
        const sql = `
            SELECT 
                YEAR(P.payment_date) AS year,
                MONTH(P.payment_date) AS month,
                SUM(P.amount) AS total_income
            FROM Payment P
            WHERE P.payment_status = 'paid'
              AND P.payment_date IS NOT NULL
            GROUP BY YEAR(P.payment_date), MONTH(P.payment_date)
            ORDER BY year DESC, month DESC
        `;

        const results = await query(sql);

        return NextResponse.json({
            success: true,
            feature: 'Monthly/Yearly Income Comparison',
            description: 'Aggregated income grouped by month and year',
            sql: sql.trim(),
            data: results
        });
    } catch (error) {
        console.error('Monthly income query failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Database query failed'
        }, { status: 500 });
    }
}
