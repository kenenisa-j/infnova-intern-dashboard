"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard-api";
import { Users, Clock, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

export function DashboardSummary() {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["dashboard-summary"],
        queryFn: () => dashboardApi.getSummary(),
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-xl border bg-white p-6 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2 flex-1">
                                <div className="h-3.5 w-24 bg-gray-100 rounded-sm animate-pulse" />
                                <div className="h-8 w-12 bg-gray-100 rounded-sm animate-pulse" />
                            </div>
                            <div className="h-12 w-12 rounded-lg bg-gray-100 animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center space-y-3 shadow-xs animate-in fade-in duration-200">
                <p className="font-semibold text-red-800 text-sm">Failed to load dashboard summary statistics.</p>
                <button
                    onClick={() => refetch()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-300 rounded-lg text-xs font-semibold text-red-700 bg-white hover:bg-red-50 cursor-pointer transition-colors"
                >
                    <RotateCcw className="h-3 w-3" /> Retry Loading Stats
                </button>
            </div>
        );
    }

    const stats = [
        {
            title: "Total Applicants",
            value: data?.totalApplicants ?? 0,
            icon: Users,
            color: "text-blue-600 bg-blue-50 border-blue-100",
        },
        {
            title: "Pending Review",
            value: data?.byStatus?.pending ?? 0,
            icon: Clock,
            color: "text-amber-600 bg-amber-50 border-amber-100",
        },
        {
            title: "Accepted",
            value: data?.byStatus?.accepted ?? 0,
            icon: CheckCircle2,
            color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        },
        {
            title: "Rejected",
            value: data?.byStatus?.rejected ?? 0,
            icon: XCircle,
            color: "text-rose-600 bg-rose-50 border-rose-100",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div key={stat.title} className="rounded-xl border bg-white p-6 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`rounded-xl p-3 border ${stat.color}`}>
                            <Icon className="h-6 w-6" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}