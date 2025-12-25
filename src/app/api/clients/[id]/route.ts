import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

// Get single client
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const clientId = parseInt(params.id);

        // Get user info
        const { data: user, error: userError } = await supabase
            .from('User')
            .select('id, email, name, created_at')
            .eq('id', clientId)
            .single();

        if (userError || !user) {
            return NextResponse.json({
                success: false,
                error: 'Client not found'
            }, { status: 404 });
        }

        // Get customer details
        const { data: customer } = await supabase
            .from('Customer')
            .select('address, phone')
            .eq('id', clientId)
            .single();

        return NextResponse.json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                created_at: user.created_at,
                address: customer?.address || '',
                phone: customer?.phone || ''
            }
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Database query failed'
        }, { status: 500 });
    }
}

// Update client
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const clientId = parseInt(params.id);
        const body = await request.json();
        const { name, email, phone, address } = body;

        // Update User record
        if (name || email) {
            const updateData: Record<string, any> = {};
            if (name) updateData.name = name;
            if (email) updateData.email = email;

            const { error: userError } = await supabase
                .from('User')
                .update(updateData)
                .eq('id', clientId);

            if (userError) {
                throw userError;
            }
        }

        // Update Customer record
        if (phone !== undefined || address !== undefined) {
            const updateData: Record<string, any> = {};
            if (phone !== undefined) updateData.phone = phone;
            if (address !== undefined) updateData.address = address;

            const { error: customerError } = await supabase
                .from('Customer')
                .update(updateData)
                .eq('id', clientId);

            if (customerError) {
                throw customerError;
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Client updated successfully'
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update client'
        }, { status: 500 });
    }
}

// Delete client
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const clientId = parseInt(params.id);

        // Check if client exists
        const { data: existing } = await supabase
            .from('Customer')
            .select('id')
            .eq('id', clientId)
            .single();

        if (!existing) {
            return NextResponse.json({
                success: false,
                error: 'Client not found'
            }, { status: 404 });
        }

        // Delete User record (cascades to Customer via FK)
        const { error } = await supabase
            .from('User')
            .delete()
            .eq('id', clientId);

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            message: 'Client deleted successfully'
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete client'
        }, { status: 500 });
    }
}
