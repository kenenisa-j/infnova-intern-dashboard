import { useQuery } from "@tanstack/react-query";
import { referenceApi } from "./reference-api";

export function useTracks() {
    const { data, ...rest } = useQuery({
        queryKey: ["tracks"],
        queryFn: () => referenceApi.getTracks(),
        staleTime: 1000 * 60 * 10,
    });
    return {
        ...rest,
        tracks: data || [],
    };
}

export function useStatuses() {
    const { data, ...rest } = useQuery({
        queryKey: ["application-statuses"],
        queryFn: () => referenceApi.getStatuses(),
        staleTime: 1000 * 60 * 10,
    });
    return {
        ...rest,
        statuses: data || [],
    };
}