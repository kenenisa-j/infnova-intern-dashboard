"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/features/auth/api/auth-api";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await authApi.login({ email, password });
            // Store the token safely in localStorage
            localStorage.setItem("accessToken", response.accessToken);
            // Redirect to dashboard
            router.push("/dashboard");
        } catch (error) {
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <form onSubmit={handleLogin} className="flex flex-col gap-4 p-8">
            <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2"
            />
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2"
            />
            <button type="submit" className="bg-blue-600 text-white p-2">
                Login
            </button>
        </form>
    );
}