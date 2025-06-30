// shared/api/specialitiesApi.ts
import { apiGet } from '@/shared/api';
import {DoctorsResponse} from "@/shared/api/doctorsApi";

export interface TimeSlot {
    start_time: string;
    end_time: string;
    time_slot_id: number;
    panel_colour: string;
}

export interface WeeklySchedule {
    date: string;
    clinic_title: string;
    clinic_id: number;
    time_slots: TimeSlot[];
}

export interface SpecialityDoctor {
    id: number;
    full_name: string;
    average_rating?: number;
    review_count: number;
    experience_years: number;
    franchise_title: string;
    categories: string[];
    today_clinic_address: string;
    weekly_schedule: WeeklySchedule[];
    procedure_name: string;
    procedure_price: any;
    procedure_discount: any;
    final_price: any;
    clinic_today_longitude: any;
    clinic_today_latitude: any;
    clinic_today_maps_links: any;
    main_photo_url?: string;
    slug?: string;
}

export interface SpecialityDoctorsResponse {
    count: number;
    next: string;
    previous: any;
    results: SpecialityDoctor[];
}

export interface Speciality {
    id: number;
    title: string;
    slug: string;
    description?: string;
    icon_url?: string;
}

export interface SpecialitiesResponse {
    count: number;
    next: string;
    previous: any;
    results: Speciality[];
}

export const SpecialitiesAPI = {
    // Получение списка всех специальностей
    getAllSpecialities: (cityId: number) =>
        apiGet<SpecialitiesResponse>(`/patients_endpoints/city_id:${cityId}/medical-specialities/`),

    // Получение списка врачей по специальности
    getDoctorsBySpeciality: (cityId: number, specialitySlug: string, page: number = 1, pageSize: number = 10) =>
        apiGet<DoctorsResponse>(
            `/patients_endpoints/doctors/city_id:${cityId}/medical-specialities/${specialitySlug}/?page=${page}&page_size=${pageSize}`
        ),

    // Получение деталей специальности по slug (если такой API существует)
    getSpecialityDetails: (cityId: number, specialitySlug: string) =>
        apiGet<{medical_speciality_title: string}>(`/patients_endpoints/doctors/city_id:${cityId}/medical-specialities/${specialitySlug}/categories_stat/`)
} as const;
