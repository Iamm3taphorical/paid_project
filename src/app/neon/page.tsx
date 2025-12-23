"use client";

import { NeonOrbs } from "@/components/ui/neon-orbs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, Briefcase } from "lucide-react";

export default function NeonOrbsDemo() {
    return (
        <div className="relative">
            {/* Navigation Overlay */}
            <nav className="absolute top-0 left-0 right-0 z-30 p-6">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Briefcase className="h-8 w-8 text-indigo-400" />
                        <span className="text-xl font-bold text-indigo-900 dark:text-white">FreelancePro</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="outline" className="gap-2">
                                Classic Theme
                            </Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="outline" className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700">
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Neon Orbs Background */}
            <NeonOrbs />

            {/* CTA Buttons - positioned over the NeonOrbs */}
            <div className="absolute bottom-24 left-0 right-0 z-30 flex justify-center gap-4">
                <Link href="/dashboard">
                    <Button size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30">
                        Enter Dashboard
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
