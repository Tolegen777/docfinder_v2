// src/entities/auth/api/authService.ts
import { useMutation } from '@tanstack/react-query';
import {apiGet, apiPost} from '@/shared/api/config/apiInstance';
import {useAuthStore} from "@/shared/stores/authStore";
import {tokenService} from "@/shared/lib/tokenService";

// Types
export interface LoginParams {
    phone_number: string;
    password: string;
}

export interface RegisterParams {
    phone_number: string;
    password?: string;
    first_name: string;
    last_name?: string;
    birth_date?: string;
}

export interface IUser extends RegisterParams {
    id?: number
    middle_name?: string
}

export interface AuthResponse {
    access: string;
    refresh: string;
}

export interface IRefreshPayload {
    refresh: string | null;
}

export interface IRefreshResponse {
    access: string;
}

// Новые интерфейсы для сброса и изменения пароля
export interface ResetPasswordParams {
    phone_number: string;
}

export interface ChangePasswordParams {
    current_password: string;
    new_password: string;
    confirm_new_password: string;
}

// Format phone number (remove spaces)
const formatPhoneNumber = (phoneNumber: string): string => {
    return phoneNumber.replace(/\s/g, '');
};

export const authApi = {
    refresh: (payload: IRefreshPayload) => apiPost<IRefreshResponse>('/patients_endpoints/authentication/token/refresh/', payload),
    resetPassword: (payload: ResetPasswordParams) => apiPost<{ message: string }>('/patients_endpoints/authentication/reset-password/', payload),
    changePassword: (payload: ChangePasswordParams) => apiPost<{ message: string }>('/patients_endpoints/authentication/change-password/', payload),
};

// Auth service hooks
export const useLogin = () => {
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: async (params: LoginParams) => {
            const formattedParams = {
                ...params,
                phone_number: formatPhoneNumber(params.phone_number),
            };

            return apiPost<AuthResponse>('/patients_endpoints/authentication/login/', formattedParams);
        },
        onSuccess: (data) => {
            // Store tokens
            tokenService.updateLocalTokenData(data.access, 'access_token');
            tokenService.updateLocalTokenData(data.refresh, 'refresh_token');

            // Update auth state
            setAuth(true);
        },
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: async (params: RegisterParams) => {
            const formattedParams = {
                ...params,
                phone_number: formatPhoneNumber(params.phone_number),
            };

            return apiPost('/patients_endpoints/authentication/register/', formattedParams);
        },
    });
};

export const useCheckAuth = () => {
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: async () => {
            // This endpoint is hypothetical - adjust based on your actual API
            return apiGet<IUser>('/patients_endpoints/authentication/me/');
        },
        onSuccess: (data) => {
            setAuth(true, data);
        },
        onError: () => {
            setAuth(false, null);
        },
    });
};

// Новые хуки для работы с паролем
export const useResetPassword = () => {
    return useMutation({
        mutationFn: async (params: ResetPasswordParams) => {
            const formattedParams = {
                ...params,
                phone_number: formatPhoneNumber(params.phone_number),
            };

            return authApi.resetPassword(formattedParams);
        },
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: async (params: ChangePasswordParams) => {
            return authApi.changePassword(params);
        },
    });
};
