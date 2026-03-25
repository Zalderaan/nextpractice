import { create } from "zustand";

type AuthUser = unknown;

type AuthState = {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    setAuth: (payload: { user: AuthUser; accessToken: string }) => void;
    clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    setAuth: ({ user, accessToken }) =>
        set({
            user,
            accessToken,
            isAuthenticated: true
        }),
    clearAuth: () =>
        set({
            user: null,
            accessToken: null,
            isAuthenticated: false
        })
}));