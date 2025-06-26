// components/ClinicDetails/ClinicDoctorsList/ClinicDoctorsList.tsx
'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { ClinicDoctorsAPI, ClinicDoctorsFilters } from '@/shared/api/clinicDoctorsApi';
import { DoctorsFilters } from './DoctorsFilters';
import { MaxWidthLayout } from '@/shared/ui/MaxWidthLayout';
import {PAGE_SIZE} from "@/shared/constants/common";
import {UniversalDoctorsList} from "@/shared/ui/UniversalDoctorsList/UniversalDoctorsList";

export const ClinicDoctorsList = () => {
    const params = useParams();
    const clinicSlug = params?.slug as string;

    const [currentPage, setCurrentPage] = useState(1);

    // Состояние фильтров
    const [filters, setFilters] = useState<ClinicDoctorsFilters>({});

    // Запрос списка врачей
    const { data, isLoading, error } = useQuery({
        queryKey: ['clinic-doctors', clinicSlug, filters, currentPage],
        queryFn: () => ClinicDoctorsAPI.getDoctorsByClinic(clinicSlug, currentPage, PAGE_SIZE, filters),
        enabled: !!clinicSlug
    });

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
                    setCurrentPage={setCurrentPage}
                    isLoading={isLoading}
                />

                {/* Список врачей */}
                <UniversalDoctorsList
                    data={data}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    isLoading={isLoading}
                />
            </div>

            {/* Десктопная версия */}
            <div className="hidden md:flex gap-6">
                {/* Левая панель с фильтрами */}
                <aside className="w-[280px] shrink-0">
                    <DoctorsFilters
                        filters={filters}
                        setCurrentPage={setCurrentPage}
                        onFilterChange={handleFilterChange}
                        isLoading={isLoading}
                    />
                </aside>

                {/* Основной контент */}
                <main className="flex-1">
                    <UniversalDoctorsList
                        data={data}
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                        isLoading={isLoading}
                    />
                </main>
            </div>
        </MaxWidthLayout>
    );
};
