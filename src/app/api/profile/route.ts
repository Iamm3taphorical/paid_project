import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Demo profile ID (in production, this would come from auth session)
const DEMO_PROVIDER_ID = 4; // Assuming provider with ID 4 exists

// Get current user profile
export async function GET() {
    try {
        // Try to get service provider profile
        const sql = `
            SELECT 
                U.id,
                U.email,
                U.name,
                U.user_type,
                U.created_at,
                SP.specialization,
                SP.hourly_rate
            FROM User U
            LEFT JOIN ServiceProvider SP ON U.id = SP.id
            WHERE U.id = ? OR U.user_type = 'service_provider'
            LIMIT 1
        `;

        const results = await query(sql, [DEMO_PROVIDER_ID]);

        if ((results as any[]).length === 0) {
            // Return default profile if none exists
            return NextResponse.json({
                success: true,
                data: {
                    id: 0,
                    email: 'demo@freelancepro.com',
                    name: 'Demo Freelancer',
                    user_type: 'service_provider',
                    specialization: 'Full Stack Development',
                    hourly_rate: 75,
                    bank_name: '',
                    account_number: '',
                    routing_number: ''
                }
            });
        }

        return NextResponse.json({
            success: true,
            data: results[0]
        });
    } catch (error) {
        console.error('Profile fetch failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch profile'
        }, { status: 500 });
    }
}

// Update profile
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { name, email, specialization, hourly_rate, password } = body;

        // For demo, we'll try to update the first service provider
        const existingProvider = await query(
            `SELECT U.id FROM User U JOIN ServiceProvider SP ON U.id = SP.id LIMIT 1`
        );

        if ((existingProvider as any[]).length === 0) {
            return NextResponse.json({
                success: false,
                error: 'No service provider found to update'
            }, { status: 404 });
        }

        const providerId = (existingProvider as any[])[0].id;

        // Update User record
        const userUpdates: string[] = [];
        const userValues: any[] = [];

        if (name) {
            userUpdates.push('name = ?');
            userValues.push(name);
        }
        if (email) {
            userUpdates.push('email = ?');
            userValues.push(email);
        }
        if (password) {
            userUpdates.push('password = ?');
            userValues.push(password);
        }

        if (userUpdates.length > 0) {
            userValues.push(providerId);
            await query(
                `UPDATE User SET ${userUpdates.join(', ')} WHERE id = ?`,
                userValues
            );
        }

        // Update ServiceProvider record
        const spUpdates: string[] = [];
        const spValues: any[] = [];

        if (specialization) {
            spUpdates.push('specialization = ?');
            spValues.push(specialization);
        }
        if (hourly_rate !== undefined) {
            spUpdates.push('hourly_rate = ?');
            spValues.push(hourly_rate);
        }

        if (spUpdates.length > 0) {
            spValues.push(providerId);
            await query(
                `UPDATE ServiceProvider SET ${spUpdates.join(', ')} WHERE id = ?`,
                spValues
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Profile update failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update profile'
        }, { status: 500 });
    }
}
