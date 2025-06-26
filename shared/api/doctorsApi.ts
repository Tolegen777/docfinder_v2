// shared/api/doctorsApi.ts
import { apiGet } from '@/shared/api';

export interface MedicalCategory {
    medical_category_title: string;
    medical_category_id: string;
}

export interface MapsLinks {
    yandex: string;
    google: string;
    "2gis": string;
}

export interface WorkingHour {
    id: number;
    start_time: string;
    end_time: string;
}

export interface Schedule {
    clinic_title: string;
    clinic_address: string;
    maps_links: MapsLinks;
    working_hours: WorkingHour[];
    clinic_id: string;
}

export interface CurrentPrice {
    default_price: number;
    discount: number;
    final_price: number;
}

export interface Procedure {
    title: string;
    slug: string;
    current_price: CurrentPrice;
    medical_procedure_id?: string;
}

export interface Consultation {
    title: string;
    slug: string;
    current_price: CurrentPrice;
    medical_procedure_id?: string;
}

export interface Doctor {
    id: number;
    full_name: string;
    slug: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    gender: string;
    medical_categories: MedicalCategory[];
    experience_years: number;
    works_since: string;
    for_child: boolean;
    clinic_franchise: number;
    review_count: number;
    average_rating: any;
    clinic_today: string;
    clinic_today_address: string;
    schedule_today: Schedule[];
    schedule_tomorrow: Schedule[];
    schedule_day_after_tomorrow: Schedule[];
    procedures: Procedure[];
    consultations: Consultation[];
    main_photo_url?: string;
}

export interface DoctorsResponse {
    count: number;
    next: string;
    previous: any;
    results: Doctor[];
}

export interface TimeSlot {
    id: number;
    start_time: string;
    end_time?: string;
}

export const DoctorsAPI = {
    getDoctors: (cityId: number, page: number = 1, pageSize: number = 10) =>
        apiGet<DoctorsResponse>(`/patients_endpoints/city_id:${cityId}/all-doctors/?page=${page}&page_size=${pageSize}`),
} as const;
