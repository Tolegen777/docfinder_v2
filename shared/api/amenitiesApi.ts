// shared/api/amenitiesApi.ts
import { apiGet } from '@/shared/api';

export interface Amenity {
    id: number;
    title: string;
}

export const AmenitiesAPI = {
    getAmenities: (cityId: number) =>
        apiGet<Amenity[]>(`/patients_endpoints/clinics/city_id:${cityId}/all-amenities-in-the-city/`)
} as const;
