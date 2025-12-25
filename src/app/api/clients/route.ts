import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

// Get all customers (clients)
export async function GET() {
    try {
        // Get customers with user info
        const { data: customers, error } = await supabase
            .from('Customer')
            .select(`
                id,
                address,
                phone,
                User:id (
                    email,
                    name,
                    created_at
                )
            `)
            .order('id', { ascending: true });

        if (error) {
            console.error('Clients query failed:', error);

            // Fallback: try getting from User table directly
            const { data: users, error: userError } = await supabase
                .from('User')
                .select('id, email, name, created_at')
                .eq('user_type', 'customer')
                .order('name', { ascending: true });

            if (userError) {
                throw userError;
            }

            // Get customer details separately
            const clientsWithDetails = await Promise.all(
                (users || []).map(async (user) => {
                    const { data: customer } = await supabase
                        .from('Customer')
                        .select('address, phone')
                        .eq('id', user.id)
                        .single();

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        created_at: user.created_at,
                        address: customer?.address || '',
                        phone: customer?.phone || ''
                    };
                })
            );

            return NextResponse.json({
                success: true,
                data: clientsWithDetails
            });
        }

        // Transform the joined data
        const transformedData = (customers || []).map((c: any) => ({
            id: c.id,
            email: c.User?.email || '',
            name: c.User?.name || '',
            created_at: c.User?.created_at || '',
            address: c.address || '',
            phone: c.phone || ''
        }));

        return NextResponse.json({
            success: true,
            data: transformedData
        });
    } catch (error) {
        console.error('Clients query failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Database query failed'
        }, { status: 500 });
    }
}

// Create a new client (User + Customer records)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, address, password } = body;

        if (!name || !email) {
            return NextResponse.json({
                success: false,
                error: 'Name and email are required'
            }, { status: 400 });
        }

        // Check if email already exists
        const { data: existingUser } = await supabase
            .from('User')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return NextResponse.json({
                success: false,
                error: 'Email already exists'
            }, { status: 400 });
        }

        // Insert User record
        const { data: newUser, error: userError } = await supabase
            .from('User')
            .insert({
                email,
                user_type: 'customer',
                name,
                password: password || 'default123'
            })
            .select('id')
            .single();

        if (userError) {
            throw userError;
        }

        // Insert Customer record
        const { error: customerError } = await supabase
            .from('Customer')
            .insert({
                id: newUser.id,
                address: address || '',
                phone: phone || ''
            });

        if (customerError) {
            // Rollback user creation
            await supabase.from('User').delete().eq('id', newUser.id);
            throw customerError;
        }

        return NextResponse.json({
            success: true,
            data: { id: newUser.id },
            message: 'Client created successfully'
        });
    } catch (error) {
        console.error('Create client failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create client'
        }, { status: 500 });
    }
}
