import React, {useEffect} from 'react';
import ClinicCard from "../ClinicCard/ClinicCard";
import {useClinicsStore} from '@/stores/clinicsStore';

import {useCityStore} from '@/stores/cityStore';
import {ClinicCardSkeleton} from "@/components/Clinic/ClinicCard/ClinicCardSkeleton";
import {FiltersSection} from "@/components/Clinic/ClinicsFilterPage/FiltersSection";

// Loading skeleton for clinic cards

const ClinicsPage = () => {
    const { currentCityId } = useCityStore();
    const {
        fetchClinics,
        fetchAmenities,
        filteredClinics,
        loading,
        error
    } = useClinicsStore();

    useEffect(() => {
        // Fetch initial data
        fetchClinics(currentCityId);
        fetchAmenities(currentCityId);
    }, [fetchClinics, fetchAmenities, currentCityId]);

    return (
        <div className="container mx-auto py-6 px-4 md:px-6">
            {/* Error state */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={() => fetchClinics(currentCityId)}
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
            </div>

            {/* Десктопная версия */}
            <div className="hidden md:flex gap-6">
                <aside className="w-[280px] shrink-0">
                    <FiltersSection className="" />
                </aside>
                <main className="flex-1 space-y-4">
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
                </main>
            </div>
        </div>
    );
};

export default ClinicsPage;
