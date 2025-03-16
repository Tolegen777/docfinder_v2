// shared/api/queries/clinicQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet } from '@/shared/api';
import { ClinicsAPI, ClinicsResponse, Clinic, mapClinicToCardProps } from '@/shared/api/clinicsApi';
import { AmenitiesAPI, Amenity } from '@/shared/api/amenitiesApi';
import { SpecialtiesAPI, Specialty } from '@/shared/api/specialtiesApi';

// Query keys
export const clinicKeys = {
    all: ['clinics'] as const,
    lists: () => [...clinicKeys.all, 'list'] as const,
    list: (filters: ClinicFilters) => [...clinicKeys.lists(), filters] as const,
    amenities: (cityId: number) => [...clinicKeys.all, 'amenities', cityId] as const,
    specialties: (cityId: number) => [...clinicKeys.all, 'specialties', cityId] as const,
}

// Types
export interface ClinicFilters {
    cityId: number;
    page: number;
    pageSize: number;
    specialities?: number[];
    amenities?: number[];
    isOpenNow?: boolean;
}

// Hook for fetching clinics with filters
export const useClinics = (filters: ClinicFilters) => {
    return useQuery({
        queryKey: clinicKeys.list(filters),
        queryFn: async () => {
            const response = await ClinicsAPI.getClinics(
                filters.cityId,
                filters.page,
                filters.pageSize,
                {
                    specialities: filters.specialities,
                    amenities: filters.amenities,
                    is_open_now: filters.isOpenNow,
                }
            );

            // Transform clinic data for UI display
            const mappedClinics = response.results.map(clinic => ({
                ...clinic,
                cardProps: mapClinicToCardProps(clinic)
            }));

            return {
                clinics: mappedClinics,
                totalCount: response.count,
            };
        },
        // Only fetch when cityId is available
        enabled: !!filters.cityId,
    });
};

// Hook for fetching amenities
export const useAmenities = (cityId: number) => {
    return useQuery({
        queryKey: clinicKeys.amenities(cityId),
        queryFn: async () => {
            return await AmenitiesAPI.getAmenities(cityId);
        },
        // Only fetch when cityId is available
        enabled: !!cityId,
    });
};

// Hook for fetching specialties
export const useSpecialties = (cityId: number) => {
    return useQuery({
        queryKey: clinicKeys.specialties(cityId),
        queryFn: async () => {
            const specialtiesGroups = await SpecialtiesAPI.getSpecialties(cityId);
            // Flatten specialty groups to get a simple array of specialties
            return specialtiesGroups.flatMap(group => group.specialities);
        },
        // Only fetch when cityId is available
        enabled: !!cityId,
    });
};
