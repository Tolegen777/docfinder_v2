// components/ClinicDetails/ClinicDoctorsList/ClinicDoctorsList.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { ClinicDoctorsAPI, ClinicDoctorsFilters } from '@/shared/api/clinicDoctorsApi';
import ClinicDoctorCard from "./ClinicDoctorCard";
import { DoctorsFilters } from './DoctorsFilters';
import { Skeleton } from '@/components/shadcn/skeleton';
import { DoctorsPagination } from "@/components/DoctorsList/DoctorsPagination/DoctorsPagination";
import { MaxWidthLayout } from '@/shared/ui/MaxWidthLayout';

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
    const params = useParams();
    const clinicSlug = params?.slug as string;

    // Состояние фильтров
    const [filters, setFilters] = useState<ClinicDoctorsFilters>({
        page: 1,
        page_size: PAGE_SIZE
    });

    // Запрос списка врачей
    const { data, isLoading, error } = useQuery({
        queryKey: ['clinic-doctors', clinicSlug, filters],
        queryFn: () => ClinicDoctorsAPI.getDoctorsByClinic(clinicSlug, filters),
        enabled: !!clinicSlug
    });

    // Получаем уникальные специальности и процедуры для фильтров
    const { availableSpecialities, availableProcedures } = useMemo(() => {
        if (!data?.results) {
            return { availableSpecialities: [], availableProcedures: [] };
        }

        const specialitiesMap = new Map();
        const proceduresMap = new Map();

        data.results.forEach(doctor => {
            doctor.specialities.forEach(spec => {
                specialitiesMap.set(spec.medical_speciality_id, {
                    id: spec.medical_speciality_id,
                    title: spec.medical_speciality_title
                });
            });

            doctor.procedures.forEach(proc => {
                proceduresMap.set(proc.medical_procedure_id, {
                    id: proc.medical_procedure_id,
                    title: proc.medical_procedure_title
                });
            });
        });

        return {
            availableSpecialities: Array.from(specialitiesMap.values()),
            availableProcedures: Array.from(proceduresMap.values())
        };
    }, [data]);

    const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 0;
    const doctorsCount = data?.count || 0;

    // Обработчик изменения фильтров
    const handleFilterChange = (newFilters: ClinicDoctorsFilters) => {
        setFilters(newFilters);
    };

    // Обработчик для нажатия на номер страницы (с прокруткой)
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setFilters(prev => ({ ...prev, page }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Обработчик для кнопок prev/next (без прокрутки)
    const handlePrevNext = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setFilters(prev => ({ ...prev, page }));
        }
    };

    if (error) {
        return (
            <MaxWidthLayout className="py-8">
                <div className="p-6 bg-red-50 text-red-600 rounded-lg">
                    <h2 className="text-xl font-medium mb-2">Ошибка загрузки врачей</h2>
                    <p>Не удалось загрузить список врачей клиники. Пожалуйста, попробуйте позже.</p>
                </div>
            </MaxWidthLayout>
        );
    }

    return (
        <MaxWidthLayout className="py-8">
            {/* Заголовок секции */}
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">
                    Врачи клиники
                    {doctorsCount > 0 && (
                        <span className="text-emerald-600 ml-2">({doctorsCount})</span>
                    )}
                </h2>
                <p className="text-gray-600">
                    Выберите врача для записи на прием
                </p>
            </div>

            {/* Мобильная версия */}
            <div className="md:hidden space-y-4">
                {/* Фильтры на мобильных */}
                <DoctorsFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    isLoading={isLoading}
                    availableSpecialities={availableSpecialities}
                    availableProcedures={availableProcedures}
                />

                {/* Список врачей */}
                <div className="space-y-4">
                    {isLoading ? (
                        Array.from({ length: PAGE_SIZE }).map((_, i) => (
                            <ClinicDoctorCardSkeleton key={i} />
                        ))
                    ) : data?.results && data.results.length > 0 ? (
                        data.results.map((doctor) => (
                            <ClinicDoctorCard
                                key={doctor.id}
                                id={doctor.id}
                                full_name={doctor.full_name}
                                experience={doctor.experience}
                                categories={doctor.categories}
                                specialities={doctor.specialities.map(s => s.medical_speciality_title)}
                                rating_info={doctor.rating_info}
                                schedule={doctor.schedule}
                                main_photo_url={doctor.main_photo_url}
                            />
                        ))
                    ) : (
                        <div className="text-center py-8 bg-white rounded-lg">
                            <p className="text-gray-500 mb-2">Врачи не найдены</p>
                            <p className="text-sm text-gray-400">
                                Попробуйте изменить параметры фильтрации
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Десктопная версия */}
            <div className="hidden md:flex gap-6">
                {/* Левая панель с фильтрами */}
                <aside className="w-[280px] shrink-0">
                    <DoctorsFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        isLoading={isLoading}
                        availableSpecialities={availableSpecialities}
                        availableProcedures={availableProcedures}
                    />
                </aside>

                {/* Основной контент */}
                <main className="flex-1">
                    <div className="space-y-4">
                        {isLoading ? (
                            Array.from({ length: PAGE_SIZE }).map((_, i) => (
                                <ClinicDoctorCardSkeleton key={i} />
                            ))
                        ) : data?.results && data.results.length > 0 ? (
                            data.results.map((doctor) => (
                                <ClinicDoctorCard
                                    key={doctor.id}
                                    id={doctor.id}
                                    full_name={doctor.full_name}
                                    experience={doctor.experience}
                                    categories={doctor.categories}
                                    specialities={doctor.specialities.map(s => s.medical_speciality_title)}
                                    rating_info={doctor.rating_info}
                                    schedule={doctor.schedule}
                                    main_photo_url={doctor.main_photo_url}
                                />
                            ))
                        ) : (
                            <div className="text-center py-8 bg-white rounded-lg shadow-sm p-8">
                                <p className="text-gray-500 mb-2">Врачи не найдены</p>
                                <p className="text-sm text-gray-400">
                                    Попробуйте изменить параметры фильтрации
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Пагинация */}
            {!isLoading && totalPages > 1 && (
                <DoctorsPagination
                    currentPage={filters.page || 1}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onPrevNext={handlePrevNext}
                />
            )}
        </MaxWidthLayout>
    );
};
