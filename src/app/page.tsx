"use client";

import Link from "next/link";
import { TubesCursor } from "@/components/ui/tube-cursor";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Briefcase,
    CreditCard,
    Users,
    BarChart3,
    ArrowRight
} from "lucide-react";

export default function Home() {
    return (
        <div className="relative">
            {/* Hero Section with TubesCursor */}
            <div className="relative h-screen bg-slate-950">
                {/* TubesCursor Background */}
                <div className="absolute inset-0">
                    <TubesCursor
                        title="Freelance"
                        subtitle="Pro"
                        caption="Project Management System • CSE370"
                        initialColors={["#6366f1", "#8b5cf6", "#a855f7"]}
                        lightColors={["#60a5fa", "#a78bfa", "#c084fc", "#e879f9"]}
                        lightIntensity={180}
                        titleSize="text-6xl md:text-[80px]"
                        subtitleSize="text-4xl md:text-[60px]"
                        captionSize="text-sm md:text-base"
                        enableRandomizeOnClick={true}
                    />
                </div>

                {/* Navigation Overlay */}
                <nav className="absolute top-0 left-0 right-0 z-30 p-6">
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Briefcase className="h-8 w-8 text-indigo-400" />
                            <span className="text-xl font-bold text-white">FreelancePro</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard">
                                <Button variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* CTA Buttons */}
                <div className="absolute bottom-20 left-0 right-0 z-30 flex justify-center gap-4">
                    <Link href="/dashboard">
                        <Button size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30">
                            Enter Dashboard
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {/* Click hint */}
                <div className="absolute bottom-8 left-0 right-0 z-30 text-center">
                    <p className="text-white/60 text-sm animate-pulse">Click anywhere to change colors</p>
                </div>
            </div>

            {/* Features Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">
                        System Features
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                                <Briefcase className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Job Management</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Track projects, filter by status, and manage client requests with a comprehensive job management system.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                                <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Payment Tracking</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Monitor payment statuses, due dates, and receive automatic alerts for upcoming and overdue payments.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Advanced Analytics</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                9 sophisticated analytics features including income comparison, reliability scoring, and sentiment analysis.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Analytics Preview */}
            <section className="py-20 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-4 text-slate-900 dark:text-white">
                        9 Advanced Analytics Features
                    </h2>
                    <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
                        Built with MySQL queries using proper joins, subqueries, CASE expressions, and aggregation functions.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            "Payment Due Alerts",
                            "Monthly/Yearly Income",
                            "Client Reliability Score",
                            "Avg. Completion Time",
                            "Service Demand Analytics",
                            "Revenue by Service",
                            "High-Value Projects",
                            "Review Sentiment",
                            "Workload Status",
                        ].map((feature, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800"
                            >
                                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {idx + 1}
                                </div>
                                <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-slate-600 dark:text-slate-400">
                        CSE370 Database Project • Freelance Project Management System
                    </p>
                </div>
            </footer>
        </div>
    );
}
