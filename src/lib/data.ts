// Mock data layer for the Freelance Project Management System
// This simulates database queries for frontend development

import type {
    Job,
    Payment,
    Customer,
    Service,
    Review,
    PaymentAlert,
    MonthlyIncome,
    ClientReliability,
    ServiceDemand,
    ServiceRevenue,
    ReviewSentiment,
    WorkloadStatus,
    DashboardStats,
    TopClient,
} from "@/types";

// =====================================================
// MOCK DATA (mirrors SQL sample data)
// =====================================================

export const mockJobs: Job[] = [
    { J_id: 1, title: "E-commerce Website", description: "Build a complete e-commerce platform with payment integration", datetime: "2024-01-15T09:00:00", status: "completed", total_amount: 5000, created_at: "2024-01-15", updated_at: "2024-02-15", locations: ["Remote", "New York"] },
    { J_id: 2, title: "Mobile Banking App", description: "Develop a secure mobile banking application", datetime: "2024-02-01T10:00:00", status: "completed", total_amount: 12000, created_at: "2024-02-01", updated_at: "2024-03-20", locations: ["San Francisco", "Remote"] },
    { J_id: 3, title: "Restaurant Website Redesign", description: "Modern redesign of existing restaurant website", datetime: "2024-03-10T11:00:00", status: "completed", total_amount: 2500, created_at: "2024-03-10", updated_at: "2024-04-15", locations: ["Los Angeles"] },
    { J_id: 4, title: "Marketing Campaign Dashboard", description: "Analytics dashboard for marketing campaigns", datetime: "2024-04-05T14:00:00", status: "ongoing", total_amount: 3500, created_at: "2024-04-05", updated_at: "2024-04-05", locations: ["Chicago", "Remote"] },
    { J_id: 5, title: "Inventory Management System", description: "Custom inventory tracking system", datetime: "2024-05-20T09:30:00", status: "ongoing", total_amount: 8000, created_at: "2024-05-20", updated_at: "2024-05-20", locations: ["Seattle"] },
    { J_id: 6, title: "Social Media App", description: "Social networking mobile application", datetime: "2024-06-15T10:00:00", status: "ongoing", total_amount: 15000, created_at: "2024-06-15", updated_at: "2024-06-15", locations: ["Remote"] },
    { J_id: 7, title: "Corporate Website", description: "Professional corporate website with CMS", datetime: "2024-07-01T09:00:00", status: "completed", total_amount: 4500, created_at: "2024-07-01", updated_at: "2024-08-15", locations: ["New York", "Boston"] },
    { J_id: 8, title: "CRM System", description: "Customer relationship management system", datetime: "2024-08-10T11:00:00", status: "ongoing", total_amount: 9500, created_at: "2024-08-10", updated_at: "2024-08-10", locations: ["Chicago"] },
    { J_id: 9, title: "E-learning Platform", description: "Online learning management system", datetime: "2024-09-01T10:00:00", status: "ongoing", total_amount: 11000, created_at: "2024-09-01", updated_at: "2024-09-01", locations: ["Remote", "Austin"] },
    { J_id: 10, title: "Portfolio Website", description: "Personal portfolio website", datetime: "2024-10-15T14:00:00", status: "completed", total_amount: 1500, created_at: "2024-10-15", updated_at: "2024-11-15", locations: ["Los Angeles"] },
];

export const mockPayments: Payment[] = [
    { P_id: 1, due_date: "2024-02-15", method: "bank_transfer", payment_status: "paid", amount: 5000, payment_date: "2024-02-10", created_at: "2024-01-15" },
    { P_id: 2, due_date: "2024-03-15", method: "credit_card", payment_status: "paid", amount: 12000, payment_date: "2024-03-20", created_at: "2024-02-01" },
    { P_id: 3, due_date: "2024-04-15", method: "online", payment_status: "paid", amount: 2500, payment_date: "2024-04-10", created_at: "2024-03-10" },
    { P_id: 4, due_date: "2024-12-28", method: "bank_transfer", payment_status: "pending", amount: 3500, payment_date: null, created_at: "2024-04-05" },
    { P_id: 5, due_date: "2024-12-25", method: "credit_card", payment_status: "pending", amount: 8000, payment_date: null, created_at: "2024-05-20" },
    { P_id: 6, due_date: "2025-01-15", method: "online", payment_status: "pending", amount: 15000, payment_date: null, created_at: "2024-06-15" },
    { P_id: 7, due_date: "2024-08-15", method: "bank_transfer", payment_status: "paid", amount: 4500, payment_date: "2024-08-12", created_at: "2024-07-01" },
    { P_id: 8, due_date: "2024-12-20", method: "credit_card", payment_status: "pending", amount: 9500, payment_date: null, created_at: "2024-08-10" },
    { P_id: 9, due_date: "2025-01-30", method: "online", payment_status: "pending", amount: 11000, payment_date: null, created_at: "2024-09-01" },
    { P_id: 10, due_date: "2024-11-15", method: "bank_transfer", payment_status: "paid", amount: 1500, payment_date: "2024-11-10", created_at: "2024-10-15" },
];

