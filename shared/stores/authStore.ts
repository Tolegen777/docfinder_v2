// src/entities/auth/model/store/authStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {IUser} from "@/shared/api/authApi";

interface AuthState {
    user: IUser | null;
    isAuthenticated: boolean;

    setAuth: (isAuthenticated: boolean, user?: IUser | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                user: null,
                isAuthenticated: false,

                setAuth: (isAuthenticated, user = null) => {
                    set({ isAuthenticated, user });
                },

                logout: () => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');

                    set({
                        user: null,
                        isAuthenticated: false,
                    });
                },
            }),
            {
                name: 'auth-storage',
                partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
            }
        )
    )
);
