import React, { useState, useEffect } from 'react';
import ClinicCard from "../ClinicCard/ClinicCard";
import { useCityStore } from '@/shared/stores/cityStore';
import { ClinicCardSkeleton } from "@/components/ClinicList/ClinicCard/ClinicCardSkeleton";
import { FiltersSection } from "@/components/ClinicList/ClinicsListPage/FiltersSection";
import { ClinicsPagination } from './ClinicsPagination';
import ClinicMapPreview from "@/components/ClinicList/ClinicCard/ClinicMapPreview";
import { useClinics, ClinicFilters } from '@/shared/api/queries/clinicQueries';
import {MaxWidthLayout} from "@/shared/ui/MaxWidthLayout";

export const ClinicsListPage = () => {
    const { currentCity } = useCityStore();
    const cityId = currentCity?.id as number;

    // State for filters and pagination
    const [filters, setFilters] = useState<ClinicFilters>({
        cityId,
        page: 1,
        pageSize: 10,
        specialities: [],
        amenities: [],
        isOpenNow: false,
    });

    // Update cityId in filters whenever it changes
    useEffect(() => {
        if (cityId) {
            setFilters(prev => ({
                ...prev,
                cityId
            }));
        }
    }, [cityId]);

    // Fetch clinics data with React Query
    const {
        data,
        isLoading,
        isError,
        error,
        refetch
    } = useClinics(filters);

    const clinics = data?.clinics || [];
    const totalCount = data?.totalCount || 0;
    console.log(clinics, 'BRO')

    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalCount / filters.pageSize);

    // Handler for filter changes
    const handleFilterChange = (filterKey: string, value: any) => {
        // Reset to page 1 when filters change
        setFilters(prev => ({
            ...prev,
            [filterKey]: value,
            page: 1
        }));
    };

    // Handler for page changes (with scroll)
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setFilters(prev => ({
                ...prev,
                page
            }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Handler for prev/next (without scroll)
    const handlePrevNext = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setFilters(prev => ({
                ...prev,
                page
            }));
        }
    };

    return (
        <MaxWidthLayout>
            {/* Clinic Map */}
            <ClinicMapPreview />

            {/* Error state */}
            {isError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <p className="text-red-700">{error instanceof Error ? error.message : 'Произошла ошибка при загрузке данных'}</p>
                    <button
                        onClick={() => refetch()}
                        className="text-red-600 underline mt-2"
                    >
                        Попробовать снова
                    </button>
                </div>
            )}

            {/* Mobile version */}
            <div className="md:hidden space-y-4">
                <FiltersSection
                    className="w-full"
                    filters={{
                        specialities: filters.specialities || [],
                        amenities: filters.amenities || [],
                        isOpenNow: filters.isOpenNow || false,
                        is24hours: false // Not implemented in backend
                    }}
                    onFilterChange={handleFilterChange}
                    isLoading={isLoading}
                />

                <div className="space-y-4">
                    {isLoading ? (
                        // Show skeletons while loading
                        Array(3).fill(null).map((_, index) => (
                            <ClinicCardSkeleton key={index} />
                        ))
                    ) : clinics.length > 0 ? (
                        // Show clinic results
                        clinics.map((clinic) => (
                            <ClinicCard
                                key={clinic.id}
                                slug={clinic?.slug}
                                id={clinic.id}
                                name={clinic.cardProps.name}
                                address={clinic.cardProps.address}
                                rating={clinic.cardProps.rating}
                                schedule={clinic.cardProps.schedule}
                                specialists={clinic.cardProps.specialists}
                                timeUntilClose={clinic.cardProps.timeUntilClose}
                                main_photo_url={clinic?.main_photo_url}
                                doctor_count={clinic?.doctor_count}
                            />
                        ))
                    ) : (
                        // No results state
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-2">Клиники не найдены</p>
                            <p className="text-sm text-gray-400">Попробуйте изменить параметры поиска</p>
                        </div>
                    )}
                </div>

                {/* Mobile pagination */}
                {!isLoading && totalPages > 1 && (
                    <ClinicsPagination
                        currentPage={filters.page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onPrevNext={handlePrevNext}
                    />
                )}
            </div>

            {/* Desktop version */}
            <div className="hidden md:flex gap-6">
                <aside className="w-[280px] shrink-0">
                    <FiltersSection
                        className=""
                        filters={{
                            specialities: filters.specialities || [],
                            amenities: filters.amenities || [],
                            isOpenNow: filters.isOpenNow || false,
                            is24hours: false // Not implemented in backend
                        }}
                        onFilterChange={handleFilterChange}
                        isLoading={isLoading}
                    />
                </aside>
                <main className="flex-1">
                    <div className="space-y-4">
                        {isLoading ? (
                            // Show skeletons while loading
                            Array(3).fill(null).map((_, index) => (
                                <ClinicCardSkeleton key={index} />
                            ))
                        ) : clinics.length > 0 ? (
                            // Show clinic results
                            clinics.map((clinic) => (
                                <ClinicCard
                                    key={clinic.id}
                                    id={clinic.id}
                                    slug={clinic?.slug}
                                    name={clinic.cardProps.name}
                                    address={clinic.cardProps.address}
                                    rating={clinic.cardProps.rating}
                                    schedule={clinic.cardProps.schedule}
                                    specialists={clinic.cardProps.specialists}
                                    timeUntilClose={clinic.cardProps.timeUntilClose}
                                    main_photo_url={clinic?.main_photo_url}
                                    doctor_count={clinic?.doctor_count}
                                />
                            ))
                        ) : (
                            // No results state
                            <div className="text-center py-8 bg-white rounded-xl shadow-sm p-8">
                                <p className="text-gray-500 mb-2">Клиники не найдены</p>
                                <p className="text-sm text-gray-400">Попробуйте изменить параметры поиска</p>
                            </div>
                        )}
                    </div>

                    {/* Desktop pagination */}
                    {!isLoading && totalPages > 1 && (
                        <ClinicsPagination
                            currentPage={filters.page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            onPrevNext={handlePrevNext}
                        />
                    )}
                </main>
            </div>
        </MaxWidthLayout>
    );
};
