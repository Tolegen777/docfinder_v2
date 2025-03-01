'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { DoctorsAPI } from '@/shared/api/doctorsApi';
import DoctorCard from "./DoctorCard/DoctorCard";
import { AppointmentTypeFilters } from "@/components/AppointmentTypeFilters/AppointmentTypeFilters";
import { Skeleton } from '@/components/shadcn/skeleton';
import {DoctorsPagination} from "@/components/DoctorsList/DoctorsPagination/DoctorsPagination";

const PAGE_SIZE = 10;

const DoctorCardSkeleton = () => (
    <div className="w-full max-w-[1181px] h-[300px] rounded-lg">
        <Skeleton className="w-full h-full" />
    </div>
);



export const DoctorsList = () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const cityId = Number(Cookies.get('selectedCity')) || 1;

    const { data, isLoading } = useQuery({
        queryKey: ['doctors', cityId, currentPage],
        queryFn: () => DoctorsAPI.getDoctors(cityId, currentPage, PAGE_SIZE),
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
            <AppointmentTypeFilters />

            <div className="space-y-4">
                {isLoading ? (
                    Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <DoctorCardSkeleton key={i} />
                    ))
                ) : (
                    data?.results.map((doctor) => (
                        <DoctorCard
                            key={doctor.id}
                            id={doctor.id}
                            full_name={doctor.full_name}
                            slug={doctor.slug}
                            medical_categories={doctor.medical_categories}
                            experience_years={doctor.experience_years}
                            clinic_today={doctor.clinic_today}
                            clinic_today_address={doctor.clinic_today_address}
                            schedule_today={doctor.schedule_today}
                            schedule_tomorrow={doctor.schedule_tomorrow}
                            schedule_day_after_tomorrow={doctor.schedule_day_after_tomorrow}
                        />
                    ))
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
