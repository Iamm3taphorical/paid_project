import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

// Get all jobs
export async function GET() {
    try {
        const { data: jobs, error } = await supabase
            .from('Job')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            data: jobs || []
        });
    } catch (error) {
        console.error('Jobs query failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Database query failed'
        }, { status: 500 });
    }
}

// Create a new job
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, status, total_amount } = body;

        if (!title) {
            return NextResponse.json({
                success: false,
                error: 'Title is required'
            }, { status: 400 });
        }

        const { data: newJob, error } = await supabase
            .from('Job')
            .insert({
                title,
                description: description || '',
                status: status || 'ongoing',
                total_amount: total_amount || 0,
                datetime: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            data: newJob,
            message: 'Job created successfully'
        });
    } catch (error) {
        console.error('Create job failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create job'
        }, { status: 500 });
    }
}
