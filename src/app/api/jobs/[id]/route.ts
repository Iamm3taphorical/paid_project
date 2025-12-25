import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

// Get single job
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const jobId = parseInt(params.id);

        const { data: job, error } = await supabase
            .from('Job')
            .select('*')
            .eq('J_id', jobId)
            .single();

        if (error || !job) {
            return NextResponse.json({
                success: false,
                error: 'Job not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: job
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Database query failed'
        }, { status: 500 });
    }
}

// Update job
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const jobId = parseInt(params.id);
        const body = await request.json();
        const { title, description, status, total_amount } = body;

        const updateData: Record<string, any> = {
            updated_at: new Date().toISOString()
        };

        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (status) updateData.status = status;
        if (total_amount !== undefined) updateData.total_amount = total_amount;

        const { error } = await supabase
            .from('Job')
            .update(updateData)
            .eq('J_id', jobId);

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            message: 'Job updated successfully'
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update job'
        }, { status: 500 });
    }
}

// Delete job
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const jobId = parseInt(params.id);

        const { error } = await supabase
            .from('Job')
            .delete()
            .eq('J_id', jobId);

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete job'
        }, { status: 500 });
    }
}
