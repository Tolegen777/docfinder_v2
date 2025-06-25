'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DoctorsAPI } from '@/shared/api/doctorsApi';
import DoctorCard from "./DoctorCard/DoctorCard";
import { DoctorsPagination } from "@/components/DoctorsList/DoctorsPagination/DoctorsPagination";
import { useCityStore } from "@/shared/stores/cityStore";
import {DoctorCardSkeleton} from "@/components/DoctorsList/DoctorCard/DoctorCardSkeleton";

const PAGE_SIZE = 10;

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
            {/*<AppointmentTypeFilters />*/}

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
                            main_photo_url={doctor?.main_photo_url}
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
