import React, { useEffect } from 'react';
import ClinicCard from "../ClinicCard/ClinicCard";
import { useClinicsStore } from '@/shared/stores/clinicsStore';

import { useCityStore } from '@/shared/stores/cityStore';
import { ClinicCardSkeleton } from "@/components/ClinicList/ClinicCard/ClinicCardSkeleton";
import { FiltersSection } from "@/components/ClinicList/ClinicsFilterPage/FiltersSection";
import { ClinicsPagination } from './ClinicsPagination';
import ClinicMapPreview from "@/components/ClinicList/ClinicCard/ClinicMapPreview";

export const ClinicsListPage = () => {
    const { currentCity } = useCityStore();
    const {
        fetchClinics,
        fetchAmenities,
        fetchSpecialties,
        filteredClinics,
        loading,
        error,
        totalCount,
        pageSize,
        currentPage,
        applyFilters
    } = useClinicsStore();

    useEffect(() => {
        // Загружаем исходные данные
        fetchClinics(currentCity?.id as number);
        fetchAmenities(currentCity?.id as number);
        fetchSpecialties(currentCity?.id as number);
    }, [fetchClinics, fetchAmenities, fetchSpecialties, currentCity?.id]);

    // Вычисляем общее количество страниц
    const totalPages = Math.ceil(totalCount / pageSize);

    // Обработчик для нажатия на номер страницы (с прокруткой)
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            applyFilters(currentCity?.id as number, page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Обработчик для кнопок prev/next (без прокрутки)
    const handlePrevNext = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            applyFilters(currentCity?.id as number, page);
        }
    };

    return (
        <div className="container mx-auto py-6 px-4 md:px-6">
            {/* Карта клиник */}
            <ClinicMapPreview />

            {/* Error state */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={() => fetchClinics(currentCity?.id as number)}
                        className="text-red-600 underline mt-2"
                    >
                        Попробовать снова
                    </button>
                </div>
            )}

            {/* Мобильная версия */}
            <div className="md:hidden space-y-4">
                <FiltersSection className="w-full" />

                <div className="space-y-4">
                    {loading ? (
                        // Show skeletons while loading
                        Array(3).fill(null).map((_, index) => (
                            <ClinicCardSkeleton key={index} />
                        ))
                    ) : filteredClinics.length > 0 ? (
                        // Show filtered results with mapped data from cardProps
                        filteredClinics.map((clinic) => (
                            <ClinicCard
                                key={clinic.id}
                                slug={clinic?.slug}
                                id={clinic.id}
                                name={clinic.cardProps.name}
                                address={clinic.cardProps.address}
                                rating={clinic.cardProps.rating}
                                discount={clinic.cardProps.discount}
                                schedule={clinic.cardProps.schedule}
                                specialists={clinic.cardProps.specialists}
                                price={clinic.cardProps.price}
                                timeUntilClose={clinic.cardProps.timeUntilClose}
                                phoneNumber={clinic.cardProps.phoneNumber}
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

                {/* Пагинация для мобильной версии */}
                {!loading && totalPages > 1 && (
                    <ClinicsPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onPrevNext={handlePrevNext}
                    />
                )}
            </div>

            {/* Десктопная версия */}
            <div className="hidden md:flex gap-6">
                <aside className="w-[280px] shrink-0">
                    <FiltersSection className="" />
                </aside>
                <main className="flex-1">
                    <div className="space-y-4">
                        {loading ? (
                            // Show skeletons while loading
                            Array(3).fill(null).map((_, index) => (
                                <ClinicCardSkeleton key={index} />
                            ))
                        ) : filteredClinics.length > 0 ? (
                            // Show filtered results with mapped data from cardProps
                            filteredClinics.map((clinic) => (
                                <ClinicCard
                                    key={clinic.id}
                                    id={clinic.id}
                                    slug={clinic?.slug}
                                    name={clinic.cardProps.name}
                                    address={clinic.cardProps.address}
                                    rating={clinic.cardProps.rating}
                                    discount={clinic.cardProps.discount}
                                    schedule={clinic.cardProps.schedule}
                                    specialists={clinic.cardProps.specialists}
                                    price={clinic.cardProps.price}
                                    timeUntilClose={clinic.cardProps.timeUntilClose}
                                    phoneNumber={clinic.cardProps.phoneNumber}
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

                    {/* Пагинация для десктопной версии */}
                    {!loading && totalPages > 1 && (
                        <ClinicsPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            onPrevNext={handlePrevNext}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};
