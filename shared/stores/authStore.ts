// src/entities/auth/model/store/authStore.ts
import {create} from 'zustand';
import {IUser} from "@/shared/api/authApi";

interface AuthState {
    user: IUser | null;
    isAuthenticated: boolean;

    setAuth: (isAuthenticated: boolean, user?: IUser | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
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
            })
);
