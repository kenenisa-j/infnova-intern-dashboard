"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, LogOut, Menu, X } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-200`}>
                <div className="p-6 font-bold text-xl text-blue-600">INFNOVA Admin</div>
                <nav className="mt-6 px-4 space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded hover:bg-gray-100">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link href="/dashboard/applicants" className="flex items-center gap-3 p-3 rounded hover:bg-gray-100">
                        <Users size={20} /> Applicants
                    </Link>
                    <button onClick={() => {/* Add logout logic here */ }} className="flex items-center gap-3 p-3 w-full text-red-600 rounded hover:bg-red-50">
                        <LogOut size={20} /> Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col">
                <header className="h-16 bg-white border-b flex items-center px-4 md:px-8 justify-between">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
                        {isSidebarOpen ? <X /> : <Menu />}
                    </button>
                    <div className="font-medium">Applicant Management</div>
                </header>
                <main className="p-4 md:p-8">{children}</main>
            </div>
        </div>
    );
}