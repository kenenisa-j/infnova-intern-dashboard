import { api } from "@/lib/axios";

export const authApi = {
    login: async (credentials: { email: string; password: string }) => {
        const { data } = await api.post("/auth/login", credentials);
        return data;
    },

    logout: async () => {
        return await api.post("/auth/logout");
    },
};