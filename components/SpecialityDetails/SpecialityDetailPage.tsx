'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import DoctorCard from '@/components/DoctorsList/DoctorCard/DoctorCard';
import { AppointmentTypeFilters } from '@/components/AppointmentTypeFilters/AppointmentTypeFilters';
import { Skeleton } from '@/components/shadcn/skeleton';
import { DoctorsPagination } from '@/components/DoctorsList/DoctorsPagination/DoctorsPagination';
import { useCityStore } from '@/shared/stores/cityStore';
import {SpecialitiesAPI} from "@/shared/api/specialityApi";
import {
    adaptSpecialityDoctorToCardFormat,
    getSpecialityTitleFromSlug
} from "@/components/SpecialityDetails/lib/specialityAdapters";
import {DoctorCardSkeleton} from "@/components/SpecialityDetails/DoctorCardSkeleton";

const PAGE_SIZE = 10;

const SpecialityDetailPage: React.FC = () => {
    const params = useParams();
    const specialitySlug = params?.slug as string;
    const [currentPage, setCurrentPage] = React.useState(1);
    const { currentCity } = useCityStore();

    // Получаем заголовок специальности из слага
    const specialityTitle = getSpecialityTitleFromSlug(specialitySlug);

    // Получаем данные врачей по специальности
    const { data, isLoading } = useQuery({
        queryKey: ['specialityDoctors', specialitySlug, currentCity?.id, currentPage],
        queryFn: () => SpecialitiesAPI.getDoctorsBySpeciality(
            currentCity?.id as number,
            specialitySlug,
            currentPage,
            PAGE_SIZE
        ),
        enabled: !!specialitySlug && !!currentCity?.id,
    });

    const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 0;

    // Обработчик для нажатия на номер страницы (с прокруткой)
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Обработчик для кнопок prev/next (без прокрутки)
    const handlePrevNext = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Врачи специальности: {specialityTitle}</h1>

            <AppointmentTypeFilters />

            <div className="space-y-4 mt-6">
                {isLoading ? (
                    Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <DoctorCardSkeleton key={i} />
                    ))
                ) : data?.results.length ? (
                    data.results.map((doctor) => {
                        const adaptedDoctor = adaptSpecialityDoctorToCardFormat(doctor);
                        return (
                            <DoctorCard
                                key={doctor.id}
                                {...adaptedDoctor}
                            />
                        );
                    })
                ) : (
                    <div className="p-8 text-center bg-white rounded-lg border">
                        <p className="text-lg text-gray-500">
                            По данной специальности врачи не найдены
                        </p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <DoctorsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onPrevNext={handlePrevNext}
                />
            )}
        </div>
    );
};

export default SpecialityDetailPage;
