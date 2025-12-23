import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Get all services (for dropdowns in forms)
export async function GET() {
    try {
        const sql = `SELECT S_id, name, description FROM Service ORDER BY name ASC`;
        const results = await query(sql);

        return NextResponse.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Services query failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Database query failed'
        }, { status: 500 });
    }
}
