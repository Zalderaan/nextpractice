import { useAuthStore } from "@/app/(auth)/auth.stores";

type RetryOptions = RequestInit & { _retried?: boolean };

export async function authedFetch(input: string, init: RetryOptions = {}) {
    const { _retried = false, ...requestInit } = init;

    const token = useAuthStore.getState().accessToken;
    const headers = new Headers(requestInit.headers);

    if (token) headers.set("Authorization", "Bearer " + token);

    const res = await fetch(input, {
        ...requestInit,
        headers,
        credentials: "include",
    });

    if (res.status !== 401 || _retried) return res;

    const refreshed = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
    });

    if (!refreshed.ok) {
        useAuthStore.getState().clearAuth();
        return res;
    }

    const refreshJson: unknown = await refreshed.json();
    const newToken =
        typeof refreshJson === "object" &&
            refreshJson !== null &&
            "data" in refreshJson &&
            typeof (refreshJson as any).data === "object" &&
            (refreshJson as any).data !== null &&
            typeof (refreshJson as any).data.accessToken === "string"
            ? (refreshJson as any).data.accessToken
            : null;

    if (!newToken) return res;

    useAuthStore.getState().setAuth({
        user: useAuthStore.getState().user,
        accessToken: newToken,
    });

    const retryHeaders = new Headers(requestInit.headers);
    retryHeaders.set("Authorization", "Bearer " + newToken);

    return fetch(input, {
        ...requestInit,
        headers: retryHeaders,
        credentials: "include",
    });
}