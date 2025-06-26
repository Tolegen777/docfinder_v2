'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useCityStore } from '@/shared/stores/cityStore';
import {SpecialitiesAPI} from "@/shared/api/specialityApi";
import {
    getSpecialityTitleFromSlug
} from "@/components/SpecialityDetails/lib/specialityAdapters";
import {UniversalDoctorsList} from "@/shared/ui/UniversalDoctorsList/UniversalDoctorsList";
import {PAGE_SIZE} from "@/shared/constants/common";

export const SpecialityDetailPage: React.FC = () => {
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

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Врачи специальности: {specialityTitle}</h1>

            <UniversalDoctorsList
                data={data}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                isLoading={isLoading}
            />
        </>
    );
};