export const mockCustomers: Customer[] = [
    { id: 1, email: "john.doe@email.com", user_type: "customer", name: "John Doe", created_at: "2024-01-01", address: "123 Main St, New York, NY", phone: "+1-555-0101" },
    { id: 2, email: "jane.smith@email.com", user_type: "customer", name: "Jane Smith", created_at: "2024-01-05", address: "456 Oak Ave, Los Angeles, CA", phone: "+1-555-0102" },
    { id: 3, email: "acme.corp@email.com", user_type: "customer", name: "Acme Corporation", created_at: "2024-01-10", address: "789 Corporate Blvd, Chicago, IL", phone: "+1-555-0103" },
    { id: 4, email: "startup.inc@email.com", user_type: "customer", name: "Startup Inc", created_at: "2024-01-15", address: "321 Innovation Dr, San Francisco, CA", phone: "+1-555-0104" },
    { id: 5, email: "big.enterprise@email.com", user_type: "customer", name: "Big Enterprise", created_at: "2024-01-20", address: "555 Enterprise Way, Seattle, WA", phone: "+1-555-0105" },
];

export const mockServices: Service[] = [
    { S_id: 1, name: "Web Development", description: "Full-stack web application development" },
    { S_id: 2, name: "Mobile App Development", description: "iOS and Android app development" },
    { S_id: 3, name: "UI/UX Design", description: "User interface and experience design" },
    { S_id: 4, name: "Logo Design", description: "Brand identity and logo creation" },
    { S_id: 5, name: "SEO Optimization", description: "Search engine optimization services" },
    { S_id: 6, name: "Content Marketing", description: "Content strategy and creation" },
    { S_id: 7, name: "Database Design", description: "Database architecture and optimization" },
    { S_id: 8, name: "API Development", description: "RESTful API design and implementation" },
];

export const mockReviews: Review[] = [
    { R_id: 1, date: "2024-02-20", comment: "Excellent work! The website exceeded our expectations. Great attention to detail." },
    { R_id: 2, date: "2024-03-25", comment: "Good job on the mobile app. Minor delays but quality was excellent." },
    { R_id: 3, date: "2024-04-20", comment: "Amazing redesign! Our customers love the new look." },
    { R_id: 4, date: "2024-08-20", comment: "Professional and timely delivery. Great communication throughout." },
    { R_id: 5, date: "2024-11-20", comment: "Simple but effective portfolio. Happy with the result." },
];

// =====================================================
// FEATURE 1: Payment Due Alerts
// =====================================================
export function getPaymentAlerts(): PaymentAlert[] {
    const today = new Date();
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    return mockPayments
        .filter(p => p.payment_status !== 'paid')
        .map((p, idx) => {
            const dueDate = new Date(p.due_date);
            const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            const job = mockJobs.find(j => j.J_id === idx + 1) || mockJobs[0];
            const client = mockCustomers[idx % mockCustomers.length];

            return {
                P_id: p.P_id,
                amount: p.amount,
                due_date: p.due_date,
                job_title: job.title,
                client_name: client.name,
                days_until_due: daysUntilDue,
                is_overdue: daysUntilDue < 0,
            };
        })
        .filter(a => a.days_until_due <= 7);
}

// =====================================================
// FEATURE 2: Monthly/Yearly Income Comparison
// =====================================================
export function getMonthlyIncome(): MonthlyIncome[] {
    const incomeMap = new Map<string, number>();

    mockPayments
        .filter(p => p.payment_status === 'paid' && p.payment_date)
        .forEach(p => {
            const date = new Date(p.payment_date!);
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
            incomeMap.set(key, (incomeMap.get(key) || 0) + p.amount);
        });

    return Array.from(incomeMap.entries()).map(([key, total]) => {
        const [year, month] = key.split('-').map(Number);
        return { year, month, total_income: total };
    }).sort((a, b) => a.year * 12 + a.month - (b.year * 12 + b.month));
}

// =====================================================
// FEATURE 3: Client Payment Reliability
// =====================================================
export function getClientReliability(): ClientReliability[] {
    return mockCustomers.map((c, idx) => {
        const clientPayments = mockPayments.filter((_, i) => i % mockCustomers.length === idx);
        const paidPayments = clientPayments.filter(p => p.payment_status === 'paid');
        const onTimePayments = paidPayments.filter(p =>
            p.payment_date && new Date(p.payment_date) <= new Date(p.due_date)
        );

        const total = paidPayments.length || 1;
        const onTime = onTimePayments.length;

        return {
            id: c.id,
            name: c.name,
            reliability_score: Math.round((onTime / total) * 100),
            total_payments: paidPayments.length,
            on_time_payments: onTime,
        };
    });
}

