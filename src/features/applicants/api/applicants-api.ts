import { api as axiosInstance } from "@/lib/axios";

export interface Applicant {
    id: string | number;
    fullName: string;
    email: string;
    track: string;
    status: string;
    createdAt: string;
}

export interface ApplicantsResponse {
    data: Applicant[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface GetApplicantsParams {
    page?: number;
    limit?: number;
    status?: string;
    track?: string;
    search?: string;
    sort?: string;
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

    getApplicantById: async (id: string | number): Promise<Applicant> => {
        const response = await axiosInstance.get(`/applicants/${id}`);
        return response.data;
    },

    updateApplicantStatus: async (id: string | number, status: string): Promise<Applicant> => {
        const response = await axiosInstance.patch(`/applicants/${id}/status`, { status });
        return response.data;
    },
};