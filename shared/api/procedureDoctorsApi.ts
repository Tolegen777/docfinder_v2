import { apiGet } from '@/shared/api';

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

export interface ProcedureDoctor {
    id: number;
    full_name: string;
    rating: number;
    review_count: number;
    experience_years: number;
    categories: string[];
    franchise_title: string;
    today_clinic_address: string;
    weekly_schedule: WeeklySchedule[];
    procedure_name: string;
    procedure_price?: number;
    procedure_discount?: number;
    final_price?: number;
    clinic_today_longitude: any;
    clinic_today_latitude: any;
    clinic_today_maps_links: any;
    main_photo_url?: string;
}

export interface ProcedureDoctorsResponse {
    count: number;
    next: any;
    previous: any;
    results: ProcedureDoctor[];
}

export interface ProcedureDoctorFilters {
    procedureSlug: string;
    page: number;
    pageSize: number;
}

export const ProcedureDoctorsAPI = {
    getProcedureDoctors: (filters: ProcedureDoctorFilters) => {
        const { procedureSlug, page, pageSize } = filters;

        return apiGet<ProcedureDoctorsResponse>(
            `/patients_endpoints/procedures/${procedureSlug}/doctors_list`,
            {
                page,
                page_size: pageSize
            }
        );
    }
} as const;

// Query keys for React Query
export const procedureDoctorKeys = {
    all: ['procedureDoctors'] as const,
    lists: () => [...procedureDoctorKeys.all, 'list'] as const,
    list: (filters: ProcedureDoctorFilters) => [...procedureDoctorKeys.lists(), filters] as const,
};
