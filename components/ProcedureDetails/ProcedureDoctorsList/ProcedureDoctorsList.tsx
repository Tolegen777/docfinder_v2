'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/shadcn/button';
import { ProcedureDoctorsAPI, procedureDoctorKeys, ProcedureDoctor } from '@/shared/api/procedureDoctorsApi';
import ProcedureDoctorCard from './ProcedureDoctorCard';
import { DoctorCardSkeleton } from '@/components/DoctorsList/DoctorCard/DoctorCardSkeleton';

const pageSize = 10;

export const ProcedureDoctorsList = () => {
    const params = useParams();
    const procedureSlug = params?.slug as string;

    const [page, setPage] = useState(1);

    // State to store all loaded doctors
    const [allDoctors, setAllDoctors] = useState<ProcedureDoctor[]>([]);
    const [isFetchingNext, setIsFetchingNext] = useState(false);

    // Fetch initial doctors
    const {
        data: initialData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: [...procedureDoctorKeys.lists(), { procedureSlug, page: 1, pageSize }],
        queryFn: async () => {
            const response = await ProcedureDoctorsAPI.getProcedureDoctors({
                procedureSlug,
                page: 1,
                pageSize
            });

            return {
                doctors: response.results,
                totalCount: response.count
            };
        },
        enabled: !!procedureSlug
    });

    // Update allDoctors when initial data changes
    useEffect(() => {
        if (initialData?.doctors) {
            setAllDoctors(initialData.doctors);
        }
    }, [initialData]);

    // Function to load more doctors
    const loadMoreDoctors = async () => {
        if (isFetchingNext) return;

        const nextPage = page + 1;
        setIsFetchingNext(true);

        try {
            const response = await ProcedureDoctorsAPI.getProcedureDoctors({
                procedureSlug,
                page: nextPage,
                pageSize
            });

            setAllDoctors(prev => [...prev, ...response.results]);
            setPage(nextPage);
        } catch (error) {
            console.error("Error loading more doctors:", error);
        } finally {
            setIsFetchingNext(false);
        }
    };

    // Extract data
    const doctors = allDoctors || [];
    const totalCount = initialData?.totalCount || 0;

    // Calculate if there are more pages
    const hasMorePages = doctors.length < totalCount;

    // Handle "Show more" button click
    const handleShowMore = () => {
        loadMoreDoctors();
    };

    return (
        <div className="space-y-4">
            {/* Error state */}
            {isError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <p className="text-red-700">
                        {error instanceof Error ? error.message : 'Произошла ошибка при загрузке данных'}
                    </p>
                </div>
            )}

            {/* Loading state */}
            {isLoading && (
                <div className="space-y-4">
                    {Array(3).fill(null).map((_, index) => (
                        <DoctorCardSkeleton key={index} />
                    ))}
                </div>
            )}

            {/* Doctors list */}
            {!isLoading && doctors.length > 0 && (
                <div className="space-y-4">
                    {doctors.map((doctor) => (
                        <ProcedureDoctorCard
                            key={doctor.id}
                            doctor={doctor}
                            isPreventNavigation={false}
                        />
                    ))}
                </div>
            )}

            {/* No results state */}
            {!isLoading && doctors.length === 0 && (
                <div className="text-center py-8 bg-white rounded-xl shadow-sm p-8">
                    <p className="text-gray-500 mb-2">Врачи не найдены</p>
                    <p className="text-sm text-gray-400">К сожалению, нет врачей, выполняющих данную процедуру</p>
                </div>
            )}

            {/* "Show more" button */}
            {!isLoading && hasMorePages && (
                <div className="flex justify-center mt-6">
                    <Button
                        variant="outline"
                        className="w-full border border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-md py-3"
                        onClick={handleShowMore}
                        disabled={isFetchingNext}
                    >
                        <span className="flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="currentColor">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                            {isFetchingNext ? 'Загрузка...' : 'Показать еще'}
                        </span>
                    </Button>
                </div>
            )}
        </div>
    );
};
