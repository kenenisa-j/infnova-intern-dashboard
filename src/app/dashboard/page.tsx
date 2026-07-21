"use client";

import { DashboardSummary } from "@/features/dashboard/components/dashboard-summary";
import { ApplicantsTable } from "@/features/applicants/components/applicants-table";
import { ResetSessionButton } from "@/components/reset-session-button";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-sm text-gray-600">
                        Monitor intern applications, track statuses, and manage candidates.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <ResetSessionButton />
                </div>
            </div>

            {/* Statistics Cards */}
            <DashboardSummary />

            {/* Recent Applicants Section */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Applicants Management</h2>
                <ApplicantsTable />
            </div>
        </div>
    );
}
