"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MapPin, Calendar, DollarSign, TrendingUp, Plus, Pencil, Trash2,
    X, Loader2, RefreshCw, Check
} from "lucide-react";
import type { Job } from "@/types";

// Simple Modal Component
function Modal({ isOpen, onClose, title, children }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'ongoing' | 'completed' | 'cancelled'>('all');
    const [showModal, setShowModal] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [saving, setSaving] = useState(false);
    const [clients, setClients] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        total_amount: '',
        status: 'ongoing',
        locations: '',
        client_id: '',
        services: [] as number[]
    });

    // Fetch jobs from API
    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/jobs');
            const data = await res.json();
            if (data.success) {
                setJobs(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch clients and services for dropdowns
    const fetchDropdownData = async () => {
        try {
            const [clientsRes, servicesRes] = await Promise.all([
                fetch('/api/clients').then(r => r.json()),
                fetch('/api/services').then(r => r.json())
            ]);
            if (clientsRes.success) setClients(clientsRes.data);
            if (servicesRes.success) setServices(servicesRes.data);
        } catch (error) {
            console.error('Failed to fetch dropdown data:', error);
        }
    };

    useEffect(() => {
        fetchJobs();
        fetchDropdownData();
    }, []);

    // Calculate high value threshold
    const avgAmount = jobs.length > 0
        ? jobs.reduce((a, j) => a + j.total_amount, 0) / jobs.length
        : 0;

    const highValueJobs = jobs.filter(j => j.total_amount > avgAmount);

    // Filter jobs
    const filteredJobs = filter === 'all'
        ? jobs
        : jobs.filter(j => j.status === filter);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Open modal for new job
    const openNewJobModal = () => {
        setEditingJob(null);
        setFormData({
            title: '',
            description: '',
            total_amount: '',
            status: 'ongoing',
            locations: '',
            client_id: '',
            services: []
        });
        setShowModal(true);
    };

    // Open modal for editing
    const openEditModal = (job: Job) => {
        setEditingJob(job);
        setFormData({
            title: job.title,
            description: job.description || '',
            total_amount: job.total_amount.toString(),
            status: job.status,
            locations: job.locations?.join(', ') || '',
            client_id: '',
            services: []
        });
        setShowModal(true);
    };

    // Save job (create or update)
    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                total_amount: parseFloat(formData.total_amount),
                status: formData.status,
                locations: formData.locations.split(',').map(l => l.trim()).filter(l => l),
                client_id: formData.client_id ? parseInt(formData.client_id) : null,
                services: formData.services
            };

            const url = editingJob ? `/api/jobs/${editingJob.J_id}` : '/api/jobs';
            const method = editingJob ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                setShowModal(false);
                fetchJobs();
            } else {
                alert(data.error || 'Failed to save job');
            }
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save job');
        } finally {
            setSaving(false);
        }
    };

    // Delete job
    const handleDelete = async (jobId: number) => {
        if (!confirm('Are you sure you want to delete this job?')) return;

        try {
            const res = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                fetchJobs();
            } else {
                alert(data.error || 'Failed to delete job');
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    // Quick status update
    const updateStatus = async (jobId: number, newStatus: string) => {
        try {
            const res = await fetch(`/api/jobs/${jobId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                fetchJobs();
            }
        } catch (error) {
            console.error('Status update failed:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Jobs</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Manage all freelance projects
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchJobs} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button onClick={openNewJobModal} className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Job
                    </Button>
                </div>
            </div>

            {/* Feature 7: High-Value Project Detection */}
            {highValueJobs.length > 0 && (
                <Card className="border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-indigo-600" />
                            High-Value Projects
                        </CardTitle>
                        <CardDescription>
                            Feature #7: Projects above average value ({formatCurrency(avgAmount)})
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {highValueJobs.map((job) => (
                                <Badge key={job.J_id} variant="default" className="py-1.5 px-3">
                                    {job.title} - {formatCurrency(job.total_amount)}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Status Filter Tabs - NOW FUNCTIONAL */}
            <div className="flex gap-2 flex-wrap">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                >
                    All ({jobs.length})
                </Button>
                <Button
                    variant={filter === 'ongoing' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('ongoing')}
                >
                    Ongoing ({jobs.filter(j => j.status === 'ongoing').length})
                </Button>
                <Button
                    variant={filter === 'completed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('completed')}
                >
                    Completed ({jobs.filter(j => j.status === 'completed').length})
                </Button>
                <Button
                    variant={filter === 'cancelled' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('cancelled')}
                >
                    Cancelled ({jobs.filter(j => j.status === 'cancelled').length})
                </Button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
            )}

            {/* Jobs Grid */}
            {!loading && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredJobs.map((job) => (
                        <Card key={job.J_id} className="hover:shadow-lg transition-shadow group">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg line-clamp-1">{job.title}</CardTitle>
                                    <div className="flex items-center gap-1">
                                        <Badge variant={
                                            job.status === 'completed' ? 'success' :
                                                job.status === 'ongoing' ? 'default' : 'secondary'
                                        }>
                                            {job.status}
                                        </Badge>
                                    </div>
                                </div>
                                <CardDescription className="line-clamp-2">{job.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <DollarSign className="h-4 w-4" />
                                        <span className="font-semibold text-green-600">{formatCurrency(job.total_amount)}</span>
                                        {job.total_amount > avgAmount && (
                                            <Badge variant="outline" className="text-xs text-indigo-600 border-indigo-300">
                                                High Value
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(job.datetime)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <MapPin className="h-4 w-4" />
                                        <span>{job.locations?.join(', ') || 'Remote'}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    {job.status === 'ongoing' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 gap-1 text-green-600 border-green-300 hover:bg-green-50"
                                            onClick={() => updateStatus(job.J_id, 'completed')}
                                        >
                                            <Check className="h-3 w-3" />
                                            Complete
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="gap-1"
                                        onClick={() => openEditModal(job)}
                                    >
                                        <Pencil className="h-3 w-3" />
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="gap-1 text-red-600 border-red-300 hover:bg-red-50"
                                        onClick={() => handleDelete(job.J_id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredJobs.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-500">No jobs found</p>
                    <Button onClick={openNewJobModal} className="mt-4 gap-2">
                        <Plus className="h-4 w-4" />
                        Create your first job
                    </Button>
                </div>
            )}

            {/* Job Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingJob ? 'Edit Job' : 'New Job'}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                            placeholder="Project title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 h-24"
                            placeholder="Project description"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Amount ($) *</label>
                            <input
                                type="number"
                                value={formData.total_amount}
                                onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                placeholder="5000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                            >
                                <option value="ongoing">Ongoing</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Locations (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.locations}
                            onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                            placeholder="New York, Remote"
                        />
                    </div>

                    {!editingJob && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Client</label>
                            <select
                                value={formData.client_id}
                                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                            >
                                <option value="">Select a client</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 gap-2"
                            onClick={handleSave}
                            disabled={saving || !formData.title || !formData.total_amount}
                        >
                            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                            {editingJob ? 'Update Job' : 'Create Job'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
