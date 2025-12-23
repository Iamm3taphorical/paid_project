"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Briefcase,
    CreditCard,
    Users,
    TrendingUp,
    Clock,
    AlertTriangle,
    CheckCircle,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Star,
    Loader2,
} from "lucide-react";
import {
    getDashboardStats,
    getPaymentAlerts,
    getMonthlyIncome,
    getTopClients,
    getWorkloadStatus,
    getServiceDemand,
    getReviewSentiments,
    mockJobs,
} from "@/lib/data";
import type {
    PaymentAlert,
    MonthlyIncome,
    WorkloadStatus,
    ServiceDemand,
    ReviewSentiment,
    DashboardStats,
    TopClient,
    Job,
} from "@/types";
import Link from "next/link";

export default function DashboardPage() {
    // State for API data
    const [stats, setStats] = useState<DashboardStats>(getDashboardStats());
    const [alerts, setAlerts] = useState<PaymentAlert[]>(getPaymentAlerts());
    const [monthlyIncome, setMonthlyIncome] = useState<MonthlyIncome[]>(getMonthlyIncome());
    const [topClients, setTopClients] = useState<TopClient[]>(getTopClients());
    const [workload, setWorkload] = useState<WorkloadStatus>(getWorkloadStatus());
    const [serviceDemand, setServiceDemand] = useState<ServiceDemand[]>(getServiceDemand());
    const [sentiments, setSentiments] = useState<ReviewSentiment[]>(getReviewSentiments());
    const [recentJobs, setRecentJobs] = useState<Job[]>(mockJobs.slice(0, 5));
    const [loading, setLoading] = useState(true);
    const [dataSource, setDataSource] = useState<'api' | 'mock'>('mock');

    // Fetch data from API endpoints
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all analytics data in parallel
                const [
                    alertsRes,
                    monthlyRes,
                    workloadRes,
                    demandRes,
                    sentimentRes,
                    jobsRes,
                    clientsRes,
                ] = await Promise.all([
                    fetch('/api/analytics/payment-alerts').then(r => r.json()).catch(() => null),
                    fetch('/api/analytics/monthly-income').then(r => r.json()).catch(() => null),
                    fetch('/api/analytics/workload-status').then(r => r.json()).catch(() => null),
                    fetch('/api/analytics/service-demand').then(r => r.json()).catch(() => null),
                    fetch('/api/analytics/review-sentiment').then(r => r.json()).catch(() => null),
                    fetch('/api/jobs').then(r => r.json()).catch(() => null),
                    fetch('/api/clients').then(r => r.json()).catch(() => null),
                ]);

                let usingApi = false;

                // Update state with API data if available
                if (alertsRes?.success && alertsRes.data) {
                    setAlerts(alertsRes.data);
                    usingApi = true;
                }

                if (monthlyRes?.success && monthlyRes.data) {
                    setMonthlyIncome(monthlyRes.data);
                    usingApi = true;
                }

                if (workloadRes?.success && workloadRes.data) {
                    setWorkload(workloadRes.data);
                    usingApi = true;
                }

                if (demandRes?.success && demandRes.data) {
                    setServiceDemand(demandRes.data);
                    usingApi = true;
                }

                if (sentimentRes?.success && sentimentRes.data) {
                    setSentiments(sentimentRes.data.reviews || []);
                    usingApi = true;
                }

                if (jobsRes?.success && jobsRes.data) {
                    setRecentJobs(jobsRes.data.slice(0, 5));

                    // Calculate stats from jobs data
                    const jobs = jobsRes.data;
                    const completedJobs = jobs.filter((j: Job) => j.status === 'completed');
                    const totalRevenue = completedJobs.reduce((sum: number, j: Job) => sum + j.total_amount, 0);
                    const pendingAmount = jobs
                        .filter((j: Job) => j.status === 'ongoing')
                        .reduce((sum: number, j: Job) => sum + j.total_amount, 0);

                    setStats(prev => ({
                        ...prev,
                        total_jobs: jobs.length,
                        total_revenue: totalRevenue,
                        pending_amount: pendingAmount,
                        avg_job_value: Math.round(jobs.reduce((s: number, j: Job) => s + j.total_amount, 0) / jobs.length),
                    }));
                    usingApi = true;
                }

                if (clientsRes?.success && clientsRes.data) {
                    // Calculate top clients from API data
                    setStats(prev => ({
                        ...prev,
                        total_clients: clientsRes.data.length,
                    }));
                    usingApi = true;
                }

                if (usingApi) {
                    setDataSource('api');
                }
            } catch (error) {
                console.log('Using mock data fallback:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Welcome to Freelance Pro - Project Management System
                    </p>
                </div>
                <Badge variant={dataSource === 'api' ? 'success' : 'secondary'} className="gap-1">
                    {loading && <Loader2 className="h-3 w-3 animate-spin" />}
                    {dataSource === 'api' ? '🔗 Live Database' : '📦 Mock Data'}
                </Badge>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Jobs</CardTitle>
                        <Briefcase className="h-4 w-4 text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_jobs}</div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <ArrowUpRight className="h-3 w-3 text-green-500" />
                            <span className="text-green-500">+12%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.total_revenue)}</div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <ArrowUpRight className="h-3 w-3 text-green-500" />
                            <span className="text-green-500">+8%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Payments</CardTitle>
                        <CreditCard className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.pending_amount)}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            {workload.pending_payments} payments pending
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Completion</CardTitle>
                        <Clock className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avg_completion_time} days</div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <ArrowDownRight className="h-3 w-3 text-green-500" />
                            <span className="text-green-500">-3 days</span> improvement
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Workload Status & Payment Alerts */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Feature 9: Workload Status Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-indigo-600" />
                            Workload Status
                        </CardTitle>
                        <CardDescription>Feature #9: Real-time project status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span>Ongoing Projects</span>
                                </div>
                                <span className="text-2xl font-bold">{workload.ongoing_count}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span>Completed Projects</span>
                                </div>
                                <span className="text-2xl font-bold">{workload.completed_count}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <span>Pending Payments</span>
                                </div>
                                <span className="text-2xl font-bold">{workload.pending_payments}</span>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-4">
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                                    <div
                                        className="bg-green-500 h-full"
                                        style={{ width: `${(workload.completed_count / stats.total_jobs) * 100}%` }}
                                    />
                                    <div
                                        className="bg-blue-500 h-full"
                                        style={{ width: `${(workload.ongoing_count / stats.total_jobs) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Feature 1: Payment Due Alerts */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            Payment Alerts
                        </CardTitle>
                        <CardDescription>Feature #1: Due within 7 days or overdue</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {alerts.length === 0 ? (
                                <div className="text-center py-4 text-slate-500">
                                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                                    <p>No urgent payment alerts</p>
                                </div>
                            ) : (
                                alerts.slice(0, 4).map((alert) => (
                                    <div
                                        key={alert.P_id}
                                        className={`p-3 rounded-lg border ${alert.is_overdue
                                            ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950'
                                            : 'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-sm">{alert.job_title}</p>
                                                <p className="text-xs text-slate-500">{alert.client_name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">{formatCurrency(alert.amount)}</p>
                                                <Badge variant={alert.is_overdue ? "destructive" : "warning"} className="text-xs">
                                                    {alert.is_overdue ? 'Overdue' : `${alert.days_until_due}d left`}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Clients & Monthly Income */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Top 3 Clients */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-indigo-600" />
                            Top 3 Highest-Paying Clients
                        </CardTitle>
                        <CardDescription>Clients ranked by total spending</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topClients.map((client, idx) => (
                                <div key={client.id} className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-slate-400' : 'bg-amber-700'
                                        }`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{client.name}</p>
                                        <p className="text-sm text-slate-500">{client.job_count} jobs</p>
                                    </div>
                                    <p className="font-bold text-green-600">{formatCurrency(client.total_spent)}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Feature 2: Monthly Income */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            Monthly Income
                        </CardTitle>
                        <CardDescription>Feature #2: Income comparison</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {monthlyIncome.slice(-6).map((income) => (
                                <div key={`${income.year}-${income.month}`} className="flex items-center gap-3">
                                    <div className="w-20 text-sm text-slate-500">
                                        {monthNames[income.month - 1]} {income.year}
                                    </div>
                                    <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                            style={{ width: `${(income.total_income / 15000) * 100}%` }}
                                        />
                                    </div>
                                    <div className="w-24 text-right font-medium">
                                        {formatCurrency(income.total_income)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Service Demand & Review Sentiment */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Feature 5: Service Demand */}
                <Card>
                    <CardHeader>
                        <CardTitle>Service Demand Analytics</CardTitle>
                        <CardDescription>Feature #5: Most requested services</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {serviceDemand.slice(0, 5).map((service, idx) => (
                                <div key={service.S_id} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{service.name}</p>
                                    </div>
                                    <Badge variant="secondary">{service.demand_count} jobs</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Feature 8: Review Sentiment */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            Review Sentiment
                        </CardTitle>
                        <CardDescription>Feature #8: Keyword-based analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {sentiments.slice(0, 4).map((review) => (
                                <div key={review.R_id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-medium text-sm">{review.job_title}</p>
                                        <Badge variant={
                                            review.sentiment === 'positive' ? 'success' :
                                                review.sentiment === 'negative' ? 'destructive' : 'secondary'
                                        }>
                                            {review.sentiment}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Jobs */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Recent Jobs</CardTitle>
                            <CardDescription>Latest project activity</CardDescription>
                        </div>
                        <Link href="/jobs">
                            <Button variant="outline" size="sm">View All</Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Title</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Amount</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentJobs.map((job) => (
                                    <tr key={job.J_id} className="border-b border-slate-100 dark:border-slate-800">
                                        <td className="py-3 px-4">
                                            <p className="font-medium">{job.title}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Badge variant={
                                                job.status === 'completed' ? 'success' :
                                                    job.status === 'ongoing' ? 'default' : 'secondary'
                                            }>
                                                {job.status}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4 font-medium">{formatCurrency(job.total_amount)}</td>
                                        <td className="py-3 px-4 text-slate-500 text-sm">
                                            {job.locations?.join(', ')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
