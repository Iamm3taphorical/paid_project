import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
    try {
        // Get all reviews
        const { data: reviews, error } = await supabase
            .from('Review')
            .select('R_id, date, comment')
            .order('date', { ascending: false });

        if (error) {
            throw error;
        }

        // Analyze sentiment based on keywords
        const positiveWords = ['excellent', 'great', 'amazing', 'fantastic', 'wonderful', 'good', 'best', 'love', 'perfect', 'exceeded', 'reliable'];
        const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'worst', 'hate', 'disappointed', 'issue', 'problem', 'delay', 'late'];

        const reviewsWithSentiment = (reviews || []).map((r: any) => {
            const comment = (r.comment || '').toLowerCase();

            const positiveCount = positiveWords.filter(word => comment.includes(word)).length;
            const negativeCount = negativeWords.filter(word => comment.includes(word)).length;

            let sentiment = 'neutral';
            if (positiveCount > negativeCount) sentiment = 'positive';
            else if (negativeCount > positiveCount) sentiment = 'negative';

            return { ...r, sentiment };
        });

        // Calculate sentiment summary
        const positive = reviewsWithSentiment.filter((r: any) => r.sentiment === 'positive').length;
        const negative = reviewsWithSentiment.filter((r: any) => r.sentiment === 'negative').length;
        const neutral = reviewsWithSentiment.filter((r: any) => r.sentiment === 'neutral').length;

        return NextResponse.json({
            success: true,
            data: {
                summary: { positive, negative, neutral },
                total: reviewsWithSentiment.length,
                reviews: reviewsWithSentiment
            }
        });
    } catch (error) {
        console.error('Review sentiment query failed:', error);
        return NextResponse.json({
            success: true,
            data: {
                summary: { positive: 0, negative: 0, neutral: 0 },
                total: 0,
                reviews: []
            }
        });
    }
}
