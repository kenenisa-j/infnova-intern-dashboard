"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Skip auth check if we are already on the login page
        if (pathname === "/login") {
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem("accessToken");

        if (!token) {
            router.push("/login");
        } else {
            setIsAuthenticated(true);
            setIsLoading(false);
        }
    }, [pathname, router]);

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    return <>{children}</>;
}