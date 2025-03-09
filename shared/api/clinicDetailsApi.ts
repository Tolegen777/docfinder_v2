// shared/api/clinicsApi.ts
import { apiGet } from '@/shared/api';

export interface WorkingHour {
    id: number;
    weekday: string;
    open_time: string;
    close_time: string;
}

export interface Speciality {
    id: number;
    title: string;
    slug: string;
}

export interface RatingInfo {
    average_rating: number;
    total_reviews: number;
}

export interface Amenity {
    id: number;
    title: string;
}

export interface ClinicDetails {
    id: number;
    title: string;
    slug: string;
    address: string;
    city: number;
    longitude: string;
    latitude: string;
    yandex_maps_url: string;
    google_maps_url: string;
    two_gis_url: string;
    description_fragments: {
        id: number;
        title: string;
        content: string;
    }[];
    amenities: Amenity[];
    working_hours: WorkingHour[];
    specialities: Speciality[];
    procedures: string[];
    time_until_closing: string;
    rating_info: RatingInfo;
    // Дополнительные поля, которые используются в UI, но могут отсутствовать в API (м)
    metro?: string;
    bus_stop?: string;
    images?: string[];
    features?: { id: string; icon: string; title: string }[];
}

export const ClinicDetailsAPI = {
    getClinicBySlug: (clinicSlug: string) =>
        apiGet<ClinicDetails>(`/patients_endpoints/clinics/${clinicSlug}/`),
} as const;
