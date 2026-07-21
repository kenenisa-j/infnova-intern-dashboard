"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { applicantsApi } from "../api/applicants-api";
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import { useTracks, useStatuses } from "@/features/reference/api/use-reference";

export function ApplicantsTable() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Read current filters from URL or set defaults
    const page = Number(searchParams.get("page")) || 1;
    const limit = 10;
    const status = searchParams.get("status") || "";
    const track = searchParams.get("track") || "";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "createdAt:desc";

    // Fetch reference options for dropdown filters
    const { tracks } = useTracks();
    const { statuses } = useStatuses();
    const { data, isLoading, error } = useQuery({
        queryKey: ["applicants", { page, limit, status, track, search, sort }],
        queryFn: () => applicantsApi.getApplicants({ page, limit, status, track, search, sort }),
    });
    // Helper to update URL search parameters
    const updateQueryParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        // Reset to page 1 when filters change
        if (key !== "page") {
            params.set("page", "1");
        }
        router.push(`?${params.toString()}`);
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="h-12 w-full animate-pulse rounded-xl bg-gray-100" />
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 w-full animate-pulse rounded bg-gray-100" />
                        ))}
                    </div>
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
        <div className="space-y-4">
            {/* Filtering and Search Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-white p-4 shadow-sm">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => updateQueryParam("search", e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Status Filter */}
                    <select
                        value={status}
                        onChange={(e) => updateQueryParam("status", e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Statuses</option>
                        {statuses.map((s) => (
                            <option key={s.id} value={s.name}>
                                {s.name}
                            </option>
                        ))}
                    </select>

                    {/* Track Filter */}
                    <select
                        value={track}
                        onChange={(e) => updateQueryParam("track", e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Tracks</option>
                        {tracks.map((t) => (
                            <option key={t.id} value={t.name}>
                                {t.name}
                            </option>
                        ))}
                    </select>

                    {/* Sort By */}
                    <select
                        value={sort}
                        onChange={(e) => updateQueryParam("sort", e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="createdAt:desc">Newest First</option>
                        <option value="createdAt:asc">Oldest First</option>
                        <option value="fullName:asc">Name (A-Z)</option>
                    </select>
                </div>
            </div>

            {/* Table Structure */}
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
                                        No applicants match your filters.
                                    </td>
                                </tr>
                            ) : (
                                applicants.map((applicant) => (
                                    <tr
                                        key={applicant.id}
                                        onClick={() => router.push(`/dashboard/applicants/${applicant.id}`)}
                                        className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                                    >
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
                            onClick={() => updateQueryParam("page", String(page - 1))}
                            disabled={page <= 1}
                            className="inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                        </button>
                        <button
                            onClick={() => updateQueryParam("page", String(page + 1))}
                            disabled={page >= totalPages}
                            className="inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}