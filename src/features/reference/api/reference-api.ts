import { api as axiosInstance } from "@/lib/axios";

// Define TypeScript interfaces based on your API documentation
export interface ReferenceItem {
    id: string | number;
    name: string;
}

export const referenceApi = {
    getTracks: async (): Promise<ReferenceItem[]> => {
        const response = await axiosInstance.get("/tracks");
        // API response has a 'data' array envelope
        const data = response.data?.data || response.data;
        if (Array.isArray(data)) {
            return data.map((item, idx) => {
                if (typeof item === "string") {
                    return { id: item, name: item };
                }
                const val = item.value ?? item.id ?? idx;
                const lbl = item.label ?? item.name ?? String(item);
                return { id: val, name: lbl };
            });
        }
        return [];
    },

    getStatuses: async (): Promise<ReferenceItem[]> => {
        const response = await axiosInstance.get("/application-statuses");
        // API response has a 'data' array envelope
        const data = response.data?.data || response.data;
        if (Array.isArray(data)) {
            return data.map((item, idx) => {
                if (typeof item === "string") {
                    return { id: item, name: item };
                }
                const val = item.value ?? item.id ?? idx;
                const lbl = item.label ?? item.name ?? String(item);
                return { id: val, name: lbl };
            });
        }
        return [];
    },
};