'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { ClinicDoctorsAPI } from '@/shared/api/clinicDoctorsApi';
import ClinicDoctorCard from "./ClinicDoctorCard";
import { AppointmentTypeFilters } from "@/components/AppointmentTypeFilters/AppointmentTypeFilters";
import { Skeleton } from '@/components/shadcn/skeleton';
import { DoctorsPagination } from "@/components/DoctorsList/DoctorsPagination/DoctorsPagination";

const PAGE_SIZE = 10;

const ClinicDoctorCardSkeleton = () => (
    <div className="w-full max-w-[1181px] p-4 md:p-5 bg-white rounded-lg border">
        <div className="flex flex-col lg:flex-row gap-5">
            {/* Left Column - Photo and Rating */}
            <div className="flex flex-row md:flex-col items-center space-y-2.5">
                <Skeleton className="w-[104px] h-[104px] rounded-full" />
                <div className="flex flex-col items-center gap-2">
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

                <div className="space-y-2.5 md:max-w-[370px]">
                    {Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} className="w-full h-[60px] rounded-lg" />
                    ))}
                </div>

                <div className="space-y-2.5">
                    <Skeleton className="w-[200px] h-5" />
                </div>

                <div className="flex flex-wrap gap-2.5 flex-col md:flex-row">
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

export const ClinicDoctorsList = () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const params = useParams();
    const clinicSlug = params?.slug as string;

    const { data, isLoading } = useQuery({
        queryKey: ['clinic-doctors', clinicSlug, currentPage],
        queryFn: () => ClinicDoctorsAPI.getDoctorsByClinic(clinicSlug, currentPage, PAGE_SIZE),
        enabled: !!clinicSlug
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
                        <ClinicDoctorCardSkeleton key={i} />
                    ))
                ) : (
                    data?.results.map((doctor) => (
                        <ClinicDoctorCard
                            key={doctor.id}
                            id={doctor.id}
                            full_name={doctor.full_name}
                            experience={doctor.experience}
                            categories={doctor.categories}
                            specialities={doctor.specialities}
                            rating_info={doctor.rating_info}
                            schedule={doctor.schedule}
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
