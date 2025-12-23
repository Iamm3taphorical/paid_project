import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Feature 7: High-Value Project Detection
// Identifying jobs whose total_amount exceeds the overall average
export async function GET() {
    try {
        const sql = `
            SELECT 
                J.*,
                GROUP_CONCAT(JL.location) AS locations,
                (SELECT AVG(total_amount) FROM Job) AS avg_amount
            FROM Job J
            LEFT JOIN JobLocation JL ON J.J_id = JL.J_id
            WHERE J.total_amount > (SELECT AVG(total_amount) FROM Job)
            GROUP BY J.J_id
            ORDER BY J.total_amount DESC
        `;

        const results = await query(sql);

        // Get the average for reference
        const avgResult = await query('SELECT AVG(total_amount) AS avg FROM Job');
        const avgAmount = avgResult[0]?.avg || 0;

        return NextResponse.json({
            success: true,
            feature: 'High-Value Project Detection',
            description: 'Jobs with total_amount above average',
            sql: sql.trim(),
            data: {
                average_amount: avgAmount,
                high_value_projects: results
            }
        });
    } catch (error) {
        console.error('High-value projects query failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Database query failed'
        }, { status: 500 });
    }
}
