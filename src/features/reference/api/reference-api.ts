import { api as axiosInstance } from "@/lib/axios";

// Define TypeScript interfaces based on your API documentation
export interface ReferenceItem {
    id: string | number;
    name: string;
}

export interface ReferenceDataResponse {
    tracks: ReferenceItem[];
    statuses: ReferenceItem[];
}

export const referenceApi = {
    // Fetch tracks and statuses (adjust endpoints according to your /api/docs)
    getReferenceData: async (): Promise<ReferenceDataResponse> => {
        const response = await axiosInstance.get("/reference");
        return response.data;
    },
};