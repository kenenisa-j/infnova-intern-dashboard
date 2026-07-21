import { api as axiosInstance } from "@/lib/axios";

export const sessionApi = {
    resetSession: async (): Promise<void> => {
        await axiosInstance.post("/session/reset");
    },
};