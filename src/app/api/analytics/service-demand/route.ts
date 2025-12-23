import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Feature 5: Service Demand Analytics
// Counting how frequently each service appears in Requires relationship table
export async function GET() {
    try {
        const sql = `
            SELECT 
                S.S_id,
                S.name,
                S.description,
                COUNT(RQ.J_id) AS demand_count
            FROM Service S
            LEFT JOIN Requires RQ ON S.S_id = RQ.S_id
            GROUP BY S.S_id, S.name, S.description
            ORDER BY demand_count DESC
        `;

        const results = await query(sql);

        return NextResponse.json({
            success: true,
            feature: 'Service Demand Analytics',
            description: 'Service frequency count from Requires table',
            sql: sql.trim(),
            data: results
        });
    } catch (error) {
        console.error('Service demand query failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Database query failed'
        }, { status: 500 });
    }
}
