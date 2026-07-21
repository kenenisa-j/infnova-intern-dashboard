"use client";

import { useMutation } from "@tanstack/react-query";
import { sessionApi } from "@/features/session/api/session-api";
import { RotateCcw } from "lucide-react";

export function ResetSessionButton() {
    const { mutate: resetSession, isPending } = useMutation({
        mutationFn: () => sessionApi.resetSession(),
        onSuccess: () => {
            localStorage.removeItem("accessToken");
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        },
        onError: (error) => {
            console.error("Failed to reset session:", error);
        },
    });

    return (
        <button
            onClick={() => resetSession()}
            disabled={isPending}
            className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-50 transition-colors"
        >
            <RotateCcw className={`h-4 w-4 mr-2 ${isPending ? "animate-spin" : ""}`} />
            {isPending ? "Resetting Session..." : "Reset Session"}
        </button>
    );
}