import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Get a single job
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const jobId = params.id;

        const sql = `
            SELECT 
                J.*,
                GROUP_CONCAT(DISTINCT JL.location) AS locations,
                GROUP_CONCAT(DISTINCT S.name) AS services
            FROM Job J
            LEFT JOIN JobLocation JL ON J.J_id = JL.J_id
            LEFT JOIN Requires RQ ON J.J_id = RQ.J_id
            LEFT JOIN Service S ON RQ.S_id = S.S_id
            WHERE J.J_id = ?
            GROUP BY J.J_id
        `;

        const results = await query(sql, [jobId]);

        if (results.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'Job not found'
            }, { status: 404 });
        }

        const job = {
            ...results[0],
            locations: results[0].locations ? results[0].locations.split(',') : [],
            services: results[0].services ? results[0].services.split(',') : []
        };

        return NextResponse.json({
            success: true,
            data: job
        });
    } catch (error) {
        console.error('Get job failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Database query failed'
        }, { status: 500 });
    }
}

// Update a job
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const jobId = params.id;
        const body = await request.json();
        const { title, description, status, total_amount, locations } = body;

        // Build dynamic update query
        const updates: string[] = [];
        const values: any[] = [];

        if (title !== undefined) {
            updates.push('title = ?');
            values.push(title);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            values.push(description);
        }
        if (status !== undefined) {
            updates.push('status = ?');
            values.push(status);
        }
        if (total_amount !== undefined) {
            updates.push('total_amount = ?');
            values.push(total_amount);
        }

        if (updates.length > 0) {
            values.push(jobId);
            await query(
                `UPDATE Job SET ${updates.join(', ')} WHERE J_id = ?`,
                values
            );
        }

        // Update locations if provided
        if (locations && Array.isArray(locations)) {
            // Remove old locations
            await query('DELETE FROM JobLocation WHERE J_id = ?', [jobId]);
            // Insert new locations
            for (const location of locations) {
                await query(
                    'INSERT INTO JobLocation (J_id, location) VALUES (?, ?)',
                    [jobId, location]
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Job updated successfully'
        });
    } catch (error) {
        console.error('Update job failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update job'
        }, { status: 500 });
    }
}

// Delete a job (cascades to related tables via FK)
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const jobId = params.id;

        // Check if job exists
        const existing = await query('SELECT J_id FROM Job WHERE J_id = ?', [jobId]);
        if ((existing as any[]).length === 0) {
            return NextResponse.json({
                success: false,
                error: 'Job not found'
            }, { status: 404 });
        }

        // Delete job (FK ON DELETE CASCADE handles related records)
        await query('DELETE FROM Job WHERE J_id = ?', [jobId]);

        return NextResponse.json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        console.error('Delete job failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete job'
        }, { status: 500 });
    }
}
