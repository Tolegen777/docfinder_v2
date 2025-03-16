// shared/api/procedureClinicsApi.ts
import { apiGet } from '@/shared/api';
import { Clinic, ClinicsResponse, mapClinicToCardProps } from '@/shared/api/clinicsApi';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export interface ProcedureClinicFilters {
    procedureSlug: string;
    page: number;
    pageSize: number;
}

export const ProcedureClinicsAPI = {
    getProcedureClinics: (filters: ProcedureClinicFilters) => {
        const { procedureSlug, page, pageSize } = filters;

        return apiGet<ClinicsResponse>(
            `/patients_endpoints/procedures/${procedureSlug}/clinics_list`,
            {
                page,
                page_size: pageSize
            }
        );
    }
} as const;

// Query keys for React Query
export const procedureClinicKeys = {
    all: ['procedureClinics'] as const,
    lists: () => [...procedureClinicKeys.all, 'list'] as const,
    list: (filters: ProcedureClinicFilters) => [...procedureClinicKeys.lists(), filters] as const,
};

// Helper function to transform API response for UI
export const mapProcedureClinicsResponse = (response: ClinicsResponse) => {
    return {
        clinics: response.results.map(clinic => ({
            ...clinic,
            cardProps: mapClinicToCardProps(clinic),
        })),
        totalCount: response.count,
    };
};
