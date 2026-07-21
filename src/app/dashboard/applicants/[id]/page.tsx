"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { applicantsApi } from "@/features/applicants/api/applicants-api";
import { ArrowLeft, Mail, Calendar, Briefcase, ShieldCheck } from "lucide-react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ApplicantDetailPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const router = useRouter();
    const applicantId = resolvedParams.id;

    const { data: applicant, isLoading, error } = useQuery({
        queryKey: ["applicant", applicantId],
        queryFn: () => applicantsApi.getApplicantById(applicantId),
    });

    if (isLoading) {
        return (
            <div className="space-y-6 p-6">
                <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-64 rounded-xl border bg-white p-6 shadow-sm animate-pulse" />
            </div>
        );
    }

    if (error || !applicant) {
        return (
            <div className="p-6">
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
                    <div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> {applicant.status}
                        </span>
                    </div>
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