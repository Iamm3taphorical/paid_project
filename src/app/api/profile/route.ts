import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

// Get current user profile (or create default if none exists)
export async function GET() {
    try {
        // Try to get service provider profile
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

        if (error) {
            throw error;
        }

        if (!providers || providers.length === 0) {
            // No service provider exists, create one
            const { data: newUser, error: createError } = await supabase
                .from('User')
                .insert({
                    email: 'freelancer@demo.com',
                    user_type: 'service_provider',
                    name: 'Demo Freelancer',
                    password: 'password123'
                })
                .select('id')
                .single();

            if (createError) {
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

            // Create ServiceProvider record
            await supabase
                .from('ServiceProvider')
                .insert({
                    id: newUser.id,
                    specialization: 'Full Stack Development',
                    hourly_rate: 75.00
                });

            return NextResponse.json({
                success: true,
                data: {
                    id: newUser.id,
                    email: 'freelancer@demo.com',
                    name: 'Demo Freelancer',
                    user_type: 'service_provider',
                    specialization: 'Full Stack Development',
                    hourly_rate: 75
                }
            });
        }

        // Get ServiceProvider details
        const { data: spData } = await supabase
            .from('ServiceProvider')
            .select('specialization, hourly_rate')
            .eq('id', providers[0].id)
            .single();

        return NextResponse.json({
            success: true,
            data: {
                ...providers[0],
                specialization: spData?.specialization || 'Full Stack Development',
                hourly_rate: spData?.hourly_rate || 75
            }
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
        const { data: providers } = await supabase
            .from('User')
            .select('id')
            .eq('user_type', 'service_provider')
            .limit(1);

        let providerId: number;

        if (!providers || providers.length === 0) {
            // No provider exists, create one first
            const { data: newUser, error: createError } = await supabase
                .from('User')
                .insert({
                    email: email || 'freelancer@demo.com',
                    user_type: 'service_provider',
                    name: name || 'Demo Freelancer',
                    password: password || 'password123'
                })
                .select('id')
                .single();

            if (createError) {
                throw createError;
            }

            providerId = newUser.id;

            await supabase
                .from('ServiceProvider')
                .insert({
                    id: providerId,
                    specialization: specialization || 'Full Stack Development',
                    hourly_rate: hourly_rate || 75.00
                });

            return NextResponse.json({
                success: true,
                message: 'Profile created and updated successfully'
            });
        }

        providerId = providers[0].id;

        // Update User record
        const userUpdates: Record<string, any> = {};
        if (name) userUpdates.name = name;
        if (email) userUpdates.email = email;
        if (password) userUpdates.password = password;

        if (Object.keys(userUpdates).length > 0) {
            const { error: userError } = await supabase
                .from('User')
                .update(userUpdates)
                .eq('id', providerId);

            if (userError) {
                throw userError;
            }
        }

        // Update ServiceProvider record
        const spUpdates: Record<string, any> = {};
        if (specialization) spUpdates.specialization = specialization;
        if (hourly_rate !== undefined && hourly_rate !== null && hourly_rate !== '') {
            spUpdates.hourly_rate = parseFloat(hourly_rate);
        }

        if (Object.keys(spUpdates).length > 0) {
            const { error: spError } = await supabase
                .from('ServiceProvider')
                .update(spUpdates)
                .eq('id', providerId);

            if (spError) {
                throw spError;
            }
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
