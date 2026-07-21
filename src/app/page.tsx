"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            router.replace("/dashboard");
        } else {
            router.replace("/login");
        }
    }, [router]);

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="animate-pulse text-sm text-gray-500 font-medium">Redirecting...</div>
        </div>
    );
}

