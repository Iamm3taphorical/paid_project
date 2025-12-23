import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Get all payments with associated job and client info
export async function GET() {
    try {
        const sql = `
            SELECT 
                P.*,
                J.title AS job_title,
                J.J_id,
                U.name AS client_name
            FROM Payment P
            LEFT JOIN Involves I ON P.P_id = I.P_id
            LEFT JOIN Job J ON I.J_id = J.J_id
            LEFT JOIN Requests R ON J.J_id = R.J_id
            LEFT JOIN Customer C ON R.id = C.id
            LEFT JOIN User U ON C.id = U.id
            ORDER BY P.created_at DESC
        `;

        const results = await query(sql);

        return NextResponse.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Payments query failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Database query failed'
        }, { status: 500 });
    }
}
