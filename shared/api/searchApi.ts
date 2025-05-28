// shared/api/searchApi.ts
import { apiGet } from '@/shared/api';

export interface SearchDoctor {
    id: number;
    full_name: string;
    slug: string;
    main_photo_url: string;
}

export interface SearchProcedure {
    id: number;
    title: string;
    slug: string;
    is_for_children: boolean;
    child_age_from: any;
    child_age_to: any;
}

export interface SearchClinic {
    id: number;
    title: string;
    slug: string;
    address: string;
}

export interface SearchResponse {
    doctors: SearchDoctor[];
    procedures: SearchProcedure[];
    clinics: SearchClinic[];
}

export const SearchAPI = {
    search: (cityId: number, query: string) =>
        apiGet<SearchResponse>(`/patients_endpoints/city_id:${cityId}/search/?query=${encodeURIComponent(query)}`),
} as const;
