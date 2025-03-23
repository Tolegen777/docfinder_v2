// src/shared/api/userProfileApi.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiGet, apiPut } from '@/shared/api/config/apiInstance';
import { useAuthStore } from '@/shared/stores/authStore';

// Типы для профиля пользователя
export interface UserProfile {
    id?: number;
    first_name: string;
    last_name?: string;
    middle_name?: string;
    phone_number: string;
    birth_date?: string;
    iin_number?: string;
}

// Тип для обновления профиля
export interface UpdateProfileParams {
    first_name: string;
    last_name?: string;
    middle_name?: string;
    phone_number: string;
    birth_date?: string;
    iin_number?: string;
}

/**
 * Хук для получения данных профиля пользователя
 */
export const useGetUserProfile = () => {
    return useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            return apiGet<UserProfile>('/patients_endpoints/authentication/me/');
        }
    });
};

/**
 * Хук для обновления профиля пользователя
 */
export const useUpdateUserProfile = () => {
    const { setAuth } = useAuthStore();

    return useMutation({
        mutationFn: async (data: UpdateProfileParams) => {
            return apiPut<UserProfile>('/patients_endpoints/authentication/me/', data);
        },
        onSuccess: (data) => {
            // Обновляем данные в сторе после успешного обновления
            setAuth(true, data);
        },
    });
};
