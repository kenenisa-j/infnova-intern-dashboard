"use client";

import { ApplicantsTable } from "@/features/applicants/components/applicants-table";
import { ResetSessionButton } from "@/components/reset-session-button";

export default function ApplicantsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Internship Applicants</h1>
                    <p className="text-sm text-gray-600">
                        View, search, filter, and inspect detailed applicant profiles.
                    </p>
                </div>
                <div>
                    <ResetSessionButton />
                </div>
            </div>

            <ApplicantsTable />
        </div>
    );
}
