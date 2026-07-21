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
        const response = await axiosInstance.get("/applicants", { params });
        return response.data;
    },
};