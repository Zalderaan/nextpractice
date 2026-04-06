import { create } from "zustand";

// type AuthUser = {};

export interface AuthUser {
    _id: string;
    username: string;
    email: string;
    role: "user" | "admin";
    createdAt: Date;
    updatedAt: Date; // Add this to match Mongoose timestamps
    avatar: string;
}

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