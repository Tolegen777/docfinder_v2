// shared/api/queries/procedureClinicsQueries.ts
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { ProcedureClinicsAPI, ProcedureClinicFilters, procedureClinicKeys, mapProcedureClinicsResponse } from '@/shared/api/procedureClinicsApi';

// Basic hook for fetching procedure clinics with filters
export const useProcedureClinics = (filters: ProcedureClinicFilters) => {
    return useQuery({
        queryKey: procedureClinicKeys.list(filters),
        queryFn: async () => {
            const response = await ProcedureClinicsAPI.getProcedureClinics(filters);
            return mapProcedureClinicsResponse(response);
        },
        // Only fetch when procedureSlug is available
        enabled: !!filters.procedureSlug,
    });
};

// Hook for fetching procedure clinics with pagination
export const useProcedureClinicsPaginated = ({ procedureSlug, pageSize = 10 }: { procedureSlug: string, pageSize?: number }) => {
    return useQuery({
        queryKey: [...procedureClinicKeys.lists(), { procedureSlug, pageSize }],
        queryFn: async () => {
            // First page
            const firstPage = await ProcedureClinicsAPI.getProcedureClinics({
                procedureSlug,
                page: 1,
                pageSize
            });

            const mappedFirstPage = mapProcedureClinicsResponse(firstPage);

            return {
                clinics: mappedFirstPage.clinics,
                totalCount: mappedFirstPage.totalCount,
                currentPage: 1,
                hasMore: mappedFirstPage.clinics.length < mappedFirstPage.totalCount
            };
        },
        enabled: !!procedureSlug,
    });
};
