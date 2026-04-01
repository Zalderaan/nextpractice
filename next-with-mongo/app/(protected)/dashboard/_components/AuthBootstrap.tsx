"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/app/(auth)/auth.stores";

export function AuthBootstrap() {
    const setAuth = useAuthStore((s) => s.setAuth);
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const didRun = useRef(false);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        (async () => {
            try {
                const res = await fetch("/api/auth/me", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                });

                const json = await res.json();
                if (res.ok && json?.data?.user) {
                    setAuth({ user: json.data.user });
                } else {
                    clearAuth();
                }
            } catch {
                clearAuth();
            }
        })();
    }, [setAuth, clearAuth]);

    return null;
}