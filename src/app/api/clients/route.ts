import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Get all customers (clients)
export async function GET() {
    try {
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
            WHERE U.user_type = 'customer'
            ORDER BY U.name ASC
        `;

        const results = await query(sql);

        return NextResponse.json({
            success: true,
            data: results
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
        const existingUser = await query('SELECT id FROM User WHERE email = ?', [email]);
        if ((existingUser as any[]).length > 0) {
            return NextResponse.json({
                success: false,
                error: 'Email already exists'
            }, { status: 400 });
        }

        // Insert User record
        const userResult = await query(
            `INSERT INTO User (email, user_type, name, password) VALUES (?, 'customer', ?, ?)`,
            [email, name, password || 'default123']
        );

        const userId = (userResult as any).insertId;

        // Insert Customer record
        await query(
            `INSERT INTO Customer (id, address, phone) VALUES (?, ?, ?)`,
            [userId, address || '', phone || '']
        );

        return NextResponse.json({
            success: true,
            data: { id: userId },
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
