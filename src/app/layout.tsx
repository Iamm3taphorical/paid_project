import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Freelance Pro - Project Management System",
    description: "A production-grade freelance project management system for CSE370",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen bg-background antialiased">
                {children}
            </body>
        </html>
    );
}
