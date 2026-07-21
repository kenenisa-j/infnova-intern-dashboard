import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://infnova-intern.vercel.app/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add authorization token if available
api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("accessToken");
            // Exclude public auth endpoints from sending stale authorization tokens
            const isAuthEndpoint = config.url?.includes("/auth/login") || config.url?.includes("/auth/register");
            if (token && !isAuthEndpoint) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle global 401 Unauthorized errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== "undefined") {
            const isLoginRequest = error.config?.url?.includes("/auth/login");
            if (!isLoginRequest) {
                localStorage.removeItem("accessToken");
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);