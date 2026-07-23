"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Users, LogOut, Menu, X, Sparkles } from "lucide-react";
import { authApi } from "@/features/auth/api/auth-api";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("accessToken");
            router.push("/login");
        }
    };

    const isActive = (path: string) => {
        if (path === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar backdrop for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r flex flex-col justify-between transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-200 ease-out`}>
                <div>
                    <div className="p-6 border-b flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-blue-600 animate-pulse" />
                        <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            INFNOVA Admin
                        </span>
                    </div>
                    <nav className="mt-6 px-4 space-y-1.5">
                        <Link 
                            href="/dashboard" 
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                isActive("/dashboard") && pathname === "/dashboard"
                                    ? "bg-blue-50 text-blue-700 shadow-sm font-semibold"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                            <LayoutDashboard size={18} className={isActive("/dashboard") && pathname === "/dashboard" ? "text-blue-600" : "text-gray-400"} />
                            <span>Dashboard</span>
                        </Link>
                        <Link 
                            href="/dashboard/applicants" 
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                isActive("/dashboard/applicants")
                                    ? "bg-blue-50 text-blue-700 shadow-sm font-semibold"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                            <Users size={18} className={isActive("/dashboard/applicants") ? "text-blue-600" : "text-gray-400"} />
                            <span>Applicants</span>
                        </Link>
                    </nav>
                </div>
                <div className="p-4 border-t">
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                        <LogOut size={18} /> 
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b flex items-center px-4 md:px-8 sticky top-0 z-30">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                        className="md:hidden p-1.5 mr-3 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <div className="font-semibold text-gray-800">
                        Applicant Management
                    </div>
                </header>
                <main className="p-4 md:p-8 flex-1">{children}</main>
            </div>
        </div>
    );
}