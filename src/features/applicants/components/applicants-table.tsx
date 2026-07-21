"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { applicantsApi } from "../api/applicants-api";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ApplicantsTable() {
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading, error } = useQuery({
        queryKey: ["applicants", page, limit],
        queryFn: () => applicantsApi.getApplicants({ page, limit }),
    });

    if (isLoading) {
        return (
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 w-full animate-pulse rounded bg-gray-100" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                Failed to load applicants data.
            </div>
        );
    }

    const applicants = data?.data || [];
    const totalPages = data?.totalPages || 1;

    return (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Track</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Applied Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                        {applicants.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    No applicants found.
                                </td>
                            </tr>
                        ) : (
                            applicants.map((applicant) => (
                                <tr key={applicant.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">{applicant.fullName}</td>
                                    <td className="p-4 text-gray-600">{applicant.email}</td>
                                    <td className="p-4">{applicant.track}</td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {applicant.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500">
                                        {new Date(applicant.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t bg-gray-50 p-4">
                <span className="text-sm text-gray-600">
                    Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span>
                </span>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </button>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page >= totalPages}
                        className="inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}