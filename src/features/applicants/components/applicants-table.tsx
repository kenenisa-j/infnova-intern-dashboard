"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { applicantsApi } from "../api/applicants-api";
import { ChevronLeft, ChevronRight, Search, RotateCcw } from "lucide-react";
import { useTracks, useStatuses } from "@/features/reference/api/use-reference";

export function ApplicantsTable() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Read current filters from URL or set defaults (use applicationDate:desc as default)
    const page = Number(searchParams.get("page")) || 1;
    const limit = 10;
    const status = searchParams.get("status") || "";
    const track = searchParams.get("track") || "";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "applicationDate:desc";

    // Fetch reference options for dropdown filters
    const { tracks } = useTracks();
    const { statuses } = useStatuses();

    // Local state for debounced search input
    const [searchInput, setSearchInput] = useState(search);

    // Sync local state when URL search param changes externally
    useEffect(() => {
        setSearchInput(search);
    }, [search]);

    // Debounce the search input update to the URL router
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== search) {
                updateQueryParam("search", searchInput);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    // Parse the sort param (e.g. "applicationDate:desc") into sortBy and sortOrder parameters for the API
    const [sortField, sortOrder] = sort.split(":");

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["applicants", { page, limit, status, track, search, sortBy: sortField, sortOrder }],
        queryFn: () => applicantsApi.getApplicants({ 
            page, 
            limit, 
            status, 
            track, 
            search, 
            sortBy: sortField,
            sortOrder: sortOrder
        }),
        retry: false,
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

    const handleClearFilters = () => {
        setSearchInput("");
        router.push("?");
    };

    // Helper to format date safely
    const formatDate = (dateStr?: string, fallbackStr?: string) => {
        const dateVal = dateStr || fallbackStr;
        if (!dateVal) return "N/A";
        const dateObj = new Date(dateVal);
        return isNaN(dateObj.getTime()) ? "N/A" : dateObj.toLocaleDateString();
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="h-14 w-full animate-pulse rounded-xl bg-white border" />
                <div className="rounded-xl border bg-white shadow-xs overflow-hidden">
                    <div className="h-10 bg-gray-50 border-b animate-pulse" />
                    <div className="p-4 space-y-4 divide-y divide-gray-150">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between gap-4 pt-4 first:pt-0">
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
                                    <div className="h-3.5 w-1/4 bg-gray-50 rounded animate-pulse" />
                                </div>
                                <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
                                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse hidden md:block" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center space-y-4 shadow-xs max-w-lg mx-auto animate-in fade-in duration-200">
                <div className="space-y-1">
                    <h3 className="text-base font-semibold text-red-950">Failed to load applicants</h3>
                    <p className="text-sm text-red-700">Please check your network connection or try again.</p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-red-300 rounded-lg text-sm font-semibold text-red-700 bg-white hover:bg-red-50 cursor-pointer transition-colors shadow-2xs"
                >
                    <RotateCcw className="h-4 w-4" /> Retry Loading
                </button>
            </div>
        );
    }

    const applicants = data?.data || [];
    // Read total pages from data.meta.totalPages
    const totalPages = data?.meta?.totalPages || 1;

    return (
        <div className="space-y-4">
            {/* Filtering and Search Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-white p-4 shadow-xs">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Status Filter */}
                    <select
                        value={status}
                        onChange={(e) => updateQueryParam("status", e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                        <option value="">All Statuses</option>
                        {statuses.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>

                    {/* Track Filter */}
                    <select
                        value={track}
                        onChange={(e) => updateQueryParam("track", e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                        <option value="">All Tracks</option>
                        {tracks.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                    </select>

                    {/* Sort By */}
                    <select
                        value={sort}
                        onChange={(e) => updateQueryParam("sort", e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                        <option value="applicationDate:desc">Newest First</option>
                        <option value="applicationDate:asc">Oldest First</option>
                        <option value="fullName:asc">Name (A-Z)</option>
                    </select>

                    {(status || track || search || sort !== "applicationDate:desc") && (
                        <button
                            onClick={handleClearFilters}
                            className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 transition-all font-medium"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-xl border bg-white shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-50/70 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Track</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Applied Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {applicants.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-400">
                                        No applicants match your filters.
                                    </td>
                                </tr>
                            ) : (
                                applicants.map((applicant) => {
                                    const statusLower = (applicant.status || "").toLowerCase();
                                    let badgeColor = "bg-gray-100 text-gray-800 border-gray-200";
                                    if (statusLower === "accepted") badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                                    else if (statusLower === "rejected") badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
                                    else if (statusLower === "pending") badgeColor = "bg-amber-50 text-amber-700 border-amber-200";

                                    return (
                                        <tr
                                            key={applicant.id}
                                            onClick={() => router.push(`/dashboard/applicants/${applicant.id}`)}
                                            className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
                                        >
                                            <td className="p-4 font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {applicant.fullName}
                                            </td>
                                            <td className="p-4 text-gray-500">{applicant.email}</td>
                                            <td className="p-4 text-gray-600 font-medium capitalize">{applicant.track}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${badgeColor}`}>
                                                    {applicant.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-400">
                                                {formatDate(applicant.applicationDate, applicant.createdAt)}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3">
                {applicants.length === 0 ? (
                    <div className="rounded-xl border bg-white p-8 text-center text-gray-400 shadow-xs">
                        No applicants match your filters.
                    </div>
                ) : (
                    applicants.map((applicant) => {
                        const statusLower = (applicant.status || "").toLowerCase();
                        let badgeColor = "bg-gray-100 text-gray-800 border-gray-200";
                        if (statusLower === "accepted") badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                        else if (statusLower === "rejected") badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
                        else if (statusLower === "pending") badgeColor = "bg-amber-50 text-amber-700 border-amber-200";

                        return (
                            <div
                                key={applicant.id}
                                onClick={() => router.push(`/dashboard/applicants/${applicant.id}`)}
                                className="rounded-xl border bg-white p-4 shadow-xs space-y-3 active:bg-gray-50/80 transition-colors cursor-pointer"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-base">{applicant.fullName}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">{applicant.email}</p>
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${badgeColor}`}>
                                        {applicant.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                                    <div>
                                        <span className="font-semibold text-gray-500">Track:</span> {applicant.track}
                                    </div>
                                    <div>
                                        Applied: {formatDate(applicant.applicationDate, applicant.createdAt)}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination Controls - Always Rendered */}
            <div className="flex items-center justify-between border-t bg-gray-50/50 rounded-xl border p-4 shadow-xs">
                <span className="text-sm text-gray-500 font-medium">
                    Page <span className="text-gray-900 font-semibold">{page}</span> of <span className="text-gray-900 font-semibold">{totalPages}</span>
                </span>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => updateQueryParam("page", String(page - 1))}
                        disabled={page <= 1}
                        className="inline-flex items-center px-3.5 py-1.5 border border-gray-250 rounded-lg text-xs font-semibold bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                        <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
                    </button>
                    <button
                        onClick={() => updateQueryParam("page", String(page + 1))}
                        disabled={page >= totalPages}
                        className="inline-flex items-center px-3.5 py-1.5 border border-gray-250 rounded-lg text-xs font-semibold bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                        Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}