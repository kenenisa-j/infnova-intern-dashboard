"use client";

import { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { applicantsApi, Applicant } from "@/features/applicants/api/applicants-api";
import { ArrowLeft, Mail, Calendar, Briefcase, ShieldCheck, Loader2 } from "lucide-react";
import { useStatuses } from "@/features/reference/api/use-reference";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ApplicantDetailPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const router = useRouter();
    const applicantId = resolvedParams.id;
    const queryClient = useQueryClient();

    const { data: applicant, isLoading, error } = useQuery({
        queryKey: ["applicant", applicantId],
        queryFn: () => applicantsApi.getApplicantById(applicantId),
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

            return { previousApplicant };
        },
        onError: (err, newStatus, context) => {
            // Rollback on failure
            if (context?.previousApplicant) {
                queryClient.setQueryData(["applicant", applicantId], context.previousApplicant);
            }
        },
        onSettled: () => {
            // Refetch to ensure server sync
            queryClient.invalidateQueries({ queryKey: ["applicant", applicantId] });
            queryClient.invalidateQueries({ queryKey: ["applicants"] });
        },
    });

    if (isLoading) {
        return (
            <div className="space-y-6 p-6 max-w-4xl mx-auto">
                <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-64 rounded-xl border bg-white p-6 shadow-sm animate-pulse" />
            </div>
        );
    }

    if (error || !applicant) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    Failed to load applicant details.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 max-w-4xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Applicants
            </button>

            {/* Profile Header Card */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{applicant.fullName}</h1>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center">
                                <Mail className="h-4 w-4 mr-1 text-gray-400" /> {applicant.email}
                            </span>
                            <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" /> Applied: {new Date(applicant.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> {applicant.status}
                        </span>
                    </div>
                </div>

                {/* Status Actions Bar */}
                <div className="mt-6 border-t pt-4 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mr-2">
                        Change Status:
                    </span>
                    {statuses.map((statusOption) => (
                        <button
                            key={statusOption.id}
                            onClick={() => updateStatus(statusOption.name)}
                            disabled={isUpdating || applicant.status === statusOption.name}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${applicant.status === statusOption.name
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                                } disabled:opacity-50`}
                        >
                            {statusOption.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Additional Details Section */}
            <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-gray-500" /> Application Track Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Track</p>
                        <p className="mt-1 text-base text-gray-900 font-medium">{applicant.track}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Applicant ID</p>
                        <p className="mt-1 text-base text-gray-900 font-mono">{applicant.id}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}