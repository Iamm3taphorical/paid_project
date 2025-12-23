import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Get current user profile (or create default if none exists)
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
            WHERE U.user_type = 'service_provider'
            LIMIT 1
        `;

        const results = await query(sql);

        if ((results as any[]).length === 0) {
            // No service provider exists, create one
            try {
                const userResult = await query(
                    `INSERT INTO User (email, user_type, name, password) VALUES (?, 'service_provider', ?, ?)`,
                    ['freelancer@demo.com', 'Demo Freelancer', 'password123']
                );
                const userId = (userResult as any).insertId;

                await query(
                    `INSERT INTO ServiceProvider (id, specialization, hourly_rate) VALUES (?, ?, ?)`,
                    [userId, 'Full Stack Development', 75.00]
                );

                return NextResponse.json({
                    success: true,
                    data: {
                        id: userId,
                        email: 'freelancer@demo.com',
                        name: 'Demo Freelancer',
                        user_type: 'service_provider',
                        specialization: 'Full Stack Development',
                        hourly_rate: 75
                    }
                });
            } catch (createError) {
                // If creation fails, return mock data
                return NextResponse.json({
                    success: true,
                    data: {
                        id: 0,
                        email: 'demo@freelancepro.com',
                        name: 'Demo Freelancer',
                        user_type: 'service_provider',
                        specialization: 'Full Stack Development',
                        hourly_rate: 75
                    }
                });
            }
        }

        return NextResponse.json({
            success: true,
            data: results[0]
        });
    } catch (error) {
        console.error('Profile fetch failed:', error);
        // Return mock profile on error
        return NextResponse.json({
            success: true,
            data: {
                id: 0,
                email: 'demo@freelancepro.com',
                name: 'Demo Freelancer',
                user_type: 'service_provider',
                specialization: 'Full Stack Development',
                hourly_rate: 75
            }
        });
    }
}

// Update profile (or create if not exists)
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { name, email, specialization, hourly_rate, password } = body;

        // Try to find existing service provider
        let existingProvider = await query(
            `SELECT U.id FROM User U JOIN ServiceProvider SP ON U.id = SP.id WHERE U.user_type = 'service_provider' LIMIT 1`
        );

        let providerId: number;

        if ((existingProvider as any[]).length === 0) {
            // No provider exists, create one first
            const userResult = await query(
                `INSERT INTO User (email, user_type, name, password) VALUES (?, 'service_provider', ?, ?)`,
                [email || 'freelancer@demo.com', name || 'Demo Freelancer', password || 'password123']
            );
            providerId = (userResult as any).insertId;

            await query(
                `INSERT INTO ServiceProvider (id, specialization, hourly_rate) VALUES (?, ?, ?)`,
                [providerId, specialization || 'Full Stack Development', hourly_rate || 75.00]
            );

            return NextResponse.json({
                success: true,
                message: 'Profile created and updated successfully'
            });
        }

        providerId = (existingProvider as any[])[0].id;

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
        if (hourly_rate !== undefined && hourly_rate !== null && hourly_rate !== '') {
            spUpdates.push('hourly_rate = ?');
            spValues.push(parseFloat(hourly_rate));
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
