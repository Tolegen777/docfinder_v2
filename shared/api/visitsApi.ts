// src/shared/api/visitsApi.ts
import {useQuery} from '@tanstack/react-query';
import {apiGet} from '@/shared/api/config/apiInstance';

// Типы для API визитов
export interface VisitStatus {
    id: number;
    title: string;
}

export interface Clinic {
    id: number;
    title: string;
    address: string;
}

export interface DoctorProfile {
    id: number;
    full_name: string;
    gender: string;
    main_photo_url?: string;
}

export interface Procedure {
    id: number;
    title: string;
}

export interface Visit {
    id: number;
    clinic: Clinic;
    doctor_profile: DoctorProfile;
    procedure: Procedure;
    date: string;
    visit_time: number;
    visit_status: VisitStatus;
    is_child: boolean;
}

export interface VisitsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Visit[];
}

/**
 * Хук для получения списка визитов пользователя
 */
export const useGetVisits = (page: number = 1, pageSize: number = 10) => {
    return useQuery({
        queryKey: ['visits', page, pageSize],
        queryFn: async () => {
            return apiGet<VisitsResponse>(`/patients_endpoints/visits/?page=${page}&page_size=${pageSize}`);
        }
    });
};

/**
 * Утилита для конвертации номера временного слота в время
 */
export const formatVisitTime = (visitTime: number): string => {
    const hours = Math.floor(visitTime);
    const minutes = (visitTime % 1) * 60;

    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');

    return `${hoursStr}:${minutesStr}`;
};

/**
 * Утилита для форматирования даты
 */
export const formatVisitDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
};

/**
 * Утилита для определения категории визита по дате
 */
export const getVisitCategory = (dateString: string): 'upcoming' | 'past' | 'cancelled' => {
    const visitDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (visitDate >= today) {
        return 'upcoming';
    } else {
        return 'past';
    }
};

/**
 * Фильтрация визитов по категории
 */
export const filterVisitsByCategory = (visits: Visit[], category: 'upcoming' | 'past' | 'cancelled'): Visit[] => {
    return visits.filter(visit => {
        if (category === 'cancelled') {
            // Пока нет данных об отмененных, возвращаем пустой массив
            // Когда добавят статусы, можно будет проверять visit.visit_status.title
            return false;
        }

        return getVisitCategory(visit.date) === category;
    });
};
