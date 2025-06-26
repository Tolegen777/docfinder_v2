// shared/api/doctorsApi.ts
import { apiGet } from '@/shared/api';

export interface MedicalCategory {
    medical_category_title: string;
    medical_category_id: string;
}

export interface ClinicTodayCoords {
    latitude: number;
    longitude: number;
}

export interface ClinicTodayMapsLinks {
    google_maps: string;
    yandex_maps: string;
    "2gis": string;
    openstreetmap: string;
}

export interface Procedure {
    medical_procedure_id: string;
    medical_procedure_title: string;
    medical_procedure_slug: string;
    doctor_procedure_id: string;
    doctor_procedure_default_price?: number;
    doctor_procedure_discount?: number;
    doctor_procedure_final_price?: number;
}

export interface Consultation {
    medical_procedure_id: string;
    medical_procedure_title: string;
    medical_procedure_slug: string;
    doctor_procedure_id: string;
    doctor_procedure_default_price: number;
    doctor_procedure_discount: number;
    doctor_procedure_final_price: number;
}

export interface WorkingHoursList {
    time_slot_start_time: string;
    time_slot_end_time: string;
    time_slot_id: string;
}

export interface Schedule {
    clinic_title: string;
    clinic_id: string;
    date: string;
    working_hours_list: WorkingHoursList[];
}

export interface WeeklySchedule {
    clinic_title: string;
    clinic_id: string;
    schedules: Schedule[];
}

export interface ClinicFranchise {
    clinic_franchise_title: string;
    clinic_franchise_id: string;
}

export interface Doctor {
    id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    slug: string;
    gender: string;
    for_child: boolean;
    experience_years: number;
    medical_categories: MedicalCategory[];
    specialities: string[];
    average_rating: number;
    review_count: number;
    clinic_today_title?: string;
    clinic_today_address?: string;
    clinic_today_coords?: ClinicTodayCoords;
    clinic_today_maps_links?: ClinicTodayMapsLinks;
    procedures: Procedure[];
    consultation: Consultation;
    weekly_schedule: WeeklySchedule[];
    main_photo_url?: string;
    clinic_franchise: ClinicFranchise;
    procedure_name: any;
    procedure_price: any;
    procedure_discount: any;
    procedure_final_price: any;
    description_fragments: any[];
    specialities_with_procedures: any[];
    main_procedure: any;
}

export interface DoctorsResponse {
    count: number;
    next: string;
    previous: any;
    results: Doctor[];
}

// Утилитарный тип для совместимости с существующим кодом
export interface TimeSlot {
    id: string; // теперь string
    start_time: string;
    end_time: string;
}

// Утилитарные функции для работы с новой структурой расписания
export const ScheduleUtils = {
    // Получить расписание на конкретную дату
    getScheduleForDate: (weeklySchedule: WeeklySchedule[], targetDate: string): Schedule | null => {
        for (const clinic of weeklySchedule) {
            const schedule = clinic.schedules.find(s => s.date === targetDate);
            if (schedule && schedule.working_hours_list.length > 0) {
                return schedule;
            }
        }
        return null;
    },

    // Получить все доступные даты из расписания
    getAvailableDates: (weeklySchedule: WeeklySchedule[]): string[] => {
        const dates = new Set<string>();
        weeklySchedule?.forEach(clinic => {
            clinic.schedules.forEach(schedule => {
                if (schedule.working_hours_list.length > 0) {
                    dates.add(schedule.date);
                }
            });
        });
        return Array.from(dates).sort();
    },

    // Преобразовать новую структуру временных слотов в совместимую со старым кодом
    convertToTimeSlots: (workingHoursList: WorkingHoursList[]): TimeSlot[] => {
        return workingHoursList.map(hour => ({
            id: hour.time_slot_id,
            start_time: hour.time_slot_start_time,
            end_time: hour.time_slot_end_time
        }));
    },

    // Получить сегодняшнюю дату в формате YYYY-MM-DD
    getTodayDate: (): string => {
        return new Date().toISOString().split('T')[0];
    },

    // Получить завтрашнюю дату
    getTomorrowDate: (): string => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    },

    // Получить послезавтрашнюю дату
    getDayAfterTomorrowDate: (): string => {
        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 2);
        return dayAfter.toISOString().split('T')[0];
    },
};

export const DoctorsAPI = {
    getDoctors: (cityId: number, page: number = 1, pageSize: number = 10) =>
        apiGet<DoctorsResponse>(`/patients_endpoints/city_id:${cityId}/all-doctors/?page=${page}&page_size=${pageSize}`),
} as const;
