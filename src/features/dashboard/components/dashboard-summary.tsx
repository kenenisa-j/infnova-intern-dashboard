"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard-api";
import { Users, Clock, CheckCircle2, XCircle } from "lucide-react";

export function DashboardSummary() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["dashboard-summary"],
        queryFn: () => dashboardApi.getSummary(),
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100 p-6 shadow-sm" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                Failed to load dashboard summary statistics.
            </div>
        );
    }

    const stats = [
        {
            title: "Total Applicants",
            value: data?.totalApplicants ?? 0,
            icon: Users,
            color: "text-blue-600 bg-blue-50",
        },
        {
            title: "Pending Review",
            value: data?.pendingApplicants ?? 0,
            icon: Clock,
            color: "text-amber-600 bg-amber-50",
        },
        {
            title: "Accepted",
            value: data?.acceptedApplicants ?? 0,
            icon: CheckCircle2,
            color: "text-emerald-600 bg-emerald-50",
        },
        {
            title: "Rejected",
            value: data?.rejectedApplicants ?? 0,
            icon: XCircle,
            color: "text-rose-600 bg-rose-50",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div key={stat.title} className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className={`rounded-lg p-3 ${stat.color}`}>
                                <Icon className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}