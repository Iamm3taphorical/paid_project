import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Feature 8: Review Sentiment Indicator
// Classifies reviews as positive, neutral, or negative using keyword-based logic
export async function GET() {
    try {
        const sql = `
            SELECT 
                R.R_id,
                R.date,
                R.comment,
                J.J_id,
                J.title AS job_title,
                U.name AS client_name,
                CASE 
                    WHEN LOWER(R.comment) LIKE '%excellent%' 
                         OR LOWER(R.comment) LIKE '%great%' 
                         OR LOWER(R.comment) LIKE '%amazing%' 
                         OR LOWER(R.comment) LIKE '%love%'
                         OR LOWER(R.comment) LIKE '%professional%' 
                         OR LOWER(R.comment) LIKE '%happy%'
                         OR LOWER(R.comment) LIKE '%outstanding%'
                    THEN 'positive'
                    WHEN LOWER(R.comment) LIKE '%bad%' 
                         OR LOWER(R.comment) LIKE '%poor%' 
                         OR LOWER(R.comment) LIKE '%terrible%' 
                         OR LOWER(R.comment) LIKE '%disappointed%'
                         OR LOWER(R.comment) LIKE '%slow%'
                         OR LOWER(R.comment) LIKE '%awful%'
                    THEN 'negative'
                    ELSE 'neutral'
                END AS sentiment
            FROM Review R
            JOIN ReviewForJob RFJ ON R.R_id = RFJ.R_id
            JOIN Job J ON RFJ.J_id = J.J_id
            LEFT JOIN Gives G ON R.R_id = G.R_id
            LEFT JOIN Customer C ON G.id = C.id
            LEFT JOIN User U ON C.id = U.id
            ORDER BY R.date DESC
        `;

        const results = await query(sql);

        // Calculate sentiment summary
        const sentimentCounts = {
            positive: results.filter((r: any) => r.sentiment === 'positive').length,
            neutral: results.filter((r: any) => r.sentiment === 'neutral').length,
            negative: results.filter((r: any) => r.sentiment === 'negative').length,
        };

        return NextResponse.json({
            success: true,
            feature: 'Review Sentiment Indicator',
            description: 'Keyword-based sentiment classification of reviews',
            sql: sql.trim(),
            data: {
                summary: sentimentCounts,
                reviews: results
            }
        });
    } catch (error) {
        console.error('Review sentiment query failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Database query failed'
        }, { status: 500 });
    }
}
