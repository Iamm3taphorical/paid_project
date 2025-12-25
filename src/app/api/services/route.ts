import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
    try {
        const { data: services, error } = await supabase
            .from('Service')
            .select('S_id, name, description')
            .order('name', { ascending: true });

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            data: services || []
        });
    } catch (error) {
        console.error('Services query failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Database query failed'
        }, { status: 500 });
    }
}
