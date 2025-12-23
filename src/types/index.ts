// Type definitions for Freelance Project Management System

export interface User {
    id: number;
    email: string;
    user_type: 'customer' | 'service_provider';
    name: string;
    created_at: string;
}

export interface Customer extends User {
    address: string;
    phone: string;
}

export interface ServiceProvider extends User {
    specialization: string;
    hourly_rate: number;
}

export interface Job {
    J_id: number;
    title: string;
    description: string;
    datetime: string;
    status: 'ongoing' | 'completed' | 'cancelled';
    total_amount: number;
    created_at: string;
    updated_at: string;
    locations?: string[];
}

export interface Service {
    S_id: number;
    name: string;
    description: string;
}

export interface Payment {
    P_id: number;
    due_date: string;
    method: 'bank_transfer' | 'credit_card' | 'cash' | 'online';
    payment_status: 'pending' | 'paid' | 'overdue' | 'cancelled';
    amount: number;
    payment_date: string | null;
    created_at: string;
}

export interface Review {
    R_id: number;
    date: string;
    comment: string;
}

// Analytics Types
export interface PaymentAlert {
    P_id: number;
    amount: number;
    due_date: string;
    job_title: string;
    client_name: string;
    days_until_due: number;
    is_overdue: boolean;
}

export interface MonthlyIncome {
    year: number;
    month: number;
    total_income: number;
}

export interface ClientReliability {
    id: number;
    name: string;
    reliability_score: number;
    total_payments: number;
    on_time_payments: number;
}

export interface ServiceDemand {
    S_id: number;
    name: string;
    demand_count: number;
}

export interface ServiceRevenue {
    S_id: number;
    name: string;
    total_revenue: number;
}

export interface ReviewSentiment {
    R_id: number;
    comment: string;
    job_title: string;
    sentiment: 'positive' | 'neutral' | 'negative';
}

export interface WorkloadStatus {
    ongoing_count: number;
    completed_count: number;
    pending_payments: number;
}

export interface DashboardStats {
    total_jobs: number;
    total_clients: number;
    total_revenue: number;
    pending_amount: number;
    avg_completion_time: number;
    avg_job_value: number;
}

export interface TopClient {
    id: number;
    name: string;
    total_spent: number;
    job_count: number;
}
