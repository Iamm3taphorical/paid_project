"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CreditCard, RefreshCw, Loader2, Check, Clock } from "lucide-react";

interface Payment {
    P_id: number;
    amount: number;
    due_date: string;
    payment_date: string | null;
    payment_status: string;
    method: string;
    job_title?: string;
    client_name?: string;
    created_at: string;
}

interface PaymentAlert {
    P_id: number;
    amount: number;
    due_date: string;
    job_title: string;
    client_name: string;
    days_until_due: number;
    is_overdue: boolean;
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [alerts, setAlerts] = useState<PaymentAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    // Fetch payments from API
    const fetchPayments = async () => {
        setLoading(true);
        try {
            const [paymentsRes, alertsRes] = await Promise.all([
                fetch('/api/payments').then(r => r.json()),
                fetch('/api/analytics/payment-alerts').then(r => r.json())
            ]);

            if (paymentsRes.success) {
                setPayments(paymentsRes.data);
            }
            if (alertsRes.success) {
                setAlerts(alertsRes.data);
            }
        } catch (error) {
            console.error('Failed to fetch payments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'Not paid';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'credit_card': return '💳';
            case 'bank_transfer': return '🏦';
            case 'online': return '🌐';
            case 'cash': return '💵';
            default: return '💰';
        }
    };

    // Mark payment as paid
    const markAsPaid = async (paymentId: number) => {
        setUpdatingId(paymentId);
        try {
            const res = await fetch(`/api/payments/${paymentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ payment_status: 'paid' })
            });

            const data = await res.json();
            if (data.success) {
                fetchPayments(); // Refresh data
            } else {
                alert(data.error || 'Failed to update payment');
            }
        } catch (error) {
            console.error('Update failed:', error);
            alert('Failed to update payment');
        } finally {
            setUpdatingId(null);
        }
    };

    const totalPaid = payments.filter(p => p.payment_status === 'paid').reduce((a, p) => a + p.amount, 0);
    const totalPending = payments.filter(p => p.payment_status === 'pending').reduce((a, p) => a + p.amount, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Payments</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Track payment status and manage invoices
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchPayments} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Collected</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            {payments.filter(p => p.payment_status === 'paid').length} payments
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Amount</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            {payments.filter(p => p.payment_status === 'pending').length} payments
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{alerts.length}</div>
                        <p className="text-xs text-slate-500 mt-1">Due soon or overdue</p>
                    </CardContent>
                </Card>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
            )}

            {/* Feature 1: Payment Due Alerts */}
            {!loading && alerts.length > 0 && (
                <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                            <AlertTriangle className="h-5 w-5" />
                            Payment Alerts
                        </CardTitle>
                        <CardDescription>
                            Feature #1: Payments due within 7 days or overdue
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 md:grid-cols-2">
                            {alerts.map((alert) => (
                                <div
                                    key={alert.P_id}
                                    className={`p-4 rounded-lg border ${alert.is_overdue
                                        ? 'border-red-300 bg-red-100 dark:border-red-800 dark:bg-red-950'
                                        : 'border-yellow-300 bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-950'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">{alert.job_title}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{alert.client_name}</p>
                                            <p className="text-xs mt-1">Due: {formatDate(alert.due_date)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg">{formatCurrency(alert.amount)}</p>
                                            <Badge variant={alert.is_overdue ? "destructive" : "warning"}>
                                                {alert.is_overdue ? 'Overdue' : `${alert.days_until_due} days left`}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <Button
                                            size="sm"
                                            className="w-full gap-2 bg-green-600 hover:bg-green-700"
                                            onClick={() => markAsPaid(alert.P_id)}
                                            disabled={updatingId === alert.P_id}
                                        >
                                            {updatingId === alert.P_id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Check className="h-4 w-4" />
                                            )}
                                            Mark as Paid
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* All Payments Table */}
            {!loading && (
                <Card>
                    <CardHeader>
                        <CardTitle>All Payments</CardTitle>
                        <CardDescription>Complete payment history</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">ID</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Job</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Method</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Amount</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Due Date</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Payment Date</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((payment) => (
                                        <tr key={payment.P_id} className="border-b border-slate-100 dark:border-slate-800">
                                            <td className="py-3 px-4">#{payment.P_id}</td>
                                            <td className="py-3 px-4">
                                                <span className="text-sm">{payment.job_title || '-'}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="flex items-center gap-2">
                                                    <span>{getMethodIcon(payment.method)}</span>
                                                    <span className="capitalize">{payment.method.replace('_', ' ')}</span>
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-medium">{formatCurrency(payment.amount)}</td>
                                            <td className="py-3 px-4">{formatDate(payment.due_date)}</td>
                                            <td className="py-3 px-4">{formatDate(payment.payment_date)}</td>
                                            <td className="py-3 px-4">
                                                <Badge variant={
                                                    payment.payment_status === 'paid' ? 'success' :
                                                        payment.payment_status === 'pending' ? 'warning' : 'destructive'
                                                }>
                                                    {payment.payment_status}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                {payment.payment_status === 'pending' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="gap-1 text-green-600 border-green-300 hover:bg-green-50"
                                                        onClick={() => markAsPaid(payment.P_id)}
                                                        disabled={updatingId === payment.P_id}
                                                    >
                                                        {updatingId === payment.P_id ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <Check className="h-3 w-3" />
                                                        )}
                                                        Paid
                                                    </Button>
                                                )}
                                                {payment.payment_status === 'paid' && (
                                                    <span className="text-green-600 text-sm flex items-center gap-1">
                                                        <Check className="h-3 w-3" /> Done
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
