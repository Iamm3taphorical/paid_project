import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Get all jobs with their locations
export async function GET() {
    try {
        const sql = `
            SELECT 
                J.*,
                GROUP_CONCAT(JL.location) AS locations
            FROM Job J
            LEFT JOIN JobLocation JL ON J.J_id = JL.J_id
            GROUP BY J.J_id
            ORDER BY J.created_at DESC
        `;

        const results = await query(sql);

        // Parse locations into array
        const jobs = results.map((job: any) => ({
            ...job,
            locations: job.locations ? job.locations.split(',') : []
        }));

        return NextResponse.json({
            success: true,
            data: jobs
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
        const { title, description, status, total_amount, locations, client_id, services } = body;

        if (!title || !total_amount) {
            return NextResponse.json({
                success: false,
                error: 'Title and total_amount are required'
            }, { status: 400 });
        }

        // Insert the job
        const jobResult = await query(
            `INSERT INTO Job (title, description, status, total_amount) VALUES (?, ?, ?, ?)`,
            [title, description || '', status || 'ongoing', total_amount]
        );

        const jobId = (jobResult as any).insertId;

        // Insert job locations if provided
        if (locations && Array.isArray(locations) && locations.length > 0) {
            for (const location of locations) {
                await query(
                    `INSERT INTO JobLocation (J_id, location) VALUES (?, ?)`,
                    [jobId, location]
                );
            }
        }

        // Link to customer if provided (Requests table)
        if (client_id) {
            await query(
                `INSERT INTO Requests (id, J_id) VALUES (?, ?)`,
                [client_id, jobId]
            );
        }

        // Link to services if provided (Requires table)
        if (services && Array.isArray(services) && services.length > 0) {
            for (const serviceId of services) {
                await query(
                    `INSERT INTO Requires (J_id, S_id) VALUES (?, ?)`,
                    [jobId, serviceId]
                );
            }
        }

        // Create a payment record for the job (Involves table)
        const paymentResult = await query(
            `INSERT INTO Payment (due_date, method, payment_status, amount) VALUES (DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'bank_transfer', 'pending', ?)`,
            [total_amount]
        );
        const paymentId = (paymentResult as any).insertId;

        await query(
            `INSERT INTO Involves (J_id, P_id) VALUES (?, ?)`,
            [jobId, paymentId]
        );

        return NextResponse.json({
            success: true,
            data: { J_id: jobId, P_id: paymentId },
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
