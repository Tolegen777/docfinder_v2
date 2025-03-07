'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DoctorsAPI } from '@/shared/api/doctorsApi';
import DoctorCard from "./DoctorCard/DoctorCard";
import { AppointmentTypeFilters } from "@/components/AppointmentTypeFilters/AppointmentTypeFilters";
import { Skeleton } from '@/components/shadcn/skeleton';
import { DoctorsPagination } from "@/components/DoctorsList/DoctorsPagination/DoctorsPagination";
import { useCityStore } from "@/stores/cityStore";

const PAGE_SIZE = 10;

const DoctorCardSkeleton = () => (
    <div className="w-full max-w-[1181px] p-4 md:p-5 bg-white rounded-lg border">
        <div className="flex flex-col lg:flex-row gap-5">
            {/* Left Column - Photo and Rating */}
            <div className="flex flex-row md:flex-col items-center space-y-2.5">
                <Skeleton className="w-[104px] h-[104px] rounded-full" />
                <div className="flex flex-col items-center gap-2">
                    <Skeleton className="w-[140px] h-4" />
                    <Skeleton className="w-[100px] h-4" />
                    <div className="flex space-x-0.5">
                        {Array(5).fill(0).map((_, i) => (
                            <Skeleton key={i} className="w-5 h-5 rounded-full" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Middle Column - Main Info */}
            <div className="flex-1 space-y-5">
                <Skeleton className="w-[60%] h-7 mb-2" />
                <Skeleton className="w-[80%] h-5" />
                <Skeleton className="w-[300px] h-10 rounded-lg" />

                <div className="space-y-2.5 md:max-w-[370px]">
                    {Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} className="w-full h-[60px] rounded-lg" />
                    ))}
                </div>

                <div className="space-y-2.5">
                    <Skeleton className="w-[200px] h-5" />
                    <Skeleton className="w-[300px] h-4" />
                </div>

                <div className="flex flex-wrap gap-2.5 flex-col md:flex-row">
                    <Skeleton className="w-[140px] h-10 rounded-lg" />
                    <Skeleton className="w-[140px] h-10 rounded-lg" />
                </div>
            </div>

            {/* Right Column */}
            <div className="lg:w-[453px] space-y-5">
                <Skeleton className="w-[90%] h-8" />
                <div className="space-y-4">
                    <div className="flex border-b border-[#CBD5E1] pb-2">
                        {Array(3).fill(0).map((_, i) => (
                            <Skeleton key={i} className="w-[80px] h-6 mx-2" />
                        ))}
                    </div>
                    <div className="grid grid-cols-4 gap-5">
                        {Array(12).fill(0).map((_, i) => (
                            <Skeleton key={i} className="w-full h-[40px] rounded-lg" />
                        ))}
                    </div>
                    <Skeleton className="w-full h-[50px] rounded-lg" />
                </div>
            </div>
        </div>
    </div>
);

export const DoctorsList = () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const { currentCity } = useCityStore()

    const { data, isLoading } = useQuery({
        queryKey: ['doctors', currentCity?.id, currentPage],
        queryFn: () => DoctorsAPI.getDoctors(currentCity?.id as number, currentPage, PAGE_SIZE),
        enabled: !!currentCity?.id
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
                            works_since={doctor.works_since}
                            for_child={doctor.for_child}
                            review_count={doctor.review_count}
                            average_rating={doctor.average_rating}
                            clinic_today={doctor.clinic_today}
                            clinic_today_address={doctor.clinic_today_address}
                            schedule_today={doctor.schedule_today}
                            schedule_tomorrow={doctor.schedule_tomorrow}
                            schedule_day_after_tomorrow={doctor.schedule_day_after_tomorrow}
                            procedures={doctor.procedures}
                            consultations={doctor.consultations}
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
