import { api as axiosInstance } from "@/lib/axios";

// Define TypeScript interfaces based on your API documentation
export interface ReferenceItem {
    id: string | number;
    name: string;
}

export const referenceApi = {
    getTracks: async (): Promise<ReferenceItem[]> => {
        const response = await axiosInstance.get("/tracks");
        const data = response.data;
        if (Array.isArray(data)) {
            return data.map((item, idx) =>
                typeof item === "string" ? { id: item, name: item } : { id: item.id ?? item.name ?? idx, name: item.name ?? item.title ?? String(item) }
            );
        }
        return [];
    },

    getStatuses: async (): Promise<ReferenceItem[]> => {
        const response = await axiosInstance.get("/application-statuses");
        const data = response.data;
        if (Array.isArray(data)) {
            return data.map((item, idx) =>
                typeof item === "string" ? { id: item, name: item } : { id: item.id ?? item.name ?? idx, name: item.name ?? item.title ?? String(item) }
            );
        }
        return [];
    },
};