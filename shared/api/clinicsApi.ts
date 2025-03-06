// shared/api/clinicsApi.ts
import { apiGet } from '@/shared/api';

export interface Speciality {
    id: number;
    title: string;
    slug: string;
}

export interface Clinic {
    id: number;
    title: string;
    slug: string;
    franchise_title: string;
    address: string;
    longitude: string;
    latitude: string;
    yandex_maps_url: string;
    google_maps_url: string;
    two_gis_url: string;
    specialities: Speciality[];
    // Поля которые есть в верстке, но нет в API (мок)
    rating?: {
        stars: number;
        reviewCount: number;
    };
    discount?: {
        percentage: number;
        text: string;
    };
    schedule?: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    };
    specialists?: number;
    price?: number;
    timeUntilClose?: number;
    phoneNumber?: string;
}

export interface ClinicsResponse {
    count: number;
    next: string;
    previous: any;
    results: Clinic[];
}

export const ClinicsAPI = {
    getClinics: (cityId: number, filters?: { specialities?: number[], amenities?: number[] }) => {
        const url = `/patients_endpoints/clinics/city_id:${cityId}/all-clinics/`;

        // Создаем объект с query параметрами, которые не пустые
        const params: Record<string, any> = {};

        if (filters?.specialities && filters.specialities.length > 0) {
            params.specialities = filters.specialities;
        }

        if (filters?.amenities && filters.amenities.length > 0) {
            params.amenities = filters.amenities;
        }

        return apiGet<ClinicsResponse>(url, params);
    }
} as const;
