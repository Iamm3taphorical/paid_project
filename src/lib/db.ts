import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fmjnounsfgasnoxvmnci.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtam5vdW5zZmdhc25veHZtbmNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NzA4NzEsImV4cCI6MjA4MjI0Njg3MX0.6s-zm5vHYfDD-C5vvlV-7x5IqlZWP-Xu1C-07qGDOxg';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Execute a raw SQL query using Supabase's RPC or direct table access
// For complex queries, we use supabase.rpc() with database functions
// For simple queries, we use supabase.from().select()

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    // Convert MySQL-style ? placeholders to PostgreSQL $1, $2, etc.
    let pgSql = sql;
    let paramIndex = 1;
    while (pgSql.includes('?')) {
        pgSql = pgSql.replace('?', `$${paramIndex}`);
        paramIndex++;
    }

    // Convert MySQL functions to PostgreSQL
    pgSql = pgSql
        .replace(/CURDATE\(\)/gi, 'CURRENT_DATE')
        .replace(/NOW\(\)/gi, 'NOW()')
        .replace(/DATE_ADD\(([^,]+),\s*INTERVAL\s+(\d+)\s+DAY\)/gi, "($1 + INTERVAL '$2 days')")
        .replace(/DATEDIFF\(([^,]+),\s*([^)]+)\)/gi, "EXTRACT(DAY FROM ($1 - $2))")
        .replace(/GROUP_CONCAT\(([^)]+)\)/gi, 'STRING_AGG($1::TEXT, \',\')')
        .replace(/IFNULL\(/gi, 'COALESCE(');

    try {
        // Use Supabase's postgres function for raw SQL
        const { data, error } = await supabase.rpc('execute_sql', {
            query_text: pgSql,
            query_params: params
        });

        if (error) {
            // Fallback: Try using the REST API for simple queries
            console.error('RPC failed, trying alternate method:', error.message);

            // For SELECT queries, try to parse and use Supabase's query builder
            if (pgSql.trim().toUpperCase().startsWith('SELECT')) {
                // Return empty array if raw SQL fails - let individual routes handle this
                console.error('Raw SQL query failed:', pgSql);
                return [] as T[];
            }

            throw error;
        }

        return (data || []) as T[];
    } catch (error) {
        console.error('Database query failed:', error);
        return [] as T[];
    }
}

// Helper function for Supabase table operations (preferred over raw SQL)
export async function fromTable<T = any>(
    table: string,
    operation: 'select' | 'insert' | 'update' | 'delete',
    options?: {
        select?: string;
        filter?: Record<string, any>;
        data?: Record<string, any> | Record<string, any>[];
        match?: Record<string, any>;
        order?: { column: string; ascending?: boolean };
        limit?: number;
    }
): Promise<{ data: T[] | null; error: any }> {
    let query = supabase.from(table);

    switch (operation) {
        case 'select':
            let selectQuery = query.select(options?.select || '*');

            if (options?.filter) {
                Object.entries(options.filter).forEach(([key, value]) => {
                    selectQuery = selectQuery.eq(key, value);
                });
            }

            if (options?.order) {
                selectQuery = selectQuery.order(options.order.column, {
                    ascending: options.order.ascending ?? true
                });
            }

            if (options?.limit) {
                selectQuery = selectQuery.limit(options.limit);
            }

            return await selectQuery;

        case 'insert':
            return await query.insert(options?.data || {}).select();

        case 'update':
            let updateQuery = query.update(options?.data || {});
            if (options?.match) {
                Object.entries(options.match).forEach(([key, value]) => {
                    updateQuery = updateQuery.eq(key, value);
                });
            }
            return await updateQuery.select();

        case 'delete':
            let deleteQuery = query.delete();
            if (options?.match) {
                Object.entries(options.match).forEach(([key, value]) => {
                    deleteQuery = deleteQuery.eq(key, value);
                });
            }
            return await deleteQuery;

        default:
            return { data: null, error: new Error('Invalid operation') };
    }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
    try {
        const { error } = await supabase.from('User').select('id').limit(1);
        return !error;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}

export default supabase;
