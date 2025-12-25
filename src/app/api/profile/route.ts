import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Get current user profile
export async function GET() {
    try {
        const { data: providers, error } = await supabase
            .from('User')
            .select(`
                id,
                email,
                name,
                user_type,
                created_at
            `)
            .eq('user_type', 'service_provider')
            .limit(1);

        if (error) throw error;

        // If no user found, return default mock data (or create one)
        if (!providers || providers.length === 0) {
            console.log('No service provider found, creating default...');

            // Try to create default user
            const { data: newUser, error: createError } = await supabase
                .from('User')
                .insert({
                    email: 'john.dev@freelance.com',
                    user_type: 'service_provider',
                    name: 'John Developer',
                    password: 'password123'
                })
                .select('id')
                .single();

            if (createError) {
                console.error('Failed to create default user:', createError);
                // Fallback to mock data if creation fails
                return NextResponse.json({
                    success: true,
                    data: {
                        id: 0,
                        email: 'demo@freelance.com',
                        name: 'Demo User',
                        user_type: 'service_provider',
                        specialization: 'Full Stack',
                        hourly_rate: 0
                    }
                });
            }

            // Create service provider details
            await supabase.from('ServiceProvider').insert({
                id: newUser.id,
                specialization: 'Full Stack Development',
                hourly_rate: 75
            });

            return NextResponse.json({
                success: true,
                data: {
                    id: newUser.id,
                    email: 'john.dev@freelance.com',
                    name: 'John Developer',
                    user_type: 'service_provider',
                    specialization: 'Full Stack Development',
                    hourly_rate: 75
                }
            });
        }

        const user = providers[0];

        // Get details
        const { data: sp, error: spError } = await supabase
            .from('ServiceProvider')
            .select('specialization, hourly_rate')
            .eq('id', user.id)
            .single();

        return NextResponse.json({
            success: true,
            data: {
                ...user,
                specialization: sp?.specialization || '',
                hourly_rate: sp?.hourly_rate || 0
            }
        });

    } catch (error) {
        console.error('Profile GET error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// Update profile
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { name, email, specialization, hourly_rate, password } = body;

        console.log('Updating profile:', { name, email, specialization });

        // 1. Get current user
        const { data: users, error: findError } = await supabase
            .from('User')
            .select('id')
            .eq('user_type', 'service_provider')
            .limit(1);

        if (findError) throw findError;

        if (!users || users.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'No profile found to update. Please refresh the page.'
            }, { status: 404 });
        }

        const userId = users[0].id;

        // 2. Update User table
        const userUpdates: any = {};
        if (name) userUpdates.name = name;
        if (email) userUpdates.email = email;
        if (password) userUpdates.password = password;

        if (Object.keys(userUpdates).length > 0) {
            const { error: updateError } = await supabase
                .from('User')
                .update(userUpdates)
                .eq('id', userId);

            if (updateError) {
                console.error('User update error:', updateError);
                throw updateError;
            }
        }

        // 3. Update ServiceProvider table
        const spUpdates: any = {};
        if (specialization) spUpdates.specialization = specialization;
        if (hourly_rate !== undefined) spUpdates.hourly_rate = hourly_rate;

        if (Object.keys(spUpdates).length > 0) {
            // Check if ServiceProvider record exists first
            const { data: existingSp } = await supabase
                .from('ServiceProvider')
                .select('id')
                .eq('id', userId)
                .single();

            if (existingSp) {
                const { error: spError } = await supabase
                    .from('ServiceProvider')
                    .update(spUpdates)
                    .eq('id', userId);

                if (spError) throw spError;
            } else {
                // Insert if missing
                const { error: spInsertError } = await supabase
                    .from('ServiceProvider')
                    .insert({ id: userId, ...spUpdates });

                if (spInsertError) throw spInsertError;
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Profile PUT error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Database update failed'
        }, { status: 500 });
    }
}
