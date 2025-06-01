// shared/api/clinicDoctorsApi.ts
import { apiGet } from '@/shared/api';

export interface DoctorSpeciality {
    doctor_speciality_id: number;
    medical_speciality_id: number;
    medical_speciality_title: string;
}

export interface DoctorProcedure {
    doctor_procedure_id: number;
    medical_procedure_id: number;
    medical_procedure_title: string;
}

export interface MinConsultation {
    medical_procedure_id: number;
    medical_procedure_title: string;
    default_price: number;
    discount: number;
    final_price: number;
}

export interface Schedule {
    date: string;
    room: string;
    floor_number: number;
    room_number: number;
    working_hours: string[];
}

export interface RatingInfo {
    average_rating: number;
    total_reviews: number;
}

export interface ClinicDoctor {
    id: number;
    full_name: string;
    gender: string;
    experience: number;
    categories: string[];
    specialities: DoctorSpeciality[];
    procedures: DoctorProcedure[];
    rating_info: RatingInfo;
    schedule: Schedule[];
    min_consultation: MinConsultation;
    main_photo_url?: string;
}

export interface ClinicDoctorsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ClinicDoctor[];
}

export interface ClinicDoctorsFilters {
    specialities?: number[];
    procedures?: number[];
    gender?: 'MALE' | 'FEMALE';
    page?: number;
    page_size?: number;
}

export const ClinicDoctorsAPI = {
    getDoctorsByClinic: (
        clinicSlug: string,
        filters: ClinicDoctorsFilters = {}
    ): Promise<ClinicDoctorsResponse> => {
        const params: Record<string, any> = {};

        // Добавляем фильтры в параметры запроса
        if (filters.specialities && filters.specialities.length > 0) {
            params.specialities = filters.specialities.join(',');
        }

        if (filters.procedures && filters.procedures.length > 0) {
            params.procedures = filters.procedures.join(',');
        }

        if (filters.gender) {
            params.gender = filters.gender;
        }

        if (filters.page) {
            params.page = filters.page;
        }

        if (filters.page_size) {
            params.page_size = filters.page_size;
        }

        return apiGet<ClinicDoctorsResponse>(
            `/patients_endpoints/clinics/${clinicSlug}/doctors/`,
            params
        );
    },

    // Получение специальностей врачей для фильтра (если нужен отдельный endpoint)
    getClinicSpecialities: (clinicSlug: string) =>
        apiGet<DoctorSpeciality[]>(`/patients_endpoints/clinics/${clinicSlug}/specialities/`),

    // Получение процедур врачей для фильтра (если нужен отдельный endpoint)
    getClinicProcedures: (clinicSlug: string) =>
        apiGet<DoctorProcedure[]>(`/patients_endpoints/clinics/${clinicSlug}/procedures/`)
} as const;
