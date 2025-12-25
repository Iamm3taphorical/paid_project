import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
    try {
        // Get all jobs
        const { data: jobs, error } = await supabase
            .from('Job')
            .select('J_id, title, total_amount')
            .order('total_amount', { ascending: false });

        if (error) {
            throw error;
        }

        // Calculate average
        const totalAmount = (jobs || []).reduce((sum: number, j: any) => sum + (parseFloat(j.total_amount) || 0), 0);
        const avgAmount = (jobs || []).length > 0 ? totalAmount / (jobs || []).length : 0;

        // Filter high-value projects (above average)
        const highValueProjects = (jobs || []).filter((j: any) =>
            (parseFloat(j.total_amount) || 0) > avgAmount
        );

        return NextResponse.json({
            success: true,
            data: {
                average_project_value: Math.round(avgAmount),
                high_value_count: highValueProjects.length,
                high_value_projects: highValueProjects
            }
        });
    } catch (error) {
        console.error('High-value projects query failed:', error);
        return NextResponse.json({
            success: true,
            data: {
                average_project_value: 0,
                high_value_count: 0,
                high_value_projects: []
            }
        });
    }
}
