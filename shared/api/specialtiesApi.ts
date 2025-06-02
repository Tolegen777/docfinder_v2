// shared/api/specialtiesApi.ts
import { apiGet } from '@/shared/api';

export interface Specialty {
    id: number;
    title: string;
    slug: string;
    doctor_count: number;
}

export interface SpecialtyGroup {
    letter: string;
    specialities: Specialty[];
}

export const SpecialtiesAPI = {
    getSpecialties: (cityId: number) =>
        apiGet<SpecialtyGroup[]>(`/patients_endpoints/doctors/city_id:${cityId}/medical-specialities/`),
} as const;

export interface AllSpecialty {
    id: number;
    title: string;
    slug: string;
}

export const AllSpecialtiesAPI = {
    getAllSpecialties: () =>
        apiGet<AllSpecialty[]>('/patients_endpoints/all-specialities/'),
} as const;
