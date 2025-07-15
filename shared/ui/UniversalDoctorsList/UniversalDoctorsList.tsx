import React from 'react';
import {DoctorCardSkeleton} from "@/shared/ui/UniversalDoctorsList/DoctorCardSkeleton";
import DoctorCard from "@/shared/ui/UniversalDoctorsList/DoctorCard";
import {DoctorsPagination} from "@/shared/ui/UniversalDoctorsList/DoctorsPagination";
import {DoctorsResponse} from "@/shared/api/doctorsApi";
import {PAGE_SIZE} from "@/shared/constants/common";
import {EmptyDoctors} from "@/shared/ui/EmptyState/EmptyState";

interface Props {
    data: DoctorsResponse | undefined
    setCurrentPage: (currentPage: number) => void
    isLoading: boolean
    currentPage: number
    isPreventNavigation?: boolean
    useNextAvailableSchedule?: boolean; // Новый пропс
}

export const UniversalDoctorsList = ({
                                         data,
                                         setCurrentPage,
                                         isLoading,
                                         currentPage,
                                         isPreventNavigation,
                                         useNextAvailableSchedule = true // По умолчанию true
                                     }: Props) => {

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

    // Функция для определения используется ли next_available_schedule для конкретного врача
    const getScheduleInfo = (doctor: any) => {
        const hasCurrentSchedule = doctor?.weekly_schedule?.[0]?.schedules?.[0]?.working_hours_list?.length > 0;

        if (!useNextAvailableSchedule) {
            return {
                schedule: doctor?.weekly_schedule,
                isNextAvailable: false
            };
        }

        if (hasCurrentSchedule) {
            return {
                schedule: doctor?.weekly_schedule,
                isNextAvailable: false
            };
        } else {
            return {
                schedule: doctor?.next_available_schedule?.weekly_schedule || doctor?.weekly_schedule,
                isNextAvailable: !!doctor?.next_available_schedule?.weekly_schedule
            };
        }
    };

    if (!data?.results.length && !isLoading) {
        return <EmptyDoctors
            title="Врачи не найдены"
            message="Врачи не найдены. Попробуйте обновить страницу или зайти позже."
            actionLabel="Обновить страницу"
            onAction={() => window.location.reload()}
        />
    }

    return (
        <div>
            <div className="space-y-4">
                {isLoading ? (
                    Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <DoctorCardSkeleton key={i} />
                    ))
                ) : (
                    data?.results.map((doctor) => {
                        const { schedule, isNextAvailable } = getScheduleInfo(doctor);

                        return (
                            <DoctorCard
                                key={doctor.id}
                                id={doctor.id}
                                full_name={doctor.full_name}
                                slug={doctor.slug}
                                medical_categories={doctor.medical_categories}
                                specialities={doctor.specialities}
                                experience_years={doctor.experience_years}
                                review_count={doctor.review_count}
                                average_rating={doctor.average_rating}
                                clinic_today_title={doctor.clinic_today_title}
                                clinic_today_address={doctor.clinic_today_address}
                                clinic_today_coords={doctor.clinic_today_coords}
                                clinic_today_maps_links={doctor.clinic_today_maps_links}
                                weekly_schedule={schedule}
                                procedures={doctor.procedures}
                                consultation={doctor.consultation}
                                main_photo_url={doctor.main_photo_url}
                                isPreventNavigation={isPreventNavigation}
                                isNextAvailableSchedule={isNextAvailable}
                            />
                        );
                    })
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
