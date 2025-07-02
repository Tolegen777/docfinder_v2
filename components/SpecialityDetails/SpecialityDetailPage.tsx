'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useCityStore } from '@/shared/stores/cityStore';
import {SpecialitiesAPI} from "@/shared/api/specialityApi";
import {UniversalDoctorsList} from "@/shared/ui/UniversalDoctorsList/UniversalDoctorsList";
import {PAGE_SIZE} from "@/shared/constants/common";
import {SpecialityBreadcrumbs} from "@/components/SpecialityDetails/SpecialityBreadcrumbs";

export const SpecialityDetailPage: React.FC = () => {
    const params = useParams();
    const specialitySlug = params?.slug as string;
    const [currentPage, setCurrentPage] = React.useState(1);
    const { currentCity } = useCityStore();

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

    const { data: specialityDetailData } = useQuery({
        queryKey: ['specialityDetail', specialitySlug, currentCity?.id],
        queryFn: () => SpecialitiesAPI.getSpecialityDetails(
            currentCity?.id as number,
            specialitySlug,
        ),
        enabled: !!specialitySlug && !!currentCity?.id,
    });

    return (
        <>
            <SpecialityBreadcrumbs specialityName={specialityDetailData?.medical_speciality_title ?? ''}/>

            <UniversalDoctorsList
                data={data}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                isLoading={isLoading}
            />
        </>
    );
};
