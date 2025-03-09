// shared/api/clinicDoctorsApi.ts
import { apiGet } from '@/shared/api';

export interface RatingInfo {
    average_rating: number;
    total_reviews: number;
}

export interface Schedule {
    date: string;
    room: string;
    floor_number: number;
    room_number: number;
    working_hours: string[];
}

export interface ClinicDoctor {
    id: number;
    full_name: string;
    experience: number;
    categories: string[];
    specialities: string[];
    rating_info: RatingInfo;
    schedule: Schedule[];
}

export interface ClinicDoctorsResponse {
    count: number;
    next: string;
    previous: any;
    results: ClinicDoctor[];
}

export const ClinicDoctorsAPI = {
    getDoctorsByClinic: (clinicSlug: string, page: number = 1, pageSize: number = 10) =>
        apiGet<ClinicDoctorsResponse>(`/patients_endpoints/clinics/${clinicSlug}/doctors/?page=${page}&page_size=${pageSize}`),
} as const;
