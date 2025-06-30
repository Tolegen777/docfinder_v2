import { apiGet } from '@/shared/api';
import {DoctorsResponse} from "@/shared/api/doctorsApi";

export interface ProcedureDoctorFilters {
    procedureSlug: string;
    page: number;
    pageSize: number;
    city?: number
}

export const ProcedureDoctorsAPI = {
    getProcedureDoctors: (filters: ProcedureDoctorFilters) => {
        const { procedureSlug, page, pageSize, city } = filters;

        return apiGet<DoctorsResponse>(
            `/patients_endpoints/procedures/${procedureSlug}/doctors_list`,
            {
                page,
                page_size: pageSize,
                city
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
