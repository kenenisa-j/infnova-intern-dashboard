import { useQuery } from "@tanstack/react-query";
import { referenceApi } from "./reference-api";

export function useReferenceData() {
    return useQuery({
        queryKey: ["reference-data"],
        queryFn: () => referenceApi.getReferenceData(),
        staleTime: 1000 * 60 * 10, // Cache data for 10 minutes
    });
}

// Convenience hooks if you want them separated
export function useTracks() {
    const { data, ...rest } = useReferenceData();
    return {
        ...rest,
        tracks: data?.tracks || [],
    };
}

export function useStatuses() {
    const { data, ...rest } = useReferenceData();
    return {
        ...rest,
        statuses: data?.statuses || [],
    };
}