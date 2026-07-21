import { api as axiosInstance } from "@/lib/axios";

export interface DashboardSummaryData {
    totalApplicants: number;
    pendingApplicants: number;
    acceptedApplicants: number;
    rejectedApplicants: number;
    // Add any other fields returned by your GET /dashboard/summary endpoint
}

export const dashboardApi = {
    getSummary: async (): Promise<DashboardSummaryData> => {
        const response = await axiosInstance.get("/dashboard/summary");
        return response.data;
    },
};