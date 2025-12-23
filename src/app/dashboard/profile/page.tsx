"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    User, Mail, Phone, MapPin, Lock, CreditCard, Building,
    Save, Loader2, Camera, DollarSign, Clock, Briefcase
} from "lucide-react";

interface Profile {
    id: number;
    email: string;
    name: string;
    user_type: string;
    specialization: string;
    hourly_rate: number;
    created_at: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'bank'>('profile');
    const [photoPreview, setPhotoPreview] = useState<string>('/api/placeholder/150/150');

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        specialization: '',
        hourly_rate: '',
        phone: '',
        address: ''
    });

    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [bankData, setBankData] = useState({
        bankName: '',
        accountName: '',
        accountNumber: '',
        routingNumber: '',
        accountType: 'checking'
    });

    // Fetch profile
    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/profile');
            const data = await res.json();
            if (data.success && data.data) {
                setProfile(data.data);
                setFormData({
                    name: data.data.name || '',
                    email: data.data.email || '',
                    specialization: data.data.specialization || '',
                    hourly_rate: data.data.hourly_rate?.toString() || '',
                    phone: '',
                    address: ''
                });
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
        // Load saved bank data from localStorage
        const savedBankData = localStorage.getItem('freelancer_bank_data');
        if (savedBankData) {
            setBankData(JSON.parse(savedBankData));
        }
        // Load saved photo
        const savedPhoto = localStorage.getItem('freelancer_photo');
        if (savedPhoto) {
            setPhotoPreview(savedPhoto);
        }
    }, []);

    // Handle photo upload
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setPhotoPreview(base64);
                localStorage.setItem('freelancer_photo', base64);
            };
            reader.readAsDataURL(file);
        }
    };

    // Save profile
    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    specialization: formData.specialization,
                    hourly_rate: parseFloat(formData.hourly_rate) || 0
                })
            });
            const data = await res.json();
            if (data.success) {
                // Save name to localStorage for sidebar display
                localStorage.setItem('freelancer_name', formData.name);
                alert('Profile updated successfully!');
                fetchProfile();
            } else {
                alert(data.error || 'Failed to update profile');
            }
        } catch (error) {
            alert('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    // Save password
    const handleSavePassword = async () => {
        if (securityData.newPassword !== securityData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        if (securityData.newPassword.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: securityData.newPassword
                })
            });
            const data = await res.json();
            if (data.success) {
                alert('Password updated successfully!');
                setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                alert(data.error || 'Failed to update password');
            }
        } catch (error) {
            alert('Failed to save password');
        } finally {
            setSaving(false);
        }
    };

    // Save bank details (localStorage for demo)
    const handleSaveBankDetails = () => {
        localStorage.setItem('freelancer_bank_data', JSON.stringify(bankData));
        alert('Bank details saved successfully!');
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Profile Header Card */}
            <Card className="border-indigo-200 dark:border-indigo-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Profile Photo */}
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg">
                                <img
                                    src={photoPreview}
                                    alt="Profile"
                                    className="w-full h-full object-cover bg-indigo-100"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '';
                                        (e.target as HTMLImageElement).className = 'w-full h-full bg-indigo-200 flex items-center justify-center';
                                    }}
                                />
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg">
                                <Camera className="h-4 w-4 text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {profile?.name || 'Freelancer'}
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400">{profile?.email}</p>
                            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                                <Badge variant="default" className="gap-1">
                                    <Briefcase className="h-3 w-3" />
                                    {profile?.specialization || 'Freelancer'}
                                </Badge>
                                <Badge variant="secondary" className="gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    ${profile?.hourly_rate || 0}/hr
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                <Button
                    variant={activeTab === 'profile' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('profile')}
                    className="gap-2"
                >
                    <User className="h-4 w-4" />
                    Profile
                </Button>
                <Button
                    variant={activeTab === 'security' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('security')}
                    className="gap-2"
                >
                    <Lock className="h-4 w-4" />
                    Security
                </Button>
                <Button
                    variant={activeTab === 'bank' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('bank')}
                    className="gap-2"
                >
                    <CreditCard className="h-4 w-4" />
                    Bank Details
                </Button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                        placeholder="Your name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Specialization</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                        placeholder="e.g., Web Development"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Hourly Rate ($)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="number"
                                        value={formData.hourly_rate}
                                        onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                        placeholder="75"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button onClick={handleSaveProfile} disabled={saving} className="gap-2">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Changes
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>Update your account password</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Current Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="password"
                                    value={securityData.currentPassword}
                                    onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                                    className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="password"
                                        value={securityData.newPassword}
                                        onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="password"
                                        value={securityData.confirmPassword}
                                        onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button onClick={handleSavePassword} disabled={saving} className="gap-2">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Update Password
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Bank Details Tab */}
            {activeTab === 'bank' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Bank Account Details</CardTitle>
                        <CardDescription>Add your payment information for receiving funds</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Bank Name</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={bankData.bankName}
                                        onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
                                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                        placeholder="Bank of America"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Account Holder Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={bankData.accountName}
                                        onChange={(e) => setBankData({ ...bankData, accountName: e.target.value })}
                                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Account Number</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={bankData.accountNumber}
                                        onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
                                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                        placeholder="••••••••1234"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Routing Number</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={bankData.routingNumber}
                                        onChange={(e) => setBankData({ ...bankData, routingNumber: e.target.value })}
                                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                        placeholder="021000021"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Account Type</label>
                                <select
                                    value={bankData.accountType}
                                    onChange={(e) => setBankData({ ...bankData, accountType: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                >
                                    <option value="checking">Checking</option>
                                    <option value="savings">Savings</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                <strong>Note:</strong> Bank details are stored locally for demo purposes.
                                In production, this would be securely encrypted and stored in the database.
                            </p>
                        </div>

                        <Button onClick={handleSaveBankDetails} className="gap-2">
                            <Save className="h-4 w-4" />
                            Save Bank Details
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
