import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fmjnounsfgasnoxvmnci.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtam5vdW5zZmdhc25veHZtbmNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NzA4NzEsImV4cCI6MjA4MjI0Njg3MX0.6s-zm5vHYfDD-C5vvlV-7x5IqlZWP-Xu1C-07qGDOxg';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function for Supabase queries - simplified version
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    // This function is kept for backwards compatibility but
    // individual API routes should use supabase client directly
    console.log('Legacy query called - use supabase client directly instead');
    return [] as T[];
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
