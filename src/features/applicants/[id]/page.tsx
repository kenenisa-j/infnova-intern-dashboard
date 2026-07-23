"use client";

import { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { applicantsApi, Applicant } from "@/features/applicants/api/applicants-api";
import { ArrowLeft, Mail, Calendar, Briefcase, ShieldCheck, Loader2, RotateCcw, ShieldAlert } from "lucide-react";
import { useStatuses } from "@/features/reference/api/use-reference";
import { toast } from "sonner";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ApplicantDetailPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const router = useRouter();
    const applicantId = resolvedParams.id;
    const queryClient = useQueryClient();

    const { data: applicant, isLoading, error, refetch } = useQuery({
        queryKey: ["applicant", applicantId],
        queryFn: () => applicantsApi.getApplicantById(applicantId),
        retry: false,
    });

    const { statuses } = useStatuses();

    // Optimistic Mutation Hook
    const { mutate: updateStatus, isPending: isUpdating } = useMutation({
        mutationFn: (newStatus: string) => applicantsApi.updateApplicantStatus(applicantId, newStatus),
        onMutate: async (newStatus) => {
            // Cancel outgoing refetches so they don't overwrite our optimistic update
            await queryClient.cancelQueries({ queryKey: ["applicant", applicantId] });

            // Snapshot the previous value
            const previousApplicant = queryClient.getQueryData<Applicant>(["applicant", applicantId]);

            // Optimistically update to the new value
            if (previousApplicant) {
                queryClient.setQueryData<Applicant>(["applicant", applicantId], {
                    ...previousApplicant,
                    status: newStatus,
                });
            }

            toast.info(`Updating status to ${newStatus}...`);

            return { previousApplicant };
        },
        onError: (err, newStatus, context) => {
            // Rollback on failure
            if (context?.previousApplicant) {
                queryClient.setQueryData(["applicant", applicantId], context.previousApplicant);
            }
            toast.error(`Failed to update status. Rolled back to ${context?.previousApplicant?.status || "previous"}.`);
        },
        onSuccess: (data, newStatus) => {
            toast.success(`Successfully updated applicant status to ${newStatus}!`);
        },
        onSettled: () => {
            // Refetch to ensure server sync
            queryClient.invalidateQueries({ queryKey: ["applicant", applicantId] });
            queryClient.invalidateQueries({ queryKey: ["applicants"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
        },
    });

    // Helper to format date safely
    const formatDate = (dateStr?: string, fallbackStr?: string) => {
        const dateVal = dateStr || fallbackStr;
        if (!dateVal) return "N/A";
        const dateObj = new Date(dateVal);
        return isNaN(dateObj.getTime()) ? "N/A" : dateObj.toLocaleDateString();
    };

    if (isLoading) {
        return (
            <div className="space-y-6 p-6 max-w-4xl mx-auto">
                <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
                <div className="rounded-xl border bg-white p-6 shadow-xs space-y-4 animate-pulse">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-2 flex-1">
                            <div className="h-6 w-1/3 bg-gray-200 rounded" />
                            <div className="h-4 w-1/2 bg-gray-100 rounded" />
                        </div>
                        <div className="h-8 w-24 bg-gray-200 rounded-full" />
                    </div>
                </div>
                <div className="rounded-xl border bg-white p-6 shadow-xs space-y-4 animate-pulse">
                    <div className="h-5 w-40 bg-gray-200 rounded" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                        <div className="space-y-2">
                            <div className="h-4 w-16 bg-gray-100 rounded" />
                            <div className="h-5 w-24 bg-gray-200 rounded" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-100 rounded" />
                            <div className="h-5 w-32 bg-gray-200 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !applicant) {
        return (
            <div className="p-6 max-w-4xl mx-auto space-y-4">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Applicants
                </button>
                <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center space-y-4 shadow-xs max-w-lg mx-auto animate-in fade-in duration-200">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                        <ShieldAlert className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-semibold text-red-950">Failed to load applicant details</h3>
                        <p className="text-sm text-red-700">Please check your network connection or try again.</p>
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-red-300 rounded-lg text-sm font-semibold text-red-700 bg-white hover:bg-red-50 cursor-pointer transition-colors shadow-2xs"
                    >
                        <RotateCcw className="h-4 w-4" /> Retry Loading
                    </button>
                </div>
            </div>
        );
    }

    // Color badges based on applicant status
    const statusLower = (applicant.status || "").toLowerCase();
    let badgeColor = "bg-gray-100 text-gray-800 border-gray-200";
    if (statusLower === "accepted") badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
    else if (statusLower === "rejected") badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
    else if (statusLower === "pending") badgeColor = "bg-amber-50 text-amber-700 border-amber-200";

    return (
        <div className="space-y-6 p-4 md:p-6 max-w-4xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-all group"
            >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-0.5 transition-transform" /> Back to Applicants
            </button>

            {/* Profile Header Card */}
            <div className="rounded-xl border bg-white p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{applicant.fullName}</h1>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2 text-sm text-gray-500">
                            <span className="flex items-center">
                                <Mail className="h-4 w-4 mr-1.5 text-gray-400" /> {applicant.email}
                            </span>
                            <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1.5 text-gray-400" /> Applied: {formatDate(applicant.applicationDate, applicant.createdAt)}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize ${badgeColor}`}>
                            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> {applicant.status}
                        </span>
                    </div>
                </div>

                {/* Status Actions Bar */}
                <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Update Status (Optimistic UI)
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                        {statuses.map((statusOption) => {
                            const optionLower = statusOption.name.toLowerCase();
                            const isCurrent = statusLower === optionLower;
                            let btnStyle = "bg-white text-gray-700 hover:bg-gray-50 border-gray-250 hover:text-gray-900";
                            
                            if (isCurrent) {
                                if (optionLower === "accepted") btnStyle = "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 hover:text-white";
                                else if (optionLower === "rejected") btnStyle = "bg-rose-600 text-white border-rose-600 hover:bg-rose-700 hover:text-white";
                                else if (optionLower === "pending") btnStyle = "bg-amber-500 text-white border-amber-500 hover:bg-amber-600 hover:text-white";
                                else btnStyle = "bg-gray-900 text-white border-gray-900";
                            }

                            return (
                                <button
                                    key={statusOption.id}
                                    onClick={() => updateStatus(statusOption.name)}
                                    disabled={isUpdating || isCurrent}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer shadow-2xs capitalize ${btnStyle} disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {statusOption.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Additional Details Section */}
            <div className="rounded-xl border bg-white p-6 shadow-xs space-y-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-gray-400" /> Application Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-100 pt-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Internship Track</p>
                        <p className="mt-1 text-base text-gray-800 font-semibold capitalize">{applicant.track}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Applicant ID</p>
                        <p className="mt-1 text-base text-gray-700 font-mono select-all bg-gray-50 px-2 py-1 rounded border inline-block text-xs">
                            {applicant.id}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}