import { create } from "zustand";

type AuthUser = unknown;

type AuthState = {
    user: AuthUser | null;
    isAuthenticated: boolean;
    setAuth: (payload: { user: AuthUser }) => void;
    clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    setAuth: ({ user }) =>
        set({
            user,
            isAuthenticated: true
        }),
    clearAuth: () =>
        set({
            user: null,
            isAuthenticated: false
        })
}));