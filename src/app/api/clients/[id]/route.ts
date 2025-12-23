import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Get single client
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const clientId = params.id;

        const sql = `
            SELECT 
                C.id,
                U.email,
                U.name,
                U.created_at,
                C.address,
                C.phone
            FROM Customer C
            JOIN User U ON C.id = U.id
            WHERE C.id = ?
        `;

        const results = await query(sql, [clientId]);

        if ((results as any[]).length === 0) {
            return NextResponse.json({
                success: false,
                error: 'Client not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: results[0]
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
        const clientId = params.id;
        const body = await request.json();
        const { name, email, phone, address } = body;

        // Update User record
        if (name || email) {
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

            if (userUpdates.length > 0) {
                userValues.push(clientId);
                await query(
                    `UPDATE User SET ${userUpdates.join(', ')} WHERE id = ?`,
                    userValues
                );
            }
        }

        // Update Customer record
        if (phone !== undefined || address !== undefined) {
            const custUpdates: string[] = [];
            const custValues: any[] = [];

            if (phone !== undefined) {
                custUpdates.push('phone = ?');
                custValues.push(phone);
            }
            if (address !== undefined) {
                custUpdates.push('address = ?');
                custValues.push(address);
            }

            if (custUpdates.length > 0) {
                custValues.push(clientId);
                await query(
                    `UPDATE Customer SET ${custUpdates.join(', ')} WHERE id = ?`,
                    custValues
                );
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
        const clientId = params.id;

        // Check if client exists
        const existing = await query('SELECT id FROM Customer WHERE id = ?', [clientId]);
        if ((existing as any[]).length === 0) {
            return NextResponse.json({
                success: false,
                error: 'Client not found'
            }, { status: 404 });
        }

        // Delete User record (cascades to Customer via FK)
        await query('DELETE FROM User WHERE id = ?', [clientId]);

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
