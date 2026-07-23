import { api as axiosInstance } from "@/lib/axios";

export interface Applicant {
    id: string | number;
    fullName: string;
    email: string;
    track: string;
    status: string;
    createdAt?: string;
    applicationDate?: string;
}

export interface ApplicantsResponse {
    data: Applicant[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface GetApplicantsParams {
    page?: number;
    limit?: number;
    status?: string;
    track?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    delay?: number;
    simulateError?: boolean;
}

export const applicantsApi = {
    getApplicants: async (params: GetApplicantsParams): Promise<ApplicantsResponse> => {
        const cleanedParams: Record<string, any> = {};
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                cleanedParams[key] = value;
            }
        });
        const response = await axiosInstance.get("/applicants", { params: cleanedParams });
        return response.data;
    },

    getApplicantById: async (id: string | number, params?: { delay?: number; simulateError?: boolean }): Promise<Applicant> => {
        const response = await axiosInstance.get(`/applicants/${id}`, { params });
        return response.data;
    },

    updateApplicantStatus: async (id: string | number, status: string): Promise<Applicant> => {
        const response = await axiosInstance.patch(`/applicants/${id}/status`, { status });
        return response.data;
    },
};