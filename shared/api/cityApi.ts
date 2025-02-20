// shared/api/cityApi.ts
import { apiGet } from '@/shared/api';

export interface City {
    id: number;
    title: string;
}

export const CitiesAPI = {
    getCities: () => apiGet<City[]>('/patients_endpoints/cities/')
} as const;
