"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    AlertTriangle,
    TrendingUp,
    Star,
    Clock,
    BarChart3,
    DollarSign,
    Zap,
    MessageSquare,
    Briefcase,
    CheckCircle,
    RefreshCw,
    Loader2,
    Eye,
    EyeOff,
    Settings2,
} from "lucide-react";

interface FeatureToggle {
    id: number;
    name: string;
    enabled: boolean;
    icon: any;
    color: string;
}

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);

    // Feature toggles
    const [features, setFeatures] = useState<FeatureToggle[]>([
        { id: 1, name: "Payment Due Alerts", enabled: true, icon: AlertTriangle, color: "text-yellow-600" },
        { id: 2, name: "Monthly/Yearly Income", enabled: true, icon: TrendingUp, color: "text-green-600" },
        { id: 3, name: "Client Reliability Score", enabled: true, icon: Star, color: "text-purple-600" },
        { id: 4, name: "Avg Completion Time", enabled: true, icon: Clock, color: "text-blue-600" },
        { id: 5, name: "Service Demand Analytics", enabled: true, icon: BarChart3, color: "text-indigo-600" },
        { id: 6, name: "Revenue by Service", enabled: true, icon: DollarSign, color: "text-emerald-600" },
        { id: 7, name: "High-Value Detection", enabled: true, icon: Zap, color: "text-orange-600" },
        { id: 8, name: "Review Sentiment", enabled: true, icon: MessageSquare, color: "text-pink-600" },
        { id: 9, name: "Workload Status", enabled: true, icon: Briefcase, color: "text-cyan-600" },
    ]);

    // Analytics data
    const [alerts, setAlerts] = useState<any[]>([]);
    const [monthlyIncome, setMonthlyIncome] = useState<any[]>([]);
    const [reliability, setReliability] = useState<any[]>([]);
    const [avgCompletionTime, setAvgCompletionTime] = useState<number>(0);
    const [serviceDemand, setServiceDemand] = useState<any[]>([]);
    const [serviceRevenue, setServiceRevenue] = useState<any[]>([]);
    const [highValueProjects, setHighValueProjects] = useState<any[]>([]);
    const [sentiments, setSentiments] = useState<any[]>([]);
    const [workload, setWorkload] = useState({ ongoing_count: 0, completed_count: 0, pending_payments: 0 });

    // Load saved toggles
    useEffect(() => {
        const savedToggles = localStorage.getItem('analytics_toggles');
        if (savedToggles) {
            const saved = JSON.parse(savedToggles);
            setFeatures(prev => prev.map(f => ({
                ...f,
                enabled: saved[f.id] !== undefined ? saved[f.id] : true
            })));
        }
    }, []);

    // Save toggles
    const toggleFeature = (id: number) => {
        setFeatures(prev => {
            const updated = prev.map(f =>
                f.id === id ? { ...f, enabled: !f.enabled } : f
            );
            const toggleState: Record<number, boolean> = {};
            updated.forEach(f => toggleState[f.id] = f.enabled);
            localStorage.setItem('analytics_toggles', JSON.stringify(toggleState));
            return updated;
        });
    };

    // Fetch all data
    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [
                alertsRes,
                monthlyRes,
                reliabilityRes,
                completionRes,
                demandRes,
                revenueRes,
                highValueRes,
                sentimentRes,
                workloadRes
            ] = await Promise.all([
                fetch('/api/analytics/payment-alerts').then(r => r.json()).catch(() => null),
                fetch('/api/analytics/monthly-income').then(r => r.json()).catch(() => null),
                fetch('/api/analytics/client-reliability').then(r => r.json()).catch(() => null),
                fetch('/api/analytics/completion-time').then(r => r.json()).catch(() => null),
                fetch('/api/analytics/service-demand').then(r => r.json()).catch(() => null),
                fetch('/api/analytics/service-revenue').then(r => r.json()).catch(() => null),
                fetch('/api/analytics/high-value-projects').then(r => r.json()).catch(() => null),
                fetch('/api/analytics/review-sentiment').then(r => r.json()).catch(() => null),
                fetch('/api/analytics/workload-status').then(r => r.json()).catch(() => null),
            ]);

            if (alertsRes?.success) setAlerts(alertsRes.data);
            if (monthlyRes?.success) setMonthlyIncome(monthlyRes.data);
            if (reliabilityRes?.success) setReliability(reliabilityRes.data);
            if (completionRes?.success) setAvgCompletionTime(completionRes.data?.avg_days || 0);
            if (demandRes?.success) setServiceDemand(demandRes.data);
            if (revenueRes?.success) setServiceRevenue(revenueRes.data);
            if (highValueRes?.success) setHighValueProjects(highValueRes.data?.high_value_projects || []);
            if (sentimentRes?.success) setSentiments(sentimentRes.data?.reviews || []);
            if (workloadRes?.success) setWorkload(workloadRes.data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const isFeatureEnabled = (id: number) => features.find(f => f.id === id)?.enabled ?? true;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        All 9 advanced analytics features with live SQL queries
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="success" className="gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Live Database
                    </Badge>
                    <Button
                        variant={showSettings ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowSettings(!showSettings)}
                        className="gap-2"
                    >
                        <Settings2 className="h-4 w-4" />
                        Customize
                    </Button>
                    <Button variant="outline" size="sm" onClick={fetchAllData} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* Feature Toggles Panel */}
            {showSettings && (
                <Card className="border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Customize Dashboard</CardTitle>
                        <CardDescription>Toggle which analytics features to display</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {features.map((feature) => (
                                <button
                                    key={feature.id}
                                    onClick={() => toggleFeature(feature.id)}
                                    className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${feature.enabled
                                            ? 'border-indigo-500 bg-white dark:bg-slate-800 shadow-md'
                                            : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 opacity-60'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${feature.enabled ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-slate-200 dark:bg-slate-700'
                                        }`}>
                                        <feature.icon className={`h-4 w-4 ${feature.enabled ? feature.color : 'text-slate-400'}`} />
                                    </div>
                                    <span className="text-xs font-medium text-center">#{feature.id}</span>
                                    {feature.enabled ? (
                                        <Eye className="h-3 w-3 text-green-500" />
                                    ) : (
                                        <EyeOff className="h-3 w-3 text-slate-400" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
            )}

            {!loading && (
                <>
                    {/* Feature 1: Payment Alerts */}
                    {isFeatureEnabled(1) && (
                        <Card className="transition-all duration-300 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Badge className="bg-yellow-500">1</Badge>
                                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                    Payment Due Alerts
                                </CardTitle>
                                <CardDescription>
                                    SQL: Payments where due_date ≤ CURDATE() + 7 days
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm"><strong>Result:</strong> {alerts.length} payments due soon or overdue</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Feature 2: Monthly Income */}
                    {isFeatureEnabled(2) && (
                        <Card className="transition-all duration-300 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Badge className="bg-green-500">2</Badge>
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                    Monthly/Yearly Income
                                </CardTitle>
                                <CardDescription>
                                    SQL: Aggregates Payment.amount by payment_date
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {monthlyIncome.map((m: any) => (
                                        <div key={`${m.year}-${m.month}`} className="flex items-center gap-3">
                                            <span className="w-16 text-sm">{monthNames[m.month - 1]} {m.year}</span>
                                            <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded transition-all duration-500"
                                                    style={{ width: `${Math.min((m.total_income / 15000) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <span className="w-20 text-right font-medium">{formatCurrency(m.total_income)}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Feature 3: Client Reliability */}
                    {isFeatureEnabled(3) && (
                        <Card className="transition-all duration-300 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Badge className="bg-purple-500">3</Badge>
                                    <Star className="h-5 w-5 text-purple-600" />
                                    Client Payment Reliability
                                </CardTitle>
                                <CardDescription>
                                    SQL: On-time payment percentage using multi-table JOIN
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {reliability.map((c: any) => (
                                        <div key={c.id} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 rounded">
                                            <span className="flex-1">{c.name}</span>
                                            <Badge variant={c.reliability_score >= 80 ? 'success' : c.reliability_score >= 50 ? 'warning' : 'destructive'}>
                                                {c.reliability_score}%
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Feature 4: Average Completion Time */}
                    {isFeatureEnabled(4) && (
                        <Card className="transition-all duration-300 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Badge className="bg-blue-500">4</Badge>
                                    <Clock className="h-5 w-5 text-blue-600" />
                                    Average Project Completion Time
                                </CardTitle>
                                <CardDescription>
                                    SQL: DATEDIFF between Job.datetime and Payment.payment_date
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-4">
                                    <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                        {avgCompletionTime}
                                    </p>
                                    <p className="text-slate-500 mt-1">average days to complete</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Feature 5: Service Demand */}
                        {isFeatureEnabled(5) && (
                            <Card className="transition-all duration-300 hover:shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Badge className="bg-indigo-500">5</Badge>
                                        <BarChart3 className="h-5 w-5 text-indigo-600" />
                                        Service Demand
                                    </CardTitle>
                                    <CardDescription>SQL: COUNT from Requires table</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {serviceDemand.slice(0, 5).map((s: any) => (
                                            <div key={s.S_id} className="flex items-center gap-2">
                                                <span className="flex-1 text-sm">{s.name}</span>
                                                <Badge variant="secondary">{s.demand_count} jobs</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Feature 6: Revenue by Service */}
                        {isFeatureEnabled(6) && (
                            <Card className="transition-all duration-300 hover:shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Badge className="bg-emerald-500">6</Badge>
                                        <DollarSign className="h-5 w-5 text-emerald-600" />
                                        Revenue by Service
                                    </CardTitle>
                                    <CardDescription>SQL: SUM(Payment.amount) grouped by Service</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {serviceRevenue.slice(0, 5).map((s: any) => (
                                            <div key={s.S_id} className="flex items-center gap-2">
                                                <span className="flex-1 text-sm">{s.name}</span>
                                                <span className="font-medium text-green-600">{formatCurrency(s.total_revenue)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Feature 7: High-Value Projects */}
                    {isFeatureEnabled(7) && (
                        <Card className="transition-all duration-300 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Badge className="bg-orange-500">7</Badge>
                                    <Zap className="h-5 w-5 text-orange-600" />
                                    High-Value Project Detection
                                </CardTitle>
                                <CardDescription>SQL: WHERE total_amount &gt; (SELECT AVG(total_amount) FROM Job)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {highValueProjects.map((j: any) => (
                                        <Badge key={j.J_id} variant="outline" className="py-1.5 border-orange-300 hover:bg-orange-50 transition-colors">
                                            {j.title}: {formatCurrency(j.total_amount)}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Feature 8: Review Sentiment */}
                    {isFeatureEnabled(8) && (
                        <Card className="transition-all duration-300 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Badge className="bg-pink-500">8</Badge>
                                    <MessageSquare className="h-5 w-5 text-pink-600" />
                                    Review Sentiment Indicator
                                </CardTitle>
                                <CardDescription>SQL: CASE expression with keyword matching</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2">
                                    {sentiments.slice(0, 5).map((r: any) => (
                                        <div key={r.R_id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded flex items-start gap-3">
                                            <Badge variant={r.sentiment === 'positive' ? 'success' : r.sentiment === 'negative' ? 'destructive' : 'secondary'}>
                                                {r.sentiment}
                                            </Badge>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-1">{r.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Feature 9: Workload Status */}
                    {isFeatureEnabled(9) && (
                        <Card className="transition-all duration-300 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Badge className="bg-cyan-500">9</Badge>
                                    <Briefcase className="h-5 w-5 text-cyan-600" />
                                    Workload Status Overview
                                </CardTitle>
                                <CardDescription>SQL: SUM(CASE) for status counts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                        <p className="text-3xl font-bold text-blue-600">{workload.ongoing_count}</p>
                                        <p className="text-sm text-slate-600">Ongoing</p>
                                    </div>
                                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                                        <p className="text-3xl font-bold text-green-600">{workload.completed_count}</p>
                                        <p className="text-sm text-slate-600">Completed</p>
                                    </div>
                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                                        <p className="text-3xl font-bold text-yellow-600">{workload.pending_payments}</p>
                                        <p className="text-sm text-slate-600">Pending Pay</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Summary */}
                    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200 dark:border-indigo-800">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {features.filter(f => f.enabled).length} of 9 Features Active
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        All data sourced from live MySQL database queries
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
