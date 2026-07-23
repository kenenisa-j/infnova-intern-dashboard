import { api as axiosInstance } from "@/lib/axios";

export interface DashboardSummaryData {
    totalApplicants: number;
    byStatus: {
        pending: number;
        shortlisted: number;
        accepted: number;
        rejected: number;
    };
    byTrack: {
        frontend: number;
        backend: number;
        "ui-ux": number;
        "data-analytics": number;
        mobile: number;
    };
}

export const dashboardApi = {
    getSummary: async (params?: { delay?: number; simulateError?: boolean }): Promise<DashboardSummaryData> => {
        const response = await axiosInstance.get("/dashboard/summary", { params });
        return response.data;
    },
};