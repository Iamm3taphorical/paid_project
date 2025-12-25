import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
    try {
        // Get services with their demand count
        const { data: services, error: svcError } = await supabase
            .from('Service')
            .select('S_id, name, description');

        if (svcError) {
            throw svcError;
        }

        // Get job-service relationships
        const { data: requires } = await supabase.from('Requires').select('J_id, S_id');

        // Count demand for each service
        const demandData = (services || []).map((service: any) => {
            const demandCount = (requires || [])
                .filter((r: any) => r.S_id === service.S_id)
                .length;

            return {
                S_id: service.S_id,
                name: service.name,
                description: service.description,
                demand_count: demandCount
            };
        }).sort((a: any, b: any) => b.demand_count - a.demand_count);

        return NextResponse.json({
            success: true,
            data: demandData
        });
    } catch (error) {
        console.error('Service demand query failed:', error);
        return NextResponse.json({
            success: true,
            data: []
        });
    }
}