// =====================================================
// FEATURE 4: Average Project Completion Time
// =====================================================
export function getAverageCompletionTime(): number {
    const completedJobs = mockJobs.filter(j => j.status === 'completed');
    const completionTimes = completedJobs.map((j, idx) => {
        const payment = mockPayments.find(p => p.P_id === j.J_id);
        if (!payment || !payment.payment_date) return 30;

        const startDate = new Date(j.datetime);
        const endDate = new Date(payment.payment_date);
        return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    });

    return Math.round(completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length);
}

// =====================================================
// FEATURE 5: Service Demand Analytics
// =====================================================
export function getServiceDemand(): ServiceDemand[] {
    const demandCount = [8, 4, 9, 2, 2, 2, 4, 4]; // Simulated from Requires table

    return mockServices.map((s, idx) => ({
        S_id: s.S_id,
        name: s.name,
        demand_count: demandCount[idx] || 0,
    })).sort((a, b) => b.demand_count - a.demand_count);
}

// =====================================================
// FEATURE 6: Revenue by Service
// =====================================================
export function getServiceRevenue(): ServiceRevenue[] {
    // Deterministic revenue values (simulating SUM(Payment.amount) grouped by Service)
    const revenueByService = [18500, 22000, 12500, 3500, 5000, 4000, 15000, 14000];

    return mockServices.map((s, idx) => ({
        S_id: s.S_id,
        name: s.name,
        total_revenue: revenueByService[idx] || 5000,
    })).sort((a, b) => b.total_revenue - a.total_revenue);
}

// =====================================================
// FEATURE 7: High-Value Project Detection
// =====================================================
export function getHighValueProjects(): Job[] {
    const avgAmount = mockJobs.reduce((a, j) => a + j.total_amount, 0) / mockJobs.length;
    return mockJobs.filter(j => j.total_amount > avgAmount);
}

// =====================================================
// FEATURE 8: Review Sentiment Analysis
// =====================================================
export function getReviewSentiments(): ReviewSentiment[] {
    const positiveWords = ['excellent', 'great', 'amazing', 'love', 'professional', 'happy'];
    const negativeWords = ['bad', 'poor', 'terrible', 'disappointed', 'slow'];

    return mockReviews.map((r, idx) => {
        const lowerComment = r.comment.toLowerCase();
        let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';

        if (positiveWords.some(w => lowerComment.includes(w))) {
            sentiment = 'positive';
        } else if (negativeWords.some(w => lowerComment.includes(w))) {
            sentiment = 'negative';
        }

        const job = mockJobs[idx] || mockJobs[0];

        return {
            R_id: r.R_id,
            comment: r.comment,
            job_title: job.title,
            sentiment,
        };
    });
}

// =====================================================
// FEATURE 9: Workload Status Overview
// =====================================================
export function getWorkloadStatus(): WorkloadStatus {
    return {
        ongoing_count: mockJobs.filter(j => j.status === 'ongoing').length,
        completed_count: mockJobs.filter(j => j.status === 'completed').length,
        pending_payments: mockPayments.filter(p => p.payment_status === 'pending').length,
    };
}

// =====================================================
// Dashboard Stats
// =====================================================
export function getDashboardStats(): DashboardStats {
    const paidPayments = mockPayments.filter(p => p.payment_status === 'paid');
    const pendingPayments = mockPayments.filter(p => p.payment_status === 'pending');

    return {
        total_jobs: mockJobs.length,
        total_clients: mockCustomers.length,
        total_revenue: paidPayments.reduce((a, p) => a + p.amount, 0),
        pending_amount: pendingPayments.reduce((a, p) => a + p.amount, 0),
        avg_completion_time: getAverageCompletionTime(),
        avg_job_value: Math.round(mockJobs.reduce((a, j) => a + j.total_amount, 0) / mockJobs.length),
    };
}

// =====================================================
// Top 3 Highest-Paying Clients
// =====================================================
export function getTopClients(): TopClient[] {
    return mockCustomers.map((c, idx) => {
        const clientJobs = mockJobs.filter((_, i) => (i % mockCustomers.length) === idx);
        return {
            id: c.id,
            name: c.name,
            total_spent: clientJobs.reduce((a, j) => a + j.total_amount, 0),
            job_count: clientJobs.length,
        };
    })
        .sort((a, b) => b.total_spent - a.total_spent)
        .slice(0, 3);
}
