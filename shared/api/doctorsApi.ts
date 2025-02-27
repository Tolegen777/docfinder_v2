// shared/api/doctorsApi.ts
import { apiGet } from '@/shared/api';

export interface Doctor {
    id: number;
    full_name: string;
    slug: string;
    medical_categories: { medical_category: number }[];
    experience_years: number;
    clinic_today: string;
    clinic_today_address: string;
    schedule_today: {
        clinic_title: string;
        clinic_address: string;
        maps_links: {
            yandex: string;
            google: string;
            "2gis": string;
        };
        working_hours: {
            id: number;
            start_time: string;
            end_time: string;
        }[];
    }[];
    schedule_tomorrow: any[];
    schedule_day_after_tomorrow: any[];
}

export interface DoctorsResponse {
    count: number;
    next: string;
    previous: any;
    results: Doctor[];
}

export const DoctorsAPI = {
    getDoctors: (cityId: number, page: number = 1, pageSize: number = 10) =>
        apiGet<DoctorsResponse>(`/patients_endpoints/city_id:${cityId}/all-doctors/?page=${page}&page_size=${pageSize}`),
} as const;
