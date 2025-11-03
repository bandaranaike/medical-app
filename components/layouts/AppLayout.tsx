"use client";

import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/LogoutButton";
import { Loader2, Stethoscope, User } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin h-8 w-8" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-muted-foreground">Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
            {/* 🩺 Navbar */}
            <nav className="border-b border-border/40 bg-card/60 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto flex items-center justify-between h-16 px-4">
                    <div className="flex items-center gap-3">
                        <Stethoscope className="text-primary h-6 w-6" />
                        <Link href="/dashboard" className="font-semibold text-lg">
                            Next Medical Center
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className={cn(
                                "text-sm hover:text-primary transition-colors font-medium"
                            )}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/patients"
                            className="text-sm hover:text-primary transition-colors font-medium"
                        >
                            Patients
                        </Link>
                        <Link
                            href="/billing"
                            className="text-sm hover:text-primary transition-colors font-medium"
                        >
                            Billing
                        </Link>
                        <Link
                            href="/medicine"
                            className="text-sm hover:text-primary transition-colors font-medium"
                        >
                            Medicines
                        </Link>

                        <ThemeToggle />

                        <div className="flex items-center gap-2 ml-4">
                            <User className="h-4 w-4 text-primary" />
                            <span className="text-sm">{user.name}</span>
                        </div>

                        <LogoutButton />
                    </div>
                </div>
            </nav>

            {/* ✨ Animated Page Content */}
            <motion.main
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 container mx-auto p-6"
            >
                {children}
            </motion.main>

            {/* Footer */}
            <footer className="border-t border-border/40 text-center py-3 text-sm text-muted-foreground">
                © {new Date().getFullYear()} Next Medical Center
            </footer>
        </div>
    );
}
